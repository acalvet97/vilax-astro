# CLAUDE.md — VILAX website (Astro + headless WordPress)

Project conventions (tokens, styling, i18n, data policy, navigation, pages, checks) live in AGENTS.md and are imported here. This file adds context, decisions, gotchas and status.

@AGENTS.md

## Project

Rebuild of **www.vilax.es** (today: WordPress + Elementor Pro + WPML + ACF + Yoast) as a **static Astro 7 site** with a **headless WordPress**. The goal is the same website as production, built with the Figma 2026 design system. Where Figma has no design (mega menu, mobile menu, responsive), **production is the reference**.

| What | Where |
|---|---|
| Production (reference) | https://www.vilax.es |
| Headless WordPress (staging) | https://vilaxheadless.staging.vilax.es (GraphQL: `/graphql`) |
| Figma | file `g5P0oB7Hi3HO2zHTx7bV11` ("VILAX WEB 2026"): page "Dissenys per maquetar · Sistema" (designs), "Components" (Header 1268:15098/15099, Footer 1428:1929 desktop / 1428:2348 mobile) |
| Repo | github.com/acalvet97/vilax-astro (private). `main` = up to date (fast-forwarded from `setup/foundation` on 2026-11-09) |
| Production header code | `wordpress/reference/production-header/` (reference only) |

WordPress manages **only** blog posts, authors, categories, case studies (future), navigation menus and the ACF fields listed in `docs/wordpress-acf.md`. Home, services, about, contact, legal pages and landings are built 100% in Astro (copy in Astro, 3 languages).

## Working with Albert (project owner, Tech Lead at VILAX)

- He writes in Spanish (sometimes Catalan): **reply in the language of his message**. Code and code comments in English.
- **Explain the purpose of any non-obvious command or new file before running/creating it.** He reviews every step and will stop a tool call to ask "¿para qué es esto?".
- **WordPress content-model decisions are his** (fields, taxonomies, menus, where content lives): propose a recommended option and ask. He manages ACF field groups himself in the ACF Pro UI.
- Keep it simple, no unnecessary dependencies, design-system tokens only.
- Don't build pages that have no Figma design (e.g. the author page waits for its design).
- Verify against the real staging (GraphQL) and report concrete results. If you patch code temporarily to test something, back it up and restore it, and say so.
- He runs `npm run dev` in **his own terminal**: Astro 7 refuses a second dev server in the same project, and you must not stop his. WordPress data loads only at startup → after WP or loader changes he must restart it.
- **Git workflow**: one branch per feature or fix, created from an up-to-date `main`
  (`feature/<name>`, `fix/<name>`, `chore/<name>`, `docs/<name>`). Commit/push only when he asks; then
  open a pull request into `main` with `gh pr create`. **He reviews and merges PRs on GitHub** — don't merge
  unless he asks. Never commit directly to `main`.
- Headless browsers can't take screenshots in this environment: ask him to check visuals.

## Architecture map

