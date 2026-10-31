---
title: "Overture Removed categories. Your Code Still Works."
description: Overture's schema v2.0.0 removed the places categories property in favour of taxonomy and basic_category. The Overture Maps API keeps categories working. Here's what changed, what to watch for, and how to move to taxonomy.
authors: [adenforshaw]
tags: [places, endpoints]
image: /img/blog/overture-removed-categories.png
---

Overture's September 2026 release (`2026-09-23.0`, schema v2.0.0) removed the `categories` property from places entirely. If you query the raw GeoParquet, every query that touched `categories` needed rewriting. If you use the Overture Maps API, nothing broke: the `categories` field and filter still work, now derived from Overture's new `taxonomy`.

![Overture's schema v2.0.0 record without categories, next to the API response for the same place with categories still present](/img/blog/overture-removed-categories.png)

<!--truncate-->

## What changed upstream

Since schema v2.0.0, a place carries two category fields instead of three:

- **`taxonomy`**: the primary category, its full path from the top-level group down (`hierarchy`), and any alternates.
- **`basic_category`**: a coarser label, handy for icons and map legends.

The old `categories` object (`primary` plus `alternate`) is gone from the data.

## What the API does

We kept `categories` in every `/places` response and kept the `categories` filter, both derived from `taxonomy`. Here's a coffee shop in Whitechapel, London, as the API returns it today:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'lat=51.5145' -d 'lng=-0.0754' -d 'radius=300' -d 'categories=coffee_shop' -d 'limit=1'
```

```json
"names": { "primary": "Black Sheep Coffee" },
"categories": { "primary": "coffee_shop", "alternate": [] },
"basic_category": "coffee_shop",
"taxonomy": {
  "primary": "coffee_shop",
  "hierarchy": ["food_and_drink", "non_alcoholic_beverage_venue", "coffee_shop"],
  "alternates": []
}
```

[`/places/categories`](/docs/api-endpoints/places-categories) now lists taxonomy values, so the list you pick filters from matches what the filter accepts.

## The one thing to check

The *values* inside `categories` now follow the taxonomy vocabulary. If your code filters on a category string that doesn't exist in the taxonomy, it now matches nothing, with no error.

`categories` is an exact match. Within 1 km of Bondi Beach, `categories=cafe` returns a full page of 25, while `categories=cafes` returns none. If a filter that used to return results now comes back empty, check the string against [`/places/categories`](/docs/api-endpoints/places-categories) first.

## Why taxonomy is the better filter

`taxonomy` matches a place's primary category **or any ancestor in its hierarchy**, so one broad value covers everything beneath it. `categories` only matches the exact value. Around Bondi (1 km), the same value gives very different results:

| Filter | Places returned |
| --- | --- |
| `categories=non_alcoholic_beverage_venue` | 2 |
| `taxonomy=non_alcoholic_beverage_venue` | 22 |

The taxonomy search picks up every coffee shop, juice bar and tea room, because each sits under `non_alcoholic_beverage_venue` in its hierarchy. The categories search only finds the two places whose own category is that value.

## Moving over

1. **Filters:** swap `categories=` for `taxonomy=` wherever you mean "this kind of place and everything under it". Keep `categories=` only where you want an exact category.
2. **Display:** read `taxonomy.primary` for the specific label, or `basic_category` for a coarser one. Both are on every place.
3. **Pickers:** build category dropdowns from [`/places/categories`](/docs/api-endpoints/places-categories), which accepts `lat`, `lng` and `radius`, so you only offer categories that exist near the user.

```typescript
// Before: exact category strings
const before = new URLSearchParams({ lat, lng, radius: "1000", categories: "coffee_shop,cafe" });

// After: one hierarchy-aware value
const after = new URLSearchParams({ lat, lng, radius: "1000", taxonomy: "non_alcoholic_beverage_venue" });
```

There's no deadline to switch. `categories` stays in the API. But `taxonomy` is where Overture is putting its effort, and it does more with less.

The full release notes are in our [changelog](/docs/changelog) and in [Overture's 2026-09-23 release post](https://docs.overturemaps.org/blog/2026/09/23/release-notes/).
