/* SECCIÓN EXAMEN: los demás problemas de las pruebas de Prog4, dentro de Principal (pedido de Luca, 16/11).
   Problema 2b (DCD), Problema 1b (DSS) y Problema 1a (Modelo de dominio). El Problema 3 (C++) está en js/codigo.js.
   Las tres cadenas están hechas (DCDX, DSSX, MDX). El Problema 3 en Principal (P3X) y las series del teórico están al final de js/codigo.js, que usa estos mismos armadores.
   DECISIONES DIDÁCTICAS (mismo método que los diagramas de comunicación; ver RECETA al inicio de js/prog4.js)
   - Cada tema se desarma en las ACCIONES del estudiante y hay una tarjeta (o pack) por acción, en el orden en que se resuelve en el examen.
   - Sin spoilers: una tarjeta solo muestra la letra y lo que el estudiante ya decidió en tarjetas anteriores («… hasta ahora»).
   - Fichas: «conjunto» (kSet: elegir todas las correctas, orden libre) y «casilleros» (kSeq: decisiones en orden fijo, con lo arbitrario ya puesto).
     Los nombres inventados (operaciones del DSS, DataTypes, clases) nunca se piden: van puestos o unidos a la decisión.
   - Cada ficha equivocada es un error real y tentador, con su razón defendible; al fallar se resalta la frase de la letra de donde sale el dato.
   - Solo material real: letra tal cual y solución oficial (Feb26 y Jul26). El Parcial 2026 se sumó después, con su solución oficial (los fragmentos del DSS pueden ir anidados).
   - Previaturas: dentro de un ejercicio cada unidad pide la anterior sin errores (token m:<ejercicio>:<unidad>); el DCD pide los dos diagramas de su examen.
   - Una ficha equivocada puede llevar la frase de la letra que la desmiente (último dato de cada dis: "S:u1"); al tocarla se resalta esa frase.
   - La letra del Problema 1 (realidad + caso de uso) de Feb26 y Jul26 está transcripta tal cual en P1L (más abajo): no hace falta volver a los PDF.
   - REVISIÓN FRASE POR FRASE (18/11, tras la nota de Luca sobre las ciudades del conductor): antes de dar por terminado un tema, recorrer cada frase de
     la letra y preguntar (1) ¿qué ficha la representa en el diagrama? y (2) ¿cuál es la forma equivocada más tentadora de escribirla (otra notación
     posible del mismo dato: atributo en vez de asociación, enumerado en vez de subclases, parámetro de más)? Las dos tienen que ser fichas de la MISMA
     tarjeta, frente a frente. Si una frase no tiene ficha, falta una tarjeta o una decisión.
   RECETA PARA SUMAR UN EXAMEN: DCD → una entrada en DCDX (los datos salen solos de las líneas de comunicación); DSS → letra en P1L + una entrada en DSSX;
   Modelo de dominio → una entrada en MDX. Después: actualizar ?v= en index.html, simular las cadenas con jsdom, commit y push. */

/* PAQUETES (pedido de Luca, 16/11): las tarjetas de un ejercicio salen seguidas y en orden, como los pasos de un diagrama de comunicación, aunque haya
   errores; el paquete se aprueba si no hubo ninguno y, si no, vuelve entero. Modelo de dominio = un paquete; DSS = dos (el diagrama y sus DataTypes);
   P3 = el diseño y después un paquete por clase (su .h o sus operaciones seguidas); Lógica = un paquete por ejercicio.
   INTRODUCCIÓN A CADA TEMA (pedido de Luca, 16/11): series binarias cortas con las reglas, DENTRO del filtro de su tema (tm) y como previa de sus cadenas
   (hay que completarlas sin errores). Usan ejemplos neutros para no adelantar respuestas de los exámenes. Las series viejas «Parcial P1a/P1b» quedaron
   ocultas (hid): daban respuestas de Feb26 y Jul26 que ahora se deciden en las cadenas. */
const KIN={md:[],dss:[],dcd:[]};
[["md","Modelo de dominio · qué es cada cosa","Clase: concepto con datos propios y relaciones. Enumerado: conjunto fijo de valores. Subclases: tipos con datos propios. DataType: valor compuesto sin identidad. Clase de asociación: datos que dependen de un par. Las relaciones van como asociaciones, nunca como atributos.",
 [["Un concepto de la realidad que tiene datos propios y se relaciona con otros","Clase","Atributo","Si tiene datos propios o relaciones, es una clase. Un atributo es un dato simple de una clase."],
  ["«El color puede ser rojo, verde o azul»","Enumerado, usado como tipo de un atributo","Clase Color","Un conjunto fijo de valores sin datos propios es un enumerado."],
  ["«Hay tres tipos de cuenta y de cada tipo se registran datos distintos»","Subclases de Cuenta","Un enumerado TipoCuenta","Si cada tipo tiene datos (o relaciones) propios hacen falta subclases; con un enumerado no hay dónde ponerlos."],
  ["«Una cuenta puede estar activa o bloqueada» (sin más datos)","Atributo de tipo enumerado","Subclases Activa y Bloqueada","El estado no agrega datos y cambia con el tiempo; un objeto no cambia de clase."],
  ["Una fecha (día, mes, año)","«DataType»","Clase con asociaciones","Es un valor compuesto, sin identidad: dos fechas iguales son la misma."],
  ["La nota de un estudiante en un curso","Clase de asociación entre Estudiante y Curso","Atributo nota en Estudiante","La nota no es del estudiante solo ni del curso solo: depende del par."],
  ["Para decir que un libro es de una editorial","Una asociación Libro–Editorial","Un atributo codigoEditorial en Libro","En el modelo de dominio no se ponen «claves foráneas»: el vínculo es la asociación."]]],
["md","Modelo de dominio · qué restricciones se escriben","Se escribe en lenguaje natural lo que el diagrama no alcanza a decir: unicidad (global o «dentro de»), integridad circular (ciclos del diagrama), atributos calculados y reglas de negocio. Lo que ya dicen las multiplicidades no se repite.",
 [["«El código del producto es único»","Se escribe como restricción de unicidad","No se escribe: ya lo muestra el diagrama","El diagrama de dominio no marca identificadores: la unicidad va escrita."],
  ["«El número de sala es único dentro de su edificio»","Unicidad relativa: hay que escribir «dentro de su edificio»","Unicidad en todo el sistema","Dos edificios pueden tener una sala con el mismo número."],
  ["El diagrama tiene un ciclo de asociaciones. ¿Qué reviso?","Si los dos caminos tienen que llegar al mismo objeto (integridad circular)","Nada: los ciclos no importan","El diagrama solo no garantiza que los dos caminos coincidan: si deben coincidir, se escribe.","Integridad circular, con un ejemplo: Empleado trabaja en un Departamento, cada Departamento es de una Empresa y cada Empleado tiene un contrato con una Empresa. Las tres asociaciones forman un ciclo: desde un empleado se llega a una empresa por dos caminos (por su departamento y por su contrato). El diagrama permite que den empresas distintas; si en la realidad tienen que ser la misma, hay que escribirlo: «la empresa del contrato de un empleado es la empresa de su departamento». Cómo buscarlas: mirar cada ciclo del diagrama y preguntarse si los dos caminos tienen que llegar al mismo objeto."],
  ["«El total es la suma de los subtotales»","Se deja el atributo y se escribe cómo se calcula","Se saca el atributo total","Es un atributo calculado: va en la clase y su fórmula va como restricción."],
  ["«Cada factura es de un único cliente»","No se escribe: ya lo dice la multiplicidad 1","Se escribe como restricción","Lo que el diagrama ya expresa no se repite."],
  ["«La cantidad pedida no puede superar el stock»","Regla de negocio: se escribe","Se expresa con una multiplicidad","Relaciona atributos de dos clases: el diagrama no puede decirlo."]]],
["dss","DSS · mensajes, parámetros y retornos","En el DSS hay un actor y una sola línea de vida, :Sistema. Cada cosa que el actor le da o le pide al Sistema es un mensaje; lo que el Sistema muestra es el retorno de ese mensaje. Viajan datos y DataTypes, nunca objetos del dominio.",
 [["¿Quiénes aparecen en un DSS?","El actor y :Sistema, como una sola línea de vida","El actor y las clases del dominio","El sistema es una caja negra: todavía no se muestra qué objetos hay adentro."],
  ["«El usuario ingresa su nombre»","Un mensaje del actor al Sistema, con el nombre como parámetro","Una nota","Cada dato que el actor le da al Sistema viaja en un mensaje."],
  ["«El sistema muestra los productos»","El retorno del mensaje anterior","Un mensaje del Sistema al actor","El Sistema no manda mensajes: responde. Lo que muestra es lo que devuelve."],
  ["¿Qué puede ir como parámetro?","Datos: identificadores, valores, DataTypes","Objetos del dominio (p: Producto)","El actor no tiene objetos: indica cuál con el dato que lo identifica."],
  ["El Sistema devuelve varios datos de un producto","Un DataType: DTProducto","El objeto Producto","Del Sistema no salen objetos del dominio: se arma un DataType con lo que hay que mostrar."],
  ["«lista todos los productos»","Set(DTProducto)","DTProducto","Son varios: una colección de DataTypes."]]],
["dss","DSS · memoria y fragmentos","Memoria: si un dato se usa en un mensaje posterior que no lo vuelve a mandar, se anota que el Sistema lo recuerda; al terminar (confirmar o cancelar) se libera. Fragmentos: loop para lo que se repite, alt para caminos excluyentes, opt para algo que puede pasar una vez o ninguna; todos con su guarda.",
 [["Un dato llega en un mensaje y se usa en otro posterior","Nota: el Sistema lo recuerda","Se vuelve a mandar en cada mensaje","El Sistema guarda lo que va a necesitar; repetir parámetros es un error típico."],
  ["El caso de uso termina (confirma o cancela)","Nota: se libera la memoria","No se anota nada","Lo que se venía recordando se libera siempre, también si se cancela."],
  ["«Esto se repite para cada ítem»","loop con su guarda","alt","Repetición: loop, con la condición entre corchetes."],
  ["«Finalmente confirma o cancela»","alt con una guarda por camino","opt","Son dos caminos excluyentes, cada uno con su mensaje."],
  ["«Si quiere, puede agregar una observación» (una vez o ninguna)","opt","loop","Un solo camino opcional es opt; si pudiera repetirse sería loop."]]],
["dcd","DCD · de los diagramas de comunicación al DCD","El DCD sale de los diagramas: una asociación navegable por cada flecha que se recorre por un atributo propio (con * si llega a una colección), una dependencia cuando se usa algo conocido solo por parámetro, variable local o global, y cada operación declarada en la clase que la recibe.",
 [["A le manda un mensaje a un B al que llega por un atributo propio","Asociación navegable A → B","Dependencia A ⇢ B","Visibilidad por atributo = asociación."],
  ["A usa un B que le llegó por parámetro o guardó en una variable local","Dependencia A ⇢ B (punteada)","Asociación A → B","Si no hay un atributo que lo sostenga, es solo una dependencia."],
  ["A le manda calcular() a B. ¿Dónde se declara calcular()?","En B, que la recibe","En A, que la manda","Las operaciones se declaran en la clase del receptor."],
  ["Los mensajes find, add y remove sobre una colección","No se declaran: son de la colección","Se declaran en la clase de los elementos","Vienen dadas con la colección."],
  ["La flecha llega a una colección de B","La asociación lleva * del lado de B","Lleva 1 del lado de B","Colección = muchos."]]]
].forEach(z=>{KIN[z[0]].push(z[1]);SWC.push(Object.assign(sw("p4",z[1],null,z[3].map((s,i)=>Object.assign(st(s[0],s[1],s[2],s[3],""),s[4]?{th:s[4]}:i?{}:{th:z[2]}))),{tm:z[0],ar:"mod"}))});
SWC.forEach(c=>{if(/^Parcial P1[ab] · /.test(c.g))c.hid=1});

/* ===== Armadores genéricos (tarjetas «kit»: nucleo.js las dibuja con c.kq/c.kp/c.kv/c.ko) ===== */
const KNL=()=>({t:"",k:"a",auto:1,nl:1});
function kCard(g,q,p,exp,bank,o){const c=Object.assign(sw("p4",g,(o&&o.ctx)||null,[Object.assign(st(q,exp.filter(x=>!x.auto).map(x=>x.t).join("\n"),"—",""),{k:"bld"})],""),{bld:{exp,bank,n:exp.length},kq:q,kp:p},o||{});SWC.push(c);return c}
/* Conjunto: hay que elegir todas las correctas; orden libre salvo dependencias. items: [texto | {t,w,hl,dp:[índices]}]; dis: [[texto, por qué no]] */
function kSet(g,q,p,items,dis,o){const X=items.map((it,i)=>Object.assign({k:"ks",fr:1,o:i},typeof it=="string"?{t:it}:it));X.forEach(x=>{x.dp=(x.dp||[]).map(i=>X[i])});
 const exp=[];X.forEach((x,i)=>{if(i)exp.push(KNL());exp.push(x)});
 return kCard(g,q,p,exp,X.map(x=>({t:x.t,rt:1})).concat((dis||[]).map(d=>({t:d[0],why:d[1],hl:d[2]}))),o)}
/* Casilleros en orden fijo. slots: [texto ya puesto (string; "\n" = salto) | {t, sn: nombre del casillero, w, hl, own: sus fichas son solo de este casillero}];
   dis: [[texto, por qué no, n° de casillero propio (opcional, desde 1 contando solo los casilleros)]] */
function kSeq(g,q,p,slots,dis,o){let n=0;const exp=slots.map(s=>typeof s=="string"?(s=="\n"?KNL():{t:s,k:"a",auto:1}):Object.assign({k:"kq",sl:++n},s));
 return kCard(g,q,p,exp,exp.filter(x=>!x.auto).map(x=>({t:x.t,sl:x.own?x.sl:undefined})).concat((dis||[]).map(d=>({t:d[0],why:d[1],sl:d[2],hl:d[3]}))),o)}
/* Cadena de un ejercicio: units = [{id, cards}]. La primera tarjeta de cada unidad es la dueña del pack; al acertar la unidad sin errores se da el token
   m:<g>:<id> y sigue la unidad siguiente. o.req = previas de la primera unidad; o.T = tarjeta inicial del ejercicio (va antes de la primera unidad). */
function kChain(g,units,o){o=o||{};const ent=[];
 units.forEach((u,i)=>{const own=u.cards[0],rest=u.cards.slice(1);own.pack=rest.length?rest:null;own.toks=["m:"+g+":"+u.id];own.req=i?["m:"+g+":"+units[i-1].id]:(o.req||[]);rest.forEach(x=>{x.ln=1;x.pk=own});ent.push(own)});
 if(o.T){const e0=ent[0];o.T.req=e0.req;o.T.then=e0;e0.req=[];e0.ln=1;ent[0]=o.T}
 ent.forEach((e,i)=>{if(ent[i+1]){e.next=ent[i+1];if(e.then)e.then.next=ent[i+1]}});return ent}
/* Frases de la letra (S: textos) con resaltado: una ficha esperada lleva hl:"S:<id>,<id>" y nucleo.js lo deja en b.hl al fallar */
const kHs=b=>String(b&&b.hl||"").startsWith("S:")?b.hl.slice(2).split(","):[];
const kSent=(S,ids,hs)=>ids.map(i=>`<div class="lt${hs.includes(String(i))?" hl":""}">${esc(S[i])}</div>`).join("");
const kFold=(t,h,open)=>h?`<details${open?" open":""}><summary>${esc(t)}</summary>${h}</details>`:"";

/* ===== Problema 2b: DCD resultante de los diagramas de comunicación =====
   Acciones del estudiante: juntar las flechas de las DOS operaciones (asociaciones navegables, con * si es colección) → marcar las dependencias
   (una clase usa a otra que conoce solo por parámetro, variable local o global) → declarar cada operación en la clase que la RECIBE.
   Todo se deriva de las líneas ya cargadas (window.P4EX, js/prog4.js). sup = subclase → clase base, para no pedir una dependencia donde ya alcanza
   la asociación de la base. Regla del curso: visibilidad por asociación = asociación; por parámetro, local o global = dependencia.
   skip = pares que no se piden ni se usan como ficha equivocada (la solución de referencia los dibuja como asociación en los dos sentidos aunque
   el diagrama los use por parámetro). Los getters sin parámetros no se piden (dónde declararlos es discutible). */
const DCDX=[
{id:"Parcial 2026",gs:["postularse","aceptarPostulacion"],sup:{Remunerada:"OfertaPasantia",NoRemunerada:"OfertaPasantia"},skip:["Postulacion>Estudiante"],
 pide:"b) Realizar el Diagrama de Clases de Diseño resultante de los diagramas anteriores. Definir solo las asociaciones y dependencias utilizadas en los diagramas de comunicación."},
{id:"Jul26",gs:["Jul26 · bajaMascota","Jul26 · reservarHospedaje","Jul26 · Hotel.reservar"],sup:{Dueño:"Usuario",Cuidador:"Usuario",Hotel:"Hospedaje",Casa:"Hospedaje"},skip:["Reserva>Mascota"],
 pide:"b) Realizar el Diagrama de Clases de Diseño (DCD) resultante de los diagramas anteriores. Definir solo las asociaciones y dependencias utilizadas en los diagramas de comunicación."},
{id:"Feb26",gs:["Feb26 · iniciarMisionAplicacion","Feb26 · calcularHerbicidaTotal"],sup:{Mapeo:"Mision",AplicacionHerbicida:"Mision"},skip:["AplicacionHerbicida>Mapeo"],
 nota:"Ojo: la solución oficial de feb-2026 solo dibuja la dependencia hacia el Controlador (global); la de jul-2026 dibuja también las de parámetro y variable local. Acá va la regla completa.",
 pide:"b) Realizar el Diagrama de Clases de Diseño (DCD) resultante de los diagramas anteriores. Definir solo las relaciones y dependencias utilizadas en los diagramas de comunicación."}];
