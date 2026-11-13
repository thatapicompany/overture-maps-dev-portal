#!/usr/bin/env node
// Writes a parameter reference and a Python example into each endpoint page,
// generated from the OpenAPI spec, so the parameters are in the page text
// that search engines and AI tools read (the /reference page is rendered by
// JavaScript and most crawlers never see its content).
//
//   node scripts/sync-openapi-docs.mjs          # rewrite the generated blocks
//   node scripts/sync-openapi-docs.mjs --check  # exit 1 if any page is stale
//
// Only the text between the markers below is touched. Run it after copying a
// new spec into openapi/overture-maps-api-openapi.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SPEC_PATH = join(ROOT, 'openapi/overture-maps-api-openapi.json');
const BASE_URL = 'https://api.overturemapsapi.com';
const START = '{/* openapi:generated:start */}';
const END = '{/* openapi:generated:end */}';

const LONDON = { lat: 51.5138, lng: -0.0984 };
const NEW_YORK = { lat: 40.7128, lng: -74.006 };

// Per page: the endpoint, demo-key-friendly example parameters, and how to
// print each result.
const PAGES = [
  {
    file: 'places.md', path: '/places',
    params: { ...LONDON, radius: 500, categories: 'cafe', limit: 10 },
    loop: 'for place in results:\n    print(place["properties"]["names"]["primary"], place["properties"].get("categories", {}).get("primary"))',
  },
  {
    file: 'places-buildings.md', path: '/places/buildings',
    params: { ...LONDON, radius: 300, categories: 'cafe', limit: 10 },
    loop: 'for place in results:\n    print(place["properties"]["names"]["primary"], place["geometry"]["type"])',
  },
  {
    file: 'places-brands.md', path: '/places/brands',
    params: { ...LONDON, radius: 1000, limit: 20 },
    loop: 'for brand in results:\n    print((brand.get("names") or {}).get("primary"), brand.get("wikidata"), brand["counts"]["places"])',
  },
  {
    file: 'places-categories.md', path: '/places/categories',
    params: { ...LONDON, radius: 1000, limit: 20 },
    loop: 'for category in results:\n    print(category["primary"], category["counts"]["places"])',
  },
  {
    file: 'places-countries.md', path: '/places/countries',
    params: {},
    loop: 'for country in results[:10]:\n    print(country["country"], country["counts"]["places"])',
  },
  {
    file: 'buildings.md', path: '/buildings',
    params: { ...LONDON, radius: 200, limit: 10 },
    loop: 'for building in results:\n    props = building["properties"]\n    print(building["id"], props.get("class"), props.get("height"), props.get("num_floors"))',
  },
  {
    file: 'addresses.md', path: '/addresses',
    params: { ...NEW_YORK, radius: 100, limit: 10 },
    loop: 'for address in results:\n    props = address["properties"]\n    print(props.get("number"), props.get("street"), props.get("postcode"))',
  },
  {
    file: 'base.md', path: '/base',
    params: { ...NEW_YORK, radius: 200, limit: 10 },
    loop: 'for feature in results:\n    props = feature["properties"]\n    print(props.get("type"), props.get("subtype"), props.get("class"))',
  },
  {
    file: 'transportation.md', path: '/transportation',
    params: { ...NEW_YORK, radius: 100, limit: 10 },
    loop: 'for segment in results:\n    props = segment["properties"]\n    print(props.get("subtype"), props.get("class"), segment["geometry"]["type"])',
  },
  {
    file: 'divisions.md', path: '/divisions',
    params: { name: 'Camden', country: 'GB', limit: 5 },
    loop: 'for area in results:\n    props = area["properties"]\n    print(area["id"], props["names"]["primary"], props.get("subtype"))',
  },
];

