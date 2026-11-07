<?php
/**
 * Selector del modo del header en el admin de Páginas:
 *  - Columna «Header» en el listado.
 *  - Edición rápida y edición en lote.
 *  - Caja «Header» en la barra lateral al editar una página con el editor de WordPress.
 *
 * Al guardar, el modo se copia a todas las traducciones de la página.
 *
 * @package Vilax\Header
 */

namespace Vilax\Header;

defined( 'ABSPATH' ) || exit;

final class Admin {

	const COLUMN = 'vilax_header';
	const FIELD  = 'vilax_header_mode';
	const NONCE  = 'vilax_header_mode_nonce';
	const ACTION = 'vilax_header_mode_save';

	public static function init() {
		add_filter( 'manage_page_posts_columns', array( __CLASS__, 'add_column' ) );
		add_action( 'manage_page_posts_custom_column', array( __CLASS__, 'render_column' ), 10, 2 );
		add_action( 'quick_edit_custom_box', array( __CLASS__, 'quick_edit_box' ), 10, 2 );
		add_action( 'bulk_edit_custom_box', array( __CLASS__, 'bulk_edit_box' ), 10, 2 );
		add_action( 'add_meta_boxes_page', array( __CLASS__, 'add_meta_box' ) );
		add_action( 'save_post_page', array( __CLASS__, 'save' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue' ) );
		add_action( 'admin_head-edit.php', array( __CLASS__, 'column_css' ) );
	}

	private static function labels() {
		return array(
			''         => 'Automático',
			Mode::LIGHT => 'Claro',
			Mode::DARK  => 'Oscuro',
		);
	}

	private static function select( array $options, $selected ) {
		$out = '<select name="' . esc_attr( self::FIELD ) . '">';
		foreach ( $options as $value => $label ) {
			$out .= sprintf( '<option value="%s"%s>%s</option>', esc_attr( $value ), selected( $selected, $value, false ), esc_html( $label ) );
		}
		return $out . '</select>';
	}

	private static function nonce() {
		return wp_nonce_field( self::ACTION, self::NONCE, false, false );
	}

	/* ---------- Columna ---------- */

	public static function add_column( $columns ) {
		$columns[ self::COLUMN ] = 'Header';
		return $columns;
	}

	public static function render_column( $column, $post_id ) {
		if ( self::COLUMN !== $column ) {
			return;
		}
		$mode   = Mode::get( $post_id );
		$labels = self::labels();
		printf(
			'<span class="vx-mode vx-mode--%1$s" data-mode="%2$s">%3$s</span>',
			esc_attr( $mode ? $mode : 'auto' ),
			esc_attr( $mode ),
			esc_html( $labels[ $mode ] )
		);
	}

	public static function column_css() {
		if ( 'page' !== get_current_screen()->post_type ) {
			return;
		}
		echo '<style>.column-' . esc_attr( self::COLUMN ) . '{width:8em}.vx-mode--auto{color:#787c82}.vx-mode--light{font-weight:600}</style>';
	}

	/* ---------- Edición rápida y en lote ---------- */

	public static function quick_edit_box( $column, $post_type ) {
		if ( self::COLUMN === $column && 'page' === $post_type ) {
			self::inline_box( self::labels(), '' );
		}
	}

	public static function bulk_edit_box( $column, $post_type ) {
		if ( self::COLUMN === $column && 'page' === $post_type ) {
			self::inline_box( array( '-1' => '— Sin cambios —' ) + self::labels(), '-1' );
		}
	}

	private static function inline_box( array $options, $selected ) {
		echo '<fieldset class="inline-edit-col-right"><div class="inline-edit-col"><label class="inline-edit-group">';
		echo '<span class="title">Header</span>';
		echo self::select( $options, $selected ); // phpcs:ignore WordPress.Security.EscapeOutput
		echo self::nonce(); // phpcs:ignore WordPress.Security.EscapeOutput
		echo '</label></div></fieldset>';
	}

	public static function enqueue( $hook ) {
		if ( 'edit.php' !== $hook || 'page' !== get_current_screen()->post_type ) {
			return;
		}
		$file = 'assets/js/admin-quick-edit.js';
		wp_enqueue_script(
			'vilax-header-admin',
			Assets::url( $file ),
			array( 'jquery', 'inline-edit-post' ),
			(string) filemtime( DIR . '/' . $file ),
			true
		);
	}

	/* ---------- Caja en el editor ---------- */

	public static function add_meta_box() {
		add_meta_box( 'vilax-header-mode', 'Header', array( __CLASS__, 'render_meta_box' ), 'page', 'side' );
	}

	public static function render_meta_box( $post ) {
		echo '<p>' . self::select( self::labels(), Mode::get( $post->ID ) ) . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput
		echo '<p class="description">Automático: oscuro en páginas. Se aplica también a las traducciones.</p>';
		echo self::nonce(); // phpcs:ignore WordPress.Security.EscapeOutput
	}

	/* ---------- Guardado ---------- */

	/**
	 * Guarda el modo desde la edición rápida, la edición en lote o la caja del editor.
	 * Si el campo no viene en la petición (por ejemplo, al guardar desde Elementor), no toca nada.
	 *
	 * @param int $post_id ID de la página.
	 */
	public static function save( $post_id ) {
		// La edición en lote envía el formulario por GET, por eso se lee $_REQUEST.
		if ( ! isset( $_REQUEST[ self::FIELD ], $_REQUEST[ self::NONCE ] ) ) {
			return;
		}
		if ( ! wp_verify_nonce( sanitize_key( wp_unslash( $_REQUEST[ self::NONCE ] ) ), self::ACTION ) ) {
			return;
		}
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$value = sanitize_key( wp_unslash( $_REQUEST[ self::FIELD ] ) );
		if ( '-1' === $value ) {
			return; // Edición en lote: «Sin cambios».
		}

		Mode::set( $post_id, $value );
	}
}
