// ========================================================================================================
//
// 		Clase TimeInterval: contadora de tiempo. Nos devuelve un valor tipo 0000:00:00.00
//
//
//		Version: 1.0
//		Autor  : AJPG
//		Fecha  : 08/3/2012
//
// ========================================================================================================




function f2d(valor)
 {
 		if (valor<10) return "0" + valor;
		else return "" + valor;
 }
 function _calculaIntervaloAcumulado()
 {
      calculo=((this.h * 3600) + 	(this.m * 60)  + this.s ) * 1000
	 //alert(calculo);
 	 time2= new Date().getTime();
	 
	 intervalo=new Date();
	 intervalo.setTime(time2- this.t_inicial + calculo );
	
		
	 //intervalo.setSeconds(1000);
	
	 timetext="00" + f2d(intervalo.getHours()-1) + ":" + f2d(intervalo.getMinutes()) + ":" + f2d(intervalo.getSeconds()) + ".00";
	
	 return timetext;
	 
	 
 }
 

 
 function TimeInterval(t)
 {
   	this.h=0;
	this.m=0;
	this.s;

	tiempo=t.split(":");

	this.h=parseInt(tiempo[0],10);
	this.m=parseInt(tiempo[1],10);
	sec=tiempo[2].split(".");
	
	this.s=parseInt(sec[0],10);

	//alert(this.h + ":" + this.m + ":" +  this.s)
	
	this.t_inicial= new Date().getTime();
	//alert("" + this.t_inicial) ;
	
	this.calculaIntervaloAcumulado=_calculaIntervaloAcumulado;
 }
 
 


 