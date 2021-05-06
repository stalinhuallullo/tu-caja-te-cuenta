// ========================================================================================================
//
// 		FUNCIONES RELACIONADAS CON LOS MENSAJES DEL SISTEMA
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 7/3/2011
//
// ========================================================================================================

//media='print' 
var PDFWindowActive=false;
var PDFWindow=null;

//var INI_HTMLFORM ="<form id='pdfform'  onsubmit='mifin()' action='http://localhost/moodle/blocks/dompdf/www/examples2.php' method='post'><input  type='submit' name='GetPDF' value='GetPDF'/><textarea name='html' rows='20' cols='60'>"

var INI_HTMLFORM ="<form id='pdfform'  onsubmit='mifin()' action='http://fyd.ingenia.es/dompdf/www/examples2.php' method='post'>Pulse en la siguiente opción para obtener la versión en pdf : <input  type='submit' name='Obtener PDF' value='Obtener PDF'/><textarea style='display:none' name='html' rows='20' cols='60'>"

	var iniHTML="<html><head><link rel='stylesheet' type='text/css' href='interfaz/tema/css/print.css'  />"
	iniHTML=iniHTML + "<meta http-equiv='Content-Type' content='text/html; charset=utf-8' /></head><body> "
	iniHTML=iniHTML + ""

	iniHTML=iniHTML + "<script charset='UTF-8' type='text/javascript' src='interfaz/scripts/lib/jquery.min.js' ></script> "
	iniHTML=iniHTML + "<script charset='UTF-8' type='text/javascript' src='interfaz/scripts/lib/jquery-ui.min.js' language='javascript'></script>"


	
	iniHTML=iniHTML + "<div id='fab20_body'>"

	var finHTML="</div>"	

	finHTML=finHTML + "<script charset='UTF-8' type='text/javascript' src='interfaz/scripts/cfg/cfg.js' ></script> "
	finHTML=finHTML + "<script charset='UTF-8' type='text/javascript' src='interfaz/scripts/lib/ajax_fab20lib.js' > </script> "
	finHTML=finHTML + "<script charset='UTF-8' type='text/javascript' src='interfaz/scripts/lib/xml_ajax_fab20.js' > </script> "






	finHTML=finHTML + "<script type='text/javascript' src='interfaz/scripts/componentes/htmltest/cuestionariotest.js'></script>"                        
	finHTML=finHTML + "<script type='text/javascript' src='interfaz/scripts/componentes/htmltest/html_test.js'></script>"
	finHTML=finHTML + "<script type='text/javascript' src='interfaz/scripts/utiles/aleatorio.js'></script>"  
	finHTML=finHTML + "<script type='text/javascript' src='interfaz/scripts/componentes/htmltest/activaejercicios.js'></script>"  
	//finHTML=finHTML + "<script > alert('finnnn')</script>"  		
	finHTML=finHTML + "</body></html>"

	


/* var FIN_HTMLFORM ="</textarea> <script> pdfform.submit();</script></form>"*/
var FIN_HTMLFORM ="</textarea> </form>"

var PDF_OpenString="height=700,width=1024,left=1,top=1,resizable=yes,scrollbars=yes,toolbar=yes,status=yes"




function convertirRutasToAbsolutas(str)
{
	var resultado=""
		// Obtenemos la ruta absoluta
		var midomain=window.location + "dsfdsf"
		midomain=midomain.split("interfaz.htm")[0]

		var resultado=str.split("href='").join("href='"+ midomain)
		var resultado=resultado.split("src=\"").join("src=\""+ midomain)
		
		return resultado	
}

// Abre una ventana emergente en la cual se voltar� toda la informaci�n html del curso
function activarPDFWindow(contenido)

{	//document.write("Estamos en shoWindow del objeto<br>")
	var esAbierta=false

	
	if(PDFWindow==null)
	{
		//document.write("abrimos la ventana<br>")
		PDFWindow=open('about:blank',"PDF", PDF_OpenString) 
		//PDFWindow.document.write(INI_HTMLFORM +    convertirRutasToAbsolutas(iniHTML +contenido + finHTML )+  FIN_HTMLFORM +iniHTML +contenido + finHTML )
		PDFWindow.document.write("<a class='btn_imprimir' href='javascript:window.print(); void 0;'>Imprimir</a>" + iniHTML + contenido + finHTML )
		
		PDFWindowActive=true
	}
	else
	{ 
		if (PDFWindow.closed ==true)
		{
			PDFWindow=null
			PDFWindow=open('about:blank',"PDF",  PDF_OpenString) 
			//PDFWindow.document.write(INI_HTMLFORM +  convertirRutasToAbsolutas(iniHTML +contenido+ finHTML)  + FIN_HTMLFORM+ iniHTML +contenido + finHTML)
			PDFWindow.document.write( iniHTML +contenido + finHTML)
			PDFWindowActive=true
		}
		else
		{
			PDFWindow.focus()
		}
	
	}
	return esAbierta

}


