/* PESTAÑA ÁRBOL (pedido de Luca, 23/11: «una pestaña que muestre los paquetes para elegir cuál practicar; algunos requieren conocimientos previos de
   paquetes anteriores, por eso quiero que se muestren como un árbol de progreso, el mismo estilo que los juegos RPG para mejorar habilidades»).
   - Nodo = bloque de Principal (mtBlq: paquete, serie o árbol). Arista = previa: el bloque A habilita a B si B pide (req / BQ.req) un token que A da
     (toks de sus tarjetas, su título g o su bqx). El grafo se calcula de los datos: no hay que mantener nada a mano al sumar ejercicios.
   - Un árbol por tema (chips arriba). Niveles = profundidad de previas dentro del tema; dentro de cada nivel, los nodos se ordenan por el promedio de
     la posición de sus previas (menos cruces). Previas de otro tema: se nombran en el panel del nodo.
   - Estado del nodo: 🔒 bloqueado (le falta una previa) · ✨ disponible · anillo = tarjetas hechas / total · 🟡 terminado con errores · ⭐ dominado.
   - Tocar un nodo abre su panel; «Practicar» lleva a Principal con ESE bloque (SFORCE en nucleo.js) y después Principal sigue con su orden normal.
     Un bloque bloqueado se puede practicar igual, con aviso (no se esconde nada). */
