---
sidebar_position: 4
title: "Overture Places by Country — List Countries & Place Counts"
description: "List every country in the Overture Maps places dataset and how many places each has, via a simple REST API call."
sidebar_label: "GET /places/countries"
---

# GET ./places/countries


Example Request to GET all the Countries in the Overture Maps Database:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places/countries'
```

## Counts

- `places` - The number of places in the category
- `brands` - The number of brands in the category

## Response Example

example response for the number of places and brands in South Africa:

```JSON
[{"country":"ZA","counts":{"places":67490,"brands":227}}]
```
