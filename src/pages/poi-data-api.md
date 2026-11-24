---
title: "POI data API: 90 million places from Overture Maps open data"
description: "Query points of interest by location, category, brand or country through a REST API. Names, addresses, phone numbers and websites from Overture Maps open data, as JSON or GeoJSON. Free key, no card."
---

# POI data API, built on open data

More than 90 million places worldwide, from the Overture Maps Foundation's open places data: shops, restaurants, clinics, offices, attractions and services. Search round a point or across a country, filter by category or brand, and keep what you retrieve.

```bash
curl -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/places' \
  -d 'lat=51.5074' -d 'lng=-0.1278' -d 'radius=1000' -d 'taxonomy=food_and_drink' -d 'limit=5'
```

<p>
  <a class="button button--primary button--lg" href="https://app.overturemapsapi.com">Get a free API key</a>{' '}
  <a class="button button--secondary button--lg" href="/explorer">Try the Explorer</a>
</p>

## What you can ask for

| You want | Use |
| --- | --- |
| Places near a point | `lat`, `lng` and `radius`, up to 25 km |
| One kind of place | `taxonomy`, which matches a category and everything beneath it, or `categories` |
| A chain's locations | `brand_name` or `brand_wikidata` |
| A whole country | `country` with a category, brand or name filter, on paid plans |
| Only places you can contact | `has_contact=phone,website,email,social` |
| Type-ahead search | `name_prefix`, nearest first |
| A map layer | `format=geojson` |

Full details are on the [places endpoint page](/docs/api-endpoints/places).

## What each place holds

Name, category and its place in Overture's taxonomy, address, coordinates, a confidence score, and `websites`, `phones`, `emails` and `socials` where Overture has them. Branded places can carry the brand's logo, website and parent company, which we add by matching Overture to Wikidata. Every place has a GERS ID that stays stable across monthly releases.

There are no reviews, ratings, photos or opening hours. If you need those, [join each place to a Google place ID](/blog/2026/11/05/join-overture-places-to-google-place-ids) and fetch them there for the places that matter.

## Why open data

- **You keep it.** Store results, combine them with your own records and publish them, as [Overture's licences](/terms#data-licences) allow. That holds on every plan and after you leave.
- **Flat pricing.** Plans are a fixed monthly price for a number of requests, and one request can return up to 25,000 places. See [pricing](/pricing).
- **No lock-in.** The API is [open source](https://github.com/thatapicompany/overture-maps-api) and runs on your own Google Cloud account if you prefer.

## Common uses

- [Business lists by category and country](/business-listings-api), as a CSV or through the API
- [A "what's near me" feature](/docs/guides/build-a-whats-near-me-feature)
- [A local business directory](/docs/guides/build-a-local-business-directory)
- [Every location of a retail chain](/docs/guides/map-every-location-of-a-retail-chain)
- [A profile of a neighbourhood](/docs/guides/profile-a-neighbourhood)
- [Places inside an AI assistant](/docs/use-with-ai-tools), through the MCP server or the OpenAPI spec

Overture publishes a new release every month, and the [changelog](/docs/changelog) records what changed in each.
