---
sidebar_position: 1
---

# GET ./places

Allows you to get all the Places in the Overture Maps Database. You can filter by Lat/Long, Brand, Country and Categories.


## Query Parameters

Consult the [Open API documentation](./reference) for the full list of query parameters that can be used to filter the results. Here are some examples


### Country

e.g. `?country=US` - The ISO 3166-1 alpha-2 country code to filter by. e.g. `US`, `GB`, `FR` (UK is GB)

Example Request to GET 10 the Places by Country:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://overture-maps-api.thatapicompany.com/places'  \
-d 'country=US' -d 'limit=10'
```


### Categories

e.g. `?categories=water_park` - Comma separated string of Categories to filter

Example Request to GET all the Water Parks in India

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://overture-maps-api.thatapicompany.com/places' \
-d 'country=IN' -d 'categories=water_park'
```

### Brands

e.g. `?brand_name=H&M` - The name of the Brand to filter by e.g. `Uniqlo`, `McDonalds`

Example Request to GET all the Uniqlo stores in Japan

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://overture-maps-api.thatapicompany.com/places' \
-d 'country=JP' -d 'brand_name=Uniqlo'
```

## Response

Example of a response for a 7-Eleven store in Santa Rosa, CA, USA:

**Request:**

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://overture-maps-api.thatapicompany.com/places'  \
-d 'country=US' -d 'limit=1' -d 'brand_name=7-Eleven'
```

**Response:**

```JSON
{
  "id": "08f2830228c55328039fcc6aa5230c05",
  "geometry": {
    "type": "Point",
    "coordinates": [
      -122.6277423,
      38.4563298
    ]
  },
  "bbox": {
    "xmin": -122.62775421142578,
    "xmax": -122.62773895263672,
    "ymin": 38.456329345703125,
    "ymax": 38.45633316040039
  },
  "version": 0,
  "sources": [
    {
      "property": "",
      "dataset": "meta",
      "record_id": "740566469402680",
      "update_time": "2024-08-02T00:00:00.000Z",
      "confidence": null
    },
    {
      "property": "/properties/existence",
      "dataset": "msft",
      "record_id": "844424932854046",
      "update_time": "2024-08-02T00:00:00.000Z",
      "confidence": null
    }
  ],
  "names": {
    "primary": "7-Eleven",
    "common": null,
    "rules": null
  },
  "categories": {
    "primary": "convenience_store",
    "alternate": []
  },
  "confidence": 0.9959181549711714,
  "websites": [],
  "socials": [
    "https://www.facebook.com/740566469402680"
  ],
  "emails": [],
  "phones": [
    "+17075376974"
  ],
  "brand": {
    "names": {
      "primary": "7-Eleven",
      "common": null,
      "rules": null
    },
    "wikidata": null
  },
  "addresses": [
    {
      "freeform": "5855 Sonoma Hwy",
      "locality": "Santa Rosa",
      "postcode": "95409",
      "region": "CA",
      "country": "US"
    }
  ],
  "distance_m": null
}
```