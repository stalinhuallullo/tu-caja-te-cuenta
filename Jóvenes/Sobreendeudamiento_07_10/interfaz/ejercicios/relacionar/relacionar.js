/******************************************************
 *
 * RELACIONAR
 * Usado para ejercicios de relacionar cajas
 *
 *****************************************************/
 
(function( $ ) {

	$.fn.relacionar = function() { 	
		
		var el = $(this);
		var reto = el.attr('reto');// controla si hay reto o no
		
		el.find('.dato').each(function(){
			obj = $(this);
			obj.append('<div class="enlace"><img src="./interfaz/ejercicios/relacionar/enlace.png" /></div>')
			posX = parseInt(obj.width()+10);
			posY = parseInt(obj.find('.contenido p').outerHeight()/2);
			
			obj.find('.enlace').css({
				"left": posX+"px",
				"top": posY+"px",	
			})
			
		
		});
		
		el.find('.objetivo').each(function(){
			obj = $(this);
			obj.prepend('<div class="enlace"><img src="./interfaz/ejercicios/relacionar/enlace.png" /></div>')
			posX = parseInt(obj.width()+10);
			posY = parseInt(obj.find('.contenido p').outerHeight()/2);
			
			obj.find('.enlace').css({"top": posY+"px"})
			
		
		});
		
		
		
		
		/*********** FUNCIONES ***************/

		
		_creaLinea = function(el01, el02){			
			var linea = '<div class="linea objeto-'+el02.attr('nombre')+'" dato="'+el01.attr('numero')+'" objetivo="'+el02.attr('nombre')+'"></div>'
			
			el.append(linea)
			
			// calculo punto inicial
			var posicion1 = el01.position();
			var enlace01= el01.find('.enlace')
			var en01 = enlace01.position();

			var x1 = parseInt(posicion1.left + en01.left + enlace01.outerWidth()/2) ;
			var y1 = parseInt(posicion1.top + en01.top + enlace01.outerHeight()/2) ;
			
			// punto final
			var posicion2 = el02.position();
			var enlace02= el02.find('.enlace')
			var en02 = enlace02.position();
			console.log(en02.left)
			var x2 = parseInt(posicion2.left + en02.left + enlace02.outerWidth()/2) ;
			var y2 = parseInt(posicion2.top + en02.top + enlace02.outerHeight()/2) ;
			
						
			// longitud de la linea
			var longitud = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
			
			// centro de la linea (teniendo en cuenta un alto de la linea de 6 
			var cx = ((x1 + x2) / 2) - (longitud/2);
			var cy = ((y1 + y2) / 2) - 3;
			
			// angulo
			var angulo = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
			
		
			$('.linea.objeto-'+el02.attr('nombre')).css({
			"left": cx+"px",
			"top": cy+"px",
			"width": longitud+"px",
			"-webkit-transform": "rotate("+angulo+"deg)",
            "-moz-transform": "rotate("+angulo+"deg)",
            "-ms-transform": "rotate("+angulo+"deg)",
            "-o-transform": "rotate("+angulo+"deg)",
            "transform": "rotate("+angulo+"deg)"}
			)
			
		}
		
		_evaluarRelaciones = function(){
			var correcto = true;
			$('.objetivo').each(function(){
				var enlazado = $(this).attr("enlazado");
				if( (enlazado=='')|| (enlazado=='undefined') ){
					correcto = false;
				} else {
					var posibles = $('.dato[numero='+$(this).attr("enlazado")+']').attr('enlaza').split(',');
					for(x=0;x<posibles.length;x++){
						var encontrado = false;
						if(posibles[x] == $(this).attr("nombre")){encontrado=true}
					}
					if(!encontrado){
						correcto = false;
					}
				}
			});
			
			if(correcto){
				$('.finished').fadeIn(300, function(){
					$('.btnComprobar').addClass('disabled');
					$('.btnReiniciar').addClass('disabled')
				});
				// actualiza el reto.
				if((reto!=='undefined')&&(reto!=='')){
					indiceUnidad.practicaSetValues(reto,1,0,true,0,100,100);					
				}
			} else {
				$('.error').fadeIn(300);
			}
		}
		
		_reiniciarR = function(){
			$('.linea').remove();
			$('.dato').removeClass('seleccionado')
			$('.objetivo').removeClass('activo').attr('enlazado','')			
		}
		
		/*********** EVENTOS SELECCION ****************/
		
		$('.dato').click(function(){
			if($(this).hasClass('seleccionado')){
				$(this).removeClass('seleccionado')
			} else {
				$('.dato.seleccionado').removeClass('seleccionado');
				$(this).addClass('seleccionado');
			}
			
			var pos = $(this).find('.enlace > img').offset();				
			var x1 = parseInt(pos.left + $(this).outerWidth()/2) ;
			var y1 = parseInt(pos.top + $(this).outerHeight()/2);
		});
		
		
		$('.objetivo').click(function(){			
			if($('.dato.seleccionado').length>0){
				if($(this).hasClass('activo')){
				} else {
					var dato = $('.dato.seleccionado')
					var numero = dato.attr('numero');
					$(this)
						.attr('enlazado',numero)
						.addClass('activo')
						.find('.numero p').html(numero);
						
					_creaLinea(dato, $(this));
					$('.dato.seleccionado').removeClass('seleccionado');
				}
			} else if($(this).hasClass('activo')){
				$('.linea[objetivo="'+$(this).attr('nombre')+'"]').remove();
				$(this)
					.removeClass('activo')
					.attr('enlazado','')
					.find('.numero p').html('0');
				
			} 
		});
		
				
		
		
		
		$('.btnReiniciar').click(function(){			
			if(!$(this).hasClass('disabled')) _reiniciarR();
		})
		
		$('.btnComprobar').click(function(){			
			if(!$(this).hasClass('disabled')) _evaluarRelaciones();			
		})
		
		
		/* $('.error, .finished').click(function(){			
			$(this).fadeOut(300, function(){
				$('.btnComprobar').removeClass('disabled');
			})
		}) */
		/* CERRAR FEEDBACK PULSANDO EN BOTON CERRAR */
		$('.ej_mensaje_close').click(function(){			
			$(this).parent().fadeOut(300, function(){
				$('.btnComprobar').removeClass('disabled');
			})
		})
		
	};
  
})( jQuery );

