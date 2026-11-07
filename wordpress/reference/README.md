# Referencia: código de la web actual (producción)

Archivos de la web actual (WordPress + Elementor, tema hijo de Hello Elementor) guardados solo como
**referencia** para replicar su comportamiento en Astro. **No se instalan en el WordPress headless.**

- `production-header/`: header de www.vilax.es (`header.php`, `dynamic-header.php` y `vilax-header/`).
  Replicado en `src/components/layout/Header.astro`, `MegaMenu.astro`, `MobileDrawer.astro` y
  `src/scripts/header.ts`.
