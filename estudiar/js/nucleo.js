/* NÚCLEO: estado, Repaso, motor de Deslizar, pestañas y portado de tarjetas. Tocar solo para cambios que afecten a todas las secciones. */

const CARDS=[].concat(P4A,LGA).map(c=>(c.id=hs(c.s+c.k+c.q),c));
CARDS.forEach(c=>{if(c.k=="mc"){c.why={};c.d=c.d.map(t=>{const p=t.split("||");if(p[1])c.why[p[0]]=p[1];return p[0]})}});

/* ---- Ayudas didácticas: definiciones (por qué no) y pistas por subtema ---- */
const DEF={"«association»":"«association»: hay una asociación en el diagrama de clases (atributo o colección).","«local»":"«local»: lo obtuvo con find, create o next dentro de esta operación.","«parameter»":"«parameter»: está en la firma de la operación que ejecuta.",
"I∧":"I∧ arma φ∧ψ a partir de φ y de ψ.","E∧":"E∧ saca φ o ψ de una φ∧ψ que ya tenés.","I→":"I→ prueba φ→ψ: supone φ, llega a ψ y cancela φ.","E→":"E→ usa φ→ψ y φ para obtener ψ.","I¬":"I¬ prueba ¬φ: supone φ, llega a ⊥ y cancela φ.","E¬":"E¬ junta ¬φ y φ para obtener ⊥.","RAA":"RAA prueba φ: supone ¬φ, llega a ⊥ y cancela ¬φ.","E⊥":"E⊥ saca cualquier fórmula de un ⊥ que ya tenés.","I∨":"I∨ arma φ∨ψ desde uno solo de los lados.","E∨":"E∨ usa φ∨ψ: prueba lo mismo bajo φ y bajo ψ.","I∀":"I∀ prueba (∀x)φ(x) con una x arbitraria.","E∀":"E∀ instancia (∀x)φ(x) con un término t.","I∃":"I∃ arma (∃x)φ(x) desde un testigo t.","E∃":"E∃ usa (∃x)φ(x): quita el ∃ y supone φ(x) con x nueva; esa suposición se cancela al cerrar y (∃x)φ(x) queda como premisa.","I↔":"I↔ arma φ↔ψ con φ→ψ y ψ→φ."};
const HINT={"Etiqueta":"Elegí el estereotipo mirando al RECEPTOR del mensaje. Preguntate: ¿de dónde saca el emisor al receptor? Está en la firma de la operación → «parameter». Lo obtuvo con find, create o next → «local». Hay una asociación en el diagrama de clases → «association».",
"Destino":"Mirá el dominio: el mensaje va a la clase que tiene esa operación. find, add y next van al multiobjeto (:Clase *).",
"Mensaje":"Forma: variable := operación(parámetros). Sin variable si no uso el resultado.",
"Notación":"Primera vez: nombre:Clase. Después, solo el nombre. * en el destino = colección; * pegado al número = iteración.",
"Decisión":"¿Busco por clave (find)? ¿Recorro (next)? ¿Agrego (add)? ¿Le pido un dato a un objeto (método)?",
"Armar":"Mirá el conector principal de la meta: se arma con su introducción. Si no sale, RAA.",
"Primer paso":"Primero mirá la meta: si tiene conector, se arma con su introducción. Después desarmás hipótesis para conseguir lo que falte. Sin conector útil: RAA, o E∨ si hay una disyunción.",
"Detectar error":"Revisá cada paso: ¿la regla es introducción (arma el conector) o eliminación (lo usa)? ¿Se cancelan las hipótesis que dicen? ¿Se cumple la restricción (∗)?",
"Leer derivación":"Γ = hojas sin cancelar (sin corchetes). ρ = la fórmula de la raíz. Puede haber fórmulas de más en Γ.",
"Igualdad":"I= da t =′ t. E= reemplaza iguales dentro de una fórmula (t libre para x).",
"Estrategia":"Dos movimientos que se repiten: armar la META (introducción de su conector principal) y desarmar HIPÓTESIS (eliminación) cuando falta material. Se baja hasta fórmulas atómicas.",
"Enlaces":"Quien crea el objeto guarda la referencia: add si es una colección, setX si es una sola. Si el link es en los dos sentidos, se pasa self en el create.",
"Borrado":"Destruir el link (remove o setX(NULL)) no destruye la instancia: eso es destroy(), en general de quien la creó.",
"Iteración":"Recorrer = next() sobre :Clase * con * en el número. Se corta apenas se cumple lo buscado. Si se navega al revés puede haber repetidos: unión.",
"Desarmar":"Mirá el conector de la hipótesis: se desarma con su eliminación.",
"Cancelar":"Cancelan: I→ (φ), I¬ (φ), RAA (¬φ), E∨ (φ y ψ), E∃ (φ(x)).",
"Condición (∗)":"E∀ e I∃: t libre para x. I∀ y E∃: x arbitraria o nueva.",
"Fórmulas":"Libre = no ligada por un cuantificador. ∧ liga más que ∨."};
const DOM="Controlador ──> Estudiante *, Empresa *\nEmpresa ──> OfertaPasantia *\nEstudiante <──> Postulacion *\nPostulacion <──> OfertaPasantia (1)\nOfertaPasantia (abstracta): Remunerada, NoRemunerada\n\nEstudiante: generarPostulacion(opc), aceptarPostulacion(cod)\nEmpresa: obtenerOferta(cod), cuposDisponibles(cod)\nOfertaPasantia: agregarPostulacion(p), hayCupos(), calcularBeneficio()\nPostulacion: getOfertaPasantiaCodigo(), aceptarPostulacion(), getEstado()",DOMT=["Etiqueta","Destino","Mensaje","Decisión","Quiz ejercicios"];
const domHtml=c=>c.s=="p4"&&DOMT.includes(c.g)?(Q.ans==null?`<button class="btn ghost hint" data-a="dom">${S.dom?"Ocultar dominio":"Ver dominio"}</button>`:"")+(S.dom?`<div class="sn">${esc(DOM)}</div>`:""):"";
const dfn=t=>DEF[t]||DEF[String(t).split(/[:\s]/)[0]]||"";
const H=c=>c.h||HINT[c.g];
const hintHtml=c=>H(c)&&Q.ans==null?`<button class="btn ghost hint" data-a="hint">${Q.hint?"Ocultar pista":"Pista"}</button>${Q.hint?`<div class="hn">${esc(H(c))}</div>`:""}`:"";
const wy=(c,t)=>(c.why&&c.why[t]?`<div>Elegiste ${esc(t)}. ${esc(c.why[t])}</div>`:dfn(t)?`<div>Elegiste ${esc(t)}. ${esc(dfn(t))}</div>`:"")+(H(c)?`<div class="hn">${esc(H(c))}</div>`:"");

