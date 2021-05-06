
// ========================================================================================================
//
// 		ACTIVADORES DE WIDGETS FABRICA 2.0
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 15/3/2012
//
//
//		DESCRIPCION:   Esta libreria se encarga de sustituir la funcionalidad del anterior "widgets.js" de fabrica. Contiene las funciones 
//					   encargadas de la inicialización de los distintos componentes que pueden aparecer en una página.
//
//					   La principal diferencia  en el nuevo modelo de interfaz es que la inicialización de los componentes se debe de realizar 
//					   cada vez que se recarga la página con AJAX, y no en el document ready, ya que en ningun momento se carga un html completo.
//
//
// ========================================================================================================

// Recarga el objeto PAGE_ELEMENTS con las acciones definidas en la página y reinicia el contador
function reload_PAGE_ELEMENTS()
{
    
	
	
	msg_debug(" <font color='RosyBrown'>reload_PAGE_ELEMENTS() ..............   </font>")

	PAGE_ELEMENTS.clearActions()

	//    PAGE_ELEMENTS.loadAction  => carga las acciones una a una instanciando objetos de tipo FAB20_SECUENCER_ACTION
	/*		
			Ejemplo:
	
	
			var auxaction=new FAB20_SECUENCER_ACTION()
			auxaction.startTime=0
			auxaction.action="accion a realizar de las definidas"
			auxaction.idelement="identificadordelelemento"
			
			PAGE_ELEMENTS.loadAction(auxaction)

	*/
	$(".FAB20_SEQUENCER div").each(function(){
	
			msg_debug(" <font color='RosyBrown'>LOAD SECUENCER ACTION Elem:"+$(this).attr("elem")+ " Start:" + $(this).attr("start")+ " Action:" + $(this).attr("action")+ "</font>")
			var auxaction=new FAB20_SECUENCER_ACTION()
			auxaction.startTime=parseInt($(this).attr("start"))
			auxaction.action=$(this).attr("action")
			auxaction.idelement=$(this).attr("elem")
			auxaction.parametros=($(this).attr("parametros")!=null?$(this).attr("parametros"):"") 
			
			// Dejamos el elemento en su posición inicial segun el efecto que vamos a realizar
			FAB20_SECUENCER_actionEffect(auxaction,true)	
			
			PAGE_ELEMENTS.loadAction(auxaction)
	});
	msg_debug(" <font color='RosyBrown'>END reload_PAGE_ELEMENTS() ..........   </font>")
	msg_debug(" <font color='RosyBrown'>.. START ..</font>")
	PAGE_ELEMENTS.startActions()
	
	// Iniciamos el audio junto con las acciones en el caso de tener audiostart a "true" o "". En otro caso no inicia.
	soundPage.loadSecuencesDefinitions()	// Cargamos las definiciones de la página si las hubiese		
	if((indiceUnidad.pagActual.audiostart=="true")||(indiceUnidad.pagActual.audiostart=="")) soundPage.play() 
	
}

// Actualiza el contenido de todos los  <span idtextual="identificador"></span> con los textos cargados en el xml textuales.
function actualizaTextuales()
{
	$("[idtextual]").each(function(){
	
			//alert($(this).attr("idtextual"))
			$(this).html(getTextual($(this).attr("idtextual")))
	})
	
}
// Actualiza la capa que indica en que página del subapartado esta. Se representa con cuadritos
function paginadorApartados()
{

	// Por lo pronto unicamente lo mostramos en el caso de ser un nivel 2 de rama en el arbol.
	if (indiceUnidad.getLevel()>=2)  
	{
		// Nos da información de las hojas hermanas.
		//this.getBrothers=_getNumBrothers_indexObject			// Numero de hermanos
		//this.getIAMBrotherNum=_getIAMBrotherNum_indexObject		// Posicion que ocupa entre los hermanos
		//this.getLevel=_getLevelBrother_indexObject				// Nivel en el arbol
		var total=indiceUnidad.getBrothers()
		var pos=indiceUnidad.getIAMBrotherNum()
		var cont 
		var str=""
			
		for(cont=1;cont<=total;cont++)
		{
			if  (cont!=pos)		str=str + "<div class='paginadorApartados_cuadrovacio' ></div>"
			else 				str=str + "<div class='paginadorApartados_cuadrorelleno' ></div>"
			
		}
		str=str + "<div id='paginadorApartados_txt'>" + indiceUnidad.getIAMBrotherNum() + "/" + indiceUnidad.getBrothers() 
		//$("#paginadorApartados").html("" + indiceUnidad.pagActual.numpagina + " de " + indiceUnidad.numPages()  + indiceUnidad.getBrothers())
		//$("#paginadorApartados").html("" + indiceUnidad.getIAMBrotherNum() + " de " + indiceUnidad.getBrothers()  +  " en nivel " + indiceUnidad.getLevel())
		$("#paginadorApartados").html(str )
		
		
		//indiceUnidad.numPages()
		//indiceUnidad.pagActual.numpagina
	}
	else
	{
		$("#paginadorApartados").css("display","none")
	}
}

