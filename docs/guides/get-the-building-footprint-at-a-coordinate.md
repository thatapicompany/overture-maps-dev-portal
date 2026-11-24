---
sidebar_position: 1.6
title: Get the building footprint and address at a coordinate
description: Look up the Overture building footprint, height, floors and nearest address for any latitude and longitude with two API calls. For roofing, solar, insurance and property tools.
keywords:
  - building footprint api
  - building footprint by lat lng
  - roof area from coordinates
  - overture buildings api
  - address at coordinate
---

# Get the building footprint and address at a coordinate

Property tools often start from one point: a customer's address, a pin on a map, a row in a spreadsheet. From that point you want the outline of the building, how tall it is, and the address on record. This guide does it with two requests.

It suits roofing and solar estimates, insurance and lending checks, delivery and field-service apps, and anything else that needs to know what is built at a location.

## Step 1: fetch the buildings round the point

[`/buildings`](../api-endpoints/buildings) returns footprints near a `lat` and `lng`. Ask for a radius of 100 to 150 metres, not the tightest one you can.

```bash
curl -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/buildings' \
  -d 'lat=40.7486731' -d 'lng=-73.9854953' -d 'radius=150' -d 'limit=200' -d 'format=geojson'
```

:::tip Why not a 20 metre radius?
A radius that falls wholly inside a large building can return nothing, even though you are standing in it. Fetching the neighbours as well and choosing among them, as in step 2, is reliable for buildings of any size and still costs one request.
:::

## Step 2: keep the footprint that contains the point

Each building is a `Polygon` or `MultiPolygon`. The one you want is the one your point falls inside. This runs as it stands on Node 20 or later:

```js
// Which building is at this coordinate?
const KEY = process.env.OVERTURE_API_KEY ?? 'DEMO-API-KEY';
const point = { lat: 40.7486731, lng: -73.9854953 };

const url = new URL('https://api.overturemapsapi.com/buildings');
url.search = new URLSearchParams({ lat: point.lat, lng: point.lng, radius: 150, limit: 200, format: 'geojson' });
const response = await fetch(url, { headers: { 'x-api-key': KEY } });
if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
const { features } = await response.json();

// Ray casting: is the point inside this ring of [lng, lat] pairs?
const inRing = (ring, { lng, lat }) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
// Inside the outer ring and not inside a hole (a courtyard).
const inPolygon = (rings, p) => inRing(rings[0], p) && !rings.slice(1).some((hole) => inRing(hole, p));
const contains = (geometry, p) =>
  geometry.type === 'Polygon' ? inPolygon(geometry.coordinates, p) : geometry.coordinates.some((rings) => inPolygon(rings, p));

const building = features.find((feature) => contains(feature.geometry, point));
console.log(features.length, 'buildings nearby');
console.log(building ? { id: building.id ?? building.properties.id, ...pick(building.properties) } : 'No footprint contains this point');

function pick({ names, class: use, height, num_floors, roof_shape }) {
  return { name: names?.primary ?? null, class: use, height, num_floors, roof_shape };
}
```

Run on 24 November 2026 with the demo key:

```
41 buildings nearby
{
  id: '0e8abfe5-a7f3-4e8e-b6f0-db1fb0bb5b0c',
  name: 'Empire State Building',
  class: 'office',
  height: 443.2,
  num_floors: 102,
  roof_shape: null
}
```

If no footprint contains the point, which happens when a geocoder puts the pin on the street, take the nearest building instead. In Python, [Shapely](https://shapely.readthedocs.io/) does both with `shape(geometry).contains(point)` and `.distance(point)`.

## Step 3: add the address on record

[`/addresses`](../api-endpoints/addresses) returns address points nearest first, so a small radius and `limit=1` gives the closest one:

```bash
curl -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/addresses' \
  -d 'lat=40.7486731' -d 'lng=-73.9854953' -d 'radius=30' -d 'limit=1'
```

```json
{ "number": "2", "street": "W 34 ST", "postcode": "10118", "country": "US", "address_levels": ["NY"] }
```

## What you can work out from it

- **Footprint area.** Project the polygon to a local metric projection and take its area. For a pitched roof the true surface is larger than the footprint, so apply your own pitch factor.
- **Height and floors.** `height` is in metres. `num_floors` is present where a source supplies it.
- **Roof and facade.** `roof_shape`, `roof_material` and `facade_material` are present where a source supplies them.
- **A stable key.** The `id` is the building's GERS ID, which Overture keeps stable across releases. Store it against your own record.

## What to expect from the data

Every building has a footprint. The other properties depend on the sources behind it: within 450 m of St Paul's Cathedral in London, 68 of 376 buildings have a `height` and 217 have `num_floors` (see the [buildings page](../api-endpoints/buildings#whats-in-the-properties)). Footprints come from several sources, listed in each building's `sources`, and vary in precision, so check a sample in your area before quoting from them. Address coverage follows the open address datasets Overture draws on, which are strong in some countries and absent in others.

Each lookup here is two requests. `includes=height,num_floors,class` trims the building response to the properties you use.

## Licence

Buildings are ODbL 1.0 and need an OpenStreetMap credit when you show them. Addresses follow their national sources. The details are in [the data and its licences](/terms#data-licences).
