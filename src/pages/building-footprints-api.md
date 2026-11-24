---
title: "Building footprints API: outline, height and address for any coordinate"
description: "Get the building footprint, height, floor count and nearest address for any latitude and longitude from Overture Maps open data. One REST call, JSON or GeoJSON. For roofing, solar, insurance and property tools."
---

# Building footprints for any coordinate

Send a latitude and longitude. Get back the outline of the building there, its height and floor count where known, and the address on record. The data is the Overture Maps Foundation's open buildings and addresses themes, served from one hosted API.

```bash
curl -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/buildings' \
  -d 'lat=40.7486731' -d 'lng=-73.9854953' -d 'radius=150' -d 'format=geojson'
```

```json
{
  "id": "0e8abfe5-a7f3-4e8e-b6f0-db1fb0bb5b0c",
  "geometry": { "type": "Polygon", "coordinates": ["..."] },
  "properties": { "names": { "primary": "Empire State Building" }, "class": "office", "height": 443.2, "num_floors": 102 }
}
```

<p>
  <a class="button button--primary button--lg" href="https://app.overturemapsapi.com">Get a free API key</a>{' '}
  <a class="button button--secondary button--lg" href="/docs/guides/get-the-building-footprint-at-a-coordinate">Read the guide</a>
</p>

## What people build with it

- **Roofing and solar estimates.** Take the footprint for a customer's address and work out a roof area before anyone climbs a ladder.
- **Insurance and lending.** Attach footprint size, height and floors to a property record.
- **Field service and delivery.** Show the right building, not a pin in the road.
- **3D maps.** Extrude footprints by height. The [buildings page](/docs/api-endpoints/buildings#draw-buildings-in-3d) has a MapLibre example.

## What comes back

| Field | What it is |
| --- | --- |
| `geometry` | The footprint as a `Polygon` or `MultiPolygon` |
| `height`, `num_floors` | Height in metres and floor count, where a source supplies them |
| `subtype`, `class` | What the building is for, such as `residential` or `office` |
| `roof_shape`, `roof_material`, `facade_material` | Roof and facade details, where known |
| `id` | The building's GERS ID, stable across Overture's monthly releases |
| `sources` | Where each value came from, with its licence |

Addresses come from a second call to [`/addresses`](/docs/api-endpoints/addresses): house number, street, unit, postcode and country for the nearest address points. To get places together with the building they sit in, use [`/places/buildings`](/docs/api-endpoints/places-buildings).

## Honest limits

- Every building has a footprint. Height and floor count are present for some buildings and missing for many. Check your area in the [Explorer](/explorer) first.
- Footprints are outlines seen from above. A roof's true surface depends on its pitch, which you supply.
- Address coverage follows the open address datasets Overture draws on. It is strong in some countries and absent in others.
- There is no owner, valuation or parcel data.

## Pricing and licence

The Free plan covers 100 requests a month for non-commercial projects. Commercial use starts at $25 a month for 1,000 requests. See [pricing](/pricing).

The data stays open. Buildings are ODbL 1.0, and what you retrieve is yours to keep under [Overture's licences](/terms#data-licences) on any plan.

Need footprints for a whole list of coordinates? [Tell us](/contact) what you are working on.
