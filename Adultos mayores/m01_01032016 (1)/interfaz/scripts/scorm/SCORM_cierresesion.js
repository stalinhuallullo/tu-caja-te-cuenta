
function SCORM_cierreSesion()
{
	var avance=0 
	var puntuacionFinal=0
	
	msg_debug("[SCORM_cierreSesion()]: Inicio funcion cierre_scorm  sesión ... ")	
		
	if ((_SCORM_)&&(_SCORM_RTM_INICIALIZADO))  // Solo realizamos esta llamada si hay scorm
	{
		 
		if (estaSoportado("cmi.student_data","mastery_score")) 
		{

			SCORM_MasteryScore=parseInt(getValor("cmi.student_data.mastery_score"))	
			msg_debug("[SCORM_cierreSesion()] MasteryScore definido en " + SCORM_MasteryScore)
		}
		else 
		{
			SCORM_MasteryScore=_SCORM_ScoreApto
			msg_debug("[SCORM_cierreSesion()] cmi.student_data.mastery_score no soportado. MasteryScore por defecto " + SCORM_MasteryScore)
			
		}
		 
		SCORM_Credits=getValor("cmi.core.credit")
		msg_debug("[SCORM_cierreSesion()] Soporte de Credit: " + SCORM_Credits)
		

		// === ESTABLECEMOS EL ESTADO DEL CURSO
		avance=indiceUnidad.getProgress()
		if (avance<100) 
		{
			//putValor("cmi.core.lesson_status","not attempted")
			//writeInf("Estado: not attempted")
			putValor("cmi.core.lesson_status","incomplete")
			msg_debug("[SCORM_cierreSesion()] Estado: incomplete")					
			
		}
		else
		{
			putValor("cmi.core.lesson_status","completed")
			msg_debug("[SCORM_cierreSesion()] Estado: completed")		
		
		}
			
		// Almacenamos en "suspenData" los nombres de los documentos visualizados
		var tmp=SCORM_getSuspendataString()
		var result=putValor("cmi.suspend_data", tmp);
		 
		if (indiceUnidad.pagActual!=null)
		{
			putValor("cmi.core.lesson_location",indiceUnidad.pagActual.index );//+ "%");
		}
		putValor("cmi.core.score.raw",avance);	
		//parent.putValor("cmi.core.score.max",parent._SCORM_ScoreMax);
		//parent.putValor("cmi.core.score.min",parent._SCORM_ScoreMin);
		putValor("cmi.core.session_time",SCORM_tiempoSesion.calculaIntervaloAcumulado())
	
		
		commit();	
		fin();
	
	}
	}
		
