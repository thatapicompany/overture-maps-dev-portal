---
sidebar_position: 2
---

# GET ./places/brands

Returns every brand (retail chain, franchise, operator) present in the search area, with a count of its places — and, where the brand is linked to Wikidata, its **logo, official website, industry and parent organisation**.

Example Request to GET all Brands in the US:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places/brands'  \
-d 'country=US' 
```

## Brand Details from Wikidata

Brands with a Wikidata QID are automatically enriched — no extra parameters needed:

```json
{
  "names": { "primary": "Bank of America" },
  "wikidata": "Q487907",
  "ext_wikidata_label": "Bank of America",
  "ext_logo_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Bank%20of%20America%20logo.svg",
  "ext_website": "https://www.bankofamerica.com/",
  "ext_industry": "financial sector",
  "counts": { "places": 12 }
}
```

- `ext_logo_url` is a Wikimedia Commons link; append `?width=200` for a resized image, ready for an `<img>` tag
- `ext_parent` names the parent organisation where known
- Wikidata data is CC0 (no attribution required); logo *usage* is subject to normal trademark law
- Fields are simply absent for brands without a Wikidata link

To fetch the places of a specific brand, use `/places` with `brand_wikidata` (preferred) or `brand_name` — see [Places](./places).

{/* openapi:generated:start */}

## Parameter reference

Generated from the [OpenAPI spec](https://api.overturemapsapi.com/api-docs.json) (operation `listPlaceBrands`). List brands (chains) with how many places each has, for a country or a lat/lng area. Use it to find the exact `brand_name` or `brand_wikidata` value to pass to `GET /places`, for example to map every location of a retail chain.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `lat` | number |  | Latitude coordinate. Required if country code is not provided. |
| `lng` | number |  | Longitude coordinate. Required if country code is not provided. |
| `radius` | integer | `1000` | Search radius in meters, defaulting to 1000 meters if not provided. |
| `limit` | integer | `100` | Limit on the number of results returned, defaulting to 100 if not provided. Use `page` to paginate for more. |
| `page` | integer | `0` | Page number for pagination (0-indexed), used together with `limit` as the page size. Responses include Pagination-Count (total matching results), Pagination-Page and Pagination-Limit headers. Defaults to 0. |
| `format` | `json`, `csv`, `geojson` | `json` | Response format, defaulting to JSON. Options are "json", "csv", or "geojson". |
| `includes` | string |  | Array of fields to include in the properties field of the response, provided as a comma-separated string. Any fields not in the list will be excluded from the properties object. This is used to make the response lighter so your application is faster. |
| `country` | string |  | ISO 3166 country code consisting of 2 characters. Required if lat/lng are not provided. |
| `categories` | string |  | Array of category names, provided as a comma-separated string. |

## Python example

```python
import requests

resp = requests.get(
    "https://api.overturemapsapi.com/places/brands",
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
for brand in results:
    name = (brand.get("names") or {}).get("primary")
    if name:  # places without a brand are counted under an empty name
        print(name, brand.get("wikidata"), brand["counts"]["places"])
```

Results are paginated: pass `page` (0-indexed) and `limit`, and read the total from the `Pagination-Count` header. See [Pagination](/docs/pagination) and [Usage limits](/docs/limits).

{/* openapi:generated:end */}
