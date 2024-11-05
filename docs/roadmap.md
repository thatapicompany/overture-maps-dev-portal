---
sidebar_position: 2
---

# Roadmap & API Design Principles

We aim to have endpoints to cover all the Overture Maps data themes.

Currently these are:
- [Places](https://docs.overturemaps.org/schema/concepts/by-theme/places/) The Overture places theme includes more than 50M places and points of interest around the world. The data is sourced from Meta and Microsoft.
- [Addresses](https://docs.overturemaps.org/schema/reference/addresses/address/) The Overture Address type is a compilation of open address datasets usually published by local authorized sources. In our initial release, they use the datasets that are collected and distributed by OpenAddresses.
- [Buildings](https://docs.overturemaps.org/schema/concepts/by-theme/buildings/) The Overture buildings theme captures the compilation of many building attributes from a variety of open data sources including OpenStreetMap, Esri Community Maps, Microsoft, and Google. This includes [3d Building Parts](https://docs.overturemaps.org/schema/concepts/by-theme/buildings/3d_buildings/)

- [Transportation](https://docs.overturemaps.org/schema/concepts/by-theme/transportation/) The Overture transportation theme is the collection of features and properties that describe the infrastructure and conventions of how people and objects travel around the world. Transportation data includes highways, footways, cycleways, railways, ferry routes, and public transportation.
- [Roads](https://docs.overturemaps.org/schema/concepts/by-theme/transportation/roads/) In the Overture transportation theme, a road is any kind of road, street or path, including a dedicated path for walking or cycling, but excluding a railway. Road segments comprise the majority of ground-based transportation segments. Roads are modeled using segment features with the subtype property value set to the value road.

## Current Roadmap

### API Roadmap

- [x] **[./Places](./api-endpoints/places)** endpoint for Overture Maps 'Place' Theme
- [x] **[./Places/Brands](./api-endpoints/places-brands)**  endpoint
- [x] **[./Places/Categories](./api-endpoints/places-categories)** endpoint
- [x] **[./Places/Countries](./api-endpoints/places-countries)** endpoint
- [ ] /Places/Buildings endpoint - very expensive dataset in BigQuery so will require sharding by country and optimizing
- [ ] /Addresses endpoint for Overture Maps 'Address' Theme
- [ ] /Buildings endpoint for Overture Maps 'Building' Theme
- [ ] /Transportation & Roads endpoint sfor Overture Maps 'Transportation' Theme
- [ ] /Divisions endpoint for Overture Maps 'Division' Theme
- [ ] /Base endpoint for Overture Maps 'Base' Theme

## Future Roadmap

As new Overture Maps data themes are released, we will add endpoints to cover them.

## API Design

Response objects should be as close to the Overture Schema as possible, and use the `ext_` prefix for any additional fields. This allows us to easily map the response to the schema, and also allows us to add additional fields without breaking the schema.

### Extras

For any extra fields we add such as counts of the Places, Brands and Categories by Country, or number of Places (store lcoations) by Brand we will add these using the recommended `ext_` prefix to the field name e.g. `ext_counts`

### Query Parameters

Request parameters should use the Overture fields for reference, with underscore separators for filtering by nested fields. For example, `brand_wikidata` for filtering by `brand.wikidata`.

Where a filter is a name that could be used to filter against multiple fields, we should use the `name` field. For example, `brand_name=McDonalds` should filter against `brand.names.primary` and `brand.names.common`.

### Security

OWASP Top 10 security risks should be considered when designing the API

### Cost control

Rate limiting and caching should be used to control costs. We can use the free tier for Cloud Run and Cloud Storage to cache the data for faster response times. In production you should consider using Redis instead of Cloud storage for caching, and migrating the parts of the dataset you need to a private BigQuery dataset or a different database for speed and cost, especially for building shapes

### Strictness

As this is an educational API we should stick to the principle of being flexible in what we accept and strict in what we return. This means we should accept a wide range of input parameters, but return a strict response format.
