import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Keyword-rich homepage title that keeps "OpenSource" leading (the framing
// that lets us use the Overture name on the domain), plus the terms people
// actually search for ("overture maps", "places", "api").
const HOMEPAGE_TITLE =
  'OpenSource Overture Maps API — Places, Buildings & Address Data via REST';

// Structured data helps Google understand the site as a software product and
// entity, and can enable richer search results.
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'OpenSource Overture Maps API',
      url: 'https://www.overturemapsapi.com/',
    },
    {
      '@type': 'Organization',
      name: 'ThatAPICompany',
      url: 'https://thatapicompany.com/',
      sameAs: ['https://github.com/thatapicompany/overture-maps-api'],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'OpenSource Overture Maps API',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      url: 'https://www.overturemapsapi.com/',
      description:
        'A hosted, open-source REST API for Overture Maps data — query billions of places, buildings, addresses and administrative divisions with a simple API key.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ],
};

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          Overture Maps data, ready to query
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          Places, buildings, addresses and boundaries from the Overture Maps
          Foundation&apos;s open data, searched by location, name or category
          through one hosted API. Independent and open source, from That API
          Company.
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--lg', styles.ctaPrimary)}
            href="https://app.overturemapsapi.com">
            Get a free API key
          </Link>
          <Link className={clsx('button button--lg', styles.ctaSecondary)} to="/explorer">
            Try the Explorer
          </Link>
          <Link className={clsx('button button--lg', styles.ctaSecondary)} to="/docs/intro">
            Docs & Guides
          </Link>
        </div>
        <p className={styles.licenceLine}>
          Free for non-commercial projects. Commercial use of the API needs
          a <Link to="/pricing">paid plan</Link>, from $25 a month. The data
          stays open: whatever you retrieve is yours to keep
          under <Link to="/terms#data-licences">Overture&apos;s licences</Link>,
          on any plan.
        </p>
      </div>
    </header>
  );
}

// A still of the Explorer for now; an embedded, live Explorer comes later.
function ExplorerPreview() {
  return (
    <section className={styles.explorer}>
      <div className="container">
        <Heading as="h2" className={styles.explorerTitle}>
          See the data before you sign up
        </Heading>
        <p className={styles.explorerText}>
          The Explorer puts Overture places, brands, buildings and boundaries
          on a live map, and shows the API call behind every view.
        </p>
        <Link to="/explorer" className={styles.explorerShot}>
          <img
            src="/img/explorer-buildings.webp"
            srcSet="/img/explorer-buildings.webp 1440w, /img/explorer-buildings@2x.webp 2880w"
            sizes="(max-width: 1200px) 100vw, 1140px"
            width={1440}
            height={805}
            loading="lazy"
            alt="Overture building footprints in Lower Manhattan, shown in 3D by height in the Overture Maps API Explorer"
          />
        </Link>
        <div className={styles.explorerButton}>
          <Link className="button button--primary button--lg" to="/explorer">
            Open the Explorer
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title={HOMEPAGE_TITLE}
      description="The hosted Overture Maps API — query billions of places, buildings, addresses and divisions with a simple API key. Open source and self-hostable too.">
      <Head>
        <title>{HOMEPAGE_TITLE}</title>
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</script>
      </Head>
      <HomepageHeader />
      <main>
        <ExplorerPreview />
        <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="https://overturemaps.org" target="_blank" rel="noopener noreferrer">
            Find out more about the Overture Maps Foundation here...
          </a>
        </div>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