// -------------------------------------------------------------------------------------------------------
//	Inicializa todos los posibles componentes
function initAllComponents()
{	
	
	actualizaTextuales();
	paginadorApartados();
	activaCopiame("")
	checkCompletedPracticas();
	addrecursos();
	animaciones();
	iniciabase();
	validarChecks();
	activarbpopup();
	
	inicializarCuestionarios();	

	abrirCerrarMenu();
	appear();
	ejercicio_cnd();
	//botonesayuda();
	escenasplay();
	ejerciciobuscar();
	evaluaprogreso();
	
	//$('.copiar').copiaralportapapeles();
	
	$('.ejerciciochecks').each(function(){
		$(this).ejerciciochecks();
	});
	
	$(".pasosvertical").each(function(){
		$(this).pasosvertical();
	});
	
	$(".objetoenmovimiento").each(function(){
		$(this).objetoenmovimiento();
	});
	
	$(".toselect").each(function(){
		$(this).inputtoselect();
	});
	
	$(".toselect").each(function(){
		$(this).inputtoselect();
	});	
	
	
	$(".ejerciciocompletar").each(function(){
		$(this).ejerciciocompletar();
	});

	$('.dragdrop').each(function(){
		$(this).dragdrop();
	});
	
	if(INCLUDE_MONITOR){
		$(".monitor").each(function(){
			$(this).monitor();
		});
	}

	if(INCLUDE_TABLET){
		$(".tablet").each(function(){
			$(this).tablet();
		});
	}
	
	if(INCLUDE_PROYECTOR){
		$(".proyector").each(function(){
			$(this).proyector();
		});	
	}
	
	if(INCLUDE_IMAGINA){
		$(".imagina").each(function(){
			$(this).imagina();
		});	
	}
	
	reload_PAGE_ELEMENTS(); // Inicializa el secuenciador de elementos con la configuración de la página
}


function clipboardCopy(txt) { 
    if (window.clipboardData) { 
        window.clipboardData.clearData(); 
        window.clipboardData.setData("Text", txt); 
    } 
    else if (window.netscape) { 
        try { 
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); 
        } 
        catch (e) { 
            alert("Un script no puede Cortar / Copiar / Pegar automáticamente por razones de seguridad.\n"+ 
                  "Para hacerlo necesitas activar 'signed.applets.codebase_principal_support' en about:config'"); 
            return false; 
        } 
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard); 
        if (!clip) 
            return; 
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable); 
        if (!trans) 
            return; 
        trans.addDataFlavor('text/unicode'); 
        var str = new Object(); 
        var len = new Object(); 
        var str = Components.classes['@mozilla.org/supports-tring;1'].createInstance(Components.interfaces.nsISupportsString); 
        var copytext = txt; 
        str.data = copytext; 
        trans.setTransferData("text/unicode",str,copytext.length*2); 
        var clipid = Components.interfaces.nsIClipboard; 
        if (!clip) 
            return false; 
        clip.setData(trans,null,clipid.kGlobalClipboard); 
    } 
}
function activaCopiame(base)
{
    
	$(base + ".copiame").each(function(){
	
		$(this).click(function(){
			clipboardCopy($(this).html())
		})
		
	})

}

function desactivaNavegacion(){
	$('.navsiguiente, .navanterior').addClass('inactivo');
	$('.btnrecursos').each(function(){
		$(this).fadeOut(0)
	});
}

function activaNavegacion(){
	$('.btnrecursos').each(function(){
		$(this).delay(200).fadeIn(300)
	});
}


function checkCompletedPracticas(){
	var valores
	if(indiceUnidad.hasPracticas)
	{
		$('.checkIfCompleted').each(function(){
		
			if(($(this).attr("idpractica")!=null)&&($(this).attr("idpractica")!=""))
			valores=indiceUnidad.practicaGetValues($(this).attr("idpractica"))
			if(valores!=null)
			{
				if(valores.completado) 		$(this).addClass("practicaCompletada")			//alert($(this).attr("practica") + " finalizada") 
				
			}
		});
	}
}



/*******************************
 * CARGA DE LOS ELEMENTOS BASE
 *******************************/

function iniciabase(){
	
/* Cargador entre pantallas
 *******************************/	
	$("#fab20_body").on({
		// When ajaxStart is fired, add 'loading' to body class
		ajaxStart: function() { 
			
			$('#cargador').addClass("loading"); 
		},
		// When ajaxStop is fired, rmeove 'loading' from body class
		ajaxStop: function() {
			$('#cargador').removeClass("loading"); 
			//$(this).removeClass("loading"); 
		}    
	});
 
/* Inicializa el componente acordeon.
 ***************************************/
	$(".acordeon").accordion({
		header: "h3",
		collapsible: true,
		active:false,
		autoHeight:false
	});

/* Inicializa el componente secuencia de botones.
 **************************************************/
	// SECUENCIA BOTONES HORIZONTAL	
	$("button, input:submit, a", ".secuenciabotones").button();
	$('button.bullet').click(function(){
		$(this).next("div.contenedorbullet").toggle("slide",'',"slow"); 
	});	
	
	$('button.bigbullet').click(function(){
		$(this).next("div.contenedorbigbullet").toggle("fade",'',"slow"); 
	});	
				
	// SECUENCIA BOTONES VERTICAL
	$( "button, input:submit, a", ".secuenciabotones" ).button();
	$('button.boton').click(function(){
		$(this).next("div.contenedorboton").toggle("slide",'',"slow"); 
	});				


/* Inicia Fanybox
 *********************/
	$(".ampliar").fancybox({
	  helpers: {
		  title : {
			  type : 'float'
		  }
	  }
	});		   

	// Creamos una ventana oculta y añadimos todos los elementos ampliables en ella. Esto es para los popup emergentes con contenido inline.
	if ($('.ampliable').length){
		$('#fab20_body').append('<div class="contenedor_ampliables"></div>');
		
		$('#fab20_body').find('.ampliable').each(function(){
			$('.contenedor_ampliables').append($(this));
		});	
	}	


/* Inicializa el componente de despliege de recursos.
 *******************************************************/
	$(".bloquesdesplegables h4").click(function(){	
			$("pre.pregunta").toggle("fade",'',10);
			$("div.bloquecuerpo").toggle("fade",'',500); 
		  	return false;
	});

/* Pestañas Superiores.
 **********************/

	$('.tabsup').each(function(){
		$(this).css('height', $(this).attr("alto"));
	});
	

	$('.tabsup ul.tabmenu li a').click(function(){
			$('.tabsup ul li a.activo').removeClass('activo');
			$('.tabslide').fadeOut();
			var actual = $(this).attr('href');
			if (navigator.appVersion.indexOf("MSIE 7.") != -1){
				var str = actual.split('#');
				actual = '#' + str[1];
			}			
			$(this).addClass('activo');
			$(actual).stop(true,true).delay(300).fadeIn(900);
			$(this).children('span').transition({perspective: '100px', rotateY: '360deg'})
	});		

	$('li.apartado').click(function(){
		$(this).parent().children('li').unbind(0);
		$(this).children('ul').bind(400);				
	});	 
	
	$('#contenidoMenu a').click(function(){
		$('#contenidoMenu li.apartado').removeClass('apartado_activo');
		$('#contenidoMenu a').removeClass('punto_activo');
		$('#contenidoMenu a').addClass('punto_activo');
		$(this).parents('li.apartado').addClass('apartado_activo');
	});






/********************************
 * OBJETIVOS / LISTADOS APPEAR
 ********************************/
 
	$('.appear_btn').click(function(){
		time=0;
		$(this).parent().children('.appear_lista').children('li').each(function() {		
			$(this).stop(true).delay(time).fadeIn(100);	
			time = time + 1000;
		});
		$(this).parent().children('pre').hide(0);
	});
	$('.pregunta_btn').click(function(){
		$(this).parent().children('.respuesta').slideDown(300);	
		$(this).parent().children('pre').hide(0);
	});

}








