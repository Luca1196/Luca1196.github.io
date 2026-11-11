/* =====================================================================================================
   DECISIONES DIDÁCTICAS DE BLOQUES (acordadas con Luca, nov 2026). Respetarlas al reciclar este código.
   -----------------------------------------------------------------------------------------------------
   1. Los bloques SON el árbol de Gentzen (hojas arriba, raíz abajo). No hay un árbol aparte: lo que se ve es lo que
      se escribiría en el examen. Cada meta abierta es un hueco punteado; se selecciona tocándolo.
   2. Se arma hacia atrás desde la meta, con BOTONES. Se probó arrastrar bloques y se descartó por incómodo (celular).
   3. NADA AUTOMÁTICO. El estudiante elige la regla y después CADA miembro (cada premisa, qué supone, qué queda arriba)
      de una lista de fórmulas. Se probaron y descartaron: que tocar una hipótesis eligiera la regla sola, y que la app
      armara pares de premisas: confundía y no hacía practicar.
   4. Validar por lo que EXIGE la regla, no por posiciones fijas ni por una solución guardada: E→ y E¬ aceptan las premisas
      en cualquier orden; en E∨ se elige qué supone cada rama. El árbol respeta el orden elegido (sw invierte subs).
      Así cualquier ejercicio nuevo admite todas las derivaciones válidas sin tocar código.
   5. Suposiciones con corchetes: [φ]ⁿ es un botón aparte (borde de color). La hoja se cierra solo si se elige con
      corchetes (para practicar escribirlos). φ sin corchetes deja un hueco. Las premisas del ejercicio no llevan
      corchetes y, al elegirlas, quedan como hoja (sin paso extra «Hipótesis»).
   6. Cada hueco de una rama muestra su suposición («rama con [p]¹») y el panel dice «En esta rama suponés…»:
      sin eso no se distinguía qué rama de un E∨/E∃ era cuál.
   7. Mensajes de error que ENSEÑAN: explican la regla (de A→B y A sale B; la meta va abajo de la raya) y distinguen
      ARMAR (introducción: la fórmula está en la meta) de USAR (eliminación: la fórmula está en lo que tengo), que es la
      confusión más repetida de Luca (E→ vs I→). Al fallar se muestra además la pista 💡 de esa meta.
   8. «No sé» = pista con el vocabulario de los botones (bqHint, no el del motor viejo) + teoría del tema (THT/swTeo).
      Para ⊥ la pista busca el par concreto: negación que tenés, negación escondida en una ∧, o E∨ con meta ⊥.
   9. Ejercicios por grupos con PREVIAS (req): cada compuesto tiene sus pasos intermedios como ejercicios propios
      (ej. «contradecir una ∧ con una →», «desarmar un ∨ para llegar a ⊥»). En esta pestaña todo está desbloqueado;
      las previas rigen en Deslizar (tarjetas «Árbol · …» que aparecen al acertar sus previas sin errores) y se ven en
      el «Mapa de previas». Al agregar un ejercicio compuesto: extraer sus pasos intermedios y ponerlos en req.
  10. «Copiar para Claude» copia el árbol actual en texto para consultar en el chat.
   ===================================================================================================== */
/* SECCIÓN BLOQUES (pestaña 6, en prueba): derivaciones armando el árbol con bloques, estilo Scratch.
   Los bloques SON el árbol: cada meta abierta es un hueco (punteado); al tocarlo y elegir una regla, aparece la raya con sus premisas como huecos nuevos.
   Se construye hacia atrás: el usuario elige la regla y después CADA miembro (premisas y suposición) de una lista de fórmulas (pool); chk() valida por lo que exige la regla (no por posiciones fijas: E→, E¬ aceptan cualquier orden; en E∨ el usuario elige qué supone cada rama) y el árbol respeta el orden elegido (sw invierte subs). Al agregar ejercicios no hace falta acomodar nada. Hojas: una premisa del ejercicio elegida queda como hoja; una SUPOSICIÓN solo si se elige con corchetes [φ]ⁿ (botón aparte); elegir φ sin corchetes deja un hueco (closeSubs); «Hipótesis» sirve para cerrar a mano un hueco que es una hipótesis. Nada se aplica automáticamente (pedido de Luca).
   MOTOR: copia literal de logica.html (pf/pr/fv/sb/ff/entails/tp y mk/sol/cl0/bld/mv/PM/pl/hint). Si cambia allá, recopiar el bloque entre las marcas.
   Errores: logA("bq",...). «No sé»: hint(o) + teoría THT (swTeo). Progreso: localStorage "bq1". Ejercicios en E con grp y req (previas): ver comentario sobre E. */
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
/* Ejercicios por grupos con PREVIAS (req): un compuesto se desbloquea al resolver sus pasos intermedios.
   Para agregar un ejercicio compuesto: extraer sus pasos intermedios (subderivaciones con sus hipótesis) como ejercicios propios del mismo grupo y ponerlos en req. */
