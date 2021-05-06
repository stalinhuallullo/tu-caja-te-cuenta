// ========================================================================================================
//
// 		FUNCIONES RELACIONADAS CON LA ACTUALIZACIÓN DEL INTERFAZ AL CARGAR PÁGINAS
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 18/3/2011
//
// ========================================================================================================


// ---------------------------------------------------------------------------------------------------------
//
// Esta función es llamada desde el interfaz cada vez que se avanza o recarga alguna página de contenido
// Es util para indicar que elementos del interfaz han de refrescarse. Por ejemplo:
//
//		- Indice de paginas (1/20) ...
//		- Rastro de migas
//		- Actualización del menu
//
// De esta forma, dependiendo del tema podemos controlar que elementos se actualizan y en que capas se encuentran.
//
function JSTHEME_refresh()
{
	
	try {
	destroyPractica()  // Destruye la posible práctica guiada que esté activada.
	}
	catch (e) {
	}	
	
		// Habilitamos o deshabilitamos los botones siguiente anterior dependiendo de si estámos en la primera o última página
	if (indiceUnidad.pagActual == null){
	}
	else{
	/*
		if (indiceUnidad.pagActual.numpagina==1)
		{
			//alert("Primera página")
			//$(".navanterior").css("display","none");
			$(".navanterior").addClass('inactivo');
		}
		else
		{
			//$(".navanterior").css("display","block");		
			$(".navanterior").removeClass('inactivo');
		}
		if(indiceUnidad.pagActual.numpagina==indiceUnidad.numPages())
		{
			//alert("Primera página")
			$(".navsiguiente").addClass('inactivo');;
		}
		else
		{
			$(".navsiguiente").removeClass('inactivo');
		}
	*/
		//alert("refrescamos")	
		// Actualiza la información del numPaginas y TotalPages en la capa #fab20_paginador	
		$(F20_CAPA_PAGINADOR).html("<p>" + indiceUnidad.pagActual.numpagina+ "/"+indiceUnidad.numPages()+ "</p>")
		var porcentaje = indiceUnidad.pagActual.numpagina * 100 / indiceUnidad.numPages();
		$('#progressbar').css('width', porcentaje + '%')
		// Actualiza el rastro de migas en la capa #fab20_rastromigas
		$(F20_CAPA_RASTROMIGAS).html(indiceUnidad.getRastroMigas())
	}
	

	$(F20_CAPA_TITULOPAGINA).html(indiceUnidad.getHeaderTittle())
	
// ========================================================================================================
// DEFINICION DE RECURSOS QUE SE IMPLEMENTARAN 
// definiremos los recursos que se utilizaran en el contenido, simplemente asignando true o false a las
// diferentes variables
// ========================================================================================================

	 
}
	
	/* BUTTONS */
	var HAS_EXIT = true;
	var HAS_AUDIOTEXT = false;
	var HAS_HOME = false;
	var HAS_PROGRESS = true;
	var HAS_MINDMAP = false;
	var HAS_PRINT = false;
	var HAS_TIPS = false;
	var HAS_ayuda = true;
	var HAS_documentacion = false;
	var HAS_consulta = false;
	var HAS_masinfo = false;
	var HAS_GLOSSARY = false;
	var HAS_BIBLIOG = false;
	var HAS_CREDITS = false;
	var HAS_RETOS = false;
	var TIP_RETOS = 'exacto'; //{acumulable,exacto};
	var NUM_RETOS = 5;
	
	/* PLUGINS */
	var INCLUDE_MONITOR = false;
	var INCLUDE_PROYECTOR = false;
	var INCLUDE_TABLET = false;
	var INCLUDE_IMAGINA = false;
	
	

