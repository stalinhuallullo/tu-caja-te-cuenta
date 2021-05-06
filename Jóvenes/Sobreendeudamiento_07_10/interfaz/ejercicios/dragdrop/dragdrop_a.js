/******************************************************
 *
 * DRAG & DROP
 * Usado para ejercicios arrastrar y soltar.
 *
 *****************************************************/
 
(function( $ ) {

	$.fn.dragdrop = function() { 	
		
		var el = $(this)
		var TIPO = el.attr('tipo');
		var reto = el.attr('reto');
		var completado = indiceUnidad.practicaGetValues(reto).completado
		
		if(!completado){
			$('.navsiguiente').addClass('inactivo')			
		}
		
		/*********** VARIABLES & INICIO *************/
		$(this).find('.drag').each(function(){
			$(this).attr('soltadoen','0');
			posicion = $(this).position('#dragdrop');
			$(this).attr('posicionX',posicion.left);
			$(this).attr('posicionY',posicion.top);
		});
		
		
		/*********** EVENTOS DRAG & DROP ****************/
		$(this).find('.drag')		
		.draggable({
			revert: false,
			start: function() {	
				$(this).css('z-index','9').addClass("draggued");
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
				if (TIPO == "agrupar"){
					if($(this).attr('soltadoen')=='0'){
						$(this).css({left:'0',top:'0'})
						$('.contenedorDrags').append($(this))
						//$(this).animate({'left':$(this).attr('posicionX')+'px','top':$(this).attr('posicionY')+'px', 'opacity':'1'})						
					} else {
					}
				} else if (TIPO == "unoxuno") {
					$(this).css('z-index','auto');
					if($(this).attr('soltadoen')==='0'){
						$(this).css({left:'0',top:'0'})
						$('.contenedorDrags').append($(this))
					}
				}
				$('.draggued').removeClass('draggued');
				//console.log('stop')
			}
		});
		
		$(this).find('.dropp').css({'position':'absolute'}).attr('contiene','0');
		
		$(this).find('.dropp').droppable({
			drop: function() {
				// TIPOS --> unoxuno = un elemento a una posicion | agrupar = agrupar en conjuntos
				if (TIPO == "agrupar"){
					$('.draggued').css({'top':'','left':''}).attr('soltadoen', $(this).attr('numero'));
					$($(this)).append($('.draggued'))					
				} else if (TIPO == "unoxuno") {	
					if ($(this).hasClass('ocupado')){
						$(this).children('.drag').css({'top':'','left':''}).attr('soltadoen', '0');
						$('.contenedorDrags').append($(this).children('.drag'))
					}
					$('.draggued').css({'top':'','left':''}).attr('soltadoen', $(this).attr('numero'));
					$($(this)).append($('.draggued'))
					$(this).addClass('ocupado')
				/*			
					left=$(this).css('left');
					mtop= $(this).css('top');						
					if($(this).hasClass('ocupado')){
						posicionado =$('.drag[numero='+$(this).attr('contiene')+']')
						posicionado.removeClass("placed").animate({'left':posicionado.attr('posicionX')+'px','top':posicionado.attr('posicionY')+'px', 'opacity':'1'})
					}
					
					$(this).addClass('ocupado').attr('contiene', $(".draggued").attr('numero'));
					$(".draggued").animate({'left':left,'top':mtop,'opacity':'1'}).removeClass("draggued").attr('soltadoen', $(this).attr('numero'));
					*/
				}
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
			$('.drag').each(function(){
				
				//console.log($(this).attr('numero') + '-' + $(this).attr('soltadoen'))
				if($(this).attr('numero')!=$(this).attr('soltadoen')){
					correcto = false;
					if($(this).attr('soltadoen')!='0'){ 
						$(this).animate({opacity:0.5},"slow").delay(3000).animate({opacity:1},"slow");
						$(this).find('.mask').fadeIn("slow").delay(3000).fadeOut("slow")
					}
					//$(this).animate({'left':$(this).attr('posicionX')+'px','top':$(this).attr('posicionY')+'px', 'opacity':'1'})
				}
			});
			
			
			/*
			$('.dropp').each(function(){
				if($(this).attr('numero')!=$(this).attr('contiene')){
					correcto = false;
				}
			});*/
			
			if(correcto){
				$('.drag').draggable( 'disable' );
				$('.finished').fadeIn();
				$('.btnReiniciar').addClass('disabled')
				if((reto!=='undefined')&&(reto!=='')){
					indiceUnidad.practicaSetValues(reto,1,0,true,0,100,100);					
				}
				$('.navsiguiente').removeClass('inactivo')
			} else {
				$('.error').fadeIn();
			}
			
			
			
			/*
			if($('.drag').length === $('.placed').length){
				$('#finished').fadeIn();
				$('.navsiguiente').removeClass('inactivo')
			}*/
		}
		
		_reiniciar = function(){
			$('.drag').each(function(){
				$(this).attr('soltadoen','0');
				$('.contenedorDrags').append($(this))
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
			$(this).parent().fadeOut(300, function(){
				$('.btnComprobar').removeClass('disabled');
			})
		})
		
		/* CERRAR FEEDBACK PULSANDO EN CUALQUIER PARTE DEL MISMO
		$('.error, .finished').click(function(){			
			$(this).fadeOut(300, function(){
				$('.btnComprobar').removeClass('disabled');
			})
		})*/
		
	};
  
	$.fn.dragdrop2 = function() { 	
		
		var el = $(this)
		var TIPO = el.attr('tipo');
		var reto = el.attr('reto');
		var completado = indiceUnidad.practicaGetValues(reto).completado
		
		if(!completado){
			$('.navsiguiente').addClass('inactivo')			
		}
		
		/*********** VARIABLES & INICIO *************/
		$(this).find('.drag').each(function(){
			$(this).attr('soltadoen','0');
			posicion = $(this).position('#dragdrop');
			$(this).attr('posicionX',posicion.left);
			$(this).attr('posicionY',posicion.top);
		});
		
		
		/*********** EVENTOS DRAG & DROP ****************/
		$(this).find('.drag')		
		.draggable({
			revert: false,
			start: function() {	
				$(this).css('z-index','9').addClass("draggued");
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
				if (TIPO == "agrupar"){
					if($(this).attr('soltadoen')=='0'){
						$(this).css({left:'0',top:'0'})
						$('.contenedorDrags').append($(this))
						//$(this).animate({'left':$(this).attr('posicionX')+'px','top':$(this).attr('posicionY')+'px', 'opacity':'1'})						
					} else {
					}
				} else if (TIPO == "unoxuno") {
					$(this).css('z-index','auto');
					if($(this).attr('soltadoen')==='0'){
						$(this).css({left:'0',top:'0'})
						$('.contenedorDrags').append($(this))
					}
				}
				$('.draggued').removeClass('draggued');
				//console.log('stop')
			}
		});
		
		$(this).find('.dropp').css({'position':'absolute'}).attr('contiene','0');
		
		$(this).find('.dropp').droppable({
			drop: function() {
				// TIPOS --> unoxuno = un elemento a una posicion | agrupar = agrupar en conjuntos
				if (TIPO == "agrupar"){
					$('.draggued').css({'top':'','left':''}).attr('soltadoen', $(this).attr('numero'));
					$($(this)).append($('.draggued'))					
				} else if (TIPO == "unoxuno") {	
					if ($(this).hasClass('ocupado')){
						$(this).children('.drag').css({'top':'','left':''}).attr('soltadoen', '0');
						$('.contenedorDrags').append($(this).children('.drag'))
					}
					$('.draggued').css({'top':'','left':''}).attr('soltadoen', $(this).attr('numero'));
					$($(this)).append($('.draggued'))
					$(this).addClass('ocupado')
				/*			
					left=$(this).css('left');
					mtop= $(this).css('top');						
					if($(this).hasClass('ocupado')){
						posicionado =$('.drag[numero='+$(this).attr('contiene')+']')
						posicionado.removeClass("placed").animate({'left':posicionado.attr('posicionX')+'px','top':posicionado.attr('posicionY')+'px', 'opacity':'1'})
					}
					
					$(this).addClass('ocupado').attr('contiene', $(".draggued").attr('numero'));
					$(".draggued").animate({'left':left,'top':mtop,'opacity':'1'}).removeClass("draggued").attr('soltadoen', $(this).attr('numero'));
					*/
				}
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
			$('.drag').each(function(){
				
				//console.log($(this).attr('numero') + '-' + $(this).attr('soltadoen'))
				if($(this).attr('numero')!=$(this).attr('soltadoen')){
					correcto = false;
					solucion_auto=false;


					// yusepa
					if($(this).attr('errores')<2){
						// Si el elemento se ha colocado mal menos de 3 veces se devuelve a la 
						// posición original
						$(this).css({'top':'','left':''}).attr('soltadoen', '0');
						$('.contenedorDrags').append($(this))

						var calculo_error=parseInt($(this).attr('errores'))+1;
						$(this).attr('errores',calculo_error);
						//console.log("error elemento "+$(this).attr('numero')+":"+$(this).attr('errores'))
					}
					else{ 
						// Si el elemento se ha colocado mal más de 3 veces se coloca en su posición correcta
						solucion_auto=true;
						var elemento_correcto="dropp"+$(this).attr('numero'); 
						elem=$('#'+elemento_correcto);
						$(this).css({'top':'','left':''}).attr('soltadoen', $(this).attr('numero'));
						elem.append($(this));
						elem.addClass('ocupado');

					}



					//////////////



					if($(this).attr('soltadoen')!='0'){ 
						$(this).animate({opacity:0.5},"slow").delay(3000).animate({opacity:1},"slow");
						$(this).find('.mask').fadeIn("slow").delay(3000).fadeOut("slow")
					}
					//$(this).animate({'left':$(this).attr('posicionX')+'px','top':$(this).attr('posicionY')+'px', 'opacity':'1'})
				}
				else{
					// Si el elemento es colocado correctamente se bloquea
					$(this).draggable( 'disable' );
				}
			});
			
			
			/*
			$('.dropp').each(function(){
				if($(this).attr('numero')!=$(this).attr('contiene')){
					correcto = false;
				}
			});*/
			
			if(correcto){
				$('.drag').draggable( 'disable' );
				$('.finished').fadeIn();
				$('.btnReiniciar').addClass('disabled')
				if((reto!=='undefined')&&(reto!=='')){
					indiceUnidad.practicaSetValues(reto,1,0,true,0,100,100);					
				}
				$('.navsiguiente').removeClass('inactivo')
			} else {
				if(solucion_auto){
					
					$('.drag').draggable( 'disable' );
					$('.error2').fadeIn();
					$('.btnReiniciar').addClass('disabled')
					if((reto!=='undefined')&&(reto!=='')){
						//indiceUnidad.practicaSetValues(reto,0,1,false,0,100,0);					
					}
					$('.navsiguiente').removeClass('inactivo')
				}
				else{
					$('.error').fadeIn();

				}
			}
			
			
			
			/*
			if($('.drag').length === $('.placed').length){
				$('#finished').fadeIn();
				$('.navsiguiente').removeClass('inactivo')
			}*/
		}
		
		_reiniciar = function(){
			$('.drag').each(function(){
				$(this).attr('soltadoen','0');
				$('.contenedorDrags').append($(this))
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
			$(this).parent().fadeOut(300, function(){
				$('.btnComprobar').removeClass('disabled');
			})
		})
		
		/* CERRAR FEEDBACK PULSANDO EN CUALQUIER PARTE DEL MISMO
		$('.error, .finished').click(function(){			
			$(this).fadeOut(300, function(){
				$('.btnComprobar').removeClass('disabled');
			})
		})*/
		
	};
})( jQuery );
