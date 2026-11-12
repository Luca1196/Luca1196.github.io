/* INICIO: se carga al final; engancha pestañas y abre la pestaña del hash. */
[0,1,2,3,4,5,6,7].forEach(i=>$("t"+i).onclick=()=>tab(i));
{const hm={repaso:0,prog4:1,logica:6,deslizar:3,musica:4,errores:5,bloques:6,basico:7},hh=location.hash.slice(1);tab(hh in hm?hm[hh]:3)}
