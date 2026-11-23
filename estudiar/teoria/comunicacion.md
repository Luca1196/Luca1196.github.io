# Diagramas de comunicación

Teórico de Programación 4 · cómo se arma y se escribe un diagrama de comunicación.

## De la letra a los mensajes
<!-- re: objetivo|traduc|desarm|tramo -->

Traducir la letra: cada objetivo dice QUÉ necesita el sistema, y sale de la firma, las precondiciones y las poscondiciones: qué objetos hay que obtener (a partir de los datos que llegan) y qué hay que hacer con ellos (crear, vincular, eliminar, calcular). No son objetivos verificar una precondición (se asume cumplida) ni lo que resuelve otra operación.

Desarmar el tramo: quién le pide qué a quién. El Controlador hace directo solo lo que alcanza (buscar en sus colecciones); el resto se lo pide, con una operación propia, al objeto que tiene la información, y ese objeto sigue con los suyos. Crear (create) lo hace quien va a quedar vinculado al objeto nuevo; agregar o quitar de una colección (add, remove) lo hace el dueño de esa colección.

## Guardar el resultado
<!-- re: (?!) -->

Si el mensaje devuelve algo que después usás, la línea se escribe: número: emisor → receptor : variable := operación(parámetros). La variable y el := van ANTES del nombre de la operación (2: :Controlador → :Empresa * : emp := find(rut)).

El nombre de la variable es el que después aparece en «Tengo» (emp, m, f…). Si no usás el retorno, no hay variable ni :=.

Si vas a usar después lo que devuelve un mensaje, se guarda con nombre := mensaje(…) (cd := cuposDisponibles(cod)). Ese nombre queda como local para los mensajes siguientes.

Si no usás el retorno, no se escribe :=.

## Numeración de mensajes
<!-- re: (?!) -->

Los mensajes del que ejecuta la operación (el Controlador, o el objeto de una operación de clase) son 1, 2, 3… Lo que envía un objeto mientras ejecuta el mensaje 2.2 es 2.2.1, 2.2.2…; dentro de un recorrido 2.2.2* los hijos conservan el *: 2.2.2.1*.

Para saber el número: ¿quién envía? ¿qué mensaje está ejecutando ese objeto en este momento? El número es el de ese mensaje más un nivel. Ej.: u ejecuta 2 (bajaMascota) → sus mensajes son 2.1, 2.2…; m ejecuta 2.2 → sus mensajes son 2.2.1, 2.2.2…

Los mensajes de quien recibe la operación (el Controlador, o el objeto que ejecuta una operación de clase) se numeran 1, 2, 3…

Si un objeto recibe el mensaje 3 y, para resolverlo, envía otros, esos son 3.1, 3.2…; los que dispara el 3.1 son 3.1.1, y así.

El número depende de QUIÉN envía y de qué mensaje está ejecutando, no de dónde salió el receptor. Dentro de un recorrido (*), los mensajes hijos conservan el *. Una condición [ ] no cambia el número.

## Notación de objetos
<!-- re: (?!) -->

El emisor es quien ejecuta el mensaje del que cuelga este (está en «Tengo» como «x ejecuta …»).

Si el receptor ya apareció antes (está en «Tengo»), se escribe solo su nombre (m, r, p): sin «:» ni clase. La primera vez, nombre:Clase (r:Reserva) o :Clase si es anónimo; una colección, :Clase *.

Cada caja es un objeto: nombre:Clase. La primera vez que aparece se escribe completo (emp:Empresa); después alcanza con el nombre (emp).

Sin nombre igual llevan dos puntos (:Empresa). Una colección se escribe :Clase * (recuadro doble). Escribir «Empresa» sin dos puntos nombra la clase, no un objeto.

## Enlaces (links)
<!-- re: setA|[Ee]nlace|dos sentidos -->

Crear un link de A hacia B: A guarda a B. Si A tiene una colección de B: add(b) a la colección. Si guarda una sola: setB(b).

Si la asociación es navegable en los dos sentidos, hay que crear los dos links: cada objeto guarda su referencia (b se manda setA(a) a sí mismo, a agrega b a su colección).

## Parámetros de un mensaje
<!-- re: [Pp]arámetro|paréntesis|[Pp]aso el objeto|clave|[Ll]e paso -->

Entre paréntesis va lo que el receptor necesita y no tiene: datos de la firma, objetos obtenidos antes o claves para buscar.

El receptor nunca va como parámetro. Si el receptor ya conoce algo (por un link), no se lo pasás.

find recibe la clave (find(ci)); las operaciones del dominio reciben lo que dice su firma en el dominio.

