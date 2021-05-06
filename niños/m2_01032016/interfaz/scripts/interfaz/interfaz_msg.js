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

var sysmsg_error=""

var sysmsg_debug=""

var infWindowActive=false;
var debugWindow=null;

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
// Actualiza la información del panel de debug
function msg_actualizaPanelDebug()
{
//	AJAX_cargarHTMLContent("#fab20_debug", "<button onclick='msg_ocultarVentanaDebug()'>Ocultar</button><button onclick='indiceUnidad.getSerializeContentAccess()'>Serializar</button><div width='100%' height='350px' style='overflow:scroll;height:380px'><h3> Mensajes error </h3>" + sysmsg_error + "<h3> Mensajes debug </h3>" +  sysmsg_debug + "</div>")
	//AJAX_cargarHTML("#fab20_debug","interfaz//tema//debugWindow.htm")
}

// --------------------------------------------------------------------------------------------------------
// Muestra en el panel la información de debug
function msg_showDebugInPanel()
{
	//alert("sdfsdf")

	AJAX_cargarHTMLContent("#fab20_debug_info", "<h3> Mensajes debug </h3>" +  sysmsg_debug )
}
// --------------------------------------------------------------------------------------------------------
// Muestra en el panel la información del xml de la unidad
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