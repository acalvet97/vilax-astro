<?php
/**
 * Plugin Name: VILAX Headless
 * Description: Headless setup for the Astro frontend: menu locations, ACF Local JSON, rebuild trigger and frontend redirect.
 * Version:     0.4.0
 *
 * Install: copy this file to wp-content/mu-plugins/ (must-use plugins load automatically)
 * and create the writable folder wp-content/acf-json/ (ACF Local JSON).
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
 * 2. ACF field groups: managed in the ACF Pro UI, saved as Local JSON
 *    Every group saved in ACF is also written to wp-content/acf-json/
 *    (backup + sync between environments via ACF → Field Groups → Sync).
 *    A copy of each JSON is kept in the Astro repo under wordpress/acf-json/.
 *
 *    Groups and GraphQL names the Astro site relies on:
 *      User.authorProfile { jobTitle linkedinUrl }   (photo = Gravatar, User.avatar)
 *      Post.postFields    { tldr faqs { tituloFaq textFaq } }
 *      Post.cta           { eyebrow title text }
 *      MenuItem.megaMenu  { image imagePosition }
 *    Renaming them breaks the GraphQL query, and the Astro build fails.
 * ---------------------------------------------------------------------- */
const VILAX_ACF_JSON_DIR = WP_CONTENT_DIR . '/acf-json';

add_filter( 'acf/settings/save_json', function () {
	return VILAX_ACF_JSON_DIR;
} );

add_filter( 'acf/settings/load_json', function ( $paths ) {
	$paths[] = VILAX_ACF_JSON_DIR;
	return $paths;
} );

/* -------------------------------------------------------------------------
 * 2b. Images uploaded from a menu item (mega-menu images) are public in GraphQL
 *     An image uploaded from the ACF field of a menu item gets that menu item
 *     as its parent. WPGraphQL inherits the parent's visibility for attached
 *     media, and menu items are not public content, so the image would be
 *     hidden (null) for the public Astro build. Menu images are public anyway.
 * ---------------------------------------------------------------------- */
add_filter( 'graphql_data_is_private', function ( $is_private, $model_name, $data ) {
	if (
		$is_private
		&& $data instanceof WP_Post
		&& 'attachment' === $data->post_type
		&& $data->post_parent
		&& 'nav_menu_item' === get_post_type( $data->post_parent )
	) {
		return false;
	}
	return $is_private;
}, 10, 3 );

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
