---
sidebar_position: 7
---

# GET ./transportation

Road, rail and path segments from the Overture Maps `transportation` theme. Each segment is a LineString with a `subtype` (e.g. `road`, `rail`, `water`), a `class` (e.g. `motorway`, `primary`, `footway`, `cycleway`), connector references for routing graphs, and access restrictions where known.

## Query Parameters

Consult the [Open API documentation](/reference) for the full list of query parameters.

### By Latitude / Longitude / Radius

`lat`, `lng`, `radius` — segments near a location, ordered by distance:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/transportation' \
-d 'lat=40.7128' -d 'lng=-74.0060' -d 'radius=500'
```

Example response (geometry truncated):

```json
[
  {
    "id": "5280d450-e605-44dc-afb6-6c4c0ffa960c",
    "geometry": { "type": "LineString", "coordinates": ["..."] },
    "properties": {
      "subtype": "road",
      "class": "footway",
      "connectors": [
        { "connector_id": "896ec260-951e-424b-b730-eb8b5c12f4d7", "at": 0 },
        { "connector_id": "f8e95a2c-cb0c-409c-baaa-a16739203e0e", "at": 1 }
      ],
      "access_restrictions": [{ "access_type": "allowed" }],
      "sources": [{ "dataset": "OpenStreetMap", "license": "ODbL-1.0" }]
    }
  }
]
```

### Other Parameters

- `limit` — maximum number of results (default 25000)
- `format` — `json` (default) or `geojson` (handy for dropping straight onto a map)
- `includes` — comma-separated list of property fields to keep, for lighter responses

## Use Cases

- Drawing the street network around a location
- Walkability / access analysis (footways, cycleways, road classes)
- Seeding a routing graph for a local area using segment connectors

## Pagination

Supports `limit` + `page` with `Pagination-Count` / `Pagination-Page` / `Pagination-Limit` response headers — see [Pagination](../pagination).

{/* openapi:generated:start */}

## Parameter reference

Generated from the [OpenAPI spec](https://api.overturemapsapi.com/api-docs.json) (operation `searchTransportationSegments`). Find road, rail and path segments within `radius` metres of a `lat`/`lng`. A location is required.

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
    "https://api.overturemapsapi.com/transportation",
    headers={"x-api-key": "DEMO-API-KEY"},  # use your own key outside the demo cities
    params={
        "lat": 40.7128,
        "lng": -74.006,
        "radius": 100,
        "limit": 10,
    },
    timeout=30,
)
if resp.status_code == 429:
    raise SystemExit(f"Rate limited, retry in {resp.headers['Retry-After']}s")
resp.raise_for_status()  # 4xx bodies are {"statusCode", "message"}; the message says how to fix the request

results = resp.json()
print(resp.headers.get("Pagination-Count"), "results in total")
for segment in results:
    props = segment["properties"]
    print(props.get("subtype"), props.get("class"), segment["geometry"]["type"])
```

Results are paginated: pass `page` (0-indexed) and `limit`, and read the total from the `Pagination-Count` header. See [Pagination](/docs/pagination) and [Usage limits](/docs/limits).

{/* openapi:generated:end */}
