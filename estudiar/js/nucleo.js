/* NÚCLEO: estado, Repaso, motor de Deslizar, pestañas y portado de tarjetas. Tocar solo para cambios que afecten a todas las secciones. */
/* PARA TODAS LAS SESIONES (19/11, pedido de Luca; varias conversaciones trabajan en paralelo sobre este repo):
   1. Antes de cambiar algo, traer los cambios (git pull) y leer los comentarios de decisiones del archivo que se va a tocar: acá están las reglas vigentes,
      con fecha y el pedido de Luca que las motivó (buscar «pedido de Luca»).
   2. TODA decisión nueva se comenta en el código, junto al código que la implementa: qué se decidió, por qué y la fecha. Si cambia una regla anterior,
      se actualiza ese comentario (no se deja uno viejo que la contradiga).
   3. Si una regla nueva toca la misma cosa que otra vigente (por ejemplo, el orden en que salen las tarjetas: «ESTADO DE CADA BLOQUE» y «ROTACIÓN DE
      TEMAS»), se hacen convivir y se escribe cómo conviven. Si chocan de verdad, se le pregunta a Luca antes de pisar una.
   4. Al terminar: actualizar ?v= en index.html, probar con jsdom, commit y push, y anotar el cambio en NOTAS-examenes.md. */

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
/* Música no registra errores: se limpian los que hubieran quedado guardados */
if(E1.log.some(e=>e.w=="mu")||Object.keys(E1.st).some(k=>k.startsWith("mu|"))){E1.log=E1.log.filter(e=>e.w!="mu");Object.keys(E1.st).forEach(k=>{if(k.startsWith("mu|"))delete E1.st[k]});try{localStorage.setItem("err1",JSON.stringify(E1))}catch(e){}}
const SVE=()=>{try{localStorage.setItem("err1",JSON.stringify(E1))}catch(e){}};
function logA(w,s,g,ok,info){if(w=="sw"&&TAB==7)w="bs";/* aciertos por día (E1.day[fecha][w|s] = [ok, intentos]) para medir progreso */{const dy=new Date().toLocaleDateString("en-CA"),D2=E1.day||(E1.day={}),x=D2[dy]||(D2[dy]={}),kk=w+"|"+s,y=x[kk]||(x[kk]=[0,0]);y[1]++;if(ok)y[0]++}
 const k=w+"|"+s+"|"+g,v=E1.st[k]||(E1.st[k]=[0,0]);v[1]++;if(ok)v[0]++;else{E1.log.push(Object.assign({t:Date.now(),w,s,g},info));if(E1.log.length>4000)E1.log.splice(0,E1.log.length-4000)}SVE()}
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
function tab(i){TAB=i;Q=null;clearInterval(TM);muStop();[0,1,2,3,4,5,6,7,8,9].forEach(j=>{const x=$("t"+j);if(x)x.className="btn tab"+(j==i?" on":"")});hdr();if(i==6)bqOpen();else if(i==0)home();else if(i==5)erOpen();else if(i==3){swMode(3);SF=SF=="bas"?"all":SF;swOpen()}else if(i==7){swMode(7);SF="bas";swOpen()}else if(i==8)cdOpen();else if(i==9)arOpen();else if(i==4)muOpen();else frame(i==1?"prog4.html":"logica.html",i==1?"Ejercicios de Prog4":"Ejercicios de Lógica")}
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
/* Sin duplicados en Prog4: estas cadenas sueltas quedan cubiertas por las tarjetas por línea de cada ejercicio y por la serie «Qué miro». */
{const DROP=/^(Estereotipo \((parámetro|asociación|local)\)|Numeración: ¿quién envía\?|Destino: ¿colección u objeto\?|Condición \[ \]|Destino \d\/\d|Mensaje|Decisión \d\/\d|Quiz ejercicios \d\/\d|Qué miro · .*|Falta camino|postularse · orden|aceptarPostulacion · responsabilidades)$/;for(let i=SWC.length-1;i>=0;i--)if(SWC[i].s=="p4"&&DROP.test(SWC[i].g))SWC.splice(i,1)}
/* =====================================================================================================
   DECISIONES DIDÁCTICAS DE DESLIZAR (acordadas con Luca, oct-nov 2026). Respetarlas al reciclar este código.
   - Tarjetas atómicas: una decisión por paso, con el contexto justo para responderla (ni más ni menos).
   - Sin spoilers: un paso no puede nombrar algo que el estudiante todavía no dedujo (ni en la pregunta, ni en el
     contexto, ni en el árbol: lo no decidido se muestra como «?»). Los pasos siguen el orden en que razonaría.
   - Distractores tentadores (errores reales), nunca absurdos.
   - Al fallar NO se repregunta enseguida: la serie se corta, se pasa a otro TEMA (swTop) y el paso fallado vuelve
     ~8 respuestas después (SRETRY). Un paso fallado queda «pendiente» hasta 2 aciertos seguidos (swPend): pesa más
     al elegir y forma el filtro «Mis errores».
   - Un acierto que tarda más de 25 s no sube de caja (se sabía a medias).
   - Al terminar una tarjeta «Árbol · …» el árbol completo queda visible (memoria visual) con un botón Continuar.
   - Sin fechas de vencimiento (Luca no las quiere): se prioriza lo que hace más tiempo que no se ve (S2.seen), pesado por lo flojo y los pendientes.
     La solución a la repetición es sumar ejercicios (de exámenes viejos), no espaciar por días.
   - «No sé» (flecha ↓) cuenta como error, se registra aparte y muestra EN LA MISMA TARJETA la teoría de eso que no
     supo (swTeo/THT). Se descartó saltar a otra serie de teoría: no era lo que necesitaba ver.
   - Teoría previa (s.th, recuadro 📘) antes de las preguntas de temas que fueron «No sé».
   - Lógica en Deslizar = solo tarjetas «Árbol · …» (árboles cortos de Bloques); aparecen recién cuando sus previas se
     acertaron sin errores (S2.bqok). Las series de conceptos de Lógica se retiraron (siguen en logica.js, sin mostrar).
     Excepción: las series de otros tipos de ejercicio de examen (semántica, modelos) llevan keep:1 y previas propias (c.req: títulos de
     series que hay que terminar sin errores).
   ===================================================================================================== */
/* ---- Pestaña Deslizar: decisiones binarias (estado propio en localStorage "sw1") ---- */
let S2={box:{},xp:0,best:0,n:0,ok:0,day:"",today:0};
try{const r=localStorage.getItem("sw1");if(r)S2=Object.assign(S2,JSON.parse(r))}catch(e){}
let SK="sw1";const SV2=()=>{try{localStorage.setItem(SK,JSON.stringify(S2))}catch(e){}};
let SLT="",SLK="";const swTop=c=>c.s+"|"+c.g.replace(/ · .*$/,"").replace(/ \d+\/\d+$/,"").replace(/ \(.*\)$/,"");
/* Al fallar se rota de tema: comunicación → deducción natural → código C++ → clases/secuencia. */
const SAF={com:"com",p1:"mod",p3:"cod"},SAO=["com","ded","cod","mod"],area=c=>c.ar?c.ar:c.s=="lg"?"ded":/^Parcial P3/.test(c.g)?"cod":/^Parcial P1/.test(c.g)?"mod":"com";let SERR="",SAX="",SPACK=[],SPK=null;
/* PAQUETES QUE VUELVEN (pedido de Luca, 16/11): un paquete de ejercicio (tarjetas kit, c.kq) con errores no trae de vuelta sus tarjetas sueltas a las 8
   respuestas: vuelve ENTERO. Ningún paquete (aprobado o no) se repite antes de PKN respuestas desde que se terminó (PKF: paquete → respuesta en que se
   terminó), y nunca antes que algo disponible que todavía no se vio (lo nunca visto tiene prioridad máxima). Si todo lo disponible está en espera, sale
   primero lo que hace más tiempo que no se ve, pesado por los errores. Al sumar exámenes nuevos, sus paquetes pasan adelante de los ya vistos. */
/* APROBAR UN PAQUETE (pedido de Luca, 16/11: «es muy difícil hacer un paquete completo sin ningún error»): no hace falta una pasada perfecta. Cada tarjeta
   acertada sin errores queda hecha (S2.kok); cuando el paquete vuelve, trae SOLO las tarjetas que faltan (las hechas se ven en «lo que ya resolviste») y se
   aprueba cuando todas quedaron hechas. Un paquete a medias pesa más al elegir repaso. Ya aprobado, si vuelve como repaso, vuelve entero. */
/* «NO SÉ» CON TEORÍA (pedido de Luca, 16/11): en una tarjeta kit, «No sé» muestra la respuesta, su porqué (e.w) y la teoría de esa acción (c.th); en una
   serie binaria, si el paso no trae teoría propia se muestra la de la serie (th del primer paso). */
/* DIBUJO PROPIO (17/11): una tarjeta kit con c.kd(puestas, actual) dibuja lo armado como el diagrama del examen (recuadros UML, líneas de vida…)
   en vez de la línea de fichas; lo que falta decidir aparece como «?» y el lugar actual resaltado. */
/* ESTADO DE CADA BLOQUE (pedido de Luca, 17/11: «estoy resolviendo siempre los mismos»). Bloque = lo que se elige del pozo: un paquete (su dueño),
   una serie, un árbol. S2.bst[id]: 2 = terminado (o cortado) con errores, 1 = terminado sin errores; sin estado y sin ver = nuevo.
   Orden estricto: (1) lo nuevo que esté disponible: mientras quede, no vuelve NINGÚN bloque visto, ni siquiera los reintentos de pasos fallados;
   (2) los bloques con errores; (3) los terminados sin errores. Dentro de cada grupo, lo que hace más tiempo que no se ve (pesado por lo flojo).
   Un bloque visto antes de este cambio, sin estado, cuenta como «con errores» si tiene algún paso en caja 0 y como «sin errores» si no. */
