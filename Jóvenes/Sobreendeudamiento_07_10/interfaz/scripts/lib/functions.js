/* ========================================================================================================
 *
 * 		FUNCIONES DE FABRICA 2.0
 *
 *		Version: 1.0
 *		Autor  : FJLG
 *		Fecha  : 28/7/2014
 *
 *		DESCRIPCION:   Almacenamos las funciones que necesitamos usar pero que no deben ser cargadas
 *					   cada vez que pasamos de página, sino solo en la carga del interfaz
 *						
 *
// ========================================================================================================*/


function evaluaprogreso(){
	
	// Anulamos este método y aplicamos el método de calculo definido en xml
	
	/*
	var auxStrProgress=""	
	var unitProgress 
	var totalUnitProgress=indiceUnidad.indice.getNumElement()
	 
	var indice
	var auxObjUnidad
	var indAux
	//totalUnitProgress=
	var totalAccedidas=0
	var totalPag=0
	
	for(unitProgress=1;unitProgress<=totalUnitProgress;unitProgress++)
	{
		indAux="1." + unitProgress
		auxObjUnidad=indiceUnidad.indice.elements[unitProgress-1];
	
		auxPagAccedidas=indiceUnidad.countPagesCompleted(auxObjUnidad);
		totalAccedidas+=auxPagAccedidas;
		auxPagTotales=indiceUnidad.countPages(auxObjUnidad);
		totalPag+=auxPagTotales
		porcentaje=Math.round(auxPagAccedidas/auxPagTotales*100);		
		
	}
	*/
	//var porcentaje=Math.round(totalAccedidas/totalPag*100);
	msg_debug("[evaluaprogreso] => ACTUALIZAMOS INFORMACION CONTEXTUAL")
	var porcentaje=Math.round(calculo_Puntuacion_Final());
	var ancho = porcentaje + "%";	
	$('#barra-progreso').css('background-color', '#DC0800')
	$('#barra-progreso').css('width', ancho)
	//$('#porcentaje-progreso').html(porcentaje + " %")
	var completarSco=false
	
	completarSco=SCORM_cierreSesion(false)
	if (completarSco)
	{
		msg_debug("[evaluaprogreso] => SCO COMPLETO")
		$('#porcentaje-progreso').html("<div class='scoCompleted'><div class='infoPuntuacion'>"+porcentaje + " %"+"</div></div>")
	}
	else
	{
		msg_debug("[evaluaprogreso] => SCO INCOMPLETO")
		$('#porcentaje-progreso').html("<div class='scoIncompleted'><div class='infoPuntuacion'>"+porcentaje + " %"+"</div></div>")
	}
	
}


function buscar(palabra){
	if((palabra=="") || (palabra==null))	{
		var strBusqueda=$("#txtbusqueda").attr("value")				
	} else {
		var strBusqueda = palabra;
		$('#txtbusqueda').val(palabra);
	}
	
	if (strBusqueda!="")
	{
		
		$(".palabraBusqueda").each(function(i){
			//alert(i)
			//$(this).css("display","none")
			//alert( i + "  " + $(this).attr("palabra") +strBusqueda )
			if($(this).attr("palabra").toUpperCase().split(strBusqueda.toUpperCase()).length>1) $(this).css("display","block")
			else $(this).css("display","none")
			 //alert( i + "  " + $(this).attr("palabra"))
		})
	}
	else
	{
	
		$(".palabraBusqueda").each(function(i){
			 $(this).css("display","block")
			})
	}
	
}



function activarBuscador(){

	$(actual).fadeOut(function(){					
		$("#todas").fadeIn();
	});
		
	$("#glosarioIndice_letras").fadeOut(function(){
		$("#formularioBusqueda").fadeIn()
	})
}


function activarbpopup(){
	$('.bpopupbutton').bind('click', function(e) {

        // Prevents the default action to be triggered. 
        e.preventDefault();
		
		$(this).next('.contenedorpopup').addClass('activo');
		
        // Triggering bPopup when click event is fired
    	$(this).next('.contenedorpopup').children('div').bPopup({modalClose: false, appendTo : $(this).next()});
	});
	
	$('.bClose').bind('click', function(e) {

        // Prevents the default action to be triggered. 
        e.preventDefault();
				
        // Triggering bPopup when click event is fired
    	$('.contenedorpopup').removeClass('activo');
	});
}



