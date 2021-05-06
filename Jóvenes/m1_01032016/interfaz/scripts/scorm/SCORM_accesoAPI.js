// ========================================================================================================
//							
//								INTERFAZ CONTENIDO - API/LMS
//		
//	Version: 1.2 
//	
//	Descripcion: Esta libreria contiene las funciones que habilitan el acceso al API SCORM contenido
//				 en el LMS inicializando la variable API con una referencia a dicha API.
//				 
//				 Tambien define las funciones las cuales hacen uso de esta API.
//				 
//	Requisitos:  Se ha de incluir previamente el fichero "SCORM_cfg.api"  donde se declaran 
//				  las variables de configuracion SCORM
// ========================================================================================================
			
			
var SCO_API=null
// ============================================================================================
//									FUNCIONES UTILES
// ============================================================================================

// -------------------------------------------------------------------------------------------
// Esta funcion es llamada para mostrar los mensajes de debug. Se puede modificar su contenido
// para adaptar la salida por pantalla dependiendo de la modalidad de curso elegida
function alertDebug(txt)
{
	msg_debug("<font color='blue' size=2> <i>[SCORM_accesoAPI.js - DEBUG] " + txt + "</i></font><br>")

}

// -------------------------------------------------------------------------------------------
// Funcion utilizada en el caso de que alguna función tenga una excepcion de error.
function alertDebugError(e)
{
	msg_error("<font color='orange' size=2> <u>[SCORM_accesoAPI.js - ERROR Excepción] : " + e + "</i></font><br>")
}

// ********************************************************************************************
// ============================================================================================
//
//								BUSQUEDA DE API SCORM EN EL LMS
//
//		Descripcion: A continuacion se implementará el bloque destinado a detectar e inicializar 
//					 el objeto API con la interfaz del LMS
//
//					 En caso de no encontrar el API desactivará el funcionamiento SCORM.
//
//					 Se hace uso de distintas tecnicas de detección del API
//
//
// ============================================================================================
// ********************************************************************************************

// ============================================================================================
//
//		METODO 1: Scripts para busqueda de API : curso Demo ALopez
//
// ============================================================================================

function findAPI_metodo1(win)
{try{
	   
   if (win.API != null)
   {
      return win.API;
   }


   if (win.length > 0)  // does the window have frames?
   {
      for (var i=0;i<win.length;i++)
      {
         var theAPI = findAPI_metodo1(win.frames[i]);
         if (theAPI != null)
         {
            return theAPI;
         }
      }
   }
   return null;
}catch (e){	alertDebugError(e)}
}

function getAPI_metodo1()
{ try {
	
   var theAPI = findAPI_metodo1(this.top); 
    if ((theAPI == null) 
		 && (window.opener != null) 
		 && (typeof(window.opener) != "undefined"))
   {
	  theAPI = findAPI_metodo1(window.opener);
   }
  
  
   if ((theAPI == null) 
		&& (parent.opener != null) 
		&& (typeof(parent.opener) != "undefined"))
   {
	  theAPI = findAPI_metodo1(parent.opener);
   }

  
   if ((theAPI == null) 
		&& (parent.parent.opener != null) 
		&& (typeof(parent.parent.opener) != "undefined"))
   {
	  theAPI = findAPI_metodo1(parent.parent.opener);
   }

	if (typeof(this.top.opener)!= "undefined")
	{
	   
		if ((theAPI == null) 
			 && (this.top.opener.parent != null) 
			 && (typeof(this.top.opener.parent) != "undefined"))
   		{
	 		 theAPI = findAPI_metodo1(this.top.opener.parent);
   		}
   }
	if (typeof(top.opener)!= "undefined")
	{
	   		
		if ((theAPI == null) 
			 && (this.top.opener.opener != null) 
			 && (typeof(top.opener.opener) != "undefined"))
   		{
			 theAPI = findAPI_metodo1(top.opener.opener);
   		}
   }
   
   if (theAPI == null)
   {
   }

   return theAPI
} catch (e){	alertDebugError(e)}
}   

// ============================================================================================
//
//		METODO 2: Interfaz Flash Fabrica (Miguel Romero 12/04/2004)
//
// ============================================================================================