/* ---- Estado ---- */
let S={c:{},day:"",nw:0,xp:0,xpd:0,last:"",stk:0,nm:10,debt:0};
try{Object.assign(S,JSON.parse(localStorage.getItem("est2")||"{}"))}catch(e){}
const SV=()=>{try{localStorage.setItem("est2",JSON.stringify(S))}catch(e){}};
/* ---- Registro de errores (pestaña Errores, localStorage "err1") ---- */
let E1={log:[],st:{},exp:0};
try{Object.assign(E1,JSON.parse(localStorage.getItem("err1")||"{}"))}catch(e){}
const SVE=()=>{try{localStorage.setItem("err1",JSON.stringify(E1))}catch(e){}};
function logA(w,s,g,ok,info){const k=w+"|"+s+"|"+g,v=E1.st[k]||(E1.st[k]=[0,0]);v[1]++;if(ok)v[0]++;else{E1.log.push(Object.assign({t:Date.now(),w,s,g},info));if(E1.log.length>4000)E1.log.splice(0,E1.log.length-4000)}SVE()}
const D0=()=>{const d=new Date();d.setHours(0,0,0,0);return d.getTime()};
const TD=()=>new Date().toLocaleDateString("en-CA");
const roll=()=>{const t=TD();if(S.day!=t){if(S.day){const gap=Math.max(0,Math.round((new Date(t)-new Date(S.day))/864e5)-1);S.debt=Math.max(0,S.nm+S.debt-S.nw)+gap*S.nm}S.day=t;S.nw=0;S.xpd=0;SV()}};
const IV=[0,1,3,7,14,30,60];
let TAB=0,F="all",Q=null,RS=0,TM=null;
const RN=10,RES0=120,RMAX=180,ACI=10; /* RN tarjetas por ronda. Reserva de tiempo: empieza en RES0 s, baja solo mientras pensas (se frena al ver la respuesta), cada acierto a la primera suma ACI s (tope RMAX). Si sobra reserva al cerrar la ronda: +10 XP. Nunca penaliza. */

