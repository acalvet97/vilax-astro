/**
 * Site-wide constants that are not editorial navigation (navigation menus
 * come from WordPress, see src/lib/navigation.ts).
 */
import type { Locale } from '../i18n/config';

export const site = {
  name: 'VILAX',
  url: 'https://www.vilax.es',
  /** Hosts treated as "this site" when normalizing URLs coming from WordPress. */
  hosts: ['www.vilax.es', 'vilax.es'],
  address: ['C/ Sant Climent 34,', '08840 Viladecans (Barcelona)'],
  email: 'vilax@vilax.es',
  phone: { display: '+34 936 335 784', href: 'tel:+34936335784' },
} as const;

export type SocialNetwork = 'linkedin' | 'instagram' | 'facebook' | 'tiktok' | 'behance' | 'youtube';

/** Order matches the Figma footer. */
export const socialLinks: Array<{ network: SocialNetwork; label: string; href: string }> = [
  { network: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/refravilax-s.l./mycompany/' },
  { network: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/vilax_expansion/' },
  { network: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/vilaxexpansion/' },
  { network: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@vilax_expansion' },
  { network: 'behance', label: 'Behance', href: 'https://www.behance.net/vilax_expansion' },
  { network: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@vilax_expansion' },
];

/** Footer "Ask AI about VILAX" prompt (same text as production). */
export const footerAiPrompt: Record<Locale, string> = {
  es: 'Visita https://www.vilax.es y explícame quién es VILAX, qué servicios ofrece y por qué sería una buena agencia de marketing digital para mi marca.',
  ca: "Visita https://www.vilax.es i explica'm qui és VILAX, quins serveis ofereix i per què seria una bona agència de màrqueting digital per a la meva marca.",
  en: 'Visit https://www.vilax.es and tell me who VILAX is, what services they offer and why they would be a good digital marketing agency for my brand.',
};

export type AiAssistant = 'chatgpt' | 'gemini' | 'claude' | 'perplexity';

/**
 * "Ask AI" destinations for any question. Order matches the Figma footer.
 * "Gemini" opens Google AI Mode, as in production.
 */
export function getAiLinks(
  locale: Locale,
  prompt: string,
): Array<{ assistant: AiAssistant; label: string; href: string }> {
  const q = encodeURIComponent(prompt);
  return [
    { assistant: 'chatgpt', label: 'ChatGPT', href: `https://chatgpt.com/?q=${q}&hints=search` },
    { assistant: 'gemini', label: 'Google AI', href: `https://www.google.com/search?udm=50&hl=${locale}&q=${q}` },
    { assistant: 'claude', label: 'Claude', href: `https://claude.ai/new?q=${q}` },
    { assistant: 'perplexity', label: 'Perplexity', href: `https://www.perplexity.ai/search?q=${q}` },
  ];
}
