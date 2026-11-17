# Notas de trabajo (16/11): aplicar el método a los demás temas de los exámenes

Pedido de Luca (16/11): "aplicar el método a los demás ejercicios/temas de los exámenes adjuntos e incluirlos en el flujo de la página".
Estructura de los 3 exámenes (Feb26, Jul26, Parcial 2026): P1a Modelo de Dominio + restricciones · P1b DSS de un caso de uso · P2a comunicación (HECHO) · P2b DCD · P3 C++ (.h y .cpp).
Soluciones oficiales adjuntas: Feb26 y Jul26 (el Parcial NO tiene solución de P1; P3 de los tres ya está en js/codigo-datos.js).
Cobertura previa en Principal: 6 series binarias "Parcial P1a/P1b …" (área mod) y 5 "Parcial P3 …" (área cod); pestaña Código = P3 línea a línea.
Plan (orden): 1) motor genérico + DCD (derivado de las líneas) 2) DSS 3) MD 4) P3 en Principal. Commit por tema.

## Feb26 P1a (solución oficial, leída de la imagen)
Enumerados: Rol{Administrativo,Gerente} TipoAccion{Revisión,CargaDeDatos,Inspección} FormatoEvidencia{PDF,Imagen,Ninguno} NivelSeguridad{Bajo,Medio,Alto}
Proceso(nombre:String, codigo:String, descripcion:String)
«Abstracta» Paso(descripcion:String, rolRequerido:Rol) ◁ TareaManual(accion:TipoAccion, evidencia:FormatoEvidencia), FirmaDigital(seguridad:NivelSeguridad, fechaFirma:Date)
Usuario(nombre:String, mail:String, rol:Rol) · Certificado(autoridad:String, fechaEmision:Date, fechaVencimiento:Date, nivel:NivelSeguridad, vigente:Boolean) · Expediente(fechaCreacion:Date, estado:Boolean)
Proceso 1 —contiene {ordered}— 1..* Paso · Proceso 1 —instancia de— * Expediente · Usuario 1 — * Certificado
Asignacion = clase de asociación de Expediente * — 1..* Paso · Asignacion * — 1 Usuario
Restricciones: (1) código de proceso y email de usuario únicos (2) un usuario muchos certificados, solo uno vigente (3) para toda Asignación, rol del usuario = rolRequerido del paso
(4) si el paso es FirmaDigital, el usuario debe tener certificado vigente con el nivel mínimo requerido (5) para toda Asignación, el Paso debe pertenecer a los pasos del Proceso del Expediente.

## Feb26 P1b DSS (oficial)
Actor Admin, :Sistema. iniciarExpediente(codProceso: String) [nota: recuerda el proceso]
loop [Para cada paso del Proceso sin asignar]: datosDelPaso(): DTUsuariosDisponibles · asignacionUsuario(email: string): DTAsignacion · confirmarAsignacion() [nota: recuerda la asociación entre el paso y el usuario]
alt [confirma]: confirmar(estado: Boolean) [libera la memoria] / cancela() [libera la memoria]
DT: DTUsuario{nombre,mail,rol:Rol} DTAsignacion{usu:DTUsuario,paso:DTPaso} DTPaso{descripcion} ◁ DTTareaManual{accion,evidencia} DTFirmaDigital{seguridad,fechaFirma} DTUsuariosDisponibles{usu:Set(DTUsuario),paso:DTPaso}

## Feb26 P2b DCD (oficial)
«singleton» Controlador(-instance) +iniciarMisionAplicacion(...):bool +calcularHerbicidaTotal(...):float +getIdUnica():string · Controlador→Campo*
Campo(idCampo) +obtenerParcela(nroParcela:int):Parcela · Campo ◆— * Parcela · Robot(cantHerbicida,idRobot) +getId() · Robot→Campo* (dibujada, no usada en diagramas)
Parcela(tamaño) +calcularHerbicidaTotal(...) +buscarMapeoPrevio(fecha):Mapeo · Parcela→RobotParcela* · RobotParcela→Robot(1) · RobotParcela→Mision*
RobotParcela +calcularHerbicidaTotal +buscarMapeoPrevio +getIdRobot +iniciarMision(mapeo,fecha) · Mision(id_mision,finalizada,fecha) +getHerbicidaAplicado +getFinalizada +getFecha ◁ Aplicacion(litrosAplicados), Mapeo(metrosCubiertos)
Dependencia punteada: Mision ⇢ Controlador (por getInstance/getIdUnica). (No dibuja las dependencias por local/parámetro.)

