---
sidebar_position: 5
---

# GET ./divisions

Administrative boundaries from the Overture Maps `divisions` theme — countries, regions, counties, localities and neighborhoods, each with a polygon boundary. Search them by name worldwide, filter by subtype, country or bounding box, query around a point, or fetch a single division by ID.

Every result includes `primary_name`, `names` (primary + common names by language), the ISO `country` and `region` codes, and a structured `bbox`.

## Query Parameters

Consult the [Open API documentation](/reference) for the full list of query parameters. Here are the main ones:

### Search by Name

`name` — case-insensitive substring match against the primary name and English common name. Also matches an exact division ID. Minimum 2 characters.

Example: find divisions called Westminster in Great Britain:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/divisions' \
-d 'name=westminster' -d 'country=GB' -d 'limit=10'
```

```json
[
  {
    "id": "531326d0-51f4-4c9e-8af5-d704aeea7830",
    "bbox": { "xmin": -0.2161, "xmax": -0.1111, "ymin": 51.4838, "ymax": 51.5398 },
    "properties": {
      "subtype": "neighborhood",
      "primary_name": "City of Westminster",
      "names": { "primary": "City of Westminster", "common": { "en": "Westminster" } },
      "country": "GB",
      "region": "GB-ENG"
    }
  }
]
```

Name searches return metadata only by default — see [Geometry](#geometry) below.

### By Subtype

`subtype` — comma-separated list of division subtypes to include:

| Subtype | Approx. count | Example |
|---|---|---|
| `locality` | 550k | Paris (the city) |
| `neighborhood` | 320k | SoHo |
| `microhood` | 86k | a sub-neighborhood pocket |
| `macrohood` | 46k | a group of neighborhoods |
| `county` | 40k | San Francisco County |
| `localadmin` | 21k | a local administrative area |
| `region` | 4.7k | California, GB-ENG |
| `country` | 378 | France |
| `dependency` | 105 | Puerto Rico |

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/divisions' \
-d 'name=washington' -d 'subtype=county,locality'
```

### By Bounding Box

`bbox=xmin,ymin,xmax,ymax` (lng/lat order) — only return divisions whose bounding box intersects yours. Ideal for restricting a search to the visible map viewport:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/divisions' \
-d 'name=washington' -d 'subtype=county,locality' -d 'bbox=-125,45,-116,49'
```

### By Latitude / Longitude / Radius

`lat`, `lng`, `radius` — all division areas containing or near a point, ordered by distance. Works exactly as on the other endpoints, and includes each division's polygon geometry:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/divisions' \
-d 'lat=51.5074' -d 'lng=-0.1278' -d 'radius=1000'
```

At least one of `name`, `bbox`, `country` or `lat`/`lng` is required.

## Geometry

Division polygons can be very large — a country outline can run to megabytes of coordinates — so search-style requests keep responses lean:

- `name` searches default to **metadata only** (`include_geometry=false`)
- `lat`/`lng`, `country`-only and `format=geojson` requests include geometry, as they always have
- pass `include_geometry=true` or `include_geometry=false` on any request to override

## GET ./divisions/\{id\}

Fetch a single division area by ID, always including its full polygon geometry:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET \
'https://api.overturemapsapi.com/divisions/531326d0-51f4-4c9e-8af5-d704aeea7830'
```

Returns `404` if the ID is unknown.

## Recommended Pattern: Search Box over a Map

1. **Search** as the user types: `GET /divisions?name=...&bbox=<viewport>&limit=10` — fast, metadata-only.
2. **Select**: the chosen result's `bbox` lets you frame the map immediately.
3. **Fetch**: `GET /divisions/{id}` for the full boundary polygon of the selected division only.
