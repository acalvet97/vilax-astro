<?php
/**
 * Header de VILAX: arranque.
 *
 * Se carga desde functions.php del tema hijo. Estructura:
 *  - config.php        IDs, categorías del mega menú y textos por idioma.
 *  - classes/          Lógica (configuración, modo claro/oscuro, render, assets, admin, migración).
 *  - templates/        Marcado HTML.
 *  - assets/           CSS y JS.
 *
 * El header lo pinta el tema (template-parts/header.php del tema hijo) siempre que
 * no haya una plantilla de header de Elementor con condiciones activas.
 *
 * @package Vilax\Header
 */

namespace Vilax\Header;

defined( 'ABSPATH' ) || exit;

const VERSION = '2.0.0';
const DIR     = __DIR__;
const SUBPATH = 'inc/vilax-header'; // Ruta dentro del tema hijo, para construir URLs.

require DIR . '/classes/class-config.php';
require DIR . '/classes/class-mode.php';
require DIR . '/classes/class-renderer.php';
require DIR . '/classes/class-assets.php';

Mode::init();
Assets::init();

if ( is_admin() ) {
	require DIR . '/classes/class-admin.php';
	require DIR . '/classes/class-migration.php';
	Admin::init();
	Migration::init();
}