window.DCDD={};
DCDX.forEach(X=>{if(!window.P4EX||X.gs.some(g=>!P4EX[g]))return;
 const sup=X.sup||{},opn=g=>g.replace(/^(Jul26|Feb26) · /,""),GEN=/^(find|next|create|add|remove|destroy|getInstance)$/,LL=[];
 X.gs.forEach(g=>{const E=P4EX[g],VT={};/* clase de cada variable: por su aparición nombre:Clase o por la colección de la que sale (find/next) o lo que crea (create) */
  E.cs.forEach(c=>{const L=c.dg.cur;if(L.res&&(/^(find|next)$/.test(L.op)&&/ \*$/.test(L.to)||L.op=="create"))VT[L.res]=VT[L.res]||E.cls(L.to)});
  const ty=v=>E.M[v]||VT[v];E.cs.forEach(c=>LL.push({g,L:c.dg.cur,cls:E.cls,ty,hop:E.hopOf(c.dg.cur),ref:"mensaje "+c.dg.cur.n+" de "+opn(g)}))});
 const skp=(a,b)=>(X.skip||[]).includes(a+">"+b);
 /* asociaciones navegables (una subclase que navega igual que su base se dibuja en la base) */
 let H=[];LL.forEach(x=>{const h=x.hop;if(!h)return;const e=H.find(z=>z.a==h.a&&z.b==h.b);if(e)e.w=e.w||h.w;else H.push({a:h.a,b:h.b,w:h.w,ref:x.ref,li:LL.indexOf(x)})});
 H=H.filter(h=>!(sup[h.a]&&H.some(z=>z.a==sup[h.a]&&z.b==h.b)));
 const hasA=(s,t)=>H.some(h=>(h.a==s||h.a==sup[s])&&(h.b==t||h.b==sup[t])),hp=h=>h.a+" → "+h.b+(h.w?" *":"");
 /* dependencias: s usa a t sin tener asociación hacia t */
 let D=[];const use=(s,t,why)=>{if(!s||!t||s==t||sup[s]==t||sup[t]==s||hasA(s,t)||skp(s,t)||D.some(d=>d.a==s&&d.b==t))return;D.push({a:s,b:t,why,li:CUR})};let CUR=0;
 LL.forEach((x,xi)=>{CUR=xi;const L=x.L,S=x.cls(L.from),T=x.cls(L.to);
  if(L.t!="A")use(S,T,"«"+S+"» le manda un mensaje a un objeto «"+T+"» que conoce por "+({L:"variable local",P:"parámetro",G:"visibilidad global"})[L.t]+" ("+x.ref+")");
  if(L.res&&x.ty(L.res))use(S,x.ty(L.res),"«"+S+"» recibe un objeto «"+x.ty(L.res)+"» como resultado y lo guarda en una variable local ("+x.ref+")");
  String(L.pa||"").replace(/[()]/g,"").split(",").map(v=>v.trim()).forEach(v=>{if(x.ty(v))use(T,x.ty(v),"«"+T+"» recibe un objeto «"+x.ty(v)+"» por parámetro ("+x.ref+")")})});
 D=D.filter(d=>!(sup[d.a]&&D.some(z=>z.a==sup[d.a]&&z.b==d.b)));
 /* operaciones: se declaran en la clase del receptor */
 const O=[];X.gs.forEach(g=>{const c0=P4EX[g].cs[0],e=c0.dg.ent,sg=String(c0.dg.sig||"").replace(/^[A-Za-z]+\./,"");O.push({c:e?e.split(":")[1]:"Controlador",t:(e?e.split(":")[1]:"Controlador")+" :: "+sg,ref:"es la operación que resuelve ese diagrama",from:null,top:1,li:LL.findIndex(x=>x.g==g)})});
 LL.forEach(x=>{const L=x.L;if(GEN.test(L.op)||/^get[A-Z]/.test(L.op)&&L.pa=="()")return;const C=x.cls(L.to),t=C+" :: "+L.op+L.pa;if(!O.some(o=>o.t==t))O.push({c:C,op:L.op,pa:L.pa,t,ref:x.ref,from:x.cls(L.from),li:LL.indexOf(x)})});
 window.DCDD[X.id]={H,D,O};
 /* EL DCD SE ARMA CON FICHAS, MENSAJE POR MENSAJE (pedido de Luca, 16/11: «como los diagramas de comunicación: con fichas se va armando el diagrama»).
    Se recorre cada diagrama de comunicación y, en cada mensaje que le agrega algo al DCD, se arma con fichas lo que agrega: la relación (clase de origen,
    flecha llena o punteada, clase de destino y multiplicidad) y la operación (clase que la declara y operación). Los mensajes que no agregan nada se saltean.
    Un paquete por diagrama; «Tu DCD hasta ahora» junta lo armado. Cada casillero explica su regla al fallar o con «No sé». */
 const G=X.id+" · DCD",CL=[...new Set(H.flatMap(h=>[h.a,h.b]).concat(D.flatMap(d=>[d.a,d.b]),O.map(o=>o.c)))],units=[];
 const dcdTxt=li=>{const r=H.filter(h=>h.li<li).map(hp).concat(D.filter(d=>d.li<li).map(d=>d.a+" ⇢ "+d.b)),ops=O.filter(o=>o.li<li);
   return(r.length?`<div><b>Relaciones</b></div>`+r.map(t=>`<div style="padding-left:14px">${esc(t)}</div>`).join(""):"")+(ops.length?`<div><b>Operaciones</b></div>`+ops.map(o=>`<div style="padding-left:14px">${esc(o.t)}</div>`).join(""):"")};
 /* DIBUJO DEL DCD (17/11): recuadros de clase con sus operaciones y flechas: → asociación (con su multiplicidad), ⇢ dependencia (punteada) */
 const rel=(a,k,b,m,dash)=>`<div class="umr"><span class="umn">${a}</span><span class="ln${dash?" dp":""}" style="text-align:center">${k}</span><span>${m||""}</span><span class="umn">${b}</span></div>`;
 const dcdDraw=li=>{const hs=H.filter(h=>h.li<li),ds=D.filter(d=>d.li<li),ops=O.filter(o=>o.li<li),cs=[...new Set(ops.map(o=>o.c).concat(hs.flatMap(h=>[h.a,h.b]),ds.flatMap(d=>[d.a,d.b])))];
  if(!cs.length)return'<span class="mut">todavía nada</span>';
  return`<div class="umx">${cs.map(c=>UM.box(esc(c),{at:[],ops:ops.filter(o=>o.c==c).map(o=>esc(o.t.split(" :: ")[1]))})).join("")}</div>`+hs.map(h=>rel(esc(h.a),"",esc(h.b),h.w?"*":"1")).join("")+ds.map(d=>rel(esc(d.a),"",esc(d.b),"",1)).join("")};
 const dcdCard=(XX,pl,cur,nh,nd,no,nt)=>{const v=kV(pl,cur,XX),q=kQ(pl,cur,XX),bx={},ord=[];
  const op=(c,n)=>{const k=v(c)==null?"?"+c:v(c);if(!bx[k]){bx[k]={h:q(c),o:[]};ord.push(k)}bx[k].o.push(q(n))};
  for(let i=0;i<nt;i++)op("t"+i+"c","t"+i+"n");for(let i=0;i<no;i++)op("o"+i+"c","o"+i+"n");
  let h=ord.length?`<div class="umx">${ord.map(k=>UM.box(bx[k].h,{at:[],ops:bx[k].o})).join("")}</div>`:"";
  for(let i=0;i<nh;i++){const k=v("h"+i+"k");h+=rel(q("h"+i+"a"),k==null?q("h"+i+"k"):"",q("h"+i+"b"),q("h"+i+"m"),k=="⇢")}
  for(let i=0;i<nd;i++){const k=v("d"+i+"k");h+=rel(q("d"+i+"a"),k==null?q("d"+i+"k"):"",q("d"+i+"b"),"",k=="⇢")}
  return h};
 X.gs.forEach(g=>{const cards=[],first=LL.findIndex(x=>x.g==g);
  LL.forEach((x,li)=>{if(x.g!=g)return;const hs=H.filter(h=>h.li==li),ds=D.filter(d=>d.li==li),os=O.filter(o=>o.li==li&&!o.top),tp=li==first?O.filter(o=>o.li==li&&o.top):[];
   if(!hs.length&&!ds.length&&!os.length&&!tp.length)return;const sl=[],nl=()=>{if(sl.length)sl.push("\n")};
   tp.forEach((o,oi)=>{nl();sl.push("operación del diagrama:",{t:o.c,r:"t"+oi+"c",sn:"la clase que declara la operación del diagrama",w:"La operación que resuelve todo el diagrama la recibe «"+o.c+"»: se declara ahí."},"::",{t:o.t.split(" :: ")[1],r:"t"+oi+"n",sn:"la operación del diagrama",w:"Es la operación que la letra pide resolver con este diagrama."})});
   hs.forEach((h,hi)=>{nl();sl.push("relación:",{t:h.a,r:"h"+hi+"a",sn:"la clase de origen",w:"La relación sale de la clase del objeto que MANDA el mensaje: «"+h.a+"»."},{t:"→",r:"h"+hi+"k",sn:"el tipo de flecha",w:"«"+h.a+"» llega a ese objeto por un atributo propio (su colección o su enlace): es una asociación, flecha llena (→). La punteada (⇢) es para lo que se conoce solo por parámetro, variable local o global."},
     {t:h.b,r:"h"+hi+"b",sn:"la clase de destino",w:"La flecha llega a la clase del objeto que RECIBE el mensaje: «"+h.b+"»."},{t:h.w?"*":"1",r:"h"+hi+"m",sn:"la multiplicidad",w:h.w?"El mensaje va a la colección de «"+h.b+"»: son muchos (*).":"El mensaje va a un solo «"+h.b+"»: 1."})});
   ds.forEach((d,di)=>{nl();sl.push("relación:",{t:d.a,r:"d"+di+"a",sn:"la clase que usa",w:"La dependencia sale de la clase que USA al otro objeto: «"+d.a+"»."},{t:"⇢",r:"d"+di+"k",sn:"el tipo de flecha",w:d.why+" y no tiene asociación hacia esa clase: es una dependencia, flecha punteada (⇢)."},{t:d.b,r:"d"+di+"b",sn:"la clase usada",w:"La dependencia llega a la clase del objeto usado: «"+d.b+"»."})});
   os.forEach((o,oi)=>{nl();sl.push("operación:",{t:o.c,r:"o"+oi+"c",sn:"la clase que declara la operación",w:"La operación se declara en la clase que RECIBE el mensaje («"+o.c+"»), no en la que lo manda."},"::",{t:o.op+o.pa,r:"o"+oi+"n",sn:"la operación",w:"Es la operación que pide este mensaje."})});
   const use=sl.filter(z=>typeof z!="string"&&z!="\n").map(z=>z.t),dis=[];CL.filter(c=>!use.includes(c)).slice(0,2).concat(use.includes("→")?[]:["→"],use.includes("⇢")?[]:["⇢"],use.includes("*")?[]:["*"],use.includes("1")?[]:["1"]).forEach(t=>dis.push([t]));
   const sn=x.cls(x.L.from);if(!dis.some(d=>d[0]==sn)&&use.filter(t=>t==sn).length<2)dis.push([sn]);
   cards.push(kSeq(G+" · "+opn(g)+" · mensaje "+x.L.n,"DCD · mensaje "+x.L.n+" de "+opn(g),"¿Qué le agrega este mensaje al DCD? Armalo con las fichas.",sl,dis,{ctx:X.id+" · Problema 2 b) DCD",ko:"Orden: clase de origen → flecha → clase de destino → multiplicidad; y la operación: clase → operación.",
    th:"El DCD se arma recorriendo los diagramas de comunicación, mensaje por mensaje. Cada mensaje puede agregar: (1) una asociación navegable, si el emisor llega al receptor por un atributo propio (flecha llena →, con * si llega a una colección); (2) una dependencia, si usa un objeto que conoce solo por parámetro, variable local o global (flecha punteada ⇢); (3) una operación, que se declara en la clase que RECIBE el mensaje. find, next, add, remove y create no se declaran.",
    kv:()=>`<div class="lt"><b>${esc(X.id)} · Problema 2</b> ${esc(X.pide)}</div>`+(X.nota?`<div class="lt mut">${esc(X.nota)}</div>`:"")+`<div class="lt"><b>Diagrama de ${esc(opn(g))}</b> (${esc(String(P4EX[g].cs[0].dg.sig||""))})</div>`+P4EX[g].cs.map(c=>`<div class="lt${c.dg.cur===x.L?" hl":""}">${c.dg.cur===x.L?"▶ ":""}${esc(lineStr(c.dg.cur))}</div>`).join("")+kFold("Tu DCD hasta ahora",dcdDraw(li),1)}));{const card=cards[cards.length-1],XX=card.bld.exp;card.kd=(pl,cur)=>dcdCard(XX,pl,cur,hs.length,ds.length,os.length,tp.length)}});
  if(cards.length)units.push({id:"d"+units.length,cards})});
 window.DCDD[X.id].units=units;
 kChain(G,units,{req:X.gs.map(g=>P4EX[g].last).concat(KIN.dcd)})});

/* ===== Letra del Problema 1 (modelo de dominio + DSS), tal cual. i = presentación; R = descripción de la realidad (una frase por línea; línea en blanco =
   párrafo); cu / act / U = caso de uso (una frase por línea). De ahí salen las frases S: a1, a2… (realidad) y u0, u1… (caso de uso), que se resaltan con
   hl:"S:u1,a3". P1P = lo que se pide (igual en los dos exámenes). ===== */
const P1P={a:"a) Realizar el Modelo de Dominio de la realidad planteada, incluyendo todas las restricciones que considere necesarias en lenguaje natural.",
 b:"b) Realizar un Diagrama de Secuencia del Sistema (DSS) para el Caso de Uso. Indique el uso de memoria del Sistema y de datatypes, si corresponde."};
