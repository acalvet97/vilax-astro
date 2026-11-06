# Menús de WordPress

Los menús de la web se gestionan en WordPress (**Apariencia → Menús**) y Astro los lee por GraphQL al compilar.
El diseño, el estilo y el comportamiento de los menús están en Astro (`src/components/layout/Header.astro` y `Footer.astro`).

## Resumen

Hay **3 menús**, cada uno en **3 idiomas** (9 menús en total):

| Menú (nombre sugerido) | Ubicación (mu-plugin) | Dónde se ve |
|---|---|---|
| Principal | *Header: navegación principal* | Menú del header. El bloque «Servicios» también genera las 5 primeras columnas del footer. |
| Footer About | *Footer: columna About* | Última columna del footer. |
| Legal | *Footer: enlaces legales* | Barra inferior del footer. |

> **Si un menú está vacío o no tiene ubicación asignada en algún idioma, la compilación falla** y el error dice qué menú e idioma faltan. Es intencionado: así nunca se publica un header o un footer incompleto.

## Cómo crearlos

1. **Crea el menú en español.** Ve a *Apariencia → Menús* con el idioma **Español** activo (selector de WPML en la barra superior), haz clic en «crea un nuevo menú», ponle el nombre (p. ej. `Principal`) y marca su ubicación en «Ajustes del menú».
2. **Añade cada elemento como «Enlaces personalizados»**, con la URL y el texto exactamente como aparecen abajo:
   - Usa **rutas relativas** que empiecen y acaben en `/` (por ejemplo `/contacto/`). También funcionan URL completas (`https://www.vilax.es/contacto/`), pero las relativas son más claras.
   - **La barra inicial es obligatoria.** Si escribes `ca/contacte/`, WordPress lo guarda como `http://ca/contacte/` y la compilación falla.
   - El elemento **«Servicios»** no es un enlace: ponle `#` como URL.
   - Los enlaces externos (Podcast) llevan la URL completa.
3. **Construye la jerarquía arrastrando** los elementos hacia la derecha para convertirlos en subelementos: *Servicios → categoría → servicio*. **El orden del menú es el orden de la web.**
4. **Crea las traducciones.** En la caja *Idioma* del menú (WPML), pulsa **«+»** junto a *Català* y luego junto a *English*. WPML crea un menú vacío vinculado; añade los elementos a mano con los textos y **URLs de ese idioma** (las rutas están traducidas) y asígnale la **misma ubicación**.
   - No uses la «Sincronización de menús» de WPML: copiaría las URL en español a los otros idiomas.
5. Repite los pasos para *Footer About* y *Legal*.

### Qué se puede tocar sin ayuda de desarrollo

- Cambiar textos, reordenar, añadir o quitar enlaces → se refleja en la próxima compilación.
- **Añadir subelementos a «Sobre nosotros» (u otro elemento de primer nivel)**: se convierte automáticamente en un desplegable con flecha (como en el diseño de Figma).
- Una nueva categoría dentro de «Servicios» (con sus servicios) → aparece como columna en el desplegable de Servicios y en el footer.
- Si una URL interna no existe en la web, la compilación avisa (antes del lanzamiento, fallará).

### Lo que NO se gestiona desde menús

El logo, el selector de idioma, el botón amarillo **Contacto**, la dirección, el email, el teléfono, las redes sociales y los botones «Pregúntale a la IA» son fijos en Astro (`src/config/site.ts` y `src/i18n/ui.ts`).

---

## 1. Menú «Principal» → ubicación *Header: navegación principal*

Los elementos en **negrita** son los niveles 1 y 2 (Servicios, categorías y enlaces principales); los demás son el nivel 3 (servicios).

### Español

- **Servicios** → `#`
  - **Estrategia & Growth** → `/estrategia-growth/`
    - Estrategia Digital 360 → `/estrategia-growth/estrategia-digital-360/`
    - Consultoría de Marketing → `/estrategia-growth/consultoria-de-marketing/`
    - Estrategia de Growth y Escalabilidad → `/estrategia-growth/growth-escalabilidad/`
    - Auditorías → `/estrategia-growth/auditorias/`
    - eCommerce Manager → `/estrategia-growth/ecommerce-manager/`
  - **Performance Marketing** → `/performance-marketing/`
    - Paid Media → `/performance-marketing/paid-media/`
    - SEO Avanzado y Growth SEO → `/performance-marketing/seo-avanzado/`
    - Conversion Rate Optimization (CRO) → `/performance-marketing/optimizacion-conversion-cro/`
    - Marketing Automation → `/performance-marketing/marketing-automation/`
  - **Brand Experience** → `/brand-experience/`
    - Branding Estratégico → `/brand-experience/branding/`
    - Diseño Visual y Packaging → `/brand-experience/diseno-visual-y-packaging/`
    - Content Marketing y Storytelling → `/brand-experience/brand-experience-content-marketing/`
  - **Desarrollo Web** → `/desarrollo-web/`
    - eCommerce y Shopify → `/desarrollo-web/ecommerce-shopify/`
    - Webs Corporativas → `/desarrollo-web/webs-corporativas/`
    - Conversion-Oriented Landing Pages → `/desarrollo-web/landing-page/`
    - Plataformas a Medida → `/desarrollo-web/plataformas-a-medida/`
    - Mantenimientos y Evolutivos → `/desarrollo-web/mantenimientos-evolutivos/`
  - **Creative Media** → `/creative-media/`
    - Producción Audiovisual → `/creative-media/produccion-audiovisual/`
    - Producción de Podcast → `https://vilaxpodcast.com/`
    - Vídeo Marketing Estratégico → `/creative-media/video-marketing/`
    - Motion Graphics y Animación → `/creative-media/motion-graphics-animacion/`
    - Fotografía de Producto → `/creative-media/fotografia-de-producto/`
    - Tours Virtuales 360 → `/creative-media/tours-virtuales-360/`
