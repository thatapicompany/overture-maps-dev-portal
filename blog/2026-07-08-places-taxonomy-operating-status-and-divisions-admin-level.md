---
title: "New in the API: Places Taxonomy, Operating Status, and Division Admin Levels"
authors: [adenforshaw]
tags: [endpoints, places, divisions]
---

Overture's 2026 schema releases brought a wave of useful new properties, and they're all live in the API today: a **hierarchical places taxonomy** you can filter by, an **operating status** on every place, **admin levels** on divisions, and **per-source licence info** across every theme. Everything is additive — your existing integrations keep working without touching a line of code.

<!--truncate-->

---

## 🗂 A Proper Taxonomy for Places

Every place now carries a `taxonomy` object alongside the familiar `categories`: the primary category, its **full hierarchy path** from the top-level bucket down, and any alternates. There's also a `basic_category` — a coarser grouping that's handy for icons and legends.

```bash
curl "https://api.overturemapsapi.com/places?lat=40.7128&lng=-74.0060&radius=1000&categories=coffee_shop&limit=2" \
  -H "x-api-key: YOUR_API_KEY"
```

```json
{
  "properties": {
    "categories": { "primary": "coffee_shop", "alternate": ["cafe", "bakery"] },
    "basic_category": "coffee_shop",
    "taxonomy": {
      "primary": "coffee_shop",
      "hierarchy": ["food_and_drink", "non_alcoholic_beverage_venue", "coffee_shop"],
      "alternates": []
    },
    "operating_status": "open"
  }
}
```

The hierarchy is the headline: you no longer need to maintain your own list of every food-related category string.

### Filter by taxonomy — including ancestors

The new `taxonomy` query parameter matches the primary category **or any ancestor in the hierarchy**. One filter value covers every descendant:

```bash
# every restaurant, café, bar, bakery... in one filter
curl "https://api.overturemapsapi.com/places?lat=40.7128&lng=-74.0060&radius=1000&taxonomy=food_and_drink&limit=50" \
  -H "x-api-key: YOUR_API_KEY"
```

The existing `categories` filter still works exactly as before — and now matches values from either vocabulary, old or new.

---

## 🚦 Operating Status

Places now include `operating_status` (e.g. `open`, `permanently_closed`, or `null` where Overture has no signals), and you can filter on it:

```bash
curl "https://api.overturemapsapi.com/places?lat=51.5074&lng=-0.1278&radius=1000&operating_status=open&limit=20" \
  -H "x-api-key: YOUR_API_KEY"
```

No more surfacing a coffee shop that closed last year.

---

## 🏛 Division Admin Levels

Division areas now expose where they sit in their country's hierarchy — `admin_level` 0 is the country, 1 the first subdivision (states, regions), 2 the next (counties), and so on — plus `is_land`, `is_territorial`, and the `division_id` linking the area to its parent division feature.

`admin_level` is also a filter, and it combines with name search:

```bash
curl "https://api.overturemapsapi.com/divisions?country=US&name=new%20york&admin_level=1" \
  -H "x-api-key: YOUR_API_KEY"
```

```json
{
  "properties": {
    "primary_name": "New York",
    "subtype": "region",
    "admin_level": 1,
    "is_land": true,
    "is_territorial": false,
    "country": "US",
    "region": "US-NY"
  }
}
```

That query now cleanly distinguishes New York **State** (`admin_level: 1`) from New York **City** and its boroughs — a distinction that used to require juggling subtypes.

---

## 📜 Source Licences Everywhere

Every feature's `sources` array now includes the `license` of each contributing dataset (e.g. `CDLA-Permissive-2.0`, `ODbL-1.0`) across places, buildings, addresses, transportation, base, and divisions. If your compliance team has ever asked "what licence is this record under?", the answer is now in the response.

---

## 🔭 Heads-Up: Overture Is Retiring `categories` in September

Upstream, Overture has deprecated the places `categories` property in favour of `basic_category` + `taxonomy`, with removal scheduled for the **September 2026 release**.

Here's our commitment: **nothing breaks for you.** The API's `categories` response field and `categories` filter are staying. When the upstream column disappears, the API derives `categories` from the taxonomy automatically — same field, same shape, no action needed on your side.

The one thing to be aware of: at that point the *values* inside `categories` shift to the new taxonomy vocabulary (they're near-identical for most common categories, as in the coffee shop example above). If you match on specific category strings, we recommend migrating those checks to the `taxonomy` field before September — it's the richer, future-proof option anyway.

---

## 🚀 Try It Now

All of this is live today on your existing API keys — no changes needed:

* Grab a key at the [Overture Maps Developer Portal](https://portal.overturemapsapi.com)
* Browse the [API endpoint docs](https://overturemapsapi.com/docs/category/api-endpoints)
* Questions or a use case we should support next? [Get in touch](https://overturemapsapi.com/docs/support)
