<?php
/**
 * Acceso a config.php.
 *
 * @package Vilax\Header
 */

namespace Vilax\Header;

defined( 'ABSPATH' ) || exit;

final class Config {

	/** @var array|null */
	private static $data = null;

	/**
	 * Devuelve un valor de config.php.
	 *
	 * @param string $key     Clave de primer nivel.
	 * @param mixed  $default Valor si la clave no existe.
	 * @return mixed
	 */
	public static function get( $key, $default = null ) {
		if ( null === self::$data ) {
			self::$data = require DIR . '/config.php';
		}
		return array_key_exists( $key, self::$data ) ? self::$data[ $key ] : $default;
	}
}
