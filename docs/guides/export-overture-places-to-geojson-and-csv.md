---
sidebar_position: 5
title: Export Overture places to GeoJSON and CSV
description: Save Overture Maps places as a GeoJSON file for QGIS, kepler.gl or geojson.io, and as a CSV for spreadsheets. No GeoParquet downloads, no DuckDB. Worked example with bakeries in Le Marais, Paris.
keywords:
  - overture maps geojson
  - export overture places csv
  - overture places qgis
  - overture maps without duckdb
  - points of interest geojson api
---

# Export Overture places to GeoJSON and CSV

The usual route to an Overture extract is to install DuckDB (or a plugin that needs it), query the GeoParquet files on S3 or Azure, and write the result out. That works, but it is a lot of setup when all you want is "every bakery in this neighbourhood, as a file I can open". With the Overture Maps API it's a few HTTP requests and a short script.

This guide exports every bakery within 800 m of **Place des Vosges in Paris**. Paris is one of the demo key's cities, so everything below runs as written with `DEMO-API-KEY`. Use [your own key](https://account.overturemapsapi.com) to export anywhere else.

![58 bakeries within 800 m of Place des Vosges in Paris, plotted on a map, with a preview of the exported CSV](/img/guides/export-overture-places-to-geojson-and-csv.png)

<sub>The finished export: 58 places from three `/places` pages, saved as GeoJSON and CSV. Map: OpenFreeMap, © OpenMapTiles, data © OpenStreetMap contributors.</sub>

## What you'll build

A small TypeScript script that:

- asks `/places` for GeoJSON instead of plain JSON
- pages through every result, however many pages there are
- trims each place down to the fields you need
- writes `marais-bakeries.geojson` for GIS tools and `marais-bakeries.csv` for spreadsheets

## Step 1: Ask for GeoJSON

Add `format=geojson` to any `/places` search and the response is a GeoJSON `FeatureCollection` instead of a bare array:

```bash
curl -i -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'lat=48.8556' -d 'lng=2.3655' -d 'radius=800' -d 'categories=bakery' \
-d 'format=geojson' -d 'limit=25'
```

```
Pagination-Count: 58
Pagination-Page: 0
Pagination-Limit: 25
```

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "b9458638-3e3d-4dba-961d-b9729f87af59",
      "geometry": { "type": "Point", "coordinates": [2.36470019, 48.85616796] },
      "properties": {
        "names": { "primary": "Patisserie Boulangerie Mr Jacques" },
        "taxonomy": { "primary": "bakery", "hierarchy": ["food_and_drink", "casual_eatery", "bakery"] },
        "websites": ["http://patisseriemrjacques.com/"],
        "phones": ["+33183920019"],
        "addresses": [{ "freeform": "19 Pl. des Vosges", "locality": "Paris", "postcode": "75004", "country": "FR" }]
      }
    }
  ]
}
```

(Properties shortened here.) `Pagination-Count` tells you the total before you fetch anything else: 58 bakeries in this search. The same `format=geojson` works on [`/buildings`](../api-endpoints/buildings) and [`/transportation`](../api-endpoints/transportation), so the rest of this guide applies to footprints and street segments too.

## Step 2: Page through everything

One request returns one page. With 58 results and the demo key's page size of 25 (the demo key returns at most 25 per page, whatever `limit` you send), that's three pages: 25, 25 and 8. Keep requesting `page=0`, `page=1` and so on until you have `Pagination-Count` features. See [Pagination](/docs/pagination) for the details.

```typescript
type Feature = {
  type: "Feature";
  id: string;
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: Record<string, any>;
};
type FeatureCollection = { type: "FeatureCollection"; features: Feature[] };

const API = "https://api.overturemapsapi.com/places";
const KEY = process.env.OVERTURE_API_KEY ?? "DEMO-API-KEY";

async function exportPlaces(filters: Record<string, string>): Promise<FeatureCollection> {
  const features: Feature[] = [];
  let total = Infinity;

  for (let page = 0; features.length < total; page++) {
    const params = new URLSearchParams({ ...filters, format: "geojson", page: String(page) });
    const res = await fetch(`${API}?${params}`, { headers: { "x-api-key": KEY } });
    if (!res.ok) throw new Error(`Page ${page} failed: ${res.status} ${await res.text()}`);

    total = Number(res.headers.get("Pagination-Count") ?? 0);
    const batch = (await res.json()) as FeatureCollection;
    if (batch.features.length === 0) break; // nothing left
    features.push(...batch.features);
  }

  return { type: "FeatureCollection", features };
}
```

The result is one `FeatureCollection` holding every page, ready to save. Every page is a normal request and counts towards your [monthly allowance](/docs/limits), so check `Pagination-Count` with a single small request before you export something large.

## Step 3: Keep only the fields you need

A full place record carries sources, version numbers, brand objects and more. For an export you usually want a handful of fields. `includes` returns only the properties you list:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'lat=48.8556' -d 'lng=2.3655' -d 'radius=800' -d 'categories=bakery' \
-d 'format=geojson' -d 'limit=25' -d 'includes=names,taxonomy,addresses,websites,phones'
```

