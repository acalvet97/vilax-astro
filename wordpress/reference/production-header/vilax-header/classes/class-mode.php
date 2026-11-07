<?php
/**
 * Modo claro u oscuro del header.
 *
 * Cada página guarda su modo en el campo _vilax_header_mode:
 *  - ''      Automático: se aplican las reglas de self::auto().
 *  - 'light' Claro.
 *  - 'dark'  Oscuro.
 *
 * El valor se mantiene igual en todas las traducciones de WPML: al guardarlo se copia
 * a las demás versiones (self::set) y wpml-config.xml hace lo mismo con las traducciones nuevas.
 *
 * @package Vilax\Header
 */

namespace Vilax\Header;

defined( 'ABSPATH' ) || exit;

final class Mode {

	const META_KEY = '_vilax_header_mode';
	const LIGHT    = 'light';
	const DARK     = 'dark';

	/** @var bool|null Resultado de is_light() para la petición actual. */
	private static $is_light = null;

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_meta' ) );
	}

	public static function register_meta() {
		register_post_meta(
			'page',
			self::META_KEY,
			array(
				'type'              => 'string',
				'single'            => true,
				'default'           => '',
				'show_in_rest'      => false,
				'sanitize_callback' => array( __CLASS__, 'sanitize' ),
				'auth_callback'     => static function ( $allowed, $meta_key, $post_id ) {
					return current_user_can( 'edit_post', $post_id );
				},
			)
		);
	}

	/**
	 * @param mixed $value Valor recibido.
	 * @return string '', 'light' o 'dark'.
	 */
	public static function sanitize( $value ) {
		return in_array( $value, array( self::LIGHT, self::DARK ), true ) ? $value : '';
	}

	/**
	 * Modo guardado en una página ('' si es automático).
	 *
	 * @param int $post_id ID de la página.
	 * @return string
	 */
	public static function get( $post_id ) {
		return self::sanitize( (string) get_post_meta( (int) $post_id, self::META_KEY, true ) );
	}

	/**
	 * Guarda el modo en una página y en todas sus traducciones.
	 *
	 * @param int    $post_id ID de la página.
	 * @param string $mode    '', 'light' o 'dark'.
	 */
	public static function set( $post_id, $mode ) {
		foreach ( self::translations( $post_id ) as $id ) {
			self::set_single( $id, $mode );
		}
	}

	/**
	 * Guarda el modo solo en esta página, sin tocar sus traducciones.
	 *
	 * @param int    $post_id ID de la página.
	 * @param string $mode    '', 'light' o 'dark'.
	 */
	public static function set_single( $post_id, $mode ) {
		$mode = self::sanitize( $mode );
		if ( '' === $mode ) {
			delete_post_meta( (int) $post_id, self::META_KEY );
		} else {
			update_post_meta( (int) $post_id, self::META_KEY, $mode );
		}
	}

	/**
	 * IDs de la página y de todas sus traducciones (solo la propia si no hay WPML).
	 *
	 * @param int $post_id ID de la página.
	 * @return int[]
	 */
	public static function translations( $post_id ) {
		$post_id = (int) $post_id;
		$type    = 'post_' . get_post_type( $post_id );
		$ids     = array( $post_id );
		$trid    = apply_filters( 'wpml_element_trid', null, $post_id, $type );

		if ( $trid ) {
			$translations = apply_filters( 'wpml_get_element_translations', null, $trid, $type );
			foreach ( (array) $translations as $translation ) {
				if ( ! empty( $translation->element_id ) ) {
					$ids[] = (int) $translation->element_id;
				}
			}
		}

		return array_values( array_unique( $ids ) );
	}

	/**
	 * ¿El header de la petición actual va en modo claro?
	 *
	 * @return bool
	 */
	public static function is_light() {
		if ( null === self::$is_light ) {
			$light = self::auto();

			if ( is_page() ) {
				$mode = self::get( get_queried_object_id() );
				if ( '' !== $mode ) {
					$light = self::LIGHT === $mode;
				}
			}

			self::$is_light = (bool) apply_filters( 'vilax_header_is_light', $light );
		}
		return self::$is_light;
	}

	/**
	 * Reglas automáticas: estos contenidos van en claro y el resto en oscuro.
	 * Las páginas no entran en ninguna regla, así que en automático son oscuras.
	 *
	 * @return bool
	 */
	private static function auto() {
		$cases = Config::get( 'cases_type' );

		return is_404()
			|| is_singular( array( 'post', $cases ) )
			|| is_post_type_archive( array( $cases, 'tipo_de_caso', 'tipo_de_servicio' ) )
			|| is_category()
			|| is_author()
			|| is_tax( array( 'tipo_de_caso', 'tipo_de_servicio' ) );
	}
}
