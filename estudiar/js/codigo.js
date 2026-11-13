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
