/******************************************************
 *
 * DRAG & DROP
 * Usado para ejercicios arrastrar y soltar.
 *
 *****************************************************/
 
(function( $ ) {

	$.fn.dragdrop = function() { 	
	
		
		
		/*********** VARIABLES & INICIO *************/
		$(this).find('.drag').each(function(){
			$(this).css({'position':'absolute'}).attr('soltadoen','0');
			posicion = $(this).position('#dragdrop');
			$(this).attr('posicionX',posicion.left);
			$(this).attr('posicionY',posicion.top);
		});
		
		
		/*********** EVENTOS DRAG & DROP ****************/
		$(this).find('.drag')		
		.draggable({
			revert: false,
			start: function() {	
				$(this).css('z-index','25').addClass("draggued");
				if($(this).attr('soltadoen')!='0'){
					$(this).attr('soltadoen','0')
					obj = $('.dropp[contiene='+$(this).attr('numero')+']')
					obj.removeClass('ocupado');
					obj.attr('contiene','0');
				}
			},
			drag: function() {				
			
			},
			stop: function() {
				$(this).css('z-index','auto').removeClass("draggued")
				if($(this).attr('soltadoen')==='0') $(this).animate({'left':$(this).attr('posicionX')+'px','top':$(this).attr('posicionY')+'px', 'opacity':'1'})
				//console.log('stop')
			}
		});
		
		$(this).find('.dropp')
		.css({'position':'absolute'})
		.attr('contiene','0')
		.droppable({
			drop: function() {			
				//console.log('soltado!!');
				left=$(this).css('left');
				mtop= $(this).css('top');			
				
				if($(this).hasClass('ocupado')){
					posicionado =$('.drag[numero='+$(this).attr('contiene')+']')
					posicionado.removeClass("placed").animate({'left':posicionado.attr('posicionX')+'px','top':posicionado.attr('posicionY')+'px', 'opacity':'1'})
				}
				
				$(this).addClass('ocupado').attr('contiene', $(".draggued").attr('numero'));
				$(".draggued").animate({'left':left,'top':mtop,'opacity':'1'}).removeClass("draggued").attr('soltadoen', $(this).attr('numero'));
			},
			over:function(){			
				//console.log('sobre!!')
			},
			out: function(){				
				//console.log('fuera!!')
			}
		});
		
		/*********** FUNCIONES ****************/
		
		_isfinished = function(){
			var correcto = true;
			/* $('.drag').each(function(){
									 
				if($(this).attr('numero')!=$(this).attr('soltadoen')){
					correcto = false;
					if($(this).attr('soltadoen')!='0'){ 
						$(this).animate({opacity:0.5},"slow").delay(3000).animate({opacity:1},"slow");
						$(this).find('.mask').fadeIn("slow").delay(3000).fadeOut("slow")
					}
					//$(this).animate({'left':$(this).attr('posicionX')+'px','top':$(this).attr('posicionY')+'px', 'opacity':'1'})
				}
			}); */
			
			$('.dropp').each(function(){
				var valor_numero = $(this).attr('numero');
				var elementos = valor_numero.split(",");
				console.log('elementos: '+ elementos);
				console.log('elementos.length: '+ elementos.length);
				if (elementos.length > 1)
				{			
					var coincide= false;
					for (i=0; i < elementos.length ; i++)
					{	
						console.log('for!! elementos[i]:'+ elementos[i]);
						console.log('this.attr(contiene):'+ $(this).attr('contiene'));						
						if(elementos[i]==$(this).attr('contiene')){
							console.log(' coincide');
							coincide = true;							
							break;
						}
						
					}
					//si no coincide se termina la comprobación
					if (coincide== false)
					{
						correcto = false;
						console.log(' no coincide ninguno error');
					}
				}else {
					if($(this).attr('numero')!=$(this).attr('contiene')){
						correcto = false;
					}
				}
			});
			
			if(correcto){
				$('.drag').draggable( 'disable' );
				$('.finished').fadeIn();
				$('.btnReiniciar').addClass('disabled')
				// actualiza el reto.
				if((reto!=='undefined')&&(reto!=='')){
					indiceUnidad.practicaSetValues(reto,1,0,true,0,100,100);					
				}
			} else {
				$('.error').fadeIn("slow",function(){					
					$('.error').delay(3000).fadeOut("slow", function(){
						$('.btnComprobar').removeClass('disabled');
					});
				});
			}
			
			/*
			if($('.drag').length === $('.placed').length){
				$('#finished').fadeIn();
				$('.navsiguiente').removeClass('inactivo')
			}*/
		}
		
		_reiniciar = function(){
			$('.drag').each(function(){
				$(this).attr('soltadoen','0').animate({'left':$(this).attr('posicionX')+'px','top':$(this).attr('posicionY')+'px', 'opacity':'1'})				
			});
			
			$('.dropp').each(function(){
				$(this).attr('contiene','0').removeClass('ocupado')
			});
						
		}
		
		$('.btnReiniciar').click(function(){			
			if(!$(this).hasClass('disabled')) _reiniciar();
		})
		
		$('.btnComprobar').click(function(){			
			if(!$(this).hasClass('disabled')) _isfinished(); 
			$('.btnComprobar').addClass('disabled');
		})
		
		/* CERRAR FEEDBACK PULSANDO EN BOTON CERRAR */
		$('.ej_mensaje_close').click(function(){			
			$(this).parent().fadeOut(0,function(){
				$('.btnComprobar').removeClass('disabled');
			})
		})
	};
  
})( jQuery );