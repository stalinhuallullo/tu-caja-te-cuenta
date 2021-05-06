// ========================================================================================================
//
// 		Variables de configuración del comportamiento SCORM
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 08/3/2012
//
// ========================================================================================================




// Variables de configuracion generales  ------------------------------------------------------

_SCORM_=true;					// Si indicamos FALSE el contenido debe de funcionar sin SCORM

//_SCORM_pagereload=true

//_SCORM_debug=false;
//debug=false;

//_SCORM_infWindow=false;


_SCORM_ScoreMax=100;
_SCORM_ScoreMin=80;
_SCORM_ScoreApto=80;


// Respecto al control de secuencialidad y bloqueo de ejercicios
//_SCORM_control_secuence=true // Si es false permite acceder a cualquier parte del menu
//_SCORM_control_resolver_ejercicios=true// Obliga a realizar al menos una vez cada ejercicio para continuar.

_SCORM_RTM_INICIALIZADO=false
_SCORM_RTM_PaginaRecuperada=false 

SCORM_MasteryScore=null

// MENSAJES ------------------------------------------------------------------------------------

_SCORM_mensaje_noApi="No se ha podido activar la funcionalidad Scorm en este sistema.\n\n Se procede a desactivar el seguimiento Scorm del curso con lo cual podrá navegar en el curso pero no se registrará su paso por el."