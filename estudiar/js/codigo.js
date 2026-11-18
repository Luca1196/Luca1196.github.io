/* ===== Pestaña Código: resolución completa de los problemas 3 (C++) de cada prueba, línea por línea con fichas =====
   DECISIONES DIDÁCTICAS
   - Se resuelve el ejercicio entero, en el orden de la solución oficial (.h de las clases y después los .cpp), por bloques (una clase o una operación).
   - Cada línea se arma con fichas (tokens del código); las líneas largas se parten en tramos. El banco trae distractores de errores típicos (-> / ., = / ==, new / delete, virtual, *).
   - La ficha equivocada no entra: muestra la regla y el tipo de línea. El error queda en el registro de Errores (w «cd») y admite nota.
   - Las líneas falladas vuelven en «Repetir líneas falladas». Los datos (letra, DCD, solución) salen de js/codigo-datos.js. */
let CDST={};try{CDST=JSON.parse(localStorage.getItem("cd1")||"{}")}catch(e){}
CDST.done=CDST.done||{};CDST.miss=CDST.miss||{};
const CDSV=()=>{try{localStorage.setItem("cd1",JSON.stringify(CDST))}catch(e){}};
let CD={m:"home",open:{}};
const CDR=/\s*(::|->|==|!=|<=|>=|\+\+|--|&&|\|\||\+=|-=|\*=|\/=|"[^"]*"|[A-Za-z_]\w*|\d+(?:\.\d+)?|[^\sA-Za-z_\d])/y;
function cdTok(s){const r=[];let m;CDR.lastIndex=0;while(CDR.lastIndex<s.length&&(m=CDR.exec(s)))r.push({t:m[1],sp:/^\s/.test(m[0])&&r.length>0});return r}
function cdChunks(tk){const c=[];let cur=[];tk.forEach((x,i)=>{cur.push(i);if(tk.length-i-1>=3&&((cur.length>=8&&[",",":","{","&&","||",";"].includes(x.t))||(cur.length>=12&&["(",")","="].includes(x.t)))){c.push(cur);cur=[]}});if(cur.length)c.push(cur);return c}
const CDSW={"->":".",".":"->","==":"=","=":"==","new":"delete","delete":"new","virtual":"static","static":"virtual","public":"private","private":"public","int":"float","float":"int","push_back":"insert","size":"length","NULL":"nullptr","++":"--"};
const CDPOOL={};
function cdPool(X){if(CDPOOL[X.id])return CDPOOL[X.id];const s=new Set();X.blocks.forEach(b=>b.lines.forEach(l=>cdTok(l[1]).forEach(x=>{if(/^[A-Za-z_]\w*$/.test(x.t)&&!CDSW[x.t]&&!["void","class","return","for","if","else","const","string","vector","map","set","auto"].includes(x.t))s.add(x.t)})));return CDPOOL[X.id]=[...s]}
function cdDis(ct,pool){const have=new Set(ct),D=[];ct.forEach(t=>{const s=CDSW[t];if(s&&!have.has(s)&&!D.includes(s))D.push(s)});if(have.has("*"))D.push("&");
 sh(pool.filter(p=>!have.has(p)&&!D.includes(p))).slice(0,2).forEach(x=>D.push(x));return sh(D).slice(0,6)}
function cdKind(t){return/^class /.test(t)?"declaración de clase (la herencia se escribe : public Base)":/^(public|private|protected):$/.test(t)?"especificador de acceso":/^for\b/.test(t)?"recorrido con for":/^(if|else)\b/.test(t)||/^\} else/.test(t)?"condicional":/^return\b/.test(t)?"retorno":/^[\w<>:,\s\*&]+::~?\w+\s*\(.*\{$/.test(t)?"definición de una operación en el .cpp (Clase::operación)":/\bnew\b/.test(t)?"creación dinámica con new":/\bdelete\b/.test(t)?"liberación con delete":/^[\w<>:,\s\*&]+\s\*?\w+;$/.test(t)?"declaración de atributo":/^[\w<>:,\s\*&\(\)\)]+\);$/.test(t)&&/^(virtual |static |void |int |float |[A-Z])/.test(t)?"declaración de operación (.h)":/=/.test(t)?"asignación":"sentencia"}
function cdWhy(e,t){
 if(e=="->"&&t==".")return"El receptor es un puntero (T *): se accede con ->. El «.» es para objetos o referencias.";
 if(e=="."&&t=="->")return"Acá el receptor no es un puntero (es un objeto, un valor o un elemento ya desreferenciado): se accede con «.».";
 if(e=="="&&t=="==")return"= asigna; == compara.";
 if(e=="=="&&t=="=")return"== compara; = asigna.";
 if(t=="delete")return"delete solo libera lo que ya no se necesita y es de este objeto (por ejemplo, las partes que una Multiparte creó). Acá no se está liberando.";
 if(t=="new")return"new crea un objeto dinámico y devuelve un puntero. Acá todavía no se crea nada.";
 if(e=="new"||e=="delete")return e=="new"?"Para crear el objeto dinámico va new.":"Para liberar el objeto va delete.";
 if(e=="*")return"Falta el *: las asociaciones, los objetos creados con new y las referencias a objetos de otras clases se guardan y pasan como punteros.";
 if(t=="*")return"Acá no va *: no es un puntero.";
 if(t=="&")return"& (referencia) no se usa en estos ejercicios: se trabaja con punteros (*) o por valor.";
 if(e=="virtual"||t=="virtual")return"virtual va solo en la declaración (.h) de operaciones que se redefinen en las subclases y en el destructor de la clase base; no se repite en el .cpp.";
 if(e=="static"||t=="static")return"static es de la clase, no de cada objeto: lo usan el singleton (instancia, getInstancia) y los contadores compartidos. Solo va en el .h; en el .cpp no se repite.";
 if(["public","private"].includes(e)||["public","private"].includes(t))return"private: atributos y el constructor del singleton; public: lo que usan las demás clases.";
 if(e=="::")return"En el .cpp la operación se define como Clase::operación; el :: une la clase con su operación.";
 if(e=="NULL"||t=="NULL")return"Un puntero que todavía no apunta a nada se inicializa en NULL.";
 if(e==":"||e=="{")return"Después de la firma de un constructor van los dos puntos con la lista de inicialización (Base(...), atributos) y recién después la llave.";
 if(CDSW[e]===t)return"Confundiste «"+t+"» con «"+e+"»: miralos de nuevo.";
 return/^[A-Za-z_]/.test(e)?"Acá va un nombre (un tipo, una variable, una operación o una palabra reservada), no ese símbolo u otro nombre: mirá qué viene en el orden de la línea.":"Acá va un símbolo (paréntesis, punto y coma, operador…): mirá qué viene en el orden de la línea."}
function cdLine(X,b,i){const l=X.blocks[b].lines[i],tk=cdTok(l[1]);return{ind:l[0],txt:l[1],tk,ch:cdChunks(tk)}}
const cdDisp=(pl)=>pl.map((x,i)=>(i&&x.sp?" ":"")+x.t).join("");
const cdInd=n=>"  ".repeat(n);
function cdBankNew(){const X=CDX[CD.ex],ln=cdLine(X,CD.bi,CD.li),idx=ln.ch[CD.ci],ct=idx.map(i=>ln.tk[i].t);
 CD.bank=sh(ct.map(t=>({t})).concat(cdDis(ct,cdPool(X)).map(t=>({t}))));CD.used={};CD.p=0}
function cdSetLine(){const X=CDX[CD.ex],B=X.blocks[CD.bi];
 if(!CD.rep)while(CD.li<B.lines.length&&/^\};?$/.test(B.lines[CD.li][1]))CD.li++;
 if(CD.li>=B.lines.length){CD.m="blk";return}
 CD.m="play";CD.pl=[];CD.ci=0;CD.e=0;CD.msg=null;CD.ts=Date.now();NLE=null;cdBankNew()}