const P1L={
Feb26:{i:"Se desea desarrollar un sistema de gestión de procesos de negocio enfocado en la firma digital de documentos. Para ello, se cuenta con la siguiente descripción de la realidad.",
R:`El sistema permite definir procesos.
De cada proceso se conoce su nombre, un código identificador (único) y una descripción.
Un proceso define una secuencia ordenada de pasos que deben cumplirse para completarlo.
Cada paso tiene una descripción de lo que se debe hacer y el rol necesario para ejecutarlo (administrativo o gerente).
Existen dos tipos de pasos que pueden formar parte de un proceso: tarea manual y firma digital.
Una tarea manual representa una acción a realizar.
Para esto, se debe seleccionar si el tipo de acción es revisión, carga de datos o una inspección.
Además, se debe indicar si es necesario subir un comprobante que demuestre la finalización de la tarea.
Los comprobantes posibles son pdf, imagen o ninguno (si la tarea no requiere adjuntar nada).
Un paso de tipo firma digital representa la aprobación formal mediante una firma.
Para estos pasos se requiere configurar el nivel de seguridad mínimo exigido (bajo, medio, alto), además de la fecha de firma.

Los usuarios del sistema tienen email (único), nombre y el rol que desempeñan.
Para realizar una firma digital, los usuarios deben poseer un certificado digital.
De cada certificado interesa conocer la autoridad certificadora, fecha de emisión, fecha de vencimiento, su nivel de seguridad (bajo, medio, alto) y si aún está vigente.
Un usuario puede tener varios certificados históricos, pero solo uno vigente.

Cuando se desea iniciar un trámite, se crea un expediente basado en un proceso.
El expediente tiene una fecha de creación y un estado (borrador, activo).
Al crear el expediente, se deben establecer las asignaciones para cada uno de los pasos definidos en el proceso.
Una asignación vincula un paso específico de ese proceso con el usuario que será responsable de realizarlo en este expediente.
Un usuario solo puede ser asignado a un paso si su rol coincide con el rol definido en el paso.
Si se asigna un usuario a un paso de firma digital, dicho usuario debe tener un certificado digital vigente y su nivel de seguridad debe ser igual o superior al exigido por el paso.
Por otra parte, los certificados digitales son intransferibles, ya que avalan la identidad de un usuario.
Por lo que ningún certificado puede pertenecer a más de un usuario a la vez.`,
cu:"Iniciar expediente",act:"Administrador",
U:`El caso de uso comienza cuando un administrador desea iniciar un nuevo expediente.
Primero ingresa el código del proceso del que se desea crear un expediente.
Luego, para cada paso del proceso, el sistema muestra los datos del paso y los usuarios válidos para asignar, y solicita al administrador que ingrese el email del usuario responsable.
Luego de seleccionado, el sistema retorna los datos de la asignación, que incluye datos del usuario y datos del paso asociado, para que el Administrador confirme la asignación.
Esto se repite hasta completar todos los pasos del proceso.
Finalmente, el administrador decide si confirmar la operación (indicando si es un expediente activo o un borrador) o cancelar el proceso.`},
Jul26:{i:"Se desea desarrollar un sistema para gestionar la reserva de espacios en una empresa de centros de coworking, que son espacios de trabajo compartido donde diferentes trabajadores, generalmente independientes, comparten instalaciones y servicios.",
R:`El sistema registra información de sus centros de coworking, de los cuales se conoce su código (único en el sistema), su nombre y dirección.
Cada centro posee uno o más espacios.
Los espacios se identifican mediante un número, único dentro del centro, y se conoce su nombre, capacidad máxima de personas y precio por hora.
Los espacios pueden ser de los siguientes tipos:
• Salas de reuniones: De las cuales se registra si cuentan o no con sistema de videoconferencia y la cantidad de pizarras disponibles.
• Oficinas privadas: De las cuales se registra la cantidad de escritorios y si tienen baño privado o no.
• Auditorios: De los cuales se registra si cuentan con escenario y el tipo de equipamiento de sonido que poseen, el cual puede ser básico, intermedio o profesional.

Los centros también disponen de equipamiento adicional que puede ser incluido en las reservas.
De cada equipamiento se conoce su código, que es único dentro del centro, una descripción, la cantidad de unidades disponibles y su precio de alquiler por hora.
Un equipamiento puede estar habilitado para ser usado en varios espacios del mismo centro.
Para cada equipamiento dentro de un espacio se registra la cantidad máxima de unidades que pueden usarse simultáneamente en dicho espacio y si su uso requiere asistencia técnica.

Los clientes del sistema se identifican mediante su correo electrónico.
Además, se registra su nombre completo y teléfono de contacto.
Los clientes realizan reservas de los espacios.
De cada reserva se registra su fecha, hora de inicio, duración en horas, cantidad de asistentes (no puede superar la capacidad del espacio), precio total y estado, que puede ser pendiente, confirmada o cancelada.
No pueden existir dos reservas pendientes o confirmadas que se superpongan para un mismo espacio.
Además, cada reserva puede incluir diferentes equipamientos adicionales.
Para cada equipamiento incluido en una reserva se registra la cantidad de unidades solicitadas, la cual no puede superar la cantidad máxima permitida para ese espacio ni la cantidad de unidades disponibles durante el horario de la reserva.
El precio total de una reserva se calcula multiplicando su duración por la suma del precio base por hora del espacio y los precios por hora de los equipamientos seleccionados, considerando la cantidad solicitada de cada uno.`,
cu:"Registrar reserva",act:"Cliente",
U:`El caso de uso comienza cuando un cliente desea realizar una reserva.
El cliente ingresa su correo electrónico, la fecha, la hora de inicio, la duración de la reserva y la cantidad de asistentes.
El sistema lista el código, nombre y dirección de todos los centros de coworking que tengan al menos un espacio disponible que pueda recibir a esa cantidad de personas durante el horario indicado.
El cliente selecciona un centro indicando su código y el sistema lista todos sus espacios disponibles, indicando número, nombre, tipo, capacidad y precio base por hora.
El cliente selecciona un espacio y el sistema muestra los equipamientos habilitados para ese espacio que poseen unidades disponibles durante el horario indicado.
Para cada equipamiento se muestra su código, descripción, precio por hora, cantidad disponible, cantidad máxima permitida en el espacio y si requiere asistencia técnica.
A continuación, el cliente puede seleccionar un equipamiento indicando su código y la cantidad de unidades solicitadas.
El sistema agrega el equipamiento a la reserva y muestra el precio calculado hasta el momento.
Esto puede repetirse hasta que no se desee agregar más equipamiento.
Finalmente, el recepcionista puede confirmar o cancelar la reserva.
Si confirma, el sistema registra la reserva con estado confirmada.`},
"Parcial 2026":{i:"Se desea crear un sistema para gestionar la operativa logística de una empresa de transporte ferroviario nacional.",
pa:"Realizar el Modelo de Dominio de la realidad planteada, incluyendo todas las restricciones que considere necesarias en lenguaje natural.",
pb:"Realizar el Diagrama de Secuencia del Sistema (DSS) para el caso de uso Planificar Viaje, indicando el uso de memoria del Sistema y los datatypes que sean necesarios.",
R:`El sistema registra información de sus empleados, de los cuales se conoce su número de CI (que es único), nombre completo y fecha de ingreso.
Los empleados se clasifican según su rol en: conductores, de los que se registra la categoría de su licencia (A, B o C) y las ciudades en las que se encuentran habilitados para operar; y mecánicos, de los que interesa conocer su especialidad (eléctrica o general).
El sistema mantiene un registro de las ciudades operativas del país, de las cuales se guarda su nombre y ubicación geográfica.

La empresa cuenta con una flota de trenes, identificados por un número de matrícula.
De ellos también se registra su año de fabricación.
Existen dos tipos de trenes operativos: los trenes de pasajeros, de los cuales se registra la cantidad máxima de pasajeros y si cuentan con servicio a bordo; y los trenes de carga, de los que se almacena su capacidad máxima en toneladas y si puede transportar carga peligrosa o no.

El sistema administra las distintas rutas que recorren los trenes.
Cada ruta se identifica por un código único y tiene un nombre descriptivo.
Una ruta está conformada por una colección de estaciones.
De cada estación se conoce su nombre y la ciudad donde se ubica.
Para establecer correctamente el trayecto de la ruta, es necesario registrar el orden secuencial en el que las estaciones son visitadas dentro de la misma.
Además, se desea registrar la publicidad que se emite por pantallas electrónicas en cada estación, la cual depende de la ruta correspondiente.
Por lo tanto, para cada estación dentro de una ruta, se registra el nombre de la única empresa con los derechos de anunciante y el costo de emisión.

Para garantizar la seguridad de la flota, los mecánicos realizan revisiones periódicas a los trenes.
La revisión es realizada por un único mecánico, y este debe registrar la fecha de la misma, un detalle textual de las tareas ejecutadas y el resultado final (aprobado o no).

La operativa diaria del servicio se organiza mediante la planificación de viajes.
Un viaje vincula a un tren específico con un conductor asignado para recorrer una ruta determinada.
De cada viaje planificado se registra una fecha y hora de salida, un código identificador único (autogenerado por el sistema), y su estado actual (programado, en curso, finalizado).
Por normativas de la empresa, un conductor solo puede ser asignado a un viaje si todas las estaciones de la ruta a recorrer se ubican en ciudades donde el conductor está habilitado para operar.`,
cu:"Planificar Viaje",act:"Despachador",
U:`El caso de uso comienza cuando se desea planificar un nuevo viaje.
El sistema solicita el código de la ruta.
Una vez ingresado, el sistema muestra una lista con los trenes registrados en el sistema, mostrando para cada uno su matrícula y el tipo de tren.
Se selecciona un tren indicando su matrícula.
A continuación, el sistema lista los empleados que son conductores.
Se selecciona un conductor por su número de CI y, a continuación, se ingresa la fecha y hora de salida estimadas.
El sistema autogenera un código único para el viaje y muestra un resumen a planificar (código y nombre de la ruta, matrícula del tren, nombre del conductor, fecha, hora y código generado) dando la opción de confirmar o cancelar.
En caso de confirmar, el viaje queda registrado con estado "programado".
El sistema permite entonces planificar otro viaje o finalizar el caso de uso.`}};
Object.values(P1L).forEach(L=>{L.S={};let n=0;L.P=L.R.split("\n\n").map(p=>p.split("\n").map(s=>{const k="a"+(++n);L.S[k]=s;return k}));L.Uk=L.U.split("\n").map((s,i)=>(L.S["u"+i]=s,"u"+i))});

/* ===== Problema 1b: Diagrama de secuencia del sistema (DSS) =====
   Acciones del estudiante, en el orden del examen: leer el caso de uso y marcar los MENSAJES (cada cosa que el actor le da o le pide al Sistema; lo que el
   Sistema muestra es el retorno de un mensaje, nunca un mensaje) → encerrarlos en loop / alt con su guarda → completar cada mensaje: parámetros (datos, no
   objetos del dominio, y nada que el Sistema ya recuerde), lo que devuelve (solo si la letra dice que muestra algo) y la nota de memoria → definir los DataTypes.
   Una tarjeta por acción y cada tarjeta es su propia unidad (pide la anterior sin errores). Los nombres de operaciones y DataTypes son los de la solución
   oficial y nunca se piden: se elige por lo que hacen. «Tu DSS hasta ahora» muestra solo lo ya decidido, en el formato en que se escribe.
   DSSX por examen: M = mensajes en orden {op, d: qué hace el actor (ficha de «mensajes»), hl: frases de la letra, w: por qué es un mensaje,
   pa / rt / mem: [correcta, por qué, [equivocada, por qué no, frase]…] (pa como texto = ya puesto, no se pide; sin rt o sin mem = no se pide), ph / rh / mh: sus
   frases, j:1 = va en la misma tarjeta que el mensaje anterior, fin:1 = cierra el caso de uso}; ev = fichas equivocadas de «mensajes»;
   fr = fragmentos {k, g: guarda (alt: las dos), a, b: primer y último mensaje (desde 0), w, hl}; fd = fragmentos equivocados; DT = DataTypes {n, d, hl, w, at, x}.
   La nota de memoria se pide solo donde la solución oficial la tiene (en los otros mensajes es discutible); «sin nota» y «libera la memoria» se agregan solas. */
const DTH=["Un mensaje del DSS es algo que el ACTOR le da o le pide al Sistema (ingresa un dato, elige, confirma, cancela). Lo que el Sistema muestra, lista o retorna no es un mensaje: es el retorno del mensaje anterior. El Sistema nunca le manda mensajes al actor. Si el Sistema tiene que mostrar algo en cada vuelta de una repetición, hace falta un mensaje del actor en cada vuelta.",
 "Fragmentos: loop [guarda] encierra los mensajes que se repiten («para cada…», «puede repetirse»); alt [guarda 1] / [guarda 2] separa caminos excluyentes, cada uno con su mensaje (confirmar o cancelar); opt [guarda] es un solo camino que puede darse una vez o ninguna. Lo que la letra hace «primero» o «finalmente» queda fuera del loop.",
 "Parámetros: los datos que el actor ingresa en ese paso (identificadores, valores o DataTypes; nunca objetos del dominio) y nada que el Sistema ya recuerde. Retorno: solo si la letra dice que el Sistema muestra, lista o retorna algo; es un DataType o Set(DataType). Memoria, cómo decidirla: por cada dato que llega en el mensaje, recorré los mensajes que siguen. Si alguno lo vuelve a mandar, no hace falta recordarlo; si ninguno lo manda pero se usa después (casi siempre al confirmar, para dar de alta), va una nota «el Sistema recuerda…». Lo que el Sistema elige o genera él mismo (un código autogenerado) también se recuerda si se usa después; cuando el caso de uso termina (confirmar o cancelar), «se libera la memoria».",
 "Un DataType lleva exactamente lo que la letra dice que el Sistema muestra: atributos simples, enumerados u otros DataTypes (Set si son varios). Nunca objetos del dominio. Si un dato es «el tipo» y en el dominio es una subclase, en el DataType va como un dato (enumerado o texto)."];
const DSN=["la lista de parámetros","el retorno","la nota de memoria"],
 DSW=["Lo que llega o se decide en este mensaje se usa más adelante y ningún mensaje lo vuelve a mandar: el Sistema tiene que recordarlo. La letra pide indicar el uso de memoria.",
  "El Sistema viene recordando datos desde el primer mensaje: cuando el caso de uso termina (también si se cancela) hay que liberarlos, y decirlo en una nota.",
  "La memoria se libera cuando el caso de uso termina (al confirmar o cancelar), no antes."];
