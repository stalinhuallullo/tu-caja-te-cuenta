// JavaScript Document



InitHTML ="<body><table width=100% style='border:1px solid black' > "
		 

InterLineHTML="<tr><td valign=top >"
InterLineEndHTML="<td></tr>"
		
EndHTML="</table></body>"

function _clear()
{
	if (this.ventana!=null) this.ventana.close()
	this.HTML_history=""
}
function _writeInf(txt)
{	
	var HTMLinfWindow=""
	

	try{
		//document.write("Estamos en writeinf del objeto")
		 	//this.showWindow()
			//HTMLinfWindow= InitHTML + InterLineHTML +  txt + InterLineEndHTML + EndHTML
			//this.HTML_history=this.HTML_history + HTMLinfWindow
		 	
			this.ventana.document.write( txt )
		 
	}
	catch(e)
	{
		// nada
	}
	
}
function _showWindow()
{	//document.write("Estamos en shoWindow del objeto<br>")
	var esAbierta=false
	
	if(this.ventana==null)
	{
		//document.write("abrimos la ventana<br>")
		this.ventana=open('about:blank',this.name, 'height=500,width=800,left=100,top=100,resizable=no,scrollbars=yes,toolbar=no,status=yes') 
		esAbierta=true
	}
	else
	{ 
		if (this.ventana.closed ==true)
		{
			this.ventana=null
			this.ventana=open('about:blank',this.name, 'height=500,width=800,left=100,top=100,resizable=no,scrollbars=yes,toolbar=no,status=yes') 
			this.ventana.document.write( this.HTML_history )
			esAbierta=true
		}
		else
		{
			this.ventana.focus()
		}
	
	}
	return esAbierta

}
function infWindow(nombre)
{
	this.name=nombre
	this.writeInf=_writeInf
	this.showWindow=_showWindow
	this.ventana=null
	this.HTML_history=""
	this.clear=_clear
}


function writeInf(txt)
{
	//document.write("se deberia escribir: " + txt + "<br>")
	debugWindow.writeInf(txt)
}


