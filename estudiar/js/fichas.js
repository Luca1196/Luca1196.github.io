/* TODO CON FICHAS (18/11, pedido de Luca: «quitá las tarjetas de izquierda y derecha, quiero aprender todo con las tarjetas de fichas»).
   Cada serie binaria (swipe izquierda/derecha) se convierte en un paquete de tarjetas de fichas: cada pregunta es un casillero, la respuesta correcta es
   su ficha y la opción equivocada de la serie queda como ficha tentadora con su porqué. Paquetes de hasta 4 preguntas.
   Se conservan: el contexto de cada pregunta, la teoría (sale con «No sé» y al fallar), el tema del filtro, las previas que tenía la serie (req) y el
   nombre de la serie como token, así las cadenas que la pedían de introducción siguen pidiéndola. Las series viejas quedan ocultas (hid) y la pestaña
   Básico desaparece: su contenido está en Principal, en el filtro de su tema. Para agregar teoría nueva: escribirla ya como tarjeta de fichas. */
(()=>{const S=SWC.filter(c=>!c.bld&&!c.bqx&&!c.hid&&c.steps&&c.steps.length);
 S.forEach(c=>{const tm=c.tm||(c.arch?"lg3":tema(c)),th=(c.steps.find(s=>s.th)||{}).th||"",G="Fichas · "+c.g,cards=[];
  for(let i=0;i<c.steps.length;i+=4){const ch=c.steps.slice(i,i+4),parts=[],dis=[];
   ch.forEach((s,j)=>{if(j)parts.push("\n");parts.push((s.x?s.x+" — ":"")+s.q,{t:s.a,sn:"la respuesta "+(j+1),w:s.w||"",own:1});
    if(s.b&&s.b!=s.a&&!dis.some(d=>d[0]==s.b))dis.push([s.b,s.w?"No es eso. "+s.w:"No es eso."])});
   const n=Math.ceil(c.steps.length/4),k=kSeq(G+(n>1?" · "+(i/4+1)+"/"+n:""),c.g,"Completá cada respuesta con las fichas.",parts,dis.filter(d=>!ch.some(s=>s.a==d[0])),
    {ctx:c.ctx||null,tm,ar:c.ar||(c.s=="lg"?undefined:"com"),th:th||ch.map(s=>s.w).filter(Boolean).join(" "),ko:"Una respuesta por renglón, en orden.",
     kv:()=>`<div class="lt"><b>${esc(c.g)}</b></div>`+(c.ctx?`<div class="lt">${esc(c.ctx)}</div>`:"")+(th?kFold("Teoría",`<div class="lt">${esc(th)}</div>`,0):"")});
   k.s=c.s;k.tm=tm;if(c.ar)k.ar=c.ar;cards.push(k)}
  kChain(G,[{id:"f",cards}],{req:c.req||[]});cards[0].toks.push(c.g);c.hid=1;c.arch=0});
 const b=document.getElementById("t7");if(b)b.hidden=true})();