const DSSX=[
{id:"Feb26",
 ev:[["muestra los datos del paso y los usuarios válidos","Eso lo hace el Sistema: no es un mensaje, es lo que DEVUELVE el mensaje con el que el actor se lo pide.","u2"],
  ["solicita el email al administrador","El Sistema no le manda mensajes al actor: solo le responde. El mensaje es el del actor cuando ingresa el email.","u2"],
  ["retorna los datos de la asignación","Es la respuesta al email ingresado: va como retorno de ese mismo mensaje, no como mensaje aparte.","u3"],
  ["indica si el expediente es activo o borrador","Ese dato lo indica al confirmar: es un parámetro del mensaje de confirmar, no un mensaje aparte.","u5"]],
 M:[
 {op:"iniciarExpediente",d:"ingresa el código del proceso",hl:"u1",
  pa:["codProceso: String","El actor le da al Sistema el dato que identifica al proceso: su código.",["p: Proceso","El actor no tiene objetos del dominio: le da al Sistema el dato que identifica al proceso (su código)."],["nombre: String","El nombre no identifica al proceso: el identificador (único) es el código, y es lo que la letra dice que ingresa.","a2"]],
  rt:["nada","La letra no dice que el Sistema muestre algo al ingresar el código.",["Set(DTPaso)","La letra no muestra todos los pasos juntos: los muestra de a uno, cada uno con sus usuarios válidos, dentro de la repetición.","u2"],["DTProceso","La letra no dice que el Sistema muestre datos del proceso."]],
  mem:["recuerda el proceso","Los mensajes que siguen no vuelven a mandar el código: el Sistema tiene que recordar con qué proceso está trabajando."]},
 {op:"datosDelPaso",d:"pide los datos del paso que sigue",hl:"u2",w:"El Sistema muestra los datos de cada paso, pero solo responde a mensajes: en cada vuelta el actor se los tiene que pedir.",
  pa:["sin parámetros","El actor no ingresa nada: el Sistema ya recuerda el proceso y va recorriendo sus pasos.",["codProceso: String","El Sistema ya recuerda el proceso desde el primer mensaje: no se vuelve a mandar.","u1"],["paso: Paso","El actor no tiene objetos del dominio ni elige el paso: el Sistema recorre los pasos del proceso."]],
  rt:["DTUsuariosDisponibles (el paso + sus usuarios válidos)","Muestra las dos cosas y el retorno es uno solo: un DataType que las junta.",["Set(DTUsuario)","Faltan los datos del paso: la letra dice que muestra «los datos del paso y los usuarios válidos». El retorno es uno solo y tiene que traer las dos cosas."],["Set(Usuario)","Del Sistema no salen objetos del dominio: se devuelven DataTypes con los datos a mostrar."],["nada","Este mensaje está justamente para que el Sistema muestre los datos del paso y los usuarios válidos."]]},
 {op:"asignacionUsuario",d:"ingresa el email del usuario responsable",hl:"u2",
  pa:["email: string","La letra dice que ingresa el email del usuario responsable.",["u: Usuario","El actor no tiene objetos del dominio: le da el dato que identifica al usuario (su email, único).","a12"],["email: string, paso: DTPaso","El paso no lo elige el actor: es el que el Sistema está mostrando en esta vuelta."]],
  rt:["DTAsignacion (datos del usuario + datos del paso)","«el sistema retorna los datos de la asignación, que incluye datos del usuario y datos del paso asociado».",["DTUsuario","Faltan los datos del paso: la asignación incluye «datos del usuario y datos del paso asociado»."],["Asignacion","Del Sistema no salen objetos del dominio. Además la asignación todavía no está confirmada."],["nada","La letra dice que el Sistema retorna los datos de la asignación, para que el actor la confirme."]],rh:"u3"},
 {op:"confirmarAsignacion",d:"confirma la asignación",hl:"u3",
  pa:["sin parámetros","El usuario ya se indicó en el mensaje anterior y el paso es el de esta vuelta: no hay datos nuevos.",["email: string","El usuario ya se indicó en el mensaje anterior: no se vuelve a mandar."]],
  rt:["nada","La letra no dice que el Sistema muestre algo al confirmar la asignación.",["DTAsignacion","Los datos de la asignación ya se devolvieron en el mensaje anterior, justamente para poder confirmarla."]],
  mem:["recuerda la asociación entre el paso y el usuario","El expediente se crea recién al final, con todas sus asignaciones: cada asignación confirmada se recuerda hasta entonces."]},
 {op:"confirmar",d:"confirma la operación",hl:"u5",w:"Confirmar y cancelar son dos decisiones distintas del actor: un mensaje para cada una.",fin:1,
  pa:["estado: Boolean","Al confirmar indica si el expediente es activo o borrador: ese dato viaja en el mensaje.",["sin parámetros","Al confirmar indica si el expediente es activo o borrador: ese dato viaja en el mensaje."],["codProceso: String, estado: Boolean","El proceso ya lo recuerda el Sistema desde el primer mensaje: no se vuelve a mandar.","u1"]],
  mem:["libera la memoria","Con lo recordado se crea el expediente y el caso de uso termina: lo que el Sistema venía recordando se libera.",["recuerda el estado","Al confirmar se crea el expediente con lo que el Sistema venía recordando; después ya no queda nada por recordar: se libera."]]},
 {op:"cancela",d:"cancela el proceso",hl:"u5",w:"Confirmar y cancelar son dos decisiones distintas del actor: un mensaje para cada una.",fin:1,j:1,pa:"",
  mem:["libera la memoria","También al cancelar: lo que el Sistema venía recordando ya no se necesita."]}],
 fr:[{k:"loop",g:"para cada paso del proceso sin asignar",a:1,b:3,hl:"u2,u4",w:"«para cada paso del proceso… Esto se repite hasta completar todos los pasos»: los tres mensajes de un paso se repiten."},
  {k:"alt",g:["confirma","cancela"],a:4,b:5,hl:"u5",w:"Confirmar o cancelar: dos caminos excluyentes, cada uno con su mensaje."}],
 fd:[["loop [para cada paso del proceso sin asignar]: mensajes 3 a 4","Los datos se muestran para CADA paso: el mensaje 2 también se repite.","u2"],
  ["loop [para cada paso del proceso sin asignar]: mensajes 1 a 4","El código del proceso se ingresa una sola vez («Primero…»): el mensaje 1 queda fuera del loop.","u1"],
  ["loop [para cada paso del proceso sin asignar]: mensajes 2 a 5","«Finalmente»: la operación se confirma una sola vez, después de asignar todos los pasos.","u5"],
  ["opt [confirma]: mensaje 5","opt es para algo que puede pasar o no. Acá hay dos caminos, cada uno con su mensaje (confirmar o cancelar): es alt.","u5"]],
 DT:[{n:"DTUsuariosDisponibles",d:"lo que devuelve datosDelPaso",hl:"u2",w:"Junta las dos cosas que la letra dice que muestra: los datos del paso y los usuarios válidos.",at:["paso: DTPaso","usu: Set(DTUsuario)"],
   x:[["usu: Set(Usuario)","Dentro de un DataType no van objetos del dominio: van datos u otros DataTypes."],["usu: DTUsuario","Son varios usuarios válidos para el paso: una colección."],["proceso: DTProceso","La letra no pide mostrar datos del proceso: solo los del paso y los usuarios válidos."]]},
  {n:"DTAsignacion",d:"lo que devuelve asignacionUsuario",hl:"u3",w:"«incluye datos del usuario y datos del paso asociado».",at:["usu: DTUsuario","paso: DTPaso"],
   x:[["usu: Set(DTUsuario)","La asignación es de UN usuario: el que el actor acaba de indicar."],["expediente: DTExpediente","El expediente todavía no existe (se crea al confirmar la operación) y la letra no pide mostrarlo."]]},
  {n:"DTUsuario",d:"los datos de un usuario",hl:"a12",w:"Los datos de un usuario, según la realidad: email, nombre y rol.",at:["nombre: String","mail: String","rol: Rol"],
   x:[["certificados: Set(Certificado)","Dentro de un DataType no van objetos del dominio. Y los certificados no son datos del usuario: son otra clase."],["asignaciones: Set(DTAsignacion)","La letra pide mostrar los datos del usuario, no los pasos que tiene asignados."]]},
  {n:"DTPaso",d:"los datos de un paso; hay dos tipos de paso, con datos distintos",hl:"a4,a5,a7,a9,a11",w:"Cada tipo de paso tiene sus propios datos: el DataType copia la jerarquía del dominio. (La solución oficial pone solo la descripción en DTPaso.)",
   at:["DTPaso: descripcion","DTTareaManual (hereda de DTPaso): accion, evidencia","DTFirmaDigital (hereda de DTPaso): seguridad, fechaFirma"],
   x:[["DTPaso: descripcion, accion, evidencia, seguridad, fechaFirma","Una tarea manual no tiene nivel de seguridad ni fecha de firma (y al revés): cada tipo de paso lleva solo sus datos, como en el dominio."],["DTPaso: asignaciones: Set(DTAsignacion)","La letra pide mostrar los datos del paso, no sus asignaciones (que además todavía se están armando)."]]}]},
{id:"Jul26",
 ev:[["lista los centros con espacio disponible","Eso lo hace el Sistema: no es un mensaje, es lo que DEVUELVE el mensaje en el que el actor ingresa los datos de la reserva.","u2"],
  ["ingresa su correo (en un mensaje aparte)","La letra ingresa todos los datos juntos, en un mismo paso: es un solo mensaje con todos como parámetros.","u1"],
  ["avisa que no quiere agregar más equipamiento","Para eso no hace falta un mensaje: es la condición de salida de la repetición (la guarda del loop).","u8"],
  ["registra la reserva con estado confirmada","Lo hace el Sistema al recibir la confirmación: no es un mensaje, va en la nota del mensaje de confirmar.","u10"]],
 M:[
 {op:"BuscarCentro",d:"ingresa correo, fecha, hora, duración y asistentes",hl:"u1",
  pa:["email: string, fecha: DTFecha, hora: DTHora, duracion: int, cantAsistentes: int","Los cinco datos que la letra dice que ingresa, todos en el mismo mensaje.",
   ["fecha: DTFecha, hora: DTHora, duracion: int, cantAsistentes: int","Falta el correo electrónico: la letra dice que también lo ingresa acá, y el Sistema lo necesita para saber de quién es la reserva."],
   ["c: Cliente, r: Reserva","El actor no tiene objetos del dominio: le da al Sistema los datos (sueltos o en DataTypes como DTFecha)."]],
  rt:["Set(DTCentro)","«El sistema lista…» todos los centros que cumplen: una colección de DataTypes.",["DTCentro","Lista TODOS los centros que cumplen: es una colección."],["Set(Centro)","Del Sistema no salen objetos del dominio: se devuelven DataTypes con los datos a mostrar."],["nada","La letra dice que el Sistema lista los centros disponibles: eso es lo que devuelve este mensaje."]],rh:"u2",
  mem:["recuerda los datos de la reserva y el email del cliente","Se usan recién al confirmar, y Confirmar no los vuelve a mandar."]},
 {op:"SeleccionarCentro",d:"selecciona un centro",hl:"u3",
  pa:["codigo: string","«indicando su código».",["c: DTCentro","Alcanza con el dato que identifica al centro (su código): es lo que la letra dice que indica."],["codigo: string, fecha: DTFecha, hora: DTHora","La fecha y la hora ya las recuerda el Sistema desde el primer mensaje: no se vuelven a mandar.","u1"]],
  rt:["Set(DTEspacio)","«el sistema lista todos sus espacios disponibles».",["Set(DTCentro)","Los centros ya se listaron en el mensaje anterior; ahora lista los espacios del centro elegido."],["Set(Espacio)","Del Sistema no salen objetos del dominio: se devuelven DataTypes con los datos a mostrar."]],
  mem:["recuerda el código del centro","El número de un espacio es único solo dentro de su centro: para ubicar después el espacio elegido, el Sistema tiene que saber de qué centro es."],mh:"u3,a3"},
 {op:"SeleccionarEspacio",d:"selecciona un espacio",hl:"u4",
  pa:["numero: int","Un espacio se identifica por su número (único dentro del centro, que el Sistema ya recuerda).",["codigoCentro: string, numero: int","El centro ya lo recuerda el Sistema desde el mensaje anterior: no se vuelve a mandar.","u3"],["nombre: string","El nombre no identifica al espacio: los espacios se identifican por su número.","a3"]],ph:"u4,a3",
  rt:["Set(DTEquipamento)","«el sistema muestra los equipamientos habilitados para ese espacio».",["Set(DTEspacio)","Los espacios ya se listaron en el mensaje anterior; ahora muestra los equipamientos habilitados para el espacio elegido."],["nada","La letra dice que el Sistema muestra los equipamientos habilitados para ese espacio."]],
  mem:["recuerda el número del espacio","La reserva es de ese espacio, y ni AñadirEquipamento ni Confirmar lo vuelven a mandar."]},
 {op:"AñadirEquipamento",d:"selecciona un equipamiento y su cantidad",hl:"u6",
  pa:["codigo: string, cant: int","«indicando su código y la cantidad de unidades solicitadas».",["codigo: string","Falta la cantidad de unidades solicitadas: la letra dice que también la indica."],["numeroEspacio: int, codigo: string, cant: int","El espacio ya lo recuerda el Sistema: no se vuelve a mandar.","u4"]],
  rt:["float (el precio hasta el momento)","«muestra el precio calculado hasta el momento»: es un número, no hace falta un DataType.",["nada","La letra dice que el Sistema muestra el precio calculado hasta el momento."],["Set(DTEquipamento)","Los equipamientos habilitados ya se mostraron al elegir el espacio; ahora muestra solo el precio calculado."]],rh:"u7",
  mem:["recuerda los datos del equipamento","El código y la cantidad de cada equipamiento agregado se usan al confirmar, para dar de alta la reserva."],mh:"u7"},
 {op:"Confirmar",d:"confirma la reserva",hl:"u9",w:"Confirmar y cancelar son dos decisiones distintas del actor: un mensaje para cada una. (La letra dice «el recepcionista», pero el actor del caso de uso es el Cliente.)",fin:1,
  pa:["sin parámetros","Todo lo que hace falta para la reserva ya lo recuerda el Sistema.",["r: DTReserva","El Sistema ya recuerda todos los datos de la reserva (los fue guardando en cada mensaje): no se vuelven a mandar."]],
  mem:["da de alta la reserva y libera la memoria","«Si confirma, el sistema registra la reserva»: con lo recordado se crea la reserva y el caso de uso termina."],mh:"u10"},
 {op:"Cancelar",d:"cancela la reserva",hl:"u9",w:"Confirmar y cancelar son dos decisiones distintas del actor: un mensaje para cada una.",fin:1,j:1,pa:"",
  mem:["libera la memoria","Si cancela no se registra nada, pero lo que el Sistema venía recordando hay que liberarlo igual."]}],
 fr:[{k:"loop",g:"quiere agregar otro equipamiento",a:3,b:3,hl:"u6,u8",w:"«puede seleccionar un equipamiento… Esto puede repetirse»: cero o más veces."},
  {k:"alt",g:["quiere confirmar","quiere cancelar"],a:4,b:5,hl:"u9",w:"Confirmar o cancelar: dos caminos excluyentes, cada uno con su mensaje."}],
 fd:[["loop [quiere agregar otro equipamiento]: mensajes 3 a 4","El espacio se elige una sola vez; lo que puede repetirse es agregar equipamiento.","u4"],
  ["opt [quiere equipamiento]: mensaje 4","opt alcanza para «una vez o ninguna». La letra dice que puede repetirse: es loop (que también cubre cero veces).","u8"],
  ["loop [quiere agregar otro equipamiento]: mensajes 4 a 5","«Finalmente»: se confirma una sola vez, cuando ya no se agrega más equipamiento.","u9"],
  ["5 y 6 seguidos, sin fragmento","Así el diagrama diría que el actor confirma y después cancela. Son caminos excluyentes: van en un alt.","u9"]],
 DT:[{n:"DTCentro",d:"cada centro de la lista",hl:"u2",w:"La letra dice qué lista de cada centro: código, nombre y dirección.",at:["codigo: string","nombre: string","direccion: string"],
   x:[["espacios: Set(DTEspacio)","Los espacios se listan después, cuando el cliente elige un centro. Acá la letra pide solo código, nombre y dirección.","u3"],["equipamientos: Set(DTEquipamento)","Los equipamientos se muestran recién al elegir un espacio.","u4"]]},
  {n:"DTEspacio",d:"cada espacio de la lista",hl:"u3",w:"La letra dice qué indica de cada espacio: número, nombre, tipo, capacidad y precio base por hora. En el dominio el tipo es una subclase; en el DataType se informa con un enumerado (la solución oficial lo llama TipoCentro).",
   at:["numero: int","nombre: string","tipo: TipoCentro («enum» Auditorio, SalaReuniones, OficinaPrivada)","capacidad: int","precio: float"],
   x:[["videoconferencia: bool","Es un dato propio de las salas de reuniones. La letra pide mostrar solo el tipo de espacio, no los datos de cada tipo.","a5"],["equipamientos: Set(DTEquipamento)","Los equipamientos se muestran después, al seleccionar un espacio.","u4"],["centro: Centro","Dentro de un DataType no van objetos del dominio; y el centro ya se eligió."]]},
  {n:"DTEquipamento",d:"cada equipamiento habilitado",hl:"u5",w:"La letra enumera lo que se muestra de cada equipamiento.",at:["codigo: int","descripcion: string","precio: float","cantDisp: int","cantMax: int","asistencia: bool"],
   x:[["cantSolicitada: int","Eso lo ingresa el cliente después (es un parámetro de AñadirEquipamento): no es un dato que el Sistema muestre.","u6"],["espacio: DTEspacio","El espacio ya se eligió: la letra no pide volver a mostrarlo."]]}]},
{id:"Parcial 2026",
 ev:[["solicita el código de la ruta","El Sistema no le manda mensajes al actor: solo le responde. El mensaje es el del actor cuando ingresa el código.","u1"],
  ["muestra la lista de trenes","Eso lo hace el Sistema: no es un mensaje, es lo que DEVUELVE el mensaje en el que el actor ingresa la ruta.","u2"],
  ["ingresa el código del viaje","Ese código lo autogenera el Sistema: el actor no lo ingresa.","u6"],
  ["avisa que no quiere planificar otro viaje","Para eso no hace falta un mensaje: es la condición de salida de la repetición (la guarda del loop).","u8"]],
 M:[
 {op:"IngresarRuta",d:"ingresa el código de la ruta",hl:"u1",
  pa:["cod: String","El actor le da al Sistema el dato que identifica a la ruta: su código.",["r: Ruta","El actor no tiene objetos del dominio: le da al Sistema el dato que identifica a la ruta (su código)."],["cod: String, mat: String","El tren se elige después, cuando el Sistema ya mostró la lista de trenes.","u3"]],
  rt:["Set(DTTren)","«el sistema muestra una lista con los trenes registrados»: una colección de DataTypes.",["DTTren","Muestra una lista con todos los trenes: es una colección."],["Set(Tren)","Del Sistema no salen objetos del dominio: se devuelven DataTypes con los datos a mostrar."],["nada","La letra dice que, una vez ingresado el código, el Sistema muestra la lista de trenes."]],rh:"u2",
  mem:["recuerda la ruta","El viaje se da de alta recién al confirmar, y ningún mensaje vuelve a mandar el código de la ruta."]},
 {op:"SeleccionarTren",d:"selecciona un tren",hl:"u3",
  pa:["mat: String","«indicando su matrícula».",["cod: String, mat: String","La ruta ya la recuerda el Sistema desde el mensaje anterior: no se vuelve a mandar.","u1"],["t: DTTren","Alcanza con el dato que identifica al tren (su matrícula): es lo que la letra dice que indica."]],
  rt:["Set(DTConductor)","«el sistema lista los empleados que son conductores».",["Set(DTTren)","Los trenes ya se listaron en el mensaje anterior; ahora lista los conductores."],["Set(Conductor)","Del Sistema no salen objetos del dominio: se devuelven DataTypes con los datos a mostrar."]],rh:"u4",
  mem:["recuerda el tren","Se usa recién al confirmar, y Confirmar no lo vuelve a mandar."]},
 {op:"IngresarDatos",d:"selecciona un conductor e ingresa la fecha y hora de salida",hl:"u5",
  pa:["ci: Int, fechaS: Date","La CI del conductor y la fecha y hora de salida.",["ci: Int","Falta la fecha y hora de salida, que se ingresa en este mismo mensaje."],["ci: Int, fechaS: Date, codigoViaje: String","El código del viaje lo autogenera el Sistema: el actor no lo ingresa.","u6"]],
  rt:["DTResumenViaje (ruta, tren, conductor, fecha y código generado)","«muestra un resumen a planificar».",["nada","La letra dice que el Sistema muestra un resumen, para que el actor confirme o cancele."],["Viaje","Del Sistema no salen objetos del dominio. Además el viaje todavía no está dado de alta."],["String (solo el código generado)","El resumen trae más que el código: ruta, tren, conductor, fecha y hora."]],rh:"u6",
  mem:["recuerda los datos del viaje","Conductor, fecha y código generado se usan al confirmar, y Confirmar no lleva parámetros."],mh:"u6"},
 {op:"Confirmar",d:"confirma el viaje",hl:"u6",w:"Confirmar y cancelar son dos decisiones distintas del actor: un mensaje para cada una.",fin:1,
  pa:["sin parámetros","Todo lo que hace falta ya lo recuerda el Sistema.",["codigoViaje: String","El Sistema ya recuerda todo, incluido el código que él mismo generó: no se le vuelve a mandar."]],
  mem:["da de alta el viaje y libera la memoria","«En caso de confirmar, el viaje queda registrado»: con lo recordado se crea el viaje."],mh:"u7"},
 {op:"Cancelar",d:"cancela el viaje",hl:"u6",w:"Confirmar y cancelar son dos decisiones distintas del actor: un mensaje para cada una.",fin:1,j:1,pa:"",
  mem:["libera la memoria","Si cancela no se registra nada, pero lo que el Sistema venía recordando hay que liberarlo igual."]}],
 fr:[{k:"loop",g:"quiere planificar otro viaje",a:0,b:4,hl:"u8",w:"«El sistema permite entonces planificar otro viaje»: todo el caso de uso puede repetirse, incluida la confirmación."},
  {k:"alt",g:["quiere confirmar","quiere cancelar"],a:3,b:4,hl:"u6",w:"Confirmar o cancelar: dos caminos excluyentes, cada uno con su mensaje."}],
 fd:[["loop [quiere planificar otro viaje]: mensajes 1 a 3","Confirmar o cancelar es parte de cada viaje: recién después se puede planificar otro.","u8"],
  ["opt [quiere planificar otro viaje]: mensajes 1 a 5","opt alcanza para «una vez o ninguna». Se pueden planificar varios viajes: es loop.","u8"],
  ["opt [quiere confirmar]: mensaje 4","opt es para algo que puede pasar o no. Acá hay dos caminos, cada uno con su mensaje: es alt.","u6"],
  ["4 y 5 seguidos, sin fragmento","Así el diagrama diría que el actor confirma y después cancela. Son caminos excluyentes: van en un alt.","u6"]],
 DT:[{n:"DTTren",d:"cada tren de la lista",hl:"u2",w:"La letra dice qué muestra de cada tren: su matrícula y el tipo de tren. En el dominio el tipo es una subclase; en el DataType va como un dato (la solución oficial usa String).",at:["matricula: String","tipo: String"],
   x:[["fabricacion: Int","La letra pide mostrar solo la matrícula y el tipo de tren.","a5"],["maxPersonas: Int","Es un dato propio de los trenes de pasajeros: la letra pide mostrar solo el tipo.","a6"]]},
  {n:"DTConductor",d:"cada conductor de la lista",hl:"u4",w:"La letra no detalla qué se muestra; la solución oficial pone lo que permite elegirlo: CI y nombre.",at:["ci: Int","nombr: String"],
   x:[["ciudades: Set(Ciudad)","Dentro de un DataType no van objetos del dominio: van datos u otros DataTypes."],["esp: Especialidad","La especialidad es un dato de los mecánicos, no de los conductores.","a2"]]},
  {n:"DTResumenViaje",d:"el resumen a confirmar",hl:"u6",w:"La letra enumera el resumen: código y nombre de la ruta, matrícula del tren, nombre del conductor, fecha, hora y código generado.",
   at:["codigoRuta: String","nombreRuta: String","matricula: String","nombre: String","fechaSalida: Date","codigo: String"],
   x:[["estado: Estado","El resumen no lo incluye: el viaje todavía no está registrado (queda «programado» recién al confirmar).","u7"],["ci: Int","El resumen muestra el nombre del conductor, no su CI.","u6"]]}]}];
