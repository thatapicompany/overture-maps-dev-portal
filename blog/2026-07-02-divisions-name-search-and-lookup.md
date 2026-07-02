---
title: "Divisions API Upgrade: Search by Name, Filter by Viewport, Fetch by ID"
authors: [adenforshaw]
tags: [endpoints, divisions]
---

The `/divisions` endpoint just got its biggest upgrade yet. You can now **search administrative areas by name** — countries, regions, counties, cities, neighborhoods — **filter by subtype and map viewport**, and **fetch any division's full polygon by ID**. Searches cover all 1M+ Overture division areas worldwide and typically return in well under a second, making them fast enough to power a live search box.

<!--truncate-->

---

## 🔍 Search Divisions by Name

Pass a `name` parameter to search every division area on the planet. Matching is case-insensitive and works as a substring against both the primary name and the English common name — so `name=westminster` finds "City of Westminster". Passing a full division ID as the `name` also works, for exact lookups.

```bash
curl "https://api.overturemapsapi.com/divisions?name=westminster&country=GB&limit=10" \
  -H "x-api-key: YOUR_API_KEY"
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

Every division result now **always** includes `primary_name`, `names`, the ISO `country` and `region` codes, and a structured `bbox` — no more deriving a bounding box from geometry, and no more missing name fields.

---

## 🎯 Narrow It Down: Subtype and Viewport Filters

Name search combines with three server-side filters, so you only get the divisions your app actually cares about:

* **`country=GB`** — ISO 3166 country code.
* **`subtype=county,locality`** — comma-separated list of division subtypes (`country`, `region`, `county`, `locality`, `neighborhood`, ...).
* **`bbox=xmin,ymin,xmax,ymax`** — only return divisions whose bounding box intersects yours. Perfect for restricting a search to the current map viewport.

```bash
# "washington" as a county or locality, within the north-west USA viewport
curl "https://api.overturemapsapi.com/divisions?name=washington&subtype=county,locality&bbox=-125,45,-116,49" \
  -H "x-api-key: YOUR_API_KEY"
```

When you provide a `name`, `bbox`, or `country`, the `lat`/`lng` parameters are no longer required — they're still there for radius-based queries, which work exactly as before.

---

## 📦 Lean Responses by Default

Division polygons are big — a country outline can be megabytes of coordinates. A search box asking for 10 suggestions shouldn't download 50MB of geometry to render a dropdown.

So name searches now return **metadata only** by default: everything above, minus the polygon. You control this explicitly with the new `include_geometry` parameter:

* `name` searches default to `include_geometry=false`
* lat/lng, country, and `format=geojson` requests keep including geometry, exactly as they always have
* pass `include_geometry=true` on any request to force polygons on

---

## 🆔 Fetch a Single Division by ID

New endpoint: `GET /divisions/{id}` returns one division area with its **full polygon geometry**.

```bash
curl "https://api.overturemapsapi.com/divisions/531326d0-51f4-4c9e-8af5-d704aeea7830" \
  -H "x-api-key: YOUR_API_KEY"
```

The recommended pattern for pickers and map editors:

1. **Search** — `GET /divisions?name=...&bbox=<viewport>` as the user types (lean, fast).
2. **Select** — the user picks a result; you already have its name, codes and bbox to frame the map.
3. **Fetch** — `GET /divisions/{id}` for the full boundary polygon, only for the one they chose.

---

## ⚡ Under the Hood

Division searches are served from an in-memory search index covering every Overture division area, refreshed automatically with each monthly Overture release. That's what makes global text search fast enough for interactive use — the search itself completes in milliseconds, and most end-to-end requests finish in well under a second.

Radius (`lat`/`lng`) queries and geometry fetches use the same battle-tested pipeline as before, with 24-hour result caching.

---

## 🚀 Try It Now

All of this is live today on your existing API keys — no changes needed:

* Grab a key at the [Overture Maps Developer Portal](https://portal.overturemapsapi.com)
* Browse the [API endpoint docs](https://overturemapsapi.com/docs/category/api-endpoints)
* Questions or a use case we should support next? [Get in touch](https://overturemapsapi.com/docs/support)
