/* SECCIÓN ERRORES: resumen, lista y exportación. */
/* DECISIONES DIDÁCTICAS DE ERRORES: la pestaña existe para traer los errores al chat y ajustar el estudio.
   - «No sé» va marcado y separado de las confusiones: indica falta de teoría (se responde con explicación y tarjetas
     previas), no una confusión entre opciones (se responde con contrastes).
   - La exportación agrupa: aciertos por día (para medir progreso en una fecha), tasa por tema, confusiones repetidas
     (correcta → elegí), «No sé» y fallos agrupados con su contexto. Ejercicios (ej) solo registra fallos: no entra en %. */
/* ===== Errores (pestaña 5): resumen, lista y exportación para Claude ===== */
const WN={rep:"Repaso",sw:"Principal",bs:"Básico",cd:"Código",mu:"Música",oi:"Oído",ej:"Ejercicios",bq:"Bloques"},SN={p4:"Prog4",lg:"Lógica",mu:"Música"};
let ERW="all",ERR=0,ERT="",ERNS=0;
const nsTag=()=>{const m={};E1.log.forEach(e=>{if(e.ns){const k=e.w+"|"+e.s+"|"+e.g;m[k]=(m[k]||0)+1}});return m};
const fd=t=>new Date(t).toLocaleString("es-UY",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
const ld2=k=>{try{return JSON.parse(localStorage.getItem(k)||"{}")}catch(e){return{}}};
/* Aciertos por día: Ejercicios (ej) solo registra fallos, por eso no entra en los %. */
const pc=(a,n)=>n?Math.round(a/n*100)+"%":"–";
function dayStats(from){const D2=E1.day||{},ks=Object.keys(D2).filter(d=>!from||d>=from).sort();return ks.map(d=>{const x=D2[d],t={all:[0,0]},add=(k,v)=>{const z=t[k]||(t[k]=[0,0]);z[0]+=v[0];z[1]+=v[1]};
 Object.entries(x).forEach(([k,v])=>{const[w,s]=k.split("|");if(w=="ej")return;add("all",v);add(w,v);add("s:"+s,v)});return{d,t}})}
function dayTxt(from){const L=dayStats(from);if(!L.length)return"\n## Aciertos por día\n(Todavía no hay datos: el registro diario empezó el 11/11/2026.)\n";
 let o="\n## Aciertos por día (aciertos/intentos)\n";L.forEach(({d,t})=>{o+=`- ${d}: ${t.all[0]}/${t.all[1]} (${pc(...t.all)})`+["sw","bs","cd","bq","rep"].filter(k=>t[k]).map(k=>` · ${WN[k]} ${t[k][0]}/${t[k][1]} (${pc(...t[k])})`).join("")+["s:lg","s:p4"].filter(k=>t[k]).map(k=>` · ${SN[k.slice(2)]} ${pc(...t[k])}`).join("")+"\n"});
 const T=L.reduce((a,{t})=>[a[0]+t.all[0],a[1]+t.all[1]],[0,0]);o+=`Total del período: ${T[0]}/${T[1]} (${pc(...T)})\n`;return o}
/* Oído (musica.js): por nota (histórico de S3.oi en mu1 + fallos del período) y por intervalo de error (semitonos con signo, + = tocó más arriba) */
/* Oído funcional (grados): por grado (histórico S3.od) y confusiones de grado (era → toqué) */
function ofTxt(L){const O=L.filter(e=>e.w=="oi"&&e.dg!=null),st=ld2("mu1").od||{},DG=["1","b2","2","b3","3","4","#4","5","b6","6","b7","7"];if(!O.length&&!Object.keys(st).length)return"";
 let o="\n## Oído funcional: grados que más cuestan (histórico: falladas/tarjetas · período: intentos fallidos promedio, rendidas)\n";
 Object.entries(st).sort((a,b)=>b[1].f/b[1].n-a[1].f/a[1].n).forEach(([d,x])=>{const E=O.filter(e=>e.dg==d),tf=E.reduce((a,e)=>a+(e.f||0),0);o+=`- grado ${DG[d]}: ${x.f}/${x.n} (${Math.round(x.f/x.n*100)}%)${E.length?` · período: ${E.length} falladas, ${(tf/E.length).toFixed(1)} intentos fallidos promedio, ${E.filter(e=>e.rd).length} rendidas`:""}\n`});
 const C={};O.forEach(e=>(e.dt||[]).forEach(d=>{const k="era "+DG[e.dg]+" → toqué "+DG[d];C[k]=(C[k]||0)+1}));const cs=Object.entries(C).sort((a,b)=>b[1]-a[1]).slice(0,20);
 if(cs.length){o+="\n## Oído funcional: confusiones de grado (más repetidas primero; incluye todos los intentos fallidos)\n";cs.forEach(([k,n])=>o+=`- ${n}× ${k}\n`)}
 const F=O.filter(e=>(e.dt||[]).length).map(e=>"era "+DG[e.dg]+" → primero toqué "+DG[e.dt[0]]),FC={};F.forEach(k=>FC[k]=(FC[k]||0)+1);const fs=Object.entries(FC).sort((a,b)=>b[1]-a[1]).slice(0,10);
 if(fs.length){o+="\n## Oído funcional: primera impresión equivocada\n";fs.forEach(([k,n])=>o+=`- ${n}× ${k}\n`)}return o}
function oiTxt(L){L=L.filter(e=>e.dg==null);const O=L.filter(e=>e.w=="oi"),st=ld2("mu1").oi||{};if(!O.length&&!Object.keys(st).length)return"";const IV={1:"2m",2:"2M",3:"3m",4:"3M",5:"4J",6:"tritono"};
 let o="\n## Oído SIN referencia (modo viejo, reemplazado el 12/11): notas que más cuestan (histórico: falladas/tarjetas · fallos del período: intentos fallidos promedio, rendidas)\n";
 Object.entries(st).sort((a,b)=>b[1].f/b[1].n-a[1].f/a[1].n).forEach(([n,x])=>{const E=O.filter(e=>e.a==n),tf=E.reduce((a,e)=>a+(e.f||0),0);o+=`- ${n}: ${x.f}/${x.n} (${Math.round(x.f/x.n*100)}%)${E.length?` · período: ${E.length} falladas, ${(tf/E.length).toFixed(1)} intentos fallidos promedio, ${E.filter(e=>e.rd).length} rendidas`:""}\n`});
 const H={};O.forEach(e=>(e.iv||[]).forEach(d=>{H[d]=(H[d]||0)+1}));const hs=Object.entries(H).sort((a,b)=>b[1]-a[1]);
 if(hs.length){o+="\n## Oído: intervalos de error (desde la nota correcta a la tocada; + = toqué más agudo)\n";hs.forEach(([d,n])=>o+=`- ${d>0?"+":"−"}${IV[Math.abs(d)]} (${d>0?"+":""}${d} st): ${n}×\n`)}
 const C={};O.forEach(e=>(e.iv||[]).forEach(d=>{const k=e.a+" → "+(d>0?"+":"−")+IV[Math.abs(d)];C[k]=(C[k]||0)+1}));const cs=Object.entries(C).filter(x=>x[1]>1).sort((a,b)=>b[1]-a[1]).slice(0,15);
 if(cs.length){o+="\n## Oído: confusiones repetidas (nota → intervalo de error)\n";cs.forEach(([k,n])=>o+=`- ${n}× ${k}\n`)}return o}
function erTxt(all){const L=E1.log.filter(e=>all||e.t>E1.exp);let o=`ERRORES DE ESTUDIO (${all?"todo el historial":"desde la última exportación"}) · ${L.length} fallos`+(L.length?` · ${fd(L[0].t)} a ${fd(L[L.length-1].t)}`:"")+"\n"+dayTxt(all?"":(E1.exp?new Date(E1.exp).toLocaleDateString("en-CA"):""))+(all?"\n## Tasa por tag (fallos/intentos, histórico)\n":"\n## Tasa por tag (fallos/intentos histórico, solo de lo que fallaste en este período)\n");
 /* 26/11 (Luca: «siguen cosas de oído»): fuera del historial completo, solo los tags con fallos en el período */const TK=new Set(L.map(e=>e.w+"|"+e.s+"|"+e.g));
 Object.entries(E1.st).filter(([k])=>all||TK.has(k)).map(([k,[ok,n]])=>[k,n-ok,n]).filter(x=>x[1]).sort((a,b)=>b[1]/b[2]-a[1]/a[2]).forEach(([k,f,n])=>{const[w,s,g]=k.split("|");o+=w=="ej"?`- ${WN[w]}/${SN[s]}/${g}: ${f} ${f==1?"fallo":"fallos"}\n`:`- ${WN[w]}/${SN[s]}/${g}: ${f}/${n} (${Math.round(f/n*100)}%)\n`});
 const NS=L.filter(e=>e.ns),LC=L.filter(e=>!e.ns&&e.w!="oi");if(all||L.some(e=>/^o/.test(e.w)))o+=ofTxt(L)+oiTxt(L);
 if(NS.length){const g={};NS.forEach(e=>{const k=e.w+"|"+e.g+"|"+e.q;const x=g[k]||(g[k]={e,n:0,nt:[]});x.n++;if(e.note)x.nt.push(e.note)});o+=`\n## "NO SÉ": no conocía el tema (${NS.length}). Falta teoría, no es una confusión: agregar explicación y tarjetas previas\n`;Object.values(g).sort((a,b)=>b.n-a.n).forEach(({e,n,nt})=>{o+=`\n[${WN[e.w]}/${SN[e.s]}/${e.g}${e.n?" paso "+e.n:""}] ${n}×\n`+(e.x?"  Contexto: "+e.x.replace(/\n/g," / ")+"\n":"")+`  P: ${e.q.replace(/\n/g," / ")}\n  Correcta: ${e.a}\n`+nt.map(t=>"  NOTA DE LUCA: "+t+"\n").join("")})}
 const cf={};LC.filter(e=>e.a!="árbol completo sin errores").forEach(e=>{const k=SN[e.s]+" · "+e.a+"  →  "+e.p;/* un «Árbol · …» fallado no es una confusión: sus errores concretos ya están registrados en Bloques */cf[k]=(cf[k]||0)+1});const cfs=Object.entries(cf).filter(x=>x[1]>1).sort((a,b)=>b[1]-a[1]).slice(0,25);
 if(cfs.length){o+="\n## Confusiones repetidas (correcta → elegí)\n";cfs.forEach(([k,n])=>o+=`- ${n}× ${k}\n`)}
 const G={};LC.forEach(e=>{const k=e.w+"|"+e.g+"|"+e.q+"|"+e.p;const x=G[k]||(G[k]={e,n:0,ms:0,rp:0,nt:[]});x.n++;if(e.note)x.nt.push(e.note);x.ms+=e.ms||0;x.rp+=e.rp?1:0;x.last=e.t});
 o+="\n## Confusiones: elegí la opción equivocada (más repetidos primero)\n";Object.values(G).sort((a,b)=>b.n-a.n||b.last-a.last).forEach(({e,n,ms,rp,nt})=>{o+=`\n[${WN[e.w]}/${SN[e.s]}/${e.g}${e.n?" paso "+e.n:""}] ${n}×${rp?" ("+rp+" en reintento)":""} ${ms?"· "+Math.round(ms/n/1000)+" s promedio":""}${e.b>=0&&e.b!==undefined?" · caja "+e.b:""}\n`+(e.x?"  Contexto: "+e.x.replace(/\n/g," / ")+"\n":"")+`  P: ${e.q.replace(/\n/g," / ")}\n  Correcta: ${e.a}\n  Elegí: ${e.p}\n`+nt.map(t=>"  NOTA DE LUCA: "+t+"\n").join("")});
 const a=ld2("er"),b=ld2("ern");if(Object.keys(a).length||Object.keys(b).length){o+="\n## Apps de ejercicios: conteo viejo por tipo (antes del registro detallado)\n";Object.entries(a).forEach(([k,v])=>o+=`- Prog4: ${k}: ${v.n}\n`);Object.entries(b).forEach(([k,v])=>o+=`- Lógica: ${k}: ${v}\n`)}
 return o}
(()=>{const st=document.createElement("style");st.textContent=".nsb{display:inline-block;font-size:12px;font-weight:600;padding:1px 7px;border-radius:99px;background:var(--badbg);color:var(--bad);border:1px solid var(--bad)}";document.head.appendChild(st)})();
function erOpen(){const NT=nsTag(),L=E1.log.filter(e=>(ERW=="all"||e.w==ERW)&&(!ERNS||e.ns)),nw=E1.log.filter(e=>e.t>E1.exp).length,st=Object.entries(E1.st).filter(([k])=>ERW=="all"||k.startsWith(ERW+"|")).map(([k,[ok,n]])=>[k.split("|"),n-ok,n]).filter(x=>x[1]).sort((a,b)=>b[1]/b[2]-a[1]/a[2]);
 let h=`<div class="row between"><b>${E1.log.length} errores guardados</b><span class="mut">${nw} nuevos desde la última exportación${E1.exp?" ("+fd(E1.exp)+")":""}</span></div>
 <div class="row" style="margin-top:8px;flex-wrap:wrap;gap:6px"><button class="btn pri" data-e="cp">Copiar para Claude (nuevos)</button><button class="btn" data-e="cpa">Copiar todo</button><button class="btn" data-e="dl">Descargar .txt</button></div>
 ${ERT?`<p class="mut" style="margin:8px 0 4px">Si no se copió solo, seleccioná el texto y copialo:</p><textarea id="ert" style="width:100%;height:140px;font:12px var(--m);background:var(--bg);color:var(--fg);border:1px solid var(--bd);border-radius:10px;padding:8px">${esc(ERT)}</textarea>`:""}
 <div class="row" style="margin-top:12px;gap:6px;flex-wrap:wrap">${[["all","Todo"],["sw","Principal"],["bs","Básico"],["cd","Código"],["ej","Ejercicios"],["bq","Bloques"],["oi","Oído"],["rep","Repaso"]].map(([k,t])=>`<button class="btn chip${ERW==k?" sel":""}" data-e="w" data-v="${k}">${t}</button>`).join("")}<button class="btn chip${ERNS?" sel":""}" data-e="ns">Solo «No sé» (${E1.log.filter(e=>e.ns).length})</button></div>
 ${(()=>{const L=dayStats("").slice(-7);return`<div class="card"><h2>Aciertos por día</h2>${L.length?L.map(({d,t})=>`<div class="row between" style="margin:4px 0"><span>${d.slice(8)}/${d.slice(5,7)}</span><span class="mut">${t.all[0]}/${t.all[1]} · <b>${pc(...t.all)}</b></span></div><div class="pb" style="height:6px"><i style="width:${t.all[1]?t.all[0]/t.all[1]*100:0}%"></i></div>`).join(""):'<p class="mut" style="margin:0">Se empieza a registrar desde hoy.</p>'}</div>`})()}${cpCard()}${""/* 26/11, pedido de Luca: «Dónde fallo más» se quitó (lo cubre «Conceptos flojos» y confundía) */}
 <div class="card"><h2>Últimos errores</h2>${L.slice(-40).reverse().map(e=>`<div style="border-top:1px solid var(--bd);padding:8px 0"><div class="mut" style="font-size:12px">${e.ns?'<span class="nsb">No sé · falta teoría</span> ':""}${fd(e.t)} · ${WN[e.w]} · ${esc(SN[e.s]+" · "+e.g)}${e.ms?" · "+Math.round(e.ms/1000)+" s":""}</div><div>${esc(e.q.split("\n").pop())}</div><div style="font-size:14px">${e.ns?"":`<span style="color:var(--bad)">✗ ${esc(e.p)}</span> · `}<span style="color:var(--ok)">✓ ${esc(e.a)}</span></div><details class="nt"${e.note?" open":""}><summary>✏️ ${e.note?"Tu nota":"Agregar nota"}</summary><textarea data-note="${E1.log.indexOf(e)}" rows="2" placeholder="¿Qué no entendiste o qué te confundió?">${esc(e.note||"")}</textarea></details></div>`).join("")||'<p class="mut" style="margin:0">Nada por acá.</p>'}</div>
 ${ghCard()}${pcCard()}
 <button class="btn ghost" data-e="clr">${ERR?"Tocá otra vez para borrar todos los errores":"Borrar registro de errores"}</button>`;
 V.innerHTML=h}
function erCopy(all){ERT=erTxt(all);const done=()=>{if(!all){E1.exp=Date.now();SVE()}};try{navigator.clipboard.writeText(ERT).then(()=>{done();ERT="";erOpen();const b=V.querySelector('[data-e="'+(all?"cpa":"cp")+'"]');if(b)b.textContent="Copiado ✓"},()=>{done();erOpen()})}catch(e){done();erOpen()}}
V.addEventListener("click",ev=>{if(TAB!=5)return;const b=ev.target.closest("[data-e]");if(!b)return;const a=b.dataset.e;
 if(a=="ns"){ERNS=ERNS?0:1;erOpen()}else if(a=="cp")erCopy(0);else if(a=="cpa")erCopy(1);else if(a=="w"){ERW=b.dataset.v;erOpen()}
 else if(a=="dl"){const u=URL.createObjectURL(new Blob([erTxt(1)],{type:"text/plain"})),l=document.createElement("a");l.href=u;l.download="errores-"+TD()+".txt";l.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
 else if(a=="clr"){if(ERR){E1={log:[],st:{},exp:0};SVE();ERR=0}else ERR=1;erOpen()}});

/* ENVÍO AUTOMÁTICO DE NOTAS A GITHUB (pedido de Luca, 19/11: «que los errores con nota vayan directamente sin que lo tenga que hacer a mano»).
   Cada error con nota se crea como un issue en el repo (título «[nota] …»), para que Gemini/Claude lo lean y procesen desde GitHub.
   - El token NUNCA va en el código (el repo es público): Luca lo pega una vez acá y queda solo en su navegador (localStorage "gh1").
     Token fine-grained, solo este repo, permiso Issues: read and write.
   - Se envía solo: 20 s después de dejar de escribir una nota, al salir de la página y al abrir la app (reintenta lo pendiente).
   - Si la nota se edita después de enviada, se actualiza el mismo issue (e.gi = número de issue, e.gn = texto enviado). Se guarda en err1. */
const GHR="Luca1196/Luca1196.github.io";let GHT=null,GHB=0,GHM="";
const ghTok=()=>{try{return localStorage.getItem("gh1")||""}catch(e){return""}};
const ghPend=()=>E1.log.filter(e=>e.note&&e.gn!==e.note);
const ghBody=e=>{const cut=(t,n)=>{t=String(t||"");return t.length>n?t.slice(0,n)+"…":t};
 return[`**Fecha:** ${new Date(e.t).toLocaleString("es-UY")} · **Sección:** ${WN[e.w]||e.w} · **Materia:** ${SN[e.s]||e.s}`,`**Bloque:** ${e.g}${e.n?" · paso "+e.n:""}`,
  "","**Nota de Luca:**",...String(e.note).split("\n").map(l=>"> "+l),"",`**Pregunta:** ${cut(e.q,1500)}`,`**Correcta:** ${cut(e.a,800)}`,e.ns?"**Respondió:** No sé (falta teoría)":`**Eligió:** ${cut(e.p,800)}`,
  e.x?"\n<details><summary>Contexto de la tarjeta</summary>\n\n```\n"+cut(e.x,3000)+"\n```\n</details>":"",
  "","---","Para la IA: decidir si es un error de Luca (se explica) o un defecto de la tarjeta (se corrige), según el skill practica-tipo-duolingo."].join("\n")};
async function ghSync(){const tk=ghTok();if(!tk||GHB||!navigator.onLine)return;const P=ghPend();if(!P.length)return;GHB=1;
 try{for(const e of P.slice(0,10)){const nt=e.note,body=JSON.stringify(e.gi?{body:ghBody(e)}:{title:("[nota] "+(SN[e.s]||e.s)+" · "+e.g).slice(0,200),body:ghBody(e)});
   const r=await fetch("https://api.github.com/repos/"+GHR+"/issues"+(e.gi?"/"+e.gi:""),{method:e.gi?"PATCH":"POST",keepalive:true,headers:{Authorization:"Bearer "+tk,Accept:"application/vnd.github+json","Content-Type":"application/json"},body});
   if(!r.ok){GHM=r.status==401||r.status==403?"El token no sirve o no tiene permiso de Issues (error "+r.status+").":"GitHub respondió "+r.status+".";break}
   const j=await r.json();e.gi=j.number;e.gn=nt;GHM="";SVE()}}catch(err){GHM="Sin conexión con GitHub; se reintenta solo."}
 GHB=0;if(TAB==5)erOpen()}
const ghLater=(ms)=>{clearTimeout(GHT);GHT=setTimeout(ghSync,ms)};
V.addEventListener("input",ev=>{if(ev.target&&ev.target.dataset&&ev.target.dataset.note!==undefined)ghLater(20000)});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState=="hidden")ghSync()});
setTimeout(ghSync,3000);
function ghCard(){const tk=ghTok(),P=ghPend().length,S=E1.log.filter(e=>e.gi).length;
 return`<div class="card"><h2>Notas → GitHub</h2>${tk?`<p style="margin:0">Envío automático activado: cada error con nota se crea como issue en el repo. <span class="mut">${S} enviadas · ${P} pendientes</span></p><p style="margin:6px 0 0">Progreso global (todos tus dispositivos): <span class="mut">${window.SYNC&&SYNC.at?"sincronizado "+fd(SYNC.at):"todavía no se sincronizó"}</span></p>${window.SYNC&&SYNC.st?`<p style="color:var(--bad);margin:6px 0 0">${esc(SYNC.st)}</p>`:""}${GHM?`<p style="color:var(--bad);margin:6px 0 0">${esc(GHM)}</p>`:""}<div class="row" style="margin-top:8px;gap:6px"><button class="btn" data-g="now">Enviar ahora</button><button class="btn" data-g="syn">Sincronizar progreso</button><button class="btn ghost" data-g="off">Quitar token</button></div>`:
 `<p class="mut" style="margin:0 0 8px">Pegá una vez un token de GitHub (fine-grained, solo este repo, permisos Issues y Contents: read and write). Queda solo en este navegador, nunca en el código.</p><div class="row" style="gap:6px"><input id="ghk" type="password" placeholder="github_pat_…" style="flex:1;min-width:0;padding:8px;border-radius:10px;border:1px solid var(--bd);background:var(--bg);color:var(--fg)"><button class="btn pri" data-g="save">Guardar</button></div>`}</div>`}
