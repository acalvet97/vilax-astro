/**
 * Contact page copy (Figma Contact_dk_v3, 2034:8559). Interface strings (form
 * labels, errors, map) are in src/i18n/ui.ts.
 *
 * - Intro: Figma copy (ES); CA and EN translated from it.
 * - FAQs: production ES copy (www.vilax.es/contacto/, the only complete set:
 *   production CA/EN repeat a placeholder answer); CA and EN translated from it.
 *   Answers are HTML.
 */
import type { Locale } from '../i18n/config';
import type { FaqItem } from '../lib/faq';

type ContactContent = {
  seo: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  faq: { eyebrow: string; title: string; cta: string; items: FaqItem[] };
};

export const contactContent: Record<Locale, ContactContent> = {
  es: {
    seo: {
      title: 'Contacto | VILAX',
      description:
        'Cuéntanos tu situación, tus objetivos y en qué área digital necesitas apoyo. Revisaremos tu caso y te contactaremos para proponerte el camino más adecuado.',
    },
    eyebrow: 'Contacto',
    title: 'Explícanos qué necesitas',
    lead: 'Cuéntanos tu situación, tus objetivos y en qué área digital necesitas apoyo. Revisaremos tu caso y te contactaremos para proponerte el camino más adecuado.',
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Preguntas que pueden ayudarte antes de contactar',
      cta: 'Pide información',
      items: [
        {
          question: '¿Qué tipo de proyectos podéis ayudarme a desarrollar?',
          answer:
            '<p>En VILAX trabajamos proyectos de marketing digital, estrategia 360, diseño web, SEO, campañas de paid media, branding, contenido, fotografía, vídeo, automatización y consultoría. Podemos ayudarte tanto en proyectos puntuales como en estrategias continuadas para hacer crecer tu negocio.</p>',
        },
        {
          question: '¿Cómo sé qué servicio necesita mi empresa?',
          answer:
            '<p>No hace falta que llegues con una solución cerrada. Puedes explicarnos tu situación actual, tus objetivos o el problema que quieres resolver, y analizaremos qué acciones tienen más sentido para tu negocio.</p>',
        },
        {
          question: '¿Puedo contactar con VILAX aunque todavía no tenga claro el proyecto?',
          answer:
            '<p>Sí. Muchas colaboraciones empiezan con una primera conversación para entender necesidades, detectar oportunidades y definir prioridades antes de plantear una propuesta concreta.</p>',
        },
        {
          question: '¿Trabajáis con empresas de cualquier sector?',
          answer:
            '<p>Sí. Hemos trabajado con negocios locales, ecommerce, marcas B2B, restaurantes, clínicas, proyectos industriales, empresas de servicios y marcas con presencia nacional o internacional. Adaptamos la estrategia al sector, al modelo de negocio y al momento de cada empresa.</p>',
        },
      ],
    },
  },
  ca: {
    seo: {
      title: 'Contacte | VILAX',
      description:
        'Explica’ns la teva situació, els teus objectius i en quina àrea digital necessites suport. Revisarem el teu cas i et contactarem per proposar-te el camí més adequat.',
    },
    eyebrow: 'Contacte',
    title: 'Explica’ns què necessites',
    lead: 'Explica’ns la teva situació, els teus objectius i en quina àrea digital necessites suport. Revisarem el teu cas i et contactarem per proposar-te el camí més adequat.',
    faq: {
      eyebrow: 'Preguntes freqüents',
      title: 'Preguntes que et poden ajudar abans de contactar',
      cta: 'Demana informació',
      items: [
        {
          question: 'Quin tipus de projectes em podeu ajudar a desenvolupar?',
          answer:
            '<p>A VILAX treballem projectes de màrqueting digital, estratègia 360, disseny web, SEO, campanyes de paid media, branding, contingut, fotografia, vídeo, automatització i consultoria. Et podem ajudar tant en projectes puntuals com en estratègies continuades per fer créixer el teu negoci.</p>',
        },
        {
          question: 'Com sé quin servei necessita la meva empresa?',
          answer:
            '<p>No cal que arribis amb una solució tancada. Pots explicar-nos la teva situació actual, els teus objectius o el problema que vols resoldre, i analitzarem quines accions tenen més sentit per al teu negoci.</p>',
        },
        {
          question: 'Puc contactar amb VILAX encara que no tingui clar el projecte?',
          answer:
            '<p>Sí. Moltes col·laboracions comencen amb una primera conversa per entendre necessitats, detectar oportunitats i definir prioritats abans de plantejar una proposta concreta.</p>',
        },
        {
          question: 'Treballeu amb empreses de qualsevol sector?',
          answer:
            '<p>Sí. Hem treballat amb negocis locals, ecommerce, marques B2B, restaurants, clíniques, projectes industrials, empreses de serveis i marques amb presència nacional o internacional. Adaptem l’estratègia al sector, al model de negoci i al moment de cada empresa.</p>',
        },
      ],
    },
  },
  en: {
    seo: {
      title: 'Contact | VILAX',
      description:
        'Tell us about your situation, your goals and the digital area you need support with. We’ll review your case and get back to you with the most suitable approach.',
    },
    eyebrow: 'Contact',
    title: 'Tell us what you need',
    lead: 'Tell us about your situation, your goals and the digital area you need support with. We’ll review your case and get back to you with the most suitable approach.',
    faq: {
      eyebrow: 'Frequently asked questions',
      title: 'Questions that may help you before getting in touch',
      cta: 'Request information',
      items: [
        {
          question: 'What kinds of projects can you help me with?',
          answer:
            '<p>At VILAX we work on digital marketing, 360 strategy, web design, SEO, paid media campaigns, branding, content, photography, video, automation and consulting projects. We can help you with one-off projects as well as ongoing strategies to grow your business.</p>',
        },
        {
          question: 'How do I know which service my company needs?',
          answer:
            '<p>You don’t need to come with a finished solution. Tell us about your current situation, your goals or the problem you want to solve, and we’ll work out which actions make the most sense for your business.</p>',
        },
        {
          question: 'Can I contact VILAX if I’m not sure about the project yet?',
          answer:
            '<p>Yes. Many collaborations start with a first conversation to understand needs, spot opportunities and set priorities before putting forward a specific proposal.</p>',
        },
        {
          question: 'Do you work with companies in any sector?',
          answer:
            '<p>Yes. We’ve worked with local businesses, ecommerce, B2B brands, restaurants, clinics, industrial projects, service companies and brands with a national or international presence. We adapt the strategy to the sector, the business model and the stage each company is at.</p>',
        },
      ],
    },
  },
};
