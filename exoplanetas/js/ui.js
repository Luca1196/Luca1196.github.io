// ===================================================================
//  Interfaz estilo juego móvil: una pantalla, cartas grandes, objetivos con %
// ===================================================================
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const COLOR = ["var(--j0)", "var(--j1)", "var(--j2)", "var(--j3)"];
const ETIQ = { transito: "Trán", rv: "VRad", astro: "Astr", imagen: "Imag", micro: "Micr" };
const LUZ = { F: "#e9edff", G: "#ffe27a", K: "#ffad5c", M: "#ff6f4f" };
const CAMPO = { o: "Órbita", R: "Radio", M: "Masa", dens: "Densidad", atm: "Atmósfera", gases: "Gases", term: "Calor", ctx: "Contexto" };
const DIST_CORTA = { cercana: "Cercana", media: "Media", lejana: "Lejana" };
const CANCELADO = new Error("partida cancelada");
const ICO = {
  opinion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12.5h5"/></svg>',
  ayuda: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.8"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/></svg>',
  libro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M9 7h6"/></svg>',
  lista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1.2"/><circle cx="4" cy="12" r="1.2"/><circle cx="4" cy="18" r="1.2"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  ayuda: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14"/><circle cx="12" cy="17.5" r=".6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  tele: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 14l12-6 2 4-12 6z"/><path d="M15 8l3-1.5 2 4-3 1.5"/><path d="M9 17l-2 4M9 17l3 4"/></svg>',
  ojo: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  prisma: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3l8 15H4z"/><path d="M14 13l7-2M14 14l7 2" stroke-width="1.6"/></svg>',
};

let g = null;
const ui = { fase: "espera", sel: null, esperando: {}, ocupado: false, velocidad: 650, ayudas: false, log: [], hitosPend: [] };
const YO = 0;
const J = () => g.j[YO];
let preferencias = { nombre: "", cient: "seager", rivales: 2, velocidad: 650, ayudas: false, v: 2, modo: "tutorial" };
const RONDAS_TUTORIAL = 6;
try { Object.assign(preferencias, JSON.parse(localStorage.getItem("exo-pref") || "{}")); } catch (e) {}
if (preferencias.v !== 2) Object.assign(preferencias, { ayudas: false, v: 2 });   // ahora se elige por los datos, no por el %

// ---------------------------------------------------------- textos
const pct = p => `${Math.round(p * 100)}%`;
const sgn = v => (v > 0 ? `+${v}` : `${v}`);
function fmtCampo(c, v) {
  if (v === undefined || v === null) return "—";
  if (c === "o") return K.ORBITA[v] || v;
  if (c === "R") return `${String(v).replace(".", ",")} R⊕`;
  if (c === "M") return `${String(v).replace(".", ",")} M⊕`;
  return v;
}
function tamTemp(pl) {
  const r = pl.rasgosPub;
  const t = r.find(x => ["Pequeño", "Neptuniano", "Gigante"].includes(x)) || "";
  return `${t} ${r.includes("Caliente") ? "caliente" : r.includes("Frío") ? "frío" : "templado"}`;
}
const corto = pl => tamTemp(pl).replace("Pequeño", "Peq.").replace("Neptuniano", "Nep.").replace("Gigante", "Gig.").replace("caliente", "cal.").replace("templado", "tem.");
const ficha = i => `<span class="avatar" style="width:16px;height:16px;border-width:2px;border-radius:5px;display:inline-block;vertical-align:-2px;background:${COLOR[i]}"></span>`;
const nombreJ = i => g.j[i].nombre;
const inicial = jg => (CIEN[jg.cient].nombre.split(" y ")[0].split(" ").pop()[0] || "?");
function textoPlano(html) { const d = document.createElement("div"); d.innerHTML = html; return d.textContent; }
function estado(pl) {
  if (!pl.vivo) return "Descartado (falso positivo)";
  if (pl.pubPlaneta !== null) return `Publicado por ${nombreJ(pl.pubPlaneta)}${pl.confirmado ? " · confirmado" : ""}`;
  return pl.desc === YO ? "Privado (tuyo)" : `Privado de ${nombreJ(pl.desc)}`;
}
// habilidades del científico, en fichas cortas
function habilidades(cid) {
  const c = CIEN[cid], out = [];
  const p = K.CIENT_PTS && K.CIENT_PTS[cid], u = K.CIENT_PUB && K.CIENT_PUB[cid];
  const NOM = { neptuniano: "Neptuniano", caliente: "Caliente", gigante: "Gigante", frio: "Frío", gigante_frio: "Gigante Frío", gaseoso: "gaseoso", pequeño: "Pequeño", tierra: "tipo Tierra" };
  if (p) out.push(p[0].startsWith("tec:") ? `+${p[1]} por planeta con ${TEC[p[0].slice(4)].nombre}` : `+${p[1]} por planeta ${NOM[p[0]] || p[0]}`);
  if (u) out.push(`+${u[2]} por ${CAT_NOMBRE[u[0]]}${u[1] ? ` en ${u[1]}` : ""}${u[3] ? " tuyo" : ""}`);
  if (K.MASA_CIENT && K.MASA_CIENT[cid]) out.push(`+${K.MASA_CIENT[cid]} extra por Masa real`);
  if (cid === "tancredi") out.push(`+${K.TANC_FP} por falso positivo destapado`, `+${K.TANC_HALL} extra por Hallazgo`);
  if (cid === "charbonneau" && K.CHARB_MIDE) out[out.length - 1] += " (medida con un Espectro tuyo, en cualquier orden)";
  if (cid === "fernandez") out.push(`+${K.FERN} al investigar ajeno`, `+${K.FERN_REF} por refutación ganada`);
  if (c.bono) {
    const cl = c.clave;
    const que = cl.startsWith("tec:") ? TEC[cl.slice(4)].nombre : cl === "mar:esp" ? "Espectros" : cl === "mar:contexto" ? "Contexto"
      : cl === "gaseoso" ? "tiradas en gaseosos" : cl === "refutar" ? "refutar" : cl === "confirmar" ? "medir" : cl;
    out.push(`+${c.bono} a ${que}`);
  }
  return out;
}

// ---------------------------------------------------------- fondo
function dibujarFondo() {
  const cv = $("#cielo-fondo"), dpr = window.devicePixelRatio || 1;
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
  const c = cv.getContext("2d"); let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 220; i++) {
    c.fillStyle = `rgba(255,255,255,${0.15 + r() * 0.6})`;
    c.beginPath(); c.arc(r() * cv.width, r() * cv.height, (0.4 + r() * 1.3) * dpr, 0, 7); c.fill();
  }
}

// ---------------------------------------------------------- avisos, flotantes, banners
function aviso(txt, clase = "") {
  const el = document.createElement("div"); el.className = "aviso " + clase; el.innerHTML = txt;
  $("#avisos").appendChild(el);
  setTimeout(() => el.remove(), 3200);
  while ($("#avisos").children.length > 3) $("#avisos").firstChild.remove();
}
function flotante(idx, v) {
  if (idx === YO) (v > 0 ? Sfx.moneda(v) : Sfx.fallo()); else Sfx.rival();
  const el = document.getElementById("pts-" + idx); if (!el) return;
  const r = el.getBoundingClientRect();
  const f = document.createElement("div"); f.className = "flotante"; f.textContent = sgn(v);
  if (v < 0) f.style.color = "var(--mal)";
  f.style.left = r.left + "px"; f.style.top = r.top + "px";
  document.body.appendChild(f); setTimeout(() => f.remove(), 1300);
}
function banner(txt, sub = "") {
  const b = document.createElement("div"); b.className = "banner"; b.innerHTML = `<div>${txt}${sub ? `<small>${sub}</small>` : ""}</div>`;
  document.body.appendChild(b); setTimeout(() => b.remove(), 1900);
}

// ---------------------------------------------------------- hojas
function ventana({ titulo, cuerpo, botones = [{ txt: "Continuar", valor: true, clase: "" }], color, cerrable = true, centro = false, alAbrir }) {
  return new Promise(resolve => {
    const capa = document.createElement("div"); capa.className = "velo" + (centro ? " centro" : "");
    capa.innerHTML = `<div class="hoja" role="dialog" aria-modal="true" aria-label="${esc(textoPlano(titulo))}" style="${color ? `--h-color:${color}` : ""}">
      <div class="h-cab"><h2>${titulo}</h2>${cerrable ? '<button class="h-cerrar" type="button" aria-label="Cerrar">×</button>' : ""}</div>
      <div class="h-cuerpo">${cuerpo}${botones.length ? `<div class="acciones">${botones.map((b, i) => `<button type="button" class="btn-juego ${b.clase || ""}" data-i="${i}" ${b.disabled ? "disabled" : ""}>${b.txt}</button>`).join("")}</div>` : ""}</div></div>`;
    const cerrar = v => { if (!capa.isConnected) return; capa.remove(); resolve(v); };
    capa._cerrar = cerrar;
    capa.querySelectorAll(".acciones .btn-juego").forEach(b => b.onclick = () => cerrar(botones[+b.dataset.i].valor));
    const x = capa.querySelector(".h-cerrar"); if (x) x.onclick = () => cerrar(null);
    capa.addEventListener("click", e => { if (e.target === capa && cerrable) cerrar(null); });
    $("#capa").appendChild(capa);
    Sfx.abrir();
    if (alAbrir) alAbrir(capa, cerrar);
    const f = capa.querySelector(".acciones .btn-juego:not(.gris)") || capa.querySelector(".h-cerrar"); if (f) f.focus({ preventScroll: true });   // la hoja siempre empieza arriba (en teléfonos se leía desde el final)
  });
}
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { const v = [...document.querySelectorAll("#capa .velo")].pop(); if (v && v.querySelector(".h-cerrar")) v._cerrar(null); }
});

// ---------------------------------------------------------- tirada
function detalleBonos(partes) {
  const fila = (v, txt, sub = "") => `<li class="${v > 0 ? "pos" : v < 0 ? "neg" : ""}"><b>${v ? sgn(v) : "±0"}</b><span>${txt}${sub}</span></li>`;
  const filas = partes.map(([l, v, por]) => {
    if (Array.isArray(por)) {   // bono de estrella: se desglosa por qué
      const det = por.length > 1 || por[0][0] !== v ? `<ul class="por">${por.map(([pv, t]) => fila(pv, esc(t))).join("")}</ul>` : `<small>${esc(por[0][1])}</small>`;
      return fila(v, `<b class="que">${esc(l)}</b>`, det);
    }
    return v ? fila(v, `<b class="que">${esc(l)}</b>`, por ? `<small>${esc(por)}</small>` : "") : "";
  }).join("");
  return filas ? `<ul class="bonos-tirada">${filas}</ul>` : `<p class="tenue">Sin bonos: solo cuenta el dado.</p>`;
}
// Número que hay que sacar en el dado: dificultad de la carta menos los bonos (el 20 siempre sale, el 1 nunca)
function objetivoDado(d) { return Math.min(20, Math.max(2, d.cd - d.mod)); }
// Por qué falló: lo que jugó en contra (con su razón física) y la dificultad propia de la técnica
const AZAR_TEC = {
  transito: "Solo se ve el planeta si su órbita pasa justo por delante de la estrella, y no siempre transita mientras observas.",
  rv: "El bamboleo de la estrella es de pocos metros por segundo: el ruido del instrumento o de la propia estrella puede taparlo.",
  astro: "El vaivén de la estrella en el cielo es minúsculo: a veces no alcanza la precisión, aun en buenas condiciones.",
  imagen: "La estrella brilla millones de veces más que el planeta: puede quedar escondido en su resplandor.",
  micro: "Las alineaciones de estrellas son raras y no se repiten: si no ocurrió, no hay nada que ver.",
};
function porQueFalla(d) {
  const contra = [];
  for (const [lab, v, por] of d.partes || []) {
    if (Array.isArray(por)) { for (const [pv, t] of por) if (pv < 0) contra.push(t); }
    else if (v < 0) contra.push(por ? `${lab}: ${por}` : lab);
  }
  const items = contra.map(t => `<li>${esc(t)}</li>`).join("");
  let azar = "";
  if (d.d !== null && d.d !== undefined) {
    if (d.refuta) azar = "Tu medición no fue lo bastante precisa para contradecir lo publicado: en ciencia, refutar exige pruebas sólidas.";
    else if (d.tid) azar = AZAR_TEC[d.tid] || "";
  }
  return `<div class="falla"><b>¿Por qué falló?</b>
    ${items ? `<p>${d.d === null || d.d === undefined ? "Las condiciones de esta estrella lo impiden:" : "Jugó en contra:"}</p><ul>${items}</ul>` : ""}
    ${azar ? `<p>${items ? "Además: " : ""}${esc(azar)}</p>` : ""}</div>`;
}
async function mostrarAnalisis(d, modal) {
  // sin dado y con éxito: ya sabías que funcionaba (lo dice «Tu jugada»); pasa directo a la lectura
  if (modal && d.ok) return;
  const res = d.ok ? "Funcionó" : "No funcionó";
  if (!modal) {
    aviso(`${ficha(d.jg)} <b>${esc(nombreJ(d.jg))}</b> · ${esc(d.que)}: <b style="color:${d.ok ? "var(--ok)" : "var(--mal)"}">${res.toLowerCase()}</b>`);
    await sleep(ui.velocidad);
    return;
  }
  if (!d.ok) Sfx.fallo();
  await ventana({ titulo: esc(d.que), centro: true, botones: [{ txt: "Continuar", valor: true }], cuerpo: `<div class="dado-caja">
    <div class="analisis ${d.ok ? "ok" : "mal"}">${d.ok ? "✔" : "✘"}</div>
    <div class="veredicto" style="color:${d.ok ? "var(--ok)" : "var(--mal)"}">${res}</div>
    <p class="necesita">${d.ok ? (d.refuta ? "El Marcador funciona: el Director muestra lo que ve." : "Lees el resultado en secreto: míralo en tu cuaderno.") : `Las condiciones suman <b>${sgn(d.mod)}</b>: con ${K.UMBRAL_MAR} o menos el Marcador no funciona.`}</p>
    ${d.ok ? "" : porQueFalla(d) + (d.refuta ? "" : '<p class="tenue">La señal queda acumulada: si lo intentas de nuevo con este Marcador, suma.</p>')}</div>
    <details class="porque"><summary>Todas las condiciones</summary>${detalleBonos(d.partes)}</details>` });
}
async function mostrarTirada(d, modal) {
  if (d.sinDado) return mostrarAnalisis(d, modal);
  const obj = objetivoDado(d);
  if (modal) ui.tiradas = (ui.tiradas || 0) + 1;
  const veredicto = d.ok ? "¡Éxito!" : "Falló";
  const color = d.ok ? "var(--ok)" : "var(--mal)";
  if (!modal) {
    aviso(`${ficha(d.jg)} <b>${esc(nombreJ(d.jg))}</b> · ${esc(d.que)}: sacó ${d.d}, necesitaba ${obj}+ → <b style="color:${color}">${veredicto}</b>`);
    await sleep(ui.velocidad);
    return;
  }
  const tira = Array.from({ length: 20 }, (_, k) => k + 1).map(n => `<span class="${n === 20 || (n >= obj && n !== 1) ? "gana" : ""}" data-n="${n}">${n}</span>`).join("");
  const necesita = obj >= 20 ? "Solo te sirve un <b>20</b>" : obj <= 2 ? "Te sirve <b>cualquier número menos el 1</b>" : `Necesitas sacar <b>${obj} o más</b>`;
  let caja;
  const p = ventana({ titulo: esc(d.que), centro: true, cuerpo: `<div class="dado-caja">
    <p class="necesita">${necesita}</p>
    <div class="tira" aria-label="Números del dado: en verde los que ganan">${tira}</div>
    <div class="dado rodando">?</div>
    <div class="veredicto">Tirando…</div></div>
    <details class="porque"><summary>¿Por qué ${obj}? La carta pide ${d.cd}${d.mod ? `, y tienes ${sgn(d.mod)}` : ""}</summary>${detalleBonos(d.partes)}</details>`,
    botones: [{ txt: "Continuar", valor: true }], alAbrir: c => { caja = c; } });
  const dado = caja.querySelector(".dado"), ver = caja.querySelector(".veredicto");
  const t0 = Date.now();
  while (Date.now() - t0 < 600 && caja.isConnected) { dado.textContent = 1 + Math.floor(Math.random() * 20); await sleep(50); }
  dado.classList.remove("rodando"); dado.textContent = d.d; dado.classList.add(d.ok ? "ok" : "mal");
  const celda = caja.querySelector(`.tira [data-n="${d.d}"]`); if (celda) celda.classList.add("salio");
  ver.innerHTML = `Sacaste ${d.d}: <span style="color:${color}">${veredicto}</span>`;
  if (!d.ok && caja.isConnected) caja.querySelector(".dado-caja").insertAdjacentHTML("beforeend", porQueFalla(d));
  await p;
}

