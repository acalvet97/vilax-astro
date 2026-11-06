/**
 * Blog helpers: queries over the WordPress-backed collections and the static
 * paths of every blog URL (archive, category archives, posts) per locale.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { locales, type Locale } from '../i18n/config';
import { buildPath, getRoutePath, PAGE_SEGMENT, routes, type Alternate } from '../i18n/routes';

export const POSTS_PER_PAGE = 8;

/** WordPress default categories ("Sin categoría"…) are never shown. */
const EXCLUDED_CATEGORY = /^(sin-categoria|sin-categorizar|uncategorized)/;

export type Post = CollectionEntry<'posts'>;
export type Category = CollectionEntry<'categories'>;

export type PostCard = {
  title: string;
  path: string;
  date: Date;
  readingMinutes: number;
  category?: { name: string; path: string };
  author?: { name: string; jobTitle?: string; photo?: { src: string; alt: string } };
};

/** Posts of a locale, newest first. */
export async function getPosts(locale: Locale): Promise<Post[]> {
  const posts = await getCollection('posts', (p) => p.data.locale === locale);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Visible categories of a post (default category excluded). */
export async function getPostCategories(post: Post): Promise<Category[]> {
  const entries = await Promise.all(post.data.categories.map((ref) => getEntry(ref)));
  return entries.filter((c): c is Category => !!c && !EXCLUDED_CATEGORY.test(c.data.slug));
}

/** Categories of a locale that have at least one post, alphabetically. */
export async function getBlogCategories(locale: Locale, posts: Post[]): Promise<Category[]> {
  const used = new Set(posts.flatMap((p) => p.data.categories.map((ref) => ref.id)));
  const categories = await getCollection(
    'categories',
    (c) => c.data.locale === locale && used.has(c.id) && !EXCLUDED_CATEGORY.test(c.data.slug),
  );
  return categories.sort((a, b) => a.data.name.localeCompare(b.data.name, locale));
}

export async function toPostCard(post: Post): Promise<PostCard> {
  const [category] = await getPostCategories(post);
  const author = post.data.author ? await getEntry(post.data.author) : undefined;
  return {
    title: post.data.title,
    path: post.data.path,
    date: post.data.date,
    readingMinutes: post.data.readingMinutes,
    category: category ? { name: category.data.name, path: category.data.path } : undefined,
    author: author
      ? {
          name: author.data.name,
          jobTitle: author.data.jobTitle,
          photo: author.data.photo ? { src: author.data.photo.src, alt: author.data.photo.alt || author.data.name } : undefined,
        }
      : undefined,
  };
}

/** Up to `count` related posts: same category first, then the most recent. */
export function getRelatedPosts(post: Post, all: Post[], count = 3): Post[] {
  const others = all.filter((p) => p.id !== post.id);
  const categoryIds = new Set(post.data.categories.map((c) => c.id));
  const sameCategory = others.filter((p) => p.data.categories.some((c) => categoryIds.has(c.id)));
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, count);
}

/** Path of page `n` of a paginated archive whose first page is `basePath`. */
export function pagePath(basePath: string, n: number): string {
  return n <= 1 ? basePath : `${basePath}${PAGE_SEGMENT}/${n}/`;
}

// ---------- Static paths ----------

export type ArchiveProps = {
  template: 'archive';
  locale: Locale;
  posts: Post[];
  page: number;
  totalPages: number;
  basePath: string;
  categories: Category[];
  category?: Category;
  alternates: Alternate[];
};

export type PostProps = {
  template: 'post';
  locale: Locale;
  post: Post;
  related: Post[];
  alternates: Alternate[];
};

function paginate<T>(items: T[]): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += POSTS_PER_PAGE) pages.push(items.slice(i, i + POSTS_PER_PAGE));
  return pages;
}

const toParam = (path: string) => path.replace(/^\/+|\/+$/g, '');

/** Every blog URL, for src/pages/[...path].astro. */
export async function getBlogPaths() {
  const paths: Array<{ params: { path: string }; props: ArchiveProps | PostProps }> = [];
  const postsByLocale = new Map<Locale, Post[]>();
  for (const locale of locales) postsByLocale.set(locale, await getPosts(locale));

  // Locales with a blog (production has no Catalan blog).
  const blogLocales = locales.filter((l) => postsByLocale.get(l)!.length > 0);
  const blogAlternates = blogLocales.map((l) => ({ locale: l, href: getRoutePath('blog', l) }));

  // Fixed Astro routes a post slug must not collide with.
  const reserved = new Set(locales.flatMap((l) => Object.values(routes).map((r) => buildPath(l, r[l]))));

  for (const locale of blogLocales) {
    const posts = postsByLocale.get(locale)!;
    const categories = await getBlogCategories(locale, posts);

    // Blog archive: /insights/, /insights/page/2/…
    const archiveBase = getRoutePath('blog', locale);
    paginate(posts).forEach((pagePosts, i) => {
      paths.push({
        params: { path: toParam(pagePath(archiveBase, i + 1)) },
        props: {
          template: 'archive',
          locale,
          posts: pagePosts,
          page: i + 1,
          totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
          basePath: archiveBase,
          categories,
          alternates: i === 0 ? blogAlternates : [],
        },
      });
    });

    // Category archives: /category/seo/, /category/seo/page/2/…
    for (const category of categories) {
      const categoryPosts = posts.filter((p) => p.data.categories.some((c) => c.id === category.id));
      paginate(categoryPosts).forEach((pagePosts, i) => {
        paths.push({
          params: { path: toParam(pagePath(category.data.path, i + 1)) },
          props: {
            template: 'archive',
            locale,
            posts: pagePosts,
            page: i + 1,
            totalPages: Math.ceil(categoryPosts.length / POSTS_PER_PAGE),
            basePath: category.data.path,
            categories,
            category,
            alternates: i === 0 ? category.data.translations.map((t) => ({ locale: t.locale, href: t.path })) : [],
          },
        });
      });
    }

    // Posts: /<slug>/, /en/<slug>/
    for (const post of posts) {
      if (reserved.has(post.data.path)) {
        throw new Error(`Post "${post.data.title}" (${locale}) uses the reserved URL ${post.data.path}. Change its slug in WordPress.`);
      }
      paths.push({
        params: { path: toParam(post.data.path) },
        props: {
          template: 'post',
          locale,
          post,
          related: getRelatedPosts(post, posts),
          alternates: post.data.translations.map((t) => ({ locale: t.locale, href: t.path })),
        },
      });
    }
  }

  // Keep only alternates that point to a page we actually generate
  // (e.g. a category translated in WP but without posts in that language).
  const generated = new Set(paths.map((p) => `/${p.params.path}/`));
  for (const { props } of paths) {
    props.alternates = props.alternates.filter((a) => generated.has(a.href));
  }
  return paths;
}
