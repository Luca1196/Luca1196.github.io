// Azar con semilla: dos dispositivos con el mismo código generan exactamente la misma partida.

// Generador mulberry32: dada una semilla entera, siempre produce la misma secuencia en [0, 1).
function crearRng(semilla) {
  let a = semilla >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mezclar(lista, rng) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Mazo de preguntas: reparte los temas elegidos de forma pareja (bolsa de temas) y no repite preguntas
// hasta agotar cada tema. Devuelve { tema, pregunta, orden } donde orden es la permutación de las opciones.
function crearMazo(temasElegidos, semilla, soloPruebas) {
  const rng = crearRng(semilla ^ (VERSION_BANCO * 0x9E3779B1));
  const temas = TEMAS.map(t => t.id).filter(id => temasElegidos.includes(id)); // orden canónico
  const colas = {};
  const rellenar = id => { colas[id] = mezclar(PREGUNTAS.filter(p => p.tema === id && (!soloPruebas || esDePrueba(p))), rng); };
  temas.forEach(rellenar);
  let bolsa = [];
  return {
    siguiente() {
      if (!bolsa.length) bolsa = mezclar(temas, rng);
      const tema = bolsa.pop();
      if (!colas[tema].length) rellenar(tema);
      const pregunta = colas[tema].pop();
      const orden = mezclar(pregunta.ops.map((_, i) => i), rng);
      return { tema, pregunta, orden };
    }
  };
}

// ───── Código de desafío: temas + cantidad de preguntas + semilla, en 8 caracteres ─────
const ALFABETO = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // base 32 sin I, L, O, U (no se confunden al dictarlos)
const CANTIDADES = [10, 15, 20, 25];

function aBase32(n, largo) {
  let s = "";
  for (let i = 0; i < largo; i++) { s = ALFABETO[n % 32] + s; n = Math.floor(n / 32); }
  return s;
}
function deBase32(s) {
  let n = 0;
  for (const c of s) {
    const v = ALFABETO.indexOf(c);
    if (v < 0) return null;
    n = n * 32 + v;
  }
  return n;
}
function digito(s) { // dígito verificador
  let x = 7;
  for (let i = 0; i < s.length; i++) x = (x * 31 + ALFABETO.indexOf(s[i]) * (i + 3)) % 32;
  return ALFABETO[x];
}
function normalizarCodigo(s) {
  return String(s || "").toUpperCase().replace(/[^0-9A-Z]/g, "")
    .replace(/O/g, "0").replace(/[IL]/g, "1").replace(/U/g, "V");
}

// cfg = { temas: [ids], n: 10|15|20|25, semilla: 0..2^20-1, soloPruebas: bool }
function codificarDesafio(cfg) {
  let mascara = 0;
  TEMAS.forEach((t, i) => { if (cfg.temas.includes(t.id)) mascara |= 1 << i; });
  const num = ((cfg.semilla * 4 + CANTIDADES.indexOf(cfg.n)) * 2 + (cfg.soloPruebas ? 1 : 0)) * 512 + mascara; // 20 + 2 + 1 + 9 = 32 bits
  const cuerpo = aBase32(num, 7);
  const c = cuerpo + digito(cuerpo);
  return c.slice(0, 4) + "-" + c.slice(4);
}

function decodificarDesafio(texto) {
  const s = normalizarCodigo(texto);
  if (s.length !== 8) return null;
  const cuerpo = s.slice(0, 7);
  if (digito(cuerpo) !== s[7]) return null;
  const num = deBase32(cuerpo);
  if (num === null) return null;
  const mascara = num % 512;
  const soloPruebas = Math.floor(num / 512) % 2 === 1;
  const nIdx = Math.floor(num / 1024) % 4;
  const semilla = Math.floor(num / 4096);
  const temas = TEMAS.filter((t, i) => mascara & (1 << i)).map(t => t.id);
  if (!temas.length || semilla >= 2 ** 20) return null;
  return { temas, n: CANTIDADES[nIdx], semilla, soloPruebas, codigo: s.slice(0, 4) + "-" + s.slice(4) };
}

function semillaAlAzar() { return Math.floor(Math.random() * 2 ** 20); }

// ───── Código de resultado: aciertos + tiempo, atado al desafío (4 caracteres) ─────
function codificarResultado(codigoDesafio, aciertos, segundos) {
  const seg = Math.min(1023, Math.round(segundos));
  const num = aciertos * 1024 + seg; // 5 + 10 bits
  const cuerpo = aBase32(num, 3);
  return cuerpo + digito(normalizarCodigo(codigoDesafio) + cuerpo);
}

function decodificarResultado(codigoDesafio, texto) {
  const s = normalizarCodigo(texto);
  if (s.length !== 4) return null;
  const cuerpo = s.slice(0, 3);
  if (digito(normalizarCodigo(codigoDesafio) + cuerpo) !== s[3]) return null;
  const num = deBase32(cuerpo);
  return { aciertos: Math.floor(num / 1024), segundos: num % 1024 };
}

if (typeof module !== "undefined") {
  module.exports = { crearRng, mezclar, crearMazo, codificarDesafio, decodificarDesafio, codificarResultado, decodificarResultado, normalizarCodigo, CANTIDADES };
}
