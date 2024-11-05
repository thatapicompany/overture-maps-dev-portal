---
sidebar_position: 1
---

# What is the Overture Maps Data and Why does it need an API?

**[Overture Maps Foundation](https://overturemaps.org/)** is a phenomenal non-profit organization that provides free and open-source maps data to the public. It's made available as downloadable data dumps that are easy to query with tools like Athena, and as public datasets inside of BigQuery, Snowflake marketplace.

However, some experience of SQL is needed to access that data expecially to prevent large bills are the datasets are naturally very large, so experience in working with large datasets is needed to prevent running up huge bills.

Enter this Unofficial Overture Maps API - a simple RESTful API that allows you to query the data in a way any web developer can understand, and run it themselves without needing to know how to use Athena or BigQuery in a cost optimized way.

It is available as a Cloud service to test with, and as a self-hosted version that you can run on your own infrastructure.

## Getting Started

Get started by **making API Requests** after **[Trying the Demo](../demo)** and reviewing **[API Documentation](../reference)**.

Or **Deploy to your own infrastructure** with the **[GCP / BigQuery](../category/deploy-to-gcp)**.

### Making API requests

Make some test requests to the API to see how it works e.g.

Download all the US Starbucks locations as a JSON file:

```bash
curl -o all-starbucks-us.json -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://overture-maps-api.thatapicompany.com/places'  \
-d 'country=US'  -d 'brand_name=Starbucks'
```

Or see 10 Tesco UK Supermarket locations in your terminal:

```bash
curl -H "x-api-key: DEMO-API-KEY" -X GET -G 'https://overture-maps-api.thatapicompany.com/places' \
-d 'country=GB'  -d 'brand_name=Tesco' -d 'limit=10'
```

... and then explore the other **[./places endpoints](./api-endpoints/)** and make API requests for Brands and Categories of places for each Country, or search by latitude and longitude.

Then build something cool with the data!

### Deploying to your own infrastructure

- [Deploying to Google Cloud Platform](./docs/category/deploy-to-gcp/) - GCP has a $400 free credit for new users and this is enough to run the API and get a feel for how it works.
- AWS / Athena / Snowflake - Coming soon - please [contact us](mailto:aden@thatapicompany.com) if you would like to help with this.

### Who are we & why did we make it?

We are **[ThatAPICompany](https://thatapicompany.com/)** - a specialist dev Agency helping clients make amazing APIs that get used, and creating public APIs like TheCatAPI.com to help educate the next generation of developers how to use APIs to make amazing things!

We have built this API to make it easier for developer of any skill level to access the Overture Maps data, and to help the Overture Maps Foundation to get more people using their data.