const SD="α∨(β∧¬γ)",H="¬α→¬(β→γ)";
const E=[
{t:"Conmutar ∧",g:"q∧p",P:["p∧q"],req:[],grp:"Base"},
{t:"Usar → dos veces",g:"σ",P:["φ→ψ","ψ→σ","φ"],req:[],grp:"Base"},
{t:"Cadena de →",g:"φ→σ",P:["φ→ψ","ψ→σ"],req:["Usar → dos veces"],grp:"Base"},
{t:"Choque directo",g:"⊥",P:["φ","¬φ"],req:[],grp:"Base"},
{t:"De ⊥ sale cualquiera",g:"q",P:["p","¬p"],req:["Choque directo"],grp:"Base"},
{t:"Silogismo disyuntivo",g:"q",P:["p∨q","¬p"],req:["De ⊥ sale cualquiera"],grp:"Base"},
{t:"Choque con ¬¬φ",g:"⊥",P:["¬¬φ","¬φ"],req:["Choque directo"],grp:"Base"},
{t:"Doble negación",g:"φ",P:["¬¬φ"],req:["Choque con ¬¬φ"],grp:"Base"},
{t:"Choque en una ∧",g:"⊥",P:["φ∧¬φ"],req:["Choque directo"],grp:"Base"},
{t:"No contradicción",g:"¬(φ∧¬φ)",P:[],req:["Choque en una ∧"],grp:"Base"},
{t:"Modus tollens: choque",g:"⊥",P:["p→q","¬q","p"],req:["Choque directo"],grp:"Base"},
{t:"Contrarrecíproca",g:"(p→q)→(¬q→¬p)",P:[],req:["Modus tollens: choque"],grp:"Base"},
{t:"Choque ∧ y →",g:"⊥",P:["β∧¬γ","β→γ"],req:["Choque directo"],grp:"Patrones de contradicción"},
{t:"Choque ∧ y → (2)",g:"⊥",P:["p∧q","p→¬q"],req:["Choque ∧ y →"],grp:"Patrones de contradicción"},
{t:"Choque por casos",g:"⊥",P:["p∨q","¬p","¬q"],req:["Choque directo"],grp:"Patrones de contradicción"},
{t:"Casos con →",g:"⊥",P:["p∨q","p→r","q→r","¬r"],req:["Choque por casos"],grp:"Patrones de contradicción"},
{t:"Núcleo de 3a",g:"⊥",P:["α∨(β∧¬γ)","¬α","β→γ"],req:["Choque ∧ y →", "Choque por casos"],grp:"Patrones de contradicción"},
{t:"Chocar con ¬(φ∨¬φ)",g:"⊥",P:["¬(φ∨¬φ)","φ"],req:[],grp:"Tercero excluido"},
{t:"Probar ¬φ desde ¬(φ∨¬φ)",g:"¬φ",P:["¬(φ∨¬φ)"],req:["Chocar con ¬(φ∨¬φ)"],grp:"Tercero excluido"},
{t:"Tercero excluido",g:"φ∨¬φ",P:[],req:["Probar ¬φ desde ¬(φ∨¬φ)"],grp:"Tercero excluido"},
{t:"Sacar p de la ∧",g:"p",P:["(p→q)∧(¬r→p)","¬r"],req:[],grp:"Febrero 3a"},
{t:"Sacar q encadenando",g:"q",P:["(p→q)∧(¬r→p)","¬r"],req:["Sacar p de la ∧"],grp:"Febrero 3a"},
{t:"Choque con ¬q",g:"⊥",P:["(p→q)∧(¬r→p)","¬q","¬r"],req:["Sacar q encadenando"],grp:"Febrero 3a"},
{t:"RAA para r",g:"r",P:["(p→q)∧(¬r→p)","¬q"],req:["Choque con ¬q"],grp:"Febrero 3a"},
{t:"Febrero 3a",g:"((p→q)∧(¬r→p))→(¬q→r)",P:[],req:["RAA para r"],grp:"Febrero 3a"},
{t:"Probar ¬(β→γ)",g:"¬(β→γ)",P:["α∨(β∧¬γ)","¬α"],req:["Núcleo de 3a"],grp:"3a"},
{t:"3a ←",g:`(${SD})→(${H})`,P:[],req:["Probar ¬(β→γ)"],grp:"3a"},
{t:"Chocar con ¬(α∨…) desde α",g:"⊥",P:[`¬(${SD})`,"α"],req:[],grp:"3a"},
{t:"Probar ¬α",g:"¬α",P:[`¬(${SD})`],req:["Chocar con ¬(α∨…) desde α"],grp:"3a"},
{t:"Chocar desde β y ¬γ",g:"⊥",P:[`¬(${SD})`,"β","¬γ"],req:["Chocar con ¬(α∨…) desde α"],grp:"3a"},
{t:"Probar γ por RAA",g:"γ",P:[`¬(${SD})`,"β"],req:["Chocar desde β y ¬γ"],grp:"3a"},
{t:"Probar β→γ",g:"β→γ",P:[`¬(${SD})`],req:["Probar γ por RAA"],grp:"3a"},
{t:"Núcleo de 3a →",g:"⊥",P:[`${H}`,`¬(${SD})`],req:["Probar ¬α", "Probar β→γ"],grp:"3a"},
{t:"3a →",g:`(${H})→(${SD})`,P:[],req:["Núcleo de 3a →"],grp:"3a"},
{t:"3a completo",g:`(${H})↔(${SD})`,P:[],req:["3a ←", "3a →"],grp:"3a"},
{t:"Sacar P(f(x)) de ψ",g:"P(f(x))",P:["(∀x)P(f(x)) ∧ (∃z)¬P(z)"],req:[],grp:"2c"},
{t:"Instanciar con f(x)",g:"¬P(f(x))",P:["(∀x)¬P(x)"],req:[],grp:"2c"},
{t:"Choque en 2c",g:"⊥",P:["(∀x)P(f(x)) ∧ (∃z)¬P(z)","(∀x)¬P(x)"],req:["Sacar P(f(x)) de ψ", "Instanciar con f(x)"],grp:"2c"},
{t:"Q(x) desde ⊥",g:"Q(x)",P:["(∀x)P(f(x)) ∧ (∃z)¬P(z)","(∀x)¬P(x)"],req:["Choque en 2c"],grp:"2c"},
{t:"2c",g:"(∀x)Q(x)",P:["(∀x)P(f(x)) ∧ (∃z)¬P(z)","(∀x)¬P(x)"],req:["Q(x) desde ⊥"],grp:"2c"},
{t:"E∀ tres veces",g:"R(x,x)∧R(x,x)→P(x,x)",P:["(∀x)(∀y)(∀z)(R(x,y)∧R(x,z)→P(y,z))"],req:[],grp:"3b"},
{t:"Usar la ∀∀∀ con R(x,x)",g:"P(x,x)",P:["R(x,x)","(∀x)(∀y)(∀z)(R(x,y)∧R(x,z)→P(y,z))"],req:["E∀ tres veces"],grp:"3b"},
{t:"I∃ con testigo x",g:"(∃x)P(x,x)",P:["R(x,x)","R(x,x)∧R(x,x)→P(x,x)"],req:["Usar la ∀∀∀ con R(x,x)"],grp:"3b"},
{t:"3b",g:"(∃x)P(x,x)",P:["(∃x)R(x,x)","(∀x)(∀y)(∀z)(R(x,y)∧R(x,z)→P(y,z))"],req:["I∃ con testigo x"],grp:"3b"}];
E.forEach(e=>{e.PA=e.P.map(pf);e.GA=pf(e.g);e.q=/[∀∃]/.test(e.P.join("")+e.g)});
let ex=0;
/* ---------- Estado ---------- */
let ST=(()=>{try{return JSON.parse(localStorage.getItem("bq1")||"{}")}catch(e){return{}}})();ST.done=ST.done||{};
const SVQ=()=>{try{localStorage.setItem("bq1",JSON.stringify(ST))}catch(e){}};
let D=null;/* {S, H:[pilas para deshacer], cur, r (regla elegida), a (parámetros), fb (html de feedback)} */
/* Pestaña Bloques: todo desbloqueado (pedido 10/11). Las previas (req) se usan en Deslizar: una tarjeta «Árbol · …» aparece recién cuando sus previas se acertaron sin errores ahí. */
const unl=i=>true;
const nextEx=()=>{for(let k=1;k<=E.length;k++){const j=(ex+k)%E.length;if(unl(j)&&!ST.done[E[j].t])return j}return(ex+1)%E.length};
const nw=i=>{const e=E[i],S={G:[],lab:0,log:[]},o=mk(S,null,e.GA,e.PA.map(f=>({f,d:nd(f,"hip")})));cl0(S,o);return{S,H:[],cur:null,r:null,a:[],fb:""}};
const lf=S=>{const r=[],w=o=>o.subs.length?o.subs.forEach(i=>w(S.G[i])):o.s=="o"&&r.push(o);w(S.G[0]);return r};
const curG=()=>{const L=lf(D.S);return L.find(x=>x.id==D.cur)||L[0]};
/* ---------- Árbol: los bloques SON el árbol (hojas arriba, raíz abajo; los huecos son metas abiertas) ---------- */
const RN=r=>({"E¬b":"E¬","E→b":"E→","hip":""}[r]??r);
const sup=l=>l?`<sup>${esc(l)}</sup>`:"";
function rd(d){if(d.r=="hip")return`<span class="pf">${d.l?"["+esc(d.f)+"]"+sup(d.l):esc(d.f)}</span>`;
 return`<div class="pt"><div class="pk">${d.c.map(rd).join("")}</div><div class="pr"><span class="pn">${esc(RN(d.r))}${sup(d.l)}</span></div><span class="pf">${esc(d.f)}</span></div>`}