window.DSSD={};
DSSX.forEach(X=>{const L=P1L[X.id],M=X.M,N=M.length,G=X.id+" · DSS",hl=h=>h?"S:"+h:undefined,dz=a=>(a||[]).map(d=>[d[0],d[1],hl(d[2])]),
 ln=m=>m.op+"("+(typeof m.pa=="string"?m.pa:m.pa[0]).replace("sin parámetros","")+")"+(m.rt&&m.rt[0]!="nada"?": "+m.rt[0].replace(/ \(.*\)$/,""):""),
 /* el DSS en texto: los primeros k mensajes completos y el resto solo con lo decidido en «mensajes»; fr = ya se eligieron los fragmentos */
 dss=(k,fr)=>M.slice(0,k).map((m,i)=>{const F=fr?X.fr.filter(f=>i>=f.a&&i<=f.b):[],h=F.map((f,q)=>{const p=`<div style="padding-left:${q*14}px"><b>`;return i==f.a?p+`${f.k} [${esc(f.k=="alt"?f.g[0]:f.g)}]</b></div>`:f.k=="alt"&&i==f.b?p+`[${esc(f.g[1])}]</b></div>`:""}).join("");
  return h+`<div style="padding-left:${F.length*14}px">${i+1}. ${esc(i<k?ln(m):m.op+" — "+m.d)}${i<k&&m.mem?` <span class="mut">· nota: ${esc(m.mem[0])}</span>`:""}</div>`}).join(""),
 /* contexto: lo que se pide + el caso de uso (frases resaltables) + la realidad plegada + el DSS ya decidido (st: 0 no se muestra, 1 abierto, 2 plegado) */
 /* MENOS TEXTO (19/11, pedido de Luca): cada tarjeta muestra solo las frases del caso de uso que usa (ids); el caso de uso completo y la realidad,
    plegados. La tarjeta de un mensaje no repite «Tu DSS hasta ahora»: ya está dibujado en lo que se arma. */
 o=(k,fr,st,ids)=>({ctx:X.id+" · Problema 1 b) DSS",ar:"mod",kv:b=>{const hs=kHs(b),sel=ids?[...new Set(String(ids).split(",").filter(Boolean).concat(hs.filter(h=>h[0]=="u")))].sort((a,c)=>+a.slice(1)-+c.slice(1)):null;return`<div class="lt"><b>${esc(X.id)} · ${esc(L.cu)}</b> · actor: ${esc(L.act)}</div>`+(sel?kSent(L.S,sel,hs)+kFold("Caso de uso completo",kSent(L.S,L.Uk,hs),0):kSent(L.S,L.Uk,hs))+
  kFold("Descripción de la realidad",`<div class="lt">${esc(L.i)}</div>`+L.P.map(p=>kSent(L.S,p,hs)).join("<br>"),hs.some(h=>h[0]=="a"))+(st?kFold("Tu DSS hasta ahora",seqDraw(k),st<2):"")}}),U=[];
 /* EL DSS SE ARMA CON FICHAS, MENSAJE POR MENSAJE (pedido de Luca, 16/11). Cada tarjeta es la línea que sigue del diagrama: si abre, sigue o cierra un
    fragmento (y su guarda) → qué hace el actor ahora (el paso del caso de uso que es un mensaje) → sus parámetros, ficha por ficha → qué devuelve → la nota de
    memoria. No hay tarjetas aparte de «qué mensajes hay» ni de «qué fragmentos»: se decide al armar cada línea. */
 const FL=["sin fragmento","abre loop","abre alt","abre opt","sigue dentro del loop","otra rama del alt"],GU=X.fr.flatMap(f=>[].concat(f.g));
 M.forEach((m,i)=>{const F=X.fr.filter(f=>i>=f.a&&i<=f.b),st=F.find(f=>f.a==i),br=F.find(f=>f.k=="alt"&&f.b==i&&f.a!=i),cl=X.fr.find(f=>f.b==i-1&&!(f.k=="alt"&&br)&&!F.includes(f)),out=F.find(f=>f!=st&&f.a<i),parts=[],dis=[];
  const add=d=>{if(d[0]&&!dis.some(z=>z[0]==d[0]))dis.push(d)};
  /* FRAGMENTOS EN DOS DECISIONES (18/11, nota de Luca: «esperaba primero una ficha de sigue en el loop»): primero qué pasa con el fragmento que ya
     estaba abierto (sigue dentro / se cierra / otra rama del alt) y después si este mensaje abre uno nuevo. */
  const op=X.fr.filter(f=>f.a<i&&f.b>=i-1).sort((a,b)=>b.a-a.a)[0],A=op?(br&&br===op?"otra rama del alt":op.b>=i?"sigue dentro del "+op.k:"cierra el "+op.k):null;
  if(A){parts.push({t:A,r:"fa",sn:"qué pasa con el "+op.k+" que estaba abierto",hl:hl((br||op).hl),w:/^otra/.test(A)?"Confirmar y cancelar son caminos excluyentes: cada uno va en su rama del alt, con su guarda.":/^sigue/.test(A)?"Este mensaje también es parte de lo que se repite: sigue dentro del "+op.k+".":"Lo que se repite ya terminó: este paso se hace una sola vez, fuera del "+op.k+"."});
   ["sigue dentro del "+op.k,"cierra el "+op.k].concat(op.k=="alt"?["otra rama del alt"]:[]).filter(t=>t!=A).forEach(t=>add([t]))}
  if(!/^otra/.test(A||"")){const B=st?"abre "+st.k:"no abre ningún fragmento";parts.push({t:B,r:"fb",sn:"si abre un fragmento",hl:hl((st||{}).hl||m.hl),w:st?st.w:"Este paso no se repite ni es un camino alternativo: no abre ningún fragmento."});
   ["abre loop","abre alt","abre opt","no abre ningún fragmento"].filter(t=>t!=B).slice(0,3).forEach(t=>add([t]))}
  if(st||br){const g=st?(st.k=="alt"?st.g[0]:st.g):br.g[1];parts.push("[",{t:g,r:"g",sn:"la guarda",hl:hl((st||br).hl),w:"La guarda dice cuándo se entra a esa parte del fragmento: «"+g+"»."},"]");GU.filter(t=>t!=g).slice(0,2).forEach(t=>add([t]))}
  parts.push("\n",(i+1)+".",{t:m.d,r:"d",sn:"qué hace el actor ahora",hl:hl(m.hl),w:(m.w||"El actor le da un dato al Sistema o le comunica una decisión: es un mensaje.")+" Es el paso que sigue en el caso de uso."},"→ "+m.op+"(");
  M.filter((z,q)=>q>i).slice(0,2).forEach(z=>add([z.d]));X.ev.filter(d=>(d[2]||"").split(",").some(k=>(m.hl+","+(m.rh||"")).split(",").includes(k))).concat(X.ev).slice(0,2).forEach(d=>add([d[0],d[1],hl(d[2])]));
  if(typeof m.pa=="string")parts.push(m.pa+")");
  else{const ok=m.pa[0]=="sin parámetros"?[]:m.pa[0].split(", "),ph=hl(m.ph||m.hl);
   if(ok.length)parts.push({set:ok.map(t=>({t})),r:"p",w:m.pa[1],hl:ph},")");else parts.push({t:"sin parámetros",r:"p",sn:"los parámetros",w:m.pa[1],hl:ph},")");
   m.pa.slice(2).forEach(d=>d[0].split(", ").filter(t=>!ok.includes(t)).forEach(t=>add([t,d[1],hl(d[2])])))}
  if(m.rt){parts.push("devuelve",{t:m.rt[0],r:"rt",sn:"lo que devuelve",w:m.rt[1],hl:hl(m.rh||m.hl)});m.rt.slice(2).forEach(d=>add([d[0],d[1],hl(d[2])]))}
  if(m.mem){parts.push("\n","nota:",{t:m.mem[0],r:"nt",sn:"la nota de memoria",w:"Cómo saberlo: mirá si lo que llega en este mensaje se vuelve a mandar en alguno de los que siguen. Si no se vuelve a mandar pero se usa más adelante (por ejemplo, al confirmar), el Sistema lo tiene que recordar. "+m.mem[1],hl:hl(m.mh||m.hl)});m.mem.slice(2).concat([["sin nota",DSW[m.fin?1:0]]],m.fin?[]:[["libera la memoria",DSW[2]]]).forEach(d=>add([d[0],d[1],hl(d[2])]))}
  const use=parts.flatMap(z=>typeof z=="string"?[]:z.set?z.set.map(y=>y.t):[z.t]);
  U.push({id:"m"+(i+1),cards:[kTok(G+" · mensaje "+(i+1),"DSS · mensaje "+(i+1),"Armá con las fichas la línea que sigue del DSS.",parts,dis.filter(d=>!use.includes(d[0])),
   Object.assign(o(i,1,0,[m.hl,m.rh,m.ph,m.mh,(st||{}).hl,(br||{}).hl,(op||{}).hl].filter(Boolean).join(",")),{th:DTH[2]+" "+DTH[1],ko:"Orden: el fragmento que estaba abierto → si abre uno nuevo (y su guarda) → qué hace el actor → parámetros → lo que devuelve → nota de memoria."}))]})});
 /* DIBUJO DEL DSS (17/11): actor y :Sistema con sus líneas de vida, cada mensaje como flecha con su nota, y loop / alt / opt como marcos.
    seqDraw(k) = los k primeros mensajes ya decididos; con cur (la tarjeta del mensaje k) se agrega ese mensaje según las fichas puestas. */
 /* un DataType como recuadro; si sus fichas son «Clase (hereda de Base): atributos», como jerarquía con △ */
 function dtDraw(d,pl){const pend=pl.length<d.at.length,P=pl.map(x=>/^(\w+)(?: \(hereda de (\w+)\))?: (.*)$/.exec(x.t));
  if(!P.some(Boolean))return`<div class="umx">${UM.box(esc(d.n),{st:"«datatype»",at:pl.map(x=>esc(x.t)).concat(pend?[UM.q(null,1)]:[])})}</div>`;
  const b=P.find(m=>m&&!m[2]),ks=P.filter(m=>m&&m[2]).map(m=>UM.box(esc(m[1]),{st:"«datatype»",at:m[3].split(", ").map(esc)}));
  return`<div class="umx">${UM.gen(b?UM.box(esc(b[1]),{st:"«datatype»",at:b[3].split(", ").map(esc)}):UM.box(esc(d.n),{st:"«datatype»",at:[]}),ks.concat(pend?[UM.q(null,1)]:[]))}</div>`}
 function seqDraw(k,cur){const rows=[],fr=X.fr.filter(f=>f.a<k).map(f=>Object.assign({},f,{b:Math.min(f.b,k-1),br:f.k=="alt"&&f.b<k&&f.b>f.a?f.b:null}));
  for(let i=0;i<k;i++){const m=M[i];rows.push(`<div class="sqm"><div class="sql">${i+1}. ${esc(ln(m))}</div><div class="sqa"></div>${m.mem?`<span class="sqn">${esc(m.mem[0])}</span>`:""}</div>`)}
  if(cur){const {v,q}=cur,vA=v("fa"),vB=v("fb"),F=X.fr.find(f=>f.a==k),op=X.fr.filter(f=>f.a<k&&f.b>=k-1).sort((a,b)=>b.a-a.a)[0],i=k,m=M[i];
   const pa=cur.X.filter(x=>x.r=="p"),pp=pa.filter(x=>cur.pl.includes(x)).map(x=>esc(x.t=="sin parámetros"?"":x.t)),ppend=pa.some(x=>!cur.pl.includes(x));
   const lbl=`${i+1}. ${esc(m.op)}(${pp.join(", ")}${ppend?(pp.length?", ":"")+UM.q(null,cur.cu&&cur.cu.r=="p"):""})${m.rt?": "+q("rt"):""}`;
   rows.push(`<div class="sqm"><div class="sqd">el actor: ${q("d")}</div><div class="sql">${lbl}</div><div class="sqa"></div>${m.mem?`<span class="sqn">${q("nt")}</span>`:""}</div>`);
   const pA=vA===null,pB=vB===null&&!/^otra/.test(vA||"");if(pA||pB)rows[k]=`<div class="mut" style="font-size:11px">fragmento: ${pA?q("fa"):q("fb")}</div>`+rows[k];
   const of=op&&fr.find(z=>z.a==op.a);
   /* decidido lo del fragmento abierto, los marcos que siguen abiertos (el decidido y los que lo contienen) acompañan al mensaje */
   if(vA)fr.forEach(f=>{const r=X.fr.find(z=>z.a==f.a&&z.k==f.k);if(r&&r.b>=k)f.b=k});
   if(vA&&/^otra/.test(vA)&&of){of.br=k;of.g2=q("g")}
   if(vB&&/^abre/.test(vB)&&F)fr.push({k:F.k,a:k,b:k,gq:q("g")})}
  const draw=(lo,hi,FS)=>{let h="",i=lo;while(i<=hi){const f=FS.filter(z=>z.a==i).sort((a,b)=>b.b-a.b)[0];
    if(f){const inner=FS.filter(z=>z!==f&&z.a>=f.a&&z.b<=f.b),g1=f.gq!=null?f.gq:esc(f.k=="alt"?f.g[0]:f.g);
     const body=f.br!=null?draw(f.a,f.br-1,inner)+`<div class="sqs">[${f.g2!=null?f.g2:esc(f.g[1])}]</div>`+draw(f.br,f.b,inner):draw(f.a,f.b,inner);
     h+=`<div class="sqf"><span class="sqk">${f.k}</span>[${g1}]${body}</div>`;i=f.b+1}else{h+=rows[i]||"";i++}}return h};
  return`<div class="sqh"><span>🧍 ${esc(L.act)}</span><span>:Sistema</span></div><div class="sqb">${rows.length?draw(0,rows.length-1,fr):'<div class="mut" style="text-align:center">(todavía sin mensajes)</div>'}</div>`}
 U.forEach(u=>{const mm=/^m(\d+)$/.exec(u.id);if(!mm)return;const c=u.cards[0],k=+mm[1]-1,XX=c.bld.exp;c.kd=(pl,cur)=>seqDraw(k,{X:XX,pl,cu:cur,v:kV(pl,cur,XX),q:kQ(pl,cur,XX)})});
 /* 4) DataTypes */
 (X.DT||[]).forEach((d,q)=>U.push({id:"dt"+(q+1),cards:[(z=>(z.kd=pl=>dtDraw(d,pl),z))(kSet(G+" · "+d.n,"DSS · DataType","¿Qué lleva "+d.n+" ("+d.d+")?",d.at.map(t=>({t,w:d.w,hl:hl(d.hl)})),dz(d.x),Object.assign(o(N,1,2,d.hl),{th:DTH[3]})))]}));
 kChain(G,[{id:"dss3",cards:U.filter(u=>!/^dt/.test(u.id)).map(u=>u.cards[0])},{id:"dt",cards:U.filter(u=>/^dt/.test(u.id)).map(u=>u.cards[0])}].filter(u=>u.cards.length),{req:KIN.dss});window.DSSD[X.id]=U});

/* ===== Problema 1a: Modelo de dominio y restricciones =====
   Acciones del estudiante, en el orden del examen: leer la realidad y decidir qué conceptos son CLASES (y cuáles son solo un valor, un sinónimo o el propio
   sistema) → resolver los «tipos de…» y los conjuntos fijos de valores (subclases si cada tipo tiene datos propios; enumerado si no; DataType para valores
   compuestos) → ubicar los atributos (nunca «claves foráneas» ni colecciones como atributo; lo que depende de un par va en una clase de asociación) →
   asociaciones con sus multiplicidades → restricciones en lenguaje natural (solo lo que el diagrama no alcanza a decir: unicidad, integridad circular,
   atributos calculados y reglas de negocio). Una tarjeta de conjunto por acción y cada tarjeta es su propia unidad; «Tu modelo hasta ahora» junta lo decidido.
   MDX por examen: pt = título de cada párrafo de la realidad (se pliegan; se abren los de pp y el de la frase resaltada); C = tarjetas {id, g, t: título en el
   modelo, p: consigna, pp, mo:1 = modelo abierto, ok: [correcta, por qué, frases], no: [equivocada, por qué no, frases], xt: líneas que se suman al modelo sin
   pedirse}. Solo se piden decisiones que salen de la letra: donde la solución oficial elige algo que la letra no fija (p. ej. 1..* o *), no hay ficha equivocada. */
