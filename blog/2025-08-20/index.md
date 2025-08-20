---
slug: enriched-place-data
title: Enriched Place Data
authors: [adenforshaw]
tags: [places, pois, enriched, osm]
---


# Introducing Enriched Data in Overture Maps API

When we first launched [Overture Maps API](https://www.overturemapsapi.com), our goal was simple: make the power of the [Overture Maps Foundation](https://overturemaps.org) datasets easily accessible to developers through a modern API. The project started as an open-source codebase that anyone could deploy to Cloud Run with a free GCP account and some starter credits. That approach has been a success — developers around the world are now using the API to power location-based apps, retail search, analytics, and more.

But for many customers, the question quickly became: *what comes next?*

## Why Enriched Data?

The Overture dataset is already a huge leap forward compared to raw OpenStreetMap. Backed by contributors like Meta, Microsoft, and others, it brings consistent schema, deduplication, and global coverage. Still, we saw that real-world use cases often need **more context** than what’s available out of the box.

Think about:

* Retail chains wanting **brand metadata** (e.g. “Starbucks” vs just a coffee shop).
* Analytics teams wanting to **filter by categories** more precisely.
* Businesses needing **country-specific datasets** layered on top of Overture for compliance, reporting, or localized detail.

That’s why we’re introducing **Enriched Data**.

## How Enriched Data Works

Enriched Data builds on the core Overture Places schema by joining in additional datasets hosted inside our own infrastructure. These include proprietary or curated datasets that we’ve licensed or created, which can be matched directly to Overture’s stable `id` field for Places/POIs.

For example:

* Add **brand attributes** so you can query for every “Woolworths” in Australia or every “Whole Foods” in the US.
* Join in **government inspection datasets** or local licensing records (where available).
* Blend **open-source projects like AllThePlaces** with Overture to fill in coverage gaps and keep places fresh.

From a developer’s perspective, you don’t need to change how you use the API. You can query enriched endpoints just like you query the base dataset — and you’ll get back richer metadata.

👉 Check out the [Enriched Data documentation](https://www.overturemapsapi.com/docs/enriched-data) for full details on schemas, fields, and availability.

## Open Source + Hosted Service

We’ve kept to our original promise: Overture Maps API remains open source. Anyone can deploy it themselves to GCP using BigQuery as the backend, and take advantage of the free tier credits to get started.

But if you want the **Enriched Data** experience, that’s available only on our hosted service. This hybrid approach gives developers maximum flexibility:

* **Self-host for free** if you just need the base Overture data.
* **Use our hosted API** if you want low-latency access to global coverage, plus enriched datasets you can’t get elsewhere.

It’s the same API, same endpoints, just more powerful when you need it.

## What’s Next

Enriched Data is just the start. We’re already working on:

* **Advanced tags** for more precise categorization and filtering
* **Translations & localization** for place names and descriptions in multiple languages
* **Opening hours & dates** including seasonal variations and holiday schedules
* **Website URLs** and social media links for businesses
* **Footfall data** (country dependent) for understanding location traffic patterns
* **Photos** tied to store fronts, interiors, and POIs
* **Restaurant menus** with pricing and dietary information
* **Cross-platform conflation** to link the same place across TripAdvisor and other mapping services
* [Contact us for more...](mailto:aden@thatapicompany.com) custom enrichment options


Our vision is clear: to make Overture Maps API the go-to open + enriched location platform that balances flexibility, cost, and licensing freedom with the kind of metadata richness that unlocks enterprise use cases.

---

🚀 Ready to explore? Start with the [demo app](https://www.overturemapsapi.com/blog/demo-app) or dive into the [docs](https://www.overturemapsapi.com/docs). If you’re interested in access to enriched datasets, [get in touch with us](https://www.overturemapsapi.com/contact) — we’d love to hear what you’re building.

---

Would you like me to make this more **developer-focused** (code snippets, API response examples with enriched fields), or more **business-facing** (highlighting use cases, ROI, enterprise value)?
