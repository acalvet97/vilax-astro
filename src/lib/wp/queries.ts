/**
 * GraphQL queries against WordPress (WPGraphQL + WPML + Yoast + ACF).
 *
 * Required plugins (see docs/wordpress-setup.md):
 *   - WPGraphQL                    → base schema
 *   - WPML (GraphQL enabled)       → where: { language }, language, translations
 *   - WPGraphQL Yoast SEO          → seo { … }
 *   - WPGraphQL for ACF            → authorProfile { … }, postFields { … } (field groups in wordpress/mu-plugins)
 */

const SEO_FIELDS = /* GraphQL */ `
  title
  metaDesc
  canonical
  metaRobotsNoindex
  opengraphImage { sourceUrl }
  schema { raw }
`;

/** Posts of one language, including their author and categories in that language. */
export const POSTS_QUERY = /* GraphQL */ `
  query Posts($language: String!, $first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { language: $language, orderby: { field: DATE, order: DESC } }) {
      pageInfo { hasNextPage endCursor }
      nodes {
        databaseId
        slug
        title
        excerpt
        content
        date
        modified
        language { code }
        translations { slug language { code } }
        categories { nodes { slug name } }
        postFields {
          tldr
          # ACF sub-field GraphQL names are tituloFaq / textFaq; aliased to question / answer.
          faqs { question: tituloFaq answer: textFaq }
        }
        author {
          node {
            databaseId
            slug
            name
            description
            avatar(size: 512) { url foundAvatar }
            authorProfile {
              jobTitle
              linkedinUrl
            }
            seo { ${SEO_FIELDS} }
          }
        }
        seo { ${SEO_FIELDS} }
      }
    }
  }
`;

/** Categories of one language. */
export const CATEGORIES_QUERY = /* GraphQL */ `
  query Categories($language: String!, $first: Int!, $after: String) {
    categories(first: $first, after: $after, where: { language: $language, hideEmpty: true }) {
      pageInfo { hasNextPage endCursor }
      nodes {
        databaseId
        slug
        name
        description
        translations { slug language { code } }
        seo { ${SEO_FIELDS} }
      }
    }
  }
`;

/**
 * Menu locations registered in WordPress (wordpress/mu-plugins/vilax-headless.php).
 *   primary → header nav; its "Servicios" subtree also renders the footer service columns
 *   footer  → footer "About" column
 *   legal   → footer bottom bar
 * WPGraphQL exposes them as the enum PRIMARY / FOOTER / LEGAL.
 */
export const MENU_LOCATIONS = ['primary', 'footer', 'legal'] as const;
export type MenuLocation = (typeof MENU_LOCATIONS)[number];

/**
 * Menu items of one menu location and language, as a flat list.
 * The tree is rebuilt from `parentId` + `order` (see normalize.ts).
 * Locations are registered in wordpress/mu-plugins/vilax-headless.php.
 */
export const MENU_ITEMS_QUERY = /* GraphQL */ `
  query MenuItems($location: MenuLocationEnum!, $language: String!, $first: Int!, $after: String) {
    menuItems(first: $first, after: $after, where: { location: $location, language: $language }) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        parentId
        order
        label
        url
        target
        megaMenu {
          image { node { sourceUrl altText mediaDetails { width height } } }
          imagePosition
        }
      }
    }
  }
`;

// ---------- Response types (raw GraphQL shapes) ----------

export type WpMenuItem = {
  id: string;
  parentId: string | null;
  order: number | null;
  label: string | null;
  url: string | null;
  target: string | null;
  /** ACF "Menú: imagen de categoría" (wordpress/acf-json/group_vilax_menu_item_image.json). */
  megaMenu?: {
    image: { node: { sourceUrl: string | null; altText: string | null; mediaDetails: { width: number | null; height: number | null } | null } | null } | null;
    imagePosition: string | null;
  } | null;
};

export type WpSeo = {
  title: string | null;
  metaDesc: string | null;
  canonical: string | null;
  metaRobotsNoindex: string | null;
  opengraphImage: { sourceUrl: string | null } | null;
  schema: { raw: string | null } | null;
} | null;

export type WpTranslation = { slug: string; language: { code: string } | null };

export type WpAuthor = {
  databaseId: number;
  slug: string;
  name: string;
  description: string | null;
  /** Gravatar (the author photo is managed in Gravatar, not uploaded to WP). */
  avatar: { url: string | null; foundAvatar: boolean | null } | null;
  authorProfile: {
    jobTitle: string | null;
    linkedinUrl: string | null;
  } | null;
  seo: WpSeo;
};

export type WpPost = {
  databaseId: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  date: string;
  modified: string;
  language: { code: string } | null;
  translations: WpTranslation[] | null;
  categories: { nodes: Array<{ slug: string; name: string }> } | null;
  postFields: {
    tldr: string | null;
    faqs: Array<{ question: string | null; answer: string | null }> | null;
  } | null;
  author: { node: WpAuthor | null } | null;
  seo: WpSeo;
};

export type WpCategory = {
  databaseId: number;
  slug: string;
  name: string;
  description: string | null;
  translations: WpTranslation[] | null;
  seo: WpSeo;
};

type ConnectionData<K extends string, T> = Record<
  K,
  { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: T[] }
>;
export type PostsData = ConnectionData<'posts', WpPost>;
export type CategoriesData = ConnectionData<'categories', WpCategory>;
export type MenuItemsData = ConnectionData<'menuItems', WpMenuItem>;
