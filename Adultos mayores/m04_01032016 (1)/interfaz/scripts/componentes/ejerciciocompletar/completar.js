/******************************************************
 *
 * EVALUADOR DE INPUTS
 * Usado para evaluar los inputs de los ejercicios
 *
 *****************************************************/
 
(function( $ ) {

	$.fn.inputtoselect = function() {  	
		var clase = this.attr("class");
		var opciones = this.attr("opciones").split(",");
		var correcta = this.attr("correcta");
		var obligatoria = this.attr("obligatoria");
		var cualquiera = this.attr("cualquierrespuesta");
		var listaopciones = "<option></option>";
		var izquierda = this.attr("izquierda");
		var arriba = this.attr("arriba");		
		var x = 0;
		while (opciones[x]!="" && opciones[x]!=null){
			opciones[x].trim();
			listaopciones = listaopciones+"<option>"+opciones[x]+"</option>" ;
			x++;
		}
		this.replaceWith(
			"<select class='selectejercicio' cualquierrespuesta="+cualquiera+" correcta='"+correcta+"' obligatoria='"+obligatoria+"' value='A' izquierda='"+izquierda+"' arriba='"+arriba+"'>"+listaopciones+"</select>"
		);
	};
	
	$.fn.ejerciciocompletar = function() {
		
		var objeto = $(this);
		var intentos = objeto.attr("intentos");
		objeto.correcto = false;
		
		var desactivanavegacion = false;
		if(this.attr("desactivanavegacion")=="true"){
			desactivanavegacion = true
		}
		
		if(desactivanavegacion){
			desactivaNavegacion();
		}
		
		if((HAS_RETOS)&&(objeto.is('.reto'))){
			var reto = parseInt(objeto.attr('reto'))
		}
		
		if ((objeto.attr('fondo')!="")&&(objeto.attr('fondo')!=undefined)){
			objeto.css({'background-image': 'url("'+ objeto.attr('fondo') +'")', 'background-repeat':'no-repeat', 'background-size':'contain', 'background-position':'50% 50%'});
		}
		
		objeto.find('input').each(function(){			
			if (($(this).attr('izquierda')!="")&&($(this).is('[izquierda]'))){
				$(this).css({'position':'absolute', 'left': $(this).attr('izquierda')+'px'})
			}
			
			if (($(this).attr('arriba')!="")&&($(this).is('[arriba]'))){
				$(this).css({'position':'absolute', 'top': $(this).attr('arriba')+'px'})
			}
			
		});
		
		objeto.find('select').each(function(){
			if (($(this).attr('izquierda')!="")&&($(this).attr('izquierda')!='undefined')){
				$(this).css({'position':'absolute', 'left': $(this).attr('izquierda')+'px'})
			}			
			if (($(this).attr('arriba')!="")&&($(this).attr('arriba')!='undefined')){
				$(this).css({'position':'absolute', 'top': $(this).attr('arriba')+'px'})
			}			
		});
		
		
		$('.mensaje').remove();
		$('body').append('<div class="mensaje bpopupwindow hideprint" title=""><p class="bClose"><img src="interfaz/tema/media/ico_cerrar.png" alt="icono cerrar"></p><img src="../../interfaz/tema/media/htmltest/inf_incorrecto.png" border="0" class="imagen_izquierda" /><p class="titulo"></p><p class="texto_mensaje"></p></div>')
		objeto.append('<div class="botoneraejercicios"><div class="comprobar">Comprobar</div><div class="ayudaejercicio">Ayuda</div><div class="intentos">Intentos Restantes: '+ intentos +'</div></div>')
		
		objeto.find('.ayudaejercicio').click(function(){
			$('.texto_mensaje').html(objeto.attr('msg_ayuda'))
			$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_info.png')
			$('.mensaje .titulo').html('Ayuda')
			$('.mensaje').bPopup(																					 
				{modalClose: false, appendTo: 'body'}
			);							   
		});
		
		/* funcion para resolver el problema con el metodo trim en ie8 e inferiores */
		if (!String.prototype.trim) {
			String.prototype.trim = function() {
				return this.replace(/^\s+|\s+$/g,'');
			}
		}
		
		/* funcion lanzada al hacer click sobre el boton comprobar
		comprobamos el contenido de cada input con su valor correcto */
		
		objeto.find('.comprobar').click(function(){
				
		/* variable booleana para saber si nos hemos quedado sin intentos */
		var sinintentos = false;
		
			
		/* si aun nos quedan intentos evaluamos los diferentes inputs */
		if (!sinintentos){
			/* creamos dos variables para almacenar el resultado de cada input, si la respuesta esta mal o si lo hemos dejado vacio */
			mal = false;
			vacio = false;
		
			/* bucle por cada input dentro del ejercicio */
			objeto.find('input').each(function(){			
				$(this).evaluainput();
			});		
			objeto.find('select').each(function(){
				$(this).evaluaselect();
			});
			/* restamos un intento a la variable intentos */
			intentos--;
			objeto.find('.intentos').html('Intentos Restantes: '+ intentos)
			
			/* actualizamos la etiqueta intentos del contenido con el nuevo valor de la variable intentos */
			objeto.attr("intentos" , intentos);
				
				/* si intentos es 0 ponemos la variable booleana 'sinintentos' a true */
				if (intentos==0){
					sinintentos = true;				
				}			
			}
			
			/* evaluamos el resultado de la validacion */ 
			if (vacio && !sinintentos){
				$('.mensaje .titulo').html('Hay elementos vacios!')
				$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_alerta.png')
				$('.texto_mensaje').html(objeto.attr('msg_vacio'))
				$('.mensaje').bPopup(
					{modalClose: false, appendTo: 'body'}
				);
			} else if (mal && !sinintentos){
				$('.mensaje .titulo').html('Incorrecto!')
				$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_pregunta.png')
				$('.texto_mensaje').html(objeto.attr('msg_error'))
				$('.mensaje').bPopup(																					 
					{modalClose: false, appendTo: 'body'}
				);
			} else if ((mal || vacio) && (sinintentos)) {
				$('.mensaje .titulo').html('No te quedan más intentos!')
				$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_incorrecto.png')
				$('.comprobar').css("display","none");
				$('.texto_mensaje').html(objeto.attr('msg_ko'))
				$('.mensaje').bPopup(																				 
					{modalClose: false, appendTo: 'body'}
				);
				objeto.find('input').each(function(){
					var correcta = $(this).attr('correcta');
					var correctas = correcta.split(",");
					$(this).attr('value', correctas[0]);
					$(this).css("color", "#e2001a");
					$(this).attr("disabled","disabled");									
				});	
				objeto.find('select').each(function(){
					var correcta = $(this).attr('correcta');
					var correctas = correcta.split(",");
					$(this).attr('value', correctas[0]);					
					$(this).find('option').each(function(){
						console.log($(this).val());
						console.log(correctas[0]);
						if($(this).val() == correctas[0]){
							$(this).attr('selected','selected')
						}
					});					
					$(this).css("color", "#e2001a");
					$(this).attr("disabled","disabled");			
				});
				objeto.find('.retroalimentacion').addClass("feedback");
				if((HAS_RETOS)&&(objeto.is('.reto'))){
					solucionareto(reto, 'fallado');
				}
				activaNavegacion();
			} else if (!mal && !vacio){
				objeto.find('input').each(function(){
					var cualquierrespuesta = false;
					var cualquierrespuesta = $(this).attr('cualquierrespuesta');
					if (!cualquierrespuesta){				
						var correcta = $(this).attr('correcta');
						var correctas = correcta.split(",");
						$(this).attr('value', correctas[0]);
					}
					$(this).css("color", "#e2001a");
					$(this).attr("disabled","disabled");				
				});
				objeto.find('select').each(function(){
					var cualquierrespuesta = false;
					var cualquierrespuesta = $(this).attr('cualquierrespuesta');
					if (!cualquierrespuesta){				
						var correcta = $(this).attr('correcta');
						var correctas = correcta.split(",");
						$(this).attr('value', correctas[0]);
					}
					$(this).css("color", "#e2001a");
	
					$(this).attr("disabled","disabled");				
				});
				
				objeto.find(".comprobar").css("display","none")
				$('.mensaje .imagen_izquierda').attr('src', 'interfaz/tema/media/htmltest/inf_exito.png')
				$('.mensaje .titulo').html('Correcto!')
				$('.texto_mensaje').html(objeto.attr('msg_ok'))
				$('.mensaje').bPopup(																					 
					{modalClose: false, appendTo: 'body'}
				);
				if((HAS_RETOS)&&(objeto.is('.reto'))){
					solucionareto(reto, 'conseguido');
				}	
				activaNavegacion();
			} 			
		});
	
	};
		  
	/* EVALUAMOS LOS ELEMENTOS INPUT */
	
	$.fn.evaluainput = function() {
		var escrito = $(this).val().toLowerCase();
		/* normalizamos escrito */
		escrito = escrito.trim();
		/* comprobamos que sea un campo requerido y si es asi procederemos a evaluarlo */
		var obligatoria = $(this).attr('obligatoria');
			
		/* leemos el valor de la etiqueta cualquierrespuesta que indica si es un campo en el que podemos escribir lo que */
		var cualquierrespuesta = $(this).attr('cualquierrespuesta');
		if (obligatoria){
			/* comprabamos si hay alguna valor definido como correcto en caso contrario el usuario puede escribir lo que quiera en ese campo */
			if (cualquierrespuesta){
				/* Pero debe escribir algo puesto que es un campo obligatorio asi que cogemos el valor de lo escrito y evaluamos que exista*/						
				if (escrito=="" || escrito == null) {
					/*si no se ha escrito nada activamos mal y salimos*/
					vacio = true;
					return false;
				}else{
					/* Si cualquier respuesta y ha escrito algo damos el input por correcto, no hacemos nada*/													
				}
			}else{
				/*si no es cualquier respuesta leemos las posibles respuestas correctas y normalizamos poniendolo todo a minuscula y eliminando caracteres raros*/
				var correcta = $(this).attr('correcta').toLowerCase();	
				correcta = normalize(correcta);
				/* si es una clase numero eliminamos tambien los puntos de separacion */
				if  ($(this).attr('class')=='numero'){
					n=0;
					while (n <= correcta.length) {
						correcta = correcta.replace('.',"");
						correcta = correcta.replace('€',"");
						n++;
					}	
					
				}					
				/* y generamos un array separando los valores tomando como separador el caracter coma ','*/
				var correctas = correcta.split(",");
				/* comprobamos que se haya escrito algo en el input */
				if (escrito==null || escrito==""){
					vacio = true;
					return false;							
				}else{
					var i=0;
					var x=0;
					var acierto = false;							
					/* quitamos los puntos y caracteres raros que podamos encontrar en el texto escrito */
					while (i <= escrito.length) {							
						escrito = escrito.replace('.',"");
						escrito = escrito.replace(/\u20ac/g,"");						
						escrito = normalize(escrito);						
						i++;
					}							
					/* Mientras quede algun elemento en el array de posibles correctas comprobamos si hay alguna coincidencia con lo escrito en el input */
					while (correctas[x] != null){
						correctas[x] = correctas[x].trim();								
						/* en el momento que hay una coincidencia activamos 'acierto' poniendo su valor a true */
						if (correctas[x] == escrito) {
							acierto = true;
							/* en este punto no hacemos un return false para que siga evaluando los inputs ya que he decidido que lo primero que debe evaluarse y dar error son los campos vacios
							y una vez hayamos evaluado que todos los campos obligatorios han sido rellenados evaluaremos si son correctos si hacemos return false aqui haremos que de como erroneo el
							ejercicio si encuentra un campo erroneo antes de uno vacio */
						}
						x++;
					}							
					/* Si un input no finaliza con acierto activamos mal */						
					if (!acierto){
						mal = true;
					}
				}
			}							
		}else{
			/* en caso de no ser un campo obligatorio comprobamos que no se haya escrito nada en él (puesto que este caso tambien seria un error) */
			if (escrito == "" || escrito == null){
			}else{
				mal = true;
				return false;
			}	
		}
	
	};
	
	/* EVALUAMOS LOS ELEMENTOS SELECT */
  
	$.fn.evaluaselect = function() {			
			
		/* como los selects se han construido con un plugin no sera necesario normalizarlos, ya lo estan */
		var escrito = $(this).val();
		/* ¿Es un campo obligatorio de responder? */
		var obligatoria = $(this).attr('obligatoria');
			
		/* leemos el valor de la etiqueta cualquierrespuesta que indica si es un campo en el que podemos escribir lo que */
		var cualquierrespuesta = $(this).attr('cualquierrespuesta');
		if (obligatoria=="true"){
			/* comprabamos si hay alguna valor definido como correcto en caso contrario el usuario puede escribir lo que quiera en ese campo */
			if (cualquierrespuesta=="true"){
				/* Pero debe escribir algo puesto que es un campo obligatorio asi que cogemos el valor de lo escrito y evaluamos que exista*/						
				if (escrito=="" || escrito == null) {
					/*si no se ha escrito nada activamos mal y salimos*/
					vacio = true;
					return false;
				}else{
					/* Si cualquier respuesta y ha escrito algo damos el input por correcto, no hacemos nada*/													
				}
			}else{
				/*si no es cualquier respuesta leemos las posibles respuestas correctas y normalizamos poniendolo todo a minuscula y eliminando caracteres raros*/					
				var correcta = $(this).attr('correcta');
				/* generamos un array separando los valores tomando como separador el caracter coma ','*/					
				var correctas = correcta.split(",");
				/* comprobamos que se haya escrito algo en el input */
				if (escrito==null || escrito==""){
					vacio = true;
					return false;
				}else{
					var encontrada = false;
					/* Mientras quede algun elemento en el array de posibles correctas comprobamos si hay alguna coincidencia con lo escrito en el input */						
					for (x=0; x<correctas.length; x++){
						if (correctas[x] == escrito) {
							encontrada = true;														
							/* en este punto no hacemos un return false para que siga evaluando los inputs ya que he decidido que lo primero que debe evaluarse y dar error son los campos vacios
							y una vez hayamos evaluado que todos los campos obligatorios han sido rellenados evaluaremos si son correctos si hacemos return false aqui haremos que de como erroneo el
							ejercicio si encuentra un campo erroneo antes de uno vacio */
						}
					}
					
					if(!encontrada){
						mal = true;
						return false;
					}
				}
			}							
		}else{
			/* en caso de no ser un campo obligatorio comprobamos que no se haya escrito nada en él (puesto que este caso tambien seria un error) */
			if (escrito == "" || escrito == null){
			}else{
				mal = true;
				return false;
			}	
		}
	};
  
})( jQuery );