- **Proyectos** → `/casos/`
- **Sobre nosotros** → `/sobre-nosotros/`
- **Insights** → `/insights/`

### Català

- **Serveis** → `#`
  - **Estratègia & Growth** → `/ca/estrategia-growth/`
    - Estratègia Digital 360 → `/ca/estrategia-growth/estrategia-digital-per-a-empreses-planificacio-orientada-al-creixement/`
    - Consultoria de Marketing → `/ca/estrategia-growth/consultoria-de-marqueting-estrategia-clara-orientada-a-resultats/`
    - Estratègia de Growth i Escalabilitat → `/ca/estrategia-growth/growth-marketing-estrategia-de-creixement-i-escalabilitat/`
    - Auditories → `/ca/estrategia-growth/auditoria-digital-analisi-clara-per-prendre-millors-decisions-de-marketing/`
    - eCommerce Manager → `/ca/estrategia-growth/ecommerce-manager-gestio-integral-per-fer-creixer-la-teva-botiga-online/`
  - **Performance Marketing** → `/ca/performance-marketing/`
    - Paid Media → `/ca/performance-marketing/agencia-de-paid-media-google-ads-meta-ads-i-mes/`
    - SEO Avançat i Growth SEO → `/ca/performance-marketing/agencia-seo-visibilitat-organica-que-atrau-transit-amb-intencio/`
    - Conversion Rate Optimization (CRO) → `/ca/performance-marketing/agencia-cro-converteix-millor-el-transit-que-ja-tens/`
    - Marketing Automation → `/ca/performance-marketing/marketing-automation-automatitza-processos-millora-resultats/`
  - **Brand Experience** → `/ca/brand-experience/`
    - Branding estratègic → `/ca/brand-experience/agencia-de-branding-construim-marques-per-connectar-diferenciar-te-i-creixer/`
    - Disseny Visual i Packaging → `/ca/brand-experience/disseny-grafic-per-a-empreses-peces-visuals-que-reforcen-el-valor-de-marca/`
    - Content Marketing i Storytelling → `/ca/brand-experience/content-marketing-i-storytelling-continguts-que-construeixen-marca-i-connecten-amb-el-teu-public/`
  - **Desenvolupament Web** → `/ca/desenvolupament-web/`
    - eCommerce i Shopify → `/ca/desenvolupament-web/agencia-ecommerce-shopify/`
    - Webs Corporatives → `/ca/desenvolupament-web/disseny-i-desenvolupament-de-webs-corporatives/`
    - Conversion-Oriented Landing Pages → `/ca/desenvolupament-web/landing-pages-orientades-a-conversio/`
    - Plataformes a Mida → `/ca/desenvolupament-web/plataformes-digitals-a-mida/`
    - Manteniments i Evolutius → `/ca/desenvolupament-web/manteniment-i-actualitzacions-del-lloc-web/`
  - **Creative Media** → `/ca/creative-media/`
    - Producció Audiovisual → `/ca/creative-media/produccio-audiovisual-per-a-empreses-contingut-que-comunica-i-connecta-amb-la-teva-audiencia/`
    - Producció de Podcast → `https://vilaxpodcast.com/`
    - Vídeo Marketing → `/ca/creative-media/video-marketing-videos-connectats-amb-lestrategia-de-la-teva-marca/`
    - Motion Graphics i Animació → `/ca/creative-media/motion-graphics-i-animacio-moviment-amb-estrategia-per-a-la-teva-marca/`
    - Fotografia de Producte → `/ca/creative-media/fotografia-de-producte-imatges-pensades-per-vendre-comunicar-i-diferenciar-la-teva-marca/`
    - Tours Virtuals 360 → `/ca/creative-media/tour-virtual-360-feu-que-el-vostre-espai-es-visiti-abans-darribar/`
- **Projectes** → `/ca/casos/`
- **Sobre nosaltres** → `/ca/sobre-nosaltres/`
- **Insights** → `/insights/`

### English

