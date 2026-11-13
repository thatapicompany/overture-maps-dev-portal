# Overture Maps Developer Portal & Documentation

Intended for developers who want to use the Overture Maps API to build applications, making use of the OVerture Maps Foundation datasets.

## Goals

- Provide a clear overview of the Overture Maps API
- Show the API documentation inline and a link to download the OpenAPI specification
- Guide developers on how to install the API on their own Infrastructure e.g. a GCP account with free credits
- Provide examples of how to use the API
- Provide an interactive demo app showing the API in use
- Let developers sign up for their own API key to use the Cloud version
- Link to community and support if they get stuck

## Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## OpenAPI spec and generated endpoint sections

`openapi/overture-maps-api-openapi.json` is a copy of the production API's spec, and each page in `docs/api-endpoints/` has a parameter reference and Python example generated from it between `openapi:generated` markers. Don't edit those blocks by hand.

The `Sync OpenAPI spec from production` workflow pulls the live spec hourly and commits any change, so API releases reach the docs on their own. To run it locally: copy a spec into `openapi/`, then `npm run openapi:sync` (or `npm run openapi:check` to see if anything is stale).

The build also writes `/docs/<page>.md` copies, `/llms-full.txt` and `/openapi.json` (see `plugins/llms-txt.js`). `static/llms.txt` is hand-written.