V.addEventListener("click",ev=>{if(TAB!=5)return;const b=ev.target.closest("[data-g]");if(!b)return;const a=b.dataset.g;
 if(a=="save"){const v=($("ghk").value||"").trim();if(v){try{localStorage.setItem("gh1",v)}catch(e){}GHM="";ghSync();if(window.SYNC)SYNC.start()}erOpen()}
 else if(a=="off"){try{localStorage.removeItem("gh1")}catch(e){}erOpen()}else if(a=="now")ghSync();else if(a=="syn"&&window.SYNC)SYNC.push().then(()=>erOpen())});

/* Tarjeta del CÓDIGO DE PROGRESO (ver pcExport/pcImport en nucleo.js) */
let PCM="";
function pcCard(){if(typeof pcExport!="function")return"";const c=pcExport();
 return`<div class="card"><h2>Pasar progreso con un código</h2><p class="mut" style="margin:0 0 8px">Sin token: copiá este código en un dispositivo y pegalo en el otro. Se combinan los bloques terminados de los dos.</p>
 <div class="sn" style="font-family:var(--m);font-size:20px;letter-spacing:1px;text-align:center">${esc(c)}</div><p class="mut" style="margin:4px 0 0;font-size:12px">Podés copiarlo a mano: no distingue mayúsculas y no usa I, L, O ni U.</p><div class="row" style="margin-top:6px;gap:6px"><button class="btn" data-pc="cp">Copiar mi código</button></div>
 <div class="row" style="margin-top:10px;gap:6px"><input id="pcin" placeholder="Pegá el código del otro dispositivo" style="flex:1;min-width:0;padding:8px;border-radius:10px;border:1px solid var(--bd);background:var(--bg);color:var(--fg)"><button class="btn pri" data-pc="in">Combinar</button></div>${PCM?`<p style="margin:8px 0 0">${esc(PCM)}</p>`:""}</div>`}
