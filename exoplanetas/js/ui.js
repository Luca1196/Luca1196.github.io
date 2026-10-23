// ===================================================================
//  Interfaz estilo juego móvil: una pantalla, cartas grandes, objetivos con %
// ===================================================================
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const COLOR = ["var(--j0)", "var(--j1)", "var(--j2)", "var(--j3)"];
const ETIQ = { transito: "Trán", rv: "VRad", astro: "Astr", imagen: "Imag", micro: "Micr" };
const LUZ = { F: "#e9edff", G: "#ffe27a", K: "#ffad5c", M: "#ff6f4f" };
const CAMPO = { o: "Órbita", R: "Radio", M: "Masa", dens: "Densidad", atm: "Atmósfera", gases: "Gases", ctx: "Contexto" };
const DIST_CORTA = { cercana: "Cercana", media: "Media", lejana: "Lejana" };
const CANCELADO = new Error("partida cancelada");
const ICO = {
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
const ui = { fase: "espera", sel: null, esperando: {}, ocupado: false, velocidad: 650, ayudas: true, log: [], hitosPend: [] };
const YO = 0;
const J = () => g.j[YO];
let preferencias = { nombre: "", cient: "seager", rivales: 2, velocidad: 650, ayudas: true };
try { Object.assign(preferencias, JSON.parse(localStorage.getItem("exo-pref") || "{}")); } catch (e) {}

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
  if (cid === "tancredi") out.push(`+${K.TANC} al confirmar ajeno`);
  if (cid === "fernandez") out.push(`+${K.FERN} al investigar ajeno`, "Refuta con cualquier Marcador");
  if (cid === "seager") out.push("Señal compartida en espectros");
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
    if (alAbrir) alAbrir(capa, cerrar);
    const f = capa.querySelector(".acciones .btn-juego:not(.gris)") || capa.querySelector(".h-cerrar"); if (f) f.focus();
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
async function mostrarTirada(d, modal) {
  const partes = detalleBonos(d.partes);
  const total = d.d + d.mod;
  const veredicto = d.d === 20 ? "¡20 natural!" : d.d === 1 ? "1 natural" : d.ok ? "¡Éxito!" : "Falla";
  if (!modal) {
    aviso(`${ficha(d.jg)} <b>${esc(nombreJ(d.jg))}</b> · ${esc(d.que)} → ${d.d}${sgn(d.mod)} vs ${d.cd}: <b style="color:${d.ok ? "var(--ok)" : "var(--mal)"}">${veredicto}</b>`);
    await sleep(ui.velocidad);
    return;
  }
  let caja;
  const p = ventana({ titulo: esc(d.que), centro: true, cuerpo: `<div class="dado-caja"><div class="dado rodando">?</div>
    <div class="veredicto">Tirando…</div><p class="partes">d20 ${sgn(d.mod)} · necesitas ${d.cd} o más</p></div>${partes}`,
    botones: [{ txt: "Continuar", valor: true }], alAbrir: c => { caja = c; } });
  const dado = caja.querySelector(".dado"), ver = caja.querySelector(".veredicto");
  const t0 = Date.now();
  while (Date.now() - t0 < 600 && caja.isConnected) { dado.textContent = 1 + Math.floor(Math.random() * 20); await sleep(50); }
  dado.classList.remove("rodando"); dado.textContent = d.d; dado.classList.add(d.ok ? "ok" : "mal");
  ver.innerHTML = `${d.d} ${sgn(d.mod)} = ${total} <span style="color:${d.ok ? "var(--ok)" : "var(--mal)"}">${veredicto}</span>`;
  await p;
}

// ---------------------------------------------------------- controlador humano
function nuevaEspera(k) { return new Promise(r => { ui.esperando[k] = r; }); }
function resolver(k, v) { const r = ui.esperando[k]; delete ui.esperando[k]; if (r) r(v); }
class Humano {
  async turno(juego, jg) {
    if (juego !== g) throw CANCELADO;
    ui.fase = "accion"; ui.sel = null; render();
    banner("Tu turno");
    await nuevaEspera("accion");
    await mostrarHitos();
    ui.fase = "post"; ui.sel = null; render();
    await juego.reponer(jg);
    ui.fase = "espera"; render();
  }
  async elegirMazo(juego, jg, k) { await mostrarHitos(); ui.fase = k === 0 ? "post" : "robar"; render(); return nuevaEspera("mazo"); }
  descartar(juego, jg) { ui.fase = "descartar"; render(); return nuevaEspera("descarte"); }
  decidirRefutar(juego, x, pl, cat, ops) { return preguntarRefutar(pl, cat, ops.map(mid => ({ cat, mid }))).then(r => r && r.mid); }
  decidirRefutarArticulo(juego, x, pl, cats, pares, pozo) { return preguntarRefutar(pl, cats, pares, pozo); }
}
async function accionHumana(fn) {
  if (ui.ocupado || ui.fase !== "accion") return;
  ui.ocupado = true; ui.sel = null; render();
  try { await fn(); } finally { ui.ocupado = false; }
  resolver("accion");
}

// opciones de la carta elegida sobre una estrella
function opcionesEstrella(e) {
  const jg = J(), s = ui.sel, out = [];
  if (!s) return out;
  const pls = g.planetas.filter(p => p.est === e);
  if (s.tipo === "tec") {
    if (g.puedeDescubrir(jg, s.id, e)) { const m = g.modDescubrir(jg, s.id, e); out.push({ tipo: "desc", txt: "Buscar planeta nuevo", p: pTirada(m.mod, m.cd) }); }
    for (const p of pls) if (g.puedeMedir(jg, s.id, p)) { const m = g.modMedir(jg, s.id, p); out.push({ tipo: "medir", pl: p, txt: `Medir ${p.nombre}`, p: pTirada(m.mod, m.cd) }); }
  } else {
    for (const p of pls) if (g.puedeInvestigar(jg, s.id, p)) { const m = g.modMarcador(jg, s.id, p); out.push({ tipo: "car", pl: p, txt: `Investigar ${p.nombre}`, p: pTirada(m.mod, m.cd) }); }
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
async function tocarEstrella(i) {
  const e = g.estrellas[i];
  const ops = ui.fase === "accion" && !ui.ocupado ? opcionesEstrella(e) : [];
  if (!ops.length) return detalleEstrella(e);
  if (ops.length === 1) return ejecutar(ops[0], e);
  const v = await ventana({ titulo: `Estrella ${esc(e.cl)}`, color: "var(--est)", botones: [], cuerpo: `<div class="lista">${ops.map((o, k) => `<button type="button" class="opcion" data-k="${k}"><span>${esc(o.txt)}</span><b>${pct(o.p)}</b></button>`).join("")}</div>`,
    alAbrir: (capa, cerrar) => capa.querySelectorAll(".opcion").forEach(b => b.onclick = () => cerrar(ops[+b.dataset.k])) });
  if (v) ejecutar(v, e);
}

async function hacerDescubrir(tid, est) {
  await accionHumana(async () => {
    const r = await g.descubrir(J(), tid, est);
    if (!r.ok) return;
    if (r.hallazgo) await ventana({ titulo: "¡Hallazgo inesperado!", color: "var(--hito)", centro: true, cuerpo: `<h3>${esc(r.hallazgo.nombre)} · +${K.HALL}</h3><p>${esc(r.hallazgo.hist)}</p><p class="tenue">Buscando planetas encontraste otra cosa: sumas puntos y no hay candidato esta vez.</p>` });
    else if (r.vacio) await ventana({ titulo: "Sin candidato", centro: true, cuerpo: "<p>La señal no correspondía a ningún planeta compatible con esta estrella.</p>" });
    else await revelarPlaneta(r.pl, est);
  });
}
async function revelarPlaneta(pl, est) {
  const dato = pl.tecnicas[0] === "transito" ? "R" : "M";
  await ventana({ titulo: "¡Candidato!", color: "var(--pla)", centro: true, cuerpo: `
    <div class="privado"><h3>${esc(pl.nombre)} · ${esc(tamTemp(pl))}</h3>
      <dl class="dato"><dt>Estrella</dt><dd>${esc(est.cl)}</dd><dt>Órbita</dt><dd>${esc(fmtCampo("o", pl.publico.o))}</dd><dt>${CAMPO[dato]}</dt><dd>${esc(fmtCampo(dato, pl.publico[dato]))}</dd></dl></div>
    <p>Es <b>privado</b>: solo tú lo investigas. Los rivales solo saben su tamaño y temperatura. Publícalo cuando quieras con el botón <b>Publicar</b> (+${K.CAND}, o +${K.CONF} si ya está confirmado).</p>` });
}
async function hacerMedir(tid, pl) {
  await accionHumana(async () => {
    const r = await g.medir(J(), tid, pl);
    if (!r.ok) return;
    if (r.falso) await ventana({ titulo: "¡Falso positivo!", color: "var(--mal)", centro: true, cuerpo: `<p>La segunda observación no ve nada: ${esc(pl.nombre)} no era un planeta.</p><p class="tenue">${esc(pl.a.ctx)}</p>` });
    else if (r.noVe) await ventana({ titulo: "No se ve", centro: true, cuerpo: `<p>${esc(TEC[tid].nombre)} no logra ver este planeta. ${esc(TEC[tid].limite)}</p>` });
    else aviso(`Mediste ${esc(pl.nombre)}: ${CAMPO[DATO_TEC[tid]]} = <b>${esc(fmtCampo(DATO_TEC[tid], pl.publico[DATO_TEC[tid]]))}</b>${pl.confirmado ? " · <b>¡confirmado!</b>" : ""}`);
  });
}
async function hacerInvestigar(mid, pl) {
  await accionHumana(async () => {
    const r = await g.investigar(J(), mid, pl);
    if (!r.ok) { aviso(`No concluyente: la carta queda bajo ${esc(pl.nombre)} (+${K.SENAL} a tu próximo intento ahí).`); return; }
    if (r.falso) { await ventana({ titulo: "¡Falso positivo!", color: "var(--mal)", centro: true, cuerpo: `<p>Masa y radio no cuadran: ${esc(pl.nombre)} no era un planeta.</p>` }); return; }
    await ventana({ titulo: "Lectura secreta", color: "var(--mar)", centro: true, cuerpo: `
      <div class="privado"><dl class="dato">${Object.entries(r.lee).map(([c, v]) => `<dt>${CAMPO[c]}</dt><dd>${esc(v)}</dd>`).join("")}</dl></div>
      <p>Con esto puedes publicar <b>${SIRVE[mid].map(c => CAT_NOMBRE[c]).join(" o ")}</b> en ${esc(pl.nombre)}, si crees que es cierto.</p>` });
  });
}
async function hacerTelescopio() {
  if (ui.ocupado || ui.fase !== "accion") return;
  const jg = J();
  const cartas = [...jg.tec.map(id => ({ tipo: "tec", id })), ...jg.mar.map(id => ({ tipo: "mar", id }))];
  const marc = new Set();
  const v = await ventana({ titulo: "Tiempo de telescopio", color: "var(--est)", cuerpo: `
    <p>Toca las cartas que quieras descartar y roba 1 del mazo que elijas. Gasta tu acción del turno.</p>
    <div class="mano" style="min-height:0;justify-content:flex-start;flex-wrap:wrap;gap:10px">${cartas.map((c, k) => cartaHTML(c.tipo, c.id, `data-k="${k}" style="margin:0"`)).join("")}</div>`,
    botones: [{ txt: "Cancelar", valor: null, clase: "gris" }, { txt: `Robar Técnica`, valor: "tec", clase: "azul" }, { txt: `Robar Marcador`, valor: "mar", clase: "violeta" }],
    alAbrir: capa => capa.querySelectorAll("[data-k]").forEach(b => b.onclick = () => {
      const k = +b.dataset.k; marc.has(k) ? marc.delete(k) : marc.add(k); b.classList.toggle("descartar", marc.has(k));
    }) });
  if (!v) return;
  await accionHumana(async () => { await g.telescopio(jg, [...marc].map(k => cartas[k]), v); });
}

// ---------------------------------------------------------- publicar y refutar
function publicables() {
  const jg = J(), out = [];
  for (const pl of g.planetas) {
    if (!pl.vivo) continue;
    if (pl.desc === YO && pl.pubPlaneta === null) out.push({ pl, cat: "planeta", txt: `Planeta ${pl.nombre}`, pts: pl.confirmado ? K.CONF : K.CAND });
    const cs = CATS.filter(c => g.puedePublicar(jg, pl, c));
    for (const c of cs) out.push({ pl, cat: c, txt: `${CAT_NOMBRE[c]} en ${pl.nombre}`, pts: K.PUNTOS[c], p: g.prob(jg, pl, c) });
    if (cs.length > 1) out.push({ pl, cat: "articulo", cats: cs, txt: `Artículo en ${pl.nombre}: ${cs.map(c => CAT_NOMBRE[c]).join(" + ")}`,
      pts: cs.reduce((s, c) => s + K.PUNTOS[c], 0) + (K.BONO_ART || 0) * (cs.length - 1), art: true });
  }
  return out;
}
async function abrirPublicar() {
  const ops = publicables();
  const puede = !ui.ocupado && ["accion", "post"].includes(ui.fase);
  const v = await ventana({ titulo: "Publicar", color: "var(--pla)", botones: [], cuerpo: `
    ${puede ? "" : '<p class="tenue">Solo puedes publicar en tu turno, antes de robar.</p>'}
    ${ops.length ? `<div class="lista">${ops.map((o, k) => `<button type="button" class="pub-btn" data-k="${k}" ${puede ? "" : "disabled"}>
      <span>${esc(o.txt)}${o.art ? `<br><small class="tenue">todo junto: +${K.BONO_ART} por cada extra, pero si lo refutan, el rival se lleva todo</small>` : ""}${o.p !== undefined && ui.ayudas ? `<br><small class="tenue">cierto con probabilidad ${pct(o.p)}</small>` : ""}</span><b>+${o.pts}</b></button>`).join("")}</div>`
      : '<p>Todavía no tienes nada para publicar. Descubre un planeta, o investígalo con un Marcador que sirva para eso.</p>'}
    <p class="tenue">Al publicar Atmósfera, Habitable o Biofirma, un rival puede refutarte en el acto con un Marcador que tú no usaste.</p>`,
    alAbrir: (capa, cerrar) => capa.querySelectorAll(".pub-btn").forEach(b => b.onclick = () => cerrar(ops[+b.dataset.k])) });
  if (v) publicarHumano(v.pl, v.cat, v.cats);
}
async function publicarHumano(pl, cat, cats) {
  if (ui.ocupado || !["accion", "post"].includes(ui.fase)) return;
  ui.ocupado = true; render();
  try {
    if (cat === "planeta") g.publicarPlaneta(J(), pl);
    else if (cat === "articulo") {
      const r = await g.publicarArticulo(J(), pl, cats);
      if (r && !r.refutado) banner(`+${cats.reduce((s, c) => s + K.PUNTOS[c], 0) + K.BONO_ART * (cats.length - 1)} Artículo`, "nadie lo refutó");
    } else {
      const r = await g.publicar(J(), pl, cat);
      if (r && !r.refutado) banner(`+${K.PUNTOS[cat]} ${CAT_NOMBRE[cat]}`, "nadie lo refutó");
    }
    await mostrarHitos();
  } finally { ui.ocupado = false; render(); }
}

// Cartel de hito: puntos, quién lo logró y el caso real que lo inspira
async function mostrarHitos() {
  while (ui.hitosPend && ui.hitosPend.length) {
    const d = ui.hitosPend.shift(), h = HITO[d.id], mio = d.jg === YO;
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
    const m = g.modMarcador(J(), mid, pl, true);
    const pv = cands.filter(a => !verdad(a, cat) && veFalsedad(mid, a, cat)).length / cands.length;
    return { cat, mid, p: pTirada(m.mod, m.cd), pv };
  });
  return ventana({ titulo: lista.length > 1 ? "¿Refutas el artículo?" : "¿Refutas?", color: "var(--mar)", cerrable: false, centro: true, botones: [{ txt: "No refutar", valor: null, clase: "gris" }], cuerpo: `
    <p>${ficha(aut)} <b>${esc(nombreJ(aut))}</b> publica <b>${lista.map(c => CAT_NOMBRE[c]).join(" + ")}</b> en ${esc(pl.nombre)}.</p>
    <h3>En juego: ${pozo} puntos</h3>
    <p class="tenue">Si tu tirada sale y lo que ve tu Marcador contradice ${lista.length > 1 ? "cualquiera de las afirmaciones, te llevas todo el artículo" : "lo publicado, los puntos son tuyos"}. Si no, son del autor. El Marcador se gasta igual.</p>
    <div class="lista">${bot.map((b, k) => `<button type="button" class="opcion" data-k="${k}"><span>${lista.length > 1 ? `${CAT_NOMBRE[b.cat]} · ` : ""}${esc(MAR[b.mid].nombre)}${ui.ayudas ? `<br><small class="tenue">su lectura lo contradiría: ${pct(b.pv)}</small>` : ""}</span><b>${pct(b.p)}</b></button>`).join("")}</div>`,
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
    const res = gana ? `<h3>¡Refutado! ${esc(nombreJ(x))} gana +${pozo}</h3>`
      : t.ok ? `<h3>No lo contradice: +${pozo} para ${esc(nombreJ(autor))}</h3>` : `<h3>La tirada falla (${t.d}${sgn(t.mod)} vs ${t.cd}): +${pozo} para ${esc(nombreJ(autor))}</h3>`;
    await ventana({ titulo: "Refutación", color: "var(--mar)", centro: true, cuerpo: `<p>${ficha(x)} <b>${esc(nombreJ(x))}</b> cuestiona ${CAT_NOMBRE[cat]} de ${ficha(autor)} ${esc(nombreJ(autor))} en ${esc(pl.nombre)} con ${esc(MAR[mid].nombre)}.</p>${lect}${res}` });
  }
}

// ---------------------------------------------------------- render
function render() {
  if (!g) return;
  renderRivales(); renderTablero(); renderHeroe(); renderMano(); renderAcciones();
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
    <div class="fila-iconos"><button type="button" class="icono-btn" id="b-registro" aria-label="Registro público" title="Registro público">${ICO.lista}</button>
    <button type="button" class="icono-btn" id="b-menu" aria-label="Menú" title="Menú">${ICO.menu}</button></div></div>`;
  $("#b-registro").onclick = verRegistro;
  $("#b-menu").onclick = menu;
}
function renderTablero() {
  const activo = ui.fase === "accion" && !ui.ocupado && ui.sel;
  $("#tablero").innerHTML = g.estrellas.map((e, i) => {
    const pls = g.planetas.filter(p => p.est === e);
    const ops = activo ? opcionesEstrella(e) : [];
    const mejor = ops.length ? Math.max(...ops.map(o => o.p)) : null;
    const tags = [DIST_CORTA[e.dist], e.edad === "joven" ? '<span class="tag joven">Joven</span>' : "", e.act === "activa" ? '<span class="tag activa">Activa</span>' : "", e.metal ? '<span class="tag metal">Metálica</span>' : ""];
    const bonos = ORDEN_TEC.map(t => { const b = e.bono[t]; return `<div class="bono ${b === null ? "no" : b > 0 ? "pos" : b < 0 ? "neg" : ""} ${ui.sel && ui.sel.tipo === "tec" && ui.sel.id === t ? "sel" : ""}" title="${esc(TEC[t].nombre)}"><span class="l">${ETIQ[t]}</span><span class="c">${ETIQ[t][0]}</span><b>${b === null ? "✕" : sgn(b).replace("+0", "0")}</b></div>`; }).join("");
    const dots = pls.map(pl => {
      const dueño = pl.pubPlaneta !== null ? pl.pubPlaneta : pl.desc;
      const op = activo ? ops.find(o => o.pl === pl) : null;
      return `<span class="pl-dot ${pl.vivo ? "" : "muerto"} ${pl.pubPlaneta === null && pl.desc !== YO ? "priv-rival" : ""} ${op ? "objetivo" : ""}" data-pl="${pl.id}" role="button" tabindex="0">
        <span class="bola" style="background:${COLOR[dueño]}">${pl.pubPlaneta === null ? "?" : pl.confirmado ? "✓" : ""}</span>${esc(pl.nombre)}${op ? `<span class="pct">${pct(op.p)}</span>` : ""}</span>`;
    }).join("");
    return `<div class="est ${ops.length ? "objetivo" : activo ? "apagada" : ""}" data-est="${i}" role="button" tabindex="0" aria-label="Estrella ${esc(e.cl)}">
      <div class="est-cab"><span class="sol" style="background:${LUZ[e.cl[0]]};color:${LUZ[e.cl[0]]}"></span><span class="est-cl">${esc(e.cl)}</span>
        <span class="est-tags"><span class="tag">${tags[0]}</span>${tags.slice(1).join("")}</span></div>
      <div class="bonos num">${bonos}</div>
      <div class="planetas">${dots}</div>
      ${mejor !== null && ops.some(o => !o.pl) ? `<span class="pct">${pct(ops.find(o => !o.pl).p)}</span>` : ""}
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
function tocarPlaneta(pl) {
  const op = ui.fase === "accion" && !ui.ocupado ? opcionPlaneta(pl) : null;
  if (op) return ejecutar(op, pl.est);
  abrirPlaneta(pl);
}
function puesto(jg) {
  const t = g.total(jg), mejores = g.j.filter(x => g.total(x) > t).length, empate = g.j.some(x => x !== jg && g.total(x) === t);
  return `${mejores + 1}.º de ${g.j.length}${empate ? " (empate)" : ""}`;
}
function renderHeroe() {
  const jg = J();
  const n = publicables().length;
  const puede = !ui.ocupado && ["accion", "post"].includes(ui.fase);
  $("#heroe").className = "heroe" + (g.turnoDe === YO && !g.terminado ? " turno" : "");
  $("#heroe").innerHTML = `<div class="avatar" style="background:${COLOR[YO]}">${esc(inicial(jg))}</div>
    <div class="info"><div class="nom">${esc(jg.nombre)} <small>${esc(CIEN[jg.cient].nombre)}</small></div>
      <div class="habs">${habilidades(jg.cient).map(h => `<span class="hab">${esc(h)}</span>`).join("")}</div></div>
    <div class="mis-pts"><span class="m-lbl">Tus puntos</span><span class="pts num" id="pts-${YO}">${g.total(jg)}</span><span class="m-pos">${puesto(jg)}</span></div>
    <button type="button" class="icono-btn" id="b-cuaderno" aria-label="Tu cuaderno" title="Tu cuaderno">${ICO.libro}</button>
    <button type="button" class="btn-pub" id="b-pub" ${n ? "" : "disabled"}>Publicar${n && puede ? `<span class="insignia">${n}</span>` : ""}</button>`;
  $("#b-cuaderno").onclick = verCuaderno;
  $("#b-pub").onclick = abrirPublicar;
}
function cartaHTML(tipo, id, attrs = "", clase = "") {
  if (tipo === "tec") {
    const t = TEC[id];
    return `<button type="button" class="carta tec ${clase}" ${attrs}><span class="gema">${t.cd}</span><span class="ico">${ICO.ojo}</span><span class="tipo">Técnica</span><span class="nombre">${esc(t.nombre)}</span><span class="lee">${esc(textoPlano(t.sesgo).replace("Roba 2 planetas y conserva el de ", "Se queda el de "))}</span></button>`;
  }
  const m = MAR[id];
  return `<button type="button" class="carta mar ${clase}" ${attrs}><span class="gema">${m.cd}</span><span class="ico">${ICO.prisma}</span><span class="tipo">Marcador</span><span class="nombre">${esc(m.nombre)}</span><span class="lee">Lee: ${esc(textoPlano(m.revela).split(/[.(]/)[0])}</span></button>`;
}
function manoCartas() { const jg = J(); return [...jg.tec.map(id => ({ tipo: "tec", id })), ...jg.mar.map(id => ({ tipo: "mar", id }))]; }
function renderMano() {
  const cartas = manoCartas(), n = cartas.length;
  $("#mano").innerHTML = cartas.map((c, i) => cartaHTML(c.tipo, c.id, `data-i="${i}" style="--rot:${((i - (n - 1) / 2) * 3.5).toFixed(1)}deg"`,
    (ui.sel && ui.sel.i === i ? "sel " : "") + (ui.fase === "descartar" ? "descartar" : ""))).join("");
  $("#mano").querySelectorAll(".carta").forEach(b => b.onclick = () => {
    const i = +b.dataset.i, c = cartas[i];
    if (ui.fase === "descartar" && ui.esperando.descarte) { resolver("descarte", { tipo: c.tipo, id: c.id }); return; }
    if (ui.fase === "accion" && !ui.ocupado) { ui.sel = ui.sel && ui.sel.i === i ? null : { ...c, i }; render(); return; }
    detalleCarta(c);
  });
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
      msg = n ? `Toca un objetivo que brilla en el cielo` : `Esta carta no tiene objetivos ahora`;
      btns = `<button type="button" class="btn-juego gris" id="b-ver">Ver carta</button>`;
    } else msg = "<b>Tu turno:</b> toca una carta y luego un objetivo";
    btns += `<button type="button" class="btn-juego" id="b-tel">${ICO.tele.replace("<svg", '<svg width="18" height="18" style="vertical-align:-3px"')} Telescopio</button>`;
  } else if (ui.fase === "post") { msg = `Publica si quieres. Después <b>roba ${K.ROBO === 1 ? "1 carta" : K.ROBO}</b>`; btns = robar; }
  else if (ui.fase === "robar") { msg = "Roba <b>1 más</b>"; btns = robar; }
  else if (ui.fase === "descartar") msg = `Tienes ${jg.tec.length + jg.mar.length} cartas: <b>toca una para descartar</b>`;
  else msg = `Juega <b>${esc(nombreJ(g.turnoDe))}</b>…`;
  $("#msg").innerHTML = msg;
  $("#msg").classList.toggle("mio", !g.terminado && !ui.ocupado && ["accion", "post", "robar", "descartar"].includes(ui.fase));
  $("#acciones").innerHTML = btns;
  const t = $("#b-tel"); if (t) t.onclick = hacerTelescopio;
  const v = $("#b-ver"); if (v) v.onclick = () => ui.sel && detalleCarta(ui.sel);
  const f = $("#b-final"); if (f) f.onclick = mostrarFinal;
  document.querySelectorAll("[data-robar]").forEach(b => b.onclick = () => { if (ui.esperando.mazo && !ui.ocupado) resolver("mazo", b.dataset.robar); });
}

// ---------------------------------------------------------- hojas de información
function detalleCarta(c) {
  if (c.tipo === "tec") {
    const t = TEC[c.id];
    return ventana({ titulo: `${esc(t.nombre)} · CD ${t.cd}`, color: "var(--tec-2)", botones: [], cuerpo: `
      <p><b>Aporta:</b> ${esc(t.aporta)}</p><p><b>Al descubrir:</b> ${t.sesgo}</p><p><b>Límite:</b> ${esc(t.limite)}</p>
      <p><b>Favorece:</b> ${esc(t.favor)}.<br><b>Perjudica:</b> ${esc(t.perj)}.</p>
      <p><b>Para medir:</b> sobre un planeta tuyo o publicado que no la tenga: agrega su dato. Dos técnicas distintas lo confirman (+${K.CONF - K.CAND} para quien lo publicó).</p>
      ${["astro", "imagen"].includes(t.id) ? `<p><b>Masa real:</b> si tu planeta tiene también Tránsito o Densidad, +${K.MASA}.</p>` : ""}
      <p class="tenue"><i>${esc(t.real)}</i></p>` });
  }
  const m = MAR[c.id];
  return ventana({ titulo: `${esc(m.nombre)} · CD ${m.cd}`, color: "var(--mar-2)", botones: [], cuerpo: `
    <p><b>Requisito:</b> ${m.req}</p>
    <div class="mods">${m.mods.map(([l, v, p]) => `<div><span class="v">${sgn(v)}</span><span>${esc(l)}: ${esc(p)}</span></div>`).join("")}</div>
    <p><b>Lees:</b> ${m.revela}.<br><b>Te sirve para publicar:</b> ${esc(m.publica)}.</p>
    <p><b>Si falla:</b> queda bajo el planeta: +${K.SENAL} a tus reintentos ahí.</p>
    <p><b>Refuta</b> (si el autor no usó este método y tu lectura lo contradice): ${m.refuta.map(x => CAT_NOMBRE[x]).join(", ") || "nada"}.</p>
    <p class="tenue"><i>${esc(m.real)}</i></p>` });
}
function detalleEstrella(e) {
  const pls = g.planetas.filter(p => p.est === e);
  ventana({ titulo: `Estrella ${esc(e.cl)} · ${esc(e.id)}`, color: "var(--est)", botones: [], cuerpo: `
    <p>${esc(K.DIST[e.dist])} · ${esc(K.EDAD[e.edad])} · ${esc(K.ACT[e.act])}${e.micro ? " · microlente ya usada" : ""}</p>
    <p>${e.texto}</p>
    <table class="tabla num"><tr><th>Técnica</th><th>Bono</th></tr>${ORDEN_TEC.map(t => `<tr><td>${esc(TEC[t].nombre)}</td><td>${e.bono[t] === null ? "imposible" : sgn(e.bono[t])}</td></tr>`).join("")}</table>
    ${pls.length ? `<div class="lista">${pls.map(p => `<button type="button" class="fila" data-pl="${p.id}"><span>${ficha(p.pubPlaneta !== null ? p.pubPlaneta : p.desc)} ${esc(p.nombre)} · ${esc(tamTemp(p))}</span><span class="tenue">${esc(estado(p))}</span></button>`).join("")}</div>` : '<p class="tenue">Sin planetas conocidos.</p>'}
    <p class="tenue">Cada planeta ya hallado aquí resta −${K.SATUR} a buscar otro.</p>`,
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
const MENU_SITIO = (document.querySelector('meta[name="sitio-menu"]') || {}).content || "";
const CREDITO = `<p class="credito">Desarrollado por <b>Luca Sallé</b><br>en el Observatorio Astronómico de Montevideo</p>`;
async function menu() {
  const v = await ventana({ titulo: "Menú", color: "var(--est)", botones: [], cuerpo: `<div class="lista">
    <button type="button" class="opcion" data-v="bitacora"><span>Bitácora de la partida</span></button>
    <button type="button" class="opcion" data-v="tutorial"><span>Tutorial</span></button>
    <button type="button" class="opcion" data-v="reglas"><span>Cómo se juega</span></button>
    <button type="button" class="opcion" data-v="nueva"><span>Nueva partida</span></button>${MENU_SITIO ? `<a class="opcion" href="${MENU_SITIO}"><span>Volver a los juegos</span></a>` : ""}</div>${CREDITO}`,
    alAbrir: (capa, cerrar) => capa.querySelectorAll("[data-v]").forEach(b => b.onclick = () => cerrar(b.dataset.v)) });
  if (v === "bitacora") verBitacora();
  if (v === "reglas") mostrarReglas();
  if (v === "tutorial") mostrarTutorial();
  if (v === "nueva") abrirPreparacion();
}
async function abrirPlaneta(pl) {
  const jg = J();
  const rivalPriv = pl.pubPlaneta === null && pl.desc !== YO;
  const pub = Object.entries(pl.publico);
  const sabe = Object.entries(g.sabe(jg, pl)).filter(([c]) => !(c in pl.publico));
  const metodos = [...pl.tecnicas.map(t => (t === "densidad" ? "Densidad" : TEC[t].nombre)), ...pl.marcadores.map(m => `${MAR[m.mid].nombre} (${nombreJ(m.jg)}${m.ok ? "" : ", no concl."})`)];
  const puede = !ui.ocupado && ["accion", "post"].includes(ui.fase);
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
  if (gan.idx === YO) banner("¡VICTORIA!", "tu equipo tiene la mayor reputación");
  const v = await ventana({ titulo: gan.idx === YO ? "¡Ganaste!" : `Gana ${esc(gan.nombre)}`, color: "var(--hito)", cuerpo: `
    <table class="tabla">${filas}</table>
    <h3>La Verdad de cada planeta</h3><div style="overflow-x:auto"><table class="tabla"><tr><th>Planeta</th><th>Era</th><th>Verdad</th></tr>${planetas || '<tr><td colspan="3">No se descubrieron planetas.</td></tr>'}</table></div>`,
    botones: [{ txt: "Cerrar", valor: null, clase: "gris" }, { txt: "Jugar otra", valor: "nueva" }] });
  if (v === "nueva") abrirPreparacion();
}
function mostrarReglas() {
  return ventana({ titulo: "Cómo se juega", color: "var(--est)", botones: [{ txt: "¡A jugar!", valor: true }], cuerpo: `
    <p>Diriges un equipo de astrónomos. Gana quien junte más <b>reputación</b> en ${K.RONDAS[3]} rondas (con 3 jugadores). La computadora hace de Director: guarda los planetas y su Verdad.</p>
    <h3>Tu turno: una acción</h3>
    <p><b>Técnica + estrella:</b> busca un planeta nuevo, o mide uno tuyo o publicado. Tira d20 + bonos ≥ CD (la gema de la carta).</p>
    <p><b>Marcador + planeta:</b> investígalo y lee en secreto su densidad, atmósfera, gases o contexto.</p>
    <p><b>Telescopio:</b> descarta cartas y roba 1.</p>
    <p>Antes o después, <b>publica</b>. Al final robas ${K.ROBO === 1 ? "1 carta" : K.ROBO} (máximo ${K.MANO_MAX} en mano).</p>
    <h3>Puntos</h3>
    <table class="tabla"><tr><td>Planeta</td><td>+${K.CAND} (+${K.CONF - K.CAND} al confirmarlo)</td></tr>
    ${CATS.map(c => `<tr><td>${CAT_NOMBRE[c]}</td><td>+${K.PUNTOS[c]} · necesitas ${Object.keys(SIRVE).filter(m => SIRVE[m].includes(c)).map(m => MAR[m].nombre).join(" o ")} exitoso tuyo ahí</td></tr>`).join("")}
    <tr><td>Masa real</td><td>+${K.MASA} · tu planeta tiene Astrometría o Imagen y Tránsito o Densidad</td></tr>
    <tr><td>Hallazgo inesperado</td><td>+${K.HALL}</td></tr></table>
    <h3>Refutar</h3><p>Cuando alguien publica, un rival puede cuestionarlo con un Marcador que el autor no usó. Si su tirada sale y lo que ve contradice lo publicado, se lleva los puntos.</p>
    <p><b>Artículo:</b> si publicas varias cosas del mismo planeta a la vez, sumas +${K.BONO_ART} por cada una extra, pero se refuta entero: si cae, el rival se lleva todos sus puntos.</p>
    <h3>Científicos</h3><table class="tabla">${D.cientificos.map(c => `<tr><td><b>${esc(c.nombre)}</b><br><span class="tenue">${esc(c.pais || "")}</span></td><td>${habilidades(c.id).map(esc).join(" · ")}</td></tr>`).join("")}</table>
    <h3>Hitos</h3><table class="tabla">${D.hitos.map(h => `<tr><td>${esc(h.nombre)} +${h.pts}</td><td>${esc(h.cond)}</td></tr>`).join("")}</table>
    <p class="tenue">${esc(K.PIE)}</p>` });
}

// ---------------------------------------------------------- partida
const ESTILO_CIENT = { vida: ["seager", "kaltenegger"], explorador: ["borucki", "mayor"], gigantes: ["charbonneau", "marois"], verificador: ["fernandez", "tancredi"] };
function crearJuego(pref) {
  const usados = new Set([pref.cient]);
  const jugadores = [{ nombre: pref.nombre || "Tu equipo", humano: true, cient: pref.cient, ctrl: new Humano() }];
  const estilos = Object.keys(ESTILOS).sort(() => Math.random() - 0.5);
  for (let i = 0; i < pref.rivales; i++) {
    const est = estilos[i % estilos.length];
    const car = est === "verificador" ? "mentiroso" : (Math.random() < 0.5 ? "mentiroso" : "conservador");
    const cid = ESTILO_CIENT[est].find(c => !usados.has(c)) || D.cientificos.find(c => !usados.has(c.id)).id;
    usados.add(cid);
    jugadores.push({ nombre: `Equipo ${CIEN[cid].nombre.split(" y ")[0].split(" ").pop()}`, estilo: est, cient: cid, ctrl: new Bot(est, car) });
  }
  const juego = new Juego({ jugadores });
  ui.hitosPend = [];
  for (const jg of juego.j) if (jg.ctrl instanceof Bot) jg.ctrl.pausa = async () => { if (juego !== g) throw CANCELADO; render(); await mostrarHitos(); await sleep(ui.velocidad); };
  juego.vista = async (tipo, d) => {
    if (juego !== g) throw CANCELADO;
    try { await vista(tipo, d); await mostrarHitos(); } catch (e) { console.error(e); }
    if (juego !== g) throw CANCELADO;
  };
  juego.on((tipo, d) => {
    if (juego !== g) return;
    if (tipo === "log") ui.log.push(d);
    if (tipo === "puntos") { setTimeout(() => flotante(d.jg, d.v), 30); }
    if (tipo === "hito") ui.hitosPend.push(d);
    if (tipo === "hallazgo" && d.jg !== YO) aviso(`${ficha(d.jg)} <b>${esc(nombreJ(d.jg))}</b> encuentra un hallazgo: ${esc(d.h.nombre)}`, "hito");
    if (tipo === "descubre" && d.jg !== YO) aviso(`${ficha(d.jg)} <b>${esc(nombreJ(d.jg))}</b> descubre un candidato en ${esc(d.pl.est.cl)}: ${esc(tamTemp(d.pl))}`);
    if (tipo === "turno" || tipo === "cambio" || tipo === "ronda" || tipo === "puntos") render();
    if (tipo === "ronda") aviso(`Ronda ${d.ronda} de ${juego.maxRondas}`);
  });
  return juego;
}
async function empezar(pref) {
  for (const k of Object.keys(ui.esperando)) delete ui.esperando[k];
  document.querySelectorAll("#capa .velo").forEach(v => v.remove());
  Object.assign(ui, { fase: "espera", sel: null, ocupado: false, log: [], velocidad: +pref.velocidad, ayudas: !!pref.ayudas });
  g = crearJuego(pref);
  render();
  const esta = g;
  try {
    await g.jugar();
    if (esta !== g) return;
    ui.fase = "fin"; render();
    await mostrarFinal();
  } catch (e) { if (e !== CANCELADO) { console.error(e); aviso("Error en la partida: " + esc(e.message)); } }
}
// ---------------------------------------------------------- tutorial
const TUTORIAL = [
  ["¡Bienvenido, astrónomo!", `<p>Compites con otros equipos por <b>reputación</b>: descubre exoplanetas y publica lo que sabes de ellos.</p>
    <p>Gana quien tenga más puntos al terminar las rondas.</p>`],
  ["Tu turno: carta + objetivo", `<p>Toca una <b>carta de tu mano</b> y después un <b>objetivo que brilla</b> en el cielo.</p>
    <p>Cada objetivo muestra su <b>%</b>: la probabilidad de que tu tirada (d20 + bonos) salga.</p>`],
  ["Técnicas: buscar y medir", `<p>Con una <b>Técnica</b> observas una estrella: buscas un <b>planeta nuevo</b> o mides uno ya hallado.</p>
    <p>Cada estrella suma o resta a cada técnica. <b>✕</b> significa que ahí es imposible.</p>`],
  ["Marcadores: investigar", `<p>Con un <b>Marcador</b> investigas un planeta: lees su atmósfera, sus gases o su estrella.</p>
    <p>Lo que lees te sirve para <b>publicar</b> y para <b>refutar</b> a otros.</p>`],
  ["Publicar", `<p>Tus planetas son <b>secretos</b> hasta que los publicas con el botón <b>Publicar</b>.</p>
    <p>Planeta <b>+${K.CAND}</b> · Atmósfera <b>+${K.PUNTOS.atmosfera}</b> · Habitable <b>+${K.PUNTOS.habitable}</b> · Biofirma <b>+${K.PUNTOS.biofirma}</b>.</p>
    <p class="tenue">Publicar no gasta tu acción. Cada hallazgo es del primero que lo publica.</p>`],
  ["Refutar: cuidado con mentir", `<p>Cuando publicas, un rival puede <b>refutarte</b> con un Marcador. Si lo que ve contradice tu afirmación, <b>se lleva tus puntos</b>.</p>
    <p>Un <b>artículo</b> (varias cosas del mismo planeta a la vez) da +${K.BONO_ART} por cada extra, pero se refuta entero.</p>`],
  ["Sin jugada: telescopio", `<p>Si no te sirve ninguna carta, pide <b>Telescopio</b>: descartas las que quieras y robas 1.</p>
    <p>Al final de cada turno <b>robas ${K.ROBO === 1 ? "1 carta" : K.ROBO}</b>: eliges si es Técnica o Marcador.</p>`],
  ["Tu científico", `<p>Tu científico te da ventajas: las ves siempre en tu barra, abajo.</p>
    <p>Elige un plan según tu científico, el cielo y tu mano. Buscar vida no es la única forma de ganar.</p>
    <p class="tenue">Puedes volver a ver esto en <b>Menú → Tutorial</b>.</p>`],
];
async function mostrarTutorial() {
  for (let i = 0; i < TUTORIAL.length;) {
    const [titulo, cuerpo] = TUTORIAL[i], ultimo = i === TUTORIAL.length - 1;
    const puntos = `<div class="tut-puntos">${TUTORIAL.map((_, k) => `<span class="${k === i ? "on" : ""}"></span>`).join("")}</div>`;
    const v = await ventana({ titulo, centro: true, color: "linear-gradient(90deg,#3b2bb0,#1b8fb0)", cuerpo: `<div class="tut">${cuerpo}</div>${puntos}`,
      botones: [ultimo ? null : { txt: "Saltar", valor: "fin", clase: "gris" }, i ? { txt: "Atrás", valor: "atras", clase: "gris" } : null,
        { txt: ultimo ? "¡A jugar!" : "Siguiente", valor: "sig" }].filter(Boolean) });
    if (v === "atras") i--; else if (v === "sig") i++; else break;
  }
  preferencias.tutorialVisto = true;
  try { localStorage.setItem("exo-pref", JSON.stringify(preferencias)); } catch (e) {}
}

function abrirPreparacion() {
  let sel = preferencias.cient;
  const p = ventana({ titulo: "Sistemas Exoplanetas", color: "linear-gradient(90deg,#3b2bb0,#1b8fb0)", cerrable: !!g && g.turnos > 0, cuerpo: `
    <p>Compite contra equipos de la computadora para descubrir exoplanetas y buscar señales de vida. Elige tu científico: su ventaja define tu mejor jugada.</p>
    <div class="cient-lista">${D.cientificos.map(c => `<button type="button" class="cient ${c.id === sel ? "sel" : ""}" data-c="${c.id}"><span class="est">${esc(c.pais || "")}</span><b>${esc(c.nombre)}</b><span class="e">${habilidades(c.id).map(esc).join(" · ")}</span></button>`).join("")}</div>
    <div class="campos">
      <label class="campo" for="p-nombre">Nombre de tu equipo<input id="p-nombre" maxlength="18" value="${esc(preferencias.nombre)}" placeholder="Tu equipo"></label>
      <label class="campo" for="p-rivales">Rivales<select id="p-rivales">${[1, 2, 3].map(n => `<option value="${n}" ${+preferencias.rivales === n ? "selected" : ""}>${n} (${K.RONDAS[n + 1]} rondas)</option>`).join("")}</select></label>
      <label class="campo" for="p-vel">Velocidad rivales<select id="p-vel">${[["1100", "Lenta"], ["650", "Normal"], ["250", "Rápida"]].map(([v, t]) => `<option value="${v}" ${String(preferencias.velocidad) === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <label class="campo" for="p-ayuda">Ayudas<select id="p-ayuda"><option value="1" ${preferencias.ayudas ? "selected" : ""}>Con probabilidades</option><option value="0" ${preferencias.ayudas ? "" : "selected"}>Sin ayudas</option></select></label>
    </div>${CREDITO}`,
    botones: [{ txt: "Tutorial", valor: "tutorial", clase: "gris" }, { txt: "Reglas", valor: "reglas", clase: "gris" }, { txt: "¡Jugar!", valor: "ok" }],
    alAbrir: capa => {
      capa.querySelectorAll(".cient").forEach(b => b.onclick = () => { sel = b.dataset.c; capa.querySelectorAll(".cient").forEach(x => x.classList.toggle("sel", x === b)); });
      capa.querySelectorAll(".acciones .btn-juego").forEach(b => b.addEventListener("click", () => {
        preferencias.nombre = capa.querySelector("#p-nombre").value.trim();
        preferencias.rivales = +capa.querySelector("#p-rivales").value;
        preferencias.velocidad = +capa.querySelector("#p-vel").value;
        preferencias.ayudas = capa.querySelector("#p-ayuda").value === "1";
      }, { capture: true }));
    } });
  p.then(v => {
    if (v === "reglas") { mostrarReglas().then(abrirPreparacion); return; }
    if (v === "tutorial") { mostrarTutorial().then(abrirPreparacion); return; }
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
if (preferencias.tutorialVisto) abrirPreparacion(); else mostrarTutorial().then(abrirPreparacion);
