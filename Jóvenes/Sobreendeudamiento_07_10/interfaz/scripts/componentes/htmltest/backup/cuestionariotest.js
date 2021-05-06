
//alert("cuestionariotest.js")

// Objeto Cuestionario ==================================================================================================================================

F20_setHTML = function(capa, htmlinf) {
	alert("llamada a la funcion setHTML " + capa + "  " +htmlinf )
	$(capa).html(filtroRutaImagenes(htmlinf, "",""));

}


function F20_CUESTIONARIO()
{
	// RutaBase de los xml 
	this.XMLDIRBASE="contenidos/xml/xmltest/"
	
	// Contadores de puntuación
	this.totalCorrectas=0;
	this.totalIncorrectas=0;
	this.totalRespondidas=0;
	
	this.INTENTOS_BASE=1;
	
	this.FEEDBACK_POSITIVO="Muy bien, has acertado la pregunta."
	this.FEEDBACK_NEGATIVO="Lo siento, no es la respuesta correcta."
	
	
	// Accesos directos a objetos XML
	this.xmlObj=null;
	this.xmlURL="";
	this.preguntaActual;
	this.numPreguntaActual;
	this.preguntas;
	this.configuracion;
	
	
	// Valores de configuracion
	this.CFG_Aleatorio=0    // Si el valor es superior a 0 el ejercicio mostrará x preguntas aleatorias del total
	this.CFG_modo=""
	
	// Funciones de inicialización
	this.init=_init_F20_CUESTIONARIO;	// Carga del xml


	// Funciones de navegación 

	this.getNumPreguntas=function() { return  this.preguntas.length; }  		// Nos indica el número de preguntas
	this.getNumPreguntaActual=function () { return this.numPreguntaActual+1;}   // Nos indica el índice de la pregunta actual
	this.siguientePregunta=_siguientePregunta_F20_CUESTIONARIO;					// Apunta a la siguiente pregunta												
	this.anteriorPregunta=_anteriorPregunta_F20_CUESTIONARIO;					// Apunta a la siguiente pregunta												

	// Devuelve el array con el enunciado
	this.getEnunciado=function () { return $(this.preguntas[this.numPreguntaActual]).find("enunciado").text() }
	// Devuelve las respuestas de la pregunta actual
	this.getRespuestas=function() { return $(this.preguntas[this.numPreguntaActual]).find("respuestas").children() }

	this.getPreguntaAttr=function(atributo) { return $(this.preguntas[this.numPreguntaActual]).attr(atributo);}
	this.getPreguntaFeedback=function() { return $(this.preguntas[this.numPreguntaActual]).attr("feedback");}
	this.getPreguntaFeedbackNegativo=function() { return $(this.preguntas[this.numPreguntaActual]).attr("feedback_negativo");}
	this.getPreguntaTipo=function() { return this.getPreguntaAttr("tipo")}
	this.getPreguntaCod=function() { return this.getPreguntaAttr("cod")}	
	this.getNumRespuestas=function() { return this.getRespuestas().length};
	this.getRespuesta=function(n) {return $(this.getRespuestas()[n]).text() };
	this.getRespuestaAttr=function(n,att) {return $(this.getRespuestas()[n]).attr(att) };
	this.getRespuestaCorrecta=function(n) {return this.getRespuestaAttr(n,"correcta")=="Verdadero" };
	this.getRespuestaFeedback=function(n) {return this.getRespuestaAttr(n,"feedback") };	
	
	
	
	this.isRespuestaCorrecta=function(n) {return this.getRespuestaCorrecta(n)=="Verdadero"};
	this.getFeedbackRespuesta;
	
	this.esUltimaPregunta=function() { return this.getNumPreguntaActual()==this.getNumPreguntas()}
	this.goToPregunta=function (n) { this.numPreguntaActual=0; this.preguntaActual=this.preguntas[this.numPreguntaActual] }
}