```
src/
  pages/            index.astro, ca/index.astro, en/index.astro (Home placeholder)
                    contacto.astro, ca/contacte.astro, en/contact.astro
                    [...path].astro → every WordPress-driven blog URL (see lib/blog.ts)
  templates/        HomePage (placeholder), ContactPage, BlogArchive, BlogPost
  actions/          index.ts → Astro Actions (`contact`; the only on-demand code)
  content/          Astro-owned copy: contact.ts (Contact page per locale), clients.ts (client logos)
  layouts/          BaseLayout (fonts, <Seo>, Header, <main>, Footer; head slot; headerSurface prop)
  components/
    layout/         Header, MegaMenu, MobileDrawer, LanguageSwitcher, Logo, Footer, header-theme.ts
    blog/           PostCard, AuthorByline, TableOfContents, Faqs, TagList, Pagination
    content/        Prose (WordPress HTML, scoped :global styles)
    sections/       CtaBanner (dark band with dotted map; reusable), ClientLogos (rotating), FaqSection
    contact/        ContactForm, FormField, OfficeMap (Google Maps embed)
    ui/             Button (primary), FaqAccordion (shared by blog Faqs and FaqSection)
    site/           AiLinks ("Ask AI" buttons, takes a prompt), SocialLinks
    navigation/     MenuLink (one WP menu item → link)
    seo/            Seo (title, canonical, hreflang, OG, JSON-LD)
  lib/
    wp/             client.ts (GraphQL), queries.ts, normalize.ts, loaders.ts, source.ts, mocks/
    blog.ts         blog queries + getBlogPaths()
    navigation.ts   getMenu(), isMegaItem(), getServiceGroups()
    faq.ts          FaqItem + buildFaqJsonLd() (FAQPage JSON-LD)
    contact/        notify.ts (notification email; provider pending)
  i18n/             config.ts (locales, WPML codes), routes.ts (route map), ui.ts (UI strings, default copy)
  config/site.ts    address, email, phone, social links, "Ask AI" prompt + getAiLinks()
  scripts/          header.ts (mega menu, tabs, drawer), logo-rotator.ts, contact-form.ts
  styles/           tokens.css (Figma variables), global.css (wrapper, --gutter, --header-height)
  integrations/     link-check.ts (broken internal links after build; warn-only for now)
  assets/           brand/ (production logo PNGs), clients/ (production client logos), decor/map-dots.svg
wordpress/
  mu-plugins/vilax-headless.php   installed on the WP server (wp-content/mu-plugins/)
  acf-json/                       exports of the ACF groups Astro depends on (import in ACF → Tools)
  reference/                      production code kept as reference (never installed)
docs/  wordpress-menus.md (menus spec + mega images), wordpress-acf.md (ACF groups + GraphQL names)
```

## Data flow (WordPress → Astro)

- **Source** (`src/lib/wp/source.ts`): `WP_USE_MOCKS=true` → mocks; `WP_GRAPHQL_URL` set → WordPress;
  `astro dev` without it → mocks; `astro build`/`astro check` without it → error. `.env` (git-ignored) has
  `WP_GRAPHQL_URL=https://vilaxheadless.staging.vilax.es/graphql`.
- **Mocks** (`src/lib/wp/mocks/`) use the raw WPGraphQL shapes, so they go through the same normalization.
  Menu mocks mirror production menus (incl. the 5 mega-menu images); post mocks are 3 ES + 1 EN sample posts.
- **Collections** (`src/content.config.ts`): `posts`, `authors`, `categories` (ids `<locale>/<slug>`) and
  `menus` (ids `<location>/<locale>`). Posts are fetched once per locale and shared by the posts and authors
  loaders; an author exists in a locale only if they have posts there.
- **Normalization** (`normalize.ts`): WP links → site-relative paths (media `/wp-content/` stays on the WP
  host); Yoast canonical ignored (canonical comes from the Astro URL); Yoast JSON-LD URLs rewritten;
  `<h2>` get ids + TOC list; reading time (~200 wpm); entities decoded; menu URLs normalized (internal hosts →
  relative path with trailing slash; a host without a dot, e.g. `http://ca/…`, fails the build).
- **Failure policy**: GraphQL errors or an empty menu location in any locale fail `astro build`. In
  `astro dev` only, a missing menu falls back to its mock with a warning.
- **WPML**: language codes `es`, `ca`, **`en-us`** (English URL dir is still `/en/`); mapping in
  `src/i18n/config.ts` (`wpmlCodes`, `localeFromWpml`). Queries filter with `where: { language }`.
