// 
function _isMenu(strIndex)
{
	var esmenu=false;
	
	arrayIndex=this.getApartadosIndexado(strIndex)
	if (typeof(eval(arrayIndex))=="object")
	{
		esmenu=true;
	}
		
	return esmenu;
}
function _getApartadosIndexado(strIndex)
{
	//alert("strIndex:" + strIndex)
	arrayIndex="";
	if (strIndex!="")
	{
	 	//alert(" strIndex: " + strIndex)
		// Obtenemos de una cadena tipo i1_i2_i3_i4 .... un vector con los distintos indices. 
		// this.sep indica el separador y se configura en la clase.
		indices=strIndex.split(this.sep)
		
		
		//alert("split " + indices)
		//alert("split length" + indices.length )
		for(cont=0;cont<indices.length;cont++)
		{	i_aux=parseInt(indices[cont],10)
			i_aux--; // dado que los indices siempre son de 1 en adelante, y los vectores de 0 en adelante.
			
			//alert("ap_aux:" + i_aux)
			arrayIndex=arrayIndex + "[" + i_aux +"]"
			// Vamos buscandola posición 
		//	ap_aux= ap_aux[i_aux]
			//alert(" valor ap_aux  en posición " + i_aux + " : " + ap_aux) 
		}
		arrayIndex="this.apartados" + arrayIndex;
		//alert("arrayIndex: " + arrayIndex)
		
	}
	else
	{
		arrayIndex="this.apartados";
	}
	return arrayIndex
}
// 
function _setPageActive(strIndex)
{
	arrayIndex=this.getApartadosIndexado(strIndex)
	if (typeof(eval(arrayIndex))!="object")
	{
		//alert(arrayIndex+ "='"+ this.siRelleno +"'")
		eval(arrayIndex+ "='"+ this.siRelleno +"'")
	}
}
function _setPageValue(strIndex,val)
{
	
	arrayIndex=this.getApartadosIndexado(strIndex)
	//alert(arrayIndex)
	//alert(val)
	//alert(arrayIndex+ "="+ val +"")
	 
	if ((eval(arrayIndex)==null)|| (typeof(eval(arrayIndex))!="object"))
	{
		//alert("vamos a poner el valor")
		//alert(arrayIndex+ "='"+ this.siRelleno +"'")
		eval(arrayIndex+ "="+ val +"")
	}
	//alert(eval(arrayIndex))
}
// Se espera un string con el siguiente formado
//
//		i1,i2,i3,i4 ...
//
function _addFillSection(strIndex,num_paginas)
{
	var ap_aux;
	var i_aux;
	var cont;
	var arrayIndex="";
	
	//ap_aux=this.apartados;  // Puntero al apartado indicado
	
	arrayIndex=this.getApartadosIndexado(strIndex)
	
	eval(arrayIndex + "=new Array();");
	
	for(cont=0;cont<num_paginas;cont++)
	{
		//alert(cont)
		if (this.conValores)	eval(arrayIndex + "[" + cont + "]=this.valorNulo;")
		else 					eval(arrayIndex + "[" + cont + "]=this.noRelleno;")
		
	}
	//alert(ap_aux)
}
function _escribeValor(v)
{
	return "" + v
}
function _getHtmlData(v,nivel,ind)
{
	var HTML
	var cont
	var auxind
	
	 if (nivel==null) nivel=1
	 if (ind==null) ind=""
	 auxind=ind
	//alert(color)
	HTML="<font size='1' face='arial'> <ol style='padding:5px;border:1px solid black'>";
	for (cont=0;cont<v.length;cont++)
	{	
		if (auxind!="") ind=auxind + this.sep + (cont + 1)
		else ind=""+  (cont + 1)
		
		if (typeof(v[cont])=="object")
		{ 
					
			HTML=HTML + " <li>  Nivel: " + ind + ", Accesible : " + this.isAllActiveAt(ind) 
			HTML=HTML + "  ,  % : " + this.porcentActivePages(v[cont]) 
			HTML=HTML + " ,  Nª Paginas : " + this.numPages(v[cont]) 
			HTML=HTML + " ,   Visitadas  : " + this.numActivePages(v[cont]) 
			HTML=HTML + ",   NoVisitadas  : " +  this.numNotActivePages(v[cont])
			HTML=HTML + " <br><br>  " + this.getHtmlData(v[cont],nivel+1, ind) + "</li> <br>"
		}
		else
		{
			if (this.conValores)
			{
				if (v[cont]!=this.valorNulo) 
						HTML=HTML + "<li><font color='blue'>" + this.escribeValor(v[cont]) + "</font></li>"
				else 			
						HTML=HTML + "<li>" + this.escribeValor(v[cont]) +  "</li>"				
			}
			else
			{
				if (this.siRelleno==v[cont]) 
						HTML=HTML + "<li><font color='blue'>"+ this.escribeValor(v[cont]) + "</font></li>"
				else 			
						HTML=HTML + "<li>" + this.escribeValor(v[cont]) +  "</li>"
			}
		}
	}
	HTML  = HTML +  "</ol></font>";
	return HTML
}
function _showHtml()
{
	 return this.getHtmlData(this.apartados)
	
	
}
function _exportar(v)
{
	exportacion="";
	var cont;
	
	if (v==null) v=this.apartados;
	//	alert(v)
	for (cont=0;cont<v.length;cont++)
	{	 
		if (exportacion!="") exportacion=exportacion + ","
		if (typeof(v[cont])=="object")
		{
			//exportacion=exportacion + "[" + this.exportar(v[cont]) + "]"
			exportacion=exportacion + this.exportar(v[cont])
		}
		else
		{
			if (this.conValores)
			{
				// En el caso especial de tratarse de cadenas de caracteres se sustituye "'"
				// por el caracter "!", luego a la hora de importar habra que corregir esto
				// ultimo
				if (typeof(v[cont])=="string")	exportacion=exportacion + "!" + v[cont] + "!"
				else exportacion=exportacion +   v[cont]  
			}
			else
			{
				if (this.siRelleno==v[cont]) exportacion=exportacion + "1"
				else  exportacion=exportacion + "0"	
			}
		}
	}
	exportacion="[" + exportacion + "]"
	return exportacion
	
}
function _formatearValores(v)
{
	 
	var cont;
	
	if (v==null) v=this.apartados;
	//	alert(v)
	for (cont=0;cont<v.length;cont++)
	{	 
	 
		if (typeof(v[cont])=="object")
		{
			//exportacion=exportacion + "[" + this.exportar(v[cont]) + "]"
			 this.formatearValores(v[cont])
		}
		else
		{
			if (1==v[cont]) v[cont]=this.siRelleno
			else  v[cont]=this.noRelleno

		}
	}
	 
	
}
function reemplazaCaracter(str,a,b)
{
	while(str.indexOf(a)>0)
	{
		str=str.replace(a,b)
	}
	return str
	
}
function _importar(str)
{
	// En el caso de que haya cadenas de caracteres en la exportacion sustituimos el caracter 
	// "'" por "!", ahora se ha de reemplazar todo con la funcion replace.
	//eval("this.apartados="+ str.replace(/[!]/g,"'")  +";")
	//alert(reemplazaCaracter(str,"!","'"))
	eval("this.apartados="+  reemplazaCaracter(str,"!","'")  +";")
	if (!(this.conValores)) this.formatearValores()
	
}

