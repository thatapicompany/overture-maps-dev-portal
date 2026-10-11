---
sidebar_position: 4
title: Usage limits
description: Monthly request limits, the X-Quota headers, what counts as a request, and which queries need a paid plan on the hosted Overture Maps API.
---

# Usage limits

These limits apply to the hosted API at `api.overturemapsapi.com`. If you self-host, you set your own.

## Monthly requests

Every plan includes a monthly allowance of requests. Past the allowance your requests keep working, with an `X-Quota-Warning` header, until you reach the plan's limit. At the limit the API returns `429` with `"error": "monthly_quota_exceeded"` and a `Retry-After` header, until 00:00 UTC on the 1st of next month. Your plan's numbers are in your [account](https://account.overturemapsapi.com) and in the headers below.

Every response to a key with a monthly limit carries (the demo key has none):

| Header | Meaning |
|---|---|
| `X-Quota-Plan` | Your plan |
| `X-Quota-Limit` | Monthly allowance |
| `X-Quota-Hard-Limit` | The point where requests are refused |
| `X-Quota-Used` | Requests counted so far this month |
| `X-Quota-Remaining` | Requests left before the allowance |
| `X-Quota-Reset` | When the count resets (Unix seconds, UTC) |
| `X-Quota-Warning` | Present once you are past the allowance |

The headers are exposed via CORS, so browser code can read them.

Only successful requests count. Errors (`4xx`/`5xx`), including validation errors, `403`s and `429`s, do not use up your allowance.

## Per-minute rate limit

There is also a short per-minute limit. Going over it returns `429` with a message saying so; wait a minute and retry.

## Country-level place queries

A `/places` query with a `country` and no `lat`/`lng` reads a whole country, so it is a paid-plan feature. On the Free plan, search by `lat`, `lng` and `radius` (up to 25 km); `country` still works as an extra filter alongside them. A Free key sending a country-level query gets a `403` with this explanation, and it does not count towards your allowance.

## The demo key

`DEMO-API-KEY` is for trying the API out. It covers lat/lng searches within 10 km of a few demo cities (New York, London, Paris and Bondi Beach), returns small pages, and does not support country-level queries. [Sign up](https://account.overturemapsapi.com) for a free key to search anywhere.
