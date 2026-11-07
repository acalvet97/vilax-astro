/**
 * TEMPORARY mock menus, used only when the data source is 'mock'
 * (see src/lib/wp/source.ts). Content mirrors the production menus of
 * www.vilax.es (Nov 2026) so development looks realistic.
 *
 * Mocks are returned in the same raw WPGraphQL shape as the real query
 * (flat list with parentId/order), so they go through the exact same
 * normalization as WordPress data. Delete this file once WordPress is live
 * if mocks are no longer wanted.
 */
import type { Locale } from '../../../i18n/config';
import type { MenuLocation, WpMenuItem } from '../queries';

type MockItem = { label: string; url?: string; children?: MockItem[] };

const PODCAST = 'https://vilaxpodcast.com/';

/** Mega-menu images of the 5 service categories, in order (same as production). */
const UPLOADS = 'https://www.vilax.es/wp-content/uploads';
const MEGA_IMAGES = [
  { src: `${UPLOADS}/2026/02/re-read-768x1018.webp`, width: 768, height: 1018, position: '50% 85%' },
  { src: `${UPLOADS}/2026/02/eas-barcelona-768x1069.webp`, width: 768, height: 1069, position: '50% 100%' },
  { src: `${UPLOADS}/2026/02/brand-experience-banner.webp`, width: 709, height: 665, position: '70% 50%' },
  { src: `${UPLOADS}/2026/02/desarollo-web-VILAX-768x960.webp`, width: 768, height: 960, position: '50% 50%' },
  { src: `${UPLOADS}/2026/05/ribera-manero-staff-768x512.webp`, width: 768, height: 512, position: '60% 50%' },
];