const newSup=o=>{if(o.par==null)return[];const p=D.S.G[o.par];return o.ctx.slice(p.ctx.length).filter(x=>x.d.l)};
const supTxt=o=>newSup(o).map(x=>"["+esc(pr(x.f))+"]"+sup(x.d.l)).join(" ");
function rg(o,cu){const S=D.S;if(o.s=="d")return rd(o.d);
 if(!o.how){const sp=supTxt(o);return`<div class="pt">${sp?`<span class="bqsp">rama con ${sp}</span><span class="pd">⋮</span>`:""}<button class="bqh${o.id==cu?" on":""}" data-b="g" data-i="${o.id}" aria-label="Meta abierta ${esc(pr(o.g))}">${esc(pr(o.g))}</button></div>`}
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
 "E→":{n:"E→",m:["Premisa izquierda","Premisa derecha"],ay:"Las premisas son una implicación A→meta y su antecedente A (lo de la izquierda de →), en el orden que quieras."},
 "E¬":{n:"E¬",m:["Premisa izquierda","Premisa derecha"],ay:"Las premisas son una fórmula φ y su negación ¬φ, en el orden que quieras."},
 "E∧":{n:"E∧",m:["Premisa: la conjunción"]},
 "E∨":{n:"E∨",m:["Premisa: la disyunción A∨B","Rama izquierda: ¿qué suponés?","Rama derecha: ¿qué suponés?"],ay:"Cada rama supone un lado de la disyunción y llega a la meta."},
 "E⊥":{n:"E⊥",m:["¿Qué queda arriba de la raya?"]},
 "I∀":{n:"I∀",m:["¿Qué queda arriba de la raya?"],ay:"Arriba va la fórmula sin el ∀, con la misma variable. Condición: la variable no puede estar libre en una hipótesis abierta."},
 "E∀":{n:"E∀",m:["Premisa: el ∀ que usás (de lo que tenés)","¿Con qué término t lo instanciás?"],k:["ctx","t"],ay:"E∀ saca la instancia φ(t) de un (∀x)φ que tenés. Si la instancia es la meta, la cierra; si no, queda en «Tengo». Condición: t libre para x."},
 "I∃":{n:"I∃",m:["¿Con qué término t (el testigo)?"],k:["t"],ay:"Para probar (∃x)φ alcanza con probar φ(t). Arriba queda φ(t). Condición: t libre para x."},
 "E∃":{n:"E∃",m:["Premisa: el ∃ que usás (de lo que tenés)"],k:["ctx"],ay:"E∃ suponé la fórmula sin el ∃ (con su variable) y llegá a la misma meta; esa suposición se cancela. Condición: la variable no libre en la meta ni en otras hipótesis abiertas."}};
