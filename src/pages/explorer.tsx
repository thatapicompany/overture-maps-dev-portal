import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './explorer.module.css';

// The explorer itself is the world-places demo app (overture-maps-world-places-demo),
// embedded here so this page can explain it and rank for "overture explorer".
const DEMO_URL = 'https://demo.overturemapsapi.com';
const ACCOUNT_URL = 'https://account.overturemapsapi.com';

type View = { title: string; path: string; body: string; endpoint: string };

const VIEWS: View[] = [
  {
    title: 'Places',
    path: '/',
    body: 'Pick categories and a brand, move the map, and see every matching place with its category, brand logo, address and status.',
    endpoint: '/places',
  },
  {
    title: 'Restaurants and food',
    path: '/restaurants',
    body: 'Browse food and drink with the hierarchy-aware taxonomy filter, and hide places marked closed.',
    endpoint: '/places?taxonomy=…',
  },
  {
    title: 'Brands',
    path: '/brands',
    body: 'See the chains near any point, with logos, websites and parent companies from Wikidata, then map every location of one.',
    endpoint: '/places/brands',
  },
  {
    title: 'Divisions',
    path: '/divisions',
    body: 'Search countries, regions, cities and neighbourhoods by name, and load their boundary polygons.',
    endpoint: '/divisions',
  },
  {
    title: '3D buildings',
    path: '/buildings',
    body: 'Building footprints extruded by height or floor count, with class, roof and facade details on click.',
    endpoint: '/buildings',
  },
  {
    title: 'Site selection',
    path: '/site-selection',
    body: 'Click anywhere for an area report built from four endpoints: places, brands, addresses and the road network.',
    endpoint: 'four endpoints',
  },
];

export default function Explorer(): JSX.Element {
  return (
    <Layout
      title="Overture Maps Explorer"
      description="Explore Overture Maps places, brands, buildings and boundaries on a live map in your browser, then copy the API call behind what you see. Free, no downloads.">
      <Head>
        <meta property="og:image" content="https://www.overturemapsapi.com/img/guides/overture-themes-paris.jpg" />
        <meta name="twitter:image" content="https://www.overturemapsapi.com/img/guides/overture-themes-paris.jpg" />
      </Head>
      <main>
        <header className="container">
          <div className={styles.hero}>
          <Heading as="h1">Overture Maps Explorer</Heading>
          <p className={styles.lead}>
            Browse Overture Maps places, brands, buildings and boundaries on a live map, right here in your browser.
            Every view shows the API call behind it, so when you find what you need you can copy it straight into
            your own code.
          </p>
          <div className={styles.ctas}>
            <Link className="button button--primary button--lg" href={DEMO_URL}>
              Open full screen
            </Link>
            <Link className="button button--secondary button--lg" href={ACCOUNT_URL}>
              Get a free API key
            </Link>
          </div>
          </div>
        </header>

        <section className={styles.frameWrap}>
          <iframe
            src={DEMO_URL}
            className={styles.frame}
            title="Overture Maps Explorer: places on a live map"
            loading="lazy"
          />
          <p className={clsx('container', styles.frameNote)}>
            The built-in demo key works near New York, London, Paris and Sydney. Paste your own key into the
            explorer to look anywhere; searches you have already run are not repeated against your plan.
          </p>
        </section>

        <section className={clsx('container', styles.section)}>
          <Heading as="h2">Six ways to explore Overture data</Heading>
          <div className={styles.grid}>
            {VIEWS.map((v) => (
              <Link key={v.title} className={clsx('card', styles.card)} href={`${DEMO_URL}${v.path}`}>
                <div className="card__header">
                  <Heading as="h3">{v.title}</Heading>
                </div>
                <div className="card__body">
                  <p>{v.body}</p>
                </div>
                <div className="card__footer">
                  <code>{v.endpoint}</code>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={clsx('container', styles.section)}>
          <div className={styles.prose}>
          <Heading as="h2">How this compares with Overture's own Explorer</Heading>
          <p>
            Overture publishes its own <Link href="https://explore.overturemaps.org/">Overture Explorer</Link>,
            which shows a release's raw features as map layers. It is the best way to inspect the source data
            itself.
          </p>
          <p>
            This explorer is built on the <Link to="/docs/intro">Overture Maps API</Link>, so it shows what an
            application would actually get back: filtered by category, taxonomy or brand, enriched with brand logos
            and websites, and paged like a real request. Each result comes with the request that produced it, which
            is the quickest route from looking at the data to using it.
          </p>

          <Heading as="h2">Questions</Heading>
          <details className={styles.faqItem}>
            <summary>What data is in it?</summary>
            <p>
              Overture's monthly open map releases: points of interest, building footprints, addresses,
              administrative boundaries and more. <Link to="/docs/what-is-overture-maps">What is Overture Maps?</Link>{' '}
              explains the themes and licences.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>Does exploring use up my plan?</summary>
            <p>
              Not with the demo key, which is free near the demo cities. With your own key, each new search counts as
              one request; repeat searches are served from memory, and the map only searches automatically on the
              demo key, so panning around doesn't quietly use your allowance. Plans are on the{' '}
              <Link to="/pricing">pricing page</Link>.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>Can I build my own version?</summary>
            <p>
              Yes. The explorer is open source on{' '}
              <Link href="https://github.com/thatapicompany/overture-maps-world-places-demo">GitHub</Link>, and the
              guides show how to build the common pieces, such as{' '}
              <Link to="/docs/guides/build-a-whats-near-me-feature">a "what's near me" feature</Link> and{' '}
              <Link to="/docs/api-endpoints/buildings">3D buildings</Link>.
            </p>
          </details>
          </div>
        </section>
      </main>
    </Layout>
  );
}
