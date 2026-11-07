/**
 * TEMPORARY mock blog data, used only when the data source is 'mock'
 * (see src/lib/wp/source.ts). Raw WPGraphQL shapes, so mocks go through the
 * same normalization as WordPress data. Content based on the Figma
 * "ArtículoBlog" design.
 */
import type { Locale } from '../../../i18n/config';
import type { WpAuthor, WpCategory, WpPost } from '../queries';

const author: WpAuthor = {
  databaseId: 1,
  slug: 'blai',
  name: 'Blai Torras',
  description: 'Marketing Manager en VILAX.',
  avatar: { url: 'https://secure.gravatar.com/avatar/?s=512&d=mp', foundAvatar: true },
  authorProfile: { jobTitle: 'Marketing Manager', linkedinUrl: null },
  seo: null,
};

const ARTICLE_ES = `
<p>En VILAX llevamos años ayudando a empresas a mejorar su posicionamiento. Y si algo hemos notado, es esto: <strong>hay muchísima confusión con los conceptos básicos del dominio</strong>.</p>
<p>Hoy vamos a dejarlo claro. Nada de tecnicismos innecesarios: qué es un subdominio, qué es un subdirectorio y cuándo conviene usar cada uno.</p>
<h2 class="wp-block-heading">Qué es un subdominio (y por qué podrías usar uno)</h2>
<p>Un <strong>subdominio</strong> es como una rama independiente de tu web principal. Funciona como una “miniweb” dentro del mismo dominio, pero con su propia estructura.</p>
<p>Ejemplo típico: blog.tusitio.com o tienda.tusitio.com. Google lo trata como si fuera un sitio separado.</p>
<h2 class="wp-block-heading">Qué es un subdirectorio (y cuándo es la opción ganadora)</h2>
<p>Un <strong>subdirectorio</strong> es simplemente una carpeta dentro de tu dominio principal, como tusitio.com/blog.</p>
<blockquote class="wp-block-quote"><p>Todo lo que pongas aquí hereda la autoridad del dominio raíz.</p><cite>Equipo SEO de VILAX</cite></blockquote>
<h2 class="wp-block-heading">Cuándo usar subdominios: lo bueno, lo malo y lo que nadie te cuenta</h2>
<p>Hay situaciones donde un subdominio tiene todo el sentido del mundo:</p>
<ul class="wp-block-list"><li>Si operas en varios países (es.tusitio.com, fr.tusitio.com)</li><li>Si tienes una app o sistema técnico separado (app.tusitio.com)</li><li>Si haces testing o staging (dev.tusitio.com)</li></ul>
<h3 class="wp-block-heading">¿Y para el blog?</h3>
<p>Ahora bien: <strong>olvídate del subdominio para cosas como el blog</strong>. Aunque se puede, es más costoso en términos de SEO.</p>
<h2 class="wp-block-heading">Conclusión: no es blanco o negro, pero sí hay decisiones malas</h2>
<p>Tanto subdominios como subdirectorios <strong>pueden funcionar</strong>. Lo importante es la lógica detrás de tu sitio. <a href="/contacto/">Hablemos</a> si quieres revisarlo.</p>
`;

const ARTICLE_EN = `
<p>At VILAX we have spent years helping companies improve their rankings. And if there is one thing we have noticed, it is this: <strong>there is a lot of confusion about basic domain concepts</strong>.</p>
<h2 class="wp-block-heading">What is a subdomain (and why you might use one)</h2>
<p>A <strong>subdomain</strong> is like an independent branch of your main website, with its own structure.</p>
<h2 class="wp-block-heading">What is a subdirectory (and when it wins)</h2>
<p>A <strong>subdirectory</strong> is simply a folder inside your main domain, such as yoursite.com/blog.</p>
<ul class="wp-block-list"><li>Blog → yoursite.com/blog</li><li>Resources → yoursite.com/resources</li></ul>
<h2 class="wp-block-heading">Conclusion</h2>
<p>Both can work, but <strong>subdirectories are your best friend</strong> for most cases.</p>
`;

const SHORT = (topic: string) => `
<p>Contenido de ejemplo sobre <strong>${topic}</strong>.</p>
<h2 class="wp-block-heading">Introducción</h2>
<p>Texto de ejemplo para el primer apartado del artículo.</p>
<h2 class="wp-block-heading">Claves</h2>
<ol class="wp-block-list"><li>Primera clave</li><li>Segunda clave</li></ol>
`;

