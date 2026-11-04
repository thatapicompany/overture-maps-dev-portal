---
title: "Joining Overture Places to Google Place IDs"
description: "Add a thin layer over the Overture Maps API that matches each place's GERS ID to a Google place ID, caches the match, and returns it alongside the Overture data. Tested on 120 Sydney places, from cafés to every Woolworths within 25 km to the Opera House. Part 1 of a series on joining Overture places to third-party services."
authors: [adenforshaw]
tags: [places, gcp]
image: /img/blog/gers-google-join.jpg
---

Every place in the Overture Maps API has a **GERS ID**, Overture's stable identifier. It's the right key for your own database, and it's openly licensed. But your users, partners and other tools often speak Google: an "open in Google Maps" button, a booking link, a CRM record that already holds a Google place ID.

This post builds a small layer over the API that adds a `google_place_id` to each Overture place. We tested it on 120 places across Sydney, and it matched 114. It's the first in a series on joining Overture places to third-party services. Tripadvisor and Yelp come next.

![Two stacked map layers over Sydney Harbour, with lines joining each place on the lower Overture layer to its match on the layer above](/img/blog/gers-google-join.jpg)

<!--truncate-->

## What you're allowed to keep

Read this before writing any code, because it decides the design. Google's [Maps Service Specific Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms) let you cache **place IDs** without a time limit, but only cache Google's latitude and longitude for 30 days, and not other Places content such as names, addresses, ratings or reviews. They also say Places content must not be used with a non-Google map.

So the layer keeps exactly one thing from Google, the place ID. Everything else in a stored match is yours, and the place data your app shows still comes from Overture.

| Stored | Source |
| --- | --- |
| `gers_id` | Overture |
| `google_place_id` | Google (cacheable) |
| `score`, `matched_at` | Computed by you |

If you later use the place ID to fetch Google content such as ratings, show it on a Google map.

## How the join works

Overture doesn't carry Google IDs, so the match runs one way: for each Overture place, ask Google who's there, then decide whether the best answer is the same place.

1. Fetch places from `/places` as usual.
2. For each place without a cached match, call Google's [Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search) with the Overture name and address, biased to a 100 m circle around the Overture point.
3. Score the candidates on name, distance and street address. Keep the best one if it clears a threshold. If nothing does, retry once on the name alone.
4. Cache the result against the GERS ID, misses included, and add it to the response.

## Step 1: Overture places

```typescript
async function fetchOverturePlaces(params: Record<string, string>): Promise<OverturePlace[]> {
  const res = await fetch(`https://api.overturemapsapi.com/places?${new URLSearchParams(params)}`, {
    headers: { "x-api-key": process.env.OVERTURE_API_KEY ?? "DEMO-API-KEY" },
  });
  if (!res.ok) throw new Error(`Overture ${res.status}`);
  return res.json();
}

// e.g. every Woolworths within 25 km of Sydney CBD
const places = await fetchOverturePlaces({
  lat: "-33.8688", lng: "151.2093", radius: "25000", brand_name: "Woolworths", limit: "100",
});
```

## Step 2 and 3: match each place

The field mask controls what Google bills you for. `places.id` alone is the cheapest Text Search tier, but then you have nothing to check the match against. We ask for `displayName`, `location` and `formattedAddress`, which all sit in the Text Search Pro tier, and use them only to score the candidates. Check current rates on Google's [Places SKU page](https://developers.google.com/maps/billing-and-pricing/sku-details/places).

The score is 70% name similarity and 30% distance, plus a bonus when both sides agree on the street number and street name. Each part is there because the first version got something wrong, as the results below show.

```typescript
export type OverturePlace = {
  id: string; // GERS ID
  geometry: { coordinates: [number, number] }; // [lng, lat]
  properties: {
    names: { primary: string };
    addresses?: { freeform?: string; locality?: string }[];
  };
};
type GoogleCandidate = {
  id: string;
  displayName?: { text: string };
  location?: { latitude: number; longitude: number };
  formattedAddress?: string;
};
export type Match = {
  gers_id: string;
  google_place_id: string | null;
  score: number;
  matched_at: string;
};

async function googleCandidates(textQuery: string, lat: number, lng: number): Promise<GoogleCandidate[]> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY!,
      // All four fields bill at the Text Search Pro rate
      "X-Goog-FieldMask": "places.id,places.displayName,places.location,places.formattedAddress",
    },
    body: JSON.stringify({
      textQuery,
      pageSize: 3,
      locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: 100 } },
    }),
  });
  if (!res.ok) throw new Error(`Google ${res.status}: ${await res.text()}`);
  return ((await res.json()).places ?? []) as GoogleCandidate[];
}

const normalise = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

