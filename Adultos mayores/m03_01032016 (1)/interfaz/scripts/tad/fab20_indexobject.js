// ========================================================================================================
//
// 		CLASE QUE DEFINE UN OBJETO DE TIPO INDICE DE CONTENIDO (INDEXOBJECT)
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 14/3/2011
//
// ========================================================================================================



// Funcion que inicializa el objeto
_init_indexObject= function (xml)
{
	var auxContenido=null;
	
	
	// Cargamos el objeto XML
	this.xmlObj=AJAX_cargaSincronaXML(this.xmlURL);
	
	
	this.curso=$(this.xmlObj).find('curso:first').text();
	this.unidad=$(this.xmlObj).find('ud:first').text();
	// Buscamos el elemento <contenido>
	auxContenido=$(this.xmlObj).find('contenido:first');
		// Creamos el indice de tipo INDEX_ELEMENT
		 msg_debug( auxContenido.length);
 		 msg_debug( auxContenido[0].nodeName);
		
		
		// Cargamos el elemento contenido con el metodo "loadElement"
		this.indice=new INDEX_ELEMENT();
		this.indice.loadElement(auxContenido[0]);
		this.enumPages(this.indice,0)
		this.totalPages=this.countPages(this.indice)
		 

}
//
_getMenuHTML_indexObject=function()
{
	//alert(this.indice.elementToHTML())
	//alert("getMenuHTML")
	return this.indice.elementToHTML(this);
}

_getRutaBase_indexObject=function()
{
	return this.indice.ruta
}

// carga un archivo html en la capa de contenido
_loadURL_indexObject=function(url)
{
	var base
	base=this.getRutaBase()
	AJAX_cargarHTMLFiltro(F20_CAPA_BODY,base + "//" + url + ".htm","",base,true)	
	//initAllComponents()
	msg_debug("Carga del contenido: " + url  + ".htm"+ " en el directorio base: "+ base)
}
// Automatiza el procedimiento que realiza _getALLHTMLfromObjPag_indexObject, llamando directamente a "indice" y almacenando el resultado en una cache
_getALLHTML_indexObject=function()
{
	if (this.CACHE_CONTENT_HTML!="")
	{
		//alert("Ya esta hecho")
		return this.CACHE_CONTENT_HTML
	}
	else 
	{
		//alert("Es la primera vez y tenemos que calcularlo")
		this.CACHE_CONTENT_HTML=this.getALLHTMLfromObjPag(this.indice)
		return this.CACHE_CONTENT_HTML
	}
	
}

// Obtiene un STRING con todos los contenidos HTML que partan del objPage 
_getALLHTMLfromObjPag_indexObject=function(auxind)
{
	 var encontrado=false   
	 var cont
	 var auxChild
	 
	 var RESULTADOHTML =""
	 
	 msg_debug(" FUNCION getALLHTMLfromObjPag("+auxind+") => Pagina: "  + auxind.index +  " Titulo: " + auxind.titulo + "  Ruta: " +  + auxind.src + "clase: " +  auxind.clase)
	 
	 // Comprobamos si es página o contenido o apartado
	 if (auxind.clase=="pagina")
	 {
		 msg_debug(" ... es Pagina")
		 // RESULTADOHTML = "<h2>"  + auxind.index +  " " + auxind.titulo + "</h2>" +  this.getHTMLfromObjPag(auxind) + ""  CON NUMERACION  DE APARTADOS/PÁGINAS 
		 RESULTADOHTML = "<h2>"  + auxind.titulo + "</h2>" +  this.getHTMLfromObjPag(auxind) + "" // SIN NUMERACION
	 }
	 else if ((auxind.clase=="apartado")||(auxind.clase=="contenido")) 
	 {
		msg_debug(" ... es Apartado o Contenido")
		// Incluimos el texto del apartado
		if (auxind.clase=="apartado")
		{
			msg_debug(" ... es Apartado")
			// RESULTADOHTML = "<h1>"  + auxind.index +  " " + auxind.titulo + "</h1>" CON NUMERACION  DE APARTADOS/PÁGINAS
			RESULTADOHTML = "<h1>" + auxind.titulo + "</h1>" // SIN NUMERACION
			// En caso de que el apartado tenga un SRC
			if((auxind.src!="")&&(auxind.src!=null))
			{
				 RESULTADOHTML = this.getHTMLfromObjPag(auxind)
			}
		}

		msg_debug(" ... num elementos " + auxind.elements.length)
	// Para cada elemento contenido dentro del apartado llamamos nuevamente a la función	 
		if (auxind.elements.length>0)
		{
			 msg_debug(" ... procesamos hijos " + auxind.elements.length)
			 for(cont=0;cont<auxind.elements.length;cont++)
			 {
				  msg_debug(" ... procesamos hijo " + cont)
				  RESULTADOHTML =  RESULTADOHTML  + this.getALLHTMLfromObjPag(auxind.elements[cont])
			 }
		}

	 }
	 
	 //msg_debug("Función _elementToHTML_indexElement ")
	 
	 return RESULTADOHTML	
	
	
}
// Obtiene un string con el contenido HTML del objPage indicado como parámetro
_getHTMLfromObjPag_indexObject=function(ObjPage)
{
	
	var base=this.getRutaBase()
	var url=ObjPage.src

	return AJAX_getHTMLAsincrono(base + "//" + url + ".htm","",base)
	//msg_debug("Carga del contenido: " + url  + ".htm"+ " en el directorio base: "+ base)
}



