// Arma el menú a partir de juegos.json. Para sumar un juego: crea su carpeta y agrega una entrada a juegos.json.
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
fetch("juegos.json")
  .then(r => r.json())
  .then(juegos => {
    document.getElementById("juegos").innerHTML = juegos.map(j => `
      <li class="juego"><a href="${esc(j.carpeta)}/">
        <span class="icono" aria-hidden="true">${esc(j.icono || "⭐")}</span>
        <span class="tipo">${esc(j.tipo || "")}</span>
        <h2>${esc(j.titulo)}</h2>
        <p>${esc(j.descripcion || "")}</p>
      </a></li>`).join("");
  })
  .catch(() => {
    document.getElementById("juegos").innerHTML = '<li class="error">No se pudo cargar la lista de juegos.</li>';
  });
