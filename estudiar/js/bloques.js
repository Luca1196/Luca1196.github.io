/* SECCIÓN BLOQUES (pestaña 6, en prueba): derivaciones armando el árbol con bloques, estilo Scratch.
   Los bloques SON el árbol: cada meta abierta es un hueco (punteado); al tocarlo y elegir una regla, aparece la raya con sus premisas como huecos nuevos.
   Se construye hacia atrás: el usuario elige la regla y después CADA miembro (premisas y suposición) de una lista de fórmulas (pool); chk() valida y explica. Hojas: una premisa del ejercicio elegida queda como hoja; una SUPOSICIÓN solo si se elige con corchetes [φ]ⁿ (botón aparte); elegir φ sin corchetes deja un hueco (closeSubs); «Hipótesis» sirve para cerrar a mano un hueco que es una hipótesis. Nada se aplica automáticamente (pedido de Luca).
   MOTOR: copia literal de logica.html (pf/pr/fv/sb/ff/entails/tp y mk/sol/cl0/bld/mv/PM/pl/hint). Si cambia allá, recopiar el bloque entre las marcas.
   Errores: logA("bq",...). «No sé»: hint(o) + teoría THT (swTeo). Progreso: localStorage "bq1". v1: solo ejercicios proposicionales (E). */