const BST=()=>S2.bst||(S2.bst={}),blkTier=c=>{const B=BST(),b=B[c.id]||(c.then&&B[c.then.id]);if(b==2)return 1;if(b==1)return 2;if(!(S2.seen||{})[c.id])return 0;return c.steps.some((_,i)=>!swBox(c,i))?1:2};
const PKF={},PKN=15,KTH={tra:"Traducir la letra: cada objetivo dice QUÉ necesita el sistema, y sale de la firma, las precondiciones y las poscondiciones: qué objetos hay que obtener (a partir de los datos que llegan) y qué hay que hacer con ellos (crear, vincular, eliminar, calcular). No son objetivos verificar una precondición (se asume cumplida) ni lo que resuelve otra operación.",
 des:"Desarmar el tramo: quién le pide qué a quién. El Controlador hace directo solo lo que alcanza (buscar en sus colecciones); el resto se lo pide, con una operación propia, al objeto que tiene la información, y ese objeto sigue con los suyos. Crear (create) lo hace quien va a quedar vinculado al objeto nuevo; agregar o quitar de una colección (add, remove) lo hace el dueño de esa colección."};
/* Filtros por tema (pedido de Luca, 16/11): cada tema de examen tiene su filtro. Las series binarias de teoría van DENTRO de su tema (c.tm) y son previas de sus cadenas: al completarlas sin errores queda S2.bqok[c.g]. */
const tema=c=>c.tm?c.tm:c.s=="lg"?"lg3":/ · DCD/.test(c.g)?"dcd":/ · DSS|^Parcial P1b/.test(c.g)?"dss":/ · Modelo de dominio|^Parcial P1a/.test(c.g)?"md":area(c)=="cod"?"p3":area(c)=="mod"?"md":"com";
/* FILTROS COMO CASILLEROS (19/11, pedido de Luca: «quiero marcar y desmarcar temas para que me aparezcan»). Cada tema es un casillero; salen
   tarjetas de los temas marcados (S2.selT, se guarda; sin guardar = todos). SF queda solo para el modo: "all" (temas marcados), "lin" (líneas
   sueltas), "err" (mis errores, también dentro de los temas marcados). Oído es un casillero más: con otros temas se intercala una tarjeta de oído
   cada OI_CADA; solo Oído = solo tarjetas de oído (musica.js). Tocar un filtro nunca dispara una de oído (SWNOOI). Siempre queda al menos uno. */
const TEMAS=[["Prog4",[["md","Modelo de dominio (1a)"],["dss","Secuencia · DSS (1b)"],["com","Comunicación (2a)"],["dcd","DCD (2b)"],["p3","Código C++ (P3)"]]],
 ["Lógica",[["lg1","Inducción"],["lg2","Semántica"],["lg3","Deducción"],["lg4","Modelos y consistencia"],["lg5","Tableaux"]]],["Oído",[["oi","Tarjetas de oído"]]]],
 TEMK=TEMAS.flatMap(g=>g[1].map(x=>x[0]));
const swSel=k=>{const L=S2&&S2.selT;return!Array.isArray(L)||L.includes(k)};window.swSel=swSel;
const swSelSet=(ks,on)=>{let L=Array.isArray(S2.selT)?S2.selT.slice():TEMK.slice();ks.forEach(k=>{L=L.filter(x=>x!=k);if(on)L.push(k)});if(!L.length)return false;S2.selT=L;SV2();return true};
window.swFiltHTML=()=>`<div style="margin-top:8px">${TEMAS.map(([gn,L])=>`<div class="row" style="flex-wrap:wrap;gap:6px;margin-top:4px;align-items:center"><span class="lbl" style="margin:0 4px 0 0">${gn}</span>${L.map(([k,t])=>{const on=swSel(k);return`<button class="btn chip${on?" sel":""}" data-w="st" data-v="${k}" role="checkbox" aria-checked="${on}">${on?"☑":"☐"} ${t}</button>`}).join("")}${L.length>1?`<button class="btn ghost" style="margin:0;padding:2px 8px;font-size:13px" data-w="sg" data-v="${L.map(x=>x[0]).join(",")}">${L.every(x=>swSel(x[0]))?"ninguno":"todos"}</button>`:""}</div>`).join("")}
 <div class="row" style="flex-wrap:wrap;gap:6px;margin-top:6px">${[["all","Temas marcados"],["lin","Líneas sueltas"],["err","Mis errores ("+swPend().size+")"]].map(([k,t])=>`<button class="btn chip${SF==k?" sel":""}" data-w="sf" data-v="${k}">${t}</button>`).join("")}</div></div>`;/* también la usa la tarjeta de oído (musica.js) */
let SW=null,SF="all",SCOMBO=0,SRETRY=[],SLAST="",SUN=0,SDRAG=null,STM=null;
const swBox=(c,i)=>S2.box[c.id+":"+i]||0;
/* Pendientes = pasos que fallaste alguna vez (registro de Errores) y todavía no acertaste 2 veces seguidas. Pesan más al elegir serie y forman el filtro "Mis errores". */
function swPend(){const m=new Map(),by={};SWC.forEach(c=>{(by[c.g]=by[c.g]||[]).push(c)});
 E1.log.forEach(e=>{if(e.w!=(TAB==7?"bs":"sw")||!e.n)return;const c=(by[e.g]||[]).find(c=>c.steps[e.n-1]&&c.steps[e.n-1].q==e.q);if(!c)return;const i=e.n-1;if(swBox(c,i)<2)m.set(c.id+":"+i,{c,i})});
 /* MARCAR PARA REPASAR (23/11, pedido de Luca: «es un error conceptual que quiero marcar para repasar; necesito esa opción»). Botón en cada
    tarjeta de fichas: la tarjeta entra en «Mis errores» y su bloque cuenta como terminado con errores, hasta dos aciertos seguidos. Vale para todas las secciones. */
 Object.keys(S2.mk||{}).forEach(k=>{const j=k.lastIndexOf(":"),id=k.slice(0,j),i=+k.slice(j+1),c=SWC.find(z=>z.id==id);if(c&&swBox(c,i)<2)m.set(k,{c,i});else delete S2.mk[k]});return m}
/* PREVIA CUMPLIDA AL TERMINAR (pedido de Luca, 23/11: «la previa la completa haber terminado el paquete anterior; eso ya debe desbloquear al
   siguiente; tenerlo sin errores que solo cambie el símbolo»). Un token de previa vale si: ya se aprobó sin errores (S2.bqok, como antes), o lo da
   TOKSEED, o el bloque que lo da está TERMINADO (todas sus tarjetas hechas, con o sin errores; o aprobado). Se calcula del progreso: vale también
   para lo hecho antes de este cambio. S2.bqok sigue marcando lo aprobado sin errores (lo usa el repaso de paquetes y el ⭐ del Árbol). */
let TPROV=null;
const tokProv=()=>{if(TPROV)return TPROV;TPROV={};mtBlq().forEach(b=>pcCardsOf(b).forEach(c=>(c.toks||[]).concat([c.g],c.bqx?[c.bqx]:[]).forEach(t=>{if(!TPROV[t])TPROV[t]=b})));return TPROV};
const blkFin=b=>{const B=BST();return B[b.id]==1||(b.then&&B[b.then.id]==1)||pcCardsOf(b).every(mtFinC)};
const tokOk=t=>!!((S2.bqok||{})[t]||(typeof TOKSEED=="function"&&TOKSEED(t))||(tokProv()[t]&&blkFin(tokProv()[t])));
/* SFORCE: bloque elegido en la pestaña Árbol (arbol.js): sale primero, con la misma lógica de inicio que un bloque elegido por el orden normal */
let SFORCE=null;
function swPick(){const t=TD();if(S2.day!=t){S2.day=t;S2.today=0}
 if(SFORCE&&TAB==3){const f=SFORCE;SFORCE=null;SPACK=[];return swStartBlk(f)}
 if(SPACK.length&&TAB==3){const c=SPACK.shift();return{c,i:0,only:false,built:[],err:0}}
 let ign=false;const avail=c=>(c.bqx?BQ.req(c.bqx):(c.req||[])).every(tokOk),bas=c=>!!c.arch||(c.s=="p4"&&!c.bld&&!c.dg&&area(c)=="com"),ok=c=>SF=="bas"?bas(c):(!bas(c)&&!c.hid&&avail(c)&&(SF=="lin"?!!c.ln&&!bldMulti(c):(!c.ln||SF=="err")&&(ign||swSel(tema(c))))),PD=swPend();
 if(SERR){const i=SAO.indexOf(SERR);SAX="";for(let j=1;j<=SAO.length&&!SAX;j++){const k=SAO[(i+j)%SAO.length];if(SF=="err"?[...PD.values()].some(r=>area(r.c)==k):SWC.some(c=>ok(c)&&area(c)==k))SAX=k}SERR=""}
 const arF=c=>!SAX||area(c)==SAX,nu=SF!="err"&&SWC.some(c=>ok(c)&&!blkTier(c)),di=nu?-1:SRETRY.findIndex(r=>r.due<=SUN&&ok(r.c)&&arF(r.c)&&swTop(r.c)!=SLT);
 if(di>=0){const r=SRETRY.splice(di,1)[0];return{c:r.c,i:r.i,only:true,built:[],err:0}}
 if(SF=="err"){let a=[...PD.values()].filter(r=>!r.c.hid);if(SAX&&a.some(r=>arF(r.c)))a=a.filter(r=>arF(r.c));if(a.length>1)a=a.filter(r=>r.c.id+":"+r.i!=SLK&&swTop(r.c)!=SLT).concat([]);if(!a.length)a=[...PD.values()].filter(r=>r.c.id+":"+r.i!=SLK);if(!a.length)a=[...PD.values()];if(a.length){const r=a[Math.floor(Math.random()*a.length)];return{c:r.c,i:r.i,only:true,built:[],err:0}}SF="all"}
 /* primero el nivel (nuevo → con errores → sin errores), después la variedad (otra área tras un error, no repetir el último, espera de los paquetes) */
 const cool=c=>!(c.kq&&PKF[c.id]!=null&&SUN-PKF[c.id]<PKN),C0=SWC.filter(ok);let CW=C0.filter(cool).length?C0.filter(cool):C0,pool=[];
 /* ROTACIÓN DE TEMAS (19/11, Luca: «tengo varios filtros marcados pero me tocan puros ejercicios de deducción»). Antes, «nuevos primero» era global y
    deducción, con muchos árboles chicos que se desbloquean al acertar, se llevaba casi todas las tarjetas. Ahora primero se elige el TEMA marcado (con
    algo disponible) que hace más tiempo que no sale (S2.tls), y adentro de ese tema rige lo de siempre: nuevos → con errores → sin errores. */
 /* CONVIVENCIA CON «NUEVOS PRIMERO» (19/11, Luca eligió esta opción): la rotación se hace solo entre los temas que todavía tienen bloques NUEVOS
    disponibles; recién cuando ningún tema tiene nada nuevo se rota entre todos. Así nunca se repite un bloque mientras quede uno sin ver en otro tema. */
 if(SF=="all"&&CW.length){const TT={};CW.forEach(c=>{(TT[tema(c)]=TT[tema(c)]||[]).push(c)});let ks=Object.keys(TT);const kn=ks.filter(k=>TT[k].some(c=>!blkTier(c)));if(kn.length)ks=kn;if(Object.keys(TT).length>1){const ls=S2.tls||{},w=k=>ls[k]||Math.random();CW=TT[ks.sort((a,b)=>w(a)-w(b))[0]]}}
 if(CW.length){const tm=Math.min(...CW.map(blkTier)),L=CW.filter(c=>blkTier(c)==tm);pool=L.filter(c=>arF(c)&&c.id!=SLAST&&swTop(c)!=SLT);if(!pool.length)pool=L.filter(c=>c.id!=SLAST);if(!pool.length)pool=L}
 /* filtro de un tema sin nada disponible (p. ej. DCD antes de aprobar sus diagramas): se entra igual por el comienzo de cada cadena de ese tema */
 if(!pool.length){const T=SWC.filter(c=>!c.ln&&!c.hid&&swSel(tema(c)));pool=T.filter(c=>!(c.req||[]).some(t=>T.some(z=>(z.toks||[]).includes(t))));if(!pool.length){ign=true;pool=SWC.filter(ok)}}/* nada disponible en los temas marcados: entra por el comienzo de sus cadenas; si tampoco, de cualquier tema */
 /* Prioridad (pedido 12/11, sin fechas): lo que hace MÁS TIEMPO que no ves. Nunca vista = máxima prioridad.
    El tiempo transcurrido se multiplica por lo flojo (cajas bajas) y por los pendientes de error; se elige al azar entre las 3 primeras para no ser predecible. */
 const SE=S2.seen||(S2.seen={}),now=Date.now(),sc=c=>{const st=SE[c.id];const weak=(c.kq&&c.pack&&S2.kok&&[c].concat(c.pack).some(x=>S2.kok[x.id])?4:0)+1+c.steps.reduce((a,_,i)=>a+Math.max(0,3-swBox(c,i))+(PD.has(c.id+":"+i)?6:0),0)/c.steps.length;return(st?(now-st):1e12+Math.random()*1e9)*weak};
 const tm=Math.min(...pool.map(blkTier)),un=pool.filter(c=>blkTier(c)==tm),top=un.map(c=>[sc(c),c]).sort((a,b)=>b[0]-a[0]).slice(0,3),pk=top[Math.floor(Math.random()*top.length)][1];
 /* paquete kit: si ya está aprobado se repasa entero; si quedó a medias, se retoma en la primera tarjeta que falta */
 return swStartBlk(pk)}
