// ========================================================================================================
//
// 		FUNCIONES RELACIONADAS CON LOS MENSAJES DEL SISTEMA
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 7/3/2011
//
// ========================================================================================================

//media='print' 
var PDFWindowActive=false;
var PDFWindow=null;
var iniHTML="<html><head><link rel='stylesheet' type='text/css' href='interfaz/tema/css/print.css'  />"
	iniHTML=iniHTML + "<meta http-equiv='Content-Type' content='text/html; charset=utf-8' /></head><body> "
	iniHTML=iniHTML + "<div id='fab20_body'>"
var finHTML="</div>"	
	finHTML=finHTML + "</body></html>"
var PDF_OpenString="height=700,width=1024,left=1,top=1,resizable=yes,scrollbars=yes,toolbar=yes,status=yes"

// Abre una ventana emergente en la cual se voltar� toda la informaci�n html del curso
function activarPDFWindow(contenido)

{	//document.write("Estamos en shoWindow del objeto<br>")
	var esAbierta=false

	
	if(PDFWindow==null)
	{
		//document.write("abrimos la ventana<br>")
		PDFWindow=open('about:blank',"PDF", PDF_OpenString) 
		//PDFWindow.document.write(INI_HTMLFORM +    convertirRutasToAbsolutas(iniHTML +contenido + finHTML )+  FIN_HTMLFORM +iniHTML +contenido + finHTML )
		PDFWindow.document.write("<a class='btn_imprimir' href='javascript:window.print(); void 0;'>Imprimir</a>" + iniHTML + contenido + finHTML )
		PDFWindowActive=true
		PDFWindow.document.close();
	}
	else
	{ 
		if (PDFWindow.closed ==true)
		{
			PDFWindow=null
			PDFWindow=open('about:blank',"PDF",  PDF_OpenString) 
			//PDFWindow.document.write(INI_HTMLFORM +  convertirRutasToAbsolutas(iniHTML +contenido+ finHTML)  + FIN_HTMLFORM+ iniHTML +contenido + finHTML)
			PDFWindow.document.write( iniHTML +contenido + finHTML)
			PDFWindowActive=true
			PDFWindow.document.close();
		}
		else
		{
			PDFWindow.focus()
		}
	
	}
	return esAbierta}