// Funcion que inicializa el objeto .........................................................................................................................
//	Le indicamos el XML de carga 
//
//	CFG_modo	=> puede ser "" o undefined, con lo cual hacemos lo configurado en el cuestionario
//				=> puede ser "1"   o "1,2,6,7"  significa que estamos indicando que preguntas se van a ver en el componente.
//
_init_F20_CUESTIONARIO= function (xml,cfgpregunta)
{
	var auxContenido=null;
	//alert("_init_F20_CUESTIONARIO  " +xml + "  " + cfgpregunta ) 

	// Cargamos el objeto XML
	this.xmlURL=this.XMLDIRBASE+xml;
	//alert("_init_F20_CUESTIONARIO  " +this.xmlURL + "  " + cfgpregunta ) 

	try{
	this.xmlObj=AJAX_cargaSincronaXML(this.xmlURL);
	}catch (e)
	{
			alert("Error en la carga del XML del ejercicio ["+this.XMLDIRBASE+this.xmlURL+"]"); 
			//Result[  " + this.xmlObj + "] : " + e.toString())
	}

	//alert("xmlCargado " +  this.xmlObj)
	// Accedemos a configuración
	this.configuracion=$(this.xmlObj).find('configuracion');
	
	// Comprobamos si existen valores aleatorios.
	this.CFG_Aleatorio=$(this.xmlObj).find('aleatorias').attr("num");
	if  (this.CFG_Aleatorio==undefined) this.CFG_Aleatorio=0;
	//alert(this.CFG_Aleatorio)	
	
	// Dependiendo del valor de CFGPregunta utilizamos una configuración u otra
	this.CFG_modo=cfgpregunta
	if((this.CFG_modo=="")||(this.CFG_modo==undefined))
	{
		//alert("El modo  '" + this.CFG_modo + "' es undefined o vacio")

		// como no le hemos indicado nada desde CFG_modo utilizamos la configuración del cuestionario

			if(this.CFG_Aleatorio>0) 
			{
				// CUESTIONARIO ALEATORIO
						
				this.preguntas=_initPreguntasAleatorias_F20_CUESTIONARIO(this.preguntas,$(this.xmlObj).find('preguntas').children(),this.CFG_Aleatorio)
				//alert(" Tras funcion " + this.preguntas)
				this.numPreguntaActual=0;
				this.preguntaActual=this.preguntas[0];
		
				
			}
			else
			{
				// CUESTIONARIO NORMAL
				this.preguntas=$(this.xmlObj).find('preguntas').children();	
				this.preguntaActual=this.preguntas[0];
				this.numPreguntaActual=0;
		
			}
	}
	else
	{
			//alert("El modo  '" + this.CFG_modo + "' tiene algun valor")
			this.preguntas=_initCuestionarioModoCFG_F20_CUESTIONARIO(this.preguntas,$(this.xmlObj).find('preguntas').children(),this.CFG_modo)
				//alert(" Tras funcion " + this.preguntas)
			this.numPreguntaActual=0;
			this.preguntaActual=this.preguntas[0];
	
	}

	//var cont
	//var strAux=""
	//alert(this.getNumPreguntas())
	//for(cont=0;cont<=this.getNumPreguntas();cont++)
	//{
		//alert(cont)
		//alert($(this.preguntas[cont]).find("enunciado"))
		//strAux=strAux + cont + " " +  $(this.preguntas[cont]).find("enunciado").text() //+ this.getEnunciado()
	//}
	//alert(strAux)

	//.attr("ruta");
	//.children()
	//.children()[cont]

}
// Funcion auxiliar para cnofigurar el vector de preguntas en base a una configuracion de tipo "1"   "1,2,3,4"  "9,5,6,7"
// es decir, indicamos una lista con las preguntas que se van a mostrar.
_initCuestionarioModoCFG_F20_CUESTIONARIO=function (vPreguntas, BancoPreguntas, CFG_modo)
{
	var seleccionadas=CFG_modo.split(",")
	var cont
	
	vPreguntas=Array(seleccionadas.length)
	
	for(cont=0;cont<seleccionadas.length;cont++)
	{
		vPreguntas[cont]=BancoPreguntas[parseInt(seleccionadas[cont])-1];
	}

	return vPreguntas
}
// Funcion Auxiliar para configurar el vector de preguntas aleatorias ........................................................................................
_initPreguntasAleatorias_F20_CUESTIONARIO=function (vPreguntas, BancoPreguntas, numAleatorias)
{
	
	// Comprobamos si el número de Preguntas aleatorias es mayor del total de preguntas del banco de preguntas.
	//alert(vPreguntas)
	if(numAleatorias>BancoPreguntas.length) numAleatorias=BancoPreguntas.length // no puede superar esta cifra
	
	vPreguntas=Array(numAleatorias)  // Creamos un vector de tantas casillas como preguntas vamos a seleccionar.
	
	// Obtenemos un vector de numAleatorias posiciones, con los valores comprendidos entre 0 y la longitud total del banco de preguntas-1.
	var auxVectorAleatorio= obtenerVectorAleatorioPreguntas(numAleatorias,0,BancoPreguntas.length -1,[])
	var cont
		//alert(auxVectorAleatorio +"  " +numAleatorias)
	// Asignamos en las poisicones de vPreguntas las referencias al banco de preguntas.
	for(cont=0;cont<numAleatorias; cont++)
	{
		vPreguntas[cont]=BancoPreguntas[auxVectorAleatorio[cont]];
	}

	return vPreguntas
}

// Avanza el índice a la siguiente pregunta ..................................................................................................................
_siguientePregunta_F20_CUESTIONARIO = function () 
{
	if (!(this.esUltimaPregunta()))
	{
		this.numPreguntaActual++
		this.preguntaActual=this.preguntas[this.numPreguntaActual]
		return true
	}
	else return false
}

// Avanza el índice a la anterior pregunta ..................................................................................................................
_anteriorPregunta_F20_CUESTIONARIO=function()
{
	if (this.getNumPreguntaActual()>1)
	{
		this.numPreguntaActual--
		this.preguntaActual=this.preguntas[this.numPreguntaActual]
		return true
	}
	else return false
	
}