const BK=[["Cerrar una hoja",["hip"]],["Introducción (arma la meta)",["I∧","I→","I¬","I∨","I↔","RAA"]],["Eliminación (usa una fórmula)",["E→","E¬","E∧","E∨","E⊥"]]],BKQ=["Cuantificadores",["I∀","E∀","I∃","E∃"]];
const P=pr,eq=(a,b)=>P(a)==P(b),MS=m=>m.t?"t = "+m.t:m.hyp?"["+P(m.f)+"]"+m.hyp:P(m.f),MSH=m=>m.t?"t = "+esc(m.t):m.hyp?"["+esc(P(m.f))+"]"+sup(m.hyp):esc(P(m.f));
/* cierre de hojas: una premisa del ejercicio (sin etiqueta) elegida queda como hoja; una suposición solo si la elegiste con corchetes [φ]ⁿ */
function closeSubs(S1,o1,r,M){const mem=["I→","I¬","RAA"].includes(r)?M.slice(1):r=="E∨"?[M[0]]:M;
 o1.subs.forEach((id,i)=>{const q=S1.G[id],m=mem[i];if(!m||q.s!="o")return;const x=m.hyp?q.ctx.find(y=>y.d.l==m.hyp&&eq(y.f,q.g)):q.ctx.find(y=>!(y.d.r=="hip"&&y.d.l)&&eq(y.f,q.g));if(x)sol(S1,q,x.d)})}
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
 case"E→":{const i=[0,1].find(j=>M[j].k=="imp"&&eq(M[j].r,g)&&eq(M[1-j],M[j].l));if(i!==undefined)return{ok:1,run:["E→b",[P(M[1-i])]],sw:i==1};
  const im=M.find(f=>f.k=="imp");return !im?bad(`E→ necesita una implicación entre las premisas; ${P(M[0])} y ${P(M[1])} no lo son.`):!eq(im.r,g)?bad(`${P(im)} da ${P(im.r)}, pero la meta es ${P(g)}.`):bad(`E→ funciona así: de A→B y A se obtiene B. Con ${P(im)}, A es ${P(im.l)} (lo de la izquierda de la flecha), así que la otra premisa es ${P(im.l)}.${M.some(f=>eq(f,g))?" "+P(g)+" es lo que se obtiene: va abajo de la raya, no arriba.":""}`)}
 case"E¬":{if(g.k!="bot")return bad(`E¬ concluye ⊥, y la meta es ${P(g)}.`);const i=[0,1].find(j=>eq(M[1-j],NG(M[j])));return i===undefined?bad(`Las premisas de E¬ son una fórmula y su negación (φ y ¬φ); ${P(M[0])} y ${P(M[1])} no lo son.`):{ok:1,run:["E¬b",[P(M[i])]],sw:i==0}}
 case"E∧":return M[0].k!="and"?bad(`E∧ usa una conjunción; ${P(M[0])} no lo es.`):eq(M[0].l,g)||eq(M[0].r,g)?{ok:1,cust:"E∧"}:o.ctx.some(x=>eq(x.f,M[0])&&!(x.d.r=="hip"&&x.d.l))?{ok:1,cust:"E∧f"}:bad(`${P(M[0])} no tiene a ${P(g)} como parte, y no la tenés para separarla.`);
 case"I∀":return g.k!="all"?bad(`I∀ arma un (∀x)φ y la meta ${P(g)} no lo es.`):eq(M[0],g.a)?{ok:1,run:["I∀",[]]}:bad(`Con I∀, arriba va la fórmula sin el ∀ y con la misma variable: ${P(g.a)}.`);
 case"E∀":{if(M[0].k!="all")return bad(`E∀ usa un (∀x)φ; ${P(M[0])} no lo es.`);return{ok:1,cust:"E∀"}}
 case"I∃":return g.k!="ex"?bad(`I∃ arma un (∃x)φ y la meta ${P(g)} no lo es.`):{ok:1,run:["I∃",[MM[0].t]]};
 case"E∃":return M[0].k!="ex"?bad(`E∃ usa un (∃x)φ; ${P(M[0])} no lo es.`):{ok:1,cust:"E∃"};
 case"E∨":return M[0].k!="or"?bad(`E∨ usa una disyunción; ${P(M[0])} no lo es.`):(eq(M[1],M[0].l)&&eq(M[2],M[0].r))||(eq(M[1],M[0].r)&&eq(M[2],M[0].l))?{ok:1,cust:"E∨"}:bad(`Cada rama supone un lado de ${P(M[0])}: una ${P(M[0].l)} y la otra ${P(M[0].r)}.`);
 case"E⊥":return g.k=="bot"?bad("La meta ya es ⊥."):M[0].k!="bot"?bad("E⊥ parte de ⊥: arriba va ⊥."):{ok:1,run:["E⊥",[]]}}}
/* fórmulas candidatas para elegir: lo que tengo, la meta, sus subfórmulas, sus negaciones y ⊥ */
function pool(o){const m={},add=f=>{m[P(f)]=f};Object.values(FPm(o)).forEach(f=>{add(f);if(f.k!="not"&&f.k!="bot")add(NG(f))});add(BOT);o.ctx.forEach(x=>add(x.f));
 return Object.values(m).sort((a,b)=>P(a).length-P(b).length||P(a).localeCompare(P(b)))}
/* Modo incrustado: una tarjeta de Deslizar arma un árbol corto acá adentro (EMB = {el, cb, err}) */
let EMB=null;const OUT=()=>EMB?EMB.el:V;
/* Mapa de previas (pestaña Bloques): grafo por grupo; flecha = «es previa de». Nodo: ✓ resuelto en Bloques, ★ acertado sin errores en Deslizar. Las previas de otro grupo se ven punteadas. Tocar un nodo abre el ejercicio. */
let MAPV=0;
function mapHtml(g){const own=E.filter(x=>x.grp==g),ids=new Set(own.map(x=>x.t)),ext=[...new Set(own.flatMap(x=>x.req).filter(t=>!ids.has(t)))],N=own.map(x=>x.t).concat(ext),req=t=>ids.has(t)?E.find(x=>x.t==t).req:[],dp={};
 const dep=t=>dp[t]!=null?dp[t]:(dp[t]=req(t).length?1+Math.max(...req(t).map(dep)):0);N.forEach(dep);
 const L=[];N.forEach(t=>{(L[dp[t]]=L[dp[t]]||[]).push(t)});const W=t=>Math.max(60,Math.round(t.length*7.4)+22),HH=34,GY=46,GX=12,pos={};
 let mw=0;L.forEach(r=>{mw=Math.max(mw,r.reduce((a,t)=>a+W(t),0)+GX*(r.length-1))});mw+=20;
const lay=()=>L.forEach((r,d)=>{let x=(mw-(r.reduce((a,t)=>a+W(t),0)+GX*(r.length-1)))/2;r.forEach(t=>{pos[t]={x,y:10+d*(HH+GY),w:W(t)};x+=W(t)+GX})});lay();
 /* menos cruces: ordenar cada capa por el promedio de x de sus previas (dos pasadas) */
 for(let k=0;k<2;k++){L.forEach((r,d)=>{if(!d)return;const c=t=>{const q=req(t).filter(u=>pos[u]);return q.length?q.reduce((a,u)=>a+pos[u].x+pos[u].w/2,0)/q.length:pos[t].x};r.sort((a,b)=>c(a)-c(b))});lay()}
 const H=10+L.length*(HH+GY)-GY+10,bq=(window.S2&&S2.bqok)||{};
 let sv=`<svg width="${mw}" height="${H}" role="img" aria-label="Mapa de previas de ${esc(g)}" style="display:block;margin:auto;font:12px var(--m)"><defs><marker id="pa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="var(--mut)" stroke-width="1.5"/></marker></defs>`;
 N.forEach(t=>req(t).forEach(r=>{const a=pos[r],b=pos[t];if(!a||!b)return;sv+=`<line x1="${a.x+a.w/2}" y1="${a.y+HH}" x2="${b.x+b.w/2}" y2="${b.y-2}" stroke="var(--mut)" stroke-width="1" marker-end="url(#pa)"/>`}));
 N.forEach(t=>{const q=pos[t],i=E.findIndex(x=>x.t==t),dn=ST.done[t],ex2=!ids.has(t),lb=(dn?"✓ ":"")+(bq[t]?"★ ":"")+t;
  sv+=`<g data-b="mx" data-i="${i}" style="cursor:pointer"><rect x="${q.x}" y="${q.y}" width="${q.w}" height="${HH}" rx="8" fill="${dn?"var(--okbg)":"var(--card)"}" stroke="${dn?"var(--ok)":"var(--ac)"}" stroke-width="1"${ex2?' stroke-dasharray="4 3"':""}/><text x="${q.x+q.w/2}" y="${q.y+HH/2+4}" text-anchor="middle" fill="var(--fg)">${esc(lb.length>40?lb.slice(0,39)+"…":lb)}</text></g>`});
 return sv+"</svg>"}