const primary: Record<Locale, MockItem[]> = {
  es: [
    {
      label: 'Servicios',
      children: [
        {
          label: 'Estrategia & Growth',
          url: '/estrategia-growth/',
          children: [
            { label: 'Estrategia Digital 360', url: '/estrategia-growth/estrategia-digital-360/' },
            { label: 'Consultoría de Marketing', url: '/estrategia-growth/consultoria-de-marketing/' },
            { label: 'Estrategia de Growth y Escalabilidad', url: '/estrategia-growth/growth-escalabilidad/' },
            { label: 'Auditorías', url: '/estrategia-growth/auditorias/' },
            { label: 'eCommerce Manager', url: '/estrategia-growth/ecommerce-manager/' },
          ],
        },
        {
          label: 'Performance Marketing',
          url: '/performance-marketing/',
          children: [
            { label: 'Paid Media', url: '/performance-marketing/paid-media/' },
            { label: 'SEO Avanzado y Growth SEO', url: '/performance-marketing/seo-avanzado/' },
            { label: 'Conversion Rate Optimization (CRO)', url: '/performance-marketing/optimizacion-conversion-cro/' },
            { label: 'Marketing Automation', url: '/performance-marketing/marketing-automation/' },
          ],
        },
        {
          label: 'Brand Experience',
          url: '/brand-experience/',
          children: [
            { label: 'Branding Estratégico', url: '/brand-experience/branding/' },
            { label: 'Diseño Visual y Packaging', url: '/brand-experience/diseno-visual-y-packaging/' },
            { label: 'Content Marketing y Storytelling', url: '/brand-experience/brand-experience-content-marketing/' },
          ],
        },
        {
          label: 'Desarrollo Web',
          url: '/desarrollo-web/',
          children: [
            { label: 'eCommerce y Shopify', url: '/desarrollo-web/ecommerce-shopify/' },
            { label: 'Webs Corporativas', url: '/desarrollo-web/webs-corporativas/' },
            { label: 'Conversion-Oriented Landing Pages', url: '/desarrollo-web/landing-page/' },
            { label: 'Plataformas a Medida', url: '/desarrollo-web/plataformas-a-medida/' },
            { label: 'Mantenimientos y Evolutivos', url: '/desarrollo-web/mantenimientos-evolutivos/' },
          ],
        },
        {
          label: 'Creative Media',
          url: '/creative-media/',
          children: [
            { label: 'Producción Audiovisual', url: '/creative-media/produccion-audiovisual/' },
            { label: 'Producción de Podcast', url: PODCAST },
            { label: 'Vídeo Marketing Estratégico', url: '/creative-media/video-marketing/' },
            { label: 'Motion Graphics y Animación', url: '/creative-media/motion-graphics-animacion/' },
            { label: 'Fotografía de Producto', url: '/creative-media/fotografia-de-producto/' },
            { label: 'Tours Virtuales 360', url: '/creative-media/tours-virtuales-360/' },
          ],
        },
      ],
    },
    { label: 'Proyectos', url: '/casos/' },
    { label: 'Sobre nosotros', url: '/sobre-nosotros/' },
    { label: 'Insights', url: '/insights/' },
  ],
  ca: [
    {
      label: 'Serveis',
      children: [
        {
          label: 'Estratègia & Growth',
          url: '/ca/estrategia-growth/',
          children: [
            { label: 'Estratègia Digital 360', url: '/ca/estrategia-growth/estrategia-digital-per-a-empreses-planificacio-orientada-al-creixement/' },
            { label: 'Consultoria de Marketing', url: '/ca/estrategia-growth/consultoria-de-marqueting-estrategia-clara-orientada-a-resultats/' },
            { label: 'Estratègia de Growth i Escalabilitat', url: '/ca/estrategia-growth/growth-marketing-estrategia-de-creixement-i-escalabilitat/' },
            { label: 'Auditories', url: '/ca/estrategia-growth/auditoria-digital-analisi-clara-per-prendre-millors-decisions-de-marketing/' },
            { label: 'eCommerce Manager', url: '/ca/estrategia-growth/ecommerce-manager-gestio-integral-per-fer-creixer-la-teva-botiga-online/' },
          ],
        },
        {
          label: 'Performance Marketing',
          url: '/ca/performance-marketing/',
          children: [
            { label: 'Paid Media', url: '/ca/performance-marketing/agencia-de-paid-media-google-ads-meta-ads-i-mes/' },
            { label: 'SEO Avançat i Growth SEO', url: '/ca/performance-marketing/agencia-seo-visibilitat-organica-que-atrau-transit-amb-intencio/' },
            { label: 'Conversion Rate Optimization (CRO)', url: '/ca/performance-marketing/agencia-cro-converteix-millor-el-transit-que-ja-tens/' },
            { label: 'Marketing Automation', url: '/ca/performance-marketing/marketing-automation-automatitza-processos-millora-resultats/' },
          ],
        },
        {
          label: 'Brand Experience',
          url: '/ca/brand-experience/',
          children: [
            { label: 'Branding estratègic', url: '/ca/brand-experience/agencia-de-branding-construim-marques-per-connectar-diferenciar-te-i-creixer/' },
            { label: 'Disseny Visual i Packaging', url: '/ca/brand-experience/disseny-grafic-per-a-empreses-peces-visuals-que-reforcen-el-valor-de-marca/' },
            { label: 'Content Marketing i Storytelling', url: '/ca/brand-experience/content-marketing-i-storytelling-continguts-que-construeixen-marca-i-connecten-amb-el-teu-public/' },
          ],
        },
        {
          label: 'Desenvolupament Web',
          url: '/ca/desenvolupament-web/',
          children: [
            { label: 'eCommerce i Shopify', url: '/ca/desenvolupament-web/agencia-ecommerce-shopify/' },
            { label: 'Webs Corporatives', url: '/ca/desenvolupament-web/disseny-i-desenvolupament-de-webs-corporatives/' },
            { label: 'Conversion-Oriented Landing Pages', url: '/ca/desenvolupament-web/landing-pages-orientades-a-conversio/' },
            { label: 'Plataformes a Mida', url: '/ca/desenvolupament-web/plataformes-digitals-a-mida/' },
            { label: 'Manteniments i Evolutius', url: '/ca/desenvolupament-web/manteniment-i-actualitzacions-del-lloc-web/' },
          ],
        },
        {
          label: 'Creative Media',
          url: '/ca/creative-media/',
          children: [
            { label: 'Producció Audiovisual', url: '/ca/creative-media/produccio-audiovisual-per-a-empreses-contingut-que-comunica-i-connecta-amb-la-teva-audiencia/' },
            { label: 'Producció de Podcast', url: PODCAST },
            { label: 'Vídeo Marketing', url: '/ca/creative-media/video-marketing-videos-connectats-amb-lestrategia-de-la-teva-marca/' },
            { label: 'Motion Graphics i Animació', url: '/ca/creative-media/motion-graphics-i-animacio-moviment-amb-estrategia-per-a-la-teva-marca/' },
            { label: 'Fotografia de Producte', url: '/ca/creative-media/fotografia-de-producte-imatges-pensades-per-vendre-comunicar-i-diferenciar-la-teva-marca/' },
            { label: 'Tours Virtuals 360', url: '/ca/creative-media/tour-virtual-360-feu-que-el-vostre-espai-es-visiti-abans-darribar/' },
          ],
        },
      ],
    },
    { label: 'Projectes', url: '/ca/casos/' },
    { label: 'Sobre nosaltres', url: '/ca/sobre-nosaltres/' },
    // Production has no Catalan blog: Insights links to the Spanish one.
    { label: 'Insights', url: '/insights/' },
  ],
  en: [
    {
      label: 'Services',
      children: [
        {
          label: 'Strategy & Growth',
          url: '/en/strategy-growth/',
          children: [
            { label: '360 Digital Strategy', url: '/en/strategy-growth/digital-strategy-for-businesses-growth-oriented-planning/' },
            { label: 'Marketing Consulting', url: '/en/strategy-growth/marketing-consulting-clear-results-oriented-strategy/' },
            { label: 'Growth & Scalability Strategy', url: '/en/strategy-growth/growth-marketing-strategy-for-growth-and-scalability/' },
            { label: 'Audits', url: '/en/strategy-growth/digital-audit-clear-analysis-for-making-better-marketing-decisions/' },
            { label: 'eCommerce Manager', url: '/en/strategy-growth/ecommerce-manager-comprehensive-management-to-grow-your-online-store/' },
          ],
        },
        {
          label: 'Performance Marketing',
          url: '/en/performance-marketing/',
          children: [
            { label: 'Paid Media', url: '/en/performance-marketing/paid-media-agency-google-ads-meta-ads-and-more/' },
            { label: 'Advanced SEO & Growth SEO', url: '/en/performance-marketing/seo-agency-organic-visibility-that-attracts-intentional-traffic/' },
            { label: 'Conversion Rate Optimization (CRO)', url: '/en/performance-marketing/cro-agency-better-convert-the-traffic-you-already-have/' },
            { label: 'Marketing Automation', url: '/en/performance-marketing/marketing-automation-automate-processes-improve-results/' },
          ],
        },
        {
          label: 'Brand Experience',
          url: '/en/brand-experience/',
          children: [
            { label: 'Strategic Branding', url: '/en/brand-experience/branding-agency-we-build-brands-to-connect-differentiate-and-grow/' },
            { label: 'Graphic Design & Packaging', url: '/en/brand-experience/graphic-design-for-businesses-visual-pieces-that-reinforce-brand-value/' },
            { label: 'Content Marketing & Storytelling', url: '/en/brand-experience/content-marketing-and-storytelling-content-that-builds-brand-awareness-and-connects-with-your-audience/' },
          ],
        },
        {
          label: 'Web Development',
          url: '/en/web-developement/',
          children: [
            { label: 'eCommerce & Shopify', url: '/en/web-developement/ecommerce-shopify-agency/' },
            { label: 'Corporate Websites', url: '/en/web-developement/corporate-website-design-and-development/' },
            { label: 'Conversion-Oriented Landing Pages', url: '/en/web-developement/conversion-oriented-landing-pages/' },
            { label: 'Custom Platforms', url: '/en/web-developement/custom-digital-platforms/' },
            { label: 'Maintenance & Upgrades', url: '/en/web-developement/website-maintenance-and-upgrades/' },
          ],
        },
        {
          label: 'Creative Media',
          url: '/en/creative-media/',
          children: [
            { label: 'Audiovisual Production', url: '/en/creative-media/audiovisual-production-for-companies-content-that-communicates-and-connects-with-your-audience/' },
            { label: 'Podcast Production', url: PODCAST },
            { label: 'Video Marketing', url: '/en/creative-media/video-marketing-videos-connected-to-your-brand-strategy/' },
            { label: 'Motion Graphics & Animation', url: '/en/creative-media/motion-graphics-and-animation-strategic-movement-for-your-brand/' },
            { label: 'Product Photography', url: '/en/creative-media/product-photography-images-designed-to-sell-communicate-and-differentiate-the-brand/' },
            { label: '360 Virtual Tours', url: '/en/creative-media/360-virtual-tour-make-your-space-visible-before-visitors-arrive/' },
          ],
        },
      ],
    },
    { label: 'Projects', url: '/en/cases/' },
    { label: 'About us', url: '/en/about-us/' },
    { label: 'Insights', url: '/en/insights/' },
  ],
};

