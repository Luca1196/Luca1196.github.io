/****************************************************************
 *
 *                    CALCULADORA CIENTÍFICA (MANUAL)
 *
 *   ============================================================
 *
 *   Se usa a mano, como una calculadora de verdad: no copia datos
 *   del enunciado ni completa nada sola. Así los errores de
 *   procedimiento aparecen igual que en la calculadora del alumno.
 *
 *   Reglas de cálculo (iguales a una calculadora común):
 *   - × y ÷ tienen la MISMA prioridad y se hacen de izquierda a
 *     derecha, también con la multiplicación implícita (4π).
 *     Por eso  L ÷ 4πd²  da (L/4)·π·d²  → hay que poner paréntesis.
 *   - ×10ˣ (EXP) arma UN solo número: 5,2ᴇ3 = 5200.
 *     En cambio  b ÷ 5,2 × 10^3  divide solo por 5,2.
 *   - El exponente ² o ^ se aplica solo a lo que tiene justo antes.
 *
 *   Cada vez que se aprieta "=" se guarda la cuenta en el registro
 *   de la pregunta (Calc.registro), para revisar el procedimiento.
 *
 ****************************************************************/

const Calc = (() => {

  /* Teclas: [etiqueta, tipo, valor que se muestra en la pantalla] */
  const TECLAS = [
    [["x²", "post", "²"], ["xʸ", "pot", "^("], ["√", "fn", "√("], ["x⁻¹", "post", "⁻¹"], ["log", "fn", "log("]],
    [["10ˣ", "fn", "10^("], ["(", "par", "("], [")", "cpar", ")"], ["π", "pi", "π"], ["Ans", "ans", "Ans"]],
    [["7", "d", "7"], ["8", "d", "8"], ["9", "d", "9"], ["DEL", "del"], ["AC", "ac"]],
    [["4", "d", "4"], ["5", "d", "5"], ["6", "d", "6"], ["×", "op", "×"], ["÷", "op", "÷"]],
    [["1", "d", "1"], ["2", "d", "2"], ["3", "d", "3"], ["+", "op", "+"], ["−", "op", "−"]],
    [["0", "d", "0"], [",", "d", ","], ["×10ˣ", "exp", "ᴇ"], ["(−)", "neg", "−"], ["=", "igual"]]
  ];

  let tokens = [];        // lo que está escrito: [{t, s}]
  let ans = 0;
  let resultadoTexto = "";
  let recienCalculado = false;
  let registro = [];      // cálculos hechos en la pregunta actual
  let minimizada = false;
  let alCalcular = null;  // función que avisa a la app (para guardar la evaluación)

  /* ---------------------- formato ---------------------- */
  const SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  function formatear(x) {
    if (!isFinite(x)) return "Math ERROR";
    if (x === 0) return "0";
    const abs = Math.abs(x);
    if (abs >= 1e10 || abs < 1e-3) {
      let e = Math.floor(Math.log10(abs));
      let m = +(x / Math.pow(10, e)).toPrecision(10);
      if (Math.abs(m) >= 10) { m /= 10; e++; }
      return String(m).replace(".", ",") + " × 10" + String(e).split("").map(c => SUP[c]).join("");
    }
    return String(+x.toPrecision(10)).replace(".", ",");
  }

  /* ---------------------- análisis ---------------------- */
  // Junta dígitos, coma y ᴇ en números
  function lexer(lista) {
    const out = [];
    let i = 0;
    while (i < lista.length) {
      const tk = lista[i];
      if (tk.t === "d") {
        let txt = "";
        while (i < lista.length && lista[i].t === "d") txt += lista[i++].s;
        if (i < lista.length && lista[i].t === "exp") {
          i++;
          let e = "";
          if (i < lista.length && lista[i].t === "neg") { e = "-"; i++; }
          while (i < lista.length && lista[i].t === "d" && lista[i].s !== ",") e += lista[i++].s;
          if (e === "" || e === "-") throw new Error("Syntax");
          txt += "e" + e;
        }
        if ((txt.match(/,/g) || []).length > 1) throw new Error("Syntax");
        const v = Number(txt.replace(",", "."));
        if (isNaN(v)) throw new Error("Syntax");
        out.push({ t: "num", v });
      } else if (tk.t === "exp") {
        throw new Error("Syntax");   // ᴇ sin número delante
      } else {
        out.push(tk);
        i++;
      }
    }
    return out;
  }

  function evaluar(lista) {
    const ts = lexer(lista);
    let i = 0;
    const ver = () => ts[i];
    const empiezaFactor = tk => tk && ["num", "pi", "ans", "par", "fn"].includes(tk.t);

    function expr() {
      let v = term();
      while (ver() && ver().t === "op" && (ver().s === "+" || ver().s === "−")) {
        const op = ts[i++].s;
        const w = term();
        v = op === "+" ? v + w : v - w;
      }
      return v;
    }
    // × ÷ e implícita: misma prioridad, de izquierda a derecha
    function term() {
      let v = unario();
      while (true) {
        const tk = ver();
        if (tk && tk.t === "op" && (tk.s === "×" || tk.s === "÷")) {
          i++;
          const w = unario();
          v = tk.s === "×" ? v * w : v / w;
        } else if (empiezaFactor(tk)) {
          v = v * unario();
        } else break;
      }
      return v;
    }
    function unario() {
      if (ver() && ver().t === "neg") { i++; return -unario(); }
      if (ver() && ver().t === "op" && ver().s === "−") { i++; return -unario(); }
      return potencia();
    }
    function potencia() {
      let v = postfijo();
      if (ver() && ver().t === "pot") {
        i++;
        const e = expr();
        cerrar();
        v = Math.pow(v, e);
      }
      return v;
    }
    function postfijo() {
      let v = primario();
      while (ver() && ver().t === "post") {
        v = ts[i++].s === "²" ? v * v : 1 / v;
      }
      return v;
    }
    // Como en la calculadora, el ")" final se puede omitir
    function cerrar() {
      if (ver() && ver().t === "cpar") i++;
      else if (ver()) throw new Error("Syntax");
    }
    function primario() {
      const tk = ts[i++];
      if (!tk) throw new Error("Syntax");
      if (tk.t === "num") return tk.v;
      if (tk.t === "pi") return Math.PI;
      if (tk.t === "ans") return ans;
      if (tk.t === "par") { const v = expr(); cerrar(); return v; }
      if (tk.t === "fn") {
        const v = expr(); cerrar();
        if (tk.s === "√(") return Math.sqrt(v);
        if (tk.s === "log(") return Math.log10(v);
        if (tk.s === "10^(") return Math.pow(10, v);
      }
      throw new Error("Syntax");
    }

    const v = expr();
    if (i < ts.length) throw new Error("Syntax");
    if (!isFinite(v) || isNaN(v)) throw new Error("Math");
    return v;
  }

  /* ---------------------- teclas ---------------------- */
  function textoExpresion() {
    return tokens.map(t => t.s).join("");
  }

  function apretar(tipo, s) {
    if (tipo === "ac") { tokens = []; resultadoTexto = ""; recienCalculado = false; return pintar(); }
    if (tipo === "del") { tokens.pop(); recienCalculado = false; return pintar(); }
    if (tipo === "igual") return calcular();

    // Después de "=", un operador sigue desde Ans; un número empieza de cero
    if (recienCalculado) {
      if (["op", "post", "pot"].includes(tipo)) tokens = [{ t: "ans", s: "Ans" }];
      else tokens = [];
      recienCalculado = false;
    }
    if (tokens.length >= 80) return;
    tokens.push({ t: tipo, s });
    pintar();
  }

  function calcular() {
    if (!tokens.length) return;
    const expresion = textoExpresion();
    try {
      const v = evaluar(tokens);
      ans = v;
      resultadoTexto = formatear(v);
      registro.push({ expr: expresion, res: resultadoTexto });
      if (registro.length > 30) registro.shift();
    } catch (e) {
      resultadoTexto = e.message === "Math" ? "Math ERROR" : "Syntax ERROR";
      registro.push({ expr: expresion, res: resultadoTexto });
    }
    recienCalculado = true;
    pintar();
    if (alCalcular) alCalcular();
  }

  /* ---------------------- interfaz ---------------------- */
  function pintar() {
    const ex = document.getElementById("calcExpr");
    if (!ex) return;
    ex.textContent = textoExpresion() || " ";
    ex.scrollLeft = ex.scrollWidth;
    const res = document.getElementById("calcRes");
    res.textContent = resultadoTexto || " ";
    res.classList.toggle("calc-error", /ERROR/.test(resultadoTexto));
    const hist = document.getElementById("calcHist");
    const cuantos = window.matchMedia("(min-width: 900px) and (orientation: landscape)").matches ? 15 : 2;
    hist.innerHTML = registro.slice(-cuantos).map(r => `<div><span>${r.expr}</span> = <b>${r.res}</b></div>`).join("");
  }

  function crear() {
    const aside = document.createElement("aside");
    aside.id = "calc";
    aside.className = "calc";
    aside.innerHTML = `
      <div class="calc-barra" onclick="Calc.alternar()">
        <span>🧮 Calculadora</span><span id="calcFlecha">▾</span>
      </div>
      <div class="calc-cuerpo">
        <div class="calc-pantalla">
          <div class="calc-hist" id="calcHist"></div>
          <div class="calc-expr" id="calcExpr">&nbsp;</div>
          <div class="calc-res" id="calcRes">&nbsp;</div>
        </div>
        <div class="calc-teclas">
          ${TECLAS.flat().map(([etq, tipo, s]) =>
            `<button type="button" class="calc-k calc-${tipo}" data-t="${tipo}" data-s="${s || ""}">${etq}</button>`).join("")}
        </div>
      </div>`;
    document.body.appendChild(aside);
    aside.querySelectorAll(".calc-k").forEach(b =>
      b.addEventListener("click", () => apretar(b.dataset.t, b.dataset.s)));
    pintar();
  }

  /* Teclado de la PC: se tipea igual que apretando botones */
  const MAPA_TECLADO = {
    "0": ["d", "0"], "1": ["d", "1"], "2": ["d", "2"], "3": ["d", "3"], "4": ["d", "4"],
    "5": ["d", "5"], "6": ["d", "6"], "7": ["d", "7"], "8": ["d", "8"], "9": ["d", "9"],
    ",": ["d", ","], ".": ["d", ","], "+": ["op", "+"], "-": ["op", "−"], "*": ["op", "×"], "/": ["op", "÷"],
    "(": ["par", "("], ")": ["cpar", ")"], "^": ["pot", "^("], "e": ["exp", "ᴇ"], "E": ["exp", "ᴇ"],
    "Enter": ["igual"], "=": ["igual"], "Backspace": ["del"], "Escape": ["ac"], "Delete": ["ac"]
  };
  document.addEventListener("keydown", ev => {
    const aside = document.getElementById("calc");
    if (!aside || aside.classList.contains("fc-ocultar") || minimizada) return;
    if (ev.target.tagName === "SELECT" || ev.target.tagName === "INPUT") return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const m = MAPA_TECLADO[ev.key];
    if (!m) return;
    ev.preventDefault();
    apretar(m[0], m[1]);
  });

  function alternar() {
    minimizada = !minimizada;
    document.body.classList.toggle("calc-min", minimizada);
    document.getElementById("calcFlecha").textContent = minimizada ? "▴" : "▾";
  }

  function mostrar(visible) {
    document.getElementById("calc").classList.toggle("fc-ocultar", !visible);
    document.body.classList.toggle("con-calc", visible);
  }

  /* Empieza una pregunta nueva: se limpia la pantalla y el registro */
  function reiniciarRegistro() {
    registro = [];
    tokens = [];
    resultadoTexto = "";
    recienCalculado = false;
    pintar();
  }

  /* HTML con los cálculos hechos (para mostrar al corregir) */
  function registroHTML(lista) {
    if (!lista || !lista.length) return `<p class="calc-reg-vacio">🧮 No se usó la calculadora.</p>`;
    return `<div class="calc-reg"><strong>🧮 Cálculos hechos:</strong>
      ${lista.map(r => `<div class="paso">${r.expr} = <b>${r.res}</b></div>`).join("")}</div>`;
  }

  return {
    crear, mostrar, alternar, reiniciarRegistro, registroHTML,
    get registro() { return registro.slice(); },
    set alCalcular(f) { alCalcular = f; },
    _evaluar: evaluar   // para pruebas
  };
})();

Calc.crear();
