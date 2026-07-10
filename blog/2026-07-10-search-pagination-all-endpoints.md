---
title: "Search Pagination Is Live on Every Endpoint"
authors: [adenforshaw]
tags: [endpoints, places, divisions]
---

You can now **page through search results** on every search endpoint — places, buildings, addresses, base, transportation and divisions — with a total match count on every response. No response format changes, no new SDK needed: add one parameter, read three headers.

<!--truncate-->

---

## 📄 How It Works

Add `page` (0-indexed) alongside your existing `limit`, which becomes the page size:

```bash
curl -i -H "x-api-key: YOUR_API_KEY" -X GET -G 'https://api.overturemapsapi.com/divisions' \
-d 'country=US' -d 'name=springfield' -d 'limit=25' -d 'page=1'
```

The response body is the same JSON array (or GeoJSON FeatureCollection) it's always been. The pagination metadata arrives in headers:

```text
Pagination-Count: 56
Pagination-Page: 1
Pagination-Limit: 25
```

`Pagination-Count` is the **total number of results matching your query across all pages** — so you can render "56 results" and build page controls from the very first request, without fetching everything. The headers are CORS-exposed, so they're readable straight from browser JavaScript:

```js
const res = await fetch(url, { headers: { 'x-api-key': KEY } });
const total = Number(res.headers.get('Pagination-Count'));
const pages = Math.ceil(total / limit);
```

---

## 🔒 Stable Pages, Guaranteed

Pagination is only useful if pages don't shift under you. Every paginated query is **deterministically ordered** — by distance with an ID tiebreaker for lat/lng searches, by ID otherwise — so the same query never repeats or skips a result across pages. Page 1 today is page 1 tomorrow (until the monthly Overture data refresh, of course).

---

## 💸 One Query, Not Two

Under the hood the total count comes from a window aggregate in the same BigQuery query that fetches your page — there's no second counting query, so pagination adds no extra scan cost and no extra latency.

---

## ✅ Fully Backwards Compatible

- No `page` parameter? Requests behave exactly as before.
- Response bodies are unchanged on every endpoint.
- The existing `X-Total-Count` header (results in the current response) keeps its old meaning.

This one was a direct customer request — if there's a capability you're missing, [tell us](https://overturemapsapi.com/docs/support) and it may well be the next thing we ship.

---

## 🚀 Try It Now

* Full details: [Pagination docs](https://overturemapsapi.com/docs/pagination)
* Grab a key at the [Overture Maps Developer Portal](https://portal.overturemapsapi.com)
* Browse the [API endpoint docs](https://overturemapsapi.com/docs/category/api-endpoints)