// -------------------------------------------------------------------------------------------
// findAPI_metodo2()
//
// p_oWindow	(Object) Topmost window object of the window hiearchy to search 
//				through.
// Returns		(Object) API object found in the window hierarchy.
//			    null => API object not found
//
// This function looks for an object named API in a window hierarchy.
//
function findAPI_metodo2( p_oWindow )
{try{
	// Search the window hierarchy for an object named "API"  
	// Look in the current window (p_oWindow) and recursively look in any child frames
	//alertDebug(" -- findAPI_metodo2( '" + p_oWindow.location.href + "' ) called." );
	if (p_oWindow.API != null){
		alertDebug(" -- findAPI_metodo2: Found API in this window." );
		return p_oWindow.API;
	}
	if (p_oWindow.length > 0){  // does the window have frames?
		alertDebug(" -- findAPI_metodo2:  Looking for API in window's frames." );
		for ( var i=0; i<p_oWindow.length; i++ ){
			alertDebug(" -- findAPI_metodo2:  Looking for api in frames[" + i + "]." );
			var theAPI = findAPI_metodo2( p_oWindow.frames[i] );
			if ( theAPI != null ) return theAPI;
		}
	}
	alertDebug (" -- findAPI_metodo2():  Didn't find API in this window (or in its children)." );
	return null;
}catch (e){	alertDebugError(e)}
}


// ---------------------------------------------------------------------------------------------
// getAPI_metodo2()
//
// Returns		(Object) API object found in the windows hierarchy.
//			    null => API object not found
//
// This function looks for an object named API, first in the current window's 
// hierarchy, and then, if necessary, in the current window's opener window 
// hierarchy (if there is an opener window).
//
function getAPI_metodo2()
{try{
	var oAPI;
	alertDebug(" -- getAPI_metodo2 --getAPI_metodo2() called." );
	// start at the topmost window - getAPI_metodo2 will recurse down through
	// all of the child frames
	oAPI = findAPI_metodo2( this.top );
	if ( oAPI == null )	{
		// the API wasn't found in the current window's hierarchy.  If the
		// current window has an opener (was launched by another window),
		// check the opener's window hierarchy. 
		alertDebug(" -- getAPI_metodo2 --getAPI_metodo2(): Checking to see if this window has an opener. window.opener typeof is> " + typeof(window.opener) );
		if ( typeof(this.opener) != "undefined" ){
			alertDebug( " -- getAPI_metodo2 --getAPI_metodo2(): Checking this window's opener." );
			if ( this.opener != null ){
				alertDebug( " -- getAPI_metodo2 --getAPI_metodo2(): This window's opener is NOT null - looking there." );
				oAPI = findAPI_metodo2( this.opener.top );
			} else	{
				alertDebug( " -- getAPI_metodo2 --getAPI_metodo2(): This window's opener is null." );
			}
		}
	}
	return oAPI;
}catch (e){	alertDebugError(e)}
}

// ============================================================================================
//
//		METODO 3: Ejemplo de busqueda de API utilizada en la documentacion de SCORM 1.2
//
// ============================================================================================

var findAPITries=0;

function findAPI_metodo3(win)
{try{

	while ( (win.API==null) &&
			 (win.parent!=null) &&
			 (win.parent!=win) )
	{
		findAPITries++;
		if (findAPITries>7)
		{
			alertDebug("Error buscando API, hemos excedido el nivel de profundidad de busqueda")
			return null
		}
		win=win.parent
		
	}
	return  win.API
}catch (e){	alertDebugError(e)}
}

function getAPI_metodo3()
{try{
	// Comenzamos viendo el el api esta en la ventana actual
	var theAPI= findAPI_metodo3(window)
	
	// Si no se ha encontrado el api en la ventana actual pero sin embargo detectamos que
	// la ventana ha sido abierta por otra, buscamos en el opener
	if ((theAPI==null) && 
		 (window.opener !=null) &&
		 (typeof(window.opener)!="undefined"))
	{
		// Intentamos encontrar el API en la ventana opener
		theAPI=findAPI_metodo3(window.opener)
	}

	// Si el api no se ha encontrado
	if (theAPI==null)
	{
		alertDebug("No se ha podido encontrar el API")
	}
	
	return theAPI
}catch (e){	alertDebugError(e)}
}
// ============================================================================================
//
//		METODO 4: Metodo utilizado en las exportaciones HTML-SCORM Flash
//
// ============================================================================================


 
var g_objAPI = null;
var g_nfindAPI_metodo4Tries = 0;
var g_strAPITooDeep = "Cannot find API - too deeply nested.";

