// 
//	REQUISITOS
//
//	REQUIERE SCORM_dataIndex dado que es un objeto Heredado
//	this.getApartadosIndexado
//
//	El formato de cada pareja de valores es:   aciertos|fallos
//
//	por ejemplo 5 aciertos y 2 fallos es 5|2
//
function _strVal(str,i)
{
	var valores,v
	v=0
	if (str==this.valorNulo)  v=0
	else 
	{
		valores=str.split("|")
		if (!isNaN(parseInt(valores[i],10))) v=parseInt(valores[i],10)
		else v= 0
	}
	
	return v
	
}
function _strAciertos(str)	{	return this.strVal(str,0)}
function _strFallos(str)	{	return this.strVal(str,1)}

function _getAciertos(index)
{
	var v, valor
	v=0
	
	valor=eval(this.getApartadosIndexado(index))
	if ((valor!=null)&&(typeof(valor)!="object"))
	{
		v= this.strAciertos(valor)
	}
	return v
}



function _getFallos(index)
{
	var v, valor
	
	v=0
	
	valor=eval(this.getApartadosIndexado(index))
	if ((valor!=null)&&(typeof(valor)!="object"))
	{
		v= this.strFallos(valor)
	}
	return v
}

function _setAciertos(index,aciertos)
{
	var r, f,a,composeStr
	
	r=true
	valor=eval(this.getApartadosIndexado(index))
	if ((valor!=null)&&(typeof(valor)!="object"))
	{
		
		//a= this.strAciertos(str)
		f= this.strFallos(valor)
		
		composeStr=aciertos + "|" + f
		eval(this.getApartadosIndexado(index) + "='" + composeStr + "'")
		
	}
	else r=false
	
	return r
}
function _setFallos(index,fallos)
{
	var r, f,a,composeStr
	
	r=true
	valor=eval(this.getApartadosIndexado(index))
	if ((valor!=null)&&(typeof(valor)!="object"))
	{
		//a= this.strAciertos(str)
		a= this.strAciertos(valor)
		composeStr=a + "|" + fallos
		eval(this.getApartadosIndexado(index) + "='" + composeStr + "'")
		
	}
	else r=false
	
	return r	
}

function _incAciertos(index)
{   var v

	v=this.getAciertos(index)
	v=v+1
	this.setAciertos(index,v)
}

function _incFallos(index)
{
	var v
	
	v=this.getFallos(index)
	v=v+1
	this.setFallos(index,v)
}

function _getMedia(index)
{
	var a,f,t,r,cont,valor,contMedias,valMedias,newindex
	
	valor=eval(this.getApartadosIndexado(index))
	if ((valor!=null)&&(typeof(valor)!="object"))
	{
		// Estamos en una hora
		a=this.getAciertos(index)
		f=this.getFallos(index)
		t=a+f
		if (t>0) r=Math.round(a/t*100)
		else r=0
	}
	else
	{
		newindex=""
		valMedias=0
		contMedias=0
		valor=eval(this.getApartadosIndexado(index))		
		//alert("En el index: " +  index + " el valor es : " + valor + " y el tipo: " + typeof(valor) + " y la variable es " + this.getApartadosIndexado(index) )
		// Estamos en un vector
		for(cont=1;cont<=valor.length;cont++)
		{
			newindex=index + this.sep + cont
			//alert(newindex)
			valMedias= valMedias + this.getMedia(newindex)
			contMedias ++
		}
		if (contMedias>0) r=valMedias/contMedias
		else r=0
	
	}
	return r
}
function _escribeValorEj(v)
{
	var a,f,t,m,HTML=""
	a=this.strAciertos(v)
	f=this.strFallos(v)
	
	t=a+f
	if (t>0) m=Math.round(a/t*100)
	else m=0
	
	//HTML=HTML + "<table border=0 style='font-size:8pt' ><tr>"
	//HTML=HTML + "<td>Aciertos: " + a + "</td><td>Fallos: " + f   + "</td><td>Media: " + m + "</td>"
	//HTML=HTML + "</tr></table>"
	HTML=HTML + "Aciertos: " + a + ", Fallos: " + f   + ", Media: " + m + " "
	return HTML
}
function _condicionActivoEj(strval)
{
	var a,r
	
	r=false
	
	a= this.strAciertos(strval)
	if (a>0) r=true
	else r=false
	//alert(" strval " + strval + " a: " + a)
	return r
}
function SCORM_ejDataIndex(i)
{
	
	this.base= SCORM_dataIndex 
	this.base(i,true)
	
	// Redefinimos algunos metodos
	this.escribeValor=_escribeValorEj	
	this.condicionActivo=_condicionActivoEj

	// Añadimos nuevos metodos
	this.getAciertos=_getAciertos
	this.setAciertos= _setAciertos
	this.getFallos=_getFallos
	this.setFallos= _setFallos
	this.incAciertos= _incAciertos
	this.incFallos= _incFallos
	this.getMedia= _getMedia
	this.strVal=_strVal 
	this.strAciertos =_strAciertos 
	this.strFallos=_strFallos 
	
	this.valorNulo="0|0"
}

	
	
	
