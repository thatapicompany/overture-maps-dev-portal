---
sidebar_position: 1.5
title: Build a business list by category and area
description: Use the Overture Maps API to list every business of one kind in a city or a country, with phone numbers and websites, and save it as a CSV. Worked example with plumbers in London.
keywords:
  - business list by category
  - business listings api
  - b2b lead list open data
  - overture places csv
  - poi data by category
---

# Build a business list by category and area

A common job for the API is a list: every plumber in a city, every car dealer in a state, every vet in a country, each with an address and a way to get in touch. This guide builds one from Overture places, sizes it before pulling it, and saves it as a CSV.

If you would rather not write code, the [account app](https://app.overturemapsapi.com/exports) does the same from a form: choose a country and categories, check the count and a sample, and download the file. Ready-made starting points are on the [business lists page](/business-listings-api).

## What you get

One row per business with its name, category, address, coordinates and Overture's confidence score, plus `phones`, `websites`, `emails` and `socials` where Overture has them. It is the business's public listing. There are no named contacts, reviews or opening hours.

## Step 1: find the category

Overture arranges categories in a tree, and the `taxonomy` filter matches a category and everything beneath it. `taxonomy=home_service` covers plumbers, electricians, roofers and contractors, while `taxonomy=plumbing` is plumbers alone.

To see which categories exist where you are searching, with how many places each has, ask [`/places/categories`](../api-endpoints/places-categories):

```bash
curl -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/places/categories' \
  -d 'lat=51.5074' -d 'lng=-0.1278' -d 'radius=2000'
```

```json
[
  { "primary": "corporate_or_business_office", "counts": { "places": 3822, "brands": 3 } },
  { "primary": "information_technology_company", "counts": { "places": 2677, "brands": 0 } }
]
```

The [category guide](./filter-overture-places-by-category) explains the tree in more detail.

## Step 2: size the list first

Ask for one result and read the `Pagination-Count` header. It is the total for your filters, so you know how many places, and how many requests, the full list will take.

```bash
curl -i -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/places' \
  -d 'lat=51.5074' -d 'lng=-0.1278' -d 'radius=10000' \
  -d 'taxonomy=plumbing' -d 'limit=1'
```

```
Pagination-Count: 69
```

Add `has_contact=phone` to count only the places you can ring. It takes `phone`, `website`, `email` and `social`, comma-separated, and matches a place that has any of them.

## Step 3: page through it and save a CSV

```python
"""Every plumber within 10 km of central London that has a phone number, as a CSV."""
import csv
import os

import requests

API = "https://api.overturemapsapi.com/places"
KEY = os.environ.get("OVERTURE_API_KEY", "DEMO-API-KEY")
PARAMS = {
    "lat": 51.5074,
    "lng": -0.1278,
    "radius": 10000,
    "taxonomy": "plumbing",
    "has_contact": "phone",
    "limit": 100,
}

rows, page, total = [], 0, None
while total is None or len(rows) < total:
    response = requests.get(API, params={**PARAMS, "page": page}, headers={"x-api-key": KEY}, timeout=60)
    response.raise_for_status()
    total = int(response.headers["Pagination-Count"])
    places = response.json()
    if not places:
        break
    for place in places:
        p = place["properties"]
        address = (p.get("addresses") or [{}])[0]
        lng, lat = place["geometry"]["coordinates"]
        rows.append(
            {
                "id": place["id"],
                "name": p["names"]["primary"],
                "category": p["taxonomy"]["primary"],
                "address": address.get("freeform"),
                "locality": address.get("locality"),
                "postcode": address.get("postcode"),
                "country": address.get("country"),
                "phone": (p.get("phones") or [None])[0],
                "website": (p.get("websites") or [None])[0],
                "confidence": p.get("confidence"),
                "latitude": lat,
                "longitude": lng,
            }
        )
    page += 1

with open("plumbers-london.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)
print(f"{len(rows)} of {total} places saved")
```

Run against the demo key on 24 November 2026, this saved 67 places with these columns:

```
id,name,category,address,locality,postcode,country,phone,website,confidence,latitude,longitude
```

Each page is one request against your monthly allowance, so a larger `limit` (up to 25,000) means fewer requests. Keep the `id`: it is the place's GERS ID, which stays stable across Overture's monthly releases, so you can refresh a list later without creating duplicates.

## Step 4: go country-wide

Swap the point and radius for a country code and the same script lists a whole country:

```python
PARAMS = {"country": "GB", "taxonomy": "plumbing", "has_contact": "phone", "limit": 1000}
```

A `country` with no `lat` and `lng` needs a [paid plan](/pricing) and at least one narrowing filter, such as `taxonomy`, `categories` or `brand_name`. On the Free plan, search round one city at a time with a radius of up to 25 km.

## Keeping the list clean

- **Filter on confidence.** Every place has a `confidence` score from 0 to 1. `min_confidence=0.7` drops the weakest records, at the cost of some real ones. [Choosing a threshold](./choose-a-min-confidence-for-overture-places) shows the trade-off.
- **Drop closed businesses** with `operating_status=open`. Places with no signal either way are left out when you use it.
- **Expect some miscategorised places.** Categories come from the contributing sources. Check a sample before you rely on a list.
- **Mind the rules for outreach.** The data licence lets you use the list commercially. Laws on marketing calls and email in your country are a separate matter and are yours to check.

## Licence

Overture places are open data. What you retrieve is yours to keep and use under [Overture's licences](/terms#data-licences), on any plan. Commercial use of the API itself needs a paid plan.
