	
// FUNCIONES RELACIONADAS CON LA CARGA DE EFECTOS DE SONIDO PARA UTILIZARLOS A LO LARGO DEL INTERFAZ
//
//	Cargará un xml para el interfaz (soundfx_interfaz.xml)  con las definiciones de sonidos.
//
//



 		// Objeto que contiene todos los textuales
FAB20SOUNDFX = function()
{
	this.SOUND_FX=[]

	
	
	
	this.init=function ()
	{
		
	}
	
	this.load=function(xmlFX)
	{
		if (!((isIE8())||(isIPAD()))) this.loading(true)
		else msg_debug("<font size='1' color='darkblue'> API FX NO COMPATIBLE IPAD Y IE8 </font>");
		// Cargamos el objeto XML
		var DIRBASE_url="contenidos/xml/";
		var DIRBASE_FX="contenidos/fx/";
		var scope=this
		
		var tmpFX=null
		msg_debug(" <font size='1' color='darkblue'> =========== INICIAMOS CARGA DE EFECTOS DE SONIDO " + DIRBASE_url +  xmlFX + "</font>")
		var tmpXMLContent=AJAX_cargaSincronaXML(DIRBASE_url+ xmlFX);
		$(tmpXMLContent).find('fx').each(function (){
	
			msg_debug("<font size='1' color='darkblue'> LECTURA TEXTUAL ID[" +$(this).attr("id")+ "] ARCHIVO:"+	$(this).attr("audio")+"</font>");
		
			if (!((isIE8())||(isIPAD()))) 
			{		
				tmpFX=new Object()
				
				tmpFX.loaded=false;
				tmpFX.id=$(this).attr("id")
				tmpFX.src=DIRBASE_FX+$(this).attr("audio")+".mp3"
				tmpFX.audio=new Audio(tmpFX.src)//new FAB20SOUND()
				tmpFX.audio.miFX=tmpFX
				
				
				
				tmpFX.audio.oncanplaythrough = function(e) {
						msg_debug("<font size='1' color='blue'> Loaded ("+e.target.miFX.id+")[" + e.target.src+ "] </font> " );
						
						e.target.miFX.loaded=true
						SOUND_FX.checkAudioPreload()  // LLamamos al método que comprueba si esta habilitados todos los mp3
						
						
					};
				scope.SOUND_FX[$(this).attr("id")]=tmpFX
			  }
				
			})	
		msg_debug(" <font size='1' color='darkblue'> =========== FIN INICIO CARGA DE EFECTOS DE SONIDO </font>")
	}
	
	// Para el audio
	this.stopFX= function(id)
	{
			//alert("Intentamos reproducir " +this.SOUND_FX.length )
			//for (i in this.SOUND_FX) alert(i)
			if (!((isIE8())||(isIPAD())))
			{	
				if(this.SOUND_FX[id]==null) 
				{
					msg_debug("<font color='red' >Audio no definido</font>")
				}
				else
				{
					if (this.SOUND_FX[id].loaded)
					{
						msg_debug("<font color='green'>Reproducimos audio "+ id +"</font>")
						this.SOUND_FX[id].audio.currentTime=0
						this.SOUND_FX[id].audio.pause()
						 
						
					}
					else
					{
						msg_debug("<font color='red'>Audio "+ id +" definido pero no esta aun precargado</font>")
						
						
					}
				}
			}
			else
			{
				msg_debug("<font color='red' >SOUND FX no compatible IE8 o IPAD</font>")
			}
				
	}
	
	// Pausa el audio
	this.pauseFX= function(id)
	{
			//alert("Intentamos reproducir " +this.SOUND_FX.length )
			//for (i in this.SOUND_FX) alert(i)
			if (!((isIE8())||(isIPAD())))
			{	
				if(this.SOUND_FX[id]==null) 
				{
					msg_debug("<font color='red' >Audio no definido</font>")
				}
				else
				{
					if (this.SOUND_FX[id].loaded)
					{
						msg_debug("<font color='green'>Reproducimos audio "+ id +"</font>")
						//this.SOUND_FX[id].audio.currentTime=0
						this.SOUND_FX[id].audio.pause()
						 
						
					}
					else
					{
						msg_debug("<font color='red'>Audio "+ id +" definido pero no esta aun precargado</font>")
						
						
					}
				}
			}
			else
			{
				msg_debug("<font color='red' >SOUND FX no compatible IE8 o IPAD</font>")
			}	
	}
	
	
	// Reproduce un audio
	this.playFX= function(id,fn){
			//alert("Intentamos reproducir " +this.SOUND_FX.length )
			//for (i in this.SOUND_FX) alert(i)
			if (!((isIE8())||(isIPAD())))
			{	
				if(this.SOUND_FX[id]==null) 
				{
					msg_debug("<font color='red' >Audio no definido</font>")
				}
				else
				{
					if (this.SOUND_FX[id].loaded)
					{
						msg_debug("<font color='green'>Reproducimos audio "+ id +"</font>")
						//this.SOUND_FX[id].audio.currentTime=0
						this.SOUND_FX[id].audio.play()
						if (fn!=null)
						{
							this.SOUND_FX[id].audio.onended=function ()
							{
								fn()
							}
						}
						
					}
					else
					{
						msg_debug("<font color='red'>Audio "+ id +" definido pero no esta aun precargado</font>")
						
						
					}
				}
			}
			else
			{
				msg_debug("<font color='red' >SOUND FX no compatible IE8 o IPAD</font>")
			}
			
	}
	
	
	// Chequea si se han precargado todos los audios para permitir continuar con la carga del interfaz
	this.checkAudioPreload=function()
	{
		var cargados=0
		var total=0
		var precargado=true;
		for(i in this.SOUND_FX)
		{
			total=total+1
			if (this.SOUND_FX[i].loaded==false)
			{
				precargado=false 
			}
			else
			{
				cargados++
			}
		}
		
		var porcentaje=Math.round(cargados/total*100)
		if (!precargado) msg_debug("<font color='blue'> Audios no precargados .. " + porcentaje + "</font>")
		else{
				msg_debug("<font color='blue'> Audios  precargados .. " + porcentaje + "</font>")
				
				this.loading(false)
		}
		 
		return porcentaje
		
		
	}
	
	
	// Esta funcion indica que los audios se están cargando (podriamos deshabilitar la navegacion y mostrar algun 
	// mensaje en algun sitio
	this.loading=function (activo)
	{
		if(activo)
		{
			//$('#cargador').addClass("loading"); 
		}
		else
		{
			//$('#cargador').removeClass("loading"); 
		}
	
	}

}