// Carga la pagina en la capa body
_loadPage_indexObject=function (idPagina)
{
	var url=""
	var auxIndice=""
	
	msg_debug("LOADPAGE::: IdPagina= " + idPagina)
	// buscamos el nodo con nombre "idPagina"
	auxIndice=this.findPage(idPagina,this.indice)
	
	if ((auxIndice.clase=="apartado")&&((auxIndice.src==null)||(auxIndice.src=="")))
	{
		msg_debug("LOADPAGE::: auxIndice=" + auxIndice.index + " sin SRC. Intentamos cargar " + auxIndice.index + "_1")
		this.loadPage(auxIndice.index+ "_1")
	}
	else
	{
		msg_debug("LOADPAGE::: auxIndice=" + auxIndice + " (" + auxIndice.numpagina+ "/"+this.numPages() +")  " + auxIndice.src )
		this.loadObjPage(auxIndice)
	}
	
	// LLamamos al evento definido para actualizar el cambio de estado
	if (this.onStatusChange!=null) this.onStatusChange()
	
	
}
_loadObjPage_indexObject=function(auxIndice)
{
	

	// establedemos el nodo como página actual
	this.pagActual=auxIndice
	this.loadURL(auxIndice.src)
	if (auxIndice.esContenido())
	{
		auxIndice.accedido=true
	}
	JSTHEME_refresh()
	
}

// devuelve null o una referencia al nodo que contiene el idPagina
_findPage_indexObject=function(idPagina,auxind)
{
	 
	 var encontrado=false   
	 var cont
	 var auxChild
	 
	 
	 if (auxind.clase=="pagina")
	 {
		 
		 // Si es una página comprobamos si es el nodo buscado.
		if(auxind.index==idPagina)
		{
			encontrado=true
			return auxind
		}
		else
		{
			// si no es, al no tener hijos, finalizamos la busqueda
			encontrado=false
			return null
		}
		
	 }
	 else if ((auxind.clase=="apartado")||(auxind.clase=="contenido")) 
	 {
		 // Si es un apartado o contenido 
		
		if(auxind.index==idPagina)
		{
			encontrado=true
			return auxind
		}
		else
		{
			// Comprobamos con los hijos
		
			if (auxind.elements.length>0)
			{
				 for(cont=0;(cont<auxind.elements.length&&!encontrado);cont++)
				 {
					 auxChild=this.findPage(idPagina,auxind.elements[cont])
					 if (auxChild!=null)
					 {
						 encontrado=true
						 return auxChild
					 }
					 
				 }
			}
			else
			{
				encontrado=false
				return null
			}
		}
	 }
	 
	 //msg_debug("Función _elementToHTML_indexElement ")
	 
	 return null

	   
}


_countPages_indexObject=function(auxind)
{
	 var encontrado=false   
	 var cont
	 var auxChild
	 
	 var total=0
	 
	 if (auxind.clase=="pagina") 
	 {

		total=1
		
	 }
	 else if ((auxind.clase=="apartado")||(auxind.clase=="contenido")) 
	 {


		// Si es un apartado o contenido 
		if ((auxind.clase=="apartado")&&(auxind.src!="")&&(auxind.src!=null))
		{
			total=1
		}
		
		if (auxind.elements.length>0)
		{
			 for(cont=0;cont<auxind.elements.length;cont++)
			 {
				 total=total + this.countPages(auxind.elements[cont])
			 }
		}
			 
	 
	 }
	 
	 //msg_debug(" Numero de elementos de " + auxind.index + "  " + total )
	 
	 return total
}
_numPages_indexObject=function()
{
	return this.totalPages
}

_enumPages_indexObject=function(auxind,n)
{
	 var encontrado=false   
	 var cont
	 var auxChild
	 var totalPages=0
	 
	 
	 var total=0
	 
	 if (auxind.clase=="pagina") 
	 {
		n=n+1
		auxind.numpagina=n
		return n
		
	 }
	 else if ((auxind.clase=="apartado")||(auxind.clase=="contenido")) 
	 {


		// Si es un apartado o contenido 
		if ((auxind.clase=="apartado")&&(auxind.src!="")&&(auxind.src!=null))
		{	
			n=n+1
			auxind.numpagina=n
			
			
		}
		
		if (auxind.elements.length>0)
		{
			 for(cont=0;cont<auxind.elements.length;cont++)
			 {
				n= this.enumPages(auxind.elements[cont],n)
			 }
		}
		return n	 
	 
	 }
	 
	 //msg_debug(" Numero de elementos de " + auxind.index + "  " + total )
	 
	 return total	
	
}
// Nos devuelve un vector con los indices de los nodos desde el actual hasta el primero  ["1","1_1","1_1_1"]
_getIndicesFromActual_indexObject=function()
{

// Obtiene un header tittle (titulo de la cabecera) de los dos primeros nveles
	var strout
	var auxObj=this.pagActual
	if (auxObj!=null)
	{
	//	alert("indicesfromactual")
		strout=""
		do{
			//if (strout!="")  strout= "&gt;&gt;" + strout  
		 if(strout!="")  strout=auxObj.index + "Ç" +  strout
		 else strout=auxObj.index
		 auxObj=auxObj.parent
		}
		while(auxObj.parent!=null)	
		
		var titulos=strout.split("Ç")
	}
	else titulos=[]
	
return titulos
	
}

