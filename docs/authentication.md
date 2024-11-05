---
sidebar_position: 3
---

# Authentication

## Demo Key Usage

The API requires an API key to be passed in the header of each request as the `x-api-key` header. For General API usage, you can use the following key:

```
x-api-key: DEMO-API-KEY
```

This will limit the number of requests you can make to the API and the available endpoints, but it is enough to get started and see how the API works.


## Cloud Service

The API in the example requests is a cloud service, so you don't need to worry about setting up servers, databases, or any other infrastructure. You can just start using the API right away.

However this is an expensive service to provide so whilst we are happy to pick up the bill for the demo, we will need to charge for usage of the expensive endpoints like the `./buildings` endpoint, and including building shapes geometry in the `./places` response.

If you would like to use the API for a commercial project, please [contact us](mailto:aden@thatapicompany.com) to discuss pricing.

## Self-Hosted

If you want to run the API on your own infrastructure, you can do so by following the instructions in the [Deploy to GCP](./deploy-to-gcp) section.

The to give each yof your users API Keys, you can use the [API Key Management](./api-key-management) section to create and manage API keys for your users, add rate-limiting, and other security features.
