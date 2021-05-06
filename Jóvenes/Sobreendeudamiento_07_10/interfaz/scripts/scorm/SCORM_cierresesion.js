
// ---------------------------------------------------------------------------------------------------------
//	El siguiente script se añade por compatiblidad con IE7, ya que no incluye el metodo indexOf en los arrays
// ---------------------------------------------------------------------------------------------------------
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}



// ---------------------------------------------------------------------------------------------------------
//	Almacena información de todas las interacciones interacción (siempre que este soportado)
function SCORM_saveInteractionInfo()
{

//cmi.interactions._children
//cmi.interactions._count

//cmi.interactions.n.id
//cmi.interactions.n.objectives._count
//cmi.interactions.n.objectives.n.id
//cmi.interactions.n.time    (HH:MM:SS)
//cmi.interactions.n.type	   true-false  choice   fill-in  matching  performance  sequencing likert numeric
//cmi.interactions.n.correct_responses._count
//cmi.interactions.n.correct_responses.n.pattern
//cmi.interactions.n.weighting
//cmi.interactions.n.student_response
//cmi.interactions.n.result   "correct" "wrong" "unanticipated" "neutral" "x.x"
//cmi.interactions.n.latency	hhhh:mm:ss.ss


		
	if (indiceUnidad.hasPracticas==true)
	{
		msg_debug("ALMACENAMOS INTERACCTIONS  .................")
		// comprobamos si estan soportadas las interaciones
		var support=getValor("cmi.interactions._children")
		var supportId=false
		var supportResponse=false
		
		if (support.split(",").indexOf("id")!=-1) supportId=true
		if (support.split(",").indexOf("student_response")!=-1) supportResponse=true
		msg_debug("... Soporte de interacciones ID="+supportId+"  STUDENT_RESPONSE="+supportResponse+" STRSUPPORTED:" +support )
		if((supportId==true)&&(supportResponse==true))
		{
			// Recorremos el array de prácticas
			var cont=0
			var auxval =0
			var idinteraction=0
			var strResultado=""
			for (cont=0;cont<indiceUnidad.numPracticas;cont++)
			{
				strResultado=""
				if(indiceUnidad.practicas[cont].saveinteraction==true)
				{
					//indiceUnidad.practicas[cont].id
					//indiceUnidad.practicas[cont].aciertos
					//indiceUnidad.practicas[cont].fallos
					//indiceUnidad.practicas[cont].completado
					//indiceUnidad.practicas[cont].numpaso
					//indiceUnidad.practicas[cont].totalpasos
					//indiceUnidad.practicas[cont].puntos
					if (indiceUnidad.practicas[cont].completado==true) strResultado=strResultado + " COMPLETO "
					else  strResultado=strResultado + " INCOMPLETO "
					strResultado=strResultado + " A:" +indiceUnidad.practicas[cont].aciertos
					strResultado=strResultado + " F:" +indiceUnidad.practicas[cont].fallos
					strResultado=strResultado + " [" +(indiceUnidad.practicas[cont].numpaso+1) + "/" + indiceUnidad.practicas[cont].totalpasos + "]"

					//strResultado=strResultado + " Puntuacion:" +indiceUnidad.practicas[cont].puntos
					
					msg_debug("... Almacenamos ("+idinteraction+")ID " + indiceUnidad.practicas[cont].id + " Valores: "+strResultado)
					
					putValor("cmi.interactions."+idinteraction+".id",indiceUnidad.practicas[cont].id)
					putValor("cmi.interactions."+idinteraction+".student_response",strResultado)
					
						
					
					idinteraction++
				}
				else msg_debug("... Practica "+indiceUnidad.practicas[cont].id+"  tiene interacciones desactivada .. no almacenamos " )
			
			}
			
		}
		else msg_debug("... INTERACCIONES NO SOPORTADAS!!! => no almacenamos" )
		
		
		
	}
	else
	{
		msg_debug("Interacciones no guardadas - no existen prácticas -  .................")
	}
}


// ---------------------------------------------------------------------------------------------------------
//	Calcula el valor de puntuación de los Retos
function calculo_Puntuacion_Retos()
{
	var puntuacionRetos=0
			
				// Nota!! => por el momento dejamos la puntuación de los retos a 0 
				// a falta de terminar de definir su metodo de calculo
				msg_debug("Valor retos (no implementado, valor 0 por defecto): " + puntuacionRetos )
				puntuacionRetos=0
				
	return puntuacionRetos
	
}

