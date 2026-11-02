/* INICIO: se carga al final; engancha pestañas y abre la pestaña del hash. */
[0,1,2,3,4,5].forEach(i=>$("t"+i).onclick=()=>tab(i));
{const hm={repaso:0,prog4:1,logica:2,deslizar:3,musica:4,errores:5},hh=location.hash.slice(1);tab(hh in hm?hm[hh]:3)}
