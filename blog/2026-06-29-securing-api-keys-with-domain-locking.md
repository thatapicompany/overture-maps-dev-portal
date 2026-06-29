---
title: Securing Your Overture Maps API Keys with Domain Locking
authors: [adenforshaw]
tags: [security, api-keys, domain-locking, portal]
---

We are excited to introduce **API Key Domain Locking** for the Overture Maps API! 

If you are building public-facing web applications or interactive maps, you likely expose your API key directly in client-side Javascript code. To prevent unauthorized websites from stealing your API key and using your quota, you can now restrict your key's usage to specific domains.

<!--truncate-->

---

## 🗺️ The Google Maps Analogy

If you have ever used the Google Maps Platform, you are probably familiar with **HTTP Referrer Restrictions** (e.g. restricting a key to `*.yourdomain.com/*`). 

Our domain locking feature works the exact same way. When a browser loads your web app and queries the Overture Maps API, it automatically attaches an `Origin` or `Referer` header to the outgoing HTTP request. Our API Gateway interceptor inspects this header and checks it against your allowed domains. If there is a mismatch, the request is instantly rejected with a `403 Forbidden` error.

---

## 🛠️ How to Add Domain Locks to Your Keys

Setting up domain locking is simple and takes just a few clicks in the developer portal:

1. Log into the [Overture Maps Developer Portal](https://portal.overturemapsapi.com).
2. Go to **API Keys** and edit an existing key, or click **Create Key**.
3. Under **Allowed Domains (Optional)**, enter the domain patterns you want to allow.
   * **Wildcards supported**: Use `*.example.com` to match `example.com` and all subdomains (like `maps.example.com`).
   * **Local development**: Add `localhost:3000` or `localhost:5000` to allow local testing.
4. Save your changes.

---

## 🧪 How to Test Your Domain Lock

We have launched a dedicated utility to help you test and verify your domain locks:

👉 **[domain-locking-test.overturemapsapi.com](https://domain-locking-test.overturemapsapi.com)**

1. Paste your restricted API Key into the console.
2. Click **Execute Request**.
3. **Verify Allowed Origin**: If you allowed `*.overturemapsapi.com`, you will see a green **`200 OK`** badge and the returned GeoJSON data.
4. **Verify Blocked Origin**: Change your allowed domains in the portal to `*.google.com`, wait a few seconds, and test it again. You will see a red **`403 Forbidden`** response proving that our gateway is successfully blocking unauthorized origins!

---

## 🛡️ Security Best Practices & Considerations

While domain locking is a crucial layer of defense, keep the following security practices in mind:

### 1. Server-Side Bypass
Domain locking is designed for **browser-based environments**. Because server-to-server requests (like a backend server fetching data) do not natively attach `Origin` or `Referer` headers, requests with no origin headers are permitted by default to support server callers.
* **Rule**: Never share the same API key between a public client-side web app and a secure backend service. Create separate, unrestricted keys for server tasks and keep them secret in your environment variables.

### 2. Header Spoofing
Determined attackers can easily bypass domain locking outside of the browser using tools like `curl` or Postman by spoofing the `Origin` header.
* **Rule**: Domain locking prevents **hotlinking** (other people using your keys directly on their websites). It is not a complete data-scraping defense. Pair it with **Rate Limits** in the portal to limit overall key exposure.
