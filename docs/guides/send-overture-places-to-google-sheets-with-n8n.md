---
sidebar_position: 1.7
title: Send Overture places to Google Sheets with n8n
description: Build an n8n workflow that pulls every business of one category in an area from the Overture Maps API and appends it to a Google Sheet. No code, four nodes.
keywords:
  - n8n places api
  - n8n google sheets business list
  - overture maps n8n
  - no code poi data
---

# Send Overture places to Google Sheets with n8n

This workflow fills a Google Sheet with every business of one kind in an area: every plumber within 10 km of a city centre, say, with phone number and website. It uses four n8n nodes and no code. The same HTTP Request settings work in Make, Zapier and other automation tools.

You need an [API key](https://app.overturemapsapi.com) and an n8n instance. The demo key (`DEMO-API-KEY`) works for a first run near New York, London, Paris or Bondi Beach.

## 1. Manual Trigger

Add a **Manual Trigger** so you can run the workflow by hand. Swap it for a **Schedule Trigger** later if you want the sheet refreshed each month, after Overture's release.

## 2. HTTP Request

Add an **HTTP Request** node:

| Setting | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://api.overturemapsapi.com/places` |
| Authentication | Generic Credential Type, Header Auth, with name `x-api-key` and your key as the value |
| Send Query Parameters | On |

Query parameters:

| Name | Value |
| --- | --- |
| `lat` | `51.5074` |
| `lng` | `-0.1278` |
| `radius` | `10000` |
| `taxonomy` | `plumbing` |
| `has_contact` | `phone` |
| `limit` | `100` |

Then, under **Options**, add **Pagination**:

| Setting | Value |
| --- | --- |
| Pagination Mode | Update a Parameter in Each Request |
| Type | Query |
| Name | `page` |
| Value | `{{ $pageCount }}` |
| Pagination Complete When | Response Is Empty |

The API's pages are numbered from 0, which is where `$pageCount` starts. Each page is one request against your monthly allowance, so on a paid plan raise `limit` (up to 25,000) to use fewer.

To cover a whole country on a paid plan, remove `lat`, `lng` and `radius` and add `country` with a two-letter code such as `GB`.

## 3. Edit Fields

The API returns each place as a GeoJSON feature. Add an **Edit Fields (Set)** node to pick out the columns you want:

| Field | Expression |
| --- | --- |
| `id` | `{{ $json.id }}` |
| `name` | `{{ $json.properties.names.primary }}` |
| `category` | `{{ $json.properties.taxonomy.primary }}` |
| `address` | `{{ $json.properties.addresses[0]?.freeform }}` |
| `town` | `{{ $json.properties.addresses[0]?.locality }}` |
| `postcode` | `{{ $json.properties.addresses[0]?.postcode }}` |
| `phone` | `{{ $json.properties.phones?.[0] }}` |
| `website` | `{{ $json.properties.websites?.[0] }}` |
| `opening_hours` | `{{ $json.properties.ext_opening_hours }}` |
| `confidence` | `{{ $json.properties.confidence }}` |
| `longitude` | `{{ $json.geometry.coordinates[0] }}` |
| `latitude` | `{{ $json.geometry.coordinates[1] }}` |

## 4. Google Sheets

Add a **Google Sheets** node with the operation **Append or Update Row**. Choose your sheet, map the columns automatically, and match on `id`. The `id` is the place's GERS ID, which stays the same across Overture's monthly releases, so running the workflow again updates rows in place.

## Going further

- Change `taxonomy` to any category. [`/places/categories`](../api-endpoints/places-categories) lists the ones in your area with their counts, and the [business lists page](/business-listings-api) has common starting points.
- Add `min_confidence` to leave out weaker records. See [choosing a threshold](./choose-a-min-confidence-for-overture-places).
- Prefer a one-off file? The [account app](https://app.overturemapsapi.com/exports) downloads the same list as a CSV without a workflow.
