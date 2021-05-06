(function( $ ) {
	$.fn.proyector = function() {		
		var elemento = this;
		$(elemento).find('.presentaciones li').css('display', 'none');
		var top = 30;
		var rotacion = -1;
		var separacion = parseInt(350/$(this).find('.diapositivas li').length);
		$(elemento).find('.diapositivas li').each(function(){														   
			var left = 30 + Math.floor(Math.random() * 6);	
			$(this).css('top', top).css('left', left);			
			top += separacion;
			var aux = 5 * rotacion * Math.floor(Math.random() * 2);
			$(this).transition({perspective: '100px', rotate: aux})
			var titulo = "<p>"+$(this).attr('titulo')+"</p>"
			$(this).append(titulo);
			rotacion *= -1;
			
		});
		
		$(elemento).find('.diapositivas li div').each(function(){
			var fondo = "url('"+ $(this).attr('imagen') +"')";
			$(this).css('background-image', fondo);			
		});
		
		
		setInterval(function(){
			$(elemento).find('.presentaciones').animate({
				opacity: 0.7,
				}, 600, function() {
				$(elemento).find('.presentaciones').animate({
					opacity: 1,
					}, 400);
			});
		}, 1200);
		
		$(elemento).find('.diapositivas li').mouseover(function(){
			$(this).stop(true, true).transition({scale:1.15}, 300)
		});
		
		$(elemento).find('.diapositivas li').mouseout(function(){
			$(this).stop(true, true).transition({scale:1}, 300)
		});
		
		
		$(elemento).find('.diapositivas li').click(function(){
			$(elemento).find('.presentaciones li').fadeOut(200);
			$(elemento).find($(this).attr('target')).delay(200).fadeIn(400);
		});
		

		
		//evaluapaginacion(this);
		/* ANIMACION DE INICIO 
		$(this).css('top', '242px');
		$(this).css('left', '50%');
		$(this).css('width', '0');
		$(this).css('height', '0');
		$(this).find('.reloj').fadeOut(0);
		$(this).find('.tablet-contenido').fadeOut(0);
		$(this).find('.tablet-botonera').fadeOut(0);
		$(this).delay(2000).animate({width:"629px", height:"485px", top:"0", left:"0"},1000, function() {
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
			$(objeto).find('.anterior, .siguiente').fadeOut(0);
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
		
		
		
		
	
*/
  };
})( jQuery );