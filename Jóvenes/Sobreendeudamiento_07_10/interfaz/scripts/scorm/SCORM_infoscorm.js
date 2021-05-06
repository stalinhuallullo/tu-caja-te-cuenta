

variablesScorm = new Array();
function addVariable(nombre)
{
	variablesScorm[variablesScorm.length]=nombre
}

function getTabla(funcion)
{

		var estiloCabecera="background-color:#333399;color:white";
		var estiloCabecera2="background-color:#3333cc;color:white";
		var estiloCabecera3="background-color:#6666FF;color:white";	
		var estiloCabecera4="background-color:#9999FF;color:white";			
		var estiloCol1="background-color:#ECEBEA;color:white;border-top:1px solid #CDCDCD;color:#000000";
		var estiloCol2="background-color:#FFFFFF;color:white;border-top:1px solid #CDCDCD;color:#333399";
		
	resultado="<table width=80% cellspacing=0 cellpadding=2 style='border:1px solid black'>";
	resultado=resultado + "<tr style='" + estiloCabecera + "'><td>Nombre Variable Scorm</td><td>Valor Scorm</td><tr>";
	for(i in variablesScorm)
	{
		//alert(i)
		if (variablesScorm[i].substr(0,1)=="-") 
		{
			resultado=resultado + "<tr ><td  colspan=2 style='" + estiloCabecera2 + "'>" +   variablesScorm[i].substr(1,variablesScorm[i].length -1)+ "</td> <tr>";
		}
		else if(variablesScorm[i].substr(0,1)=="$")
		{
			resultado=resultado + "<tr ><td  colspan=2 style='" + estiloCabecera3 + "'>" +   variablesScorm[i].substr(1,variablesScorm[i].length -1) + "</td> <tr>";
		}
		else if(variablesScorm[i].substr(0,1)=="·")
		{
			resultado=resultado + "<tr ><td  colspan=2 style='" + estiloCabecera4 + "'>" +   variablesScorm[i].substr(1,variablesScorm[i].length -1) + "</td> <tr>";
		}		
		else 
		{
		resultado=resultado + "<tr ><td width=200 style='" + estiloCol1 + "'>" +   variablesScorm[i] + "</td><td style='" + estiloCol2 + "' >"+ funcion(variablesScorm[i])+ "</td><tr>";
		}
	}
	resultado=resultado + "</table>";
	return resultado
	
}
 
function obtenerVariables(funcion) 
{
	
		 

	
	addVariable("- CMI.CORE");
	addVariable("cmi.core._children");
	addVariable("cmi.core.student_id");
	addVariable("cmi.core.student_name");
	addVariable("cmi.core.student_location");// Esta no esta en la api??
	addVariable("cmi.core.credit");
	addVariable("cmi.core.lesson_status");
	addVariable("cmi.core.lesson_location"); 
	addVariable("cmi.core.entry");
	addVariable("cmi.core.total_time");
	addVariable("cmi.core.lesson_mode");
	addVariable("cmi.core.exit");
	addVariable("cmi.core.session_time");	
	
	addVariable("- -- CMI.CORE.SCORE ");
	addVariable("cmi.core.score._children");	
	addVariable("cmi.core.score.raw");
	addVariable("cmi.core.score.max");
	addVariable("cmi.core.score.min");
	
	
	addVariable("- -- CMI... varios  .. ");
	addVariable("cmi.suspend_data");
	addVariable("cmi.launch_data");
	addVariable("cmi.comments");
	addVariable("cmi.comments_from_lms");	
	
	addVariable("- -- CMI.OBJETIVES ");
	addVariable("cmi.objectives._children");
	addVariable("cmi.objectives._count");
	cont=funcion("cmi.objectives._count");
	if ((cont!=null)&&(cont!="")&&(!isNaN(cont))&&(cont>0))
	{
		i=0;
		for(i=0;i<cont;i++)
		{
			addVariable("$ >> OBJETIVO nº:  " + i);
			addVariable("cmi.objectives." + i + ".id");
			addVariable("cmi.objectives." + i + ".score._children");
			addVariable("cmi.objectives." + i + ".score.raw");			
			addVariable("cmi.objectives." + i + ".score.max");
			addVariable("cmi.objectives." + i + ".score.min");
			addVariable("cmi.objectives." + i + ".status");
		}
	}
	
	addVariable("- -- CMI.STUDENT_DATA ");
	addVariable("cmi.student_data._children");
	addVariable("cmi.student_data.mastery_score");
	addVariable("cmi.student_data.max_time_allowed");
	addVariable("cmi.student_data.time_limit_action");
 
	addVariable("- -- CMI.STUDENT_PREFERENCE ");
	addVariable("cmi.student_preference._children");
	addVariable("cmi.student_preference.audio");
	addVariable("cmi.student_preference.language");
	addVariable("cmi.student_preference.speed");
	addVariable("cmi.student_preference.text");
	 
	
	addVariable("- -- CMI.INTERACTIONS ");
	addVariable("cmi.interactions._children");	
	addVariable("cmi.interactions._count");
	cont=funcion("cmi.interactions._count");
	if ((cont!=null)&&(cont!="")&&(!isNaN(cont))&&(cont>0))
	{
		i=0;
		for(i=0;i<cont;i++)
		{
			addVariable("$ >> INTERACCION nº:  " + i);
			addVariable("cmi.interactions." + i + ".id");

			
			
			addVariable("· >> INTERACCION nº:  " + i + ">> Objetivos ");
			addVariable("cmi.interactions." + i + ".objectives._count");
			cont2=funcion("cmi.interactions." + i + ".objectives._count");
			if ((cont2!=null)&&(cont2!="")&&(!isNaN(cont2))&&(cont2>0))
			{
				i2=0;
				for(i2=0;i2<cont2;i2++)
				{
					addVariable("cmi.interactions." + i + ".objectives." + i2 + ".id");
				}
			}
			
			addVariable("· >> INTERACCION nº:  " + i + ">> Respuestas ");
			addVariable("cmi.interactions." + i + ".time");
			addVariable("cmi.interactions." + i + ".type");
			addVariable("cmi.interactions." + i + ".correct_responses._count");
			
			cont2=funcion("cmi.interactions." + i + ".correct_responses._count");
			if ((cont2!=null)&&(cont2!="")&&(!isNaN(cont2))&&(cont2>0))
			{
				i2=0;
				for(i2=0;i2<cont2;i2++)
				{
					addVariable("cmi.interactions." + i + ".correct_responses." + i2 + ".pattern");
				}
			}		
			
			addVariable("cmi.interactions." + i + ".weighting");
			addVariable("cmi.interactions." + i + ".student_response");
			addVariable("cmi.interactions." + i + ".result");
			addVariable("cmi.interactions." + i + ".latency"); 		

		}
	}

	 
}