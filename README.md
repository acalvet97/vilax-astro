# VILAX website

Static [Astro](https://astro.build) site for [www.vilax.es](https://www.vilax.es) with a headless
WordPress (WPML + ACF + Yoast + WPGraphQL) for blog posts, authors, categories, case studies and menus.
Languages: `es` (root), `ca` (`/ca/`), `en` (`/en/`).

## Setup

```sh
cp .env.example .env   # WP_GRAPHQL_URL of the headless WordPress
npm install
npm run dev
```

## Commands

| Command                               | Action                                                         |
| :------------------------------------ | :------------------------------------------------------------- |
| `npm run dev`                         | Dev server (mock WordPress data when `WP_GRAPHQL_URL` is unset) |
| `WP_USE_MOCKS=true npx astro check`   | Type check with mock data                                      |
| `WP_USE_MOCKS=true npx astro build`   | Build with mock data                                           |
| `npm run build`                       | Production build against WordPress (fails if data is missing)  |

## Documentation

- [AGENTS.md](AGENTS.md): conventions (design tokens, styling, i18n, WordPress data, navigation, pages).
- [CLAUDE.md](CLAUDE.md): architecture map, decisions, gotchas and status.
- [docs/](docs/): WordPress menus and ACF field groups.
- [wordpress/](wordpress/): mu-plugin and ACF JSON exports for the headless WordPress.