// Añade el mecanismo de un carrusel de imágenes
function carruselImagenes() {	
			
			
				var currentPosition = 0;
				var slideWidth = 810;
				var slides = $('.slide');
				var numberOfSlides = slides.length;
			  
				// Remove scrollbar in JS
				$('#slidesContainer').css('overflow', 'hidden');
			  
				// Wrap all .slides with #slideInner div
				slides
				  .wrapAll('<div id="slideInner"></div>')
				  // Float left to display horizontally, readjust .slides width
				  .css({
					'float' : 'left',
					'width' : slideWidth
				  });
				  
				   $(".text_content").hover(function() {
				 $(".text_description").slideDown('slow','');
			   });
			   
			   $(".text_content").mouseleave(function() {
				 $(".text_description").stop(true, true).slideUp('slow','');
			   });
			  
				// Set #slideInner width equal to total width of all slides
				$('#slideInner').css('width', slideWidth * numberOfSlides);
				
				// Insert controls in the DOM
				$('#slideshow')
				  .prepend('<span class="control" id="leftControl">Clicking moves left</span>')
				  .append('<span class="control" id="rightControl">Clicking moves right</span>');
			  
				// Hide left arrow control on first load
				manageControls(currentPosition);
			  
				// Create event listeners for .controls clicks
				$('.control')
				  .bind('click', function(){
				  // Determine new position
				  currentPosition = ($(this).attr('id')=='rightControl') ? currentPosition+1 : currentPosition-1;
				  
				  // Hide / show controls
				  manageControls(currentPosition);
				  // Move slideInner using margin-left
				  $('#slideInner').animate({
					'marginLeft' : slideWidth*(-currentPosition)
				  });
				});
			  
				// manageControls: Hides and Shows controls depending on currentPosition
				function manageControls(position){
				  // Hide left arrow if position is first slide
				  if(position==0){ $('#leftControl').hide() } else{ $('#leftControl').show() }
				  // Hide right arrow if position is last slide
				  if(position==numberOfSlides-1){ $('#rightControl').hide() } else{ $('#rightControl').show() }
				}
		   
}