## Jul26 P1a (oficial)
«DataType» DTFecha{día,mes,año:int} DTHora{horas,minutos:int} · «Enum» EstadoReserva{Confirmada,Pendiente,Cancelada} Sonido{Basico,Intermedio,Profesional}
Centro(codigo:String,nombre:String,direccion:String) ◆1— * Espacio(numero:int,nombre:string,capacidad:Int,precio:Float) ◁ Auditorio(escenario:Bool,sonido:Sonido) SalaReuniones(videoconferencia:Bool,pizarrones:Int) OficinaPrivada(cantidadEscritorios:Int,bañoPrivado:Bool)
Equipamento(codigo:int,descripcion:string,disponibles:Int,precio:Float) · Centro 1 — * Equipamento · Espacio * — * Equipamento con clase de asociación EquipamentoEnEspacio(cantidadMaxima:Int,requiereAsistencia:Bool)
Reserva(fecha:DTFecha,horaInicial:DTHora,duracion:Int,asistentes:Int,precioTotal:Float,estado:EstadoReserva) · Espacio 1 — * Reserva · Reserva * — * Equipamento con clase de asociación EquipamentoEnReserva(cantidad:Int) · Reserva * — 1 Cliente(email,nombre,telefono:String)
Restricciones: Unicidad: código de Centro único; email de Cliente único; número de Espacio único dentro del Centro; código de Equipamiento único dentro del Centro.
Integridad circular: un Equipamiento solo habilitado para un Espacio si ambos son del mismo Centro; si una Reserva incluye un Equipamiento, debe estar habilitado para el Espacio de la Reserva.
Atributo calculado: precioTotal = duración * (precio espacio + Σ precio equipamiento_i * cant_i).
Reglas de negocio: asistentes ≤ capacidad del Espacio; no dos reservas pendientes/confirmadas superpuestas para un Espacio; cantidadMaxima de EquipamientoEnEspacio ≤ disponibles del Equipamiento; cantidad solicitada ≤ cantidad máxima en el Espacio y ≤ disponible en el horario.

## Jul26 P1b DSS (oficial)
Actor Cliente, :Sistema. BuscarCentro(email: string, fecha: DTFecha, hora: DTHora, duracion: int, cantAsistentes: int): Set(DTCentro) [recuerda los datos de la reserva y el email del cliente]
SeleccionarCentro(codigo: string): Set(DTEspacio) [recuerda el código del centro] · SeleccionarEspacio(numero: int): Set(DTEquipamento) [recuerda el número del espacio]
loop [Quiere agregar otro equipamento]: AñadirEquipamento(codigo: string, cant: int): float [recuerda los datos del equipamento]
alt [Quiere confirmar]: Confirmar() [Se da de alta la reserva y se libera la memoria] / [Quiere cancelar]: Cancelar() [se libera la memoria]
DT: DTCentro{codigo,nombre,direccion:string} DTEspacio{numero:int,nombre,tipo:TipoCentro,capacidad:int,precio:float} «enum» TipoCentro{Auditorio,SalaReuniones,OficinaPrivada} DTEquipamento{codigo:int,descripcion,precio:float,cantDisp:int,cantMax,asistencia:bool}

## Jul26 P2b DCD (oficial)
Controlador +bajaMascota(nickname,nombreMascota) +reservarHospedaje(...):bool · Controlador→Usuario* · «Abstract» Usuario(nickname,nombre) ◁ Dueño(telefono) +getMascota(nombreMascota) +bajaMascota(nombreMascota); Cuidador(descripcion) +reservar(codigo,m,fecha)
Dueño→Mascota* · Cuidador→Hospedaje* · Mascota(nombre,tipo:TipoMascota) +eliminarReservas() +nuevaReserva(r) · Mascota 1 — * Reserva · Reserva * — 1 Hospedaje
«Abstract» Hospedaje(codigo,direccion) +reservar(m,fecha):bool +eliminarReserva(r) ◁ Casa +reservar; Hotel(cupo) +reservar · Reserva(fecha:DTFecha) eliminarLink()
Dependencias punteadas hacia Mascota desde: Controlador, Cuidador y Hospedaje (la conocen por local/parámetro).