const MTH={cls:"Es clase un concepto de la realidad que tiene datos propios o se relaciona con otros. No son clases: un dato simple (atributo), un conjunto fijo de valores (enumerado), otro nombre del mismo concepto, el actor del caso de uso si no se registran datos de él, ni el sistema o la empresa que lo usa.",
 tip:"«Tipos de X»: si cada tipo registra datos o relaciones propias van subclases (y X es abstracta si todo X es de algún tipo); si solo interesa cuál es, va un enumerado como tipo de un atributo. Un estado que cambia con el tiempo es un atributo enumerado, no subclases. Un valor compuesto sin identidad (fecha, hora) es un DataType.",
 atr:"Cada dato va en la clase de la que es propio: lo común a todos los tipos en la clase base, lo de un tipo en su subclase, y lo que depende de un par de objetos en la clase de asociación. No van como atributos ni las «claves foráneas» (el vínculo es la asociación) ni las colecciones de objetos de otra clase.",
 aso:"Multiplicidad: al lado de cada clase va cuántos objetos de ESA clase se vinculan con uno de la otra. Clase de asociación: cuando el vínculo tiene datos propios y hay a lo sumo un vínculo por par; si puede haber varios por par, es una clase común. {ordered} si la letra habla de secuencia u orden. No se agregan asociaciones que se alcanzan por otro camino.",
 res:"Se escribe en lenguaje natural solo lo que el diagrama no alcanza a decir: unicidad (identificadores; «dentro de» si es relativa), integridad circular (cada ciclo del diagrama: ¿los dos caminos tienen que llegar al mismo objeto?), atributos calculados (la fórmula) y reglas de negocio. Lo que ya dicen las multiplicidades, {ordered} o una clase abstracta no se repite, y no se inventan reglas que la letra no da."};
const kHl=h=>h?"S:"+h:undefined,kDz=a=>(a||[]).map(d=>[d[0],d[1],kHl(d[2])]);
const MDX=[
{id:"Feb26",pt:["Procesos y pasos","Usuarios y certificados","Expedientes y asignaciones"],C:[
 {id:"cls",g:"clases",t:"Clases",p:"¿Qué conceptos de la realidad son clases del modelo?",pp:[0,1,2],
  ok:[["Proceso","Tiene datos propios (nombre, código, descripción) y relaciones.","a2"],["Paso","Tiene datos propios (descripción, rol necesario) y es parte de un proceso.","a4"],
   ["TareaManual","Es un tipo de paso con datos propios (tipo de acción, comprobante).","a5,a7"],["FirmaDigital","Es un tipo de paso con datos propios (nivel de seguridad, fecha de firma).","a5,a11"],
   ["Usuario","Tiene datos propios (email, nombre, rol).","a12"],["Certificado","Tiene datos propios y pertenece a un usuario.","a14"],
   ["Expediente","Tiene datos propios (fecha de creación, estado) y se basa en un proceso.","a17"],["Asignacion","Es un concepto de la realidad: vincula un paso con su usuario responsable en un expediente.","a19"]],
  no:[["Rol","No tiene datos propios: es un conjunto fijo de valores (administrativo, gerente). Va como enumerado, tipo de un atributo.","a4"],
   ["Comprobante","Solo interesa cuál de tres valores fijos es (pdf, imagen, ninguno): es un enumerado, tipo de un atributo de la tarea manual.","a9"],
   ["Tramite","«Iniciar un trámite» es crear un expediente: es el mismo concepto con otro nombre, no otra clase.","a16"],
   ["Sistema","El sistema que se va a construir no es un concepto de la realidad: nunca es una clase del modelo de dominio."],
   ["Administrador","Es un valor del rol de un usuario (y el actor del caso de uso), no un concepto con datos propios.","a4,a12"]]},
 {id:"tip",g:"tipos",t:"Jerarquías y enumerados",p:"¿Cómo se modelan los «tipos de…» y los conjuntos fijos de valores?",pp:[],
  ok:[["«abstracta» Paso ◁ TareaManual, FirmaDigital","Cada tipo de paso tiene datos propios: subclases. Y todo paso es de uno de los dos tipos: Paso es abstracta.","a5"],
   ["«enum» Rol {Administrativo, Gerente}","Un conjunto fijo de valores sin datos propios: enumerado. Lo usan Paso (rol necesario) y Usuario (rol que desempeña).","a4,a12"],
   ["«enum» TipoAccion {Revisión, CargaDeDatos, Inspección}","Tres valores fijos: enumerado, tipo de un atributo de TareaManual.","a7"],
   ["«enum» FormatoEvidencia {PDF, Imagen, Ninguno}","Tres valores fijos: enumerado, tipo de un atributo de TareaManual.","a9"],
   ["«enum» NivelSeguridad {Bajo, Medio, Alto}","Tres valores fijos: enumerado. Lo usan FirmaDigital (nivel exigido) y Certificado (su nivel).","a11,a14"]],
  no:[["«enum» TipoPaso {TareaManual, FirmaDigital}","Con un enumerado no se pueden poner los datos propios de cada tipo (acción y comprobante; nivel y fecha de firma): van subclases.","a5"],
   ["Usuario ◁ Administrativo, Gerente","Administrativo y gerente no tienen datos ni relaciones propias: alcanza con un atributo rol de tipo enumerado. Las subclases son para tipos con datos propios.","a12"],
   ["Certificado ◁ Vigente, Historico","Estar vigente es un dato sí/no del certificado, que además cambia con el tiempo: es un atributo, no subclases.","a14"]]},
 {id:"atr",g:"atributos",t:"Atributos",p:"¿Dónde va cada dato? Elegí las clases con sus atributos bien puestos.",pp:[],
  ok:[["Proceso: nombre, codigo, descripcion","","a2"],["Paso: descripcion, rolRequerido: Rol","Descripción y rol necesario los tienen todos los pasos: van en la clase base.","a4"],
   ["TareaManual: accion: TipoAccion, evidencia: FormatoEvidencia","","a7,a9"],["FirmaDigital: seguridad: NivelSeguridad, fechaFirma: Date","Solo los pasos de firma digital tienen nivel exigido y fecha de firma.","a11"],
   ["Usuario: nombre, mail, rol: Rol","","a12"],["Certificado: autoridad, fechaEmision, fechaVencimiento, nivel: NivelSeguridad, vigente: Boolean","","a14"],["Expediente: fechaCreacion, estado","","a17"]],
  no:[["Expediente: fechaCreacion, estado, codigoProceso","El vínculo con el proceso lo da la asociación Expediente–Proceso: en el modelo de dominio no se ponen «claves foráneas» como atributos.","a16"],
   ["Paso: descripcion, rolRequerido: Rol, seguridad: NivelSeguridad","El nivel de seguridad solo lo tienen los pasos de firma digital: va en la subclase.","a11"],
   ["Usuario: nombre, mail, rol: Rol, nivel: NivelSeguridad","El nivel de seguridad es de cada certificado, no del usuario.","a14"],
   ["Proceso: nombre, codigo, descripcion, pasos: Set(Paso)","Los pasos son objetos de otra clase: se relacionan con una asociación, no con un atributo."]]},
 {id:"aso",g:"asociaciones",t:"Asociaciones",p:"¿Qué asociaciones hay y con qué multiplicidades?",pp:[],mo:1,
  ok:[["Proceso 1 — 1..* Paso {ordered}","«Un proceso define una secuencia ordenada de pasos»: cada paso es de un proceso y el orden se indica con {ordered}.","a3"],
   ["Proceso 1 — * Expediente","«se crea un expediente basado en un proceso»: cada expediente es de un proceso, y un proceso puede tener muchos expedientes.","a16"],
   ["Usuario 1 — * Certificado","Un usuario puede tener varios certificados y cada certificado es de un solo usuario.","a15,a23"],
   ["Expediente * — 1..* Paso, con clase de asociación Asignacion","La asignación es el vínculo entre un expediente y un paso: el responsable se decide para cada par.","a18,a19"],
   ["Asignacion * — 1 Usuario","Cada asignación tiene un usuario responsable; un usuario puede tener muchas asignaciones.","a19"]],
  no:[["Proceso 1 — 1..* Paso (sin {ordered})","«secuencia ordenada»: sin {ordered} el modelo pierde el orden de los pasos.","a3"],
   ["Usuario * — * Certificado","«ningún certificado puede pertenecer a más de un usuario a la vez»: del lado del usuario va 1.","a23"],
   ["Usuario 1 — 0..1 Certificado","«Un usuario puede tener varios certificados históricos»: del lado del certificado va *. Que haya uno solo vigente es una restricción, no una multiplicidad.","a15"],
   ["Paso * — 1 Usuario (el responsable)","El responsable no es del paso solo: se decide «en este expediente». El mismo paso tiene un responsable distinto en cada expediente; por eso cuelga de la asignación.","a19"],
   ["Proceso * — * Expediente","«un expediente basado en un proceso»: cada expediente es de un solo proceso.","a16"]]},
 {id:"res",g:"restricciones",t:"Restricciones",p:"¿Qué restricciones hay que escribir en lenguaje natural? (lo que el diagrama no alcanza a decir)",pp:[],mo:1,
  ok:[["El código de proceso es único y el email de usuario es único","Unicidad: los identificadores se escriben como restricción, el diagrama no los marca.","a2,a12"],
   ["Un usuario tiene a lo sumo un certificado vigente","La multiplicidad dice «varios certificados»; que solo uno esté vigente hay que escribirlo.","a15"],
   ["En toda asignación, el rol del usuario es el rol requerido por el paso","Regla del dominio que relaciona atributos de dos clases: el diagrama no la expresa.","a20"],
   ["Si el paso es de firma digital, el usuario asignado tiene un certificado vigente de nivel igual o superior al exigido","Regla del dominio: el diagrama no la expresa.","a21"],
   ["En toda asignación, el paso es uno de los pasos del proceso del expediente","Integridad circular: hay un ciclo Expediente–Proceso–Paso–Expediente y los dos caminos tienen que coincidir. El diagrama solo no lo garantiza.","a18,a19"]],
  no:[["Cada certificado pertenece a un único usuario","Ya lo dice el diagrama (multiplicidad 1 del lado de Usuario). Lo que el diagrama expresa no se repite como restricción.","a23"],
   ["Cada expediente se basa en un único proceso","Ya lo dice el diagrama (multiplicidad 1 del lado de Proceso)."],
   ["Todo paso es una tarea manual o una firma digital","Ya lo dice el diagrama: Paso es abstracta y tiene esas dos subclases."],
   ["El nombre de proceso es único","La letra dice que el identificador (único) es el código; del nombre no dice nada.","a2"]]}]},
{id:"Jul26",pt:["Centros y espacios","Equipamiento","Clientes y reservas"],C:[
 {id:"cls",g:"clases",t:"Clases",p:"¿Qué conceptos de la realidad son clases del modelo?",pp:[0,1,2],
  ok:[["Centro","Tiene datos propios (código, nombre, dirección) y relaciones.","a1"],["Espacio","Tiene datos propios (número, nombre, capacidad, precio) y es parte de un centro.","a3"],
   ["SalaReuniones","Tipo de espacio con datos propios (videoconferencia, pizarras).","a5"],["OficinaPrivada","Tipo de espacio con datos propios (escritorios, baño privado).","a6"],["Auditorio","Tipo de espacio con datos propios (escenario, sonido).","a7"],
   ["Equipamento","Tiene datos propios (código, descripción, unidades disponibles, precio).","a9"],["Cliente","Tiene datos propios (correo, nombre, teléfono) y hace reservas.","a12,a13"],
   ["Reserva","Tiene datos propios (fecha, hora, duración, asistentes, precio total, estado) y relaciones.","a15"]],
  no:[["Empresa","Es el contexto: hay una sola y la letra no registra ningún dato de ella. No se modela."],
   ["Sistema","El sistema que se va a construir no es un concepto de la realidad: nunca es una clase del modelo de dominio."],
   ["EquipamientoDeSonido","No es un equipamiento que se alquile: es un dato del auditorio con tres valores fijos (básico, intermedio, profesional). Va como atributo de tipo enumerado.","a7"],
   ["Horario","No tiene datos propios: sale de la fecha, la hora de inicio y la duración de la reserva.","a15"],
   ["Estado","Solo interesa cuál de tres valores fijos tiene la reserva: es un enumerado, tipo de un atributo.","a15"]]},
 {id:"tip",g:"tipos",t:"Jerarquías, enumerados y DataTypes",p:"¿Cómo se modelan los «tipos de…», los conjuntos fijos de valores y los valores compuestos?",pp:[],
  ok:[["Espacio ◁ SalaReuniones, OficinaPrivada, Auditorio","Cada tipo de espacio registra datos propios: subclases.","a4"],
   ["«enum» Sonido {Básico, Intermedio, Profesional}","Tres valores fijos: enumerado, tipo de un atributo de Auditorio.","a7"],
   ["«enum» EstadoReserva {Pendiente, Confirmada, Cancelada}","Tres valores fijos: enumerado, tipo del atributo estado de Reserva.","a15"],
   ["«DataType» DTFecha {día, mes, año}","Un valor compuesto, sin identidad: DataType, tipo del atributo fecha.","a15"],
   ["«DataType» DTHora {horas, minutos}","Un valor compuesto, sin identidad: DataType, tipo del atributo hora de inicio.","a15"]],
  no:[["«enum» TipoEspacio {SalaReuniones, OficinaPrivada, Auditorio}","Con un enumerado no se pueden poner los datos propios de cada tipo (videoconferencia, escritorios, escenario…): van subclases.","a4"],
   ["Reserva ◁ Pendiente, Confirmada, Cancelada","El estado no agrega datos propios y cambia con el tiempo (un objeto no cambia de clase): es un atributo de tipo enumerado.","a15"],
   ["Fecha y Hora como clases","No tienen identidad ni relaciones: dos fechas iguales son la misma fecha. Son valores: DataTypes."]]},
 {id:"atr",g:"atributos",t:"Atributos",p:"¿Dónde va cada dato? Elegí las clases con sus atributos bien puestos.",pp:[],xt:["SalaReuniones: videoconferencia: Bool, pizarrones: Int","OficinaPrivada: cantidadEscritorios: Int, bañoPrivado: Bool"],
  ok:[["Centro: codigo, nombre, direccion","","a1"],["Espacio: numero, nombre, capacidad, precio","","a3"],["Auditorio: escenario: Bool, sonido: Sonido","","a7"],
   ["Equipamento: codigo, descripcion, disponibles, precio","","a9"],["Cliente: email, nombre, telefono","","a12,a13"],
   ["Reserva: fecha: DTFecha, horaInicial: DTHora, duracion, asistentes, precioTotal, estado: EstadoReserva","El precio total se deja como atributo, y cómo se calcula va en una restricción.","a15"]],
  no:[["Espacio: numero, nombre, capacidad, precio, codigoCentro","El vínculo con el centro lo da la asociación: en el modelo de dominio no se ponen «claves foráneas» como atributos.","a2"],
   ["Equipamento: codigo, descripcion, disponibles, precio, cantidadMaxima","La cantidad máxima no es del equipamiento solo: se registra «para cada equipamiento dentro de un espacio». Depende del par.","a11"],
   ["Reserva: fecha: DTFecha, horaInicial: DTHora, duracion, asistentes, estado: EstadoReserva (sin precioTotal)","La letra dice que de cada reserva se registra su precio total: es un atributo (calculado) y la fórmula va como restricción.","a15,a19"],
   ["Cliente: email, nombre, telefono, reservas: Set(Reserva)","Las reservas son objetos de otra clase: se relacionan con una asociación, no con un atributo."]]},
 {id:"aso",g:"asociaciones",t:"Asociaciones",p:"¿Qué asociaciones hay y con qué multiplicidades?",pp:[],mo:1,
  ok:[["Centro 1 ◆— 1..* Espacio","«Cada centro posee uno o más espacios», y un espacio no existe fuera de su centro: composición.","a2,a3"],
   ["Centro 1 — * Equipamento","Los centros disponen de equipamiento; cada equipamiento es de un centro (su código es único dentro del centro).","a8,a9"],
   ["Espacio * — * Equipamento, con clase de asociación EquipamentoEnEspacio (cantidadMaxima, requiereAsistencia)","Un equipamiento se habilita en varios espacios y por cada par se registran datos: clase de asociación.","a10,a11"],
   ["Espacio 1 — * Reserva","Cada reserva es de un espacio; un espacio tiene muchas reservas.","a14,a16"],["Cliente 1 — * Reserva","Cada reserva es de un cliente; un cliente hace muchas reservas.","a14"],
   ["Reserva * — * Equipamento, con clase de asociación EquipamentoEnReserva (cantidad)","Una reserva incluye varios equipamientos y por cada par se registra la cantidad: clase de asociación.","a17,a18"]],
  no:[["Cliente * — * Espacio, con clase de asociación Reserva","Con una clase de asociación hay a lo sumo UN vínculo por par: un cliente no podría reservar dos veces el mismo espacio. Reserva es una clase común.","a14"],
   ["Espacio 1 — * Equipamento","«Un equipamiento puede estar habilitado para ser usado en varios espacios»: es * a *.","a10"],
   ["Reserva 1 — * Equipamento","El mismo equipamiento puede estar en muchas reservas (tiene varias unidades y se reserva por horario): es * a *.","a18"],
   ["Centro 1 — * Reserva","La reserva es de un espacio y el espacio ya es de un centro: el centro se alcanza por ese camino, no hace falta otra asociación."]]},
 {id:"res1",g:"restricciones 1",t:"Restricciones: unicidad e integridad circular",p:"¿Qué restricciones de unicidad y de integridad circular hay que escribir?",pp:[],mo:1,
  ok:[["El código de Centro es único","Unicidad en todo el sistema.","a1"],["El email de Cliente es único","«se identifican mediante su correo electrónico».","a12"],
   ["El número de Espacio es único dentro de su Centro","Unicidad relativa: «único dentro del centro».","a3"],["El código de Equipamento es único dentro de su Centro","Unicidad relativa: «único dentro del centro».","a9"],
   ["Un Equipamento solo se habilita para Espacios de su mismo Centro","Integridad circular: ciclo Equipamento–Centro–Espacio–Equipamento; los dos caminos tienen que llegar al mismo Centro.","a10"],
   ["Todo Equipamento incluido en una Reserva está habilitado para el Espacio de esa Reserva","Integridad circular: ciclo Reserva–Espacio–Equipamento–Reserva.","a18"]],
  no:[["El número de Espacio es único en todo el sistema","«único dentro del centro»: dos centros pueden tener un espacio con el mismo número.","a3"],
   ["Cada Espacio pertenece a un único Centro","Ya lo dice el diagrama (multiplicidad 1 del lado de Centro): no se repite como restricción."],
   ["El nombre del Centro es único","La letra solo dice que el código es único.","a1"],["Cada Reserva es de un único Cliente","Ya lo dice el diagrama (multiplicidad 1 del lado de Cliente)."]]},
 {id:"res2",g:"restricciones 2",t:"Restricciones: atributo calculado y reglas de negocio",p:"¿Y cuáles de estas otras restricciones hay que escribir?",pp:[],mo:1,
  ok:[["precioTotal = duración × (precio del espacio + Σ precio de cada equipamiento × su cantidad)","Atributo calculado: se escribe cómo se obtiene.","a19"],
   ["Los asistentes de una Reserva no superan la capacidad de su Espacio","Regla del dominio entre atributos de dos clases.","a15"],
   ["No hay dos Reservas pendientes o confirmadas que se superpongan para un mismo Espacio","Regla del dominio.","a16"],
   ["La cantidad solicitada no supera la cantidad máxima para ese Espacio ni las unidades disponibles en ese horario","Regla del dominio.","a18"],
   ["La cantidad máxima de un Equipamento en un Espacio no supera sus unidades disponibles","La agrega la solución oficial: no tiene sentido permitir en un espacio más unidades de las que el centro tiene.","a9,a11"]],
  no:[["Toda Reserva incluye al menos un equipamiento","«cada reserva puede incluir…»: es opcional (por eso la multiplicidad es *).","a17"],
   ["Una Reserva cancelada no puede volver a confirmarse","La letra no dice nada de eso: no se inventan reglas."],
   ["Cada Reserva tiene exactamente un Espacio","Ya lo dice el diagrama (multiplicidad 1 del lado de Espacio)."]]}]},
{id:"Parcial 2026",pt:["Empleados y ciudades","Trenes","Rutas, estaciones y publicidad","Revisiones","Viajes"],C:[
 {id:"cls",g:"clases",t:"Clases",p:"¿Qué conceptos de la realidad son clases del modelo?",pp:[0,1,2,3,4],
  ok:[["Empleado","Tiene datos propios (CI, nombre, fecha de ingreso).","a1"],["Conductor","Tipo de empleado con datos y relaciones propias (licencia, ciudades habilitadas).","a2"],["Mecanico","Tipo de empleado con datos propios (especialidad).","a2"],
   ["Ciudad","Tiene datos propios (nombre, ubicación) y relaciones.","a3"],["Tren","Tiene datos propios (matrícula, año de fabricación).","a4,a5"],["Pasajeros","Tipo de tren con datos propios.","a6"],["Carga","Tipo de tren con datos propios.","a6"],
   ["Ruta","Tiene datos propios (código, nombre) y está formada por estaciones.","a8"],["Estacion","Tiene datos propios y se ubica en una ciudad.","a10"],["Revision","Tiene datos propios (fecha, detalle, resultado).","a15"],["Viaje","Tiene datos propios y vincula tren, conductor y ruta.","a17,a18"]],
  no:[["Empresa (de transporte)","Es el contexto: hay una sola y la letra no registra ningún dato de ella. No se modela."],
   ["Publicidad","No tiene identidad propia: son dos datos (empresa anunciante y costo) de cada estación dentro de una ruta.","a12,a13"],
   ["Licencia","Solo interesa su categoría (A, B o C): es un atributo de tipo enumerado del conductor.","a2"],
   ["Flota","Es el conjunto de todos los trenes, no un concepto con datos propios.","a4"],
   ["Despachador","Es el actor del caso de uso: la realidad no registra ningún dato de él."]]},
 {id:"tip",g:"tipos",t:"Jerarquías y enumerados",p:"¿Cómo se modelan los «tipos de…» y los conjuntos fijos de valores?",pp:[],
  ok:[["«abstracta» Empleado ◁ Conductor, Mecanico","Cada rol registra datos propios: subclases. Y todo empleado es de uno de los dos roles: Empleado es abstracta.","a2"],
   ["«abstracta» Tren ◁ Pasajeros, Carga","Cada tipo de tren registra datos propios: subclases; «existen dos tipos de trenes operativos».","a6"],
   ["«enum» Categoria {A, B, C}","Tres valores fijos: enumerado, tipo del atributo licencia del conductor.","a2"],
   ["«enum» Especialidad {eléctrica, general}","Dos valores fijos: enumerado, tipo de un atributo del mecánico.","a2"],
   ["«enum» Estado {Programado, EnCurso, Finalizado}","Tres valores fijos: enumerado, tipo del atributo estado del viaje.","a18"]],
  no:[["«enum» Rol {Conductor, Mecanico}","Con un enumerado no se pueden poner los datos propios de cada rol (licencia y ciudades; especialidad): van subclases.","a2"],
   ["«enum» TipoTren {Pasajeros, Carga}","Con un enumerado no se pueden poner los datos propios de cada tipo de tren: van subclases.","a6"],
   ["Viaje ◁ Programado, EnCurso, Finalizado","El estado no agrega datos propios y cambia con el tiempo (un objeto no cambia de clase): es un atributo de tipo enumerado.","a18"]]},
 {id:"atr",g:"atributos",t:"Atributos",p:"¿Dónde va cada dato? Elegí las clases con sus atributos bien puestos.",pp:[],
  xt:["Mecanico: esp: Especialidad","Ciudad: nombre, ubicacion","Tren: matricula, fabricacion","Pasajeros: maxPersonas, servicios: Bool","Carga: maxCarga, peligrosa: Bool","Ruta: codigo, nombre"],
  ok:[["Empleado: ci, nombre, fechaIngreso","","a1"],["Conductor: licencia: Categoria","Las ciudades habilitadas no son un atributo: son objetos de otra clase.","a2"],["Estacion: nombre","La ciudad y los datos de publicidad no van acá.","a10"],
   ["Revision: fecha, detalle, res: Bool","","a15"],["Viaje: codigoV, fechaSalida, estado: Estado","","a18"]],
  no:[["Estacion: nombre, ciudad","La ciudad es un objeto de otra clase: se relaciona con una asociación, no con un atributo.","a10"],
   ["Estacion: nombre, empresa, costoEmision","La publicidad «depende de la ruta»: se registra para cada estación dentro de una ruta. Depende del par.","a12,a13"],
   ["Conductor: licencia: Categoria, ciudades: Set(Ciudad)","Las ciudades son objetos de otra clase: se relacionan con una asociación, no con un atributo.","a2"],
   ["Viaje: codigoV, fechaSalida, estado: Estado, matricula, ci","El tren y el conductor se vinculan con asociaciones: en el modelo de dominio no se ponen «claves foráneas» como atributos.","a17"]]},
 {id:"aso",g:"asociaciones",t:"Asociaciones",p:"¿Qué asociaciones hay y con qué multiplicidades?",pp:[],mo:1,
  ok:[["Conductor * — * Ciudad (habilitado)","Un conductor está habilitado en varias ciudades y en una ciudad hay varios conductores habilitados.","a2"],
   ["Ciudad 1 — * Estacion","Cada estación se ubica en una ciudad.","a10"],
   ["Ruta * — * Estacion {ordered}, con clase de asociación EstacionEnRuta (empresa, costoEmision)","Una ruta tiene varias estaciones en orden, y por cada estación dentro de una ruta se registran datos: clase de asociación.","a9,a11,a13"],
   ["Mecanico * — * Tren, con clase de asociación MecanicoTren","Así lo modela la solución oficial: del par mecánico–tren cuelgan sus revisiones.","a14"],["MecanicoTren 1 — * Revision","Cada revisión es de un mecánico y un tren (un par), y un par puede tener varias revisiones: son «periódicas».","a14,a15"],
   ["Conductor 1 — * Viaje","Cada viaje tiene un conductor asignado.","a17"],["Tren 1 — * Viaje","Cada viaje usa un tren específico.","a17"],["Ruta 1 — * Viaje","Cada viaje recorre una ruta determinada.","a17"]],
  no:[["Mecanico * — * Tren, con clase de asociación Revision","Con una clase de asociación hay a lo sumo UN vínculo por par: un mecánico no podría revisar dos veces el mismo tren, y las revisiones son «periódicas».","a14"],
   ["Ruta 1 — * Estacion {ordered}","Una estación puede estar en varias rutas: por eso su publicidad «depende de la ruta correspondiente».","a12"],
   ["Tren * — * Conductor, con clase de asociación Viaje","Con una clase de asociación hay a lo sumo UN vínculo por par: el mismo conductor no podría hacer dos viajes con el mismo tren."],
   ["Ruta * — * Estacion (sin {ordered})","«es necesario registrar el orden secuencial en el que las estaciones son visitadas».","a11"]]},
 {id:"res",g:"restricciones",t:"Restricciones",p:"¿Qué restricciones hay que escribir en lenguaje natural? (lo que el diagrama no alcanza a decir)",pp:[],mo:1,
  ok:[["La CI de Empleado, la matrícula de Tren, el código de Ruta y el código de Viaje son únicos","Unicidad: los identificadores se escriben como restricción, el diagrama no los marca.","a1,a4,a8,a18"],
   ["Para todo Viaje, las ciudades de las estaciones de su ruta están entre las ciudades en que su conductor está habilitado","Integridad circular: hay un ciclo Viaje–Ruta–Estacion–Ciudad–Conductor–Viaje y los dos caminos tienen que ser compatibles.","a19"]],
  no:[["Cada revisión la realiza un único mecánico","Ya lo dice el diagrama (multiplicidad 1): no se repite como restricción.","a15"],
   ["Cada viaje tiene un único tren, un único conductor y una única ruta","Ya lo dicen las multiplicidades 1 del diagrama."],
   ["Las estaciones de una ruta están ordenadas","Ya lo dice el diagrama, con {ordered}.","a11"],
   ["El nombre de la estación es único","La letra no lo dice: no se inventan reglas.","a10"]]}]}];