// ---------------------------------------------------------- controlador humano
function nuevaEspera(k) { return new Promise(r => { ui.esperando[k] = r; }); }
function resolver(k, v) { const r = ui.esperando[k]; delete ui.esperando[k]; if (r) r(v); }
class Humano {
  async turno(juego, jg) {
    if (juego !== g) throw CANCELADO;
    if (ui.reanudarPost) ui.reanudarPost = false;     // partida recuperada después de tu acción: sigues en publicar
    else {
      ui.fase = "accion"; ui.sel = null; render();
      banner("Tu turno"); Sfx.turno();
      await nuevaEspera("accion");
      await mostrarHitos(true);
      guardarPartida("post");
    }
    ui.fase = "post"; ui.sel = null; render();
    if (K.ROBO) await juego.reponer(jg);
    else await nuevaEspera("fin");          // sin robo: publicas si quieres y terminas el turno
    ui.fase = "espera"; render();
  }
  async elegirMazo(juego, jg, k) { await mostrarHitos(true); ui.fase = k === 0 ? "post" : "robar"; render(); return nuevaEspera("mazo"); }
  descartar(juego, jg) { ui.fase = "descartar"; render(); return nuevaEspera("descarte"); }
  decidirRefutar(juego, x, pl, cat, ops) { return preguntarRefutar(pl, cat, ops.map(mid => ({ cat, mid }))).then(r => r && r.mid); }
  decidirRefutarArticulo(juego, x, pl, cats, pares, pozo) { return preguntarRefutar(pl, cats, pares, pozo); }
}
async function accionHumana(fn) {
  if (ui.ocupado || ui.fase !== "accion") return;
  ui.ocupado = true; ui.sel = null; render();
  try { await fn(); ui.tiradas = (ui.tiradas || 0) + 1; } finally { ui.ocupado = false; }
  resolver("accion");
}

// opciones de la carta elegida sobre una estrella
function opcionesEstrella(e, s = ui.sel) {
  const jg = J(), out = [];
  if (!s) return out;
  const pls = g.planetas.filter(p => p.est === e);
  if (s.tipo === "tec") {
    if (g.puedeDescubrir(jg, s.id, e)) out.push({ tipo: "desc", txt: "Buscar planeta nuevo", p: 1 });
    for (const p of pls) if (g.puedeMedir(jg, s.id, p)) out.push({ tipo: "medir", pl: p, txt: `Medir ${p.nombre}`, p: 1 });
  } else {
    for (const p of pls) if (g.puedeInvestigar(jg, s.id, p)) out.push({ tipo: "car", pl: p, txt: `Investigar ${p.nombre}`, p: 1 });
  }
  return out;
}
function opcionPlaneta(pl) { return opcionesEstrella(pl.est).find(o => o.pl === pl); }
async function ejecutar(o, e) {
  const s = ui.sel;
  if (o.tipo === "desc") return hacerDescubrir(s.id, e);
  if (o.tipo === "medir") return hacerMedir(s.id, o.pl);
  return hacerInvestigar(s.id, o.pl);
}
// Lo que se ve de cada estrella en el cielo: sus condiciones físicas (no los bonos), para elegir razonando
function tamEstrella(m) { return m < 0.6 ? "muy chica" : m < 0.9 ? "chica" : m <= 1.1 ? "como el Sol" : "grande"; }
function propsEstrella(e) {
  return [["dist", { cercana: "cercana", media: "dist. media", lejana: "lejana" }[e.dist]],
    ["edad " + e.edad, e.edad], ...(e.act === "activa" ? [["activa", "activa"]] : [["tranq", "tranquila"]]), ...(e.metal ? [["metal", "metálica"]] : [])];
}
// ---------------------------------------------------------- jugada: carta + estrella, con sus datos
const TIPO_ESTRELLA = { F: "Estrella F: más grande y caliente que el Sol", G: "Estrella G: como el Sol",
  K: "Estrella K: naranja, algo más chica que el Sol", M: "Enana roja (M): pequeña y fría" };
function datosEstrellaHTML(e) {
  const num = x => String(x).replace(".", ",");
  return `<div class="ficha-est"><div class="fe-cab"><span class="sol" style="background:${LUZ[e.cl[0]]};color:${LUZ[e.cl[0]]}"></span>
      <b class="fe-cl">${esc(e.cl)}</b><span>${esc(TIPO_ESTRELLA[e.cl[0]] || "")}</span></div>
    <div class="fe-datos"><span>Masa <b>${num(e.m)} Soles</b></span><span>Temperatura <b>${e.T.toLocaleString("es")} K</b></span>
      <span>Distancia <b>${esc(K.DIST[e.dist])}</b></span><span>Edad <b>${esc(K.EDAD[e.edad])}</b></span>
      <span>Actividad <b>${esc(K.ACT[e.act])}</b></span>${e.metal ? "<span><b>Rica en metales</b></span>" : ""}</div></div>`;
}
function datosCartaHTML(c) {
  if (c.tipo === "tec") {
    const t = TEC[c.id];
    return `<div class="ficha-carta tec"><span class="fc-tipo">Técnica</span><b class="fc-nom">${esc(t.nombre)}</b>
      <p class="bien"><b>Se usa en:</b> ${esc(USO[c.id])}</p><p>Te da: ${esc(textoPlano(t.aporta))}</p><p class="mal">Límite: ${esc(textoPlano(t.limite))}</p></div>`;
  }
  const m = MAR[c.id], r = RESUMEN_MAR[c.id];
  return `<div class="ficha-carta mar"><span class="fc-tipo">Marcador</span><b class="fc-nom">${esc(m.nombre)}</b>
    <p>Lees: ${esc(r ? r[0] : textoPlano(m.revela))}</p>${m.publica ? `<p class="bien">Sirve para publicar: ${esc(textoPlano(m.publica))}</p>` : ""}${m.req ? `<p class="mal">${esc(textoPlano(m.req))}</p>` : ""}</div>`;
}
function modOpcion(o, s, e) {
  const jg = J();
  return o.tipo === "desc" ? g.modDescubrir(jg, s.id, e) : o.tipo === "medir" ? g.modMedir(jg, s.id, o.pl) : g.modMarcador(jg, s.id, o.pl);
}
async function abrirJugada(e, plFoco = null) {
  const s = ui.sel;
  let ops = opcionesEstrella(e);
  if (plFoco) ops = [...ops.filter(o => o.pl === plFoco), ...ops.filter(o => o.pl !== plFoco)];
  const BOTON = { desc: "🔭 Observar", medir: "📏 Medir", car: "🔬 Investigar" };
  const SUB = { desc: "Puede salir un falso positivo: confírmalo antes de publicar", medir: "Agrega su dato; si no hay planeta, lo delata",
    car: "Lees el resultado en secreto" };
  const filas = ops.map((o, k) => `<div class="op-jugada"><div class="oj-cab"><span><b>${esc(o.txt)}</b><small>${SUB[o.tipo]}</small></span>
      <button type="button" class="btn-juego" data-k="${k}">${BOTON[o.tipo]}</button></div></div>`).join("");
  let porque = "";
  if (!ops.length) {
    if (s.tipo === "tec") porque = e.bono[s.id] === null
      ? `<b>${esc(TEC[s.id].nombre)}</b> no se puede usar aquí: ${esc(explicarEstrella(s.id, e).filter(([v]) => v < 0).map(([, x]) => x).join("; ") || textoPlano(TEC[s.id].limite))}.`
      : g.llena(e) ? `Esta estrella ya tiene ${K.MAX_PL} planetas: no se buscan más aquí.`
      : "Aquí no hay nada que esta técnica pueda buscar o medir ahora.";
    else porque = `Ningún planeta de esta estrella cumple el requisito: ${esc(textoPlano(MAR[s.id].req))}`;
  }
  const porQueTec = s.tipo === "tec" && e.bono[s.id] !== null
    ? `<div class="lista"><div class="fila-bono pos"><b>✓</b><span><b class="que">${esc(TEC[s.id].nombre)} sirve en esta estrella</b><small>${explicarEstrella(s.id, e).filter(([v]) => v >= 0).map(([, x]) => esc(x)).join(" · ")}</small></span></div></div>` : "";
  const v = await ventana({ titulo: "Tu jugada", color: "var(--est)", botones: [{ txt: "Elegir otra", valor: null, clase: "gris" }], cuerpo: `
    <div class="par-jugada">${datosCartaHTML(s)}<div class="mas">+</div>${datosEstrellaHTML(e)}</div>
    ${porQueTec}
    ${ops.length ? `<div class="lista">${filas}</div>` : `<p class="sin-op">${porque}</p>`}`,
    alAbrir: (capa, cerrar) => capa.querySelectorAll("[data-k]").forEach(b => b.onclick = () => cerrar(ops[+b.dataset.k])) });
  if (v && ui.sel === s && ui.fase === "accion" && !ui.ocupado) ejecutar(v, e);
}
async function tocarEstrella(i) {
  const e = g.estrellas[i];
  if (ui.fase === "accion" && !ui.ocupado && ui.sel) return abrirJugada(e);
  return detalleEstrella(e);
}
function tocarPlaneta(pl) {
  if (ui.fase === "accion" && !ui.ocupado && ui.sel) return abrirJugada(pl.est, pl);
  abrirPlaneta(pl);
}

