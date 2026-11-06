/**
 * Minimal WPGraphQL client (build time only). No dependencies.
 */
import { WP_GRAPHQL_URL } from 'astro:env/server';

export class WPGraphQLError extends Error {
  constructor(message: string, readonly query?: string) {
    super(message);
    this.name = 'WPGraphQLError';
  }
}

export async function wpQuery<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!WP_GRAPHQL_URL) {
    throw new WPGraphQLError('WP_GRAPHQL_URL is not set. Copy .env.example to .env.');
  }

  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new WPGraphQLError(`WPGraphQL request failed: ${res.status} ${res.statusText} (${WP_GRAPHQL_URL})`, query);
  }

  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };

  if (json.errors?.length) {
    throw new WPGraphQLError(`WPGraphQL errors:\n- ${json.errors.map((e) => e.message).join('\n- ')}`, query);
  }
  if (!json.data) {
    throw new WPGraphQLError('WPGraphQL returned no data', query);
  }
  return json.data;
}

type Connection<TNode> = {
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  nodes: TNode[];
};

/**
 * Fetches every page of a cursor-paginated connection.
 * The query must accept `$first: Int` and `$after: String`.
 */
export async function wpQueryAll<TData, TNode>(
  query: string,
  variables: Record<string, unknown>,
  select: (data: TData) => Connection<TNode>,
): Promise<TNode[]> {
  const nodes: TNode[] = [];
  let after: string | null = null;
  do {
    const data: TData = await wpQuery<TData>(query, { ...variables, first: 100, after });
    const connection = select(data);
    nodes.push(...connection.nodes);
    after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (after);
  return nodes;
}
