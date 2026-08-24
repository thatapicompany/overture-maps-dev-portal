---
sidebar_position: 2
title: Changelog
sidebar_label: Changelog
description: What's new in the Overture Maps API — new endpoints, fields and filters, plus the Overture data releases that flow through to your queries.
---

# Changelog

What's changed in the Overture Maps API, newest first. This covers **two streams**:

- **API** — new endpoints, fields, filters and behaviour in this API.
- **Data** — the monthly [Overture Maps data releases](https://docs.overturemaps.org/blog/) that flow through to your query results (new categories, coverage, schema changes). We summarise the parts that affect API callers; the full upstream notes are linked on each entry.

Overture releases roughly monthly (mid-month). New here? Start with the [introduction](./intro).

---

## 2026-08-19 · Data — Overture `2026-08-19.0` (schema v1.18.0)

- **Last release before `categories` disappears.** Overture removes the `categories` property in the **September 2026** release, replaced by `basic_category` and `taxonomy`. If you filter or match on specific category strings, move to the [`taxonomy` filter](./api-endpoints/places) this month. Overture also shipped further taxonomy and category clean-up in this release, so some places will have shifted category.
- **`operating_status` is much better populated.** 1.64M more places now carry an "open" status, so `operating_status=open` returns a good deal more than it did in July. Places with no signal stay null and are still excluded when you use the filter.
- **US place coverage shifted source mix.** BrightQuery nearly tripled its US contribution (+1.46M places, +175%) and AllThePlaces grew 13.4% (+190,735). Total places fell 0.8% to 73.63M as de-duplication and clean-up removed more than the new sources added, so expect some IDs you cached in July to have gone.
- **Buildings:** `building` is down 0.61% to 2.53bn while `building_part` is up 1.45%. Microsoft ML Buildings (+13.09M) and OpenStreetMap (+3.81M) both extended coverage, and hundreds of thousands of buildings picked up updated `num_floors`, `height` and `roof_shape`. Worth a re-pull if you use those on [`/places/buildings`](./api-endpoints/places-buildings).
- **Base:** `infrastructure` +1.80%, `land` +1.62%, `land_use` +1.25%, `water` +0.82%. Transit features grew across `parking`, `parking_space`, `bus_stop`, `stop_position` and `bicycle_parking`, and mountain landforms grew in every class.
- **Divisions:** geometry refinements were the main change this month, and some Vietnamese `microhood` divisions were reclassified as `neighborhood`. If you match on subtype, re-check those.
- **Transportation:** road length is up 414,396 km (+0.45%) and TomTom segments up 5%, with better `road_surface`, `class` and `access_restrictions` coverage.
- **Addresses:** a small net gain (+0.02%) with refreshed inputs from Fresno County, CA and Statistics Canada, plus new points from LINZ (New Zealand) and ICAR.
- Schema stays at v1.18.0, so no breaking schema changes this month.
- Full upstream notes: [Overture 2026-08-19 release](https://docs.overturemaps.org/blog/2026/08/19/release-notes/).

## August 2026 · API updates

- **`name` filter on `/places` and `/places/buildings`.** Case-insensitive exact match against the place's primary name and any localised common name. It narrows an existing lat/lng/radius or country search rather than acting as a standalone text search, and it counts as a narrowing filter for country-level queries. See [Places](./api-endpoints/places).
- **`/places/buildings` radius is now capped at 2,000 m.** Building lookups cost more per metre of radius, so wider searches are rejected rather than run slowly. Page through results with `limit` and `page` instead. See [Pagination](./pagination).

## 2026-07-22 · Data — Overture `2026-07-22.0` (schema v1.18.0)

- **Three new place categories** are now queryable: `arts_and_entertainment`, `lodging` and `cultural_and_historic` (previously filtered out). Use them via `categories` or `taxonomy`.
- **Better place matching** upstream — more matched places and fewer duplicates across all countries.
- **Heads-up — `categories` is being retired.** Overture deprecated the `categories` property and will remove it in the **September 2026** release, replaced by `basic_category` + `taxonomy`. This API keeps the `categories` field and filter working (derived from the taxonomy), but if you match on specific category strings, move to the [`taxonomy` filter](./api-endpoints/places) before September.
- Full upstream notes: [Overture 2026-07-22 release](https://docs.overturemaps.org/blog/2026/07/22/release-notes/).

## July 2026 · API updates

- **Pagination on every search endpoint** — `page` (0-indexed) with `limit` as the page size, and `Pagination-Count` / `Pagination-Page` / `Pagination-Limit` response headers. Ordering is deterministic so pages never overlap. See [Pagination](./pagination).
- **`has_contact` filter** — return only places that already have a website, phone, email or social (comma-separated, OR-matched). Ideal for lead lists and verification.
- **Contact details by default** — `websites`, `phones`, `emails` and `socials` are now always in the response when Overture has them; no parameter needed.
- **Brand enrichment** — add `enrichment_fields=brand` to get `ext_brand` (logo, official website, industry, parent organisation) from Wikidata, on ~1.5M places across ~3,000 chains.
- **New fields** — `taxonomy` (hierarchy-aware), `basic_category`, `operating_status` and `admin_level`, ahead of the upstream category migration.
- **Faster, cheaper place queries** — the `/places` backend now prunes spatially, so lat/lng radius queries return quicker.
- **Demo key scoped to nearby search** — `DEMO-API-KEY` now supports lat/lng radius queries only; country-level pulls need a [free API key](https://www.overturemapsapi.com).
- **New: Overture Maps MCP server** — connect the API to Claude and other LLM tools.
- **New guides** — [Build a local business directory](./guides/build-a-local-business-directory) and [Map every location of a retail chain](./guides/map-every-location-of-a-retail-chain).

<!--
NEXT RELEASE TEMPLATE (copy above the entries, fill in from Overture's notes):

## YYYY-MM-DD · Data — Overture `YYYY-MM-DD.0` (schema vX.Y.Z)
- <API-relevant change: new/removed fields, new categories, coverage, schema>
- Full upstream notes: <link to docs.overturemaps.org release post>
-->