function bqMap(){const GR=[...new Set(E.map(x=>x.grp))],g=D.mg||E[ex].grp;
 OUT().innerHTML=`<div class="s-lg"><div class="row" style="flex-wrap:wrap;gap:6px">${GR.map(x=>`<button class="btn chip${x==g?" sel":""}" data-b="mg" data-v="${esc(x)}">${esc(x)}</button>`).join("")}</div>
 <div class="row between" style="margin-top:8px"><span class="mut" style="font-size:13px">Flecha = «es previa de». ✓ resuelto acá · ★ acertado en Deslizar (abre lo siguiente allá). Punteado: previa de otro grupo.</span><button class="btn" data-b="mp">Volver</button></div>
 <div class="sn" style="overflow-x:auto;padding:8px;margin-top:8px">${mapHtml(g)}</div></div>`}
function bqOpen(){EMB=null;if(!D)D=nw(ex);bqDraw()}
function bqEmbed(t,el,cb){const i=E.findIndex(x=>x.t==t);if(i<0)return;EMB={el,cb,err:0,ns:0,i};ex=i;D=nw(i);bqDraw()}
function bqDraw(){if(MAPV&&!EMB)return bqMap();const S=D.S,root=S.G[0],done=root.s=="d",o=done?null:curG();if(o)D.cur=o.id;const e=E[ex];
 const GR=[...new Set(E.map(x=>x.grp))],cg=D.grp||e.grp,nd2=g=>E.filter(x=>x.grp==g),dn=g=>nd2(g).filter(x=>ST.done[x.t]).length;
 let h=`<div class="s-lg"><div class="row" style="flex-wrap:wrap;gap:6px${EMB?";display:none":""}">${GR.map(g=>`<button class="btn chip${g==cg?" sel":""}" data-b="gr" data-v="${esc(g)}">${esc(g)} <span class="mut">${dn(g)}/${nd2(g).length}</span></button>`).join("")}<button class="btn" data-b="mp">Mapa de previas</button></div>
 <div class="row" style="flex-wrap:wrap;gap:6px;margin-top:8px${EMB?";display:none":""}">${E.map((x,i)=>x.grp!=cg?"":`<button class="btn chip${i==ex?" sel":""}${unl(i)?"":" bqlk"}" data-b="ex" data-i="${i}">${unl(i)?"":"🔒 "}${esc(x.t)}${ST.done[x.t]?" ✓":""}</button>`).join("")}</div>
 <div class="sn" style="margin-top:10px">${e.P.length?esc(e.P.join(", "))+" ":""}⊢ ${esc(e.g)}</div>
 <div class="sn pft bqt"><div style="display:inline-block;padding-right:52px">${rg(root,o&&o.id)}</div></div>`;
 if(done&&EMB){h+=`</div>`;OUT().innerHTML=h;const em=EMB;EMB=null;setTimeout(()=>em.cb(em.err,em.ns),0);return}
 if(done){h+=`<div class="fb ok"><b>¡Árbol completo!</b>${D.unl&&D.unl.length?` Se desbloqueó: ${D.unl.map(esc).join(", ")}.`:""}</div><div class="row" style="gap:8px"><button class="btn pri" data-b="nx">Siguiente ejercicio</button><button class="btn" data-b="rs">Repetir</button><button class="btn" data-b="cp">${D.cpOk?"Copiado ✓":"Copiar para Claude"}</button></div>${D.cp?`<textarea style="width:100%;height:140px;font:12px var(--m);margin-top:8px">${esc(D.cp)}</textarea>`:""}</div>`;D.cpOk=0;OUT().innerHTML=h;return}
 h+=`<div class="card" style="margin-top:10px"><div class="lbl">Meta seleccionada (tocá otro hueco para cambiar)</div><div class="qt" style="margin:4px 0">${esc(P(o.g))}</div>${(()=>{const L=[];let q=o;while(q.par!=null){newSup(q).forEach(x=>L.unshift("["+esc(P(x.f))+"]"+sup(x.d.l)));q=D.S.G[q.par]}return L.length?`<div class="mut" style="font-size:14px">En esta rama suponés: ${L.join(" ")}</div>`:""})()}
 <div class="mut" style="font-size:14px">Tengo: ${o.ctx.length?o.ctx.map(x=>`<span class="bqc">${x.d.l?"["+esc(P(x.f))+"]"+sup(x.d.l):esc(P(x.f))}</span>`).join(" "):"nada"}</div>`;
 const t=D.r&&TPL[D.r];
 if(t){const k=D.m.length,HY=o.ctx.filter(x=>x.d.l).map(x=>[`H${x.d.l}`,"["+esc(P(x.f))+"]"+sup(x.d.l)]),PR=o.ctx.filter(x=>!x.d.l).map(x=>[P(x.f),esc(P(x.f))]),kd=(t.k||[])[k]||(t.only=="ctx"?"ctx":"pool"),L=kd=="t"?Object.keys(TPm()).map(x=>["T"+x,esc(x)]):kd=="ctx"?HY.concat(PR):HY.concat(pool(o).map(f=>[P(f),esc(P(f))]));
  h+=`<div class="sn" style="margin-top:10px">${esc(t.n)}: ${t.m.map((lab,i)=>`<div>${i<k?"✓":i==k?"▶":"·"} ${esc(lab)}: <b>${i<k?MSH(D.m[i]):"…"}</b></div>`).join("")}</div>
  ${t.ay?`<div class="mut" style="font-size:14px">${esc(t.ay)}</div>`:""}<div class="lbl">${esc(t.m[k])}</div><div class="row" style="flex-wrap:wrap;gap:6px">${L.map(([v,lab])=>`<button class="btn chip${v[0]=="H"?" bqhy":""}" data-b="m" data-v="${esc(v)}">${lab}</button>`).join("")||'<span class="mut">No tenés hipótesis.</span>'}</div>
  <div class="row" style="gap:8px">${k?'<button class="btn ghost" data-b="mb">Borrar último</button>':""}<button class="btn ghost" data-b="cx">Cancelar</button></div>`}
 else h+=(e.q?BK.concat([BKQ]):BK).map(([tt,L])=>`<div class="lbl" style="margin-top:10px">${tt}</div><div class="row" style="flex-wrap:wrap;gap:6px">${L.map(id=>`<button class="btn bqb" data-b="r" data-v="${id}">${esc(TPL[id].n)}</button>`).join("")}</div>`).join("");
 h+=`${D.fb}<div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn" data-b="ns">No sé</button><button class="btn" data-b="un"${D.H.length?"":" disabled"}>Deshacer</button><button class="btn ghost" data-b="rs">Reiniciar</button><button class="btn" data-b="cp">${D.cpOk?"Copiado ✓":"Copiar para Claude"}</button></div>${D.cp?`<textarea style="width:100%;height:140px;font:12px var(--m);margin-top:8px;background:var(--bg);color:var(--fg);border:1px solid var(--bd);border-radius:10px;padding:8px">${esc(D.cp)}</textarea>`:""}</div></div>`;D.cpOk=0;
 OUT().innerHTML=h;const s=OUT().querySelector(".bqh.on");if(s)try{s.scrollIntoView({block:"nearest",inline:"center"})}catch(_){}}