/* CONCEPTOS AL PRINCIPIO DEL PAQUETE (26/11, pedido de Luca: «tenerlos como un paquete aparte no me está funcionando; mejor que aparezcan al
   principio de cada paquete que use el concepto»). Un bloque puede llevar pk.pre = [tarjetas de concepto]: al empezarlo se juegan primero las que
   todavía no se acertaron (S2.kok), y después el bloque. Las ya acertadas se saltean, así el mismo concepto no se repite en cada paquete.
   SPRE = el bloque que espera detrás de los conceptos (para que terminar un concepto no reemplace la cola por su propio paquete). */
let SPRE=null;
function swStartBlk(pk){SPRE=null;{const PRE=(pk.pre||[]).filter(x=>!(S2.kok||{})[x.id]);if(PRE.length){SPRE=pk;SPACK=PRE.slice(1).concat([pk]);return{c:PRE[0],i:0,only:false,built:[],err:0}}}if(pk.kq&&pk.pack){const K=S2.kok=S2.kok||{},all=[pk].concat(pk.pack);if((pk.toks||[]).every(t=>(S2.bqok||{})[t]))all.forEach(x=>delete K[x.id]);else if(K[pk.id]){const pe=pk.pack.filter(x=>!K[x.id]);if(pe.length){SPACK=pe.slice(1);return{c:pe[0],i:0,only:false,built:[],err:0}}}}
 return{c:pk,i:0,only:false,built:[],err:0}}
function swNew(){NLE=null;SW=swPick();(S2.seen=S2.seen||{})[SW.c.id]=Date.now();(S2.tls=S2.tls||{})[tema(SW.c)]=Date.now();SAX="";SW.ts=Date.now();SW.ans=null;SW.cl=Math.random()<.5;swDraw()}
function swStep(){NLE=null;SW.ts=Date.now();SW.ans=null;SW.cl=Math.random()<.5;swDraw()}
const HLN={dg:"el diagrama",Tengo:"«Tengo»","▶":"el objetivo ▶",Clases:"«Clases»",Dom:"el dominio",Esc:"el enunciado"};
function ctxH(t,src,hl){const L=t.split("\n"),di=L.indexOf("Dominio:");return L.map((l,i)=>{if(hl){const on=hl=="ESC"?(di<0||i<di):(di>=0&&i>di&&new RegExp(hl).test(l));return on?`<div class="hl">${esc(l)}</div>`:`<div>${esc(l)}</div>`}const k=l.startsWith("Tengo:")?"Tengo":l.startsWith("Clases:")?"Clases":l.startsWith("▶")?"▶":"";return k&&src&&src.includes(k)?`<div class="hl">${esc(l)}</div>`:`<div>${esc(l)}</div>`}).join("")}
/* Contexto plegable: firma, «Tengo» y ▶ a la vista; «Clases» y «Dominio» desplegables (se abren solos si ahí estaba el dato). */
function bldCtx(t,src,hl){const T=t.split("\n"),H=ctxH(t,src,hl).match(/<div[^>]*>.*?<\/div>/g)||[],di=T.indexOf("Dominio:");let v="",cl="",dm="";
 T.forEach((l,i)=>{if(false)cl+=H[i];else if(di>=0&&i>=di)dm+=H[i];else v+=H[i]});
 const dt=(n,x)=>x?`<details${x.includes('class="hl"')?" open":""}><summary>${n}</summary>${x}</details>`:"";return v+dt("Clases",cl)+(dm.includes('class="hl"')?dt("Operaciones de las clases (no vienen en la letra: las diseñás vos)",dm):"")}
const bldDisp=a=>a.map((x,i)=>x.nl?"<br>":(i&&!x.g&&!a[i-1].nl?" ":"")+esc(x.t)).join("");
const blkCtx=c=>{const k=c.bk;return `<div class="lt"><b>Diagrama de la operación</b></div>`+k.before.map(x=>`<div>${esc(x)}</div>`).join("")+`<div class="gap">▢ acá va el mensaje ${esc(k.a)} con lo que cuelga de él</div>`};
/* Fichas de orden libre (fr: objetivos, saltos, mensajes del esqueleto): una ficha vale si ya están puestas sus dependencias (dp) y, en las de árbol (tree),
   si no deja abierto un mensaje con sub-mensajes sin poner. frSort deja las que faltan en un orden válido (el de la solución cuando se puede). */
const frChk=(x,pl,X)=>{const d=(x.dp||[]).find(d=>!pl.includes(d));if(d)return{d};if(!x.tree)return null;
 const T=X.filter(y=>y.tree),par=n=>n.split(".").slice(0,-1).join("."),has=n=>T.some(y=>y.n==n),P=has(par(x.n))?par(x.n):"";
 let q=(pl.filter(y=>y.tree).pop()||{}).n||"";
 while(q&&q!=P){if(T.some(y=>par(y.n)==q&&!pl.includes(y)))return{q:T.find(y=>y.n==q)};q=has(par(q))?par(q):""}
 return null};
const frSort=(X,pl)=>{const pos=[],rem=[];X.forEach((x,q)=>{if(x.fr&&!pl.includes(x)){pos.push(q);rem.push(x)}});rem.sort((a,c)=>a.o-c.o);const sim=pl.slice(),out=[];
 while(rem.length){let i=rem.findIndex(x=>!frChk(x,sim,X));if(i<0)i=0;const x=rem.splice(i,1)[0];out.push(x);sim.push(x)}pos.forEach((q,i)=>X[q]=out[i])};
/* Tarjetas «kit» (otros problemas del examen: js/examen.js y js/codigo.js): c.kq = título de la consigna, c.kp = consigna, c.kv(b) = contexto en HTML (b.hl = ids a resaltar), c.ko = regla de orden, c.ar = área del filtro. Una ficha equivocada puede traer su propia frase a resaltar (hl). */
const bldQ=c=>c.kq||(c.tra?"Traducí la letra":c.des?"Desarmá el mensaje":c.route?"Elegí el recorrido":"Armá la línea"),bldMulti=c=>!!(c.tra||c.des||c.route||c.kq);
const bsNew=c=>{const b={p:0,pl:[],used:{},ord:sh(c.bld.bank.map((_,i)=>i)),e:0,m:null,src:null,hl:null,done:false},X=c.bld.exp;if(X.some(x=>x.fr))frSort(X,[]);while(b.p<X.length&&X[b.p].auto){b.pl.push(X[b.p]);b.p++}return b};
const bldPlain=(c,ln)=>c.bld.exp.filter(x=>(x.ln||0)==ln&&!x.nl).map((x,i)=>(i&&!x.g?" ":"")+x.t).join("");
/* «Ver la línea completa»: muestra la línea esperada; cuenta UN error por tarjeta (no uno por ficha) y después «No sé» ayuda sin penalizar */
function swShow(){const u=SW;if(!u||!u.c.bld||u.ans)return;const c=u.c,b=u.bs;if(b.show)return;b.show=1;
 if(!b.e){b.e=1;SCOMBO=0;S2.box[c.id+":0"]=0;if(!c.kq)SRETRY.push({c,i:0,due:SUN+8});const ln=(c.bld.exp[b.p]||{}).ln||0;
  logA("sw",c.s,c.g,false,{q:bldQ(c),x:c.ctx,a:bldPlain(c,ln),p:"Ver la línea completa",ns:1,ms:Date.now()-(u.ts||Date.now()),rp:u.only?1:0,n:1});NLE=E1.log[E1.log.length-1];SV2()}
 swDraw()}
