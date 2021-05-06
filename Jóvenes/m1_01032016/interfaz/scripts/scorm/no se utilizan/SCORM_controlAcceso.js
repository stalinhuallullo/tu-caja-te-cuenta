alert("Control de acceso hay que modificarlo y utilizar el formato de los anteriores para que se pueda empaquetar")

// C0NTROL DE ACCESO
//
// ----------------------------------------------------------------------------------------------
//
// Definición de objeto ControlAcceso destinado a llevar un recuento de las páginas visitadas 
// a lo largo de la sesión y otro tipo de datos que se pueden apilar.
//
// Permitirá 
//
//		- controlar si un documento ha sido visitado (almacenando el nombre del documento)
// 		- exportar la información a string
//		- importar la información de un string
// 		- calcular el % de documentos visitados


// Importa los datos de sesiones anteriores desde un String, borra la información interna sustitu
// por la que obtiene en el siguiente string.
//
// El formato de la información contenida es 
//
//		[ultimo documento visitado]::[paginas visitadas separadas por coma]::[lista de valores]
//
//		[ultimo documento visitado] => Es un string que representa una pagina web
//		[paginas visitadas separadas por coma] => Es un string que representa varias paginas web
// 												  separadas por ",". Ejemplo:
//
//							p1.html,p2.html,p4.html 
//
//		[lista de valores] => Es una lista de valores "Nombre"  y "Valor", cada nombre/valor se 
//							  separa por el caracter "|", y cada pareja por "||". Ejemplo:
//
//							n1|valor1||n2|valor2
//
//							Representa n1=valor1 y n2=valor2
//
function _importar(datos)
{
	if (datos!=null && datos!="" && datos!=" ") 
	{
		// Obtenemos los 2 grupos de información,  el primer dato separado por los ::
		// es el nombre del último documento visitado, mientras que el segundo dato son las 
		// paginas visitadas una a una separadas por "," y sin repetir.
		datos2=datos.split("::")
		//alert(datos2)
		if (datos2[0]!=null) this.ultimoacceso=datos2[0];
		if (datos2[1]!=null) this.paginas=datos2[1].split(",");
		if (datos2[2]!=null) 
		{
			
			datos3=datos2[2].split("||");
			for(i in datos3)
			{
				pareja=datos3[i].split("|")
				if (pareja.length==2) this.putData(pareja[0],pareja[1])
			}
		}
	}
}

// Exporta la información del objeto para ser almacenada en el LSM. Posteriormente se puede 
// recuperar esta información con la funcion importar.
//
// El formato de la información contenida es 
//
//		[ultimo documento visitado]::[paginas visitadas separadas por coma]::[lista de valores]
//
//		[ultimo documento visitado] => Es un string que representa una pagina web
//		[paginas visitadas separadas por coma] => Es un string que representa varias paginas web
// 												  separadas por ",". Ejemplo:
//
//							p1.html,p2.html,p4.html 
//
//		[lista de valores] => Es una lista de valores "Nombre"  y "Valor", cada nombre/valor se 
//							  separa por el caracter "|", y cada pareja por "||". Ejemplo:
//
//							n1|valor1||n2|valor2
//
//							Representa n1=valor1 y n2=valor2
//
function _exportar()
{
	datos=this.paginas;
	
	strData="";
	for (i in this.data)
		{	//alert("i:" + i)
			if (strData!="") strData=strData + "||"
			strData=strData +  i  + "|" +  this.data[i]
			//alert("strData: " + strData)
		}
	 
	
	return this.ultimoacceso + "::" + datos + "::" + strData;
}

// Devuelve el total de paginas que podemos visitar 
function _getTotalPaginas()
{
	return this.totalPaginas;
}

// Devuelve el numero de paginas visitadas hasta el momento, el cual debe de coincidir
// con el numero de paginas almacenadas en el vector
function _getNumPaginasVisitadas()
{
	return this.paginas.length;
}

// Un valor porcentual de las paginas visitadas frente a las páginas totales
function _getPorcentajeVisitadas()
{
	return Math.floor((this.getNumPaginasVisitadas()/this.getTotalPaginas())*100);
}

