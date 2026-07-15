---
sidebar_position: 1
---

# Build a local business directory

A common use of the Overture Maps API is to build a **local business discovery or directory product**: find the businesses in a place, sort them by category, and enrich them with contact details so users (or your own pipeline) can reach out or verify them.

This guide walks through that end to end. The running example builds a directory of **bakeries in France**, but every step works for any country and category — swap `country` and `categories` for your own.

## What you'll build

For a chosen country and category, you'll pull every matching business, keep only the ones you can actually contact, and get back their websites, phones, socials and location — ready to load into your own database.

## Step 1 — Find the businesses

Start with a country code (ISO 3166-1 alpha-2) and a category. Ask for a single result first to see the shape of the data:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'country=FR' -d 'categories=bakery' -d 'limit=1'
```

- **`categories`** matches the exact category. If you want a whole family of businesses (say every kind of food-and-drink venue), use **`taxonomy`** instead — it's hierarchy-aware, so `taxonomy=food_and_drink` matches bakeries, cafés, restaurants and bars in one call.
- **`min_confidence`** (default `0.5`) trades precision for recall. Lower it toward `0.4` to catch more of the long tail, raise it toward `0.8` if you only want high-confidence records. It's worth tuning against a sample for your category.

## Step 2 — You already get contact details

Contact details come back **by default** — you do not need any special parameter:

```json
"names": { "primary": "Boulangerie du Coin" },
"categories": { "primary": "bakery" },
"websites": ["https://boulangerie-du-coin.fr"],
"phones": ["+33123456789"],
"emails": [],
"socials": ["https://www.facebook.com/boulangerieducoin"],
"addresses": [{ "freeform": "12 Rue de la Paix", "locality": "Paris", "postcode": "75002", "country": "FR" }]
```

:::tip Don't use `enrichment_fields` for websites or phones
A common early mistake is adding `website` or `phone` to `enrichment_fields`. That parameter is **only** for the Wikidata brand layer (Step 5). The `websites`, `phones`, `emails` and `socials` arrays are always in the response when Overture has them.
:::

Coverage varies by country and category. In well-mapped markets, websites and phones are populated for the large majority of businesses; emails and socials are thinner. In smaller territories the total number of places is lower, so expect a shorter long tail.

## Step 3 — Keep only businesses you can verify

If your product verifies or enriches businesses via their own website (or a social page), filter to the records that actually have something to work with, using **`has_contact`**. It's comma-separated and matched with **OR**:

```bash
# bakeries with a website OR a social link
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://api.overturemapsapi.com/places' \
-d 'country=FR' -d 'categories=bakery' -d 'has_contact=website,social'
```

`website,social` is a good default: it catches businesses that use a Facebook or Instagram page instead of a dedicated site, which in many markets is most of the ones without a website. Allowed values are `website`, `phone`, `email`, `social`.

The `Pagination-Count` response header reflects the **filtered** total, so you can see how many businesses match before you pull them all.

## Step 4 — Pull the whole country

Results are paginated at up to 100 per page (`limit`), with `page` 0-indexed. The `Pagination-Count` header tells you the total, so you loop until you've collected them all:

```javascript
const base = "https://api.overturemapsapi.com/places";
const params = new URLSearchParams({
  country: "FR",
  categories: "bakery",
  has_contact: "website,social",
  min_confidence: "0.50",
  limit: "100",
  format: "geojson",
});

let page = 0;
const all = [];
while (true) {
  const res = await fetch(`${base}?${params}&page=${page}`, {
    headers: { "x-api-key": process.env.OVERTURE_API_KEY },
  });
  const batch = await res.json();
  all.push(...batch.features);

  const total = Number(res.headers.get("Pagination-Count")); // filtered total
  if (all.length >= total) break;
  page++;
}

console.log(`Collected ${all.length} bakeries with a website or social`);
```

For a **local** directory (a town or neighbourhood) rather than a whole country, swap `country` for `lat` / `lng` / `radius` and the same pagination applies.

## Step 5 — Add brand details for chains (optional)

For chain or franchise locations, add `enrichment_fields=brand` to get the brand's logo, official website, industry and parent company, sourced from Wikidata:

```json
"ext_brand": {
  "label": "Paul",
  "logo_url": "http://commons.wikimedia.org/wiki/Special:FilePath/Paul%20logo.svg",
  "website": "https://www.paul.fr/",
  "industry": "bakery"
}
```

This is handy for de-duplicating or badging chain locations, and for filling in an official website where the individual location doesn't have its own.

## Tips

- **Confidence**: sample your category at a couple of `min_confidence` levels before committing — the right threshold differs by category and country.
- **Category vs taxonomy**: use `categories` for a specific type, `taxonomy` when you want a whole branch of the hierarchy in one query.
- **Coverage**: it varies by market. If you need denser contact data in a specific country, [get in touch](/docs/support) — we're continually improving coverage.
- **Pagination**: always drive your loop off the `Pagination-Count` header rather than assuming a fixed number of pages. See [Pagination](/docs/pagination) for details.

That's the whole loop: choose a country and category, filter to the businesses you can reach, page through the country, and load the results into your own product.
