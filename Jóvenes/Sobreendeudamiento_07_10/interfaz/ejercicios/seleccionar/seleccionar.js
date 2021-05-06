/******************************************************
 *
 * SELECCIONAR
 *
 *****************************************************/
 
(function( $ ) {

	$.fn.ejercicioSeleccionar = function() {
		objeto = $(this);
		reto = objeto.attr('reto');
		
		var completado = indiceUnidad.practicaGetValues(reto).completado;		
		if(!completado){
			$('.navsiguiente').addClass('inactivo')			
		}
		
		/* TIPOS 
			prohibidos : El ejercicio da error si se selecciona alguna de las opciones no validas, se pueden selaccionar los elementos que se quieran de los correctos.
			unico: Solo se puede seleccionar un elemento, al seleccionar uno diferente se deselecciona cualquiera ya seleccionado.
			correctos: Deben seleccionarse todos los elementos correctos, y únicamente los correctos.
		*/
		tipo = objeto.attr('tipo')
		
		objeto.find('.elementoSeleccionable').click(function(){
			if(tipo == 'unico'){
				$('.seleccionado').removeClass('seleccionado');
				$(this).addClass('seleccionado');
			} else {
				$(this).toggleClass('seleccionado');
			}
		});
		
		
		objeto.find('.btnComprobar').click(function(){
			if(objeto.find('.seleccionado').length<=0){
				$('.contenedorFeedback h3').html('Debes seleccionar algun elemento');
				$('.contenedorFeedback p').html('Cierra esta ventana usando el aspa de la esquina superior derecha y prueba de nuevo.');
				$('.ej_mensaje').fadeIn();
			} else {
				if(tipo === 'prohibidos'){
					var correcto = true;
					objeto.find('.elementoSeleccionable').each(function(){
						if($(this).is('[correcto=no]')&&$(this).hasClass('seleccionado')){
							correcto = false;
						}
					});					
					
				} else if(tipo === 'unico'){
					var correcto = true;
					objeto.find('.elementoSeleccionable').each(function(){
						if($(this).is('[correcto=si]')&&!$(this).hasClass('seleccionado')){
							correcto = false;
						}
					});
				} else if(tipo === 'correctos'){
					var correcto = true;
					objeto.find('.elementoSeleccionable').each(function(){
						if($(this).is('[correcto=si]')&&!$(this).hasClass('seleccionado')){
							correcto = false;
						}
						
						if($(this).is('[correcto=no]')&&$(this).hasClass('seleccionado')){
							correcto = false;
						}
					});
				}
				
				
				if(correcto){
					indiceUnidad.practicaSetValues(reto,1,0,true,0,100,100);
					$('.navsiguiente').removeClass('inactivo')
					$('.contenedorFeedback h3').html('¡¡Correcto!!');
					$('.contenedorFeedback p').html('<p>Has superado el reto de este apartado, puedes cerrar este mensaje y avanzar a la siguiente pantalla, enhorabuena.</p>');						
					$('.ej_mensaje').fadeIn();
				} else {
					$('.contenedorFeedback h3').html('¡¡Incorrecto!!');
					$('.contenedorFeedback p').html('Lo sentimos pero no has conseguido realizar el reto con éxito.');
					$('.ej_mensaje').fadeIn();
				}
			}
		})
		
		objeto.find('.ej_mensaje_close').click(function(){
			$('.ej_mensaje').fadeOut();
		})
		
		
		objeto.find('.btnReiniciar').click(function(){
			objeto.find('.seleccionado').each(function(){
				$(this).removeClass('seleccionado');
			});
		})

	};
  
})( jQuery );