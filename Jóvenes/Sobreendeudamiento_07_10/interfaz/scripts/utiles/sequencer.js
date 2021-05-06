/* ----------------------------------------------------------------------------------------------------------------- */
//
//		Mecanismo que realiza ejecuciones cada x milisegundos, configurado actualmente a 10 veces por segundo
//
//
//
/* ----------------------------------------------------------------------------------------------------------------- */

var FAB20_SEQUENCER_TICKSXSECONDS=10								// Numero de ticks por segundos que se generan
var FAB20_SEQUENCER_INTERVAL=1000 / FAB20_SEQUENCER_TICKSXSECONDS	// Milisegundos de cada ticks
var FAB20_SEQUENCER_ITERACION=0										// Iteración actual



// =======================================================================================================================
//
//		Este objeto instancia un motor de ejecución de acciones temporizadas.  Permitirá cargar una estructura de acciones
//      las cuales revisará cada x milisegundos para activar la que requiera en cada momento.
function FAB20_SEQUENCER_OBJECT()
{
	
	this.time_actions=[]		// Array con las acciones a realizar
	this.active=false			// Indica si esta activo el secuenciador o no (para apagarlo tras la ultima acción)
	this.time=0
	this.paused=false
	
	// .........................................................................................................
	// Carga una nueva acción en el listado
	this.loadAction= function(action)
	{
		this.time_actions[this.time_actions.length]=action
		this.time_actions.length
	}
	
	this.clearActions=function()
	{
		this.time_actions=[]
		this.active=false	
		this.time=0
		this.paused=false
	}
	
	this.startActions=function()
	{
		this.time=0
		this.active=true
		this.paused=false
		
	}
	
	this.pauseActions=function()
	{
		this.paused=true;
	}
	
	this.resumeActions=function()
	{
		this.paused=true;
	}
	
	
	// .........................................................................................................
	// Realiza la siguiente acción programada	
	this.doNextAction=function()
	{
		var cont
		var completado=false
		
		 
			
			if (this.active)
			{
			
				if(this.paused==false) this.time ++
		
				this.active=false
					// Revisamos el array this.time_actions en busca de alguna acción no realizada aun (propiedad iniciada==false) 
					// y cuyo tiempo programado haya sido superado   (propiedad startTime)	
					//  recordar mostrar mensaje debug por cada elemento que inicia !!!  msg_debug(" <font color='RosyBrown'>.. START ..</font>")
					completado=true;
					for(cont=0;cont<this.time_actions.length;cont++)
					{
						
						
						//msg_debug("this.time_actions.length" + this.time_actions.length +" cont " + cont + "<font color='DarkSalmon'>this.time_actions[cont].startTime " + this.time_actions[cont].startTime + "   this.time="+this.time+" </font>")
						if ((this.time_actions[cont].startTime==this.time)&&(this.time_actions[cont].iniciada==false))
						{
							
							//msg_debug(" <font color='DarkSalmon'> SequencerTime:"+  this.time +" Elem:" +time_actions[cont].idelement + " => ACTION ["+time_actions[cont].elem+"] </font> + IGUALES!!")
							//msg_debug("dsdfasdf")
							msg_debug("<font color='DarkSalmon'>[TIME "+this.time_actions[cont].startTime+"] Elem:"+this.time_actions[cont].idelement+ " ==> ACTION "+ this.time_actions[cont].action  +" </font>")
							//FAB20_SECUENCER_actionEffect( this.time_actions[cont].idelement,this.time_actions[cont].action,false)	
							FAB20_SECUENCER_actionEffect( this.time_actions[cont],false)	
							this.time_actions[cont].iniciada=true
						}
						else
						{
								//msg_debug("distintos")
							//msg_debug(" <font color='DarkSalmon'> SequencerTime:"+  this.time +" Elem:" +time_actions[cont].idelement + " => ACTION ["+time_actions[cont].elem+"] </font> + DISTINTOS!!")
						}
						if(this.time_actions[cont].iniciada==false) completado=false;
					}
				this.active=true
				if (completado==true) 
				{
					this.active=false;
					msg_debug(" <font color='DarkSalmon'> ... FIN SECUENCIAS PÁGINA ACTUAL </font>")
				}
			}
		
		}
	 
}

// =======================================================================================================================
//
//
//
function FAB20_SECUENCER_ACTION()
{
	this.iniciada=false
	this.startTime=0
	this.action=""
	this.idelement=""
	this.parametros=""
	
}

