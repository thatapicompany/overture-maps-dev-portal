---
sidebar_position: 4
---

# Pagination

All search endpoints (`/places`, `/places/buildings`, `/buildings`, `/addresses`, `/base`, `/transportation`, `/divisions`) support pagination via two query parameters:

- **`limit`** — the page size (max 25,000)
- **`page`** — the page number, 0-indexed, defaulting to `0`

Response **bodies are unchanged** — you get the same JSON array (or GeoJSON FeatureCollection) as always. Pagination metadata travels in response headers:

| Header | Meaning |
|---|---|
| `Pagination-Count` | Total results matching the query, across **all** pages |
| `Pagination-Page` | The page served (0-indexed) |
| `Pagination-Limit` | The page size used |
| `X-Total-Count` | Number of results in *this* response |

The `Pagination-*` headers are exposed via CORS, so they are readable from browser JavaScript.

## Example

Page through every division called Springfield in the US, 25 at a time:

```bash
curl -i -H "x-api-key: YOUR_API_KEY" -X GET -G 'https://api.overturemapsapi.com/divisions' \
-d 'country=US' -d 'name=springfield' -d 'limit=25' -d 'page=0'
```

```text
HTTP/2 200
Pagination-Count: 56
Pagination-Page: 0
Pagination-Limit: 25
```

`Pagination-Count: 56` with a page size of 25 means three pages (`page=0`, `page=1`, `page=2`).

## Guarantees

- **Stable, disjoint pages**: results are deterministically ordered (by distance with an ID tiebreaker for lat/lng queries, by ID otherwise), so the same query never repeats or skips a result across pages.
- **Backwards compatible**: requests without a `page` parameter behave exactly as before.
- **Counts are totals**: `Pagination-Count` is the number of results matching your filters across all pages — handy for rendering result counts and page controls without fetching everything.

:::tip
For very large exports (beyond 25,000 × pages), [contact us](./support) about bulk data delivery instead of paging through everything.
:::