function findAPI_metodo4(win) 
{try{
	while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
		g_nfindAPI_metodo4Tries ++;
		if (g_nfindAPI_metodo4Tries > 500) {
			alertDebug(g_strAPITooDeep);
			return null;
		}
		win = win.parent;
	}
	return win.API;
}catch (e){	alertDebugError(e)}
}

function getAPI_metodo4() 
{try{
 
	if ((window.parent) && (window.parent != window))
	{
			g_objAPI = findAPI_metodo4(window.parent)
	}
	if ((g_objAPI == null) && (window.opener != null))	
	{
			g_objAPI = findAPI_metodo4(window.opener)
	}

	return g_objAPI
}catch (e){	alertDebugError(e)}
}

// ============================================================================================
//
//		METODO 5: Metodo utilizado en los ejemplos del curso de Paco
//
// ============================================================================================
function findAPI_metodo5(win)
{try{
   if (win.API != null)
   {
     return win.API
   }
   else if (win.parent != null && win.parent != win)
   {
     return findAPI_metodo5( win.parent )
   }
   else if (win.opener != null)
   {
     return findAPI_metodo5( win.opener )
   }
   return null
}catch (e){	alertDebugError(e)}
}

function getAPI_metodo5(command)
{try{
	var mAPI
	mAPI = findAPI_metodo5 (window);
	
	return mAPI
}catch (e){	alertDebugError(e)}
}
// ============================================================================================
//
//		METODO 6: Metodo basico
//
// ============================================================================================
 

function findAPI_metodo6(win)
{try{
	//(alopez: el acceso denegado lo da cuando intenta acceder al 
	// win.document.api y lo encuentra  )
	//if (debug) alert("ahora");
	
	if(win.document.API!=null)
	{
		return win.document.API;
	}
	else if(win.parent==null ||win.parent==win)
	{
		return null;
	}
	else
	{
		return findAPI_metodo6(win.parent);
	}
}catch (e){	alertDebugError(e)}}
	
function getAPI_metodo6()
{try{
	//obtain the LMS API
	var mAPI
	
	mAPI = findAPI_metodo6(window);
	
	if (mAPI==null && window.opener!=null)
	  mAPI = findAPI_metodo6(window.opener);
	 
	 
	return mAPI
	
}catch (e){	alertDebugError(e)}}
// ==============================================================================================
//
//		INICIALIZACION DE API : LLAMADA A LOS METODOS ANTERIORES
//
// ==============================================================================================

