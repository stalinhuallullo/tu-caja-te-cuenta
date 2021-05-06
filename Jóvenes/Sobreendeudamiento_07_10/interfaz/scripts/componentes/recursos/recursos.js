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

		/////////////////////////////////////////////////////////////////////////////////
		if(HAS_EXIT){
			txtRECURSOS=txtRECURSOS + '<li id="salircurso"><a href="#" class="kooltip"><div id="btn_salircurso" class="btnsalircurso" onclick="window.close();" alt="'+getTextual("interfaz_tooltipSalir")+'"></div><span class="tooltip grey top right slide-up interfaz">'+  getTextual("interfaz_salir")   +'</span></a></li>'
		}
		/////////////////////////////////////////////////////////////////////////////////

		if(HAS_CREDITS){
			txtRECURSOS=txtRECURSOS + '<li id="credits"><a href="#" class="kooltip"><div id="btn_creditos" class="btnrecursos" onclick="creditos();" alt="'+  getTextual("interfaz_tooltipCreditos")   +'"></div><span class="tooltip grey top right slide-up interfaz">'+  getTextual("interfaz_tooltipCreditos")   +'</span></a></li>'
		}

		if(HAS_BIBLIOG){
			txtRECURSOS=txtRECURSOS + '<li id="bibliog"><a href="#" class="kooltip"><div id="btn_bibliografia" class="btnrecursos" onclick="bibliografia();" alt="'+  getTextual("interfaz_tooltipBibliografia")   +'"></div><span class="tooltip grey top right slide-up interfaz">'+  getTextual("interfaz_tooltipBibliografia")   +'</span></a></li>'
		}

		if(HAS_GLOSSARY){
			txtRECURSOS=txtRECURSOS + '<li id="glossary"><a href="#" class="kooltip"><div id="btn_glosario" class="btnrecursos" onclick="glosario();"  alt="'+getTextual("interfaz_tooltipGlosario")+'"></div><span class="tooltip grey top right slide-up interfaz">'+getTextual("interfaz_tooltipGlosario")+'</span></a></li>'
		}
		
		if(HAS_TIPS){
			txtRECURSOS=txtRECURSOS + '<li id="tips"><a href="#" class="kooltip"><div id="btn_tips" class="btnrecursos" onclick="tips();" alt="'+getTextual("interfaz_tooltipConsejos")+'"></div><span class="tooltip grey top right slide-up interfaz">'+getTextual("interfaz_tooltipConsejos")+'</span></a></li>'
		}

		if(HAS_MINDMAP){
			txtRECURSOS=txtRECURSOS + '<li id="mindmap"><a href="#" class="kooltip"><div id="btn_mindmap" class="btnrecursos" onclick="mindmap();" alt="'+getTextual("interfaz_tooltipMindmap")+'"></div><span class="tooltip grey top right slide-up interfaz">'+getTextual("interfaz_tooltipMindmap")+'</span></a></li>'					
		}

		if(HAS_PRINT){
			txtRECURSOS=txtRECURSOS + '<li id="print"><a href="#" class="kooltip"><div id="btn_print" class="btnrecursos" onclick="activarPDFWindow(indiceUnidad.getALLHTML())" alt="'+getTextual("interfaz_tooltipImprmir")+'"></div><span class="tooltip grey top right slide-up interfaz">'+getTextual("interfaz_tooltipImprmir")+'</span></a></li>'
		}
		
		if(HAS_ayuda){
			txtRECURSOS=txtRECURSOS + '<li id="ayuda"><a href="#" class="kooltip"><div id="btn_ayuda" class="btnrecursos" onclick="ayuda();" alt="'+getTextual("interfaz_tooltipAyuda")+'"></div><span class="tooltip grey top right slide-up interfaz">'+getTextual("interfaz_tooltipAyuda")+'</span></a></li>'					
		}

		if(HAS_PROGRESS){
			txtRECURSOS=txtRECURSOS + '<li id="progreso"><a href="#" class="kooltip"><div id="btn_progreso" class="btnrecursos" onclick="progreso();" alt="'+getTextual("interfaz_tooltipProgreso")+'"></div><span class="tooltip grey top right slide-up interfaz">'+getTextual("interfaz_tooltipProgreso")+'</span></a></li>'					
		}
		
		if(HAS_consulta){
			txtRECURSOS=txtRECURSOS + '<li id="consulta"><a href="#" class="kooltip"><div id="btn_consulta" class="btnrecursos" onclick="consulta();" alt="'+getTextual("interfaz_tooltipConsultaExp")+'"></div><span class="tooltip grey top right slide-up interfaz">'+getTextual("interfaz_tooltipConsultaExp")+'</span></a></li>'					
		}

		if(HAS_HOME){
		txtRECURSOS = txtRECURSOS + '<li id="home"><a href="#" class="kooltip"><div id="btn_inicio" class="btnrecursos" onclick="indiceUnidad.firstPage();" alt="'+getTextual("interfaz_tooltipInicio")+'"></div><span class="tooltip grey top right slide-up interfaz">'+getTextual("interfaz_tooltipInicio")+'</span></a></li>';
		}

		if(HAS_masinfo){
			txtRECURSOS=txtRECURSOS + '<li id="masinfo"><a href="#" class="kooltip"><div id="btn_masinfo" class="btnrecursos" onclick="masinfo();"  alt="Más Información"></div><span class="tooltip grey top right slide-up interfaz">No olvides...</span></a></li>'
		}

		if(HAS_documentacion){
			txtRECURSOS=txtRECURSOS + '<li id="documentacion"><a href="#" class="kooltip"><div id="btn_documentacion" class="btnrecursos" onclick="documentacion();"  alt="'+getTextual("interfaz_tooltipManual")+'"></div><span class="tooltip grey top right slide-up interfaz">'+getTextual("interfaz_tooltipManual")+'</span></a></li>'
		}

		/////////////////////////////////////////////////////////////////////////////////
		if(HAS_AUDIOTEXT){
			txtRECURSOS=txtRECURSOS + '<li id="audiotexto"><a href="#" class="kooltip"><div id="btn_audiotexto" class="btnaudiotexto" onclick="divAudiotext();" alt="'+  getTextual("interfaz_tooltipLocucion")   +'"></div><span class="tooltip grey top right slide-up interfaz">'+  getTextual("interfaz_tooltipLocucion")   +'</span></a></li>'
		}
		/////////////////////////////////////////////////////////////////////////////////

		txtRECURSOS=txtRECURSOS + '<li><a href="#" class="kooltip"><div id="btn_volver"></div><span class="tooltip grey top right slide-up interfaz">&nbsp; '+getTextual("interfaz_volver")+' &nbsp;</span></a></li>'
		txtRECURSOS=txtRECURSOS + '<li><a href="#" class="kooltip"><div id="indice_btn" class="menubtn"></div><span class="tooltip grey top right slide-up interfaz">&nbsp; '+getTextual("interfaz_indicecontenidos")+' &nbsp;</span></a></li><div class="clear"></div>'
		
	AJAX_cargarHTMLContent("#recursos", txtRECURSOS)
}