_getHeaderTittle_indexObject=function()
{
	
	// Obtiene un header tittle (titulo de la cabecera) de los dos primeros nveles
	var strout
	var auxObj=this.pagActual
	strout=""
	do{
		//if (strout!="")  strout= "&gt;&gt;" + strout  
	 if(strout!="")  strout=auxObj.titulo + "Ç" +  strout
	 else strout=auxObj.titulo
	 auxObj=auxObj.parent
	}
	while(auxObj.parent!=null)	
	
	var titulos=strout.split("Ç")
	strout=""
	strout= "<div class='titulo'>"+this.unidad+"</div><div class='subtitulo'>"+titulos[0]+"</div>"

	
	return  strout
}
_getRastroMigas_indexObject=function()
{
	var strout
	var auxObj=this.pagActual
	strout=""
	do{
		//if (strout!="")  strout= "&gt;&gt;" + strout  
	 strout=" " + "<p class='rastromigas'><a href='#' onclick=\" indiceUnidad.loadPage('" + auxObj.index+ "')\">"+ auxObj.titulo+"</a></p>" +  strout
	 auxObj=auxObj.parent
	}
	while(auxObj.parent!=null)	
	
	return  strout
}

_nextPageAnim_indexObject=function()
{
	$('#fab20_body').fadeOut(400, function() {        
														  
						  indiceUnidad.nextPage();
						$("#fab20_body").fadeIn(400);
																  });

}
_nextPage_indexObject=function()
{
	
	return this.nextPageFromElement(this.pagActual)
}
_nextPageFromElement_indexObject=function(this_pagActual)
{	
	var siguiente=null
	var logrado=false
	var auxsig=null
	
	//this.parent
	//this.next=null;
	//this.previous=null;
	//this.index=""
	if (this_pagActual==null) this.firstPage()
	else
	{
		if(this_pagActual.clase=="apartado")
		{
			// Si la página actual es la portada de un apartado se debe de continuar por las páginas contenidas en el mismo
			//msg_debug(" Siguiente desde la portada de un apartado " + this_pagActual.elements.length) 
			if(this_pagActual.elements.length>0)
			{
				siguiente=this_pagActual.elements[0]
				logrado=true
			}
			else 
			{
				// Si el apartado no tiene páginas, continuaríamos con el siguiente elemento del mismo nivel
				if(this_pagActual.next!=null) 
				{
					logrado=true
					siguiente=this_pagActual.next
				}
			}
		}
		else if (this_pagActual.clase=="pagina")
		{
			// Si el contenido actual es una página, accedemos a la siguiente configurada
			//msg_debug(" Siguiente desde la portada de una pagina ") 
			if(this_pagActual.next!=null) 
			{
				logrado=true
				siguiente=this_pagActual.next
			}
		}
		
		if (logrado==false)
		{
			// Si llegado a este punto no hemos localizado la siguiente página a mostrar significa que:
			//
			//		- La siguiente página no esta al mismo nivel
			//		- La siguiente página no esta aumentando el nivel
			//
			// Con lo cual se ha de buscar en el parent, siempre y cuando el index de la página actual tenga al menos 2 niveles (x_x)
	
			//msg_debug("NEXT::: auxIndice=" + auxIndice.index + "  y nivel " + this_pagActual.getLevel() + " sig=" + this_pagActual.next	)
			if(this_pagActual.getLevel()>=2)
			{
				// Accedemos al parent.next
				auxsig=this_pagActual
				// Existe un nivel superior, con lo cual buscamos el siguiente elemento a mostrar desde el parent.
				do
				{
	
					// Accedemos al parent.next
					auxsig=auxsig.parent
					//msg_debug("NEXT::: auxIndice=" + auxIndice.index + "  y nivel " + this_pagActual.getLevel())
					if (auxsig.next!=null)
					{
						logrado=true
						siguiente=auxsig.next					
					}
					// Si es null significa que hay que buscar en otro nivel superior (BUCLE) hasta nivel 1
				}while (!((logrado)||(auxsig.getLevel()==1)))
			}
			else
			{
				// Si no hay siguiente nodo, no hay hijos y estamos en el primer nivel significa que estamos al final del indice
			}
		}
		if (siguiente!=null)
		{
			// Puede ocurrir que el objeto Siguiente localizado sea un apartado sin SRC, con lo cual no sería valido
			// en tal caso se debe de comprobar con la siguiente posibilidad.
			if ((siguiente.clase=="apartado")&&((siguiente.src==null)||(siguiente.src=="")))
			{
				
				// Tenemos que probar con su hijo
				logrado=this.nextPageFromElement(siguiente)
						
			}
			else
			{
				logrado=true
				this.loadObjPage(siguiente)
			}
			
			
		}
		
		// LLamamos al evento definido para actualizar el cambio de estado
		if (this.onStatusChange!=null) this.onStatusChange()
	}
	return logrado
	
}
_previousPageAnim_indexObject=function()
{
	$('#cuerpo').fadeOut(400, function() {        
														  
						  indiceUnidad.previousPage();
						$("#cuerpo").fadeIn(400);
										  });
}

_previousPage_indexObject=function()
{
	var resultado=this.previousPageFromElement(this.pagActual)
	return 
}