function swTile(i){const u=SW;if(!u||!u.c.bld||u.ans)return;const c=u.c,b=u.bs,X=c.bld.exp,ns=i<0;let e=X[b.p],SG=null;
 if(isSlot(c)&&!b.done){SG=b.sel||slFirst(c,b);if(b.sel&&X.some(x=>!x.auto&&slotOf(X,x)==SG)&&!slNext(c,b,SG)){b.m=["«"+SLN[SG]+"» ya está completo","Tocá otro casillero para seguir."];b.sel=slFirst(c,b);swDraw();return}/* casillero ya completo: aviso, sin error */const t1=i>=0?c.bld.bank[i]:null,nx=(t1&&X.find(x=>!x.auto&&!b.pl.includes(x)&&slotOf(X,x)==SG&&x.t==t1.t))||slNext(c,b,SG);/* dentro del casillero, cualquier orden */
  if(nx)e=nx;else if(SG){const why="Este mensaje no lleva "+SLN[SG]+(SG=="c"?": se envía siempre, sin condición.":SG=="r"?": su resultado no se usa después, así que no se guarda en una variable.":".");
   if(ns){b.m=["No va nada en «"+SLN[SG]+"»",why];b.sel=slFirst(c,b);swDraw();return}
   const t0=c.bld.bank[i];b.e++;SCOMBO=0;S2.box[c.id+":0"]=0;cpCount(cpOf(c,null,SG),false);
   logA("sw",c.s,c.g,false,{q:bldQ(c),x:c.ctx,a:"(nada en "+SLN[SG]+")",p:"["+t0.t+"] en "+SLN[SG],ms:Date.now()-(u.ts||Date.now()),rp:u.only?1:0,n:1,cp:cpOf(c,null,SG)});NLE=E1.log[E1.log.length-1];
   b.m=[(/^«/.test(t0.t)?t0.t:"«"+t0.t+"»")+" no va: "+SLN[SG],why];b.sel=slFirst(c,b);SV2();swDraw();return}}
 if(ns)i=c.bld.bank.findIndex((t,j)=>!b.used[j]&&t.t==e.t&&(t.ln==null||t.ln==e.ln));else if(b.used[i])return;
 const t=c.bld.bank[i],k=c.id+":0";
 /* el número del mensaje se puede poner en cualquier momento (solo puede ir al frente del mensaje): si se toca antes, queda puesto y después se saltea */
 if(!ns&&e.k!="n"&&/^\d[\d.]*\*?:$/.test(t.t)){const nt=X.find((x,q)=>q>b.p&&x.k=="n"&&!b.pl.includes(x));
  if(nt&&nt.t==t.t){b.used[i]=1;b.pl.unshift(nt);b.m=null;b.src=null;b.hl=null;SV2();swDraw();return}if(nt)e=nt}
 if(!ns&&e.fr&&t.t!=e.t){const j=X.findIndex((x,q)=>q>b.p&&x.fr&&x.t==t.t&&!frChk(x,b.pl,X));if(j>=0){X[b.p]=X[j];X[j]=e;e=X[b.p]}}
 if((t.t!=e.t||ns)&&!(ns&&b.show)){const ph=b.pl.map((x,i)=>(i&&!x.g?" ":"")+x.t).join("");b.e++;SCOMBO=0;S2.box[k]=0;
  if(b.e==1&&!c.kq)SRETRY.push({c,i:0,due:SUN+8});
  cpCount(cpOf(c,e,SG),false);logA("sw",c.s,c.g,false,{q:bldQ(c),x:c.ctx,a:(ph+" ["+e.t+"]").trim(),p:ns?"No sé":(ph+" ["+t.t+"]").trim(),ns:ns?1:0,ms:Date.now()-(u.ts||Date.now()),rp:u.only?1:0,n:1,cp:cpOf(c,e,SG)});
  NLE=E1.log[E1.log.length-1];
  b.teo=ns?({rt:"Camino al receptor",n:"Numeración de mensajes",o:"Notación de objetos",r:"Guardar el resultado",m:"Operaciones genéricas y del dominio",p:"Parámetros de un mensaje",c:"Condiciones [ ]"}[e.k]||""):"";b.m=ns?["Era «"+e.t+"»",bldLead(e)+(e.w||"")]:[(t.t==":"?"Ese «:» no va acá.":(/^«/.test(t.t)?t.t:"«"+t.t+"»")+" no va acá."),bldWhy(e,t)];b.o=bldOrd(e,b);b.kth=!ns?"":c.kq?(c.th||""):c.tra?KTH.tra:c.des?KTH.des:"";b.ktm=ns?tema(c):"";b.src=e.src||null;b.hl=(!ns&&t.hl)||e.hl||(e.ob&&typeof letraIds=="function"?"S:"+letraIds(c,e.ob).join(","):null);try{navigator.vibrate&&navigator.vibrate(30)}catch(_){}
  if(!ns){SV2();swDraw();return}}
 else{b.m=null;b.src=null;b.hl=null;if(!ns)cpCount(cpOf(c,e,SG),true)}
 b.used[i]=1;b.pl.push(e);
 if(isSlot(c)){X.forEach(x=>{if(x.auto&&!b.pl.includes(x))b.pl.push(x)});b.pl.sort((p,q)=>X.indexOf(p)-X.indexOf(q));b.p=X.findIndex(x=>!b.pl.includes(x));if(b.p<0)b.p=X.length;if(!slNext(c,b,b.sel))b.sel=slFirst(c,b)}
 else{b.p++;if(e.fr)frSort(X,b.pl);while(b.p<X.length&&(X[b.p].auto||b.pl.includes(X[b.p]))){if(!b.pl.includes(X[b.p]))b.pl.push(X[b.p]);b.p++}}
 if(b.p>=X.length){b.done=true;(S2.cf=S2.cf||{})[c.id]=1;/* tarjeta terminada (con o sin errores): cuenta para la meta */if(c.kq)PKF[(c.pk||c).id]=SUN;{const own=c.pk||c;if(b.e||c.tErr)BST()[own.id]=2;else if(!c.pk&&!(c.pack&&c.pack.length)&&!c.then)BST()[c.id]=1}{const tk=ts=>{S2.bqok=S2.bqok||{};ts.forEach(t=>S2.bqok[t]=1)},adv=cc=>{const n=cc.next;if(n&&(n.req||[]).every(t=>S2.bqok[t]||(typeof TOKSEED=="function"&&TOKSEED(t))))SPACK.push(n)};if(c.kq){const own=c.pk||c,K=S2.kok=S2.kok||{};if(b.e)delete K[c.id];else K[c.id]=1;if(!c.pk&&(!SPRE||c===SPRE)){SPACK=(c.pack||[]).filter(x=>!K[x.id]);SPRE=null}if(!SPACK.some(x=>x.pk===own)&&[own].concat(own.pack||[]).every(x=>K[x.id])){tk(own.toks||[]);BST()[own.id]=1;adv(own)}}else if(c.then){c.then.tErr=b.e>0;SPACK=[c.then]}else if(c.pack&&c.pack.length){SPACK=c.pack.slice();SPK={rc:c,left:c.pack.length,bad:b.e>0||!!c.tErr}}else if(c.pk&&SPK&&SPK.rc===c.pk){SPK.left--;if(b.e)SPK.bad=1;if(SPK.left<=0&&!SPK.bad){tk(c.pk.toks||[]);BST()[c.pk.id]=1;adv(c.pk)}}else if(c.toks&&!b.e&&!c.tErr){tk(c.toks);adv(c)}}u.ans=b.e?"no":"ok";S2.n++;SUN++;
  if(!b.e){logA("sw",c.s,c.g,true,{});S2.ok++;S2.today++;SCOMBO++;if(SCOMBO>S2.best)S2.best=SCOMBO;S2.xp+=1+(SCOMBO%5==0?2:0)+2;S2.box[k]=Date.now()-(u.ts||0)>90000?(S2.box[k]||0):Math.min(4,(S2.box[k]||0)+1);STM=setTimeout(swAdvance,900)}}
 SV2();swDraw()}
/* Regla según lo que se tocó y lo que correspondía */
/* CASILLEROS (pedido de Luca, 23/11: «sería mejor para los diagramas de comunicación que yo primero seleccione el lugar que quiero llenar»): en una
   línea de comunicación se ve el esquema completo del mensaje como en el examen y se toca primero el casillero y después la ficha; así el ORDEN en
   que se llena no cuenta como error («en un escenario real da igual si escribí el número primero»). Sin casillero elegido, se llena el siguiente vacío.
   [condición] y var := se ven SIEMPRE (aunque el mensaje no los lleve), para no adelantar si van; poner algo en uno que no va es un error de ese
   concepto. Cada ficha (bien o mal) se cuenta por CONCEPTO en E1.cp (pestaña Errores: «Conceptos flojos»). */
const SLOTS=[["f","origen"],["t","destino"],["n","nº"],["c","[condición]"],["r","var :="],["m","operación"],["p","(parámetros)"],["s","«estereotipo»"]],SLN=Object.fromEntries(SLOTS);
const isSlot=c=>!!(c&&c.dg&&c.bld&&!bldMulti(c));
const slotOf=(X,x)=>{if(!x||x.auto)return null;if(x.k=="o"){const a=X.findIndex(y=>y.auto&&y.t=="→");return X.indexOf(x)<a?"f":"t"}return x.k};
const slNext=(c,b,g)=>c.bld.exp.find(x=>!x.auto&&!b.pl.includes(x)&&slotOf(c.bld.exp,x)==g);
const slFirst=(c,b)=>{const x=c.bld.exp.find(y=>!y.auto&&!b.pl.includes(y));return x?slotOf(c.bld.exp,x):null};
function slotHtml(c,b){const X=c.bld.exp,sel=b.done?null:(b.sel||slFirst(c,b));
 return`<div class="row" style="gap:4px;flex-wrap:wrap;align-items:center">`+SLOTS.map(([g,lb])=>{const has=X.some(x=>!x.auto&&slotOf(X,x)==g),put=X.filter(x=>!x.auto&&slotOf(X,x)==g&&b.pl.includes(x));
  if(b.done&&!has)return"";const full=has&&!slNext(c,b,g),txt=put.map((x,i)=>(i&&!x.g?" ":"")+esc(x.t)).join("");
  return(g=="t"?'<span class="mut">→</span>':g=="n"?'<span class="mut">｜</span>':"")+`<button class="btn chip${g==sel?" sel":""}" data-w="sl" data-v="${g}"${b.done?" disabled":""} style="font-family:var(--m);${full?"border-style:solid":"border-style:dashed"}">${txt||'<span class="mut">'+esc(lb)+'</span>'}${txt&&!full?' <span class="mut">…</span>':""}</button>`}).join("")+`</div>`}
