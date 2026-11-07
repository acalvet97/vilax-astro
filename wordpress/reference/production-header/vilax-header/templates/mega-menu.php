<?php
/**
 * Plantilla: mega menú de Servicios (escritorio).
 *
 * @var array $args Datos de Renderer::data().
 * @package Vilax\Header
 */

use Vilax\Header\Renderer;

defined( 'ABSPATH' ) || exit;

$cats = $args['cats'];
?>
<div class="vx-mega" id="vx-mega" hidden>
	<div class="vx-mega__inner">
		<div class="vx-mega__tabs" role="tablist" aria-orientation="vertical">
			<?php foreach ( $cats as $i => $cat ) : ?>
			<button type="button" class="vx-mega__tab" role="tab" id="vx-tab-<?php echo (int) $i; ?>" aria-controls="vx-panel-<?php echo (int) $i; ?>" aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>" tabindex="<?php echo 0 === $i ? '0' : '-1'; ?>"><?php echo esc_html( $cat['title'] ); ?></button>
			<?php endforeach; ?>
		</div>

		<?php foreach ( $cats as $i => $cat ) : ?>
		<div class="vx-mega__panel" role="tabpanel" id="vx-panel-<?php echo (int) $i; ?>" aria-labelledby="vx-tab-<?php echo (int) $i; ?>"<?php echo 0 === $i ? '' : ' hidden'; ?>>
			<div class="vx-mega__links">
				<ul>
					<?php foreach ( $cat['items'] as $item ) : ?>
					<li><a href="<?php echo esc_url( $item['url'] ); ?>"<?php echo $item['current'] ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $item['title'] ); ?></a></li>
					<?php endforeach; ?>
				</ul>
				<?php if ( $cat['hub'] ) : ?>
				<a class="vx-mega__more" href="<?php echo esc_url( $cat['hub'] ); ?>"><?php echo esc_html( sprintf( Renderer::t( 'see' ), $cat['title'] ) ); ?><?php echo Renderer::icon( 'right' ); // phpcs:ignore ?></a>
				<?php endif; ?>
			</div>
			<?php echo Renderer::category_image( $cat ); // phpcs:ignore ?>
		</div>
		<?php endforeach; ?>
	</div>
</div>