_previousPageFromElement_indexObject=function(this_pagActual)
{
	var anterior=null
	var logrado=false
	var auxAnterior=null
	
	//this.parent
	//this.next=null;
	//this.previous=null;
	//this.index=""
	if (this_pagActual==null) this.firstPage()
	else
	{
		if(this_pagActual.previous!=null) 
		{
			
			// Estando tanto en una portada de apartado o en una pagina, si hay anterior en el mismo nivel accedemos a el  
			if (this_pagActual.previous.clase=="pagina")
			{
				// Si es una página accedemos a ella como la anterior
				logrado=true
				anterior=this_pagActual.previous
			}
			else if (this_pagActual.previous.clase=="apartado")
			{
				auxAnterior=this_pagActual.previous
				
				while ((auxAnterior.elements.length>0)&&(auxAnterior.lastElement().clase=="apartado"))
				{
					auxAnterior=auxAnterior.lastElement()
				}
				if(auxAnterior.elements.length>0)
				{
					logrado=true
					anterior=auxAnterior.lastElement()
				}
				else
				{
					
					logrado=true
					anterior=auxAnterior
					
				}
			}
		}
		else if(this_pagActual.previous==null) 
		{
			//msg_debug(" Bajamos nivel??? " + this_pagActual.index + "  level: " + this_pagActual.getLevel()  + "  " + this_pagActual.parent)
			// Si estamos en un nivel 2 o superior saltamos al parent
			if(this_pagActual.getLevel()>=2)
			{
				logrado=true
				anterior=this_pagActual.parent
			}
		
		}
		if (anterior!=null)
		{
			
				if ((anterior.clase=="apartado")&&((anterior.src==null)||(anterior.src=="")))
				{
					// El nodo localizado no es valido y hay que buscar el anterior a este
					logrado=this.previousPageFromElement(anterior)
				}
				else
				{
					logrado=true
					this.loadObjPage(anterior)
				}
		}
	
		// LLamamos al evento definido para actualizar el cambio de estado
		if (this.onStatusChange!=null) this.onStatusChange()
	}
	return logrado
	
}
_firstPage_indexObject=function()
{
	if (this.indice.elements.length>0)
	{
		  return this.loadPage("1")	
	}
	else
	{
		return false
	}
}
_lastPage_indexObject=function()
{
	if (this.indice.elements.length>0)
	{
  	    return this.loadPage((this.indice.elements.length)+"")	
		
	}
	else
	{
		return false
	}
	
	
}

// Funcion relacionada con el seguimiento scorm. Devuelve una cadena STRING que representa el avance de 
// cada página, con un 0 o 1 dependiendo de si se ha accedido previamente o no.
//
// Un ejemplo de la estructura es la siguiente:
//
//			['C',0,0,['-',1,0,['-',1,1,0],0,['-',0,0,0]],[0,0,0,0],0] 
//
//
//	es un Array de Arrays, donde la página 1 siempre coincide con la posición 1
//  la portada del apartado coincide con la posición 0
//  si no hay portada aparecerá el string '-'
//  si es el raiz aparece "C"

_getSerializeContentAccess_indexObject=function()
{
	var strData=this.indice.elementSerializeToString()
	msg_debug("------------- GET-SERIALIZACION ------------");
	msg_debug(strData);
	msg_debug(" Páginas accedidas " + this.countPagesCompleted(this.indice) + "/" +  this.countPages(this.indice))
	msg_debug(" Prógreso " + Math.round(this.countPagesCompleted(this.indice)/ this.countPages(this.indice)*100 ))
	msg_debug("--------------------------------------------");
	return strData	
}

// A partir de una estructura tal como la definida en la función "_getStringPageAccess_indexObject" recarga 
// el atributo "accedido" de cada elemento del arbol de contenidos.
_setSerializeContentAccess_indexObject=function(strData)
{
	var vData
	
	msg_debug("------------- SET-SERIALIZACION ------------");
	msg_debug("Valor a serializar:: " + strData);
	msg_debug(" ESTADO ANTES DE SERIALIZAR Páginas accedidas " + this.countPagesCompleted(this.indice) + "/" + 	this.countPages(this.indice))

	// Obtenemos un vector a partir de strData
	try{ vData=eval(strData)}
	catch(e)
	{ 
		msg_error("_setSerializeContentAccess_indexObject=function(strData) ==> Error " + e.toString())}
	
	
	// Recargamos el estado en base a la estructura
	/*msg_debug("Vector recuperado:: " + vData.toString())
	msg_debug("Vector recuperado:: " + vData[0])
	msg_debug("Vector recuperado:: " + vData[1])
	msg_debug("Vector recuperado:: " + vData[2])
	msg_debug("Vector recuperado:: " + vData[3][0])
	msg_debug("Vector recuperado:: " + vData[3][1])
	msg_debug("Vector recuperado:: " + vData[3][2])
	msg_debug("Vector recuperado:: " + vData[3][3][0])
	msg_debug("Vector recuperado:: " + vData[3][3][1])
	msg_debug("Vector recuperado:: " + vData[3][3][2])
	msg_debug("Vector recuperado:: " + vData[3][3][3])	
	msg_debug("Vector recuperado:: " + vData[3][4])	
	msg_debug("Vector recuperado:: " + vData[3][5])		
	msg_debug("Vector recuperado:: " + vData[4])
	msg_debug("Vector recuperado:: " + vData[5])	

	msg_debug("Recuperamos Estado......... " )	
*/
	 this.indice.elementRecoveryStatusFromString(vData)
	 
	 
	msg_debug(" ESTADO TRAS SERIALIZAR Accedidas " + this.countPagesCompleted(this.indice) + " de " + 	this.countPages(this.indice))
	msg_debug("--------------------------------------------");	
	
}	
	
	
// Obtiene el total de páginas accedidas
_countPagesCompleted_indexObject=function(auxind)
{
	 var encontrado=false   
	 var cont
	 var auxChild
	 
	 var total=0
	 
	 if (auxind.clase=="pagina") 
	 {

		if (auxind.accedido) total=1
		
	 }
	 else if ((auxind.clase=="apartado")||(auxind.clase=="contenido")) 
	 {


		// Si es un apartado o contenido 
		if ((auxind.clase=="apartado")&&(auxind.src!="")&&(auxind.src!=null))
		{
			if (auxind.accedido) total=1
		}
		
		if (auxind.elements.length>0)
		{
			 for(cont=0;cont<auxind.elements.length;cont++)
			 {
				 total=total + this.countPagesCompleted(auxind.elements[cont])
			 }
		}
			 
	 
	 }
	 
	 //msg_debug(" Numero de elementos de " + auxind.index + "  " + total )
	 
	 return total
}	
	