async function hacerDescubrir(tid, est) {
  await accionHumana(async () => {
    const r = await g.descubrir(J(), tid, est);
    if (!r.ok) return;
    if (r.hallazgo) await mostrarHitos(true);
    else if (r.vacio) { Sfx.fallo(); await ventana({ titulo: "Sin candidato", centro: true, cuerpo: `<p>${esc(r.motivo)}</p><p class="tenue">La carta de Técnica se descarta.</p>` }); }
    else await revelarPlaneta(r.pl, est);
  });
}
async function revelarPlaneta(pl, est) {
  const dato = pl.tecnicas[0] === "transito" ? "R" : "M";
  Sfx.descubrir();
  // sin spoiler: primero los datos medidos; qué tipo de planeta es se deduce (y se puede abrir para comprobar)
  const r = pl.rasgosPub, tam = r.find(x => ["Pequeño", "Neptuniano", "Gigante"].includes(x)) || "";
  const temp = r.includes("Caliente") ? "Caliente" : r.includes("Frío") ? "Frío" : "Templado";
  const porTam = { Pequeño: "hasta 1,8 veces la Tierra (o pocas masas terrestres): tamaño Tierra o súper-Tierra",
    Neptuniano: "entre 1,8 y 8 veces la Tierra (decenas de masas terrestres): tamaño Neptuno",
    Gigante: "8 veces la Tierra o más (cientos de masas terrestres): tamaño Júpiter" }[tam] || "";
  const porTemp = { Caliente: "órbita 1 o 2: muy cerca de su estrella", Templado: "órbita 3: ni muy cerca ni muy lejos", Frío: "órbita 4: lejos de su estrella" }[temp];
  await ventana({ titulo: "¡Candidato!", color: "var(--pla)", centro: true, cuerpo: `
    <div class="privado"><h3>Candidato en ${esc(est.cl)} <small class="tenue">(${esc(pl.nombre)})</small></h3>
      <dl class="dato"><dt>Estrella</dt><dd>${esc(est.cl)}</dd><dt>Órbita</dt><dd>${esc(fmtCampo("o", pl.publico.o))}</dd><dt>${CAMPO[dato]}</dt><dd>${esc(fmtCampo(dato, pl.publico[dato]))}</dd></dl></div>
    <details class="porque"><summary>¿Qué tipo de planeta es? Piénsalo y toca para comprobar</summary>
      <p><b>${esc(tam)}</b>: ${esc(porTam)}.</p><p><b>${esc(temp)}</b>: ${esc(porTemp)}.</p></details>
    <p>Es <b>privado</b>: solo tú lo investigas. Los rivales solo saben su tamaño y temperatura. Publícalo cuando quieras con el botón <b>Publicar</b> (+${K.CAND}, o +${K.CONF} si ya está confirmado).</p>` });
}
// Falso positivo: qué era en realidad la señal (la frase que en la mesa dice el Director)
function ventanaFalso(pl, txt) {
  Sfx.falso();
  return ventana({ titulo: "¡Falso positivo!", color: "var(--mal)", centro: true, cuerpo: `<p>${txt}</p>
    <div class="hito-real"><b>¿Qué era la señal?</b><p>${esc(fraseFalso(pl))}</p></div>
    <p class="tenue">En la ciencia real pasa seguido: por eso un candidato se confirma con un segundo método antes de darlo por planeta.</p>` });
}
async function hacerMedir(tid, pl) {
  await accionHumana(async () => {
    const r = await g.medir(J(), tid, pl);
    if (!r.ok) return;
    if (r.falso) await ventanaFalso(pl, `La segunda observación no ve nada: ${esc(pl.nombre)} no era un planeta.`);
    else if (r.noVe) await ventana({ titulo: "No se ve", centro: true, cuerpo: `<p>${esc(TEC[tid].nombre)} no logra ver este planeta. ${esc(TEC[tid].limite)}</p>` });
    else aviso(`Mediste ${esc(pl.nombre)}: ${CAMPO[DATO_TEC[tid]]} = <b>${esc(fmtCampo(DATO_TEC[tid], pl.publico[DATO_TEC[tid]]))}</b>${pl.confirmado ? " · <b>¡confirmado!</b>" : ""}`);
  });
}
async function hacerInvestigar(mid, pl) {
  await accionHumana(async () => {
    const r = await g.investigar(J(), mid, pl);
    if (!r.ok) return;
    if (r.falso) { await ventanaFalso(pl, `El seguimiento no encuentra ninguna masa: ${esc(pl.nombre)} no era un planeta.`); return; }
    Sfx.exito();
    await ventana({ titulo: "Lectura secreta", color: "var(--mar)", centro: true, cuerpo: `
      <div class="privado"><dl class="dato">${Object.entries(r.lee).map(([c, v]) => `<dt>${CAMPO[c]}</dt><dd>${esc(v)}</dd>`).join("")}</dl></div>
      <p>Con esto puedes publicar <b>${sirveLista(mid, pl).map(c => CAT_NOMBRE[c]).join(" o ")}</b> en ${esc(pl.nombre)}${mid === "densidad" && sirveLista(mid, pl).includes("atmosfera") ? " (es un mundo de gas: tiene atmósfera)" : ""}, si crees que es cierto.</p>` });
  });
}
async function hacerTelescopio() {
  if (ui.ocupado || ui.fase !== "accion") return;
  const jg = J();
  const cartas = [...jg.tec.map(id => ({ tipo: "tec", id })), ...jg.mar.map(id => ({ tipo: "mar", id }))];
  const marc = new Set();
  let nTec = null;
  const v = await ventana({ titulo: "Tiempo de telescopio", color: "var(--est)", cuerpo: `
    <p>Gastas tu turno en conseguir cartas. <b>Toca las que quieras cambiar</b> y completas tu mano hasta ${K.MANO_MAX}.</p>
    <div class="mano tele-mano">${cartas.map((c, k) => cartaHTML(c.tipo, c.id, `data-k="${k}"`)).join("")}</div>
    <div class="reparto"><span>Recibes <b class="r-total"></b>:</span>
      <div class="stepper azul"><button type="button" data-d="-1" aria-label="Menos técnicas">−</button><span><b class="r-tec"></b> Técnicas</span><button type="button" data-d="1" aria-label="Más técnicas">+</button></div>
      <div class="stepper violeta"><span><b class="r-mar"></b> Marcadores</span></div></div>`,
    botones: [{ txt: "Cancelar", valor: null, clase: "gris" }, { txt: "Pedir telescopio", valor: "ok" }],
    alAbrir: capa => {
      const pintar = () => {
        const total = Math.max(1, K.MANO_MAX - cartas.length + marc.size);
        if (nTec === null) nTec = Math.ceil(total / 2);
        nTec = Math.max(0, Math.min(total, nTec));
        capa.querySelector(".r-total").textContent = `${total} carta${total === 1 ? "" : "s"}`;
        capa.querySelector(".r-tec").textContent = nTec; capa.querySelector(".r-mar").textContent = total - nTec;
        capa.dataset.total = total;
      };
      capa.querySelectorAll("[data-k]").forEach(b => b.onclick = () => {
        const k = +b.dataset.k; marc.has(k) ? marc.delete(k) : marc.add(k); b.classList.toggle("descartar", marc.has(k)); nTec = null; pintar();
      });
      capa.querySelectorAll("[data-d]").forEach(b => b.onclick = () => { nTec += +b.dataset.d; pintar(); });
      pintar();
    } });
  if (!v) return;
  const total = Math.max(1, K.MANO_MAX - cartas.length + marc.size);
  Sfx.barajar();
  await accionHumana(async () => { await g.telescopio(jg, [...marc].map(k => cartas[k]), { tec: nTec, mar: total - nTec }); });
}

// ---------------------------------------------------------- publicar y refutar
function publicables() {
  const jg = J(), out = [];
  for (const pl of g.planetas) {
    if (!pl.vivo) continue;
    if (pl.desc === YO && pl.pubPlaneta === null) out.push({ pl, cat: "planeta", txt: `Planeta ${pl.nombre}`, pts: pl.confirmado ? K.CONF : K.CAND });
    const cs = CATS.filter(c => g.puedePublicar(jg, pl, c));
    for (const c of cs) out.push({ pl, cat: c, txt: `${CAT_NOMBRE[c]} en ${pl.nombre}`, pts: K.PUNTOS[c], p: g.prob(jg, pl, c),
      nota: c === "atmosfera" && K.ATM_GIG && pl.rasgosPub.includes("Gigante") ? "todo gigante gaseoso tiene atmósfera"
        : c === "biofirma" ? "afirmas que sus gases delatan vida; puede ser una imitación sin vida" : "" });
    if (cs.length > 1) out.push({ pl, cat: "articulo", cats: cs, txt: `Artículo en ${pl.nombre}: ${cs.map(c => CAT_NOMBRE[c]).join(" + ")}`,
      pts: cs.reduce((s, c) => s + K.PUNTOS[c], 0) + (K.BONO_ART || 0) * (cs.length - 1), art: true });
  }
  return out;
}
async function abrirPublicar() {
  const ops = publicables();
  const puede = !ui.ocupado && ui.fase === "post";
  const v = await ventana({ titulo: "Publicar", color: "var(--pla)", botones: [], cuerpo: `
    ${puede ? "" : '<p class="tenue">Se publica al final de tu turno, después de jugar.</p>'}
    ${ui.tutorial ? `<div class="sec privado"><p><b>Publicar te da los puntos ya.</b> Pero si después se demuestra que era falso: un planeta te deja en <b>−1</b>; una Atmósfera, Habitable o Biofirma la puede refutar un rival, que <b>se lleva esos puntos</b>.</p></div>` : ""}
    ${ops.length ? `<div class="lista">${ops.map((o, k) => `<button type="button" class="pub-btn" data-k="${k}" ${puede ? "" : "disabled"}>
      <span>${esc(o.txt)}${o.nota ? `<br><small class="tenue">${esc(o.nota)}</small>` : ""}${ui.tutorial ? evaluarPublicacion(o) : ""}${o.art ? `<br><small class="tenue">todo junto: +${K.BONO_ART} por cada extra, pero si lo refutan, el rival se lleva todo</small>` : ""}${o.p !== undefined && ui.ayudas ? `<br><small class="tenue">cierto con probabilidad ${pct(o.p)}</small>` : ""}</span><b>+${o.pts}</b></button>`).join("")}</div>`
      : '<p>Todavía no tienes nada para publicar. Descubre un planeta, o investígalo con un Marcador que sirva para eso.</p>'}
    <p class="tenue">Al publicar Atmósfera, Habitable o Biofirma, un rival puede refutarte en el acto repitiendo la observación con un Marcador, aunque sea del mismo tipo que usaste.</p>`,
    alAbrir: (capa, cerrar) => capa.querySelectorAll(".pub-btn").forEach(b => b.onclick = () => cerrar(ops[+b.dataset.k])) });
  if (v) publicarHumano(v.pl, v.cat, v.cats);
}
async function publicarHumano(pl, cat, cats) {
  if (ui.ocupado || ui.fase !== "post") return;
  ui.ocupado = true; render();
  try {
    if (cat === "planeta") { g.publicarPlaneta(J(), pl); Sfx.publicar(); }
    else if (cat === "articulo") {
      const r = await g.publicarArticulo(J(), pl, cats);
      if (r && !r.refutado) { Sfx.publicar(); banner(`+${cats.reduce((s, c) => s + K.PUNTOS[c], 0) + K.BONO_ART * (cats.length - 1)} Artículo`, "nadie lo refutó"); }
    } else {
      const r = await g.publicar(J(), pl, cat);
      if (r && !r.refutado) { Sfx.publicar(); banner(`+${K.PUNTOS[cat]} ${CAT_NOMBRE[cat]}`, "nadie lo refutó"); }
    }
    await mostrarHitos();
  } finally { ui.ocupado = false; render(); }
}

// Cartel de hito: puntos, quién lo logró y el caso real que lo inspira.
// soloMios: los de un rival esperan a que termine su turno (si no, el cartel aparece antes de ver qué hizo).
// Hallazgo inesperado (exocometas, agujero negro, enana marrón): cartel como el de los hitos, propio o ajeno
async function cartelHallazgo(d, mio) {
  const h = d.h, tec = TEC[h.tec] ? TEC[h.tec].nombre : "";
  const lugar = `${d.est ? ` en ${esc(d.est.cl)}` : ""}${tec ? ` con ${esc(tec)}` : ""}`;
  mio ? Sfx.hito() : Sfx.descubrir();
  await ventana({ titulo: "¡Hallazgo inesperado!", color: "var(--hito)", centro: true, cerrable: false,
    botones: [{ txt: mio ? "¡Genial!" : "Continuar", valor: true }], cuerpo: `
    <div class="hito-cartel">
      <div class="hito-pts">+${K.HALL}</div>
      <h3>${esc(h.nombre)}</h3>
      <p class="hito-quien">${ficha(d.jg)} ${mio ? `<b>¡Lo encontraste${lugar}!</b>` : `<b>${esc(nombreJ(d.jg))}</b> lo encontró${lugar}`}</p>
      <p class="tenue">Buscando planetas, apareció otra cosa: suma puntos, pero esta vez no hay candidato.</p>
      <div class="hito-real"><b>Caso real</b><p>${esc(h.hist)}</p></div>
    </div>` });
}
async function mostrarHitos(soloMios = false) {
  while (ui.hitosPend && ui.hitosPend.length) {
    const k = soloMios ? ui.hitosPend.findIndex(x => x.jg === YO) : 0;
    if (k < 0) break;
    const d = ui.hitosPend.splice(k, 1)[0], mio = d.jg === YO;
    if (d.hall) { await cartelHallazgo(d, mio); continue; }
    const h = HITO[d.id];
    mio ? Sfx.hito() : Sfx.toque();
    await ventana({ titulo: "¡Hito de la astronomía!", color: "var(--hito)", centro: true, cerrable: false,
      botones: [{ txt: mio ? "¡Genial!" : "Continuar", valor: true }], cuerpo: `
      <div class="hito-cartel">
        <div class="hito-pts">+${h.pts}</div>
        <h3>${esc(h.nombre)}</h3>
        <p class="hito-quien">${ficha(d.jg)} ${mio ? "<b>¡Lo lograste!</b>" : `<b>${esc(nombreJ(d.jg))}</b> lo logró primero`}</p>
        <p class="tenue">${esc(h.cond)}</p>
        <div class="hito-real"><b>Caso real · ${esc(h.hist)}</b><p>${esc(h.historia || "")}</p></div>
      </div>` });
  }
}
async function preguntarRefutar(pl, cats, pares, pozo) {
  const lista = Array.isArray(cats) ? cats : [cats];
  const aut = pl.publicado[lista[0]].autor;
  pozo = pozo || lista.reduce((s, c) => s + K.PUNTOS[c], 0);
  const cands = g.candidatos(J(), pl);
  const bot = pares.map(({ cat, mid }) => {
    const pv = cands.filter(a => !verdad(a, cat) && veFalsedad(mid, a, cat)).length / cands.length;
    return { cat, mid, pv };
  });
  // Lo que puedes saber para decidir: el planeta, lo público, lo que leíste tú y con qué métodos respalda el autor
  const jg = J(), yoSe = g.sabe(jg, pl);
  const pub = Object.entries(pl.publico), mio = Object.entries(yoSe).filter(([c]) => !(c in pl.publico));
  const nomMet = m => (m === "densidad" ? MAR.densidad.nombre : TEC[m] ? TEC[m].nombre : MAR[m] ? MAR[m].nombre : m);
  const metAut = [...pl.ladoDe(aut)].map(nomMet);
  const previas = CATS.filter(c => c in pl.publicado && !lista.includes(c));
  const filaDatos = arr => `<dl class="dato">${arr.map(([c, v]) => `<dt>${CAMPO[c]}</dt><dd>${esc(fmtCampo(c, v))}</dd>`).join("")}</dl>`;
  const contexto = `<div class="sec"><h3>${esc(pl.nombre)} · ${esc(tamTemp(pl))} · estrella ${esc(pl.est.cl)}</h3>
      <p class="tenue">${esc(K.DIST[pl.est.dist])} · ${esc(K.EDAD[pl.est.edad])} · ${esc(K.ACT[pl.est.act])}</p>
      ${pub.length ? filaDatos(pub) : '<p class="tenue">Sin datos públicos.</p>'}
      <p class="tenue">El autor lo respalda con: <b>${esc(metAut.join(", ") || "—")}</b>${previas.length ? ` · ya publicado antes: ${previas.map(c => CAT_NOMBRE[c]).join(", ")}` : ""}</p></div>
    ${mio.length ? `<div class="sec privado"><h3>Lo que leíste tú (secreto)</h3>${filaDatos(mio)}</div>` : '<p class="tenue">No leíste nada de este planeta: refutarías a ciegas.</p>'}`;
  // qué lee cada Marcador y qué lectura le daría la razón
  const REFUTA_SI = {
    atmosfera: { esp_emision: "el calor muestra que no hay aire" },
    habitable: { densidad: "no es rocoso (gas o envoltura de H2)", esp_emision: "el calor muestra que no hay aire", contexto: "su contexto descarta agua líquida" },
    biofirma: { esp: "los gases no son de los que parecen vida", contexto: "una fuente abiótica explica la señal" },
  };
  const textoOp = b => {
    const campos = CAMPOS_MAR[b.mid], ya = campos.filter(c => c in yoSe || c in pl.publico);
    const tab = REFUTA_SI[b.cat], si = tab[b.mid] || tab[b.mid.startsWith("esp") ? "esp" : b.mid] || "su lectura contradice lo publicado";
    const sabido = ya.length ? `<br><small class="tenue">Ya sabes lo que verá: ${ya.map(c => `${CAMPO[c]}: ${esc(yoSe[c] ?? pl.publico[c])}`).join(" · ")}</small>` : "";
    return `${lista.length > 1 ? `<b>${CAT_NOMBRE[b.cat]}</b> · ` : ""}${esc(MAR[b.mid].nombre)}<br><small class="tenue">Lee ${campos.map(c => CAMPO[c].toLowerCase()).join(" y ")} · gana si ${esc(si)}</small>${sabido}`;
  };
  return ventana({ titulo: lista.length > 1 ? "¿Refutas el artículo?" : "¿Refutas?", color: "var(--mar)", cerrable: false, centro: true, botones: [{ txt: "No refutar", valor: null, clase: "gris" }], cuerpo: `
    <p>${ficha(aut)} <b>${esc(nombreJ(aut))}</b> publica <b>${lista.map(c => CAT_NOMBRE[c]).join(" + ")}</b> en ${esc(pl.nombre)}.</p>
    <h3>En juego: ${pozo} puntos</h3>
    ${contexto}
    <p class="tenue">Si lo que ve tu Marcador contradice ${lista.length > 1 ? "cualquiera de las afirmaciones, te llevas todo el artículo" : "lo publicado, los puntos son tuyos"}. Si no, son del autor. El Marcador se gasta igual.</p>
    <div class="lista">${bot.map((b, k) => `<button type="button" class="opcion" data-k="${k}"><span>${textoOp(b)}</span><b class="nec si">Refutar</b></button>`).join("")}</div>`,
    alAbrir: (capa, cerrar) => capa.querySelectorAll(".opcion").forEach(b => b.onclick = () => cerrar(bot[+b.dataset.k])) });
}

