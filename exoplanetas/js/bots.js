// ===================================================================
//  Bots rivales: estilos de juego del simulador (vida, explorador, gigantes, verificador)
// ===================================================================
const M_ = (typeof module !== "undefined") ? require("./motor.js") : null;
const _G = M_ || { K, TEC, MAR, CATS, SIRVE, sirve, sirveLista, VALOR_DESC, pTirada, verdad, veFalsedad, vePlaneta, esTierra };

const ESTILOS = {
  vida: { nombre: "Buscador de vida", foco: "vida", cients: ["seager", "kaltenegger"] },
  explorador: { nombre: "Explorador", publicaYa: true, wDesc: 1.2, cients: ["borucki", "mayor"] },
  gigantes: { nombre: "Cazador de gigantes", foco: "gigantes", cients: ["charbonneau", "marois"] },
  verificador: { nombre: "Verificador", wAjeno: 1.5, wDesc: 1.1, refMult: 0.3, cients: ["fernandez", "tancredi"] },
};
const CARACTER = {
  mentiroso: { nombre: "audaz", certeza: 0.35, umbralRef: 0.1 },
  conservador: { nombre: "prudente", certeza: 0.7, umbralRef: 1.2 },
};

class Bot {
  constructor(estilo, caracter, pausa) {
    this.e = { wDesc: 1, wAjeno: 1, refMult: 1, ...ESTILOS[estilo] };
    this.c = CARACTER[caracter];
    this.estilo = estilo; this.caracter = caracter;
    this.pausa = pausa || (async () => {});
  }
  get umbralRef() { return this.c.umbralRef * this.e.refMult; }

  async turno(g, jg) {
    const op = this.mejorAccion(g, jg);
    await this.pausa("accion", op);
    if (!op) {
      const desc = this.descartesTelescopio(g, jg);
      await g.telescopio(jg, desc, () => this.elegirMazoSync(g, jg));
    } else if (op.tipo === "desc") await g.descubrir(jg, op.tid, op.est);
    else if (op.tipo === "medir") await g.medir(jg, op.tid, op.pl);
    else await g.investigar(jg, op.mid, op.pl);
    await this.pausa("post");
    await this.fasePublicar(g, jg);
    await g.reponer(jg);
  }

  // ---------------------------------------------------------- publicar
  pendiente(g, jg, pl) {
    if (jg.mar.some(m => g.puedeInvestigar(jg, m, pl))) return true;
    if (!pl.confirmado && jg.tec.some(t => g.puedeMedir(jg, t, pl))) return true;
    return false;
  }
  async fasePublicar(g, jg) {
    const fin = g.rondasRestantes() <= 1.01;
    for (const pl of g.planetas.slice()) {
      if (!pl.vivo) continue;
      const mio = pl.desc === jg.idx;
      if (!pl.abierto && !mio) continue;
      const articulo = [];
      for (const cat of _G.CATS) {
        if (!g.puedePublicar(jg, pl, cat)) continue;
        const P = g.prob(jg, pl, cat);
        let umbral = this.c.certeza;
        if (fin) umbral = Math.min(umbral, 0.25);
        // esperar al Contexto si lo tengo y todavía no lo leí
        if (cat === "biofirma" && !fin && P < 0.95 && jg.mar.includes("contexto") && !g.conoce(jg, pl, "ctx")) continue;
        if (P >= umbral && P >= 0.12) articulo.push(cat);
      }
      if (articulo.length) {
        await this.pausa("publica");
        await g.publicarArticulo(jg, pl, articulo);
      }
      if (mio && pl.pubPlaneta === null && pl.vivo) {
        if (this.e.publicaYa || fin || pl.confirmado || g.rondasRestantes() <= 3 || !this.pendiente(g, jg, pl)) {
          await this.pausa("publica");
          g.publicarPlaneta(jg, pl);
        }
      }
    }
  }