function _portadaActivada_indexObject()
{
	
	var portadaactivada=false
	
	// Buscamos el elemento <portada>
	var auxPortada=$(this.xmlObj).find('portada:first');

	if(   (auxPortada!=null)   &&   ($(auxPortada[0]).attr("activada")!=null))
  	{
		portadaactivada=true
		msg_debug( "[ _portadaActivada_indexObject() ] Resultado de la busqueda de <portada> : " + auxPortada.length + " ..  " + auxPortada[0].nodeName + " activo: "  + $(auxPortada[0]).attr("activada") + " src: " + $(auxPortada[0]).attr("src") );
	}
	else  msg_debug("[ _portadaActivada_indexObject() ] No esta definida la portada")
	
	return portadaactivada
	
	
}
function _getSRCPortada_indexObject()
{
	var auxSRC=""
	var auxPortada=$(this.xmlObj).find('portada:first');
	if(this.portadaActivada())
	{
		auxSRC="portada"
		if ( $(auxPortada[0]).attr("src")!=null)
		{
			auxSRC=$(auxPortada[0]).attr("src")
		}
	}
	
	return auxSRC
}


function _getProgress_indexObject()
{
	var porcentaje=0;
	var unitProgress 
	var totalUnitProgress=indiceUnidad.indice.getNumElement()
	var indice
	var auxObjUnidad
	var indAux
	//totalUnitProgress=
	var totalAccedidas=0
	var totalPag=0
	
		
	for(unitProgress=1;unitProgress<=totalUnitProgress;unitProgress++)
	{
	
		indAux="1." + unitProgress
		auxObjUnidad=indiceUnidad.indice.elements[unitProgress-1];
		totalAccedidas+=indiceUnidad.countPagesCompleted(auxObjUnidad);
		totalPag+=indiceUnidad.countPages(auxObjUnidad);

	}
	porcentaje=Math.round(totalAccedidas/totalPag*100);

	return porcentaje;
}

function _getSRCPDF_indexObject()
{
	var auxSRC=""
	var auxPortada=$(this.xmlObj).find('pdf:first');
	
	if(auxPortada!=null)
	{
		if ($(auxPortada[0]).attr("src")!=null) 	auxSRC=$(auxPortada[0]).attr("src")

	}
	
	return auxSRC
}

function _getMenuActualElement_indexObject()
{
	var id="#mnuElement_" + this.pagActual.index
	//alert(id)
	//alert($(id))
	return $(id)
}
// Constructor de la clase
function INDEX_OBJECT(url)
{
	this.xmlURL=url;	// String con la ruta de contenidos
	this.xmlObj=null;	// Objeto XML que define la estructura del contenio
	this.indice=null;	// TAD que contiene la estructura del curso
	this.pagActual=null; // Puntero a la página actual
	this.CACHE_CONTENT_HTML="";  // Cache que contendrá todo el contenido en una variable susceptible de ser impreso
	this.curso=""	//titulo del curso
	this.unidad=""	//titulo de la unidad	
	
	this.init=_init_indexObject;
	this.getMenuHTML=_getMenuHTML_indexObject
	this.getMenuActualElement=_getMenuActualElement_indexObject
	this.getRutaBase=_getRutaBase_indexObject	
	this.loadPage=_loadPage_indexObject
	this.loadURL=_loadURL_indexObject
	this.findPage=_findPage_indexObject
	this.loadObjPage=_loadObjPage_indexObject
	this.getHTMLfromObjPag=_getHTMLfromObjPag_indexObject
	this.getALLHTMLfromObjPag=_getALLHTMLfromObjPag_indexObject
	this.getALLHTML =	_getALLHTML_indexObject
	this.numPages=		_numPages_indexObject
	this.countPages=	_countPages_indexObject	
	this.enumPages=		_enumPages_indexObject


	this.getIndicesFromActual=_getIndicesFromActual_indexObject


	this.getRastroMigas=_getRastroMigas_indexObject
	this.getHeaderTittle=_getHeaderTittle_indexObject

	this.nextPageAnim=_nextPageAnim_indexObject
	this.previousPageAnim=_previousPageAnim_indexObject
	this.nextPage= 		_nextPage_indexObject
	this.nextPageFromElement= _nextPageFromElement_indexObject
	this.previousPage=	_previousPage_indexObject
	this.previousPageFromElement= _previousPageFromElement_indexObject	
	this.firstPage=		_firstPage_indexObject
	this.lastPage=		_lastPage_indexObject


	// Metodos relacionados con el seguimiento
	this.getSerializeContentAccess = _getSerializeContentAccess_indexObject
	this.setSerializeContentAccess = _setSerializeContentAccess_indexObject
	this.countPagesCompleted = _countPagesCompleted_indexObject
	this.getProgress=_getProgress_indexObject
	
	// CALLBACKS
	
	this.onStatusChange=null

	// Funciones CFG unidad
	this.portadaActivada=_portadaActivada_indexObject
	this.getSRCPortada=_getSRCPortada_indexObject
	this.getSRCPDF= _getSRCPDF_indexObject
	
	

	

}