## Estado al 16/11 14:35
HECHO y subido: motor genérico de tarjetas «kit» (nucleo.js: c.kq/c.kp/c.kv/c.ko/c.ar; js/examen.js: kSet, kSeq, kChain) y cadena DCD (P2b) de los 3 exámenes.
HECHO y subido (16/11 15:30): DSS (P1b) de Feb26 (11 tarjetas) y Jul26 (10), datos en DSSX (js/examen.js). Cadena: mensajes → fragmentos → cada mensaje (parámetros, retorno, nota de memoria; confirmar y cancelar juntos) → un DataType por tarjeta. Cada tarjeta es su propia unidad; área «mod» (filtro P1).
Decisiones DSS: los nombres oficiales nunca se piden; la nota de memoria se pide solo donde la oficial la tiene; una ficha equivocada resalta su propia frase (nucleo.js usa t.hl).
DSS probado con jsdom en las dos cadenas: cada ficha equivocada a propósito (razón, resaltado, sin token), «No sé», conjuntos en orden inverso, cadena limpia de punta a punta y disponibilidad al empezar. Falta verlo en el navegador.
Dudas del DSS para confirmar con la imagen oficial: (1) Feb26: la nota «recuerda la asociación entre el paso y el usuario» se puso en confirmarAsignacion (como dicen estas notas); la serie binaria vieja de js/prog4.js la pone en asignacionUsuario. (2) Jul26: la oficial escribe AñadirEquipamento(codigo: string…) pero DTEquipamento.codigo: int; se dejó tal cual. (3) Feb26: DTPaso oficial lleva solo descripcion (sin el rol).

## Estado al 16/11 16:10 — plan completo (Luca, 15:40: «tomá vos las decisiones para que yo pueda aprender a resolver los exámenes practicando»)
HECHO y subido, todo en Principal:
- Modelo de dominio (P1a) de Feb26 (5 tarjetas) y Jul26 (6), datos en MDX (js/examen.js): clases → tipos (jerarquías, enumerados, DataTypes) → atributos → asociaciones → restricciones. Área «mod» (filtro P1).
- Problema 3 en Principal (final de js/codigo.js: kCode, P3M, P3X): Feb26 15 tarjetas, Jul26 14, Parcial 2026 13. Por examen: «el diseño» (a mano: patrón, qué se pide) → .h de cada clase (se elige la línea donde hay una regla) → cada operación del .cpp con fichas de línea entera. Las líneas equivocadas salen de reglas (P3M) y, las que dependen de la letra, de P3X.hx. Área «cod» (filtro P3). La pestaña Código sigue igual (escritura ficha por ficha).
- Teórico de patrones e implementación (material de Luca): 8 series binarias «Parcial P3 · …» al final de js/codigo.js (del DCD al código, del diagrama al método, qué es un patrón, qué problema resuelve cada uno, Singleton, Composite, State, Observer).
Decisiones: en todas las cadenas nuevas cada tarjeta es su propia unidad (pide la anterior sin errores). Solo se piden decisiones que salen de la letra; donde la oficial elige algo que la letra no fija, no hay ficha equivocada. En el .cpp dos líneas seguidas e independientes valen en cualquier orden.
Probado con jsdom en todas las cadenas (DSS, modelo de dominio, P3 y, como regresión, DCD): cada ficha equivocada a propósito, «No sé», orden inverso donde el orden es libre, cadena limpia de punta a punta, disponibilidad al empezar; se revisó a ojo la lista completa de líneas equivocadas del P3. Las series del teórico: se dibuja cada paso. Falta verlo en el navegador.
Dudas para confirmar con las imágenes oficiales: las tres del DSS (arriba) y, en el modelo de dominio de Jul26, Centro 1 ◆— 1..* Espacio (la letra dice «uno o más espacios»; estas notas transcriben * del lado de Espacio).
PENDIENTE: nada del plan original. Ideas: tarjeta «¿Qué falta?» (revisar el diagrama contra la letra), P1 del Parcial 2026 si aparece la solución oficial, y más exámenes viejos (receta: una entrada en DSSX / MDX / P3X).
DCD probado solo con simulación jsdom (cadena completa en orden canónico); falta probar errores a propósito y verlo en el navegador.