var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};
 
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
 
  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }
      return ret.join( '' );
  }
 
})();




function validarChecks() {
	
	
	$(".comprobar").click(function(){

		/* capturamos el valor de la etiqueta intentos del ejercicio activo
			lo usaremos para el numero de posibles intentos en cada ejercicio
			lo almacenamos en una variable 'intentos' */
		var intentos = $(this).closest(".ejerciciochecks").attr("intentos");
		
		/* variable booleana para saber si nos hemos quedado sin intentos */
		var sinintentos = false;
		
		/* si aun nos quedan intentos evaluamos los diferentes inputs */
		if (!sinintentos){
			/* creamos dos variables para almacenar el resultado de cada input,
				si la respuesta esta mal o si lo hemos dejado vacio */
			mal = false;
			
			/* bucle por cada input dentro del ejercicio */
			$(this).closest(".ejerciciochecks").find('input').each(function(){																		  
				/* leemos el valor de la etiqueta correcta que son los diferentes valores correctos para ese
				 	input y generamos un array separando los valores tomando como separador el caracte coma ','*/
				var correcta = $(this).attr('correcta');
				var pulsado =  $(this).is(':checked');

				if (correcta == "opcional"){
					mal = false;
				}else if (correcta == "false") {
					if (pulsado){
						mal = true;	
						return false;
					}
				} else if (correcta == "true") {
					if (!pulsado){
						mal = true;
						return false;
					}
				}
			
			});
			
			/* restamos un intento a la variable intentos */
			intentos--;
			
			/* actualizamos la etiqueta intentos del contenido con el nuevo valor de la variable intentos */
			$(this).closest(".ejerciciochecks").attr("intentos" , intentos);
			
			/* si intentos es 0 ponemos la variable booleana 'sinintentos' a true */
			if (intentos==0){
				sinintentos = true;				
			}
			
		}
		
		/* evaluamos el resultado de la validacion */ 
		if (mal && !sinintentos){
			$(this).closest(".ejerciciochecks").find('.mensaje_ko').bPopup({																					 
					appendTo: '$(this).closest(".ejerciciochecks")'
			});
		} else if (mal && sinintentos) {
			$(this).closest(".ejerciciochecks").find('.comprobar').css("display","none");
			$(this).closest(".ejerciciochecks").find('.mensaje_sinintentos').bPopup({																					 
				appendTo: '$(this).closest(".ejerciciochecks")'
			});
			$(this).closest(".ejerciciochecks").find('input').each(function(){
				var correcta = $(this).attr('correcta');
				if (correcta == "true"){
					 $(this).attr("checked", "checked");
				}else if (correcta == "opcional" || correcta == "false"){
					$(this).removeAttr("checked"); 
				}
				$(this).attr("disabled","disabled");
				$(this).closest(".ejerciciochecks").find('.mensaje_ok').addClass("feedback"); 
				$(this).closest(".ejerciciochecks").find(".comprobar").css("display","none");
			});
		} else if (!mal){
			$(this).closest(".ejerciciochecks").find('input').each(function(){
					var correcta = $(this).attr('correcta');
					if (correcta == "true"){
						 $(this).attr("checked", "checked");
					}else if (correcta == "opcional" || correcta == "false"){
						$(this).removeAttr("checked"); 
					}
					$(this).attr("disabled","disabled");
					$(this).closest(".ejerciciochecks").find(".comprobar").css("display","none")
			});
			
			$(this).closest(".ejerciciochecks").find('.mensaje_ok').bPopup({																					 
				appendTo: '$(this).closest(".ejerciciochecks")'
			});		
		} 
		
	});

}