/* CONCEPTO de una ficha: tema + qué se decide en ese lugar (no la tarjeta) */
const TMN={md:"Modelo de dominio",dss:"DSS",com:"Comunicación",dcd:"DCD",p3:"Código C++",lg1:"Lógica · inducción",lg2:"Lógica · semántica",lg3:"Lógica · deducción",lg4:"Lógica · modelos",lg5:"Lógica · tableaux"};
const CPN={f:"objeto de origen",t:"receptor (destino)",n:"numeración",c:"condición",r:"guardar el resultado (var :=)",m:"operación (genérica o propia)",p:"parámetros",s:"estereotipo",
 ob:"objetivos (traducir la letra)",rt:"recorrido (qué flechas)",ds:"desarmar en mensajes",at:"atributos",cx:"atributo o asociación",par:"herencia",sub:"subclases",abs:"abstracta",st:"enum o DataType",v:"valores del tipo",
 B:"la otra clase de la asociación",ma:"multiplicidad",mb:"multiplicidad",ord:"orden {ordered}",ac:"clase de asociación",fa:"fragmentos (loop/alt/opt)",fb:"fragmentos (loop/alt/opt)",g:"guarda del fragmento",d:"qué hace el actor",nt:"nota de memoria"};
const cpOf=(c,e,g)=>{const T=TMN[tema(c)]||tema(c),k=g||(isSlot(c)?slotOf(c.bld.exp,e):(e&&(e.r||e.k)));let n=CPN[k];
 if(!n&&e&&e.sn)n=String(e.sn).replace(/«[^»]*»/g,"").replace(/ (de|del lado de) \S+$/,"").trim();if(!n)n=(c.kq||bldQ(c)).replace(/ · .*$/,"");return T+" · "+n};
const cpCount=(cp,ok)=>{const C=E1.cp||(E1.cp={}),v=C[cp]||(C[cp]=[0,0]);v[1]++;if(ok)v[0]++};
function bldWhy(e,t){const x=t.t,r=e.t;
 if(e.sl)return t.sl&&t.sl!=e.sl?"Todavía no: ahora va "+e.sn+".":t.why||("No es eso. "+(e.w||""));
 if(e.fr){if(t.why)return t.why;const b=SW.bs,X=SW.c.bld.exp,y=X.find((y,q)=>q>b.p&&y.fr&&y.t==x),v=y&&frChk(y,b.pl,X);
  if(v&&v.d)return"Todavía no: antes hace falta «"+v.d.t+"»"+(({ob:" (ese objetivo usa lo que se consigue ahí).",rt:" (ese salto sale de un objeto al que todavía no llegaste).",ds:" (ese mensaje cuelga de él o usa su resultado)."})[e.k]||".");
  if(v&&v.q)return"Todavía no: «"+v.q.t+"» sigue abierto; primero van los mensajes que cuelgan de él.";
  return({ob:"«"+x+"» no sale de la letra de esta operación.",rt:"«"+x+"» no forma parte del recorrido de este tramo: lo que pide la letra se resuelve sin pasar por ahí.",ds:"«"+x+"» no es un mensaje de este tramo."})[e.k]||"«"+x+"» no va en esta respuesta."}
 if(x==":"&&e.k!="o")return"Los dos puntos solo van en un objeto: :Clase (anónimo) o nombre:Clase (primera aparición). Acá no hay un objeto por abrir.";
 if(r==":"&&x!=":")return(e.g?"Primera aparición con nombre: nombre:Clase, hay que escribir los dos puntos.":"Objeto anónimo: se escribe :Clase. Falta el «:» delante de la clase.");
 if(x==":"&&e.nm)return"Este objeto ya lo tengo (figura en «Tengo»): se escribe solo su nombre, sin «:». Los dos puntos van en objetos anónimos (:Clase) o en la primera aparición (nombre:Clase).";
 if(x=="*")return"El * solo va cuando el receptor es la colección (mensajes find/next sobre la colección). Acá no.";
 if(r=="*")return e.w;
 if(/ =$/.test(x))return"El resultado se guarda con «:=», no con «=».";
 if(/ :=$/.test(x))return e.k=="r"?e.w:(SW.c.bld.exp.some(y=>y.k=="r")?"La variable va justo antes de la operación; todavía no toca.":"Acá no se guarda nada: el resultado de este mensaje no se usa después.");
 if(e.k=="o"&&e.g&&x!=":"&&r!=x&&bldIsCls(x))return"Primera aparición con nombre: primero el nombre del objeto, después «:» y recién ahí la clase.";
 return bldLead(e)+(e.w||"")}
const bldLead=e=>e.sl?"Ahora va "+e.sn+": ":({ob:"Un objetivo que ya se puede cumplir con lo que hay: ",rt:"Un salto que ya se puede dar: ",ds:"Un mensaje que ya se puede mandar: ",n:"El número del mensaje (se puede poner en cualquier momento). Lo define quién ENVÍA el mensaje (el objeto que está ejecutando esa operación), no el último que recibió: si sigue siendo el mismo, continúa la secuencia (n+1); si es el receptor de un mensaje k, empieza k.1. ",o:"Primero se dibuja la flecha: objeto de origen → objeto de destino. ",c:"Ahora va la condición, entre corchetes. ",r:"Antes de la operación va la ficha «variable :=»: este mensaje devuelve algo que se usa después (como receptor, parámetro, condición o retorno), así que se guarda. El nombre de la variable es libre. ",m:"Ahora va la operación. ",p:"Ahora van los parámetros: los datos que la operación necesita y el receptor no tiene (salen de «Tengo»). ",s:"Falta el estereotipo. "})[e.k]||"";
/* Orden fijo de una línea, con el lugar actual en negrita (se muestra solo tras un error) */
const bldOrd=(e,b)=>{if(SW&&SW.c.kq)return esc(SW.c.ko||(e.fr?"El orden es libre: hay que elegir todas las que van y ninguna de las que no.":""));if(e.fr)return({ob:"El orden es libre mientras cada objetivo tenga antes lo que necesita (primero los objetos, después lo que se hace con ellos).",rt:"El orden es libre mientras cada salto salga de un objeto al que ya llegaste; cada salto necesita una flecha A → B (con * si B es una colección).",ds:"El orden es libre mientras cada mensaje tenga antes lo que usa; los sub-mensajes van a continuación del mensaje del que cuelgan."})[e.k];const k=e.k=="o"?(b.pl.some(x=>x.k=="a")?"t":"f"):e.k;return"Orden: "+[["f","origen"],["a","→"],["t","destino"],["n","｜ nº:"],["c","[condición]"],["r","var :="],["m","operación"],["p","(parámetros)"],["s","«estereotipo»"]].map(([q,t])=>q==k?"<b>"+esc(t)+"</b>":esc(t)).join(" ")};
const bldIsCls=x=>/^[A-Z]/.test(x);
/* «No sé» → explicación teórica del tema de ESA pregunta, en la misma tarjeta (THT en prog4.js/logica.js: {re, t, p}; se busca en pregunta+respuesta, después título y contexto) */
function swTeo(c,s){const T=(window.THT||[]).filter(x=>x.s==c.s),q=s.q+" "+s.a,o=T.find(x=>x.re.test(q))||T.find(x=>x.re.test(c.g))||T.find(x=>x.re.test(s.x||c.ctx||""));
 const th=s.th||((c.steps||[])[0]||{}).th;/* bqNS (Bloques) llama sin steps */if(!o&&!th)return"";return`<div class="th" style="margin-top:10px"><b>📘 ${esc(o?o.t:"Teoría")}</b>${th?`<div style="margin-top:4px">${esc(th)}</div>`:""}${o?o.p.map(x=>`<div style="margin-top:6px">${esc(x)}</div>`).join(""):""}</div>`}
/* META DIARIA Y RACHA (pedido de Luca, 18/11: «tengo que adquirir todos los conocimientos de la web en 2 semanas, poneme una meta diaria y una racha como tiktok»).
   Unidad = bloque de Principal (paquete, serie o árbol; sin líneas sueltas, ocultas ni Básico). Un bloque cuenta cuando queda TERMINADO, con o sin errores
   (S2.bst con estado; pedido de Luca, 18/11: «si sale todo sin errar no estoy aprendiendo»; los errores ya lo hacen volver como repaso).
   Meta del día (19/11, pedido de Luca) = bloques sin terminar AHORA / días que faltan hasta META_FIN (30/11), redondeado hacia arriba. No queda
   fija en el día: se recalcula en el momento. Si un día no llegás, lo que faltó se reparte entre los días que quedan. Estudiar más allá no tiene tope.
   CONTADORES (pedido 18/11): «Hoy x/meta» y «Total x/105». Terminado = el bloque tiene estado en S2.bst, o (progreso de antes del 17/11, sin estado)
   lo abriste y acertaste todos sus pasos alguna vez. Cada bloque terminado guarda su día en S2.mt.fd; al estrenar esto, los que ya estaban terminados
   toman el día en que se vieron por última vez (S2.seen), así lo de hoy cuenta para hoy. Meta del día: ver arriba (sin terminar / días que faltan). Racha 🔥 = días seguidos cumpliendo la meta; si hoy todavía no la cumpliste, la racha sigue viva pero gris («en riesgo») hasta medianoche, como en TikTok. Se guarda en S2.mt (localStorage "sw1"). */
const META_FIN="2026-12-03";/* 26/11, pedido de Luca: «no voy a dar P4 en este período; la meta diaria solo con las de Lógica» → plazo = día antes del examen de Lógica (4/12). P4 se sigue estudiando para febrero: se ve aparte, sin meta. *//* plazo (19/11, pedido de Luca: al 30 de noviembre; exámenes: Lógica 4/12, Prog4 5/12); cambiar acá para mover el plazo */
const mtBlq=()=>{const bas=c=>!!c.arch||(c.s=="p4"&&!c.bld&&!c.dg&&area(c)=="com");return SWC.filter(c=>!c.pk&&!c.hid&&!c.ln&&!bas(c))};
const dAdd=(t,n)=>{const d=new Date(t+"T12:00:00");d.setDate(d.getDate()+n);return d.toLocaleDateString("en-CA")};
let MTCEL=0;
/* POR TARJETAS (pedido de Luca, 22/11: «el tamaño de los paquetes es muy dispar y contar así no da una imagen precisa del progreso»): la meta y los
   contadores cuentan TARJETAS de Principal (cada tarjeta de un paquete, cada serie, cada árbol), no bloques. Tarjeta terminada = S2.cf[id] (se marca al
   terminarla, con o sin errores). Lo de antes del 22/11 se deduce: acertada (kok), todos sus pasos acertados alguna vez, o respondida dentro de un
   paquete que ya tiene estado. El código de progreso sigue siendo por bloque (para que sea corto) y al importarlo marca todas las tarjetas del bloque. */
