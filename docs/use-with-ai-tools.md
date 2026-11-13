---
sidebar_position: 3.5
title: "Use the Overture Maps API with Claude, ChatGPT, Cursor and other AI tools"
description: "Connect Overture Maps places, buildings and boundaries to Claude, ChatGPT, Cursor and other AI assistants with the MCP server or the OpenAPI spec, and point your coding assistant at llms.txt."
sidebar_label: "Use with AI tools"
keywords:
  - overture maps mcp
  - overture maps chatgpt
  - places api for ai agents
  - llms.txt
---

# Use with AI tools

There are three ways to put Overture Maps data in front of an AI assistant, depending on what you want it to do:

| You want the assistant to… | Use |
| --- | --- |
| Answer questions with live Overture data ("find cafes near the Eiffel Tower") | The [MCP server](#mcp-server-claude-cursor-and-other-mcp-clients) |
| Call the API from a custom GPT or an agent framework | The [OpenAPI spec](#openapi-spec-custom-gpts-and-agent-frameworks) |
| Write code against the API for you | The [docs for AI tools](#docs-for-coding-assistants) |

All three need an API key. The public `DEMO-API-KEY` works for small searches near New York, London, Paris and Bondi Beach. [Sign up for a free key](https://account.overturemapsapi.com) to search anywhere.

## MCP server (Claude, Cursor and other MCP clients)

[`@thatapicompany/overture-maps-mcp`](https://www.npmjs.com/package/@thatapicompany/overture-maps-mcp) is an open-source [Model Context Protocol](https://modelcontextprotocol.io) server with five read-only tools: `search_places`, `list_place_categories`, `list_place_countries`, `search_divisions` and `find_buildings`. Its responses are compact summaries rather than full GeoJSON, so they don't fill up the assistant's context. It's listed in the official [MCP Registry](https://registry.modelcontextprotocol.io) as `io.github.thatapicompany/overture-maps-mcp`, so clients that browse the registry can find and install it.

### Claude Desktop

Add this to `claude_desktop_config.json` (Settings → Developer → Edit Config), then restart Claude:

```json
{
  "mcpServers": {
    "overture-maps": {
      "command": "npx",
      "args": ["-y", "@thatapicompany/overture-maps-mcp"],
      "env": { "OVERTURE_API_KEY": "your-api-key" }
    }
  }
}
```

### Claude Code

```bash
claude mcp add overture-maps --env OVERTURE_API_KEY=your-api-key -- npx -y @thatapicompany/overture-maps-mcp
```

### Cursor and other MCP clients

Any client that runs local (stdio) MCP servers works the same way. In Cursor, add the `mcpServers` block above to `~/.cursor/mcp.json`. Elsewhere, run `npx -y @thatapicompany/overture-maps-mcp` with `OVERTURE_API_KEY` set in the environment.

Then ask things like:

- "Find pharmacies within 1 km of King's Cross that have a website."
- "Which administrative region is Springfield, Illinois in?"
- "How tall are the buildings around St Paul's Cathedral?"

## OpenAPI spec (custom GPTs and agent frameworks)

The spec lives at [`https://api.overturemapsapi.com/api-docs.json`](https://api.overturemapsapi.com/api-docs.json), with a copy at [`https://www.overturemapsapi.com/openapi.json`](https://www.overturemapsapi.com/openapi.json). Every operation has a readable `operationId` (`searchPlaces`, `listPlaceCategories`, `searchBuildings` and so on) and a description of when to use it, so tool-calling models pick the right endpoint.

**ChatGPT custom GPT:** in the GPT editor, open *Configure → Actions → Create new action*, choose *Import from URL* and paste the spec URL. Set *Authentication* to *API Key*, auth type *Custom*, header name `x-api-key`.

**Agent frameworks:** most can turn an OpenAPI spec into tools directly. Send the key in the `x-api-key` header on every request.

## Docs for coding assistants

If you're asking Claude, ChatGPT, Copilot or Cursor to write code against the API, give it the docs in a form it reads well:

- [`/llms.txt`](https://www.overturemapsapi.com/llms.txt): a short index of the API and these docs
- [`/llms-full.txt`](https://www.overturemapsapi.com/llms-full.txt): every docs page in one file
- Any docs page as plain markdown: add `.md` to its URL, for example [`/docs/api-endpoints/places.md`](https://www.overturemapsapi.com/docs/api-endpoints/places.md)

Every endpoint page has a parameter reference and a Python example you can paste into a prompt.

## Tips for good results

- **Ask for a place and a radius.** Searches by `lat`, `lng` and `radius` are the fastest and work on every plan. If you only have a place name, the assistant can look it up with `GET /divisions?name=...` first.
- **Let it find the category first.** `GET /places/categories` returns the category values that exist in an area, so the assistant doesn't guess (`coffee_shop`, not `coffee shops`).
- **Let it read the error.** Error responses explain how to fix the request, for example "search by lat/lng instead" or "this query needs a paid plan". Assistants can pass that straight back to you.
- **Watch your quota.** Agents can make many calls quickly. Each response carries `X-Quota-Remaining`, and a `429` comes with a `Retry-After` header. See [Usage limits](./limits).