// MDX treats { } and < as code outside inline code spans, so escape them there.
const mdxSafe = (text) =>
  String(text ?? '')
    .split(/(`[^`]*`)/)
    .map((part, i) => (i % 2 ? part : part.replace(/[{}]/g, '\\$&').replace(/</g, '&lt;')))
    .join('');
const cell = (v) => mdxSafe(String(v ?? '').replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim());

function typeOf(schema = {}) {
  if (schema.enum) return schema.enum.map((v) => `\`${v}\``).join(', ');
  if (schema.type === 'array') return `list of ${schema.items?.type ?? 'string'} (comma-separated)`;
  return schema.type ?? 'string';
}

function paramTable(op) {
  const rows = (op.parameters ?? []).filter((p) => p.in === 'query');
  if (!rows.length) return 'This endpoint takes no query parameters.';
  const lines = ['| Parameter | Type | Default | Description |', '| --- | --- | --- | --- |'];
  for (const p of rows) {
    const def = p.schema?.default;
    lines.push(`| \`${p.name}\` | ${cell(typeOf(p.schema))} | ${def === undefined ? '' : `\`${cell(def)}\``} | ${cell(p.description)} |`);
  }
  return lines.join('\n');
}

function pyValue(v) {
  return typeof v === 'string' ? JSON.stringify(v) : String(v);
}

function pythonExample(page) {
  const entries = Object.entries(page.params);
  const params = entries.length
    ? `    params={\n${entries.map(([k, v]) => `        "${k}": ${pyValue(v)},`).join('\n')}\n    },\n`
    : '';
  return [
    '```python',
    'import requests',
    '',
    'resp = requests.get(',
    `    "${BASE_URL}${page.path}",`,
    '    headers={"x-api-key": "DEMO-API-KEY"},  # use your own key outside the demo cities',
    params + '    timeout=30,',
    ')',
    'if resp.status_code == 429:',
    '    raise SystemExit(f"Rate limited, retry in {resp.headers[\'Retry-After\']}s")',
    'resp.raise_for_status()  # 4xx bodies are {"statusCode", "message"}; the message says how to fix the request',
    '',
    'results = resp.json()',
    'print(resp.headers.get("Pagination-Count"), "results in total")',
    page.loop,
    '```',
  ].join('\n');
}

function block(page, op) {
  return [
    START,
    '',
    '## Parameter reference',
    '',
    `Generated from the [OpenAPI spec](${BASE_URL}/api-docs.json) (operation \`${op.operationId}\`).${op.description ? ` ${mdxSafe(op.description)}` : ''}`,
    '',
    paramTable(op),
    '',
    '## Python example',
    '',
    pythonExample(page),
    '',
    'Results are paginated: pass `page` (0-indexed) and `limit`, and read the total from the `Pagination-Count` header. See [Pagination](/docs/pagination) and [Usage limits](/docs/limits).',
    '',
    END,
  ].join('\n');
}

function upsert(markdown, generated) {
  const s = markdown.indexOf(START);
  const e = markdown.indexOf(END);
  if (s !== -1 && e !== -1) return markdown.slice(0, s) + generated + markdown.slice(e + END.length);
  const related = markdown.search(/^## Related\b/m);
  if (related !== -1) return markdown.slice(0, related) + generated + '\n\n' + markdown.slice(related);
  return markdown.replace(/\s*$/, '\n\n') + generated + '\n';
}

const spec = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
const check = process.argv.includes('--check');
let stale = 0;
for (const page of PAGES) {
  const op = spec.paths?.[page.path]?.get;
  if (!op) throw new Error(`${page.path} is not in the spec`);
  const file = join(ROOT, 'docs/api-endpoints', page.file);
  const before = readFileSync(file, 'utf8');
  const after = upsert(before, block(page, op));
  if (before === after) continue;
  stale++;
  if (check) console.error(`stale: docs/api-endpoints/${page.file}`);
  else { writeFileSync(file, after); console.log(`updated docs/api-endpoints/${page.file}`); }
}
if (check && stale) process.exit(1);
