// ========================================================================================================
//
// 		FUNCIONES RELACIONADAS CON LA NAVEGACIÓN DENTRO DE UN XML
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 10/3/2011
//
// ========================================================================================================

// -------------------------------------------------------------------------------------------------------
//  Carga la información de un fichero XML de forma sincrona, es decir, el interfaz espera a que la carga 
//  se haya realizado.
//  
AJAX_cargaSincronaXML = function(file) {
var xmlvar

$.ajax({
    type: "GET",
    url: file,
    dataType: "xml",
    async: false,
    success: function(xml) {
      xmlvar = xml;
	  
	},
	error: function(e) {
      
	 
	  xmlvar=null;
	}
  });

return xmlvar;

};

// -------------------------------------------------------------------------------------------------------
//  Busqueda de un nodo dentro de un objeto xml
//  



