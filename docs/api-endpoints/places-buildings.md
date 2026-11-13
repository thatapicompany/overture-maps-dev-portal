---
sidebar_position: 4
---

# GET ./places/buildings

Merges the 'places' and 'buildings' themes to return places with building shapes, using the nearest building shape to the place. This will inherently not be 100% accurate, as the building shape may not match the place exactly, but it will give a good approximation of the building shape for the place.

Reasons for missmatches between the place and building shapes include:

- the place being in a building with multiple businesses
- the place being in a building with multiple floors
the lat / lng of the place being in the street
- the building shape being underground (e.g. a subway station)

Building shapes is quite an expensive dataset, so optimsiations have been taken to reduce the cost of this endpoint.

Ways to improve in future versions include:

- using the OSM dataset as the primary source, instead of the Microsoft from space building shapes dataset. Getting the lat/lng of the place from OSM and using the nearest building shape from OSM.

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places/buildings?lat=40.7128&lng=-74.006&radius=1000&categories=cafe'
```

## Response Example

Example for Places with Buildings in New York

```JSON
[ {
        "id": "08f2a107059b12890338d9477e377478",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -74.0556772,
                        40.7300326
                    ],
                    [
                        -74.0555967,
                        40.7299798
                    ],
                    [
                        -74.0554715,
                        40.7300894
                    ],
                    [
                        -74.0555321,
                        40.7301583
                    ],
                    [
                        -74.0556772,
                        40.7300326
                    ]
                ]
            ]
        },
        "properties": {
            "id": "08f2a107059b12890338d9477e377478",
            "version": 0,
            "sources": [
                {
                    "property": "",
                    "dataset": "meta",
                    "record_id": "510009399165285",
                    "update_time": "2024-08-02T00:00:00.000Z",
                    "confidence": null
                }
            ],
            "names": {
                "primary": "Newark Super Market",
                "common": null,
                "rules": null
            },
            "categories": {
                "primary": "supermarket",
                "alternate": []
            },
            "confidence": 0.9380668566986265,
            "websites": [],
            "socials": [
                "https://www.facebook.com/510009399165285"
            ],
            "emails": [],
            "phones": [
                "+12012220019"
            ],
            "addresses": [
                {
                    "freeform": "515 Newark Ave",
                    "locality": "Jersey City",
                    "postcode": "07306-1347",
                    "region": "NJ",
                    "country": "US"
                }
            ],
            "building": {
                "id": "08b2a107059b1fff0200537c72a74492",
                "distance": 0,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                -74.0556772,
                                40.7300326
                            ],
                            [
                                -74.0555967,
                                40.7299798
                            ],
                            [
                                -74.0554715,
                                40.7300894
                            ],
                            [
                                -74.0555321,
                                40.7301583
                            ],
                            [
                                -74.0556772,
                                40.7300326
                            ]
                        ]
                    ]
                }
            },
            "ext_name": "Newark Super Market",
            "ext_building": {
                "id": "08b2a107059b1fff0200537c72a74492",
                "distance": 0,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                -74.0556772,
                                40.7300326
                            ],
                            [
                                -74.0555967,
                                40.7299798
                            ],
                            [
                                -74.0554715,
                                40.7300894
                            ],
                            [
                                -74.0555321,
                                40.7301583
                            ],
                            [
                                -74.0556772,
                                40.7300326
                            ]
                        ]
                    ]
                }
            },
            "ext_place_geometry": {
                "type": "Point",
                "coordinates": [
                    -74.0554888,
                    40.7300943
                ]
            }
        }
    }]