/* Fichas que arman una tarjeta: texto ya puesto | "\n" | {t, sn, w, hl} casillero en orden | {set:[{t,w}], w, hl} grupo de fichas en cualquier orden.
   dis = [[ficha equivocada, por qué (opcional: si falta, se explica la regla del casillero), frase]] */
function kTok(g,q,p,parts,dis,o){const exp=[],its=[];let n=0;
 parts.forEach(s=>{if(s=="\n")return exp.push(KNL());if(typeof s=="string")return exp.push({t:s,k:"a",auto:1});
  if(s.set){const pre=its.slice();s.set.forEach(z=>{const x={t:z.t,w:z.w||s.w||"",k:"ks",fr:1,o:exp.length,dp:pre,hl:z.hl||s.hl,r:z.r||s.r};exp.push(x);its.push(x)});return}
  const x=Object.assign({k:"kq",sl:++n},s);exp.push(x);its.push(x)});
 return kCard(g,q,p,exp,its.map(x=>({t:x.t})).concat((dis||[]).map(d=>({t:d[0],why:d[1],hl:d[2]}))),o)}
/* EL MODELO DE DOMINIO SE ARMA CON FICHAS (pedido de Luca, 16/11): qué conceptos son clases → cada clase (subclases o no, abstracta o no, y sus atributos,
   ficha por ficha) → cada asociación (la otra clase, la multiplicidad de cada lado, si lleva orden y si lleva clase de asociación) → restricciones.
   Todo sale de los mismos datos MDX: «tip» da las jerarquías, «atr» los atributos (y sus fichas equivocadas) y «aso» las asociaciones. */
/* ===== Dibujo UML (17/11, pedido de Luca: «el diagrama no se va armando como en el pdf, que es un recuadro con cierta estructura»): recuadros de clase
   (estereotipo, nombre, atributos), herencia con △ y subclases debajo, asociaciones como línea con su multiplicidad en cada punta y la clase de asociación
   colgando con línea punteada. Lo que falta decidir se ve «?»; el lugar actual, resaltado. ===== */
(()=>{const st=document.createElement("style");st.textContent=".umx{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;margin:4px 0}.umb{display:inline-block;border:1.5px solid var(--fg);background:var(--card);min-width:110px;font-size:13px;text-align:left}.umb>.h{padding:3px 8px;text-align:center;border-bottom:1.5px solid var(--fg)}.umb>.h i{display:block;font-style:normal;font-size:11px}.umb>.a{padding:3px 8px;min-height:1.1em}.umb>.a div{white-space:nowrap}.umq{color:var(--ac);font-weight:700}.umc{border:2px dashed var(--ac);border-radius:4px;padding:0 4px}.umg{display:inline-flex;flex-direction:column;align-items:center}.umt{line-height:1;font-size:15px}.umk{display:flex;gap:8px;border-top:1.5px solid var(--fg);padding-top:6px}.uma{display:flex;align-items:center;gap:4px;margin:6px 0;font-size:13px;flex-wrap:wrap}.uma .ln{flex:1;min-width:40px;border-top:1.5px solid var(--fg);position:relative;text-align:center}.uma .ln span{position:relative;top:-9px;background:var(--card);padding:0 3px;font-size:11px}.umn{border:1.5px solid var(--fg);padding:1px 6px;background:var(--card);white-space:nowrap}.umd{border-left:1.5px dashed var(--fg);height:12px;margin-left:50%}.sqh{display:flex;justify-content:space-between;font-size:12px;font-weight:700}.sqh span{border:1.5px solid var(--fg);padding:1px 6px;background:var(--card)}.sqb{margin:2px 22px 0 14px;border-left:1.5px dashed var(--fg);border-right:1.5px dashed var(--fg);padding:2px 0 8px;font-size:12.5px}.sqm{margin:8px 0 2px}.sql{text-align:center;padding:0 4px;overflow-wrap:anywhere}.sqd{text-align:center;font-size:11px;font-style:italic;opacity:.8}.sqa{border-top:1.5px solid var(--fg);position:relative;margin:2px 0}.sqa:after{content:\"▶\";position:absolute;right:-5px;top:-9px;font-size:10px}.sqn{display:block;width:max-content;max-width:70%;margin:3px 4px 0 auto;border:1.5px solid var(--fg);border-top-right-radius:8px;padding:1px 6px;font-size:11px;background:var(--card)}.sqf{border:1.5px solid var(--fg);margin:8px -8px 2px;padding:0 8px 4px}.sqk{display:inline-block;border:1.5px solid var(--fg);border-top:0;border-left:0;padding:0 6px;margin-left:-8px;font-weight:700;margin-right:6px}.sqs{border-top:1.5px dashed var(--fg);margin:8px -8px 0;padding:1px 8px}.umr{display:flex;align-items:center;gap:4px;margin:6px 0;font-size:13px}.umr .ln{flex:1;min-width:40px;border-top:1.5px solid var(--fg);position:relative}.umr .ln.dp{border-top-style:dashed}.umr .ln:after{content:\">\";position:absolute;right:-4px;top:-10px;font-size:14px}";document.head.appendChild(st)})();
const UM={q:(v,cur)=>v==null?`<span class="umq${cur?" umc":""}">?</span>`:esc(v),
 box:(n,o)=>{o=o||{};const at=o.at==null?"":o.at.map(t=>`<div>${t}</div>`).join("");return`<div class="umb"><div class="h">${o.st?`<i>${o.st}</i>`:""}<b>${n}</b></div><div class="a">${at}</div>${o.ops!=null?`<div class="a" style="border-top:1.5px solid var(--fg)">${o.ops.map(t=>`<div>${t}</div>`).join("")}</div>`:""}</div>`},
 gen:(top,kids)=>`<div class="umg">${top}${kids&&kids.length?`<div class="umt">△</div><div class="umk">${kids.join("")}</div>`:""}</div>`,
 aso:(a,ma,mb,b,extra,ac)=>`<div class="uma"><span class="umn">${a}</span><span>${ma}</span><span class="ln">${extra?`<span>${extra}</span>`:""}</span><span>${mb}</span><span class="umn">${b}</span></div>`+(ac?`<div class="umd"></div><div style="text-align:center">${ac}</div>`:"")};
/* valor de una ficha por su rol: puesta → su texto; si no, «?» (resaltado si es la actual) */
/* opcional (si es abstracta, si hereda, orden, clase de asociación): mientras no sea su turno no se muestra, para no adelantar que hay algo */
const kOp=(pl,cur,X)=>r=>{const x=X.find(z=>z.r==r);return!!x&&!pl.includes(x)&&x!==cur};
const kV=(pl,cur,X)=>r=>{const x=X.find(z=>z.r==r);if(!x)return undefined;return pl.includes(x)?x.t:null},kQ=(pl,cur,X)=>r=>{const x=X.find(z=>z.r==r);if(!x)return"";return pl.includes(x)?esc(x.t):UM.q(null,x===cur)};
/* EL MODELO DE DOMINIO SE ARMA CON FICHAS (16/11) Y SE DIBUJA COMO EN EL EXAMEN (17/11): qué conceptos son clases → enumerados y DataTypes (estereotipo y
   valores) → cada clase (herencia, subclases, abstracta, atributos) → cada asociación (la otra clase, multiplicidad de cada lado, orden, clase de asociación)
   → restricciones. Todo sale de los datos MDX. «Tu modelo hasta ahora» es el diagrama con lo ya armado. */
