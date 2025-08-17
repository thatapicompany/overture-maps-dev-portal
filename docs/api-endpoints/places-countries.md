---
sidebar_position: 4
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