  // ---------------------------------------------------------- refutar
  async decidirRefutar(g, x, pl, cat, ops) {
    let mejor = null, ev0 = -1;
    const cands = g.candidatos(x, pl);
    for (const mid of ops) {
      const pf = cands.filter(a => !_G.verdad(a, cat) && _G.veFalsedad(mid, a, cat)).length / cands.length;
      const m = g.modMarcador(x, mid, pl, true);
      const ev = g.pRefutar(m) * pf * _G.K.PUNTOS[cat];
      if (ev > ev0) { ev0 = ev; mejor = mid; }
    }
    if (ev0 > this.umbralRef) { await this.pausa("refuta"); return mejor; }
    return null;
  }

  async decidirRefutarArticulo(g, x, pl, cats, pares, pozo) {
    const cands = g.candidatos(x, pl);
    let mejor = null, ev0 = -1;
    for (const { cat, mid } of pares) {
      const pf = cands.filter(a => !_G.verdad(a, cat) && _G.veFalsedad(mid, a, cat)).length / cands.length;
      const m = g.modMarcador(x, mid, pl, true);
      const ev = g.pRefutar(m) * pf * pozo;
      if (ev > ev0) { ev0 = ev; mejor = { cat, mid }; }
    }
    if (ev0 > this.umbralRef) { await this.pausa("refuta"); return mejor; }
    return null;
  }

  // ---------------------------------------------------------- acción
  opciones(g, jg) {
    const ops = [];
    const PT = c => _G.K.PUNTOS[c];
    for (const pl of g.planetas) {
      if (!g.puedeActuar(jg, pl)) continue;
      const libres = _G.CATS.filter(c => !(c in pl.publicado));
      const mio = pl.desc === jg.idx;
      const w = mio ? 1 : this.e.wAjeno;
      let foco = 1;
      if (this.e.foco === "vida" && pl.rasgosPub.includes("Pequeño") && !pl.rasgosPub.includes("Caliente") && !pl.rasgosPub.includes("Frío")) foco = 1.6;
      if (this.e.foco === "gigantes" && (pl.rasgosPub.includes("Gigante") || pl.rasgosPub.includes("Neptuniano"))) foco = 1.6;
      // investigar
      if (libres.length) for (const mid of new Set(jg.mar)) {
        if (!g.puedeInvestigar(jg, mid, pl)) continue;
        const m = g.modMarcador(jg, mid, pl);
        const ps = g.pMarcador(m);
        let info = 0;
        for (const c of _G.sirveLista(mid, pl)) if (libres.includes(c)) {
          const p = g.prob(jg, pl, c);
          info += PT(c) * (p * (1 - p) * 2 + 0.25 * p) + (g.sirveParaPublicar(jg, pl, c) ? 0 : 0.6 * p * PT(c));
        }
        if (mid === "densidad" && _G.K.MASA && !pl.masaCobrada && mio && g.completaMasa(pl, ["densidad"])) info += _G.K.MASA;
        if (mid === "densidad" && !pl.confirmado) {
          const dueño = pl.pubPlaneta !== null ? pl.pubPlaneta : pl.desc;
          info += (_G.K.CONF - _G.K.CAND) * (dueño === jg.idx ? 1 : -0.5);
        }
        ops.push({ v: ps * info * w * foco, tipo: "car", mid, pl });
      }
      // medir / confirmar
      for (const tid of new Set(jg.tec)) {
        if (!g.puedeMedir(jg, tid, pl)) continue;
        const m = g.modMedir(jg, tid, pl);
        const p = _G.pTirada(m.mod, m.cd);
        const bio = g.prob(jg, pl, "biofirma");
        let extra = (mio && !pl.confirmado ? 1 : 0) + (tid === "transito" ? 1 + 6 * bio : 0.3);
        if (jg.cient === "tancredi" && !pl.confirmado) extra += 1;
        if (_G.K.MASA && !pl.masaCobrada && mio && g.completaMasa(pl, [tid])) extra += _G.K.MASA;
        ops.push({ v: p * (1 + extra) * foco, tipo: "medir", tid, pl });
      }
    }
    // descubrir
    for (const tid of new Set(jg.tec)) {
      for (const est of g.estrellas) {
        if (!g.puedeDescubrir(jg, tid, est)) continue;
        const m = g.modDescubrir(jg, tid, est);
        let val = _G.VALOR_DESC[tid];
        const esp = _G.K.CIENT_PTS && _G.K.CIENT_PTS[jg.cient];
        if (esp && ((esp[0] === "gigante" && (tid === "astro" || tid === "imagen" || est.metal)) || ((esp[0] === "frio" || esp[0] === "gigante_frio") && tid === "imagen")
          || (esp[0] === "tec:rv" && tid === "rv") || (esp[0] === "caliente" && (tid === "transito" || tid === "rv")) || (esp[0] === "neptuniano" && tid === "transito"))) val += 0.4 * esp[1];
        if (this.e.foco === "gigantes" && (tid === "astro" || tid === "imagen" || tid === "rv" || est.metal)) val *= 1.5;
        if (this.e.foco === "vida" && tid === "transito" && "KM".includes(est.cl[0])) val *= 1.3;
        if (!("explorador" in g.hitos)) {
          const tipos = new Set(g.planetas.filter(p => p.desc === jg.idx).map(p => p.est.cl[0]));
          if (!tipos.has(est.cl[0])) val += 0.35 * 3;
        }
        if (!("primo_tierra" in g.hitos) && est.cl[0] === "G" && (tid === "transito" || tid === "rv")) val += 0.25;
        if (!("jupiter_caliente" in g.hitos) && tid === "rv") val += 0.6;
        ops.push({ v: _G.pTirada(m.mod, m.cd) * val * this.e.wDesc, tipo: "desc", tid, est });
      }
    }
    return ops;
  }
  mejorAccion(g, jg) {
    const ops = this.opciones(g, jg).filter(o => o.v > 0.3);
    if (!ops.length) return null;
    // un poco de variedad entre opciones casi iguales
    ops.forEach(o => o.v *= 1 + 0.08 * (g.rnd() - 0.5));
    const mejor = ops.reduce((a, b) => (b.v > a.v ? b : a));
    if (!_G.K.ROBO) {   // sin robo: el telescopio compite con jugar (mano corta, o planetas propios sin Marcadores)
      const mano = jg.tec.length + jg.mar.length;
      const propios = g.planetas.some(p => p.vivo && p.desc === jg.idx && p.pubPlaneta === null);
      if ((mano <= 2 && mejor.v < 2.5) || (propios && !jg.mar.length && mejor.v < 1.5)) return null;
    }
    return mejor;
  }