function _numPages(v,estado)
{
	var cont;
	
	var num=0;
 
	for (cont=0;cont<v.length;cont++)
	{	 
		if (( v[cont]!=null)&&(typeof(v[cont])=="object"))
		{
			 num=num + this.numPages(v[cont],estado)
		}
		else
		{
			if (estado!=null)
			{
				//alert (" con o sin valores: " + this.conValores  + "  Tipo Busqueda: " + estado + " Valor " + v[cont])
				if (this.conValores)
				{
					if (estado=="activas")	
					{
						//if (v[cont]!=this.valorNulo) num++
						if (this.condicionActivo(v[cont])) num++
					}
					else
					{
						if (!this.condicionActivo(v[cont])) num++		
					}
					//if (estado=="noactivas")
				}
				else
				{
					if (estado=="activas")	
					{
						if (v[cont]==this.siRelleno) num++
					}
					else
					{
						if (v[cont]==this.noRelleno) num++
					}
				}
			}
			else
			{
				num=num+1
			}
			

		}
	}	
	
	return num
}
function _numActivePages(v)
{
	return this.numPages(v,"activas")
}
function _numNotActivePages(v)
{
	return this.numPages(v,"noactivas")
}
function _porcentActivePages(v)
{
	return Math.round((this.numActivePages(v) / this.numPages(v)) *100)
} 
function _condicionActivo(vector)
{
    return (vector!=this.valorNulo) 
}
function _isAllActiveAt(strIndex)
{	var vector
	var cont
	var cont2
	var i_aux
	var res=""
	var out=" Comprobaciones para:  " + strIndex + "\n"
	
	allActive=true
	
	arrayIndex="this.apartados";
	if (strIndex!="")
	{
 		indices=strIndex.split(this.sep)
		for(cont=0;cont<indices.length;cont++)
		{	
			i_aux=parseInt(indices[cont],10)
			i_aux--;  
 			
			for(cont2=0;cont2<i_aux;cont2 ++)
			{
				vector=eval(arrayIndex + "[" + cont2 +"]")
				if (typeof(vector)=="object")
				{
					if(this.numPages(vector)!=this.numActivePages(vector)) allActive=false;
					res=" v  " + allActive
				}
				else
				{
					if(this.conValores)
					{
						if (!this.condicionActivo()) allActive=false;
						res=" h  " + allActive 						
					}
					else
					{
						if (vector!=this.siRelleno) allActive=false;
						res=" h  " + allActive 
					}
				}
				out= out + "\n" + arrayIndex + "[" + cont2 +"]" + res
			}
			
			arrayIndex=arrayIndex + "[" + i_aux +"]"
			
			
		}
		
 	}
	else
	{
		out= "esta vacio el indice"
		allActive=true;
	}
	//alert(out)
	return allActive	 
}
function _getPorcentajeUso(strIndex)
{
	//alert(this.getApartadosIndexado(strIndex))
	return this.porcentActivePages(eval(this.getApartadosIndexado(strIndex)))
}
function _getNumElements(ind)
{	
	var v
	
   	v= eval (this.getApartadosIndexado(ind))
	return v.length
}

