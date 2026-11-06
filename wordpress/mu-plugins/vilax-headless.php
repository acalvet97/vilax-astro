<?php
/**
 * Plugin Name: VILAX Headless
 * Description: Headless setup for the Astro frontend: menu locations, author fields (ACF), rebuild trigger and frontend redirect.
 * Version:     0.1.0
 *
 * Install: copy this file to wp-content/mu-plugins/ (must-use plugins load automatically).
 *
 * Optional constants in wp-config.php:
 *   define( 'VILAX_DEPLOY_HOOK_URL', 'https://api.netlify.com/build_hooks/xxxx' ); // static rebuild webhook
 *   define( 'VILAX_FRONTEND_URL', 'https://www.vilax.es' );                       // redirect public WP pages here
 */

defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * 1. Menu locations
 *    WPGraphQL exposes them as MenuLocationEnum: PRIMARY, FOOTER, LEGAL.
 *    With WPML, assign one menu per language to each location.
 * ---------------------------------------------------------------------- */
add_action( 'after_setup_theme', function () {
	register_nav_menus( [
		'primary' => 'Header: navegación principal (Servicios → categorías → servicios)',
		'footer'  => 'Footer: columna About',
		'legal'   => 'Footer: enlaces legales',
	] );
}, 20 );

/* -------------------------------------------------------------------------
 * 2. Author profile fields (ACF) → GraphQL `User.authorProfile`
 *    The bio uses the core "Biographical Info" field (User.description),
 *    translated with WPML String Translation → "Translate User properties".
 * ---------------------------------------------------------------------- */
add_action( 'acf/include_fields', function () {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}
	acf_add_local_field_group( [
		'key'                => 'group_vilax_author_profile',
		'title'              => 'Perfil de autor',
		'fields'             => [
			[
				'key'                => 'field_vilax_author_photo',
				'label'              => 'Foto',
				'name'               => 'photo',
				'type'               => 'image',
				'return_format'      => 'array',
				'preview_size'       => 'thumbnail',
				'show_in_graphql'    => 1,
				'graphql_field_name' => 'photo',
			],
			[
				'key'                => 'field_vilax_author_job_title',
				'label'              => 'Cargo',
				'name'               => 'job_title',
				'type'               => 'text',
				'show_in_graphql'    => 1,
				'graphql_field_name' => 'jobTitle',
			],
			[
				'key'                => 'field_vilax_author_linkedin',
				'label'              => 'LinkedIn (URL)',
				'name'               => 'linkedin_url',
				'type'               => 'url',
				'show_in_graphql'    => 1,
				'graphql_field_name' => 'linkedinUrl',
			],
		],
		'location'           => [
			[ [ 'param' => 'user_form', 'operator' => '==', 'value' => 'all' ] ],
		],
		'show_in_graphql'    => 1,
		'graphql_field_name' => 'authorProfile',
		'graphql_types'      => [ 'User' ],
	] );
} );

/* -------------------------------------------------------------------------
 * 3. Rebuild trigger
 *    Any content change that affects the static site schedules ONE rebuild
 *    60 s later (debounced), so bulk edits don't trigger many builds.
 * ---------------------------------------------------------------------- */
const VILAX_REBUILD_EVENT = 'vilax_trigger_rebuild';

function vilax_schedule_rebuild() {
	if ( ! defined( 'VILAX_DEPLOY_HOOK_URL' ) || ! VILAX_DEPLOY_HOOK_URL ) {
		return;
	}
	if ( ! wp_next_scheduled( VILAX_REBUILD_EVENT ) ) {
		wp_schedule_single_event( time() + 60, VILAX_REBUILD_EVENT );
	}
}

add_action( VILAX_REBUILD_EVENT, function () {
	wp_remote_post( VILAX_DEPLOY_HOOK_URL, [ 'timeout' => 10, 'blocking' => false ] );
} );

// Menus.
add_action( 'wp_update_nav_menu', 'vilax_schedule_rebuild' );
add_action( 'wp_delete_nav_menu', 'vilax_schedule_rebuild' );

// Posts (and any public post type, e.g. casos): publish, update, unpublish, trash.
add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
	if ( wp_is_post_revision( $post ) || wp_is_post_autosave( $post ) ) {
		return;
	}
	if ( 'nav_menu_item' === $post->post_type ) {
		return; // Covered by wp_update_nav_menu.
	}
	$type = get_post_type_object( $post->post_type );
	if ( ! $type || ! $type->public ) {
		return;
	}
	if ( 'publish' === $new_status || 'publish' === $old_status ) {
		vilax_schedule_rebuild();
	}
}, 10, 3 );

// Categories / tags / custom taxonomies.
add_action( 'created_term', 'vilax_schedule_rebuild' );
add_action( 'edited_term', 'vilax_schedule_rebuild' );
add_action( 'delete_term', 'vilax_schedule_rebuild' );

// Authors.
add_action( 'profile_update', 'vilax_schedule_rebuild' );

/* -------------------------------------------------------------------------
 * 4. Headless frontend: send public theme requests to the Astro site.
 *    Admin, REST, GraphQL, cron and media are unaffected.
 * ---------------------------------------------------------------------- */
add_action( 'template_redirect', function () {
	if ( ! defined( 'VILAX_FRONTEND_URL' ) || ! VILAX_FRONTEND_URL ) {
		return;
	}
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || is_preview() ) {
		return;
	}
	if ( function_exists( 'is_graphql_http_request' ) && is_graphql_http_request() ) {
		return;
	}
	$path = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
	wp_redirect( untrailingslashit( VILAX_FRONTEND_URL ) . $path, 302 );
	exit;
} );
