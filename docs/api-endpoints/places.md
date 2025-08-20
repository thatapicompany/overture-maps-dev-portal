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

### Enriched Responses

e.g. Conflating with the OpenStreetMap equivalent

[Find out more - Enriched Data Options](../enriched-data)