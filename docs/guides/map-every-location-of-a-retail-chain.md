---
sidebar_position: 2
title: Map every location of a retail chain
description: Use the OpenSource Overture Maps API to pull every location of a brand across a country as GeoJSON and drop it on a map — worked example maps all 2,334 Greggs in the UK.
keywords:
  - map every store location
  - retail chain locations api
  - brand locations geojson
  - overture maps brand data
  - open source places api
---

# Map every location of a retail chain

One of the most eye-catching things you can do with the Overture Maps API is put **every location of a brand** on a single map — "all the Greggs in the UK", "every Starbucks in the US", "all the Lidls in Germany". It makes for a great shareable graphic, and it's a five-minute job against the open Overture Maps data.

The running example maps **every Greggs in the UK** — all **2,334** of them at the time of writing. Every step works for any brand and country: swap `brand_name` and `country` for your own.

<img src="/img/greggs-logo.svg" alt="Greggs logo" width="200" />

<sub>Greggs wordmark via [Wikimedia](https://en.wikipedia.org/wiki/File:Greggs2014.svg) (public domain).</sub>

## What you'll build

A single GeoJSON file containing one brand's locations across a whole country, ready to drop straight onto a map (via [geojson.io](https://geojson.io), Leaflet, Mapbox, QGIS — anything that reads GeoJSON).

## Step 1 — Find the brand

Filter places by **`brand_name`** and a country code (ISO 3166-1 alpha-2). Country-level queries need your own API key ([free, takes a minute](https://www.overturemapsapi.com)) — the demo key is limited to nearby lat/lng search. Ask for a single result first to see the shape of the data, and check the `Pagination-Count` header for the total:

```bash
curl -i -H "x-api-key: YOUR-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'brand_name=Greggs' -d 'country=GB' -d 'limit=1'
```

```
Pagination-Count: 2334
```

That header is the total number of matching locations — 2,334 Greggs across the UK — so you know how many you're about to pull.

:::tip Pin to the exact brand with `brand_wikidata`
`brand_name` matches on the brand's name, which is usually exactly what you want. If you need to disambiguate a name shared by more than one company, use **`brand_wikidata`** with the brand's Wikidata QID instead — it matches the precise brand entity rather than a text string. Greggs, for example, is [`Q3403981`](https://www.wikidata.org/wiki/Q3403981).
:::

## Step 2 — Get it as GeoJSON

Add **`format=geojson`** and the response comes back as a standard `FeatureCollection` — every location a `Point` feature with its details in `properties`:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-4.75910491, 55.94903626] },
      "properties": {
        "names": { "primary": "Greggs" },
        "categories": { "primary": "bakery", "alternate": ["sandwich_shop", "fast_food_restaurant"] },
        "websites": ["http://www.greggs.co.uk/"],
        "phones": ["+441475601892"],
        "brand": { "names": { "primary": "Greggs" }, "wikidata": null },
        "addresses": [{ "freeform": "…", "locality": "…", "postcode": "…", "country": "GB" }]
      }
    }
  ]
}
```

Because it's already GeoJSON, most mapping tools will read it with no conversion.

## Step 3 — Pull the whole country

Results are paginated at up to 100 per page (`limit`), with `page` 0-indexed. Drive the loop off the `Pagination-Count` header and collect every feature into one file:

```javascript
import { writeFileSync } from "node:fs";

const base = "https://api.overturemapsapi.com/places";
const params = new URLSearchParams({
  brand_name: "Greggs",
  country: "GB",
  format: "geojson",
  limit: "100",
});

let page = 0;
const features = [];
while (true) {
  const res = await fetch(`${base}?${params}&page=${page}`, {
    headers: { "x-api-key": process.env.OVERTURE_API_KEY },
  });
  const batch = await res.json();
  features.push(...batch.features);

  const total = Number(res.headers.get("Pagination-Count"));
  if (features.length >= total) break;
  page++;
}

writeFileSync(
  "greggs-uk.geojson",
  JSON.stringify({ type: "FeatureCollection", features }),
);
console.log(`Saved ${features.length} locations to greggs-uk.geojson`);
```

At ~100 per page that's 24 requests for the full 2,334 — a few seconds of work.

## Step 4 — Put it on a map

The quickest way to see it: open [geojson.io](https://geojson.io) and drag `greggs-uk.geojson` onto the map. You'll get the whole country dotted with locations, instantly.

To embed it in a page, Leaflet is a couple of lines:

```html
<div id="map" style="height: 600px"></div>
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script>
  const map = L.map("map").setView([54.5, -3], 6); // centre on the UK
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  const data = await fetch("greggs-uk.geojson").then((r) => r.json());
  L.geoJSON(data).bindPopup((l) => l.feature.properties.names?.primary).addTo(map);
</script>
```

## Step 5 — Add brand details (optional)

For chains, add **`enrichment_fields=brand`** to pull the brand's logo, official website, industry and parent company from Wikidata, returned as `ext_brand`:

```json
"ext_brand": {
  "label": "Greggs",
  "logo_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Greggs%20logo.svg",
  "website": "https://www.greggs.co.uk/",
  "industry": "bakery"
}
```

Not every brand has a Wikidata match, so `ext_brand` only appears when Overture can resolve one — handy for badging the map with the official logo, or filling in the brand's canonical website. See [Build a local business directory](./build-a-local-business-directory) for more on the enrichment layer.

## Tips

- **`brand_name` vs `brand_wikidata`**: `brand_name` is the simple, readable filter; `brand_wikidata` pins to the exact brand entity when a name is ambiguous.
- **Coverage varies by market**: well-mapped countries return a fuller set. The `Pagination-Count` header always tells you the true total for your filter before you pull it.
- **Pagination**: drive the loop off `Pagination-Count`, not a fixed page count. See [Pagination](/docs/pagination).
- **Confidence**: add `min_confidence` (default `0.5`) if you want to trade recall for precision on the long tail.

## Publish it

A finished "every X in the country" map is genuinely shareable — it does well on LinkedIn and mapping communities, and it's a natural credit back to the API. Export the GeoJSON (or a CSV with `format=csv`), publish the map, and link the data source. It's one of the cheapest pieces of content you can make and one of the most re-postable.

That's the whole loop: filter by `brand_name` and `country`, pull the country as GeoJSON, and drop it on a map.
