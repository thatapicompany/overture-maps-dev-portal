// Remembers how a visitor first found the site, so a later sign-up in the
// account app can be credited to the source that brought them. Written once
// and never changed: the first visit wins. It holds the referring site's
// host name, any utm tags, the first page and the date, and nothing about
// the person. The cookie is set on the parent domain so the account app at
// app.overturemapsapi.com can read it.

const COOKIE = 'om_first';
const MAX_AGE_DAYS = 90;
const clean = (value: string | null | undefined, max = 80): string =>
  (value ?? '').replace(/[^\w .:/@+-]/g, '').slice(0, max);

/** What to remember, as a short query string. Exported for reading in tests. */
export function firstTouch(referrer: string, location: {hostname: string; pathname: string; search: string}, today: string): string {
  const query = new URLSearchParams(location.search);
  let from = '';
  try {
    const host = referrer ? new URL(referrer).hostname.replace(/^www\./, '') : '';
    // Our own pages are not a source.
    if (host && !host.endsWith(location.hostname.replace(/^www\./, ''))) from = host;
  } catch {
    // An unreadable referrer is left out.
  }
  const values: Record<string, string> = {
    s: clean(query.get('utm_source')),
    m: clean(query.get('utm_medium')),
    c: clean(query.get('utm_campaign')),
    r: clean(from),
    l: clean(location.pathname, 120),
    d: today,
  };
  const out = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value) out.set(key, value);
  return out.toString();
}

function remember(): void {
  if (typeof document === 'undefined') return;
  if (document.cookie.split('; ').some((part) => part.startsWith(`${COOKIE}=`))) return;
  const value = firstTouch(document.referrer, window.location, new Date().toISOString().slice(0, 10));
  // The parent domain in production; the current host anywhere else.
  const host = window.location.hostname;
  const domain = host.endsWith('overturemapsapi.com') ? '; domain=.overturemapsapi.com' : '';
  document.cookie = `${COOKIE}=${encodeURIComponent(value)}; max-age=${MAX_AGE_DAYS * 86400}; path=/${domain}; samesite=lax; secure`;
}

remember();

export {};