// ---------------------------------------------------------- vista (eventos del motor)
async function vista(tipo, d) {
  if (tipo === "tirada") await mostrarTirada(d, d.jg === YO);
  else if (tipo === "publica") {
    render();
    if (d.jg !== YO) { aviso(`${ficha(d.jg)} <b>${esc(nombreJ(d.jg))}</b> publica <b>${(d.cats || [d.cat]).map(c => CAT_NOMBRE[c]).join(" + ")}</b> en ${esc(d.pl.nombre)}`); await sleep(ui.velocidad); }
  } else if (tipo === "refutacion") {
    render();
    const { x, autor, pl, cat, mid, tirada: t, gana, lectura } = d;
    const pozo = d.pozo || K.PUNTOS[cat];
    const lect = lectura ? `<div class="privado"><p class="tenue">Lo que ve ${esc(MAR[mid].nombre)}:</p><dl class="dato">${Object.entries(lectura).map(([c, v]) => `<dt>${CAMPO[c]}</dt><dd>${esc(v)}</dd>`).join("")}</dl></div>` : "";
    const fp = gana && pl.a.falso ? `<div class="hito-real"><b>¡No había planeta!</b><p>${esc(fraseFalso(pl))}</p></div>` : "";
    const res = gana ? `${fp}<h3>¡Refutado! ${esc(nombreJ(x))} gana +${pozo}</h3>`
      : t.ok ? `<h3>No lo contradice: +${pozo} para ${esc(nombreJ(autor))}</h3>`
      : t.sinDado ? `<h3>Las condiciones de la estrella impiden usar ese Marcador (suman ${sgn(t.mod)}): +${pozo} para ${esc(nombreJ(autor))}</h3>`
      : `<h3>La tirada falla (${t.d}${sgn(t.mod)} vs ${t.cd}): +${pozo} para ${esc(nombreJ(autor))}</h3>`;
    if (gana) (x === YO ? Sfx.victoria() : autor === YO ? Sfx.refutado() : Sfx.toque());
    else if (autor === YO) Sfx.exito(); else if (x === YO) Sfx.fallo();
    await ventana({ titulo: "Refutación", color: "var(--mar)", centro: true, cuerpo: `<p>${ficha(x)} <b>${esc(nombreJ(x))}</b> cuestiona ${CAT_NOMBRE[cat]} de ${ficha(autor)} ${esc(nombreJ(autor))} en ${esc(pl.nombre)} con ${esc(MAR[mid].nombre)}.</p>${lect}${res}` });
  }
}

