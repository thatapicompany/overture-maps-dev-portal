---
sidebar_position: 4
title: "Overture Places by Country — List Countries & Place Counts"
description: "List every country in the Overture Maps places dataset and how many places each has, via a simple REST API call."
sidebar_label: "GET /places/countries"
---

# GET ./places/countries


Example Request to GET all the Countries in the Overture Maps Database:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places/countries'
```

## Counts

- `places` - The number of places in the category
- `brands` - The number of brands in the category

## Response Example

example response for the number of places and brands in South Africa:

```JSON
[{"country":"ZA","counts":{"places":67490,"brands":227}}]
```

{/* openapi:generated:start */}

## Parameter reference

Generated from the [OpenAPI spec](https://api.overturemapsapi.com/api-docs.json) (operation `listPlaceCountries`). List the countries that have places, with place and brand counts for each. Use it to check coverage before a country-level search.

This endpoint takes no query parameters.

## Python example

```python
import requests

resp = requests.get(
    "https://api.overturemapsapi.com/places/countries",
    headers={"x-api-key": "DEMO-API-KEY"},  # use your own key outside the demo cities
    timeout=30,
)
if resp.status_code == 429:
    raise SystemExit(f"Rate limited, retry in {resp.headers['Retry-After']}s")
resp.raise_for_status()  # 4xx bodies are {"statusCode", "message"}; the message says how to fix the request

results = resp.json()
print(resp.headers.get("Pagination-Count"), "results in total")
for country in results[:10]:
    print(country["country"], country["counts"]["places"])
```

Results are paginated: pass `page` (0-indexed) and `limit`, and read the total from the `Pagination-Count` header. See [Pagination](/docs/pagination) and [Usage limits](/docs/limits).

{/* openapi:generated:end */}
