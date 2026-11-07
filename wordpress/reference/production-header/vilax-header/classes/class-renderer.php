<?php
/**
 * Prepara los datos del header y pinta las plantillas de templates/.
 *
 * @package Vilax\Header
 */

namespace Vilax\Header;

defined( 'ABSPATH' ) || exit;

final class Renderer {

	/** @var string|null Idioma actual, calculado una vez por petición. */
	private static $lang = null;

	/**
	 * Pinta el header completo. Lo llama template-parts/header.php del tema hijo.
	 */
	public static function render() {
		wp_enqueue_script( Assets::HANDLE );

		ob_start();
		self::part( 'header', self::data() );
		// Quita los espacios entre etiquetas para que el HTML sea idéntico al de la versión anterior.
		echo trim( preg_replace( '/>\s+</', '><', ob_get_clean() ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	}

	/**
	 * Carga una plantilla de templates/ con sus datos en $args.
	 *
	 * @param string $name Nombre del archivo sin .php.
	 * @param array  $args Datos para la plantilla.
	 */
	public static function part( $name, array $args ) {
		load_template( DIR . '/templates/' . $name . '.php', false, $args );
	}

	/**
	 * Datos que comparten todas las plantillas.
	 *
	 * @return array
	 */
	private static function data() {
		$pages = Config::get( 'pages' );

		return array(
			'light'   => Mode::is_light(),
			'cats'    => self::services(),
			'langs'   => self::languages(),
			'home'    => apply_filters( 'wpml_home_url', home_url( '/' ) ),
			'contact' => self::page_url( $pages['contact'] ),
			'primary' => array(
				array( 'label' => self::t( 'projects' ), 'url' => self::cases_url() ),
				array( 'label' => self::t( 'about' ), 'url' => self::page_url( $pages['about'] ) ),
				array( 'label' => self::t( 'insights' ), 'url' => self::page_url( $pages['insights'] ) ),
			),
		);
	}

	/* ---------- Ayudas para las plantillas ---------- */

	/**
	 * Texto fijo en el idioma actual.
	 *
	 * @param string $key Clave de 'strings' en config.php.
	 * @return string
	 */
	public static function t( $key ) {
		$strings = Config::get( 'strings' );
		return $strings[ self::lang() ][ $key ];
	}

	/**
	 * Icono SVG en línea.
	 *
	 * @param string $name down, right o left.
	 * @return string
	 */
	public static function icon( $name ) {
		$paths = array(
			'down'  => '<path d="M12 15.6 5.6 9.2l1.4-1.4 5 5 5-5 1.4 1.4z"/>',
			'right' => '<path d="m13.2 12-5-5 1.4-1.4 6.4 6.4-6.4 6.4-1.4-1.4z"/>',
			'left'  => '<path d="m10.8 12 5 5-1.4 1.4L8 12l6.4-6.4 1.4 1.4z"/>',
		);
		return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">' . $paths[ $name ] . '</svg>';
	}

	/**
	 * Logo adecuado al modo.
	 *
	 * @param bool   $light   Modo claro.
	 * @param string $loading eager o lazy.
	 * @return string
	 */
	public static function logo( $light, $loading = 'eager' ) {
		return wp_get_attachment_image(
			Config::get( $light ? 'logo_on_light' : 'logo_on_dark' ),
			'medium',
			false,
			array( 'alt' => 'VILAX', 'loading' => $loading, 'decoding' => 'async', 'class' => 'vx-logo' )
		);
	}

	/**
	 * Imagen de una categoría del mega menú.
	 *
	 * @param array $cat Categoría de services().
	 * @return string
	 */
	public static function category_image( array $cat ) {
		if ( ! $cat['img'] ) {
			return '';
		}
		return wp_get_attachment_image(
			$cat['img'],
			'medium_large',
			false,
			array(
				'class'    => 'vx-mega__img',
				'alt'      => '',
				'loading'  => 'lazy',
				'decoding' => 'async',
				'sizes'    => '(max-width: 1600px) 25vw, 400px',
				'style'    => 'object-position:' . $cat['pos'],
			)
		);
	}

	/* ---------- Datos ---------- */

	private static function lang() {
		if ( null === self::$lang ) {
			$lang       = apply_filters( 'wpml_current_language', null );
			$strings    = Config::get( 'strings' );
			self::$lang = ( $lang && isset( $strings[ $lang ] ) ) ? $lang : Config::get( 'source_lang' );
		}
		return self::$lang;
	}

	private static function tid( $id, $type = 'page' ) {
		return (int) apply_filters( 'wpml_object_id', $id, $type, true );
	}

	private static function page_url( $id ) {
		return get_permalink( self::tid( $id ) );
	}

	private static function cases_url() {
		$url = get_post_type_archive_link( Config::get( 'cases_type' ) );
		return $url ? $url : home_url( Config::get( 'cases_url' ) );
	}

	/**
	 * Categorías y servicios del menú «Servicios», con la configuración de cada categoría.
	 *
	 * @return array
	 */
	private static function services() {
		$items = wp_get_nav_menu_items( self::tid( Config::get( 'menu_services' ), 'nav_menu' ) );
		if ( ! $items ) {
			return array();
		}

		$current = (int) get_queried_object_id();
		$cats    = array();

		foreach ( $items as $item ) {
			if ( 0 === (int) $item->menu_item_parent ) {
				$cats[ $item->ID ] = array( 'title' => $item->title, 'items' => array() );
			}
		}
		foreach ( $items as $item ) {
			$parent = (int) $item->menu_item_parent;
			if ( $parent && isset( $cats[ $parent ] ) ) {
				$cats[ $parent ]['items'][] = array(
					'title'   => $item->title,
					'url'     => $item->url,
					'current' => $current && (int) $item->object_id === $current,
				);
			}
		}

		$config = Config::get( 'categories' );
		$cats   = array_values( $cats );
		foreach ( $cats as $i => $cat ) {
			$cfg               = isset( $config[ $i ] ) ? $config[ $i ] : array();
			$cats[ $i ]['hub'] = ! empty( $cfg['page'] ) ? self::page_url( $cfg['page'] ) : '';
			$cats[ $i ]['img'] = ! empty( $cfg['image'] ) ? (int) $cfg['image'] : 0;
			$cats[ $i ]['pos'] = ! empty( $cfg['position'] ) ? $cfg['position'] : '50% 50%';
		}
		return $cats;
	}

	/**
	 * Idiomas activos de WPML (vacío si no hay WPML o solo hay uno).
	 *
	 * @return array
	 */
	private static function languages() {
		$langs = apply_filters( 'wpml_active_languages', null, array( 'skip_missing' => 0 ) );
		return ( is_array( $langs ) && count( $langs ) > 1 ) ? $langs : array();
	}
}
