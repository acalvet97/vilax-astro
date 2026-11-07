/**
 * Converts raw WPGraphQL shapes into the flat shapes stored in content collections.
 */
import { WP_GRAPHQL_URL } from 'astro:env/server';
import { site } from '../../config/site';
import { localeFromWpml, type Locale } from '../../i18n/config';
import { buildPath, getRoutePath } from '../../i18n/routes';
import type { WpCategory, WpMenuItem, WpPost, WpSeo, WpTranslation } from './queries';

const wpOrigin = WP_GRAPHQL_URL ? new URL(WP_GRAPHQL_URL).origin : null;

/** Hosts whose URLs are internal links of this site. */
const internalHosts = new Set<string>([...site.hosts, ...(wpOrigin ? [new URL(wpOrigin).host] : [])]);

// ---------- Text helpers ----------

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  laquo: '«', raquo: '»',
};

/** Decodes HTML entities in plain-text fields (WP titles come entity-encoded). */
export function decodeEntities(input: string): string {
  return input.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(n) ? match : String.fromCodePoint(n);
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** HTML → plain text (for excerpts and meta descriptions). */
export function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/**
 * Rewrites links that point at the WordPress host to site-relative paths,
 * leaving media (/wp-content/) on the WP host.
 */
export function rewriteWpLinks(html: string): string {
  if (!wpOrigin) return html;
  const escaped = wpOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`${escaped}(?!/wp-content/)(/[^"'\\s<>]*)?`, 'g'), (_m, path?: string) => path || '/');
}

// ---------- Post content processing ----------

export type TocItem = { id: string; text: string };

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Gives every <h2> an id (keeps an existing one, e.g. a Gutenberg anchor) and
 * returns the list of h2s for the article's table of contents.
 */