function abrirCerrarMenu(){
	
	$('#indice_btn').click(function(){
		if($('#indice_btn').hasClass('inactivo')){
		
		} else {
			$('#navegacion').animate({
				width: 'toggle'
			}, 500, 'linear', function() {
				$('#navegacion').stop(true, true);
				scrollMenu();
			});	
		}
		
	});
	
	$('.pag').click(function(){
		$('#navegacion').animate({
			width: 'hide'
		}, 500, function() {
			$('#navegacion').stop(true, true);
			$('#navegacion-up').css('display', 'none')
			$('#navegacion-down').css('display', 'none')
		});
	});
	
	$('#navegacion-close').click(function(){
		$('#navegacion').animate({
			width: 'hide'
		}, 500, function() {
			$('#navegacion').stop(true, true);
			$('#navegacion-up').css('display', 'none')
			$('#navegacion-down').css('display', 'none')
		});
	});
	
	$('#contenidoMenu a').click(function(){
		$('#navegacion').animate({
			width: 'hide'
		}, 500, function() {
			$('#navegacion').stop(true, true);
			$('#navegacion-up').css('display', 'none')
			$('#navegacion-down').css('display', 'none')
		});
	});
	
	$('#contenidoMenu p').click(function(){
		$('#navegacion').animate({
			width: 'hide'
		}, 500, function() {
			$('#navegacion').stop(true, true);
			$('#navegacion-up').css('display', 'none')
			$('#navegacion-down').css('display', 'none')
		});
	});
}


/* INTENTANDO AUTOMATIZAR EL MOVIMIENTO DEL MENU
function arriba(sube, dif){
	var diferencia = dif
	var seguir = parseInt($(sube).css('top')) > parseInt(diferencia);
	if (seguir){
		$(sube).animate({
			top:"-=5"}, 
			50,
			function() {				
				arriba(sube, diferencia);
			}
		);
	} else {
		$(sube).stop();
		alert("kaka")
	}
}
*/

function scrollMenu(){
	var menu = 'ul#navegacion #contenidoMenu > ul';
	$('#navegacion-up').css('display', 'none')
	$('#navegacion-down').css('display', 'none')
	alto = parseInt($('#contenidoMenu ul').height());
	posicionActual = parseInt($(menu).css('top'))
	diferencia = 415 - alto;
	if (alto > 415){
		$('#navegacion-up').fadeIn(1000)
		$('#navegacion-down').fadeIn(1000)
	} else {
		$('#navegacion-up').css('display', 'none')
		$('#navegacion-down').css('display', 'none')
	}
	
	$(menu).bind('mousewheel', function(event){	
		if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
			posicionActual = parseInt($(menu).css('top'))
			//console.log(diferencia + " & " + posicionActual)
			if (posicionActual < -5){
				$(menu).stop(true, true).animate({top:"+=5"},
					20,
					function() {
					}
				)
			}
		}
		else {
		   posicionActual = parseInt($(menu).css('top'))
		   //console.log(diferencia + " & " + posicionActual)
			if (posicionActual > diferencia){
				$(menu).stop(true, true).animate({top:"-=5"},
					20,
					function() {
					}
				)
			}
		}
	});
	
	
	$("#navegacion-down")	
	.click(function(){		
		var posicionActual = parseInt($(menu).css('top'))
		//console.log(posicionActual)
		if (posicionActual > diferencia){
			$(menu).stop(true, true).animate({top:"-=50"},
				200,
				function() {
				}
			)
		}
	});
	
	$("#navegacion-up")	
	.click(function(){		
		var posicionActual = parseInt($(menu).css('top'))
		//console.log(posicionActual)
		if (posicionActual < -5){
			$(menu).stop(true, true).animate({top:"+=50"},
				200,
				function() {
				}
			)
		}
	});
}

function botonesayuda(){
	$('#btn_volver').click(function(){
	volverToContent();		
	$(this).fadeOut(300, function(){$('#btn_ayuda').fadeIn(300)});		
	});
	
	$('#btn_ayuda').click(function(){
		ayuda();
		$('.navsiguiente, .navanterior').addClass('inactivo');
		$(this).fadeOut(300, function(){$('#btn_volver').fadeIn(300)});				
	});
}


