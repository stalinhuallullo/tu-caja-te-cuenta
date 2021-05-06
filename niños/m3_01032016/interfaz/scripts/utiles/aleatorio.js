// Funciones que permiten obtener vectores con valores aleatorios
//alert("Incluido aleatorio.as")
function isIn(randomNum,v)
{
	//alert("isIn")
	var encontrado=false
	var cont
	
	for(cont=1;cont<v.length;cont++) { if(v[cont]==randomNum) encontrado=true }
	return encontrado
}
function randRange(minimo, maximo, v)
{
	
    var randomNum = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
	//alert("randRange" + randomNum)
	while(isIn(randomNum,v))
	{
		
		randomNum = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
	}
	
    return randomNum;
}
	
// Esta funcion devuelve un vector con n posiciones (desde la 0 a la n-1) con valores aleatorios desde 0 a n-1
function obtenerVectorAleatorio(n)
{		
		//_root.SCORM_debug_mensaje("FUNCION ALEATORIO => " + n)
	
		var cont 
		var str
		
		
		//alert("comenzamos")
		
		var secuenciaAleatoria=new Array(n)
		
		//alert("vector de " +  n  + " "  + secuenciaAleatoria)
		
		secuenciaAleatoria[0]="-1"
		str=str+ " [0]=>"  + secuenciaAleatoria[0] + " "
		for (cont=1;cont<=n;cont++)
		{

			secuenciaAleatoria[cont]=randRange(1,n,secuenciaAleatoria)
			//alert("cont " + cont + " secuencia aleatoria " + secuenciaAleatoria )
			str=str+ " [" + cont + "]=>"  + secuenciaAleatoria[cont] + " "
			//trace("p["+cont +"] => " + secuenciaAleatoria[cont])
		}
		 
		str=str+"]"
		//trace( str)
		
		
		var resultadoFinal=new Array(n-1 )
		
		for(cont=0;cont<n;cont++)
		{
			resultadoFinal[cont]=secuenciaAleatoria[cont+1] - 1
		}
		
		return resultadoFinal
}

// Esta funcion devuelve un vector con n posiciones (desde la 0 a la n-1) con valores aleatorios desde "ini" a "fin"
// el vecFIJO es un vector de valores que siempre queremos que aparezcan
function obtenerVectorAleatorioPreguntas(n,ini,fin,vecFIJO)
{		
		//_root.SCORM_debug_mensaje("FUNCION ALEATORIO => n:" + n + " ini:" +  ini + "  fin:" + fin +  " vecFijo: " + vecFIJO.toString())
		//trace("FUNCION ALEATORIO => n:" + n + " ini:" +  ini + "  fin:" + fin)
		var cont 
		var str
		var nuevasposiciones
		var secuenciaAleatoria=new Array(n )
		secuenciaAleatoria[0]="-1"
		str=str+ " [0]=>"  + secuenciaAleatoria[0] + " "
		
		if (vecFIJO.length<=n)
		{
			for (cont=0;cont<vecFIJO.length;cont++)
			{
				secuenciaAleatoria[cont+1]=vecFIJO[cont]
				str=str+ " VALOR FIJO [" + (cont+1) + "]=>"  + secuenciaAleatoria[cont+1] + " "
				//trace("p["+cont +"] => " + secuenciaAleatoria[cont])
			}		
			for (cont=vecFIJO.length+1;cont<=n;cont++)
			{
				secuenciaAleatoria[cont]=randRange(ini,fin,secuenciaAleatoria)
				str=str+ " [" + cont + "]=>"  + secuenciaAleatoria[cont] + " "
				//trace("p["+cont +"] => " + secuenciaAleatoria[cont])
			}
		}
		else
		{
			for (cont=0;cont<n;cont++)
			{
				secuenciaAleatoria[cont+1]=vecFIJO[cont]
				str=str+ " VALOR FIJO [" + (cont+1) + "]=>"  + secuenciaAleatoria[cont+1] + " "
				//trace("p["+cont +"] => " + secuenciaAleatoria[cont])
			}		
		}
		str=str+"]"
		//trace( str)
		
		//trace(secuenciaAleatoria)
		
		var resultadoFinal=new Array(n )
		//var resultadoFinalReordenado=new Array(n-1 )		
		nuevasposiciones=obtenerVectorAleatorio(n)
		for(cont=0;cont<n;cont++)
		{
			resultadoFinal[nuevasposiciones[cont]]=secuenciaAleatoria[cont+1] 
		}
		
		//trace(resultadoFinal)
		
		
		return resultadoFinal
}