/* Funcion para mostrar elementos dinamicamente */
function appear(){	
	var retraso=600;
	$(".app")
	.each(function(){
		retraso+=600;		
		if(isIE9()){
			$(this).fadeTo(0, 0).delay(retraso).fadeTo(500, 1.0);
		} else if (isIE8()){
		} else {
			$.cssEase['bounce'] = 'cubic-bezier(1,1,0.2,1.2)';				
			/* CLASE "toptobottom" LOS ELEMENTOS APARECEN DESDE ARRIBA */
			if ($(this).hasClass("toptobottom")){
				$(this)
				.transition({y:-1000}, 0)
				.delay(retraso)		
				.transition({y:0}, 800 , $(this).attr("easing"))
			}
			
			/* CLASE "bottomtotop" LOS ELEMENTOS APARECEN DESDE ABAJO */
			if ($(this).hasClass("bottomtotop")){
				$(this)
				.transition({y:1000}, 0)
				.delay(retraso)		
				.transition({y:0}, 800 , $(this).attr("easing"))
			}
			
			/* CLASE "lefttoright" LOS ELEMENTOS APARECEN DESDE LA IZQUIERDA */
			if ($(this).hasClass("lefttoright")){
				$(this)
				.transition({x:-1000}, 0)
				.delay(retraso)		
				.transition({x:0}, 800 , $(this).attr("easing"))
			}
			
			/* CLASE "righttoleft" LOS ELEMENTOS APARECEN DESDE LA DERECHA */
			if ($(this).hasClass("righttoleft")){
				$(this)
				.transition({x:1000}, 0)
				.delay(retraso)		
				.transition({x:0}, 800 , $(this).attr("easing"))
			}
			
			/* CLASE "FADE" LOS ELEMENTOS APARECEN LINEARMENTE */
			if ($(this).hasClass("fade")){			
				$(this).fadeTo(0, 0).delay(retraso).fadeTo(500, 1.0);
			}
			
			/* CLASE "parapadeo" LOS ELEMENTOS PARPADEAN PARA APARECER */
			if ($(this).hasClass("parpadeo")){			
				$(this).fadeTo(0, 0).delay(retraso)
				for(i=0;i<3;i++) {
					$(this).fadeTo(100, 0).fadeTo(100, 1.0);
				};
				$(this).fadeTo(100, 0).fadeTo(500, 1.0);
			}
			
			/* CLASE "poping" LOS ELEMENTOS CRECEN DESDE EL FONDO */
			if ($(this).hasClass("poping")){
				$(this)
				.transition({scale:0}, 0)
				.delay(retraso)		
				.transition({scale:1}, 800 , $(this).attr("easing"))
			}
			
			/* CLASE "fall" LOS ELEMENTOS PARECEN CAER */
			if ($(this).hasClass("fall")){
				
				$(this).fadeTo(0, 0)
				.transition({scale:2}, 0)
				.delay(retraso)
				.fadeTo(0, 1.0)
				.transition({scale:1}, 500 , 'bounce')
			}
		}
	});
	/*
	time=1000;
	$('.app').each(function() {		
		$(this).stop(true, true).delay(time).fadeIn(300);	
		time = time + 1000;
	});*/
}

function animaciones(){	
		$('.secuenciabotones .bullet').click(function(){
				$(this).transition({perspective: '100px', rotateY: '360deg'})
				$(this).addClass('visto');
		});	
		
		$('.bpopupbutton').click(function(){
				$(this).addClass('visto');
				$(this).children('span').transition({perspective: '100px', rotateY: '360deg'})
		});	
		
		$('.descubre').click(function(){			
				$(this).transition({perspective: '100px', rotateX: '271deg'}, 500).fadeOut(0)
		});
		
		$('.mostrar').children().transition({y:-100}, 0);
		
		$('.mostrar').click(function(){
				$(this).addClass('visto');
				$(this).children().transition({y:0}, 300)
		});	
		
		$('.preguntaRespuesta .titulo').click(function(){
				$(this).addClass('visto');
				$(this).children('span').transition({perspective: '100px', rotateY: '360deg'})
		});
}


/******************************
 * EJERCICIO CLICK AND DROPP
 *****************************/
 
 
function addtext(){
	$('#cardSlots').find('.dropp').each(		
		function(){
//			console.log($(this).html())
			if ($(this).html()==""){
				$(this).html('<div>'+$(this).attr('title')+'</div>')
			} else {
			}
		}
	);
}

function ejercicio_cnd() {
	
	addtext();
	
	
	var ancho = -10;
	$('.drag').each(function(){
			ancho = ancho + 130;
		});
//	console.log(ancho);
	
	$('#cardPile').css('width', ancho+'px');
	$('#cardSlots').css('width', ancho+'px');
	$('#buttons').css('width', ancho+'px');
	
	$('.drag').click(
		function(){				
			$('.drag').removeClass('drag-on');
			$(this).addClass('drag-on');
			
/*		if($(this).parent().hasClass('ocupado')){
				$(this).parent().removeClass('ocupado');
			} else {
			}*/
		}
	);
	
	$('.dropp').click(
		function(){						
			if ($(this).hasClass('ocupado')){
				$('.drag').removeClass('drag-on');
				$(this).children('.drag').addClass('drag-on');
			} else {				
				if ($('.drag').hasClass('drag-on')){
					if ($('.drag-on').parent().hasClass('ocupado')) $('.drag-on').parent().removeClass('ocupado');
					$(this).html($('.drag.drag-on'));
					$(this).addClass('ocupado');
					$('.drag').removeClass('drag-on');
				} else {
					$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_alerta.png')
					$('.mensaje .titulo').html('Selecciona un elemento.')
					$('.texto_mensaje').html('Debes seleccionar un elemento de la fila superior y ubicarlo en la posicion correcta de la fila inferior.')
					$('.mensaje').bPopup(
						{modalClose: false, appendTo: 'body'}
					);
				}
			}
			addtext()
		}
	);
	
	$('#volver-uno').click(
		function(){			
			if ($('#cardSlots').find('.drag').hasClass('drag-on')){
				$('.drag-on').parent().removeClass('ocupado');
				$('#cardPile').append($('.drag.drag-on'));
				$('.drag').removeClass('drag-on');				
			} else {
				$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_info.png')
				$('.mensaje .titulo').html('Selecciona un elemento.')
				$('.texto_mensaje').html('Debes seleccionar algun elemento que ya este ubicado en una posición de la fila inferior.')
				$('.mensaje').bPopup(
					{modalClose: false, appendTo: 'body'}
				);
			}
			addtext();
		}
	);
	
	$('#resetear').click(
		function(){
			$('.dropp span').remove();
			$('.dropp').removeClass('ocupado');
			$('.dropp').children().addClass('drag')
			$('#cardPile').append($('.drag'));
			$('.drag').removeClass('drag-on');
			$('.drag').removeClass('correcto');
			$('#message').fadeOut(500);
			$('.dropp').html="";
			addtext();
			
			$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_info.png')
			$('.mensaje .titulo').html('Comienza de nuevo.')
			$('.texto_mensaje').html('Vuelve a intentarlo, ubica los elementos de la fila superior en sus respectivos huecos.')
			$('.mensaje').bPopup(
				{modalClose: false, appendTo: 'body'}
			);
		}
	);
	
	$('#comprobar').click(		
		function(){
			if((HAS_RETOS)&&($('#ejerciciohuecos').is('.reto'))){
				var reto = parseInt($('#ejerciciohuecos').attr('reto'))
			}
			var correcto = true;			
			$('#cardSlots').find('.dropp').each(function(){
				if ($(this).children().hasClass('drag') || $(this).children().hasClass('correcto')){
					if ($(this).attr('numero') == $(this).children().attr('numero')){
						$(this).children().addClass('correcto');
						$(this).children().removeClass('drag');						
						if($(this).find('span').is('span')){
							
						} else {
							$(this).append('<span></span>');
							$(this).find('span').transition({perspective: '100px', rotateY: '360deg'})
						}
					} else {
						$(this).removeClass('ocupado');
						$(this).children().removeClass('drag-on');
						$('#cardPile').append($(this).children());
						correcto = false;
					}
				} else {
					correcto = false;
				}
				addtext();
				
			});
			if (correcto){
				$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_exito.png')
					$('.mensaje .titulo').html('Correcto!')
					$('.texto_mensaje').html('Enhorabuena, has posicionado correctamente todos los elementos. Pasa a la siguiente pantalla.')
					$('.mensaje').bPopup(
						{modalClose: false, appendTo: 'body'}
						
						
				);
				if((HAS_RETOS)&&($('#ejerciciohuecos').is('.reto'))){
					solucionareto(reto, 'conseguido');
				}
				activame();
			} else {
				$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_incorrecto.png')
					$('.mensaje .titulo').html('Lo siento!')
					$('.texto_mensaje').html('Ten cuidado, hay elementos que no estan ubicados en su lugar correcto.')
					$('.mensaje').bPopup(
						{modalClose: false, appendTo: 'body'}
				);
			}
		}
	);
	
	// Reset message	
	$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_exito.png')
	$('.mensaje .titulo').html('')
	$('.texto_mensaje').html($('.ejerciciorellenar').attr(''))

	
}