function cdStart(ex,bs,rep){CD={m:"play",open:CD.open||{},ex,qb:bs,qi:0,be:0,rep:!!rep};if(rep){cdRepNext();return}CD.bi=bs[0];CD.li=0;cdSetLine();cdDraw()}
function cdRepNext(){const ks=Object.keys(CDST.miss).filter(k=>{const[a,b,c]=k.split(":");const X=CDX.find(x=>x.id==a);return X&&X.blocks[+b]&&X.blocks[+b].lines[+c]});
 if(!ks.length){CD={m:"home",open:CD.open};cdOpen();return}
 const k=ks[Math.floor(Math.random()*ks.length)],[a,b,c]=k.split(":");CD.ex=CDX.findIndex(x=>x.id==a);CD.bi=+b;CD.li=+c;CD.rk=k;CD.rep=true;cdSetLine();cdDraw()}
function cdLineDone(){const X=CDX[CD.ex],B=X.blocks[CD.bi],k=X.id+":"+CD.bi+":"+CD.li;
 if(!CD.e){logA("cd","p4",X.t+" · "+B.title,true,{});if(CDST.miss[k]){delete CDST.miss[k]}}else{CDST.miss[k]=(CDST.miss[k]||0)+1;CD.be++}CDSV();
 if(CD.rep){CD.m="repok";cdDraw();return}
 CD.li++;cdSetLine();cdDraw()}
function cdTile(i){if(CD.m!="play")return;const X=CDX[CD.ex],B=X.blocks[CD.bi],ln=cdLine(X,CD.bi,CD.li),idx=ln.ch[CD.ci],ns=i<0,ex=ln.tk[idx[CD.p]];
 if(ns)i=CD.bank.findIndex((t,j)=>!CD.used[j]&&t.t==ex.t);else if(CD.used[i])return;
 const tp=CD.bank[i];
 if(ns||tp.t!=ex.t){const ph=cdDisp(CD.pl);CD.e++;
  logA("cd","p4",X.t+" · "+B.title,false,{q:"Armá la línea",x:B.title+"\n"+B.lines.slice(Math.max(0,CD.li-3),CD.li).map(l=>cdInd(l[0])+l[1]).join("\n"),a:(ph+" ["+ex.t+"]").trim(),p:ns?"No sé":(ph+" ["+tp.t+"]").trim(),ns:ns?1:0,ms:Date.now()-CD.ts,rp:CD.rep?1:0,n:CD.li+1});
  NLE=E1.log[E1.log.length-1];CD.msg=[ns?"Era «"+ex.t+"»":"«"+tp.t+"» no va acá.",cdWhy(ex.t,tp.t),"Línea: "+cdKind(ln.txt)];
  try{navigator.vibrate&&navigator.vibrate(30)}catch(_){}
  if(!ns){cdDraw();return}}
 else CD.msg=null;
 CD.used[i]=1;CD.pl.push(ex);CD.p++;
 if(CD.p>=idx.length){CD.ci++;if(CD.ci>=ln.ch.length){cdLineDone();return}CD.p=0;CD.used={};cdBankNew()}
 cdDraw()}
function cdBlockEnd(){const X=CDX[CD.ex],k=X.id+":"+CD.bi;CDST.done[k]={e:CD.be,t:Date.now()};CDSV();CD.qi++;if(CD.qi>=CD.qb.length){CD={m:"home",open:CD.open};cdOpen();return}CD.bi=CD.qb[CD.qi];CD.li=0;CD.be=0;cdSetLine();cdDraw()}
function cdOpen(){const nm=Object.keys(CDST.miss).length;
 let h=`<div class="card"><h2>Código · problema 3</h2><p class="mut" style="margin:0">Resolvé el ejercicio completo (.h y .cpp), línea por línea, con fichas. Los errores quedan registrados y las líneas falladas se repiten.</p></div>`+
 (nm?`<button class="btn pri big" data-c="rep">Repetir líneas falladas (${nm})</button>`:"")+
 CDX.map((X,xi)=>`<div class="card"><h2>${esc(X.t)}</h2><div class="row" style="margin-bottom:8px"><button class="btn pri" data-c="all" data-x="${xi}">Resolver completo (${X.blocks.length} bloques)</button></div>`+
  X.blocks.map((b,bi)=>{const d=CDST.done[X.id+":"+bi];return`<div class="row between" style="padding:6px 0;border-top:1px solid var(--bd)"><span>${d?(d.e?"🟡":"✅"):"⬜"} ${b.file?`<span class="mut">${esc(b.file)} · </span>`:""}${esc(b.title)}${d&&d.e?` <span class="mut">(${d.e} ${d.e==1?"error":"errores"})</span>`:""}</span><button class="btn" data-c="blk" data-x="${xi}" data-b="${bi}">Practicar</button></div>`}).join("")+`</div>`).join("");
 V.innerHTML=h}
function cdDraw(){const X=CDX[CD.ex],B=X.blocks[CD.bi];
 const pre=(lines,cur)=>`<div class="cdp">${lines.map(l=>esc(cdInd(l[0])+l[1])).join("\n")}${cur!==null?(lines.length?"\n":"")+`<span class="cdc">${esc(cur)}</span>`:""}</div>`;
 let h=`<div class="row between"><button class="btn" data-c="home">← Salir</button><span class="mut">${esc(X.t)}</span></div>`+
  `<details class="cdd"${CD.open.l?" open":""} data-o="l"><summary>📄 Enunciado</summary><div class="cdl">${esc(X.letra)}</div></details>`+
  `<details class="cdd"${CD.open.d?" open":""} data-o="d"><summary>🧩 Diagrama de clases (DCD)</summary><img src="${X.img}" alt="DCD" style="max-width:100%;background:#fff;border-radius:8px"></details>`;
 if(CD.m=="blk"){h+=`<div class="card"><h2>Bloque completo</h2><div class="lbl">${B.file?esc(B.file)+" · ":""}${esc(B.title)}</div>${pre(B.lines,null)}<div class="fb ${CD.be?"no":"ok"}"><b>${CD.be?CD.be+(CD.be==1?" línea con errores: vuelve en «Repetir líneas falladas».":" líneas con errores: vuelven en «Repetir líneas falladas».") :"Sin errores en este bloque"}</b></div><button class="btn pri big" data-c="next">${CD.qi+1<CD.qb.length?"Siguiente bloque":"Terminar"}</button></div>`;V.innerHTML=h;return}
 const ln=cdLine(X,CD.bi,CD.li),idx=ln.ch[CD.ci];
 const before=B.lines.slice(CD.rep?Math.max(0,CD.li-6):0,CD.li);
 const cur=cdInd(ln.ind)+cdDisp(CD.pl)+(CD.m=="play"?"▌":"");
 h+=`<div class="card"><div class="lbl"><b class="sj">Código</b> · ${B.file?esc(B.file)+" · ":""}${esc(B.title)} · línea ${CD.li+1}/${B.lines.length}${ln.ch.length>1?` · tramo ${CD.ci+1}/${ln.ch.length}`:""}${CD.rep?" · repaso":""}</div>`+
  pre(CD.m=="repok"?before.concat([[ln.ind,ln.txt]]):before,CD.m=="repok"?null:cur)+
  (CD.msg?`<div class="fb no"><b>${esc(CD.msg[0])}</b><div>${esc(CD.msg[1])}</div><div class="mut" style="margin-top:4px">${esc(CD.msg[2])}</div></div>${noteBox()}`:"")+
  (CD.m=="repok"?`<div class="fb ${CD.e?"no":"ok"}"><b>${CD.e?"Con errores: vuelve más tarde.":"Línea correcta: sale de los pendientes"}</b></div>${CD.e?noteBox():""}<button class="btn pri big" data-c="rnext">Siguiente</button>`:
   `<div class="bank">${CD.bank.map((t,i)=>`<button class="btn tile${CD.used[i]?" used":""}" data-c="t" data-i="${i}"${CD.used[i]?" disabled":""}>${esc(t.t)}</button>`).join("")}</div><button class="btn ghost" data-c="tns" style="display:block;margin:10px auto 0">No sé qué sigue</button>`)+`</div>`;
 V.innerHTML=h}
