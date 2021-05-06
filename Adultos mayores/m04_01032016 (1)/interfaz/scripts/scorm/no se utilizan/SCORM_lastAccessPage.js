// JavaScript Document
function _lstImportar(url)
{
	this.lastAccessPage=url
}
function _lstExportar()
{
 	return this.lastAccessPage
}
function  _obtenerNombreCompleto(url)
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
function _setLastAccessPage(url)
{
	 
	
	// Almacenamos el nombre de la última página accedida
	// En el caso de que _SCORM_lastURLComplete indique true se almacenará 
	// el camino completo (en caso de que existan paginas en distintos directorios)
	// y en el caso de que valga false solo almacenamos el nombre.
	if ((_SCORM_lastURLComplete!=null)&&(_SCORM_lastURLComplete)) this.lastAccessPage=url;	
	else  this.lastAccessPage=this.obtenerNombreCompleto(url);	
	
}
function _getLastAccessPage()
{
	return this.lastAccessPage
}

function SCORM_lastAccessPage()
{
	this.lastAccessPage=""
	
	this.importar=_lstImportar
	this.exportar=_lstExportar
	this.setLastAccessPage=_setLastAccessPage
	this.getLastAccessPage=_getLastAccessPage
	this.obtenerNombreCompleto=_obtenerNombreCompleto
}
