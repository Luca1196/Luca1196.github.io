/* TEÓRICO POR TEMA (pedido de Luca, 23/11: «lo mejor es tener documentos aparte con el teórico completo de cada tema e invocarlo conveniente»).
   - Los documentos están en teoria/*.md (formato en teoria/LEEME.md): se editan sin tocar código; otra IA puede completarlos desde los apuntes.
   - Botón «📖 Teórico» en cada tarjeta de Principal y en el Árbol: abre el documento del tema de la tarjeta en un panel, YA en la sección que la
     tarjeta necesita (la primera cuya línea <!-- re: … --> coincide con la consigna, las fichas correctas o el título) y la resalta.
   - Tema → documento: TEODOC. lg4 (modelos y consistencia) se reparte: lo de consistencia/completitud/maximales/P5 va a consistencia.md. */
(()=>{const TEODOC={com:"comunicacion",md:"dominio",dss:"dss",dcd:"dcd",p3:"cpp",lg1:"induccion",lg2:"semantica",lg3:"deduccion",lg4:"estructuras",lg5:"tableaux"};
 const docOf=c=>{const t=tema(c);if(t=="lg4"&&/consistencia|completitud|maximal|^P5 |completo|teoría/i.test(c.g))return"consistencia";return TEODOC[t]||null};
 const CACHE={},get=d=>CACHE[d]?Promise.resolve(CACHE[d]):fetch("teoria/"+d+".md",{cache:"no-cache"}).then(r=>{if(!r.ok)throw 0;return r.text()}).then(t=>CACHE[d]=t);
 const inl=s=>esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`(.+?)`/g,"<code>$1</code>");
 /* markdown mínimo: # ## ###, listas -, 1., tablas | |, párrafos, **negrita**; <!-- re: … --> marca la sección */
 function md(src){const L=src.split("\n"),secs=[];let h="",i=0,cur=null;
  const flush=()=>{};while(i<L.length){let l=L[i];
   if(/^## /.test(l)){cur={t:l.slice(3).trim(),re:null,id:"teo"+secs.length};secs.push(cur);h+=`<h3 id="${cur.id}" style="margin:18px 0 6px">${inl(cur.t)}</h3>`;i++;continue}
   const m=/^<!--\s*re:\s*(.*?)\s*-->$/.exec(l.trim());if(m){if(cur)try{cur.re=new RegExp(m[1],"i")}catch(e){}i++;continue}
   if(/^# /.test(l)){h+=`<h2 style="margin:4px 0 8px">${inl(l.slice(2))}</h2>`;i++;continue}
   if(/^### /.test(l)){h+=`<h4 style="margin:12px 0 4px">${inl(l.slice(4))}</h4>`;i++;continue}
   if(/^\s*\|/.test(l)){const rows=[];while(i<L.length&&/^\s*\|/.test(L[i])){rows.push(L[i]);i++}
    const cells=r=>r.trim().replace(/^\||\|$/g,"").split(/(?<!\\)\|/).map(x=>x.trim().replace(/\\\|/g,"|"));const R=rows.filter(r=>!/^\s*\|[\s:|-]+\|\s*$/.test(r)).map(cells);
    h+=`<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:14px;margin:6px 0">${R.map((r,k)=>`<tr>${r.map(c=>`<${k?"td":"th"} style="border:1px solid var(--bd);padding:4px 6px;text-align:left">${inl(c)}</${k?"td":"th"}>`).join("")}</tr>`).join("")}</table></div>`;continue}
   if(/^\s*- /.test(l)){h+="<ul style='margin:4px 0;padding-left:20px'>";while(i<L.length&&/^\s*- /.test(L[i])){h+=`<li style="margin:3px 0">${inl(L[i].replace(/^\s*- /,""))}</li>`;i++}h+="</ul>";continue}
   if(/^\s*\d+\. /.test(l)){h+="<ol style='margin:4px 0;padding-left:22px'>";while(i<L.length&&/^\s*\d+\. /.test(L[i])){h+=`<li style="margin:3px 0">${inl(L[i].replace(/^\s*\d+\. /,""))}</li>`;i++}h+="</ol>";continue}
   if(!l.trim()){i++;continue}
   let p=[];while(i<L.length&&L[i].trim()&&!/^(#|\s*-|\s*\d+\. |\s*\||<!--)/.test(L[i])){p.push(L[i]);i++}h+=`<p style="margin:6px 0">${inl(p.join(" "))}</p>`}
  return{h,secs}}
 /* qué necesita la tarjeta: la consigna y cada ficha correcta pesan 2; el título, 1 (el título nombra el ejercicio, no siempre el concepto) */
 const ctxTxt=c=>({main:[c.kp||""].concat(c.bld?c.bld.exp.filter(x=>x.t&&x.t.length>2).map(x=>x.t):[])/* fichas correctas y etiquetas de casillero («… es consistente maximal porque») */.concat((c.steps||[]).map(s=>(s.q||"")+" "+(s.a||""))),g:c.g});
 const pick=(secs,T)=>{if(!T||!T.main)return null;let best=null,bs=0;secs.forEach(x=>{if(!x.re)return;const sc=T.main.filter(t=>x.re.test(t)).length*2+(x.re.test(T.g)?1:0);if(sc>bs){bs=sc;best=x}});return best};
 function show(d,txt){let ov=$("teov");if(!ov){ov=document.createElement("div");ov.id="teov";ov.style.cssText="position:fixed;inset:0;z-index:70;background:var(--bg);overflow:auto;-webkit-overflow-scrolling:touch";document.body.appendChild(ov)}
  ov.innerHTML=`<div style="position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--bd);padding:8px 12px;display:flex;justify-content:space-between;align-items:center;z-index:1"><b>📖 Teórico</b><button class="btn" id="teox">Cerrar ✕</button></div><div style="padding:12px 16px 60px;max-width:760px;margin:0 auto" class="lt">Cargando…</div>`;
  ov.style.display="block";$("teox").onclick=()=>{ov.style.display="none"};
  get(d).then(src=>{const{h,secs}=md(src),body=ov.lastElementChild;body.innerHTML=h;const s=pick(secs,txt);
   if(s){const el=$(s.id);el.style.cssText+=";background:var(--hl,rgba(255,200,0,.25));border-radius:6px;padding:2px 6px";el.scrollIntoView&&el.scrollIntoView({block:"start"});ov.scrollTop-=50}})
  .catch(()=>{ov.lastElementChild.innerHTML='<p class="mut">No se pudo abrir el teórico (¿sin conexión?).</p>'})}
 window.TEO={docOf,open:(c)=>{const d=docOf(c);if(d)show(d,ctxTxt(c))},openTema:t=>{const d=t=="lg4"?"estructuras":TEODOC[t];if(d)show(d,"")},openDoc:show};
 /* botón en cada tarjeta de Principal */
 const _d=swDraw;swDraw=function(){_d.apply(this,arguments);try{if(TAB!=3||!SW||!SW.c||!docOf(SW.c))return;const lb=V.querySelector("#swc .lbl")||V.querySelector(".swc .lbl");if(lb&&!V.querySelector("#teob"))lb.insertAdjacentHTML("afterend",`<button class="btn ghost" id="teob" style="font-size:13px;padding:2px 10px;margin:4px 0">📖 Teórico</button>`)}catch(e){}};
 document.addEventListener("click",ev=>{if(ev.target&&ev.target.id=="teob"&&SW&&SW.c)TEO.open(SW.c)})})();