function apiInit() 
{try{
	alertDebug("apiInit:  INICIAMOS LA BUSQUEDA DEL API con el metodo 1.")
	SCO_API = getAPI_metodo1();
	if (SCO_API!=null) alertDebug("apiInit:   .. API encontrada con el metodo 1.")
	else alertDebug("apiInit:   .. API no encontrada con el metodo 1.")
	
	if (SCO_API==null) 
	{
		alertDebug("apiInit:   ..  buscamos con el metodo 2.")		
		SCO_API=getAPI_metodo2()
		if (SCO_API!=null) alertDebug("apiInit:   .. API encontrada con el metodo 2.")
		else alertDebug("apiInit:   .. API no encontrada con el metodo 2.")
	}
	
	if (SCO_API==null) 
	{
		alertDebug("apiInit:   ..   buscamos con el metodo 3.")		
		SCO_API=getAPI_metodo3()
		if (SCO_API!=null) alertDebug("apiInit:   .. API encontrada con el metodo 3.")
		else alertDebug("apiInit:   .. API no encontrada con el metodo 3.")
	}	
	
	
	if (SCO_API==null) 
	{
		alertDebug("apiInit:   ..   buscamos con el metodo 4.")		
		SCO_API=getAPI_metodo4()
		if (SCO_API!=null) alertDebug("apiInit:   .. API encontrada con el metodo 4.")
		else alertDebug("apiInit:   .. API no encontrada con el metodo 4.")
	}	
	
	if (SCO_API==null) 
	{
		alertDebug("apiInit:   ..  buscamos con el metodo 5.")		
		SCO_API=getAPI_metodo5()
		if (SCO_API!=null) alertDebug("apiInit:   .. API encontrada con el metodo 5.")
		else alertDebug("apiInit:   .. API no encontrada con el metodo 5.")
	}	
	
	if (SCO_API==null) 
	{
		alertDebug("apiInit:   ..  buscamos con el metodo 6.")		
		SCO_API=getAPI_metodo6()
		if (SCO_API!=null) alertDebug("apiInit:   .. API encontrada con el metodo 6.")
		else alertDebug("apiInit:   .. API no encontrada con el metodo 6.")
	}		
	
	// Si no hemos conseguido inicializar el API desactivamos el funcionamiento SCORM
	if(SCO_API==null)
	{
	  alertDebug("apiInit:   API NO IDENTIFICADA.");
	  _SCORM_=false;
	}
}catch (e){	alertDebugError(e); _SCORM_=false;}}

	
if (_SCORM_)
{
	apiInit() 
}

// ********************************************************************************************
// ============================================================================================
//
//								FUNCIONES PARA USO DEL API
//
//		Descripcion: A continuacion se definen una serie de funciones intermedias para usar 
//					 el API del LMS.
//
//
// ============================================================================================
// ********************************************************************************************


// ---------------------------------------------------------------------------------------------
// Inicializa la sesión SCORM del SCO                                                              
function inicio()
{try{
 	var salida
	salida = SCO_API.LMSInitialize('');
	alertDebug("LMSInitialize('') : " + salida);
	return salida
	
}catch (e){	alertDebugError(e);}}


// ---------------------------------------------------------------------------------------------
// Finaliza la sesión SCORM del SCO  
function fin()
{try{
  var salida 
  salida = SCO_API.LMSFinish('');
  alertDebug("LMSFinish('') : " + salida);
  return salida

}catch (e){	alertDebugError(e);}}


// ---------------------------------------------------------------------------------------------
//      commit : Guarda todos los valores indicados en LMSSetValue cacheados 
function commit()
{try{
 	var salida
	salida = SCO_API.LMSCommit('');
	alertDebug("LMSCommit('') : " + salida);
	return salida
	
}catch (e){	alertDebugError(e);}}

// ---------------------------------------------------------------------------------------------
//     getError : Obtiene el codigo de error de la ultima operacion                                   
function getError()
{try{
	
 var salida	
 salida = SCO_API.LMSGetLastError();
 alertDebug("LMSGetLastError(): " + salida); 
 return salida

}catch (e){	alertDebugError(e);}}

// ---------------------------------------------------------------------------------------------
//      getValor : obtiene el valor de una propiedad a traves de la API
function getValor(pedir)
{try{
  var salida	
  var cadena
  
  salida = SCO_API.LMSGetValue(pedir);
  error=SCO_API.LMSGetLastError();
  errorString=SCO_API.LMSGetErrorString(error);
  
  cadena="LMSGetValue(" + pedir + ") : " + salida + "\n" + 
		 "LMSGetLastError() : " + error + " -> " + errorString; 

  alertDebug(cadena);
  
  
  return salida

}catch (e){	alertDebugError(e);}}

// ---------------------------------------------------------------------------------------------
//     putValor: escribe un valor en una propiedad a traves de la API
function putValor(prop, valor)
{try{
  var salida
  
  salida = SCO_API.LMSSetValue(prop,valor);
  alertDebug("putValor : " + prop + " ," + valor + " : resultado operación: "+ salida )
  
  if((error=SCO_API.LMSGetLastError())!="0")
  {	alertDebug("Se ha producido el siguiente error:" + SCO_API.LMSGetErrorString(error));
	return("Error:" + SCO_API.LMSGetErrorString(error));
  }
  
  
  return salida
}catch (e){	alertDebugError(e);}}
   
