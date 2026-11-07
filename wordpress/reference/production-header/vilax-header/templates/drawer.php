<?php
/**
 * Plantilla: menú móvil (panel lateral con navegación por niveles).
 *
 * @var array $args Datos de Renderer::data().
 * @package Vilax\Header
 */

use Vilax\Header\Renderer;

defined( 'ABSPATH' ) || exit;

$light   = $args['light'];
$cats    = $args['cats'];
$home    = $args['home'];
$contact = $args['contact'];
$primary = $args['primary'];
?>
<div class="vx-drawer" id="vx-drawer" role="dialog" aria-modal="true" aria-label="<?php echo esc_attr( Renderer::t( 'nav' ) ); ?>" tabindex="-1" hidden>
	<div class="vx-drawer__head">
		<a class="vx-header__logo" href="<?php echo esc_url( $home ); ?>"><?php echo Renderer::logo( $light, 'lazy' ); // phpcs:ignore ?></a>
		<button type="button" class="vx-drawer__close" aria-label="<?php echo esc_attr( Renderer::t( 'close' ) ); ?>"><span></span></button>
	</div>

	<div class="vx-drawer__top">
		<button type="button" class="vx-drawer__back" hidden><?php echo Renderer::icon( 'left' ); // phpcs:ignore ?><span><?php echo esc_html( Renderer::t( 'back' ) ); ?></span></button>
		<?php Renderer::part( 'lang-switcher', $args ); ?>
	</div>

	<div class="vx-drawer__body">
		<?php // Nivel 1: menú principal. ?>
		<div class="vx-panel is-active" data-panel="main">
			<?php if ( $cats ) : ?>
			<button type="button" class="vx-panel__link" data-target="services"><span><?php echo esc_html( Renderer::t( 'services' ) ); ?></span><?php echo Renderer::icon( 'right' ); // phpcs:ignore ?></button>
			<?php endif; ?>
			<?php foreach ( $primary as $p ) : ?>
			<a class="vx-panel__link" href="<?php echo esc_url( $p['url'] ); ?>"><span><?php echo esc_html( $p['label'] ); ?></span></a>
			<?php endforeach; ?>
		</div>

		<?php if ( $cats ) : ?>
		<?php // Nivel 2: categorías de servicios. ?>
		<div class="vx-panel" data-panel="services">
			<p class="vx-panel__title"><?php echo esc_html( Renderer::t( 'services' ) ); ?></p>
			<?php foreach ( $cats as $i => $cat ) : ?>
			<button type="button" class="vx-panel__link" data-target="cat-<?php echo (int) $i; ?>"><span><?php echo esc_html( $cat['title'] ); ?></span><?php echo Renderer::icon( 'right' ); // phpcs:ignore ?></button>
			<?php endforeach; ?>
		</div>

		<?php // Nivel 3: servicios de cada categoría. ?>
		<?php foreach ( $cats as $i => $cat ) : ?>
		<div class="vx-panel" data-panel="cat-<?php echo (int) $i; ?>">
			<p class="vx-panel__title"><?php echo esc_html( $cat['title'] ); ?></p>
			<?php foreach ( $cat['items'] as $item ) : ?>
			<a class="vx-panel__link" href="<?php echo esc_url( $item['url'] ); ?>"<?php echo $item['current'] ? ' aria-current="page"' : ''; ?>><span><?php echo esc_html( $item['title'] ); ?></span></a>
			<?php endforeach; ?>
			<?php if ( $cat['hub'] ) : ?>
			<a class="vx-panel__link vx-panel__link--hub" href="<?php echo esc_url( $cat['hub'] ); ?>"><span><?php echo esc_html( sprintf( Renderer::t( 'see' ), $cat['title'] ) ); ?></span><?php echo Renderer::icon( 'right' ); // phpcs:ignore ?></a>
			<?php endif; ?>
		</div>
		<?php endforeach; ?>
		<?php endif; ?>
	</div>

	<div class="vx-drawer__foot">
		<a class="vx-btn" href="<?php echo esc_url( $contact ); ?>"><?php echo esc_html( Renderer::t( 'cta' ) ); ?></a>
	</div>
</div>
