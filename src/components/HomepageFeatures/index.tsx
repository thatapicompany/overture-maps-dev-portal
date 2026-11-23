import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

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
    title: 'A hosted API, ready in seconds',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    png: '/img/container-framed.png',
    description: (
      <>
        Grab an API key and start querying straight away — no infrastructure to run. Fully documented with OpenAPI 3.0.0, with guides for the common use cases.
        <br/><br/> Prefer to self-host? The API is open source (TypeScript + Docker) and deploys to your own GCP account using BigQuery. See the <a href="https://github.com/thatapicompany/overture-maps-api">GitHub repo</a>.
      </>
    ),
  },
  {
    title: 'Ready for your AI assistant',
    png: '/img/ai-assistant.svg',
    description: (
      <>
        Building with Claude, ChatGPT or Cursor? Point it at
        our <a href="/llms.txt">llms.txt</a> and OpenAPI spec, or connect the
        open-source MCP server so it can search places, buildings and
        boundaries for you.
        <br/><br/>
        <a href="/docs/use-with-ai-tools">Set it up in a few minutes</a>.
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
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
