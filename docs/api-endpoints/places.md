---
sidebar_position: 1
---

# GET ./places

Allows you to get all the Places in the Overture Maps Database. You can filter by Lat/Long, Brand, Country and Categories.


## Query Parameters

Consult the [Open API documentation](/reference) for the full list of query parameters that can be used to filter the results. Here are some examples

### By Latitude / Longitude / Radius

Query params:
`lat`, `lng`, `radius`

Example Request to GET all the 'categories=cafes' within 2000m of Bondi Beach:


```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places?lat=-33.8910&lng=151.2769&radius=2000&categories=cafes' 
```

### Categories

e.g. `categories=water_park` - Comma separated string of Categories to filter

Example Request to GET all the Water Parks in India

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'country=IN' -d 'categories=water_park'
```

:::info Overture is retiring `categories` in September 2026
Overture replaces the places `categories` property with `basic_category` + `taxonomy` upstream in September 2026. **Nothing breaks in this API**: the `categories` response field and filter are staying (derived from the taxonomy once the upstream column is gone), and the `categories` filter already matches values from both vocabularies. Note the *values* inside `categories` will shift to the new taxonomy vocabulary at that point. If you match on specific category strings, we recommend the `taxonomy` filter below.
:::

### Taxonomy (hierarchy-aware)

`taxonomy` — comma-separated Overture taxonomy categories. Matches the primary category **or any ancestor in the taxonomy hierarchy**, so one value covers every descendant: `taxonomy=food_and_drink` matches every restaurant, café, bar and bakery.

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'lat=40.7128' -d 'lng=-74.0060' -d 'radius=1500' -d 'taxonomy=food_and_drink'
```

Every place also returns its full taxonomy in the response:

```json
"taxonomy": {
  "primary": "coffee_shop",
  "hierarchy": ["food_and_drink", "non_alcoholic_beverage_venue", "coffee_shop"],
  "alternates": []
},
"basic_category": "coffee_shop"
```

### Operating Status

`operating_status` — filter by operating status, e.g. `open` or `permanently_closed`. Places without signals have a null status and are excluded when this filter is used. The field is also present on every place response.

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'lat=51.5074' -d 'lng=-0.1278' -d 'radius=1000' -d 'operating_status=open'
```

### Brand Details (logos, websites) via Wikidata

`enrichment_fields=brand` — adds an `ext_brand` object to branded places with the brand's logo URL, official website, industry and parent organisation, sourced from Wikidata (CC0):

```json
"ext_brand": {
  "label": "Bank of America",
  "logo_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Bank%20of%20America%20logo.svg",
  "website": "https://www.bankofamerica.com/",
  "industry": "financial sector"
}
```

Logo URLs are Wikimedia Commons links — append `?width=200` for a resized image. Present where Overture links the place's brand to a Wikidata QID (~1.5M places across ~3,000 chains).

### Brands / Retail Chain

e.g. `brand_name=H&M` - The name of the Brand to filter by e.g. `Uniqlo`, `McDonalds`

Example Request to GET all the Uniqlo stores in Japan

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'country=JP' -d 'brand_name=Uniqlo'
```

Example of a response for a 7-Eleven stores in the US:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places'  \
-d 'country=US' -d 'limit=1' -d 'brand_name=7-Eleven'
```

### By Country

e.g. `?country=US` - The ISO 3166-1 alpha-2 country code to filter by. e.g. `US`, `GB`, `FR` (UK is GB)

Example Request to GET 10 the Places by Country:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places'  \
-d 'country=US' -d 'limit=10'
```

### Pagination

`limit` (page size) + `page` (0-indexed). Totals come back in the `Pagination-Count` / `Pagination-Page` / `Pagination-Limit` response headers.

[Find out more - Pagination](../pagination)

### Enriched Responses

e.g. Conflating with the OpenStreetMap equivalent

[Find out more - Enriched Data Options](../enriched-data)