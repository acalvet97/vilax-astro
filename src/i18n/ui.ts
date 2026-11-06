/**
 * Interface strings (not content). Content lives in WordPress or src/content.
 * Add a key to `es` first; TypeScript then requires it in `ca` and `en`.
 */
import type { Locale } from './config';

const es = {
  'nav.main': 'Navegación principal',
  'nav.menu': 'Menú',
  'nav.openMenu': 'Abrir menú',
  'nav.closeMenu': 'Cerrar menú',
  'nav.home': 'VILAX, ir a la página de inicio',
  'nav.contact': 'Contacto',
  'footer.about': 'About',
  'footer.askAi': 'Pregúntale a la IA sobre VILAX',
  'footer.askAiWith': 'Preguntar a',
  'footer.social': 'Redes sociales',
  'footer.legal': 'Información legal',
  'footer.rights': 'Todos los derechos reservados.',
  'nav.skipToContent': 'Saltar al contenido',
  'nav.language': 'Idioma',
  'blog.title': 'Insights',
  'blog.readMore': 'Leer artículo',
  'blog.publishedOn': 'Publicado el',
  'blog.by': 'Por',
  'blog.latestFrom': 'Artículos de',
  'blog.empty': 'Todavía no hay artículos.',
  'pagination.previous': 'Anterior',
  'pagination.next': 'Siguiente',
  'pagination.page': 'Página',
};

type UiKey = keyof typeof es;

const ca: Record<UiKey, string> = {
  'nav.main': 'Navegació principal',
  'nav.menu': 'Menú',
  'nav.openMenu': 'Obre el menú',
  'nav.closeMenu': 'Tanca el menú',
  'nav.home': "VILAX, ves a la pàgina d'inici",
  'nav.contact': 'Contacte',
  'footer.about': 'About',
  'footer.askAi': 'Pregunta a la IA sobre VILAX',
  'footer.askAiWith': 'Pregunta a',
  'footer.social': 'Xarxes socials',
  'footer.legal': 'Informació legal',
  'footer.rights': 'Tots els drets reservats.',
  'nav.skipToContent': 'Salta al contingut',
  'nav.language': 'Idioma',
  'blog.title': 'Insights',
  'blog.readMore': "Llegeix l'article",
  'blog.publishedOn': 'Publicat el',
  'blog.by': 'Per',
  'blog.latestFrom': 'Articles de',
  'blog.empty': 'Encara no hi ha articles.',
  'pagination.previous': 'Anterior',
  'pagination.next': 'Següent',
  'pagination.page': 'Pàgina',
};

const en: Record<UiKey, string> = {
  'nav.main': 'Main navigation',
  'nav.menu': 'Menu',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'nav.home': 'VILAX, go to home page',
  'nav.contact': 'Contact',
  'footer.about': 'About',
  'footer.askAi': 'Ask AI about VILAX',
  'footer.askAiWith': 'Ask',
  'footer.social': 'Social media',
  'footer.legal': 'Legal information',
  'footer.rights': 'All rights reserved.',
  'nav.skipToContent': 'Skip to content',
  'nav.language': 'Language',
  'blog.title': 'Insights',
  'blog.readMore': 'Read article',
  'blog.publishedOn': 'Published on',
  'blog.by': 'By',
  'blog.latestFrom': 'Articles by',
  'blog.empty': 'No articles yet.',
  'pagination.previous': 'Previous',
  'pagination.next': 'Next',
  'pagination.page': 'Page',
};

const ui: Record<Locale, Record<UiKey, string>> = { es, ca, en };

export function useTranslations(locale: Locale) {
  return (key: UiKey) => ui[locale][key];
}

const dateLocales: Record<Locale, string> = { es: 'es-ES', ca: 'ca-ES', en: 'en-GB' };

export function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(dateLocales[locale], { dateStyle: 'long' }).format(date);
}
