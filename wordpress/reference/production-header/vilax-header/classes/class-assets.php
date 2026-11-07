<?php
/**
 * CSS y JS del header, y su compatibilidad con WP Rocket.
 *
 * Los dos son archivos estáticos versionados con su fecha de modificación: el navegador
 * los guarda en caché y cualquier cambio en ellos invalida esa caché automáticamente.
 *
 * @package Vilax\Header
 */

namespace Vilax\Header;

defined( 'ABSPATH' ) || exit;

final class Assets {

	const HANDLE = 'vilax-header';
	const CSS    = 'assets/css/header.css';
	const JS     = 'assets/js/header.js';

	public static function init() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue' ), 20 );

		// WP Rocket «Eliminar CSS no utilizado»: conservar el archivo y las clases del header.
		add_filter( 'rocket_rucss_safelist', array( __CLASS__, 'rucss_safelist' ) );
		// WP Rocket «Retrasar JavaScript»: el menú debe responder al primer toque.
		add_filter( 'rocket_delay_js_exclusions', array( __CLASS__, 'delay_js_exclusions' ) );

		// Exclusiones del marquee (mu-plugin vilax-marquee). Vivían en el antiguo plugin del header;
		// se quedan aquí hasta que el marquee pase también al tema y las declare él mismo.
		add_filter( 'rocket_rucss_inline_atts_exclusions', array( __CLASS__, 'marquee_inline_atts' ) );
		add_filter( 'rocket_rucss_inline_content_exclusions', array( __CLASS__, 'marquee_inline_content' ) );
	}

	public static function url( $file ) {
		return get_stylesheet_directory_uri() . '/' . SUBPATH . '/' . $file;
	}

	private static function version( $file ) {
		$path = DIR . '/' . $file;
		return file_exists( $path ) ? (string) filemtime( $path ) : VERSION;
	}

	public static function enqueue() {
		// El JS se registra aquí y se encola desde Renderer::render(), solo si el header se pinta.
		wp_register_script(
			self::HANDLE,
			self::url( self::JS ),
			array(),
			self::version( self::JS ),
			array( 'in_footer' => true, 'strategy' => 'defer' )
		);

		// CSS del header propio de Hello: no se usa si el header y el footer son el de VILAX y una plantilla de Elementor.
		if ( self::elementor_has( 'footer' ) ) {
			wp_dequeue_style( 'hello-elementor-header-footer' );
		}

		if ( ! self::theme_header_shows() ) {
			return;
		}

		wp_enqueue_style( self::HANDLE, self::url( self::CSS ), array(), self::version( self::CSS ) );
	}

	/**
	 * ¿Se pintará el header del tema en esta página?
	 * No si la página usa la plantilla Elementor Canvas o si una plantilla de header de Elementor la cubre.
	 *
	 * @return bool
	 */
	private static function theme_header_shows() {
		if ( is_singular() && 'elementor_canvas' === get_page_template_slug( get_queried_object_id() ) ) {
			return false;
		}
		return ! self::elementor_has( 'header' );
	}

	/**
	 * ¿Hay una plantilla de Elementor Pro asignada a esta ubicación en la página actual?
	 * Si Elementor Pro no está o su API cambia, devuelve false (el header del tema se carga igual).
	 *
	 * @param string $location header o footer.
	 * @return bool
	 */
	private static function elementor_has( $location ) {
		$module = '\ElementorPro\Modules\ThemeBuilder\Module';
		if ( ! class_exists( $module ) ) {
			return false;
		}
		$conditions = $module::instance()->get_conditions_manager();
		if ( ! is_callable( array( $conditions, 'get_documents_for_location' ) ) ) {
			return false;
		}
		return ! empty( $conditions->get_documents_for_location( $location ) );
	}

	/* ---------- WP Rocket ---------- */

	public static function rucss_safelist( $list ) {
		return array_merge( (array) $list, array( '/' . SUBPATH . '/' . self::CSS, '.vx-(.*)', '#vx-(.*)', '.vx-lock' ) );
	}

	public static function delay_js_exclusions( $list ) {
		return array_merge( (array) $list, array( '/' . SUBPATH . '/' . self::JS ) );
	}

	public static function marquee_inline_atts( $list ) {
		return array_merge( (array) $list, array( 'vilax-marquee' ) );
	}

	public static function marquee_inline_content( $list ) {
		return array_merge( (array) $list, array( '@keyframes vx-' ) );
	}
}
