//
//
//				IMPLEMENTACIÓN BARRA DE DEPURACION
//
//		AUTOR: Antonio Jesus Paredes Garcia
//		Fecha: 20/11/2012
//
//
//
var _DEBUGSCORMVALUE_=""
var scormdebugmenu=""

scormdebugmenu=scormdebugmenu+"Opciones Debug 1.0 "
scormdebugmenu=scormdebugmenu+"<button onclick='activarInfWindow()'>ShowInfo</button>"
scormdebugmenu=scormdebugmenu+"<button onclick='indiceUnidad.getSerializeContentAccess()'>Mostrar avance</button>"
scormdebugmenu=scormdebugmenu+"<button onclick='_mnudbgscorm_Exit()'>Exit</button>"
scormdebugmenu=scormdebugmenu+"<div id='sequencerinfo' style=' float:right' ></div>"

document.onkeypress=function(event)
{
	//alert(window.event ? event.keyCode : e.which);
	//var num = event.keyCode;// e?e.keyCode:event.keyCode;
	var num
	
	if(navigator.appName == "Netscape") 
		num = event.charCode; //or e.which; (standard method)
	else
	{
		num=window.event ? window.event.keyCode : event.keyCode
		//num = event.keyCode;
	}
	 
	//alert("ss" + num)
	_DEBUGSCORMVALUE_=_DEBUGSCORMVALUE_ + String.fromCharCode(num);
	_DEBUGSCORMVALUE_=fRight(_DEBUGSCORMVALUE_,12)
	
	if (_DEBUGSCORMVALUE_.toUpperCase()=="DEBUGINGENIA")
	{
		//alert("Activamos el debug");
		//$(F20_CAPA_DEBUG).css("display", "block");
		$(F20_CAPA_DEBUG).css("visibility", "visible");
		$(F20_CAPA_DEBUG).css("top", "1px");
		$(F20_CAPA_DEBUG).css("left", "1px");
		$(F20_CAPA_DEBUG).css("width", "600px");
		$(F20_CAPA_DEBUG).css("height", "25px");
		$(F20_CAPA_DEBUG).html(scormdebugmenu);
		
	}

	//alert('valor ascii: ' + num + " letra: " +  String.fromCharCode(num));
	
	//<li><button onclick="activarInfWindow();">Dbg</button></li> 
	//<li><button onclick="writeInf('midato');">Stado</button></li> 
	
}

 

function fRight(str, n)
{
    if (n <= 0)	return "";
    else if (n > String(str).length)       return str;
    else {       var iLen = String(str).length;
	return String(str).substring(iLen, iLen - n);    
	}
}

function _mnudbgscorm_Exit()
{
	//alert("Salir")
	$(F20_CAPA_DEBUG).css("visibility", "hidden");
}