- **Services** → `#`
  - **Strategy & Growth** → `/en/strategy-growth/`
    - 360 Digital Strategy → `/en/strategy-growth/digital-strategy-for-businesses-growth-oriented-planning/`
    - Marketing Consulting → `/en/strategy-growth/marketing-consulting-clear-results-oriented-strategy/`
    - Growth & Scalability Strategy → `/en/strategy-growth/growth-marketing-strategy-for-growth-and-scalability/`
    - Audits → `/en/strategy-growth/digital-audit-clear-analysis-for-making-better-marketing-decisions/`
    - eCommerce Manager → `/en/strategy-growth/ecommerce-manager-comprehensive-management-to-grow-your-online-store/`
  - **Performance Marketing** → `/en/performance-marketing/`
    - Paid Media → `/en/performance-marketing/paid-media-agency-google-ads-meta-ads-and-more/`
    - Advanced SEO & Growth SEO → `/en/performance-marketing/seo-agency-organic-visibility-that-attracts-intentional-traffic/`
    - Conversion Rate Optimization (CRO) → `/en/performance-marketing/cro-agency-better-convert-the-traffic-you-already-have/`
    - Marketing Automation → `/en/performance-marketing/marketing-automation-automate-processes-improve-results/`
  - **Brand Experience** → `/en/brand-experience/`
    - Strategic Branding → `/en/brand-experience/branding-agency-we-build-brands-to-connect-differentiate-and-grow/`
    - Graphic Design & Packaging → `/en/brand-experience/graphic-design-for-businesses-visual-pieces-that-reinforce-brand-value/`
    - Content Marketing & Storytelling → `/en/brand-experience/content-marketing-and-storytelling-content-that-builds-brand-awareness-and-connects-with-your-audience/`
  - **Web Development** → `/en/web-developement/`
    - eCommerce & Shopify → `/en/web-developement/ecommerce-shopify-agency/`
    - Corporate Websites → `/en/web-developement/corporate-website-design-and-development/`
    - Conversion-Oriented Landing Pages → `/en/web-developement/conversion-oriented-landing-pages/`
    - Custom Platforms → `/en/web-developement/custom-digital-platforms/`
    - Maintenance & Upgrades → `/en/web-developement/website-maintenance-and-upgrades/`
  - **Creative Media** → `/en/creative-media/`
    - Audiovisual Production → `/en/creative-media/audiovisual-production-for-companies-content-that-communicates-and-connects-with-your-audience/`
    - Podcast Production → `https://vilaxpodcast.com/`
    - Video Marketing → `/en/creative-media/video-marketing-videos-connected-to-your-brand-strategy/`
    - Motion Graphics & Animation → `/en/creative-media/motion-graphics-and-animation-strategic-movement-for-your-brand/`
    - Product Photography → `/en/creative-media/product-photography-images-designed-to-sell-communicate-and-differentiate-the-brand/`
    - 360 Virtual Tours → `/en/creative-media/360-virtual-tour-make-your-space-visible-before-visitors-arrive/`
- **Projects** → `/en/cases/`
- **About us** → `/en/about-us/`
- **Insights** → `/en/insights/`

---

## 2. Menú «Footer About» → ubicación *Footer: columna About*

El título de la columna («About») es fijo en Astro; el menú solo contiene los enlaces.

### Español

- Contacto → `/contacto/`
- Sobre nosotros → `/sobre-nosotros/`
- Trabaja con nosotros → `/trabaja-con-nosotros/`
- Insights → `/insights/`

### Català

- Contacte → `/ca/contacte/`
- Sobre nosaltres → `/ca/sobre-nosaltres/`
- Treballa amb nosaltres → `/ca/treballa-amb-nosaltres/`

### English

- Contact → `/en/contact/`
- About us → `/en/about-us/`
- Work with us → `/en/work-with-us/`

> El diseño de Figma incluye también **«Equipo»**, pero esa página no existe en producción. Añádelo solo cuando exista la página.
> En catalán e inglés, producción no tiene blog propio, por eso no incluyen «Insights».

---

## 3. Menú «Legal» → ubicación *Footer: enlaces legales*

### Español

- Aviso legal → `/aviso-legal/`
- Política de privacidad → `/politica-de-privacidad/`
- Política de cookies → `/politica-de-cookies/`

### Català

- Avís legal → `/ca/avis-legal/`
- Política de privadesa → `/ca/politica-de-privadesa/`
- Política de cookies → `/ca/politica-de-cookies/`

### English

- Legal notice → `/en/legal-notice/`
- Privacy Policy → `/en/privacy-policy/`
- Cookies policy → `/en/cookies-policy/`

> El diseño de Figma incluye un cuarto enlace, **«Política de Privacidad y Redes Sociales»**, que no existe en producción. Añádelo solo si se crea esa página.

---

## Notas

- **«Insights» en catalán** apunta a `/insights/` (el blog en español), igual que en producción, porque no hay blog en catalán.
- Las URL son las mismas que en producción (www.vilax.es), así se conservan el SEO y los enlaces existentes.
- Estos datos coinciden con los menús de prueba que Astro usa en desarrollo (`src/lib/wp/mocks/menus.ts`).
