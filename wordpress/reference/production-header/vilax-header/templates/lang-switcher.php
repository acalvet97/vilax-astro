<?php
/**
 * Plantilla: selector de idioma (se usa en la barra y en el menú móvil).
 *
 * @var array $args Datos de Renderer::data().
 * @package Vilax\Header
 */

use Vilax\Header\Renderer;

defined( 'ABSPATH' ) || exit;

if ( ! $args['langs'] ) {
	return;
}
?>
<ul class="vx-lang" aria-label="<?php echo esc_attr( Renderer::t( 'lang' ) ); ?>">
	<?php
	foreach ( $args['langs'] as $l ) :
		$code = isset( $l['code'] ) ? $l['code'] : ( isset( $l['language_code'] ) ? $l['language_code'] : '' );
		?>
	<li><a href="<?php echo esc_url( $l['url'] ); ?>" hreflang="<?php echo esc_attr( $code ); ?>" lang="<?php echo esc_attr( $code ); ?>"<?php echo ! empty( $l['active'] ) ? ' aria-current="true"' : ''; ?>><?php echo esc_html( strtoupper( $code ) ); ?></a></li>
	<?php endforeach; ?>
</ul>
