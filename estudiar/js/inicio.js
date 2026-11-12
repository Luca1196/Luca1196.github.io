/* INICIO: se carga al final; engancha pestañas y abre la pestaña del hash. */
[0,1,2,3,4,5,6,7].forEach(i=>$("t"+i).onclick=()=>tab(i));
/* COPIAR TARJETA (pedido de Luca): botón fijo 📋 que copia la tarjeta visible (las tarjetas deslizables no dejan
   seleccionar texto) con su identificación, para pegarla en el chat cuando algo está mal. */
(()=>{const TN={0:"Repaso",1:"Ejercicios Prog4",2:"Ejercicios Lógica",3:"Principal",4:"Oído",5:"Errores",6:"Bloques",7:"Básico"};
 const st=document.createElement("style");st.textContent="#cpc{position:fixed;right:max(12px,env(safe-area-inset-right,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:50;border-radius:99px;width:44px;height:44px;padding:0;font-size:18px;opacity:.9;box-shadow:0 2px 10px rgba(0,0,0,.25)}";document.head.appendChild(st);
 const b=document.createElement("button");b.id="cpc";b.className="btn";b.textContent="📋";b.title="Copiar tarjeta";b.setAttribute("aria-label","Copiar tarjeta");document.body.appendChild(b);
 const cp=t=>{const ok=()=>{b.textContent="✓";setTimeout(()=>b.textContent="📋",1500)},fb=()=>{const x=document.createElement("textarea");x.value=t;x.style.cssText="position:fixed;opacity:0";document.body.appendChild(x);x.select();try{document.execCommand("copy");ok()}catch(e){prompt("Copiá este texto:",t)}x.remove()};
  try{navigator.clipboard.writeText(t).then(ok,fb)}catch(e){fb()}};
 b.onclick=()=>{let id="";
  if(typeof OI!="undefined"&&OI&&(TAB==3||TAB==4))id=`tarjeta de oído · nota ${NN[OI.pc]} · cuerda ${MSTR[OI.s][0]} traste ${OI.f}`;
  else if((TAB==3||TAB==7)&&typeof SW!="undefined"&&SW&&SW.c)id=`serie ${SW.c.id} · ${SW.c.g||""}${SW.c.steps?" · paso "+(SW.i+1)+" de "+SW.c.steps.length:""}`;
  else if(TAB==0&&typeof Q!="undefined"&&Q&&Q.q&&Q.q[Q.i])id="tarjeta "+Q.q[Q.i].id;
  const el=(TAB==3||TAB==7)&&!(typeof OI!="undefined"&&OI)?(V.querySelector("#swc")||V.querySelector(".card")||V):V;
  const cl=el.cloneNode(true);cl.querySelectorAll("#fbs,button").forEach(x=>x.remove());cl.style.cssText="position:fixed;left:-9999px;white-space:pre-wrap";document.body.appendChild(cl);let tx=(cl.innerText||"").replace(/\n{3,}/g,"\n\n").trim();cl.remove();
  if(TAB==1||TAB==2){try{tx=($("fr").contentDocument.querySelector("main")||$("fr").contentDocument.body).innerText.trim()}catch(e){}}
  cp(`[${TN[TAB]}${id?" · "+id:""}]\n${tx}`)}})();
{const hm={repaso:0,prog4:1,logica:6,deslizar:3,musica:4,errores:5,bloques:6,basico:7},hh=location.hash.slice(1);tab(hh in hm?hm[hh]:3)}