/*
function activarInfWindow()
{
	if (!infWindowActive)
	{
		infWindowActive=true;
		// Activamos la ventana y mostramos siempre la salida de debug por ella
		debugWindow= new infWindow("Debug")
		debugWindow.showWindow()
		msg_actualizaDebugWindow(sysmsg_debug)
	}
	else 
	{
		infWindowActive=false
		debugWindow=null
		// Ponemos la variable a false  
	}
}
function msg_actualizaDebugWindow(nuevalinea)
{
	if (infWindowActive)
	{   
		
		if (debugWindow!=null)
		{
			//debugWindow.clear()
			debugWindow.writeInf(nuevalinea )
		}
	}
}

// --------------------------------------------------------------------------------------------------------
// Esta funcion gestiona un mensaje de error
function msg_error(msg)
{

	
	//alert("error:: " +  msg )
	var nuevalinea="<li><font color='red'>" + "["+ msg_getFechaHora() +"]" +msg + "</font> </li>"
	sysmsg_debug=sysmsg_error + nuevalinea
	
	msg_actualizaDebugWindow(nuevalinea)
	msg_actualizaPanelDebug()
}

// --------------------------------------------------------------------------------------------------------
// Esta funcion gestiona un mensaje de debug
function msg_debug(msg)
{
	//alert("debug:: " +  msg )
	var nuevalinea="<li>" + "["+ msg_getFechaHora() +"]" + msg + " </li>"
	sysmsg_debug=sysmsg_debug + nuevalinea
	//sysmsg_debug=sysmsg_debug + "<li> [" + getDate() + " - " + getTime() + "]" + msg + " </li>"
	msg_actualizaDebugWindow(nuevalinea)
	msg_actualizaPanelDebug()
}

// --------------------------------------------------------------------------------------------------------
// Actualiza la informaci�n del panel de debug
function msg_actualizaPanelDebug()
{
//	AJAX_cargarHTMLContent("#fab20_debug", "<button onclick='msg_ocultarVentanaDebug()'>Ocultar</button><button onclick='indiceUnidad.getSerializeContentAccess()'>Serializar</button><div width='100%' height='350px' style='overflow:scroll;height:380px'><h3> Mensajes error </h3>" + sysmsg_error + "<h3> Mensajes debug </h3>" +  sysmsg_debug + "</div>")
	//AJAX_cargarHTML("#fab20_debug","interfaz//tema//debugWindow.htm")
}

// --------------------------------------------------------------------------------------------------------
// Muestra en el panel la informaci�n de debug
function msg_showDebugInPanel()
{
	//alert("sdfsdf")

	AJAX_cargarHTMLContent("#fab20_debug_info", "<h3> Mensajes debug </h3>" +  sysmsg_debug )
}
// --------------------------------------------------------------------------------------------------------
// Muestra en el panel la informaci�n del xml de la unidad
function msg_showXMLInPanel()
{
	 
	AJAX_cargarXMLenDIV("#fab20_debug_info",indiceUnidad.xmlURL)
}
// --------------------------------------------------------------------------------------------------------
// Oculta el panel de debug
function msg_ocultarVentanaDebug()
{
	//alert("sss")
	//alert($("#fab20_debug"))
	//document.getElementById("#fab20_debug").style.visibility = "visible";
 
	 $(F20_CAPA_DEBUG).css("visibility",  "hidden");
}
// --------------------------------------------------------------------------------------------------------
// Muestra el panel de debug
function msg_mostrarVentanaDebug()
{
	//alert("sss")

	//document.getElementById("#fab20_debug").style.visibility = "visible";
	//document.getElementById("fab20_debug").style.visibility = "visible";
	 $(F20_CAPA_DEBUG).css("visibility", "visible");

	AJAX_cargarHTML(F20_CAPA_DEBUG,"interfaz//tema//debugWindow.htm")
	msg_showDebugInPanel()

		//document.getElementById(F20_CAPA_DEBUG).drag();
}
// --------------------------------------------------------------------------------------------------------
// Obtiene fecha y hora actual
function msg_getFechaHora()
{
	var currentDate = new Date()
  var day = currentDate.getDate()
  var month = currentDate.getMonth()
  var year = currentDate.getFullYear()

  
   var currentTime = new Date()
  var hours = currentTime.getHours()
  var minutes = currentTime.getMinutes()
  var seconds = currentTime.getSeconds()  

  if (minutes < 10)
  minutes = "0" + minutes
  return "<b>" + day + "/" + month + "/" + year + "</b>&nbsp; <u>" + hours + ":" + minutes + ":" + seconds +  "   " + "</u>"

  

}
*/