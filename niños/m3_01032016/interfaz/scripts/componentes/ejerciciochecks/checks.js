/*************************************
 *
 *		EJERCICIOS CHECKS
 *
 *		Version: 1.0
 *		Autor  : FJLG
 *		Fecha  : 28/07/2014
 *
 ************************************/


(function( $ ) {
  $.fn.ejerciciochecks = function(){
	$('.mensaje').remove();
	$('body').append('<div class="mensaje bpopupwindow hideprint" title=""><p class="bClose"><img src="interfaz/tema/media/ico_cerrar.png" alt="icono cerrar"></p><img src="../../interfaz/tema/media/htmltest/inf_incorrecto.png" border="0" class="imagen_izquierda" /><p class="titulo"></p><p class="texto_mensaje"></p></div>')
	var objeto = $(this);
	var intentos = parseInt(objeto.attr('intentos'));
	
	if((HAS_RETOS)&&(objeto.is('.reto'))){
		var reto = parseInt(objeto.attr('reto'))
	}

  	objeto.css({'width': $(this).attr("ancho")+'px','height':$(this).attr("alto")+'px','background':'url("'+$(this).attr("fondo")+'") scroll no-repeat 50% 50%', 'background-size':'contain'});
	
	/* Pintamos los inputs y sus etiquetas en su lugar */
	
	objeto.find('.checkbox').each(function(){
		$(this).css({'top': $(this).attr('arriba')+'px', 'left':$(this).attr('izquierda')+'px'})
		$(this).after('<p class="etiqueta-check"></p>');
		$(this).next(".etiqueta-check").html($(this).attr('texto'))
		var textoarriba = parseInt($(this).attr('arriba'))
		var textoizquierda = parseInt($(this).attr('izquierda'));
		var anchotexto = parseInt($(this).next(".etiqueta-check").width());
		
		switch($(this).attr('posiciontexto')){
			case 'izquierda':
				textoizquierda -= 5+anchotexto;
				break;
			case 'arriba':
				textoarriba -= 20;
				textoizquierda -= (anchotexto-20)/2;
				break;
			case 'abajo':
				textoarriba += 20;				
				textoizquierda -= (anchotexto-20)/2;
				break;
			default:
				textoizquierda += 25;
				break;
		}		
		$(this).next(".etiqueta-check").css({'left': textoizquierda+'px', 'top': textoarriba+'px'});
		
		/* Asignamos la funcionalidad que los pone como chequeados */
		
		$(this).click(function(){
			if($(this).is('.checked')){
				$(this).removeClass('checked')
			} else {
				$(this).addClass('checked')
			}
		});
	});
	
	/* Creamos los botones necesarios */
	
	objeto.append('<div class="botoneraejercicios"><div class="comprobar">Comprobar</div><div class="ayudaejercicio">Ayuda</div><div class="intentos">Intentos Restantes: '+ intentos +'</div></div>')
 
	objeto.find('.comprobar').click(function(){
		if(!objeto.find('.comprobar').hasClass('disabled')){
			var correcto = true;
			objeto.find('.checkbox').each(function(){
				if($(this).is('[correcta]')){
					if(!$(this).hasClass('checked')){
						correcto = false;
					}
				} else {				
					if($(this).hasClass('checked')){
						correcto = false;
					}
				}
						
			});				
			
			intentos--;
			objeto.find('.intentos').html('Intentos Restantes: '+intentos)
			
			/* evaluamos el resultado de la validacion */ 
			if(correcto){
				$('body').find('.mensaje .titulo').html('CORRECTO!!');
				$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_exito.png')
				$('.texto_mensaje').html(objeto.attr('msg_ok'));
				objeto.find('.comprobar').addClass('disabled');
				objeto.find('.checkbox').each(function(){					
					$(this).addClass('error');
					if($(this).is('[correcta]')){
						$(this).addClass('correcta');
					}					
				});
				if((HAS_RETOS)&&(objeto.is('.reto'))){
					solucionareto(reto, 'conseguido');
				}
			} else if (!correcto && (intentos>0)) {
				$('body').find('.mensaje .titulo').html('INCORRECTO...');
				$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_alerta.png');
				$('.texto_mensaje').html(objeto.attr('msg_error'));					
			} else if (!correcto && (intentos<=0)) {
				$('body').find('.mensaje .titulo').html('NO HAS RESUELTO CORRECTAMENTE EL EJERCICIO');
				$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_incorrecto.png');
				$('.texto_mensaje').html(objeto.attr('msg_ko'));
				objeto.find('.comprobar').addClass('disabled');
				objeto.find('.checkbox').each(function(){					
					$(this).addClass('error');
					if($(this).is('[correcta]')){
						$(this).addClass('correcta');
					}					
				});
				if((HAS_RETOS)&&(objeto.is('.reto'))){
					solucionareto(reto, 'fallado');
				}
			}	
			
			$('.mensaje').bPopup(
				{modalClose: false, appendTo: 'body'}
			);
		} else {
			$('.mensaje .titulo').html('YA HAS FINALIZADO EL EJERCICIO')
			$('.texto_mensaje').html('No puedes realizar el ejerccio.')
			$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_info.png')		
			$('.mensaje').bPopup(																					 
				{modalClose: false, appendTo: 'body'}
			);	
		}
	})
	
	objeto.find('.ayudaejercicio').click(function(){
		$('.mensaje .titulo').html('AYUDA')
		$('.texto_mensaje').html(objeto.attr('msg_ayuda'))
		$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_info.png')		
		$('.mensaje').bPopup(																					 
			{modalClose: false, appendTo: 'body'}
		);							   
	});
	
  };
})(jQuery);