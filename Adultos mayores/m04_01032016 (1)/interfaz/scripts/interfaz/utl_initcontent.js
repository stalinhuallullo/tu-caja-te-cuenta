// ========================================================================================================
//
// 		FUNCIONES VARIAS 
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 7/3/2011
//
// ========================================================================================================

// Indica si utilizamos el Launcher para iniciar el contenido
var CFGLauncher=false;   // con el valor falso no utiliza el launcher, si no que abre el contenido directamente en el navegador.


// --------------------------------------------------------------------------------------------------------
// Esta funcion nos devuelve el valor de una variable obtenida mediante parámetros
function getURLParams(name)
{	var v,resultado,i,v2
	resultado=""
	if (location.search.split("?").length ==2)
	{
		v=location.search.split("?")[1].split("&")
		for (i=0;i<v.length;i++)
		{
			v2=v[i].split("=")
			if (v2.length==2)
			{
				if (v2[0]==name) resultado=v2[1]
				
			}
			
		}
	}
	return resultado
}

// --------------------------------------------------------------------------------------------------------
// Abre la página indicada con unas propiedades fijas.
function abrircurso(pagina) {
window.open(pagina, '', 'width=1024,height=768,titlebar=0,toolbar=1,location=1,directories=0,status=1,menubar=0,scrollbars=1,fullscreen=0,resizable=1,screenX=0,screenY=0,top=0,left=0');
}