// ---------------------------------------------------------------------------------------------------------
//	Calcula el valor de puntuación de las prácticas
function calculo_Puntuacion_Practicas()
{
	var puntuacionPracticas=0
		
		// Calculamos puntuación de prácticas
		msg_debug("ACTUALIZAMOS Y RECALCULAMOS PUNTUACIÓN FINAL DE PRÁCTICAS ........  ")
		
		if (indiceUnidad.hasPracticas==true)
		{
			var cont=0
			var auxval =0
			for (cont=0;cont<indiceUnidad.numPracticas;cont++)
			{
				listaValores.setValue("pgvar_"+ indiceUnidad.practicas[cont].id+ "_A",indiceUnidad.practicas[cont].aciertos+"")
				listaValores.setValue("pgvar_"+ indiceUnidad.practicas[cont].id+ "_B",indiceUnidad.practicas[cont].fallos+"")
				if(indiceUnidad.practicas[cont].completado==true) listaValores.setValue("pgvar_"+ indiceUnidad.practicas[cont].id+ "_C","true")
				else listaValores.setValue("pgvar_"+ indiceUnidad.practicas[cont].id+ "_C","false")
				listaValores.setValue("pgvar_"+ indiceUnidad.practicas[cont].id+ "_D",indiceUnidad.practicas[cont].numpaso+"")
				listaValores.setValue("pgvar_"+ indiceUnidad.practicas[cont].id+ "_E",indiceUnidad.practicas[cont].totalpasos+"")
				listaValores.setValue("pgvar_"+ indiceUnidad.practicas[cont].id+ "_F",indiceUnidad.practicas[cont].puntos+"")
				
				if(indiceUnidad.practicasTipoPuntuacion=="aciertofallo")
				{
					// caso de aciertofallo
					if (indiceUnidad.practicas[cont].completado==true)
						auxval=(indiceUnidad.practicas[cont].aciertos/(indiceUnidad.practicas[cont].fallos+indiceUnidad.practicas[cont].aciertos)*100)
					else auxval=0	
				}
				else if(indiceUnidad.practicasTipoPuntuacion=="puntuaciones")
				{
					// Caso puntuaciones => aun no desarrollado
				}
				else
				{
					// Caso de completados
					if (indiceUnidad.practicas[cont].completado==true) auxval=1
					else auxval=0
				}

				msg_debug("Valor práctica ("+cont+") y metodo=["+indiceUnidad.practicasTipoPuntuacion+"]:  " + auxval)
				puntuacionPracticas=puntuacionPracticas+auxval
				
			}
			if((indiceUnidad.practicasTipoPuntuacion=="puntuaciones")||(indiceUnidad.practicasTipoPuntuacion=="aciertofallo"))
			{		
				if(indiceUnidad.practicasTipoCalculo=="promedio")
				{
					puntuacionPracticas=Math.round(puntuacionPracticas/indiceUnidad.numPracticas)
				}
				else  // Caso de valor "suma"
				{
					//no hacemos media
				}
			}
			else
			{
				if(indiceUnidad.practicasTipoCalculo=="promedio")
				{
					puntuacionPracticas=Math.round(puntuacionPracticas/indiceUnidad.numPracticas*100)
				}
				else  // Caso de valor "suma"
				{
					//no hacemos media
				}
			}
			msg_debug(" => Calculo de puntuación final de prácticas metodo=["+indiceUnidad.practicasTipoPuntuacion+"]: " + puntuacionPracticas)
			//indiceUnidad.practicasTipoPuntuacion  //completados|puntuaciones	
			//indiceUnidad.practicas
			//indiceUnidad.numPracticas
			//indiceUnidad.practicas[x].id
			//indiceUnidad.practicas[x].aciertos
			//indiceUnidad.practicas[x].fallos
			//indiceUnidad.practicas[x].completado
			//indiceUnidad.practicas[x].numpaso
		}		
	return puntuacionPracticas
}