(()=>{let ARF=null,ARS=null;const st=document.createElement("style");
 st.textContent=`.arw{overflow-x:auto;-webkit-overflow-scrolling:touch;padding:6px 0 10px}.arc{position:relative}.arn{position:absolute;width:78px;text-align:center;cursor:pointer;background:none;border:0;padding:0;color:var(--fg);font:inherit}
 .arn .o{width:50px;height:50px;margin:0 auto;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;position:relative;box-shadow:0 2px 6px rgba(0,0,0,.18)}
 .arn .o i{position:absolute;inset:5px;border-radius:50%;background:var(--card);display:flex;align-items:center;justify-content:center;font-style:normal}
 .arn .l{font-size:10.5px;line-height:1.2;margin-top:4px;max-height:3.6em;overflow:hidden}.arn.lock{opacity:.45}.arn.disp .o{animation:arp 1.8s ease-in-out infinite}
 .arn.sel .o{outline:3px solid var(--ac);outline-offset:2px}@keyframes arp{0%,100%{box-shadow:0 0 0 0 var(--ac)}50%{box-shadow:0 0 0 6px transparent}}`;document.head.appendChild(st);
 const reqOf=c=>c.bqx?BQ.req(c.bqx):(c.req||[]),okT=t=>(S2.bqok||{})[t]||(typeof TOKSEED=="function"&&TOKSEED(t));
 const short=g=>{const p=g.split(" · ");return p.length>2?p.slice(-2).join(" · "):g};
 function graph(){const B=mtBlq(),prov={};B.forEach(b=>pcCardsOf(b).forEach(c=>{(c.toks||[]).concat([c.g],c.bqx?[c.bqx]:[]).forEach(t=>prov[t]=b)}));
  const par=new Map();B.forEach(b=>{const s=new Set();pcCardsOf(b).forEach(c=>reqOf(c).forEach(t=>{const p=prov[t];if(p&&p!==b)s.add(p)}));par.set(b,[...s])});return{B,par}}
 function info(b,par){const C=pcCardsOf(b),done=C.filter(mtFinC).length,B=BST(),bs=B[b.id]||(b.then&&B[b.then.id]),miss=reqOf(b).filter(t=>!okT(t)),lk=miss.length>0;
  const s=bs==1?"dom":bs==2?"err":done?"prog":lk?"lock":"disp";return{C,done,s,lk,ps:par.get(b)}}
 const ICO={dom:"⭐",err:"🟡",prog:"",disp:"✨",lock:"🔒"},TXT={dom:"Dominado (terminado sin errores)",err:"Terminado con errores: vuelve como repaso",prog:"En progreso",disp:"Disponible",lock:"Bloqueado: le faltan previas"};
 window.arOpen=function(){if(SWM!=3)swMode(3);const{B,par}=graph(),T=[...new Set(B.map(tema))],ord=["com","md","dss","dcd","p3","lg1","lg2","lg3","lg4","lg5"];T.sort((a,b)=>(ord.indexOf(a)+99)%99-(ord.indexOf(b)+99)%99);
  if(!ARF||!T.includes(ARF))ARF=T.find(t=>B.some(b=>tema(b)==t&&info(b,par).s=="disp"))||T[0];
  const L=B.filter(b=>tema(b)==ARF),inT=new Set(L),dep=new Map(),D=b=>{if(dep.has(b))return dep.get(b);dep.set(b,0);const v=Math.max(-1,...par.get(b).filter(p=>inT.has(p)).map(D))+1;dep.set(b,v);return v};L.forEach(D);
  const lv=[];L.forEach(b=>(lv[dep.get(b)]=lv[dep.get(b)]||[]).push(b));const X=new Map(),W=86,H=112;
  lv.forEach((row,d)=>{if(d)row.sort((a,b)=>{const m=n=>{const p=par.get(n).filter(x=>X.has(x));return p.length?p.reduce((s,x)=>s+X.get(x),0)/p.length:1e3};return m(a)-m(b)});row.forEach((b,i)=>X.set(b,i))});
  const mx=Math.max(...lv.map(r=>r.length)),wid=Math.max(mx*W,320),pos=b=>{const r=lv[dep.get(b)];return{x:(X.get(b)+.5)*wid/r.length,y:dep.get(b)*H+28}};
  const I=new Map(L.map(b=>[b,info(b,par)])),tot=L.reduce((a,b)=>a+I.get(b).C.length,0),dn=L.reduce((a,b)=>a+I.get(b).done,0),dom=L.filter(b=>I.get(b).s=="dom").length;
  let svg=`<svg width="${wid}" height="${lv.length*H}" style="position:absolute;left:0;top:0;pointer-events:none">`;
  L.forEach(b=>par.get(b).filter(p=>inT.has(p)).forEach(p=>{const a=pos(p),c=pos(b),on=["dom","err"].includes(I.get(p).s);svg+=`<path d="M${a.x} ${a.y+25} C${a.x} ${a.y+70},${c.x} ${c.y-45},${c.x} ${c.y-25}" fill="none" stroke="${on?"var(--ac)":"var(--bd)"}" stroke-width="${on?3:2}"${on?"":' stroke-dasharray="4 4"'}/>`}));svg+="</svg>";
  const nodes=L.map(b=>{const q=I.get(b),p=pos(b),pc=Math.round(q.done/q.C.length*100),col=q.s=="dom"?"var(--ok)":q.s=="err"?"#d9a400":"var(--ac)";
   return`<button class="arn ${q.s}${ARS===b.id?" sel":""}" data-ar="n" data-v="${esc(b.id)}" style="left:${p.x-39}px;top:${p.y-25}px"><div class="o" style="background:conic-gradient(${col} ${q.s=="dom"||q.s=="err"?100:pc}%,var(--bd) 0)"><i>${ICO[q.s]||(pc+"%")}</i></div><div class="l">${esc(short(b.g))}</div></button>`}).join("");
  let pan="";const sb=L.find(b=>b.id===ARS);
  if(sb){const q=I.get(sb),pr=q.ps.map(p=>{const z=info(p,par);return`<div>${ICO[z.s]||"◔"} ${esc(p.g)}${tema(p)!=ARF?' <span class="mut">(otro tema)</span>':""}</div>`}).join("");
   pan=`<div class="card"><div class="lbl">${esc(TXT[q.s])}</div><h2 style="margin:4px 0">${esc(sb.g)}</h2><div class="pb" style="margin:6px 0"><i style="width:${Math.round(q.done/q.C.length*100)}%"></i></div><p class="mut" style="margin:0">${q.done}/${q.C.length} tarjetas hechas</p>${pr?`<div style="margin-top:8px"><b>Previas</b>${pr}</div>`:""}
    <div class="row" style="margin-top:10px;gap:6px"><button class="btn pri big" data-ar="go">${q.lk?"Practicar igual":"Practicar"}</button></div>${q.lk?'<p class="mut" style="margin:6px 0 0">Te faltan previas: vas a ver cosas que esas tarjetas enseñan antes.</p>':""}</div>`}
  V.innerHTML=`<div class="row" style="flex-wrap:wrap;gap:6px">${T.map(t=>`<button class="btn chip${t==ARF?" sel":""}" data-ar="t" data-v="${t}">${esc(TMN[t]||t)}</button>`).join("")}</div>
   <div class="card"><div class="row between"><b>${esc(TMN[ARF]||ARF)}</b><span class="mut">${dom}/${L.length} dominados · ${dn}/${tot} tarjetas</span></div><div class="pb" style="margin-top:6px"><i style="width:${tot?dn/tot*100:0}%"></i></div>
   <div class="arw"><div class="arc" style="width:${wid}px;height:${lv.length*H}px">${svg}${nodes}</div></div><p class="mut" style="margin:0;font-size:12px">🔒 bloqueado · ✨ disponible · % tarjetas hechas · 🟡 con errores · ⭐ dominado</p></div>${pan}`;
  if(sb){const el=V.querySelector(".card:last-child");el&&el.scrollIntoView&&el.scrollIntoView({block:"nearest"})}};
 V.addEventListener("click",ev=>{if(TAB!=9)return;const b=ev.target.closest("[data-ar]");if(!b)return;const a=b.dataset.ar;
  if(a=="t"){ARF=b.dataset.v;ARS=null;arOpen()}else if(a=="n"){ARS=ARS===b.dataset.v?null:b.dataset.v;arOpen()}
  else if(a=="go"){const c=mtBlq().find(x=>x.id===ARS);if(c){SFORCE=c;tab(3)}}})})();