## Letra del Problema 1 (Feb26 y Jul26) — 16/11 15:20
Transcripta tal cual en js/examen.js (const P1L: presentación, descripción de la realidad y caso de uso, una frase por línea; verificada palabra por palabra contra los PDF de la letra).
Frases: a1… = realidad (Feb26 a1–a23, Jul26 a1–a19), u0… = caso de uso (Feb26 u0–u5, Jul26 u0–u10). Sirve para el DSS (P1b) y para el modelo de dominio (P1a): no hace falta volver a los PDF.
Ojo letra Jul26: u9 dice «el recepcionista» pero el actor del caso de uso es el Cliente (la solución oficial usa Cliente).

## Filtros por tema (16/11 16:40, pedido de Luca)
Principal tiene un filtro por tema (nucleo.js: tema(c)): Modelo de dominio (1a), DSS (1b), Comunicación (2a), DCD (2b), Código C++ (P3), Teórico (series con teo:1), Lógica. Las series binarias viejas «Parcial P1a/P1b» van con 1a y 1b. Si el filtro elegido no tiene nada disponible (DCD sin sus diagramas aprobados) se entra igual por el comienzo de cada cadena del tema.

## Teoría dentro de cada tema, como previa (16/11 17:25, pedido de Luca)
No hay filtro «Teórico»: las series binarias de teoría van dentro del filtro de su tema (c.tm) y son la introducción obligatoria: cada cadena pide completar sin errores las series de su tema (KIN en js/examen.js para 1a, 1b y 2b; P3I + P3X.pre en js/codigo.js para P3). Series nuevas con ejemplos neutros: «Modelo de dominio · qué es cada cosa», «… · qué restricciones se escriben», «DSS · mensajes, parámetros y retornos», «DSS · memoria y fragmentos», «DCD · de los diagramas de comunicación al DCD».
Ocultas por obsoletas (hid; adelantaban respuestas que ahora se deciden en las cadenas): las 6 «Parcial P1a/P1b · …» y «Parcial P3 · Herencia y constructores» y «… · Controlador: de datos a objetos». State, Observer y las dos de patrones en general quedan en P3 sin ser previa.
Probado con jsdom: con progreso vacío cada filtro muestra solo su introducción; al completarla aparecen las cadenas; las cadenas siguen pasando.

## Parcial 2026 · Problema 1 (16/11 17:55)
Luca trajo la letra y la solución oficial (leída de las imágenes, páginas 1 y 2). Letra transcripta y verificada en P1L["Parcial 2026"] (a1–a19, u0–u8).
Oficial 1a: «Abstracta» Empleado(ci:Int, nombr, fechaIngreso:Date) ◁ Mecanico(esp:Especialidad), Conductor(licencia:Categoria) · Enums Especialidad{electrica,general} Categoria{A,B,C} Estado{Programado,EnCurso,Finalizado} · Conductor * —habilitado— * Ciudad(nombre,ubicacion) · Ciudad 1 — * Estacion(nombre) · Estacion * — * Ruta(codigo,nombre) {order} con clase de asociación EstacionEnRuta(empresa,costoEmision) · «Abstracta» Tren(matricula,fabricacion:Int) ◁ Pasajeros(maxPersonas,servicios:Bool), Carga(maxCarga:Float,peligrosa:Bool) · Mecanico * — * Tren con clase de asociación MecanicoTren; MecanicoTren 1 — * Revision(fecha,detalle,res:Bool) · Viaje(codigoV,fechaSalida:Date,estado:Estado); Conductor 1 — * Viaje; Tren 1 — * Viaje; Ruta 1 — * Viaje. Restricciones: unicidad de CI, matricula, codigo y codigoV; integridad circular (ciudades de las estaciones de la ruta del viaje ⊆ ciudades habilitadas del conductor).
Oficial 1b: loop [Quiere agregar otro viaje] { IngresarRuta(cod:String): Set(DTTren) [recuerda la ruta] · SeleccionarTren(mat:String): Set(DTConductor) [recuerda el tren] · IngresarDatos(ci:Int, fechaS:Date): DTResumenViaje [recuerda los datos del viaje] · alt [Quiere confirmar] Confirmar() [da de alta el viaje y libera mem] / [Quiere cancelar] Cancelar() [libera mem] } · DTTren{matricula,tipo:String} DTConductor{ci:Int,nombr} DTResumenViaje{codigoRuta,nombreRuta,matricula,nombre,fechaSalida:Date,codigo}.
Hecho: cadena DSS (9 tarjetas) y modelo de dominio (5) del Parcial; el DSS en texto ahora admite fragmentos anidados. Con esto los tres exámenes tienen los cinco temas.