/**************************
 * GENERADOR DE DIALOGOS
 **************************/
ESCENASPLAY_QUESTION=[];
function playscene(escena){	
		if((escena!=undefined)&&(escena < totalescenas)){			
			setTimeout(function(){document.getElementsByTagName('audio')[escena].play()}, 1500);
			$('#cargador-imagen-dialogo img[imagen="'+escena+'"]').fadeIn("slow")
		}
}	
		
function escenasplay(){
	
	$("#question_img").css("display","none");
	$("#question_continuar").css("display","none");
	
	if($('#ventana-dialogo').length){
		var escenaactual = 0;
		var totalescenas = 0;
		ESCENASPLAY_QUESTION=[]; // inicializamos el vector de preguntas (Variable global)
		$('#ventana-dialogo').find('escena').each(function(){
			totalescenas++;
			var attrquestion="";
			// Comprobamos si tiene alguna pregunta definida
			if ($(this).find('pregunta').length==1)
			{
				// Existe una pregunta definida
				$(this).find('pregunta').each(function(){
				
						ESCENASPLAY_QUESTION[totalescenas]=this; //alert("hola")
						attrquestion=' attrquest="'+totalescenas+'" '
				});
				// Hemos de almacenarla en algun lugar para que al finalizar el audio podamos activar la pregunta.
			}
					
			
			$("#cargador-audio-dialogo").append('<audio class="audio" pista="'+$(this).attr("numero")+'" preload="auto" '+attrquestion+'  ><source src="contenidos/modulo01/media/'+$(this).attr("audio")+'.mp3"><source src="contenidos/modulo01/media/'+$(this).attr("audio")+'.ogg"></audio>')
			$('#cargador-imagen-dialogo').append('<img src="contenidos/modulo01/media/'+$(this).attr("imagen")+'" imagen="'+$(this).attr("numero")+'"/>')			
		});

		

		//function playscene(escena){	
		//	setTimeout(function(){document.getElementsByTagName('audio')[escena].play()}, 1500);
		//	$('#cargador-imagen-dialogo img[imagen="'+escena+'"]').fadeIn("slow")
		//}	
		
		playscene(0);
				
		$(".audio").bind('ended', function(){
			if (escenaactual < totalescenas){				
				var siguiente = parseInt($(this).attr('pista'))+1;	
				if (($(this).attr('attrquest')!=undefined )&&($(this).attr('attrquest')!=""))
				{
					//alert(" Total escenas " + totalescenas + " siguiente " + siguiente)
					if (totalescenas==siguiente) siguiente=-1
					playscena_showquest(parseInt($(this).attr('attrquest')),siguiente,true )
				}
				else
				{
					playscene(siguiente);
					escenaactual++;
				}
			}
		});

		
	}

}
function playscena_showquest(pregunta,siguienteescena,inicializa)
{
	var enunciado=""
	var respuestas=""
	var rutaimg=""
	var tmptrue=""
	enunciado=$(ESCENASPLAY_QUESTION[pregunta]).find("enunciado").text()
	
	$(ESCENASPLAY_QUESTION[pregunta]).find("respuesta").each(function(){
		
		// Comprobamos si tenemos un atribudo "correcta" con valor si o true
		tmptrue=$(this).find("feedback").attr("correcta")
		if ((tmptrue=="si")||(tmptrue=="SI")||(tmptrue=="true")||(tmptrue=="TRUE"))	tmptrue=true;
		else tmptrue=false
	
		respuestas=respuestas+"<li onclick='playscena_showfeedback(\""+
								$(this).find("feedback").text()+ "\",\"" + 
								$(this).find("feedback").attr("img")+ "\","+
								siguienteescena+
								","+tmptrue+
								","+pregunta+")'>"+
								$(this).find("texto").text()+
								"</li>"
		//respuestas=respuestas+"<li>"+$(this).find("feedback").text()+"</li>"
		//respuestas=respuestas+"<li>"+$(this).find("feedback").attr("img")+"</li>"
		
	}) 
	// Si es la primera vez, mostramos imagen, enunciado y respuestas. Caso contrario solo repintamos las respuestas
	//enunciado=enunciado + " Pregunta:" + pregunta+ " siguiente escena "+siguienteescena+ " inicializa " + inicializa
	if (inicializa==true)
	{
		
		
		$("#question_img").css("display","block");
		rutaimg="contenidos/modulo01/media/"+$(ESCENASPLAY_QUESTION[pregunta]).attr("img")+ ".png"
		$("#question_img").attr("src", rutaimg);
		//$("#question_continuar").css("display","none");
		$("#question").fadeIn("slow")
	}
	$("#question_enunciado").html(enunciado)
	// Las preguntas las mostramos siempre
	$("#question_respuestas").html(respuestas)
	
}

