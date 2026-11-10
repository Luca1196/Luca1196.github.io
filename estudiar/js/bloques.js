/* SECCIÓN BLOQUES (pestaña 6, en prueba): derivaciones armando el árbol con bloques, estilo Scratch.
   Los bloques SON el árbol: cada meta abierta es un hueco (punteado); al tocarlo y elegir una regla, aparece la raya con sus premisas como huecos nuevos.
   Se construye hacia atrás desde la meta; «Usar lo que tengo» aplica eliminaciones sobre hipótesis (lo derivado aparece en el árbol cuando se usa).
   MOTOR: copia literal de logica.html (pf/pr/fv/sb/ff/entails/tp y mk/sol/cl0/bld/mv/PM/pl/hint). Si cambia allá, recopiar el bloque entre las marcas.
   Errores: logA("bq",...). «No sé»: hint(o) + teoría THT (swTeo). Progreso: localStorage "bq1". v1: solo ejercicios proposicionales (E). */
const BQ=(()=>{
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
const cl0=(S,o)=>{const q=has(o.ctx,o.g);if(q&&o.s=="o")sol(S,o,q.d)};
function bld(p,S){const h=p.how,k=h.k,ds=p.subs.map(i=>S.G[i].d),g=p.g;
switch(k){case"I→":case"I¬":case"RAA":return nd(g,k,ds,h.l);case"I∀":case"I∃":return nd(g,k,ds,"",h.s);case"E¬b":return nd(g,"E¬",ds);case"E→b":return nd(g,"E→",ds);case"E∨":return nd(g,"E∨",[h.fd,...ds],h.l);case"E∃":return nd(g,"E∃",[h.fd,...ds],h.l,h.s);default:return nd(g,k,ds)}}
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
/* ---------- Paleta ---------- */
const BK=[["Armar la meta",[["I∧","I∧"],["I→","I→"],["I¬","I¬"],["I∨","I∨"],["I↔","I↔"],["RAA","RAA"],["E⊥","E⊥ (de ⊥)"]]],
 ["Usar una hipótesis para llegar a la meta",[["E→b","E→: uso A→meta, busco A"],["E¬b","E¬ (meta ⊥): uso ¬φ, busco φ"]]],
 ["Desarmar lo que tengo",[["E∧","E∧"],["E→f","E→ (ya tengo A)"],["E¬f","E¬ (ya tengo φ y ¬φ)"],["E∨","E∨ (casos)"]]]];
const BQ4=[["I∀","I∀"],["I∃","I∃"],["E∀","E∀"],["E∃","E∃"]];
const PQ={f:"¿Sobre cuál de lo que tengo?",t:"¿Con qué término?",s:"¿Qué lado probás?","φ":"¿Qué fórmula φ?"},
 PQR={"E→b":"¿Qué implicación usás? (la nueva meta será su antecedente)","E¬b":"¿Qué negación usás? (la nueva meta será lo que está bajo el ¬)"};
/* Opciones de E→/E¬ hacia atrás expresadas como «uso X, busco Y» (el motor recibe φ = lo que hay que buscar) */
function opts(r,k,o){if(k!="φ"||!(r=="E→b"||r=="E¬b")||D.all)return pl(k,o);const g=pr(o.g);let L=[];
 if(r=="E→b")L=o.ctx.filter(x=>x.f.k=="imp"&&pr(x.f.r)==g).map(x=>[pr(x.f.l),"uso "+pr(x.f)+" · busco "+pr(x.f.l)]);
 else L=o.ctx.filter(x=>x.f.k=="not").map(x=>[pr(x.f.a),"uso "+pr(x.f)+" · busco "+pr(x.f.a)]).concat(o.ctx.filter(x=>x.f.k!="not"&&x.f.k!="bot").map(x=>[pr(x.f),"uso "+pr(x.f)+" · busco ¬"+pr(x.f)]));
 return L.concat([["__all",L.length?"Otra (elegir la fórmula a buscar)":"No tengo ninguna: elegir la fórmula a buscar"]])}
function bqOpen(){if(!D)D=nw(ex);bqDraw()}
function bqDraw(){const S=D.S,root=S.G[0],done=root.s=="d",o=done?null:curG();if(o)D.cur=o.id;const e=E[ex];
 let h=`<div class="s-lg"><div class="row" style="flex-wrap:wrap;gap:6px">${E.map((x,i)=>`<button class="btn chip${i==ex?" sel":""}" data-b="ex" data-i="${i}">${esc(x.t)}${ST.done[x.t]?" ✓":""}</button>`).join("")}</div>
 <div class="sn" style="margin-top:10px">${e.P.length?esc(e.P.join(", "))+" ":""}⊢ ${esc(e.g)}</div>
 <div class="sn pft bqt"><div style="display:inline-block;padding-right:52px">${rg(root,o&&o.id)}</div></div>`;
 if(done){h+=`<div class="fb ok"><b>¡Árbol completo!</b> Revisá cada raya: regla, premisas y qué cancela.</div><div class="row" style="gap:8px"><button class="btn pri" data-b="nx">Siguiente ejercicio</button><button class="btn" data-b="rs">Repetir</button></div></div>`;V.innerHTML=h;return}
 const r=D.r,need=r?PM(r,o):[],k=need[D.a.length];
 h+=`<div class="card" style="margin-top:10px"><div class="lbl">Meta seleccionada (tocá otro hueco para cambiar)</div><div class="qt" style="margin:4px 0">${esc(pr(o.g))}</div>
 <div class="mut" style="font-size:14px">Tengo: ${o.ctx.length?o.ctx.map(x=>`<span class="bqc">${x.d.l?"["+esc(pr(x.f))+"]"+sup(x.d.l):esc(pr(x.f))}</span>`).join(" "):"nada"}</div>`;
 if(r&&k)h+=`<div class="lbl" style="margin-top:10px">${esc(RN(r))} · ${(!D.all&&PQR[r]&&k=="φ")?PQR[r]:PQ[k]}</div><div class="row" style="flex-wrap:wrap;gap:6px">${opts(r,k,o).map(([v,t])=>`<button class="btn chip" data-b="p" data-v="${esc(String(v))}">${esc(t)}</button>`).join("")}</div><button class="btn ghost" data-b="cx">Cancelar</button>`;
 else h+=(e.q?[["Cuantificadores",BQ4]]:[]).concat(BK).map(([t,L])=>`<div class="lbl" style="margin-top:10px">${t}</div><div class="row" style="flex-wrap:wrap;gap:6px">${L.map(([id,tx])=>`<button class="btn bqb" data-b="r" data-v="${id}">${esc(tx)}</button>`).join("")}</div>`).join("");
 h+=`${D.fb}<div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn" data-b="ns">No sé</button><button class="btn" data-b="un"${D.H.length?"":" disabled"}>Deshacer</button><button class="btn ghost" data-b="rs">Reiniciar</button></div></div></div>`;
 V.innerHTML=h;const t=V.querySelector(".bqh.on");if(t)try{t.scrollIntoView({block:"nearest",inline:"center"})}catch(_){}}
const ctxTxt=o=>o.ctx.map(x=>pr(x.f)).join(", ")||"nada";
function bqApply(){const o=curG(),r=D.r,a=D.a.map((v,i)=>PM(r,o)[i]=="f"||PM(r,o)[i]=="s"?+v:v),S1=structuredClone(D.S),res=mv(S1,S1.G[o.id],r,a),info={q:"Meta: "+pr(o.g)+" · Tengo: "+ctxTxt(o),x:E[ex].t};
 D.r=null;D.a=[];
 if(res&&res.blocked){D.fb=`<div class="fb no"><b>No encastra.</b> ${esc(res.m)}</div>`;logA("bq","lg",RN(r),false,Object.assign(info,{a:hint(o),p:RN(r)+(a.length?" "+a.join(", "):""),x:res.m}));bqDraw();return}
 D.H.push(D.S);D.S=S1;
 if(res&&res.warn){D.fb=`<div class="fb no"><b>Ojo:</b> ${esc(res.m)} Podés deshacer.</div>`;logA("bq","lg",RN(r),false,Object.assign(info,{a:"Deshacer y elegir otro camino",p:RN(r),x:res.m}))}
 else{D.fb="";logA("bq","lg",RN(r),true,info)}
 if(D.S.G[0].s=="d"){ST.done[E[ex].t]=1;SVQ()}
 bqDraw()}
function bqNS(){const o=curG(),hn=hint(o),th=typeof swTeo=="function"?swTeo({s:"lg",g:"",ctx:""},{q:hn+" "+pr(o.g),a:"",x:""}):"";
 D.fb=`<div class="fb no"><b>Pista:</b> ${esc(hn)}${th}</div>`;logA("bq","lg","No sé",false,{q:"Meta: "+pr(o.g)+" · Tengo: "+ctxTxt(o),x:E[ex].t,a:hn,p:"No sé",ns:1});bqDraw()}
V.addEventListener("click",ev=>{if(TAB!=6)return;const b=ev.target.closest("[data-b]");if(!b)return;const w=b.dataset.b;
 if(w=="g"){D.cur=+b.dataset.i;D.r=null;D.a=[];D.fb="";bqDraw()}
 else if(w=="r"){D.r=b.dataset.v;D.a=[];D.all=0;D.fb="";const o=curG();if(!PM(D.r,o).length)bqApply();else bqDraw()}
 else if(w=="p"&&b.dataset.v=="__all"){D.all=1;bqDraw()}
 else if(w=="p"){D.a.push(b.dataset.v);const o=curG();if(D.a.length>=PM(D.r,o).length)bqApply();else bqDraw()}
 else if(w=="cx"){D.r=null;D.a=[];bqDraw()}
 else if(w=="un"&&D.H.length){D.S=D.H.pop();D.fb="";D.r=null;D.a=[];bqDraw()}
 else if(w=="rs"){D=nw(ex);bqDraw()}
 else if(w=="ns")bqNS();
 else if(w=="ex"){ex=+b.dataset.i;D=nw(ex);bqDraw()}
 else if(w=="nx"){ex=(ex+1)%E.length;D=nw(ex);bqDraw()}});
(()=>{const st=document.createElement("style");st.textContent=".bqt{overflow-x:auto;text-align:center}.bqh{font:inherit;font-family:var(--m);border:2px dashed var(--ac);border-radius:8px;background:var(--card);color:var(--fg);padding:2px 10px;cursor:pointer;white-space:nowrap}.bqh.on{background:var(--ac);color:var(--onac);border-style:solid}.bqr{border-top-style:dashed}.bqb{font-family:var(--m);font-weight:600}.bqc{display:inline-block;font-family:var(--m);border:1px solid var(--bd);border-radius:6px;padding:0 6px;margin:2px 2px 0 0;color:var(--fg)}";document.head.appendChild(st)})();
return{bqOpen};

})();
const bqOpen=BQ.bqOpen;