// ---------------------------------------------------------- render
function render() {
  if (!g) return;
  renderRivales(); renderTablero(); renderHeroe(); renderMano(); renderAcciones();
  if (guia.paso >= 0) requestAnimationFrame(actualizarGuia);
}
function renderRivales() {
  const rivs = g.j.filter(jg => jg.idx !== YO).map(jg => {
    const priv = g.planetas.filter(p => p.desc === jg.idx && p.vivo && p.pubPlaneta === null).length;
    return `<div class="rival ${g.turnoDe === jg.idx && !g.terminado ? "turno" : ""}">
      <div class="avatar" style="background:${COLOR[jg.idx]}">${esc(inicial(jg))}</div>
      <div class="info"><div class="nom">${esc(jg.nombre)}</div><div class="sub">${jg.tec.length + jg.mar.length} cartas · ${priv} privado${priv === 1 ? "" : "s"}</div></div>
      <div class="pts-riv"><span class="pts num" id="pts-${jg.idx}">${g.total(jg)}</span><small>pts</small></div></div>`;
  }).join("");
  const r = Math.min(Math.max(1, g.ronda), g.maxRondas), ultima = !g.terminado && r === g.maxRondas;
  const ronda = g.terminado ? `<span class="r-lbl">Partida</span><b>Terminada</b>`
    : `<span class="r-lbl">${ultima ? "¡Última ronda!" : "Ronda"}</span><b>${r} <small>de ${g.maxRondas}</small></b><span class="r-barra"><i style="width:${(100 * r / g.maxRondas).toFixed(0)}%"></i></span>`;
  $("#rivales").innerHTML = rivs + `<div class="top-dcha"><div class="chip-ronda num ${ultima ? "ultima" : ""}" title="Ronda ${r} de ${g.maxRondas}: todos juegan una vez por ronda">${ronda}</div>
    <div class="fila-iconos"><a class="icono-btn" id="b-opinion" href="${ENCUESTA}" target="_blank" rel="noopener" aria-label="Comentarios y sugerencias" title="Comentarios y sugerencias">${ICO.opinion}</a><button type="button" class="icono-btn" id="b-tuto" aria-label="Tutorial" title="Tutorial">${ICO.ayuda}</button><button type="button" class="icono-btn" id="b-registro" aria-label="Registro público" title="Registro público">${ICO.lista}</button>
    <button type="button" class="icono-btn" id="b-menu" aria-label="Menú" title="Menú">${ICO.menu}</button></div></div>`;
  $("#b-registro").onclick = verRegistro;
  $("#b-menu").onclick = menu;
  $("#b-tuto").onclick = mostrarTutorial;
}
function renderTablero() {
  const activo = ui.fase === "accion" && !ui.ocupado && ui.sel;
  $("#tablero").innerHTML = g.estrellas.map((e, i) => {
    const pls = g.planetas.filter(p => p.est === e);
    const ops = activo ? opcionesEstrella(e) : [];
    const mejor = ops.length ? Math.max(...ops.map(o => o.p)) : null;
    const tags = [DIST_CORTA[e.dist], e.edad === "joven" ? '<span class="tag joven">Joven</span>' : "", e.act === "activa" ? '<span class="tag activa">Activa</span>' : "", e.metal ? '<span class="tag metal">Metálica</span>' : ""];
    const props = propsEstrella(e).map(([cls, t]) => `<span class="prop ${cls}">${t}</span>`).join("");
    const MAXP = 3, visibles = pls.length > MAXP ? pls.slice(0, MAXP - 1) : pls;
    const dots = visibles.map(pl => {
      const dueño = pl.pubPlaneta !== null ? pl.pubPlaneta : pl.desc;
      const op = activo ? ops.find(o => o.pl === pl) : null;
      return `<span class="pl-dot ${pl.vivo ? "" : "muerto"} ${pl.pubPlaneta === null && pl.desc !== YO ? "priv-rival" : ""} ${op ? "objetivo" : ""}" data-pl="${pl.id}" role="button" tabindex="0">
        <span class="bola" style="background:${COLOR[dueño]}">${pl.pubPlaneta === null ? "?" : pl.confirmado ? "✓" : ""}</span><span class="pl-nom">${esc(pl.nombre)}</span>${tecsCortas(pl)}${op && ui.ayudas ? `<span class="pct">${pct(op.p)}</span>` : ""}</span>`;
    }).join("");
    const extra = pls.length > MAXP ? `<span class="pl-dot mas" title="Toca la estrella para ver todos">+${pls.length - visibles.length}</span>` : "";
    return `<div class="est ${activo ? (ui.ayudas || ui.tutorial ? (ops.length ? "objetivo" : "apagada") : "elegible") : ""}" data-est="${i}" role="button" tabindex="0" aria-label="Estrella ${esc(e.cl)}">
      <div class="est-cab"><span class="sol" style="background:${LUZ[e.cl[0]]};color:${LUZ[e.cl[0]]}"></span><span class="est-cl">${esc(e.cl)}</span>
        <span class="prop tam">${tamEstrella(e.m)}</span></div>
      <div class="props">${props}</div>
      <div class="planetas">${dots}${extra}</div>
      ${ui.ayudas && mejor !== null && ops.some(o => !o.pl) ? `<span class="pct">${pct(ops.find(o => !o.pl).p)}</span>` : ""}
    </div>`;
  }).join("");
  $("#tablero").querySelectorAll(".est").forEach(b => b.onclick = ev => {
    const dot = ev.target.closest(".pl-dot");
    if (dot) return tocarPlaneta(g.planetas.find(p => p.id === +dot.dataset.pl));
    tocarEstrella(+b.dataset.est);
  });
  $("#tablero").querySelectorAll(".est, .pl-dot").forEach(b => b.onkeydown = ev => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault(); ev.stopPropagation();
    if (b.classList.contains("pl-dot")) tocarPlaneta(g.planetas.find(p => p.id === +b.dataset.pl)); else tocarEstrella(+b.dataset.est);
  });
}
function puesto(jg) {
  const t = g.total(jg), mejores = g.j.filter(x => g.total(x) > t).length, empate = g.j.some(x => x !== jg && g.total(x) === t);
  return `${mejores + 1}.º de ${g.j.length}${empate ? " (empate)" : ""}`;
}
function renderHeroe() {
  const jg = J();
  $("#heroe").className = "heroe" + (g.turnoDe === YO && !g.terminado ? " turno" : "");
  $("#heroe").innerHTML = `<div class="avatar" style="background:${COLOR[YO]}">${esc(inicial(jg))}</div>
    <div class="info"><div class="nom">${esc(jg.nombre)} <small>${esc(CIEN[jg.cient].nombre)}</small></div>
      <div class="habs">${habilidades(jg.cient).map(h => `<span class="hab">${esc(h)}</span>`).join("")}</div></div>
    <div class="mis-pts"><span class="m-lbl">Tus puntos</span><span class="pts num" id="pts-${YO}">${g.total(jg)}</span><span class="m-pos">${puesto(jg)}</span></div>
    <button type="button" class="icono-btn" id="b-cuaderno" aria-label="Tu cuaderno" title="Tu cuaderno">${ICO.libro}</button>`;
  $("#b-cuaderno").onclick = verCuaderno;
}
// Para qué sirve cada carta, en 2-3 palabras (va en la cara de la carta)
const CORTO = {
  transito: "radio y período", rv: "masa mínima", astro: "solo: estrellas cercanas",
  imagen: "solo: estrellas jóvenes", micro: "solo: estrellas lejanas",
  densidad: "¿roca o gas?", esp_transito: "lee gases", esp_emision: "¿tiene aire?", esp_imagen: "lee gases", contexto: "¿señal falsa?",
};
// Dónde se puede usar cada técnica (información principal de la carta: se puede o no, sin "mejor")
const USO = {
  transito: "todas las estrellas (en las F grandes solo ve Gigantes)",
  rv: "estrellas que no sean lejanas, salvo las F más masivas",
  astro: "solo estrellas cercanas",
  imagen: "solo estrellas jóvenes",
  micro: "solo estrellas lejanas, una vez por estrella",
};
// ---------------------------------------------------------- modo tutorial: qué conviene hacer ahora (una frase)
function consejo() {
  const jg = J();
  const mios = g.planetas.filter(p => p.vivo && p.desc === YO), abiertos = g.planetas.filter(p => p.vivo && p.desc !== YO && p.abierto);
  for (const pl of [...mios, ...abiertos]) for (const mid of new Set(jg.mar)) {
    if (!g.puedeInvestigar(jg, mid, pl)) continue;
    if (!sirveLista(mid, pl).some(c => !(c in pl.publicado)) && mid !== "densidad") continue;
    return `Tienes un <b>Marcador</b> que sirve en <b>${esc(pl.nombre)}</b>: toca <b>${esc(MAR[mid].nombre)}</b> y después el planeta, para averiguar de qué está hecho.`;
  }
  for (const pl of mios) if (!pl.confirmado) for (const t of new Set(jg.tec)) if (g.puedeMedir(jg, t, pl))
    return `Mide <b>${esc(pl.nombre)}</b> con <b>${esc(TEC[t].nombre)}</b>: una segunda técnica lo confirma (+${K.CONF - K.CAND}) o delata si era un falso positivo.`;
  const tecs = [...new Set(jg.tec)].map(t => [t, g.estrellas.filter(e => g.puedeDescubrir(jg, t, e)).length]).filter(([, n]) => n).sort((a, b) => b[1] - a[1]);
  if (tecs.length) { const t = tecs[0][0];
    return `Busca un planeta: toca <b>${esc(TEC[t].nombre)}</b> y después una estrella que brille. Se usa en: ${esc(USO[t])}.`; }
  return "Ninguna de tus cartas sirve ahora: toca el <b>Telescopio</b> para cambiarlas por otras.";
}
// Modo tutorial: todas las opciones de este turno, la recomendada primero
function opcionesTurno() {
  // cada opción: [texto largo (si es la recomendada), texto corto]
  const jg = J(), inv = [], med = [];
  const mios = g.planetas.filter(p => p.vivo && p.desc === YO), abiertos = g.planetas.filter(p => p.vivo && p.desc !== YO && p.abierto);
  for (const pl of [...mios, ...abiertos]) for (const mid of new Set(jg.mar))
    if (g.puedeInvestigar(jg, mid, pl) && (mid === "densidad" || sirveLista(mid, pl).some(c => !(c in pl.publicado))) && !inv.some(x => x.pl === pl))
      inv.push({ pl, largo: `<b>Investigar</b> ${esc(pl.nombre)}: toca el Marcador <b>${esc(MAR[mid].nombre)}</b> y después el planeta, para averiguar de qué está hecho.`,
        corto: `<b>Investigar</b> ${esc(pl.nombre)} (${esc(MAR[mid].nombre)})` });
  for (const pl of mios) if (!pl.confirmado && !med.length) for (const t of new Set(jg.tec)) if (g.puedeMedir(jg, t, pl) && !med.length)
    med.push({ largo: `<b>Medir</b> ${esc(pl.nombre)}: toca <b>${esc(TEC[t].nombre)}</b> y después el planeta; una segunda técnica lo confirma (+${K.CONF - K.CAND}).`,
      corto: `<b>Medir</b> ${esc(pl.nombre)} (${esc(TEC[t].nombre)}) para confirmarlo` });
  const tecs = [...new Set(jg.tec)].filter(t => g.estrellas.some(e => g.puedeDescubrir(jg, t, e)));
  const desc = tecs.length ? [{ largo: `<b>Buscar un planeta nuevo</b>: toca <b>${esc(TEC[tecs[0]].nombre)}</b> y después una estrella que brille.`,
    corto: `<b>Buscar planeta</b> (${tecs.map(t => esc(TEC[t].nombre)).join(", ")})` }] : [];
  const tel = { largo: "Ninguna carta sirve ahora: toca el <b>Telescopio</b> para cambiarlas (usa tu turno).", corto: "<b>Telescopio</b>: cambiar cartas" };
  const todas = [...inv.slice(0, 2), ...med, ...desc].slice(0, 3);
  return (todas.length ? [...todas, tel] : [tel]).map((o, k) => k === 0 ? o.largo : o.corto);
}
function listaOpciones(titulo, items) {
  return `<span class="opciones-t"><b class="ot-tit">${titulo}</b>${items.map((x, k) => `<span class="ot-op ${k === 0 ? "rec" : ""}">${k === 0 ? "★ " : "· "}${x}</span>`).join("")}</span>`;
}
// tutorial: qué dice tu lectura de cada publicación posible (en palabras, sin porcentajes)
function evaluarPublicacion(o) {
  if (o.art) return "";
  if (o.cat === "planeta") return o.pl.confirmado ? `<br><small class="ev si">✓ Confirmado: es un planeta real.</small>` : `<br><small class="ev duda">? Sin confirmar: podría ser un falso positivo.</small>`;
  const p = g.prob(J(), o.pl, o.cat);
  return p >= 0.99 ? `<br><small class="ev si">✓ Tu lectura lo confirma: nadie podrá refutarlo.</small>`
    : p <= 0.01 ? `<br><small class="ev no">✕ Tu lectura no lo respalda: te refutarían.</small>`
    : `<br><small class="ev duda">? Tu lectura no alcanza para estar seguro.</small>`;
}
function consejoPublicar() {
  const ops = publicables();
  ui.pubConviene = false;
  if (!ops.length) return "Nada para publicar todavía: toca <b>Terminar turno</b>.";
  const cats = ops.filter(o => CATS.includes(o.cat));
  if (cats.length) {
    // en el tutorial se interpreta la lectura en palabras (sin porcentajes): cuál conviene y cuál no
    const jg = J(), val = o => g.prob(jg, o.pl, o.cat);
    const o = cats.slice().sort((a, b) => val(b) * b.pts - val(a) * a.pts)[0], p = val(o);
    const que = `<b>${esc(CAT_NOMBRE[o.cat])}</b> en ${esc(o.pl.nombre)} (+${o.pts})`;
    if ((o.cat === "atmosfera" && o.nota) || p >= 0.99) ui.pubConviene = true;
    if (o.cat === "atmosfera" && o.nota) return `Todo gigante gaseoso tiene atmósfera: puedes publicar ${que}. Solo pierdes si el planeta era un falso positivo.`;
    if (p >= 0.99) return `Tu lectura confirma ${que}: <b>publícalo</b>. Nadie podrá refutarlo.`;
    if (p <= 0.01) return `Puedes publicar ${que}, pero tu lectura <b>no lo respalda</b>: si lo haces, un rival puede refutarte y llevarse los puntos. Mejor <b>Terminar turno</b>.`;
    return `Puedes publicar ${que}, pero tu lectura <b>no alcanza para estar seguro</b>: podría ser una imitación. Arriesgas que un rival te refute; otro Marcador (como el Contexto) te sacaría la duda.`;
  }
  const pl = ops.find(o => o.cat === "planeta").pl;
  ui.pubConviene = true;
  return pl.confirmado ? `<b>${esc(pl.nombre)}</b> está confirmado: <b>publícalo</b> sin miedo (+${K.CONF}).`
    : `Puedes <b>publicar</b> ${esc(pl.nombre)} (+${K.CAND}), pero si resulta un falso positivo pierdes esos puntos. Confirmarlo antes con otra técnica es más seguro.`;
}
const NOMBRE_CARTA = { densidad: "Densidad", esp_imagen: "Espectro de imagen" };   // nombres cortos para la cara de la carta
function cartaHTML(tipo, id, attrs = "", clase = "", extra = "") {
  const c = { ...(tipo === "tec" ? TEC[id] : MAR[id]) };
  if (NOMBRE_CARTA[id]) c.nombre = NOMBRE_CARTA[id];
  return `<button type="button" class="carta ${tipo} ${clase}" ${attrs}>${extra}<span class="tipo"><span class="ico">${tipo === "tec" ? ICO.ojo : ICO.prisma}</span>${tipo === "tec" ? "Técnica" : "Marcador"}</span><span class="nombre">${esc(c.nombre)}</span><span class="lee">${esc(CORTO[id] || "")}</span></button>`;
}
function manoCartas() { const jg = J(); return [...jg.tec.map(id => ({ tipo: "tec", id })), ...jg.mar.map(id => ({ tipo: "mar", id }))]; }
// Mejor chance de cada carta ahora mismo (para saber cuándo conviene usarla)
function mejorUso(c) {
  let mejor = null;
  for (const e of g.estrellas) for (const o of opcionesEstrella(e, c)) if (!mejor || o.p > mejor.p) mejor = { ...o, est: e };
  return mejor;
}
function renderMano() {
  const cartas = manoCartas(), n = cartas.length;
  const chances = ui.fase === "accion" && !ui.ocupado && ui.ayudas;
  $("#mano").innerHTML = cartas.map((c, i) => cartaHTML(c.tipo, c.id, `data-i="${i}" style="--rot:${((i - (n - 1) / 2) * 3.5).toFixed(1)}deg"`,
    (ui.sel && ui.sel.i === i ? "sel " : "") + (ui.fase === "descartar" ? "descartar" : "")
      + (ui.tutorial && ui.fase === "accion" && !ui.ocupado && !ui.sel ? (mejorUso(c) ? " util" : " inutil") : ""),
    chances ? (u => u ? `<span class="chance ${u.p >= .7 ? "alta" : u.p >= .45 ? "media" : "baja"}" title="Chance ahora">${pct(u.p)}</span>` : `<span class="chance no" title="Ahora no tiene dónde usarse">—</span>`)(mejorUso(c)) : "")).join("");
  $("#mano").querySelectorAll(".carta").forEach(b => b.onclick = () => {
    const i = +b.dataset.i, c = cartas[i];
    if (ui.fase === "descartar" && ui.esperando.descarte) { resolver("descarte", { tipo: c.tipo, id: c.id }); return; }
    if (ui.fase === "accion" && !ui.ocupado && guia.paso >= 0 && GUIA[guia.paso] && GUIA[guia.paso].soloTec && c.tipo !== "tec") {
      Sfx.fallo(); aviso("Esa es un <b>Marcador</b>. Ahora toca una carta de <b>Técnica</b> (las celestes)."); return; }
    if (ui.fase === "accion" && !ui.ocupado) { ui.sel = ui.sel && ui.sel.i === i ? null : { ...c, i }; ui.sel ? Sfx.elegir() : Sfx.toque(); render(); return; }
    detalleCarta(c);
  });
}
const RESUMEN_MAR = {   // [qué lees, qué publicas, cuándo se puede]
  densidad: ["si es roca, agua o gas", "Habitable (y Atmósfera en gigantes)", "solo con Tránsito debajo"],
  esp_transito: ["atmósfera y gases", "Atmósfera, Biofirma", "con Tránsito; si es Pequeño, solo enana M"],
  esp_emision: ["su calor: ¿tiene aire?", "Atmósfera, Habitable", "solo planetas Calientes"],
  esp_imagen: ["atmósfera y gases", "Atmósfera, Biofirma", "con Imagen o en Gigante Frío cercano"],
  contexto: ["si la señal puede ser falsa", "Biofirma", "con un espectro de gases tuyo ahí"],
};
// Resumen corto de qué hace una carta, para leerlo antes de jugarla (dos líneas: entra en teléfonos)
function resumenCarta(c, paso) {
  const corta = t => esc(textoPlano(t)).replace(/\.$/, "");
  const nombre = (c.tipo === "tec" ? TEC : MAR)[c.id].nombre;
  let txt, lee;
  if (c.tipo === "tec") {
    const t = TEC[c.id];
    txt = `<b>Se usa en: ${esc(USO[c.id])}</b>`;
    lee = corta(t.real);
  } else {
    const m = MAR[c.id], r = RESUMEN_MAR[c.id];
    txt = r ? `Lees ${esc(r[0])} · publicas ${esc(r[1])}` : `Lees ${corta(m.revela)}`;
    lee = r ? esc(r[2]).replace(/^./, x => x.toUpperCase()) : (m.publica ? `Publicas ${corta(m.publica)}` : "");
  }
  return `<span class="carta-grande ${c.tipo}" id="carta-grande" role="button" tabindex="0" title="Ver la carta completa">
    <span class="cg-tipo">${c.tipo === "tec" ? "Técnica" : "Marcador"}</span><span class="cg-nom">${esc(nombre)}</span>
    <span class="cg-txt">${txt}</span>${lee ? `<span class="cg-lee">${lee}</span>` : ""}</span>${paso}`;
}
function renderAcciones() {
  const jg = J();
  let msg = "", btns = "";
  const robar = `<button type="button" class="btn-juego azul" data-robar="tec">Técnica<small>${g.mt.cartas.length} en mazo</small></button>
    <button type="button" class="btn-juego violeta" data-robar="mar">Marcador<small>${g.mm.cartas.length} en mazo</small></button>`;
  if (g.terminado) { msg = "La partida terminó."; btns = '<button type="button" class="btn-juego" id="b-final">Resultado</button>'; }
  else if (ui.ocupado) msg = "…";
  else if (ui.fase === "accion") {
    if (ui.sel) {
      const n = g.estrellas.reduce((s, e) => s + opcionesEstrella(e).length, 0);
      msg = resumenCarta(ui.sel, `<span class="paso">${!ui.tutorial ? "Ahora toca una estrella o un planeta"
        : n ? `Toca una de las estrellas que brillan (${n === 1 ? "hay 1 jugada posible" : `hay ${n} jugadas posibles`}), o toca la carta otra vez para soltarla`
        : "Esta carta no sirve ahora en ninguna estrella: tócala otra vez y elige otra, o usa el Telescopio"}</span>`);
    } else msg = ui.tutorial ? listaOpciones("Tu turno: elige UNA de estas opciones", opcionesTurno()) : "<b>Tu turno:</b> toca una carta, o pide Telescopio";
  } else if (ui.fase === "post" && !K.ROBO) {
    const n = publicables().length;
    msg = ui.tutorial ? (() => { const c = consejoPublicar();
        if (!n) return listaOpciones("Final del turno", [c]);
        return ui.pubConviene ? listaOpciones("Final del turno", [c, "<b>Terminar turno</b> sin publicar"])
          : listaOpciones("Final del turno", ["<b>Terminar turno</b>: le toca al rival.", c]); })()
      : n ? "Final del turno: <b>publica</b> lo que descubriste, o termina" : "Final del turno: no tienes nada para publicar";
    btns = `<button type="button" class="btn-pub" id="b-pub" ${n ? "" : "disabled"}>Publicar${n ? `<span class="insignia">${n}</span>` : ""}</button>
      <button type="button" class="btn-juego ${n ? "gris" : ""}" id="b-fin">Terminar turno</button>`;
  }
  else if (ui.fase === "post") { msg = `Publica si quieres. Después <b>roba ${K.ROBO === 1 ? "1 carta" : K.ROBO}</b>`; btns = robar; }
  else if (ui.fase === "robar") { msg = "Roba <b>1 más</b>"; btns = robar; }
  else if (ui.fase === "descartar") msg = `Tienes ${jg.tec.length + jg.mar.length} cartas: <b>toca una para descartar</b>`;
  else msg = ui.tutorial ? `Juega <b>${esc(nombreJ(g.turnoDe))}</b>: mira el cielo para ver qué hace…` : `Juega <b>${esc(nombreJ(g.turnoDe))}</b>…`;
  $("#msg").innerHTML = msg;
  $("#msg").classList.toggle("con-carta", !!$("#carta-grande"));
  const cg = $("#carta-grande"); if (cg) cg.onclick = () => ui.sel && detalleCarta(ui.sel);
  const bt = $("#b-tel"); bt.disabled = !(ui.fase === "accion" && !ui.ocupado && !g.terminado);
  if (!bt.querySelector("svg")) bt.querySelector(".mt-ico").innerHTML = ICO.tele;
  $("#app").classList.toggle("eligiendo", ui.fase === "accion" && !!ui.sel && !ui.ocupado);
  $("#msg").classList.toggle("mio", !g.terminado && !ui.ocupado && ["accion", "post", "robar", "descartar"].includes(ui.fase));
  $("#acciones").innerHTML = btns;
  $("#b-tel").onclick = hacerTelescopio;
  const fin = $("#b-fin"); if (fin) fin.onclick = () => { if (!ui.ocupado) resolver("fin"); };
  const pb = $("#b-pub"); if (pb) pb.onclick = abrirPublicar;
  const f = $("#b-final"); if (f) f.onclick = mostrarFinal;
  document.querySelectorAll("[data-robar]").forEach(b => b.onclick = () => { if (ui.esperando.mazo && !ui.ocupado) resolver("mazo", b.dataset.robar); });
}