const footer: Record<Locale, MockItem[]> = {
  es: [
    { label: 'Contacto', url: '/contacto/' },
    { label: 'Sobre nosotros', url: '/sobre-nosotros/' },
    { label: 'Trabaja con nosotros', url: '/trabaja-con-nosotros/' },
    { label: 'Insights', url: '/insights/' },
  ],
  ca: [
    { label: 'Contacte', url: '/ca/contacte/' },
    { label: 'Sobre nosaltres', url: '/ca/sobre-nosaltres/' },
    { label: 'Treballa amb nosaltres', url: '/ca/treballa-amb-nosaltres/' },
  ],
  en: [
    { label: 'Contact', url: '/en/contact/' },
    { label: 'About us', url: '/en/about-us/' },
    { label: 'Work with us', url: '/en/work-with-us/' },
  ],
};

const legal: Record<Locale, MockItem[]> = {
  es: [
    { label: 'Aviso legal', url: '/aviso-legal/' },
    { label: 'Política de privacidad', url: '/politica-de-privacidad/' },
    { label: 'Política de cookies', url: '/politica-de-cookies/' },
  ],
  ca: [
    { label: 'Avís legal', url: '/ca/avis-legal/' },
    { label: 'Política de privadesa', url: '/ca/politica-de-privadesa/' },
    { label: 'Política de cookies', url: '/ca/politica-de-cookies/' },
  ],
  en: [
    { label: 'Legal notice', url: '/en/legal-notice/' },
    { label: 'Privacy Policy', url: '/en/privacy-policy/' },
    { label: 'Cookies policy', url: '/en/cookies-policy/' },
  ],
};

const mocks: Record<MenuLocation, Record<Locale, MockItem[]>> = { primary, footer, legal };

/** Flattens a mock tree into WPGraphQL's flat menuItems shape. */
function toWpItems(tree: MockItem[], prefix: string): WpMenuItem[] {
  const out: WpMenuItem[] = [];
  let order = 0;
  const walk = (items: MockItem[], parentId: string | null, depth: number) => {
    items.forEach((item, index) => {
      const id = `${prefix}-${++order}`;
      // Second-level items with children are service categories: give them their image.
      const img = depth === 1 && item.children?.length ? MEGA_IMAGES[index] : undefined;
      out.push({
        id,
        parentId,
        order,
        label: item.label,
        url: item.url ?? '#',
        target: null,
        megaMenu: img
          ? {
              image: { node: { sourceUrl: img.src, altText: '', mediaDetails: { width: img.width, height: img.height } } },
              imagePosition: img.position,
            }
          : null,
      });
      if (item.children) walk(item.children, id, depth + 1);
    });
  };
  walk(tree, null, 0);
  return out;
}

export function getMockMenuItems(location: MenuLocation, locale: Locale): WpMenuItem[] {
  return toWpItems(mocks[location][locale], `mock-${location}-${locale}`);
}