const mtCards=()=>{const bas=c=>!!c.arch||(c.s=="p4"&&!c.bld&&!c.dg&&area(c)=="com");return SWC.filter(c=>!c.hid&&(!c.ln||c.pk)&&!bas(c))};/* los miembros de un paquete llevan ln y pk: cuentan */
const mtFinC=c=>{if((S2.cf||{})[c.id]||(S2.kok||{})[c.id])return true;const B=BST(),own=c.pk||c,st=B[own.id]||(own.then&&B[own.then.id]);
 if(c.steps.every((_,i)=>swBox(c,i)>0))return!!(S2.seen||{})[c.id];return!!st&&!!(S2.seen||{})[c.id]&&c.steps.every((_,i)=>(c.id+":"+i) in S2.box)};
const pcCardsOf=c=>{const r=[c].concat(c.pack||[]);let t=c.then;while(t&&!r.includes(t)){r.push(t);t=t.then}return r};
const mtFin=c=>{const B=BST();if(B[c.id]||(c.then&&B[c.then.id]))return true;return!!(S2.seen||{})[c.id]&&c.steps.every((_,i)=>swBox(c,i)>0)};
/* CÓDIGO DE PROGRESO (idea de Luca, 22/11): pasar el progreso entre dispositivos sin token, copiando un código. Cada bloque de Principal (mtBlq, en
   orden de id fijo) ocupa 2 bits: 00 = sin ver, 01 = terminado con errores, 11 = terminado sin errores. El código es «P-versión-hexa». Combinar = OR
   bit a bit (sin acarreo): lo terminado en cualquiera de los dos queda terminado, y «sin errores» le gana a «con errores» (01|11 = 11; nunca sale 10).
   La versión es un hash de la lista de bloques: si los dos dispositivos tienen versiones distintas del sitio, no se mezcla (se pide recargar).
   Los bloques que llegan por código cuentan en «Total» pero no en «Hoy» (fd = "importado"). Solo lleva qué bloques están terminados: los repasos
   finos, los errores y las notas viajan con la sincronización por GitHub. */
const PCB=()=>mtBlq().slice().sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0),PCV=L=>hs(L.map(c=>c.id).join(",")).slice(0,4);
const pcVal=c=>{const B=BST(),b=B[c.id]||(c.then&&B[c.then.id]);return b==1?3:b||mtFin(c)?1:0};
/* CÓDIGO CORTO (pedido de Luca, 22/11: «un código más corto que podamos copiar a mano, usando letras»): base32 Crockford (0-9 y letras sin I, L, O, U;
   sin distinguir mayúsculas), 1 BIT por bloque (terminado o no: 105 bloques = 21 caracteres) + 2 de versión + 1 de control (detecta una letra mal
   copiada), en grupos de 4: «VVxx-xxxx-…-xxxC». Combinar = OR. Lo que llega por código entra como «terminado con errores» (vuelve una vez como repaso)
   salvo que este dispositivo ya lo tuviera sin errores. Al pegar se aceptan O por 0, I/L por 1, guiones y espacios. Los códigos viejos «P-…» (hexa,
   2 bits por bloque) se siguen aceptando. */
const C32="0123456789ABCDEFGHJKMNPQRSTVWXYZ",c32n=s=>String(s).toUpperCase().replace(/[\s-]/g,"").replace(/O/g,"0").replace(/[IL]/g,"1");
const pcVer=L=>{const h=parseInt(hs(L.map(c=>c.id).join(",")),36)>>>0;return C32[h&31]+C32[(h>>5)&31]};
function pcExport(){if(SWM!=3)swMode(3);const L=PCB(),bits=L.map(c=>pcVal(c)?1:0);let p="";
 for(let i=0;i<bits.length;i+=5){let v=0;for(let j=0;j<5;j++)v=v*2+(bits[i+j]||0);p+=C32[v]}
 const body=pcVer(L)+p,ck=C32[[...body].reduce((a,ch,i)=>a+C32.indexOf(ch)*(i+1),0)%32];return(body+ck).match(/.{1,4}/g).join("-")}
function pcImport(code){if(SWM!=3)swMode(3);if(/^\s*P-/i.test(code))return pcImportHex(code);
 const t=c32n(code);if(!t||[...t].some(ch=>C32.indexOf(ch)<0))return"Ese texto no es un código de progreso (solo números y letras, sin I, L, O ni U).";
 const L=PCB(),need=2+Math.ceil(L.length/5)+1;if(t.length!=need)return"El código tiene "+t.length+" caracteres y deberían ser "+need+". Revisá que esté completo.";
 const body=t.slice(0,-1);if(C32[[...body].reduce((a,ch,i)=>a+C32.indexOf(ch)*(i+1),0)%32]!=t.slice(-1))return"Alguna letra quedó mal copiada (no coincide el control). Revisalo y probá de nuevo.";
 if(body.slice(0,2)!=pcVer(L))return"Este código es de otra versión del sitio. Recargá la página en los dos dispositivos y copiá el código de nuevo.";
 const P=body.slice(2),B=BST(),M=S2.mt||(S2.mt={rd:{}}),FD=M.fd||(M.fd={}),SE=S2.seen||(S2.seen={});let n=0;
 L.forEach((c,i)=>{const v=C32.indexOf(P[Math.floor(i/5)]),bit=(v>>(4-i%5))&1;if(!bit||pcVal(c))return;B[c.id]=2;pcCardsOf(c).forEach(x=>{(S2.cf=S2.cf||{})[x.id]=1;if(!SE[x.id])SE[x.id]=1;if(!FD[x.id])FD[x.id]="importado"});n++});
 SV2();return n?"Listo: "+(n==1?"se sumó 1 bloque":"se sumaron "+n+" bloques")+" del otro dispositivo.":"No había nada nuevo: este dispositivo ya tenía todo lo de ese código."}
function pcImportHex(code){const m=/^P-([0-9a-z]{1,4})-([0-9a-f]+)$/i.exec(String(code).trim().replace(/\s/g,""));if(!m)return"Ese texto no es un código de progreso.";
 const L=PCB();if(m[1]!=PCV(L))return"Este código es de otra versión del sitio. Recargá la página en los dos dispositivos y copiá el código de nuevo.";
 const h=m[2].toLowerCase(),B=BST(),M=S2.mt||(S2.mt={rd:{}}),FD=M.fd||(M.fd={}),SE=S2.seen||(S2.seen={});let n=0;
 L.forEach((c,i)=>{const d=parseInt(h[i>>1]||"0",16),inc=i%2?d&3:d>>2,loc=pcVal(c),nv=inc|loc;if(nv==loc)return;
  B[c.id]=nv==3?1:2;pcCardsOf(c).forEach(x=>{(S2.cf=S2.cf||{})[x.id]=1;if(!SE[x.id])SE[x.id]=1;if(!FD[x.id])FD[x.id]="importado"});n++});
 SV2();return n?"Listo: "+(n==1?"se sumó 1 bloque":"se sumaron "+n+" bloques")+" del otro dispositivo.":"No había nada nuevo: este dispositivo ya tenía todo lo de ese código."}
function mtHoy(){if(SWM!=3)return null;const t=TD(),M=S2.mt||(S2.mt={rd:{}}),FD=M.fd||(M.fd={}),SE=S2.seen||{},L=mtCards();let ch=0;
 L.forEach(c=>{if(!FD[c.id]&&mtFinC(c)){FD[c.id]=M.v==3||!SE[c.id]?t:new Date(SE[c.id]).toLocaleDateString("en-CA");ch=1}});if(M.v!=3){M.v=3;ch=1}
 const LM=L.filter(c=>c.s=="lg"),tot=LM.length,fin=LM.filter(c=>FD[c.id]).length,done=LM.filter(c=>FD[c.id]==t).length,dl=Math.max(1,Math.round((new Date(META_FIN+"T12:00:00")-new Date(t+"T12:00:00"))/864e5)),goal=Math.ceil((tot-fin)/dl);/* 19/11, pedido de Luca: meta = lo que falta terminar AHORA / días que faltan al 1/12 (se recalcula al momento, no queda fija en el día) */
 if(done>=goal&&!M.rd[t]){M.rd[t]=1;MTCEL=1;ch=1}if(ch)SV2();
 let k=0,d=M.rd[t]?t:dAdd(t,-1);while(M.rd[d]){k++;d=dAdd(d,-1)}
 return{done,goal,ok:!!M.rd[t],stk:k,fin,tot,dl}}
/* 26/11: la meta y los contadores «Hoy»/«Total» cuentan solo Lógica (c.s=="lg"); esta línea muestra Prog4 aparte, sin meta. */
const LG_FIN="2026-12-03";
function lgBar(bar){const FD=(S2.mt||{}).fd||{},L=mtCards().filter(c=>c.s=="p4");if(!L.length)return"";const fin=L.filter(c=>FD[c.id]).length;
 return`<div class="row mut" style="margin-top:6px;gap:10px;font-size:12px"><span style="white-space:nowrap">Prog4 (para febrero, sin meta)</span>${bar(fin,L.length)}<span style="white-space:nowrap">${fin}/${L.length}</span></div>`}
