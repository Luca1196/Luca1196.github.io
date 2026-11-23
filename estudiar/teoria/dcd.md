# Diagrama de clases de diseño (DCD)

Teórico de Programación 4 · del diagrama de comunicación al DCD.

## Del diagrama de comunicación al DCD
<!-- re: DCD|navegab|dependencia|operaci -->

Se juntan las flechas de TODAS las operaciones diseñadas: cada flecha entre objetos de dos clases es una asociación NAVEGABLE en ese sentido; si el destino es una colección, lleva * de ese lado.

Cada mensaje que recibe un objeto se vuelve una operación de su clase (con sus parámetros y su tipo de retorno). Las operaciones genéricas de colecciones (find, add, remove, next) no se declaran: son de la colección.

Dependencia (línea punteada): una clase usa a otra que no conoce por un atributo sino por un parámetro, una variable local o un global (por ejemplo, el Controlador singleton con getInstance()).

Completar con los apuntes del curso: (pendiente).

