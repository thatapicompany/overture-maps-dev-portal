---
title: "An open-data alternative to the Google Places API"
description: "Overture Maps places through a REST API: search by location, category, brand or country, keep and store what you retrieve, and pay a flat monthly price. What it does, what it lacks, and how to use both."
---

# An open-data alternative to the Google Places API

If you need places on a map, a list of businesses, or a "what's near me" search, and you want to store the results in your own database, Overture Maps data may be all you need. The Overture Maps API serves the Overture Maps Foundation's open places data, more than 90 million of them, through one REST endpoint.

It is a different product from Google's, with different strengths. This page sets out where each fits.

```bash
curl -H "x-api-key: DEMO-API-KEY" -G 'https://api.overturemapsapi.com/places' \
  -d 'lat=40.7128' -d 'lng=-74.0060' -d 'radius=1500' -d 'categories=pharmacy' -d 'has_contact=website'
```

<p>
  <a class="button button--primary button--lg" href="https://app.overturemapsapi.com">Get a free API key</a>{' '}
  <a class="button button--secondary button--lg" href="/explorer">See the data first</a>
</p>

## Where Overture fits well

- **You want to keep the data.** Results are open data. Store them, join them to your own records, export them and publish them, as [Overture's licences](/terms#data-licences) allow. That holds on every plan and after you cancel.
- **You need lists, not single lookups.** One request returns up to 25,000 places. A paid plan can pull every place of a category or brand across a country, and the [account app](https://app.overturemapsapi.com/exports) downloads the same as a CSV.
- **You want a predictable bill.** Plans are a fixed monthly price for a number of requests, from $25 a month. There is no per-field pricing. See [pricing](/pricing).
- **You want to see how it works.** The API is [open source](https://github.com/thatapicompany/overture-maps-api), and the data is published monthly by the Overture Maps Foundation, which was launched by Amazon Web Services, Meta, Microsoft and TomTom ([about Overture](/docs/what-is-overture-maps)).

## Where Google is the better choice

- **Reviews, ratings and photos.** Overture has none.
- **Opening hours.** Overture places do not carry them.
- **Text search and autocomplete across everything.** Our `name_prefix` filter gives type-ahead for place names round a point, which suits a store finder. It is not a general search box for addresses and landmarks.
- **The newest businesses.** Overture is released monthly and built from contributed sources. A shop that opened last week may not be there yet.

## What each place holds

| Field | Overture Maps API |
| --- | --- |
| Name, category, address, coordinates | Yes |
| Phone, website, email, social links | Yes, where Overture has them |
| Brand, with logo and parent company | Yes, for chains matched to Wikidata |
| Confidence score and operating status | Yes |
| Stable ID across releases | Yes, the GERS ID |
| Reviews, ratings, photos, opening hours | No |

## Using both

Many products do not have to choose. Use Overture for the bulk of the work, which is search, lists, maps and your own database, and call Google for the handful of places where a user wants reviews or hours. Our guide to [joining Overture places to Google place IDs](/blog/2026/11/05/join-overture-places-to-google-place-ids) matched 114 of 120 test places in Sydney.

## Try it on your own area

The [Explorer](/explorer) shows places, brands and buildings on a map, with the API call behind each view. Coverage varies by country and category, so look at the places you care about before you commit. The Free plan gives 100 requests a month for non-commercial projects, with no card.

Google and Google Places are trademarks of Google LLC. This site is not affiliated with Google.
