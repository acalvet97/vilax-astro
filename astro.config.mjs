// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import icon from 'astro-icon';
import { site } from './src/config/site.ts';
import { defaultLocale, locales } from './src/i18n/config.ts';
import { linkCheck } from './src/integrations/link-check.ts';

// Host that serves WordPress media (used for build-time image optimization).
const WP_MEDIA_HOST = 'vilaxheadless.staging.vilax.es';

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  output: 'static',
  // Every page is prerendered; the adapter only runs the Astro Actions
  // (contact form) as a serverless function. Hosting isn't decided yet:
  // switching to Cloudflare means replacing this with @astrojs/cloudflare.
  adapter: vercel(),

  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: { prefixDefaultLocale: false },
  },

  env: {
    schema: {
      WP_GRAPHQL_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        url: true,
      }),
      // Build with mock data instead of WordPress (previews before WP is ready).
      // Production builds without WP_GRAPHQL_URL fail unless this is true.
      WP_USE_MOCKS: envField.boolean({
        context: 'server',
        access: 'secret',
        default: false,
      }),
      // Inbox that receives contact form submissions.
      CONTACT_TO_EMAIL: envField.string({
        context: 'server',
        access: 'public',
        default: 'vilax@vilax.es',
      }),
    },
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: ['300 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

  image: {
    // www.vilax.es: production media (mocks and content migration).
    domains: [WP_MEDIA_HOST, 'www.vilax.es'],
    // Author photos come from Gravatar; optimized at build time so visitors
    // never request gravatar.com directly.
    remotePatterns: [{ protocol: 'https', hostname: '**.gravatar.com' }],
  },

  integrations: [
    icon(),
    // No sitemap `i18n` option: it assumes identical paths per locale, but our
    // slugs are translated. hreflang alternates are emitted in each page <head>.
    sitemap(),
    // TODO: set failOnBrokenLinks: true once all Astro pages exist (before launch).
    linkCheck({ failOnBrokenLinks: false }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
