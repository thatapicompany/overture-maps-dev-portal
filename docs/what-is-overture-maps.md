---
sidebar_position: 1.5
title: "What Is Overture Maps? The Data, the Themes and How to Query It"
description: "Overture Maps explained for developers: who makes it, the six themes (places, buildings, addresses, divisions, transportation, base), licences, release cadence, and how to query it without downloading GeoParquet."
sidebar_label: "What is Overture Maps?"
keywords:
  - overture maps
  - overture maps foundation
  - overture maps data
  - overture places
  - overture maps api
  - geoparquet
---

# What is Overture Maps?

**Overture Maps** is a free, open map dataset of the whole world, published by the **Overture Maps Foundation**. It covers places of interest, building footprints, addresses, administrative boundaries, roads and the base layer of land and water. Overture combines data from OpenStreetMap, its member companies and other open sources into one schema, with stable IDs, and publishes a new release every month.

This page explains what's in it and how to get at it. If you want the short version: Overture publishes very large files for you to download and query yourself, and this API lets you ask for just the part you need instead.

![Overture buildings, addresses and food and drink places within 350 m of Les Halles, Paris](/img/guides/overture-themes-paris.jpg)

<sub>Three Overture themes around Les Halles, Paris, each from a single API call. Map: OpenFreeMap, © OpenMapTiles, data © OpenStreetMap contributors.</sub>

## Who makes it

The Overture Maps Foundation was launched in December 2022 by Amazon Web Services, Meta, Microsoft and TomTom ([TomTom announcement](https://www.tomtom.com/newsroom/behind-the-map/the-overture-foundation-and-its-tech/)). It is a Joint Development Foundation project, an affiliate of the Linux Foundation ([Overture FAQ](https://overturemaps.org/about/faq/)). The data is open and free to use under the licences below.

## The six themes

Overture organises its data into six themes. As of the `2026-10-21.0` release, with schema v2.0.0 ([release notes](https://docs.overturemaps.org/blog/2026/10/21/release-notes/)):

| Theme | What it holds | Size (Oct 2026) | In this API |
| --- | --- | --- | --- |
| **Places** | Points of interest: shops, restaurants, services, landmarks, with categories, brands, websites and phone numbers | 88,418,121 places | [`/places`](./api-endpoints/places) |
| **Buildings** | Building footprints with height, floors, class and roof details | 2,533,842,612 buildings | [`/buildings`](./api-endpoints/buildings) |
| **Addresses** | Address points from national and local open sources | 475,263,892 addresses | [`/addresses`](./api-endpoints/addresses) |
| **Divisions** | Countries, regions, cities and neighbourhoods, with boundaries | | [`/divisions`](./api-endpoints/divisions) |
| **Transportation** | The road, rail and path network | | [`/transportation`](./api-endpoints/transportation) |
| **Base** | Land, water, land use and infrastructure | | [`/base`](./api-endpoints/base) |

Overture's release notes give totals per theme for places, buildings and addresses, and per feature type for the others.

Every feature carries a **GERS ID**, Overture's Global Entity Reference System identifier. It's meant to stay stable across releases, so you can join Overture data to your own records and follow a place or building over time ([What is GERS?](https://docs.overturemaps.org/gers/)).

## How often it changes

Overture publishes a new release every month ([Accessing the Overture catalog](https://docs.overturemaps.org/getting-data/cloud-sources/)). Each release can add places, retire old IDs and change the schema, so it's worth reading the [release notes](https://docs.overturemaps.org/blog/) or the [changelog](./changelog), where we summarise what each release means for API callers. Upcoming dates are on Overture's [release calendar](https://docs.overturemaps.org/release-calendar/).

## Licences

Licences differ by theme ([Overture attribution and licensing](https://docs.overturemaps.org/attribution/)):

- **Base, buildings, divisions and transportation:** ODbL.
- **Places:** set per data provider. Most is CDLA Permissive 2.0; Foursquare's contribution is Apache 2.0 and AllThePlaces' is CC0 1.0.
- **Addresses:** set by each country's source, ranging from CC0 1.0 to CC BY 4.0 and national open licences.

Every feature lists its sources, with their licence, in `sources[].license`. Overture asks for the attribution "Overture Maps Foundation, overturemaps.org".

## How to get the data

### Option 1: download and query it yourself

Overture publishes its data as **GeoParquet** files on Amazon S3 and Microsoft Azure, and partners host copies on platforms such as BigQuery, Databricks and Snowflake ([Overture documentation](https://docs.overturemaps.org/)). Overture's own quick-start tools are the Python CLI and DuckDB, and you can browse a release in the [Overture Explorer](https://explore.overturemaps.org/).

That suits analysts working with a whole country or theme at once. It means picking the right release, writing spatial SQL, and handling files measured in gigabytes, then doing it all again every month.

### Option 2: ask an API for just what you need

This API runs Overture's data behind a normal REST interface. You send a location and a few filters and get JSON or GeoJSON back, for example every café within 800 m of a point:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'lat=-33.8910' -d 'lng=151.2769' -d 'radius=800' -d 'categories=cafe' -d 'limit=5'
```

There are no files to download, no SQL, and no monthly re-import: the API moves to new Overture releases for you, and the [changelog](./changelog) records each one. On top of the raw data it adds brand logos and websites from Wikidata ([enriched data](./enriched-data)), filters such as `has_contact` and `operating_status`, and type-ahead search by name.

`DEMO-API-KEY` works near New York, London, Paris and Sydney. [Sign up for a free key](https://account.overturemapsapi.com) to search anywhere.

## Where to go next

- **See the data on a map:** the [live demo](https://demo.overturemapsapi.com) lets you explore places, brands, buildings and boundaries without writing code.
- **Make your first request:** [Getting started](./intro).
- **Build something:** the [guides](./category/guides), such as [Build a "what's near me" feature](./guides/build-a-whats-near-me-feature) and [Map every location of a retail chain](./guides/map-every-location-of-a-retail-chain).
