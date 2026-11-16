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
PENDIENTE (diseño ya pensado, sin código): DSS (P1b) y Modelo de dominio (P1a) de Feb26 y Jul26 en js/examen.js; P3 C++ en Principal desde js/codigo-datos.js.
DCD probado solo con simulación jsdom (cadena completa en orden canónico); falta probar errores a propósito y verlo en el navegador.
