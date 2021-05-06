/*************************************
 *
 *		PLUGINS DE CONTENIDOS
 *
 *		Version: 1.0
 *		Autor  : FJLG
 *		Fecha  : 30/10/2012
 *
 ************************************/


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


/******************************************************
 *
 * CONVERSOR ELEMENTOS INPUT A SELECT
 * Se debe añadir clase 'toselect' en el input
 * a convertir, declarado en fab20_jQueryWidgets.js
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
	var x = 0;
	while (opciones[x]!="" && opciones[x]!=null){
		opciones[x].trim();
		listaopciones = listaopciones+"<option>"+opciones[x]+"</option>" ;
		x++;
	}
    this.replaceWith(
		"<select class='selectejercicio' cualquierrespuesta="+cualquiera+" correcta='"+correcta+"' obligatoria='"+obligatoria+"'>"+listaopciones+"</select>"
	);

  };
})( jQuery );

/******************************************************
 *
 * EVALUADOR DE INPUTS
 * Usado para evaluar los inputs de los ejercicios
 *
 *****************************************************/
 
(function( $ ) {
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
})( jQuery );

/******************************************************
 *
 * EVALUADOR SELECTS CON RESPUESTA
 * Usado para evaluar los selects de los ejercicios
 *
 *****************************************************/
 
(function( $ ) {
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
						/* Mientras quede algun elemento en el array de posibles correctas comprobamos si hay alguna coincidencia con lo escrito en el input */						
						var x=0;
						while (correctas[x] != null){
							if (correctas[x] == escrito) {
								acierto = true;
								/* en este punto no hacemos un return false para que siga evaluando los inputs ya que he decidido que lo primero que debe evaluarse y dar error son los campos vacios
								y una vez hayamos evaluado que todos los campos obligatorios han sido rellenados evaluaremos si son correctos si hacemos return false aqui haremos que de como erroneo el
								ejercicio si encuentra un campo erroneo antes de uno vacio */
							}else{
								mal = true;
								return false;
							}
							x++;
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



/******************************************************
 *
 * CREADOR DE EJERCICIOS PARA RELLENAR
 * Se debe añadir clase 'toselect' en el input
 * a convertir, declarado en fab20_jQueryWidgets.js
 *
 *****************************************************/
 
(function( $ ) {
  $.fn.generatefillexercise = function() {  	
	var clase = this.attr("class");
	var opciones = this.attr("opciones").split(",");
	var correcta = this.attr("correcta");
	var obligatoria = this.attr("obligatoria");
	var cualquiera = this.attr("cualquierrespuesta");
	var listaopciones = "<option></option>";
	var x = 0;
	while (opciones[x]!="" && opciones[x]!=null){
		opciones[x].trim();
		listaopciones = listaopciones+"<option>"+opciones[x]+"</option>" ;
		x++;
	}
    this.replaceWith(
		"<select class='selectejercicio' cualquierrespuesta="+cualquiera+" correcta='"+correcta+"' obligatoria='"+obligatoria+"'>"+listaopciones+"</select>"
	);

  };
})( jQuery );

loadScript('interfaz/plugins/proyector/proyector.js');
loadCss('interfaz/plugins/proyector/proyector.css');
loadScript('interfaz/plugins/monitor/monitor.js');
loadCss('interfaz/plugins/monitor/monitor.css');
loadScript('interfaz/plugins/tablet/tablet.js');
loadCss('interfaz/plugins/tablet/tablet.css');


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