function nxt(s,r){let b=s.b,l=s.l,due;if(r==0){b=0;l++;due=Date.now()+6e5}else{b=r==1?Math.max(1,b):Math.min(6,b+(r==3?2:1));let d=IV[b];if(r==1)d=Math.max(1,Math.round(d/2));due=D0()+d*864e5}return{b,l,due}}
function lab(c,r){if(r==0)return"10 min";const t=nxt(S.c[c.id]||{b:0,l:0},r),d=Math.round((t.due-D0())/864e5);return d<30?d+" d":Math.round(d/30)+" m"}
function apply(c,r){let s=S.c[c.id];if(!s){S.nw++;s={b:0,l:0,n:0,due:0}}const t=nxt(s,r);s.b=t.b;s.l=t.l;s.due=t.due;s.n++;S.c[c.id]=s}
function touch(){const t=TD();if(S.last!=t){const y=new Date(Date.now()-864e5).toLocaleDateString("en-CA");S.stk=S.last==y?S.stk+1:1;S.last=t}}
function stats(f){const now=Date.now();let n=0,l=0,m=0,d=0;CARDS.forEach(c=>{if(f!="all"&&c.s!=f)return;const s=S.c[c.id];if(!s){n++;return}if(s.due<=now)d++;if(s.b>=3)m++;else l++});return{n,l,m,d}}
const ilv=a=>{const g={};a.forEach(c=>(g[c.s]=g[c.s]||[]).push(c));const ks=Object.keys(g),o=[];for(let i=0;o.length<a.length;i++)ks.forEach(k=>{if(g[k][i])o.push(g[k][i])});return o};
const goal=()=>Math.min(S.nm+S.debt,CARDS.filter(c=>!S.c[c.id]).length+S.nw),remain=()=>Math.max(0,goal()-S.nw);
function mkQ(f,mode){const now=Date.now(),ok=c=>f=="all"||c.s==f;
if(mode=="libre")return sh(CARDS.filter(c=>ok(c)&&S.c[c.id])).sort((a,b)=>(S.c[b.id].l-S.c[a.id].l)||(S.c[a.id].b-S.c[b.id].b));
const dd=CARDS.filter(c=>ok(c)&&S.c[c.id]&&S.c[c.id].due<=now).sort((a,b)=>S.c[a.id].due-S.c[b.id].due),nn=CARDS.filter(c=>ok(c)&&!S.c[c.id]);
return ilv(dd).concat(ilv(nn).slice(0,mode=="todo"?nn.length:remain()))}
const hdr=()=>{$("hd").textContent=(S.stk?"Racha "+S.stk+(S.stk==1?" día":" días")+" · ":"")+"XP hoy "+S.xpd};

/* ---- Pestañas ---- */
function tab(i){TAB=i;Q=null;clearInterval(TM);muStop();[0,1,2,3,4,5].forEach(j=>$("t"+j).className="btn tab"+(j==i?" on":""));hdr();if(i==0)home();else if(i==5)erOpen();else if(i==3)swOpen();else if(i==4)muOpen();else frame(i==1?"prog4.html":"logica.html",i==1?"Ejercicios de Prog4":"Ejercicios de Lógica")}
function frame(src,t){V.innerHTML=`<iframe id="fr" class="fr" src="${src}" title="${t}"></iframe>`;const f=$("fr"),fit=()=>{try{const d=f.contentDocument,m=d.querySelector("main")||d.body;f.style.height=Math.max(480,Math.ceil(m.getBoundingClientRect().height)+60)+"px"}catch(e){}};f.onload=()=>{fit();clearInterval(TM);TM=setInterval(fit,500)}}

/* ---- Inicio ---- */
function blk(s){const a=CARDS.filter(c=>c.s==s),st=stats(s),pc=Math.round(st.m/a.length*100);
const tg=[...new Set(a.map(c=>c.g))].map(g=>{const x=a.filter(c=>c.g==g),m=x.filter(c=>S.c[c.id]&&S.c[c.id].b>=3).length,l=x.filter(c=>S.c[c.id]&&S.c[c.id].b<3).length;return `<div class="tg"><span>${esc(g)}</span><div class="sb"><i style="width:${m/x.length*100}%;background:var(--ok)"></i><i style="width:${l/x.length*100}%;background:var(--ac)"></i></div><span class="mut">${m}/${x.length}</span></div>`}).join("");
return `<div class="card ${SUBJ[s].c}"><div class="row between"><b class="sj">${SUBJ[s].n}</b><span class="mut">${st.m}/${a.length} dominadas</span></div>${tg}${pc>=60?`<button class="btn big" data-a="tab" data-v="${s=="p4"?1:2}">Bases sólidas: probar ejercicios completos</button>`:""}</div>`}
function home(){roll();hdr();const st=stats(F),g=goal(),rm=remain(),nl=CARDS.filter(c=>!S.c[c.id]&&(F=="all"||c.s==F)).length,tdN=st.d+Math.min(nl,rm),allN=st.d+nl,deb=Math.max(0,g-S.nm),seen=CARDS.filter(c=>S.c[c.id]&&(F=="all"||c.s==F)).length,cls=F=="lg"?"s-lg":"s-p4";
let h=`<div class="row">${[["all","Mezclado"],["p4","Prog4"],["lg","Lógica"]].map(([k,t])=>`<button class="btn chip${F==k?" sel":""}" data-a="f" data-v="${k}">${t}</button>`).join("")}</div>
<div class="card hero ${cls}"><div class="nums"><div><b>${st.d}</b><span>por repasar</span></div><div><b>${S.nw}/${g}</b><span>meta de hoy</span></div><div><b>${st.m}</b><span>dominadas</span></div></div>`;
if(deb>0)h+=`<p class="mut" style="margin:10px 0 0;text-align:center">La meta incluye ${deb} de días anteriores.</p>`;
if(tdN)h+=`<button class="btn pri big" data-a="go">Empezar con la meta de hoy (${tdN})</button>`;
else h+=`<p style="margin:14px 0 0;text-align:center">Meta de hoy cumplida y nada para repasar.</p>`;
if(allN>tdN)h+=`<button class="btn big" data-a="go2">Estudiar todo el mazo (${allN})</button>`;
if(seen)h+=`<button class="btn big" data-a="go3">Práctica libre: lo más flojo primero</button><p class="mut" style="margin:8px 0 0;text-align:center">La práctica libre no cambia el calendario.</p>`;
h+=`</div><div class="row" style="margin-top:12px"><span class="mut">Meta diaria de tarjetas nuevas</span>${[10,20,40].map(n=>`<button class="btn chip${S.nm==n?" sel":""}" data-a="nm" data-v="${n}">${n}</button>`).join("")}</div>`;
(F=="all"?["p4","lg"]:[F]).forEach(s=>h+=blk(s));
h+=`<button class="btn ghost" data-a="rst">${RS?"Tocá otra vez para borrar todo el progreso":"Reiniciar progreso"}</button>`;V.innerHTML=h}

