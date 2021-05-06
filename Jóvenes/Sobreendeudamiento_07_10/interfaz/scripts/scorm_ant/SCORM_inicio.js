// ========================================================================================================
//
// 		SCRIPT de ejecución para la inicialización de las variables scorm
//
//
//		REQUISITOS: importar antes el js SCORM_accesoAPI.js
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 08/3/2012
//
// ========================================================================================================


function estaSoportado(grupo,parametro)
{
	var soportados
	
	soportados=getValor(grupo + "._children")
	
	if (soportados=="") return false
	else 
	{
		if (soportados.indexOf(parametro) >=0) return true
		else return false
	}
}

// Lectura de valores generales
var SCORM_estado=""
var SCORM_puntuacion=0
var SCORM_tiempo=""
var SCORM_suspendata=""
var SCORM_ultimoAcceso=""
var SCORM_estadoUnidad=""
var SCORM_estadoEjercicios=""
var SCORM_tiempoSesion=null
var listaValores=null  // TAD para almacenar variables en el suspendata
listaValores=new TADVARS();
if (_SCORM_)  // La activación de SCORM depende del valor true de esta variable
{
	 
	 msg_debug(" [SCORM_inicio] Inicializacion de scorm")
	// Con esta función iniciamos el api
	inicio();

	SCORM_estado= getValor("cmi.core.lesson_status")
    SCORM_puntuacion=getValor("cmi.core.score.raw")
	SCORM_tiempo=getValor("cmi.core.total_time")
    SCORM_suspendata= getValor("cmi.suspend_data")
    SCORM_ultimoAcceso=getValor("cmi.core.lesson_location")
	//SCORM_suspendata= "::nulo::nulo::nombre|valor]nombre2|valor2"	
	
	//  listaValores => es el objeto el cual contendrá una lista de variables definidos en tiempo de ejecución. Los valores
	//  son almacenados en suspendata para su posterior recuperación.
	
	

	
	listaValores.loadFromSTR(SCORM_getEstadoVariables())
	
	

	// Asignamos valores a las variables a modo de prueba.
    //SCORM_suspendata= "['C',1,1,['-',1,1,['-',1,1,0],0,['-',0,0,0]],[1,0,1,0],0]"
	//SCORM_suspendata= "['C',1,1,['-',1,1,['-',0,0,0],0,['-',0,0,0]],[0,0,0,0],0]::::::"
    //SCORM_ultimoAcceso="3_1"
	
	// Mostramos en el debug la información que habia almacenado en el sistema de la sesion
	// anterior
	msg_debug("[SCORM_inicio] Estado curso: " + SCORM_estado)
	msg_debug("[SCORM_inicio] Puntuacion: " +SCORM_puntuacion )
	msg_debug("[SCORM_inicio] Tiempo:  " +SCORM_tiempo )
	msg_debug("[SCORM_inicio] Suspendata: " +SCORM_suspendata)
	msg_debug("[SCORM_inicio] Ultimo Acceso: " +SCORM_ultimoAcceso)
	
	// Inicializamos el tiempo de sesion
	SCORM_tiempoSesion=new TimeInterval("0:0:0.0");
	msg_debug("Concluida Inicializacion de scorm ")
	_SCORM_RTM_INICIALIZADO=true
}

function SCORM_getSuspendataString()
{  	
	var separador="::"
	var strEstadoUnidad="nulo"
	var strEstadoEjercicios="nulo"
	var strObjetivos="nulo"
	var strVariables="nulo"
	
	if(indiceUnidad!=null)
	{
		 strEstadoUnidad= indiceUnidad.getSerializeContentAccess();
	}
	
	if(listaValores!=null)
	{
		 strVariables= listaValores.getSerializeContentAccess();
	}
	//alert(strEstadoUnidad + separador + strEstadoEjercicios + separador + strObjetivos + separador + strVariables);
	return 	strEstadoUnidad + separador + strEstadoEjercicios + separador + strObjetivos + separador + strVariables

	
}

//if(indiceUnidad!=null)
//{
//		indiceUnidad.getSerializeContentAccess();
//}

function SCORM_getEstadoIndice()
{

	var strEstadoUnidad=""
	
	if ((_SCORM_)&&(_SCORM_RTM_INICIALIZADO))  
	{
		strEstadoUnidad=SCORM_suspendata.split("::")[0]
	}

	return strEstadoUnidad
	
}
//SCORM_getEstadoIndice()

function SCORM_getEstadoVariables()
{

	//alert("CORM_getEstadoVariables() " + SCORM_suspendata + " " + SCORM_suspendata.split("::").length + " " + SCORM_suspendata.split("::")  )
	var strEstadoVariables=""
	
		strEstadoVariables=SCORM_suspendata.split("::")[3]
	

	return strEstadoVariables
	
}


// Se encarga de acceder a la última página que se accedió
function SCORM_accederUltimaPaginaAccedida()
{
	 // Aqui accedemos a la última posición
	 if(SCORM_ultimoAcceso!="")
	 {
		 indiceUnidad.loadPage(SCORM_ultimoAcceso)
		 msg_debug("[SCORM_inicio] : Última pagina recuperada de : " + SCORM_ultimoAcceso )
	 }
	else
	{
		msg_debug("[SCORM_inicio] : No se recuperó la última posición de SCORM, por tanto se accede a la página 1_1")
		indiceUnidad.firstPage()
	}

}


  /* if ((SCORM_suspendata!=null)&&(SCORM_suspendata!="")&&(SCORM_suspendata!=" "))
   {
			try
				{
				msg_debug("---- Momento justo antes de TRADUCIR EL SUSPEND DATA")
				scorm_data.importar(tmp_suspendata)
				msg_debug("---- Momento justo despues de TRADUCIR EL SUSPEND DATA")
				}
				catch(e)
				{
					msg_debug("==> ERROR!!no se ha podido traducir la información de suspendata")
					

				}

	}*/

	// Iniciamos el tiempo de sesion

	//alert("Scorm inicializado")
	 
	
 // fin del if (_SCORM_) 