function mtBar(){const m=mtHoy();if(!m)return"";const bar=(x,n)=>`<div class="pb" style="flex:1"><i style="width:${n?Math.min(100,x/n*100):100}%"></i></div>`;
 if(MTCEL){MTCEL=0;setTimeout(()=>{const x=document.createElement("div");x.className="card";x.style.cssText="position:fixed;left:50%;top:20px;transform:translateX(-50%);z-index:60;text-align:center;font-size:18px;box-shadow:0 4px 20px rgba(0,0,0,.3)";x.innerHTML=`🔥 <b>¡Meta de hoy cumplida!</b><br>Racha: ${m.stk} ${m.stk==1?"día":"días"}`;document.body.appendChild(x);try{navigator.vibrate&&navigator.vibrate([40,60,40])}catch(_){}setTimeout(()=>x.remove(),3500)},50)}
 return`<div class="row" style="margin-top:8px;gap:10px"><b title="Racha: días seguidos cumpliendo la meta" style="font-size:20px;white-space:nowrap;${m.ok?"":"filter:grayscale(1);opacity:.55"}">🔥 ${m.stk}</b><span class="mut" style="width:42px">Hoy</span>${bar(m.done,m.goal)}<b class="cnt" style="white-space:nowrap">${m.done}/${m.goal}</b></div>`+
 `<div class="row" style="margin-top:4px;gap:10px"><span style="width:${String(m.stk).length*11+30}px"></span><span class="mut" style="width:42px">Lógica</span>${bar(m.fin,m.tot)}<b class="cnt" style="white-space:nowrap">${m.fin}/${m.tot}</b></div>`+
 lgBar(bar)+`<div class="mut" style="font-size:12px;margin-top:2px">${m.ok?"Meta de hoy cumplida ✓ (podés seguir sin tope)":m.stk?"Racha en riesgo: cumplí la meta antes de medianoche":"Cumplí la meta de hoy para arrancar la racha"} · faltan ${m.tot-m.fin} sin terminar ÷ ${m.dl} ${m.dl==1?"día":"días"} hasta el 3/12 (Lógica) = ${m.goal} por día</div>`}
function swDraw(){const u=SW,c=u.c,lv=Math.floor(S2.ok/25)+1,pr=S2.ok%25;
 let h=`<div class="s-${c.s}">${TAB==7?`<div class="lbl" style="margin-bottom:6px"><b>Básico</b> · teoría en tarjetas binarias</div>`:""}<div class="row"><b class="sj">Nivel ${lv}</b><div class="pb"><i style="width:${pr/25*100}%"></i></div><span class="mut cnt">${pr}/25</span></div>`+
 (TAB==3?mtBar():"")+`<div class="row between mut" style="margin-top:6px"><span>Seguidas ${SCOMBO}</span><span>Mejor ${S2.best}</span><span>Hoy ${S2.today}</span></div>`+
 (TAB==7?"":swFiltHTML());
 if(u.recap){h+=`<div class="card"><h2>Serie completa</h2>${swDg(c,0,1)}<p style="margin:0">${u.err?u.err+(u.err==1?" error":" errores")+": esas decisiones vuelven en un rato.":"Sin errores: +"+u.bonus+" XP."}</p>${c.out?`<div class="lbl" style="margin-top:10px">Así queda armado</div><div class="sn">${esc(c.out)}</div>`:""}<button class="btn pri big" data-w="go">Siguiente</button></div></div>`;V.innerHTML=h;return}
/* Tarjeta «Árbol · …»: arma un árbol corto de Bloques adentro de la tarjeta (bloques.js, bqEmbed) */
 if(c.bqx){if(!u.bqd){h+=`<div class="swc"><div class="lbl"><b class="sj">Lógica</b> · ${u.only?"repaso · ":""}armá el árbol</div><div id="bqemb"></div></div></div>`;V.innerHTML=h;
   BQ.bqEmbed(c.bqx,$("bqemb"),(err,ns,th)=>{u.bqd=1;(S2.cf=S2.cf||{})[c.id]=1;u.bqe=err;u.bqh=th||"";u.ans=err?"no":"ok";S2.n++;SUN++;const k=c.id+":0";
    BST()[c.id]=err?2:1;if(!err){(S2.bqok=S2.bqok||{})[c.bqx]=1;logA("sw",c.s,c.g,true,{});S2.ok++;S2.today++;SCOMBO++;if(SCOMBO>S2.best)S2.best=SCOMBO;S2.xp+=3;S2.box[k]=Math.min(4,(S2.box[k]||0)+1);STM=setTimeout(swAdvance,3500)}
    else{SCOMBO=0;S2.box[k]=0;SRETRY.push({c,i:0,due:SUN+8});logA("sw",c.s,c.g,false,{q:"Armá el árbol",x:c.bqx,a:"árbol completo sin errores",p:err+(err==1?" error":" errores")+(ns?" ("+ns+" «No sé»)":""),ns:ns?1:0,n:1})}
    NLE=E1.log[E1.log.length-1];SV2();swDraw()});return}
  h+=`<div class="swc"><div class="lbl"><b class="sj">Lógica</b> · ${esc(c.g)}</div>${u.bqh||""}<div class="fb ${u.bqe?"no":"ok"}"><b>${u.bqe?u.bqe+(u.bqe==1?" error":" errores")+": este árbol vuelve en un rato.":"¡Árbol completo sin errores!"}</b></div><button class="btn pri big" data-w="go">Continuar</button>${u.bqe?noteBox():""}</div></div>`;V.innerHTML=h;return}
/* Armador de fichas (líneas de comunicación): se elige cada ficha en orden; la correcta se acepta, la equivocada muestra la regla. */
 if(c.bld){const b=u.bs||(u.bs=bsNew(c)),bk=c.bld.bank,ln=b.done?0:(c.bld.exp[b.p]||{}).ln||0;
  h+=`<div class="swc" id="swc"><div class="lbl"><b class="sj">${SUBJ[c.s].n}</b> · ${esc(c.g)}${u.only?" · repaso":""}${bldMulti(c)?"":" · armá la línea"}</div>`+
  `<div class="sn">${((()=>{const t=c.ctx;return c.kv?c.kv(b):(typeof letraHtml!="undefined"&&letraHtml(c,t,b.hl,b.src))||bldCtx(t,b.src,b.hl)})())+(c.bk&&c.bk.before.length?`<details><summary>Diagrama hasta ahora</summary>${blkCtx(c)}</details>`:"")+(!bldMulti(c)&&c.dg&&c.dg.cur&&!/^(find|next|create|add|remove|destroy|getInstance)$/.test(c.dg.cur.op)?`<div class="lt mut">Este mensaje usa una operación propia (la diseñás vos; el nombre es libre). Acá se llama <b>${esc(c.dg.cur.op)}</b>.</div>`:"")+(c.des?`<div class="lt mut">find, next, create, add, remove y destroy son las genéricas. «Operación propia» = una que diseñás vos para pedirle eso a ese objeto.</div>`:"")}</div>${bldMulti(c)?"":swDg(c,0,b.done)}<div class="qt">${c.kp?esc(c.kp):c.tra?"Mirá la letra: ¿qué tiene que conseguir o hacer el sistema?":c.des?"Desarmá el tramo en mensajes: ¿quién le pide qué a quién?":c.route?"¿Qué flechas hacen falta? Elegí los saltos (de qué objeto a cuál)":"Armá la línea con las fichas"}</div>`+
  `<div class="bpl${b.done?" fin":""}">${isSlot(c)?slotHtml(c,b):c.kd?c.kd(b.pl,b.done?null:c.bld.exp[b.p]):b.pl.length?bldDisp(b.pl):'<span class="mut">tocá las fichas en orden…</span>'}</div>`+
  (b.m?`<div class="fb no"><b>${esc(b.m[0])}</b><div>${esc(b.m[1])}</div><div class="mut" style="margin-top:6px">${b.o||""}</div>${(()=>{const o=b.teo&&(window.THT||[]).find(x=>x.t==b.teo);return o?`<div class="th" style="margin-top:10px"><b>📘 ${esc(o.t)}</b>${o.p.map(x=>`<div style="margin-top:6px">${esc(x)}</div>`).join("")}</div>`:""})()}${b.kth?`<div class="th" style="margin-top:10px"><b>📘 Teoría</b><div style="margin-top:4px">${esc(b.kth)}</div></div>`:""}${b.ktm&&window.TEMATEO?TEMATEO(b.ktm):""}${b.src?`<div class="mut" style="margin-top:4px">👀 Estaba en: ${b.src.map(k=>HLN[k]).join(" y ")} (marcado arriba)</div>`:""}</div>`:"")+
  (b.show&&!b.done?`<div class="fb"><b>${bldMulti(c)?"Respuesta":"Línea completa"}</b><div class="sn">${c.kd?c.kd(c.bld.exp.filter(x=>!x.nl),null):bldMulti(c)?bldDisp(c.bld.exp):esc(bldPlain(c,ln))}</div></div>`:"")+(b.done?`<div class="fb ${b.e?"no":"ok"}"><b>${b.e?b.e+(b.e==1?" error":" errores")+": "+(bldMulti(c)?"esta tarjeta":"esta línea")+" vuelve en un rato.":(bldMulti(c)?"Correcto":"Línea correcta")}</b></div>${b.e?`<button class="btn pri big" data-w="go">Continuar</button>`:""}`:
   `<div class="bank">${b.ord.filter(i=>bk[i].ln==null||bk[i].ln==ln).map(i=>`<button class="btn tile${b.used[i]?" used":""}" data-w="tl" data-i="${i}"${b.used[i]?" disabled":""}>${esc(bk[i].t)}</button>`).join("")}</div>${b.show?"":`<button class="btn ghost" data-w="tsh" style="display:block;margin:10px auto 0">${bldMulti(c)?"Ver la respuesta":"Ver la línea completa"}</button>`}<button class="btn ghost" data-w="tns" style="display:block;margin:10px auto 0">No sé qué sigue</button>`)+`<button class="btn ghost" data-w="tmk" style="display:block;margin:10px auto 0">${(S2.mk||{})[c.id+":"+(u.i||0)]?"Marcada para repasar ✓":"Marcar para repasar"}</button>`+(b.e?noteBox():"")+`</div></div>`;
  V.innerHTML=h;return}
 const s=c.steps[u.i],L=u.cl?s.a:s.b,R=u.cl?s.b:s.a,cs=u.ans?(u.cl?"L":"R"):"",pk=u.pick,
 cl=side=>u.ans?(side==cs?" ok":(side==pk?" no":"")):"";
 h+=`<div class="swc" id="swc"><div class="lbl"><b class="sj">${SUBJ[c.s].n}</b> · ${esc(c.g)} · ${u.only?"repaso":(u.teo?"📘 teoría por tu «No sé» · ":"")+"paso "+(u.i+1)+"/"+c.steps.length}</div>`+
 ((s.x||c.ctx)?`<div class="sn">${ctxH(s.x||c.ctx,u.ans=="no"?s.src:null,u.ans=="no"?s.hl:null)}</div>`:"")+(u.ans=="no"&&s.src&&s.src.includes("dg")?`<div class="hl">${swDg(c,u.i,0)}</div>`:swDg(c,u.i,0))+(c.out&&!u.only&&u.built.length?`<div class="sn">Armando: ${esc(u.built.filter(Boolean).join(" · "))} …</div>`:"")+
 (s.th?`<div class="th">📘 ${esc(s.th)}</div>`:"")+`<div class="qt">${esc(s.q)}</div><div class="swopts"><div class="swo l${cl("L")}" data-w="L" role="button" tabindex="0">← ${esc(L)}</div><div class="swo r${cl("R")}" data-w="R" role="button" tabindex="0">${esc(R)} →</div></div>`+(u.ans?"":`<button class="btn ghost" data-w="NS" style="display:block;margin:10px auto 0">No sé <span class="mut">(↓)</span></button>`)+
 (u.ans=="no"?`<div class="fb no"><b>${u.pick=="NS"?"No sabías. ":""}Era: ${esc(s.a)}</b><div>${esc(s.w||"")}</div>${u.pick=="NS"?swTeo(c,s):""}${s.src?`<div class="mut" style="margin-top:4px">👀 Estaba en: ${s.src.map(k=>HLN[k]).join(" y ")} (marcado arriba)</div>`:""}</div><button class="btn pri big" data-w="go">Continuar</button>${noteBox()}`:"")+`</div></div>`;
 V.innerHTML=h;swBind()}
