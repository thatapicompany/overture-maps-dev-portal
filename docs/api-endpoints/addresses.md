---
sidebar_position: 6
---

# GET ./addresses

Point addresses from the Overture Maps `addresses` theme — street number, street, unit, postcode and country for hundreds of millions of address points, sourced from open government address datasets such as OpenAddresses.

## Query Parameters

Consult the [Open API documentation](/reference) for the full list of query parameters.

### By Latitude / Longitude / Radius

`lat`, `lng`, `radius` — address points near a location, ordered by distance:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/addresses' \
-d 'lat=40.7128' -d 'lng=-74.0060' -d 'radius=200'
```

Example response:

```json
[
  {
    "id": "90abd8ae-ed7f-41fd-b083-374ff701b2ce",
    "geometry": { "type": "Point", "coordinates": [-74.0059, 40.7127] },
    "properties": {
      "number": "254",
      "street": "BROADWAY",
      "unit": null,
      "postcode": "10007",
      "country": "US",
      "address_levels": ["NY", "New York"],
      "sources": [{ "dataset": "OpenAddresses/NY/NYC Open Data" }]
    }
  }
]
```

### Other Parameters

- `limit` — maximum number of results (default 25000)
- `format` — `json` (default) or `geojson`
- `includes` — comma-separated list of property fields to keep, for lighter responses

## Use Cases

- Reverse lookup: "what addresses are at/near this point?"
- Address density and delivery-area analysis
- Validating or enriching your own address data against open sources

## Pagination

Supports `limit` + `page` with `Pagination-Count` / `Pagination-Page` / `Pagination-Limit` response headers — see [Pagination](../pagination).

{/* openapi:generated:start */}

## Parameter reference

Generated from the [OpenAPI spec](https://api.overturemapsapi.com/api-docs.json) (operation `searchAddresses`). Find address points within `radius` metres of a `lat`/`lng`. A location is required. Use it for address lookup, validation or reverse geocoding.

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
    "https://api.overturemapsapi.com/addresses",
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
for address in results:
    props = address["properties"]
    print(props.get("number"), props.get("street"), props.get("postcode"))
```

Results are paginated: pass `page` (0-indexed) and `limit`, and read the total from the `Pagination-Count` header. See [Pagination](/docs/pagination) and [Usage limits](/docs/limits).

{/* openapi:generated:end */}
