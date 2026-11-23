---
sidebar_position: 7
title: Choose a min_confidence for Overture places
description: Pick the right min_confidence threshold for Overture Maps places. What each threshold keeps and drops, why one address can hold thousands of records, when has_contact helps, and how to remove stacked points. Worked example around Covent Garden, London.
keywords:
  - overture maps confidence score
  - overture places min_confidence
  - filter low confidence places
  - points of interest data quality
  - overture maps places api
---

# Choose a min_confidence for Overture places

Every Overture place carries a `confidence` score between 0 and 1, and `/places` lets you filter on it with `min_confidence`. The hard part is choosing the number. Too low and your map fills with company registrations and stale records. Too high and real restaurants disappear.

This guide measures what each threshold does around **Covent Garden in London**, with real counts from the API, so you can choose with numbers instead of guesswork. London is one of the demo key's cities, so every request below works as written with `DEMO-API-KEY`. No GeoParquet download or DuckDB needed.

![Food and drink places within 250 m of Covent Garden piazza, coloured by confidence: 264 at 0.9 and above, 150 from 0.7 to 0.9, and 68 below 0.7](/img/guides/choose-a-min-confidence-for-overture-places.png)

<sub>482 food and drink places from live `/places` responses within 250 m of Covent Garden piazza, coloured by `confidence`. Map: OpenFreeMap, © OpenMapTiles, data © OpenStreetMap contributors.</sub>

## What you'll build

- a quick way to count results at several thresholds before fetching anything
- a clear picture of what low-confidence records look like, and which real places sit among them
- a small client-side check that removes "stacked" records that share one point
- a threshold choice that fits your feature

## Step 1: Count before you fetch

You don't need to download results to see what a filter does. Ask for `limit=1` and read the `Pagination-Count` header, which holds the total number of matches across all pages:

```bash
curl -s -D - -o /dev/null -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/places' \
-d 'lat=51.5117' -d 'lng=-0.1240' -d 'radius=250' -d 'limit=1' | grep -i pagination-count
```

```
pagination-count: 7091
```

That's 7,091 places within 250 m of the piazza with no filter at all. It looks high for a few streets, and Step 3 explains why. Each count is a normal request and counts towards your [monthly allowance](/docs/limits), but at one result per request it costs very little.

## Step 2: Compare thresholds

Run the same count with different `min_confidence` values, once for every place and once for `taxonomy=food_and_drink`:

| `min_confidence` | All places (250 m) | Food and drink (250 m) |
| --- | --- | --- |
| `0` | 7,489 | 517 |
| not set (default `0.5`) | 7,091 | 482 |
| `0.6` | 2,393 | 433 |
| `0.7` | 1,887 | 414 |
| `0.8` | 1,370 | 307 |
| `0.9` | 1,018 | 264 |
| `0.95` | 682 | 238 |

Three things stand out.

**The default is already 0.5.** Leaving `min_confidence` out gives the same 7,091 as `min_confidence=0.5`. To see the records below 0.5, pass `min_confidence=0` explicitly: that adds 398 places here.

**Most of the drop happens just above 0.5.** `min_confidence=0.51` returns 2,843, so 4,248 of the 7,091 places have a confidence from 0.5 up to 0.51. Within the food and drink results, 42 places score exactly 0.5.

**Categories behave very differently.** Raising the threshold to 0.7 keeps 27% of all places but 86% of food and drink. Here, most of the low scores belong to company registrations rather than venues (Step 3). Check the category you actually care about before choosing a number.

## Step 3: See what low confidence means here

Run a 5 m radius around one point on Shelton Street, a registered-office address that many companies use as their official address:

```bash
curl -s -D - -o /dev/null -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/places' \
-d 'lat=51.5135678' -d 'lng=-0.1242954' -d 'radius=5' -d 'limit=1' | grep -i pagination-count
```

```
pagination-count: 4769
```

4,769 places share that single point. They are company registrations, most often filed as `corporate_or_business_office` or `professional_service`, and a few as bars and coffee shops. In a sample of 250 of them, every one came from a single source, BrightQuery. That one point accounts for 4,769 of the 7,091 places in Step 1. Raising the threshold thins it out but doesn't clear it:

| Filter at the Shelton Street point (5 m) | Places |
| --- | --- |
| none | 4,769 |
| `min_confidence=0.7` | 307 |
| `min_confidence=0.9` | 195 |
| `has_contact=phone,website` | 4,274 |

**`has_contact` doesn't help with this.** Company records usually carry a phone number or website, so 4,274 of the 4,769 pass `has_contact=phone,website`. Across the whole 250 m radius, 6,421 of the 7,091 places do. Use `has_contact` when you need people to be able to reach a place, as in [Build a "what's near me" feature](./build-a-whats-near-me-feature#step-6-only-show-places-people-can-reach), but don't rely on it to remove junk.

## Step 4: Know what you lose