// Dice coefficient on character bigrams, forgiving of small spelling differences
function dice(a: string, b: string): number {
  const grams = (s: string) => {
    const t = normalise(s).replace(/ /g, "");
    const m = new Map<string, number>();
    for (let i = 0; i < t.length - 1; i++) m.set(t.slice(i, i + 2), (m.get(t.slice(i, i + 2)) ?? 0) + 1);
    return m;
  };
  const A = grams(a), B = grams(b);
  let overlap = 0, total = 0;
  for (const [g, n] of A) { overlap += Math.min(n, B.get(g) ?? 0); total += n; }
  for (const n of B.values()) total += n;
  return total === 0 ? 0 : (2 * overlap) / total;
}

// "Woolworths" and "Woolworths Bondi Beach": every word of the shorter name is in the longer one
function nameSimilarity(a: string, b: string): number {
  const ta = normalise(a).split(" "), tb = normalise(b).split(" ");
  const [short, long] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  const contained = short.every((t) => long.includes(t));
  return contained ? Math.max(dice(a, b), 0.9) : dice(a, b);
}

// Same street number and street name in both addresses, e.g. "100 Miller St"
function sameStreetAddress(overture: string | undefined, google: string | undefined): boolean {
  if (!overture || !google) return false;
  const m = normalise(overture).match(/(\d+[a-z]?)\s+([a-z]{3,})/);
  if (!m) return false;
  const g = normalise(google);
  return new RegExp(`\\b${m[1]}\\b`).test(g) && g.includes(m[2]);
}

