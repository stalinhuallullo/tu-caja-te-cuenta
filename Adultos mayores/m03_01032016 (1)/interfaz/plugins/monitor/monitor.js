/***************************************************
 *
 * MONITOR
 * Genera las funciones y codigos necesarios
 * para el recurso Monitor.
 *
 ***************************************************/

(function( $ ) {
  $.fn.monitor = function() {
	var elemento = this;
	var alto = parseInt($(this).find('.monitor-contenido').height());
	$(this).find('.slide').fadeOut(0);
	$(this).find('.slide:first-child').fadeIn(500);
	
	$(this).find('.monitor-botonera li').click(function(){
		var clicado = $(this).attr('href');
		$(this).parent().next('.monitor-contenido').find('.slide').fadeOut(500);		
		$(this).parent().next('.monitor-contenido').find('.slide').removeClass('activo');
		$(this).parent().next('.monitor-contenido').find(clicado).addClass('activo');
		var altoslide = parseInt($(this).parent().next('.monitor-contenido').find(clicado).height());
		if (altoslide > alto) {
			$(this).parent().parent().find('.scroll').fadeIn(500);
			$(this).parent().next('.monitor-contenido').find(clicado).css('top', 0);			
		} else {
			$(this).parent().parent().find('.scroll').fadeOut(300);
		}
		$(this).parent().next('.monitor-contenido').find(clicado).delay(400).fadeIn(500);

	});
	
	$(this).find('.scroll li').click(function(){
		var actual = $(elemento).find('.activo');
		console.log(actual);
		var posicionactual = parseInt(actual.css('top'));
		var altoelemento = parseInt(actual.height());
		console.log(-posicionactual);
		console.log(altoelemento-alto);
		if ($(this).hasClass('bajar') ){
			if ((-posicionactual) < altoelemento-alto){				
				$(actual).stop(true, true).animate({top:"-=20"});
			}
		} else if ($(this).hasClass('subir')){
			if (posicionactual < 0){
				$(actual).stop(true, true).animate({top:"+=20"});
			} else {
				$(actual).stop(true, true).animate({top:"0"});
			}
		};
	});

  };
})( jQuery );