export function addHeadingAnchors(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (_match, attrs = '', inner: string) => {
    const text = stripHtml(inner);
    if (!text) return `<h2${attrs}>${inner}</h2>`;
    const existing = /\sid=["']([^"']+)["']/i.exec(attrs)?.[1];
    let id = existing ?? (slugify(text) || 'seccion');
    if (!existing) {
      const base = id;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    }
    used.add(id);
    toc.push({ id, text });
    return existing ? `<h2${attrs}>${inner}</h2>` : `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

/** Reading time in minutes (≈200 words per minute), minimum 1. */
export function readingMinutes(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ---------- Shared shapes ----------

export type Seo = {
  title?: string;
  description?: string;
  noindex: boolean;
  ogImage?: string;
  jsonLd?: string;
};

export type Image = { src: string; alt: string; width?: number; height?: number };

export type Translation = { locale: Locale; path: string };

export function normalizeSeo(seo: WpSeo): Seo {
  return {
    title: seo?.title ? decodeEntities(seo.title) : undefined,
    description: seo?.metaDesc || undefined,
    noindex: seo?.metaRobotsNoindex === 'noindex',
    ogImage: seo?.opengraphImage?.sourceUrl || undefined,
    // Yoast builds JSON-LD with WP URLs; point them at the public site.
    jsonLd: seo?.schema?.raw ? rewriteWpLinks(seo.schema.raw) : undefined,
    // Yoast's canonical is ignored on purpose: it points at the WP host.
    // The canonical is derived from the Astro URL in <Seo />.
  };
}

function normalizeTranslations(
  translations: WpTranslation[] | null,
  toPath: (locale: Locale, slug: string) => string,
): Translation[] {
  return (translations ?? []).flatMap((t) => {
    const locale = localeFromWpml(t.language?.code);
    return locale ? [{ locale, path: toPath(locale, t.slug) }] : [];
  });
}

// ---------- Menus ----------

export type MenuItem = {
  id: string;
  label: string;
  /** Site-relative path, absolute external URL, mailto:/tel:, or null for non-link items (e.g. "Servicios"). */
  href: string | null;
  external: boolean;
  newTab: boolean;
  /** Mega-menu image of a service category (ACF on the menu item). */
  image?: { src: string; alt: string; width: number; height: number; position: string };
  children: MenuItem[];
};

/** Adds a trailing slash to page paths (not to files like /file.pdf). */
function withTrailingSlash(pathname: string): string {
  if (pathname.endsWith('/')) return pathname;
  const last = pathname.split('/').pop() ?? '';
  return last.includes('.') ? pathname : `${pathname}/`;
}

/**
 * Normalizes a menu URL entered in WordPress:
 *   https://www.vilax.es/ca/contacte  → /ca/contacte/
 *   https://<wp-host>/en/insights/    → /en/insights/
 *   /contacto                         → /contacto/
 *   https://vilaxpodcast.com/         → external
 *   '' or '#'                         → null (item is a label/group, not a link)
 */
export function normalizeMenuUrl(raw: string | null): { href: string | null; external: boolean } {
  const url = raw?.trim();
  if (!url || url === '#') return { href: null, external: false };
  if (/^(mailto|tel):/i.test(url) || url.startsWith('#')) return { href: url, external: false };

  let parsed: URL;
  try {
    parsed = new URL(url, site.url);
  } catch {
    throw new Error(`Invalid menu URL in WordPress: "${url}"`);
  }
  // WordPress turns a relative path typed without its leading slash
  // ("ca/contacte/") into "http://ca/contacte/". A host without a dot is
  // never a real site, so fail instead of rendering a broken external link.
  if (!parsed.host.includes('.') && parsed.host !== 'localhost') {
    throw new Error(
      `Invalid menu URL in WordPress: "${url}". Relative paths must start with "/" (e.g. "/${parsed.host}${parsed.pathname}").`,
    );
  }
  if (!internalHosts.has(parsed.host)) return { href: parsed.href, external: true };
  return { href: withTrailingSlash(parsed.pathname) + parsed.search + parsed.hash, external: false };
}

function normalizeMenuImage(item: WpMenuItem): MenuItem['image'] {
  const node = item.megaMenu?.image?.node;
  const width = node?.mediaDetails?.width;
  const height = node?.mediaDetails?.height;
  if (!node?.sourceUrl || !width || !height) return undefined;
  const position = item.megaMenu?.imagePosition?.trim();
  return {
    src: node.sourceUrl,
    alt: node.altText ?? '',
    width,
    height,
    // Only accept CSS-like positions ("50% 85%", "center top"…).
    position: position && /^[\w\s.%-]+$/.test(position) ? position : '50% 50%',
  };
}

/** Rebuilds the menu hierarchy from WPGraphQL's flat list (parentId + order). */
export function buildMenuTree(items: WpMenuItem[]): MenuItem[] {
  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const nodes = new Map<string, MenuItem>();
  for (const item of sorted) {
    const { href, external } = normalizeMenuUrl(item.url);
    nodes.set(item.id, {
      id: item.id,
      label: decodeEntities(item.label ?? ''),
      href,
      external,
      newTab: item.target === '_blank',
      image: normalizeMenuImage(item),
      children: [],
    });
  }
  const roots: MenuItem[] = [];
  for (const item of sorted) {
    const node = nodes.get(item.id)!;
    const parent = item.parentId ? nodes.get(item.parentId) : undefined;
    (parent ? parent.children : roots).push(node);
  }
  return roots;
}

// ---------- Entries ----------

export const postPath = (locale: Locale, slug: string) => buildPath(locale, slug);
export const authorPath = (locale: Locale, slug: string) => getRoutePath('author', locale, slug);
export const categoryPath = (locale: Locale, slug: string) => getRoutePath('category', locale, slug);

/** Collection ids are `<locale>/<slug>` so the same slug can exist per locale. */
export const entryId = (locale: Locale, slug: string) => `${locale}/${slug}`;

export function normalizePost(post: WpPost, locale: Locale) {
  const rawContent = post.content ? rewriteWpLinks(post.content) : '';
  const { html: content, toc } = addHeadingAnchors(rawContent);
  const faqs = (post.postFields?.faqs ?? []).flatMap((f) =>
    f.question?.trim() && f.answer?.trim() ? [{ question: f.question.trim(), answer: rewriteWpLinks(f.answer) }] : [],
  );
  return {
    id: entryId(locale, post.slug),
    data: {
      wpId: post.databaseId,
      locale,
      slug: post.slug,
      path: postPath(locale, post.slug),
      title: decodeEntities(post.title),
      excerpt: post.excerpt ? stripHtml(post.excerpt) : '',
      content,
      toc,
      readingMinutes: readingMinutes(rawContent),
      tldr: post.postFields?.tldr?.trim() || undefined,
      faqs,
      date: post.date,
      modified: post.modified,
      author: post.author?.node ? entryId(locale, post.author.node.slug) : undefined,
      categories: (post.categories?.nodes ?? []).map((c) => entryId(locale, c.slug)),
      translations: normalizeTranslations(post.translations, postPath),
      seo: normalizeSeo(post.seo),
    },
  };
}

export function normalizeAuthor(post: WpPost, locale: Locale) {
  const author = post.author?.node;
  if (!author) return undefined;
  // Photo = Gravatar. Hidden when the author has no Gravatar (avoids the generic placeholder).
  const photo =
    author.avatar?.url && author.avatar.foundAvatar !== false
      ? { src: author.avatar.url, alt: author.name, width: 512, height: 512 }
      : undefined;
  return {
    id: entryId(locale, author.slug),
    data: {
      wpId: author.databaseId,
      locale,
      slug: author.slug,
      path: authorPath(locale, author.slug),
      name: author.name,
      bio: author.description ?? '',
      jobTitle: author.authorProfile?.jobTitle || undefined,
      linkedinUrl: author.authorProfile?.linkedinUrl || undefined,
      photo,
      // Filled in by the loader: other locales where this author has posts.
      translations: [] as Translation[],
      seo: normalizeSeo(author.seo),
    },
  };
}

export function normalizeCategory(category: WpCategory, locale: Locale) {
  return {
    id: entryId(locale, category.slug),
    data: {
      wpId: category.databaseId,
      locale,
      slug: category.slug,
      path: categoryPath(locale, category.slug),
      name: decodeEntities(category.name),
      description: category.description ?? '',
      translations: normalizeTranslations(category.translations, categoryPath),
      seo: normalizeSeo(category.seo),
    },
  };
}
