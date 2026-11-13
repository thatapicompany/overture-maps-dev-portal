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

## 2026-11-13 · API — Better docs and spec for AI tools and SDK generators

- **OpenAPI spec cleaned up.** Every operation now has a unique, readable `operationId` (`searchPlaces`, `listPlaceCategories`, `searchBuildings` and so on) and a description of when to use it, every query parameter has a type, and the `400`, `401`, `403` and `429` responses are documented with their error body and `Retry-After` header. The API key now applies to every operation, so generated clients send it. Get the spec at [`/api-docs.json`](https://api.overturemapsapi.com/api-docs.json) or [`www.overturemapsapi.com/openapi.json`](https://www.overturemapsapi.com/openapi.json).
- **Parameter references and Python examples** on every endpoint page, generated from the spec.
- **Docs for AI tools:** [`/llms-full.txt`](https://www.overturemapsapi.com/llms-full.txt) has every docs page in one file, any docs page is available as markdown by adding `.md` to its URL, and the new [Use with AI tools](./use-with-ai-tools) page covers the MCP server, custom GPTs and coding assistants.
- **Wrong paths get directions.** A request to an endpoint that doesn't exist now returns JSON with links to the docs, the spec and `llms.txt`, instead of a bare `Cannot GET`.

## 2026-10-21 · Data — Overture `2026-10-21.0` (schema v2.0.0)

- **Places up 8.5% to 88.4M.** BrightQuery grew from 10.26M to 15.77M places, with the biggest additions in France (1.95M), the United Kingdom (1.45M) and Spain (1.23M). It now covers the UK, France, Spain, the Netherlands, Belgium, Switzerland, Austria, Sweden, Norway and Finland. Expect many new `/places` results in those countries.
- **Three new sources.** Uberall adds 424,600 places across 217 countries, Birdeye adds 11,855 (mostly US) and OpenTravel adds 2,698 Hilton properties. If you filter or group on `sources`, you will see the new labels.
- **Source switches without ID changes.** In those ten BrightQuery countries, 1,861,523 existing places now carry BrightQuery data in place of a previous Meta, Foursquare or Microsoft record. They keep their GERS IDs, so cached IDs stay valid, but any source counts you track for those providers will drop.
- **Place IDs churned by 11.92%.** Overture added 8,335,526 places and removed 1,372,826. If you cache place IDs, expect some to have gone, so re-check stored IDs against [`/places`](./api-endpoints/places).
- **`operating_status` coverage rose from 23.74% to 32.54%.** Status is now chosen by majority vote across contributing sources, and `sources` records which source supplied it. `open` grew 47.6% to 27.1M, `permanently_closed` grew 70.2% to 1.67M and `temporarily_closed` went from 29 to 3,496. Filtering on `operating_status=open` returns noticeably more places than last month.
- **Addresses (still alpha upstream):** total up 0.23% to 475.3M. Uruguay's countrywide dataset was replaced by 19 departmental datasets from Direcciones Geográficas del Uruguay, so Uruguay `sources` labels on [`/addresses`](./api-endpoints/addresses) change, and `address_levels` coverage there rose from 85.76% to 100%. A refresh of the US National Address Database added 935,021 addresses (+1.11%), and New Caledonia grew 24.48% to 51,702.
- **Base:** `infrastructure` +0.86%, `land` +0.93%, `water` +0.92%, `land_use` +0.62%, `land_cover` and `bathymetry` unchanged. The OSM cut-off is 2026-10-10. See [`/base`](./api-endpoints/base).
- **Buildings are unchanged.** Overture re-promoted the September data, so [`/places/buildings`](./api-endpoints/places-buildings) returns the same 2.53bn buildings and 4.49M building parts as last month.
- **Divisions** changed only slightly (`division` +0.27%, `division_area` +0.33%), with new Esri Community Maps name values. GERS churn is 0.45% for `division` and 0.56% for `division_area`.
- **Transportation:** road length is up 254,743 km (+0.27%) and TomTom segments are up 1.54%. GERS churn is 0.70% for connectors and 0.83% for segments.
- **No schema change.** The release stays on schema v2.0.0, and the post lists no breaking changes or deprecations. The API still serves `categories` as a field and filter derived from `taxonomy`.
- Full upstream notes: [Overture 2026-10-21 release](https://docs.overturemaps.org/blog/2026/10/21/release-notes/).

## November 2026 · API updates

- **Monthly request limits are now enforced.** Each plan has an allowance and a refusal point. Between the two, requests work with an `X-Quota-Warning` header, and at the limit you get `429` with `monthly_quota_exceeded`. Every response carries `X-Quota-*` headers, and errors do not count. See [Usage limits](./limits).
- **Per-minute limits follow your plan.** The limit is now counted per account rather than per IP: 60 requests a minute on Free and 120 on paid plans, with `X-RateLimit-*` headers and a `429` `rate_limited` error that includes `Retry-After`. See [Usage limits](./limits).
- **Country-level `/places` queries need a paid plan.** A `country` with no `lat`/`lng` now returns `403` on the Free plan. Search by `lat`, `lng` and `radius` instead, with `country` as an extra filter if you like. See [Places](./api-endpoints/places).
- **`/transportation` segments return line geometries.** See [Transportation](./api-endpoints/transportation).
- **Clearer error for country-only calls to point endpoints.** `/buildings`, `/addresses`, `/base`, `/transportation` and `/places/buildings` need a `lat` and `lng`. A country-only call now gets a `400` saying so, where it used to return a `500`.
- **Coordinates of `0` are valid.** Searches on the equator (`lat=0`) or the prime meridian (`lng=0`) were previously treated as having no location. They now filter by position as expected.
- **Demo key on `/divisions`.** `DEMO-API-KEY` works for name searches without geometry, or `lat`/`lng` near a demo city. See [Divisions](./api-endpoints/divisions).

## 2026-10 · API: partial-name search

- **New `name_prefix` filter on [`/places`](./api-endpoints/places).** Matches places whose name, or a word in it, starts with the text you pass, so it can back a type-ahead location field. Combine it with `lat`/`lng` and a small `limit` for the nearest matches first.

## 2026-09-23 · Data — Overture `2026-09-23.0` (schema v2.0.0)

- **`categories` is gone upstream.** Overture's schema v2.0.0 removes the places `categories` property entirely, in favour of `taxonomy` and `basic_category`. This API keeps the `categories` response field and filter working, now derived from `taxonomy`, and [`/places/categories`](./api-endpoints/places-categories) now lists taxonomy values. The values themselves now follow the taxonomy vocabulary, so any legacy category string that differs from its taxonomy equivalent will stop matching. If you filter on specific strings, use the [`taxonomy` filter](./api-endpoints/places).
- **Places up 10.6% to 81.5M.** BrightQuery expanded beyond the US into Germany, Italy and Denmark (2.29M to 10.26M places) and added more US places under `services_and_business`. Expect many new results in those countries.
- **`operating_status=open` returns far more.** Places marked open grew 66.2%, from 11.05M to 18.36M.
- **Addresses: source labels have changed.** `sources[].dataset` values on [`/addresses`](./api-endpoints/addresses) now use a `provider/resource` form, so update any code that filters or groups on those strings. `record_id`, `update_time` and `license` are now populated on every address source. Coverage grew 0.29% to 474.2M, with new data for New Caledonia, French Polynesia, three Taiwanese counties and New Orleans, plus roughly 1M new addresses in Italy with better location precision.
- **Buildings: new `shelter` class** on around 321,000 buildings, many of them previously unclassed `civic` buildings. If you filter on `class` via [`/places/buildings`](./api-endpoints/places-buildings), re-check those. Buildings +0.17% to 2.53bn, building parts +3.39%.
- **Base: new IDs for every `land_use` feature.** Overture changed how base-theme IDs are generated, so `land_use` IDs from [`/base`](./api-endpoints/base) have all changed; don't rely on IDs cached before this release. `land_use` grew 0.86%, `land_cover` is unchanged.
- **Divisions** saw only minor, incremental changes (+0.63%). **Transportation** road length is up 263,339 km (+0.28%) and TomTom segments up 5.5%.
- Full upstream notes: [Overture 2026-09-23 release](https://docs.overturemaps.org/blog/2026/09/23/release-notes/).

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
