# Juegos de astronomía

Sitio: https://luca1196.github.io

- `index.html`, `estilo.css`, `menu.js`: el menú. Se arma solo a partir de `juegos.json`.
- Cada juego vive en su propia carpeta, con su `index.html`:
  - `exoplanetas/`: Sistemas Exoplanetas (contra bots). `estilo.css` y `js/` (datos, motor, bots, interfaz).
  - `astrofisica/`: repaso de astrofísica con repetición espaciada.
  - `estudiar/`: herramienta de estudio personal (Prog4 y Lógica). No está en `juegos.json`, por eso no aparece en el menú; se entra con `/estudiar`. Lleva `noindex`.

## Agregar un juego
1. Crea una carpeta nueva con su `index.html`.
2. Agrega una entrada en `juegos.json` (carpeta, título, descripción, tipo, icono).

Desarrollado por Luca Sallé en el Observatorio Astronómico de Montevideo.
