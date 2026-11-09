/**
 * Route map: the single source of truth for translated URL slugs.
 *
 * Every page/section that has a fixed URL is listed here with its slug per
 * locale, matching production (www.vilax.es). Always build internal links with
 * `getRoutePath()` / `buildPath()` — never hard-code localized URLs.
 */
import { defaultLocale, locales, type Locale } from './config';

export const routes = {
  home: { es: '', ca: '', en: '' },
  about: { es: 'sobre-nosotros', ca: 'sobre-nosaltres', en: 'about-us' },
  contact: { es: 'contacto', ca: 'contacte', en: 'contact' },
  privacy: { es: 'politica-de-privacidad', ca: 'politica-de-privadesa', en: 'privacy-policy' },
  // WordPress-driven sections (bases for archives and singles)
  blog: { es: 'insights', ca: 'insights', en: 'insights' },
  category: { es: 'category', ca: 'category', en: 'category' },
  author: { es: 'author', ca: 'author', en: 'author' },
  cases: { es: 'casos', ca: 'casos', en: 'cases' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

/** Pagination segment used by paginated archives: /insights/page/2/ */
export const PAGE_SEGMENT = 'page';

/**
 * Joins path segments under the locale prefix, with leading and trailing slash.
 *   buildPath('es', 'insights')        → '/insights/'
 *   buildPath('en', 'author', 'albert') → '/en/author/albert/'
 *   buildPath('ca')                     → '/ca/'
 */
export function buildPath(locale: Locale, ...segments: Array<string | number | undefined | null>): string {
  const prefix = locale === defaultLocale ? [] : [locale];
  const parts = [...prefix, ...segments]
    .filter((s) => s !== undefined && s !== null && s !== '')
    .map((s) => String(s).replace(/^\/+|\/+$/g, ''))
    .filter(Boolean);
  return parts.length ? `/${parts.join('/')}/` : '/';
}

/** Localized path of a route from the map, optionally with extra segments. */
export function getRoutePath(key: RouteKey, locale: Locale, ...segments: Array<string | number | undefined>): string {
  return buildPath(locale, routes[key][locale], ...segments);
}

/** A page in another language (hreflang alternates, language switcher, WP translations). */
export type Alternate = { locale: Locale; path: string };

/** Alternates for a route that exists in every locale (Astro-owned pages). */
export function getRouteAlternates(key: RouteKey): Alternate[] {
  return locales.map((locale) => ({ locale, path: getRoutePath(key, locale) }));
}
