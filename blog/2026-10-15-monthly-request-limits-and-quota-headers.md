---
title: "Monthly Request Limits and the X-Quota Headers"
description: Every Overture Maps API plan now has a monthly request allowance, enforced in the API. How the allowance, warning and limit work, the X-Quota response headers, what counts as a request, and which queries need a paid plan.
authors: [adenforshaw]
tags: [endpoints, thatapicompany]
image: /img/blog/monthly-request-limits.png
---

Every Overture Maps API plan now includes a monthly allowance of requests, and the API itself keeps count. You'll see your usage on every response, get a warning before anything is refused, and only successful requests count. Here's how it works and how to handle it in your code.

![The monthly request allowance, the warning zone and the 429 limit, with the X-Quota headers that track them](/img/blog/monthly-request-limits.png)

<!--truncate-->

## Why we count requests

Some queries read far more data than others, and a limit in bytes is impossible to plan around: you can't tell in advance how much a query will scan. Counting requests is simple and predictable, and it keeps the Free plan sustainable.

## How the limit works

Each month runs in three stages:

1. **Within your allowance:** everything works as normal.
2. **Past your allowance:** requests still work, but every response carries an `X-Quota-Warning` header saying so.
3. **At your plan's limit:** requests return `429` with `"error": "monthly_quota_exceeded"` and a `Retry-After` header, until the count resets at 00:00 UTC on the 1st.

Each plan's allowance is on the [pricing page](https://www.overturemapsapi.com/pricing), and the full rules are in [Usage limits](https://www.overturemapsapi.com/docs/limits).

## What counts

Only successful requests count. A response with a status of `400` or above never uses up your allowance, including validation errors, `403`s and every `429`.

There's also a short per-minute rate limit, separate from the monthly count. Going over it returns a `429` that says so; wait a minute and retry.

## The headers

Every response to a key with a monthly limit carries:

| Header | Meaning |
| --- | --- |
| `X-Quota-Plan` | Your plan |
| `X-Quota-Limit` | Your monthly allowance |
| `X-Quota-Hard-Limit` | The point where requests are refused |
| `X-Quota-Used` | Requests counted so far this month |
| `X-Quota-Remaining` | Requests left before the allowance |
| `X-Quota-Reset` | When the count resets (Unix seconds, UTC) |
| `X-Quota-Warning` | Present once you're past the allowance |

They're exposed through CORS, so browser code can read them too.

## Handling it in code

Read the headers on every call, slow down once the warning appears, and treat the monthly `429` as "wait until the reset" rather than something to retry:

```typescript
export async function overture(path: string, params: Record<string, string>) {
  const res = await fetch(`https://api.overturemapsapi.com${path}?${new URLSearchParams(params)}`, {
    headers: { "x-api-key": process.env.OVERTURE_API_KEY! },
  });

  const remaining = Number(res.headers.get("X-Quota-Remaining"));
  const warning = res.headers.get("X-Quota-Warning");
  if (warning) console.warn(`Overture quota: ${warning}`);

  if (res.status === 429) {
    const body = await res.json();
    if (body.error === "monthly_quota_exceeded") {
      const resetAt = new Date(Number(res.headers.get("X-Quota-Reset")) * 1000);
      throw new Error(`Monthly limit reached; resets ${resetAt.toISOString()}`);
    }
    // Per-minute limit: back off and retry
    const wait = Number(res.headers.get("Retry-After") ?? 60);
    await new Promise((r) => setTimeout(r, wait * 1000));
    return overture(path, params);
  }

  if (!res.ok) throw new Error(`Overture API ${res.status}`);
  return { data: await res.json(), remaining };
}
```

Two habits that stretch an allowance a long way: cache responses on your side (results only change with Overture's monthly data release), and round coordinates before you query so nearby users share the same request.

We'll also email your team once when you pass the allowance and once if you reach the limit, so it never comes as a surprise.

## Country-level queries are on paid plans

A `/places` query with a `country` and no `lat`/`lng` reads a whole country, the most expensive query the API serves. It's now a paid-plan feature. On the Free plan, search by `lat`, `lng` and `radius` (up to 25 km); `country` still works as an extra filter alongside them. A Free key sending a country-level query gets a `403` explaining why, and it doesn't count towards your allowance.

## The demo key

`DEMO-API-KEY` has no monthly count. It's for trying the API: lat/lng searches around a few demo cities (New York, London, Paris and Sydney), with small pages. [Sign up for a free key](https://account.overturemapsapi.com) to search anywhere.
