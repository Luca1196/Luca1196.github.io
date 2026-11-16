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
   x:[["cantSolicitada: int","Eso lo ingresa el cliente después (es un parámetro de AñadirEquipamento): no es un dato que el Sistema muestre.","u6"],["espacio: DTEspacio","El espacio ya se eligió: la letra no pide volver a mostrarlo."]]}]}];
window.DSSD={};
DSSX.forEach(X=>{const L=P1L[X.id],M=X.M,N=M.length,G=X.id+" · DSS",hl=h=>h?"S:"+h:undefined,dz=a=>(a||[]).map(d=>[d[0],d[1],hl(d[2])]),
 ln=m=>m.op+"("+(typeof m.pa=="string"?m.pa:m.pa[0]).replace("sin parámetros","")+")"+(m.rt&&m.rt[0]!="nada"?": "+m.rt[0].replace(/ \(.*\)$/,""):""),
 /* el DSS en texto: los primeros k mensajes completos y el resto solo con lo decidido en «mensajes»; fr = ya se eligieron los fragmentos */
 dss=(k,fr)=>M.map((m,i)=>{const f=fr&&X.fr.find(f=>i>=f.a&&i<=f.b),h=!f?"":i==f.a?`<div><b>${f.k} [${esc(f.k=="alt"?f.g[0]:f.g)}]</b></div>`:f.k=="alt"&&i==f.b?`<div><b>[${esc(f.g[1])}]</b></div>`:"";
  return h+`<div style="padding-left:${f?14:0}px">${i+1}. ${esc(i<k?ln(m):m.op+" — "+m.d)}${i<k&&m.mem?` <span class="mut">· nota: ${esc(m.mem[0])}</span>`:""}</div>`}).join(""),
 /* contexto: lo que se pide + el caso de uso (frases resaltables) + la realidad plegada + el DSS ya decidido (st: 0 no se muestra, 1 abierto, 2 plegado) */
 o=(k,fr,st)=>({ctx:X.id+" · Problema 1 b) DSS",ar:"mod",kv:b=>{const hs=kHs(b);return`<div class="lt"><b>${esc(X.id)} · Problema 1</b> ${esc(P1P.b)}</div><div class="lt"><b>Caso de uso:</b> ${esc(L.cu)} · <b>Actor:</b> ${esc(L.act)}</div>`+kSent(L.S,L.Uk,hs)+
  kFold("Descripción de la realidad",`<div class="lt">${esc(L.i)}</div>`+L.P.map(p=>kSent(L.S,p,hs)).join("<br>"),hs.some(h=>h[0]=="a"))+(st?kFold("Tu DSS hasta ahora",dss(k,fr),st<2):"")}}),U=[];
 /* 1) qué mensajes hay */
 U.push({id:"msj",cards:[kSet(G+" · mensajes","DSS · mensajes","Leé el caso de uso: ¿qué le da o le pide el actor al Sistema? Cada cosa es un mensaje.",M.map(m=>({t:m.d,w:m.w||"El actor le da un dato al Sistema o le comunica una decisión: es un mensaje.",hl:hl(m.hl)})),dz(X.ev),o(0,0,0))]});
 /* 2) fragmentos */
 U.push({id:"frag",cards:[kSet(G+" · fragmentos","DSS · fragmentos","¿Qué fragmentos hacen falta y qué mensajes encierra cada uno?",X.fr.map(f=>({t:f.k=="alt"?`alt [${f.g[0]}]: ${f.a+1} / [${f.g[1]}]: ${f.b+1}`:`${f.k} [${f.g}]: mensaje${f.a==f.b?" "+(f.a+1):"s "+(f.a+1)+" a "+(f.b+1)}`,w:f.w,hl:hl(f.hl)})),dz(X.fd),o(0,0,1))]});
 /* 3) cada mensaje: parámetros → retorno → nota de memoria (los j:1 comparten tarjeta con el anterior) */
 for(let i=0;i<N;){let j=i+1;while(j<N&&M[j].j)j++;const gr=M.slice(i,j),mu=gr.length>1,sl=[],dis=[],ps=[];let n=0;
  const slot=(m,a,k,h)=>{n++;if(!ps.includes(k))ps.push(k);sl.push({t:a[0],w:a[1],sn:DSN[k]+(mu?" de "+m.op:""),own:1,hl:hl(h||m.hl)});
   a.slice(2).concat(k<2?[]:[["sin nota",DSW[m.fin?1:0]]].concat(m.fin?[]:[["libera la memoria",DSW[2]]])).forEach(d=>{const e=dis.find(z=>z[0]==d[0]);if(e)e[2]=undefined;else dis.push([d[0],d[1],n,hl(d[2])])})};
  gr.forEach((m,q)=>{if(q)sl.push("\n");if(typeof m.pa=="string")sl.push(m.op+"("+m.pa+")");else{sl.push(m.op+"(");slot(m,m.pa,0,m.ph);sl.push(")")}
   if(m.rt){sl.push("devuelve");slot(m,m.rt,1,m.rh)}if(m.mem){sl.push("\n","nota:");slot(m,m.mem,2,m.mh)}});
  const pq=ps.sort().map(k=>["qué datos lleva","qué devuelve","qué tiene que recordar el Sistema"][k]);
  U.push({id:"m"+(i+1),cards:[kSeq(G+" · "+gr.map(m=>m.op).join(" y "),"DSS · mensaje"+(mu?"s "+(i+1)+" y "+j:" "+(i+1)),"Completá "+(mu?"los mensajes":"el mensaje")+": ¿"+(pq.length>1?pq.slice(0,-1).join(", ")+" y "+pq[pq.length-1]:pq[0])+"?",sl,dis,
   Object.assign(o(i,1,1),{ko:"Orden: "+ps.map(k=>["parámetros","lo que devuelve","nota de memoria"][k]).join(" → ")+(mu?", mensaje por mensaje.":".")}))]});i=j}
 /* 4) DataTypes */
 (X.DT||[]).forEach((d,q)=>U.push({id:"dt"+(q+1),cards:[kSet(G+" · "+d.n,"DSS · DataType","¿Qué lleva "+d.n+" ("+d.d+")?",d.at.map(t=>({t,w:d.w,hl:hl(d.hl)})),dz(d.x),o(N,1,2))]}));
 kChain(G,U);window.DSSD[X.id]=U});
