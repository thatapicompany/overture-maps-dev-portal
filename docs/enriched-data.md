---
sidebar_position: 5
---

# Enriched Responses

On the Hosted paid versions you can get access to the wealth of other data we Join onto the Overture Data using the GERS ID.

## Places

The most common thing we are asked about is how to join the Overture places to the same place if it exists in OSM. Usually this is because the client already has a lot of data pipelines that themselves join to OSM data, however they have seen that OSM data has a staleness problem, and are keen to use the more up-to-date Overture data instead.

To help with this use-case we provide a set of enriched endpoints that allow you to easily access the Overture data and join it with your existing OSM data.


### Example: OpenStreetMap

Example Response for `GET /places/` with the GERS ID ('id') and OSM ID ('osm_uid')

```JSON
{
    "id": "4c69f544-5df1-4b53-a5d9-35a1774b3910",
    "...",
    "enrichment": {
        "source": "hosted",
        "fields": {
            "osm_uid": "u4216537394",
            "osm_name": "woolworths metro - bondi beach"
        }
    }
}
```



This then allows you to easily merge any additional data from OSM - e.g. https://www.openstreetmap.org/node/4216537394 - and enrich your existing dataset with the latest information.

#### Other examples of our enriched data:

- advanced tags
- opening hours & dates 
- website
- footfall (country dependent)
- photos
- restaurant menus
- conflate the same place to Tripadviser and other Mapping services
- [contact us for more...](mailto:aden@thatapicompany.com)