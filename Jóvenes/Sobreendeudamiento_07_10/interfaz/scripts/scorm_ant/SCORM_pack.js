// ========================================================================================================
//
// 		Clase SCORM_pack: utilizada para almacenar valores string en el suspendata. Unifica los strings 
//						  en una única cadena con un separador definido en la clase.
//
//
//							Dispone de métodos útiles para la recuperación de valores.
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 08/3/2012
//
// ========================================================================================================



function _packExportar()
{
	var cont,exportacion=""
	
	for(cont=0;cont<this.vectorObjetos.length;cont++)
	{
		if(exportacion!="") exportacion=exportacion + this.sep
		exportacion=exportacion + this.vectorObjetos[cont].exportar()
		
	}
	
	return exportacion
}
function _packImportar(str)
{
	var vectorImportaciones, cont
	
	
	vectorImportaciones=str.split(this.sep)
	for(cont=0;cont<this.vectorObjetos.length;cont++)
	{
		try
		{
			this.vectorObjetos[cont].importar(vectorImportaciones[cont])
		}
		catch(e)
		{
			msg_error(" No se ha importado correctamente el elemento " + cont + " en SCORM_pack")
		}
	}
}

function _addObj(obj)
{
	this.vectorObjetos[this.vectorObjetos.length]=obj
}
function SCORM_pack()
{
	this.vectorObjetos=new Array()
	this.sep="::"
	
	this.addObj=_addObj
	this.importar=_packImportar
	this.exportar=_packExportar
}