---
sidebar_position: 5
---

# API Key Management

If you are self-hosting the API, you will need to manage API keys for your users. This section explains how to create and manage API keys for your users, add rate-limiting, and other security features.

## Auth API

You can use the Auth API to create and manage API keys for your users. The Auth API is a separate service that allows you to create and manage API keys for your users. You can create a **Free** account on [theAuthAPI.com](https://theAuthAPI.com) and create an Access Key for your app. You can then create any number of API keys for secure access to the API, and rate-limit them for cost control. It is the best in-class for managing API keys for your users.

- ENV VAR: 'AUTH_API_ACCESS_KEY=live_access_12345abcde'

## Hardcoded

You can also use the hardcoded API key in the code. This is not recommended for production use, but it is useful for testing and development. You can set the API key in the code and use it to access the API. This is useful for testing and development, but it is not recommended for production use and is set to limit the available endpoints due to costs that could be incurred.

Default is 'DEMO-API-KEY'
