// Ruleta OUA: interfaz y reglas. Depende de preguntas.js (TEMAS, PREGUNTAS) y azar.js.
const SEGUNDOS_POR_PREGUNTA = 30;
const $ = id => document.getElementById(id);
const temaPorId = id => TEMAS.find(t => t.id === id);

// ───── Guardado local (puede fallar en modo privado: siempre con try/catch) ─────
const guardado = {
  leer(clave, def) { try { const v = localStorage.getItem("ruletaOUA." + clave); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
  escribir(clave, v) { try { localStorage.setItem("ruletaOUA." + clave, JSON.stringify(v)); } catch (e) { /* sin guardado */ } }
};

// ───── Navegación entre pantallas ─────
let pantallaActual = "inicio", pantallaPrevia = "inicio";
function irA(nombre) {
  if (nombre !== pantallaActual) pantallaPrevia = pantallaActual;
  document.querySelectorAll(".pantalla").forEach(p => p.classList.toggle("activa", p.id === "p-" + nombre));
  pantallaActual = nombre;
  window.scrollTo(0, 0);
  if (nombre === "inicio") mostrarRecord();
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-ir]");
  if (!b) return;
  if (b.dataset.modo) prepararConfig(b.dataset.modo);
  if (b.dataset.ir === "teorico") abrirTeorico();
  else irA(b.dataset.ir);
});

function mostrarRecord() {
  const r = guardado.leer("record", 0);
  $("record").textContent = r ? `🏆 Tu mejor racha en Solo: ${r}` : "";
}

// ───── Configuración de partida ─────
let modoConfig = "solo", cantidadElegida = 10;
let temasElegidos = guardado.leer("temas", TEMAS.map(t => t.id)).filter(id => temaPorId(id));
if (!temasElegidos.length) temasElegidos = TEMAS.map(t => t.id);

function prepararConfig(modo) {
  modoConfig = modo;
  $("config-titulo").textContent = modo === "solo" ? "Partida Solo" : "Nuevo desafío VS";
  $("config-vs").hidden = modo !== "vs";
  $("config-aviso").textContent = "";
  pintarTemasElegir();
  $("cantidades").innerHTML = CANTIDADES.map(n => `<button class="chip-n${n === cantidadElegida ? " sel" : ""}" data-n="${n}">${n}</button>`).join("");
}
function pintarTemasElegir() {
  $("temas-elegir").innerHTML = TEMAS.map(t => {
    const cant = PREGUNTAS.filter(p => p.tema === t.id).length;
    const sel = temasElegidos.includes(t.id);
    return `<button class="chip-tema${sel ? " sel" : ""}" data-tema="${t.id}" style="--c:${t.color}" aria-pressed="${sel}">
      <span class="ico">${t.icono}</span><span class="nom">${t.nombre}</span><span class="cant">${cant}</span></button>`;
  }).join("");
}
$("temas-elegir").addEventListener("click", e => {
  const b = e.target.closest("[data-tema]");
  if (!b) return;
  const id = b.dataset.tema;
  temasElegidos = temasElegidos.includes(id) ? temasElegidos.filter(x => x !== id) : [...temasElegidos, id];
  pintarTemasElegir();
});
$("todos").onclick = () => { temasElegidos = TEMAS.map(t => t.id); pintarTemasElegir(); };
$("ninguno").onclick = () => { temasElegidos = []; pintarTemasElegir(); };
$("cantidades").addEventListener("click", e => {
  const b = e.target.closest("[data-n]");
  if (!b) return;
  cantidadElegida = +b.dataset.n;
  document.querySelectorAll(".chip-n").forEach(x => x.classList.toggle("sel", x === b));
});

let desafioPendiente = null;
$("empezar").onclick = () => {
  if (!temasElegidos.length) { $("config-aviso").textContent = "Elige al menos un tema."; return; }
  guardado.escribir("temas", temasElegidos);
  if (modoConfig === "solo") { iniciarPartida({ modo: "solo", temas: temasElegidos, semilla: semillaAlAzar() }); return; }
  const cfg = { temas: temasElegidos.slice(), n: cantidadElegida, semilla: semillaAlAzar() };
  cfg.codigo = codificarDesafio(cfg);
  mostrarCodigoCreado(cfg);
};

