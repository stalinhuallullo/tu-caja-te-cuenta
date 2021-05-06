// ========================================================================================================
//
//							FUNCIONES RELACIONADAS CON LOS RECURSOS DEL INTERFAZ
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 6/3/2012
//
// ========================================================================================================

// Carga el la zona de contenidos



function progreso()
{
	AJAX_cargarHTML(F20_CAPA_BODY,"interfaz//tema//progress.htm")
}

function tips()
{
	AJAX_cargarHTML(F20_CAPA_BODY,"interfaz//tema//tips.htm")
}

function documentacion()
{
	AJAX_cargarHTML(F20_CAPA_BODY,"contenidos//modulo01//documentacion.htm")
}

function consulta()
{
	AJAX_cargarHTML(F20_CAPA_BODY,"contenidos//modulo01//consulta.htm")
}
function ayuda()
{
	AJAX_cargarHTML(F20_CAPA_BODY,"interfaz//tema//ayuda.htm")
}

function masinfo()
{
	AJAX_cargarHTML(F20_CAPA_BODY,"contenidos//modulo01//masinfo.htm")
}

function glosario(palabra)
{	
	GLOSARY_STRING_SEARCH=palabra
	AJAX_cargarHTML(F20_CAPA_BODY,"interfaz//tema//glosario.htm");
/*	if (palabra) {
		alert("Accediendo al glosario para mostrar la definicion de " + palabra);		
		activarBuscador();
		buscar(palabra);
	}*/
	
}

function bibliografia()
{
	AJAX_cargarHTML(F20_CAPA_BODY,"interfaz//tema//bibliografia.htm")
}

function creditos()
{
	AJAX_cargarHTML(F20_CAPA_BODY,"interfaz//tema//creditos.htm")
}

function mindmap()
{
	AJAX_cargarHTML(F20_CAPA_BODY,"interfaz//tema//mindmap_container.htm")
}


function ayuda()
{
	AJAX_cargarHTML(F20_CAPA_BODY,"interfaz//tema//ayuda.htm")
}


// Carga en la zona de contenido la última página accedida
function volverToContent()
{
	indiceUnidad.loadPage(indiceUnidad.pagActual.index)
}

