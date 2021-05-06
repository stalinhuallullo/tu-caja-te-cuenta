
// listaValores.getSerializeContentAccess();
//listaValores=new TADVARS();
	//listaValores.loadFromSTR(SCORM_getEstadoVariables())
	
	
function TADVARS()
{
	this.txtImport=""
	this.separadorIgual="|"
	this.separadorPar="]"
	this.valores=new Object(); // Los valores los almacenamos en un objeto estandar donde podemos crear posteriormente propiedades y valores
	
	
	
	// Se encarga de rellenar la información del objeto con un STRING tipo nombre|valor]
	this.loadFromSTR=function(cadena)
	{
		//alert("this.loadFromSTR:" + cadena)
	
		// DESTRUIMOS EL TAD ORIGINAL
		this.txtImport=""
		this.valores=new Object();  // Reiniciamos el objeto
	
		if ((cadena=="nulo")||(cadena=="")||(cadena==null))
		{
			// FALTA Error y no hacemos nada. Dejamos el TAD vacio
		}
		else
		{
			var vPar=null
			var nombre=""
			var valor=""
			
			this.txtImport=cadena
			vPar=this.txtImport.split(this.separadorPar)
			for(par in vPar)
			{
				nombre=vPar[par].split(this.separadorIgual)[0]
				valor=vPar[par].split(this.separadorIgual)[1]
				this.valores[nombre]=valor;
			}
		}	
	}

	this.getSerializeContentAccess=function()
	{
		var strserialize=""
		
		// Recorrer el TAD y encadenar el STRING
		for (i in this.valores)
		{
			if (strserialize!="") strserialize=strserialize+this.separadorPar
			strserialize=strserialize+i+this.separadorIgual+this.valores[i];
		}
		
	
		return strserialize
	}
	
	//  Bool indicando si existe un valor
	this.issetVar=function(nombre)
	{
		encontrado=false
		
			if ((this.valores[nombre]!=undefined)&&(this.valores[nombre]!=null))
			{
				encontrado=true;
			}
		
		return encontrado
	
	}	
	
	// Obtiene un valor del tad o devuelve null
	this.getValue=function(nombre)
	{
	
		if(this.issetVar(nombre))
		{
			// buscar el nombre y devolver su valor
			return this.valores[nombre];
		}
		else
		{
			return null;
		}
		
	 
	}
	
	// Establece o recupera un valor del TAD
	this.setValue=function(nombre,valor)
	{
		this.valores[nombre]=valor;
		
	}	
	
	
}

 
