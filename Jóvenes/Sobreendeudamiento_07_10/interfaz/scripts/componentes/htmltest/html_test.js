//alert("html_test")

// Definimos las clases que manejaremos por medio de variables, para poder modificarlas en un futuro facilmente
var CLASS_Cuestionario=".ej_visorEjercicio"
var CLASS_Mensajes=".ej_mensaje"
var CLASS_InfBar=".ej_infoBar"
var CLASS_NumeroPregunta=".ej_numeroPregunta"
var CLASS_Enunciado=".ej_enunciado"
var CLASS_Respuestas=".ej_respuestas"
var CLASS_Acciones=".acciones"
var CLASS_BtnEnviar=".btn_enviar"
var CLASS_BtnAnterior=".btn_anterior"
var CLASS_BtnSiguiente=".btn_siguiente"
var CLASS_BtnFinalizar=".btn_finalizar"


function inicializarCuestionarios()
{
	
	//if ( $('.ej_visorEjercicio').attr('evaluable')=='true') desactivaNavegacion();
	var aux;
	//alert("inicializarCuestionarios")
	$(".ej_visorEjercicio").each(function(i){
		//alert(" cuestionario " +  i)		
		aux=new HTML_TEST(this,i)
		//aux.showPregunta(1)
	})

}


function HTML_TEST(c,num)
{
		


	//alert("c " + c + "num " + num)
	this.ACIERTOS=0
	this.FALLOS=0
	
	this.indiceCuestionario= num
	this.cuestionario	= $(c)
	 
	this.mensajes		= $($(c).find(CLASS_Mensajes))
	this.enunciado		= $($(c).find(CLASS_Enunciado))
	this.infbar			= $($(c).find(CLASS_InfBar))
	this.numeroPregunta	= $($(c).find(CLASS_NumeroPregunta))
	this.respuestas		= $($(c).find(CLASS_Respuestas))
	this.acciones		= $($(c).find(CLASS_Acciones))
	this.btnEnviar		= $($(c).find(CLASS_BtnEnviar))
	this.btnAnterior	= $($(c).find(CLASS_BtnAnterior))
	this.btnSiguiente	= $($(c).find(CLASS_BtnSiguiente))		
	this.btnFinalizar	= $($(c).find(CLASS_BtnFinalizar))			
	
	
	this.RUTAIMG="interfaz/tema/media/htmltest/"

	this.srcImgOk=this.RUTAIMG +"ok40px.png"
	this.srcImgKo=this.RUTAIMG +"ko40px.png"
	this.srcCerrar=this.RUTAIMG +"cerrar.png"
	this.srcImgMal=this.RUTAIMG +"mal40px.png"
	
	
	this.icoAlerta=this.RUTAIMG +"inf_alerta.png"
	this.icoExito=this.RUTAIMG +"inf_exito.png"
	this.icoIncorrecto=this.RUTAIMG +"inf_incorrecto.png"
	this.icoCorrecto=this.RUTAIMG +"inf_exito.png"
	this.icoInfo=this.RUTAIMG +"inf_info.png"
	this.icoPregunta=this.RUTAIMG +"inf_pregunta.png"
	
	this.MSG_sinmarcar="<h3 class='dowhat'>"+getTextual("txt_test_sinmarcar1")+"</h3><p>"+getTextual("txt_test_sinmarcar2")+"</p>"
	this.MSG_feedOK=getTextual("txt_test_MSG_feedOK")//"Respuesta correcta"
	this.MSG_feedMULTIOK=getTextual("txt_test_MSG_feedMULTIOK")//"Respuesta correcta"
	this.MSG_feedKO=getTextual("txt_test_MSG_feedKO")//"Respuesta incorrecta""
			
	
	
	this.respuestaBIEN="correcto"
	this.respuestaMAL="incorrecto"
	this.sinMarcar="sinMarcar"

	this.enableChecks=true  // Habilita o inhabilita la marcación de checks
	this.enableFunctions=true // habilita o inhabilita el uso de los botones enviar, avanzar, retroceder
	// Carga de attibutos  ..................................
	
	if((HAS_RETOS)&&(this.cuestionario.is('.reto'))){
		this.num_reto=parseInt(this.cuestionario.attr("reto"))
		this.porcentaje_reto=parseInt(this.cuestionario.attr("porcentaje"))
	}
	
	this.xmlsrc=this.cuestionario.attr("xmlsrc")
	this.cfgpregunta=this.cuestionario.attr("cfgpregunta")	
	this.tipoFeedback=this.cuestionario.attr("tipo_feedback")	
		this.feedRespuesta	= "respuesta"
		this.feedPregunta 	= "pregunta"
		this.feedGeneral	= "general"

	this.seleccion_multiple=false
	
	JSTHEME_refresh()	
	$(".btn_enviar").html(getTextual("txt_test_enviar"));
		
	$('.navsiguiente').addClass('inactivo');
	
	if(this.cuestionario.attr("seleccion_multiple")!=undefined)
	{
		if(this.cuestionario.attr("seleccion_multiple")=="true")	this.seleccion_multiple=true
	}
	

	this.mostrarRespuesta=false
	if(this.cuestionario.attr("mostrarRespuesta")!=undefined)
	{
		if(this.cuestionario.attr("mostrarRespuesta")=="true")		this.mostrarRespuesta=true
	}
	//alert(this.cuestionario.attr("mostrarRespuesta") + "" + this.mostrarRespuesta)


	//alert("fin")
	
	// Creamos un objeto cuestionario para leer el xml
	this.ejdata=new F20_CUESTIONARIO()
	this.ejdata.init(this.xmlsrc,this.cfgpregunta)




	// ---------------------------------------- funciones click respuestas  -------------------------------------------------------------------------------------


	this.clickOff=function ()	
	{
		if(!this.seleccion_multiple)
		{
		
			this.respuestas.find("img").attr("src",this.srcImgKo)
		
		
		}
		//alert("clickoff")
	}
	this.clickResp=function (i,r)	
	{
		//alert(this.enableChecks)
		if(this.enableChecks)
		{
			//alert(i+r)
			//alert("clickoff")
			if ($(r).find("img").attr("src")==this.srcImgKo) {
				$(r).find("img").attr("src",this.srcImgOk)
			}
			else {
				$(r).find("img").attr("src",this.srcImgKo)
			}
		}
		
	}	
	this.isCheck=function (r)	
	{
		//alert(i+r)
		//alert("clickoff")
		if ($(r).find("img").attr("src")==this.srcImgOk) return true
		//else if ($(r).find("img").attr("src")==this.srcImgKo) return true
		else 													return false
		
	}	

	
	// ---------------------------------------- Corrige la respuesta ------------------------------------------------------------------------------------------
	this.corregir=function()
	{
		// obtener todas las respuestas y comparar lo marcado con lo que tendria que responderse
		
		//this.respuestaBIEN="correcto"
		//this.respuestaMAL="incorrecto"
		//this.sinMarcar="sinMarcar"		
		
		var resp=this.respuestas.find(".ej_respuesta")
		var cont
		var contMarcadas=0
		var solucion=true
		var str=""
		for(cont=0;cont<resp.length;cont++)
		{	str=str + this.isCheck(resp[cont]) +  " - " + this.ejdata.getRespuestaCorrecta(cont) + "\n "
			if(this.isCheck(resp[cont])) contMarcadas++
			if (!(this.isCheck(resp[cont])==this.ejdata.getRespuestaCorrecta(cont))) 
			{
				solucion=false
				// si es mas de una pregunta habilitamos la correccion de resultados. 
				if(this.ejdata.getNumPreguntas()>1)
						if (this.isCheck(resp[cont])) $(resp[cont]).find("img").attr("src",this.srcImgMal)
			}

		}
		//alert(str)
		if(contMarcadas==0) return this.sinMarcar
		else
		{
			if(solucion) return this.respuestaBIEN
			else return this.respuestaMAL
		}
		 

		
	}
	
	
	// ---------------------------------------- Feedbacks respuestas marcadas ------------------------------------------------------------------------------------------
	this.getFeedbackNegativoPreguntasMarcadas=function()
	{
		var marcada=false
		
		//alert("getFeedbackPreguntasMarcadas -  inicio ")
		var resp=this.respuestas.find(".ej_respuesta")
		var cont
		var str=""
		for(cont=0;cont<resp.length;cont++)
		{

			if (($(resp[cont]).find("img").attr("src")==this.srcImgOk)||
				($(resp[cont]).find("img").attr("src")==this.srcImgMal)		)			marcada= true
			else   marcada=false
			//alert("getFeedbackPreguntasMarcadas -  respuesta"+cont+" " + marcada)
			
			if (marcada)
			{
				//if(str!="") str=str+ "<br>"
				//if (!(this.isCheck(resp[cont])==this.ejdata.getRespuestaCorrecta(cont))) 
				str= this.ejdata.getRespuestaFeedback(cont) 
			}
		}
		//alert("getFeedbackPreguntasMarcadas -  fin ")
		return 	 str		
	}
	// Devuelve el audio configurado en la respuesta marcada, solo devuelve 1
	this.getAudioFeedbackNegativoPreguntasMarcadas=function()
	{
		var marcada=false
		
		//alert("getFeedbackPreguntasMarcadas -  inicio ")
		var resp=this.respuestas.find(".ej_respuesta")
		var cont
		var str=""
		for(cont=0;cont<resp.length;cont++)
		{

			if (($(resp[cont]).find("img").attr("src")==this.srcImgOk)||
				($(resp[cont]).find("img").attr("src")==this.srcImgMal)		)			marcada= true
			else   marcada=false
			//alert("getFeedbackPreguntasMarcadas -  respuesta"+cont+" " + marcada)
			
			if (marcada)
			{
				if  ((this.ejdata.getRespuestaFeedbackAudio(cont)!=undefined)&&(this.ejdata.getRespuestaFeedbackAudio(cont)!=null))
				{
					//if (!(this.isCheck(resp[cont])==this.ejdata.getRespuestaCorrecta(cont))) 
						str=  this.ejdata.getRespuestaFeedbackAudio(cont) + ""
				}
			}
		}
		//alert("getFeedbackPreguntasMarcadas -  fin ")
		return 	 str		
	}
	this.getFeedbackPreguntasMarcadas=function()
	{
		// obtener todas las respuestas y comparar lo marcado con lo que tendria que responderse
		
		//this.respuestaBIEN="correcto"
		//this.respuestaMAL="incorrecto"
		//this.sinMarcar="sinMarcar"
		var marcada=false
		
		//alert("getFeedbackPreguntasMarcadas -  inicio ")
		var resp=this.respuestas.find(".ej_respuesta")
		var cont
		var str=""
		for(cont=0;cont<resp.length;cont++)
		{

			if (($(resp[cont]).find("img").attr("src")==this.srcImgOk)||
				($(resp[cont]).find("img").attr("src")==this.srcImgMal)		)			marcada= true
			else   marcada=false
			//alert("getFeedbackPreguntasMarcadas -  respuesta"+cont+" " + marcada)
			
			if (marcada)
			{
				//if (!(this.isCheck(resp[cont])==this.ejdata.getRespuestaCorrecta(cont))) 
				str=str  + " <p> " +  this.ejdata.getRespuestaFeedback(cont) + " </p> "
			}
		}
		//alert("getFeedbackPreguntasMarcadas -  fin ")
		return 	 str

		
	}

	// ---------------------------------------- Solucion ------------------------------------------------------------------------------------------
	this.getSolucion=function()
	{
		var cont				
		var strRespuestaCorrecta="<p style='margin-top:12px;'>"+getTextual("txt_test_strRespuestaCorrecta")+"</p>"		//"<p>La respuesta correcta es:</p>"		
		
		for (cont=0;cont<this.ejdata.getNumRespuestas(); cont++)
		{
			//padre.ejdata.getNumRespuestas
			if (this.ejdata.getRespuestaCorrecta(cont))
			{
				
					//strRespuestaCorrecta=strRespuestaCorrecta+ "<img src='"+this.srcImgOk+"' />"			
					strRespuestaCorrecta=strRespuestaCorrecta + "<div  class='ej_respuestas_text' >" + this.ejdata.getRespuesta(cont) +  "</div>"

			}
		}	
		return strRespuestaCorrecta
	}

	// ---------------------------------------- funcion actualizainfodata--------------------------------------------------------------------------------------
	this.actualizaInfoData=function()
	{
	
		if(this.ejdata.getNumPreguntas()>1)
				this.numeroPregunta.html("[ "+getTextual("txt_test_aciertos")+":"+ this.ACIERTOS + " / "+getTextual("txt_test_fallos")+":" + this.FALLOS + 
				" ] &nbsp;" + this.ejdata.getNumPreguntaActual() + "/" + this.ejdata.getNumPreguntas())
		else
				this.numeroPregunta.html(this.ejdata.getNumPreguntaActual() + "/" + this.ejdata.getNumPreguntas())
		
	}
	
	// ---------------------------------------- funcion show --------------------------------------------------------------------------------------------------
		
	this.showPregunta=function()
	{
		
		
		//limpiamos el contenido de las capas		
		this.mensajes.html("")
		this.enunciado.html("")
		this.numeroPregunta.html("")
		this.respuestas.html("")
		this.hideFeedback()
		$('.ej_respuestas').removeClass('corregido')
		
		
		//alert(n)
		//this.enunciado.html("<b>enunciado " +  this.indiceCuestionario + " .... ruta:  "  + this.xmlsrc + " CFGPregunta: '"  + this.cfgpregunta + "' "+ this.ejdata.getEnunciado()+ "</b>") 
		this.enunciado.html(this.ejdata.getEnunciado()) 
		
		this.actualizaInfoData();
		var cont
		var str=""
		for(cont=0; cont<this.ejdata.getNumRespuestas();cont++)
		{
			str=str + "<div  class='ej_respuesta'  resultado='" +  this.ejdata.getRespuestaCorrecta(cont) + "' >"
			str=str + "<div class='ej_check' style='float:left' ><img src='"+this.srcImgKo+"' /></div>"			
			str=str + "<div   class='ej_respuestas_text'  >" + this.ejdata.getRespuesta(cont) +  "</div>"
					
	
			str=str + "</div>"
			str=str + "<div class='clear'>&nbsp;</div>"
		//	str= str + "(" + cont + ") " + this.ejdata.getRespuesta(cont) +  " <b>" +  this.ejdata.getRespuestaCorrecta(cont) + "</b>" 
									//+  this.ejdata.getRespuestaFeedback(cont)  +""
	
		}
		this.respuestas.html(str)
		var padre=this
		
		this.respuestas.find(".ej_respuesta").each(function(i){
			//this.parent.clickOff()
			//this.
			//alert(" respuesta " +  i)
				//alert(padre)
				
				$(this).click(function(e){
					padre.clickOff()
					padre.clickResp(i,this)
				})
				
				//$(this).find("img").attr("href")=padre.srcImgKo;
		
			})

		this.enableChecks=true	// Habilitamos la marcación de checks
		
	}

	// ------------------------------------ funcion siguiente ---------------------------------------------------------------------------------------------------	
	this.btnSiguiente.data("padre",this)
	this.btnSiguiente.click(function(){
	
		var padre=$(this).data("padre")
		if(padre.enableFunctions)
		{
			//alert("Asignar el componente como data de btnSiguiente para que pueda hacer la llamada" +  padre)
			padre.ejdata.siguientePregunta()
			padre.showPregunta()
			padre.btnSiguiente.css("display","none");
			padre.btnEnviar.fadeIn();
			
			
		}
		
	})

	// ------------------------------------ funcion anterior ----------------------------------------------------------------------------------------------------
	this.btnAnterior.data("padre",this)
	this.btnAnterior.click(function(){
		var padre=$(this).data("padre")
		if(padre.enableFunctions)
		{
		
			//alert("Asignar el componente como data de btnSiguiente para que pueda hacer la llamada" +  padre)
			padre.ejdata.anteriorPregunta()
			padre.showPregunta()
		}		
	})	

	//  ----------------------------------- show mensaje -------------------------------------------------------------------------------------------------------
	this.showFeedback=function(txt,ico,siguientepregunta)
	{
		//alert(txt + "  continuar:" + siguientepregunta)
		//this.mensajes.css("display:block")
		
			//this.icoAlerta="inf_alerta.png"
			//this.icoExito="inf_exito.png"
			//this.icoIncorrecto="inf_incorrecto.png"
			//this.icoInfo="inf_info.png"
			//this.icoPregunta="inf_pregunta"
			//	this.icoCorrecto="inf_exito.png"

		// Pintamos el contenido de la ventana		
		this.enableFunctions=false // Desactivamos la pulsación de botones
		

		var str
		str=""
		str=str + "<div class='ej_mensaje_close'><img src='" +  this.srcCerrar + "' ></div>"
		if(ico!="") str=str + "<div class='ej_mensaje_ico'><img src='" +  ico + "' ></div>"
		str=str + "<div class='ej_mensaje_text'>"+ txt+"</div>"
		this.mensajes.html(str)
		
		// Asignamos funcion de cierre
		var scope=this
		$(this.mensajes).find(".ej_mensaje_close").click(function(){
						
			scope.hideFeedback();			
		})
		
		// La redimensionamos
		this.mensajes.css("width",this.cuestionario.outerWidth() - 95)
		//this.mensajes.css("height",this.cuestionario.outerHeight() - 100)		
		this.mensajes.css("top",this.cuestionario.position().top + 45 + "px")		
		this.mensajes.css("left",this.cuestionario.position().left + 45 + "px")				

		
		// Efecto para mostrarla		
		this.mensajes.fadeIn()
	}
	//  ----------------------------------- hide mensaje -------------------------------------------------------------------------------------------------------	
	this.hideFeedback=function()
	{		
		//this.mensajes.slideDown()
		this.mensajes.fadeOut();
		
		this.enableFunctions=true
	}

	//  ----------------------------------- evaluar mensaje -------------------------------------------------------------------------------------------------------	
		
	this.evaluarResultado=function()
	{
	 if (!this.enableFunctions) exit()

		var cont
		var str=""
		
		//this.respuestaBIEN="correcto"
		//this.respuestaMAL="incorrecto"
		//this.sinMarcar="sinMarcar"
		
		//this.mostrarRespuesta
		//this.tipoFeedback=this.cuestionario.attr("tipo_feedback")	
		//this.feedRespuesta	= "respuesta"
		//this.feedPregunta 	= "pregunta"
		//this.feedGeneral	= "general"

			//this.icoAlerta="inf_alerta.png"
			//this.icoExito="inf_exito.png"
			//this.icoIncorrecto="inf_incorrecto.png"
			//this.icoInfo="inf_info.png"
			//this.icoPregunta="inf_pregunta"
		//	this.icoCorrecto="inf_exito.png"
		//	this.MSG_feedOK="Debes de marcar alguna de las respuestas del enunciado.Prueba de nuevo."
		//this.MSG_feedKO="Debes de marcar alguna de las respuestas del enunciado.Prueba de nuevo."

	//	this.mostrarRespuesta
//	this.getSolucion=function()
//	this.getFeedbackPreguntasMarcadas=function()

		var resultado=this.corregir()
		//alert(resultado)
		if(resultado==this.sinMarcar)
		{
			// Avisamos de que ha de marcar alguna respuesta
			this.showFeedback(this.MSG_sinmarcar,this.icoAlerta, false)
	
			
		}
		else 
		{
			
			// escondemos boton de corregir y mostramos solo el de siguiente pregunta
			if(this.ejdata.getNumPreguntas()>1)
			{	
				this.enableChecks=false	// no permitimos marcar los checks				
				if (this.ejdata.esUltimaPregunta())
				{
						// mostramos botón finalizar
						this.btnFinalizar.fadeIn();						
				}
				else
				{ 	// mostramos botón siguiente
				
					this.btnSiguiente.fadeIn();
				}
			}
			
			console.log( this.ejdata.intentos);
			this.ejdata.intentos--;
			$('.intentos').html('Intentos restantes: ' + this.ejdata.intentos);
			
		

			if(resultado==this.respuestaBIEN)
			{
				this.ACIERTOS++;

				// avisamos de que no es correcta, feedback adecuado, respuesta si esta habilitado
				var  respuesta=""
				
				// discriminamos segun ejercicio simple o respuesta multiple
				
				if (this.seleccion_multiple){
					respuesta=respuesta + "<h3 class='ok'>" + this.MSG_feedMULTIOK +"</h3>";
				} else {
					respuesta=respuesta + "<h3 class='ok'>" + this.MSG_feedOK +"</h3>"
				}
				
				if (this.tipoFeedback == this.feedRespuesta	)
				{
					//alert("mostramos feed respuestas")
					var auxfeedresp=this.getFeedbackPreguntasMarcadas()
					//alert(auxfeedresp)
					if (auxfeedresp!="") respuesta=respuesta + ""  + auxfeedresp + ""
				}
				if (this.tipoFeedback == this.feedPregunta	)
				{
					//alert("mostramos feed respuestas")
					var auxfeedresp=""+this.ejdata.getPreguntaFeedback()+ ""
					//alert(auxfeedresp)
					if (auxfeedresp!="") respuesta=respuesta + ""  + auxfeedresp + ""
				}
				//alert(this.ejdata.getPreguntaFeedback())
				//this.showFeedback(respuesta,this.icoIncorrecto,true)				
				
				// Avisamos de que es correcta la respuesta y  le indicamos que avance con la siguiente pregunta si es ya la última
				this.showFeedback(respuesta,this.icoCorrecto,true)	
				
				if ((this.ejdata.getPreguntaFeedbackAudio()!=undefined)&&(this.ejdata.getPreguntaFeedbackAudio()!=null))
				{
					soundPage.playSegmentSecuence(this.ejdata.getPreguntaFeedbackAudio(),null)
				}									
				this.btnEnviar.css("display","none");	
				$('.ej_respuestas').addClass('corregido')
				
				if(this.ejdata.getNumPreguntas()>1){
				} else {
					if((HAS_RETOS)&&(this.cuestionario.is('.reto'))){
							solucionareto(this.num_reto, 'conseguido')
					}
					$('.navsiguiente').removeClass('inactivo');	
				}
				
			}
			else if(this.ejdata.intentos>0){
				if (this.getFeedbackNegativoPreguntasMarcadas()=="")	respuesta="<h3 class='ko'>¡Respuesta incorrecta!</h3>Por favor, inténtalo de nuevo."
				else 	respuesta="<h3 class='ko'>¡Respuesta incorrecta!</h3>" +this.getFeedbackNegativoPreguntasMarcadas()
				
				if (this.getAudioFeedbackNegativoPreguntasMarcadas()!=""){
					//alert("activamos audio " + this.getAudioFeedbackNegativoPreguntasMarcadas())
					soundPage.playSegmentSecuence(this.getAudioFeedbackNegativoPreguntasMarcadas(),null)
				}
				else{
					//alert("Si audio")
				}
				this.showFeedback(respuesta,this.icoIncorrecto,true)
				if(this.ejdata.getNumPreguntas()>1){
				} else {
					if((HAS_RETOS)&&(this.cuestionario.is('.reto'))){
							solucionareto(this.num_reto, 'fallado')
					}
				}
			}
			else
			{

				$('.navsiguiente').removeClass('inactivo');	
				this.FALLOS++
				// avisamos de que no es correcta, feedback adecuado, respuesta si esta habilitado
				var  respuesta=""
				
				
				respuesta=respuesta + "<h3 class='ko'>" + this.MSG_feedKO + "</h3>"
				
				
				if (this.tipoFeedback == this.feedRespuesta	)
				{
					//alert("mostramos feed respuestas")
					var auxfeedresp=this.getFeedbackPreguntasMarcadas()
					//alert(auxfeedresp)
					if (auxfeedresp!="") respuesta=respuesta + ""  + auxfeedresp + ""
				}
				if (this.tipoFeedback == this.feedPregunta	)
				{
					//alert("mostramos feed respuestas")
					var auxfeedresp=""+this.ejdata.getPreguntaFeedbackNegativo() + ""
					//alert(auxfeedresp)
					if (auxfeedresp!="") respuesta=respuesta + ""  + auxfeedresp + ""
				}
				if(this.mostrarRespuesta)
				{
					//alert("mostramos respuesta correcta")
					//alert(this.getSolucion())
					 
					respuesta=respuesta + this.getSolucion()
				}

				
				if ((this.ejdata.getPreguntaFeedbackNegativoAudio()!=undefined)&&(this.ejdata.getPreguntaFeedbackNegativoAudio()!=null))
				{
					soundPage.playSegmentSecuence(this.ejdata.getPreguntaFeedbackNegativoAudio(),null)
				}					
				
				this.showFeedback(respuesta,this.icoIncorrecto,true)
				this.btnEnviar.css("display","none");	
				$('.ej_respuestas').addClass('corregido')
			}		
		}
		this.actualizaInfoData()
		
	
	
	}

	// ------------------------------------ funcion enviar -----------------------------------------------------------------------------------------------------
	this.btnEnviar.data("padre",this)
	this.btnEnviar.click(function(){
		
		var padre=$(this).data("padre")
		padre.evaluarResultado()
		

	})	
	
	// ------------------------------------ funcion btnfinalizar -----------------------------------------------------------------------------------------------------
	
	this.btnFinalizar.data("padre",this)
	this.btnFinalizar.click(function(){
		
		var padre=$(this).data("padre")
		padre.finalizar()
		

	})	
	
	
	// ------------------------------------ funcionfinalizar -----------------------------------------------------------------------------------------------------
	this.finalizar=function()
	{
			//alert("bu")
			
			
			var str=""
			
			str=str + "<h3 class='testend'>"+getTextual("txt_test_fincuestionario")+"</h3>"

			str=str + "<table>"
			str=str + "<tr><td>"+getTextual("txt_test_aciertos")+":</td><td> " + this.ACIERTOS+ "</td></tr>"
			str=str + "<tr><td>"+getTextual("txt_test_fallos")+":</td><td> "+ this.FALLOS + "</td></tr>"
			var porcentaje = this.ACIERTOS/this.ejdata.getNumPreguntas()*100;
			str=str + "<tr><td>"+getTextual("txt_test_puntuacion")+":</td><td> "+ Math.round(porcentaje) + "% </td></tr></table>"
			str=str + "<button class='btn_mensajeRepetir' >"+getTextual("txt_test_repetircuestionario")+"</button>"
			
			if((HAS_RETOS)&&(this.cuestionario.is('.reto'))){
				if (parseInt(porcentaje)>this.porcentaje_reto){
					solucionareto(this.num_reto, 'conseguido')
				} else {
					solucionareto(this.num_reto, 'fallado');
				}
			}
			
			this.showFeedback(str,this.icoExito, false)
			var scope=this
			this.mensajes.find(".btn_mensajeRepetir").click(function(){scope.repetir();})
	}

	this.repetir=function()
	{
		// repetimos ejercicio.
		this.hideFeedback()
		this.ACIERTOS=0
		this.FALLOS=0
		this.ejdata.goToPregunta(1);
		this.showPregunta()	
		this.btnFinalizar.css("display","none")
		this.btnEnviar.fadeIn();
				
		
	}	
	
	this.showPregunta()	

}

/*$(document).ready(function(){
 
 inicializarCuestionarios()
});*/

