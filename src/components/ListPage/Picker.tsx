import {useState} from 'react';
import Link from '@docusaurus/Link';

import {CATEGORY_LISTS, exportLink} from '@site/src/data/category-lists';
import {countryName, inCountry} from '@site/src/components/ListPage';
import styles from './styles.module.css';

const number = (n: number) => new Intl.NumberFormat('en-GB').format(n);

/** Choose a kind of business and a country, see how many Overture has, and go to the download. */
export default function ListPicker(): JSX.Element {
  const [slug, setSlug] = useState(CATEGORY_LISTS[0].slug);
  const list = CATEGORY_LISTS.find((l) => l.slug === slug) ?? CATEGORY_LISTS[0];
  const [country, setCountry] = useState(list.top[0][0]);
  const count = list.top.find(([code]) => code === country)?.[1];

  const chooseList = (next: string) => {
    setSlug(next);
    const top = (CATEGORY_LISTS.find((l) => l.slug === next) ?? CATEGORY_LISTS[0]).top;
    if (!top.some(([code]) => code === country)) setCountry(top[0][0]);
  };

  return (
    <div>
      <div className={styles.picker}>
        <label>
          Kind of business
          <select value={slug} onChange={(event) => chooseList(event.target.value)}>
            {CATEGORY_LISTS.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Country
          <select value={country} onChange={(event) => setCountry(event.target.value)}>
            {list.top.map(([code]) => (
              <option key={code} value={code}>
                {countryName(code)}
              </option>
            ))}
          </select>
        </label>
        <Link className="button button--primary button--lg" href={exportLink(list.exportCategories, country)}>
          Get the list
        </Link>
      </div>
      <p className={styles.pickerCount} aria-live="polite">
        {count !== undefined && (
          <>
            <strong>{number(count)}</strong> {list.plural} in {inCountry(country)}.{' '}
            <Link to={`/lists/${list.slug}`}>More countries</Link>
          </>
        )}
      </p>
    </div>
  );
}
