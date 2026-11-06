# Campos ACF que usa la web

Los grupos de campos se gestionan desde **ACF Pro** (*ACF → Grupos de campos*). Astro los lee por
GraphQL, así que **los nombres GraphQL de esta página no se pueden cambiar** sin cambiar también el
código. Si alguien los cambia, la compilación de Astro falla con un error de GraphQL (no se publica
nada roto).

## Local JSON (copia de seguridad y sincronización)

El mu-plugin activa ACF Local JSON: cada vez que guardas un grupo, ACF escribe un archivo en
`wp-content/acf-json/` del servidor (la carpeta debe existir y tener permisos de escritura).

- Para pasar grupos de staging a producción: copia los JSON y usa *ACF → Grupos de campos → Sincronizar*.
- Guarda también una copia en este repositorio, en `wordpress/acf-json/`, cuando cambie un grupo.

## Grupos

En cada grupo, en *Ajustes del grupo → GraphQL*: **Mostrar en GraphQL = Sí** y el nombre de campo
GraphQL indicado. En cada campo: **Mostrar en GraphQL = Sí** y su nombre GraphQL.
Para los campos de posts, en WPML la preferencia de traducción debe ser **Traducir**.

### Perfil de autor → `User.authorProfile`

Ubicación: *Formulario de usuario = Todos*. Archivo: `wordpress/acf-json/group_vilax_author_profile.json`
(se puede importar en *ACF → Herramientas → Importar*).

| Campo | Nombre | Tipo | Nombre GraphQL |
|---|---|---|---|
| Cargo | `job_title` | Texto | `jobTitle` |
| LinkedIn (URL) | `linkedin_url` | URL | `linkedinUrl` |

- **Foto:** viene de **Gravatar** (la del email del usuario), no se sube a WordPress. Si el autor no
  tiene Gravatar, la firma se muestra sin foto. Astro descarga y optimiza la imagen al compilar.
- **Biografía:** campo nativo *Información biográfica* del usuario (se traduce en
  WPML → Traducción de cadenas → dominio «Authors»).

### Artículo (posts) → `Post.postFields`

Grupo «Artículos Insights». Ubicación: *Tipo de contenido = Entrada*.

| Campo | Nombre | Tipo | Nombre GraphQL |
|---|---|---|---|
| TL;DR | `tldr` | Área de texto | `tldr` |
| FAQs | `faqs` | Repetidor | `faqs` |
| ↳ Pregunta | — | Texto | `tituloFaq` |
| ↳ Respuesta | — | Editor WYSIWYG | `textFaq` |

Ambos son opcionales: si están vacíos, el bloque no aparece en el artículo.
