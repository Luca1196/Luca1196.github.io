# Teórico por tema: cómo se escribe y cómo se completa

Cada archivo de esta carpeta es el teórico completo de un tema. El botón «📖 Teórico» de cada tarjeta abre el de su tema, en la sección que esa tarjeta necesita. Se pueden editar sin tocar código.

| Archivo | Tema |
|---|---|
| induccion.md | Lógica · inducción y recursión |
| semantica.md | Lógica · semántica proposicional |
| deduccion.md | Lógica · deducción natural |
| estructuras.md | Lógica · estructuras y modelos (primer orden) |
| consistencia.md | Lógica · consistencia, teorías, completitud (modelo a seguir) |
| tableaux.md | Lógica · tableaux |
| comunicacion.md | Prog4 · diagramas de comunicación |
| dss.md | Prog4 · DSS |
| dominio.md | Prog4 · modelo de dominio |
| dcd.md | Prog4 · DCD |
| cpp.md | Prog4 · implementación en C++ |

## Formato

- `# Título` al principio, y una línea que diga qué cubre.
- Cada sección empieza con `## Título de la sección`.
- Debajo del título de sección, opcional: `<!-- re: palabra|otra|Cons\( -->`. Es una expresión regular: si el texto de una tarjeta (consigna, respuesta, título) coincide, el botón 📖 abre el documento en ESA sección. Sin esa línea, se usa la primera sección.
- Texto en párrafos; listas con `- `; listas numeradas con `1. `; negrita con `**así**`; tablas con `| a | b |`.

## Cómo se escribe (para cualquier IA que lo complete)

1. Partir de los apuntes del curso y las soluciones oficiales; no inventar definiciones. Usar la notación del curso.
2. Seguir el modelo de consistencia.md: definir TODO lo que se usa antes de usarlo (escalera de abajo hacia arriba), con UN ejemplo que atraviese todo el documento.
3. Cada concepto: definición, a qué equivale, para qué se usa en los ejercicios y cómo se muestra (qué se escribe en el examen). Las pruebas del teórico, solo como idea.
4. Español rioplatense, oraciones cortas, sin relleno.
5. No borrar las secciones que ya existen: completarlas o agregar nuevas. Mantener las líneas `<!-- re: … -->`.
