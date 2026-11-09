/**
 * Minimal WPGraphQL client (build time only). No dependencies.
 */
import { WP_GRAPHQL_URL } from 'astro:env/server';

export async function wpQuery<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!WP_GRAPHQL_URL) {
    throw new Error('WP_GRAPHQL_URL is not set. Copy .env.example to .env.');
  }

  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed: ${res.status} ${res.statusText} (${WP_GRAPHQL_URL})`);
  }

  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };

  if (json.errors?.length) {
    throw new Error(`WPGraphQL errors:\n- ${json.errors.map((e) => e.message).join('\n- ')}`);
  }
  if (!json.data) {
    throw new Error('WPGraphQL returned no data');
  }
  return json.data;
}

type Connection<TNode> = {
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  nodes: TNode[];
};

/**
 * Fetches every page of a cursor-paginated connection (e.g. `posts`).
 * The query must accept `$first: Int` and `$after: String`.
 */
export async function wpQueryAll<TNode>(
  query: string,
  variables: Record<string, unknown>,
  connection: string,
): Promise<TNode[]> {
  const nodes: TNode[] = [];
  let after: string | null = null;
  do {
    const data: Record<string, Connection<TNode>> = await wpQuery(query, { ...variables, first: 100, after });
    const { nodes: page, pageInfo } = data[connection];
    nodes.push(...page);
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);
  return nodes;
}