V.addEventListener("click",ev=>{if(TAB!=5)return;const b=ev.target.closest("[data-pc]");if(!b)return;
 if(b.dataset.pc=="cp"){const t=pcExport();try{navigator.clipboard.writeText(t).then(()=>{b.textContent="Copiado ✓"},()=>prompt("Copiá el código:",t))}catch(e){prompt("Copiá el código:",t)}}
 else{PCM=pcImport(($("pcin")||{}).value||"");erOpen()}});

/* CONCEPTOS FLOJOS (pedido de Luca, 23/11: «a mí me importa saber qué concepto tengo flojo»): por cada concepto (tema + qué se decide en ese lugar:
   numeración, receptor, multiplicidad…), fichas mal puestas sobre fichas puestas (E1.cp, lo cuenta nucleo.js). Es la medida justa: no castiga el orden
   ni cuenta la tarjeta entera como fallo. Se muestran los que tienen al menos 3 fichas, del más flojo al más firme. Empezó a contarse el 23/11. */
const cpList=()=>Object.entries(E1.cp||{}).filter(([k,[ok,n]])=>n>=3).map(([k,[ok,n]])=>[k,n-ok,n]).sort((a,b)=>b[1]/b[2]-a[1]/a[2]||b[2]-a[2]);
function cpCard(){const L=cpList();return`<div class="card"><h2>Conceptos flojos</h2>${L.length?L.slice(0,15).map(([k,f,n])=>`<div class="row between" style="gap:8px;margin:4px 0"><span>${esc(k)}</span><span class="mut" style="white-space:nowrap">${f}/${n} fichas mal · <b>${Math.round(f/n*100)}%</b></span></div><div class="pb" style="height:6px"><i style="width:${Math.round((n-f)/n*100)}%"></i></div>`).join(""):'<p class="mut" style="margin:0">Se empieza a contar desde el 23/11: hacen falta al menos 3 fichas de un concepto para que aparezca.</p>'}</div>`}
const cpTxt=()=>{const L=cpList();return L.length?"\n## Conceptos flojos (fichas mal / fichas puestas en ese concepto, desde el 23/11)\n"+L.map(([k,f,n])=>`- ${k}: ${f}/${n} (${Math.round(f/n*100)}%)`).join("\n")+"\n":""};
{const _t=erTxt;erTxt=all=>{const o=_t(all),i=o.indexOf("\n## Tasa por tag");return i<0?o+cpTxt():o.slice(0,i)+cpTxt()+o.slice(i)}}
/* PROGRESO EN LA EXPORTACIÓN (26/11, pedido de Luca: «lo mejor sería que se exporte en el botón de copiar para Claude»): tarjetas terminadas de
   Principal (misma marca que la barra: S2.mt.fd o mtFinC), por sección y por tema de Lógica, más la meta de hoy y la racha. Va arriba de todo. */
