---
sidebar_position: 7
---

# GET ./transportation

Road, rail and path segments from the Overture Maps `transportation` theme. Each segment is a LineString with a `subtype` (e.g. `road`, `rail`, `water`), a `class` (e.g. `motorway`, `primary`, `footway`, `cycleway`), connector references for routing graphs, and access restrictions where known.

## Query Parameters

Consult the [Open API documentation](/reference) for the full list of query parameters.

### By Latitude / Longitude / Radius

`lat`, `lng`, `radius` — segments near a location, ordered by distance:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/transportation' \
-d 'lat=40.7128' -d 'lng=-74.0060' -d 'radius=500'
```

Example response (geometry truncated):

```json
[
  {
    "id": "5280d450-e605-44dc-afb6-6c4c0ffa960c",
    "geometry": { "type": "LineString", "coordinates": ["..."] },
    "properties": {
      "subtype": "road",
      "class": "footway",
      "connectors": [
        { "connector_id": "896ec260-951e-424b-b730-eb8b5c12f4d7", "at": 0 },
        { "connector_id": "f8e95a2c-cb0c-409c-baaa-a16739203e0e", "at": 1 }
      ],
      "access_restrictions": [{ "access_type": "allowed" }],
      "sources": [{ "dataset": "OpenStreetMap", "license": "ODbL-1.0" }]
    }
  }
]
```

### Other Parameters

- `limit` — maximum number of results (default 25000)
- `format` — `json` (default), `csv` or `geojson` (handy for dropping straight onto a map)
- `includes` — comma-separated list of property fields to keep, for lighter responses

## Use Cases

- Drawing the street network around a location
- Walkability / access analysis (footways, cycleways, road classes)
- Seeding a routing graph for a local area using segment connectors

## Pagination

Supports `limit` + `page` with `Pagination-Count` / `Pagination-Page` / `Pagination-Limit` response headers — see [Pagination](../pagination).
