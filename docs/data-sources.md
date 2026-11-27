---
sidebar_position: 5.4
title: Data sources and licences
sidebar_label: Data sources and licences
description: Where the data in the Overture Maps API comes from, the licence each part carries, and the credit to show when you use it.
---

# Data sources and licences

Most of what the API returns is Overture Maps data. A few fields are added from other open sources. Any field we add has a name starting with `ext_`, so you can always tell the two apart.

| Data | Fields | Source | Licence |
| --- | --- | --- | --- |
| Places, buildings, addresses, divisions, base, transportation | Everything without an `ext_` prefix | [Overture Maps Foundation](https://overturemaps.org) | Varies by theme. Places are mostly CDLA Permissive 2.0. See [Overture's attribution guide](https://docs.overturemaps.org/attribution/). |
| Brand details | `ext_brand` | [Wikidata](https://www.wikidata.org) | CC0 |
| Opening hours | `ext_opening_hours` | [All The Places](https://www.alltheplaces.xyz/) | CC0 |

## What you need to credit

- **Overture data:** follow [Overture's attribution guide](https://docs.overturemaps.org/attribution/). Each place also lists its own sources and their licences in its `sources` field.
- **CC0 fields (`ext_brand`, `ext_opening_hours`):** no credit is required. A mention of Wikidata or All The Places is welcome.

Fields the API computes for convenience, such as `ext_name` and `ext_distance`, are derived from the Overture record and carry its licence.

This page describes the sources. It is not legal advice about your use of the data.