- **GraphQL names Astro depends on** (details in `docs/wordpress-acf.md`):

  | Source | GraphQL |
  |---|---|
  | Yoast (WPGraphQL Yoast SEO) | `seo { title metaDesc metaRobotsNoindex opengraphImage schema { raw } }` |
  | WPML | `language { code }`, `translations { slug language { code } }` |
  | ACF "Perfil de autor" | `User.authorProfile { jobTitle linkedinUrl }` (photo = Gravatar `avatar { url foundAvatar }`) |
  | ACF "Artículos Insights" (Albert's group) | `Post.postFields { tldr faqs { tituloFaq textFaq } }` (aliased to question/answer) |
  | ACF "CTA" | `Post.cta { eyebrow title text }` |
  | ACF "Menú: imagen de categoría" | `MenuItem.megaMenu { image { node { … } } imagePosition }` |
  | Menus | `menuItems(where: { location: PRIMARY\|FOOTER\|LEGAL, language })` |

- Public GraphQL **introspection is disabled** on staging: discover field names by querying a guess and
  reading the "Did you mean …?" suggestion in the error.

## Routes

- Route map with translated slugs: `src/i18n/routes.ts` (`home`, `about` sobre-nosotros/sobre-nosaltres/
  about-us, `contact` contacto/contacte/contact, `blog` insights, `category`, `author`, `cases` casos/casos/cases).
  Trailing slashes always (`trailingSlash: 'always'`), ES at the root.
- Blog URLs (`getBlogPaths()` in `src/lib/blog.ts`, rendered by `src/pages/[...path].astro`):
  `/insights/`, `/insights/page/N/` (8 per page), `/category/<slug>/` (+ pages), `/<post-slug>/`, with
  `/ca/` `/en/` prefixes. A locale gets a blog only if it has posts (production has **no Catalan blog**).
  Post slugs colliding with fixed routes fail the build. hreflang alternates only point to generated pages.
  WP default categories ("Sin categoría"/"Uncategorized") are hidden.
- Astro-owned pages: thin route file per locale → template. Only the Home placeholder exists so far.

## Design decisions

- **Tokens** (`src/styles/tokens.css`): Figma variables collection, Geist font. Tailwind defaults are reset;
  `--spacing-0` exists so zero utilities (`inset-0`, `top-0`, `min-h-0`) are generated.
- **Text styles**: always the project `t-*` utilities, no fluid type (production uses clamp(); Albert will
  align Figma later).
- **Layout**: `wrapper` = 1600px max content, gutter 1/2/4rem (mobile / ≥768px / ≥1025px); `lg` = 1025px;
  `--header-height` 80/85/90px (used by the header, drawer, sticky TOC and heading `scroll-margin-top`).
- **Header** replicates **production** (not Figma): sticky; logo 108/124/135px; segmented language switcher
  `ES · CA · EN`; Contact button with border-on-hover; dark by default, **light on blog pages**
  (`headerSurface="light"`; colors in `header-theme.ts`). Mega menu: category tabs (hover/click/arrow keys),
  services, "Ver …", 4:5 image with crop position from ACF. ≤1024px: left drawer with level navigation,
  "Volver", scroll lock, CTA "Hablemos de tu proyecto".
- **Footer**: Figma design; service columns come from the `primary` menu's Servicios subtree + `footer` menu
  ("About") + `legal` menu; same logo size as the header; social tiles and "Ask AI" buttons in `components/site/`.
- **Blog** (Figma ArchivoBlog 2034:3381, ArtículoBlog v3.3 2034:823): archive with category pills and
  2-column cards; article with categories, reading time, author byline (Gravatar, optimized at build),
  TOC from h2 (12px between items, sticky below the header, scrolls if too tall), TL;DR, Prose content,
  FAQ accordion + `FAQPage` JSON-LD, **CtaBanner** (copy per article from ACF "CTA", default copy `cta.*` in
  `ui.ts` when empty; button fixed → Contact), related insights (same category first). No featured images.
- **CtaBanner** is shared: articles (and cases later) pass ACF copy; Astro pages will pass their own copy.
- **Contact** (Figma Contact_dk_v3 2034:8559): pages stay static; the form posts to the `contact` Astro Action
  (adapter `@astrojs/vercel` for now — hosting not decided, Cloudflare = swap the adapter). Kept simple on
  purpose: honeypot + server validation only, no captcha until spam shows up. Email provider not chosen:
  `lib/contact/notify.ts` prints to the terminal in dev and fails (form shows the email address) in production.
  Client logos: 10 production PNGs, 4 slots, slots change in shuffled rounds every 2s (800ms fades; static
  with reduced motion).
  FAQs: production ES copy, CA/EN translated (pending review). Map: lazy-loaded Google Maps embed.
- **Images**: WP media optimized at build (`image.domains`: staging host + `www.vilax.es`); Gravatar via
  `remotePatterns`. Logos are production PNGs (TODO: SVG). `map-dots.svg` is the Figma dots layer only.

## WordPress staging

- Installed: WPML (+ String Translation), ACF Pro, WPGraphQL, WPGraphQL for ACF, Yoast + WPGraphQL Yoast SEO.
  Permalinks "Post name".
- **mu-plugin `vilax-headless.php` (v0.4.0)**: registers menu locations `primary` / `footer` / `legal`;
  ACF Local JSON in `wp-content/acf-json/`; makes images attached to menu items public in GraphQL; debounced
  rebuild webhook (`VILAX_DEPLOY_HOOK_URL`, not set yet); optional frontend redirect (`VILAX_FRONTEND_URL`,
  not set). Bump its version and tell Albert to re-upload it when it changes (PHP isn't installed locally).
- ACF groups are created in the ACF Pro UI; JSON copies in `wordpress/acf-json/` (author profile, CTA,
  menu item image). "Artículos Insights" exists only in WP (Albert's group).
- Menus are created per language with **custom links** (relative paths with leading and trailing slash,
  `/ca/…` `/en/…` prefixes); spec in `docs/wordpress-menus.md`. Don't use WPML menu sync.

## Gotchas

- Resetting Tailwind's spacing removes zero/numeric utilities → keep `--spacing-0`; check that used classes
  exist in the built CSS when something "doesn't apply".
- Images uploaded from an ACF field on a menu item are attached to the menu item and WPGraphQL hides them
  (fixed by the mu-plugin filter).
- WP turns a relative custom link typed without the leading slash into `http://ca/…`.
- Adding a field to a GraphQL query before it exists in WP breaks `npm run dev` with real data: ask Albert to
  create/import the ACF group first, then verify on staging.
- Brave/Chrome headless screenshots fail here (no display); `astro preview` works for HTML checks.
- Astro registers Actions only if `src/actions/` exists when the dev server starts: restart it after
  creating that folder (otherwise `/_actions/*` returns 404). The Vercel adapter doesn't support `astro preview`;
  test the built function by importing `.vercel/output/functions/_render.func/.vercel/output/server/entry.mjs`
  and calling its `fetch(request)`.

## Commands

```
WP_USE_MOCKS=true npx astro check    # types (mocks; no WP needed)
WP_USE_MOCKS=true npx astro build    # build with mocks
npx astro build                      # build against WordPress (.env) — fails if data is missing
```

## Status (2026-11-09)

Done (pushed to `setup/foundation`): foundation, header, footer, blog archive + article, CTA band, sticky TOC,
`components/site/` (AiLinks with a `prompt` prop — `getAiLinks(locale, prompt)` + `footerAiPrompt`;
SocialLinks with glyph-only SVGs in accent tiles; ChatGPT uses `ri:openai-fill`), this CLAUDE.md.

Pending in WordPress (Albert): primary menu in CA and EN (blocks the full build), real categories on the
test posts, TL;DR/FAQs/author on the EN test post, Yoast title separator `|`, fill CTA fields.

Next steps:
1. Blog: author pages (wait for Figma) or temporary redirects of `/author/…`; RSS feed (`/feed/`,
   `/en/feed/`); full build against WP; visual review (mobile is not designed).
2. Astro-owned pages: Home, services (6 categories + sub-services), about, contact, legal.
3. Case studies (`casos` CPT, taxonomies tipo_de_caso/sector/area/servicio/target), contact form,
   hosting + rebuild webhook, draft previews.
4. Migration: 78 ES posts + EN translations, authors, categories, Yoast meta, inline images. Production posts
   are Gutenberg blocks inside an Elementor single template; their TL;DR/FAQs come from ACF (Dynamic Content
   for Elementor) — confirm field names match "Artículos Insights". Redirects: `/category/contenido/` →
   `/insights/`, `/category/seo/` → SEO service page, hidden default categories, Yoast sitemaps, author pages,
   feeds if not kept.
5. Before launch: link checker `failOnBrokenLinks: true`; decide the per-service CPTs (`agencia-seo`, …).

Open minor issues: drawer "Ver …" link is yellow on white in light mode (production behavior; left for later);
`/en/web-developement/` typo kept from production URLs.
