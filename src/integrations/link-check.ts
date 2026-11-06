/**
 * Build-time internal link checker.
 *
 * After `astro build`, scans every generated HTML file for site-relative links
 * (href="/…") and reports those that don't resolve to a generated page or
 * file. Catches typos in WordPress menu custom links and broken internal links.
 *
 * `failOnBrokenLinks: true` makes the build fail; while pages are still
 * being built (foundation phase) it only warns.
 */
import type { AstroIntegration } from 'astro';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export function linkCheck({ failOnBrokenLinks = false } = {}): AstroIntegration {
  return {
    name: 'vilax:link-check',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = (await readdir(root, { recursive: true })).filter((f) => f.endsWith('.html'));

        const exists = (pathname: string) => {
          const clean = decodeURIComponent(pathname);
          return existsSync(join(root, clean)) && (!clean.endsWith('/') || existsSync(join(root, clean, 'index.html')));
        };

        const broken = new Map<string, Set<string>>();
        for (const file of files) {
          const html = await readFile(join(root, file), 'utf-8');
          const page = `/${relative(root, join(root, file)).replace(/index\.html$/, '')}`;
          for (const [, href] of html.matchAll(/href="(\/(?!\/)[^"#?]*)/g)) {
            if (!exists(href)) {
              if (!broken.has(href)) broken.set(href, new Set());
              broken.get(href)!.add(page);
            }
          }
        }

        if (broken.size === 0) {
          logger.info(`No broken internal links in ${files.length} pages.`);
          return;
        }
        const report = [...broken]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([href, pages]) => `  ${href}  (linked from ${pages.size} page${pages.size > 1 ? 's' : ''})`)
          .join('\n');
        const message = `${broken.size} broken internal link(s):\n${report}`;
        if (failOnBrokenLinks) throw new Error(message);
        logger.warn(message);
      },
    },
  };
}
