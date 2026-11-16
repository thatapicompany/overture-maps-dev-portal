---
sidebar_position: 6
title: Filter Overture places by category
description: Choose the right category filter for Overture Maps places. How the taxonomy filter matches a whole branch, how categories matches exact values and basic_category, how to combine them, and the gotchas. Worked example around Tompkins Square Park, New York.
keywords:
  - overture maps categories
  - overture places taxonomy filter
  - overture basic_category
  - filter points of interest by category api
  - overture maps places api
---

# Filter Overture places by category

Overture removed the old `categories` property from its places data in September 2026 and now describes every place three ways: a `taxonomy` with a full hierarchy, a short `basic_category`, and (in this API) a `categories` field kept for compatibility. Pick the wrong one and your "restaurants" list quietly misses half the restaurants. With the raw release you would work this out in DuckDB against the GeoParquet. With the Overture Maps API it's a query parameter, and the `Pagination-Count` header tells you exactly what each choice returns.

This guide compares the filters around **Tompkins Square Park in New York**. New York is one of the demo key's cities, so every request below works as written with `DEMO-API-KEY`. Swap in your own coordinates and [your own key](https://www.overturemapsapi.com) when you're ready to go anywhere else.

![Places within 800 m of Tompkins Square Park, New York, coloured by Overture's 13 top-level taxonomy groups, with a count for each group](/img/guides/filter-overture-places-by-category.png)

<sub>The 13 top-level groups within 800 m, counted from live `/places` responses. Dots are the 25 nearest places in each group. Map: OpenFreeMap, © OpenMapTiles, data © OpenStreetMap contributors.</sub>

## What you'll build

A clear rule for every category filter you write:

- `taxonomy` for a whole branch, from "all food and drink" down to "every Asian restaurant"
- `categories` for exact values, including Overture's simplified `basic_category`
- comma-separated lists for "this or that", and two parameters for "this and that"
- a small TypeScript helper that counts what a filter returns before you ship it

## Step 1: Read a place's category fields

Ask for one place and only its category fields with `includes`:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'lat=40.7265' -d 'lng=-73.9815' -d 'radius=800' -d 'name_prefix=ninth' -d 'limit=1' \
-d 'includes=names,categories,basic_category,taxonomy'
```

```json
{
  "properties": {
    "names": { "primary": "Ninth Street Espresso" },
    "categories": { "primary": "coffee_shop", "alternate": [] },
    "basic_category": "coffee_shop",
    "taxonomy": {
      "primary": "coffee_shop",
      "hierarchy": ["food_and_drink", "non_alcoholic_beverage_venue", "coffee_shop"],
      "alternates": []
    }
  }
}
```

`taxonomy.primary` is the place's own category. `taxonomy.hierarchy` is the path from one of 13 top-level groups down to it. `basic_category` is a coarser label: Overture's [taxonomy guide](https://docs.overturemaps.org/guides/places/taxonomy/) describes about 280 of them, meant for map icons and simple pickers. For a coffee shop all three agree. For most places they don't:

| Place type | `taxonomy.primary` | `basic_category` | `hierarchy` |
| --- | --- | --- | --- |
| Ramen | `ramen_restaurant` | `restaurant` | `food_and_drink > restaurant > asian_restaurant > ramen_restaurant` |
| Bakery | `bakery` | `casual_eatery` | `food_and_drink > casual_eatery > bakery` |
| Café | `cafe` | `cafe` | `food_and_drink > casual_eatery > cafe` |

## Step 2: Broad filters with a top-level group

`taxonomy` matches a place's own category **or any ancestor**, so a top-level group returns everything beneath it. Read the total from the `Pagination-Count` header and you don't need to download the places at all:

```bash
curl -s -D - -o /dev/null -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/places' \
-d 'lat=40.7265' -d 'lng=-73.9815' -d 'radius=800' -d 'taxonomy=food_and_drink' -d 'limit=1' \
| grep -i pagination-count
```

```
pagination-count: 1727
```

Here are all 13 groups within 800 m of the park:

| Group | Places |
| --- | --- |
| `food_and_drink` | 1,727 |
| `services_and_business` | 717 |
| `shopping` | 559 |
| `lifestyle_services` | 337 |
| `health_care` | 231 |
| `arts_and_entertainment` | 229 |
| `sports_and_recreation` | 170 |
| `community_and_government` | 140 |
| `cultural_and_historic` | 129 |
| `education` | 124 |
| `travel_and_transportation` | 83 |
| `lodging` | 41 |
| `geographic_entities` | 8 |

The search with no category filter returns 4,582 places. The groups add up to 4,495, because a few places carry no taxonomy, so a group filter never returns quite everything. [Profile a neighbourhood](./profile-a-neighbourhood) turns these counts into shares and compares two areas.

## Step 3: Narrow down the same branch

The same parameter works at any depth. Each step down the restaurant branch returns a subset of the one above:

| Filter | Places |
| --- | --- |
| `taxonomy=food_and_drink` | 1,727 |
| `taxonomy=restaurant` | 1,011 |
| `taxonomy=asian_restaurant` | 292 |
| `taxonomy=east_asian_restaurant` | 174 |
| `taxonomy=japanese_restaurant` | 103 |
| `taxonomy=ramen_restaurant` | 14 |

Watch where things actually sit. `ramen_restaurant` hangs directly off `asian_restaurant`, not off `japanese_restaurant`, so `taxonomy=japanese_restaurant` leaves out all 14 ramen places. If your "Japanese" chip should include ramen, ask for both: `taxonomy=japanese_restaurant,ramen_restaurant` returns 117.

The same thing happens with coffee. `coffee_shop` lives under `non_alcoholic_beverage_venue`, while `cafe` lives under `casual_eatery`, so no single branch below `food_and_drink` holds both.

## Step 4: Exact filters with categories

`categories` doesn't follow the hierarchy. It matches a place whose own category **or** `basic_category` equals the value you pass. That makes it a quick way to filter by Overture's simplified labels:

| Value | `taxonomy=` (branch) | `categories=` (exact or basic) |
| --- | --- | --- |
| `ramen_restaurant` | 14 | 14 |
| `japanese_restaurant` | 103 | 58 |
| `asian_restaurant` | 292 | 12 |
| `restaurant` | 1,011 | 1,014 |
| `casual_eatery` | 288 | 216 |
| `lodging` | 41 | 16 |

Read the rows like this:

- **Leaf categories** such as `ramen_restaurant` give the same answer either way.
- **Middle branches** such as `asian_restaurant` differ sharply. `categories=asian_restaurant` returns only the 12 places tagged with exactly that value, not the sushi, Indian and Thai places beneath it.
- **Basic categories** such as `restaurant` look similar but aren't the same set. `categories=restaurant` matches every place whose `basic_category` is `restaurant`, so nearly every restaurant type comes back. `categories=casual_eatery` returns ice cream shops, delis, diners and bakeries, because those carry `basic_category: casual_eatery`, but it misses cafés, which sit in the `casual_eatery` branch with their own `basic_category` of `cafe`.

So use `taxonomy` when you mean "this kind of place and everything under it", and `categories` when you want a specific value or Overture's own simple grouping.

## Step 5: Combine filters

Commas inside one parameter mean **or**:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'lat=40.7265' -d 'lng=-73.9815' -d 'radius=800' -d 'categories=coffee_shop,cafe'
```

That returns 116 places: the 61 coffee shops plus the 55 cafés. `taxonomy=food_and_drink,shopping` likewise returns 2,286, the two group totals added together.

Two different parameters mean **and**. `taxonomy=food_and_drink&categories=cafe` returns the same 55 cafés, and `taxonomy=shopping&categories=cafe` returns none. Use this to scope an exact value to a branch, or stack it with other filters such as `has_contact` and `min_confidence` described on the [places endpoint page](../api-endpoints/places).

## Step 6: A filter you can check

Values are lower-case `snake_case`, and the API doesn't reject ones it doesn't know. `taxonomy=Food_And_Drink` and `taxonomy=not_a_real_thing` both return `200` with an empty list and a `Pagination-Count` of 0. A typo looks exactly like an empty neighbourhood, so count before you trust a filter:

```typescript
type CategoryFilter =
  | { taxonomy: string[] } // a whole branch, any depth
  | { categories: string[] }; // exact category or basic_category

const API = "https://api.overturemapsapi.com";
const HEADERS = { "x-api-key": "YOUR-API-KEY" };

export async function countPlaces(
  lat: number,
  lng: number,
  filter: CategoryFilter,
  radius = 800,
): Promise<number> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
    limit: "1",
  });
  if ("taxonomy" in filter) params.set("taxonomy", filter.taxonomy.join(","));
  else params.set("categories", filter.categories.join(","));

  const res = await fetch(`${API}/places?${params}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Places request failed: ${res.status}`);
  return Number(res.headers.get("Pagination-Count") ?? 0);
}

const japanese = await countPlaces(40.7265, -73.9815, {
  taxonomy: ["japanese_restaurant", "ramen_restaurant"],
});
console.log(japanese); // 117 around Tompkins Square Park
```

To check a value exists before you use it, list the categories in the same area with [`/places/categories`](../api-endpoints/places-categories). Around the park it returns 652 categories with a place count for each, from `restaurant` (166) and `bar` (112) down. It lists each place's own category only, so values that exist only as a branch or a `basic_category`, such as `casual_eatery`, won't appear there. Its counts can also run a few places higher than the matching `/places` search.

## Going further

- **Build category chips.** [Build a "what's near me" feature](./build-a-whats-near-me-feature) turns these filters into a row of chips for a mobile app.
- **Compare areas.** [Profile a neighbourhood](./profile-a-neighbourhood) rolls the 13 groups up into shares and compares two parts of London.
- **Why `categories` still works.** [Overture removed categories. Your code still works.](/blog/2026/10/07/overture-removed-categories-your-code-still-works) explains how this API kept the old field alive after the September release.
- **More results.** Page through any list with `limit` and `page`. See [Pagination](/docs/pagination).

The short version: `taxonomy` for a branch, `categories` for an exact value or a basic category, commas for "or", separate parameters for "and", and a quick count before you trust any filter.
