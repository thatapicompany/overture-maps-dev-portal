---
sidebar_position: 3
---

# GET ./places/categories


Example Request to GET the Categories of all Brands in the France:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places/categories'  \
-d 'country=FR'
```

## Counts

- `places` - The number of places in the category
- `brands` - The number of brands in the category

## Response Example

```JSON
[{"primary":"beauty_salon","counts":{"places":67490,"brands":227}}]
```