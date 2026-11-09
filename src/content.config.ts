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
    /** HTML from the WordPress editor, with ids on every <h2>. */
    content: z.string(),
    /** Table of contents (the content's <h2>s). */
    toc: z.array(z.object({ id: z.string(), text: z.string() })).default([]),
    readingMinutes: z.number().int().positive(),
    /** ACF "TL;DR" (optional). */
    tldr: z.string().optional(),
    /** ACF "FAQs" repeater; `answer` is HTML. */
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    /** ACF "CTA" copy for this article; missing fields use the default copy. */
    cta: z
      .object({ eyebrow: z.string().optional(), title: z.string().optional(), text: z.string().optional() })
      .default({}),
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
    /** Gravatar URL (512px). */
    photo: z.string().optional(),
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
  image: z
    .object({ src: z.string(), alt: z.string(), width: z.number(), height: z.number(), position: z.string() })
    .optional(),
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
