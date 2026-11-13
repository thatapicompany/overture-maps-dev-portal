// Build-time outputs for AI tools and crawlers (https://llmstxt.org):
//   /docs/<page>.md   plain-markdown copy of every docs page
//   /llms-full.txt    every docs page in one file
//   /openapi.json     the OpenAPI spec the /reference page renders
// static/llms.txt is the hand-written index that links to these.
const fs = require('fs');
const path = require('path');

const DOCS_DIR = 'docs';
const SPEC = 'openapi/overture-maps-api-openapi.json';

// Pages first in llms-full.txt; the rest follow in path order.
const PRIORITY = [
  'intro', 'what-is-overture-maps', 'authentication', 'use-with-ai-tools',
  'api-endpoints/places', 'api-endpoints/places-categories', 'api-endpoints/places-brands',
  'api-endpoints/places-countries', 'api-endpoints/places-buildings', 'api-endpoints/buildings',
  'api-endpoints/divisions', 'api-endpoints/addresses', 'api-endpoints/base', 'api-endpoints/transportation',
  'pagination', 'limits', 'enriched-data',
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

function parse(file, docsRoot) {
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const front = match ? match[1] : '';
  const field = (name) => {
    const m = front.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined;
  };
  const id = path.relative(docsRoot, file).replace(/\\/g, '/').replace(/\.mdx?$/, '');
  const body = (match ? raw.slice(match[0].length) : raw)
    .replace(/\{\/\*\s*openapi:generated:(start|end)\s*\*\/\}\n?/g, '')
    // undo MDX escaping, which plain markdown readers would show literally
    .replace(/\\([{}])/g, '$1')
    .trim();
  return { id, title: field('title'), description: field('description'), body };
}

module.exports = function llmsTxtPlugin(context) {
  return {
    name: 'llms-txt',
    async postBuild({ outDir }) {
      const siteUrl = context.siteConfig.url.replace(/\/$/, '');
      const docsRoot = path.join(context.siteDir, DOCS_DIR);
      const pages = walk(docsRoot).map((f) => parse(f, docsRoot));
      const rank = (id) => (PRIORITY.includes(id) ? PRIORITY.indexOf(id) : PRIORITY.length);
      pages.sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id));

      const sections = [];
      for (const page of pages) {
        const url = `${siteUrl}/docs/${page.id}`;
        // Pages without a front-matter title open with their own H1.
        const header = page.title ? [`# ${page.title}`, '', `Source: ${url}`] : [`Source: ${url}`];
        if (page.description) header.push('', `> ${page.description}`);
        const md = `${header.join('\n')}\n\n${page.body}\n`;
        const out = path.join(outDir, 'docs', `${page.id}.md`);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, md);
        sections.push(md);
      }

      const intro = [
        '# Overture Maps API: full documentation',
        '',
        `> Every page of ${siteUrl}/docs in one file. Index: ${siteUrl}/llms.txt. OpenAPI spec: ${siteUrl}/openapi.json.`,
        '',
      ].join('\n');
      fs.writeFileSync(path.join(outDir, 'llms-full.txt'), intro + '\n' + sections.join('\n---\n\n'));
      fs.writeFileSync(path.join(outDir, 'openapi.json'), fs.readFileSync(path.join(context.siteDir, SPEC)));
      console.log(`[llms-txt] wrote ${pages.length} .md pages, llms-full.txt and openapi.json`);
    },
  };
};
