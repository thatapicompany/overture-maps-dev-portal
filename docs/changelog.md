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
