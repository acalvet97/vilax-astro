/**
 * Locale configuration (also used by `i18n` in astro.config.mjs).
 * ES is served at the root, CA under /ca/, EN under /en/ (same as production).
 */
export const locales = ['es', 'ca', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const localeMeta: Record<
  Locale,
  { label: string; short: string; hreflang: string; ogLocale: string }
> = {
  es: { label: 'Español', short: 'ES', hreflang: 'es', ogLocale: 'es_ES' },
  ca: { label: 'Català', short: 'CA', hreflang: 'ca', ogLocale: 'ca_ES' },
  en: { label: 'English', short: 'EN', hreflang: 'en', ogLocale: 'en_US' },
};

/**
 * WPML language codes per locale (WPML → Languages), used in GraphQL
 * `where: { language }` filters and `language { code }` fields.
 * English is `en-us` internally in WPML, while its URL directory is /en/.
 */
export const wpmlCodes: Record<Locale, string> = {
  es: 'es',
  ca: 'ca',
  en: 'en-us',
};

/** Maps a WPML language code back to our locale (undefined if unknown). */
export function localeFromWpml(code: string | null | undefined): Locale | undefined {
  return locales.find((l) => wpmlCodes[l] === code);
}
