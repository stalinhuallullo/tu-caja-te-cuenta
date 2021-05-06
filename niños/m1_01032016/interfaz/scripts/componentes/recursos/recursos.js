/***************************************************
 *
 * 	RETOS
 * 	Genera las funciones y codigos necesarios
 * 	para pintar y actualizar los retos.
 *	Version: 1.0
 *	Autor  : FJLG
 *	Fecha  : 29/07/2014
 *
 ***************************************************/

function addrecursos(){
	var txtRECURSOS = '';					
		if(HAS_CREDITS){
			txtRECURSOS=txtRECURSOS + '<li id="credits"><a href="#" class="kooltip"><div id="btn_creditos" class="btnrecursos" onclick="creditos();" alt="Creditos"></div><span class="tooltip grey top right slide-up interfaz">Créditos</span></a></li>'
		}
		if(HAS_BIBLIOG){
			txtRECURSOS=txtRECURSOS + '<li id="bibliog"><a href="#" class="kooltip"><div id="btn_bibliografia" class="btnrecursos" onclick="bibliografia();" alt="Enlaces de interés"></div><span class="tooltip grey top right slide-up interfaz">Enlaces de interés</span></a></li>'
		}
		if(HAS_GLOSSARY){
			txtRECURSOS=txtRECURSOS + '<li id="glossary"><a href="#" class="kooltip"><div id="btn_glosario" class="btnrecursos" onclick="glosario();"  alt="Glosario"></div><span class="tooltip grey top right slide-up interfaz">Glosario</span></a></li>'
		}
		if(HAS_ATTACH){
			txtRECURSOS=txtRECURSOS + '<li id="attach"><a href="#" class="kooltip"><div id="btn_anexos" class="btnrecursos" onclick="anexos()"  alt="Anexos"></div><span class="tooltip grey top right slide-up interfaz">Anexos</span></a></li>'
		}
		if(HAS_TIPS){
			txtRECURSOS=txtRECURSOS + '<li id="tips"><a href="#" class="kooltip"><div id="btn_tips" class="btnrecursos" onclick="tips()" alt="Consejos"></div><span class="tooltip grey top right slide-up interfaz">Consejos</span></a></li>'
		}
		if(HAS_MINDMAP){
			txtRECURSOS=txtRECURSOS + '<li id="mindmap"><a href="#" class="kooltip"><div id="btn_mindmap" class="btnrecursos" onclick="mindmap()" alt="Mindmap"></div><span class="tooltip grey top right slide-up interfaz">Mindmap</span></a></li>'					
		}
		if(HAS_PRINT){
			txtRECURSOS=txtRECURSOS + '<li id="print"><a href="#" class="kooltip"><div id="btn_print" class="btnrecursos" onclick="activarPDFWindow(indiceUnidad.getALLHTML())" alt="Imprimir"></div><span class="tooltip grey top right slide-up interfaz">Imprimir</span></a></li>'
		}
		if(HAS_PROGRESS){
			txtRECURSOS=txtRECURSOS + '<li id="progress"><a href="#" class="kooltip"><div id="btn_progreso" class="btnrecursos" onclick="progreso();" alt="Progreso"></div><span class="tooltip grey top right slide-up interfaz">Progreso</span></a></li>'					
		}
		if(HAS_HOME){
			txtRECURSOS = txtRECURSOS + '<li id="home"><a href="#" class="kooltip"><div id="btn_inicio" class="btnrecursos" onclick="indiceUnidad.firstPage()" alt="Inicio"></div><span class="tooltip grey top right slide-up interfaz">Inicio</span></a></li>';
		}					
		if(HAS_HELP){
			txtRECURSOS=txtRECURSOS + '<li><a href="#" class="kooltip"><div id="btn_ayuda" class="btnrecursos"></div><span class="tooltip grey top right slide-up interfaz">&nbsp; Ayuda &nbsp;</span></a></li>'
			txtRECURSOS=txtRECURSOS + '<li><a href="#" class="kooltip"><div id="btn_volver"></div><span class="tooltip grey top right slide-up interfaz">&nbsp; Volver &nbsp;</span></a></li>'
		}	
		txtRECURSOS=txtRECURSOS + '<li><div id="indice_btn" class="menubtn"></div></li><div class="clear"></div>'
		
	AJAX_cargarHTMLContent("#recursos", txtRECURSOS)
}