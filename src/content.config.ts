/**
 * Content collections.
 *
 * WordPress-backed (fetched at build time via WPGraphQL, see src/lib/wp/):
 *   posts, authors, categories — ids are `<locale>/<slug>`.
 *   menus                      — ids are `<location>/<locale>`.
 *
 * Case studies (`casos`) are added in the case-studies phase, once their
 * ACF fields are defined.
 */
import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { locales } from './i18n/config';
import { authorsLoader, categoriesLoader, menusLoader, postsLoader } from './lib/wp/loaders';
import { MENU_LOCATIONS } from './lib/wp/queries';

const locale = z.enum(locales);

const seo = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  noindex: z.boolean().default(false),
  ogImage: z.string().optional(),
  jsonLd: z.string().optional(),
});

const image = z.object({
  src: z.string(),
  alt: z.string().default(''),
  width: z.number().optional(),
  height: z.number().optional(),
});

const translations = z.array(z.object({ locale, path: z.string() })).default([]);

const posts = defineCollection({
  loader: postsLoader(),
  schema: z.object({
    wpId: z.number(),
    locale,
    slug: z.string(),
    path: z.string(),
    title: z.string(),
    excerpt: z.string(),
    content: z.string(),
    date: z.coerce.date(),
    modified: z.coerce.date(),
    author: reference('authors').optional(),
    categories: z.array(reference('categories')).default([]),
    translations,
    seo,
  }),
});

const authors = defineCollection({
  loader: authorsLoader(),
  schema: z.object({
    wpId: z.number(),
    locale,
    slug: z.string(),
    path: z.string(),
    name: z.string(),
    bio: z.string(),
    jobTitle: z.string().optional(),
    linkedinUrl: z.url().optional(),
    photo: image.optional(),
    translations,
    seo,
  }),
});

const categories = defineCollection({
  loader: categoriesLoader(),
  schema: z.object({
    wpId: z.number(),
    locale,
    slug: z.string(),
    path: z.string(),
    name: z.string(),
    description: z.string(),
    translations,
    seo,
  }),
});

/** Recursive menu item (WordPress menus keep their hierarchy). */
const menuItem = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string().nullable(),
  external: z.boolean(),
  newTab: z.boolean(),
  get children() {
    return z.array(menuItem);
  },
});

/** Navigation menus from WordPress, one entry per `<location>/<locale>`. */
const menus = defineCollection({
  loader: menusLoader(),
  schema: z.object({
    location: z.enum(MENU_LOCATIONS),
    locale,
    items: z.array(menuItem).min(1),
  }),
});

export const collections = { posts, authors, categories, menus };