const prgTxt=()=>{if(typeof mtCards!="function")return"";const FD=(S2.mt||{}).fd||{},t=new Date().toLocaleDateString("en-CA"),fin=c=>!!FD[c.id]||mtFinC(c),A=mtCards(),
  ln=(nm,L)=>{const f=L.filter(fin).length,h=L.filter(c=>FD[c.id]==t).length;return`- ${nm}: ${f}/${L.length} terminadas (${L.length?Math.round(f/L.length*100):0}%) · hoy ${h}\n`};
 const LG=A.filter(c=>c.s=="lg"),T={};LG.forEach(c=>{const k=TMN[tema(c)]||tema(c);(T[k]=T[k]||[]).push(c)});
 let o="\n## Progreso (tarjetas de Principal terminadas, con o sin errores)\n"+ln("Lógica (total)",LG)+Object.keys(T).sort().map(k=>"  "+ln(k.replace(/^Lógica · /,"").replace(/^modelos$/,"modelos y consistencia"),T[k])).join("")+ln("Prog4 (para febrero)",A.filter(c=>c.s=="p4"));
 const m=typeof mtHoy=="function"&&SWM==3?mtHoy():null;if(m)o+=`- Meta de hoy (Lógica): ${m.done}/${m.goal} · racha ${m.stk} ${m.stk==1?"día":"días"} · faltan ${m.tot-m.fin} ÷ ${m.dl} ${m.dl==1?"día":"días"}\n`;return o};
{const _t=erTxt;erTxt=all=>{const o=_t(all),i=o.indexOf("\n");return o.slice(0,i)+"\n"+prgTxt()+o.slice(i)}}
