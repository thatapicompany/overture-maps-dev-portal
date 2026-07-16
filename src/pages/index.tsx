import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
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
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            href="https://demo.overturemapsapi.com">
            Live Demo
          </Link>
          -
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docs & Guides
          </Link>
          -
          <Link
            className="button button--secondary button--lg"
            href="https://account.overturemapsapi.com">
            Signup or Login for a Key
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
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
