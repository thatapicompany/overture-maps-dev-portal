import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import {APP_URL, CATEGORY_LISTS} from '@site/src/data/category-lists';
import ListPicker from '@site/src/components/ListPage/Picker';
import styles from '@site/src/components/ListPage/styles.module.css';

const number = (n: number) => new Intl.NumberFormat('en-GB').format(n);

const TITLE = 'Business listings API and CSV downloads from Overture Maps open data';
const DESCRIPTION =
  'Build a business list by category and country from Overture Maps places: names, addresses, phone numbers and websites. Download a CSV or query the API. Open data you can keep.';

export default function BusinessListings(): JSX.Element {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className={styles.page}>
        <div className="container">
          <Heading as="h1">Business lists by category and country</Heading>
          <p className={styles.lead}>
            Every plumber in the Netherlands. Every car dealer in Texas. Every vet within 25 km of
            Manchester. Overture Maps publishes more than 90 million places as open data, with names,
            addresses, phone numbers and websites. Pick what you need and download it, or query it from
            your own code.
          </p>

          <ListPicker />

          <Heading as="h2">Lists people build</Heading>
          <ul className={styles.cards}>
            {CATEGORY_LISTS.map((list) => (
              <li key={list.slug}>
                <strong>
                  <Link to={`/lists/${list.slug}`}>{list.title}</Link>
                </strong>
                {number(list.places)} places in {list.countries} countries and territories.{' '}
                {list.summary}.
              </li>
            ))}
          </ul>
          <p>
            These are a few of the categories Overture has. Any of them works the same way: browse
            the full set in the <Link to="/explorer">Explorer</Link>, or ask the API for the categories
            in a country with <Link to="/docs/api-endpoints/places-categories">/places/categories</Link>.
          </p>

          <Heading as="h2">Without writing code</Heading>
          <p>
            The <Link href={`${APP_URL}/exports`}>account app</Link> has three exports: every location of
            a brand in a country, every place of some categories in a country, and everything round a
            point. Each one shows the count and a sample for free. You then download a CSV or GeoJSON,
            which draws on your plan&apos;s monthly allowance. Tick phone, website, email or social to
            keep only the places you can contact.
          </p>

          <Heading as="h2">With the API</Heading>
          <p>
            <code>GET /places</code> filters by <code>country</code>, <code>taxonomy</code> or{' '}
            <code>categories</code>, <code>brand_name</code> and <code>has_contact</code>, and pages with{' '}
            <code>limit</code> and <code>page</code>. Contact details come back on every place by default.
          </p>
          <CodeBlock language="bash">
            {`curl -i -H "x-api-key: YOUR-API-KEY" -G 'https://api.overturemapsapi.com/places' \\
  -d 'country=NL' -d 'taxonomy=plumbing' -d 'has_contact=phone' -d 'limit=1000'`}
          </CodeBlock>
          <p>
            The <Link to="/docs/guides/build-a-business-list-by-category">step-by-step guide</Link> covers
            finding the right category, sizing a list before you pull it, paging, and saving to CSV.
          </p>
          <p>
            Want to see a file first? Here is a{' '}
            <Link to="pathname:///samples/overture-places-sample-london-food-and-drink.csv">
              sample CSV
            </Link>
            : 200 food and drink places round Oxford Circus in London, with every column the download
            carries. 170 have a phone number, 180 a website and 19 opening hours (27 November 2026).
          </p>

          <Heading as="h2">What to know before you rely on it</Heading>
          <ul>
            <li>
              <strong>It is open data.</strong> Places come from Meta, Microsoft, Foursquare and other
              contributors to the Overture Maps Foundation. What you retrieve is yours to keep under{' '}
              <Link to="/terms#data-licences">Overture&apos;s licences</Link>, on any plan, and after you
              leave.
            </li>
            <li>
              <strong>Coverage varies.</strong> Well-mapped countries have a phone number or website for
              most businesses. Emails and social links are sparser. Every place has a confidence score,
              and <Link to="/docs/guides/choose-a-min-confidence-for-overture-places">this guide</Link>{' '}
              helps you pick a threshold.
            </li>
            <li>
              <strong>It is business data, not people data.</strong> You get the business&apos;s public
              listing. Branches of chains often carry <Link to="/docs/opening-hours">opening hours</Link>. There are no
              named contacts, reviews, ratings or photos.
            </li>
            <li>
              <strong>Country-wide lists need a paid plan</strong>, from $25 a month. The Free plan
              searches round a point, up to 25 km, for non-commercial projects.{' '}
              <Link to="/pricing">See pricing</Link>.
            </li>
          </ul>

          <div className={styles.actions}>
            <Link className="button button--primary button--lg" href={`${APP_URL}/exports`}>
              Build a list
            </Link>
            <Link className="button button--secondary button--lg" to="/pricing">
              Pricing
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
