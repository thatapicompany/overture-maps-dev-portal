import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as Redocusaurus from 'redocusaurus';

const config: Config = {
  title: 'OpenSource Overture Maps API',
  tagline: 'Unofficial API for the amazing Overture Maps Foundation datasets',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'thatapicompany', // Usually your GitHub org/user name.
  projectName: 'overture-maps-api', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          // Pass it a path to a local OpenAPI YAML file\
          // You can also pass it a OpenAPI spec URL
          {
            spec: 'https://overture-maps-api.thatapicompany.com/api-docs-json',
            route: '/reference',
          },
        ],
        // Theme Options for modifying how redoc renders them
        theme: {
          // Change with your site colors
          primaryColor: '#1890ff',
        },
      },
    ] satisfies Redocusaurus.PresetEntry,
  ],
  themes: [
    'docusaurus-theme-redoc',
  ],

  themeConfig: {
    redoc: {
      tryItOutEnabled: true, // Enables the "Try it out" button
      hideDownloadButton: false, // Optional: show/hide the download button for the spec
      expandResponses: "all", // Optional: expand responses by default
    },
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Overture Maps API',
      logo: {
        alt: 'Overture Maps API Logo',
        src: 'img/cityscape.svg',
      },
      items: [
        // Other navbar items
        {
          to: '/tryitout',
          label: 'Try It',
          position: 'left',
        },
        {
          to: '/embedpage',
          label: 'Embedded Page',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Guide',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: '/reference',
          label: 'API Reference',
          position: 'left',
        },
        {
          href: 'https://github.com/thatapicompany/overture-maps-api',
          label: 'API GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Intro Guide',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Overture Maps Foundation',
              href: 'https://overturemaps.org/',
            },
            {
              label: 'Overture Maps Foundation Docs',
              href: 'https://docs.overturemaps.org/',
            },
            {
              label: 'ThatAPICompany',
              href: 'https://thatapicompany.com/api-services/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/thatapicompany/overture-maps-api',
            },
          ],
        },
      ],
      //copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