function describirDesafio(cfg) {
  const nombres = cfg.temas.length === TEMAS.length ? "todos los temas" : cfg.temas.map(id => temaPorId(id).icono + " " + temaPorId(id).nombre).join(" · ");
  return `${cfg.n} preguntas · ${nombres}`;
}
function enlaceDesafio(codigo) { return location.origin + location.pathname + "?c=" + codigo; }

function mostrarCodigoCreado(cfg) {
  desafioPendiente = cfg;
  $("codigo-grande").textContent = cfg.codigo;
  $("codigo-detalle").textContent = describirDesafio(cfg);
  irA("codigo");
}
$("copiar").onclick = () => copiar(desafioPendiente.codigo, $("copiar"));
$("compartir").onclick = async () => {
  const url = enlaceDesafio(desafioPendiente.codigo);
  const texto = `¡Te desafío en la Ruleta OUA! Código: ${desafioPendiente.codigo}`;
  if (navigator.share) { try { await navigator.share({ title: "Ruleta OUA", text: texto, url }); return; } catch (e) { /* cancelado */ } }
  copiar(texto + "\n" + url, $("compartir"));
};
$("jugar-desafio").onclick = () => jugarDesafio(desafioPendiente);

function copiar(texto, boton) {
  const ok = () => { const t = boton.textContent; boton.textContent = "✅ Copiado"; setTimeout(() => { boton.textContent = t; }, 1500); };
  if (navigator.clipboard) navigator.clipboard.writeText(texto).then(ok, () => {});
}

// ───── Unirse a un desafío ─────
$("codigo-in").addEventListener("input", e => {
  let s = normalizarCodigo(e.target.value).slice(0, 8);
  e.target.value = s.length > 4 ? s.slice(0, 4) + "-" + s.slice(4) : s;
  $("unirse-aviso").textContent = "";
});
$("unirse-btn").onclick = () => {
  const cfg = decodificarDesafio($("codigo-in").value);
  if (!cfg) { $("unirse-aviso").textContent = "Ese código no es válido. Revisa que esté bien escrito."; return; }
  jugarDesafio(cfg);
};
$("codigo-in").addEventListener("keydown", e => { if (e.key === "Enter") $("unirse-btn").click(); });

function jugarDesafio(cfg) {
  const previo = guardado.leer("vs", {})[cfg.codigo];
  if (previo) { // ya lo jugaste: no se puede repetir para mejorar el puntaje
    estado = { modo: "vs", ...cfg, aciertos: previo.aciertos, tiempo: previo.segundos, historial: [], yaJugado: true };
    mostrarFin();
    return;
  }
  iniciarPartida({ modo: "vs", ...cfg });
}