// ========================================================================================================
//
// 		CLASE QUE DEFINE UN ELEMENTO DEL INDICE DE CONTENIDOS
//
//
//
// ========================================================================================================

 _loadElement_indexElement=function(objElement)
 {
	 var resultado=true
	 var cont=0
	 var prefijo=""
	 
	 // Admitimos 3 tipos de etiqueta en objElement
	 // => contenido
	 // => pagina
	 // => apartado
	 // msg_debug(" Inicio función de carga de Elemento Menu  ") 
	 if((objElement.nodeName=="contenido")||(objElement.nodeName=="apartado"))
	 {
		  this.clase=objElement.nodeName
		  //msg_debug(" Es un tipo contenido o tipo apartado  " + this.clase)
		 // Si es contenido dispondrá de un número de páginas y apartados, indicamos el tipo contenido
		 // Si es un apartado
	
			

		 // Cargamos los atributos del elemento
		 if   (this.clase=="contenido")
		 {
			 this.index=""
			 this.parent=null	// elemento superior
			 
		 	 this.ruta=$(objElement).attr("ruta");
			 //msg_debug(" Es un tipo contenido   " + this.ruta);
		 }
		 else if (this.clase=="apartado")
		 {
			 
			 this.id=$(objElement).attr("id");		
			 this.tipo=$(objElement).attr("tipo");
		 	 this.titulo=$(objElement).attr("titulo");
		 	 this.src=$(objElement).attr("src");
			 // msg_debug(" Es un tipo apartado  xxx");
		 }
		
	
		
		
		 msg_debug( "Carga de elemento ("+ this.index +")" +  this.clase  +
				    " Ruta:" +   this.ruta  + 
					" Id:" +   this.id  + 
					" Tipo:" +   this.tipo  + 
					" Titulo:" +   this.titulo   + 
					" Src:" +   this.src  );
		 
    	 msg_debug( "Numero de hijos " + $(objElement).children().length );
		 // Creamos tantos hijos como childrens tenga el nodoxml
		 this.elements=new Array()
		 if (this.clase=="contenido") prefijo=""	
		 else prefijo=this.index
	  	 for (cont=0;cont<$(objElement).children().length;cont++)
		 {
			 this.elements[cont]=new INDEX_ELEMENT();
			 this.elements[cont].parent=this	// relacion inversa hijo -> padre
			
			 if (cont>0)
			 {
				 this.elements[cont].previous=this.elements[cont-1]
				 this.elements[cont-1].next= this.elements[cont]
			 }
			 
	  		 
	         
			 
			 if (this.index!="") this.elements[cont].index=prefijo + "_" + (cont+1)
			 else this.elements[cont].index= "" + (cont+1)
	
 			 this.elements[cont].loadElement($(objElement).children()[cont]);
		 }
		 
		 
		 
	 }
	 else if(objElement.nodeName=="pagina")
	 {

		  //msg_debug(" Es tipo página  ")
		// Se trata de una página, con lo cual no tiene hijos
		 this.clase=objElement.nodeName
		 this.tipo=$(objElement).attr("tipo");
	 	 this.titulo=$(objElement).attr("titulo");
	 	 this.src=$(objElement).attr("src");

		 msg_debug( "Carga de elemento ("+ this.index +")" +  this.clase  +
				    " Ruta:" +   this.ruta  + 
					" Id:" +   this.id  + 
					" Tipo:" +   this.tipo  + 
					" Titulo:" +   this.titulo   + 
					" Src:" +   this.src  );


	 }
	 else
	 {
		 msgError(" Elemento irreconocible en el xml ")
		 false
	 }
	 
	 
	 	 if ($(objElement).attr("visible")!= undefined)
		 {	
		 	if ($(objElement).attr("visible")=="false")
			{ 
			 	this.visible=false;
			}
		 }
	 
	 return resultado
 }
  
 _addElement_indexElement=function()
 {
 }
 
  _getElement_indexElement=function(n)
 {
 }
 
 _getNumElement_indexElement=function()
 {
	 return this.elements.length
	 
 }


 _elementToHTML_indexElement=function(objInd)
 {
	 var strAux=""
	 var cont
	 var idElement="mnuElement_" + this.index
	 // Definimos una clase denominada mnuLevel1_Completed  
	 var estilo=" nivel"+ (this.index.split("_").length) 
	if(objInd.pagActual!=null)	if (this.index==objInd.pagActual.index) estilo=estilo + " selected"
	  //msg_debug("Función _elementToHTML_indexElement " + this.clase)
	 
	 if ((this.clase=="pagina")&&(this.visible))  // solo mostramos las hojas visibles
	 {
		 estilo=estilo + " " + idElement + " "  // el propio id lo utilizamos como clase por si se define
		 estilo=estilo + " pagina " 			
		 estilo=estilo + " " + this.tipo  
		// if(this.accedido) estilo=estilo + " completo"
		// else estilo=estilo + " sin_acceder"
		 
		 strAux= "<li id='"+idElement+ "' class='"+estilo+"' ><a href='#' onclick=\" indiceUnidad.loadPage('" + this.index+ "')\">"+ this.titulo+"</a></li>"
		 //strAux= "<li ><a href='#' onclick=\" indiceUnidad.loadPage('" + this.index+ "')\">"+ this.titulo+"</a></li>"
		 //strAux= "<li class='" + estilo + "'><a href='#' onclick=\" indiceUnidad.loadPage('" + this.index+ "')\">"+ this.titulo+"</a></li>"
	 }
	 else if ((this.clase=="apartado")||(this.clase=="contenido")) 
	 {
		 //msg_debug("Función _elementToHTML_indexElement  apartado " + this.elements.length)
		 if  (this.clase!="contenido"){
			 
			 if ((this.src!="")&&(this.src!=null))
			 {		
			 	 
		 		 estilo=estilo + " " + idElement + " "  // el propio id lo utilizamos como clase por si se define
				 estilo=estilo + " apartado " 
		 		 estilo=estilo + " " + this.tipo  				 
 			//	 if(this.accedido) estilo=estilo + " completo"
			//	 else estilo=estilo + " sin_acceder"
				 //strAux="<li class='" + estilo +"' ><a href='#' onclick=\" indiceUnidad.loadPage('" + this.index+ "')\">"+ this.titulo+"</a>"
				 strAux="<li class='" + estilo+"' id='"+idElement+ "'><div class='apartadosombra'></div><p class='apartadosup'></p><p class='apartadotext'   onclick=\" indiceUnidad.loadPage('" + this.index+ "');\">"+ this.titulo+"</p><p class='apartadoinf'></p>"				 
			 }
			else
			{
				 estilo=estilo + " " + idElement + " "  // el propio id lo utilizamos como clase por si se define				
				 estilo=estilo + " apartado " 
		 		 estilo=estilo + " " + this.tipo  
 				 estilo=estilo + " sin_portada" 
	 			 //strAux="<li class='"+estilo+"'><span>"+ this.titulo + "</span>"	
				 strAux="<li class='apartado'  id='"+idElement+ "' ><div class='apartadosombra'></div><p class='apartadosup'></p><p class='apartadotext'>"+ this.titulo+"</p><p class='apartadoinf'></p>"	
			}
		 }
		 else rutaBase=this.ruta  
		 
		 if (this.visible)  // solo añadimos los hijos cuando es visible
		 {
			 strAux=strAux +"<ul idElement='"+idElement+"' >"
			 for(cont=0;cont<this.elements.length;cont++)
			 {
				 //msg_debug("Función _elementToHTML_indexElement elemento  " + cont)		 	  
				 strAux=strAux + this.elements[cont].elementToHTML(objInd)
			 }
			 strAux=strAux +"</ul>"	
		 }
 		 if  (this.clase!="contenido") 	 strAux=strAux +"</li>"
 		  	 
	 }
	 
	 //msg_debug("Función _elementToHTML_indexElement ")
	 //alert(strAux)	
	
	 return strAux
	 
 }
 // Indica el nivel en el cual se encuentra el elemento
