//
//
//		Libreria de funciones encargadas de la actualización y modificación del menú del interfaz
//
//
//

//
//	Consideraciones: Se actualiza un menú con la estructura de "menu_ejemplo.html"  
//  Este menú esta dibujado en: F20_CAPA_MENU
//  Cada elemento de menu tiene un id 	var id="#mnuElement_" + this.pagActual.index  ej: #mnuElement_1_1   #numElement_1_1_2
//	la funcion indiceUnidad.getMenuActualElement() nos devuelve el objeto actual
//	 
//
//	Los parámetros de llamada son el objeto que contiene el indice del contenio y la capa donde está dibujado el menu
//
//	Es decir:   ind=indiceMenu
//				capamenu=F20_CAPA_MENU
//
 

function existeEnVector(ind,vind)
{
	var encontrado=false
	
	var cont
	
	for(cont=0;cont<=vind.length;cont++)
	{
		if(vind[cont]==ind) encontrado=true
	}
	
	return encontrado
	
}

// Contrae el menu
function actualizaMenu(ind,capamenu)
{
	//alert()
	var vind=ind.getIndicesFromActual()
	var indicemnu
	
	// Añadimos la clase "Activos" a todos los elementos que esten en la jerarquia de la página marcada
	//$(capamenu + " li.apartado > p ").addClass("mnuElementActivo")
	$(capamenu + " li.apartado").each(function(){
											   
							
							indicemnu=$(this).attr("id").split("mnuElement_")[1]		
							if(existeEnVector(indicemnu,vind))
							{
								$(this).addClass("mnuElementActivo") 
								
							}
							else $(this).removeClass("mnuElementActivo")  
											   })

	$(capamenu + " li.pagina ").each(function(){
											  
							indicemnu=$(this).attr("id").split("mnuElement_")[1]		
							if(existeEnVector(indicemnu,vind))
							{
								$(this).addClass("mnuElementActivo")										  
							}
							else $(this).removeClass("mnuElementActivo")										  
							
											
											  })

	// ocultamos los ul que no esten en la jerarquia de la pagina actual
	// mostramos los ul de los elementos que esten en la jerarquia de la pagina actual
	$(capamenu + " > ul ").find("ul").each(function (i){
					
				indicemnu=$(this).attr("idElement").split("mnuElement_")[1]
				
	//	alert(i)
				if(!(existeEnVector(indicemnu,vind)))
				{
					if(($(this).css("display"))=="block")
					{
						$(this).slideUp(300)
						//$(this).css("display","none")
					}
				}
				else
				{
					//alert($(this).css("display")	)
					if(($(this).css("display"))=="none")
					{
						$(this).slideDown(500)
						//$(this).css("display","block")						
					}							
					
				}				
				
				//if((existeEnVector(indicemnu,vind))			$(this).css("display","none")				
				//alert($(this).parent.attr("id"))
				//$(this).slideUp()
				//alert($(this).attr("idElement").split("mnuElement_")[1])
		
		})
				
		// ---------------------------------------------------------------------------
		//
		//	Actualizamos el estado de accedido de cada página
		//
		actualizaAccesosMenu(ind.indice,ind,capamenu)
	
}
//indice.elements!=null
function actualizaAccesosMenu(nodo,ind,capamenu)
{
	var cont
	var mnu=null
	mnu =$("#mnuElement_"+ nodo.index)

	if((mnu!=undefined) &&(mnu!=null))
	{
		if (nodo.accedido) // Si se ha accedido al nodo, se marca la clase en el menu
		{
			mnu.addClass("accedido")
			
			
		}
		else
		{
			// eliminamos la clase "accedido"
			mnu.removeClass("accedido")
		}
	}
	if (nodo.elements!=null)
	{
		for(cont=0;cont<nodo.elements.length;cont++)
		{
			actualizaAccesosMenu(nodo.elements[cont],ind,capamenu)
		}
	}
}
