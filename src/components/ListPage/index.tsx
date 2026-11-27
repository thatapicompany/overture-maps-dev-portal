import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import {APP_URL, CATEGORY_LISTS, COUNTED_ON, exportLink, findList} from '@site/src/data/category-lists';
import styles from './styles.module.css';

const number = (n: number) => new Intl.NumberFormat('en-GB').format(n);
const percent = (part: number, whole: number) => `${Math.round((part / whole) * 100)}%`;
const regions = new Intl.DisplayNames(['en-GB'], {type: 'region'});
export const countryName = (code: string) => regions.of(code) ?? code;
/** The name as it reads after "in": "the United States", "France". */
export const inCountry = (code: string) => (['US', 'GB', 'NL', 'AE', 'PH'].includes(code) ? `the ${countryName(code)}` : countryName(code));

/** One category of business: how many Overture has, by country, and how to get them. */
export default function ListPage({slug}: {slug: string}): JSX.Element {
  const list = findList(slug);
  const [topCode, topCount] = list.top[0];
  const title = `${list.title} data: ${number(list.places)} places in ${list.countries} countries, as CSV or API`;
  const description = `Download ${list.plural} from Overture Maps open data as a CSV, or query them through the API. ${number(list.places)} places, ${percent(list.withPhone, list.places)} with a phone number, by country.`;
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${list.title} from Overture Maps`,
    description,
    url: `https://www.overturemapsapi.com/lists/${list.slug}`,
    creator: {'@type': 'Organization', name: 'Overture Maps Foundation', url: 'https://overturemaps.org/'},
    isAccessibleForFree: true,
    license: 'https://docs.overturemaps.org/attribution/',
  };

  return (
    <Layout title={title} description={description}>
      <Head>
        <script type="application/ld+json">{JSON.stringify(structured)}</script>
      </Head>
      <main className={styles.page}>
        <div className="container">
          <p className={styles.crumb}>
            <Link to="/business-listings-api">Business lists</Link> / {list.title}
          </p>
          <Heading as="h1">
            {list.title}: {number(list.places)} places, ready to download
          </Heading>
          <p className={styles.lead}>
            {list.summary}, from the Overture Maps Foundation&apos;s open places data. Pick a country and
            download the list as a CSV, or pull it into your own system through the API.
          </p>

          <div className={styles.stats}>
            <div>
              <strong>{number(list.places)}</strong>
              <span>places in {list.countries} countries and territories</span>
            </div>
            <div>
              <strong>{percent(list.withPhone, list.places)}</strong>
              <span>have a phone number</span>
            </div>
            <div>
              <strong>{percent(list.withWebsite, list.places)}</strong>
              <span>have a website</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link className="button button--primary button--lg" href={exportLink(list.exportCategories, topCode)}>
              Download a list
            </Link>
            <Link className="button button--secondary button--lg" to="/explorer">
              See them on a map
            </Link>
          </div>
          <p className={styles.note}>
            Creating an account is free and needs no card. You see the count and a sample before you
            download anything.
          </p>

          <Heading as="h2">By country</Heading>
          <p>
            The ten countries with the most {list.plural} in Overture. Every other country is in the
            export form.
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Country</th>
                <th>Places</th>
                <th aria-label="Download" />
              </tr>
            </thead>
            <tbody>
              {list.top.map(([code, count]) => (
                <tr key={code}>
                  <td>{countryName(code)}</td>
                  <td>{number(count)}</td>
                  <td>
                    <Link href={exportLink(list.exportCategories, code)}>Get this list</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {list.parts && (
            <>
              <Heading as="h2">What&apos;s inside</Heading>
              <p>
                Overture arranges its categories in a tree. <code>{list.taxonomy}</code> covers everything
                beneath it, including:
              </p>
              <ul>
                {list.parts.map((part) => (
                  <li key={part.taxonomy}>
                    {part.label} (<code>{part.taxonomy}</code>): {number(part.places)} places worldwide
                  </li>
                ))}
              </ul>
            </>
          )}

          <Heading as="h2">What each row holds</Heading>
          <p>
            Name, category, street address, town, region, postcode, country, latitude and longitude, plus
            website, phone, email and social links where Overture has them. Chains also carry their brand, and often their opening hours.
            You can ask for only the places that have a phone number or a website.
          </p>

          <Heading as="h2">Two ways to get it</Heading>
          <div className="row">
            <div className="col col--6">
              <Heading as="h3">Download a file</Heading>
              <p>
                In the <Link href={`${APP_URL}/exports`}>account app</Link>, choose the country and the
                categories, check the count and a sample for free, then download a CSV or GeoJSON. One
                file holds up to 25,000 places, and a larger list can be narrowed by category first.
                Downloads draw on your plan&apos;s monthly allowance. See <Link to="/pricing">pricing</Link>.
              </p>
            </div>
            <div className="col col--6">
              <Heading as="h3">Call the API</Heading>
              <p>
                One request per page of results. <code>Pagination-Count</code> in the response headers
                is the total, so you know the size of the list before you page through it.
              </p>
            </div>
          </div>
          <CodeBlock language="bash">
            {`curl -i -H "x-api-key: YOUR-API-KEY" -G 'https://api.overturemapsapi.com/places' \\
  -d 'country=${topCode}' -d 'taxonomy=${list.taxonomy}' \\
  -d 'has_contact=phone,website' -d 'limit=1000' -d 'page=0'`}
          </CodeBlock>
          <p>
            Searching a whole country needs a <Link to="/pricing">paid plan</Link>. On the Free plan and
            with the demo key, search round a point instead with <code>lat</code>, <code>lng</code> and{' '}
            <code>radius</code> (up to 25 km). The{' '}
            <Link to="/docs/guides/build-a-business-list-by-category">business list guide</Link> walks
            through both.
          </p>

          <Heading as="h2">Where the numbers come from</Heading>
          <p>
            Counts are places in Overture&apos;s public release whose category sits under{' '}
            <code>{list.taxonomy}</code>, grouped by the country of their address, counted on {COUNTED_ON}.
            The largest is {inCountry(topCode)} with {number(topCount)}. Overture publishes a
            new release every month, so expect the figures to move. Coverage and contact details vary by
            country, and each place carries a confidence score you can filter on with{' '}
            <Link to="/docs/guides/choose-a-min-confidence-for-overture-places">
              <code>min_confidence</code>
            </Link>
            .
          </p>
          <p>
            The data is open. What you download is yours to keep and use under{' '}
            <Link to="/terms#data-licences">Overture&apos;s licences</Link>, on any plan.
          </p>

          <Heading as="h2">Other lists</Heading>
          <ul className={styles.others}>
            {CATEGORY_LISTS.filter((other) => other.slug !== list.slug).map((other) => (
              <li key={other.slug}>
                <Link to={`/lists/${other.slug}`}>{other.title}</Link> ({number(other.places)})
              </li>
            ))}
          </ul>
        </div>
      </main>
    </Layout>
  );
}
