# VILAX website — Astro frontend + headless WordPress

Static Astro site for www.vilax.es. WordPress (WPML + ACF + Yoast + WPGraphQL) is used only for
blog posts, authors, case studies and navigation menus. All other pages and all design live in Astro.
Languages: `es` (root), `ca` (`/ca/`), `en` (`/en/`), with translated slugs.

## Project conventions

- **Design tokens**: `src/styles/tokens.css` mirrors the Figma variables collection
  (file `g5P0oB7Hi3HO2zHTx7bV11`). Tailwind's default palette/spacing/type scale is reset:
  use only tokens (`text-text-muted`, `bg-bg-inverse`, `p-xl`, `gap-sm`…) and the Figma text
  styles as utilities (`t-display-xl`, `t-heading-lg`, `t-body-md`, `t-label`, `t-caption`…).
  `px-page` is the page gutter (16px mobile → 160px at 1920). The Figma "Estils" page is legacy.
- **Styling**: Tailwind classes in components. Scoped `<style>` only where markup can't take classes
  (e.g. WordPress HTML in `src/components/content/Prose.astro`, using `:global()` + `var(--…)` tokens).
- **Icons**: Remix Icon via `astro-icon` (`<Icon name="ri:arrow-right-line" />`); brand SVGs in `src/icons/`
  imported as components.
- **i18n**: never hard-code localized URLs. Use `src/i18n/routes.ts` (route map, `getRoutePath`,
  `buildPath`), UI strings in `src/i18n/ui.ts`, WPML codes in `src/i18n/config.ts` (`en` = `en-us` in WPML).
- **WordPress data** (`src/lib/wp/`): fetched at build time through Content Layer loaders
  (`src/content.config.ts`). `source.ts` decides the source:
  `WP_GRAPHQL_URL` set → WordPress; `astro dev` without it → mocks; `astro build` without it → fails
  (unless `WP_USE_MOCKS=true`). Missing menus or GraphQL errors must fail the build, never ship partial data.
- **Navigation**: menus come from WordPress locations `primary`, `footer`, `legal`
  (see `docs/wordpress-menus.md`); components use `src/lib/navigation.ts`, never the collection directly.
  Logo, language switcher, Contact CTA and site info (`src/config/site.ts`) are fixed in Astro.
- **Pages**: thin route files in `src/pages/` (ES root, `ca/`, `en/`) that render a template from `src/templates/`.
- **WordPress side**: `wordpress/mu-plugins/vilax-headless.php` (menu locations, ACF author fields,
  rebuild trigger, frontend redirect) is installed in `wp-content/mu-plugins/` on the WP server.
- **Checks**: `WP_USE_MOCKS=true npx astro check` and `astro build` (link checker reports broken internal links).

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
