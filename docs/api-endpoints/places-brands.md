---
sidebar_position: 2
---

# GET ./places/brands

Returns every brand (retail chain, franchise, operator) present in the search area, with a count of its places — and, where the brand is linked to Wikidata, its **logo, official website, industry and parent organisation**.

Example Request to GET all Brands in the US:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places/brands'  \
-d 'country=US' 
```

## Brand Details from Wikidata

Brands with a Wikidata QID are automatically enriched — no extra parameters needed:

```json
{
  "names": { "primary": "Bank of America" },
  "wikidata": "Q487907",
  "ext_wikidata_label": "Bank of America",
  "ext_logo_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Bank%20of%20America%20logo.svg",
  "ext_website": "https://www.bankofamerica.com/",
  "ext_industry": "financial sector",
  "counts": { "places": 12 }
}
```

- `ext_logo_url` is a Wikimedia Commons link; append `?width=200` for a resized image, ready for an `<img>` tag
- `ext_parent` names the parent organisation where known
- Wikidata data is CC0 (no attribution required); logo *usage* is subject to normal trademark law
- Fields are simply absent for brands without a Wikidata link

To fetch the places of a specific brand, use `/places` with `brand_wikidata` (preferred) or `brand_name` — see [Places](./places).