// ---------------------------------------------------------- hojas de información
function detalleCarta(c) {
  if (c.tipo === "tec") {
    const t = TEC[c.id];
    return ventana({ titulo: esc(t.nombre), color: "var(--tec-2)", botones: [], cuerpo: `
      <p class="uso-tec"><b>Se usa en:</b> ${esc(USO[t.id])}.</p>
      <p><b>Cómo funciona:</b> ${esc(textoPlano(t.real))}</p>
      <p><b>Te da:</b> ${esc(textoPlano(t.aporta))}</p><p><b>Al descubrir:</b> ${t.sesgo}</p><p><b>Límite:</b> ${t.limite}</p>
      <p class="tenue">No hay «mejor» ni «peor»: en cada estrella la técnica se puede usar (✓) o no (✕). Toca una estrella para ver por qué.</p>
      <p><b>Para medir:</b> sobre un planeta tuyo o publicado que no la tenga: agrega su dato. Dos técnicas distintas lo confirman (+${K.CONF - K.CAND} para quien lo publicó).</p>
      <p><b>Ojo:</b> la señal puede ser un <b>falso positivo</b>. Confírmala con otra técnica o una Densidad antes de publicar.</p>
      ${t.id === "astro" ? `<p><b>Masa real:</b> si tu planeta tiene también Tránsito o Densidad, +${K.MASA}.</p>` : ""}
` });
  }
  const m = MAR[c.id];
  return ventana({ titulo: esc(m.nombre), color: "var(--mar-2)", botones: [], cuerpo: `
    <p><b>Requisito:</b> ${m.req} Si lo cumple, funciona: no hay dado.</p>
    <p><b>Lees:</b> ${m.revela}.<br><b>Te sirve para publicar:</b> ${esc(m.publica)}.</p>
    <p><b>En un falso positivo</b> no lees nada; la Densidad lo delata.</p>
    <p><b>Refuta</b> (si tu lectura lo contradice, aunque el autor haya usado este método): ${m.refuta.map(x => CAT_NOMBRE[x]).join(", ") || "nada"}.</p>
    <p class="tenue"><i>${esc(m.real)}</i></p>` });
}
function detalleEstrella(e) {
  const pls = g.planetas.filter(p => p.est === e);
  ventana({ titulo: `Estrella ${esc(e.cl)}`, color: "var(--est)", botones: [], cuerpo: `
    ${datosEstrellaHTML(e)}${e.micro ? '<p class="tenue">Microlente ya usada aquí.</p>' : ""}
    <p>${e.texto}</p>
    <p class="tenue">Admite hasta ${K.MAX_PL} planetas${g.llena(e) ? ": ya está completa" : ""}.</p>
    <h3>Qué técnica se puede usar aquí</h3>
    <div class="lista">${ORDEN_TEC.map(t => { const ok = e.bono[t] !== null, rz = explicarEstrella(t, e).filter(([v]) => ok ? v >= 0 : v < 0).map(([, x]) => esc(x)); return `<div class="fila-bono ${ok ? "pos" : "no"}"><b>${ok ? "✓" : "✕"}</b><span><b class="que">${esc(TEC[t].nombre)}</b><small>${rz.join(" · ") || esc(textoPlano(TEC[t].limite))}</small></span></div>`; }).join("")}</div>
    ${pls.length ? `<div class="lista">${pls.map(p => `<button type="button" class="fila" data-pl="${p.id}"><span>${ficha(p.pubPlaneta !== null ? p.pubPlaneta : p.desc)} ${esc(p.nombre)} · ${esc(tamTemp(p))}</span><span class="tenue">${esc(estado(p))}</span></button>`).join("")}</div>` : '<p class="tenue">Sin planetas conocidos.</p>'}`,
    alAbrir: (capa, cerrar) => capa.querySelectorAll("[data-pl]").forEach(b => b.onclick = () => { cerrar(null); abrirPlaneta(g.planetas.find(p => p.id === +b.dataset.pl)); }) });
}
function verCuaderno() {
  const jg = J();
  const mios = g.planetas.filter(p => p.desc === YO || Object.keys(g.sabe(jg, p)).length);
  ventana({ titulo: "Tu cuaderno", color: "var(--hito)", botones: [], cuerpo: mios.length ? `<div class="lista">${mios.map(pl => {
    const sabe = { ...pl.publico, ...g.sabe(jg, pl) };
    return `<button type="button" class="fila" data-pl="${pl.id}" style="display:grid;justify-content:stretch;gap:2px">
      <span><b>${esc(pl.nombre)}</b> · ${esc(tamTemp(pl))} · <span class="tenue">${esc(estado(pl))}</span></span>
      <span class="tenue">${Object.entries(sabe).map(([c, v]) => `${CAMPO[c]}: ${esc(fmtCampo(c, v))}`).join(" · ")}</span></button>`;
  }).join("")}</div>` : '<p>Aquí quedan tus candidatos privados y lo que lees de cada planeta.</p>',
    alAbrir: (capa, cerrar) => capa.querySelectorAll("[data-pl]").forEach(b => b.onclick = () => { cerrar(null); abrirPlaneta(g.planetas.find(p => p.id === +b.dataset.pl)); }) });
}
function verRegistro() {
  const pubs = g.planetas.filter(p => p.pubPlaneta !== null).reverse();
  const hitos = D.hitos.map(h => `<tr><td>${esc(h.nombre)} <span class="tenue">+${h.pts}</span><br><span class="tenue">${esc(h.cond)}</span></td><td>${h.id in g.hitos ? `${ficha(g.hitos[h.id])} ${esc(nombreJ(g.hitos[h.id]))}` : "libre"}</td></tr>`).join("");
  ventana({ titulo: "Registro público", color: "var(--est)", botones: [], cuerpo: `
    ${pubs.length ? `<div class="lista">${pubs.map(pl => `<button type="button" class="fila" data-pl="${pl.id}" style="display:grid;justify-content:stretch;gap:2px">
      <span>${ficha(pl.pubPlaneta)} <b>${esc(pl.nombre)}</b> · ${esc(tamTemp(pl))}${pl.confirmado ? " · confirmado" : ""}${pl.vivo ? "" : " · falso positivo"}</span>
      <span class="tenue">${CATS.filter(c => c in pl.publicado).map(c => `${CAT_NOMBRE[c]}: ${pl.publicado[c].estado === "anulada" ? "refutada" : esc(nombreJ(pl.publicado[c].autor))}`).join(" · ") || "sin hallazgos publicados"}</span></button>`).join("")}</div>` : '<p class="tenue">Todavía no hay planetas publicados.</p>'}
    <h3>Hitos</h3><table class="tabla">${hitos}</table>`,
    alAbrir: (capa, cerrar) => capa.querySelectorAll("[data-pl]").forEach(b => b.onclick = () => { cerrar(null); abrirPlaneta(g.planetas.find(p => p.id === +b.dataset.pl)); }) });
}
function verBitacora() {
  ventana({ titulo: "Bitácora", color: "var(--est)", botones: [], cuerpo: `<div class="bitacora">${ui.log.slice(-120).reverse().map(l => `<p class="${l.tipo || ""}" style="border-color:${l.jg !== undefined ? COLOR[l.jg] : "transparent"}">${esc(l.txt)}</p>`).join("") || '<p>La partida empieza.</p>'}</div>` });
}
const ENCUESTA = "https://forms.gle/pgQcx6WgMZ1TdTi26";   // comentarios y sugerencias
const BOTON_ENCUESTA = `<a class="opcion encuesta" href="${ENCUESTA}" target="_blank" rel="noopener"><span>Comentarios y sugerencias</span><b>↗</b></a>`;
const MENU_SITIO = (document.querySelector('meta[name="sitio-menu"]') || {}).content || "";
const CREDITO = `<p class="credito">Desarrollado por <b>Luca Sallé</b><br>en el Observatorio Astronómico de Montevideo</p>`;
async function menu() {
  const v = await ventana({ titulo: "Menú", color: "var(--est)", botones: [], cuerpo: `<div class="lista">
    <button type="button" class="opcion" data-v="bitacora"><span>Bitácora de la partida</span></button>
    <button type="button" class="opcion" data-v="tutorial"><span>Tutorial</span></button>
    <button type="button" class="opcion" data-v="reglas"><span>Cómo se juega</span></button>
    <button type="button" class="opcion" data-v="sonido"><span>Sonido</span><b>${Sfx.activo ? "Activado" : "Apagado"}</b></button>
    <button type="button" class="opcion" data-v="nueva"><span>Nueva partida</span></button>${MENU_SITIO ? `<a class="opcion" href="${MENU_SITIO}"><span>Volver a los juegos</span></a>` : ""}</div>${CREDITO}`,
    alAbrir: (capa, cerrar) => capa.querySelectorAll("[data-v]").forEach(b => b.onclick = () => cerrar(b.dataset.v)) });
  if (v === "bitacora") verBitacora();
  if (v === "reglas") mostrarReglas();
  if (v === "tutorial") mostrarTutorial();
  if (v === "nueva") nuevaPartida();
  if (v === "sonido") { const on = Sfx.alternar(); aviso(on ? "Sonido activado" : "Sonido apagado"); }
}
async function abrirPlaneta(pl) {
  const jg = J();
  const rivalPriv = pl.pubPlaneta === null && pl.desc !== YO;
  const pub = Object.entries(pl.publico);
  const sabe = Object.entries(g.sabe(jg, pl)).filter(([c]) => !(c in pl.publico));
  const metodos = [...pl.tecnicas.map(t => (t === "densidad" ? "Densidad" : TEC[t].nombre)), ...pl.marcadores.map(m => `${MAR[m.mid].nombre} (${nombreJ(m.jg)}${m.ok ? "" : ", no concl."})`)];
  const puede = !ui.ocupado && ui.fase === "post";
  const ops = publicables().filter(o => o.pl === pl);
  let ayuda = "";
  if (ui.ayudas && !rivalPriv && pl.vivo) {
    const cands = g.candidatos(jg, pl), cuenta = {};
    cands.forEach(a => cuenta[a.arq] = (cuenta[a.arq] || 0) + 1);
    ayuda = `<div class="sec"><h3>Podría ser</h3><div class="cands">${Object.entries(cuenta).map(([n, k]) => `<span>${esc(n)}${k > 1 ? ` ×${k}` : ""}</span>`).join("")}</div>
      <p class="tenue">Atmósfera ${pct(g.prob(jg, pl, "atmosfera"))} · Habitable ${pct(g.prob(jg, pl, "habitable"))} · Biofirma ${pct(g.prob(jg, pl, "biofirma"))}</p></div>`;
  }
  const v = await ventana({ titulo: `${esc(pl.nombre)} · ${esc(tamTemp(pl))}`, color: "var(--pla)", botones: [], cuerpo: `
    <p>${ficha(pl.pubPlaneta !== null ? pl.pubPlaneta : pl.desc)} ${esc(estado(pl))}</p>
    <p class="pl-metodo"><b>Descubierto con ${esc(nombreTec(pl.tecnicas[0]))}</b>${new Set(pl.tecnicas).size > 1 ? ` · medido también con ${esc([...new Set(pl.tecnicas.slice(1))].filter(t => t !== pl.tecnicas[0]).map(nombreTec).join(", "))}` : ""}</p>
    ${rivalPriv ? "<p>Candidato privado: solo su descubridor conoce sus datos.</p>" : `
    <div class="sec"><h3>Datos públicos</h3>${pub.length ? `<dl class="dato">${pub.map(([c, v]) => `<dt>${CAMPO[c]}</dt><dd>${esc(fmtCampo(c, v))}</dd>`).join("")}</dl>` : '<p class="tenue">Sin datos públicos.</p>'}
      <p class="tenue">Métodos: ${esc(metodos.join(" · ") || "—")}</p></div>
    ${sabe.length ? `<div class="sec privado"><h3>Solo tú sabes</h3><dl class="dato">${sabe.map(([c, v]) => `<dt>${CAMPO[c]}</dt><dd>${esc(fmtCampo(c, v))}</dd>`).join("")}</dl></div>` : ""}
    ${CATS.some(c => c in pl.publicado) ? `<p>${CATS.filter(c => c in pl.publicado).map(c => `${CAT_NOMBRE[c]}: ${pl.publicado[c].estado === "anulada" ? "refutada" : esc(nombreJ(pl.publicado[c].autor))}`).join(" · ")}</p>` : ""}
    ${ayuda}
    ${ops.length ? `<div class="lista">${ops.map((o, k) => `<button type="button" class="pub-btn" data-k="${k}" ${puede ? "" : "disabled"}><span>Publicar ${esc(o.cat === "planeta" ? "el planeta" : o.art ? `artículo (${o.cats.map(c => CAT_NOMBRE[c]).join(" + ")})` : CAT_NOMBRE[o.cat])}</span><b>+${o.pts}</b></button>`).join("")}</div>` : ""}`}`,
    alAbrir: (capa, cerrar) => capa.querySelectorAll(".pub-btn").forEach(b => b.onclick = () => cerrar(ops[+b.dataset.k])) });
  if (v) publicarHumano(v.pl, v.cat, v.cats);
}

// ---------------------------------------------------------- final y reglas
async function mostrarFinal() {
  const gan = g.ranking[0];
  const filas = g.ranking.map((jg, k) => {
    const det = Object.entries(jg.pts).filter(([, v]) => v).map(([c, v]) => `${c.replace("_", " ")} ${sgn(v)}`).join(" · ");
    return `<tr><td>${k + 1}.</td><td>${ficha(jg.idx)} ${esc(jg.nombre)}<br><span class="tenue">${esc(det)}</span></td><td class="num"><b>${g.total(jg)}</b></td></tr>`;
  }).join("");
  const planetas = g.planetas.map(pl => `<tr><td>${esc(pl.nombre)}</td><td>${esc(pl.a.arq)}</td><td>${pl.a.falso ? "No hay planeta" : `Atm. ${pl.a.atmOk ? "sí" : "no"} · Hab. ${esc(pl.a.hab)} · Vida ${esc(pl.a.vida)}`}</td></tr>`).join("");
  if (gan.idx === YO) { banner("¡VICTORIA!", "tu equipo tiene la mayor reputación"); Sfx.victoria(); } else Sfx.derrota();
  const v = await ventana({ titulo: gan.idx === YO ? "¡Ganaste!" : `Gana ${esc(gan.nombre)}`, color: "var(--hito)", cuerpo: `
    <table class="tabla">${filas}</table>
    <p class="tenue">¿Qué te pareció el juego? Tu opinión ayuda a mejorarlo.</p><div class="lista">${BOTON_ENCUESTA}</div>
    <h3>La Verdad de cada planeta</h3><div style="overflow-x:auto"><table class="tabla"><tr><th>Planeta</th><th>Era</th><th>Verdad</th></tr>${planetas || '<tr><td colspan="3">No se descubrieron planetas.</td></tr>'}</table></div>`,
    botones: [{ txt: "Cerrar", valor: null, clase: "gris" }, { txt: "Jugar otra", valor: "nueva" }] });
  if (v === "nueva") nuevaPartida();
}
function mostrarReglas() {
  return ventana({ titulo: "Cómo se juega", color: "var(--est)", botones: [{ txt: "¡A jugar!", valor: true }], cuerpo: `
    <p>Diriges un equipo de astrónomos. <b>Objetivo:</b> juntar más puntos (reputación) que los rivales en ${K.RONDAS[3]} rondas (con 3 jugadores). La computadora hace de Director: guarda los planetas y su Verdad.</p>
    <p>Una <b>biofirma</b> es un gas (o una mezcla de gases) en la atmósfera de un planeta que en la Tierra produce la vida, como oxígeno junto con metano. Ojo: algunos procesos sin vida pueden imitarla. Por eso vale tanto y es lo más discutido: el Contexto estelar ayuda a descartar las imitaciones.</p>
    <p><b>El camino:</b> <b>Técnica</b> → descubres un planeta · <b>Marcador</b> → averiguas de qué está hecho · <b>Publicar</b> → ganas los puntos. Publicar el planeta da +${K.CAND}; lo que averiguaste de él, mucho más (tabla de Puntos).</p>
    <h3>Tu turno: una acción</h3>
    <p><b>Técnica + estrella:</b> busca un planeta nuevo, o mide uno tuyo o publicado. Cada estrella dice qué técnicas se pueden usar en ella (✓). No hay dado: el azar está en los <b>falsos positivos</b>, señales que imitan un planeta. Se delatan con una segunda técnica o una Densidad.</p>
    <p><b>Marcador + planeta:</b> investígalo y lee en secreto su densidad, atmósfera, gases o contexto. Esa lectura es la que te <b>permite publicar</b> Habitable o Biofirma (y te dice si es cierto). Cada Marcador tiene un requisito: si el planeta lo cumple, funciona.</p>
    <p><b>Telescopio:</b> gastas tu turno, cambias las cartas que quieras y completas tu mano hasta ${K.MANO_MAX}.</p>
    <p>Al final de tu turno, <b>publica</b>. ${K.ROBO ? `Al final robas ${K.ROBO} (máximo ${K.MANO_MAX} en mano).` : "No se roba al final del turno: las cartas nuevas llegan con el <b>Telescopio</b>."}</p>
    <h3>Puntos</h3>
    <table class="tabla"><tr><td>Planeta</td><td>+${K.CAND} (+${K.CONF - K.CAND} al confirmarlo)</td></tr>
    ${CATS.map(c => `<tr><td>${CAT_NOMBRE[c]}</td><td>+${K.PUNTOS[c]} · necesitas ${Object.keys(SIRVE).filter(m => SIRVE[m].includes(c)).map(m => MAR[m].nombre).join(" o ")}${c === "atmosfera" && K.DENS_ATM ? " (o Densidad, en Neptunianos)" : ""} exitoso tuyo ahí${c === "atmosfera" && K.ATM_GIG ? "; en un Gigante no hace falta" : ""}</td></tr>`).join("")}
    <tr><td>Masa real</td><td>+${K.MASA} · tu planeta tiene Astrometría y Tránsito o Densidad</td></tr>
    <tr><td>Hallazgo inesperado</td><td>+${K.HALL}</td></tr></table>
    <h3>Refutar</h3><p>Cuando alguien publica, un rival puede cuestionarlo con un Marcador, aunque sea del mismo tipo que usó el autor: si mintió, repetir la observación lo delata. Si lo que ve contradice lo publicado, se lleva los puntos.</p>
    <p><b>Artículo:</b> si publicas varias cosas del mismo planeta a la vez, sumas +${K.BONO_ART} por cada una extra, pero se refuta entero: si cae, el rival se lleva todos sus puntos.</p>
    <h3>Científicos</h3><table class="tabla">${D.cientificos.map(c => `<tr><td><b>${esc(c.nombre)}</b><br><span class="tenue">${esc(c.pais || "")}</span></td><td>${habilidades(c.id).map(esc).join(" · ")}</td></tr>`).join("")}</table>
    <h3>Hitos</h3><table class="tabla">${D.hitos.map(h => `<tr><td>${esc(h.nombre)} +${h.pts}</td><td>${esc(h.cond)}</td></tr>`).join("")}</table>
    <p class="tenue">${esc(K.PIE)}</p>` });
}