Low confidence doesn't mean fake. Among the 68 food and drink places below 0.7 are well-known restaurants and bars on Henrietta Street and Floral Street, such as Frenchie Covent Garden, The Petersham and Mrs Riot, all scored at 0.5. Raise the threshold to 0.7 and they disappear from your results.

The `sources` array on each place shows why. Of the 68 places below 0.7, 47 come from a single source, BrightQuery. Of the 264 at 0.9 and above, 181 include Meta as a source, 62 of them together with BrightQuery. Here's one, shortened:

```json
"sources": [
  { "property": "", "dataset": "meta", "confidence": 0.9744282364845276 },
  { "property": "/properties/operating_status", "dataset": "BrightQuery", "confidence": null },
  { "property": "/properties/confidence", "dataset": "Overture", "confidence": null }
]
```

That's the record for % Arabica on King Street, which scores 0.999. In practice, a place reported by only one source scores lower even when it is real.

## Step 5: Compare thresholds and remove stacks in code

Two small helpers cover most cases. `compareThresholds` runs the counts from Step 2 for any search. `dropStacks` removes every point that holds more records than a sensible limit, which no `min_confidence` value can do:

```typescript
const API = "https://api.overturemapsapi.com/places";
const KEY = "DEMO-API-KEY"; // use your own key outside the demo cities

async function countPlaces(filters: Record<string, string>): Promise<number> {
  const params = new URLSearchParams({ ...filters, limit: "1" });
  const res = await fetch(`${API}?${params}`, { headers: { "x-api-key": KEY } });
  if (!res.ok) throw new Error(`Count failed: ${res.status} ${await res.text()}`);
  return Number(res.headers.get("Pagination-Count") ?? 0);
}

export async function compareThresholds(
  filters: Record<string, string>,
  thresholds = [0, 0.5, 0.7, 0.9],
): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const t of thresholds) {
    counts[t] = await countPlaces({ ...filters, min_confidence: String(t) });
  }
  return counts;
}

type Feature = {
  geometry: { coordinates: [number, number] };
  properties: { names: { primary: string }; confidence: number; [key: string]: unknown };
};

export function dropStacks(features: Feature[], maxPerPoint = 25): Feature[] {
  const key = (f: Feature) => f.geometry.coordinates.map((c) => c.toFixed(6)).join(",");
  const perPoint = new Map<string, number>();
  for (const f of features) perPoint.set(key(f), (perPoint.get(key(f)) ?? 0) + 1);
  return features.filter((f) => (perPoint.get(key(f)) ?? 0) <= maxPerPoint);
}

const coventGarden = { lat: "51.5117", lng: "-0.1240", radius: "250" };
console.log(await compareThresholds(coventGarden));
// { '0': 7489, '0.5': 7091, '0.7': 1887, '0.9': 1018 }
console.log(await compareThresholds({ ...coventGarden, taxonomy: "food_and_drink" }));
// { '0': 517, '0.5': 482, '0.7': 414, '0.9': 264 }
```

To test `dropStacks`, we fetched all 1,018 places at `min_confidence=0.9` (41 pages of 25 with the demo key, see [Pagination](/docs/pagination)). One point holds 195 of them, the Shelton Street address, and the next busiest point holds 10. `dropStacks(features)` returns 823: everything except that stack. A limit of 25 records per point clears it and leaves busy real buildings alone. Adjust it if you work somewhere with large shopping centres or office towers.

## Step 6: Pick a threshold for your feature

There's no single right number, but the counts above suggest a starting point:

| You're building | Start with | Why |
| --- | --- | --- |
| A consumer map or "near me" list | `taxonomy` filter, default threshold, plus `dropStacks` | Keeps the single-source restaurants people actually visit. Stacks are the main source of noise. |
| A "verified only" view | `min_confidence=0.9` plus `dropStacks` | Fewer, well-confirmed places. Expect real ones to go missing. |
| Lead lists or business counts | `min_confidence=0.7`, then `has_contact` | Removes most company registrations, then keeps businesses you can reach. |
| Coverage or data-quality analysis | `min_confidence=0` | Shows everything, including records below the default 0.5. |

Whichever you choose, run `compareThresholds` on a sample of your own areas first. The share removed varies a lot between categories, and probably between cities too.

## Going further

- **Choose the category filter first.** `taxonomy`, `categories` and `basic_category` change your counts far more than confidence does. See [Filter Overture places by category](./filter-overture-places-by-category).
- **Hide closed places.** `operating_status` is a separate signal from confidence. See [Build a "what's near me" feature](./build-a-whats-near-me-feature#step-5-hide-closed-places).
- **Export what's left.** Once your filters are settled, save the results as GeoJSON or CSV with [Export Overture places to GeoJSON and CSV](./export-overture-places-to-geojson-and-csv).
- **Build a directory.** [Build a local business directory](./build-a-local-business-directory) combines `min_confidence` with contact details and brand data.
- **Every filter.** The full parameter list is on the [Places endpoint page](../api-endpoints/places).
