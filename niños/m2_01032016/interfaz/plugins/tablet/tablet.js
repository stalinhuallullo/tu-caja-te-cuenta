/***************************************************
 *
 * TABLET
 * Genera las funciones y codigos necesarios
 * para el recurso Tablet.
 *
 ***************************************************/

(function( $ ) {
	$.fn.tablet = function() {
		var retraso=2000;
		if($('#ventana-dialogo').length >=1){
			retraso=parseInt($('#ventana-dialogo').attr('retraso'))*1000
		}
		
		var elemento = this;	
		evaluapaginacion(this)
		$('.reloj .minuto').css('background-position', '-2px 2px');		
		/* ANIMACION DE INICIO */
		$(this).css('top', '242px');
		$(this).css('width', '0');
		$(this).css('height', '0');
		$(this).find('.reloj').css('display', 'none');
		$(this).find('.tablet-contenido').css('display', 'none');
		$(this).find('.tablet-botonera').css('display', 'none');
		$(this).delay(retraso).animate({width:"629px", height:"485px", top:"0"},1000, function() {
			$(this).find('.reloj').fadeIn(1000);
			$(this).find('.tablet-contenido').fadeIn(1000);
			$(this).find('.tablet-botonera').fadeIn(1000);
			$(this).find('.tablet-contenido .pantalla-tablet:first-child').fadeIn(0);
			var alto = parseInt($(this).find('.tablet-contenido').height());			
		});
		
		setInterval(function() {
			var d = new Date();
			var hora = d.getHours();
			var minuto = d.getMinutes();			
			$('.reloj .hora').html(hora);
			if (minuto <=9) {
				minuto = "0"+minuto;
			}
			$('.reloj .minuto').html(minuto);
			$('.reloj .minuto').animate({style: 'background-position:-10px 2px'}, 600);								
	    }, 1000);
		
		$(this).find('.tablet-botonera li').click(function(){
			var clicado = $(this).attr('href');
			$(this).parent().next('.tablet-contenido').find('.pantalla-tablet').fadeOut(500);		
			$(this).parent().next('.tablet-contenido').find('.pantalla-tablet').removeClass('activo');
			$(this).parent().next('.tablet-contenido').find(clicado).addClass('activo');		
			$(this).parent().next('.tablet-contenido').find(clicado).delay(400).fadeIn(500);
			evaluapaginacion($(this).parent().parent())
		});
		
		function evaluapaginacion(objeto){
			$(objeto).find('.anterior').css('display', 'none');
			$(objeto).find('.siguiente').css('display', 'none');
			if ($(objeto).find('.tablet-contenido .activo').hasClass("secundaria")){
				$(objeto).find('.anterior').fadeIn(300)
			}
			if ($(objeto).find('.tablet-contenido .activo').next().hasClass("secundaria")){
				$(objeto).find('.siguiente').fadeIn(300)
			}
		}
		
		$(this).find('.anterior').click(function(){
			if ($(elemento).find('.activo').prev().hasClass('pantalla-tablet')){
				var clicado = $(elemento).find('.activo').prev();
			}
			$(elemento).find('.pantalla-tablet').fadeOut(500);		
			$(elemento).find('.pantalla-tablet').removeClass('activo');
			$(elemento).find(clicado).addClass('activo');		
			$(clicado).delay(400).fadeIn(500);
			evaluapaginacion($(this).parent())
		});
		
		$(this).find('.siguiente').click(function(){
			if ($(elemento).find('.activo').next().hasClass('pantalla-tablet')){
				var clicado = $(elemento).find('.activo').next();
			}
			$(elemento).find('.pantalla-tablet').fadeOut(500);		
			$(elemento).find('.tablet-contenido div').removeClass('activo');
			$(elemento).find('.tablet-contenido').find(clicado).addClass('activo');		
			$(clicado).delay(400).fadeIn(500);
			evaluapaginacion($(this).parent())
		});
		
		
		
		
	

  };
})( jQuery );
