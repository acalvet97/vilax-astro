/**
 * FAQs: shared by blog articles (ACF repeater, see docs/wordpress-acf.md) and
 * Astro-owned pages (copy in src/content/). `answer` is HTML.
 */
import { stripHtml } from './wp/normalize';

export type FaqItem = { question: string; answer: string };

/** schema.org FAQPage JSON-LD, or undefined when there are no questions. */
export function buildFaqJsonLd(items: FaqItem[]): string | undefined {
  if (items.length === 0) return undefined;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: stripHtml(f.answer) },
    })),
  });
}
