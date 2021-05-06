//
//
//		DEFINIMOS CLASE FAB20SOUND PARA GESTIONAR UNA PREGARGA DE SONIDO E INSTANCIAMOS OBJETO PAGESOUND
//
//
//============================================================================================================

// FUNCIONES DE USO COMPARTIDO PARA LAS CLASES FAB20SOUND Y FAB20SOUNDIE8

// Añade una secuencia
_sound_addSecuenceName=function(name,init,duration)
	{
		//alert(	this.secuences.length)
		var obj=new Object();
		
		obj.name=name
		obj.init=init
		obj.duration=duration
		this.secuences[this.secuences.length]=obj
		
	}
// Busca internamente una secuenca
_sound_findSecuence=function(name)
	{
		var encontrado=false
		var cont
		var obj=null
		
		for(cont=0;((cont<this.secuences.length)&&(!encontrado));cont++)
		{
			 
			if (this.secuences[cont].name==name)
			{	
				encontrado=true
				obj=this.secuences[cont]
			}
		}
	
		if (encontrado)
		{
			 
			return obj
		}
		else
		{
			 
			return null
		}
		
			
	}

	
_sound_getStringSecuence=function(name)
	{
	 
		var secuencia=this.findSecuence(name)
		if (secuencia!=null)
		{
			 
			return "Nombre:"    + secuencia.name +	
				   " Inicio:"	+ secuencia.init +
				   " Duracion:" + secuencia.duration;
		}
		else
		{
			 
			return "";
		}
		 
		
	}
	
_sound_loadSecuencesDefinitions=function()
	{
		var scope=this
		
		$(".FAB20_SOUND_DEFINITIONS div").each(function(){
		
			 
			msg_debug(" <font color='blue'>LOAD SOUND DEFINITION:"+$(this).attr("name")+ " From:" + $(this).attr("from")+ " Duration:" + $(this).attr("duration")+ "</font>")
			scope.addSecuenceName($(this).attr("name"),
											parseFloat($(this).attr("from")),
											parseFloat($(this).attr("duration")))
		
		})
	}

_sound_playSegmentSecuence=function(name,fn)
{
	var sec=this.findSecuence(name)
	if (sec!=null)
	{
		this.playSegment(sec.init,sec.duration,fn)
	}
}
	
FAB20SOUND = function ()
{
	this.myaudio=null
	this.canplay = false 
	this.timeSoundIntervalOn=null
	this.timeSoundIntervalOff=null
	this.timeSoundIntervalCallback=null
	this.file=null
	this.secuences=null
	
	
	// Inicializa el objeto de audio  ------------------------------------------------------------------------
	this.init=function(f,funciononload_){
		scope=this
		this.reset()
		this.funciononload=funciononload_
		this.file=f
		this.secuences = new Array()
		// ........................
		//  COMPATIBILIDAD CON IPAD: En los ipad no funciona correctamente la carga del objeto y es necesario
		//  iniciarlo y pausarlo para que comience a precargar.
		//  this.myaudio= new Audio(f)
		this.myaudio= new Audio()
		this.myaudio.preload="auto"
		this.myaudio.src=f
		msg_debug(" <font color='orange' >  iniciando carga audio " + this.myaudio.src+ " </font>")
		this.myaudio.preload="auto"
		this.myaudio.play();
		this.myaudio.pause();
		
		this.myaudio.oncanplay = function() {
			//A partir de aqui puedo reproducir
		}
		
		this.myaudio.onprogress = function() {
			//alert("Downloading video");
		}
		
		this.myaudio.addEventListener("canplaythrough", function (e) {
				
				msg_debug(" <font color='orange' > [canplaythrough] cargado audio " + e.target.src + " </font>")
				scope.canplay = true
				if (scope.funciononload) 
				{
					scope.funciononload()
					scope.funciononload=null
				}
				//scope.myaudio.removeEventListener('canplaythrough');
				//alert('The file is loaded and ready to play!');
				}, false);
 
		this.myaudio.addEventListener("timeupdate", function () {
				 
					
					if (scope.timeSoundIntervalOff!=null)
					{
						//msg_debug(" <font color='blue'>  pos: "+scope.myaudio.currentTime.toFixed(2) +"  fin:"+scope.timeSoundIntervalOff+"  </font>")
						if (scope.timeSoundIntervalOff<=scope.myaudio.currentTime) 
						{	
							msg_debug(" <font color='blue'>  STOP </font>")
							scope.stop()
							scope.timeSoundIntervalOn=null
							scope.timeSoundIntervalOff=null
							scope.myaudio.currentTime = 0
							if (scope.timeSoundIntervalCallback!=null)
							{
								scope.timeSoundIntervalCallback()
								scope.timeSoundIntervalCallback=null
							}
							
						}
					}
				}, false);
	 			 
	}

	// Metodos de uso compartido con las dos clases sound ........................................................
	this.addSecuenceName=_sound_addSecuenceName
	this.findSecuence=_sound_findSecuence
	this.getStringSecuence=_sound_getStringSecuence
	this.loadSecuencesDefinitions=_sound_loadSecuencesDefinitions
	this.playSegmentSecuence=_sound_playSegmentSecuence
	
	// Funciones de reproduccion ..................................................................................
	this.play=function ()
	{
		if (this.canplay) this.myaudio.play();
	}
	
	this.resume=function ()
	{
		if (this.canplay) this.myaudio.play();
	}


	this.pause=function ()
	{
		if (this.canplay)  this.myaudio.pause();
	}

	
	this.stop=function ()
	{
		
		if (this.canplay) 
		{
			this.myaudio.currentTime = 0
			this.myaudio.pause();
		}
	}
	
	// Reproduce el audio desde un punto y hasta una duracion  en concreto.
	this.playSegment=function (inicio, duracion, fn)
	{
		if (this.canplay)
		{
			
			msg_debug(" <font color='blue'> ["+ this.file +"] START at "+inicio+" </font>")
			
			this.myaudio.currentTime = inicio
			this.timeSoundIntervalOn=inicio
			this.timeSoundIntervalOff=inicio +  duracion
			this.timeSoundIntervalCallback=fn
			this.myaudio.play();
			
		}
	}
	// Resetea el objeto de audio  ---------------------------------------------------------------------------
	this.reset=function ()
	{
		if (this.myaudio!=null)  this.stop()
		this.myaudio=null
		this.canplay = false 
		this.timeSoundIntervalOn=null
		this.timeSoundIntervalOff=null	
		this.file=null	
		this.secuences=null		
	}

}

