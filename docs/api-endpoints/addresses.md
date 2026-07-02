---
sidebar_position: 6
---

# GET ./addresses

Point addresses from the Overture Maps `addresses` theme — street number, street, unit, postcode and country for hundreds of millions of address points, sourced from open government address datasets such as OpenAddresses.

## Query Parameters

Consult the [Open API documentation](/reference) for the full list of query parameters.

### By Latitude / Longitude / Radius

`lat`, `lng`, `radius` — address points near a location, ordered by distance:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/addresses' \
-d 'lat=40.7128' -d 'lng=-74.0060' -d 'radius=200'
```

Example response:

```json
[
  {
    "id": "90abd8ae-ed7f-41fd-b083-374ff701b2ce",
    "geometry": { "type": "Point", "coordinates": [-74.0059, 40.7127] },
    "properties": {
      "number": "254",
      "street": "BROADWAY",
      "unit": null,
      "postcode": "10007",
      "country": "US",
      "address_levels": ["NY", "New York"],
      "sources": [{ "dataset": "OpenAddresses/NY/NYC Open Data" }]
    }
  }
]
```

### Other Parameters

- `limit` — maximum number of results (default 25000)
- `format` — `json` (default), `csv` or `geojson`
- `includes` — comma-separated list of property fields to keep, for lighter responses

## Use Cases

- Reverse lookup: "what addresses are at/near this point?"
- Address density and delivery-area analysis
- Validating or enriching your own address data against open sources