function metresBetween(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000, rad = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const MATCH_THRESHOLD = 0.75;

function best(place: OverturePlace, candidates: GoogleCandidate[]) {
  const [lng, lat] = place.geometry.coordinates;
  const address = place.properties.addresses?.[0]?.freeform;
  let top: { c: GoogleCandidate; score: number } | null = null;
  for (const c of candidates) {
    if (!c.displayName || !c.location) continue;
    const name = nameSimilarity(place.properties.names.primary, c.displayName.text);
    const d = metresBetween(lat, lng, c.location.latitude, c.location.longitude);
    const near = d <= 25 ? 1 : Math.max(0, 1 - (d - 25) / 225); // full marks inside 25 m, none past 250 m
    const bonus = sameStreetAddress(address, c.formattedAddress) ? 0.15 : 0;
    const score = Math.min(1, 0.7 * name + 0.3 * near + bonus);
    if (!top || score > top.score) top = { c, score };
  }
  return top;
}

export async function matchPlace(place: OverturePlace): Promise<Match> {
  const [lng, lat] = place.geometry.coordinates;
  const name = place.properties.names.primary;
  const a = place.properties.addresses?.[0];
  const withAddress = [name, a?.freeform, a?.locality].filter(Boolean).join(", ");

  let top = best(place, await googleCandidates(withAddress, lat, lng));
  // A wrong address in the source data sends the search to the wrong place: retry on the name alone
  if ((!top || top.score < MATCH_THRESHOLD) && withAddress !== name) {
    const retry = best(place, await googleCandidates(name, lat, lng));
    if (retry && (!top || retry.score > top.score)) top = retry;
  }

  const ok = !!top && top.score >= MATCH_THRESHOLD;
  // Google's name, address and coordinates are discarded here: only the place ID is kept
  return {
    gers_id: place.id,
    google_place_id: ok ? top!.c.id : null,
    score: Number((top?.score ?? 0).toFixed(2)),
    matched_at: new Date().toISOString(),
  };
}
```

The weights and the 0.75 threshold come from our Sydney sample. Run the matcher over a few hundred places in your own area, look at the scores just above and below the line, and move it until the mistakes stop.

## Step 4: the layer

The layer is a small service in front of `/places`. It passes your query through, looks up each GERS ID in a cache, matches only the places it hasn't seen before, and returns the Overture response with the match added. We run ours on Cloud Run with Firestore as the cache, but any key-value store works.

```typescript
import { Firestore } from "@google-cloud/firestore";

const matches = new Firestore().collection("gers_google_matches");

export async function placesWithGoogleIds(params: Record<string, string>) {
  const places = await fetchOverturePlaces(params);
  const refs = places.map((p) => matches.doc(p.id));
  const cached = refs.length ? await matches.firestore.getAll(...refs) : [];

  return Promise.all(places.map(async (place, i) => {
    let match = cached[i]?.exists ? (cached[i].data() as Match) : null;
    if (!match) {
      match = await matchPlace(place);
      await refs[i].set(match); // misses are cached too, so you only pay once per place
    }
    return {
      ...place,
      properties: {
        ...place.properties,
        ext_google_place_id: match.google_place_id,
        ext_google_match_score: match.score,
      },
    };
  }));
}
```

Before production:

- **Limit concurrency.** A first request for a busy area can trigger many Google calls at once. Cap parallel matches with p-limit or a Cloud Tasks queue, and stay inside Google's quota.
- **Re-match on a schedule.** Overture places can be merged or split between releases, and Google place IDs can change too. Keep `matched_at`, re-check old matches, and re-run misses after each Overture release.
- **Backfill in batches.** For a whole city, page through `/places` once and run the matcher as a batch job rather than on the request path.

## Results

We ran the final matcher over three Sydney samples:

| Sample | Places | Matched | No match |
| --- | --- | --- | --- |
| Cafés within 400 m of Martin Place | 10 | 7 | 3 |
| Every Woolworths within 25 km of the CBD (`brand_name=Woolworths`) | 94 | 92 | 2 |
| Landmarks, from the Opera House to Manly Beach | 16 | 15 | 1 |
| **Total** | **120** | **114** | **6** |

We checked every match by hand against Google's listing. Two need a closer look: Woolworths Thornleigh and Woolworths Mona Vale matched at 45 m and 69 m with different street addresses on each side, which looks like one store with entrances on two streets. We couldn't confirm that from the data alone.

### What the first version got wrong

The first version scored on name and distance only, and it matched 75 of the 94 Woolworths. Every miss was a real store sitting at the address Overture gave, rejected because the names differed:

- **Chains name branches differently.** Overture often has a bare "Woolworths" where Google has "Woolworths Bondi Beach". Character similarity marks that down, so the matcher now treats a name as a strong match when every word of the shorter one appears in the longer.
- **Sub-brands don't survive.** Overture's "Woolworths Metro" at 100 Miller St is Google's "Woolworths North Sydney" at 100 Miller St. No name rule fixes that without being too loose, but the street address settles it, so matching street numbers and names now earns a bonus.

With both fixes, Woolworths went from 75 to 92 matches. Apart from Thornleigh and Mona Vale, all 17 new matches checked out, although two of them are Woolworths customer fulfilment centres in Brookvale and Auburn rather than shops. Overture files them as grocery stores like the rest, so check for them if you only want stores people can walk into.

The landmarks found a third problem. Overture's Sydney Cricket Ground record has a real estate agency's address attached, so searching by name and address returned the agency. If nothing clears the threshold, the matcher now retries on the name alone. That found the SCG 4 m from the Overture point.

### The six that didn't match

All six were correct to reject on the evidence:

- **Fossix Coffee:** Google's result at 130 Pitt St is a different café, Leible Coffee. Fossix itself is listed at 56 Pitt St. A distance-only matcher would have joined two different businesses.
- **Taste Baguette:** the name matches exactly, but Google's listing is about 300 m from the Overture point.
- **Chrysler Cafe & Bar:** Google has it at 137 Castlereagh St. Overture has it at 400 George St.
- **Woolworths, 351 Stoney Creek Rd:** Google lists an Ampol Foodary at that address. The nearest Woolworths it offered was elsewhere in Kingsgrove.
- **Woolworths, 181 The River Rd:** the nearest Google Woolworths is 599 m away in Revesby.
- **Sydney Fish Market:** same name and street, but 372 m apart. This one needs a human to decide.

### Two more things to watch

**Duplicates.** Overture has two records for the Woolworths at 355 Waterloo Rd, Chullora, and both matched the same Google place ID. Matching to Google turns out to be a cheap duplicate detector: if two GERS IDs share a place ID, check them.

**A match doesn't mean the place is open.** Google lists two of the matched cafés, Max Brenner - Centrepoint and Muffin Break Sydney Central, as permanently closed. Google's terms don't let you copy its content into your own dataset, so don't write that status back. But if your app links out to Google, expect some links to land on closed listings. Overture's [operating status](./2026-07-08-places-taxonomy-operating-status-and-divisions-admin-level.md) is the place to handle closures in your own data.

## What it costs

On the Overture side, each `/places` call counts as one request against your [monthly allowance](/docs/limits), whether or not the layer adds Google IDs. On the Google side you pay for one Text Search per new place, or two when the name-only retry runs, and then nothing, because the cache answers every later request. The 110 Woolworths and landmark places took 114 Google calls. Cost grows with the number of distinct places you touch, not with your traffic.

## Next in the series

Part 2 joins the same GERS IDs to Tripadvisor locations for reviews, and part 3 covers Yelp. Each starts with a "what you're allowed to keep" section, because every provider draws that line differently.

`DEMO-API-KEY` works near New York, London, Paris and Sydney, so the Overture half of this runs as written. For anywhere else, [get a free API key](https://account.overturemapsapi.com).
