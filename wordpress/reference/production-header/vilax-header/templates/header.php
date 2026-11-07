<?php
/**
 * Plantilla: header completo (barra de escritorio + menú móvil).
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
<header class="vx-site-header">
<div class="vx-header<?php echo $light ? ' vx-header--light' : ''; ?>" data-vx-header>
	<div class="vx-header__bar">
		<a class="vx-header__logo" href="<?php echo esc_url( $home ); ?>"><?php echo Renderer::logo( $light ); // phpcs:ignore ?></a>

		<nav class="vx-nav" aria-label="<?php echo esc_attr( Renderer::t( 'nav' ) ); ?>">
			<ul class="vx-nav__list">
				<?php if ( $cats ) : ?>
				<li class="vx-nav__item vx-nav__item--mega">
					<button type="button" class="vx-nav__link vx-nav__toggle" aria-expanded="false" aria-controls="vx-mega"><?php echo esc_html( Renderer::t( 'services' ) ); ?><?php echo Renderer::icon( 'down' ); // phpcs:ignore ?></button>
					<?php Renderer::part( 'mega-menu', $args ); ?>
				</li>
				<?php endif; ?>
				<?php foreach ( $primary as $p ) : ?>
				<li class="vx-nav__item"><a class="vx-nav__link" href="<?php echo esc_url( $p['url'] ); ?>"><?php echo esc_html( $p['label'] ); ?></a></li>
				<?php endforeach; ?>
			</ul>
		</nav>

		<div class="vx-header__actions">
			<?php Renderer::part( 'lang-switcher', $args ); ?>
			<a class="vx-btn" href="<?php echo esc_url( $contact ); ?>"><?php echo esc_html( Renderer::t( 'contact' ) ); ?></a>
			<button type="button" class="vx-burger" aria-expanded="false" aria-controls="vx-drawer" aria-label="<?php echo esc_attr( Renderer::t( 'open' ) ); ?>"><span></span></button>
		</div>
	</div>

	<?php Renderer::part( 'drawer', $args ); ?>
</div>
</header>