_getLevel_indexElement=function()
{
	var nivel=0
	
	if (this.index!="")
	{
		nivel=this.index.split("_").length
	}
	
	return nivel
}


_firstElement_indexElement=function()
{
	var valor=null
	
	if((this.clase=="apartado")||(this.clase=="contenido"))
	{
		if (this.elements.length>0)
		{
			valor=this.elements[0]
		}
	}
	return valor
}

_lastElement_indexElement=function()
{
	var valor=null
	
	if((this.clase=="apartado")||(this.clase=="contenido"))
	{
		if (this.elements.length>0)
		{
			valor=this.elements[this.elements.length-1]
		}
	}
	return valor	
}
function _esContenido_indexElement()
{
	if((this.clase=="pagina")||((this.clase=="apartado")&&(this.src!=null)&&(this.src!=""))) return true
}


// --------------------
//
//		Función relacionada con la serialización de estados accedidos/noaccedidos de cada elemento del arbol
//
//
//
//
 _elementSerializeToString_indexElement=function(rutaBase)
 {
	 var strAux=""
	 var cont
	 
	 if (this.clase=="pagina")
	 {
		 if(this.accedido)  strAux="1"
		 else strAux="0"
	 }
	 // Contenido es el elemento raiz, y apartado es un conjunto de páginas o apartados.
	 else if ((this.clase=="apartado")||(this.clase=="contenido")) 
	 {
		// En caso de no ser contenido (es un apartado) almacenamos la estructura tipo array donde la posición 0 
		// coincide con la portada del apartado. En el caso de que tenga página será 0 o 1, pero en caso de que no 
		// tenga página asociada sera '-'
		 if  (this.clase!="contenido"){
			 
			 // Si el apartado tiene definida una portada
			 if ((this.src!="")&&(this.src!=null))
			 {
				 // Si se ha accedido lo marcamos como 1, si no como 0
				  if(this.accedido)  strAux="[1"
				 else strAux="[0"
			 }
			else
			{
	 			// En el caso de no tener definida una portada indicamos el valor '-' 
				strAux="['-'"
			}
		 }
		 else
		 {
			// En el caso de que se trate de una raiz de un contenido indicaremos el valor 'C' en la posición 0.
			strAux="['C'"
		 }

		 for(cont=0;cont<this.elements.length;cont++)
		 {
			 //msg_debug("Función _elementToHTML_indexElement elemento  " + cont)		 	  
			 strAux=strAux + ',' + this.elements[cont].elementSerializeToString(rutaBase)
		 }
		 strAux=strAux +"]"	
 
 		  	 
	 }
	 
	 //msg_debug("Función _elementToHTML_indexElement ")
	 
	 return strAux
 }