// SE DEFINE UN OBJETO PARA COMPATIBILIDAD CON IE8 EL CUAL NO HARA POR AHORA NADA, PERO EN UN FUTURO PODRIA
// HACER LAS MISMAS ACCIONES POR MEDIO DE UN OBJETO FLASH

FAB20_NO_SOUND = function ()
{
	this.myaudio=null
	this.canplay = false 
	this.timeSoundIntervalOn=null
	this.timeSoundIntervalOff=null
	this.timeSoundIntervalCallback=null
	this.file=null
	this.timeoutcallback=null	
	
	// Inicializa el objeto de audio  ------------------------------------------------------------------------
	this.init=function(f,funciononload){
			this.secuences = new Array()
			// Dado que no cargamos ningun audio lo que hacemos es llamar a la función callback inmediatamente.
			funciononload()	
	}
	
	
	// Metodos de uso compartido con las dos clases sound ........................................................
	this.addSecuenceName=_sound_addSecuenceName
	this.findSecuence=_sound_findSecuence
	this.getStringSecuence=_sound_getStringSecuence
	this.loadSecuencesDefinitions=_sound_loadSecuencesDefinitions
	this.playSegmentSecuence=_sound_playSegmentSecuence
	
	// Metodos de reproduccion ...................................................................................
	this.play=function ()	{	}
	this.resume=function ()	{	}
	this.pause=function ()	{	}
	this.stop=function ()	{	}
	
	// Reproduce el audio desde un punto y hasta una duracion  en concreto.
	this.playSegment=function (inicio, duracion, fn)
	{
		// No reproducimos audio, pero sin embargo ejecutamos la función callback una vez transcurrido el tiempo
		//
		// Hemos de controlar que en el avance de página el timeout desaparezca con lo cual en el reset liberaremos la
		// ejecución timeout para que no se ejecute
		
		if (this.timeout!=null) // Si hay algun timeout pendiente lo eliminamos, es decir, uno machaca al otro.
		{
			this.reset()
		}
		var scope=this;
		if (fn!=null)	this.timeout=setTimeout(function(){ scope.timeout=null;fn(); }, Math.round(duracion*1000));
		
	}
	// Resetea el objeto de audio  ---------------------------------------------------------------------------
	this.reset=function ()
	{
		// Si habia alguna funcion timeout pendiente la eliminamos
		if (this.timeout!=null)	  clearTimeout(this.timeout);
		this.timeout=null
		
		if (this.myaudio!=null)  this.stop()
		this.myaudio=null
		this.canplay = false 
		this.timeSoundIntervalOn=null
		this.timeSoundIntervalOff=null	
		this.file=null	
		this.secuences=null				
		
	}

}

//  Por compatibilidad con IE8 instanciamos el objeto desde una clase u otra. No obstante por el momento en 
// ie8 no funciona el objeto.
if ((isIE8())||(isIPAD())) 	soundPage=new FAB20_NO_SOUND()
else 			soundPage=new FAB20SOUND()

