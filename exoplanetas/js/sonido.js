// ===================================================================
//  Sistemas Exoplanetas · efectos de sonido (sintetizados con Web Audio: sin archivos)
//  Estilo juego de celular: toques cortos, campanitas brillantes, fanfarrias de logro.
// ===================================================================
const Sfx = (() => {
  let ctx = null, master = null;
  let activo = true;
  try { activo = localStorage.getItem("exo-sonido") !== "0"; } catch (e) {}

  function iniciar() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    master = ctx.createGain(); master.gain.value = 0.55;
    master.connect(comp); comp.connect(ctx.destination);
    return true;
  }
  // el navegador solo deja sonar después de un toque del jugador
  ["pointerdown", "keydown"].forEach(ev => addEventListener(ev, () => { if (activo) iniciar(); }, { capture: true, passive: true }));

  function listo() { return activo && iniciar() && ctx.state !== "closed"; }

  // una nota: frecuencia, inicio (s desde ahora), duración, forma, volumen, deslizamiento
  function nota(f, t0 = 0, dur = 0.15, tipo = "sine", vol = 0.3, f2 = null) {
    const t = ctx.currentTime + t0;
    const o = ctx.createOscillator(), gn = ctx.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(gn); gn.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }
  // campanita: fundamental + armónico brillante
  function campana(f, t0 = 0, dur = 0.35, vol = 0.22) {
    nota(f, t0, dur, "sine", vol);
    nota(f * 2, t0, dur * 0.6, "sine", vol * 0.35);
    nota(f * 3.01, t0, dur * 0.3, "triangle", vol * 0.12);
  }
  // ruido filtrado (soplidos, barajar)
  function ruido(t0 = 0, dur = 0.25, desde = 800, hasta = 3000, vol = 0.18) {
    const t = ctx.currentTime + t0, n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(); s.buffer = buf;
    const fil = ctx.createBiquadFilter(); fil.type = "bandpass"; fil.Q.value = 1.2;
    fil.frequency.setValueAtTime(desde, t); fil.frequency.exponentialRampToValueAtTime(hasta, t + dur);
    const gn = ctx.createGain();
    gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fil); fil.connect(gn); gn.connect(master); s.start(t); s.stop(t + dur + 0.05);
  }
  const DO = 523.25, MI = 659.25, SOL = 783.99, LA = 880, DO2 = 1046.5, MI2 = 1318.5, SOL2 = 1568;

  const efectos = {
    toque() { nota(1200, 0, 0.05, "triangle", 0.12, 900); },
    elegir() { nota(520, 0, 0.09, "sine", 0.22, 880); nota(1320, 0.04, 0.06, "triangle", 0.08); },
    abrir() { ruido(0, 0.18, 600, 2400, 0.08); },
    exito() { [DO, MI, SOL, DO2].forEach((f, i) => campana(f, i * 0.07, 0.3, 0.18)); },
    fallo() { nota(330, 0, 0.18, "triangle", 0.22, 300); nota(247, 0.17, 0.32, "triangle", 0.22, 196); },
    moneda(n = 1) {
      const veces = Math.min(5, Math.max(1, Math.round(n / 2)));
      for (let i = 0; i < veces; i++) { nota(988, i * 0.08, 0.07, "square", 0.07); nota(1319, i * 0.08 + 0.05, 0.22, "square", 0.07); }
    },
    rival() { nota(660, 0, 0.08, "sine", 0.08); },
    descubrir() {
      ruido(0, 0.35, 2000, 7000, 0.06);
      [SOL, DO2, MI2, SOL2].forEach((f, i) => campana(f, 0.05 + i * 0.06, 0.4, 0.14));
    },
    publicar() { nota(140, 0, 0.12, "square", 0.18, 70); ruido(0, 0.08, 300, 200, 0.18); [MI, SOL, DO2].forEach((f, i) => campana(f, 0.08 + i * 0.06, 0.25, 0.14)); },
    turno() { campana(SOL, 0, 0.25, 0.18); campana(DO2, 0.12, 0.4, 0.2); },
    barajar() { for (let i = 0; i < 5; i++) ruido(i * 0.06, 0.07, 1500, 3500, 0.1); },
    falso() { nota(400, 0, 0.12, "sine", 0.25, 700); nota(700, 0.12, 0.35, "sine", 0.22, 180); },
    hito() {
      [DO, MI, SOL].forEach((f, i) => campana(f, i * 0.1, 0.25, 0.2));
      [DO2, MI2, SOL2].forEach(f => campana(f, 0.32, 0.9, 0.13));
      ruido(0.32, 0.6, 3000, 8000, 0.05);
    },
    refutado() { nota(392, 0, 0.18, "sawtooth", 0.12); nota(370, 0.18, 0.18, "sawtooth", 0.12); nota(277, 0.36, 0.6, "sawtooth", 0.12, 220); },
    victoria() {
      [DO, MI, SOL, DO2, MI2].forEach((f, i) => campana(f, i * 0.09, 0.3, 0.18));
      [DO2, MI2, SOL2].forEach(f => campana(f, 0.5, 1.4, 0.14));
      ruido(0.5, 1, 3000, 9000, 0.05);
    },
    derrota() { [SOL, MI, DO].forEach((f, i) => nota(f / 2, i * 0.22, 0.4, "triangle", 0.18)); },
  };

  // toque suave en cualquier botón del juego
  addEventListener("click", e => { if (e.target.closest && e.target.closest(".btn-juego, .opcion, .icono-btn, .mazo-tele, .h-cerrar")) api.toque(); }, true);
  const api = { get activo() { return activo; } };
  for (const [k, fn] of Object.entries(efectos)) api[k] = (...a) => { try { if (listo()) fn(...a); } catch (e) {} };
  api.alternar = () => {
    activo = !activo;
    try { localStorage.setItem("exo-sonido", activo ? "1" : "0"); } catch (e) {}
    if (activo) { iniciar(); api.elegir(); }
    return activo;
  };
  return api;
})();