function  obtenerNombreCompleto(url)
{
	url=String(url);
	//alert ("obteniendo nombre complero de url " + url);
	separador="/";
	//if (document.location.protocol=="file:") separador="/";
	//alert("separador : " + separador)
	v=url.split(separador)
	nombre=v[v.length-1];
	
	v2=nombre.split("?")
	if (v2.length>1) 
	{
		nombre=v2[0];
	}
	v2=nombre.split("#")
	if (v2.length>1) 
	{
		nombre=v2[0];
	}	
	return nombre;
}


// Pasandole una url indica si la página esta almacenada como visitada
function _esPaginaVisitada(url)
{

	encontrado=false;
	cont=0;

	// No permitimos que se registre dos veces una visita a una página, con lo cual
	// antes de añadir el nuevo nombre de fichero en el array realizamos una busqueda
	// en los elementos que contiene.
	while ((!encontrado)&&(cont<this.paginas.length))
	{
		if(this.paginas[cont]==nombre) encontrado=true
		else
		{
			cont++;
		}
	}
	
	return encontrado;
}
function _marcarUltimaPaginaVisitada(url)
{
	// Almacenamos el nombre de la última página accedida
	// En el caso de que _SCORM_lastURLComplete indique true se almacenará 
	// el camino completo (en caso de que existan paginas en distintos directorios)
	// y en el caso de que valga false solo almacenamos el nombre.
	if ((_SCORM_lastURLComplete!=null)&&(_SCORM_lastURLComplete)) this.ultimoacceso=url;	
	else  this.ultimoacceso=obtenerNombreCompleto(url);	
}
// Pasamos una URL  y en el caso de que la página nunca se haya visitado se almacenará
// en el array
function _marcarPaginaVisitada(url)
{
	// El valor url posiblemente es muy extenso siendo la url completa, tipo http:/... o file:/..
	// para evitar problemas de tamaño obtenemos el nombre del documento al cual se accede.
	nombre=obtenerNombreCompleto(url)
	
	// Marcarmos la pagina como la última visitada
	this.marcarUltimaPaginaVisitada(url)
	
	encontrado=false;
	encontrado=this.esPaginaVisitada(url)
	
	// una vez llegados a este punto si la variable encontrado tiene el valor "false" podemos
	// agregar este elemento a la colección.
	
	if (!encontrado) this.paginas[this.paginas.length]=nombre;
}


function _isalive()
{
	alert("ControlAcceso con " + this.totalPaginas + " inicializado.. ");
}
// nos devuelve el nombre de la última página accedida la cual ha sido marcada como visitada.
function _getUltimoAcceso()
{
	return this.ultimoacceso;
}

// Añade un dato a la estructura de datos
function _putData(indice,valor)
{
	resultado=false
	
	try
	{
	
		this.data[indice]=valor;
		//alert ("Indice: " + indice + " Dato: " + this.data[indice])
	}
	catch(err)
	{
		resultado=true
		//alert("_putData(indice,valor)" + err.description)
	}
	return resultado;
	
}

// Obtiene un dato de la estructura de datos
function _getData(indice)
{
	resultado=null
	
	try
	{
	
		if(this.data[indice]!=null) resultado=this.data[indice]
	}
	catch(err)
	{
		resultado=null
		//alert("_putData(indice,valor)" + err.description)
	}
	return resultado;
		
}


// Construimos el objeto indicando inicialmente el numero de documentos que se pueden visitar
function ControlAcceso(_totalPaginas)
{
	//alert ("Iniciamos objeto");
	this.totalPaginas=_totalPaginas;
	this.paginas=new Array();
	this.data=new Array();
	this.ultimoacceso="";
	
	this.importar=_importar;
	this.exportar= _exportar;
	this.getTotalPaginas= _getTotalPaginas;
	this.getNumPaginasVisitadas= _getNumPaginasVisitadas;
	this.getPorcentajeVisitadas=_getPorcentajeVisitadas;
	this.marcarPaginaVisitada=_marcarPaginaVisitada;
	this.isalive=_isalive;
	this.getUltimoAcceso=_getUltimoAcceso;
	this.esPaginaVisitada=_esPaginaVisitada;
	this.marcarUltimaPaginaVisitada=_marcarUltimaPaginaVisitada;

	this.putData=_putData
	this.getData=_getData
}