/* TEORÍA DENTRO DEL «NO SÉ» (18/11, pedido de Luca: «quiero aprender con las tarjetas de fichas de resolver ejercicios; el contenido teórico, en los
   "no sé"»). Las series binarias (izquierda/derecha) ya no se muestran como tarjetas: su contenido pasa a «Más teoría de este tema», que se abre con
   «No sé» en cualquier tarjeta de fichas del mismo tema (filtro). Como ya no hay tarjetas de introducción, sus nombres se sacan de las previas (req):
   los ejercicios no esperan a ninguna serie. Las series que adelantaban respuestas de un examen ya estaban ocultas y no se usan.
   La pestaña Básico se oculta. Teoría nueva: escribirla en el th de la tarjeta (teoría de esa acción) o como serie binaria (va a «Más teoría»). */
(()=>{const S=SWC.filter(c=>!c.bld&&!c.bqx&&c.steps&&c.steps.length),names=new Set(S.map(c=>c.g)),T={};
 S.filter(c=>!c.hid).forEach(c=>{const tm=c.tm||(c.arch?"lg3":tema(c));(T[tm]=T[tm]||[]).push(c);c.hid=1;c.arch=0});
 SWC.forEach(c=>{if(c.req)c.req=c.req.filter(t=>!names.has(t))});
 window.TEMATEO=tm=>{const L=T[tm]||[];if(!L.length)return"";
  return`<details style="margin-top:8px"><summary>📚 Más teoría de este tema (${L.length})</summary>`+L.map(c=>{const th=(c.steps.find(s=>s.th)||{}).th;
   return`<details style="margin:4px 0 0 8px"><summary>${esc(c.g)}</summary>${th?`<div class="lt">${esc(th)}</div>`:""}`+c.steps.map(s=>`<div class="lt">• ${esc((s.x?s.x+" — ":"")+s.q)} → <b>${esc(s.a)}</b>${s.w?`<span class="mut"> · ${esc(s.w)}</span>`:""}</div>`).join("")+`</details>`}).join("")+`</details>`};
 const b=document.getElementById("t7");if(b)b.hidden=true})();
