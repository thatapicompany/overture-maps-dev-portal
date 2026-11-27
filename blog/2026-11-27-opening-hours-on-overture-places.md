---
title: "Opening Hours on Overture Places"
description: "The Overture Maps API now returns opening hours for about 1.8 million places, mostly branches of chains, on every plan. What the field looks like, where the hours come from, how much is covered in each country, and how to answer 'is it open now?'."
authors: [adenforshaw]
tags: [places, endpoints]
image: /img/blog/opening-hours.jpg
---

Overture places don't carry opening hours. It's the first thing people ask us for, so we've added them. From today, `/places` returns **`ext_opening_hours`** for about 1.8 million places worldwide, on every plan, with no extra parameter.

![Five shopfronts on a street map: a cafe, a bakery, a pharmacy, a supermarket and a bank. Three have a clock above them, and one clock glows to show the shop is open](/img/blog/opening-hours.jpg)

<!--truncate-->

## What it looks like

Search for Pret A Manger near Oxford Circus in London:

```bash
curl -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/places' \
-d 'lat=51.5145' -d 'lng=-0.1420' -d 'radius=600' -d 'name_prefix=pret' \
-d 'includes=names,addresses,ext_opening_hours'
```

```json
{
  "id": "bdb8f57c-5ebd-4f16-8a10-2be2716b5319",
  "properties": {
    "names": { "primary": "Pret A Manger" },
    "addresses": [{ "freeform": "18 Hanover St", "locality": "London", "postcode": "W1S 1YN", "country": "GB" }],
    "ext_opening_hours": "Mo-Fr 06:30-20:00; Sa 07:00-20:00; Su 08:00-19:00"
  }
}
```

The value is a string in OpenStreetMap's [opening hours syntax](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification). It's compact, widely supported, and the same format Overture's own schema uses for time restrictions. Times are local to the place.

When we don't know a place's hours, the field is absent. Absent doesn't mean closed.

## How much is covered

About 1.8 million places have hours. They are mostly branches of chains: supermarkets, cafes, restaurants, banks, pharmacies, fuel stations and shops. Worldwide, 46% of the places Overture marks with a brand have them. Independent businesses are mostly not covered yet.

| Country | Places with hours | Share of places |
| --- | --- | --- |
| United States | 610,432 | 3.8% |
| France | 141,687 | 4.2% |
| United Kingdom | 132,795 | 3.4% |
| Germany | 111,369 | 2.4% |
| Japan | 84,940 | 3.0% |
| Poland | 71,809 | 8.3% |
| Canada | 49,845 | 3.6% |
| Australia | 40,291 | 3.5% |

These were measured on 27 November 2026, against open places with a confidence of 0.5 or more. The low overall share is partly what Overture is: about a third of its places in the United States and the United Kingdom are offices and business services, which rarely publish hours at all.

## Where the hours come from

They are the hours each business publishes on its own website, collected by the open [All The Places](https://www.alltheplaces.xyz/) project and released under CC0. We match each record to an Overture place by its GERS ID and refresh the match every month.

Matching is where this kind of data usually goes wrong, so we were strict about it. A record is attached only when it is clearly the same place: the same source record Overture itself used, the same phone number at the same spot, or a near-identical name within 100 metres. We tried looser rules that matched on shared words, and dropped them when about one match in five turned out wrong. The typical mistake was a cash machine given the hours of the bank branch behind it.

One record also feeds only one place. Businesses that share a site often share a phone number, and without that rule a fuel station inherits the hours of the supermarket next door.

The result is fewer places with hours than a looser match would give, and hours you can rely on more.

## Is it open now?

The [`opening_hours`](https://www.npmjs.com/package/opening_hours) package reads the format:

```js
import OpeningHours from "opening_hours";

const res = await fetch(
  "https://api.overturemapsapi.com/places?lat=51.5145&lng=-0.1420&radius=600&brand_name=Pret%20A%20Manger",
  { headers: { "x-api-key": "DEMO-API-KEY" } },
);

for (const place of await res.json()) {
  const hours = place.properties.ext_opening_hours;
  if (!hours) continue; // unknown, not closed
  const open = new OpeningHours(hours).getState();
  console.log(place.properties.names.primary, open ? "open" : "closed");
}
```

In a list or on a map, show "open now" as a badge where you have hours, and leave places without them as they are. Hiding them would hide most independents.

## Things to know

- **`includes` drops it unless you ask.** If you trim responses with `includes`, add `ext_opening_hours` to the list.
- **The hours can be wrong.** They are as accurate as the business's own website. Tell us if you find one.
- **Regular hours only.** Public holidays and one-off closures appear only where the business publishes them in its regular hours.
- **Mind the time zone.** `getState()` uses the clock of the machine running it. For a place in another time zone, pass it the time there.
- **No filter yet.** You can't search for places that are open now. Filter in your own code.
- **It's on every plan,** including the free plan and the demo key, under the usual limits.

The full reference is on the [opening hours page](/docs/opening-hours), and every source we use is listed on [data sources and licences](/docs/data-sources).
