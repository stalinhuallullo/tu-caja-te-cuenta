// ========================================================================================================
//
// 		SCRIPT INICIO DE CONTENIDO EN EL INTERFAZ
//
//		Identifica 
//
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 7/3/2011
//
// ========================================================================================================



var indiceUnidad=null  // Objeto Global que contiene el indice xml
//alert("Incluimos inico de interfaz")

/**
 * Función que se ejecuta al cargar la página por primera vez.
 */
$(document).ready(function() {
	
 
	// Cargamos biblioteca de sonidos
	SOUND_FX= new FAB20SOUNDFX()
	SOUND_FX.init()
	SOUND_FX.load("sonidosfx.xml")
	
	textualesActualizaTittlesInterfaz()  // Actualizamos algunos tittles del interfaz con los textos definidos en textuales_interfaz.html
	// Definimos la ruta del XML que incluye la configuración del módulo
	unidadXML_url="contenidos//xml//indice_" + getURLParams("SCO") + ".xml"

	 
	 // Cargamos configuración en objeto indiceUnidad	 
	 indiceUnidad= new INDEX_OBJECT(unidadXML_url)
	 indiceUnidad.onStatusChange=function()
	 	{
			// Asignamos la funcionalidad al evento onStatusChange
			
			//alert("actualizomenu")
			//AJAX_setHTML(F20_CAPA_MENU,indiceUnidad.getMenuHTML())
			
			//var mnuElementActual=indiceUnidad.getMenuActualElement()
			
			//mnuElementActual.parents().children(F20_CAPA_MENU + " ul").each(function(){
												
				//								alert(this.id)
					//							
						//						}) 	 		
			
			actualizaMenu(indiceUnidad,F20_CAPA_MENU);
			//altomenu();
			//mCustomScrollbars();
			
		}	
		
	 indiceUnidad.init()

		// Cargamos el bloque HEADER y FOOTER
	AJAX_cargarHTMLFiltro(F20_CAPA_HEADER, "interfaz//tema//header.htm","","interfaz//tema//")
	AJAX_cargarHTMLFiltro(F20_CAPA_FOOTER, "interfaz//tema//footer.htm","","interfaz//tema//")
	AJAX_cargarHTMLFiltro(F20_CAPA_TASKBAR,"interfaz//tema//taskbar.htm","","interfaz//tema//")



	//AJAX_setHTML(F20_CAPA_MENU,"<textarea>" + indiceUnidad.getMenuHTML()+"</textarea>") 
	AJAX_setHTML(F20_CAPA_MENU, indiceUnidad.getMenuHTML() ) 
	actualizaMenu(indiceUnidad,F20_CAPA_MENU)

				
	 //alert(indiceUnidad.getMenuHTML())
	 // actualizamos el estado de las páginas con el valor del suspendata
	 if (SCORM_getEstadoIndice()!="")
	 {
		 msg_debug("[SCRIPT_init_interfaz] : Actualizamos el indice con: " + SCORM_getEstadoIndice())
		 indiceUnidad.setSerializeContentAccess(SCORM_getEstadoIndice())
		  indiceUnidad.onStatusChange()
	
	 }
	 else { msg_debug("[SCRIPT_init_interfaz] : Indice no recuperado de SCORM")}



// ============= Asignamos eventos touch a capa de contenido ===========================================
	//activarInfWindow() // Activamos la ventana de ayuda
	//'hold tap swipe doubletap transformstart transform transformend dragstart drag dragend swipe release
	//alert("Asignamos eventos a " + F20_CAPA_BODY)	
	/*
	var hammertime = Hammer($("#cuerpo"), {
        drag: false,
        transform: false
    });*/
	
	$("#cuerpo").on('swipe', 		
	function (event) {
			//console.log(this, event);
	        drag:false;
			transform:false;
			   //msg_debug(" BODY Type: " + event.type + ", Fingers: " + event.touches.length + ", Direction: " + event.direction +				 "<br/>");
            
			//
			//if ((event.type=="dragend")||(event.type=="swipe"))
			if (event.type=="swipe")
			{

				//alert(" BODY Type: " + event.type + ",Direction: " + event.direction +	 "<br/>")
				if (event.direction=="right")
				{
					
					event.preventDefault();
					 indiceUnidad.previousPageAnim();
					//alert("Pagina Anterior")
				/*	$('#cuerpo').fadeOut('slow', function() {        
														  
						  indiceUnidad.previousPage();
						$("#cuerpo").fadeIn();

														  
														  });

					*/					
					
				}
				else if(event.direction=="left")
				{
					
					event.stopPropagation();
					event.preventDefault();
					indiceUnidad.nextPageAnim();
					/*
						$('#cuerpo').fadeOut('slow', function() {        
						  indiceUnidad.nextPage();
						$("#cuerpo").fadeIn();

														  
														  });
*/
/* $("#cuerpo").fadeOut();
					
					indiceUnidad.nextPage();
					$("#cuerpo").fadeIn();
					//alert("Siguiente página")*/
				}
			}
			
			//if(event.type=="swipe")
//			{
				//event.preventDefault();
				//alert(" BODY Type: " + event.type + ",Direction: " + event.direction +	 "<br/>")
	//		}
			
			
			}
			); 
	
	
	
	//alert("Eventos asignados a " + F20_CAPA_BODY)

// ============= Asignamos eventos touch a capa de contenido ===========================================



	// Dependiendo de si se ha activado la portada el inicio del interfaz funcionará de la siguiente forma:
	//
	//
	//		=> portada activada => se cargará la portada definida en "interfaz//tema//portada.htm" . Desde ella se debe de 
	//			programar el acceso a la ultima página accedida
	//
	//		=> portada desactivada => se cargará la primera página de contenido.
	//

	if (indiceUnidad.portadaActivada()) 
	{
		//alert("portada activa")
		msg_debug("[SCRIPT_init_interfaz] : Hay portada activada, con lo cual mostramos interfaz//tema//portada.htm ")		
		AJAX_cargarHTMLFiltro(F20_CAPA_BODY,"contenidos//" + indiceUnidad.getSRCPortada() + ".htm","","contenidos//")

		indiceUnidad.onStatusChange()
		JSTHEME_refresh()
			
	}
	else 
	{

		msg_debug("[SCRIPT_init_interfaz] : No hay portada activada, con lo cual inicializamos la primera página de contenidos")
		indiceUnidad.firstPage()
		indiceUnidad.onStatusChange()
		JSTHEME_refresh()
		//alert("portada no activa")

	}
	
	
	
	 //alert(indiceUnidad.numPages())
	 

	
	
	//cargarPagina("m01_0001_presentacion.htm")

	
/*
	
	unidadXML=AJAX_cargaSincronaXML(unidadXML_url)
	if(unidadXML==null)		 msg_error("No se localiza el documento xml " + unidadXML_url)
	else				 	msg_debug("Documento xml cargado " + unidadXML_url) 
	
	// Cargamos los cuerpos del index
	
	
	var titulo;
	var url;
*/
	// DE ESTA FORMA SE ACCEDE A LOS ATRIBUTOS Y A LOS CONTENIDOS 
    


  // Se itera sobre todos los elementos <tema> y se obtiene el nombre y la URL
  //$(unidadXML).find('pagina').each(function() {
   
   // msg_debug( this.nodeName)   => nos da el nombre del nodo
   // id = $(this).attr('id');    => nos da el nombre de un atributo
    //titulo = $(this).find('titulo').text();   /=> en teoria nos da el contenido
	
	   
//  	var unidad=	$(unidadXML).children()
//	unidad.children().each(function() {  
    // msg_debug( $(this).attr('titulo'))
//	 msg_debug( this.nodeName)
	  
    
//  });

	// msg_debug("Prueba")

	// Creamos un objeto Index_Object para contener el indice de la unidad definodo en el xml
	
	

	
});

	


 