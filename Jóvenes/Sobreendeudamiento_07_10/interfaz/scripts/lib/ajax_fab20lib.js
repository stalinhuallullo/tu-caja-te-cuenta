// =====	===================================================================================================
//
// 		FUNCIONES RELACIONADAS CON EL USO DE AJAX
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 7/3/2011
//
// ========================================================================================================
//alert (location);
var esrutahttp=location+""

var ESACCESOLOCAL=false;
var ESINTERNETEXPLORER=false;
//alert( navigator.userAgent)
if(esrutahttp.split("http:").length<2) ESACCESOLOCAL=true
 if ( navigator.userAgent.indexOf("MSIE")>0 )
     {
		//alert("Es IE  - " + navigator.userAgent)
		ESINTERNETEXPLORER=true;
     }
	 else
	 {
		//comprobamos si es IE 11
		if(!!navigator.userAgent.match(/Trident.*rv[ :]*11\./))
		{
			//alert("Es IE11  - " + navigator.userAgent)
			ESINTERNETEXPLORER=true;
		}
		else
		{
			 if ( navigator.userAgent.indexOf("Firefox")>0 ) ESINTERNETEXPLORER=true;
			else 	ESINTERNETEXPLORER=false;
		}
	 }
	 
	
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
//alert("Carga " + url)
  $.ajax({
    url: url,
	encoding:"UTF-8",
    dataType: "html",
	contentType: "text/plain; charset=UTF-8",
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
	//alert("con codificacion utf-8");
  $.ajax({
    url: url,
	encoding:"UTF-8",
    dataType: "html",	
	contentType: "text/plain; charset=UTF-8",
    success: function(ht) {
		
		
	  //alert(  "Capa:" + capa + "  url:" + url + " rutaAnt:" +  rutaAnt + " rutaNueva" + rutaNueva);
	  
	  // Unicamente en el caso de ser internet explorer utilizo la funcion de decodificacion de UTF8
	  
     // if ((ESINTERNETEXPLORER)&&(!ESACCESOLOCAL)) 
	 //		$(capa).html(utf8_decode(filtroRutaImagenes(ht, rutaAnt,rutaNueva)));
	 //  else
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


function utf8_encode(argString) {
  //  discuss at: http://phpjs.org/functions/utf8_encode/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: sowberry
  // improved by: Jack
  // improved by: Yves Sucaet
  // improved by: kirilloid
  // bugfixed by: Onno Marsman
  // bugfixed by: Onno Marsman
  // bugfixed by: Ulrich
  // bugfixed by: Rafal Kukawski
  // bugfixed by: kirilloid
  //   example 1: utf8_encode('Kevin van Zonneveld');
  //   returns 1: 'Kevin van Zonneveld'

  if (argString === null || typeof argString === 'undefined') {
    return '';
  }

  var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var utftext = '',
    start, end, stringl = 0;

  start = end = 0;
  stringl = string.length;
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      );
    } else if ((c1 & 0xF800) != 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      );
    } else { // surrogate pairs
      if ((c1 & 0xFC00) != 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n);
      }
      var c2 = string.charCodeAt(++n);
      if ((c2 & 0xFC00) != 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      );
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl);
  }

  return utftext;
}

function utf8_decode(str_data) {
  //  discuss at: http://phpjs.org/functions/utf8_decode/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  //    input by: Aman Gupta
  //    input by: Brett Zamir (http://brett-zamir.me)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Norman "zEh" Fuchs
  // bugfixed by: hitwork
  // bugfixed by: Onno Marsman
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: kirilloid
  //   example 1: utf8_decode('Kevin van Zonneveld');
  //   returns 1: 'Kevin van Zonneveld'
return str_data

  var tmp_arr = [],
    i = 0,
    ac = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0,
    c4 = 0;

  str_data += '';

  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 <= 191) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if (c1 <= 223) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else if (c1 <= 239) {
      // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      c4 = str_data.charCodeAt(i + 3);
      c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
      c1 -= 0x10000;
      tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
      tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
      i += 4;
    }
  }

  return tmp_arr.join('');
}