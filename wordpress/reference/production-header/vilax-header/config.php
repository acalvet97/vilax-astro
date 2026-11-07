<?php
/**
 * Configuración del header de VILAX.
 *
 * Es el único archivo que hay que tocar para cambios de contenido.
 * Todos los ID son los de la versión en castellano: WPML los convierte al idioma actual.
 *
 * El modo claro u oscuro de cada página NO está aquí: se elige en Páginas
 * (columna «Header», edición rápida o en lote, o la caja «Header» al editar).
 *
 * @package Vilax\Header
 */

defined( 'ABSPATH' ) || exit;

return array(

	'source_lang'   => 'es',

	// Menú de WordPress «Servicios»: alimenta el mega menú y el menú móvil.
	'menu_services' => 40,

	// Logos (ID de la biblioteca de medios).
	'logo_on_dark'  => 4727, // logo-light (blanco).
	'logo_on_light' => 4728, // logo-dark (negro).

	// Páginas enlazadas desde el header.
	'pages'         => array(
		'about'    => 3226,
		'insights' => 2979,
		'contact'  => 3059,
	),

	// Proyectos: archivo del tipo de contenido «casos».
	'cases_type'    => 'casos',
	'cases_url'     => '/casos/', // Respaldo si el archivo no tiene enlace propio.

	// Una entrada por categoría del menú «Servicios», en el mismo orden:
	// página principal de la categoría, imagen del mega menú y encuadre de la imagen.
	'categories'    => array(
		array( 'page' => 3959, 'image' => 12634, 'position' => '50% 85%' ),  // Estrategia & Growth.
		array( 'page' => 3743, 'image' => 12636, 'position' => '50% 100%' ), // Performance Marketing.
		array( 'page' => 3957, 'image' => 12607, 'position' => '70% 50%' ),  // Brand Experience.
		array( 'page' => 3952, 'image' => 12611, 'position' => '50% 50%' ),  // Desarrollo Web.
		array( 'page' => 3954, 'image' => 13366, 'position' => '60% 50%' ),  // Creative Media.
	),

	// Textos fijos por idioma. Si un idioma no está, se usa el de source_lang.
	'strings'       => array(
		'es' => array(
			'services' => 'Servicios',
			'projects' => 'Proyectos',
			'about'    => 'About',
			'insights' => 'Insights',
			'contact'  => 'Contacto',
			'cta'      => 'Hablemos de tu proyecto',
			'see'      => 'Ver %s',
			'back'     => 'Volver',
			'open'     => 'Abrir menú',
			'close'    => 'Cerrar menú',
			'nav'      => 'Navegación principal',
			'lang'     => 'Idioma',
		),
		'ca' => array(
			'services' => 'Serveis',
			'projects' => 'Projectes',
			'about'    => 'About',
			'insights' => 'Insights',
			'contact'  => 'Contacte',
			'cta'      => 'Parlem del teu projecte',
			'see'      => 'Veure %s',
			'back'     => 'Tornar',
			'open'     => 'Obrir menú',
			'close'    => 'Tancar menú',
			'nav'      => 'Navegació principal',
			'lang'     => 'Idioma',
		),
		'en' => array(
			'services' => 'Services',
			'projects' => 'Projects',
			'about'    => 'About',
			'insights' => 'Insights',
			'contact'  => 'Contact',
			'cta'      => 'Let’s talk about your project',
			'see'      => 'View %s',
			'back'     => 'Back',
			'open'     => 'Open menu',
			'close'    => 'Close menu',
			'nav'      => 'Main navigation',
			'lang'     => 'Language',
		),
	),
);