// ---------------------------------------------------------------------------------------------------------
//	Calcula el valor de RAW en base a la configuración del XML
function calculo_Puntuacion_Final()
{
	var avance=0 
	var puntuacionFinal=0
	var puntuacionPracticas=0
	var puntuacionRetos=0

		
	
		
		
		if(indiceUnidad.hasCalculoPuntuacion==true)
		{
		
			msg_debug(" COMPUTO PUNTUACIÓN FINAL  -  MEDIANTE PARAMETRIZACIÓN XML " ) 		
			// Si disponemos de un método de calculo de puntuacion definido en xml
			
			//indiceUnidad.ponderacionRetos
			//indiceUnidad.ponderacionPracticas
			//indiceUnidad.ponderacionContenidos
			//indiceUnidad.completarPor
			//indiceUnidad.puntuacionminima
			
			// Calculamos el valor de la puntuación de los retos 
			puntuacionRetos=calculo_Puntuacion_Retos()
		
			// Almacenamos el valor de las practicas en el suspendata
			puntuacionPracticas=calculo_Puntuacion_Practicas()

			
			avance=indiceUnidad.getProgress()
			 
			puntuacionFinal=	Math.round((indiceUnidad.ponderacionRetos *   puntuacionRetos /100)+
								(indiceUnidad.ponderacionPracticas*  puntuacionPracticas/100)+ 
								(indiceUnidad.ponderacionContenidos* avance /100) )
								
			msg_debug(" - Puntuacion final " + puntuacionFinal + "(RT:"+indiceUnidad.ponderacionRetos+ "*["+ puntuacionRetos+"]" +
						" PR:"+indiceUnidad.ponderacionPracticas+ "*["+puntuacionPracticas +"]" +
					  " CN:"+indiceUnidad.ponderacionContenidos+ "*["+avance +"]") 					
	
		}
		else
		{
			msg_debug(" COMPUTO PUNTUACIÓN FINAL  -  SIN PARAMETRIZACIÓN XML  => GUARDA SOLO AVANCE CONTENIDOS" ) 
			
			puntuacionFinal=	indiceUnidad.getProgress()
		}


		return puntuacionFinal
	
}

