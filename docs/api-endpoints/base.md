---
sidebar_position: 8
---

# GET ./base

Land use and land cover polygons from the Overture Maps `base` theme — parks, forests, grass, sand, wetlands, residential/commercial land use and more. Useful for giving your maps geographic context underneath places and buildings.

The endpoint combines the Overture `land_use` and `land_cover` types into one response; each feature carries its `type`, `subtype` and `class` so you can tell them apart.

## Query Parameters

Consult the [Open API documentation](/reference) for the full list of query parameters.

### By Latitude / Longitude / Radius

`lat`, `lng`, `radius` — base features near a location, ordered by distance:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/base' \
-d 'lat=40.7128' -d 'lng=-74.0060' -d 'radius=500'
```

Example response (geometry truncated):

```json
[
  {
    "id": "8739d581-aa1c-3a56-915d-7e1a4d7dce61",
    "geometry": { "type": "Polygon", "coordinates": ["..."] },
    "properties": {
      "theme": "base",
      "type": "land",
      "subtype": "park",
      "class": "park",
      "sources": [{ "dataset": "OpenStreetMap" }]
    }
  }
]
```

### Other Parameters

- `limit` — maximum number of results (default 25000)
- `format` — `json` (default), `csv` or `geojson` (drop straight onto a map)
- `includes` — comma-separated list of property fields to keep, for lighter responses

## Use Cases

- Rendering parks, green space and water context around your points of interest
- Land-use classification of an area (residential vs commercial vs industrial)
- Environmental and urban-planning analysis