V.addEventListener("click",ev=>{if(TAB!=8)return;const b=ev.target.closest("[data-c]");if(!b)return;const c=b.dataset.c;
 if(c=="t")cdTile(+b.dataset.i);else if(c=="tns")cdTile(-1);
 else if(c=="all")cdStart(+b.dataset.x,CDX[+b.dataset.x].blocks.map((_,i)=>i));
 else if(c=="blk")cdStart(+b.dataset.x,[+b.dataset.b]);
 else if(c=="rep")cdStart(0,[],true);
 else if(c=="next")cdBlockEnd();else if(c=="rnext")cdRepNext();
 else if(c=="home"){CD={m:"home",open:CD.open};cdOpen()}});
V.addEventListener("toggle",ev=>{if(TAB!=8)return;const d=ev.target;if(d&&d.dataset&&d.dataset.o)CD.open[d.dataset.o]=d.open},true);

/* ===== Problema 3 dentro de Principal (16/11): la misma cadena de «tarjetas kit» que el DSS y el DCD (js/examen.js), derivada de CDX =====
   DECISIONES DIDÁCTICAS (teórico «Implementación y generación de código» y «Patrones de diseño»)
   - Acciones del estudiante, en el orden del examen: leer la letra y el DCD (qué patrón hay, qué se pide y qué no) → pasar cada clase del DCD al .h →
     escribir cada operación del .cpp. Acá se practica la DECISIÓN, con fichas de línea entera; la escritura ficha por ficha sigue en la pestaña Código.
   - «P3 · el diseño» (a mano por examen, P3X.T): qué se desprende del DCD y de la letra.
   - .h (casilleros en orden): lo que el DCD ya trae va puesto; se elige la línea donde hay una regla que aplicar: herencia (: public), pseudoatributos
     (multiplicidad máxima 1 → puntero; mayor → colección de punteros; buscado por clave → map), static (Singleton), virtual pura (= 0), destructor virtual, redefinición.
   - .cpp: todas las líneas son fichas y van en el orden del código (dos líneas seguidas e independientes valen en cualquier orden), más líneas equivocadas.
   - Las líneas equivocadas salen solas de reglas (P3M: Clase::, constructor de la base, -> y punto, new, ==, <=, acumular, inicializar, *it, this->, delete,
     push_back / insert / map[clave]) y cada una muestra su regla. Las que dependen de la letra van a mano en P3X.hx (línea correcta → [[equivocada, por qué]]).
   - P3X.ds: de dónde a dónde va, en la letra, la descripción de cada operación (se muestra tal cual). Los bloques de más de 8 líneas se parten en dos tarjetas.
   - ORDEN Y PAQUETES: clase por clase, de la menos acoplada a la más acoplada (teórico: así lo que usa cada clase ya está escrito), y de cada clase primero
     su .h y después sus operaciones; cada clase es un paquete. «No sé» muestra la línea, la regla de esa línea y la teoría (P3T).
   - Se saltean los bloques de dos líneas sin nada que decidir (constructor o destructor vacío). Cada tarjeta es su propia unidad; área «cod» (filtro P3).
   - Solo conceptos (18/11, nota de Luca: «no es un aprendizaje relevante que esta evaluación no pida implementar ciertas clases»): nada de fichas sobre
     lo que una consigna en particular pide o deja asumir (qué clases implementar, #include, getters); solo lo que enseña el tema (patrón, colecciones,
     quién libera qué, quién decide qué).
   RECETA: sumar el examen a CDX (js/codigo-datos.js) y una entrada en P3X {n, T, hx, ds}; simular con jsdom y revisar la lista de líneas equivocadas. */