const faqsEs = [
  { question: '¿Cambiar de dominio afecta al SEO?', answer: '<p>Sí, si no se hace con redirecciones 301 y un plan de migración. Bien hecho, el impacto es temporal.</p>' },
  { question: '¿Todas las páginas de una web deben indexarse?', answer: '<p>No. Páginas legales, de agradecimiento o duplicadas suelen marcarse como <em>noindex</em>.</p>' },
  { question: '¿Qué pasa si tengo varias versiones del dominio?', answer: '<p>Hay que unificarlas con redirecciones a una única versión canónica.</p>' },
];

const cat = (slug: string, name: string) => ({ slug, name });

const posts: Record<Locale, WpPost[]> = {
  es: [
    {
      databaseId: 101,
      slug: 'subdominios-vs-subdirectorios-seo',
      title: 'Subdominios vs Subdirectorios: ¿Importa de Verdad Para el SEO?',
      excerpt: '<p>Qué es un subdominio, qué es un subdirectorio y cuándo conviene usar cada uno.</p>',
      content: ARTICLE_ES,
      date: '2026-10-28T09:00:00',
      modified: '2026-10-28T09:00:00',
      language: { code: 'es' },
      translations: [{ slug: 'subdomains-vs-subdirectories-seo', language: { code: 'en-us' } }],
      categories: { nodes: [cat('seo', 'SEO')] },
      postFields: {
        tldr: 'Subdominios, subdirectorios, dominios raíz… A veces parece que hay que ser ingeniero para entender cómo organizar bien una web. Y lo peor es que cada experto dice algo distinto.',
        faqs: faqsEs,
      },
      cta: {
        eyebrow: 'Cómo trabajamos',
        title: '¿Quieres que tu web gane posiciones en Google?',
        text: 'Analizamos la arquitectura de tu web y definimos la estructura que mejor posiciona tu negocio.',
      },
      author: { node: author },
      seo: null,
    },
    {
      databaseId: 102,
      slug: 'figma-config-2026-diseno-digital',
      title: 'Figma Config 2026: La Revolución del Diseño Digital',
      excerpt: '<p>Lo más destacado de Figma Config.</p>',
      content: SHORT('Figma Config'),
      date: '2026-10-14T09:00:00',
      modified: '2026-10-14T09:00:00',
      language: { code: 'es' },
      translations: [],
      categories: { nodes: [cat('tecnologia', 'Tecnología')] },
      postFields: { tldr: null, faqs: null },
      author: { node: author },
      seo: null,
    },
    {
      databaseId: 103,
      slug: 'una-super-noche-vilax-team',
      title: '¡Una super noche para recordar con todo el VILAX Team!',
      excerpt: '<p>Así fue nuestra cena de equipo.</p>',
      content: SHORT('el VILAX Team'),
      date: '2026-09-30T09:00:00',
      modified: '2026-09-30T09:00:00',
      language: { code: 'es' },
      translations: [],
      categories: { nodes: [cat('noticias', 'Noticias')] },
      postFields: { tldr: null, faqs: null },
      author: { node: author },
      seo: null,
    },
  ],
  ca: [],
  en: [
    {
      databaseId: 201,
      slug: 'subdomains-vs-subdirectories-seo',
      title: 'Subdomains vs Subdirectories: Does It Really Matter for SEO?',
      excerpt: '<p>What a subdomain is, what a subdirectory is and when to use each.</p>',
      content: ARTICLE_EN,
      date: '2026-10-28T09:00:00',
      modified: '2026-10-28T09:00:00',
      language: { code: 'en-us' },
      translations: [{ slug: 'subdominios-vs-subdirectorios-seo', language: { code: 'es' } }],
      categories: { nodes: [cat('seo-en', 'SEO')] },
      postFields: {
        tldr: 'Subdomains, subdirectories, root domains… Sometimes it feels like you need to be an engineer to organise a website properly.',
        faqs: [{ question: 'Does changing domain affect SEO?', answer: '<p>Yes, unless it is done with 301 redirects and a migration plan.</p>' }],
      },
      author: { node: { ...author, description: 'Marketing Manager at VILAX.' } },
      seo: null,
    },
  ],
};

const categories: Record<Locale, WpCategory[]> = {
  es: [
    { databaseId: 11, slug: 'seo', name: 'SEO', description: null, translations: [{ slug: 'seo-en', language: { code: 'en-us' } }], seo: null },
    { databaseId: 12, slug: 'tecnologia', name: 'Tecnología', description: null, translations: [], seo: null },
    { databaseId: 13, slug: 'noticias', name: 'Noticias', description: null, translations: [], seo: null },
  ],
  ca: [],
  en: [{ databaseId: 21, slug: 'seo-en', name: 'SEO', description: null, translations: [{ slug: 'seo', language: { code: 'es' } }], seo: null }],
};

export const getMockPosts = (locale: Locale): WpPost[] => posts[locale];
export const getMockCategories = (locale: Locale): WpCategory[] => categories[locale];