const BQ=(()=>{
let NOAUTO=false;/* Una premisa que ELEGISTE y ya tenés queda como hoja (se cierra al elegirla); las demás quedan como hueco */
/* ===== MOTOR (copia de logica.html) ===== */
function pf(s){const T=s.match(/[A-Za-z0-9_α-ωΑ-Ω]+|\S/g);let i=0;const nt=()=>T[i++],pk=()=>T[i];
const trm=()=>{const n=nt();if(pk()=="("){i++;const a=[trm()];while(pk()==","){i++;a.push(trm())}i++;return{k:"fn",n,a}}return{k:"v",n}};
const at=()=>{const n=nt(),a=[];if(pk()=="("){i++;a.push(trm());while(pk()==","){i++;a.push(trm())}i++}return{k:"at",n,a}};
const un=()=>{const t=pk();if(t=="¬"){i++;return{k:"not",a:un()}}if(t=="⊥"){i++;return{k:"bot"}}
if(t=="("){if(T[i+1]=="∀"||T[i+1]=="∃"){const q=T[i+1]=="∀"?"all":"ex",v=T[i+2];i+=4;return{k:q,v,a:un()}}i++;const f=iff();i++;return f}return at()};
const bin=(g,op,k)=>()=>{let l=g();while(pk()==op){i++;l={k,l,r:g()}}return l};
const and=bin(un,"∧","and"),or=bin(and,"∨","or"),imp=()=>{const l=or();if(pk()=="→"){i++;return{k:"imp",l,r:imp()}}return l},iff=bin(imp,"↔","iff");return iff()}
const PR={iff:1,imp:2,or:3,and:4},pt=t=>t.k=="v"?t.n:t.n+"("+t.a.map(pt).join(",")+")",u=g=>PR[g.k]?"("+pr(g)+")":pr(g);
function pr(f){switch(f.k){case"bot":return"⊥";case"at":return f.n+(f.a.length?"("+f.a.map(pt).join(",")+")":"");case"not":return"¬"+u(f.a);case"all":return"(∀"+f.v+")"+u(f.a);case"ex":return"(∃"+f.v+")"+u(f.a);
default:{const c=g=>PR[g.k]&&!(g.k=="and"&&(f.k=="imp"||f.k=="iff"))?"("+pr(g)+")":pr(g);return c(f.l)+({iff:"↔",imp:"→",or:"∨",and:"∧"})[f.k]+c(f.r)}}}
const tv=(t,s)=>t.k=="v"?s.add(t.n):t.a.forEach(x=>tv(x,s));
function fv(f,b=[],s=new Set()){switch(f.k){case"at":{const q=new Set();f.a.forEach(t=>tv(t,q));q.forEach(x=>b.includes(x)||s.add(x));break}case"not":fv(f.a,b,s);break;case"all":case"ex":fv(f.a,b.concat(f.v),s);break;case"bot":break;default:fv(f.l,b,s);fv(f.r,b,s)}return s}
const stt=(m,x,t)=>m.k=="v"?(m.n==x?t:m):{k:"fn",n:m.n,a:m.a.map(y=>stt(y,x,t))};
function sb(f,x,t){switch(f.k){case"at":return{...f,a:f.a.map(m=>stt(m,x,t))};case"not":return{k:"not",a:sb(f.a,x,t)};case"all":case"ex":return f.v==x?f:{...f,a:sb(f.a,x,t)};case"bot":return f;default:return{...f,l:sb(f.l,x,t),r:sb(f.r,x,t)}}}
function ff(f,x,t){const V=new Set();tv(t,V);const w=(g,b)=>{switch(g.k){case"at":{const q=new Set();g.a.forEach(m=>tv(m,q));return!(q.has(x)&&!b.includes(x)&&b.some(y=>V.has(y)))}case"not":return w(g.a,b);case"all":case"ex":return w(g.a,b.concat(g.v));case"bot":return true;default:return w(g.l,b)&&w(g.r,b)}};return w(f,[])}
const prop=f=>f.k=="at"?!f.a.length:f.k=="bot"||(f.k=="not"?prop(f.a):f.k=="all"||f.k=="ex"?false:prop(f.l)&&prop(f.r));
const atoms=(f,s=new Set())=>{if(f.k=="at")s.add(f.n);else if(f.k=="not")atoms(f.a,s);else if(f.l){atoms(f.l,s);atoms(f.r,s)}return s};
const ev=(f,v)=>f.k=="bot"?0:f.k=="at"?v[f.n]:f.k=="not"?1-ev(f.a,v):({and:()=>ev(f.l,v)&ev(f.r,v),or:()=>ev(f.l,v)|ev(f.r,v),imp:()=>(1-ev(f.l,v))|ev(f.r,v),iff:()=>+(ev(f.l,v)==ev(f.r,v))})[f.k]();
function entails(fs,g){const all=[g,...fs];if(!all.every(prop))return true;const A=[...new Set(all.flatMap(x=>[...atoms(x)]))];if(A.length>8)return true;
for(let m=0;m<1<<A.length;m++){const w={};A.forEach((a,i)=>w[a]=m>>i&1);if(fs.every(x=>ev(x,w))&&!ev(g,w))return false}return true}
const sf=(f,m)=>{m[pr(f)]=f;if(f.k=="not"||f.k=="all"||f.k=="ex")sf(f.a,m);else if(f.l){sf(f.l,m);sf(f.r,m)}};
function tp(e){const m={},c=t=>{m[pt(t)]=t;if(t.k=="fn")t.a.forEach(c)},w=f=>{if(f.k=="at")f.a.forEach(c);else if(f.k=="not")w(f.a);else if(f.k=="all"||f.k=="ex"){m[f.v]={k:"v",n:f.v};w(f.a)}else if(f.l){w(f.l);w(f.r)}};[e.GA,...e.PA].forEach(w);return m}

const BR=["I∧","E∧","I→","E→","I¬","E¬","E⊥","RAA","I∨","E∨","I↔","hip"],QR=["I∀","E∀","I∃","E∃"],CAN=["I→","I¬","RAA","E∨","E∃"];
const KD={"I∀":"fv","E∀":"libre","I∃":"libre","E∃":"fvE"};
const KT={libre:"t libre para la variable en la fórmula",fv:"variable no libre en las hipótesis abiertas",fvE:"variable no libre en la conclusión ni en las hipótesis abiertas (salvo la que se cancela)",none:"ninguna condición"};
const KS={libre:"t libre para x en φ",fv:"x ∉ FV(hip. abiertas)",fvE:"x ∉ FV(concl. y otras hip.)",none:"ninguna"};
const SN={"E∧":"Conjunción","E→":"Antecedente","E¬":"Fórmula φ (quedan ¬φ y φ)","E∨":"Disyunción","E∀":"Premisa ∀","I∃":"Premisa φ(t)","E∃":"Premisa ∃","I∨":"Disyunto que probás"};
const CT={"I→":"el antecedente de la conclusión (o nada)","I¬":"la φ de ¬φ","RAA":"la negación de la conclusión","E∨":"cada disyunto, en su rama","E∃":"la φ(x) de la premisa ∃"};
const rn=r=>r=="hip"?"Hipótesis":r,rr=r=>r.replace(/[bf]$/,"");
const nd=(f,r,c,l,s)=>({f:pr(f),r,l:l||"",s:s||"",c:c||[]});
const has=(c,g)=>c.find(x=>pr(x.f)==pr(g));
function mk(S,par,g,ctx){const o={id:S.G.length,g,ctx,par,s:"o",d:null,how:null,subs:[]};S.G.push(o);return o}
function sol(S,o,d){o.s="d";o.d=d;const p=o.par!=null?S.G[o.par]:null;if(p&&p.s=="o"&&p.subs.every(i=>S.G[i].s=="d"))sol(S,p,bld(p,S))}
const cl0=(S,o)=>{if(NOAUTO)return;const q=has(o.ctx,o.g);if(q&&o.s=="o")sol(S,o,q.d)};
function bld(p,S){const h=p.how,k=h.k,ds=p.subs.map(i=>S.G[i].d),g=p.g;
switch(k){case"I→":case"I¬":case"RAA":return nd(g,k,ds,h.l);case"I∀":case"I∃":return nd(g,k,ds,"",h.s);case"E¬b":return nd(g,"E¬",ds);case"E→b":return nd(g,"E→",ds);case"E∨":return nd(g,"E∨",[h.fd,...ds].filter(Boolean),h.l);case"E∃":return nd(g,"E∃",[h.fd,...ds],h.l,h.s);default:return nd(g,k,ds)}}
const FW=["E∧","E→f","E¬f","E∨","E∀","E∃"],TPC={};
const TPm=()=>TPC[ex]||(TPC[ex]=tp(E[ex])),FPm=o=>{const m={};[...o.ctx.map(x=>x.f),o.g].forEach(f=>sf(f,m));return m};
function mv(S,o,r,a){const g=o.g,c=o.ctx,F=(t,m)=>({blocked:1,t,m}),R=rr(r);
const hy=(f,n)=>({f,d:nd(f,"hip",[],""+n)}),ops=()=>c.filter(x=>x.d.r=="hip"),lb=()=>++S.lab,subs=[],ns=(g2,h)=>{const q=mk(S,o.id,g2,c.concat(h||[]));o.subs.push(q.id);subs.push(q)};
const SH={"I∧":["and","una conjunción (φ∧ψ)"],"I→":["imp","una implicación (φ→ψ)"],"I¬":["not","una negación (¬φ)"],"I∨":["or","una disyunción (φ∨ψ)"],"I↔":["iff","una bicondicional (φ↔ψ)"],"I∀":["all","un (∀x)φ"],"I∃":["ex","un (∃x)φ"]};
if(FW.includes(r)&&r!="E∨"&&r!="E∃"){const x=c[a[0]];if(!x)return F("premisa","No hay ninguna hipótesis para usar con este movimiento.");const f=x.f,add=(nf,d)=>{if(!has(c,nf))c.push({f:nf,d})},bad=m=>F("premisa",m);
if(r=="E∧"){if(f.k!="and")return bad("E∧ necesita una conjunción como premisa.");add(f.l,nd(f.l,"E∧",[x.d]));add(f.r,nd(f.r,"E∧",[x.d]))}
if(r=="E→f"){if(f.k!="imp")return bad("E→ necesita una implicación como premisa.");const q=has(c,f.l);if(!q)return bad(`Para E→ hace falta tener el antecedente «${pr(f.l)}» entre tus hipótesis. Construilo con una meta nueva (E→ hacia atrás) o elegí otro movimiento.`);add(f.r,nd(f.r,"E→",[x.d,q.d]))}
if(r=="E¬f"){if(f.k!="not")return bad("E¬ hacia adelante necesita una negación ¬φ como premisa.");const q=has(c,f.a);if(!q)return bad(`Para E¬ hace falta tener también «${pr(f.a)}» entre tus hipótesis.`);add({k:"bot"},nd({k:"bot"},"E¬",[x.d,q.d]))}
if(r=="E∀"){if(f.k!="all")return bad("E∀ necesita una premisa (∀x)φ.");const t=TPm()[a[1]];if(!ff(f.a,f.v,t))return F("condición",`E∀ exige que ${pt(t)} sea libre para ${f.v} en «${pr(f.a)}»: al sustituir se captura una variable.`);const nf=sb(f.a,f.v,t);add(nf,nd(nf,"E∀",[x.d],"",`${pt(t)} libre para ${f.v} en ${pr(f.a)}`))}
S.log.push(`${R} sobre «${pr(f)}»`);cl0(S,o);return null}
let how={k:r};
if(r=="E∨"||r=="E∃"){const x=c[a[0]],f=x.f;
if(r=="E∨"){if(f.k!="or")return F("premisa","E∨ necesita una disyunción como premisa.");const n1=lb(),n2=lb();ns(g,[hy(f.l,n1)]);ns(g,[hy(f.r,n2)]);how.l=n1+","+n2;how.fd=x.d}
else{if(f.k!="ex")return F("premisa","E∃ necesita una premisa (∃x)φ.");const v=f.v,bd=ops().find(y=>y!==x&&fv(y.f).has(v));if(fv(g).has(v)||bd)return F("condición",`E∃ exige x ∉ FV de la conclusión y de las hipótesis abiertas, pero ${v} aparece libre en «${pr(fv(g).has(v)?g:bd.f)}».`);const n=lb();how.l=""+n;how.fd=x.d;how.s=`${v} ∉ FV(${pr(g)}, hipótesis abiertas)`;ns(g,[hy(f.a,n)])}
S.log.push(`${R} sobre «${pr(f)}»`)}
else{if(SH[r]&&g.k!=SH[r][0])return F("regla",`${r} solo sirve cuando la meta es ${SH[r][1]}; acá la meta es «${pr(g)}».`);
switch(r){
case"I∧":ns(g.l);ns(g.r);break;
case"I↔":ns({k:"imp",l:g.l,r:g.r});ns({k:"imp",l:g.r,r:g.l});break;
case"I→":{const n=lb();how.l=""+n;ns(g.r,[hy(g.l,n)])}break;
case"I¬":{const n=lb();how.l=""+n;ns({k:"bot"},[hy(g.a,n)])}break;
case"RAA":{const n=lb();how.l=""+n;ns({k:"bot"},[hy({k:"not",a:g},n)])}break;
case"I∨":ns(a[0]==0?g.l:g.r);break;
case"I∀":{const x=g.v,bd=ops().find(y=>fv(y.f).has(x));if(bd)return F("condición",`I∀ exige x ∉ FV de las hipótesis abiertas, pero ${x} es libre en «${pr(bd.f)}».`);how.s=`${x} ∉ FV(hipótesis abiertas)`;ns(g.a)}break;
case"I∃":{const t=TPm()[a[0]];if(!ff(g.a,g.v,t))return F("condición",`I∃ exige que ${pt(t)} sea libre para ${g.v} en «${pr(g.a)}».`);how.s=`${pt(t)} libre para ${g.v} en ${pr(g.a)}`;ns(sb(g.a,g.v,t))}break;
case"E⊥":if(g.k=="bot")return F("regla","La meta ya es ⊥: no hace falta E⊥.");ns({k:"bot"});break;
case"E¬b":{if(g.k!="bot")return F("regla","E¬ hacia atrás concluye ⊥: la meta tiene que ser ⊥.");const p=FPm(o)[a[0]];ns({k:"not",a:p});ns(p)}break;
case"E→b":{const p=FPm(o)[a[0]];ns({k:"imp",l:p,r:g});ns(p)}break}
S.log.push(`${R} sobre la meta «${pr(g)}»`)}
o.how=how;subs.forEach(q=>cl0(S,q));
const w=subs.find(q=>q.s=="o"&&!entails(q.ctx.map(x=>x.f),q.g));
return w?{warn:1,t:"camino sin salida",m:`Camino sin salida: «${pr(w.g)}» ya no se sigue de tus hipótesis.`}:null}
const PM=(r,o)=>{const p={"E∧":["f"],"E→f":["f"],"E¬f":["f"],"E∨":["f"],"E∃":["f"],"E∀":["f","t"],"I∨":["s"],"I∃":["t"],"E¬b":["φ"],"E→b":["φ"]}[r]||[];return(r=="I∨"&&o.g.k!="or")||(r=="I∃"&&o.g.k!="ex")||(r=="E¬b"&&o.g.k!="bot")?[]:p};
function pl(k,o){if(k=="f")return o.ctx.map((x,i)=>[i,pr(x.f)]);if(k=="t")return Object.keys(TPm()).map(s=>[s,s]);if(k=="s")return[[0,pr(o.g.l)],[1,pr(o.g.r)]];return Object.keys(FPm(o)).map(s=>[s,s])}
function hint(o){const g=o.g,c=o.ctx,sh={and:"I∧",imp:"I→",not:"I¬",iff:"I↔",all:"I∀"},any=f=>c.some(f);
if(g.k!="bot"&&sh[g.k])return`La meta es de la forma ${sh[g.k]}: su introducción la desarma sin perder nada (receta, paso 2).`;
if(any(x=>x.f.k=="and"&&!(has(c,x.f.l)&&has(c,x.f.r))))return"Hay una conjunción entre tus hipótesis: desarmala con E∧ (paso 3).";
if(any(x=>x.f.k=="ex"&&!has(c,x.f.a)))return"Tenés una existencial sin usar: E∃ te da una hipótesis con la variable fresca (paso 3).";
if(any(x=>x.f.k=="imp"&&has(c,x.f.l)&&!has(c,x.f.r)))return"Ya tenés el antecedente de una implicación: E→ hacia adelante (paso 3).";
if(any(x=>x.f.k=="not"&&has(c,x.f.a)&&!has(c,{k:"bot"})))return"Tenés φ y ¬φ: E¬ hacia adelante te da ⊥.";
if(any(x=>x.f.k=="or"&&!has(c,x.f.l)&&!has(c,x.f.r)))return"Hay una disyunción entre tus hipótesis: E∨ (casos) (paso 3).";
if(g.k=="bot")return"La meta es ⊥: buscá una φ cuya negación ya tengas (o construila con E→ hacia atrás) y usá E¬.";
if(any(x=>x.f.k=="all"))return"¿Probaste E∀ con otros términos que aparezcan en el problema?";
if(g.k=="or"||g.k=="ex")return"I∨/I∃ solo si ya sabés qué lado o testigo vale; si no, probá RAA (paso 4).";
return"Nada directo: RAA (suponé ¬meta y buscá ⊥) (paso 4).";}
/* ===== FIN MOTOR ===== */
/* ---------- Ejercicios (v1: solo proposicional) ---------- */
const SD="α∨(β∧¬γ)",H="¬α→¬(β→γ)";
const E=[
{t:"Conmutar ∧",P:["p∧q"],g:"q∧p"},
{t:"Cadena de →",P:["φ→ψ","ψ→σ"],g:"φ→σ"},
{t:"Doble negación",P:["¬¬φ"],g:"φ"},
{t:"Silogismo disyuntivo",P:["p∨q","¬p"],g:"q"},
{t:"No contradicción",P:[],g:"¬(φ∧¬φ)"},
{t:"Contrarrecíproca",P:[],g:"(p→q)→(¬q→¬p)"},
{t:"Tercero excluido",P:[],g:"φ∨¬φ"},
{t:"Febrero 3a",P:[],g:"((p→q)∧(¬r→p))→(¬q→r)"},
{t:"3a ←",P:[],g:`(${SD})→(${H})`},
{t:"3a →",P:[],g:`(${H})→(${SD})`}];
E.forEach(e=>{e.PA=e.P.map(pf);e.GA=pf(e.g);e.q=/[∀∃]/.test(e.P.join("")+e.g)});
let ex=0;
/* ---------- Estado ---------- */
let ST=(()=>{try{return JSON.parse(localStorage.getItem("bq1")||"{}")}catch(e){return{}}})();ST.done=ST.done||{};
const SVQ=()=>{try{localStorage.setItem("bq1",JSON.stringify(ST))}catch(e){}};
let D=null;/* {S, H:[pilas para deshacer], cur, r (regla elegida), a (parámetros), fb (html de feedback)} */
const nw=i=>{const e=E[i],S={G:[],lab:0,log:[]},o=mk(S,null,e.GA,e.PA.map(f=>({f,d:nd(f,"hip")})));cl0(S,o);return{S,H:[],cur:null,r:null,a:[],fb:""}};
const lf=S=>{const r=[],w=o=>o.subs.length?o.subs.forEach(i=>w(S.G[i])):o.s=="o"&&r.push(o);w(S.G[0]);return r};
const curG=()=>{const L=lf(D.S);return L.find(x=>x.id==D.cur)||L[0]};
/* ---------- Árbol: los bloques SON el árbol (hojas arriba, raíz abajo; los huecos son metas abiertas) ---------- */
const RN=r=>({"E¬b":"E¬","E→b":"E→","hip":""}[r]??r);
const sup=l=>l?`<sup>${esc(l)}</sup>`:"";
function rd(d){if(d.r=="hip")return`<span class="pf">${d.l?"["+esc(d.f)+"]"+sup(d.l):esc(d.f)}</span>`;
 return`<div class="pt"><div class="pk">${d.c.map(rd).join("")}</div><div class="pr"><span class="pn">${esc(RN(d.r))}${sup(d.l)}</span></div><span class="pf">${esc(d.f)}</span></div>`}
function rg(o,cu){const S=D.S;if(o.s=="d")return rd(o.d);
 if(!o.how)return`<button class="bqh${o.id==cu?" on":""}" data-b="g" data-i="${o.id}" aria-label="Meta abierta ${esc(pr(o.g))}">${esc(pr(o.g))}</button>`;
 const k=[];if(o.how.fd)k.push(rd(o.how.fd));o.subs.forEach(i=>k.push(rg(S.G[i],cu)));
 return`<div class="pt"><div class="pk">${k.join("")}</div><div class="pr bqr"><span class="pn">${esc(RN(o.how.k))}${sup(o.how.l)}</span></div><span class="pf">${esc(pr(o.g))}</span></div>`}
/* ---------- Paleta: el usuario elige la regla y después CADA miembro (premisas y suposición). Nada se completa solo. ---------- */
const NG=f=>({k:"not",a:f}),BOT={k:"bot"};
/* plantillas: m = miembros a elegir (etiqueta), chk = valida y devuelve {ok, run} o {m: error} */
const TPL={
 "hip":{n:"Hipótesis",m:["¿Qué hipótesis va en esta hoja?"],only:"ctx"},
 "I∧":{n:"I∧",m:["Premisa izquierda","Premisa derecha"]},
 "I→":{n:"I→",m:["¿Qué suponés? (se cancela)","¿Qué queda arriba de la raya?"]},
 "I¬":{n:"I¬",m:["¿Qué suponés? (se cancela)","¿Qué queda arriba de la raya?"]},
 "RAA":{n:"RAA",m:["¿Qué suponés? (se cancela)","¿Qué queda arriba de la raya?"]},
 "I∨":{n:"I∨",m:["¿Qué queda arriba de la raya?"]},
 "I↔":{n:"I↔",m:["Premisa izquierda","Premisa derecha"]},
 "E→":{n:"E→",m:["Premisa: la implicación A→meta","Premisa: su antecedente A (lo que está a la izquierda de →)"]},
 "E¬":{n:"E¬",m:["Premisa: la fórmula φ","Premisa: su negación ¬φ"]},
 "E∧":{n:"E∧",m:["Premisa: la conjunción"]},
 "E∨":{n:"E∨",m:["Premisa: la disyunción"]},
 "E⊥":{n:"E⊥",m:["¿Qué queda arriba de la raya?"]}};
const BK=[["Cerrar una hoja",["hip"]],["Introducción (arma la meta)",["I∧","I→","I¬","I∨","I↔","RAA"]],["Eliminación (usa una fórmula)",["E→","E¬","E∧","E∨","E⊥"]]];
const P=pr,eq=(a,b)=>P(a)==P(b),MS=m=>m.hyp?"["+P(m.f)+"]"+m.hyp:P(m.f),MSH=m=>m.hyp?"["+esc(P(m.f))+"]"+sup(m.hyp):esc(P(m.f));
/* cierre de hojas: una premisa del ejercicio (sin etiqueta) elegida queda como hoja; una suposición solo si la elegiste con corchetes [φ]ⁿ */
function closeSubs(S1,o1,r,M){const mem=["I→","I¬","RAA"].includes(r)?M.slice(1):r=="E∨"?[M[0]]:M;
 o1.subs.forEach((id,i)=>{const q=S1.G[id],m=mem[i];if(!m||q.s!="o")return;const x=m.hyp?q.ctx.find(y=>y.d.l==m.hyp&&eq(y.f,q.g)):q.ctx.find(y=>!y.d.l&&y.d.r=="hip"&&eq(y.f,q.g));if(x)sol(S1,q,x.d)})}
function chk(r,o,MM){const M=MM.map(m=>m.f);const g=o.g,bad0=m=>({m}),ARM={and:"I∧",imp:"I→",not:"I¬",iff:"I↔"},
 bad=m=>bad0(m+(r[0]=="E"&&ARM[g.k]&&!o.ctx.some(x=>x.f.k=="imp"&&eq(x.f.r,g))?` Ojo: la meta ${P(g)} tiene conector, así que se ARMA con ${ARM[g.k]}; las eliminaciones son para USAR una fórmula que tenés.`:""));
 switch(r){
 case"hip":return eq(M[0],g)?{ok:1}:bad(`La hoja tiene que ser exactamente la meta ${P(g)}; elegiste ${MS(MM[0])}.`);
 case"I∧":return g.k!="and"?bad(`I∧ arma una conjunción y la meta ${P(g)} no lo es.`):eq(M[0],g.l)&&eq(M[1],g.r)?{ok:1,run:["I∧",[]]}:bad(`Para concluir ${P(g)} con I∧, arriba van sus dos partes: ${P(g.l)} y ${P(g.r)}.`);
 case"I↔":return g.k!="iff"?bad(`I↔ arma una bicondicional y la meta ${P(g)} no lo es.`):eq(M[0],{k:"imp",l:g.l,r:g.r})&&eq(M[1],{k:"imp",l:g.r,r:g.l})?{ok:1,run:["I↔",[]]}:bad("I↔ necesita las dos implicaciones, una para cada lado.");
 case"I→":return g.k!="imp"?bad(`I→ arma una implicación y la meta ${P(g)} no lo es.`):!eq(M[0],g.l)?bad(`I→ supone el antecedente de la meta (${P(g.l)}), no ${P(M[0])}.`):!eq(M[1],g.r)?bad(`Bajo la suposición tenés que llegar al consecuente ${P(g.r)}.`):{ok:1,run:["I→",[]]};
 case"I¬":return g.k!="not"?bad(`I¬ arma una negación y la meta ${P(g)} no empieza con ¬.`):!eq(M[0],g.a)?bad(`I¬ supone lo que está bajo el ¬ (${P(g.a)}), no ${P(M[0])}.`):M[1].k!="bot"?bad("I¬ busca una contradicción: arriba va ⊥."):{ok:1,run:["I¬",[]]};
 case"RAA":return !eq(M[0],NG(g))?bad(`RAA supone la negación de la meta (${P(NG(g))}), no ${P(M[0])}.`):M[1].k!="bot"?bad("RAA busca una contradicción: arriba va ⊥."):{ok:1,run:["RAA",[]]};
 case"I∨":return g.k!="or"?bad(`I∨ arma una disyunción y la meta ${P(g)} no lo es.`):eq(M[0],g.l)?{ok:1,run:["I∨",[0]]}:eq(M[0],g.r)?{ok:1,run:["I∨",[1]]}:bad(`I∨ necesita uno de los dos lados: ${P(g.l)} o ${P(g.r)}.`);
 case"E→":return M[0].k!="imp"?bad(`La primera premisa de E→ es una implicación; ${P(M[0])} no lo es.`):!eq(M[0].r,g)?bad(`${P(M[0])} da ${P(M[0].r)}, pero la meta es ${P(g)}.`):!eq(M[1],M[0].l)?bad(`E→ funciona así: de A→B y A se obtiene B. Con ${P(M[0])}, A es ${P(M[0].l)} (lo de la izquierda de la flecha), así que la segunda premisa es ${P(M[0].l)}. ${eq(M[1],g)?P(g)+" es lo que se obtiene: va abajo de la raya, no arriba.":""}`):{ok:1,run:["E→b",[P(M[1])]]};
 case"E¬":return g.k!="bot"?bad(`E¬ concluye ⊥, y la meta es ${P(g)}.`):!eq(M[1],NG(M[0]))?bad(`La segunda premisa tiene que ser la negación de la primera: ${P(NG(M[0]))}.`):{ok:1,run:["E¬b",[P(M[0])]]};
 case"E∧":return M[0].k!="and"?bad(`E∧ usa una conjunción; ${P(M[0])} no lo es.`):eq(M[0].l,g)||eq(M[0].r,g)?{ok:1,cust:"E∧"}:bad(`${P(M[0])} no tiene a ${P(g)} como parte.`);
 case"E∨":return M[0].k!="or"?bad(`E∨ usa una disyunción; ${P(M[0])} no lo es.`):{ok:1,cust:"E∨"};
 case"E⊥":return g.k=="bot"?bad("La meta ya es ⊥."):M[0].k!="bot"?bad("E⊥ parte de ⊥: arriba va ⊥."):{ok:1,run:["E⊥",[]]}}}
/* fórmulas candidatas para elegir: lo que tengo, la meta, sus subfórmulas, sus negaciones y ⊥ */
function pool(o){const m={},add=f=>{m[P(f)]=f};Object.values(FPm(o)).forEach(f=>{add(f);if(f.k!="not"&&f.k!="bot")add(NG(f))});add(BOT);o.ctx.forEach(x=>add(x.f));
 return Object.values(m).sort((a,b)=>P(a).length-P(b).length||P(a).localeCompare(P(b)))}
function bqOpen(){if(!D)D=nw(ex);bqDraw()}
function bqDraw(){const S=D.S,root=S.G[0],done=root.s=="d",o=done?null:curG();if(o)D.cur=o.id;const e=E[ex];
 let h=`<div class="s-lg"><div class="row" style="flex-wrap:wrap;gap:6px">${E.map((x,i)=>`<button class="btn chip${i==ex?" sel":""}" data-b="ex" data-i="${i}">${esc(x.t)}${ST.done[x.t]?" ✓":""}</button>`).join("")}</div>
 <div class="sn" style="margin-top:10px">${e.P.length?esc(e.P.join(", "))+" ":""}⊢ ${esc(e.g)}</div>
 <div class="sn pft bqt"><div style="display:inline-block;padding-right:52px">${rg(root,o&&o.id)}</div></div>`;
 if(done){h+=`<div class="fb ok"><b>¡Árbol completo!</b></div><div class="row" style="gap:8px"><button class="btn pri" data-b="nx">Siguiente ejercicio</button><button class="btn" data-b="rs">Repetir</button></div></div>`;V.innerHTML=h;return}
 h+=`<div class="card" style="margin-top:10px"><div class="lbl">Meta seleccionada (tocá otro hueco para cambiar)</div><div class="qt" style="margin:4px 0">${esc(P(o.g))}</div>
 <div class="mut" style="font-size:14px">Tengo: ${o.ctx.length?o.ctx.map(x=>`<span class="bqc">${x.d.l?"["+esc(P(x.f))+"]"+sup(x.d.l):esc(P(x.f))}</span>`).join(" "):"nada"}</div>`;
 const t=D.r&&TPL[D.r];
 if(t){const k=D.m.length,HY=o.ctx.filter(x=>x.d.l).map(x=>[`H${x.d.l}`,"["+esc(P(x.f))+"]"+sup(x.d.l)]),PR=o.ctx.filter(x=>!x.d.l).map(x=>[P(x.f),esc(P(x.f))]),L=t.only=="ctx"?HY.concat(PR):HY.concat(pool(o).map(f=>[P(f),esc(P(f))]));
  h+=`<div class="sn" style="margin-top:10px">${esc(t.n)}: ${t.m.map((lab,i)=>`<div>${i<k?"✓":i==k?"▶":"·"} ${esc(lab)}: <b>${i<k?MSH(D.m[i]):"…"}</b></div>`).join("")}</div>
  <div class="lbl">${esc(t.m[k])}</div><div class="row" style="flex-wrap:wrap;gap:6px">${L.map(([v,lab])=>`<button class="btn chip${v[0]=="H"?" bqhy":""}" data-b="m" data-v="${esc(v)}">${lab}</button>`).join("")||'<span class="mut">No tenés hipótesis.</span>'}</div>
  <div class="row" style="gap:8px">${k?'<button class="btn ghost" data-b="mb">Borrar último</button>':""}<button class="btn ghost" data-b="cx">Cancelar</button></div>`}
 else h+=BK.map(([tt,L])=>`<div class="lbl" style="margin-top:10px">${tt}</div><div class="row" style="flex-wrap:wrap;gap:6px">${L.map(id=>`<button class="btn bqb" data-b="r" data-v="${id}">${esc(TPL[id].n)}</button>`).join("")}</div>`).join("");
 h+=`${D.fb}<div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn" data-b="ns">No sé</button><button class="btn" data-b="un"${D.H.length?"":" disabled"}>Deshacer</button><button class="btn ghost" data-b="rs">Reiniciar</button></div></div></div>`;
 V.innerHTML=h;const s=V.querySelector(".bqh.on");if(s)try{s.scrollIntoView({block:"nearest",inline:"center"})}catch(_){}}
const ctxTxt=o=>o.ctx.map(x=>P(x.f)).join(", ")||"nada";
/* aplicar cuando están todos los miembros */
function bqDo(){const o=curG(),r=D.r,M=D.m,c=chk(r,o,M),info={q:"Meta: "+P(o.g)+" · Tengo: "+ctxTxt(o),x:E[ex].t,p:TPL[r].n+": "+M.map(MS).join(" ; ")};D.r=null;D.m=[];
 if(!c.ok){D.fb=`<div class="fb no"><b>No encaja.</b> ${esc(c.m)}</div>`;logA("bq","lg",TPL[r].n,false,Object.assign(info,{a:bqHint(o),x:c.m}));return bqDraw()}
 const S1=structuredClone(D.S),o1=S1.G[o.id];let res=null;
 if(r=="hip"){const m=M[0],x=m.hyp?o1.ctx.find(y=>y.d.l==m.hyp):o1.ctx.find(y=>!y.d.l&&eq(y.f,o1.g));if(!x){D.fb=`<div class="fb no"><b>No encaja.</b> ${esc(P(o1.g))} no es una premisa del ejercicio: si es una suposición, elegila con sus corchetes.</div>`;logA("bq","lg","Hipótesis",false,Object.assign(info,{a:"elegir la suposición con corchetes",x:"hoja sin corchetes"}));return bqDraw()}sol(S1,o1,x.d)}
 else if(c.cust=="E∧"){o1.how={k:"E∧"};const q=mk(S1,o1.id,M[0].f,o1.ctx);o1.subs.push(q.id);closeSubs(S1,o1,r,M)}
 else if(c.cust=="E∨"){const f=M[0].f,n1=++S1.lab,n2=++S1.lab,hy=(f,n)=>({f,d:nd(f,"hip",[],""+n)});o1.how={k:"E∨",l:n1+","+n2,fd:null};
  [[f,[]],[o1.g,[hy(f.l,n1)]],[o1.g,[hy(f.r,n2)]]].forEach(([g2,h2])=>{const q=mk(S1,o1.id,g2,o1.ctx.concat(h2));o1.subs.push(q.id)});closeSubs(S1,o1,r,M)}
 else{NOAUTO=true;res=mv(S1,o1,c.run[0],c.run[1]);NOAUTO=false;if(!(res&&res.blocked)){if(c.run[0]=="E¬b")o1.subs.reverse();closeSubs(S1,o1,r,M)}/* E¬: φ a la izquierda, ¬φ a la derecha, como se eligió */if(res&&res.blocked){D.fb=`<div class="fb no"><b>No encaja.</b> ${esc(res.m)}</div>`;logA("bq","lg",TPL[r].n,false,Object.assign(info,{a:bqHint(o),x:res.m}));return bqDraw()}}
 D.H.push(D.S);D.S=S1;
 if(res&&res.warn){D.fb=`<div class="fb no"><b>Ojo:</b> ${esc(res.m)} Podés deshacer.</div>`;logA("bq","lg",TPL[r].n,false,Object.assign(info,{a:"Deshacer y elegir otro camino",x:res.m}))}
 else{D.fb="";logA("bq","lg",TPL[r].n,true,info)}
 if(D.S.G[0].s=="d"){ST.done[E[ex].t]=1;SVQ()}
 bqDraw()}
function bqHint(o){const g=o.g,c=o.ctx.map(x=>x.f),I={and:"I∧",imp:"I→",not:"I¬",or:"I∨",iff:"I↔"};
 if(c.some(f=>eq(f,g)))return`La meta ${P(g)} ya está en «Tengo»: cerrala con Hipótesis.`;
 if(g.k!="bot"&&I[g.k]&&g.k!="or")return`La meta ${P(g)} tiene conector principal ${{and:"∧",imp:"→",not:"¬",iff:"↔"}[g.k]}: se ARMA con su introducción, ${I[g.k]}.`;
 const im=c.find(f=>f.k=="imp"&&eq(f.r,g));if(im)return`Tenés ${P(im)}, que termina en la meta: E→ con premisas ${P(im)} y ${P(im.l)}.`;
 const cj=c.find(f=>f.k=="and"&&(eq(f.l,g)||eq(f.r,g)));if(cj)return`${P(g)} es parte de ${P(cj)}: E∧ con premisa ${P(cj)}.`;
 if(g.k=="bot"){const n=c.find(f=>f.k=="not");return n?`La meta es ⊥: E¬ con una fórmula y su negación (por ejemplo ${P(n.a)} y ${P(n)}).`:"La meta es ⊥: E¬ con una fórmula φ y su negación ¬φ."}
 const dj=c.find(f=>f.k=="or");if(dj)return`Tenés la disyunción ${P(dj)}: E∨ (una rama por lado, en cada una probás ${P(g)}).`;
 if(g.k=="or")return`I∨ solo si sabés qué lado vale (${P(g.l)} o ${P(g.r)}); si no, RAA suponiendo ${P(NG(g))}.`;
 if(c.some(f=>f.k=="bot"))return`Tenés ⊥: E⊥ te da ${P(g)}.`;
 return`Nada directo para ${P(g)}: RAA (suponés ${P(NG(g))} y arriba queda ⊥).`}
function bqNS(){const o=curG(),hn=bqHint(o),th=typeof swTeo=="function"?swTeo({s:"lg",g:"",ctx:""},{q:hn+" "+P(o.g),a:"",x:""}):"";
 D.fb=`<div class="fb no"><b>Pista:</b> ${esc(hn)}${th}</div>`;logA("bq","lg","No sé",false,{q:"Meta: "+P(o.g)+" · Tengo: "+ctxTxt(o),x:E[ex].t,a:hn,p:"No sé",ns:1});bqDraw()}
V.addEventListener("click",ev=>{if(TAB!=6)return;const b=ev.target.closest("[data-b]");if(!b)return;const w=b.dataset.b;
 if(w=="g"){D.cur=+b.dataset.i;D.r=null;D.m=[];D.fb="";bqDraw()}
 else if(w=="r"){D.r=b.dataset.v;D.m=[];D.fb="";bqDraw()}
 else if(w=="m"){const o=curG(),v=b.dataset.v;let m;if(v[0]=="H"){const x=o.ctx.find(y=>y.d.l==v.slice(1));m={f:x.f,hyp:x.d.l}}else m={f:pool(o).concat(o.ctx.map(x=>x.f)).find(x=>P(x)==v)};D.m.push(m);if(D.m.length>=TPL[D.r].m.length)bqDo();else bqDraw()}
 else if(w=="mb"){D.m.pop();bqDraw()}
 else if(w=="cx"){D.r=null;D.m=[];bqDraw()}
 else if(w=="un"&&D.H.length){D.S=D.H.pop();D.fb="";D.r=null;D.m=[];bqDraw()}
 else if(w=="rs"){D=nw(ex);bqDraw()}
 else if(w=="ns")bqNS();
 else if(w=="ex"){ex=+b.dataset.i;D=nw(ex);bqDraw()}
 else if(w=="nx"){ex=(ex+1)%E.length;D=nw(ex);bqDraw()}});
(()=>{const st=document.createElement("style");st.textContent=".bqt{overflow-x:auto;text-align:center}.bqh{font:inherit;font-family:var(--m);border:2px dashed var(--ac);border-radius:8px;background:var(--card);color:var(--fg);padding:2px 10px;cursor:pointer;white-space:nowrap}.bqh.on{background:var(--ac);color:var(--onac);border-style:solid}.bqr{border-top-style:dashed}.bqb{font-family:var(--m);font-weight:600}.bqhy{font-family:var(--m);border-color:var(--ac)}.bqc{display:inline-block;font-family:var(--m);border:1px solid var(--bd);border-radius:6px;padding:0 6px;margin:2px 2px 0 0;color:var(--fg)}";document.head.appendChild(st)})();

return{bqOpen};

})();
const bqOpen=BQ.bqOpen;
