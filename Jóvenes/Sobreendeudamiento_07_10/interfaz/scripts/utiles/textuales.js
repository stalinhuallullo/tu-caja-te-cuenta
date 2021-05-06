	
// FUNCIONES RELACIONADAS CON LA CARGA DE TEXTOS DE XML PARA TRADUCCIONES
//
//		Cargará un xml para el interfaz (textuales_interfaz.xml) y otro para el contenido (textuales.xml)
//
//



var TEXTUALES=[] 		// Objeto que contiene todos los textuales



// Carga una bateria de textos de un xml. ---------------------------------------------------------------
function loadTextuales(xmlTextos){

	//try
	//{
	var tmpXMLContent
	
	// Cargamos el objeto XML
	DIRBASE_url="contenidos//xml//";
	//if (msg_debug!=null) msg_debug(" <font size='1' color='darkgreen'> =========== INICIAMOS CARGA DE TEXTUALES " + DIRBASE_url +  xmlTextos + "</font>")
	tmpXMLContent=AJAX_cargaSincronaXML(DIRBASE_url+ xmlTextos);
	$(tmpXMLContent).find('txt').each(function (){
	
			//if (msg_debug!=null)  msg_debug("<font size='1' color='darkgreen'> LECTURA TEXTUAL ID[" +$(this).attr("id")+ "] TEXTO:"+	$(this).text()+"</font>");
			TEXTUALES[$(this).attr("id")]=$(this).text();
	
	})
	//if (msg_debug!=null)  msg_debug(" <font size='1' color='darkgreen'> =========== FIN CARGA TEXTUALES </font>")
	//}
	/*catch(e)
	{
		alert("Error " + e)
	}*/
}

// Devuelve un texto del xml			
function getTextual(id){
	
	if(TEXTUALES[id]==null) return  "<font color='red'>Texto Indefinido</font>"
	else return TEXTUALES[id] 
	
}

// Se cargan los textos nada mas comenzar
function textualesActualizaTittlesInterfaz()
{
	$("#botonNavegacionAnterior").attr("title",getTextual("interfaz_botonanterior"))
	$("#botonNavegacionSiguiente").attr("title",getTextual("interfaz_botonsiguiente"))
}


	loadTextuales("textuales.xml")
	loadTextuales("textuales_interfaz.xml")
