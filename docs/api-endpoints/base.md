---
sidebar_position: 8
---

# GET ./base

Land use and land cover polygons from the Overture Maps `base` theme — parks, forests, grass, sand, wetlands, residential/commercial land use and more. Useful for giving your maps geographic context underneath places and buildings.

The endpoint combines the Overture `land_use` and `land_cover` types into one response; each feature carries its `type`, `subtype` and `class` so you can tell them apart.

## Query Parameters

Consult the [Open API documentation](/reference) for the full list of query parameters.

### By Latitude / Longitude / Radius

`lat`, `lng`, `radius` — base features near a location, ordered by distance:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/base' \
-d 'lat=40.7128' -d 'lng=-74.0060' -d 'radius=500'
```

Example response (geometry truncated):

```json
[
  {
    "id": "8739d581-aa1c-3a56-915d-7e1a4d7dce61",
    "geometry": { "type": "Polygon", "coordinates": ["..."] },
    "properties": {
      "theme": "base",
      "type": "land",
      "subtype": "park",
      "class": "park",
      "sources": [{ "dataset": "OpenStreetMap" }]
    }
  }
]
```

### Other Parameters

- `limit` — maximum number of results (default 25000)
- `format` — `json` (default) or `geojson` (drop straight onto a map)
- `includes` — comma-separated list of property fields to keep, for lighter responses

## Use Cases

- Rendering parks, green space and water context around your points of interest
- Land-use classification of an area (residential vs commercial vs industrial)
- Environmental and urban-planning analysis

## Pagination

Supports `limit` + `page` with `Pagination-Count` / `Pagination-Page` / `Pagination-Limit` response headers — see [Pagination](../pagination).

{/* openapi:generated:start */}

## Parameter reference

Generated from the [OpenAPI spec](https://api.overturemapsapi.com/api-docs.json) (operation `searchBaseFeatures`). Find base map features (land use, land cover, water and similar) within `radius` metres of a `lat`/`lng`. A location is required.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `lat` | number |  | Latitude coordinate. Required if country code is not provided. |
| `lng` | number |  | Longitude coordinate. Required if country code is not provided. |
| `radius` | number | `1000` | Search radius in meters, defaulting to 1000 meters if not provided. |
| `limit` | number | `100` | Limit on the number of results returned, defaulting to 100 if not provided. Use `page` to paginate for more. |
| `page` | number | `0` | Page number for pagination (0-indexed), used together with `limit` as the page size. Responses include Pagination-Count (total matching results), Pagination-Page and Pagination-Limit headers. Defaults to 0. |
| `format` | `json`, `csv`, `geojson` | `json` | Response format, defaulting to JSON. Options are "json", "csv", or "geojson". |
| `includes` | list of string (comma-separated) |  | Array of fields to include in the properties field of the response, provided as a comma-separated string. Any fields not in the list will be excluded from the properties object. This is used to make the response lighter so your application is faster. |
| `country` | string |  | ISO 3166 country code consisting of 2 characters. Required if lat/lng are not provided. |

## Python example

```python
import requests

resp = requests.get(
    "https://api.overturemapsapi.com/base",
    headers={"x-api-key": "DEMO-API-KEY"},  # use your own key outside the demo cities
    params={
        "lat": 40.7128,
        "lng": -74.006,
        "radius": 200,
        "limit": 10,
    },
    timeout=30,
)
if resp.status_code == 429:
    raise SystemExit(f"Rate limited, retry in {resp.headers['Retry-After']}s")
resp.raise_for_status()  # 4xx bodies are {"statusCode", "message"}; the message says how to fix the request

results = resp.json()
print(resp.headers.get("Pagination-Count"), "results in total")
for feature in results:
    props = feature["properties"]
    print(props.get("type"), props.get("subtype"), props.get("class"))
```

Results are paginated: pass `page` (0-indexed) and `limit`, and read the total from the `Pagination-Count` header. See [Pagination](/docs/pagination) and [Usage limits](/docs/limits).

{/* openapi:generated:end */}
