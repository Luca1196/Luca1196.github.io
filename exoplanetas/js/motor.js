// ===================================================================
//  Sistemas Exoplanetas · motor de reglas (mismas reglas que las cartas)
// ===================================================================
const D = (typeof DATOS !== "undefined") ? DATOS : require("./datos.json");
const K = D.k;
const TEC = Object.fromEntries(D.tecnicas.map(t => [t.id, t]));
const MAR = Object.fromEntries(D.marcadores.map(m => [m.id, m]));
const CIEN = Object.fromEntries(D.cientificos.map(c => [c.id, c]));
const HITO = Object.fromEntries(D.hitos.map(h => [h.id, h]));
const CATS = ["atmosfera", "habitable", "biofirma"];
const CAT_NOMBRE = { atmosfera: "Atmósfera", habitable: "Habitable", biofirma: "Biofirma" };
// Por qué cada estrella ayuda o perjudica a cada técnica (mismas reglas que bonos_estrella en generar_mazo.py)
function explicarEstrella(tid, est) {
  const m = est.m, lej = est.dist === "lejana", cer = est.dist === "cercana", act = est.act === "activa";
  const r = [], E = K.ESCALA || 1, add = (v, t) => r.push([v * E, t]);
  if (tid === "transito") {
    if (est.fTr) { add(1, "estrella F grande: solo se ven Gigantes, pero su sombra es profunda"); if (lej) add(-1, "lejana: llega poca luz y hay más ruido"); }
    else {
      if (m < 0.6) add(2, "estrella muy pequeña: el planeta tapa más parte de su disco");
      else if (m < 0.9) add(1, "estrella pequeña: el planeta tapa más parte de su disco");
      else if (m > 1.1) add(-1, "estrella grande: el planeta tapa poco de su disco");
      if (lej) add(-1, "lejana: llega poca luz y hay más ruido");
      if (act) add(-1, "activa: manchas y fulguraciones esconden los tránsitos");
    }
  } else if (tid === "rv") {
    if (m < 0.6) add(2, "estrella liviana: el planeta la hace bambolear más");
    else if (m < 0.9) add(1, "estrella liviana: el planeta la hace bambolear más");
    else if (m > 1.15) add(-2, "estrella masiva y caliente: se mueve poco, tiene pocas líneas y gira rápido");
    if (act) add(-1, "activa: su superficie agitada mete ruido en la medida");
  } else if (tid === "astro") {
    if (cer) add(2, "cercana: su vaivén se nota en el cielo");
    if (m < 0.6) add(1, "liviana: el planeta la mueve más");
    if (m > 1.2) add(-1, "masiva: el planeta casi no la mueve");
  } else if (tid === "imagen") {
    if (cer) add(2, "cercana: planeta y estrella se ven bien separados");
    if (lej) add(-3, "lejana: el planeta queda pegado al brillo de la estrella");
  } else if (tid === "micro") {
    if (lej) add(2, "lejana: hay más estrellas de fondo con las que alinearse");
    if (m < 0.6) add(1, "enana: las estrellas-lente típicas son pequeñas");
  }
  const b = est.bono[tid], s = r.reduce((x, [v]) => x + v, 0);
  if (b !== null && b !== undefined && s !== b) r.push([b - s, `tope: ningún bono pasa de ±${3 * E}`]);
  if (!r.length) r.push([0, "estrella promedio para esta técnica: sin ventaja ni desventaja"]);
  return r;
}
// ¿Este Marcador te deja publicar esto en este planeta? La Densidad de un Gigante o Neptuniano prueba
// que es un mundo de gas: sirve también para publicar su Atmósfera.
function sirve(mid, cat, pl) {
  return SIRVE[mid].includes(cat) || (!!K.DENS_ATM && mid === "densidad" && cat === "atmosfera" && !!pl
    && (pl.rasgos.includes("Gigante") || pl.rasgos.includes("Neptuniano")));
}
function sirveLista(mid, pl) { return CATS.filter(c => sirve(mid, c, pl)); }
const DATO_TEC = { transito: "R", rv: "M", astro: "M", imagen: "M", micro: "M" };
const CAMPOS_MAR = { densidad: ["dens"], esp_transito: ["atm", "gases"], esp_emision: ["atm"],
                     esp_imagen: ["atm", "gases"], contexto: ["ctx"] };
// «Te sirve para publicar» de cada Marcador (texto de la carta)
const SIRVE = { densidad: ["habitable"], esp_transito: ["atmosfera", "biofirma"],
                esp_emision: ["atmosfera", "habitable"], esp_imagen: ["atmosfera", "biofirma"],
                contexto: ["biofirma"] };
const RASGOS_PUB = ["Pequeño", "Neptuniano", "Gigante", "Caliente", "Frío"];
const VALOR_DESC = { transito: 3.0, rv: 2.4, astro: 1.8, imagen: 2.2, micro: 1.4 };
const ORDEN_TEC = ["transito", "rv", "astro", "imagen", "micro"];