// ───── La ruleta ─────
let giroActual = 0;
function puntoPolar(r, grados) { const a = (grados - 90) * Math.PI / 180; return [r * Math.cos(a), r * Math.sin(a)]; }
function dibujarRuleta(temas) {
  const k = temas.length, a = 360 / k;
  const tamIcono = k <= 3 ? 30 : k <= 6 ? 24 : 19;
  let svg = "";
  temas.forEach((id, i) => {
    const t = temaPorId(id);
    if (k === 1) svg += `<circle r="96" fill="${t.color}"/>`;
    else {
      const [x1, y1] = puntoPolar(96, i * a), [x2, y2] = puntoPolar(96, (i + 1) * a);
      svg += `<path d="M0 0 L${x1.toFixed(2)} ${y1.toFixed(2)} A96 96 0 ${a > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${t.color}" stroke="#0b1030" stroke-width="1.5"/>`;
    }
    const [ix, iy] = puntoPolar(66, (i + 0.5) * a);
    svg += `<text x="${ix.toFixed(2)}" y="${iy.toFixed(2)}" font-size="${tamIcono}" text-anchor="middle" dominant-baseline="central" transform="rotate(${((i + 0.5) * a).toFixed(2)} ${ix.toFixed(2)} ${iy.toFixed(2)})">${t.icono}</text>`;
  });
  svg += `<circle r="97" fill="none" stroke="#ffc83d" stroke-width="4"/>`;
  for (let i = 0; i < 24; i++) { const [x, y] = puntoPolar(97, i * 15); svg += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2" fill="#fff8d6"/>`; }
  const r = $("ruleta");
  r.innerHTML = svg;
  r.style.transition = "none";
  r.style.transform = `rotate(${giroActual % 360}deg)`;
  giroActual = giroActual % 360;
}

function girarHacia(indice, k) {
  return new Promise(resolver => {
    const a = 360 / k;
    const destino = -(indice + 0.5) * a + (Math.random() - 0.5) * a * 0.6;
    const base = giroActual + 360 * 5;
    giroActual = base + (((destino - base) % 360) + 360) % 360;
    const r = $("ruleta");
    const lento = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    r.style.transition = `transform ${lento ? 3.4 : 0.6}s cubic-bezier(.15,.7,.2,1)`;
    void r.getBoundingClientRect();
    r.style.transform = `rotate(${giroActual}deg)`;
    let hecho = false;
    const fin = () => { if (!hecho) { hecho = true; resolver(); } };
    r.addEventListener("transitionend", fin, { once: true });
    setTimeout(fin, lento ? 3700 : 900);
  });
}

// ───── Partida ─────
let estado = null, reloj = null;

function iniciarPartida(cfg) {
  estado = { ...cfg, mazo: crearMazo(cfg.temas, cfg.semilla), indice: 0, aciertos: 0, racha: 0, tiempo: 0, historial: [], actual: null };
  giroActual = 0;
  dibujarRuleta(cfg.temas);
  irA("juego");
  turno();
}

function actualizarMarcador() {
  if (estado.modo === "solo") {
    $("dato-izq").innerHTML = `🔥 Racha <b>${estado.racha}</b>`;
    $("dato-der").innerHTML = `🏆 <b>${guardado.leer("record", 0)}</b>`;
  } else {
    $("dato-izq").innerHTML = `Pregunta <b>${Math.min(estado.indice + 1, estado.n)}</b>/${estado.n}`;
    $("dato-der").innerHTML = `✅ <b>${estado.aciertos}</b>`;
  }
}

function turno() {
  actualizarMarcador();
  $("zona-pregunta").hidden = true;
  $("zona-ruleta").hidden = false;
  $("tema-salio").textContent = "Toca la ruleta para girar";
  $("tema-salio").style.color = "";
  $("girar").disabled = false;
}

async function girar() {
  if (!estado || $("girar").disabled) return;
  $("girar").disabled = true;
  const item = estado.mazo.siguiente();
  estado.actual = item;
  $("tema-salio").textContent = "…";
  await girarHacia(estado.temas.indexOf(item.tema), estado.temas.length);
  const t = temaPorId(item.tema);
  $("tema-salio").textContent = `${t.icono} ${t.nombre}`;
  $("tema-salio").style.color = t.color;
  setTimeout(() => mostrarPregunta(item), 650);
}
$("girar").onclick = girar;
$("ruleta").addEventListener("click", girar);

function mostrarPregunta(item) {
  const t = temaPorId(item.tema), p = item.pregunta;
  $("zona-ruleta").hidden = true;
  $("zona-pregunta").hidden = false;
  $("tarjeta").style.setProperty("--c", t.color);
  $("cabeza-tema").textContent = `${t.icono} ${t.nombre}`;
  $("pregunta").textContent = p.p;
  const op = $("opciones");
  op.innerHTML = "";
  item.orden.forEach((iOriginal, pos) => {
    const b = document.createElement("button");
    b.className = "opcion";
    b.dataset.original = iOriginal;
    b.innerHTML = `<span class="letra">${"ABCD"[pos]}</span><span></span>`;
    b.lastChild.textContent = p.ops[iOriginal];
    b.onclick = () => responder(iOriginal);
    op.appendChild(b);
  });
  $("feedback").hidden = true;
  arrancarReloj();
}

function arrancarReloj() {
  clearInterval(reloj);
  const inicio = performance.now(), barra = $("reloj-barra");
  estado.inicioPregunta = inicio;
  barra.classList.remove("apurado");
  barra.style.width = "100%";
  reloj = setInterval(() => {
    const resta = SEGUNDOS_POR_PREGUNTA - (performance.now() - inicio) / 1000;
    barra.style.width = Math.max(0, resta / SEGUNDOS_POR_PREGUNTA * 100) + "%";
    barra.classList.toggle("apurado", resta < 8);
    if (resta <= 0) responder(null);
  }, 100);
}

function responder(iOriginal) {
  if (!estado || !estado.actual || estado.respondida === estado.actual) return;
  clearInterval(reloj);
  const item = estado.actual, p = item.pregunta;
  estado.respondida = item;
  const seg = Math.min(SEGUNDOS_POR_PREGUNTA, (performance.now() - estado.inicioPregunta) / 1000);
  estado.tiempo += seg;
  const ok = iOriginal === 0;
  estado.historial.push({ pregunta: p, elegida: iOriginal, ok });
  document.querySelectorAll(".opcion").forEach(b => {
    b.disabled = true;
    const o = +b.dataset.original;
    if (o === 0) b.classList.add("correcta");
    else if (o === iOriginal) b.classList.add("incorrecta");
  });
  if (ok) { estado.aciertos++; estado.racha++; }
  if (estado.modo === "vs") estado.indice++;
  actualizarMarcador();

  const terminado = estado.modo === "solo" ? !ok : estado.indice >= estado.n;
  const fb = $("feedback");
  const titulo = ok ? "✅ ¡Correcto!" : iOriginal === null ? "⏰ ¡Se terminó el tiempo!" : "❌ Incorrecto";
  fb.className = "feedback " + (ok ? "bien" : "mal");
  fb.innerHTML = `<p class="fb-titulo">${titulo}</p><p class="fb-exp"></p>`;
  fb.querySelector(".fb-exp").textContent = p.exp;
  if (!ok) fb.appendChild(botonTeorico(p));
  if (p.fuente) { const f = document.createElement("p"); f.className = "fuente"; f.textContent = "Fuente: " + p.fuente; fb.appendChild(f); }
  const sig = document.createElement("button");
  sig.className = "btn primario";
  sig.textContent = terminado ? "Ver resultado" : estado.modo === "solo" ? "Seguir girando" : "Siguiente";
  sig.onclick = () => (terminado ? mostrarFin() : turno());
  fb.appendChild(sig);
  fb.hidden = false;
  if (navigator.vibrate) { try { navigator.vibrate(ok ? 30 : [60, 40, 60]); } catch (e) { /* */ } }
}

function botonTeorico(p) {
  const t = temaPorId(p.tema), sec = t.teoria.find(s => s.id === p.ref) || t.teoria[0];
  const b = document.createElement("button");
  b.className = "btn teorico-ref";
  b.innerHTML = `📖 Repasa en el teórico: <b></b>`;
  b.querySelector("b").textContent = sec.titulo;
  b.onclick = () => abrirTeorico(p.tema, sec.id);
  return b;
}

$("salir").onclick = () => {
  const msg = estado && estado.modo === "vs"
    ? "¿Abandonar el desafío? Las preguntas que faltan cuentan como incorrectas."
    : "¿Abandonar la partida?";
  if (!confirm(msg)) return;
  clearInterval(reloj);
  if (estado.modo === "vs") mostrarFin();
  else irA("inicio");
};

// ───── Fin de partida ─────
function mostrarFin() {
  clearInterval(reloj);
  const e = estado;
  $("fin-vs").hidden = e.modo !== "vs";
  $("veredicto").textContent = "";
  $("rival-in").value = "";
  if (e.modo === "solo") {
    const record = guardado.leer("record", 0), nuevo = e.racha > record;
    if (nuevo) guardado.escribir("record", e.racha);
    $("fin-titulo").textContent = nuevo && e.racha > 0 ? "🏆 ¡Nuevo récord!" : "Fin de la racha";
    $("fin-puntaje").textContent = e.racha;
    $("fin-detalle").textContent = e.racha === 1 ? "acierto seguido" : "aciertos seguidos";
  } else {
    if (!e.yaJugado) {
      const todos = guardado.leer("vs", {});
      todos[e.codigo] = { aciertos: e.aciertos, segundos: Math.round(e.tiempo) };
      guardado.escribir("vs", todos);
    }
    $("fin-titulo").textContent = e.yaJugado ? "Ya jugaste este desafío" : "Desafío terminado";
    $("fin-puntaje").textContent = `${e.aciertos}/${e.n}`;
    $("fin-detalle").textContent = `Código ${e.codigo} · tiempo de respuesta: ${formatoTiempo(e.tiempo)}`;
    $("fin-codigo").textContent = codificarResultado(e.codigo, e.aciertos, e.tiempo);
  }
  pintarRepaso(e.historial.filter(h => !h.ok));
  irA("fin");
}

function formatoTiempo(s) { s = Math.round(s); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }

function pintarRepaso(fallos) {
  const cont = $("fin-repaso");
  cont.innerHTML = "";
  if (!fallos.length) return;
  const h = document.createElement("h3");
  h.textContent = fallos.length === 1 ? "Para repasar" : `Para repasar (${fallos.length})`;
  cont.appendChild(h);
  fallos.forEach(f => {
    const t = temaPorId(f.pregunta.tema);
    const d = document.createElement("div");
    d.className = "repaso";
    d.style.setProperty("--c", t.color);
    d.innerHTML = `<p class="rp-p"></p><p class="rp-r">✔ <span></span></p>`;
    d.querySelector(".rp-p").textContent = `${t.icono} ${f.pregunta.p}`;
    d.querySelector(".rp-r span").textContent = f.pregunta.ops[0];
    d.appendChild(botonTeorico(f.pregunta));
    cont.appendChild(d);
  });
}

$("rival-in").addEventListener("input", e => { e.target.value = normalizarCodigo(e.target.value).slice(0, 4); });
$("comparar").onclick = () => {
  const r = decodificarResultado(estado.codigo, $("rival-in").value);
  const v = $("veredicto");
  if (!r) { v.textContent = "Ese resultado no corresponde a este desafío."; v.className = "veredicto"; return; }
  const yo = { aciertos: estado.aciertos, segundos: Math.round(estado.tiempo) };
  let txt, clase;
  if (yo.aciertos !== r.aciertos) { const gano = yo.aciertos > r.aciertos; txt = gano ? "🏆 ¡Ganaste!" : "Ganó tu rival"; clase = gano ? "gano" : "perdio"; }
  else if (yo.segundos !== r.segundos) { const gano = yo.segundos < r.segundos; txt = (gano ? "🏆 ¡Ganaste por tiempo!" : "Ganó tu rival por tiempo"); clase = gano ? "gano" : "perdio"; }
  else { txt = "🤝 ¡Empate perfecto!"; clase = "empate"; }
  v.className = "veredicto " + clase;
  v.innerHTML = `<b></b><br>Tú: ${yo.aciertos} aciertos en ${formatoTiempo(yo.segundos)} · Rival: ${r.aciertos} aciertos en ${formatoTiempo(r.segundos)}`;
  v.querySelector("b").textContent = txt;
};

$("otra").onclick = () => {
  if (estado.modo === "solo") iniciarPartida({ modo: "solo", temas: estado.temas, semilla: semillaAlAzar() });
  else { prepararConfig("vs"); irA("config"); }
};

// ───── Teórico ─────
function pintarTeorico() {
  $("teorico").innerHTML = TEMAS.map(t => `
    <article class="teo-tema" id="t-${t.id}" style="--c:${t.color}">
      <h3>${t.icono} ${t.nombre}</h3>
      ${t.teoria.map(s => `<section class="teo-sec" id="t-${t.id}-${s.id}"><h4>${s.titulo}</h4><p>${s.texto}</p></section>`).join("")}
    </article>`).join("");
}
function abrirTeorico(tema, sec) {
  const volverA = pantallaActual;
  irA("teorico");
  pantallaPrevia = volverA === "teorico" ? pantallaPrevia : volverA;
  document.querySelectorAll(".teo-sec.resaltada").forEach(x => x.classList.remove("resaltada"));
  if (tema) {
    const el = $(`t-${tema}-${sec}`) || $(`t-${tema}`);
    el.classList.add("resaltada");
    setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }
}
$("teorico-volver").onclick = () => irA(pantallaPrevia === "teorico" ? "inicio" : pantallaPrevia);

// ───── Arranque ─────
pintarTeorico();
mostrarRecord();
(function codigoEnEnlace() {
  const c = new URLSearchParams(location.search).get("c");
  if (!c) return;
  $("codigo-in").value = c;
  $("codigo-in").dispatchEvent(new Event("input"));
  irA("unirse");
})();