function swBind(){const el=$("swc");if(!el||SW.ans)return;
 /* Solo el deslizado horizontal contesta: tocar o mover hacia abajo (scroll) no cuenta. */
 const rst=()=>{el.style.transition="";el.style.transform="";el.classList.remove("tl","tr")};
 el.onpointerdown=e=>{SDRAG={x:e.clientX,y:e.clientY,dx:0,dy:0};try{el.setPointerCapture(e.pointerId)}catch(_){}el.style.transition="none"};
 el.onpointermove=e=>{if(!SDRAG)return;SDRAG.dx=e.clientX-SDRAG.x;SDRAG.dy=e.clientY-SDRAG.y;if(Math.abs(SDRAG.dx)<Math.abs(SDRAG.dy)*1.5)return;el.style.transform=`translateX(${SDRAG.dx}px) rotate(${SDRAG.dx/30}deg)`;el.classList.toggle("tl",SDRAG.dx<-30);el.classList.toggle("tr",SDRAG.dx>30)};
 el.onpointercancel=()=>{SDRAG=null;rst()};
 el.onpointerup=()=>{if(!SDRAG)return;const dx=SDRAG.dx,dy=SDRAG.dy;SDRAG=null;rst();if(Math.abs(dx)>80&&Math.abs(dx)>Math.abs(dy)*1.5)swChoose(dx<0?"L":"R")}}
function swChoose(side){if(!SW||SW.ans||SW.recap||SW.c.bld||SW.c.bqx)return;const u=SW,c=u.c,s=c.steps[u.i],ok=side!="NS"&&(side=="L")==u.cl,k=c.id+":"+u.i;
 u.ans=ok?"ok":"no";u.pick=side;logA("sw",c.s,c.g,ok,{q:s.q,x:s.x||c.ctx||"",a:s.a,p:side=="NS"?"No sé ("+s.b+")":s.b,ns:side=="NS"?1:0,ms:Date.now()-(u.ts||Date.now()),rp:u.only?1:0,n:u.i+1});if(!ok)NLE=E1.log[E1.log.length-1];S2.box[k]=ok?(Date.now()-(u.ts||0)>25000?(S2.box[k]||0):Math.min(4,(S2.box[k]||0)+1)):0;S2.n++;SUN++;
 if(ok){S2.ok++;S2.today++;SCOMBO++;if(SCOMBO>S2.best)S2.best=SCOMBO;S2.xp+=1+(SCOMBO%5==0?2:0)}
 else{SCOMBO=0;u.err++;BST()[c.id]=2;SRETRY.push({c,i:u.i,due:SUN+8});try{navigator.vibrate&&navigator.vibrate(30)}catch(_){}}
 SV2();swDraw();if(ok)STM=setTimeout(swAdvance,420)}
function swAdvance(){clearTimeout(STM);if(!SW||(TAB!=3&&TAB!=7))return;const u=SW,s=u.c.steps[u.i];
 SLK=u.c.id+":"+u.i;
 if(u.c.bld||u.c.bqx){SLT=swTop(u.c);SLAST=u.c.id;if((u.bs&&u.bs.e)||u.bqe)SERR=area(u.c);swNew();return}
 if(u.recap||u.only){if(u.ans=="no")SERR=area(u.c);SLT=swTop(u.c);swNew();return}
 /* Error a mitad de serie: se corta y se pasa a otro tema; el paso fallado vuelve más tarde (SRETRY, +8 respuestas) y la serie entera pesa más (pendientes). */
 if(u.ans=="no"){SLAST=u.c.id;SLT=swTop(u.c);SERR=area(u.c);
  swNew();return}
 if(s&&s.f)u.built.push(s.f);u.i++;
 if(u.i>=u.c.steps.length){SLT=swTop(u.c);u.bonus=u.err==0?5:0;if(!u.err&&!u.only){(S2.bqok=S2.bqok||{})[u.c.g]=1;BST()[u.c.id]=1}/* serie completa sin errores: abre las que la tienen de previa (c.req) */S2.xp+=u.bonus;SLAST=u.c.id;(S2.cf=S2.cf||{})[u.c.id]=1;SV2();u.recap=true;swDraw();return}
 swStep()}
/* Principal y Básico son secciones separadas: cada una con su propio progreso, racha, repasos y almacenamiento (sw1 / sw1b). */
/* Nota en cada error: textarea bajo el aviso; se guarda sola en la entrada del registro (e.note) y sale en el export */
let NLE=null,NTM=null;
/* NOTA (pedido de Luca, 23/11: «necesito un botón de enviar nota, si no, no queda claro a qué paso le anoto; y la nota está metida entre la letra y
   las opciones»): va AL FINAL de la tarjeta, dice a qué error queda pegada (lo que era y lo que elegiste) y tiene botón «Guardar nota» (guarda ya y
   la manda como issue si hay token). Se sigue guardando sola al escribir, por las dudas. */
const noteBox=()=>NLE?`<details class="nt" style="margin-top:14px"${NLE.note?" open":""}><summary>✏️ ${NLE.note?"Tu nota":"Agregar una nota a este error"}</summary><div class="mut" style="font-size:12px;margin-top:4px">Para el error: era <b>${esc(String(NLE.a||"").split("\n").pop().slice(-80))}</b>${NLE.p?` · elegiste <b>${esc(String(NLE.p).split("\n").pop().slice(-80))}</b>`:""}</div><textarea data-note="cur" rows="3" placeholder="¿Qué no entendiste o qué te confundió?">${esc(NLE.note||"")}</textarea><div class="row" style="gap:8px;align-items:center"><button class="btn" data-w="nsv">Guardar nota</button><span class="mut" id="nsvm" style="font-size:12px">${NLE.note?"Guardada ✓":""}</span></div></details>`:"";
V.addEventListener("input",ev=>{const t=ev.target;if(!t||!t.dataset||t.dataset.note===undefined)return;const e=t.dataset.note=="cur"?NLE:E1.log[+t.dataset.note];if(!e)return;const v=t.value.trim();if(v)e.note=v;else delete e.note;clearTimeout(NTM);NTM=setTimeout(SVE,400)});
let SWM=3;const SWX={};
function swMode(m){clearTimeout(STM);if(m==SWM)return;SPACK=[];SWX[SWM]={S2,SCOMBO,SRETRY,SLAST,SLT,SLK,SERR,SAX,SUN,SW};SWM=m;SK=m==7?"sw1b":"sw1";const x=SWX[m];
 if(x){({S2,SCOMBO,SRETRY,SLAST,SLT,SLK,SERR,SAX,SUN,SW}=x)}else{S2={box:{},xp:0,best:0,n:0,ok:0,day:"",today:0};try{const r=localStorage.getItem(SK);if(r)S2=Object.assign(S2,JSON.parse(r))}catch(e){}SCOMBO=0;SRETRY=[];SLAST="";SLT="";SLK="";SERR="";SAX="";SUN=0;SW=null}}
function swOpen(){SW=null;swNew()}
V.addEventListener("click",ev=>{if((TAB!=3&&TAB!=7))return;const b=ev.target.closest("[data-w]");if(!b)return;const w=b.dataset.w;
 if(w=="NS")swChoose(w);else if(w=="go")swAdvance();else if(w=="nsv"){const ta=V.querySelector('textarea[data-note="cur"]');if(NLE&&ta){const v=ta.value.trim();if(v)NLE.note=v;else delete NLE.note;SVE();if(typeof ghSync=="function")ghSync();const m=$("nsvm");if(m)m.textContent=v?"Guardada ✓":"Nota borrada"}}else if(w=="tl")swTile(+b.dataset.i);else if(w=="sl"){if(SW&&SW.bs&&!SW.bs.done){SW.bs.sel=b.dataset.v;SW.bs.m=null;swDraw()}}else if(w=="tns")swTile(-1);else if(w=="tmk"){if(SW&&SW.c){const k=SW.c.id+":"+(SW.i||0);S2.mk=S2.mk||{};if(S2.mk[k])delete S2.mk[k];else{S2.mk[k]=1;S2.box[k]=0;BST()[(SW.c.pk||SW.c).id]=2}SV2();swDraw()}}else if(w=="tsh")swShow();else if(w=="sf"||w=="st"||w=="sg"){if(w=="sf")SF=b.dataset.v;else{const ks=b.dataset.v.split(","),on=!ks.every(swSel);if(!swSelSet(ks,on))return;SPACK=[]}window.SWNOOI=1;try{swNew()}finally{window.SWNOOI=0}}});
document.addEventListener("keydown",e=>{if((TAB!=3&&TAB!=7)||!SW||(e.target&&e.target.tagName=="TEXTAREA")||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key;
 if(k=="ArrowDown"&&SW.ans==null&&!SW.recap){e.preventDefault();swChoose("NS")}
 else if(k=="ArrowLeft"||k=="ArrowRight"){e.preventDefault();if(SW.ans==null&&!SW.recap)swChoose(k=="ArrowLeft"?"L":"R");else if(SW.ans!="ok")swAdvance()}
 else if((k=="Enter"||k==" ")&&e.target.tagName!="BUTTON"){e.preventDefault();if(SW.recap||SW.ans=="no")swAdvance()}});