function rng32(seed) {           // mulberry32
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pTirada(mod, cd) {
  let p = 0;
  for (let d = 1; d <= 20; d++) if (d === 20 || (d !== 1 && d + mod >= cd)) p++;
  return p / 20;
}

const rasgosPub = a => a.rasgos.filter(r => RASGOS_PUB.includes(r));
const esGig = a => a.rasgos.includes("Gigante");
function compatible(a, est) {
  const s = a.solo;
  return !s || (s === "joven" && est.edad === "joven") || (s === "madura" && est.edad !== "joven")
    || (s === "activa" && est.act === "activa");
}
function verdad(a, cat) {
  if (a.falso) return false;
  if (cat === "atmosfera") return a.atmOk;
  if (cat === "habitable") return a.hab === "Sí";
  return a.vida === "Real";
}
// ¿La lectura de este Marcador contradice lo publicado? (solo refuta quien ve el error)
function veFalsedad(mid, a, cat) {
  if (a.falso) return true;
  const esp = mid.startsWith("esp");
  if (cat === "biofirma") return mid === "contexto" || (CAMPOS_MAR[mid].includes("gases") && !K.GASES_VIDA.includes(a.gases));
  if (cat === "habitable") return mid === "contexto" || (mid === "densidad" && a.dens !== K.DENS_ROCA) || (esp && a.atm === "Ninguna");
  return esp;
}
function vePlaneta(tid, a, est) {
  if (tid === "astro") return esGig(a);
  if (tid === "imagen") return esGig(a) && a.rasgos.includes("Joven") && est.edad === "joven";
  if (tid === "micro") return false;
  return true;
}
const esTierra = a => a.o === 3 && a.R && a.R <= 1.8;
const valor = (a, campo) => a[campo];

class Mazo {
  constructor(cartas, rnd) { this.rnd = rnd; this.cartas = cartas.slice(); this.desc = []; this.mezclar(this.cartas); }
  mezclar(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(this.rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } }
  robar() {
    if (!this.cartas.length && this.desc.length) { this.cartas = this.desc; this.desc = []; this.mezclar(this.cartas); this.rebarajado = true; }
    return this.cartas.length ? this.cartas.pop() : null;
  }
  get vacio() { return !this.cartas.length && !this.desc.length; }
}

let _plId = 0;
class Planeta {
  constructor(a, est, desc) {
    this.id = ++_plId; this.a = a; this.est = est; this.desc = desc;
    this.rasgos = a.rasgos; this.rasgosPub = rasgosPub(a);
    this.tecnicas = []; this.lado = {}; this.publicado = {}; this.micro = false; this.vivo = true;
    this.publico = {}; this.abierto = false; this.pubPlaneta = null; this.expuesto = false;
    this.ptsPlaneta = 0; this.marcadores = []; this.letra = "";
  }
  ladoDe(i) { return this.lado[i] || (this.lado[i] = new Set()); }
  get confirmado() { return new Set(this.tecnicas).size >= 2; }
  get nombre() { return `${this.est.cl}${this.letra}`; }
}

class Juego {
  constructor(opts) {
    this.seed = opts.seed ?? Math.floor(Math.random() * 1e9);
    this.rnd = rng32(this.seed);
    this.oyentes = [];
    const r = this.rnd;
    const est = D.estrellas.slice();
    for (let i = est.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [est[i], est[j]] = [est[j], est[i]]; }
    this.estrellas = est.slice(0, K.EN_MESA).map(e => ({ ...e, bono: { ...e.bono }, micro: false }));
    this.mt = new Mazo(D.tecnicas.flatMap(t => Array(t.copias).fill(t.id)), r);
    this.mm = new Mazo(D.marcadores.flatMap(m => Array(m.copias).fill(m.id)), r);
    const mp = D.planetas.flatMap(a => Array(a.n).fill(a)).concat(D.hallazgos.map(h => ({ ...h, hallazgo: true })));
    this.mp = mp; new Mazo([], r).mezclar(this.mp);
    this.planetas = []; this.senal = {}; this.hitos = {}; this.descartePlanetas = 0;
    this.j = opts.jugadores.map((p, i) => ({ idx: i, nombre: p.nombre, humano: !!p.humano, estilo: p.estilo,
      cient: p.cient, ctrl: p.ctrl, color: p.color, tec: [], mar: [], pts: {}, sabe: {}, hallazgos: [] }));
    for (const jg of this.j) {
      for (let k = 0; k < K.MANO_T; k++) this.robar(jg, "tec", true);
      for (let k = 0; k < K.MANO_M; k++) this.robar(jg, "mar", true);
    }
    this.maxRondas = opts.rondas ?? K.RONDAS[this.j.length] ?? 13;
    this.ronda = 0; this.turnoDe = 0; this.fin = false; this.terminado = false; this.turnos = 0;
  }

  // ---------------------------------------------------------- utilidades
  on(f) { this.oyentes.push(f); }
  emit(tipo, datos = {}) { for (const f of this.oyentes) f(tipo, datos); }
  log(txt, extra = {}) { this.emit("log", { txt, ...extra }); }
  async mostrar(tipo, datos) { if (this.vista) await this.vista(tipo, datos); }
  total(jg) { return Object.values(jg.pts).reduce((a, b) => a + b, 0); }
  sumar(jg, clave, v, motivo) {
    if (!v) return;
    jg.pts[clave] = (jg.pts[clave] || 0) + v;
    this.emit("puntos", { jg: jg.idx, v, motivo });
  }
  tirar(mod, cd) {
    const d = 1 + Math.floor(this.rnd() * 20);
    const ok = d === 20 || (d !== 1 && d + mod >= cd);
    return { d, mod, cd, ok };
  }
  robar(jg, cual, silencio = false) {
    const mazo = cual === "tec" ? this.mt : this.mm;
    const c = mazo.robar();
    if (mazo.rebarajado) { mazo.rebarajado = false; this.log(`Se mezclaron los descartes de ${cual === "tec" ? "Técnicas" : "Marcadores"}.`, { tipo: "info" }); }
    if (c === null) return false;
    (cual === "tec" ? jg.tec : jg.mar).push(c);
    if (!silencio) this.emit("robo", { jg: jg.idx, cual });
    return true;
  }
  sabe(jg, pl) { return jg.sabe[pl.id] || (jg.sabe[pl.id] = {}); }
  conoce(jg, pl, campo) { return campo in pl.publico || campo in this.sabe(jg, pl); }
  satur(est) { return K.SATUR * this.planetas.filter(p => p.est === est).length; }
  clPl(pl) { return (pl.rasgos.includes("Gigante") || pl.rasgos.includes("Neptuniano")) ? ["gaseoso"] : []; }
  bonoCient(jg, claves) {
    const c = jg.cient && CIEN[jg.cient];
    return c && claves.includes(c.clave) ? c.bono : 0;
  }
  clavesMar(mid) { return mid.startsWith("esp_") ? ["mar:esp"] : ["mar:" + mid]; }
  puedeActuar(jg, pl) { return pl.vivo && (pl.abierto || pl.desc === jg.idx); }
  planetasRestantes() { return this.mp.filter(x => !x.hallazgo).length; }

  // Bonos de una observación (descubrir) con desglose para la interfaz
  modDescubrir(jg, tid, est) {
    const partes = [];
    const b = est.bono[tid]; partes.push([`estrella ${est.cl}`, b, explicarEstrella(tid, est)]);
    const s = this.satur(est); if (s) partes.push(["ya hallados ahí", -s, "lo fácil de encontrar en esa estrella ya se encontró"]);
    const c = this.bonoCient(jg, ["tec:" + tid]); if (c) partes.push([CIEN[jg.cient].nombre, c, "ventaja de tu científico"]);
    return { mod: partes.reduce((x, [, v]) => x + v, 0), partes, cd: TEC[tid].cd };
  }
  modMedir(jg, tid, pl) {
    const partes = [[`estrella ${pl.est.cl}`, pl.est.bono[tid], explicarEstrella(tid, pl.est)]];
    const c = this.bonoCient(jg, ["tec:" + tid, "confirmar", ...this.clPl(pl)]); if (c) partes.push([CIEN[jg.cient].nombre, c, "ventaja de tu científico"]);
    return { mod: partes.reduce((x, [, v]) => x + v, 0), partes, cd: TEC[tid].cd };
  }
  // Investigar sin dado: funciona salvo que las condiciones sumen UMBRAL_MAR o menos
  marcadorFunciona(m) { return m.mod > K.UMBRAL_MAR; }
  pMarcador(m) { return K.MAR_SIN_DADO ? (this.marcadorFunciona(m) ? 1 : 0) : pTirada(m.mod, m.cd); }
  modMarcador(jg, mid, pl, refutando = false) {
    const partes = [];
    for (const [lab, v, por] of MAR[mid].mods) {
      let aplica = false;
      if (pl.rasgos.includes(lab)) aplica = true;
      else if (lab === "Estrella enana M") aplica = pl.est.cl[0] === "M";
      else if (lab === "Estrella activa") aplica = pl.est.act === "activa";
      else if (lab === "Estrella cercana") aplica = pl.est.dist === "cercana";
      else if (lab === "Aún sin leer Gases") aplica = !this.conoce(jg, pl, "gases");
      if (aplica) partes.push([lab, v, por]);
    }
    if (!refutando) {
      let n = this.senal[`${jg.idx}|${pl.id}|${mid}`] || 0;
      if (jg.cient === "seager" && mid.startsWith("esp"))
        n = Object.entries(this.senal).filter(([k]) => k.endsWith(`|${pl.id}|${mid}`)).reduce((s, [, v]) => s + v, 0);
      if (n) partes.push(["señal acumulada", K.SENAL * n, "las observaciones anteriores se suman a esta"]);
    }
    const claves = [...this.clavesMar(mid), ...this.clPl(pl), ...(refutando ? ["refutar"] : [])];
    const c = this.bonoCient(jg, claves); if (c) partes.push([CIEN[jg.cient].nombre, c, "ventaja de tu científico"]);
    return { mod: partes.reduce((x, [, v]) => x + v, 0), partes, cd: MAR[mid].cd };
  }
  requisito(mid, pl) {
    if (mid === "densidad") return !pl.micro;
    if (mid === "esp_emision" && pl.rasgos.includes("Gigante") && pl.rasgos.includes("Caliente")) return true;
    if (mid === "esp_transito" || mid === "esp_emision") return pl.tecnicas.includes("transito");
    if (mid === "esp_imagen") return pl.tecnicas.includes("imagen") || (pl.rasgos.includes("Gigante") && pl.rasgos.includes("Frío") && pl.est.dist === "cercana");
    return true;
  }
  // requisito con lo que el jugador puede saber (los rasgos públicos)
  requisitoVisible(mid, pl) {
    if (mid === "esp_emision") return pl.tecnicas.includes("transito") || (pl.rasgosPub.includes("Gigante") && pl.rasgosPub.includes("Caliente"));
    if (mid === "esp_imagen") return pl.tecnicas.includes("imagen") || (pl.rasgosPub.includes("Gigante") && pl.rasgosPub.includes("Frío") && pl.est.dist === "cercana");
    return this.requisito(mid, pl);
  }

  // ---------------------------------------------------------- opciones legales
  puedeDescubrir(jg, tid, est) { return est.bono[tid] !== null && !(tid === "micro" && est.micro); }
  puedeMedir(jg, tid, pl) {
    return this.puedeActuar(jg, pl) && !pl.micro && !pl.tecnicas.includes(tid) && pl.est.bono[tid] !== null
      && (tid !== "astro" || pl.rasgosPub.includes("Gigante"))
      && (tid !== "imagen" || (pl.rasgosPub.includes("Gigante") && pl.est.edad === "joven"));
  }
  puedeInvestigar(jg, mid, pl) {
    if (!this.puedeActuar(jg, pl) || !this.requisitoVisible(mid, pl)) return false;
    return !CAMPOS_MAR[mid].every(c => this.conoce(jg, pl, c));
  }
  sirveParaPublicar(jg, pl, cat) {
    return [...pl.ladoDe(jg.idx)].some(m => MAR[m] && sirve(m, cat, pl));
  }
  puedePublicar(jg, pl, cat) {
    if (!pl.vivo || cat in pl.publicado) return false;
    if (!pl.abierto && pl.desc !== jg.idx) return false;
    return this.sirveParaPublicar(jg, pl, cat);
  }
  puedeRefutar(jg, mid, pl, cat) {
    const autor = pl.publicado[cat].autor;
    if (!K.REFUTAN[cat].includes(mid) || !this.requisito(mid, pl)) return false;
    if (pl.ladoDe(autor).has(mid) && jg.cient !== "fernandez") return false;
    return true;
  }

  // ---------------------------------------------------------- planetas del mazo
  _robarPlaneta(ctx) {
    let guard = 0;
    while (this.mp.length && guard++ < 60) {
      const p = this.mp.pop();
      if (!p.hallazgo) { if (!this.planetasRestantes()) this.fin = true; return p; }
      if (ctx && p.tec === ctx.tid) { ctx.hall = p; if (!this.planetasRestantes()) this.fin = true; return null; }
      this.mp.unshift(p);
      if (!this.planetasRestantes()) { this.fin = true; return null; }
    }
    this.fin = true; return null;
  }
  _elegirPlaneta(tid, est, ctx) {
    const comp = a => compatible(a, est);
    const fondo = a => this.mp.unshift(a);
    const descartar = () => { this.descartePlanetas++; };
    ctx.vistos = 0;
    if (tid === "astro" || tid === "imagen" || (tid === "transito" && est.fTr)) {
      for (let n = this.mp.length; n > 0; n--) {
        const a = this._robarPlaneta(ctx); if (!a) return null; ctx.vistos++;
        if (esGig(a) && (tid !== "imagen" || a.rasgos.includes("Joven")) && comp(a)) return a;
        fondo(a); this.fin = false;
      }
      return null;
    }
    let robados = [], intentos = this.mp.length;
    while (robados.length < 2 && intentos-- > 0) {
      const a = this._robarPlaneta(ctx); if (!a) break; ctx.vistos++;
      if (comp(a)) robados.push(a); else { fondo(a); this.fin = this.planetasRestantes() ? false : this.fin; }
    }
    if (ctx.hall) { robados.forEach(descartar); return null; }
    if (!robados.length) return null;
    if (tid === "micro") {
      const val = robados.filter(a => a.o === 3 || a.o === 4).sort((x, y) => x.M - y.M);
      robados.filter(a => !val.includes(a)).forEach(descartar);
      val.slice(1).forEach(descartar);
      return val[0] || null;
    }
    if (est.enana) {            // enana M: un gigante se descarta y se roba otro
      for (let i = 0; i < robados.length; i++) {
        if (!esGig(robados[i])) continue;
        descartar();
        let b = null, g = 0;
        while (g++ < 40 && this.mp.some(x => !x.hallazgo && !esGig(x) && comp(x))) {
          b = this._robarPlaneta(ctx); if (!b) break;
          if (!esGig(b) && comp(b)) break;
          fondo(b); b = null;
        }
        if (ctx.hall) { robados.forEach(descartar); return null; }
        if (!b) { robados.splice(i, 1); i--; } else robados[i] = b;
      }
      if (!robados.length) return null;
    }
    if (est.metal) {
      const g = robados.find(esGig);
      if (g) { robados.filter(a => a !== g).forEach(descartar); return g; }
    }
    robados.sort(tid === "transito" ? (x, y) => x.o - y.o : (x, y) => y.M - x.M);
    robados.slice(1).forEach(descartar);
    return robados[0];
  }

  // ---------------------------------------------------------- acciones
  async descubrir(jg, tid, est) {
    jg.tec.splice(jg.tec.indexOf(tid), 1);
    if (tid === "micro") est.micro = true;
    const m = this.modDescubrir(jg, tid, est);
    const t = this.tirar(m.mod, m.cd);
    this.emit("tirada", { jg: jg.idx, que: `${TEC[tid].nombre} en ${est.cl}`, tid, ...t, partes: m.partes });
    await this.mostrar("tirada", { jg: jg.idx, que: `${TEC[tid].nombre} en ${est.cl}`, tid, ...t, partes: m.partes });
    if (!t.ok) {
      this.mt.desc.push(tid);
      this.log(`${jg.nombre} observa ${est.cl} con ${TEC[tid].nombre}: no detecta nada.`, { jg: jg.idx });
      return { ok: false, tirada: t };
    }
    const ctx = { tid };
    const a = this._elegirPlaneta(tid, est, ctx);
    if (ctx.hall) {
      this.mt.desc.push(tid);
      jg.hallazgos.push(ctx.hall);
      this.sumar(jg, "hallazgos", K.HALL, ctx.hall.nombre);
      this.log(`${jg.nombre} observa ${est.cl} y encuentra algo inesperado: ${ctx.hall.nombre} (+${K.HALL}).`, { jg: jg.idx, tipo: "hallazgo" });
      this.emit("hallazgo", { jg: jg.idx, h: ctx.hall, est });
      return { ok: true, hallazgo: ctx.hall, tirada: t };
    }
    if (!a) {
      this.mt.desc.push(tid);
      this.log(`${jg.nombre} observa ${est.cl}: la señal no corresponde a ningún planeta.`, { jg: jg.idx });
      return { ok: true, vacio: true, tirada: t };
    }
    const pl = new Planeta(a, est, jg.idx);
    pl.letra = "bcdefgh"[this.planetas.filter(p => p.est === est).length] || "x";
    pl.tecnicas.push(tid); pl.ladoDe(jg.idx).add(tid); pl.micro = tid === "micro";
    pl.publico.o = a.o; pl.publico[DATO_TEC[tid]] = a[DATO_TEC[tid]];
    pl.tDesc = this.turnos; pl.rDesc = this.ronda;
    this.planetas.push(pl);
    this.log(`${jg.nombre} descubre un candidato en ${est.cl}: ${pl.rasgosPub.join(", ") || "templado"}.`, { jg: jg.idx, tipo: "desc" });
    this.emit("descubre", { jg: jg.idx, pl });
    return { ok: true, pl, tirada: t };
  }

  _exponerFalso(jg, pl) {
    pl.vivo = false;
    if (pl.pubPlaneta !== null) {
      pl.expuesto = true;
      const autor = this.j[pl.pubPlaneta];
      this.sumar(autor, "planetas", -pl.ptsPlaneta + K.FALSO, "falso positivo");
      pl.ptsPlaneta = K.FALSO;
      if (pl.cientDado) { this.sumar(this.j[pl.cientDado[0]], "cientifico", -pl.cientDado[1], "falso positivo"); pl.cientDado = null; }
      if (jg.idx !== pl.pubPlaneta) this.darHito(jg, "revision");
      this.log(`¡${pl.nombre} era un falso positivo! ${autor.nombre} pierde lo que ganó por él.`, { tipo: "malo" });
    } else this.log(`${jg.nombre} descarta un candidato: era un falso positivo.`, { jg: jg.idx });
    this.emit("falso", { jg: jg.idx, pl });
  }
  // masa verdadera (Astrometría o Imagen) + radio (Tránsito o Densidad) en tu planeta: composición medida
  completaMasa(pl, extra = []) {
    const t = new Set([...pl.tecnicas, ...extra]);
    const radio = t.has("transito") || t.has("densidad") || pl.marcadores.some(m => m.mid === "densidad" && m.ok);
    return (t.has("astro") || t.has("imagen")) && radio;
  }
  masaReal(jg, pl) {
    if (!K.MASA || pl.masaCobrada || !pl.vivo) return;
    const dueño = pl.pubPlaneta !== null ? pl.pubPlaneta : pl.desc;
    if (dueño !== jg.idx || !this.completaMasa(pl)) return;
    pl.masaCobrada = true;
    this.sumar(jg, "masa_real", K.MASA, `masa real de ${pl.nombre}`);
    this.log(`${jg.nombre} mide la masa real de ${pl.nombre}: su composición queda medida (+${K.MASA}).`, { jg: jg.idx, tipo: "bueno" });
    const ex = K.MASA_CIENT && K.MASA_CIENT[jg.cient];
    if (ex) this.sumar(jg, "cientifico", ex, `especialidad de ${CIEN[jg.cient].nombre}`);
  }
  _confirmar(jg, pl) {
    const dueño = pl.pubPlaneta !== null ? pl.pubPlaneta : pl.desc;
    if (jg.cient === "tancredi" && dueño !== jg.idx && K.TANC) { this.sumar(jg, "cientifico", K.TANC, "confirma un planeta ajeno"); this.log(`${jg.nombre} suma +${K.TANC} por confirmar un planeta ajeno (Tancredi).`, { jg: jg.idx, tipo: "bueno" }); }
    if (pl.pubPlaneta !== null) {
      const d = this.j[pl.pubPlaneta];
      const v = K.CONF - K.CAND;
      this.sumar(d, "planetas", v, "planeta confirmado"); pl.ptsPlaneta += v;
    }
    this.log(`${pl.nombre} queda confirmado (2 métodos).`, { tipo: "bueno" });
  }

  async medir(jg, tid, pl) {
    jg.tec.splice(jg.tec.indexOf(tid), 1);
    const m = this.modMedir(jg, tid, pl);
    const t = this.tirar(m.mod, m.cd);
    this.emit("tirada", { jg: jg.idx, que: `${TEC[tid].nombre} sobre ${pl.nombre}`, tid, ...t, partes: m.partes });
    await this.mostrar("tirada", { jg: jg.idx, que: `${TEC[tid].nombre} sobre ${pl.nombre}`, tid, ...t, partes: m.partes });
    if (!t.ok) { this.mt.desc.push(tid); this.log(`${jg.nombre} intenta medir ${pl.nombre} con ${TEC[tid].nombre}: sin éxito.`, { jg: jg.idx }); return { ok: false, tirada: t }; }
    if (pl.a.falso) { this.mt.desc.push(tid); this._exponerFalso(jg, pl); return { ok: true, falso: true, tirada: t }; }
    if (!vePlaneta(tid, pl.a, pl.est)) { this.mt.desc.push(tid); this.log(`${TEC[tid].nombre} no logra ver ${pl.nombre}.`, { jg: jg.idx }); return { ok: true, noVe: true, tirada: t }; }
    const antes = new Set(pl.tecnicas).size;
    pl.tecnicas.push(tid); pl.ladoDe(jg.idx).add(tid);
    pl.publico[DATO_TEC[tid]] = pl.a[DATO_TEC[tid]];
    this.log(`${jg.nombre} mide ${pl.nombre} con ${TEC[tid].nombre}.`, { jg: jg.idx });
    if (antes < 2 && new Set(pl.tecnicas).size >= 2) this._confirmar(jg, pl);
    this.masaReal(jg, pl);
    this.emit("cambio", {});
    return { ok: true, tirada: t };
  }

  async investigar(jg, mid, pl) {
    jg.mar.splice(jg.mar.indexOf(mid), 1);
    const m = this.modMarcador(jg, mid, pl);
    const t = K.MAR_SIN_DADO ? { ok: this.marcadorFunciona(m), mod: m.mod, cd: m.cd, d: null, sinDado: true } : this.tirar(m.mod, m.cd);
    this.emit("tirada", { jg: jg.idx, que: `${MAR[mid].nombre} sobre ${pl.nombre}`, mid, ...t, partes: m.partes });
    await this.mostrar("tirada", { jg: jg.idx, que: `${MAR[mid].nombre} sobre ${pl.nombre}`, mid, ...t, partes: m.partes });
    if (!t.ok || !this.requisito(mid, pl)) {
      const k = `${jg.idx}|${pl.id}|${mid}`; this.senal[k] = (this.senal[k] || 0) + 1;
      pl.marcadores.push({ mid, jg: jg.idx, ok: false });
      this.log(`${jg.nombre} investiga ${pl.nombre} con ${MAR[mid].nombre}: no concluyente (queda bajo el planeta).`, { jg: jg.idx });
      return { ok: false, tirada: t };
    }
    if (mid === "densidad") {
      if (pl.a.falso) { this.mm.desc.push(mid); this._exponerFalso(jg, pl); return { ok: true, falso: true, tirada: t }; }
      if (new Set(pl.tecnicas).size < 2) { pl.tecnicas.push("densidad"); this._confirmar(jg, pl); }
      pl.publico.R = pl.a.R; pl.publico.M = pl.a.M;
    }
    pl.marcadores.push({ mid, jg: jg.idx, ok: true });
    if (mid === "densidad") this.masaReal(jg, pl);
    const lee = {};
    for (const c of CAMPOS_MAR[mid]) { this.sabe(jg, pl)[c] = pl.a[c]; lee[c] = pl.a[c]; }
    pl.ladoDe(jg.idx).add(mid);
    if (jg.cient === "fernandez" && K.FERN && pl.pubPlaneta !== null && pl.pubPlaneta !== jg.idx) this.sumar(jg, "cientifico", K.FERN, "revisión independiente");
    this.log(`${jg.nombre} investiga ${pl.nombre} con ${MAR[mid].nombre} y lee el resultado en secreto.`, { jg: jg.idx });
    this.emit("cambio", {});
    return { ok: true, lee, tirada: t };
  }

  // Tiempo de telescopio (gasta la acción): descartas las que quieras y completas la mano hasta MANO_MAX.
  // «elegir» dice de qué mazo sale cada carta: una función (k) => "tec"|"mar", o un reparto { tec, mar }.
  async telescopio(jg, descartes, elegir) {
    for (const c of descartes) {
      if (c.tipo === "tec") { jg.tec.splice(jg.tec.indexOf(c.id), 1); this.mt.desc.push(c.id); }
      else { jg.mar.splice(jg.mar.indexOf(c.id), 1); this.mm.desc.push(c.id); }
    }
    const faltan = Math.max(1, K.MANO_MAX - jg.tec.length - jg.mar.length);
    const plan = typeof elegir === "function" ? null : [...Array(elegir.tec || 0).fill("tec"), ...Array(elegir.mar || 0).fill("mar")];
    for (let k = 0; k < faltan; k++) {
      const cual = plan ? (plan[k] || "tec") : elegir(k);
      if (!this.robar(jg, cual)) this.robar(jg, cual === "tec" ? "mar" : "tec");
    }
    while (jg.tec.length + jg.mar.length > K.MANO_MAX) {       // mano llena: recibes 1 y descartas 1
      const c = await jg.ctrl.descartar(this, jg);
      if (c.tipo === "tec") { jg.tec.splice(jg.tec.indexOf(c.id), 1); this.mt.desc.push(c.id); }
      else { jg.mar.splice(jg.mar.indexOf(c.id), 1); this.mm.desc.push(c.id); }
    }
    this.log(`${jg.nombre} pide tiempo de telescopio${descartes.length ? ` (descarta ${descartes.length})` : ""}.`, { jg: jg.idx });
  }

  // ---------------------------------------------------------- publicar y refutar
  especialidad(jg, pl) {
    const e = K.CIENT_PTS && K.CIENT_PTS[jg.cient]; if (!e) return 0;
    const a = pl.a, r = a.rasgos, [cond, v] = e;
    if (cond.startsWith("tec:")) return pl.tecnicas.includes(cond.slice(4)) ? v : 0;
    const ok = { gaseoso: r.includes("Gigante") || r.includes("Neptuniano"), gigante: r.includes("Gigante"),
      neptuniano: r.includes("Neptuniano"), caliente: r.includes("Caliente"), frio: r.includes("Frío"), gigante_frio: r.includes("Gigante") && r.includes("Frío"),
      pequeño: r.includes("Pequeño"), tierra: r.includes("Pequeño") && a.o === 3 }[cond];
    return ok ? v : 0;
  }
  publicarPlaneta(jg, pl) {
    if (pl.pubPlaneta !== null || !pl.vivo) return;
    pl.pubPlaneta = jg.idx; pl.abierto = true;
    const v = pl.confirmado ? K.CONF : K.CAND;
    this.sumar(jg, "planetas", v, `publica ${pl.nombre}`); pl.ptsPlaneta = v;
    this.log(`${jg.nombre} publica el planeta ${pl.nombre} (+${v}).`, { jg: jg.idx, tipo: "pub" });
    const esp = this.especialidad(jg, pl);
    if (esp) { this.sumar(jg, "cientifico", esp, `especialidad de ${CIEN[jg.cient].nombre}`); pl.cientDado = [jg.idx, esp];
      this.log(`${jg.nombre} suma +${esp} por su especialidad (${CIEN[jg.cient].nombre}).`, { jg: jg.idx, tipo: "bueno" }); }
    if (pl.rasgos.includes("Gigante") && pl.rasgos.includes("Caliente")) this.darHito(jg, "jupiter_caliente");
    const tipos = new Set(this.planetas.filter(p => p.pubPlaneta === jg.idx && p.vivo).map(p => p.est.cl[0]));
    if (tipos.size >= 3) this.darHito(jg, "explorador");
    this.emit("cambio", {});
  }
  async publicar(jg, pl, cat) {
    if (!this.puedePublicar(jg, pl, cat)) return null;
    if (pl.pubPlaneta === null) this.publicarPlaneta(jg, pl);
    pl.publicado[cat] = { autor: jg.idx, estado: "pend" };
    this.log(`${jg.nombre} publica ${CAT_NOMBRE[cat]} en ${pl.nombre} (+${K.PUNTOS[cat]} si nadie lo refuta).`, { jg: jg.idx, tipo: "pub" });
    this.emit("publica", { jg: jg.idx, pl, cat });
    await this.mostrar("publica", { jg: jg.idx, pl, cat });
    const n = this.j.length;
    for (let k = 1; k < n; k++) {
      const x = this.j[(jg.idx + k) % n];
      const ops = [...new Set(x.mar)].filter(mid => this.puedeRefutar(x, mid, pl, cat));
      if (!ops.length) continue;
      const mid = await x.ctrl.decidirRefutar(this, x, pl, cat, ops);
      if (mid) return this.refutar(x, mid, pl, cat);
    }
    this.anotar(jg, pl, cat);
    return { refutado: false };
  }
  // Artículo: varias publicaciones del mismo planeta a la vez. +BONO_ART por cada una extra si queda en pie,
  // pero se refuta entero: si cae, el refutador se lleva TODOS sus puntos (como una contraflor al resto).
  async publicarArticulo(jg, pl, cats) {
    cats = cats.filter(c => this.puedePublicar(jg, pl, c));
    if (cats.length <= 1) return cats.length ? this.publicar(jg, pl, cats[0]) : null;
    if (pl.pubPlaneta === null) this.publicarPlaneta(jg, pl);
    for (const c of cats) pl.publicado[c] = { autor: jg.idx, estado: "pend" };
    const pozo = cats.reduce((s, c) => s + K.PUNTOS[c], 0);
    const nombres = cats.map(c => CAT_NOMBRE[c]).join(" + ");
    this.log(`${jg.nombre} publica un artículo en ${pl.nombre}: ${nombres} (${pozo} puntos en juego).`, { jg: jg.idx, tipo: "pub" });
    this.emit("publica", { jg: jg.idx, pl, cat: cats[0], cats });
    await this.mostrar("publica", { jg: jg.idx, pl, cat: cats[0], cats });
    const n = this.j.length;
    for (let k = 1; k < n; k++) {
      const x = this.j[(jg.idx + k) % n];
      const pares = [];
      for (const c of cats) for (const mid of new Set(x.mar)) if (this.puedeRefutar(x, mid, pl, c)) pares.push({ cat: c, mid });
      if (!pares.length) continue;
      const elegido = await x.ctrl.decidirRefutarArticulo(this, x, pl, cats, pares, pozo);
      if (elegido) return this.refutar(x, elegido.mid, pl, elegido.cat, cats);
    }
    this.anotarArticulo(jg, pl, cats);
    return { refutado: false };
  }
  anotarArticulo(jg, pl, cats) {
    for (const c of cats) this.anotar(jg, pl, c);
    if (K.BONO_ART) this.sumar(jg, "articulo", K.BONO_ART * (cats.length - 1), "artículo completo");
  }
  async refutar(x, mid, pl, cat, articulo = null) {
    x.mar.splice(x.mar.indexOf(mid), 1); this.mm.desc.push(mid);
    const autor = this.j[pl.publicado[cat].autor];
    const m = this.modMarcador(x, mid, pl, true);
    const t = this.tirar(m.mod, m.cd);
    this.log(`${x.nombre} refuta con ${MAR[mid].nombre}…`, { jg: x.idx, tipo: "ref" });
    this.emit("tirada", { jg: x.idx, que: `Refutación con ${MAR[mid].nombre}`, mid, refuta: true, ...t, partes: m.partes });
    await this.mostrar("tirada", { jg: x.idx, que: `${x.nombre} refuta ${CAT_NOMBRE[cat]} de ${pl.nombre} con ${MAR[mid].nombre}`, mid, refuta: true, ...t, partes: m.partes });
    let gana = false, lectura = null;
    if (t.ok) {
      lectura = {};
      for (const c of CAMPOS_MAR[mid]) { pl.publico[c] = pl.a[c]; lectura[c] = pl.a[c]; }
      gana = !verdad(pl.a, cat) && veFalsedad(mid, pl.a, cat);
    }
    const todas = articulo || [cat];
    const pozo = todas.reduce((s, c) => s + K.PUNTOS[c], 0);
    if (gana) {
      for (const c of todas) pl.publicado[c] = { autor: x.idx, estado: "anulada" };
      this.sumar(x, "refutar", pozo, articulo ? "refuta un artículo entero" : `refuta ${CAT_NOMBRE[cat]}`);
      this.darHito(x, "revision");
      this.log(`El Director lee la lectura: contradice lo publicado. ${x.nombre} gana +${pozo}.`, { jg: x.idx, tipo: "bueno" });
    } else {
      this.log(t.ok ? `El Director lee la lectura: no contradice lo publicado. Los puntos son de ${autor.nombre}.`
                    : `La tirada de ${x.nombre} falla. Los puntos son de ${autor.nombre}.`, { tipo: "info" });
      if (articulo) this.anotarArticulo(autor, pl, articulo); else this.anotar(autor, pl, cat);
    }
    this.emit("refutacion", { x: x.idx, autor: autor.idx, pl, cat, mid, tirada: t, gana, lectura, pozo, articulo });
    await this.mostrar("refutacion", { x: x.idx, autor: autor.idx, pl, cat, mid, tirada: t, gana, lectura, pozo, articulo });
    return { refutado: true, gana, tirada: t, lectura };
  }
  anotar(autor, pl, cat) {
    pl.publicado[cat] = { autor: autor.idx, estado: "ok" };
    this.sumar(autor, cat, K.PUNTOS[cat], `${CAT_NOMBRE[cat]} en ${pl.nombre}`);
    const cp = K.CIENT_PUB && K.CIENT_PUB[autor.cient];
    if (cp && cp[0] === cat && (!cp[1] || pl.rasgos.includes(cp[1])) && (!cp[3] || pl.desc === autor.idx)) this.sumar(autor, "cientifico", cp[2], `especialidad de ${CIEN[autor.cient].nombre}`);
    if (cat === "habitable" && pl.est.cl[0] === "G") this.darHito(autor, "primo_tierra");
    if (cat === "biofirma") this.darHito(autor, "primera_bio");
    if (cat === "atmosfera" && !esTierra(pl.a)) this.darHito(autor, "atm_otro");
    this.emit("cambio", {});
  }
  darHito(jg, id) {
    if (!HITO[id] || id in this.hitos) return;
    this.hitos[id] = jg.idx;
    this.sumar(jg, "hitos", HITO[id].pts, HITO[id].nombre);
    this.log(`Hito: ${jg.nombre} logra «${HITO[id].nombre}» (+${HITO[id].pts}).`, { jg: jg.idx, tipo: "hito" });
    this.emit("hito", { jg: jg.idx, id });
  }

  // ---------------------------------------------------------- partida
  rondasRestantes() {
    const n = this.j.length;
    let r = this.maxRondas - this.ronda;
    r = Math.min(r, this.planetasRestantes() / (0.9 * n));
    return r;
  }
  async jugar() {
    this.emit("inicio", {});
    while (this.ronda < this.maxRondas && !this.fin) {
      this.ronda++;
      this.emit("ronda", { ronda: this.ronda });
      for (let i = 0; i < this.j.length; i++) {
        this.turnoDe = i;
        await this.turno(this.j[i]);
        if (this.mt.vacio && this.mm.vacio) this.fin = true;
      }
    }
    return this.terminar();
  }
  async turno(jg) {
    this.turnos++;
    this.emit("turno", { jg: jg.idx });
    // período de exclusividad: vencido, el candidato privado se publica solo
    for (const pl of this.planetas)
      if (K.EXCL && pl.desc === jg.idx && pl.vivo && pl.pubPlaneta === null && this.turnos - pl.tDesc >= K.EXCL * this.j.length) {
        this.log(`Vence la exclusividad de ${pl.nombre}: pasa al archivo público.`, { jg: jg.idx, tipo: "info" });
        this.publicarPlaneta(jg, pl);
      }
    await jg.ctrl.turno(this, jg);
    this.emit("cambio", {});
  }
  // robo final del turno (elige mazo cada carta) y descarte hasta MANO_MAX
  async reponer(jg) {
    for (let k = 0; k < K.ROBO; k++) {
      const cual = await jg.ctrl.elegirMazo(this, jg, k);
      if (!this.robar(jg, cual)) this.robar(jg, cual === "tec" ? "mar" : "tec");
    }
    while (jg.tec.length + jg.mar.length > K.MANO_MAX) {
      const c = await jg.ctrl.descartar(this, jg);
      if (c.tipo === "tec") { jg.tec.splice(jg.tec.indexOf(c.id), 1); this.mt.desc.push(c.id); }
      else { jg.mar.splice(jg.mar.indexOf(c.id), 1); this.mm.desc.push(c.id); }
    }
  }
  terminar() {
    if (this.terminado) return this;
    this.terminado = true;
    // biofirmas verdaderas en planetas ajenos: el descubridor suma su bono
    for (const pl of this.planetas) {
      const b = pl.publicado.biofirma;
      if (b && b.estado === "ok" && pl.desc !== b.autor && verdad(pl.a, "biofirma"))
        this.sumar(this.j[pl.desc], "descubridor", K.BONO_DESC, `biofirma en su planeta ${pl.nombre}`);
    }
    const conf = jg => this.planetas.filter(p => p.pubPlaneta === jg.idx && p.vivo && p.confirmado).length;
    this.ranking = this.j.slice().sort((a, b) => this.total(b) - this.total(a) || conf(b) - conf(a));
    this.emit("fin", { ranking: this.ranking.map(j => j.idx) });
    return this;
  }

  // ---------------------------------------------------------- inferencia (lo que un jugador puede saber)
  candidatos(jg, pl) {
    const sabe = { ...pl.publico, ...this.sabe(jg, pl) };
    const rp = pl.rasgosPub.join("|");
    const out = [];
    for (const a of D.planetas) {
      if (rasgosPub(a).join("|") !== rp || !compatible(a, pl.est)) continue;
      if (Object.entries(sabe).every(([k, v]) => a[k] === v)) for (let i = 0; i < a.n; i++) out.push(a);
    }
    return out.length ? out : [pl.a];
  }
  prob(jg, pl, cat) { const c = this.candidatos(jg, pl); return c.filter(a => verdad(a, cat)).length / c.length; }
}

if (typeof module !== "undefined") module.exports = { Juego, D, K, TEC, MAR, CIEN, HITO, CATS, CAT_NOMBRE, DATO_TEC,
  CAMPOS_MAR, SIRVE, sirve, sirveLista, VALOR_DESC, ORDEN_TEC, pTirada, verdad, veFalsedad, vePlaneta, compatible, rasgosPub, esTierra };
