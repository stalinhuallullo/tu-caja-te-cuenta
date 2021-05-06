(function( $ ) {
	$.fn.imagina = function() {		
		var elemento = this;		
		$(elemento).css({'background' : 'url("'+$(this).attr('fondo')+'") no-repeat scroll 50% 50% transparent'});
		
		var tipo = $(elemento).attr('tipo');		
		tipo.toLowerCase();
		
		$(elemento).find('.diapositivas li').each(function(){				
			var left = $(this).attr('izquierda')
			var top = $(this).attr('arriba')
			var width = $(this).attr('ancho')
			var height = $(this).attr('alto')
			var rotation = $(this).attr('rotacion')
			var imagen = $(this).attr('imagen')
			var titulo = "<p>"+$(this).attr('titulo')+"</p>"			
			var textoleft = $(this).attr('textoleft')
			var textotop = $(this).attr('textotop')			
			
			$(this)					
				.css({'background' : 'url("'+imagen+'") no-repeat 0 0'})
				.css('background-size', 'contain')
				.css('left', left)
				.css('top', top)
				.css('width', width)
				.css('height', height)				
				.css({'-webkit-transform' : 'rotate('+ rotation +'deg)',
				 '-moz-transform' : 'rotate('+ rotation +'deg)',
				 '-ms-transform' : 'rotate('+ rotation +'deg)',
				 'transform' : 'rotate('+ rotation +'deg)'})				
				.append(titulo);
				
			$(this).children('p').css('left', textoleft).css('top', textotop)
			
			if ($(this).is("[desactivado]")){
				$(this).addClass('desactivado');
			}	
				
		})
		
		.mouseover(function(){
			if( (!$(this).hasClass('desactivado')) && (!$(this).is("[desactivado]")) ){
				$(this).stop(true, true).transition({scale:1.15}, 300)
			};
		})
		
		.mouseout(function(){
			$(this).stop(true, true).transition({scale:1}, 300)
		});
		
		if (tipo=='slide') {
			$(elemento).find('.presentaciones > div').each(function(){
				$(this).addClass('pantalla');
			});
			
			if($(elemento).attr('muestraprimera').toLowerCase()=="si"){			
				$(elemento).find('.presentaciones li:first-child').css('display', 'list-item');
			}
			
		}
		
		if (tipo=='contenedor') {
			$(elemento).find('.presentaciones > div').each(function(){
				$(this).addClass('contenedor');
			});			
			$(elemento).find('.contenedor').css('top', '50px')			
		}
		
		if ((tipo=='slide') || (tipo=='contenedor')){
			$(elemento).find('.presentaciones').css('overflow','hidden').css('position', 'absolute');
			var presentacion = $(elemento).find('.presentaciones') 
			var pleft = presentacion.attr('izquierda');
			var ptop = presentacion.attr('arriba');
			var pwidth = presentacion.attr('ancho');
			var pheight = presentacion.attr('alto');
			var protation = presentacion.attr('rotacion');
			var pimagen = presentacion.attr('fondopresentacion');
			
			if (presentacion.attr('fondopresentacion')!=""){
				$(presentacion).css({'background' : 'url("'+pimagen+'") no-repeat 0 0'})
				$(presentacion).css('background-size', 'contain')
			}
				
			$(presentacion)			
				.css('width', pwidth)
				.css('height', pheight)
				.css('left', pleft)
				.css('top', ptop)
				.css({'-webkit-transform' : 'rotate('+ protation +'deg)',
					 '-moz-transform' : 'rotate('+ protation +'deg)',
					 '-ms-transform' : 'rotate('+ protation +'deg)',
					 'transform' : 'rotate('+ protation +'deg)'});			
	
			
			
			
			
			if($(elemento).attr('efecto').toLowerCase()=="imagina"){
				$(elemento).find('.presentaciones').css({'background' : 'url("fondo-imagina.png") repeat scroll 50% 50% transparent'});				
				setInterval(function(){
					$(elemento).find('.presentaciones').animate({
						opacity: 0.7,
						}, 600, function() {
						$(elemento).find('.presentaciones').animate({
							opacity: 1,
							}, 400);
					});
				}, 1200);
			};			
		};
		
		
		if (tipo=='popup'){	
			$(elemento).find('.presentaciones').css('left', '1000');
			$(elemento).find('.presentaciones > div').addClass('presentacion');
			$(elemento).find('.presentacion').addClass('contenedorpopup');
			$(elemento).find('.presentacion').each(function(){
				var temp = $(this).html();
				var temp = '<div class="bpopupwindow general"><p class="bClose"><img src="interfaz/tema/media/ico_cerrar.png" alt="icono cerrar"></p>' + temp + '</div>';
				$(this).html(temp);
			});
			
			$('.diapositivas > li').bind('click', function(e) {
				e.preventDefault();
				var target = $(this).attr('target');
				$(elemento).find('.presentacion[elemento="'+target+'"]').addClass('activo');
				$(elemento).find('.presentacion[elemento="'+target+'"] .bpopupwindow').bPopup({modalClose: false, appendTo : $(elemento).find('.presentacion[elemento="'+target+'"]')});
			});
		
			$('.bClose').bind('click', function(e) {	
				e.preventDefault();
				$(elemento).find('.contenedorpopup').removeClass('activo');
			});
			
		};
		
		$(elemento).find('.diapositivas li').click(function(){
			if ($(this).is("[desactivado]")){				
			} else {
				if (tipo=='slide'){					
					if($(this).hasClass('visto')!=true){
						$(this).addClass('visto')
					}
					$(elemento).find('.presentaciones .pantalla').stop(true, true).fadeOut(200);
					var target = $(this).attr('target');
					$(elemento).find('.pantalla[elemento="'+target+'"]').delay(200).fadeIn(400);
				}
				
				if (tipo=='contenedor'){
					$(this).addClass('desactivado');
					var target = $(this).attr('target');
					if($(this).hasClass('visto')!=true){
						$(this).addClass('visto')
						$(elemento).find('.contenedor[elemento="'+target+'"]').appendTo($(elemento).find('.presentaciones')).css('display','block').animate({opacity: 1, top: "-=50"}, 400);
					}				
				}
				
				if (tipo=='popup'){					
					if($(this).hasClass('visto')!=true){
						$(this).addClass('visto')
					};
				}
			}
		});
	};
})( jQuery );