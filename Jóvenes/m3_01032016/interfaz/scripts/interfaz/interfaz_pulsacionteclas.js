
// ==================================================================================================
// ==================================================================================================
// 												DEBUG
//
//	Muestra la información que nos interesa en una ventana emergente
//
//					"Control" + "i" para borrar el seguimiento
//					"Control" + "u" para mostrar seguimiento en pantalla
//
	function teclasD()
	{
		var ventana
		// Esto es control + I y es para reiniciar las paginas accedidas
		if ((event.ctrlKey) && (event.keyCode==73))
		{
		//alert("se ha pulsado ");
		
			 if (confirm("¿Deseas borrar el seguimiento de paginas accedidas?")) 
			{//promt("Saltamos a la pagina: " +  ultimoLugar);
				parent.ejData.importar("new Array()")
				parent.indice.importar("new Array()")
				parent.creaEstructuraEjData(parent.ejData)
				parent.creaEstructuraIndice(parent.indice)
			}
 		}
		
		
		//alert(event.keyCode)
		// Esto es control U y es para ver las paginas accedidas
		if ((event.ctrlKey) && (event.keyCode==85))		
		{
		//alert("se ha pulsado ");
		var HTML="<font size='2' face='arial'> <b>Ultimo Acceso:</b>" + parent.lastPage.getLastAccessPage() + "</font><br><table width=100% style='border:1px solid black' ><tr><td valign=top >"
		HTML=HTML + parent.indice.showHtml() +  "</td><td valign=top >"
		HTML=HTML + parent.ejData.showHtml()+  "</td><tr></table>"
		ventana=open('about:blank',null, 'height=500,width=800,left=100,top=100,resizable=no,scrollbars=yes,toolbar=no,status=yes') 
 ventana.document.write(HTML)
 
 
 		}		
		 
		return false;
	}
 
	if (parent._SCORM_)
	{
		if (window.Event) // Navigator 4.0x
		{
			document.captureEvents(Event.KEYDOWN);
		}
	
		document.onkeydown = teclasD; 
	}