For this first page of 25 bakeries, the response drops from 31,022 bytes to 12,895. Each feature keeps its `id` and `geometry`. Properties with no value are left out, so don't assume every key is present.

## Step 4: Write GeoJSON and CSV files

GeoJSON can be saved as it comes. For a CSV, flatten each feature into one row: name, category, coordinates, the first address, website and phone. The API returns JSON and GeoJSON, so do this conversion on your side. (`format=csv` appears in the OpenAPI reference, but in our tests it currently returns JSON.)

```typescript
import { writeFile } from "node:fs/promises";

const COLUMNS = ["id", "name", "category", "lat", "lng", "address", "postcode", "website", "phone"] as const;

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function toCsv(fc: FeatureCollection): string {
  const rows = fc.features.map(({ id, geometry, properties: p }) => {
    const [lng, lat] = geometry.coordinates;
    const address = p.addresses?.[0];
    return [
      id,
      p.names?.primary,
      p.taxonomy?.primary,
      lat,
      lng,
      address?.freeform,
      address?.postcode,
      p.websites?.[0],
      p.phones?.[0],
    ].map(csvCell).join(",");
  });
  return [COLUMNS.join(","), ...rows].join("\n") + "\n";
}

const places = await exportPlaces({
  lat: "48.8556",
  lng: "2.3655",
  radius: "800",
  categories: "bakery",
  limit: "25",
  includes: "names,taxonomy,addresses,websites,phones",
});

await writeFile("marais-bakeries.geojson", JSON.stringify(places));
await writeFile("marais-bakeries.csv", toCsv(places));
console.log(`Saved ${places.features.length} places`);
```

Put Steps 2 and 4 in one file called `export-places.mts` (the `.mts` extension lets Node treat it as a module, so top-level `await` works) and run it with Node 20 or later:

```bash
npx tsx export-places.mts
# Saved 58 places
```

GeoJSON coordinates are `[lng, lat]`, which is why the code swaps them into separate `lat` and `lng` columns. The first rows of the CSV:

```
id,name,category,lat,lng,address,postcode,website,phone
b9458638-3e3d-4dba-961d-b9729f87af59,Patisserie Boulangerie Mr Jacques,bakery,48.85616796,2.36470019,19 Pl. des Vosges,75004,http://patisseriemrjacques.com/,+33183920019
fc8df7d3-3e70-41f9-abb5-a3ccb7b2c127,Boulangerie de la Place des Vosges Paris 03,bakery,48.85603,2.36711,6 Rue du Pas-de-la-Mule,75003,,+33157408385
4e1b71a1-e07a-411e-97ae-7ca607f7f9b4,Lolilol Chimney Cake,bakery,48.85580915,2.36374267,19 Rue de Turenne,75004,http://lolilolchimneycake.com/,+33782813550
```

Of the 58 bakeries, 47 have a website and 55 have a phone number. The `id` column is each place's [GERS](https://docs.overturemaps.org/gers/) ID, so you can join the export back to Overture data later.

## Step 5: Open the files

- **QGIS**: drag `marais-bakeries.geojson` onto the map canvas, or use Layer → Add Layer → Add Vector Layer. No plugin and no DuckDB needed.
- **geojson.io or kepler.gl**: drop the GeoJSON file onto the page to see the points on a map.
- **Excel, Numbers or Google Sheets**: open or import `marais-bakeries.csv`. Postcodes and phone numbers are plain text in the file, but some spreadsheet apps reformat them on import, so set those columns to text if leading zeros matter.

## Going further

- **Export a different slice.** Swap `categories=bakery` for any other filter on [`/places`](../api-endpoints/places): `taxonomy=food_and_drink` for every place to eat and drink, `brand_name` for one chain (see [Map every location of a retail chain](./map-every-location-of-a-retail-chain)), or `has_contact=website` to keep only places with a website.
- **Find what's worth exporting.** [Profile a neighbourhood](./profile-a-neighbourhood) uses `/places/categories` to count every category in a radius first.
- **Export footprints instead of points.** [`/buildings`](../api-endpoints/buildings) takes the same `format=geojson`, `includes` and paging.
- **Whole countries.** On a paid plan, replace `lat`, `lng` and `radius` with `country` plus a narrowing filter, and use a larger `limit`. See [Usage limits](/docs/limits).
