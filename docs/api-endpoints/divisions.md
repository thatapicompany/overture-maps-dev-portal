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

### By Admin Level

`admin_level` — the division's position in its country's hierarchy: `0` is the country, `1` the first-level subdivision (states/regions), `2` the next (counties), and so on. Comma-separated list. Where subtype naming varies between countries, admin_level gives you a consistent way to say "give me the state-level areas":

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/divisions' \
-d 'country=US' -d 'name=new york' -d 'admin_level=1'
```

That query cleanly returns New York **State** (`admin_level: 1`) rather than the city or its neighborhoods.

Every division response also includes `admin_level`, `is_land`, `is_territorial` and `division_id` (the parent division feature this area belongs to).

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

:::note Geometry fallback
A small number of upstream records (currently the Russia and Australia country land areas) have missing geometry in the source data. For these, the API serves the boundary from the division's sibling area (land + territorial waters) and flags it with `"ext_geometry_source": "maritime"` in the properties — so you always receive a usable boundary. Records with their own geometry are never flagged.
:::

## Pagination

All division searches support `limit` + `page` with `Pagination-Count` / `Pagination-Page` / `Pagination-Limit` response headers — see [Pagination](../pagination).

## Recommended Pattern: Search Box over a Map

1. **Search** as the user types: `GET /divisions?name=...&bbox=<viewport>&limit=10` — fast, metadata-only.
2. **Select**: the chosen result's `bbox` lets you frame the map immediately.
3. **Fetch**: `GET /divisions/{id}` for the full boundary polygon of the selected division only.

{/* openapi:generated:start */}

## Parameter reference

Generated from the [OpenAPI spec](https://api.overturemapsapi.com/api-docs.json) (operation `searchDivisions`). Find countries, regions, localities and neighbourhoods by `name`, `country`, `subtype` or `admin_level`, or those containing or near a `lat`/`lng`. Use it to geocode a place name to a point or boundary before searching `/places`. Name searches omit boundary geometry by default (set `include_geometry=true`, or fetch one area with `GET /divisions/{id}`), because polygons can be megabytes each.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `lat` | number |  | Latitude coordinate. Required if no country, name or bbox filter is provided. |
| `lng` | number |  | Longitude coordinate. Required if no country, name or bbox filter is provided. |
| `radius` | number | `1000` | Search radius in meters, defaulting to 1000 meters if not provided. |
| `limit` | number | `100` | Limit on the number of results returned, defaulting to 100 if not provided. Use `page` to paginate for more. |
| `page` | number | `0` | Page number for pagination (0-indexed), used together with `limit` as the page size. Responses include Pagination-Count (total matching results), Pagination-Page and Pagination-Limit headers. Defaults to 0. |
| `format` | `json`, `csv`, `geojson` | `json` | Response format, defaulting to JSON. Options are "json", "csv", or "geojson". |
| `includes` | list of string (comma-separated) |  | Array of fields to include in the properties field of the response, provided as a comma-separated string. Any fields not in the list will be excluded from the properties object. This is used to make the response lighter so your application is faster. |
| `country` | string |  | ISO 3166 country code consisting of 2 characters. Required if lat/lng are not provided. |
| `name` | string |  | Case-insensitive substring match against the division primary name and English common name. Also matches an exact division ID. |
| `subtype` | list of string (comma-separated) |  | Filter by division subtype, provided as a comma-separated list (e.g. "county,locality"). |
| `admin_level` | string |  | Filter by admin_level — the division's position in its country's hierarchy (0 = country). Provided as a comma-separated list (e.g. "1,2"). |
| `bbox` | string |  | Bounding box filter as "xmin,ymin,xmax,ymax" (lng/lat order). Returns divisions whose bounding box intersects it. |
| `include_geometry` | boolean |  | Whether to include the full polygon geometry in each result. Defaults to false for name searches (fetch geometry via GET /divisions/\{id\}) and true otherwise. Division polygons can be megabytes each, so leave this off for search boxes. |

## Python example

```python
import requests

resp = requests.get(
    "https://api.overturemapsapi.com/divisions",
    headers={"x-api-key": "DEMO-API-KEY"},  # use your own key outside the demo cities
    params={
        "name": "Camden",
        "country": "GB",
        "limit": 5,
    },
    timeout=30,
)
if resp.status_code == 429:
    raise SystemExit(f"Rate limited, retry in {resp.headers['Retry-After']}s")
resp.raise_for_status()  # 4xx bodies are {"statusCode", "message"}; the message says how to fix the request

results = resp.json()
print(resp.headers.get("Pagination-Count"), "results in total")
for area in results:
    props = area["properties"]
    print(area["id"], props["names"]["primary"], props.get("subtype"))
```

Results are paginated: pass `page` (0-indexed) and `limit`, and read the total from the `Pagination-Count` header. See [Pagination](/docs/pagination) and [Usage limits](/docs/limits).

{/* openapi:generated:end */}
