import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { useQuery } from '@tanstack/react-query';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  png?: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Uses the Overture Maps Datasets',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    png: '/img/overture-maps-logo.png',
    description: (
      <>
        Overture provides free and open map data normalized to a common schema like `addresses`, `buildings`, `base`, `divisions`, `places`, and `transportation` — containing more than 3.7 billion features which is continuing to expand every month! 
        <br/> <br/>
        The data comes from many sources, including OpenStreetMap, Meta, Microsoft, Esri, OpenAddresses, and <a href="https://docs.overturemaps.org/attribution/">more</a> 
      </>
    ),
  },
  {
    title: 'Dockerised TypeScript API',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    png: '/img/container-framed.png',
    description: (
      <>
        Deploy to your own GCP, AWS or Azure account in minutes, using BigQuery, Snowflake or Athena as your datasource.
        <br/><br/> The API is built with TypeScript and Docker, and is fully documented with OpenAPI 3.0.0.
      </>
    ),
  },
  {
    title: 'Use the API to make Amazing things',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    png: '/img/someone-coding-a-geo-app.webp',
    description: (
      <>
        If you have an API that will return "All the Starbucks in the US", or "All the buildings in New York City", or "All the schools in the UK", what will you build with it?
      </>
    ),
  },
];

function Feature({title, Svg, png, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={png} className={styles.featureImage} alt={title} />
        
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {

  //Added for ReactQuery demo
  const { data } = useQuery({
    queryKey: ['cat-api-images'],
    queryFn: () => fetch('https://api.thecatapi.com/v1/images/search?limit=9').then(res => res.json())
  });

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>

          <div><strong>- Cat Images loaded via ReactQuery will appear below this -</strong></div>
        {/* Added for ReactQuery demo - shows any images returned from theCatAPI.com */}
        <div className="cat-images">
          {data && data.map((cat: any) => (
            <img src={cat.url} alt="A random Cat picture from theCatAPI.com" />
          ))}
        </div>

      </div>
    </section>
  );
}
