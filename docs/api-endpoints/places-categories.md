---
sidebar_position: 3
title: "Overture Place Categories API — List POI Categories"
description: "List the place categories available in the Overture Maps dataset for a country, via the REST API."
sidebar_label: "GET /places/categories"
---

# GET ./places/categories


Example Request to GET the Categories of all Brands in the France:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places/categories'  \
-d 'country=FR'
```

## Counts

- `places` - The number of places in the category
- `brands` - The number of brands in the category

## Response Example

```JSON
[{"primary":"beauty_salon","counts":{"places":67490,"brands":227}}]
```

{/* openapi:generated:start */}

## Parameter reference

Generated from the [OpenAPI spec](https://api.overturemapsapi.com/api-docs.json) (operation `listPlaceCategories`). List the place categories present in a country or a lat/lng area, with place and brand counts. Use it to find valid values for the `categories` filter on `GET /places` (for example `cafe`, `pharmacy`, `restaurant`).

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `lat` | number |  | Latitude coordinate. Required if country code is not provided. |
| `lng` | number |  | Longitude coordinate. Required if country code is not provided. |
| `radius` | integer | `1000` | Search radius in meters, defaulting to 1000 meters if not provided. |
| `limit` | integer | `100` | Limit on the number of results returned, defaulting to 100 if not provided. Use `page` to paginate for more. |
| `page` | integer | `0` | Page number for pagination (0-indexed), used together with `limit` as the page size. Responses include Pagination-Count (total matching results), Pagination-Page and Pagination-Limit headers. Defaults to 0. |
| `format` | `json`, `csv`, `geojson` | `json` | Response format, defaulting to JSON. Options are "json", "csv", or "geojson". |
| `includes` | string |  | Array of fields to include in the properties field of the response, provided as a comma-separated string. Any fields not in the list will be excluded from the properties object. This is used to make the response lighter so your application is faster. |
| `country` | string |  | ISO 3166 country code consisting of 2 characters. |

## Python example

```python
import requests

resp = requests.get(
    "https://api.overturemapsapi.com/places/categories",
    headers={"x-api-key": "DEMO-API-KEY"},  # use your own key outside the demo cities
    params={
        "lat": 51.5138,
        "lng": -0.0984,
        "radius": 1000,
        "limit": 20,
    },
    timeout=30,
)
if resp.status_code == 429:
    raise SystemExit(f"Rate limited, retry in {resp.headers['Retry-After']}s")
resp.raise_for_status()  # 4xx bodies are {"statusCode", "message"}; the message says how to fix the request

results = resp.json()
print(resp.headers.get("Pagination-Count"), "results in total")
for category in results:
    print(category["primary"], category["counts"]["places"])
```

Results are paginated: pass `page` (0-indexed) and `limit`, and read the total from the `Pagination-Count` header. See [Pagination](/docs/pagination) and [Usage limits](/docs/limits).

{/* openapi:generated:end */}