// ---------------------------------------------------------------------------------------------------------
//	Realiza el cierre de sesion scorm
//
//		unicamente guarda seguimiento si el parametro guardarSeguimiento==true caso contrario devuelve si completa o no el sco
//
function SCORM_cierreSesion(saveScorm)
{
	var avance=0 
	var puntuacionFinal=0
	var hacompletado=false
	
	
	msg_debug("[SCORM_cierreSesion()]: Inicio funcion cierre_scorm  sesión ... ")	
		
	if (((_SCORM_)&&(_SCORM_RTM_INICIALIZADO))||(saveScorm==false))  // Solo realizamos esta llamada si hay scorm
	{

	
		// ......................................................
		 
		//if (estaSoportado("cmi.student_data","mastery_score")) 
		//{

			//SCORM_MasteryScore=parseInt(getValor("cmi.student_data.mastery_score"))	
			//msg_debug("[SCORM_cierreSesion()] MasteryScore definido en " + SCORM_MasteryScore)
		//}
		//else 
		//{
			
			//SCORM_MasteryScore=_SCORM_ScoreApto
			//msg_debug("[SCORM_cierreSesion()] cmi.student_data.mastery_score no soportado. MasteryScore por defecto " + SCORM_MasteryScore)
			SCORM_MasteryScore=indiceUnidad.puntuacionminima
			msg_debug("[SCORM_cierreSesion()] MasteryScore definido en XML " + SCORM_MasteryScore)
			
		//}
		 
		if (saveScorm==true)
		{		
				SCORM_Credits=getValor("cmi.core.credit")
				
				msg_debug("[SCORM_cierreSesion()] Soporte de Credit: " + SCORM_Credits)
		}
			
	
	
		if(indiceUnidad.hasCalculoPuntuacion==true)
		{
			// Si disponemos de un método de calculo de puntuacion definido en xml
			
			//indiceUnidad.ponderacionRetos
			//indiceUnidad.ponderacionPracticas
			//indiceUnidad.ponderacionContenidos
			//indiceUnidad.completarPor
			//indiceUnidad.puntuacionminima
			
			
			
			msg_debug("[SCORM_cierreSesion()] Aplicamos cierre sesión definido en XML")
			msg_debug(" - Parametros de cierre") 
			msg_debug(" - Ponderaciones (Retos:"+indiceUnidad.ponderacionRetos+ 
						" Practicas:"+indiceUnidad.ponderacionPracticas +
					  " Contenidos:"+indiceUnidad.ponderacionContenidos +
					  ") Completarpor::"+indiceUnidad.completarPor+
					  " Puntuacionminima::"+indiceUnidad.puntuacionminima+"  ") 
			
			
			avance=indiceUnidad.getProgress()
			puntuacionFinal=calculo_Puntuacion_Final()
			
			
			
			
			// Dependiendo del valor de este parámetro completaremos el contenido
			//    contenidos|score|contenidos_score
			switch(indiceUnidad.completarPor)		  
			{
				case "contenidos": 
							msg_debug(" - Finalizamos basandonos unicamente en progreso de contenidos " + avance) 	
							
							if (avance<100) 
							{
								if (saveScorm==true) putValor("cmi.core.lesson_status","incomplete")
							}
							else
							{
								if (saveScorm==true) putValor("cmi.core.lesson_status","completed")
								hacompletado=true
							}
							if (saveScorm==true) putValor("cmi.core.score.raw",puntuacionFinal);	
							
							break;
				case "score": 
							msg_debug(" - Finalizamos basandonos unicamente en la puntuación obtenida  " + puntuacionFinal +
										" sea mayor o igual que nota de corte " + SCORM_MasteryScore) 				
							
							if (puntuacionFinal<SCORM_MasteryScore)
							{
								if (saveScorm==true) putValor("cmi.core.lesson_status","incomplete")
							}
							else
							{
								if (saveScorm==true) putValor("cmi.core.lesson_status","completed")
								hacompletado=true
							}
							if (saveScorm==true) putValor("cmi.core.score.raw",puntuacionFinal);	
							
							break;			

				case "contenidos_score": 
				
				default:
							msg_debug(" - Finalizamos basandonos tanto avance " + avance + " como en puntuacion  " + puntuacionFinal) 				
				
							if ((avance==100)&&
								(puntuacionFinal>=SCORM_MasteryScore))
							{	
								 if (saveScorm==true) putValor("cmi.core.lesson_status","completed")
								 hacompletado=true
							}
							else
							{
								if (saveScorm==true) putValor("cmi.core.lesson_status","incomplete")
							}
							if (saveScorm==true) putValor("cmi.core.score.raw",puntuacionFinal);	
							break;


							
			}
		}
		else
		{
				msg_debug("[SCORM_cierreSesion()] Aplicamos cierre sesión tradicional (basado en completed cuando progreso=100%")
				// === ESTABLECEMOS EL ESTADO DEL CURSO
				/*avance=indiceUnidad.getProgress()
				if (avance<100) 
				{
					//putValor("cmi.core.lesson_status","not attempted")
					//writeInf("Estado: not attempted")
					if (saveScorm==true) putValor("cmi.core.lesson_status","incomplete")
					msg_debug("[SCORM_cierreSesion()] Estado: incomplete")					
					
				}
				else
				{
					if (saveScorm==true) putValor("cmi.core.lesson_status","completed")
					hacompletado=true
					msg_debug("[SCORM_cierreSesion()] Estado: completed")		
				
				}
				*/
				
				try
				{
					var cuentaacertadas=0;
					var stracertadas=""
					//var acertadas = [0,0,0,0,0,0,0,0,0];
					for (x=0; x<acertadas.length; x++){
						if(acertadas[x]==1) cuentaacertadas++; 
						stracertadas=stracertadas+ " " + acertadas[x] + " "
					}
					SCORM_PUNTUACION_ACTUAL=Math.round(cuentaacertadas /acertadas.length*100)
					msg_debug(" Calculamos puntuación acumulada en array acertadas["+stracertadas+"] => " + cuentaacertadas + " " + SCORM_PUNTUACION_ACTUAL + "%")
				}
				catch(e)
				{
					SCORM_PUNTUACION_ACTUAL=0
					msg_debug(" Calculamos puntuación acumulada en array acertadas => por error asignamos valor 0")
				}
				
				
				if (SCORM_PUNTUACION_ACTUAL>SCORM_puntuacion)	
				{
					msg_debug(" SCORM_PUNTUACION_ACTUAL("+SCORM_PUNTUACION_ACTUAL+")  mayor que puntuacion anterior ("+SCORM_puntuacion+"). La sobreescribimos ")
					putValor("cmi.core.score.raw",SCORM_PUNTUACION_ACTUAL);	
					if (SCORM_PUNTUACION_ACTUAL>=80) putValor("cmi.core.lesson_status","completed")
					else putValor("cmi.core.lesson_status","incomplete")
					
				}
				else
				{
					msg_debug(" SCORM_PUNTUACION_ACTUAL("+SCORM_PUNTUACION_ACTUAL+")  menor que puntuacion anterior ("+SCORM_puntuacion+").  ")
					if (SCORM_puntuacion>=80) putValor("cmi.core.lesson_status","completed")
					else putValor("cmi.core.lesson_status","incomplete")
				}
				//parent.putValor("cmi.core.score.max",parent._SCORM_ScoreMax);
				//parent.putValor("cmi.core.score.min",parent._SCORM_ScoreMin);
		}
	
	
				
		// Almacenamos en "suspenData" los nombres de los documentos visualizados
		var tmp=SCORM_getSuspendataString()
		var result
		if (saveScorm==true) result=putValor("cmi.suspend_data", tmp);
		 
		if (indiceUnidad.pagActual!=null)
		{
			if (saveScorm==true) putValor("cmi.core.lesson_location",indiceUnidad.pagActual.index );//+ "%");
		}
	
		if (saveScorm==true) putValor("cmi.core.session_time",SCORM_tiempoSesion.calculaIntervaloAcumulado())
	
		
		// Guardamos la información te las prácticas realizadas
		if (saveScorm==true) SCORM_saveInteractionInfo()
		
		if (saveScorm==true) commit();	
		if (saveScorm==true) fin();
	
	}
	
		return hacompletado
	}
		
