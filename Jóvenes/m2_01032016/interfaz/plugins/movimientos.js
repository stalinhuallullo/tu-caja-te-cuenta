(function( $ ) {
	$.fn.objetoenmovimiento = function() {		
		var objeto = $(this);	
		
		if(objeto.attr('tipo')=='creciente'){
			objeto.transition({ scale: 0.1 }, 10);
		}
		
		function animarobjeto(elemento, movx, movy, rotacion, tiempo, retraso){			
			if($(objeto).attr('tipo') == 'vaiven'){
				$(elemento).transition({opacity:100, delay: retraso}, 100, function(){
					$(elemento).transition({x:movx, y:movy, opacity:100, rotate:rotacion, delay: 0}, tiempo, function(){
						$(elemento).transition({x:0, y:0, rotate:-rotacion}, tiempo, function(){
							animarobjeto(elemento, movx, movy, rotacion, tiempo, 0)
						})
					})
				});
			
			} else if($(objeto).attr('tipo') == 'creciente'){
				$(elemento).transition({x:movx, y:movy, scale:1, rotate:rotacion, delay: retraso}, tiempo);
			} else {
				$(elemento).transition({x:movx, y:movy, opacity:100, rotate:rotacion, delay: retraso}, tiempo);
			}
		}
		
		var xinicio = parseInt($(objeto).attr('xinicio'));
		var yinicio = parseInt($(objeto).attr('yinicio'));
		$(objeto).css('position', "absolute");
		$(objeto).css('z-index', "1");
		$(objeto).css('left', xinicio+"px");
		$(objeto).css('top', yinicio+"px");
		
				
			
		var arco = parseFloat($(objeto).attr('arco'));
		var rotacion = parseInt($(objeto).attr('rotacion'));
		var retraso = parseFloat($(objeto).attr('retraso'));
		var velocidad = parseFloat($(objeto).attr('velocidad'));
		var desplazamientox = parseFloat($(objeto).attr('xfin'))-parseFloat($(objeto).attr('xinicio'));
		var desplazamientoy = parseFloat($(objeto).attr('yfin'))-parseFloat($(objeto).attr('yinicio'));		
		var activador = $(objeto).attr('activador');
		
		if((activador=="")||(activador==undefined)){
			$(objeto).css('opacity', '0');
			animarobjeto(objeto, desplazamientox, desplazamientoy, rotacion, velocidad, retraso)
		}
		else {			
			$('#'+activador).click(function(){
				if ($('#'+activador).hasClass('usado')){
				} else {
					$(this).addClass('usado');
					animarobjeto(objeto, desplazamientox, desplazamientoy, rotacion, velocidad, retraso)
				}
			});
		}
			/*********************************************
			 * TEST USO VARIABLE ARCO - SIN FINALIZAR
			 *********************************************/
			
			/*
			console.log('Arco: ' + arco)
			
			var xpuntomedio = (xinicio+xfin)/2;
			var ypuntomedio = (yinicio+yfin)/2;
			
			/*
			var pendiente = (yfin - ypuntomedio)/(xfin - xpuntomedio)
			var angulo = Math.tan(pendiente)
			console.log('Angulo: ' + angulo)
			
			
			var cajainicio = '<div class="animado" style="width:5px; height:5px; position:absolute; left:' + (xinicio) +'px; top:' + (yinicio) +'px; background:#f00"></div>';
			var cajafin = '<div style="width:5px; height:5px; position:absolute; left:' + (xfin) +'px; top:' + (yfin) +'px; background:#f00"></div>';
			var puntomedio = '<div style="width:5px; height:5px; position:absolute; left:' + (xpuntomedio) +'px; top:' + (ypuntomedio) +'px; background:#0f0"></div>';
			
			$('#fab20_body').append(cajainicio);
			$('#fab20_body').append(cajafin);
			$('#fab20_body').append(puntomedio);
			
			var arcx = xpuntomedio - xinicio;
			var arcy = ypuntomedio - yinicio;									
			
			console.log('arcx: ' + arcx)
			console.log('arcy: ' + arcy)
				
			var raiz = Math.pow(arcx, 2);
			console.log('cuadrado de x: ' + raiz)
			raiz += Math.pow(arcy, 2);
			console.log('mas cuadrado de y: ' + raiz)
			raiz = Math.sqrt(raiz);	
			console.log('raiz: ' + raiz)
			
			var xarco = arcx/raiz;
			xarco = arco * xarco;
			
			console.log('arco de x: ' + xarco)
			
			var yarco = arcy/raiz;
			yarco = arco * yarco;
			
			console.log('arco de y: ' + yarco)			
			
					
			xarco += ypuntomedio;
			yarco += xpuntomedio;
			
			
			
			
			if ((xarco>=0)&&(yarco>=0)){
				var coorx = xpuntomedio + yarco;
				var coory = ypuntomedio - xarco;
				var animatex = coorx - xinicio + yarco;
				var animatey = coory - yinicio - xarco;
				animatex = animatex/20;
				animatey = animatey/20;				
				
			}else if ((xarco>=0)&&(yarco<=0)){				
				var auxy = Math.abs(yarco);
				var coorx = xpuntomedio - auxy;
				var coory = ypuntomedio - xarco;
			}else if ((xarco<=0)&&(yarco<=0)){
				var auxx = Math.abs(xarco);
				var auxy = Math.abs(yarco);
				var coorx = xpuntomedio - auxy;
				var coory = ypuntomedio + auxx;			
			} else if ((xarco<=0)&&(yarco>=0)){
				var auxx = Math.abs(xarco);
				var coorx = xpuntomedio + yarco;
				var coory = ypuntomedio + auxx;
			}						
			
			/*
			console.log('Punto Inicio: [' + xinicio + ',' + yinicio + ']')
			console.log('Punto medio: [' + xpuntomedio + ',' + ypuntomedio + ']')
			console.log('Punto Fin: [' + xfin + ',' + yfin + ']')			
			console.log('Arco : [' + xarco + ',' + yarco + ']')
			var miarco = '<div style="width:5px; height:5px; position:absolute; left:' + (coorx) +'px; top:' + (coory) +'px; background:#00f"></div>';
			
			
			
			//$('#fab20_body').append(miarco);
			
			if ((xarco>=0)&&(yarco>=0)){
				
			}else if ((xarco>=0)&&(yarco<=0)){				
			}else if ((xarco<=0)&&(yarco<=0)){
			}else if ((xarco<=0)&&(yarco>=0)){
			}
			*/

		
		
  };
})( jQuery );