const p3Nm=t=>{let m;return(m=/^this->(\w+)/.exec(t))?m[1]:(m=/^[\w<>:, \*]+?[ \*](\w+)(?: = .*)?;$/.exec(t))?m[1]:(m=/^(\w+)/.exec(t))?m[1]:""},
 p3Ctl=t=>/^(for|if|while|else|return|delete)\b|\{$/.test(t),
 p3Swap=(a,b)=>!b.sep&&a.ind==b.ind&&!p3Ctl(a.t)&&!p3Ctl(b.t)&&!new RegExp("\\b"+p3Nm(a.t)+"\\b").test(b.t)&&!new RegExp("\\b"+p3Nm(b.t)+"\\b").test(a.t);
/* Bloque de código con fichas de línea entera. L = [{ind, t, k: 0 ya puesta | 1 casillero en orden fijo | 2 línea de orden libre dentro de su grupo, sn, w, sep}];
   dis = [[línea equivocada, por qué, índice de la línea que reemplaza (solo casilleros)]] */
function kCode(g,q,p,L,dis,o){const exp=[],it=[];
 L.forEach((l,i)=>{if(i)exp.push(KNL());if(l.ind)exp.push({t:"   ".repeat(l.ind),k:"a",auto:1});
  const x=l.k?{t:l.t,k:l.k==1?"kq":"ks",w:l.w||"",li:i}:{t:l.t,k:"a",auto:1};
  if(l.k==1){x.sl=it.length+1;x.sn=l.sn}if(l.k==2){x.fr=1;x.o=i;x.ind=l.ind;x.sep=l.sep}if(l.k)it.push(x);exp.push(x)});
 let G=[],P=[];it.filter(x=>x.fr).forEach(x=>{if(G.length&&G.every(y=>p3Swap(y,x)))G.push(x);else{P=G;G=[x]}x.dp=P.slice()});
 return kCard(g,q,p,exp,it.map(x=>({t:x.t,sl:x.sl,rt:1})).concat(dis.map(d=>({t:d[0],why:d[1],sl:(it.find(x=>x.li==d[2])||{}).sl}))),o)}
/* Líneas equivocadas de una línea correcta t: [[línea, regla que rompe, clave de la regla]] */
function P3M(t,cx){const R=[],add=(r,w,why)=>{if(w&&w!=t&&!R.some(z=>z[0]==w))R.push([w,why,r])};let m;
 (cx.hx[t]||[]).forEach(d=>add("hx",d[0],d[1]));
 if(cx.k=="decl"){const C=cx.C,B=cx.B;
  if(m=/^class (\w+) : public (\w+) \{$/.exec(t)){add("her","class "+C+" {",`${C} hereda de ${B} (en el DCD, generalización o realización): en C++ va «: public ${B}».`);add("her","class "+C+" : "+B+" {",`Sin public la herencia es privada: desde afuera ya no se podría usar un ${C} donde se espera un ${B}.`)}
  else if(m=/^(vector|set|list|map)<(.*?)(\w+) \*> (\w+);$/.exec(t)){
   if(m[1]=="map")add("map","vector<"+m[3]+" *> "+m[4]+";",`Los elementos se buscan por su identificador: con un map la clave lleva directo al objeto.`);
   else add("col",m[3]+" *"+m[4]+";",`La asociación hacia ${m[3]} tiene multiplicidad mayor que 1: el pseudoatributo es una colección, no un solo puntero.`);
   add("ptr",m[1]+"<"+m[2]+m[3]+"> "+m[4]+";",`Se guardan punteros (${m[3]} *), no copias: el objeto es uno solo y, si es de una subclase, tiene que seguir siéndolo.`)}
  else if(m=/^static (.*\(.*\));$/.exec(t))add("st",m[1]+";",`Se llama sin tener todavía ningún objeto (${C}::…()): es una operación de clase, static.`);
  else if(m=/^static (.*);$/.exec(t))add("st",m[1]+";",`Es un dato de la clase, uno solo para todos, no de cada objeto: static.`);
  else if(m=/^virtual (.*\)) = 0;$/.exec(t)){add("pura",m[1]+";",`Es abstracta: cada subclase la implementa a su manera y se llama a través de un puntero a ${C}. Va virtual y pura (= 0).`);add("pura","virtual "+m[1]+";",`Sin «= 0» habría que implementarla también en ${C}. Como acá no tiene implementación, es pura.`)}
  else if(m=/^virtual (~\w+\(\));$/.exec(t))add("vd",m[1]+";",`Los objetos se destruyen a través de un puntero a la base (${C} *): si el destructor no es virtual, delete no llama al de la subclase.`);
  else if(m=/^([A-Z]\w*) \*(\w+);$/.exec(t))add("uno","vector<"+m[1]+" *> "+m[2]+";",`La asociación hacia ${m[1]} tiene multiplicidad máxima 1: alcanza con un puntero.`);
  else if(B&&(m=/^(.*\b(\w+)\(.*\));$/.exec(t))&&(cx.pure[B]||[]).includes(m[2]))add("red","virtual "+m[1]+" = 0;",`Acá sí se implementa. «= 0» va solo en la clase base abstracta: si ${C} la dejara pura, tampoco se podría instanciar.`);
  return R}
 if(cx.sig){if(m=/^(.*?)(\w+)::(~?\w+\(.*)$/.exec(t))add("cls",m[1]+m[3],`En el .cpp cada operación lleva delante el nombre de su clase (${m[2]}::). Sin eso es una función suelta, no la operación de ${m[2]}.`);
  if(m=/^(.*\)) : ([A-Z]\w*)\(.*\) \{$/.exec(t))add("base",m[1]+" {",`Lo heredado de ${m[2]} es privado de ${m[2]}: se inicializa llamando a su constructor en la lista de inicialización (: ${m[2]}(…)).`);return R}
 if(cx.k=="stat"){if(m=/^(.*?)(\w+)::(\w+ = .*;)$/.exec(t)){add("cls",m[1]+m[3],`Es el atributo static de ${m[2]}: en el .cpp se define con el nombre de la clase delante (${m[2]}::).`);add("st","static "+t,`static va solo en la declaración (.h): en la definición del .cpp no se repite.`)}return R}
 if(m=/^this->(\w+) = \1;$/.exec(t))add("this",m[1]+" = "+m[1]+";",`El parámetro se llama igual que el atributo y lo tapa: sin this-> se asigna el parámetro a sí mismo.`);
 if(m=/^(\w+) = \1 \+ (.+);$/.exec(t))add("acum",m[1]+" = "+m[2]+";",`Así el total se pisa en cada vuelta: hay que acumular (${m[1]} = ${m[1]} + …).`);
 if(m=/^delete (\w+)\[\w+\];$/.exec(t))add("del","delete "+m[1]+";",`${m[1]} es una colección, no un puntero: se libera cada elemento, uno por uno.`);
 if(t.includes("[*it]"))add("it",t.replace("[*it]","[it]"),`it es un iterador: el elemento al que apunta se obtiene con *it.`);
 if(/\bnew /.test(t))add("new",t.replace("new ",""),`El objeto tiene que seguir existiendo cuando la operación termina: se crea en memoria dinámica con new, que devuelve el puntero.`);
 if((m=/^(\w+)\.push_back\(/.exec(t))&&cx.cont[m[1]]=="vector")add("cont",t.replace(".push_back(",".insert("),`${m[1]} es un vector: se agrega al final con push_back.`);
 if((m=/^(\w+)\.insert\(/.exec(t))&&cx.cont[m[1]]=="set")add("cont",t.replace(".insert(",".push_back("),`${m[1]} es un set: se agrega con insert (push_back es de vector).`);
 if((m=/^(\w+)\[.+?\] = (.+);$/.exec(t))&&cx.cont[m[1]]=="map")add("cont",m[1]+".push_back("+m[2]+");",`${m[1]} es un map: cada elemento se guarda con su clave (${m[1]}[clave] = …). push_back es de vector.`);
 if(/^if \(.* == /.test(t))add("eq",t.replace(" == "," = "),`Con un solo = se asigna; para comparar va ==.`);
 if(m=/^(for \(int \w+=0; \w+)<(.*\.size\(\); .*)$/.exec(t))add("lim",m[1]+"<="+m[2],`Los índices válidos van de 0 a size()-1: con <= el último acceso se pasa del final.`);
 if(m=/^(int|float) (\w+) = 0;$/.exec(t))add("ini",m[1]+" "+m[2]+";",`Sin valor inicial el acumulador arranca con basura: se inicializa en 0.`);
 if(t.includes("->"))add("fle",t.replace("->","."),`Lo que está a la izquierda es un puntero: sus operaciones se llaman con ->, no con punto.`);
 else if(m=/^(.*?[\w\]])\.(\w+\(.*)$/.exec(t))add("pto",m[1]+"->"+m[2],`Lo que está a la izquierda es un objeto o una colección, no un puntero: sus operaciones se llaman con punto.`);
 return R}
/* Introducción al tema: series que hay que completar sin errores antes de empezar cada cadena (más las de P3X.pre, según el patrón del examen) */
const P3I=["Parcial P3 · Del DCD al código: la estructura","Parcial P3 · Constructores y destructores","Parcial P3 · Del diagrama de comunicación al método"];
const P3T=["Antes de escribir: reconocer qué patrón trae el DCD (Composite: una clase abstracta con una hoja y un compuesto hecho de otras; Singleton: instancia única y getInstancia; una interfaz con una fábrica que elige la clase concreta), qué colecciones guarda cada clase y qué pide exactamente la letra: qué clases hay que implementar y qué se puede asumir.",
 "Del DCD al .h: los atributos van privados. Una asociación navegable es un pseudoatributo: multiplicidad máxima 1 → puntero; mayor → colección de punteros (vector si hay orden, set si no, map si se busca por clave). Generalización o realización → «: public Base». Operación abstracta → virtual … = 0; la subclase la declara sin = 0. Clase base usada por puntero → destructor virtual. Singleton → instancia y getInstancia con static, constructor privado.",
 "En el .cpp cada operación lleva Clase:: delante. Los objetos se crean con new y se guarda su puntero; con un puntero se usa ->, con un objeto o una colección se usa punto. Recorrer: for con índice de 0 a size()-1, o un iterador (el elemento es *it). Acumular: variable en 0 y total = total + …. Guardar: vector.push_back(x), set.insert(x), map[clave] = x. Lo que la clase creó con new y es solo suyo se libera con delete. Una subclase pasa los datos heredados al constructor de su base (: Base(…)).",
 "Un atributo static se declara en el .h con static y se define una sola vez en el .cpp, fuera de la clase, con el nombre de la clase delante y sin repetir static: Tipo Clase::atributo = valor;"];
const P3Q="¿Qué se desprende de la letra y del DCD? Elegí todo lo que es cierto.";
const P3X={
feb26:{n:"Feb26",ord:["Paquete","Simple","Multiparte","Controlador"],pre:["Parcial P3 · Composite"],T:{p:P3Q,
  ok:[["Paquete es abstracta: cantArticulos se resuelve distinto en Simple y en Multiparte","Es la estructura del patrón Composite: Paquete = componente, Simple = hoja, Multiparte = compuesto. Por eso cantArticulos es virtual pura en Paquete."],
   ["Un Multiparte está hecho de paquetes Simple que son suyos: los libera en su destructor","Las partes se crean solo para ese multiparte y no se registran en la colección global: nadie más las puede liberar."],
   ["El Controlador guarda todos los paquetes en una colección global, buscados por su id","Por eso el pseudoatributo es un map de id a puntero a Paquete."],
   ],
  no:[["El Controlador es Singleton: lleva instancia estática y getInstance","En este DCD el Controlador no tiene el estereotipo «singleton» ni getInstance: no se agrega lo que el diseño no pide."],
   ["Simple libera sus artículos en el destructor","Los artículos viven en la colección global del Controlador y pueden estar en varios paquetes: Simple solo guarda punteros."],
   ]},
 hx:{"~Multiparte();":[["// (sin destructor)","Las partes se crean con new solo para este Multiparte y no están en la colección global: si no las libera él en su destructor, nadie lo hace."]],
  "paquetes[idPaq] = m;":[["paquetes[0] = s;","«Los paquetes simples que forman parte de un paquete multiparte no se dan de alta en la colección global de paquetes»."]],
  "Simple *s = new Simple(0, \"parte\", idCli);":[["Simple *s = new Simple(idPaq, desc, idCli);","Las partes de un multiparte se crean con idPaquete = 0 y descripción \"parte\": el id y la descripción recibidos son del multiparte."]],
  "s->agregarArticulo(articulos[partes[0].at(i)]);":[["s->agregarArticulo(new Articulo(partes[0].at(i)));","Los artículos ya existen en la colección global del controlador: se busca el puntero por su id, no se crean de nuevo."]],
  "return paquetes[idPaq]->cantArticulos();":[["return ((Simple *) paquetes[idPaq])->cantArticulos();","No hace falta saber de qué tipo es el paquete: cantArticulos es virtual y cada uno responde con su versión."]]},
 ds:{"Controlador::altaPaquete":["Da de alta un nuevo paquete","paquete multiparte correspondiente."],"Controlador::cantArticulos":["Devuelve la cantidad de artículos","todas sus partes."],"Multiparte::cantArticulos":["Para un paquete de tipo multiparte, se cuentan","todas sus partes."]}},
jul26:{n:"Jul26",ord:["IRepartidor","RepartidorMoto","GeneradorRepartidores","ControladorRepartos"],pre:["Parcial P3 · Singleton","Parcial P3 · Clase abstracta e interfaz"],T:{p:P3Q,
  ok:[["ControladorRepartos es Singleton: instancia estática privada, constructor privado y getInstancia estática","Es lo que pide el estereotipo: una única instancia, a la que se llega por una operación de clase."],
   ["IRepartidor es una interfaz: en C++, una clase con sus operaciones virtuales puras y destructor virtual","C++ no tiene «interface»: se implementa como clase abstracta pura."],
   ["GeneradorRepartidores decide qué repartidor crear; el Controlador solo conoce IRepartidor","Es el mecanismo de fábrica: quien usa al repartidor no se acopla a las clases concretas."],
   ["Artículos y tandas se buscan por id; los pedidos de una tanda forman una secuencia ordenada","Por eso van un map para cada colección global y un vector para los pedidos."]],
  no:[["Donde el DCD dice Set(int) hay que usar set<int>","La letra lo aclara: Set(T) no implica set<T>. Los montos van «en orden» (y pueden repetirse): corresponde una colección con orden."],
   
   ["El Controlador elige si el repartidor va en moto o en bicicleta","La letra dice que esa selección «es responsabilidad de GeneradorRepartidores»."]]},
 hx:{"vector<Pedido *> pedidos;":[["set<Pedido *> pedidos;","Los pedidos de una tanda son una «secuencia ordenada»: un set no respeta el orden en que llegan."]],
  "vector<int> ControladorRepartos::calcularMontosPorPedido(DTTandaReparto datos) {":[["set<int> ControladorRepartos::calcularMontosPorPedido(DTTandaReparto datos) {","Set(T) en el DCD no obliga a usar set<T>. Los montos van en el orden de los pedidos y pueden repetirse: un set los reordena y saca los repetidos."]],
  "vector<int> calcularMontosPorPedido(DTTandaReparto);":[["set<int> calcularMontosPorPedido(DTTandaReparto);","Set(T) en el DCD no obliga a usar set<T>. Los montos van en el orden de los pedidos y pueden repetirse: un set los reordena y saca los repetidos."]],
  "if (distanciaTotal <= 5)":[["if (distanciaTotal < 5)","La letra dice «menor o igual a 5»: con < una distancia de 5 iría en moto."]],
  "tiempoTotal = tiempoTotal + pedidos[i].getDistanciaDesdeAnterior() * 5;":[["tiempoTotal = tiempoTotal + pedidos[i].getDistanciaDesdeAnterior() * 10;","10 es el factor de la bicicleta: la moto usa distancia * 5."]],
  "delete repartidor;":[["delete generador;","El generador es del controlador y se sigue usando. Lo que hay que liberar es el repartidor creado solo para este cálculo."]],
  "IRepartidor *repartidor = generador->obtenerRepartidor(datos);":[["RepartidorMoto *repartidor = new RepartidorMoto();","Elegir el tipo de repartidor es responsabilidad de GeneradorRepartidores: el controlador solo conoce la interfaz IRepartidor."]]},
 ds:{"ControladorRepartos::registrarArticulo":["Crea dinámicamente un Articulo","entero no negativo."],"ControladorRepartos::registrarTanda":["Recorre los pedidos del datatype","no son vacías."],
  "ControladorRepartos::calcularTiempoTotal":["Solicita al generador","retorna el resultado."],"ControladorRepartos::calcularMontosPorPedido":["Busca en la colección global la tanda","representar el resultado."],
  "GeneradorRepartidores::obtenerRepartidor":["Suma las distancias","retorna un RepartidorMoto."],"RepartidorMoto::calcularTiempoTotal":["Cada implementación concreta","distancia * 5."]}},
par26:{n:"Parcial 2026",ord:["Viaje","ConEscalas","Controlador"],pre:["Parcial P3 · Composite","Parcial P3 · Singleton"],T:{p:P3Q,
  ok:[["Viaje es abstracta: darCostoTotal se resuelve distinto en Directo y en ConEscalas","Es la estructura del patrón Composite: Viaje = componente, Directo = hoja, ConEscalas = compuesto. Por eso darCostoTotal es virtual pura en Viaje."],
   ["Un viaje con escalas está formado por otros viajes de cualquier tipo, en orden","Por eso guarda un vector de punteros a Viaje (la clase base), no a Directo."],
   ["El Controlador es Singleton y además genera los identificadores de los viajes","Instancia estática, getInstance estática y constructor privado; el último id usado también es un dato de la clase."],
   ["Todos los viajes, directos o con escalas, van en una colección global buscada por id","Por eso el pseudoatributo es un map de id a puntero a Viaje."]],
  no:[
   ["ConEscalas libera sus partes en el destructor","Las partes son viajes que siguen en la colección global del controlador (y pueden ser parte de otros viajes): no son solo suyas, así que no las libera."],
   ["ConEscalas guarda sus partes en un set<Viaje *>","Las partes son una «secuencia ordenada» de viajes: un set no respeta el orden recibido."]]},
 hx:{"viajes[nuevoId] = new Directo(nuevoId, dtv.getOrigen(), dtv.getDestino(), dtv.getCosto());":[["viajes[nuevoId] = new Viaje(nuevoId, dtv.getOrigen(), dtv.getDestino());","Viaje es abstracta (darCostoTotal es pura): no se puede instanciar. El viaje nuevo es un Directo."]],
  "viajes[nuevoId] = new ConEscalas(nuevoId, comps[0]->getOrigen(), comps[comps.size()-1]->getDestino(), comps);":[["viajes[nuevoId] = new ConEscalas(nuevoId, comps[0]->getDestino(), comps[comps.size()-1]->getOrigen(), comps);","El origen es el de la primera parte y el destino es el de la última."]],
  "vector<Viaje *> partes;":[["set<Viaje *> partes;","Las partes son una «secuencia ordenada» de viajes: un set no respeta el orden recibido."]],
  "comps.push_back(viajes[ids[i]]);":[["comps.push_back(new Viaje(ids[i]));","Las partes son viajes que ya existen en el sistema: se buscan por su id en la colección global, no se crean."]],
  "return viajes[idV]->darCostoTotal();":[["return viajes[idV]->getCosto();","Solo los directos tienen el atributo costo. darCostoTotal es virtual: cada viaje responde con su versión (el de escalas suma sus partes)."]]},
 ds:{"Controlador::agregarViaje":["Da de alta un nuevo viaje directo","el nuevo viaje directo."],"Controlador::componerViaje":["Da de alta un nuevo viaje con escalas","en el orden recibido."],
  "Controlador::calcularCostoViaje":["Devuelve el costo total","viaje existente en el sistema."],"ConEscalas::darCostoTotal":["El costo de un viaje con escalas","atributo costo."]}}};
window.P3D={};
Object.keys(P3X).forEach(id=>{const X=CDX.find(z=>z.id==id),H=P3X[id];if(!X||typeof kSet!="function")return;
 const G=H.n+" · P3",cont={},pure={},U=[],PR=["hx","base","this","acum","del","it","new","cont","eq","lim","ini","st","cls","fle","pto"],rep=[];
 X.blocks.forEach(b=>b.lines.forEach(l=>{let m;const re=/(vector|set|map)<[^;()=]*> (\w+)\b/g;while(m=re.exec(l[1]))cont[m[2]]=m[1]}));
 X.blocks.forEach(b=>{const m=/^class (\w+)/.exec(b.lines[0][1]);if(b.kind=="decl"&&m)pure[m[1]]=b.lines.map(l=>/^virtual .*\b(\w+)\(.*\) = 0;$/.exec(l[1])).filter(Boolean).map(z=>z[1])});
 const code=b=>`<div style="font-family:var(--m);font-size:13px;margin-bottom:6px">`+b.lines.map(l=>`<div style="padding-left:${l[0]*14}px">${esc(l[1])}</div>`).join("")+`</div>`,
  desc=k=>{const a=H.ds[k];if(!a)return"";const i=X.letra.indexOf(a[0]),j=X.letra.indexOf(a[1],i);return i<0||j<0?"":X.letra.slice(i,j+a[1].length)},
  o=(bi,k,x)=>Object.assign({ctx:H.n+" · Problema 3",ar:"cod",th:P3T[bi<0?0:1],kv:()=>`<div class="lt"><b>${esc(X.t)}</b></div>`+kFold("Letra",`<div class="lt">${esc(X.letra).replace(/\n/g,"<br>")}</div>`,bi<0)+
   kFold("Diagrama de clases (DCD)",`<img class="ltim" src="${X.img}" alt="DCD">`,bi<0)+(k&&desc(k)?`<div class="lt"><b>Qué tiene que hacer:</b> ${esc(desc(k))}</div>`:"")+(bi>0?kFold("Tu código hasta ahora",ordB.slice(0,bi).map(i=>code(X.blocks[i])).join(""),0):"")},x||{});
 U.push({id:"dis",cards:[kSet(G+" · el diseño","P3 · el diseño",H.T.p,H.T.ok.map(z=>({t:z[0],w:z[1]})),H.T.no,o(-1))]});
 const cl=b=>(/^class (\w+)/.exec(b.lines[0][1])||/(\w+)::/.exec(b.lines[0][1])||[])[1],ordB=[];
 /* orden: clase por clase, de la menos acoplada a la más acoplada (P3X.ord), y de cada una primero su .h y después sus operaciones */
 H.ord.concat(X.blocks.map(cl)).forEach(k=>X.blocks.forEach((b,i)=>{if(cl(b)==k&&!ordB.includes(i))ordB.push(i)}));
 ordB.forEach((bi,pos)=>{const b=X.blocks[bi],t0=b.lines[0][1],C=cl(b),B=(/: public (\w+)/.exec(t0)||[])[1],key=b.title.replace(/ \(.*\)$/,"");
  if(b.kind=="decl"){const cx={k:"decl",C,B,pure,cont,hx:H.hx},L=[],dis=[];
   b.lines.forEach((l,i)=>{const c=P3M(l[1],cx).slice(0,2),t=l[1];if(!c.length)return L.push({ind:l[0],t});
    L.push({ind:l[0],t,k:1,w:c[0][1],sn:/^class /.test(t)?"el encabezado de la clase":/~/.test(t)?"el destructor":/(\w+)\(/.test(t)?"la operación "+/(\w+)\(/.exec(t)[1]:"el atributo "+(/(\w+);$/.exec(t)||[0,""])[1]});
    c.forEach(d=>{dis.push([d[0],d[1],i]);rep.push(key+" ✗ "+d[0])})});
   if(dis.length)U.push({id:"b"+bi,cards:[kCode(G+" · .h de "+C,"P3 · .h de "+C,"Pasá "+C+" del DCD al .h. Lo que el DCD ya trae está puesto: elegí la línea correcta en cada lugar que falta.",L,dis,o(pos))]});return}
  const cx={k:b.kind,cont,hx:H.hx},isIt=l=>!/^\}/.test(l[1]),cand=b.lines.map((l,i)=>isIt(l)?P3M(l[1],Object.assign({sig:b.kind=="def"&&!i},cx)):[]);
  if(b.lines.length<3&&b.kind=="def"&&!cand[0].some(c=>c[2]!="cls"))return;
  const its=b.lines.map((l,i)=>i).filter(i=>isIt(b.lines[i])),cut=its.length>8?its[Math.ceil(its.length/2)]:0;
  (cut?[[0,cut],[cut,b.lines.length]]:[[0,b.lines.length]]).forEach((pr,pi)=>{const L=[],dis=[],pool=[];let prev=0;
   b.lines.forEach((l,i)=>{if(i>=pr[1])return;const it=i>=pr[0]&&isIt(l);L.push({ind:l[0],t:l[1],k:it?2:0,sep:!prev,w:it&&cand[i][0]?cand[i][0][1]:""});prev=it;if(it)cand[i].forEach(c=>pool.push(c))});
   PR.forEach(r=>pool.filter(c=>c[2]==r).slice(0,r=="hx"?9:1).forEach(c=>{if((r=="hx"||dis.length<4)&&!L.some(l=>l.t==c[0])&&!dis.some(d=>d[0]==c[0])){dis.push([c[0],c[1]]);rep.push(key+" ✗ "+c[0])}}));
   const nm=key+(cut?" "+(pi+1)+"/2":"");
   U.push({id:"b"+bi+(pi?"b":""),cards:[kCode(G+" · "+nm,"P3 · "+nm,b.kind=="stat"?"¿Cómo se define en el .cpp este atributo estático?":"Armá la operación línea por línea"+(pi?" (sigue).":"."),L,dis,
    Object.assign(o(pos,key),{th:P3T[b.kind=="stat"?3:2],ko:"Las líneas van en el orden del código; dos líneas seguidas que no dependen una de la otra valen en cualquier orden."}))]})})});
 const GR=[];U.forEach(u=>{const g=u.cards[0].g.split(" · P3 · ")[1],k=u.id=="dis"?"dis":(/^\.h de (\w+)/.exec(g)||/(\w+)::/.exec(g)||[0,g])[1],l=GR[GR.length-1];if(l&&l.k==k)l.cards.push(u.cards[0]);else GR.push({k,id:u.id=="dis"?"dis":"g"+GR.length,cards:[u.cards[0]]})});
 kChain(G,GR,{req:P3I.concat(H.pre)});window.P3D[id]={U,rep,GR}});

/* ===== Teórico «Patrones de diseño» e «Implementación y generación de código» (material de Luca, 16/11), en series binarias de Principal (dentro del filtro P3; las de P3I son previas de las cadenas) =====
   [título de la serie, teoría del primer paso (se muestra con «No sé»), [[pregunta, correcta, error tentador, por qué]…]]. Solo lo que dice el teórico; los
   ejemplos (Venta, Jornalero, punto de venta, puerta) son los suyos y, donde ayuda, se conecta con los problemas 3 de los exámenes. */
[["Parcial P3 · Del DCD al código: la estructura","Del DCD salen: interfaces (en C++, clase abstracta pura con destructor virtual), clases, generalizaciones y realizaciones (: public), asociaciones (pseudoatributo: puntero si la multiplicidad máxima es 1, colección si es mayor) y dependencias (#include).",
 [["C++ no tiene «interface». ¿Cómo se implementa una interfaz del DCD?","Clase sin atributos, con todas sus operaciones virtuales puras (= 0) y destructor virtual","Clase común con las operaciones vacías","Una interfaz solo declara: en C++ es una clase abstracta pura. Lleva destructor virtual (vacío) para poder destruir un objeto por puntero a la interfaz."],
  ["Asociación navegable de A hacia B con multiplicidad 0..1 o 1. ¿Qué va en A?","Un puntero: B *b;","Una colección: set<B *> bs;","Multiplicidad máxima 1: alcanza con un puntero (pseudoatributo) al objeto de destino."],
  ["Asociación navegable de A hacia B con multiplicidad * o 1..*. ¿Qué va en A?","Una colección de punteros (set, vector o map)","Un puntero: B *b;","Multiplicidad máxima mayor que 1: el pseudoatributo es una colección."],
  ["El extremo de la asociación dice {ordered}. ¿Qué colección uso?","Una que mantenga el orden (vector, list)","set, porque no repite elementos","{ordered} pide una colección que conserve el orden en que se cargan los elementos; un set los ordena a su manera."],
  ["La asociación es navegable solo de A hacia B. ¿Quién lleva el pseudoatributo?","Solo A","A y B: cada uno apunta al otro","El pseudoatributo va en la clase de origen de la navegabilidad. B no conoce a A."],
  ["Una dependencia del DCD (flecha punteada), ¿en qué se convierte en C++?","En un #include del .h de la otra clase","En un atributo puntero","La dependencia solo pide que el tipo sea visible: se resuelve con #include. Los atributos son para las asociaciones. (En los exámenes suelen pedir no escribir los #include.)"],
  ["Generalización: Jornalero es un Empleado. ¿Cómo se declara?","class Jornalero : public Empleado { … }","class Jornalero { Empleado *base; … }","La herencia y la realización de una interfaz se escriben igual en C++: «: public Base»."]]],
["Parcial P3 · Constructores y destructores","El constructor se llama igual que la clase y no tiene tipo de retorno: en el .h, Paquete(int, string, int); y en el .cpp, Paquete::Paquete(int idP, string desc, int idCli) { … }. El destructor es ~Paquete(). Una subclase llama al constructor de su base en la lista de inicialización. El destructor libera lo que la clase creó con new y es solo suyo.",
 [["En el .h de la clase Paquete, ¿cómo se declara su constructor?","Paquete(int, string, int);","void Paquete(int, string, int);","El constructor se llama igual que la clase y NO lleva tipo de retorno, ni siquiera void."],
  ["¿Y el destructor?","~Paquete();","delete Paquete();","El destructor es el nombre de la clase con ~ adelante, sin parámetros ni tipo de retorno."],
  ["En el .cpp, el constructor de Paquete empieza con…","Paquete::Paquete(int idP, string desc, int idCli)","Paquete(int idP, string desc, int idCli)","En el .cpp todo lleva delante el nombre de la clase y ::, también el constructor: Clase::Clase(…)."],
  ["Simple hereda de Paquete. ¿Cómo carga los atributos heredados?","Llamando al constructor de la base: Simple::Simple(…) : Paquete(idP, desc, idCli) { }","Asignándolos uno por uno en el cuerpo","Son privados de Paquete: la subclase no los toca; se los pasa al constructor de la base en la lista de inicialización."],
  ["¿Cuándo hace falta escribir un destructor con código?","Cuando la clase creó objetos con new que son solo suyos","Siempre, para todos los punteros que guarda","Solo se libera lo propio. Los objetos compartidos (los que viven en la colección de otro) no se tocan."]]],
["Parcial P3 · Del diagrama de comunicación al método","El cuerpo de cada método sale del diagrama de comunicación: los mensajes que manda ese objeto, en orden, son las llamadas del método; un mensaje a todos los elementos de una colección es un recorrido. Se implementa empezando por las clases menos acopladas.",
 [["¿De dónde sale el cuerpo de un método?","Del diagrama de comunicación: los mensajes que manda ese objeto son sus llamadas","Del modelo de dominio","El DCD da la estructura (el .h); las interacciones dan el cuerpo de los métodos."],
  ["En el diagrama, Venta le manda subtotal() a cada LineaDeVenta de «lineas» y suma. ¿Cómo queda totalVenta()?","Un for que recorre lineas y acumula ldv->subtotal()","Una sola llamada: lineas->subtotal()","Un mensaje a todos los elementos de una colección es un recorrido: se itera y se le pide a cada elemento."],
  ["subtotal() necesita el precio del producto. ¿Quién llama a getPrecio()?","LineaDeVenta, dentro de subtotal()","Venta, dentro de totalVenta()","Los mensajes anidados (1.1, 1.1.1…) los manda el objeto que recibió el mensaje anterior, desde su propio método."],
  ["¿Por qué clases conviene empezar a implementar?","Por las menos acopladas (las que no dependen de otras)","Por el controlador, que es la más importante","Así, al codificar una clase, todo lo que usa ya existe. Los controladores y fachadas van al final."],
  ["¿Qué se gana con ese orden?","Cada clase se puede probar apenas se termina","Se escribe menos código","Como sus dependencias ya están disponibles, cada clase admite pruebas unitarias inmediatas."]]],
["Parcial P3 · Qué es un patrón de diseño","Un patrón de diseño nombra y explica una solución general a un problema que se repite en diseños orientados a objetos: describe el problema y su contexto, la solución (clases y objetos), cuándo aplicarla y sus consecuencias.",
 [["¿Qué describe un patrón de diseño?","Un problema que se repite, su solución general, cuándo aplicarla y sus consecuencias","El código de una clase listo para copiar","Es una solución abstracta (una disposición de clases y objetos), no código: se adapta a cada diseño."],
  ["La solución de un patrón es una «colaboración abstracta». ¿Qué es aplicarlo?","Asignar clases reales del diseño a los roles del patrón","Agregar al diseño clases con los nombres del patrón","Ejemplo del teórico: Formulario como Consumidor, ISistema como IProveedor y Controlador como ProveedorConcreto."],
  ["Antes de elegir un patrón, ¿qué hay que revisar?","Su aplicabilidad: que el problema sea el que el patrón resuelve","Que sume la mayor cantidad posible de clases","Aplicarlo sin que haga falta agrega complejidad y clases de más."],
  ["¿Qué sección de la descripción de un patrón trae el diagrama de clases de la solución?","Estructura","Interacciones","Las secciones son: Nombre, Problema, Estructura (clases), Participantes, Interacciones (la dinámica) y Consecuencias."]]],
["Parcial P3 · Qué problema resuelve cada patrón","Problema que se repite → patrón: clase con una única instancia → Singleton; simples y compuestos tratados igual → Composite; comportamiento que cambia con el estado → State; reaccionar a eventos de otro objeto → Observer; no acoplarse a clases concretas → Factory; entrada común a varias interfaces → Facade; recorrer una colección → Iterator.",
 [["¿Qué patrón? Tratar igual a un objeto simple y a uno formado por otros (estructura de árbol)","Composite","State","Composite: Componente, Hoja y Compuesto. El cliente usa a todos por la interfaz del componente."],
  ["¿Qué patrón? Que una clase tenga una única instancia, accesible desde cualquier lado","Singleton","Facade","Singleton: constructor privado y una operación de clase que devuelve la única instancia."],
  ["¿Qué patrón? Que un objeto cambie su comportamiento cuando cambia su estado interno","State","Observer","State: el contexto delega en un objeto estado; cambiar de estado es cambiar ese objeto."],
  ["¿Qué patrón? Que varios objetos reaccionen a un evento de otro, sin que este conozca sus clases","Observer","State","Observer: el sujeto guarda una lista de observadores y los notifica; solo conoce la interfaz IObserver."],
  ["¿Qué patrón? Usar objetos sin acoplarse a sus clases concretas","Factory","Singleton","La fábrica crea el objeto concreto y devuelve la interfaz: el consumidor nunca nombra la clase concreta. (En Jul26: GeneradorRepartidores devuelve un IRepartidor.)"],
  ["¿Qué patrón? Dar un punto de entrada común a un conjunto de interfaces","Facade","Proxy","Facade es la entrada común. Proxy y Adapter, en cambio, controlan o uniformizan el acceso a UN objeto."],
  ["¿Qué patrón? Recorrer los elementos de una colección sin exponer cómo está hecha","Iterator","Composite","Iterator: se recorre con un objeto iterador (hasCurrent, next, getCurrent), sin conocer la estructura interna."]]],
["Parcial P3 · Singleton: cuándo y con qué consecuencias","Singleton: debe existir exactamente una instancia de la clase y cualquiera llega a ella por una operación de clase conocida (getInstancia). El constructor es privado; si la instancia no existe, getInstancia la crea.",
 [["¿Cuándo se aplica Singleton?","Debe haber exactamente una instancia, accesible por una operación de clase conocida","Cuando una clase tiene muchas subclases","Son las dos condiciones de aplicabilidad: instancia única y punto de acceso global."],
  ["Un cliente llama a getInstancia() y la instancia todavía no existe. ¿Qué pasa?","Se crea (con el constructor privado) y se devuelve","Devuelve NULL y el cliente la crea","Solo la propia clase puede crearla: getInstancia la crea la primera vez y después devuelve siempre la misma."],
  ["¿Qué desventaja tiene?","Heredar de una clase Singleton es complicado","La instancia no se puede liberar","Derivar de un Singleton es complejo. Liberar la instancia sí se puede: el cliente puede hacerlo explícitamente."],
  ["¿Dónde se usa típicamente?","Fábricas, manejadores y controladores","Datatypes","Son objetos de los que alcanza con uno y a los que todos necesitan llegar. (Controlador en el Parcial 2026 y ControladorRepartos en Jul26.)"]]],
["Parcial P3 · Composite","Composite: Componente declara las operaciones comunes; Hoja es un objeto simple, sin hijos; Compuesto guarda componentes hijos y resuelve cada operación delegando en ellos. El cliente trata a todos por igual, a través del Componente.",
 [["En Composite, ¿qué hace el Compuesto cuando le piden Operacion()?","Se la pide a cada uno de sus hijos","Pregunta de qué tipo es cada hijo y decide","El compuesto delega en sus hijos (para cada hijo: hijo.Operacion()). No hay condicionales por tipo."],
  ["Viaje, Directo y ConEscalas (Parcial 2026): ¿quién es quién?","Viaje = Componente, Directo = Hoja, ConEscalas = Compuesto","Viaje = Compuesto; Directo y ConEscalas = Hojas","ConEscalas está formado por otros viajes, de cualquier tipo: es el compuesto. Directo no tiene partes: es la hoja."],
  ["¿Qué gana el cliente (el Controlador)?","Llama a la operación sin preguntar si el objeto es simple o compuesto","Puede crear objetos sin new","Se eliminan los condicionales por tipo en el cliente y es fácil sumar componentes nuevos."],
  ["¿Qué desventaja tiene Composite?","Es difícil restringir qué tipos de hijos admite un compuesto","No se pueden agregar hojas nuevas","Como los hijos son «componentes», limitar sus tipos cuesta. (En Feb26 se resolvió en el diseño: Multiparte guarda Simple *, no Paquete *.)"],
  ["En C++, ¿cómo se declara en el Componente la operación común?","virtual … = 0, y cada subclase la implementa","Como operación común, sin virtual","Tiene que ser virtual para que, llamada por puntero al componente, se ejecute la versión de la hoja o la del compuesto."]]],
["Parcial P3 · State","State: el Contexto guarda una referencia a su Estado actual y le delega el comportamiento; cada EstadoConcreto es una clase que implementa los eventos. Cambiar de estado es reemplazar ese objeto por otro.",
 [["¿Cuándo conviene State?","El comportamiento depende del estado y las operaciones se llenan de condicionales sobre él","Hay que avisar a otros objetos de un cambio","Ejemplo del teórico: una puerta automática que, con el mismo botón, se abre o se cierra según su estado."],
  ["El Contexto recibe solicitud(). ¿Qué hace?","Delega en su estado actual: estado.evento()","Un if por cada estado posible","Los condicionales desaparecen: cada estado concreto sabe qué hacer."],
  ["¿Cómo se cambia de estado?","Se reemplaza el objeto estado del Contexto por otro EstadoConcreto","Se cambia un atributo entero del Contexto","Cada estado es una clase; la transición asigna una instancia nueva a la referencia del contexto («become»)."],
  ["En C++, ¿qué hay que definir además al cambiar de estado?","Quién libera el objeto estado anterior","Nada: se libera solo","Sin recolector de basura, alguien tiene que hacer el delete del estado viejo."],
  ["Los estados concretos no tienen atributos propios. ¿Qué se puede hacer?","Que cada uno sea Singleton","Que hereden del Contexto","Si no guardan datos, alcanza con una instancia de cada estado: se evita crear y destruir objetos en cada transición."]]],
["Parcial P3 · Observer","Observer: el Subject guarda una colección de IObserver (agregar / eliminar) y, cuando ocurre el evento, la recorre llamando notify en cada uno. No conoce las clases concretas de los observadores.",
 [["El punto de venta avisa al Depósito y a los Proveedores cuando un producto queda sin stock. ¿Qué conoce el Subject?","Solo la interfaz IObserver","Las clases Deposito y Proveedor","Ese es el desacople: se pueden sumar observadores nuevos sin tocar al sujeto."],
  ["¿Cómo notifica el Subject?","Recorre sus observadores y llama notify en cada uno","Cada observador le pregunta cada tanto si hubo cambios","notificarObservadores(): para cada o en observers, o.notify(…). Es un aviso a todos (broadcast)."],
  ["¿Qué operaciones tiene el Subject para manejar a sus observadores?","agregar(IObserver) y eliminar(IObserver)","new Deposito() y new Proveedor()","Los observadores se registran y se dan de baja; el sujeto no los crea ni sabe de qué clase son."],
  ["En C++, ¿qué pseudoatributo lleva el Subject?","Una colección de punteros a la interfaz: set<IObserver *>","Un puntero: IObserver *observer;","Son varios observadores (multiplicidad *): colección de punteros a IObserver."],
  ["¿Qué riesgo tiene Observer?","Notificaciones en cascada que nadie previó","No admite observadores nuevos","Un observador notificado puede provocar más cambios y más notificaciones; además se notifica en un orden fijo, uno tras otro."]]]
].forEach(z=>SWC.push(Object.assign(sw("p4",z[0],null,z[2].map((s,i)=>Object.assign(st(s[0],s[1],s[2],s[3],""),i?{}:{th:z[1]}))),{tm:"p3"})));
/* Obsoletas: daban las respuestas de la cadena de Feb26 (ahora se deciden ahí) */
SWC.forEach(c=>{if(/^Parcial P3 · (Herencia y constructores|Controlador: de datos a objetos)$/.test(c.g))c.hid=1});