// ----------------------------------------------------------------------------------------------
//	txt => texto de la respuesta
//	img => imagen que aparece junto al feedback
//	esc => escena a la que debe de saltar a continuacion
//	correcta => indica si es una respuesta correcta (si no lo es, no avanza a la siguiente escena)
//  pregunta => referencia a la pregunta que está mostrando
function playscena_showfeedback(txt,img,esc, correcta, pregunta )
{
	
	var tmpfeedback
	
	tmpfeedback= ""
	//tmpfeedback = "img:"+img +" esc:"+esc +" correcta:"+ correcta+" pregunta:"+ pregunta 
	//alert(tmpfeedback)
	$("#question_respuestas").html("<p>"  +tmpfeedback + "  " + txt +  "</p>")
	$("#question_img").css("display","block");
	rutaimg="contenidos/modulo01/media/"+img+ ".png"
	$("#question_img").attr("src", rutaimg);
	//$("#question_continuar").css("display","none");
	//alert(esc + " " + img + "  " + txt)
	$("#question_continuar").css("display","block");
	
	if(correcta)	$("#question_continuar").text("Continuar");
	else			$("#question_continuar").text("Prueba otra respuesta");
	
	$("#question_continuar").unbind("click");
	$("#question_continuar").click(function(e)
		{
			//alert("correcta: " + correcta + " esc " + esc)
			$("#question_continuar").css("display","none");
			if(correcta)
			{
				//playscene(esc);
				$("#question").fadeOut("slow",function(){ if (esc!=-1) playscene(esc);})
				
			}
			else
			{
				playscena_showquest(pregunta,esc,false)
			}
		})
		
	
}




/******************************
 * EJERCICIO BUSCAR ELEMENTOS
 ******************************/

