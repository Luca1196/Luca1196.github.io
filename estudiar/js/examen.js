/* SECCIÓN EXAMEN: los demás problemas de las pruebas de Prog4, dentro de Principal (pedido de Luca, 16/11).
   Problema 2b (DCD), Problema 1b (DSS) y Problema 1a (Modelo de dominio). El Problema 3 (C++) está en js/codigo.js.
   DECISIONES DIDÁCTICAS (mismo método que los diagramas de comunicación; ver RECETA al inicio de js/prog4.js)
   - Cada tema se desarma en las ACCIONES del estudiante y hay una tarjeta (o pack) por acción, en el orden en que se resuelve en el examen.
   - Sin spoilers: una tarjeta solo muestra la letra y lo que el estudiante ya decidió en tarjetas anteriores («… hasta ahora»).
   - Fichas: «conjunto» (kSet: elegir todas las correctas, orden libre) y «casilleros» (kSeq: decisiones en orden fijo, con lo arbitrario ya puesto).
     Los nombres inventados (operaciones del DSS, DataTypes, clases) nunca se piden: van puestos o unidos a la decisión.
   - Cada ficha equivocada es un error real y tentador, con su razón defendible; al fallar se resalta la frase de la letra de donde sale el dato.
   - Solo material real: letra tal cual y solución oficial (Feb26 y Jul26). El Problema 1 del Parcial 2026 no tiene solución oficial: no se carga.
   - Previaturas: dentro de un ejercicio cada unidad pide la anterior sin errores (token m:<ejercicio>:<unidad>); el DCD pide los dos diagramas de su examen.
   - Una ficha equivocada puede llevar la frase de la letra que la desmiente (último dato de cada dis: "S:u1"); al tocarla se resalta esa frase.
   - La letra del Problema 1 (realidad + caso de uso) de Feb26 y Jul26 está transcripta tal cual en P1L (más abajo): no hace falta volver a los PDF.
   RECETA PARA SUMAR UN EXAMEN: DCD → una entrada en DCDX (los datos salen solos de las líneas de comunicación); DSS → letra en P1L + una entrada en DSSX;
   Modelo de dominio → una entrada en MDX. Después: actualizar ?v= en index.html, simular las cadenas con jsdom, commit y push. */

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
 let H=[];LL.forEach(x=>{const h=x.hop;if(!h)return;const e=H.find(z=>z.a==h.a&&z.b==h.b);if(e)e.w=e.w||h.w;else H.push({a:h.a,b:h.b,w:h.w,ref:x.ref})});
 H=H.filter(h=>!(sup[h.a]&&H.some(z=>z.a==sup[h.a]&&z.b==h.b)));
 const hasA=(s,t)=>H.some(h=>(h.a==s||h.a==sup[s])&&(h.b==t||h.b==sup[t])),hp=h=>h.a+" → "+h.b+(h.w?" *":"");
 /* dependencias: s usa a t sin tener asociación hacia t */
 let D=[];const use=(s,t,why)=>{if(!s||!t||s==t||sup[s]==t||sup[t]==s||hasA(s,t)||skp(s,t)||D.some(d=>d.a==s&&d.b==t))return;D.push({a:s,b:t,why})};
 LL.forEach(x=>{const L=x.L,S=x.cls(L.from),T=x.cls(L.to);
  if(L.t!="A")use(S,T,"«"+S+"» le manda un mensaje a un objeto «"+T+"» que conoce por "+({L:"variable local",P:"parámetro",G:"visibilidad global"})[L.t]+" ("+x.ref+")");
  if(L.res&&x.ty(L.res))use(S,x.ty(L.res),"«"+S+"» recibe un objeto «"+x.ty(L.res)+"» como resultado y lo guarda en una variable local ("+x.ref+")");
  String(L.pa||"").replace(/[()]/g,"").split(",").map(v=>v.trim()).forEach(v=>{if(x.ty(v))use(T,x.ty(v),"«"+T+"» recibe un objeto «"+x.ty(v)+"» por parámetro ("+x.ref+")")})});
 D=D.filter(d=>!(sup[d.a]&&D.some(z=>z.a==sup[d.a]&&z.b==d.b)));
 /* operaciones: se declaran en la clase del receptor */
 const O=[];X.gs.forEach(g=>{const c0=P4EX[g].cs[0],e=c0.dg.ent,sg=String(c0.dg.sig||"").replace(/^[A-Za-z]+\./,"");O.push({c:e?e.split(":")[1]:"Controlador",t:(e?e.split(":")[1]:"Controlador")+" :: "+sg,ref:"es la operación que resuelve ese diagrama",from:null})});
 LL.forEach(x=>{const L=x.L;if(GEN.test(L.op)||/^get[A-Z]/.test(L.op)&&L.pa=="()")return;const C=x.cls(L.to),t=C+" :: "+L.op+L.pa;if(!O.some(o=>o.t==t))O.push({c:C,op:L.op,pa:L.pa,t,ref:x.ref,from:x.cls(L.from)})});
 window.DCDD[X.id]={H,D,O};
 const G=X.id+" · DCD",view=b=>`<div class="lt"><b>${esc(X.id)} · Problema 2</b> ${esc(X.pide)}</div>`+(X.nota&&SW&&/dependencias/.test(SW.c.g)?`<div class="lt mut">${esc(X.nota)}</div>`:"")+X.gs.map(g=>kFold("Tu diagrama de "+opn(g)+" ("+P4EX[g].cs.length+" mensajes)",P4EX[g].cs.map(c=>`<div>${esc(lineStr(c.dg.cur))}</div>`).join(""))).join(""),
  o=x=>Object.assign({kv:view,ctx:X.id+" · Problema 2 b) DCD"},x||{}),cards=[];
 /* 1) asociaciones */
 {const dis=[];D.slice(0,2).forEach(d=>dis.push([d.a+" → "+d.b,"«"+d.a+"» conoce a «"+d.b+"» solo por parámetro, variable local o global, no por un atributo propio: eso se dibuja como dependencia (punteada), no como asociación."]));
  H.filter(h=>h.a!="Controlador"&&!H.some(z=>z.a==h.b&&z.b==h.a)&&!skp(h.b,h.a)).slice(0,2).forEach(h=>dis.push([h.b+" → "+h.a+(h.w?"":" *"),"En ningún mensaje se navega de «"+h.b+"» hacia «"+h.a+"»: solo se dibuja la navegabilidad que usan los diagramas."]));
  cards.push(kSet(G+" · asociaciones","DCD · asociaciones","¿Qué asociaciones navegables quedan en el DCD? (las que usan los dos diagramas)",H.map(h=>({t:hp(h),w:"Se navega por esa flecha en el "+h.ref+"."})),dis.filter((d,i)=>!H.some(h=>hp(h)==d[0])&&dis.findIndex(z=>z[0]==d[0])==i),o()))}
 /* 2) dependencias */
 if(D.length){const dis=[];H.filter(h=>h.a!="Controlador").slice(0,2).forEach(h=>dis.push([h.a+" ⇢ "+h.b,"Ya hay una asociación "+h.a+" → "+h.b+" (se llega por un atributo propio): la dependencia sobra."]));
  D.filter(d=>!hasA(d.b,d.a)&&!skp(d.b,d.a)&&!D.some(z=>z.a==d.b&&z.b==d.a)).slice(0,1).forEach(d=>dis.push([d.b+" ⇢ "+d.a,"«"+d.b+"» no usa a «"+d.a+"» en ningún mensaje: la dependencia va de quien usa hacia lo que usa."]));
  cards.push(kSet(G+" · dependencias","DCD · dependencias","¿Qué dependencias (flecha punteada) hacen falta?",D.map(d=>({t:d.a+" ⇢ "+d.b,w:d.why+" y no tiene asociación hacia esa clase: es una dependencia."})),dis.filter(d=>!D.some(z=>z.a+" ⇢ "+z.b==d[0])),o()))}
 /* 3) operaciones, de a 6 */
 {const n=Math.ceil(O.length/6),sz=Math.ceil(O.length/n),fnd=LL.find(x=>x.L.op=="find");
  for(let k=0;k<n;k++){const ch=O.slice(k*sz,k*sz+sz),dis=[];
   ch.filter(x=>x.from&&x.from!=x.c).slice(0,2).forEach(x=>dis.push([x.from+" :: "+x.op+x.pa,"«"+x.op+"» la MANDA «"+x.from+"», pero la recibe «"+x.c+"»: la operación se declara en la clase del receptor ("+x.ref+")."]));
   if(fnd&&!k)dis.push([fnd.cls(fnd.L.to)+" :: find"+fnd.L.pa,"find, next, add y remove son operaciones de la colección (ya vienen dadas): no se declaran en la clase."]);
   cards.push(kSet(G+" · operaciones"+(n>1?" "+(k+1)+"/"+n:""),"DCD · operaciones","¿Qué operaciones se declaran, y en qué clase?",ch.map(x=>({t:x.t,w:"La recibe «"+x.c+"»: "+x.ref+"."})),dis.filter(d=>!O.some(z=>z.t==d[0])),o()))}}
 kChain(G,[{id:"dcd",cards}],{req:X.gs.map(g=>P4EX[g].last)})});

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
Si confirma, el sistema registra la reserva con estado confirmada.`}};
Object.values(P1L).forEach(L=>{L.S={};let n=0;L.P=L.R.split("\n\n").map(p=>p.split("\n").map(s=>{const k="a"+(++n);L.S[k]=s;return k}));L.Uk=L.U.split("\n").map((s,i)=>(L.S["u"+i]=s,"u"+i))});
