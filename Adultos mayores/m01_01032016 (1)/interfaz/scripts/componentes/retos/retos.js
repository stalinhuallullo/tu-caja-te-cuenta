/***************************************************
 *
 * 	RETOS
 * 	Genera las funciones y codigos necesarios
 * 	para pintar y actualizar los retos.
 *	Version: 1.0
 *	Autor  : FJLG
 *	Fecha  : 29/07/2014
 *
 ***************************************************/
function inicializaretos(){	
	arrayretos = new Array();
	if(HAS_RETOS){
		$('#cuerpo').after('<div id="retos"><span class="textoretos"><img src="interfaz/scripts/componentes/retos/textoretos.png" border="0" /></span></div>')		
	}
	if(HAS_RETOS){
		for (x=0; x<NUM_RETOS; x++){
			arrayretos.push(['','']);
			$('#retos').append('<div id="reto'+x+'"></div>');
			if (TIP_RETOS=='exacto') {
				$('#reto'+x).html('<img src="interfaz/scripts/componentes/retos/reto'+x+'.png" border="0" />');
			} else if (TIP_RETOS=='acumulable'){
				$('#retos').attr('conseguidos', '0');
				$('#reto'+x).html('<img src="interfaz/scripts/componentes/retos/reto.png" border="0" />');
			}
		}
				
		for (x=0; x<NUM_RETOS; x++){			
			arrayretos[x][0] = 'reto'+x;			
			if (listaValores!=null){
				arrayretos[x][1] = listaValores.getValue(arrayretos[x][0]);
			} else {
				arrayretos[x][1] = '';
				//listaValores.setValue(arrayretos[x][0], 'fallado');
			}			
		}
	}
}

function solucionareto(num_reto, resultado){
		//console.log(num_reto)
	arrayretos[num_reto][1] = resultado;
	if (listaValores!=null){
		listaValores.setValue('reto'+num_reto,resultado);
	}	
	evaluaretos();
}

function evaluaretos(){
	var contador = 0;
	for (x=0;x<NUM_RETOS; x++){
		if (TIP_RETOS=='exacto') {
			if (arrayretos[x][1] == 'conseguido'){
				$('#reto'+x).html('<img src="interfaz/scripts/componentes/retos/reto'+x+'-logrado.png" border="0" />');								
			}else{
				$('#reto'+x).html('<img src="interfaz/scripts/componentes/retos/reto'+x+'.png" border="0" />');				
			}				
		} else if (TIP_RETOS=='acumulable'){
			if (arrayretos[x][1]=='conseguido'){
				contador++;
			}			
			for (y=0; y<NUM_RETOS; y++){
				if (y<contador){
					$('#reto'+y).html('<img src="interfaz/scripts/componentes/retos/reto-logrado.png" border="0" />');
				} else {
					$('#reto'+y).html('<img src="interfaz/scripts/componentes/retos/reto.png" border="0" />');	
				}
			}
		}		
	}
	//console.log(contador)
}









