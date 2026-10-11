import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './pricing.module.css';

// Plan details for the hosted API. Keep these in step with the plan
// configuration the API enforces (see /docs/limits): when a plan's price,
// allowance or key count changes, change it here too.
const ACCOUNT_URL = 'https://account.overturemapsapi.com';
const UPGRADE_URL = `${ACCOUNT_URL}/subscription`;

type Plan = {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    tagline: 'For trying the API and non-commercial projects.',
    features: [
      '100 requests a month',
      'Non-commercial use',
      '3 API keys',
      'Every endpoint, searched by lat/lng and radius (up to 25 km)',
      'Basic support',
    ],
    cta: { label: 'Get a free key', href: ACCOUNT_URL },
  },
  {
    name: 'Premium',
    price: '$25',
    period: '/month',
    tagline: 'For a commercial product getting started.',
    features: [
      '1,000 requests a month',
      'Commercial licence',
      '10 API keys',
      'Country-level place queries',
      'Fast email support',
    ],
    cta: { label: 'Choose Premium', href: UPGRADE_URL },
    highlight: true,
  },
  {
    name: 'Growth',
    price: '$50',
    period: '/month',
    tagline: 'For a product with steady daily use.',
    features: [
      '4,000 requests a month',
      'Commercial licence',
      '15 API keys',
      'Country-level place queries',
      'Fast email support',
    ],
    cta: { label: 'Choose Growth', href: UPGRADE_URL },
  },
  {
    name: 'Scale',
    price: '$100',
    period: '/month',
    tagline: 'For high-volume commercial use.',
    features: [
      '10,000 requests a month',
      'Commercial licence',
      '25 API keys',
      'Country-level place queries',
      'Fast email support',
    ],
    cta: { label: 'Choose Scale', href: UPGRADE_URL },
  },
];

// Shown as a wide banner under the four plans rather than a fifth card.
const CUSTOM = {
  title: 'Need more than 10,000 requests a month?',
  body: 'We can size monthly volume to your use, with a commercial licence and terms and invoicing that suit your organisation.',
  cta: { label: 'Contact us', href: '/contact' },
};

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: 'What counts as a request?',
    a: (
      <>
        Every successful API call counts as one request, whatever it returns. Errors do not count, including
        validation errors and refused requests. Each response carries <code>X-Quota-*</code> headers showing how
        many you have used this month. See <Link to="/docs/limits">Usage limits</Link>.
      </>
    ),
  },
  {
    q: 'What happens when I reach my monthly allowance?',
    a: (
      <>
        Requests keep working for a while past the allowance, with an <code>X-Quota-Warning</code> header, and are
        then refused with a <code>429</code> until 00:00 UTC on the 1st of next month. You can upgrade at any time
        from your <Link href={UPGRADE_URL}>account</Link> to keep going.
      </>
    ),
  },
  {
    q: 'What is a country-level query?',
    a: (
      <>
        A <code>/places</code> search with a <code>country</code> and no <code>lat</code>/<code>lng</code>, such as
        every bakery in France. It reads a whole country, so it is on paid plans. On Free, search around a point with{' '}
        <code>lat</code>, <code>lng</code> and <code>radius</code> (up to 25 km), and add <code>country</code> as an
        extra filter if you like.
      </>
    ),
  },
  {
    q: 'What does the commercial licence cover?',
    a: (
      <>
        Free is for non-commercial use. If you use the API in a product or service you sell, or for a business,
        choose a paid plan. The Overture Maps data itself stays under its own open licences.
      </>
    ),
  },
  {
    q: 'Can I try it before signing up?',
    a: (
      <>
        Yes. The public <code>DEMO-API-KEY</code> works for searches near a few demo cities, and the{' '}
        <Link href="https://demo.overturemapsapi.com">live demo</Link> uses it. A free key lets you search anywhere.
      </>
    ),
  },
  {
    q: 'Can I run it myself instead?',
    a: (
      <>
        Yes. The API is <Link href="https://github.com/thatapicompany/overture-maps-api">open source</Link> and
        deploys to your own Google Cloud project, where you pay Google for the BigQuery queries you run. See{' '}
        <Link to="/docs/deploy-to-gcp">Deploy to GCP</Link>.
      </>
    ),
  },
  {
    q: 'How is billing handled?',
    a: <>Paid plans are billed monthly in US dollars through Stripe, plus tax where it applies.</>,
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className={clsx('card', styles.plan, plan.highlight && styles.highlight)}>
      <div className="card__header">
        <Heading as="h2" className={styles.planName}>
          {plan.name}
        </Heading>
        <p className={styles.price}>
          {plan.price}
          {plan.period && <span className={styles.period}>{plan.period}</span>}
        </p>
        <p className={styles.tagline}>{plan.tagline}</p>
      </div>
      <div className="card__body">
        <ul className={styles.features}>
          {plan.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="card__footer">
        <Link
          className={clsx('button button--block', plan.highlight ? 'button--primary' : 'button--secondary')}
          href={plan.cta.href}>
          {plan.cta.label}
        </Link>
      </div>
    </div>
  );
}

export default function Pricing(): JSX.Element {
  return (
    <Layout
      title="Pricing"
      description="Plans for the hosted Overture Maps API: a free plan for non-commercial use, and Premium, Growth and Scale plans with a commercial licence, from $25 a month.">
      <main className="container margin-vert--xl">
        <header className={styles.intro}>
          <Heading as="h1">Pricing</Heading>
          <p>
            Start free, and move to a paid plan when you need a commercial licence, country-level queries or more
            requests. Prices are in US dollars.
          </p>
        </header>

        <div className={styles.grid}>
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div className={clsx('card', styles.custom)}>
          <div>
            <Heading as="h2" className={styles.customTitle}>
              {CUSTOM.title}
            </Heading>
            <p className={styles.customBody}>{CUSTOM.body}</p>
          </div>
          <Link className="button button--secondary button--lg" href={CUSTOM.cta.href}>
            {CUSTOM.cta.label}
          </Link>
        </div>

        <section className={styles.faq}>
          <Heading as="h2">Questions</Heading>
          {FAQ.map(({ q, a }) => (
            <details key={q} className={styles.faqItem}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      </main>
    </Layout>
  );
}
