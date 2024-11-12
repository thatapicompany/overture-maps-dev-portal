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
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://overture-maps-api.thatapicompany.com/places/buildings?lat=40.7128&lng=-74.006&radius=1000&categories=cafe'
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
