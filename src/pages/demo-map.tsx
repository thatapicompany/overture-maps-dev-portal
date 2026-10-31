// The demo page grew into the explorer. Keep this path working for old links.
import { Redirect } from '@docusaurus/router';

export default function DemoMap(): JSX.Element {
  return <Redirect to="/explorer" />;
}
