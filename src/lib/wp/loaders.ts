/**
 * Content Layer loaders that pull WordPress content at build time.
 * Used by src/content.config.ts. The data source (WordPress or mocks) is
 * decided by src/lib/wp/source.ts.
 */
import type { Loader, LoaderContext } from 'astro/loaders';
import { locales, wpmlCodes, type Locale } from '../../i18n/config';
import { wpQueryAll } from './client';
import { getMockMenuItems } from './mocks/menus';
import { getMockCategories, getMockPosts } from './mocks/posts';
import type { Alternate } from '../../i18n/routes';
import { buildMenuTree, normalizeAuthor, normalizeCategory, normalizePost } from './normalize';
import {
  CATEGORIES_QUERY,
  MENU_ITEMS_QUERY,
  MENU_LOCATIONS,
  POSTS_QUERY,
  type MenuLocation,
  type WpCategory,
  type WpMenuItem,
  type WpPost,
} from './queries';
import { getDataSource, type DataSource } from './source';

type Entry = { id: string; data: Record<string, unknown> };

// ---------- Fetchers (WordPress or mocks) ----------

/** Posts per locale, fetched once per build and shared by the posts and authors loaders. */
const postsCache = new Map<Locale, Promise<WpPost[]>>();
function fetchPosts(locale: Locale, source: DataSource): Promise<WpPost[]> {
  if (source === 'mock') return Promise.resolve(getMockPosts(locale));
  if (!postsCache.has(locale)) {
    postsCache.set(locale, wpQueryAll<WpPost>(POSTS_QUERY, { language: wpmlCodes[locale] }, 'posts'));
  }
  return postsCache.get(locale)!;
}

async function fetchCategories(locale: Locale, source: DataSource): Promise<WpCategory[]> {
  if (source === 'mock') return getMockCategories(locale);
  return wpQueryAll<WpCategory>(CATEGORIES_QUERY, { language: wpmlCodes[locale] }, 'categories');
}

async function fetchMenuItems(location: MenuLocation, locale: Locale, source: DataSource): Promise<WpMenuItem[]> {
  if (source === 'mock') return getMockMenuItems(location, locale);
  return wpQueryAll<WpMenuItem>(
    MENU_ITEMS_QUERY,
    { location: location.toUpperCase(), language: wpmlCodes[locale] },
    'menuItems',
  );
}

/**
 * Generic loader: resolves the data source, fetches entries, validates them
 * against the collection schema and stores them. Any error fails the build.
 */
function wpLoader(name: string, fetchEntries: (source: DataSource, ctx: LoaderContext) => Promise<Entry[]>): Loader {
  return {
    name,
    async load(ctx) {
      const { store, logger, parseData, generateDigest } = ctx;
      const source = getDataSource();
      if (source === 'mock') logger.warn('Using MOCK data (WordPress not connected).');

      const entries = await fetchEntries(source, ctx);
      store.clear();
      for (const { id, data } of entries) {
        const parsed = await parseData({ id, data });
        store.set({ id, data: parsed, digest: generateDigest(parsed) });
      }
      logger.info(`Loaded ${entries.length} entries from ${source}.`);
    },
  };
}

// ---------- Posts / authors / categories ----------

export function postsLoader(): Loader {
  return wpLoader('wp-posts', async (source) => {
    const perLocale = await Promise.all(
      locales.map(async (locale) => (await fetchPosts(locale, source)).map((p) => normalizePost(p, locale))),
    );
    return perLocale.flat();
  });
}

/**
 * Authors per locale, derived from that locale's posts. An author page exists
 * only in the languages where they have posts (same as production). WPML
 * translates the bio (`description`) per language.
 */
export function authorsLoader(): Loader {
  return wpLoader('wp-authors', async (source) => {
    const byId = new Map<string, NonNullable<ReturnType<typeof normalizeAuthor>>>();
    for (const locale of locales) {
      for (const post of await fetchPosts(locale, source)) {
        const author = normalizeAuthor(post, locale);
        if (author && !byId.has(author.id)) byId.set(author.id, author);
      }
    }
    // Link each author page to the same author in other locales.
    const entries = [...byId.values()];
    for (const entry of entries) {
      entry.data.translations = entries
        .filter((other) => other.data.slug === entry.data.slug && other.data.locale !== entry.data.locale)
        .map<Alternate>((other) => ({ locale: other.data.locale, path: other.data.path }));
    }
    return entries;
  });
}

export function categoriesLoader(): Loader {
  return wpLoader('wp-categories', async (source) => {
    const perLocale = await Promise.all(
      locales.map(async (locale) => (await fetchCategories(locale, source)).map((c) => normalizeCategory(c, locale))),
    );
    return perLocale.flat();
  });
}

// ---------- Menus ----------

/**
 * One entry per menu location and locale, id `<location>/<locale>`.
 * Every location must have items in every locale: an empty or missing menu
 * fails the build (and `astro dev`) instead of shipping an incomplete header/footer.
 */
export function menusLoader(): Loader {
  return wpLoader('wp-menus', async (source) => {
    const entries: Entry[] = [];
    for (const location of MENU_LOCATIONS) {
      for (const locale of locales) {
        const items = await fetchMenuItems(location, locale, source);
        if (items.length === 0) {
          throw new Error(
            `WordPress menu "${location}" has no items for language "${locale}". ` +
              `Assign a menu to this location in WP (Appearance → Menus) for every language.`,
          );
        }
        entries.push({ id: `${location}/${locale}`, data: { location, locale, items: buildMenuTree(items) } });
      }
    }
    return entries;
  });
}