const ctxTxt=o=>o.ctx.map(x=>P(x.f)).join(", ")||"nada";
/* aplicar cuando están todos los miembros */
function bqDo(){const o=curG(),r=D.r,M=D.m,c=chk(r,o,M),info={q:"Meta: "+P(o.g)+" · Tengo: "+ctxTxt(o),x:E[ex].t,p:TPL[r].n+": "+M.map(MS).join(" ; ")};D.r=null;D.m=[];
 if(!c.ok){D.fb=`<div class="fb no"><b>No encaja.</b> ${esc(c.m)}<div class="hn" style="margin-top:8px">💡 ${esc(bqHint(o))}</div></div>`;if(EMB)EMB.err++;logA("bq","lg",TPL[r].n,false,Object.assign(info,{a:bqHint(o),x:c.m}));return bqDraw()}
 const S1=structuredClone(D.S),o1=S1.G[o.id];let res=null;
 if(r=="hip"){const m=M[0],x=m.hyp?o1.ctx.find(y=>y.d.l==m.hyp):o1.ctx.find(y=>!(y.d.r=="hip"&&y.d.l)&&eq(y.f,o1.g));if(!x){D.fb=`<div class="fb no"><b>No encaja.</b> ${esc(P(o1.g))} no es una premisa del ejercicio: si es una suposición, elegila con sus corchetes.</div>`;if(EMB)EMB.err++;logA("bq","lg","Hipótesis",false,Object.assign(info,{a:"elegir la suposición con corchetes",x:"hoja sin corchetes"}));return bqDraw()}sol(S1,o1,x.d)}
 else if(c.cust=="E∧"){o1.how={k:"E∧"};const q=mk(S1,o1.id,M[0].f,o1.ctx);o1.subs.push(q.id);closeSubs(S1,o1,r,M)}
 else if(c.cust=="E∧f"||c.cust=="E∀"||c.cust=="E∃"){const m=M[0],i=o1.ctx.findIndex(y=>m.hyp?y.d.l==m.hyp:eq(y.f,m.f)&&!(y.d.r=="hip"&&y.d.l));
  NOAUTO=true;res=c.cust=="E∧f"?mv(S1,o1,"E∧",[i]):c.cust=="E∀"?mv(S1,o1,"E∀",[i,M[1].t]):mv(S1,o1,"E∃",[i]);NOAUTO=false;
  if(res&&res.blocked){D.fb=`<div class="fb no"><b>No encaja.</b> ${esc(res.m)}</div>`;if(EMB)EMB.err++;logA("bq","lg",TPL[r].n,false,Object.assign(info,{a:bqHint(o),x:res.m}));return bqDraw()}
  if(c.cust!="E∃"){const y=o1.ctx.find(y=>eq(y.f,o1.g)&&!(y.d.r=="hip"&&y.d.l));if(y)sol(S1,o1,y.d);else{const nw=c.cust=="E∀"?sb(m.f.a,m.f.v,TPm()[M[1].t]):null;D.ok2=c.cust=="E∀"?`E∀: ahora tenés ${P(nw)} (en «Tengo»).`:`E∧: ahora tenés ${P(m.f.l)} y ${P(m.f.r)} (en «Tengo»).`}}}
 else if(c.cust=="E∨"){const f=M[0].f,n1=++S1.lab,n2=++S1.lab,hy=(f,n)=>({f,d:nd(f,"hip",[],""+n)});o1.how={k:"E∨",l:n1+","+n2,fd:null};
  [[f,[]],[o1.g,[hy(M[1].f,n1)]],[o1.g,[hy(M[2].f,n2)]]].forEach(([g2,h2])=>{const q=mk(S1,o1.id,g2,o1.ctx.concat(h2));o1.subs.push(q.id)});closeSubs(S1,o1,r,M)}
 else{NOAUTO=true;res=mv(S1,o1,c.run[0],c.run[1]);NOAUTO=false;if(!(res&&res.blocked)){if(c.sw)o1.subs.reverse();closeSubs(S1,o1,r,M)}/* E¬: φ a la izquierda, ¬φ a la derecha, como se eligió */if(res&&res.blocked){D.fb=`<div class="fb no"><b>No encaja.</b> ${esc(res.m)}</div>`;if(EMB)EMB.err++;logA("bq","lg",TPL[r].n,false,Object.assign(info,{a:bqHint(o),x:res.m}));return bqDraw()}}
 D.H.push(D.S);D.S=S1;
 if(res&&res.warn){D.fb=`<div class="fb no"><b>Ojo:</b> ${esc(res.m)} Podés deshacer.</div>`;if(EMB)EMB.err++;logA("bq","lg",TPL[r].n,false,Object.assign(info,{a:"Deshacer y elegir otro camino",x:res.m}))}
 else{D.fb=D.ok2?`<div class="fb ok">${esc(D.ok2)}</div>`:"";D.ok2="";logA("bq","lg",TPL[r].n,true,info)}
 if(D.S.G[0].s=="d"&&!ST.done[E[ex].t]){const antes=E.map((_,i)=>unl(i));ST.done[E[ex].t]=1;SVQ();const nu=E.filter((x,i)=>!antes[i]&&unl(i)).map(x=>x.t);D.unl=nu}
 bqDraw()}
