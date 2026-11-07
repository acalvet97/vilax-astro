<?php
/**
 * Sustituye el header de Hello Elementor por el de VILAX.
 *
 * Hello carga este archivo (o dynamic-header.php, según sus ajustes) solo cuando
 * no hay una plantilla de header de Elementor asignada a la página.
 * El header vive en inc/vilax-header/.
 *
 * @package HelloElementorChild
 */

defined( 'ABSPATH' ) || exit;

if ( class_exists( '\Vilax\Header\Renderer' ) ) {
	\Vilax\Header\Renderer::render();
}
