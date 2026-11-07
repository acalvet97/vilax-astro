/**
 * Edición rápida de Páginas: rellena el selector «Header» con el modo guardado de la fila.
 */
( function ( $ ) {
	if ( typeof inlineEditPost === 'undefined' ) {
		return;
	}
	var original = inlineEditPost.edit;
	inlineEditPost.edit = function ( id ) {
		original.apply( this, arguments );
		var postId = typeof id === 'object' ? parseInt( this.getId( id ), 10 ) : id;
		if ( ! postId ) {
			return;
		}
		var mode = $( '#post-' + postId + ' .vx-mode' ).attr( 'data-mode' ) || '';
		$( '#edit-' + postId + ' select[name="vilax_header_mode"]' ).val( mode );
	};
} )( jQuery );
