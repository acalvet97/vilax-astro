/**
 * Decides where WordPress-backed data comes from.
 *
 *   WP_USE_MOCKS=true   → 'mock'       (explicit opt-in, e.g. preview builds)
 *   WP_GRAPHQL_URL set  → 'wordpress'  (errors and missing data fail the build)
 *   `astro dev`         → 'mock'       (local development before WP is ready)
 *   otherwise           → throws: a production build never ships without WP data.
 */
import { WP_GRAPHQL_URL, WP_USE_MOCKS } from 'astro:env/server';

export type DataSource = 'wordpress' | 'mock';

export function getDataSource(): DataSource {
  if (WP_USE_MOCKS) return 'mock';
  if (WP_GRAPHQL_URL) return 'wordpress';
  if (import.meta.env.DEV) return 'mock';
  throw new Error(
    'WP_GRAPHQL_URL is not set. Production builds require WordPress data. ' +
      'Set WP_GRAPHQL_URL, or WP_USE_MOCKS=true for a preview build with mock data.',
  );
}
