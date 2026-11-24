// Category pages under /lists. Counts are places in Overture's public
// BigQuery table (bigquery-public-data.overture_maps.place) whose taxonomy
// includes the node, grouped by the country of the first address, which is
// how the API's `taxonomy` and `country` filters match. To refresh after an
// Overture release, re-run that count and replace the numbers and COUNTED_ON.

export const COUNTED_ON = '24 November 2026';

export type CategoryList = {
  /** URL slug under /lists. */
  slug: string;
  /** Overture taxonomy node. One value covers everything beneath it. */
  taxonomy: string;
  title: string;
  /** Lower case, plural, for running text. */
  plural: string;
  singular: string;
  /** Category values the account app's export picker starts with. */
  exportCategories: string[];
  summary: string;
  places: number;
  withWebsite: number;
  withPhone: number;
  countries: number;
  /** Some of the kinds of place inside the node, with places worldwide. */
  parts?: {label: string; taxonomy: string; places: number}[];
  /** Ten largest countries: ISO code and places. */
  top: [string, number][];
};

export const CATEGORY_LISTS: CategoryList[] = [
  {
    slug: 'home-services',
    taxonomy: 'home_service',
    title: 'Home services and trades',
    plural: 'contractors, plumbers, electricians, roofers and other home service firms',
    singular: 'home service business',
    exportCategories: ['contractor', 'plumbing', 'electrician', 'hvac_service', 'roofing'],
    summary: 'Building contractors, plumbers, electricians, roofers, HVAC firms and other home services',
    places: 3473362,
    withWebsite: 2323546,
    withPhone: 3289914,
    countries: 232,
    parts: [
      {label: 'Contractors', taxonomy: 'contractor', places: 643990},
      {label: 'Electricians', taxonomy: 'electrician', places: 215642},
      {label: 'HVAC services', taxonomy: 'hvac_service', places: 182313},
      {label: 'Plumbers', taxonomy: 'plumbing', places: 164534},
      {label: 'Roofers', taxonomy: 'roofing', places: 139359},
    ],
    top: [['US', 1096264], ['DE', 338917], ['GB', 315444], ['FR', 286933], ['IT', 140213], ['BR', 104745], ['NL', 100953], ['ES', 100802], ['CA', 97210], ['AU', 77265]],
  },
  {
    slug: 'car-dealers',
    taxonomy: 'auto_dealer',
    title: 'Car dealers',
    plural: 'car dealers',
    singular: 'car dealer',
    exportCategories: ['auto_dealer', 'used_auto_dealer'],
    summary: 'New and used car dealerships',
    parts: [{label: 'Used car dealers', taxonomy: 'used_auto_dealer', places: 96483}],
    places: 729116,
    withWebsite: 450990,
    withPhone: 657794,
    countries: 221,
    top: [['US', 156630], ['BR', 58138], ['IN', 43433], ['DE', 36083], ['GB', 32997], ['JP', 30224], ['FR', 28499], ['ID', 24726], ['TR', 23023], ['IT', 22385]],
  },
  {
    slug: 'auto-repair',
    taxonomy: 'automotive_repair',
    title: 'Auto repair shops',
    plural: 'auto repair shops',
    singular: 'auto repair shop',
    exportCategories: ['automotive_repair'],
    summary: 'Garages, body shops and repair workshops',
    places: 1262574,
    withWebsite: 597086,
    withPhone: 1158160,
    countries: 226,
    top: [['US', 275500], ['BR', 106503], ['GB', 78571], ['FR', 69917], ['DE', 67759], ['IT', 54664], ['MX', 53699], ['ES', 44913], ['TH', 44327], ['IN', 29011]],
  },
  {
    slug: 'restaurants',
    taxonomy: 'restaurant',
    title: 'Restaurants',
    plural: 'restaurants',
    singular: 'restaurant',
    exportCategories: ['restaurant'],
    summary: 'Restaurants of every cuisine',
    places: 6047817,
    withWebsite: 2553586,
    withPhone: 5213555,
    countries: 246,
    top: [['US', 917974], ['JP', 510157], ['MX', 403327], ['TH', 358616], ['BR', 356695], ['IT', 245448], ['FR', 220079], ['ID', 216005], ['DE', 195616], ['IN', 182174]],
  },
  {
    slug: 'vets-and-pet-services',
    taxonomy: 'animal_or_pet_service',
    title: 'Vets and pet services',
    plural: 'vets, groomers, trainers, boarding and shelters',
    singular: 'pet business',
    exportCategories: ['veterinarian', 'pet_groomer'],
    summary: 'Veterinary practices, groomers, trainers, boarding and shelters',
    parts: [
      {label: 'Veterinarians', taxonomy: 'veterinarian', places: 221643},
      {label: 'Pet groomers', taxonomy: 'pet_groomer', places: 118588},
      {label: 'Pet trainers', taxonomy: 'pet_training', places: 40402},
      {label: 'Animal shelters', taxonomy: 'animal_shelter', places: 29748},
    ],
    places: 644043,
    withWebsite: 373370,
    withPhone: 603162,
    countries: 210,
    top: [['US', 162996], ['GB', 56296], ['DE', 49170], ['BR', 43483], ['FR', 33068], ['IT', 25335], ['MX', 24769], ['ES', 17141], ['CA', 15215], ['NL', 14980]],
  },
  {
    slug: 'estate-agents',
    taxonomy: 'real_estate_agent',
    title: 'Estate agents',
    plural: 'estate agents and realtors',
    singular: 'estate agent',
    exportCategories: ['real_estate_agent'],
    summary: 'Estate agents, realtors and letting agents',
    places: 883219,
    withWebsite: 668560,
    withPhone: 831268,
    countries: 207,
    top: [['US', 413564], ['DE', 58531], ['FR', 47587], ['ES', 38214], ['GB', 34972], ['CA', 34156], ['IT', 33382], ['BR', 29022], ['TR', 25152], ['CH', 16972]],
  },
  {
    slug: 'banks',
    taxonomy: 'bank_or_credit_union',
    title: 'Banks and credit unions',
    plural: 'banks and credit unions',
    singular: 'bank branch',
    exportCategories: ['bank'],
    summary: 'Bank branches and credit unions',
    parts: [{label: 'Banks', taxonomy: 'bank', places: 266348}],
    places: 707262,
    withWebsite: 528494,
    withPhone: 529948,
    countries: 230,
    top: [['US', 154804], ['IN', 152537], ['DE', 37518], ['FR', 30834], ['ID', 28152], ['BR', 27355], ['IT', 25940], ['ES', 19562], ['TR', 17918], ['JP', 17897]],
  },
];

export const APP_URL = 'https://app.overturemapsapi.com';

/** A link that opens the account app's export form with the choice filled in. */
export function exportLink(categories: string[], country?: string): string {
  const params = new URLSearchParams({kind: 'category', categories: categories.join(',')});
  if (country) params.set('country', country);
  return `${APP_URL}/exports?${params.toString()}`;
}

export function findList(slug: string): CategoryList {
  const list = CATEGORY_LISTS.find((l) => l.slug === slug);
  if (!list) throw new Error(`No category list called ${slug}`);
  return list;
}