// ---------------------------------------------------------- partida guardada en el teléfono
// Se guarda al empezar tu turno y después de tu acción; al volver a abrir la página, sigue donde quedó.
const CLAVE_PARTIDA = "exo-partida";
const VERSION = ((document.querySelector('script[src*="ui.js"]') || {}).src || "").split("v=")[1] || "";
function guardarPartida(fase) {
  if (!g || g.terminado) return;
  const tras = fase === "post";                  // tras tu acción el turno ya se contó: al reanudar se vuelve a contar
  if (ui.reanudarPost) fase = "post";             // recuperada en publicar y vuelta a guardar antes de terminar
  const est = g.guardar({ fase });
  if (tras) est.turnos--;
  const datos = { version: VERSION, pref: { ...preferencias, cient: g.j[YO].cient, nombre: g.j[YO].nombre },
    rivales: g.j.filter(x => !x.humano).map(x => ({ nombre: x.nombre, estilo: x.ctrl.estilo, car: x.ctrl.caracter, cient: x.cient })),
    estado: est, log: ui.log.slice(-200) };
  try { localStorage.setItem(CLAVE_PARTIDA, JSON.stringify(datos)); } catch (e) {}
}
function leerPartida() { try { return JSON.parse(localStorage.getItem(CLAVE_PARTIDA) || "null"); } catch (e) { return null; } }
function borrarPartida() { try { localStorage.removeItem(CLAVE_PARTIDA); } catch (e) {} }
// Nueva partida: antes busca en el servidor si hay una versión nueva del juego; si la hay, recarga la página
async function nuevaPartida() {
  if (VERSION && location.protocol.startsWith("http")) {
    try {
      const r = await fetch(location.pathname + "?buscar=" + Date.now(), { cache: "no-store" });
      const nueva = ((await r.text()).match(/ui\.js\?v=([\w.-]+)/) || [])[1];
      if (nueva && nueva !== VERSION) {
        borrarPartida();
        aviso("Hay una versión nueva del juego: actualizando…");
        setTimeout(() => location.replace(location.pathname + "?v=" + nueva), 400);
        return;
      }
    } catch (e) { /* sin conexión: se juega con la versión que hay */ }
  }
  abrirModo();
}

// ---------------------------------------------------------- partida
// técnicas bajo un planeta, abreviadas (la primera es con la que se descubrió): algunos Marcadores las exigen
const TEC_CORTA = { transito: "Tr", rv: "VR", astro: "As", imagen: "Im", micro: "Mi", densidad: "De" };
function nombreTec(t) { return t === "densidad" ? "Densidad" : TEC[t].nombre; }
function tecsCortas(pl) {
  const ts = [...new Set(pl.tecnicas)];
  return ts.length ? `<span class="pl-tec" title="${esc(ts.map(nombreTec).join(", "))}">${ts.map(t => TEC_CORTA[t] || t).join("·")}</span>` : "";
}
const ESTILO_CIENT = { vida: ["seager", "kaltenegger"], explorador: ["borucki", "mayor"], gigantes: ["charbonneau", "marois"], verificador: ["fernandez", "tancredi"] };
function crearJuego(pref, fijos = null) {
  const usados = new Set([pref.cient]);
  const jugadores = [{ nombre: pref.nombre || "Tu equipo", humano: true, cient: pref.cient, ctrl: new Humano() }];
  const estilos = Object.keys(ESTILOS).sort(() => Math.random() - 0.5);
  const tuto = pref.modo === "tutorial";
  if (fijos) for (const r of fijos) jugadores.push({ nombre: r.nombre, estilo: r.estilo, cient: r.cient, ctrl: new Bot(r.estilo, r.car) });
  else for (let i = 0; i < (tuto ? 1 : pref.rivales); i++) {
    const est = estilos[i % estilos.length];
    const car = tuto ? "ingenuo" : est === "verificador" ? "mentiroso" : (Math.random() < 0.5 ? "mentiroso" : "conservador");
    const cid = ESTILO_CIENT[est].find(c => !usados.has(c)) || D.cientificos.find(c => !usados.has(c.id)).id;
    usados.add(cid);
    jugadores.push({ nombre: `Equipo ${CIEN[cid].nombre.split(" y ")[0].split(" ").pop()}`, estilo: est, cient: cid, ctrl: new Bot(est, car) });
  }
  const juego = new Juego({ jugadores, rondas: tuto ? RONDAS_TUTORIAL : undefined });
  juego.alGuardar = fase => { if (juego === g) guardarPartida(fase); };
  ui.hitosPend = [];
  for (const jg of juego.j) if (jg.ctrl instanceof Bot) {
    jg.ctrl.pausa = async () => { if (juego !== g) throw CANCELADO; render(); await mostrarHitos(true); await sleep(ui.velocidad);
      while (guiaVisible()) { await sleep(250); if (juego !== g) throw CANCELADO; } };
    const turnoBot = jg.ctrl.turno.bind(jg.ctrl);       // los hitos del rival, al terminar su turno y con una pausa
    jg.ctrl.turno = async (jj, jgb) => { await turnoBot(jj, jgb); if (juego !== g) throw CANCELADO; render();
      if (ui.hitosPend.some(x => x.jg !== YO)) { await sleep(ui.velocidad * 1.5); await mostrarHitos(); } };
  }
  juego.vista = async (tipo, d) => {
    if (juego !== g) throw CANCELADO;
    try { await vista(tipo, d); await mostrarHitos(true); } catch (e) { console.error(e); }
    if (juego !== g) throw CANCELADO;
  };
  juego.on((tipo, d) => {
    if (juego !== g) return;
    if (tipo === "log") ui.log.push(d);
    if (tipo === "puntos") { setTimeout(() => flotante(d.jg, d.v), 30); }
    if (tipo === "hito") ui.hitosPend.push(d);
    if (tipo === "hallazgo") ui.hitosPend.push({ hall: true, jg: d.jg, h: d.h, est: d.est });
    if (tipo === "falso" && d.jg !== YO) aviso(`${ficha(d.jg)} <b>${esc(nombreJ(d.jg))}</b> descubre que ${esc(d.pl.nombre)} era un falso positivo: ${esc(d.frase)}`, "hito");
    if (tipo === "descubre" && d.jg !== YO) aviso(`${ficha(d.jg)} <b>${esc(nombreJ(d.jg))}</b> descubre un candidato en ${esc(d.pl.est.cl)}: ${esc(tamTemp(d.pl))}`);
    if (tipo === "turno" || tipo === "cambio" || tipo === "ronda" || tipo === "puntos") render();
    if (tipo === "ronda") aviso(`Ronda ${d.ronda} de ${juego.maxRondas}`);
  });
  return juego;
}
async function empezar(pref, guardada = null) {
  for (const k of Object.keys(ui.esperando)) delete ui.esperando[k];
  document.querySelectorAll("#capa .velo").forEach(v => v.remove());
  Object.assign(ui, { fase: "espera", sel: null, ocupado: false, log: [], velocidad: +pref.velocidad, ayudas: false, reanudarPost: false,
    tutorial: pref.modo === "tutorial" });   // nunca se muestran porcentajes: se elige por los datos
  if (guardada) {
    g = crearJuego(pref, guardada.rivales);
    g.restaurar(guardada.estado);
    ui.log = guardada.log || [];
    ui.reanudarPost = guardada.estado.fase === "post";
  } else {
    borrarPartida();
    g = crearJuego(pref);
  }
  guia.paso = -1; render();
  if (!guardada && ui.tutorial) iniciarGuia();   // modo tutorial: la guía arranca siempre; en normal, solo con el botón ?
  if (guardada) aviso(`Partida recuperada: ronda ${g.ronda} de ${g.maxRondas}`);
  const esta = g;
  try {
    await g.jugar();
    if (esta !== g) return;
    borrarPartida();
    ui.fase = "fin"; render();
    await mostrarFinal();
  } catch (e) { if (e !== CANCELADO) { console.error(e); aviso("Error en la partida: " + esc(e.message)); } }
}
// ---------------------------------------------------------- tutorial guiado (sobre la pantalla real)
// Cada paso señala una parte de la pantalla. «hasta» = el paso avanza solo cuando el jugador lo hace;
// «turno» = el paso espera a que sea tu turno de jugar.
// el planeta que acabas de descubrir (para señalarlo en la guía)
function miUltimoPlaneta() { const ps = g.planetas.filter(p => p.desc === YO && p.vivo); return ps[ps.length - 1]; }
function planetaRival() { const ps = g.planetas.filter(p => p.desc !== YO && p.vivo); return ps[ps.length - 1]; }
const selPlanetaRival = () => { const pl = planetaRival(); return pl ? `.pl-dot[data-pl="${pl.id}"]` : "#nada-todavia"; };
const selMiPlaneta = () => { const pl = miUltimoPlaneta(); return pl ? `.pl-dot[data-pl="${pl.id}"]` : "#tablero"; };
const GUIA = [
  // en el modo tutorial el objetivo ya se explicó en «Cómo se gana»
  { si: () => !ui.tutorial, sel: "#heroe .mis-pts", txt: `<b>Objetivo:</b> terminar las rondas con más puntos que los rivales. Los puntos salen de <b>publicar</b>: un planeta vale +${K.CAND}; lo que averigües de él, más: <b>Atmósfera</b> +${K.PUNTOS.atmosfera}, <b>Habitable</b> +${K.PUNTOS.habitable} y <b>Biofirma</b> +${K.PUNTOS.biofirma} (gases que en la Tierra produce la vida).` },
  { sel: "#heroe .mis-pts", txt: "Aquí ves <b>tus puntos</b> y tu puesto." },
  { sel: ".chip-ronda", txt: "La partida dura estas <b>rondas</b>. Gana quien tenga más puntos al final." },
  { sel: "#b-tel", txt: "El <b>Telescopio</b>: si tus cartas no te sirven, lo tocas para cambiarlas. Usa tu turno." },
  { sel: "#b-tuto", txt: "Si te pierdes, toca <b>?</b> para repetir esta guía cuando quieras." },
  { sel: "#b-opinion", txt: "Y con este botón nos cuentas <b>qué te pareció</b> el juego y qué mejorarías." },
  { sel: "#tablero", txt: "Este es el <b>cielo</b>. Cada estrella muestra cómo es: su <b>tamaño</b>, su <b>distancia</b>, su <b>edad</b> y si está <b>activa</b>. De eso depende qué técnica funciona." },
  { sel: "#mano .carta.tec", alt: "#mano", soloTec: true, turno: true, txt: "Estas son tus cartas de <b>TÉCNICA</b> (las celestes). Toca una.", hasta: () => ui.sel && ui.sel.tipo === "tec" },
  { sel: "#msg", txt: "Aquí ves <b>en qué estrellas</b> se puede usar tu carta. Busca en el cielo una estrella así." },
  { sel: "#tablero", txt: "Toca la <b>estrella</b> que elegiste: verás sus datos junto a tu carta y si tu técnica sirve ahí. Si no te convence, elige otra antes de jugar.",
    hasta: () => ui.tiradas > 0 },
  { sel: selMiPlaneta, txt: () => miUltimoPlaneta()
      ? "Este es <b>tu planeta</b>. El <b>?</b> indica que es <b>secreto</b>: solo tú sabes qué es hasta que lo publiques. Las letras celestes (<b>Tr</b>, <b>VR</b>, <b>As</b>…) dicen con qué <b>técnica</b> se descubrió: algunos Marcadores la exigen (el Espectro de transmisión necesita Tránsito). Tócalo cuando quieras para ver sus datos."
      : "Esta vez no apareció un planeta: pasa a veces. Cuando descubras uno, aparecerá en su estrella con un <b>?</b>." },
  { sel: selMiPlaneta, si: () => !!miUltimoPlaneta(), txt: "Ojo: puede ser un <b>falso positivo</b>, una señal que imita un planeta. Para saberlo, <b>mídelo con otra técnica</b> o una Densidad: si es real, queda <b>confirmado</b>." },
  { sel: "#mano .carta.mar", alt: "#mano", txt: "Para saber qué publicar necesitas <b>MARCADORES</b> (cartas violetas). Se juegan sobre un planeta ya descubierto y te dicen en secreto de qué está hecho: roca o gas, si tiene atmósfera, qué gases. <b>Sin Marcador no puedes publicar Habitable ni Biofirma.</b>" },
  { sel: "#b-pub", alt: "#acciones", turnoFin: true, txt: "Esto es <b>PUBLICAR</b>, y es la <b>única forma de sumar puntos</b>: lo que descubres o averiguas vale 0 hasta que lo publicas. Y lo que averigües de un planeta (Atmósfera, Habitable, Biofirma) es del <b>primero</b> que lo publica: si esperas mucho, un rival puede ganarte." },
  { sel: "#b-pub", alt: "#acciones", turnoFin: true, txt: "El <b>riesgo</b>: si publicas algo <b>falso</b>, pierdes. Un planeta que era falso te deja en <b>−1</b>. Y si publicas una Atmósfera, Habitable o Biofirma que no es cierta, un rival puede <b>refutarte</b>: repite la observación y <b>se lleva tus puntos</b>. Regla de oro: publica lo que tu lectura <b>confirma</b>." },
  { sel: "#b-fin", alt: "#acciones", turnoFin: true, txt: "¿No estás seguro? Toca <b>Terminar turno</b>: lo que no publicas no se pierde y puedes publicarlo más adelante, cuando tengas más pruebas.", hasta: () => !["post", "robar", "descartar"].includes(ui.fase) },
  { sel: selPlanetaRival, alt: ".rival", cuando: p => !!planetaRival() || g.turnos > p.t0 + 1, txt: () => planetaRival()
      ? "Tu rival también busca planetas: su candidato aparece en la estrella con <b>su color</b> y un <b>?</b> (secreto). Las letras celestes dicen con qué <b>técnica</b> lo encontró. Si lo publica, podrás investigarlo y medirlo tú también. ¡A jugar!"
      : "Ahora juega <b>tu rival</b>. Cuando descubra un candidato, aparecerá en una estrella con <b>su color</b> y un <b>?</b>; las letras celestes dirán con qué técnica lo encontró. ¡A jugar!", fin: true },
];
const guia = { paso: -1 };
function guiaVisible() { const c = document.getElementById("guia"); return guia.paso >= 0 && !!c && !c.hidden; }
function iniciarGuia() { GUIA.forEach(x => delete x.t0); guia.paso = 0; ui.tiradas = 0; actualizarGuia(); }
function terminarGuia() {
  guia.paso = -1; actualizarGuia();
  preferencias.tutorialVisto = true;
  try { localStorage.setItem("exo-pref", JSON.stringify(preferencias)); } catch (e) {}
}
function actualizarGuia() {
  let capa = document.getElementById("guia");
  const p = GUIA[guia.paso];
  if (p && ((p.hasta && p.hasta()) || (p.si && !p.si()))) { guia.paso++; return actualizarGuia(); }
  if (p && p.cuando && p.t0 == null) p.t0 = g.turnos;   // espera a que el rival juegue (descubra algo o termine su turno)
  document.body.classList.toggle("guia-solo-tec", !!(p && p.soloTec));   // apaga los Marcadores mientras se pide una Técnica
  // el foco puede abarcar varias cartas (p. ej. solo las de Técnica); si no hay ninguna, usa «alt»
  const selector = p && (typeof p.sel === "function" ? p.sel() : p.sel);
  let els = p ? [...document.querySelectorAll(selector)].filter(x => x.getClientRects().length) : [];
  if (p && !els.length && p.alt) els = [...document.querySelectorAll(p.alt)];
  const el = els[0];
  const tapado = document.querySelector("#capa .velo") || (p && p.turno && (ui.fase !== "accion" || ui.ocupado)) || (p && p.turnoFin && (ui.fase !== "post" || ui.ocupado)) || (p && p.cuando && !p.cuando(p));
  if (!p || !el || tapado || !el.getClientRects().length) { if (capa) capa.hidden = true; if (!p && capa) capa.remove(); return; }
  if (!capa) {
    capa = document.createElement("div"); capa.id = "guia";
    capa.innerHTML = `<div class="guia-foco"></div><div class="guia-globo" role="dialog" aria-live="polite"><p></p><div class="guia-btns"></div></div>`;
    document.body.appendChild(capa);
  }
  capa.hidden = false;
  const rs = els.map(x => x.getBoundingClientRect());
  const r = { left: Math.min(...rs.map(q => q.left)), top: Math.min(...rs.map(q => q.top)), right: Math.max(...rs.map(q => q.right)), bottom: Math.max(...rs.map(q => q.bottom)) };
  r.width = r.right - r.left; r.height = r.bottom - r.top;
  const foco = capa.querySelector(".guia-foco"), globo = capa.querySelector(".guia-globo");
  Object.assign(foco.style, { left: `${r.left - 4}px`, top: `${r.top - 4}px`, width: `${r.width + 8}px`, height: `${r.height + 8}px` });
  globo.querySelector("p").innerHTML = `${typeof p.txt === "function" ? p.txt() : p.txt}<span class="guia-n">${(v => `${v.indexOf(p) + 1}/${v.length}`)(GUIA.filter(x => !x.si || x.si() || x === p))}</span>`;
  globo.querySelector(".guia-btns").innerHTML = `<button type="button" class="btn-juego gris" data-g="saltar">Saltar guía</button>`
    + (p.hasta ? "" : `<button type="button" class="btn-juego" data-g="sig">${p.fin ? "¡A jugar!" : "Siguiente"}</button>`);
  globo.querySelectorAll("[data-g]").forEach(b => b.onclick = () => {
    if (b.dataset.g === "saltar" || p.fin) terminarGuia(); else { guia.paso++; actualizarGuia(); }
  });
  // globo al costado del elemento si es alto y hay lugar (PC: el cielo ocupa toda la altura); si no, arriba o abajo
  const gw = globo.offsetWidth, gh = globo.offsetHeight;
  // si lo señalado está en el cielo y el cielo es alto (PC), el globo va al costado del cielo, sin tapar estrellas
  const tab = document.getElementById("tablero").getBoundingClientRect();
  const enCielo = els.every(x => x.closest && x.closest("#tablero")) && tab.height > innerHeight * 0.45;
  // algo chico dentro del cielo (un planeta): el globo pegado a su lado, para que se vea a qué apunta
  if (enCielo && r.width < tab.width * 0.6 && r.height < tab.height * 0.6) {
    const derL = innerWidth - r.right - 12 - 8 >= gw, izqL = r.left - 12 - 8 >= gw;
    if (derL || izqL) {
      Object.assign(globo.style, { left: `${derL ? r.right + 12 : r.left - 12 - gw}px`, transform: "none", bottom: "",
        top: `${Math.max(8, Math.min(innerHeight - gh - 8, r.top + r.height / 2 - gh / 2))}px` });
      globo.dataset.flecha = derL ? "izq" : "der";
      globo.style.setProperty("--fy", `${Math.max(14, Math.min(gh - 14, r.top + r.height / 2 - parseFloat(globo.style.top)))}px`);
      return;
    }
  }
  delete globo.dataset.flecha;
  const ref = enCielo ? tab : r;
  const der = innerWidth - ref.right - 16, izq = ref.left - 16;
  if ((enCielo || r.height > innerHeight * 0.45) && Math.max(der, izq) >= gw) {
    const x = der >= gw ? ref.right + 12 : ref.left - 12 - gw;
    Object.assign(globo.style, { left: `${x}px`, transform: "none", bottom: "",
      top: `${Math.max(8, Math.min(innerHeight - gh - 8, r.top + r.height / 2 - gh / 2))}px` });
    return;
  }
  // arriba o abajo, centrado sobre lo señalado (en PC queda en la columna derecha, sin tapar el cielo)
  Object.assign(globo.style, { left: `${Math.max(8, Math.min(innerWidth - gw - 8, r.left + r.width / 2 - gw / 2))}px`, transform: "none" });
  const abajo = r.top + r.height / 2 < innerHeight / 2;
  globo.style.top = abajo ? `${Math.min(innerHeight - gh - 8, r.bottom + 10)}px` : "";
  globo.style.bottom = abajo ? "" : `${Math.min(innerHeight - gh - 8, innerHeight - r.top + 10)}px`;
}
async function mostrarTutorial() { if (g && !g.terminado) iniciarGuia(); }
new MutationObserver(() => { if (guia.paso >= 0) requestAnimationFrame(actualizarGuia); }).observe(document.getElementById("capa"), { childList: true });
addEventListener("resize", () => { if (guia.paso >= 0) actualizarGuia(); });