function bqHint(o){const g=o.g,c=o.ctx.map(x=>x.f),I={and:"I∧",imp:"I→",not:"I¬",or:"I∨",iff:"I↔"};
 if(c.some(f=>eq(f,g)))return`La meta ${P(g)} ya está en «Tengo»: cerrala con Hipótesis.`;
 if(g.k!="bot"&&I[g.k]&&g.k!="or")return`La meta ${P(g)} tiene conector principal ${{and:"∧",imp:"→",not:"¬",iff:"↔"}[g.k]}: se ARMA con su introducción, ${I[g.k]}.`;
 const im=c.find(f=>f.k=="imp"&&eq(f.r,g));if(im)return`Tenés ${P(im)}, que termina en la meta: E→ con premisas ${P(im)} y ${P(im.l)}.`;
 const cj=c.find(f=>f.k=="and"&&(eq(f.l,g)||eq(f.r,g)));if(cj)return`${P(g)} es parte de ${P(cj)}: E∧ con premisa ${P(cj)}.`;
 if(g.k=="bot"){const ns=c.filter(f=>f.k=="not").sort((a,b)=>P(b).length-P(a).length),dir=ns.find(n=>c.some(f=>eq(f,n.a)));if(dir)return`La meta es ⊥ y ya tenés ${P(dir.a)} y ${P(dir)}: E¬ con esas dos.`;
  const dj0=c.find(f=>f.k=="or");if(dj0)return`Tenés la disyunción ${P(dj0)}: E∨ con meta ⊥, una rama suponiendo ${P(dj0.l)} y otra ${P(dj0.r)}; en cada una buscás la contradicción.`;
  const cn=c.find(f=>f.k=="and"&&(f.l.k=="not"||f.r.k=="not"));if(cn){const ng=cn.l.k=="not"?cn.l:cn.r,im=c.find(f=>f.k=="imp"&&eq(f.r,ng.a));return`Adentro de ${P(cn)} está ${P(ng)}: el par es ${P(ng.a)} y ${P(ng)} (E¬). ${P(ng)} lo sacás con E∧`+(im?`, y ${P(ng.a)} con E→ desde ${P(im)} (su antecedente ${P(im.l)} también puede salir de la conjunción).`:".")}
  const ci=c.find(f=>f.k=="imp"&&f.r.k=="not");if(ci)return`${P(ci)} da ${P(ci.r)}: buscá el par ${P(ci.r.a)} y ${P(ci.r)} (E¬), con E→ para ${P(ci.r)}.`;
  const n=ns[0];if(!n)return"La meta es ⊥: E¬ con una fórmula φ y su negación ¬φ.";
  const how=n.a.k=="or"&&c.some(f=>eq(f,n.a.l)||eq(f,n.a.r))?` ${P(n.a)} lo armás con I∨ desde ${P(c.find(f=>eq(f,n.a.l)||eq(f,n.a.r)))}, que tenés en esta rama.`:` Después armás ${P(n.a)} en el hueco que queda.`;
  return`La meta es ⊥: buscá el par con una negación que tengas. Con ${P(n)} el par es ${P(n.a)} y ${P(n)}: E¬ con esas dos.`+how}
 const dj=c.find(f=>f.k=="or");if(dj)return`Tenés la disyunción ${P(dj)}: E∨ (una rama por lado, en cada una probás ${P(g)}).`;
 if(g.k=="or"&&c.some(f=>eq(f,g.l)||eq(f,g.r))){const x=c.find(f=>eq(f,g.l)||eq(f,g.r));return`Tenés ${P(x)}, que es un lado de ${P(g)}: I∨ con ${P(x)}.`}
 if(g.k=="or")return`I∨ solo si sabés qué lado vale (${P(g.l)} o ${P(g.r)}); si no, RAA suponiendo ${P(NG(g))}.`;
 if(c.some(f=>f.k=="bot"))return`Tenés ⊥: E⊥ te da ${P(g)}.`;
 return`Nada directo para ${P(g)}: RAA (suponés ${P(NG(g))} y arriba queda ⊥).`}