/* ---- Sesión ---- */
function go(mode){roll();const q=mkQ(F,mode);if(!q.length){home();return}Q={q,i:0,n:q.length,dn:0,first:{},ok:0,tot:0,xp:0,per:{p4:[0,0],lg:[0,0]},ans:null,sh:false,o:null,cram:mode=="libre",rn:1,rt:0,res:RES0,rs:0,rsd:{},out:0,back:0,r:{ok:0,tot:0,out:0,bonus:0}};deal()}
function deal(){const c=Q.q[Q.i];Q.ts=Date.now();Q.back=0;Q.ans=null;Q.sh=false;Q.hint=false;Q.o=c&&c.k=="mc"?sh([c.a].concat(c.d)):null;draw()}
function mark(c,rt){if(!Q.first[c.id]){Q.first[c.id]=1;if(!Q.cram){touch();apply(c,rt)}Q.tot++;Q.r.tot++;Q.per[c.s][1]++;if(rt>=1){Q.ok++;Q.r.ok++;Q.per[c.s][0]++}if(rt>=2)Q.res=Math.min(RMAX,Q.res+ACI);const x=rt>=2?10:rt==1?5:0;Q.xp+=x;S.xp+=x;S.xpd+=x;hdr()}SV()}
function pick(i){const c=Q.q[Q.i];if(Q.ans!=null)return;Q.ans=i;const ok=Q.o[i]==c.a,cs=S.c[c.id];logA("rep",c.s,c.g||"",ok,{q:c.q,a:c.a,p:String(Q.o[i]).split("||")[0],ms:Date.now()-(Q.ts||Date.now()),rp:Q.first[c.id]?1:0,b:cs?cs.b:-1,id:c.id});mark(c,ok?2:0);draw()}
function endR(){const r=Q.r;r.t=Q.rt;r.bonus=Q.res>0?10:0;r.res=Math.round(Q.res);Q.xp+=r.bonus;S.xp+=r.bonus;S.xpd+=r.bonus;SV();hdr();Q.rs=1}
function nr(){Q.rs=0;Q.rn++;Q.rt=0;Q.res=RES0;Q.r={ok:0,tot:0,out:0,bonus:0};draw()}
const chk=()=>{if(Q.dn>0&&Q.dn%RN==0&&Q.dn<Q.n&&!Q.rsd[Q.dn]){Q.rsd[Q.dn]=1;endR()}};
function adv(){const c=Q.q[Q.i];if(Q.o[Q.ans]==c.a){Q.dn++;chk()}else Q.q.splice(Math.min(Q.i+4,Q.q.length),0,c);Q.i++;deal()}
function rate(r){const c=Q.q[Q.i];mark(c,r);if(r>=1){Q.dn++;chk()}else Q.q.splice(Math.min(Q.i+4,Q.q.length),0,c);Q.i++;deal()}
function qh(q){const L=q.split("\n"),p=L.pop();return (L.length?`<div class="sn">${esc(L.join("\n"))}</div>`:"")+`<div class="qt">${esc(p)}</div>`}
const mmss=t=>Math.floor(t/60)+":"+String(t%60).padStart(2,"0");
function roundScr(){const r=Q.r,nx=Q.q[Q.i],pc=Math.round(Q.dn/Q.n*100);V.innerHTML=`<div class="card"><h2>Ronda ${Q.rn} completa</h2><p style="margin:0"><b>${r.ok}/${r.tot}</b> a la primera · ${mmss(r.t)} pensando · te sobraron ${r.res} s${r.bonus?` · +${r.bonus} XP por ritmo`:""}</p>${r.out?`<p class="mut">Saliste de la pestaña ${r.out} ${r.out==1?"vez":"veces"} en esta ronda.</p>`:""}<div class="pb" style="margin:10px 0"><i style="width:${pc}%"></i></div><p class="mut">${Q.dn}/${Q.n} del total. Mirá lejos 10 segundos y seguí. La próxima arranca con ${nx?SUBJ[nx.s].n:""}.</p><div class="row"><button class="btn pri big" data-a="nr">Siguiente ronda</button><button class="btn" data-a="exit">Terminar por hoy</button></div></div>`}
function tick(){if(!Q||Q.done||Q.rs||TAB!=0||document.hidden||Q.cram===undefined)return;const c=Q.q[Q.i];if(!c||(c.k=="mc"?Q.ans!=null:Q.sh))return;Q.rt++;Q.res=Math.max(0,Q.res-1);const e=$("pi");if(e)e.style.width=Q.res/RMAX*100+"%"}
setInterval(tick,1000);
document.addEventListener("visibilitychange",()=>{if(!Q||Q.done||Q.rs||TAB!=0)return;if(document.hidden){Q.out++;Q.r.out++}else{Q.back=1;draw()}});
function draw(){const c=Q.q[Q.i];if(!c)return fin();if(Q.rs)return roundScr();const pc=Math.round(Q.dn/Q.n*100);
let h=`<div class="${SUBJ[c.s].c}"><div class="row"><button class="btn x" data-a="exit" aria-label="Salir de la sesión">×</button><div class="pb"><i style="width:${pc}%"></i></div><span class="mut cnt">R${Q.rn} · ${Q.dn}/${Q.n}</span></div><div class="pace"><i id="pi" style="width:${Q.res/RMAX*100}%"></i></div>${Q.back?`<div class="hn">Volviste. Retomá desde esta tarjeta.</div>`:""}<div class="card"><div class="lbl"><b class="sj">${SUBJ[c.s].n}</b> · ${esc(c.g)}${Q.first[c.id]?" · repetición":""}</div>${qh(c.q)}`;
if(c.k=="mc"){const ci=Q.o.indexOf(c.a);h+=domHtml(c)+hintHtml(c);h+=Q.o.map((t,i)=>{let k="";if(Q.ans!=null){if(i==ci)k=" ok";else if(i==Q.ans)k=" no"}return `<button class="btn opt${k}" data-a="o" data-i="${i}"${Q.ans!=null?" disabled":""}>${esc(t)}</button>`}).join("");
if(Q.ans!=null){const r=Q.ans==ci;h+=`<div class="fb ${r?"ok":"no"}"><b>${r?"Correcto":"Incorrecto"}</b>${r?"":`<div>Respuesta: ${esc(c.a)}</div>`}<div>${esc(c.w||"")}</div>${r?"":wy(c,Q.o[Q.ans])}</div><button class="btn pri big" data-a="next">Continuar</button>`}}
else if(!Q.sh)h+=`<button class="btn pri big" data-a="show">Mostrar respuesta</button>`;
else h+=`<div class="back">${c.b}</div><div class="rate">${[["Otra vez",0],["Difícil",1],["Bien",2],["Fácil",3]].map(([t,r])=>`<button class="btn r${r}" data-a="r" data-r="${r}"><b>${t}</b><span>${lab(c,r)}</span></button>`).join("")}</div>`;
V.innerHTML=h+"</div></div>"}
function fin(){Q.done=1;const per=Object.keys(Q.per).filter(k=>Q.per[k][1]).map(k=>`<div class="tg ${SUBJ[k].c}"><b class="sj">${SUBJ[k].n}</b><span>${Q.per[k][0]}/${Q.per[k][1]} a la primera</span><span></span></div>`).join(""),tm=CARDS.filter(c=>{const s=S.c[c.id];return s&&s.due>Date.now()&&s.due<D0()+2*864e5}).length;
const mr=mkQ(F,"todo").length;V.innerHTML=`<div class="card"><h2>Sesión completa</h2><p style="margin:0"><b>${Q.ok}/${Q.tot}</b> a la primera · +${Q.xp} XP</p>${per}${Q.cram?`<p class="mut">Práctica libre: no cambió el calendario.</p>`:""}<p class="mut">${tm?"Mañana vuelven "+tm+" tarjetas.":"Mañana no hay repasos pendientes."}</p><div class="row">${mr?`<button class="btn pri" data-a="go2">Seguir con el resto (${mr})</button>`:`<button class="btn pri" data-a="go3">Práctica libre</button>`}<button class="btn" data-a="home">Volver</button></div></div>`}

