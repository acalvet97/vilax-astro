<?php
/**
 * Migración única desde la lista fija de páginas claras del antiguo plugin.
 *
 * La primera vez que un usuario con permiso para editar páginas entra al admin, marca
 * en claro las mismas páginas que antes, así que el día del cambio nada cambia visualmente:
 *  - Si el ID de la lista es la versión en castellano, se marca ella y todas sus traducciones
 *    (antes también eran claras, porque se comprobaba el original).
 *  - Si el ID es una traducción cuyo original no está en la lista, se marca solo esa traducción
 *    y se avisa en el admin, porque es un descuadre entre idiomas que conviene revisar.
 *
 * Cuando la migración ya se haya hecho en producción, este archivo puede borrarse
 * junto con su require en bootstrap.php.
 *
 * @package Vilax\Header
 */

namespace Vilax\Header;

defined( 'ABSPATH' ) || exit;

final class Migration {

	const OPTION  = 'vilax_header_mode_migrated';
	const REPORT  = 'vilax_header_mode_migration_report';
	const DISMISS = 'vilax_header_dismiss_migration';

	/** Páginas claras del antiguo plugin (Vilax_Header::LIGHT_PAGES, versión 1.1.0). */
	const LEGACY_LIGHT_PAGES = array(
		1020, 1022, 1024, 1026, 2979, 3059, 3226, 3743, 3952, 3954, 3957, 3959, 4232, 4994,
		5796, 5842, 5872, 5938, 5966, 5986, 6010, 6128, 6156, 6308, 6330, 6366, 6382,
		6434, 6456, 6472, 6497, 6513, 6544, 6546, 6548, 9016,
	);

	public static function init() {
		add_action( 'admin_init', array( __CLASS__, 'maybe_run' ) );
		add_action( 'admin_notices', array( __CLASS__, 'notice' ) );
	}

	public static function maybe_run() {
		if ( get_option( self::OPTION ) || ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		$lang   = Config::get( 'source_lang' );
		$report = array();

		foreach ( self::LEGACY_LIGHT_PAGES as $id ) {
			if ( 'page' !== get_post_type( $id ) ) {
				continue;
			}
			$source = (int) apply_filters( 'wpml_object_id', $id, 'page', true, $lang );

			if ( $source === $id ) {
				Mode::set( $id, Mode::LIGHT );
			} else {
				Mode::set_single( $id, Mode::LIGHT );
				if ( ! in_array( $source, self::LEGACY_LIGHT_PAGES, true ) ) {
					$report[] = $id;
				}
			}
		}

		update_option( self::OPTION, VERSION, false );
		if ( $report ) {
			update_option( self::REPORT, $report, false );
		}
	}

	/**
	 * Aviso en Páginas si había páginas claras solo en un idioma.
	 */
	public static function notice() {
		$report = get_option( self::REPORT );
		if ( ! $report || 'edit-page' !== get_current_screen()->id || ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		if ( isset( $_GET[ self::DISMISS ] ) && wp_verify_nonce( sanitize_key( wp_unslash( $_GET[ self::DISMISS ] ) ), self::DISMISS ) ) {
			delete_option( self::REPORT );
			return;
		}

		$links = array();
		foreach ( (array) $report as $id ) {
			$links[] = sprintf( '<a href="%s">%s</a>', esc_url( get_edit_post_link( $id ) ), esc_html( get_the_title( $id ) . ' (' . $id . ')' ) );
		}

		printf(
			'<div class="notice notice-warning"><p><strong>Header:</strong> estas páginas tenían el header claro solo en un idioma, no en su original en castellano: %s. Se han mantenido igual. Revisa la columna «Header» y elige el modo que corresponda; al guardarlo se aplicará a todas sus traducciones.</p><p><a href="%s">Entendido, ocultar aviso</a></p></div>',
			implode( ', ', $links ), // phpcs:ignore WordPress.Security.EscapeOutput
			esc_url( add_query_arg( self::DISMISS, wp_create_nonce( self::DISMISS ) ) )
		);
	}
}