## Lógica: exámenes completos (16/11 18:25, pedido de Luca)
Luca trajo los exámenes de Lógica de febrero y julio de 2026 con su propuesta de solución (leídos enteros como texto). La deducción natural (Ej. 3) ya estaba como árboles; el resto quedó en js/logica-examen.js (nuevo archivo, cargado después de codigo.js), con lgEx(G, tema, previas, letra, tarjetas) y tres formatos: set, seq y cad (cadena de pasos «justificación + lo que queda», orden fijo).
Cadenas: Feb26 Ej. 1 inducción sobre listas (6 tarjetas) · Jul26 Ej. 1 inducción sobre PROP′ (7) · Feb26 Ej. 2 semántica (4) · Feb26 Ej. 4 modelos, Th, Cons (5) · Jul26 Ej. 2 equivalencias, modelo y consecuencia (4) · Jul26 Ej. 4 consistencia, maximal y completo (4).
Filtros de Lógica (c.tm): lg1 inducción, lg2 semántica, lg3 deducción, lg4 modelos y consistencia, más «Lógica (todo)». Introducciones nuevas: «Inducción · conjuntos inductivos y PIP» y «Consistencia · definiciones»; las series genéricas de Semántica y Modelos que ya existían son previas de sus cadenas. Ocultas (hid): «Semántica · Feb 2026 2a–2d» y «Modelos · Feb 2026 4a–4c»; «Semántica · Variantes» ahora pide la cadena de Feb26 Ej. 2.
Notas: en Feb26 Ej. 1 la solución oficial escribe mergeOrd/insertOrd; se usaron los nombres de la letra (merge, insOrd). En Jul26 Ej. 4 d, ¬p0 también serviría como ψ: no se puso como ficha equivocada.
Probado con jsdom: las 6 cadenas (errores a propósito, «No sé», cadena limpia, previas) y los filtros. Falta navegador.

## Pestañas (16/11 18:10, pedido de Luca)
Ocultas por redundantes con los filtros de Principal (atributo hidden en index.html; el código sigue): «Ejercicios Prog4» (t1) y «Bloques» (t6). Quedan: Principal, Básico (teoría de comunicación con progreso propio, no está en Principal), Código (escritura del P3 ficha por ficha), Oído y Errores.

## Paquetes por ejercicio (16/11 18:35, pedido de Luca)
Las cadenas nuevas quedaban «sueltas» (cada tarjeta era su propia unidad). Ahora van como los diagramas de comunicación: las tarjetas de un ejercicio salen seguidas y en orden aunque haya errores; el paquete se aprueba sin errores y, si no, vuelve entero. Lógica: un paquete por ejercicio (token m:<G>:ej). Modelo de dominio: un paquete (md). DSS: dos (dss = mensajes, fragmentos y cada mensaje; dt = DataTypes). P3: «el diseño» y un paquete por clase (bloques seguidos de la misma clase). DCD ya era un paquete. Cambiaron los nombres de los tokens: el progreso de estas cadenas (creadas hoy) arranca de nuevo.

## Cuándo vuelve un paquete (16/11 18:50, pedido de Luca)
nucleo.js: (1) lo nunca visto va SIEMPRE antes que lo ya visto (antes se sorteaba entre los 3 primeros y un paquete fallado podía adelantarse); (2) las tarjetas kit con error ya no vuelven sueltas a las 8 respuestas: el paquete vuelve entero; (3) ningún paquete terminado, aprobado o no, se repite antes de PKN = 15 respuestas (PKF), salvo que no haya otra cosa. Al sumar exámenes nuevos, sus paquetes salen antes que repetir los viejos.

## Aprobar paquetes sin pasada perfecta (16/11 19:05, pedido de Luca con su exportación de errores)
Estadística 14–16/11: 28/89 (31%); 14/11 14%, 15/11 7%, 16/11 64% (Principal 89%). Casi todos los fallos: «Patrón · Crear y registrar» y «Patrón · Recorrer»; 22 «No sé» (8 en la numeración 3.2.1 y 8 en el constructor de Paquete en la pestaña Código).
Cambio en nucleo.js (S2.kok): cada tarjeta kit acertada sin errores queda hecha; el paquete fallado vuelve solo con las tarjetas que faltan y se aprueba cuando todas quedaron hechas. Un paquete a medias pesa más al elegir. Aprobado, si vuelve, vuelve entero.
Teoría sumada por sus «No sé»: ejemplo de integridad circular (th del paso) y serie «Parcial P3 · Constructores y destructores» (previa de las cadenas de P3).
Pendiente (defecto de tarjeta, js/prog4.js): en «Patrón · Crear y registrar» el alta se manda a A y no a B de forma arbitraria (nota de Luca: «¿por qué a A y no a B?»): debería aceptar las dos o explicar el criterio.

