var clic = 1;
function divAudiotext(){
	if(clic==1){
	document.getElementById("popup_audiotexto").style.height = "150px";
	clic = clic + 1;
	} else {
		document.getElementById("popup_audiotexto").style.height = "0px";
	clic = 1;
	}
}