function ejerciciobuscar(){
	var elementosocultos = 0;
	$('#cargador-imagen div').each(function(){
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
	
	$('#cargador-imagen div').click(function(){
		if ($(this).hasClass('encontrado')){
			/*alert('ya lo encontraste antes')*/
		} else {
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

/**************************
 * GENERADOR DE DIALOGOS
 **************************/
function isIE8(){
	if ($.browser.msie  && parseInt($.browser.version, 10) <= 8) {
		return true
	} else {
		return false
	}
}


function isIE9(){
	if ($.browser.msie  && parseInt($.browser.version, 10) == 9) {
		return true
	} else {
		return false
	}
}


function isiPhone(){
    return (
        (navigator.platform.indexOf("iPad") != -1) ||
		//Detect iPhone
        (navigator.platform.indexOf("iPhone") != -1) ||
        //Detect iPod
        (navigator.platform.indexOf("iPod") != -1)
    );
}

function isIPAD(){
    return (
        (navigator.platform.indexOf("iPad") != -1) ||
		//Detect iPhone
        (navigator.platform.indexOf("iPhone") != -1) ||
        //Detect iPod
        (navigator.platform.indexOf("iPod") != -1)
    );
}
 
var ESCENASPLAY_QUESTION=[];
var IE8SOUNDS=[];
var IE8_totalescenas=0;

function playscene(escena){	
	totalescenas=$('#ventana-dialogo').find('div.escena').length	
	if (isIE8()){
			var totalescenas=IE8SOUNDS.length;
			//alert("Total escenas " + totalescenas)
			//alert("Activamos escena como IE8")
			// En el caso de ser un IE8 activamos el audio por medio de un bgsound, y programamos el boton siguiente
			// para avanzar a la siguiente escena de forma asincrona.
			setTimeout(function(){
				
				// Mostrar el botón siguiente, con la programación de un playscene(escena+1) si no supera el total de escenas.
				$("#btnNextEscene").css("display","block")
				$("#btnNextEscene").unbind("click");
				$("#btnNextEscene").click(function(e)
				{
						$("bgsound").attr("src","audiofalso.mp3")						
						if (escena < totalescenas){				
								var siguiente = escena+1;	
								//alert(ESCENASPLAY_QUESTION)
								
								if (ESCENASPLAY_QUESTION[escena+1]!=null)
								{
									//alert(" Total escenas " + totalescenas + " siguiente " + siguiente)
									if (totalescenas==siguiente) siguiente=-1
									playscena_showquest(escena+1,siguiente,true )
								}
								else
								{
									playscene(siguiente);
									 
								}
						 }
							
					 
				})
				
				// Añadir aqui el código de activación de etiqueta BGSound				
				$("bgsound").attr("src",IE8SOUNDS[escena])	

				
			
			}, 1500);
			$('#cargador-imagen-dialogo img[imagen="'+escena+'"]').fadeIn("slow")			
	}
	else if (isIPAD()){
			try{
					if(escena>0) document.getElementsByTagName('audio')[escena-1].pause();
				}
				catch(e)
				{
				alert(""+e)
				}
			document.getElementsByTagName('audio')[escena].play();
			$('#cargador-imagen-dialogo img[imagen="'+escena+'"]').fadeIn("slow")
			totalescenas=$('#ventana-dialogo').find('div.escena').length
			
				
				// Mostrar el botón siguiente, con la programación de un playscene(escena+1) si no supera el total de escenas.
				$("#btnNextEscene").css("display","block")
				animaSiguiente("btnNextEscene")
				$("#btnNextEscene").unbind("click");
				
				$("#btnNextEscene").click(function(e)
				{
							if (escena < totalescenas){				
								var siguiente = escena+1;		
								if (ESCENASPLAY_QUESTION[escena+1]!=null)
								{
									document.getElementsByTagName('audio')[escena].pause();
									//alert(" Total escenas " + totalescenas + " siguiente " + siguiente)
									if (totalescenas==siguiente) siguiente=-1
									playscena_showquest(escena+1,siguiente,true )
								}
								else
								{
									playscene(siguiente);									 
								}
							} 
							
					 
				})			
			
			
			
	
	}
	else
	{
			if((escena!=undefined)&&(escena < totalescenas)){
				setTimeout(function(){document.getElementsByTagName('audio')[escena].play()}, 1500);
				$('#cargador-imagen-dialogo img[imagen="'+escena+'"]').fadeIn("slow")
			}
	}
	
	
	
	if (parseInt(escena) == (parseInt(totalescenas)-1)){
		$("#btnNextEscene").remove()
		if($('#ventana-dialogo').attr('desactivaNavegacion')=='true'){
			activaNavegacion();
		}
	}
	
}	
		
function escenasplay(){
	
	$("#startScene").css("display","none")
	IE8SOUNDS=[];
	var numAvances=0
	
	//alert("escenas play")
	try
	{
	$("#question_img").css("display","none");
	$("#question_continuar").css("display","none");
	
	
	if($('#ventana-dialogo').length){
		
		if($('#ventana-dialogo').attr('desactivaNavegacion')=='true'){
			desactivaNavegacion();
		}
		
		var escenaactual = 0;
		var totalescenas = 0;
		
		ESCENASPLAY_QUESTION=[]; // inicializamos el vector de preguntas (Variable global)

		$('#ventana-dialogo').find('div.escena').each(function(){

			//alert("escena " + totalescenas)
			// Comprobamos si hay alguna referencia a alguna pregunta. Si la hay la almacenamos en ESCENAS_PLAY_QUESTION
			totalescenas++;
			numAvances++;
			//ESCENASPLAY_QUESTION[totalescenas]=null
			var attrquestion="";
			// Comprobamos si tiene alguna pregunta definida
			if ($(this).find('div.pregunta').length==1)
			{
				numAvances++;
				// Existe una pregunta definida
				$(this).find('div.pregunta').each(function(){
				
						ESCENASPLAY_QUESTION[totalescenas]=this; //alert("hola")
						attrquestion=' attrquest="'+totalescenas+'" '
				});
				// Hemos de almacenarla en algun lugar para que al finalizar el audio podamos activar la pregunta.
			}

			// Apilamos la imágen a mostrar con el dialogo
			$('#cargador-imagen-dialogo').append('<img src="contenidos/modulo01/media/'+$(this).attr("imagen")+'" imagen="'+$(this).attr("numero")+'"/>')			
		
			if (isIE8()){
			
				// En el caso de IE8 no hay soporte de etiquetas de audio, con lo cual el sonido ha de implementarse con 
				// etiquetas BGSOUND. El avance no puede controlarse con eventos de cierre, ya que bgsound no controla esto
				// por ello se avanza con un botón siguiente.
				IE8SOUNDS[totalescenas-1]="contenidos/modulo01/media/"+$(this).attr("audio")+".mp3"
			
			}
			else
			{
				
				// En el caso de que no sea IE8 utilizamos el sistema de etiquetas audio
				$("#cargador-audio-dialogo").append('<audio class="audio" pista="'+$(this).attr("numero")+'" preload="auto" '+attrquestion+'  ><source src="contenidos/modulo01/media/'+$(this).attr("audio")+'.mp3"><source src="contenidos/modulo01/media/'+$(this).attr("audio")+'.ogg"></audio>')

			}
		});
		
		
		
		// En el caso de ser un IE8 necesitamos una etiqueta bgsound para aplicar un audio y un botón de avance
		// incluimos ambas dentro del div ventana-dialogo
		if (isIE8()||isIPAD()){
			$("#ventana-dialogo").append("<bgsound src='ff'>")
			if(numAvances>1)	$("#ventana-dialogo").append("<button id='btnNextEscene' >Pulse para continuar..</button>")
			animaSiguiente("btnNextEscene")
			
		}
		
		// En el caso del ipad   mostramos boton start el cual iniciará la ejecución de la primera escena
		if (isIPAD()){
			//alert("prueba")
			$("#cuerpo").append("<button id='startScene'><span>pulse para comenzar el diálogo...</span></button>")			
			$("#startScene").css("display","block")
			$('#cargador-imagen-dialogo img[imagen="0"]').fadeIn("slow")			
			$("#startScene").click(function(){
				//alert("bu")
				playscene(0);
				$("#startScene").css("display","none")
			})
			//animaSiguiente("ventana-dialogo")
			
			
		}

		if (!isIPAD())
		{
			playscene(0);
		}
		
		
		
		
		
		
		// En el caso de que no sea IE8, controlamos que se ejecute la siguiente escena o pregunta
		// nada mas finalice el audio de la escena actual. Para otros casos esto se ha de activar por medio
		// de botones.
		if ((!isIE8())&&(!isIPAD()))
		{
			$(".audio").bind('ended', function(){
				if (escenaactual < totalescenas){				
					var siguiente = parseInt($(this).attr('pista'))+1;	
					if (($(this).attr('attrquest')!=undefined )&&($(this).attr('attrquest')!=""))
					{
						//alert(" Total escenas " + totalescenas + " siguiente " + siguiente)
						if (totalescenas==siguiente) siguiente=-1
						playscena_showquest(parseInt($(this).attr('attrquest')),siguiente,true )
					}
					else
					{
						playscene(siguiente);
						escenaactual++;
					}
				}
			});

		}

		
	}

	}
	catch(e)
	{
	alert("error "  + e)
	}
 
	
}
function animaSiguiente(strboton)
{
	$("#"+strboton).animate(
	{

    opacity: 0.5

  }, 800, function() {

			//alert("cinoketi")
			$("#"+strboton).animate(
			{

			opacity: 1 

			

		  }, 800, function() {

			animaSiguiente(strboton)

		  });
	

  });
}

function playscena_showquest(pregunta,siguienteescena,inicializa)
{
	var enunciado=""
	var respuestas=""
	var rutaimg=""
	var tmptrue=""
	enunciado=$(ESCENASPLAY_QUESTION[pregunta]).find("div.enunciado").text()
	
	$(ESCENASPLAY_QUESTION[pregunta]).find("div.respuesta").each(function(){
		
		// Comprobamos si tenemos un atribudo "correcta" con valor si o true
		tmptrue=$(this).find("div.feedback").attr("correcta")
		if ((tmptrue=="si")||(tmptrue=="SI")||(tmptrue=="true")||(tmptrue=="TRUE"))	tmptrue=true;
		else tmptrue=false
	
		respuestas=respuestas+"<li onclick='playscena_showfeedback(\""+
								$(this).find("div.feedback").text()+ "\",\"" + 
								$(this).find("div.feedback").attr("img")+ "\","+
								siguienteescena+
								","+tmptrue+
								","+pregunta+")'>"+
								$(this).find("div.texto").text()+
								"</li>"
		//respuestas=respuestas+"<li>"+$(this).find("feedback").text()+"</li>"
		//respuestas=respuestas+"<li>"+$(this).find("feedback").attr("img")+"</li>"
		
	}) 
	// Si es la primera vez, mostramos imagen, enunciado y respuestas. Caso contrario solo repintamos las respuestas
	enunciado=enunciado// + " Pregunta:" + pregunta+ " siguiente escena "+siguienteescena+ " inicializa " + inicializa
	if (inicializa==true)
	{
		
		
		$("#question_img").css("display","block");
		rutaimg="contenidos/modulo01/media/"+$(ESCENASPLAY_QUESTION[pregunta]).attr("img")+ ".png"
		$("#question_img").attr("src", rutaimg);
		//$("#question_continuar").css("display","none");
		$("#question").fadeIn("slow")
	}
	$("#question_enunciado").html(enunciado)
	// Las preguntas las mostramos siempre
	$("#question_respuestas").html(respuestas)
	
}

// ----------------------------------------------------------------------------------------------
//	txt => texto de la respuesta
//	img => imagen que aparece junto al feedback
//	esc => escena a la que debe de saltar a continuacion
//	correcta => indica si es una respuesta correcta (si no lo es, no avanza a la siguiente escena)
//  pregunta => referencia a la pregunta que está mostrando
function playscena_showfeedback(txt,img,esc, correcta, pregunta )
{
	
	var tmpfeedback
	
	tmpfeedback = "img:"+img +" esc:"+esc +" correcta:"+ correcta+" pregunta:"+ pregunta 
	//alert(tmpfeedback)
	$("#question_respuestas").html("<p>"  /*+tmpfeedback + "  "*/ + txt +  "</p>")
	$("#question_img").css("display","block");
	rutaimg="contenidos/modulo01/media/"+img+ ".png"
	$("#question_img").attr("src", rutaimg);
	//$("#question_continuar").css("display","none");
	//alert(esc + " " + img + "  " + txt)
	$("#question_continuar").css("display","block");
	
	if(correcta)	$("#question_continuar").text("Continuar");
	else			$("#question_continuar").text("Prueba otra respuesta");
	
	$("#question_continuar").unbind("click");
	$("#question_continuar").click(function(e)
		{
			
			
			//alert("correcta: " + correcta + " esc " + esc)
			$("#question_continuar").css("display","none");
			if(correcta)
			{
			
					if (isIPAD())
					{
						$("#question").fadeOut("fast")
						if (esc!=-1) playscene(esc)
						else indiceUnidad.nextPageAnim();
					}
					else
					{
						//playscene(esc);
						$("#question").fadeOut("slow",function(){ 
							if (esc!=-1) playscene(esc)
							else indiceUnidad.nextPageAnim();
							
							
							})
					}	
			}
			else
			{
				playscena_showquest(pregunta,esc,false)
			}
		})
		
	
}