// Pantalla de inicio: solo elegir el modo de juego; después, la preparación de la partida
function abrirModo() {
  document.querySelectorAll(".inicio").forEach(x => x.remove());
  const d = document.createElement("div");
  d.className = "inicio";
  d.innerHTML = `<div class="inicio-caja"><h1>Sistemas Exoplanetas</h1>
    <p class="inicio-sub">Descubre planetas en otras estrellas y busca señales de vida.</p>
    <button type="button" class="modo" data-modo="tutorial"><b>Tutorial</b><span>Aprende jugando: el juego te dice qué hacer en cada turno. Una partida corta (${RONDAS_TUTORIAL} rondas) contra un rival novato.</span></button>
    <button type="button" class="modo" data-modo="normal"><b>Normal</b><span>Sin ayudas, contra 1 a 3 equipos que juegan según su científico.</span></button>
    <button type="button" class="inicio-reglas">Cómo se juega</button>
    ${BOTON_ENCUESTA}
    ${CREDITO}</div>`;
  document.body.appendChild(d);
  d.querySelectorAll(".modo").forEach(b => b.onclick = () => {
    preferencias.modo = b.dataset.modo;
    try { localStorage.setItem("exo-pref", JSON.stringify(preferencias)); } catch (e) {}
    d.remove(); Sfx.elegir(); preferencias.modo === "tutorial" ? abrirIntroTutorial() : abrirPreparacion();
  });
  d.querySelector(".inicio-reglas").onclick = () => mostrarReglas();
}
// Tutorial, paso 1: el objetivo y el camino, antes de elegir científico (poca información por pantalla)
async function abrirIntroTutorial() {
  const v = await ventana({ titulo: "Cómo se gana", color: "linear-gradient(90deg,#3b2bb0,#1b8fb0)", cerrable: false, cuerpo: `
    <p class="intro-grande"><b>Objetivo:</b> terminar las ${RONDAS_TUTORIAL} rondas con más puntos que tu rival.</p>
    <ol class="camino">
      <li><span class="paso-n tec">1</span><span><b>Descubre</b> un planeta: juega una carta de <b>Técnica</b> en una estrella donde funcione.</span></li>
      <li><span class="paso-n mar">2</span><span><b>Averigua</b> de qué está hecho: juega un <b>Marcador</b> sobre tu planeta.</span></li>
      <li><span class="paso-n pub">3</span><span><b>Publica</b> lo que encontraste y gana los puntos.</span></li>
    </ol>
    <table class="tabla"><tr><td>Planeta</td><td><b>+${K.CAND}</b></td></tr><tr><td>Atmósfera</td><td><b>+${K.PUNTOS.atmosfera}</b></td></tr>
      <tr><td>Habitable</td><td><b>+${K.PUNTOS.habitable}</b></td></tr><tr><td>Biofirma (gases que delatan vida)</td><td><b>+${K.PUNTOS.biofirma}</b></td></tr></table>
    <p class="tenue">Ojo: si publicas algo que no es cierto, tu rival puede refutarte y quedarse con esos puntos. Durante la partida, el juego te va a decir qué conviene hacer.</p>`,
    botones: [{ txt: "Cambiar modo", valor: "modo", clase: "gris" }, { txt: "Elegir científico", valor: "ok" }] });
  if (v === "modo") return abrirModo();
  if (v === "ok") abrirPreparacion();
}
function abrirPreparacion() {
  let sel = preferencias.cient;
  const tuto = preferencias.modo === "tutorial";
  const p = ventana({ titulo: tuto ? "Tutorial · nueva partida" : "Partida normal", color: "linear-gradient(90deg,#3b2bb0,#1b8fb0)", cerrable: !!g && g.turnos > 0, cuerpo: `
    ${tuto ? "" : `<p><b>Objetivo:</b> terminar con más puntos que los equipos rivales. <b>Descubres</b> planetas con cartas de Técnica, los <b>investigas</b> con Marcadores y <b>publicas</b> lo que encontraste: el planeta da pocos puntos; su atmósfera, si es habitable o si tiene vida, muchos más.</p>`}
    ${tuto ? `<div class="sec privado"><h3>Elige tu científico</h3>
      <p>Tu equipo representa a un científico real que buscó exoplanetas o estudió el Sistema Solar. Su <b>ventaja</b> te da puntos extra cada vez que logras el tipo de resultado por el que es conocido.</p>
      <p>Por ejemplo, con <b>Lisa Kaltenegger</b> cada <b>Habitable</b> que publiques suma +5 además de sus +3: te conviene buscar planetas pequeños y templados y averiguar si tienen agua y aire. Elige uno y juega para aprovechar su ventaja.</p></div>`
      : `<p class="tenue">Elige tu científico: su ventaja define tu mejor jugada.</p>`}
    <div class="cient-lista">${D.cientificos.map(c => `<button type="button" class="cient ${c.id === sel ? "sel" : ""}" data-c="${c.id}"><span class="pais">${esc(c.pais || "")}</span><b>${esc(c.nombre)}</b>${tuto
      ? `<span class="e"><b>Ventaja:</b> ${esc(c.efecto)}</span><span class="h">${esc(c.hecho)}</span>`
      : `<span class="e">${habilidades(c.id).map(esc).join(" · ")}</span>`}</button>`).join("")}</div>
    <div class="campos">
      <label class="campo" for="p-nombre">Nombre de tu equipo<input id="p-nombre" maxlength="18" value="${esc(preferencias.nombre)}" placeholder="Tu equipo"></label>
      ${tuto ? "" : `<label class="campo" for="p-rivales">Rivales<select id="p-rivales">${[1, 2, 3].map(n => `<option value="${n}" ${+preferencias.rivales === n ? "selected" : ""}>${n} (${K.RONDAS[n + 1]} rondas)</option>`).join("")}</select></label>
      <label class="campo" for="p-vel">Velocidad rivales<select id="p-vel">${[["1100", "Lenta"], ["650", "Normal"], ["250", "Rápida"]].map(([v, t]) => `<option value="${v}" ${String(preferencias.velocidad) === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>`}
    </div>${CREDITO}`,
    botones: [{ txt: "Cambiar modo", valor: "modo", clase: "gris" }, { txt: "¡Jugar!", valor: "ok" }],
    alAbrir: capa => {
      capa.querySelectorAll(".cient").forEach(b => b.onclick = () => { sel = b.dataset.c; capa.querySelectorAll(".cient").forEach(x => x.classList.toggle("sel", x === b)); });
      capa.querySelectorAll(".acciones .btn-juego").forEach(b => b.addEventListener("click", () => {
        preferencias.nombre = capa.querySelector("#p-nombre").value.trim();
        if (!tuto) { preferencias.rivales = +capa.querySelector("#p-rivales").value; preferencias.velocidad = +capa.querySelector("#p-vel").value; }
      }, { capture: true }));
    } });
  p.then(v => {
    if (v === "modo") { abrirModo(); return; }
    if (v !== "ok") return;
    preferencias.cient = sel;
    try { localStorage.setItem("exo-pref", JSON.stringify(preferencias)); } catch (e) {}
    empezar(preferencias);
  });
}

dibujarFondo();
addEventListener("resize", () => { dibujarFondo(); });
g = crearJuego(preferencias);
render();
(() => {
  const s = leerPartida();
  if (s) { try { empezar(s.pref, s); return; } catch (e) { console.error(e); borrarPartida(); } }
  abrirModo();
})();
