import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

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
            to="/demo">
            Live Demo
          </Link>
          -
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Deployment Guide
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
      title={`${siteConfig.title}`}
      description="Overture Maps API, how to fork it and host it yourself">
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