```

## Pagination

Supports `limit` + `page` with `Pagination-Count` / `Pagination-Page` / `Pagination-Limit` response headers — see [Pagination](../pagination).

{/* openapi:generated:start */}

## Parameter reference

Generated from the [OpenAPI spec](https://api.overturemapsapi.com/api-docs.json) (operation `searchPlacesWithBuildings`). Same filters as `GET /places`, and each place also carries the footprint of the building it sits in. Use it when you need the shape or size of the premises, for example for site analysis or rooftop mapping. Slower than `/places`, so keep the radius small.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `lat` | number |  | Latitude coordinate. Required if country code is not provided. |
| `lng` | number |  | Longitude coordinate. Required if country code is not provided. |
| `radius` | integer | `1000` | Search radius in meters, defaulting to 1000 meters if not provided. Capped lower than /places because building lookups are more expensive per meter of radius. |
| `limit` | integer | `100` | Limit on the number of results returned, defaulting to 100 if not provided. Use `page` to paginate for more. |
| `page` | integer | `0` | Page number for pagination (0-indexed), used together with `limit` as the page size. Responses include Pagination-Count (total matching results), Pagination-Page and Pagination-Limit headers. Defaults to 0. |
| `format` | `json`, `csv`, `geojson` | `json` | Response format, defaulting to JSON. Options are "json", "csv", or "geojson". |
| `includes` | string |  | Array of fields to include in the properties field of the response, provided as a comma-separated string. Any fields not in the list will be excluded from the properties object. This is used to make the response lighter so your application is faster. |
| `country` | string |  | ISO 3166 country code consisting of 2 characters. Required if lat/lng are not provided. |
| `source` | string |  | Filter places to only those with a source dataset matching this value. |
| `brand_wikidata` | string |  | Wikidata brand ID associated with the place. |
| `brand_name` | string |  | Brand name associated with the place. |
| `name` | string |  | Filter by the place's own name — an additional filter on top of lat/lng/radius (or country) search, not a standalone text search. Case-insensitive exact match against names.primary or any localized value in names.common. |
| `name_prefix` | string |  | Partial-name search for type-ahead: matches places whose primary name starts with this text, or has a word that does (so "blue bo" and "bottle" both match "Blue Bottle Coffee"). Case-insensitive, at least 2 characters. Combine with lat/lng/radius and a small limit: results come nearest first. |
| `min_confidence` | number | `0.5` | Minimum confidence score for the places to be returned, defaulting to 0.5 if not provided. |
| `categories` | string |  | Array of category names, provided as a comma-separated string. Matches the legacy Overture categories vocabulary and the newer taxonomy/basic_category vocabulary. |
| `taxonomy` | string |  | Array of Overture taxonomy categories, provided as a comma-separated string. Matches the primary category or any ancestor in the taxonomy hierarchy, so e.g. "food_and_drink" matches every descendant category. |
| `operating_status` | string |  | Filter by operating status, e.g. "open" or "permanently_closed". Places without signals have a null operating status and are excluded when this filter is used. |
| `enrichment_fields` | string |  | Comma-separated list of enrichment fields to include. Use "brand" for Wikidata-sourced brand details (logo, website, industry, parent) on branded places. |
| `has_contact` | string |  | Return only places that already have at least one of the listed contact fields. Comma-separated, matched with OR: e.g. "website" returns places with a website; "website,social" returns places with a website OR a social link. Useful for filtering to businesses you can verify. Allowed values: website, phone, email, social. |

## Python example

```python
import requests

resp = requests.get(
    "https://api.overturemapsapi.com/places/buildings",
    headers={"x-api-key": "DEMO-API-KEY"},  # use your own key outside the demo cities
    params={
        "lat": 51.5138,
        "lng": -0.0984,
        "radius": 300,
        "categories": "cafe",
        "limit": 10,
    },
    timeout=30,
)
if resp.status_code == 429:
    raise SystemExit(f"Rate limited, retry in {resp.headers['Retry-After']}s")
resp.raise_for_status()  # 4xx bodies are {"statusCode", "message"}; the message says how to fix the request

results = resp.json()
print(resp.headers.get("Pagination-Count"), "results in total")
for place in results:
    print(place["properties"]["names"]["primary"], place["geometry"]["type"])
```

Results are paginated: pass `page` (0-indexed) and `limit`, and read the total from the `Pagination-Count` header. See [Pagination](/docs/pagination) and [Usage limits](/docs/limits).

{/* openapi:generated:end */}
