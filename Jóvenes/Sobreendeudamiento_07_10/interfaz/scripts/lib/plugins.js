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



/**************************************
 *
 * Componentes opcionales
 * Variables definidas en jstheme.js
 *
 **************************************/


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