// --------------------
//
//		Función relacionada con la recuperación del estado de una estructura partiendo de un 
//		STRING serializable del estado
//
 _elementRecoveryStatusFromString_indexElement=function(vData)
 {
	 var strAux=""
	 var cont
	 var icont
	 var status=""

	  msg_debug(this.index)
	 if (this.clase=="pagina")
	 {
		  status=eval("vData["+ this.index.split("_").join("][") + "]")
		  msg_debug("vData["+ this.index.split("_").join("][") + "] ==> " + status)
		  if(status==1) this.accedido=true
	 }
	 // Contenido es el elemento raiz, y apartado es un conjunto de páginas o apartados.
	 else if ((this.clase=="apartado")||(this.clase=="contenido")) 
	 {
		// En caso de no ser contenido (es un apartado) almacenamos la estructura tipo array donde la posición 0 
		// coincide con la portada del apartado. En el caso de que tenga página será 0 o 1, pero en caso de que no 
		// tenga página asociada sera '-'
		 if  (this.clase!="contenido"){
			 
			 // Si el apartado tiene definida una portada
			 if ((this.src!="")&&(this.src!=null))
			 {
				 // Si se ha accedido lo marcamos como 1, si no como 0
				//  if(this.accedido)  strAux="[1"
				 //else strAux="[0"
 			 	
				status=eval("vData["+ this.index.split("_").join("][") + "][0]")
		  		msg_debug("vData["+ this.index.split("_").join("][") + "][0] ==> " + status)
		  		if(status==1) this.accedido=true
				
			 }
			else
			{
	 			// En el caso de no tener definida una portada indicamos el valor '-' 
				//strAux="['-'"
			}
		 }
		 else
		 {
			// En el caso de que se trate de una raiz de un contenido indicaremos el valor 'C' en la posición 0.
			//strAux="['C'"
		 }

		 for(cont=0;cont<this.elements.length;cont++)
		 {
			 //msg_debug("Función _elementToHTML_indexElement elemento  " + cont)		 	  
			 //strAux=strAux + ',' + this.elements[cont].elementSerializeToString(rutaBase)
			 this.elements[cont].elementRecoveryStatusFromString(vData)
		 }
		 //strAux=strAux +"]"	
 
 		  	 
	 }
	 
	 //msg_debug("Función _elementToHTML_indexElement ")
	 
	 //return strAux
 }


function INDEX_ELEMENT()
{
	this.clase =null;   // puede ser "pagina"  o "apartado" o "contenido" (este último es el elemento raiz)

	this.id=null;		// Atributo del elemento definido en el xml
	this.tipo=null;		// Atributo del elemento definido en el xml
	this.titulo=null;	// Atributo del elemento definido en el xml
	this.src=null;		// Atributo del elemento definido en el xml
	this.ruta=null;		// Atributo del elemento definido en el xml	
	this.numpagina=null;
	this.visible=true   // atributo del elemento definido en el xml, si no existe el valor es true



	this.next=null;
	this.previous=null;


	this.elements=null; // en caso de ser apartado contendrá un array de Elements 
	this.accedido=false  // indica si se ha accedido previamente
	this.index=""
	this.parent=null	// elemento superior

	this.addElement= _addElement_indexElement;			// Añade un nuevo elemento
	this.getElement=_getElement_indexElement;			// Devuelve un objeto element de los hijos			
	this.getNumElement=_getNumElement_indexElement;		// Devuelve el número de elementos hijos 
	this.loadElement=_loadElement_indexElement;			// A partir de un Objeto XML carga una estructura de hijos
	this.elementToHTML=_elementToHTML_indexElement;      // Devuelve el objeto en formato HTML
	this.getLevel=_getLevel_indexElement;				// Indica el nivel en el cual se encuentra el elemento
	this.firstElement=_firstElement_indexElement;		// Devuelve el primero de sus hijos
	this.lastElement=_lastElement_indexElement;			// Devuelve el ultimo de sus hijos
	
    this.esContenido=_esContenido_indexElement;			// 	Indica si se registra seguimiento
	
	// Funciones relacionadas con la serializacion
	this.elementSerializeToString=_elementSerializeToString_indexElement
	this.elementRecoveryStatusFromString=_elementRecoveryStatusFromString_indexElement
	
}