V.onclick=ev=>{const b=ev.target.closest("[data-a]");if(!b)return;const a=b.dataset.a;if(a!="rst")RS=0;
if(a=="f"){F=b.dataset.v;home()}else if(a=="nm"){S.nm=+b.dataset.v;SV();home()}
else if(a=="go")go("meta");else if(a=="go2")go("todo");else if(a=="go3")go("libre");else if(a=="tab")tab(+b.dataset.v);
else if(a=="rst"){if(RS){S=Object.assign(S,{c:{},nw:0,xp:0,xpd:0,last:"",stk:0,debt:0});SV();RS=0}else RS=1;hdr();home()}
else if(a=="home"||a=="exit"){Q=null;home()}
else if(Q&&!Q.done){if(a=="o")pick(+b.dataset.i);else if(a=="nr")nr();else if(a=="dom"){S.dom=!S.dom;SV();draw()}else if(a=="hint"){Q.hint=!Q.hint;draw()}else if(a=="show"){Q.sh=true;draw()}else if(a=="r")rate(+b.dataset.r);else if(a=="next")adv()}};
document.addEventListener("keydown",e=>{if(!Q||Q.done||TAB!=0||e.ctrlKey||e.metaKey||e.altKey)return;const c=Q.q[Q.i];if(!c)return;const k=e.key,bt=e.target.tagName=="BUTTON";if(Q.rs){if(k=="Enter"&&!bt)nr();return}
if(c.k=="mc"){if(Q.ans==null&&/^[1-4]$/.test(k)&&Q.o[k-1]!==undefined)pick(k-1);else if(Q.ans!=null&&k=="Enter"&&!bt)adv()}
else if(!Q.sh&&(k=="Enter"||k==" ")&&!bt){e.preventDefault();Q.sh=true;draw()}else if(Q.sh&&/^[1-4]$/.test(k))rate(k-1)});
/* Tarjetas de Repaso sin serie equivalente en Deslizar: se convierten en series de hasta 6 pasos (correcta vs. primer distractor; el escenario va como contexto del paso). */
const PORT=["p4|Destino","p4|Mensaje","p4|Decisión","p4|Quiz ejercicios","lg|Primer paso","lg|Leer derivación","lg|Fórmulas","lg|Quiz ejercicios"];
PORT.forEach(k=>{const[sj,g]=k.split("|"),cs=CARDS.filter(c=>c.k=="mc"&&c.s==sj&&c.g==g&&c.d&&c.d.length);
 for(let j=0;j<cs.length;j+=6){const ch=cs.slice(j,j+6),n=Math.ceil(cs.length/6);
  SWC.push(sw(sj,g+(n>1?" "+(j/6+1)+"/"+n:""),null,ch.map(c=>{const L=c.q.split("\n"),q=L.pop(),[b,why]=String(c.d[0]).split("||");const stp=Object.assign(st(q,c.a,b,c.w||why||""),L.length?{x:L.join("\n")}:{});if(sj=="p4"&&DOMT.includes(g)){const op=(c.q.match(/(\w+)\(/)||[])[1],cl=(String(c.a).match(/\b[A-Z]\w+/)||[])[0],es=L.join("\n");const dl=DOM.split("\n"),OPL=dl.filter(l=>!l.includes("──")&&!l.includes("abstracta")&&l.includes("(")&&l.includes(": ")),ARL=dl.filter(l=>l.includes("──"));stp.x=(es?es+"\n":"")+"Dominio:\n"+((op&&DOM.includes(op+"("))?OPL:ARL).join("\n");stp.dom=1;if(op&&DOM.includes(op+"(")){stp.hl="^(?!.*──)[^\\n]*: .*\\b"+op+"\\(";stp.src=["Dom"]}else if(g=="Decisión"||g=="Destino"||(cl&&DOM.includes("──> "+cl))){const T=c.q+" "+c.a,K=[[/\b(est|Estudiante)\b/,"Estudiante"],[/\b(emp|Empresa)\b/,"Empresa"],[/\b(opc|oferta|OfertaPasantia)\b/i,"OfertaPasantia"],[/\b(p|pe|Postulacion|postulaci\w+)\b/,"Postulacion"],[/Controlador/,"Controlador"]].filter(([r])=>r.test(T)).map(x=>x[1]),R=K.length?K.join("|"):cl;stp.x=(es?es+"\n":"")+"Dominio:\n"+ARL.join("\n");const KL=!K.length?[]:ARL.filter(l=>K.filter(k=>l.includes(k)).length>=Math.min(2,K.length)),SL=KL.length?KL:ARL.filter(l=>R&&new RegExp(R).test(l));if(SL.length){stp.hl=SL.map(l=>"^"+l.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"$").join("|");stp.src=["Dom"]}else{stp.hl="ESC";stp.src=["Esc"];if(es)stp.x=es;else delete stp.x}}else{stp.hl="ESC";stp.src=["Esc"];if(es)stp.x=es;else delete stp.x}if(stp.hl&&(stp.hl=="ESC"?!es:!stp.x.split("\n").some(l=>new RegExp(stp.hl).test(l)))){delete stp.hl;delete stp.src}}return stp})))}});
lgApply();
/* ---- Pestaña Deslizar: decisiones binarias (estado propio en localStorage "sw1") ---- */
let S2={box:{},xp:0,best:0,n:0,ok:0,day:"",today:0};
try{const r=localStorage.getItem("sw1");if(r)S2=Object.assign(S2,JSON.parse(r))}catch(e){}
const SV2=()=>{try{localStorage.setItem("sw1",JSON.stringify(S2))}catch(e){}};
let SW=null,SF="all",SCOMBO=0,SRETRY=[],SLAST="",SUN=0,SDRAG=null,STM=null;
const swBox=(c,i)=>S2.box[c.id+":"+i]||0;
function swPick(){const t=TD();if(S2.day!=t){S2.day=t;S2.today=0}
 const ok=c=>SF=="all"||c.s==SF,di=SRETRY.findIndex(r=>r.due<=SUN&&ok(r.c));
 if(di>=0){const r=SRETRY.splice(di,1)[0];return{c:r.c,i:r.i,only:true,built:[],err:0}}
 let pool=SWC.filter(c=>ok(c)&&c.id!=SLAST);if(!pool.length)pool=SWC.filter(ok);
 const w=pool.map(c=>1+c.steps.reduce((a,_,i)=>a+Math.max(0,3-swBox(c,i)),0));let r=Math.random()*w.reduce((a,b)=>a+b,0),k=0;
 while(r>w[k]&&k<pool.length-1){r-=w[k];k++}
 return{c:pool[k],i:0,only:false,built:[],err:0}}
function swNew(){SW=swPick();SW.ts=Date.now();SW.ans=null;SW.cl=Math.random()<.5;swDraw()}
function swStep(){SW.ts=Date.now();SW.ans=null;SW.cl=Math.random()<.5;swDraw()}
const HLN={dg:"el diagrama",Tengo:"«Tengo»","▶":"el objetivo ▶",Clases:"«Clases»",Dom:"el dominio",Esc:"el enunciado"};
function ctxH(t,src,hl){const L=t.split("\n"),di=L.indexOf("Dominio:");return L.map((l,i)=>{if(hl){const on=hl=="ESC"?(di<0||i<di):(di>=0&&i>di&&new RegExp(hl).test(l));return on?`<div class="hl">${esc(l)}</div>`:`<div>${esc(l)}</div>`}const k=l.startsWith("Tengo:")?"Tengo":l.startsWith("Clases:")?"Clases":l.startsWith("▶")?"▶":"";return k&&src&&src.includes(k)?`<div class="hl">${esc(l)}</div>`:`<div>${esc(l)}</div>`}).join("")}
function swDraw(){const u=SW,c=u.c,lv=Math.floor(S2.ok/25)+1,pr=S2.ok%25;
 let h=`<div class="s-${c.s}"><div class="row"><b class="sj">Nivel ${lv}</b><div class="pb"><i style="width:${pr/25*100}%"></i></div><span class="mut cnt">${pr}/25</span></div>`+
 `<div class="row between mut" style="margin-top:6px"><span>Racha ${SCOMBO}</span><span>Mejor ${S2.best}</span><span>Hoy ${S2.today}</span></div>`+
 `<div class="row" style="margin-top:8px">${[["all","Mezclado"],["p4","Prog4"],["lg","Lógica"]].map(([k,t])=>`<button class="btn chip${SF==k?" sel":""}" data-w="sf" data-v="${k}">${t}</button>`).join("")}</div>`;
 if(u.recap){h+=`<div class="card"><h2>Serie completa</h2>${swDg(c,0,1)}<p style="margin:0">${u.err?u.err+(u.err==1?" error":" errores")+": esas decisiones vuelven en un rato.":"Sin errores: +"+u.bonus+" XP."}</p>${c.out?`<div class="lbl" style="margin-top:10px">Así queda armado</div><div class="sn">${esc(c.out)}</div>`:""}<button class="btn pri big" data-w="go">Siguiente</button></div></div>`;V.innerHTML=h;return}
 const s=c.steps[u.i],L=u.cl?s.a:s.b,R=u.cl?s.b:s.a,cs=u.ans?(u.cl?"L":"R"):"",pk=u.pick,
 cl=side=>u.ans?(side==cs?" ok":(side==pk?" no":"")):"";
 h+=`<div class="swc" id="swc"><div class="lbl"><b class="sj">${SUBJ[c.s].n}</b> · ${esc(c.g)} · ${u.only?"repaso":"paso "+(u.i+1)+"/"+c.steps.length}</div>`+
 ((s.x||c.ctx)?`<div class="sn">${ctxH(s.x||c.ctx,u.ans=="no"?s.src:null,u.ans=="no"?s.hl:null)}</div>`:"")+(u.ans=="no"&&s.src&&s.src.includes("dg")?`<div class="hl">${swDg(c,u.i,0)}</div>`:swDg(c,u.i,0))+(c.out&&!u.only&&u.built.length?`<div class="sn">Armando: ${esc(u.built.filter(Boolean).join(" · "))} …</div>`:"")+
 `<div class="qt">${esc(s.q)}</div><div class="swopts"><div class="swo l${cl("L")}" data-w="L" role="button" tabindex="0">← ${esc(L)}</div><div class="swo r${cl("R")}" data-w="R" role="button" tabindex="0">${esc(R)} →</div></div>`+(u.ans?"":`<button class="btn ghost" data-w="NS" style="display:block;margin:10px auto 0">No sé <span class="mut">(↓)</span></button>`)+
 (u.ans=="no"?`<div class="fb no"><b>${u.pick=="NS"?"No sabías. ":""}Era: ${esc(s.a)}</b><div>${esc(s.w||"")}</div>${s.src?`<div class="mut" style="margin-top:4px">👀 Estaba en: ${s.src.map(k=>HLN[k]).join(" y ")} (marcado arriba)</div>`:""}</div><button class="btn pri big" data-w="go">Continuar</button>`:"")+`</div></div>`;
 V.innerHTML=h;swBind()}
function swBind(){const el=$("swc");if(!el||SW.ans)return;
 el.onpointerdown=e=>{SDRAG={x:e.clientX,dx:0,t:e.target.closest("[data-w]")};try{el.setPointerCapture(e.pointerId)}catch(_){}el.style.transition="none"};
 el.onpointermove=e=>{if(!SDRAG)return;SDRAG.dx=e.clientX-SDRAG.x;el.style.transform=`translateX(${SDRAG.dx}px) rotate(${SDRAG.dx/30}deg)`;el.classList.toggle("tl",SDRAG.dx<-30);el.classList.toggle("tr",SDRAG.dx>30)};
 el.onpointerup=el.onpointercancel=()=>{if(!SDRAG)return;const dx=SDRAG.dx,t=SDRAG.t;SDRAG=null;el.style.transition="";if(Math.abs(dx)>80)swChoose(dx<0?"L":"R");else if(Math.abs(dx)<8&&t&&/^(L|R|NS)$/.test(t.dataset.w)){el.style.transform="";el.classList.remove("tl","tr");swChoose(t.dataset.w)}else{el.style.transform="";el.classList.remove("tl","tr")}}}
function swChoose(side){if(!SW||SW.ans||SW.recap)return;const u=SW,c=u.c,s=c.steps[u.i],ok=side!="NS"&&(side=="L")==u.cl,k=c.id+":"+u.i;
 u.ans=ok?"ok":"no";u.pick=side;logA("sw",c.s,c.g,ok,{q:s.q,x:s.x||c.ctx||"",a:s.a,p:side=="NS"?"No sé ("+s.b+")":s.b,ns:side=="NS"?1:0,ms:Date.now()-(u.ts||Date.now()),rp:u.only?1:0,n:u.i+1});S2.box[k]=ok?Math.min(4,(S2.box[k]||0)+1):0;S2.n++;SUN++;
 if(ok){S2.ok++;S2.today++;SCOMBO++;if(SCOMBO>S2.best)S2.best=SCOMBO;S2.xp+=1+(SCOMBO%5==0?2:0)}
 else{SCOMBO=0;u.err++;SRETRY.push({c,i:u.i,due:SUN+3});try{navigator.vibrate&&navigator.vibrate(30)}catch(_){}}
 SV2();swDraw();if(ok)STM=setTimeout(swAdvance,420)}
function swAdvance(){clearTimeout(STM);if(!SW||TAB!=3)return;const u=SW,s=u.c.steps[u.i];
 if(u.recap||u.only){swNew();return}
 if(s&&s.f)u.built.push(s.f);u.i++;
 if(u.i>=u.c.steps.length){u.bonus=u.err==0?5:0;S2.xp+=u.bonus;SLAST=u.c.id;SV2();u.recap=true;swDraw();return}
 swStep()}
function swOpen(){SW=null;swNew()}
V.addEventListener("click",ev=>{if(TAB!=3)return;const b=ev.target.closest("[data-w]");if(!b)return;const w=b.dataset.w;
 if(w=="L"||w=="R"||w=="NS")swChoose(w);else if(w=="go")swAdvance();else if(w=="sf"){SF=b.dataset.v;swNew()}});
document.addEventListener("keydown",e=>{if(TAB!=3||!SW||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key;
 if(k=="ArrowDown"&&SW.ans==null&&!SW.recap){e.preventDefault();swChoose("NS")}
 else if(k=="ArrowLeft"||k=="ArrowRight"){e.preventDefault();if(SW.ans==null&&!SW.recap)swChoose(k=="ArrowLeft"?"L":"R");else if(SW.ans!="ok")swAdvance()}
 else if((k=="Enter"||k==" ")&&e.target.tagName!="BUTTON"){e.preventDefault();if(SW.recap||SW.ans=="no")swAdvance()}});
