// ========================================================================================================
//
// 		FUNCIONES RELACIONADAS CON EL USO DE AJAX
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 7/3/2011
//
// ========================================================================================================

// -------------------------------------------------------------------------------------------------------
// Escribe html en una capa.  
// 
// @param capa Capa destino.
// @param htmlinf El texto en formato html que se cargara.
AJAX_setHTML = function(capa, htmlinf, rutaAnt, rutaNueva) {
	$(capa).html(filtroRutaImagenes(htmlinf, rutaAnt,rutaNueva));
	//initAllComponents()  // Inicializamos los componentes 
}
// -------------------------------------------------------------------------------------------------------
// Carga una URL en una capa dada.  
// 
// @param capa Capa destino.
// @param url URL que se mostrará.
//
AJAX_cargarHTML = function(capa, url) {
  $.ajax({
    url: url,
    dataType: "html",
    success: function(ht) {
	msg_debug("[AJAX_cargarHTML] Cargamos " + url + " en " + capa)// + " con el contenido " + ht)
      $(capa).html(ht);
	  //initAllComponents() // Inicializamos los componentes
    }
  });
};
// -------------------------------------------------------------------------------------------------------
// Obtiene la información HTML de forma asincrona y la retorna como variable.  
// 
// @param url URL que se obtiene.
//
AJAX_getHTMLAsincrono = function(url,rutaAnt,rutaNueva) {
	//alert("Estoy en AJAX_getHTMLAsincrono " + url )
	var htmlRetornado=""
  $.ajax({
    url: url,
    dataType: "html",
	async: false,
	success: function(ht) {

		htmlRetornado=filtroRutaImagenes(ht, rutaAnt,rutaNueva)
		//alert("Success de html Asincrono!! " + htmlRetornado)
    }
  });
  //alert("Termino AJAX_getHTMLAsincrono")
  return  htmlRetornado 
};



// -------------------------------------------------------------------------------------------------------
// Carga un XML en una capa dada.  
// 
// @param capa Capa destino.
// @param url URL que se mostrará.
//
AJAX_cargarXMLenDIV = function(capa, urlXML) {
	//alert(urlXML)
  $.ajax({
    url: urlXML,
    dataType: "html",
    success: function(ht) {
	msg_debug("[AJAX_cargarHTML] Cargamos " + urlXML + " en " + capa)// + " con el contenido " + ht)
      //alert(ht);
	  	
	  $(capa).html("<pre>" + ht.split("<").join("&lt;") + "</pre>");
    }
  });
};


// -------------------------------------------------------------------------------------------------------
// Carga un string HTML en una capa dada.  
// 
// @param capa Capa destino.
// @param url URL que se mostrará.
//
AJAX_cargarHTMLContent = function(capa, ht) {

      $(capa).html(ht);// 
	  //initAllComponents(); // inicializamos todos los componentes
};


// -------------------------------------------------------------------------------------------------------
// Carga una URL en una capa dada. El contenido del HTML se modifica para adaptar las rutas de las imágenes.
//
// @param capa Capa destino.
// @param url URL que se mostrará.
//
AJAX_cargarHTMLFiltro = function(capa, url, rutaAnt,rutaNueva,initComponentes) {
  $.ajax({
    url: url,
    dataType: "html",	
    success: function(ht) {
		
		
	  //alert(  "Capa:" + capa + "  url:" + url + " rutaAnt:" +  rutaAnt + " rutaNueva" + rutaNueva);
      $(capa).html(filtroRutaImagenes(ht, rutaAnt,rutaNueva));
	  if(initComponentes!=undefined) initAllComponents(); // Inicializamos los componentes
    }
  });
};

/**
 * Arregla la ruta de las imágenes para que se muestren correctamente.
 * @param html HTML donde se arreglarán las rutas.
 * @param rutaBase Ruta base que se añadirá a todas las imágenes.
 *
 *
 *	Unicamente va a realizar la sustitución cuando no sea una ruta absoluta, es decir, ignorará todas aquellas que comiencen por http://  o por www.
 *
 *
 *
 */
filtroRutaImagenes = function(mihtml, rutaAnt,rutaNueva) {
	
	var reemplazo	

	//alert("FILTRO::: Reemplazamos " + (mihtml.split("img src=\"").length-1) + " rutas tipo [img src=\"] ")
	
	var vReemplazo=mihtml.split("img src=\"")
	var cont
	var strdebug=""
	if(vReemplazo.length>1)
	{
		// Comparamos cadenas a partir de pos1, ya que pos0 es lo que habria a la izquierda de img src="..
		// elemento a elemento comprobamos si inicia por http: o www. , con lo cual sería una absoluta
		// o si es relativa (no inicia por http: ni wwww.
		for(cont=1;cont<vReemplazo.length;cont++)
		{
			if ((vReemplazo[cont].substr(0,5)=="http:")||
				(vReemplazo[cont].substr(0,4)=="www."))
			{
				// no añadimos la rutanueva, dado que es una ruta absoluta
				
			}			
			else if(vReemplazo[cont].substr(0,15)=="../../interfaz/")
			{
				//strdebug=vReemplazo[cont]
				vReemplazo[cont]=vReemplazo[cont].substr(6,vReemplazo[cont].length -6)
				//strdebug=strdebug + " [modificado por] " + vReemplazo[cont]
				//alert(strdebug)
			}
			else
			{
				
				//alert("Reemplazamos " + vReemplazo[cont] + " con " + rutaNueva+"//"+vReemplazo[cont])
				// Añadimos la ruta nueva, ya que está accediendo de forma relativa
				//vReemplazo[cont]=rutaNueva+"//"+vReemplazo[cont]

			}
		}
		
	}
//	reemplazo=mihtml.split("img src=\"").join("img src=\""+rutaNueva+"//")
	reemplazo=vReemplazo.join("img src=\"")
	//msg_debug("FILTRO::: "+mihtml)
  return reemplazo
};
