/*********************************************************
 *
 * EJERCICIO BUSCAR ELEMENTOS
 * Funciones para crear y evaluar los ejercicios tipo buscar
 * Escindido de la estructura anterior de JS y CSS
 * Autor: F.J.L.G.
 * Fecha Creacion : 08 08 2014
 *
 **********************************************************/


/******************************
 * EJERCICIO BUSCAR ELEMENTOS
 ******************************/

function ejerciciobuscar(){
	var elementosocultos = 0;
	$('#cargador-imagen > div').each(function(){
		if($(this).attr('img')!=""){
			$(this).css('background-image', 'url("'+$(this).attr('img')+'")')
			$(this).css('background-repeat', 'no-repeat')
			$(this).css('background-size', 'contain')
		}
		
		elementosocultos++;
		$(this).css('width', $(this).attr('ancho'));
		$(this).css('height', $(this).attr('alto'));
		$(this).css('left', $(this).attr('izquierda'));
		$(this).css('top', $(this).attr('arriba'));
	});
	
	$('#elementosrestantes').html(elementosocultos);
	
	$('#mensaje-encontrado')
	.css('width', $('#mensaje-encontrado').attr('ancho'))
	.css('height', $('#mensaje-encontrado').attr('alto'))
	.css('left', $('#mensaje-encontrado').attr('izquierda'))
	.css('top', $('#mensaje-encontrado').attr('arriba'))
	
	$('.mensaje-encontrado')
	.css('height', $('#mensaje-encontrado').attr('alto'))
	
	$('#cargador-imagen > div').click(function(){
		if ($(this).hasClass('encontrado')){
			/*alert('ya lo encontraste antes')*/
		} else {
			if($(this).attr('imgencontrado')!=""){
				$(this).css('background-image', 'url("'+$(this).attr('imgencontrado')+'")')
				$(this).css('background-repeat', 'no-repeat')
				$(this).css('background-size', 'contain')
			}
			elementosocultos--;
			$('#elementosrestantes').html(elementosocultos);
			$('#elementosencontrados').append('<span class="hoverblack">'+$(this).attr('elemento')+'</span>')
			$(this).addClass('encontrado')
			$('#mensaje-encontrado').html($(this).find('.mensaje-encontrado'));			
			$('#mensaje-encontrado p').css('display', 'none')
			
			if ($('#mensaje-encontrado').css('display') == 'none'){
				$('#mensaje-encontrado').fadeIn(0);
			}
			
			function showfeedback(){
				$('#mensaje-encontrado p').html($('#feedback').text())
			}
						
			if (elementosocultos==0 && $(this).find('#feedback')){
				if((HAS_RETOS)&&($('#ejerciciobuscar').is('.reto'))){
					var reto = parseInt($('#ejerciciobuscar').attr('reto'))
					solucionareto(reto, 'conseguido');
				}
				//console.log(reto)				
				setTimeout(showfeedback,5000);				
			} 			

			$('#mensaje-encontrado p').fadeIn();
			
		}
		
		
	});
};