  // ---------------------------------------------------------- mano
  usosMarcador(g, jg, mid) { return g.planetas.filter(pl => g.puedeActuar(jg, pl) && g.requisitoVisible(mid, pl)).length; }
  elegirMazoSync(g, jg) {
    const utiles = jg.mar.reduce((s, m) => s + this.usosMarcador(g, jg, m), 0);
    if (!jg.tec.length) return "tec";
    if (jg.mar.length < 2 && g.planetas.some(p => p.vivo)) return "mar";
    return (jg.tec.length <= jg.mar.length || utiles === 0) ? "tec" : "mar";
  }
  async elegirMazo(g, jg) { return this.elegirMazoSync(g, jg); }
  async descartar(g, jg) {
    if ((jg.tec.length > jg.mar.length && jg.tec.length) || !jg.mar.length) {
      const t = jg.tec.reduce((a, b) => (_G.VALOR_DESC[b] < _G.VALOR_DESC[a] ? b : a));
      return { tipo: "tec", id: t };
    }
    const m = jg.mar.reduce((a, b) => (this.usosMarcador(g, jg, b) < this.usosMarcador(g, jg, a) ? b : a));
    return { tipo: "mar", id: m };
  }
  descartesTelescopio(g, jg) {
    const out = [];
    for (const t of jg.tec) if (!g.estrellas.some(e => g.puedeDescubrir(jg, t, e))) out.push({ tipo: "tec", id: t });
    return out.slice(0, 2);
  }
}

if (typeof module !== "undefined") module.exports = { Bot, ESTILOS, CARACTER };
