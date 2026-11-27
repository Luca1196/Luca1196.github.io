# Juegos de astronomía

Sitio: https://luca1196.github.io

- `index.html`, `estilo.css`, `menu.js`: el menú. Se arma solo a partir de `juegos.json`.
- Cada juego vive en su propia carpeta, con su `index.html`:
  - `exoplanetas/`: Sistemas Exoplanetas (contra bots). `estilo.css` y `js/` (datos, motor, bots, interfaz).
  - `astrofisica/`: repaso de astrofísica con repetición espaciada.
  - `preguntados/`: Ruleta OUA, preguntas estilo Preguntados para la 1ª etapa de la Olimpíada Uruguaya de Astronomía.
    `js/preguntas.js` (temas, teórico y banco), `js/azar.js` (semilla y códigos VS), `js/juego.js` (interfaz).
    El banco mezcla preguntas reales de las 1ª etapas OUA 2021-2025 (con `fuente`) y preguntas de práctica; la opción «Solo preguntas de pruebas OUA» usa solo las reales.
    Para sumar preguntas: agregarlas **al final** de su tema en `preguntas.js` (la primera opción es la correcta). Cambiar el banco cambia lo que genera un código VS: si se reordena o se borra algo, subir `VERSION_BANCO`.
  - `estudiar/`: herramienta de estudio personal (Prog4 y Lógica). No está en `juegos.json`, por eso no aparece en el menú; se entra con `/estudiar`. Lleva `noindex`.

## Agregar un juego
1. Crea una carpeta nueva con su `index.html`.
2. Agrega una entrada en `juegos.json` (carpeta, título, descripción, tipo, icono).

Desarrollado por Luca Sallé en el Observatorio Astronómico de Montevideo.