## Responsabilidades (Experto)
<!-- re: [Rr]esponsab|cambia el estado|[Qq]uién (cambia|calcula|compara)|[Ee]xperto -->

Cada operación la hace el objeto que tiene la información para hacerla: el estado de una postulación lo cambia la postulación; el cupo lo sabe la oferta.

Por eso el Controlador no compara ni calcula con datos ajenos: le pide al dueño del dato que lo haga (encapsulamiento).

## Borrado: links e instancias
<!-- re: remove|destroy|link|NULL|[Bb]orr|desengan -->

Un link es la referencia que un objeto guarda de otro: en una colección (:B *) o en un atributo de referencia única. La instancia es el objeto mismo.

Cortar un link: remove(id) a la colección, o setX(NULL) si la referencia es única. El objeto sigue existiendo.

Eliminar la instancia: destroy() al objeto. Antes hay que sacarlo de todas las colecciones que lo apuntan; si no, quedan referencias a algo que ya no existe. Normalmente destruye quien lo creó.

## Estereotipos de visibilidad
<!-- re: «parameter»|«local»|«association»|«global»|[Ee]stereotipo -->

El estereotipo dice CÓMO conoce el emisor al receptor, no qué hace el mensaje.

«parameter»: el receptor llegó por la firma de la operación que el emisor está ejecutando.

«local»: el receptor es el resultado de un mensaje anterior en esta misma operación (find, create, next…).

«association»: el emisor llega al receptor por una flecha del diagrama de clases (típicamente una colección :X *).

«global»: objeto accesible desde cualquier lado (singleton). No sustituye un camino que falta.

## Operaciones genéricas y del dominio
<!-- re: genérica|del dominio|find|create|add\( -->

Las genéricas (find, next, add, remove, create, destroy) se usan sobre colecciones u objetos a los que el emisor llega DIRECTO por una flecha del diagrama de clases.

Si lo que necesitás está detrás de otro objeto, no lo buscás vos: le pedís a ese objeto una operación del dominio (por ejemplo obtenerOferta(cod) a emp). El nombre sale de la lista de operaciones de su clase.

Una operación del dominio devuelve un OBJETO (getMascota devuelve la Mascota, no su nombre). Los mensajes que cuelgan de ella (2.1, 2.2…) son cómo el receptor lo consigue por dentro; el emisor solo recibe el resultado en su variable. Esas operaciones no vienen en la letra: las diseñás vos.

## Destino: colección u objeto
<!-- re: colecci|:\w+ \*|[Dd]estino|receptor -->

Las operaciones de colección (add, find, next, remove) se envían a la colección :X *. Las operaciones de la clase (getEstado, hayCupos…) se envían al objeto concreto.

Tener un objeto no es tener sus colecciones: si tengo m, su colección de reservas la alcanzo por la flecha Mascota→Reserva*, con «association».

El receptor nunca va como parámetro: ya es a quien le hablás.

## Navegación: camino al receptor
<!-- re: [Cc]amino|flecha|Clases -->

Un objeto solo puede enviar mensajes a quien conoce: lo que recibió por parámetro, lo que obtuvo antes (local) o lo que alcanza por una flecha del diagrama de clases.

Si no hay flecha directa, se navega pasando por los objetos intermedios: el Controlador le pide algo a emp, y emp a sus ofertas. Primero se mira «Tengo»; las flechas son para lo que todavía no tenés.

## Recorridos
<!-- re: next|recorr|\*\[|foreach|[Ii]tera -->

Recorrer una colección = enviarle next() con * en el número: cada next devuelve un elemento (pe := next()).

Lo que se hace con cada elemento va dentro del recorrido y también lleva * (4.2*, 4.2.1*).

Si buscás si existe alguno que cumpla, cortás al encontrar el primero. Si navegás de B hacia A, juntás los resultados sin repetidos.

## Operaciones abstractas
<!-- re: abstract|subclase -->

Una operación abstracta se declara en la clase padre y cada subclase la implementa a su manera.

Quien la llama le envía el mensaje al objeto con el tipo del padre (no sabe qué subclase es). Se dibuja un diagrama de comunicación por cada subclase.

## Condiciones [ ]
<!-- re: \[.*\]|condici|[Ss]olo si -->

Una condición se escribe entre corchetes antes del mensaje: 4: [cd] est → … Indica que el mensaje solo ocurre si se cumple.

El valor de la condición tiene que haberse obtenido antes (por ejemplo cd := cuposDisponibles(…)) y no cambia la numeración.

