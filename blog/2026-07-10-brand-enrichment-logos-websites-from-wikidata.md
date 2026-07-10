---
title: "Brand Logos, Websites and Corporate Parents — Wikidata Enrichment Is Live"
authors: [adenforshaw]
tags: [endpoints, places]
---

Every branded place in the API now comes with the option of a **brand logo**, the brand's **official website**, its **industry**, and its **parent organisation** — joined live from Wikidata, the free CC0 knowledge base. Brand pickers, store locators and map popups just got a visual upgrade, with zero changes required to your existing integration.

<!--truncate-->

---

## 🧱 What was already there

Overture places have always carried a `brand` object where a chain is known — but it was thin:

```json
"brand": {
  "names": { "primary": "Bank of America" },
  "wikidata": "Q487907"
}
```

A name, and a dangling Wikidata QID that pointed at a rich open dataset... which you had to go and query yourself. Places also have a `websites` field, but it's **place-level** — that one branch's page, often missing or inconsistent across a chain.

## ✨ What's there now

That QID is now resolved for you. Over **1.5 million branded places** across ~3,000 chains link to Wikidata, and the API joins them automatically:

### `/places/brands` — enriched by default

No new parameters. Every brand with a known QID now includes the extra fields:

```bash
curl "https://api.overturemapsapi.com/places/brands?lat=40.7128&lng=-74.0060&radius=1000" \
  -H "x-api-key: YOUR_API_KEY"
```

```json
{
  "names": { "primary": "Bank of America" },
  "wikidata": "Q487907",
  "ext_wikidata_label": "Bank of America",
  "ext_logo_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Bank%20of%20America%20logo.svg",
  "ext_website": "https://www.bankofamerica.com/",
  "ext_industry": "financial sector",
  "ext_counts": { "places": 12, "brands": 1 }
}
```

Logo URLs are Wikimedia Commons `Special:FilePath` links — append `?width=200` and Commons serves a resized image, so you can drop them straight into an `<img>` tag.

### `/places` — opt-in with `enrichment_fields=brand`

Place responses stay exactly as they were unless you ask. Pass `enrichment_fields=brand` and branded places gain an `ext_brand` object:

```bash
curl "https://api.overturemapsapi.com/places?lat=40.7128&lng=-74.0060&radius=1500&brand_wikidata=Q487907&enrichment_fields=brand" \
  -H "x-api-key: YOUR_API_KEY"
```

```json
"ext_brand": {
  "label": "Bank of America",
  "logo_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Bank%20of%20America%20logo.svg",
  "website": "https://www.bankofamerica.com/",
  "industry": "financial sector"
}
```

We kept this opt-in deliberately: place result sets can be large and the same brand repeats on every branch, so you only pay the payload cost when you want the data.

## 📊 Field-by-field: new vs already available

| Field | Was it in Overture before? |
|---|---|
| `ext_logo_url` | **No** — nothing like it anywhere in the data |
| `ext_parent` | **No** — no corporate hierarchy existed |
| `ext_wikidata_label` | **No** — `brand.names.primary` is often localised (e.g. 日本郵便); this gives you the English name (Japan Post) |
| `ext_website` | Partially — places had *place-level* `websites`; this is the brand's canonical site, consistent chain-wide (97.8% coverage) |
| `ext_industry` | Overlaps — the place `taxonomy` tells a similar story per location; this is the brand-level view |

Coverage, measured across all ~3,000 linked brands: websites on **97.8%**, logos on brands covering **75% of branded places** (the big chains all have them), industry on 74% of branded places.

## 🔍 When you won't see it

Enrichment appears exactly where Overture links a place to a Wikidata QID (`brand.wikidata`). Plenty of places carry a brand *name* but no QID — those keep working exactly as before, just without the ext_ fields. As Overture's brand linkage improves each monthly release, enrichment coverage grows automatically: we re-sync against Wikidata every month.

## ⚖️ Licensing

Wikidata data is **CC0** — no attribution required, commercial use welcome. Logo image files live on Wikimedia Commons and, like all logos anywhere, trademark law governs how you use them in your product; the API gives you the URL, appropriate usage is up to you.

## 🚀 Try It Now

Live today on your existing API keys — no changes needed:

* Grab a key at the [Overture Maps Developer Portal](https://portal.overturemapsapi.com)
* Browse the [API endpoint docs](https://overturemapsapi.com/docs/category/api-endpoints)
* Questions or a use case we should support next? [Get in touch](https://overturemapsapi.com/docs/support)