PAGE_ELEMENTS = new FAB20_SEQUENCER_OBJECT()   // Instanciamos un objeto de tipo page elements.
											   // Este será  recargado y reiniciado cada vez que acceda a una nueva página

											   
		

/* Funcion para mostrar elementos dinamicamente ..................................................................... */
/* CLASE "toptobottom" LOS ELEMENTOS APARECEN DESDE ARRIBA */
/* CLASE "bottomtotop" LOS ELEMENTOS APARECEN DESDE ABAJO */
/* CLASE "lefttoright" LOS ELEMENTOS APARECEN DESDE LA IZQUIERDA */
/* CLASE "righttoleft" LOS ELEMENTOS APARECEN DESDE LA DERECHA */
/* CLASE "fade" LOS ELEMENTOS APARECEN LINEARMENTE */
/* CLASE "parapadeo" LOS ELEMENTOS PARPADEAN PARA APARECER */
/* CLASE "poping" LOS ELEMENTOS CRECEN DESDE EL FONDO */
/* CLASE "fall" LOS ELEMENTOS PARECEN CAER */

/* 
	Funciones para controlar el sonido asignado a la página
	
	soundpage_start
	soundpage_stop
	soundpage_pause
	soundpage_interval 			PARAMETROS from:xx,duration:xx
	soundpage_interval_name 	PARAMETROS name:xxxx

 */

 /* 
	Funciones para ejecutar un efecto de sonido (los id estan definidos en sonidosfx.xml)

	soundfx						PARAMETROS id:xxxx
	soundfx_stop				PARAMETROS id:xxxx
	soundfx_pause				PARAMETROS id:xxxx

 */

 

/*  OTRAS IDEAS A FUTURO*/
/* Activar tarea periodica => cada vez que se active se le cambia al siguiente startime y se deja como que no se activo */
/* Ejecutar una funcion o un script (eval)  */
/* Mostrar de golpe y ocultar de golpe ESTO CON EL DE CSS CREO QUE ESTA LISTO*/
/* Rotaciones, Traslaciones y cambios de tamaño parametrizados*/
/* Copiar atributos de otro elemento (como por ejemplo dimensiones y posición */
/* Cambiar el Z Index 
/* guardar seguimiento al final de reproduccion pantalla
/* cronometro (imagen animada para representar un tiempo de ejecucion)
/* activar botón siguiente al finalizar secuencia visualización pantalla actual
/* avanzar de forma automatica al completarse la pantalla actual*/

