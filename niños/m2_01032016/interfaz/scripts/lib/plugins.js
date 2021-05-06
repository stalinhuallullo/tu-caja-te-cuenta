/*************************************
 *
 *		PLUGINS DE CONTENIDOS
 *
 *		Version: 1.0
 *		Autor  : FJLG
 *		Fecha  : 30/10/2012
 *
 ************************************/

/* function to fix the -10000 pixel limit of jquery.animate */
$.fx.prototype.cur = function(){
    if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
      return this.elem[ this.prop ];
    }
    var r = parseFloat( jQuery.css( this.elem, this.prop ) );
    return typeof r == 'undefined' ? 0 : r;
}


/*************************************
 * CARGADORES
 * Funciones para cargar javascripts
 * y hojas de estilo en la interfaz
 ************************************/

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}


function loadCss(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var enlace = document.createElement('link');
	enlace.rel = 'stylesheet';
    enlace.type = 'text/css';
    enlace.href = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    enlace.onreadystatechange = callback;
    enlace.onload = callback;

    // Fire the loading
    head.appendChild(enlace);
}

/******************************************************
 *
 * Componentes que forman parte del nucleo
 *
 *****************************************************/

loadScript('interfaz/scripts/componentes/pasosvertical/pasosvertical.js');

loadScript('interfaz/scripts/componentes/ejerciciochecks/checks.js');
loadCss('interfaz/scripts/componentes/ejerciciochecks/checks.css');

loadScript('interfaz/scripts/componentes/ejerciciocompletar/completar.js');

loadScript('interfaz/plugins/movimientos.js');

loadScript('interfaz/scripts/componentes/recursos/recursos.js');

/**************************************
 *
 * Componentes opcionales
 * Variables definidas en jstheme.js
 *
 **************************************/

if(HAS_RETOS){
	loadScript('interfaz/scripts/componentes/retos/retos.js');
	loadCss('interfaz/scripts/componentes/retos/retos.css');
}

if(INCLUDE_PROYECTOR){
	loadScript('interfaz/plugins/proyector/proyector.js');
	loadCss('interfaz/plugins/proyector/proyector.css');
}

if(INCLUDE_MONITOR){
	loadScript('interfaz/plugins/monitor/monitor.js');
	loadCss('interfaz/plugins/monitor/monitor.css');
}

if(INCLUDE_TABLET){
	loadScript('interfaz/plugins/tablet/tablet.js');
	loadCss('interfaz/plugins/tablet/tablet.css');
}

if(INCLUDE_IMAGINA){
	loadScript('interfaz/plugins/imagina/imagina.js');
	loadCss('interfaz/plugins/imagina/imagina.css');
}


/******************************************************
 *
 * COPIAR CODIGO AL PORTAPAPELES DESDE iE
 * Agilizando la producción
 *
 *****************************************************/

function copyToClipboard(s) {
    if (window.clipboardData && clipboardData.setData) {
        clipboardData.setData('text', s);
    }
}

(function( $ ) {
  $.fn.copiaralportapapeles = function() {	  
  	$(this).click(function(){		
		var copiado = $(this).parent().nextAll('*[copiable]').clone();
		$('#auxpopy').html(copiado);
		copiado = $('#auxpopy').html();
		copiado = copiado.replace(' copiable=""', '');
		copyToClipboard(copiado)
		//console.log(copiado);
	});
  };
})( jQuery );