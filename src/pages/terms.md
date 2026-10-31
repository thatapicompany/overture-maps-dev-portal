---
title: Terms of Service and Data Licence
description: The terms for the hosted Overture Maps API. The data is open, and we add no restrictions to it beyond Overture's own licences. What paid plans cover, how to credit the data, and what we ask of you.
---

# Terms of Service and Data Licence

_Last updated: 1 November 2026_

:::info Summary at a glance
- **The data is open, and we keep it that way.** We don't own the Overture data or add restrictions to it. Once you have results from the API, Overture's open licences are the only rules on what you do with them.
- **Our terms cover the Service**, meaning access to the API, not the data. Free plans are for non-commercial projects. Paid plans cover commercial use of every kind.
- **On a paid plan you can** build the API into anything you sell, store results permanently, and show, export or redistribute them to your users and customers, including in a multi-customer SaaS product.
- **The only things we ask you not to do** are share your API keys, resell access to the API itself, or get around its limits.
- **Credit is light.** For places data, Overture's licences mostly ask only that you include the licence text if you pass the data itself on. See [Attribution](#attribution).
- **Overture is the source of truth for licensing.** Our summaries link to the Overture Maps Foundation's own pages, and if they ever differ, [Overture's](https://docs.overturemaps.org/attribution/) apply.
- **No email addresses** are in the data. Websites and phone numbers are included where Overture has them.
- **The data comes as-is** and can be out of date. Using it lawfully, including any marketing to the businesses in it, is up to you.
:::

## Who we are and what these terms cover {#who-we-are}

The hosted Overture Maps API at `api.overturemapsapi.com`, the account portal, the API console, the demos and this documentation site (together, **the Service**) are run by **ThatAPICompany Inc.**, a Delaware corporation (**we**, **us**).

These terms apply when you create an account, use an API key (including the public demo key) or otherwise use the Service. If you use the Service for an organisation, you accept them on its behalf.

They cover the hosted Service only. If you run the API code from GitHub on your own infrastructure, these terms don't apply to that deployment.

## The data is yours to use {#the-data}

The Overture Maps data is published by the [Overture Maps Foundation](https://overturemaps.org/) under open licences, set out on its [Attribution and Licensing page](https://docs.overturemaps.org/attribution/). We serve it. We don't own it, and we don't add any restrictions of our own to it.

That means:

- **What you do with results is governed by Overture's licences alone**, not by your plan. Store them, change them, combine them, publish them or build on them, as those licences allow. The licences are set out in [The data and its licences](#data-licences).
- **This applies on every plan, and after you leave.** If you stop paying, close your account or change plans, you keep everything you've already retrieved.
- **The same goes for the fields we add**, such as brand details joined from Wikidata. Wikidata's data is CC0 1.0 (public domain). Brand names and logos may be trademarks of their owners, and logo images can carry their owners' rights. Using them to identify a business is normal, but you don't get any rights in the marks themselves.

## Using the Service {#licence}

Your plan sets how you can use the Service, meaning the API, your keys and your allowances:

| Plan | Use of the Service |
| --- | --- |
| Demo key | Trying the API out and building prototypes. |
| Free | Non-commercial projects: personal, learning, research, open-source, non-profit and evaluation. |
| Premium, Growth, Scale | Any commercial use, as described in [What you can build](#what-you-can-build). |
| Custom | As agreed in writing. A signed agreement overrides these terms where they differ. |

Allowances, rate limits and plan features are on the [pricing page](/pricing) and in [Usage limits](/docs/limits).

## What you can build on a paid plan {#what-you-can-build}

Pretty much anything. A paid plan covers using the API in:

- products and services you sell, and your business's own internal work;
- SaaS products where many customers each have their own workspace, and where your product calls the API when your users search;
- databases, CRMs and data warehouses, where you keep results for as long as you like and cache them to save requests;
- exports, downloads, datasets and derived products such as maps, analytics, scores and reports, which you can give or sell to your customers.

Your customers can keep, edit, annotate, export and pass on the records they get through your product, just as you can.

To keep the Service running for everyone, we ask only three things:

- **Keep your API keys to yourself.** Don't publish them or hand them to people outside your organisation.
- **Don't resell access to the API itself.** For example, don't give your customers our keys or put a thin wrapper around our endpoints and sell it as an API. Reselling the *data*, or a product built on it, is fine.
- **Don't get around limits**, for example by spreading one product's traffic across several accounts or Free keys.

If you're not sure whether something is covered, [ask us](/contact). The answer is usually yes.

## The data and its licences {#data-licences}

Every record lists where it came from, with its licence, in `sources[]`. The licences by theme are:

| Theme | Licence | On Overture's site |
| --- | --- | --- |
| Places | Set per data provider. Most is CDLA Permissive 2.0, Foursquare's contribution is Apache 2.0 and AllThePlaces' is CC0 1.0. | [Licences and credits](https://docs.overturemaps.org/attribution/#places) · [Guide](https://docs.overturemaps.org/guides/places/) |
| Addresses | Set by each country's source, from CC0 1.0 and CC BY 4.0 to national open licences. | [Licences and credits](https://docs.overturemaps.org/attribution/#addresses) · [Guide](https://docs.overturemaps.org/guides/addresses/) |
| Buildings | ODbL 1.0 | [Licences and credits](https://docs.overturemaps.org/attribution/#buildings) · [Guide](https://docs.overturemaps.org/guides/buildings/) |
| Divisions | ODbL 1.0 | [Licences and credits](https://docs.overturemaps.org/attribution/#divisions) · [Guide](https://docs.overturemaps.org/guides/divisions/) |
| Transportation | ODbL 1.0 | [Licences and credits](https://docs.overturemaps.org/attribution/#transportation) · [Guide](https://docs.overturemaps.org/guides/transportation/) |
| Base | ODbL 1.0 | [Licences and credits](https://docs.overturemaps.org/attribution/#base) · [Guide](https://docs.overturemaps.org/guides/base/) |

**The Overture Maps Foundation is the source of truth.** Its [Attribution and Licensing page](https://docs.overturemaps.org/attribution/) lists every data source with its licence and required credit, and it can change with each monthly release. Our summary here is to help you get started. Where it differs from Overture's pages, Overture's pages apply.

What that means in practice:

- **Places data is about as permissive as it gets.** [CDLA Permissive 2.0](https://cdla.dev/permissive-2-0/) lets you use, change and share the data commercially. Its only condition is that when you share the data itself, you include the licence text with it. Anything you compute from the data, such as an analysis or a model, has no conditions at all. Apache 2.0 data (Foursquare) can be redistributed with a copy of the [licence](https://www.apache.org/licenses/LICENSE-2.0) and Foursquare's [notice file](https://opensource.foursquare.com/places-notice-txt/). CC0 data has no conditions.
- **Addresses** follow their sources. Many are CC0, and some CC BY sources ask for a credit. Overture lists each country's source, licence and credit under [Addresses](https://docs.overturemaps.org/attribution/#addresses).
- **ODbL themes** (buildings, divisions, transportation and base) need an OpenStreetMap credit when you show them. If you publicly distribute a database derived from them, the [ODbL](https://opendatacommons.org/licenses/odbl/) asks you to share that database under the ODbL too. Showing the data on a map or in an app is a "produced work", which only needs the credit.

## Attribution {#attribution}

We don't require any credit to us.

What the data licences ask for depends on what you use. This is a summary of Overture's [Attribution and Licensing page](https://docs.overturemaps.org/attribution/), which has the exact wording for each source and takes precedence:

- **Places only:** if you pass the data on to others, for example as an export or a dataset, include the licence text, or a link to it, with the data. Keeping each record's `sources[]` field does most of this for you. Showing places in your app needs no credit under CDLA Permissive 2.0, although a line like "Data: Overture Maps Foundation" is good practice. Some providers ask for a credit, listed under [Places](https://docs.overturemaps.org/attribution/#places).
- **Buildings, divisions, transportation or base:** wherever you show them, credit "© OpenStreetMap contributors, Overture Maps Foundation". Some of these themes also include other sources, such as Esri or Google Open Buildings, listed on Overture's page under [Buildings](https://docs.overturemaps.org/attribution/#buildings) and the other themes.
- **Addresses:** check `sources[]` and the country's entry under [Addresses](https://docs.overturemaps.org/attribution/#addresses), because some sources ask for a credit.

## Personal data and marketing {#personal-data}

Some business listings include personal data. A sole trader's listing, for example, can name a real person and carry their phone number. The data is open, but privacy and marketing laws still apply to how you use it. You, and your customers if you build a product for others, are responsible for following the laws that apply to you. Examples include the GDPR and UK GDPR, the UK's PECR, the US CAN-SPAM Act and TCPA, and Australia's Privacy Act and Spam Act.

A few practical points:

- **A listing isn't permission** to call, text or email a business. The rules on unsolicited marketing are set where the business is based.
- **There are no email addresses** in the data. It includes websites and phone numbers where Overture has them.
- **If someone asks you to correct or remove their listing**, we'd encourage you to do it in your copy. Errors in the source data can be reported to the [Overture Maps Foundation](https://overturemaps.org/).

## Acceptable use {#acceptable-use}

Don't use the Service to break the law, send spam, harass or track individuals, or attack, overload or get around the security of the Service.

## Usage limits and fair use {#fair-use}

Each plan has a monthly request allowance and a per-minute rate limit, enforced by the API and described in [Usage limits](/docs/limits). Some queries, such as country-wide searches, cost far more to serve than others. If one account's usage is far beyond what its plan was priced for, we'll talk to you first, and may then suggest a larger or custom plan.

## Payment, renewal and cancellation {#payment}

Paid plans are billed monthly in advance through your [account](https://account.overturemapsapi.com) and renew automatically. You can cancel at any time. Your plan then runs to the end of the period you've paid for, and we don't refund part months. If we change a plan's price, we'll give you at least 30 days' notice by email before it applies to you. Prices exclude any taxes that apply.

## No warranty {#no-warranty}

The Service and the data are provided **as is** and **as available**. Overture data is compiled from many sources and can be incomplete, out of date or wrong. Places can be closed, misplaced or miscategorised. We don't promise the Service will be uninterrupted or error-free, or that the data suits any particular purpose. Don't rely on it where an error could cause injury or serious loss, such as emergency response or safety-critical navigation.

## Liability {#liability}

To the extent the law allows:

- we aren't liable for indirect or consequential loss, or for lost profits, revenue, data or goodwill;
- our total liability to you for all claims relating to the Service is limited to the fees you paid us in the 12 months before the claim arose, or US$100 if you're on the Free plan.

Nothing in these terms excludes or limits rights or liability that can't be excluded by law, including rights under the Australian Consumer Law.

You agree to cover our reasonable losses and costs from third-party claims that arise from your breach of these terms, or from unlawful use of the data by you or your customers.

## Suspension and termination {#termination}

You can stop using the Service and close your account at any time. We may suspend or close an account that breaks these terms, puts the Service at risk, or doesn't pay. Where it's practical, we'll warn you first and give you a chance to fix the problem. Whatever the reason an account closes, you keep the data you've already retrieved, under its open licences.

## Changes to these terms {#changes}

We may update these terms. We'll post changes on this page with a new date, and email paid accounts at least 30 days before any change that reduces what you can do. If you keep using the Service after a change applies, you accept the updated terms.

## Governing law {#governing-law}

These terms are governed by the laws of the State of Delaware, USA, and the courts of Delaware have jurisdiction over any dispute about them.

## Contact {#contact}

Questions about these terms, or whether your use is covered: [aden@thatapicompany.com](mailto:aden@thatapicompany.com) or our [contact page](/contact).

See also our [Privacy Policy](/privacy-policy).
