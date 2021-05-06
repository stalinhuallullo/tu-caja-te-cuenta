/***************************************************
 *
 * 	PESTAÑAS LATERALES
 * 	Genera las funciones y codigos necesarios
 * 	para las pestañas paso a paso.
 *	Version: 1.0
 *	Autor  : FJLG
 *	Fecha  : 23/07/2014
 *
 ***************************************************/

(function( $ ) {
  $.fn.pasosvertical = function() {  
  	var alto = parseInt(this.attr('alto'));
	$(this).find('.objetos > li').animate({top: alto+30}, 0);
	$(this).find('.objetos').css('height', alto);
	$(this).find('.pasos').find('li').addClass('inactivo');
	$(this).find('.pasos').find('li:first-child').removeClass('inactivo');
	$(this).find('.pasos').find('li:first-child').append('<span class="marca"></span>');
	
	$(this).find('.pasos').find('li').click(function(){
		if ($(this).hasClass('inactivo')){	
			var audioElement = document.createElement('audio');
			audioElement.setAttribute('src', 'interfaz/tema/media/audios/buttonerror.mp3');
			audioElement.setAttribute('autoplay', 'autoplay');
	
			audioElement.addEventListener("load", function() {
				audioElement.play();
			}, true);
		} else {
			var audioElement = document.createElement('audio');
			audioElement.setAttribute('src', 'interfaz/tema/media/audios/buttonok.mp3');
			audioElement.setAttribute('autoplay', 'autoplay');
	
			audioElement.addEventListener("load", function() {
				audioElement.play();
			}, true);
			
			$(this).parent().find('.objetos > li').removeClass("activo");
			if ($(this).children('span.marca')){
				$(this).find('.marca').remove();
			}
			if ($(this).next('li').hasClass('inactivo')){
				$(this).next('li').append('<span class="marca"></span>');
				$(this).next('li').removeClass('inactivo');
			}		
			$(this).addClass("activo");
			
			var elemento = $(this).attr('elemento');
			$(this).parent().next('.objetos').children('li').animate({top: alto+30}, 100);	
			$(this).parent().next('.objetos').children('[contenido='+elemento+']').animate({top: "0px"}, 600);
		}
		
	});

 };
 
})( jQuery );