MDX.forEach(X=>{const L=P1L[X.id],G=X.id+" · Modelo de dominio",C=k=>X.C.find(c=>c.id==k)||{ok:[],no:[]},cards=[],meta=[];
 const sub={},bas={},nosub={};C("tip").ok.forEach(o=>{const m=/^(«abstracta» )?(\w+) ◁ (.*)$/.exec(o[0]);if(m){bas[m[2]]={abs:!!m[1],subs:m[3].split(", "),hl:o[2]};m[3].split(", ").forEach(z=>sub[z]=m[2])}});
 C("tip").no.forEach(o=>{const m=/^(\w+) ◁ (.*)$/.exec(o[0]);if(m)nosub[m[1]]={subs:m[2].split(", "),why:o[1],hl:o[2]}});
 const ENS=C("tip").ok.map(o=>/^«(enum|DataType)» (\w+) \{(.*)\}$/.exec(o[0])&&[o,/^«(enum|DataType)» (\w+) \{(.*)\}$/.exec(o[0])]).filter(Boolean);
 const atr=C("atr"),cls=atr.ok.map(o=>({n:o[0].split(": ")[0],at:o[0].slice(o[0].indexOf(": ")+2).split(", "),w:o[1],hl:o[2]})).concat((atr.xt||[]).map(t=>({n:t.split(": ")[0],at:t.slice(t.indexOf(": ")+2).split(", "),w:""})));
 /* el modelo con lo armado antes de la tarjeta k */
 const model=k=>{const M=meta.slice(0,k),names=(M.find(m=>m.k=="cls")||{}).names||[],CI={};M.filter(m=>m.k=="class").forEach(m=>CI[m.n]=m);
  if(!names.length)return'<span class="mut">todavía nada</span>';
  const bx=n=>{const m=CI[n];return UM.box(esc(n),m?{st:m.abs?"«abstracta»":"",at:m.at.map(esc)}:{at:[]})},kids=n=>names.filter(z=>CI[z]&&CI[z].B==n),
   roots=names.filter(n=>!(CI[n]&&CI[n].B)),en=M.filter(m=>m.k=="enum").map(m=>UM.box(esc(m.n),{st:"«"+m.st+"»",at:m.vals.map(esc)}));
  return`<div class="umx">${roots.map(n=>UM.gen(bx(n),kids(n).map(c=>UM.gen(bx(c),kids(c).map(bx))))).concat(en).join("")}</div>`+M.filter(m=>m.k=="aso").map(m=>UM.aso(esc(m.A),esc(m.ma),esc(m.mb),esc(m.B),m.ord?"{ordered}":"",m.ac?UM.box(esc(m.ac.n),{at:m.ac.at.map(esc)}):"")).join("")};
 const view=(i,fx)=>b=>{const hs=kHs(b).concat(fx?fx.split(","):[]);return`<div class="lt"><b>${esc(X.id)} · Problema 1</b> ${esc(L.pa||P1P.a)}</div><div class="lt">${esc(L.i)}</div>`+
   L.P.map((p,q)=>kFold(X.pt[q],kSent(L.S,p,hs),(!i&&!fx)||p.some(k=>hs.includes(k)))).join("")+kFold("Tu modelo hasta ahora",model(i),1)},
  o=(k,fx,kd)=>Object.assign({ctx:X.id+" · Problema 1 a) Modelo de dominio",ar:"mod",th:MTH[k],kv:view(meta.length,fx)},kd?{kd}:{});
 /* 1) clases */
 {const c=C("cls"),names=c.ok.map(z=>z[0]);cards.push(kSet(G+" · clases","Modelo de dominio · clases",c.p,c.ok.map(z=>({t:z[0],w:z[1],hl:kHl(z[2])})),kDz(c.no),
   o("cls",null,(pl)=>`<div class="umx">${pl.map(x=>UM.box(esc(x.t),{at:[]})).join("")}</div>${pl.length<names.length?'<span class="mut">¿alguna más?</span>':""}`)));meta.push({k:"cls",names})}
 /* 2) enumerados y DataTypes: el nombre lo pone quien resuelve (no se pide); se elige el estereotipo y los valores */
 const allV=ENS.flatMap(e=>e[1][3].split(", "));
 ENS.forEach(([o0,m])=>{const vals=m[3].split(", "),parts=[{t:"«"+m[1]+"»",sn:"el estereotipo",r:"st",w:m[1]=="enum"?"Un conjunto fijo de valores, sin datos propios: enumerado. Se usa como tipo de un atributo.":"Un valor compuesto sin identidad: DataType. Se usa como tipo de un atributo.",hl:kHl(o0[2])},
   {set:vals.map(t=>({t})),r:"v",w:m[1]=="enum"?"Son los valores que da la letra.":"Son las partes del valor.",hl:kHl(o0[2])}],dis=[[m[1]=="enum"?"«DataType»":"«enum»"],["«clase»","No tiene datos propios ni identidad: no es una clase del modelo."]].concat(allV.filter(v=>!vals.includes(v)).slice(0,3).map(v=>[v,"Es un valor de otro enumerado o DataType."]));
  cards.push(kTok(G+" · tipo "+m[2],"Modelo de dominio · "+m[2],"Armá "+m[2]+" con las fichas: qué es y qué valores tiene.",parts,dis,o("tip",o0[2],(pl,cur,_)=>{const E=cards[cards.length-1]||{};return""})));
  const card=cards[cards.length-1],XX=card.bld.exp;card.kd=(pl,cur)=>{const v=kQ(pl,cur,XX);const vs=XX.filter(x=>x.r=="v"&&pl.includes(x)).map(x=>esc(x.t)),pend=XX.some(x=>x.r=="v"&&!pl.includes(x));return`<div class="umx">${UM.box(esc(m[2]),{st:v("st"),at:vs.concat(pend?[UM.q(null,cur&&cur.r=="v")]:[])})}</div>`};
  meta.push({k:"enum",n:m[2],st:m[1],vals})});
 /* 3) cada clase */
 const mkClass=c=>{const B=sub[c.n],S=bas[c.n],NS=nosub[c.n],parts=[],dis=[],h=kHl(c.hl);
  if(B){parts.push({t:"hereda de "+B,sn:"de quién hereda",r:"par",w:"«"+c.n+"» es un tipo de «"+B+"» con datos propios: es una subclase (△ hacia «"+B+"»).",hl:kHl(bas[B].hl)});dis.push(["no hereda de ninguna"])}
  if(S){parts.push({t:"con subclases "+S.subs.join(" y "),sn:"si tiene subclases",r:"sub",w:"Cada tipo de «"+c.n+"» registra datos propios: hacen falta subclases, no alcanza con un atributo.",hl:kHl(S.hl)});dis.push(["sin subclases (un atributo «tipo»)"]);
   if(S.abs){parts.push({t:"«abstracta»",sn:"si es abstracta",r:"abs",w:"Todo «"+c.n+"» es de alguno de sus tipos: no hay un «"+c.n+"» a secas, por eso es abstracta.",hl:kHl(S.hl)});dis.push(["concreta"])}}
  if(NS){parts.push({t:"sin subclases",sn:"si tiene subclases",r:"sub",w:NS.why,hl:kHl(NS.hl)});dis.push(["con subclases "+NS.subs.join(" y "),NS.why,kHl(NS.hl)])}
  parts.push({set:c.at.map(t=>({t})),r:"at",w:c.w||"Son los datos propios de «"+c.n+"» que da la letra.",hl:h});
  /* CONEXIONES (18/11, pedido de Luca): lo que la letra dice de la clase y es OTRA clase se dibuja como conexión (línea), no como atributo. Ficha correcta
     «conexión con X» y, enfrente, la ficha tentadora del mismo dato escrito como atributo («ciudades: Set(Ciudad)»). La multiplicidad se arma después,
     en la tarjeta de la asociación. */
  const RL=C("aso").ok.map(z=>{const m=/^(\w+) (\S+) ◆?— (\S+) (\w+)/.exec(z[0]);return m&&(m[1]==c.n?{o:m[4],mu:m[3],z}:m[4]==c.n?{o:m[1],mu:m[2],z}:null)}).filter(Boolean).filter((r,i,a)=>a.findIndex(y=>y.o==r.o)==i);
  if(RL.length){parts.push({set:RL.map(r=>({t:"conexión con "+r.o,w:"«"+r.o+"» es otra clase del modelo: lo que vincula a «"+c.n+"» con ella se dibuja como una línea entre los dos recuadros (una asociación). "+r.z[1],hl:kHl(r.z[2])})),r:"cx"});
   const lc=n=>n[0].toLowerCase()+n.slice(1),pl=n=>/[aeiou]$/i.test(n)?n+"s":n+"es";
   RL.forEach(r=>{const t=/\*/.test(r.mu)?pl(lc(r.o))+": Set("+r.o+")":lc(r.o)+": "+r.o;if(!dis.some(d=>d[0]==t))dis.push([t,"«"+r.o+"» es otra clase: no va como atributo de «"+c.n+"». El vínculo se dibuja como una asociación (una línea entre los recuadros), con su multiplicidad en cada punta.",kHl(r.z[2])])});
   const oth=cls.map(z=>z.n).filter(n=>n!=c.n&&!RL.some(r=>r.o==n)&&n!=B&&sub[n]!=c.n);if(oth.length)dis.push(["conexión con "+oth[cards.length%oth.length],"La letra no vincula «"+c.n+"» con esa clase."])}
  atr.no.filter(z=>z[0].startsWith(c.n+": ")&&!/\(sin /.test(z[0])).forEach(z=>z[0].slice(c.n.length+2).split(", ").filter(t=>!c.at.includes(t)).forEach(t=>dis.push([t,z[1],kHl(z[2])])));
  cls.filter(z=>z.n!=c.n&&z.n!=B&&sub[z.n]!=c.n).flatMap(z=>z.at.map(t=>[t,z.n])).filter(z=>!c.at.includes(z[0])&&!dis.some(d=>d[0]==z[0])).slice(cards.length%3,cards.length%3+2).forEach(z=>dis.push([z[0],"Ese dato es de «"+z[1]+"», no de «"+c.n+"»."]));
  const card=kTok(G+" · clase "+c.n,"Modelo de dominio · clase "+c.n,"Armá la clase "+c.n+" con las fichas: lo que es un dato va como atributo y lo que es otra clase, como conexión.",parts,dis.filter((d,i)=>dis.findIndex(z=>z[0]==d[0])==i),o("atr"));const XX=card.bld.exp;
  card.kd=(pl,cur)=>{const v=kV(pl,cur,XX),q0=kQ(pl,cur,XX),hid=kOp(pl,cur,XX),q=r=>hid(r)?"":q0(r),at=XX.filter(x=>x.r=="at"&&pl.includes(x)).map(x=>esc(x.t)),pend=XX.some(x=>x.r=="at"&&!pl.includes(x));
   const abs=XX.some(x=>x.r=="abs")&&!hid("abs")?(v("abs")==null?q("abs"):v("abs")=="«abstracta»"?"«abstracta»":""):"",box=UM.box(esc(c.n),{st:abs,at:at.concat(pend?[UM.q(null,cur&&cur.r=="at")]:[])});
   const par=XX.some(x=>x.r=="par")&&!hid("par")?(v("par")==null?`<div class="umg">${UM.box(q("par"))}<div class="umt">△</div></div>`:v("par").startsWith("hereda de ")?`<div class="umg">${UM.box(esc(v("par").slice(10)))}<div class="umt">△</div></div>`:""):"";
   const sb=XX.some(x=>x.r=="sub")&&!hid("sub")?(v("sub")==null?`<div class="umt">△</div><div class="umk">${UM.box(q("sub"))}</div>`:v("sub").startsWith("con subclases ")?`<div class="umt">△</div><div class="umk">${v("sub").slice(14).split(" y ").map(n=>UM.box(esc(n))).join("")}</div>`:""):"";
   const cx=XX.filter(x=>x.r=="cx"),cxp=cx.filter(x=>pl.includes(x)).map(x=>UM.aso(esc(c.n),"","",esc(x.t.slice(13)))).join("")+(cx.some(x=>!pl.includes(x))&&cur&&cur.r=="cx"?UM.aso(esc(c.n),"","",UM.q(null,1)):"");
   return`<div class="umx"><div class="umg">${par}${box}${sb}</div></div>`+cxp};
  cards.push(card);meta.push({k:"class",n:c.n,B,abs:!!(S&&S.abs),at:c.at})};
 /* 4) cada asociación */
 const mkAso=z=>{const m=/^(\w+) (\S+) (◆?—) (\S+) (\w+)(.*)$/.exec(z[0]);if(!m)return;const A=m[1],ma=m[2],mb=m[4],Bc=m[5],ord=/\{ordered\}/.test(m[6]),acm=/con clase de asociación (\w+)(?: \(([^)]*)\))?/.exec(m[6]),ac=acm&&acm[1],h=kHl(z[2]),all=cls.map(c=>c.n);
  const parts=[{t:Bc,sn:"la otra clase",r:"B",w:z[1],hl:h},{t:ma,sn:"la multiplicidad del lado de "+A,r:"ma",w:"Al lado de «"+A+"» va cuántos «"+A+"» se vinculan con UN «"+Bc+"». "+z[1],hl:h},{t:mb,sn:"la multiplicidad del lado de "+Bc,r:"mb",w:"Al lado de «"+Bc+"» va cuántos «"+Bc+"» se vinculan con UN «"+A+"». "+z[1],hl:h},
   {t:ord?"{ordered}":"sin orden",sn:"si lleva orden",r:"ord",w:ord?"La letra habla de una secuencia o de un orden: se indica con {ordered}.":"La letra no pide ningún orden entre ellos.",hl:h},
   {t:ac?"con clase de asociación "+ac:"sin clase de asociación",sn:"si lleva clase de asociación",r:"ac",w:ac?"El vínculo tiene datos propios (o algo que cuelga de cada par): va una clase de asociación.":"El vínculo no tiene datos propios: no hace falta una clase de asociación.",hl:h}];
  const dis=all.filter(c=>c!=A&&c!=Bc).slice(cards.length%4,cards.length%4+2).map(c=>[c]).concat(["1","*","1..*","0..1"].filter(t=>t!=ma&&t!=mb&&!(t=="*"&&[ma,mb].includes("1..*"))&&!(t=="1..*"&&[ma,mb].includes("*"))).map(t=>[t]),[[ord?"sin orden":"{ordered}"],[ac?"sin clase de asociación":"con clase de asociación"]]);
  const card=kTok(G+" · asociación "+A+"–"+Bc,"Modelo de dominio · una asociación","Armá la asociación de "+A+" que sale de las frases marcadas.",parts,dis,Object.assign(o("aso",z[2]),{ko:"Orden: la otra clase → multiplicidad de cada lado → orden → clase de asociación."}));const XX=card.bld.exp;
  card.kd=(pl,cur)=>{const v=kV(pl,cur,XX),q0=kQ(pl,cur,XX),hid=kOp(pl,cur,XX),q=r=>hid(r)?"":q0(r),o2=v("ord"),a2=v("ac"),acB=hid("ac")?"":a2==null?UM.box(q("ac")):a2.startsWith("con ")?UM.box(esc(ac),{at:(acm[2]||"").split(", ").filter(Boolean).map(esc)}):"";
   return UM.aso(esc(A)+(m[3]=="◆—"?" ◆":""),q("ma"),q("mb"),q("B"),o2==null?q("ord"):o2=="{ordered}"?"{ordered}":"",acB)};
  cards.push(card);meta.push({k:"aso",A,B:Bc,ma,mb,ord,ac:ac?{n:ac,at:(acm[2]||"").split(", ").filter(Boolean)}:null})};
 /* ORDEN DE LECTURA (17/11, nota de Luca: «la letra dice que el conductor tiene ciudades habilitadas y no aparece»): las clases en el orden de la letra
    y cada asociación apenas están armadas sus dos clases (o la clase de asociación de la que cuelga). */
 {const nm=C("cls").ok.map(z=>z[0]),pos=n=>{const i=nm.indexOf(n);return i<0?99:i},done=new Set(),pend=C("aso").ok.slice();
  const ends=z=>{const m=/^(\w+) \S+ ◆?— \S+ (\w+)/.exec(z[0]);return m?[m[1],m[2]]:[]},acOf=z=>(/con clase de asociación (\w+)/.exec(z[0])||[])[1];
  const flush=()=>{let k;do{k=pend.findIndex(z=>ends(z).every(e=>done.has(e)));if(k>=0){const z=pend.splice(k,1)[0];mkAso(z);if(acOf(z))done.add(acOf(z))}}while(k>=0)};
  cls.slice().sort((a,b)=>pos(a.n)-pos(b.n)).forEach(c=>{mkClass(c);done.add(c.n);flush()});pend.forEach(mkAso)}
 /* 5) restricciones */
 X.C.filter(c=>/^res/.test(c.id)).forEach(c=>{cards.push(kSet(G+" · "+c.g,"Modelo de dominio · "+c.g,c.p,c.ok.map(z=>({t:z[0],w:z[1],hl:kHl(z[2])})),kDz(c.no),o("res")));meta.push({k:"res"})});
 kChain(G,[{id:"md2",cards}],{req:KIN.md})});