/*
	indiceUnidad.hasPracticas 
	indiceUnidad.practicasTipoPuntuacion  //completados|puntuaciones	
	indiceUnidad.practicas
	indiceUnidad.numPracticas
	indiceUnidad.practicas[x].id
	indiceUnidad.practicas[x].aciertos
	indiceUnidad.practicas[x].fallos
	indiceUnidad.practicas[x].completado
	indiceUnidad.practicas[x].numpaso
	
	indiceUnidad.hasCalculoPuntuacion
	indiceUnidad.ponderacionRetos
	indiceUnidad.ponderacionPracticas
	indiceUnidad.ponderacionContenidos
	indiceUnidad.completarPor   //contenidos|score|contenidos_score	
	
*/	
	
/*
	// Cargamos la información de retos ..............................................
	this.xmlObjRetos=$(this.xmlObj).find('retos:first');
	msg_debug("CARGA INFORMACION DE RETOS.....")
	if(this.xmlObjRetos.length>0)	
	{	
		this.hasRetos=true
		this.numRetos=parseInt(this.xmlObjRetos.attr("num"))
		this.tipoRetos=this.xmlObjRetos.attr("tipo")
		
		msg_debug(" hasRetos="+this.hasRetos+"   numRetos="+this.numRetos+"  tipoRetos="+this.tipoRetos+"  ")
		
	}else msg_debug(" => retos no definidos")
	
	
	// Cargamos la informacion de practicas ...........................................	
	this.xmlObjPracticas=$(this.xmlObj).find('practicas:first');
	msg_debug("CARGA INFORMACION DE PRACTICAS.....")
	if(this.xmlObjPracticas.length>0)	
	{	
		this.hasPracticas=true
		this.practicasTipoPuntuacion=this.xmlObjPracticas.attr("tipoPuntuacion") 
		this.practicas=new Array()
		var scope=this
		this.xmlObjPracticas.find("practica").each(function(){
			var obj=new Object()
			obj.id=$(this).attr("id")
			obj.titulo=$(this).attr("titulo")
			obj.saveinteraction=$(this).attr("saveinteraction")
			obj.aciertos=0
			obj.fallos=0
			obj.completado=false
			obj.numpaso=0
			msg_debug(" PRACTICA["+scope.practicas.length+"] id="+obj.id+"  titulo="+obj.titulo+"  saveinteraction="+obj.saveinteraction+ 
					  " aciertos="+obj.aciertos+"    fallos="+obj.fallos+"  completado="+obj.completado+" numpaso="+obj.numpaso+" ")
			scope.practicas[scope.practicas.length]=obj
		})
		this.numPracticas=this.practicas.length
		msg_debug(" hasPracticas="+this.hasPracticas + " tipoPuntuacion=" + this.practicasTipoPuntuacion + "  numPracticas="+ this.numPracticas)
		
	}else msg_debug(" => practicas no definidas")
	
	
	// Cargamos la informacion de calculoPuntuacion ......................................		
	this.xmlObjCalculoPuntuacion=$(this.xmlObj).find('calculoPuntuacion:first');
	msg_debug("CARGA INFORMACION DE CALCULO DE PUNTUACION .....")
	if(this.xmlObjCalculoPuntuacion.length>0)	
	{	
		this.hasCalculoPuntuacion=true
		this.ponderacionRetos=parseInt(this.xmlObjCalculoPuntuacion.attr("retos"))
		this.ponderacionPracticas=parseInt(this.xmlObjCalculoPuntuacion.attr("practicas"))
		this.ponderacionContenidos=parseInt(this.xmlObjCalculoPuntuacion.attr("contenidos")) 
		this.completarPor=this.xmlObjCalculoPuntuacion.attr("completarpor")  //contenidos|score|contenidos_score
		msg_debug(" hasCalculoPuntuacion="+this.hasCalculoPuntuacion+"   ponderacionRetos="+this.ponderacionRetos+"  ponderacionPracticas="+this.ponderacionPracticas+"  ponderacionContenidos=" + this.ponderacionContenidos + " completarpor="+this.completarPor)
		
	}else msg_debug(" => calculoPuntuacion no definido")
		


*/