/* «Copiar para Claude»: el árbol actual en texto (de la conclusión hacia arriba, con sangría = premisas) */
function bqTxt(){const S=D.S,e=E[ex],cu=D.S.G[0].s=="d"?null:curG(),L=[],rl=(r,l)=>` [${RN(r)}${l?" "+l:""}]`,
 dT=(d,n)=>{const p="  ".repeat(n);if(d.r=="hip"){L.push(p+(d.l?"["+d.f+"]"+d.l:d.f)+(d.l?"  (suposición)":"  (premisa)"));return}L.push(p+d.f+rl(d.r,d.l));d.c.forEach(c=>dT(c,n+1))},
 gT=(o,n)=>{const p="  ".repeat(n);if(o.s=="d")return dT(o.d,n);
  if(!o.how){const sp=newSup(o).map(x=>"["+P(x.f)+"]"+x.d.l).join(" ");L.push(p+P(o.g)+"  ← HUECO ABIERTO"+(cu&&o.id==cu.id?" (seleccionado)":"")+(sp?"  · rama con "+sp:""));return}
  L.push(p+P(o.g)+rl(o.how.k,o.how.l));if(o.how.fd)dT(o.how.fd,n+1);o.subs.forEach(i=>gT(S.G[i],n+1))};
 gT(S.G[0],0);const fb=D.fb?D.fb.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim():"";
 return`BLOQUES · ${e.t}: ${e.P.length?e.P.join(", ")+" ":""}⊢ ${e.g}
Árbol (conclusión arriba; cada sangría son las premisas de la regla entre corchetes):
${L.join("\n")}
`+(cu?`Meta seleccionada: ${P(cu.g)} · Tengo: ${cu.ctx.map(x=>x.d.l?"["+P(x.f)+"]"+x.d.l:P(x.f)).join(", ")||"nada"}\n`:"Árbol completo.\n")+(fb?`Último mensaje: ${fb}\n`:"")}
function bqCopy(){const t=bqTxt();D.cp=t;try{navigator.clipboard.writeText(t).then(()=>{D.cp="";D.cpOk=1;bqDraw()},()=>bqDraw())}catch(_){bqDraw()}}
function bqNS(){if(EMB){EMB.err++;EMB.ns++}const o=curG(),hn=bqHint(o),th=typeof swTeo=="function"?swTeo({s:"lg",g:"",ctx:""},{q:hn+" "+P(o.g),a:"",x:""}):"";
 D.fb=`<div class="fb no"><b>Pista:</b> ${esc(hn)}${th}</div>`;logA("bq","lg","No sé",false,{q:"Meta: "+P(o.g)+" · Tengo: "+ctxTxt(o),x:E[ex].t,a:hn,p:"No sé",ns:1});bqDraw()}
V.addEventListener("click",ev=>{if(EMB?!EMB.el.contains(ev.target):TAB!=6)return;const b=ev.target.closest("[data-b]");if(!b)return;const w=b.dataset.b;
 if(w=="g"){D.cur=+b.dataset.i;D.r=null;D.m=[];D.fb="";bqDraw()}
 else if(w=="r"){D.r=b.dataset.v;D.m=[];D.fb="";bqDraw()}
 else if(w=="m"){const o=curG(),v=b.dataset.v;let m;if(v[0]=="H"){const x=o.ctx.find(y=>y.d.l==v.slice(1));m={f:x.f,hyp:x.d.l}}else if(v[0]=="T"&&v.length>1&&TPm()[v.slice(1)]&&(TPL[D.r].k||[])[D.m.length]=="t")m={t:v.slice(1),f:{k:"at",n:v.slice(1),a:[]}};else m={f:pool(o).concat(o.ctx.map(x=>x.f)).find(x=>P(x)==v)};D.m.push(m);if(D.m.length>=TPL[D.r].m.length)bqDo();else bqDraw()}
 else if(w=="mb"){D.m.pop();bqDraw()}
 else if(w=="cx"){D.r=null;D.m=[];bqDraw()}
 else if(w=="un"&&D.H.length){D.S=D.H.pop();D.fb="";D.r=null;D.m=[];bqDraw()}
 else if(w=="rs"){D=nw(ex);bqDraw()}
 else if(w=="ns")bqNS();
 else if(w=="mp"){MAPV=MAPV?0:1;D.mg=null;bqDraw()}
 else if(w=="mg"){D.mg=b.dataset.v;bqDraw()}
 else if(w=="mx"){const i=+b.dataset.i;if(i>=0){MAPV=0;ex=i;D=nw(i);bqDraw()}}
 else if(w=="cp")bqCopy();
 else if(w=="ex"){const i=+b.dataset.i;if(!unl(i)){const f=E[i].req.filter(t=>!ST.done[t]);D.fb=`<div class="fb no"><b>🔒 ${esc(E[i].t)}</b> se desbloquea cuando resuelvas: ${f.map(esc).join(", ")}.</div>`;return bqDraw()}ex=i;D=nw(ex);bqDraw()}
 else if(w=="gr"){const g=b.dataset.v;let i=E.findIndex((x,j)=>x.grp==g&&unl(j)&&!ST.done[x.t]);if(i<0)i=E.findIndex((x,j)=>x.grp==g&&unl(j));if(i>=0){ex=i;D=nw(ex)}else{D.grp=g;D.fb=""}bqDraw()}
 else if(w=="nx"){ex=nextEx();D=nw(ex);bqDraw()}});
(()=>{const st=document.createElement("style");st.textContent=".bqt{overflow-x:auto;text-align:center}.bqh{font:inherit;font-family:var(--m);border:2px dashed var(--ac);border-radius:8px;background:var(--card);color:var(--fg);padding:2px 10px;cursor:pointer;white-space:nowrap}.bqh.on{background:var(--ac);color:var(--onac);border-style:solid}.bqr{border-top-style:dashed}.bqb{font-family:var(--m);font-weight:600}.bqhy{font-family:var(--m);border-color:var(--ac)}.bqlk{opacity:.55}.bqsp{font-size:12px;color:var(--ac);white-space:nowrap;font-family:var(--m)}.bqc{display:inline-block;font-family:var(--m);border:1px solid var(--bd);border-radius:6px;padding:0 6px;margin:2px 2px 0 0;color:var(--fg)}";document.head.appendChild(st)})();

/* Deslizar: los ejercicios intermedios (los que son previa de otro, y los patrones de contradicción) son tarjetas «Árbol · …» */
/* Se quitan también las series de Lógica que se crean después de logica.js (PORT de Repaso, etc.): Lógica en Deslizar = solo árboles */
for(let i=SWC.length-1;i>=0;i--)if(SWC[i].s=="lg"&&!SWC[i].bqx)SWC.splice(i,1);
{const RQ=new Set(E.flatMap(x=>x.req));E.filter(x=>RQ.has(x.t)||x.grp=="Patrones de contradicción").forEach(x=>{const c=sw("lg","Árbol · "+x.t,null,[st("Armá el árbol",x.t,"—","")]);c.bqx=x.t;SWC.push(c)})}
return{bqOpen,bqEmbed,req:t=>{const x=E.find(y=>y.t==t);return x?x.req:[]},_go:(t,all)=>{if(all)ST.done=Object.fromEntries(E.map(x=>[x.t,1]));const i=E.findIndex(x=>x.t==t);ex=i;D=nw(i);bqDraw()},_reset:()=>{ST.done={};ex=0;D=nw(0);bqDraw()}};/* _go/_reset: solo para pruebas */

})();
const bqOpen=BQ.bqOpen;