//function FAB20_SECUENCER_actionEffect(elem,efecto,reset){	
function FAB20_SECUENCER_actionEffect(objAccion,reset){	
	
		elem=objAccion.idelement
		efecto=objAccion.action
		parametros=objAccion.parametros
		
		//alert('[seqid='+elem+']')
		var objElement= $('[seqid='+elem+']')		
		//alert(objElement.html())

		// ACCIONES DE SONIDO "SOUND PAGE"
		if ((efecto.split("soundpage").length>1)&&(!reset))
		{
			//alert("objAccion " + efecto)
			switch(efecto)
			{
				case "soundpage_start":
						soundPage.play()
						
						break;
				case "soundpage_stop":
						soundPage.stop()
						
						break;
				case "soundpage_pause":
						soundPage.pause()
						break;						
				case "soundpage_interval":
						
						var sounddesde=parseFloat(parametros.split(",")[0].split(":")[1])
						var soundduracion=parseFloat(parametros.split(",")[1].split(":")[1])
						
						soundPage.playSegment(sounddesde,soundduracion,null)
						
						break;
				case "soundpage_interval_name":
						//soundpage_interval_sequence PARAMETROS sequence:name		
						var sequencename=parametros.split(":")[1]
						soundPage.playSegmentSecuence(sequencename,null)
						break;
						
			}
		}
		
		// ACCIONES DE SOUND FX
		if ((efecto.split("soundfx").length>1)&&(!reset))
		{
			var idfx=parametros.split(":")[1]
			//alert("objAccion " + efecto)
			switch(efecto)
			{
				case "soundfx":
						//soundPage.play()
						SOUND_FX.playFX(idfx)
						break;
				case "soundfx_stop":
						//soundPage.stop()
						SOUND_FX.stopFX(idfx)
						break;
				case "soundfx_pause":
						//soundPage.pause()
						SOUND_FX.pauseFX(idfx)
						break;						
			 
			}
		}

		
	//soundfx
	//soundfx_stop
	//soundfx_pause
	
		// RESTO DE EFECTOS (VISUALES)	
		if(isIE9()){
		
			if (reset) objElement.fadeTo(0, 0)
			else objElement.fadeTo(500, 1.0);
			
		} else if (isIE8()){
		
		} else {
		
			$.cssEase['bounce'] = 'cubic-bezier(1,1,0.2,1.2)';				
			/* CLASE "toptobottom" LOS ELEMENTOS APARECEN DESDE ARRIBA */
			if (efecto=="toptobottom")
			{
				if (reset)  objElement.transition({y:-1000}, 0)
				else 		objElement.transition({y:0}, 800 , objElement.attr("easing"))
				//.delay(retraso)		
				
			}
			
			/* CLASE "bottomtotop" LOS ELEMENTOS APARECEN DESDE ABAJO */
			if (efecto=="bottomtotop")
			{
				if (reset)  objElement.transition({y:1000}, 0)
				else 		objElement.transition({y:0}, 800 , objElement.attr("easing"))
				//.delay(retraso)		
				
			}
			
			/* CLASE "lefttoright" LOS ELEMENTOS APARECEN DESDE LA IZQUIERDA */
			if (efecto=="lefttoright")
			{
				if (reset)  objElement.transition({x:-1000}, 0)
				else 		objElement.transition({x:0}, 800 , objElement.attr("easing"))
				//.delay(retraso)		
			}
			
			/* CLASE "righttoleft" LOS ELEMENTOS APARECEN DESDE LA DERECHA */
			if (efecto=="righttoleft")
			{
				if (reset)  objElement.transition({x:1000}, 0)
				else 		objElement.transition({x:0}, 800 , objElement.attr("easing"))
				//.delay(retraso)		
			}
			
			/* CLASE "FADE" LOS ELEMENTOS APARECEN LINEARMENTE */
			if (efecto=="fade")
			{			
				if (reset)  objElement.fadeTo(0, 0)
				else		objElement.fadeTo(500, 1.0);
				//.delay(retraso)
			}
			
			if (efecto=="fadeout")
			{			
				if (reset)  {}
				else		objElement.fadeTo(500, 0, function(){objElement.css('display','none')});
				//.delay(retraso)
			}
			
			/* CLASE "parapadeo" LOS ELEMENTOS PARPADEAN PARA APARECER */
			if (efecto=="parpadeo")
			{			
				if (reset) objElement.fadeTo(0, 0).delay(retraso)
				else 
				{
					for(i=0;i<3;i++) {
						objElement.fadeTo(100, 0).fadeTo(100, 1.0);
					};
					objElement.fadeTo(100, 0).fadeTo(500, 1.0);
				}
			}
			
			/* CLASE "poping" LOS ELEMENTOS CRECEN DESDE EL FONDO */
			if (efecto=="poping")
			{
				if (reset)  objElement.transition({scale:0}, 0)
				else objElement.transition({scale:1}, 800 , objElement.attr("easing"))
				//.delay(retraso)		
				
			}
			
			/* CLASE "fall" LOS ELEMENTOS PARECEN CAER */
			if (efecto=="fall")
			{
				
				if (reset)  objElement.fadeTo(0, 0).transition({scale:2}, 0)
				else objElement.fadeTo(0, 1.0).transition({scale:1}, 500 , 'bounce')
				//.delay(retraso)
			
			}
			
			/* CLASE "css" CAMBIOS EN LAS CSS */
			if (efecto=="css")
			{
				
				if (reset) {}			
				else {
					estilos = parametros.split(",");
					console.log(estilos)
					for(x=0; x<estilos.length; x++){
						objElement.css(estilos[x].split(":")[0], estilos[x].split(":")[1])
					}
					//.delay(retraso)		
				}
			}
			
			/* CLASE "move" MOVEMOS UN ELEMENTO DE UNA POSICION A OTRA DADA */
			if (efecto=="move")
			{
				
				if (reset) {}			
				else {
					var movimientos = parametros.split(",");
					var propiedades = new Array();
					var literales = new Array();
					var animacion = new Array();
					if(objElement.css('position') == 'static'){
						objElement.css('position', 'relative')
					}
					for(x=0;x<movimientos.length;x++){						
						elemento = movimientos[x].split(":");
						//console.log(elemento[0] + "--" + elemento[1])				
						propiedades[x] = elemento[0];
						switch(propiedades[x]){
							case 'left':
								literales[x] = "-="+elemento[1];
								break;
							case 'right':
								propiedades[x] = "left";
								literales[x] = "+="+elemento[1];
								break;
							case 'top':
								literales[x] = "-="+elemento[1];
								break;
							case 'bottom':
								propiedades[x] = "top";
								literales[x] = "+="+elemento[1];
								break;
						}						
						animacion[propiedades[x]] = literales[x];
					}
					//console.log(animacion)
					objElement.animate(animacion)
					
					//.delay(retraso)		
				}
			}
			
			/* CLASE "move" MOVEMOS UN ELEMENTO DE UNA POSICION A OTRA DADA */
			if (efecto=="moveto")
			{
				
				if (reset) {}			
				else {
					var movimientos = parametros.split(",");
					var propiedades = new Array();
					var literales = new Array();
					var animacion = new Array();
					if(objElement.css('position') == 'static'){
						objElement.css('position', 'relative')
					}
					for(x=0;x<movimientos.length;x++){						
						elemento = movimientos[x].split(":");						
						propiedades[x] = elemento[0];
						if(propiedades[x]=="right")	propiedades[x] = "left";
						else if(propiedades[x] == "bottom") propiedades[x] = "top";
						literales[x] = elemento[1];
						animacion[propiedades[x]] = literales[x];
					}
					objElement.animate(animacion)
					//.delay(retraso)		
				}
			}
			
			if (efecto=="typing")
			{	
				
				var aux= new String();
				
				
				
				if (reset){
					typing_var=0;
					objElement.attr("texto", objElement.text());					
					objElement.text("");					
				}			
				else {
					texto=objElement.attr("texto").split('');
					cantidadcaracteres = texto.length;
					velocidad = parametros.split(":")[1];
					
					function pintatexto(){
						if(objElement.text().split('').length < cantidadcaracteres){
							aux += texto[typing_var];
							//console.log(aux)
							objElement.text(aux)
							typing_var++;						
						} else {
							typing_var=0;
							clearInterval(timer);
						}
						
					}
					
					timer = setInterval(pintatexto, velocidad);					
					/*
					estilos = parametros.split(",");
					console.log(estilos)
					for(x=0; x<estilos.length; x++){
						objElement.css(estilos[x].split(":")[0], estilos[x].split(":")[1])
						
					}
					//.delay(retraso)		
					*/
				}
			}
			
			/* CLASE "css" CAMBIOS EN LAS CSS */
			if (efecto=="habla")
			{				
				if (reset) {
					personajecalla = objElement.attr('calla');
					personajehabla = objElement.attr('habla');
				}
				else {
					duracion = parseInt(parametros.split(":")[1]*100);
					objElement.attr('src', 'contenidos/modulo01/personajes/'+personajehabla);
					function callarpersonaje(){
						objElement.attr('src', 'contenidos/modulo01/personajes/'+personajecalla);
					}
					setTimeout(callarpersonaje,duracion);
					//console.log(duracion)
					//.delay(retraso)		
				}
			}
		}
}
		
// =======================================================================================================================
//
//		LAS SIGUIENTES FUNCIONES IMPLEMENTAN EN SETINTERVAL INFINITO QUE IRÁ LLAMANDO A LOS MÉTODOS DEL PAGE_ELEMENTS
//											   
 setInterval(
		function()
		{ 
				FAB20_SEQUENCER_TICK(); 
		}
			,FAB20_SEQUENCER_INTERVAL );
			
			
			
function FAB20_SEQUENCER_TICK()
{
		// Esta función se ejecuta FAB20_SEQUENCER_TICKSXSECONDS por cada segundo
		//msg_debug(" <font color='RosyBrown'> [Iteracion FAB20_SEQUENCER]::" + FAB20_SEQUENCER_ITERACION+"</font>")
		FAB20_SEQUENCER_ITERACION ++;
		
		$("#sequencerinfo").each(function (){
			$(this).html(" [TOT:" + FAB20_SEQUENCER_ITERACION+ "] [PAGE:"+PAGE_ELEMENTS.time+"] ")
			})
			
		PAGE_ELEMENTS.doNextAction()
			
} 



