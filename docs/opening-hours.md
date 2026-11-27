---
sidebar_position: 5.2
title: Opening hours
sidebar_label: Opening hours
description: Opening hours on Overture places, in the ext_opening_hours field. Format, coverage by country, how fresh the data is and where it comes from.
---

# Opening hours

Overture places do not carry opening hours, so we add them. Where we know a place's hours, `/places` and `/places/buildings` return them in `ext_opening_hours`. The field is on every plan, including the demo key, with no parameter needed.

```json
{
  "id": "79e7181c-855e-4840-9ef5-3bb004cdc078",
  "properties": {
    "names": { "primary": "Pret A Manger" },
    "ext_opening_hours": "Mo-Fr 06:00-20:00; Sa 07:00-20:00; Su 08:00-19:00"
  }
}
```

When we do not know a place's hours the field is absent. Absent does not mean closed. For that, use [`operating_status`](./api-endpoints/places#operating-status).

## Format

The value is a string in OpenStreetMap's [opening hours syntax](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification), the same format Overture's own schema uses for time restrictions. Times are local to the place.

| Value | Meaning |
| --- | --- |
| `Mo-Fr 09:00-17:00` | Weekdays nine to five, closed at weekends |
| `Mo-Sa 10:00-18:00; Su 11:00-17:00` | Different hours on Sunday |
| `24/7` | Always open |
| `Mo-Th 11:00-23:00; Fr-Sa 11:00-01:00` | Open past midnight on Friday and Saturday |
| `Mo-Fr 08:00-12:00,13:00-18:00` | Closed for lunch |

Libraries that read the format and answer "is it open now?":

- JavaScript: [`opening_hours`](https://www.npmjs.com/package/opening_hours)
- Python: [`opening-hours-py`](https://pypi.org/project/opening-hours-py/)

```js
import OpeningHours from 'opening_hours';

const hours = new OpeningHours(place.properties.ext_opening_hours);
hours.getState();        // true if open now
hours.getNextChange();   // Date of the next opening or closing
```

## Coverage

About 1.8 million places worldwide have opening hours (measured 27 November 2026). They are mostly branches of chains: supermarkets, cafes, restaurants, banks, pharmacies, fuel stations and shops. Independent businesses are mostly not covered yet.

Share of open places with a confidence of 0.5 or more that have opening hours:

| Country | Places with hours | Share |
| --- | --- | --- |
| United States | 610,432 | 3.8% |
| France | 141,687 | 4.2% |
| United Kingdom | 132,795 | 3.4% |
| Germany | 111,369 | 2.4% |
| Japan | 84,940 | 3.0% |
| Poland | 71,809 | 8.3% |
| Italy | 66,020 | 1.9% |
| Canada | 49,845 | 3.6% |
| India | 46,832 | 1.5% |
| Australia | 40,291 | 3.5% |
| Spain | 30,948 | 1.3% |
| South Africa | 26,729 | 5.6% |

Coverage is far higher for chains. Worldwide, 46% of the places Overture marks with a brand have hours (748,367 of 1,641,896).

To pull only branded places, where hours are most likely, filter with `brand_name` or `brand_wikidata`. See [Map every location of a retail chain](./guides/map-every-location-of-a-retail-chain).

## Where the hours come from

The hours are the ones each business publishes on its own website, collected by the open [All The Places](https://www.alltheplaces.xyz/) project and released under CC0. We match each record to an Overture place by its GERS ID.

We would rather leave a place without hours than give it the wrong ones. A record is attached only when it is clearly the same place: the same source record Overture itself used, the same phone number at the same spot, or a near-identical name within 100 metres. One record feeds one place, so a fuel station does not inherit the hours of the supermarket beside it.

## How fresh it is

We refresh the hours once a month, after each Overture release. The source data is collected weekly from the businesses' sites, so a change to a shop's hours can take up to about five weeks to reach the API.

Hours are regular weekly hours. Public holidays and one-off closures are included only where the business publishes them in its regular hours.

## Limits

- **Not every place has hours.** Check that the field is present before using it.
- **The hours can be wrong.** They are as accurate as the business's own website. If you find an error, [tell us](./support).
- **No filter yet.** You cannot search for places that are open now or that have hours. Filter in your own code after fetching.

## Credit

All The Places data is CC0, so no credit is required. We list it, with every other source, on [Data sources and licences](./data-sources).