//  Creamos un dataIndex de n apartados principales
//	
//	conValores:  conValores=> Almacena Valores en vez de las marcas por defecto
//		   sinValores=> no almacena valores
//
function SCORM_dataIndex(n,_conValores)
{

	// METODOS
	this.getNumElements=_getNumElements
	this.addFillSection=_addFillSection
	this.showHtml=_showHtml
	this.setPageActive=_setPageActive
	this.setPageValue=_setPageValue 
	this.getApartadosIndexado=_getApartadosIndexado 
	this.getHtmlData=_getHtmlData
	this.exportar=_exportar
	this.importar=_importar
	this.formatearValores=_formatearValores
	this.numPages=_numPages 
	this.numActivePages=_numActivePages 
	this.numNotActivePages=_numNotActivePages 
	this.porcentActivePages=_porcentActivePages 
	this.isAllActiveAt=_isAllActiveAt 
	this.escribeValor=_escribeValor
	this.condicionActivo=_condicionActivo
	this.isMenu=_isMenu
	this.getPorcentajeUso=_getPorcentajeUso
	// PROPIEDADES
	if (_conValores==null) this.conValores=false; 
	else this.conValores=_conValores
	
	this.sep="_"
	this.noRelleno="-";
	this.siRelleno="Accedido";	
	this.valorNulo="-";			// CUIDADO !!! el valor "NULL" da graves problemas, no usarlo
	this.apartados=new Array()
	this.addFillSection("",n)


}