## Revisión general: paquetes y «No sé» (16/11 22:30, pedido de Luca)
Revisado tema por tema y corregido:
- «No sé» en TODAS las tarjetas kit (86+30): muestra la respuesta, su porqué y la teoría de esa acción (c.th): DCD (3 textos), DSS (DTH: mensajes, fragmentos, mensaje, DataType), modelo de dominio (MTH: clases, tipos, atributos, asociaciones, restricciones), P3 (P3T: diseño, .h, .cpp, static) y Lógica (LTH: inducción, semántica, modelos, consistencia). En el .cpp de P3 cada línea trae además su regla.
- Series binarias: si el paso no tiene teoría propia, «No sé» muestra la de la serie (antes solo el primer paso).
- Comunicación (2a): «Traducí la letra» y «Desarmá el mensaje» no mostraban teoría con «No sé»; ahora sí (KTH en nucleo.js). Las líneas y los árboles de deducción ya la tenían.
- P3 mal formado: los paquetes seguían el orden de la solución (todos los .h y después los .cpp) y quedaban paquetes de una sola tarjeta. Ahora va clase por clase, de la menos acoplada a la más acoplada (P3X.ord), cada clase con su .h y sus operaciones juntas. Cambian los tokens de P3: su progreso arranca de nuevo.
- Sin cambios porque ya estaban bien formados: modelo de dominio (1 paquete), DSS (2), DCD (1), Lógica (1 por ejercicio), tramos de comunicación.
No revisado: pestaña Código (escritura ficha por ficha) y Oído.

## DCD rehecho con fichas (16/11 23:55)
Luca (23:44): lo nuevo «no se parece al trabajo de fichas estilo Duolingo»: quería un sistema como el de los diagramas de comunicación o los árboles, donde CON FICHAS SE VA ARMANDO el diagrama; el DCD tenía pocas tarjetas y no resolvía un ejercicio. Las tarjetas «elegí todas las correctas» (kSet) y de respuesta entera (kSeq con frases) NO son el formato pedido.
DCD rehecho como piloto: se recorre cada diagrama mensaje por mensaje y, en cada mensaje que agrega algo, se arma con fichas chicas la relación (clase de origen, → o ⇢, clase de destino, * o 1) y la operación (clase :: operación). Un paquete por diagrama: Parcial 13 tarjetas, Jul26 15, Feb26 15. Cada casillero explica su regla.
PENDIENTE, mismo criterio (fichas que arman el artefacto, paso por paso): modelo de dominio, DSS, P3 en Principal y Lógica (inducción, semántica, modelos). Esperando que Luca valide el piloto.

## Diagramas con fichas (17/11 00:10)
Luca: «cada tema que se basa en armar diagramas debe hacerse con el sistema de fichas correspondiente». Hecho, con el armador kTok (js/examen.js: texto puesto, casilleros en orden y grupos de fichas en cualquier orden):
- DCD: mensaje por mensaje (relación y operación con fichas). 43 tarjetas.
- Modelo de dominio: clases (conjunto de nombres) → cada clase (hereda / subclases / abstracta y sus atributos ficha por ficha) → cada asociación (la otra clase, multiplicidad de cada lado, orden, clase de asociación) → restricciones (frases, se eligen). Feb26 14 tarjetas, Jul26 17, Parcial 21. Sale todo de los datos MDX que ya estaban. * y 1..* no se enfrentan como error.
- DSS: cada tarjeta arma la línea que sigue: fragmento (abre / sigue / cierra, con su guarda) → qué hace el actor → parámetros ficha por ficha → retorno → nota. Se eliminaron las tarjetas «mensajes» y «fragmentos». Después, los DataTypes atributo por atributo. Feb26 10, Jul26 9, Parcial 8.
Siguen con el formato anterior porque no son diagramas: P3 en Principal (líneas de código) y Lógica (pruebas). Tokens nuevos (md2, dss3): el progreso de 1a y 1b arranca de nuevo.
