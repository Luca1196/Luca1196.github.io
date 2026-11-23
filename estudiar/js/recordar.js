/* RECORDÁ: CONCEPTOS FLOJOS REITERADOS EN LOS EJERCICIOS (pedido de Luca, 23/11: «esos conceptos que tengo flojos necesito que sean reiterados
   constantemente en los ejercicios»). En cada tarjeta de Principal que USA un concepto flojo aparece arriba de la pregunta un recuadro «📌 Recordá»
   con su definición en una línea (máximo 3).
   - GLO: concepto → re (cómo se reconoce en la tarjeta: título, contexto, consigna y fichas), d (definición corta), src (tarjetas donde ese concepto
     ES la pregunta: ahí no se muestra, para no dar la respuesta). Para sumar un concepto, agregar una línea acá.
   - Flojo = S2.glw[concepto] > 0. Sube +2 con cada error en una tarjeta que lo usa (tope 6) y baja −1 con cada tarjeta terminada sin errores que lo usa:
     se apaga solo cuando se usa bien varias veces seguidas. Arranca con los conceptos de las notas de Luca del 23/11 y con el historial de errores. */
(()=>{const GLO=[
 {k:"ā (nombre de un elemento)",re:/ā|◦̄|□̄/,d:"ā es el NOMBRE del elemento a en el lenguaje: P(ā) se lee «a cumple P».",src:/leer P en un elemento/},
 {k:"f(ā)",re:/f\(ā\)|f\(◦|f\(□|F\(/,d:"f(ā) vale F(a): lo que SALE de la tabla para a, no a (como f(3) = 9 si f(x) = x²).",src:/leer f en un elemento/},
 {k:"modelar (M ⊨ Γ)",re:/⊨ ?Γ|Mod\(|modelo de Γ|modela/,d:"M ⊨ Γ: TODAS las fórmulas de Γ son verdaderas en M. Mod(Γ) = las estructuras que lo modelan.",src:/Mod, Th y Cons/},
 {k:"Th y Cons",re:/Th\(|Cons\(/,d:"Th(K): lo verdadero en todas las estructuras de K. Cons(Γ): lo que se deriva de Γ. Cons(Γ) = Th(Mod(Γ)).",src:/Mod, Th y Cons/},
 {k:"consistente",re:/consistent|satisfac/i,d:"Consistente ⇔ no deriva ⊥ ⇔ (corrección y completitud) EXISTE una valuación o estructura que lo satisface: alcanza con una.",src:/consistente e inconsistente/},
 {k:"consistente maximal",re:/maximal/i,d:"Consistente maximal: consistente y, para cada φ, está φ o está ¬φ. El típico: {φ | v(φ) = 1}.",src:/· consistente maximal$/},
 {k:"numeración",re:/^\s*\d+(\.\d+)*\*?:$/,d:"El número lo define quién ENVÍA: lo que manda el receptor del mensaje k va k.1, k.2…; si se repite por cada elemento, lleva *.",src:/Numeración/},
 {k:"estereotipo",re:/«(association|local|parameter|global)»/,d:"El estereotipo dice de dónde sacó el emisor al receptor: por una flecha «association», de un find/create/next «local», de un parámetro «parameter».",src:/estereotipo/i},
 {k:"var :=",re:/ :=$/,d:"var := solo si el resultado se usa después (como receptor, parámetro, condición o retorno).",src:/Guardar el resultado/},
 {k:"genérica o propia",re:/^(find|next|add|remove|create|destroy)$/,d:"find/next/add/remove/create: genéricas, sobre lo que alcanzo por una flecha. Si el dato está detrás de otro objeto, se le pide con una operación propia.",src:/Genérica o del dominio/},
 {k:"multiplicidad",re:/multiplicidad|^(1|\*|1\.\.\*|0\.\.1)$/,d:"Al lado de A va cuántos A se vinculan con UN B (y al revés del otro lado).",src:/qué es cada cosa/}];
 const TX=new Map(),txt=c=>{if(TX.has(c))return TX.get(c);const t=[c.g,c.ctx||"",c.kp||"",c.kq||""].concat(c.bld?c.bld.exp.map(x=>x.t):[]).concat((c.steps||[]).map(s=>(s.q||"")+" "+(s.a||"")));TX.set(c,t);return t};
 const has=(c,G)=>txt(c).some(t=>G.re.test(t)),W=()=>S2.glw||(S2.glw={}),byG=()=>{const m={};SWC.forEach(c=>m[c.g]=c);return m};let BYG=null;
 /* arranque: notas del 23/11 + historial de errores (una sola vez) */
 const seed=()=>{if(S2.glv==1)return;const w=W();["ā (nombre de un elemento)","f(ā)","modelar (M ⊨ Γ)","Th y Cons","consistente","consistente maximal"].forEach(k=>w[k]=Math.max(w[k]||0,4));
  E1.log.slice(-600).forEach(e=>{const t=[e.g,e.q||"",e.x||"",e.a||"",e.p||""].join("\n");GLO.forEach(G=>{if(t.split(/[\n\[\]]/).some(z=>G.re.test(z.trim()))||G.re.test(t))w[G.k]=Math.min(6,(w[G.k]||0)+1)})});S2.glv=1;SV2()};
 const hit=(g,ok)=>{if(SWM!=3)return;BYG=BYG||byG();const c=BYG[g];if(!c)return;const w=W();GLO.forEach(G=>{if(!has(c,G))return;w[G.k]=ok?Math.max(0,(w[G.k]||0)-1):Math.min(6,(w[G.k]||0)+2)})};
 const _l=logA;logA=function(w,s,g,ok,info){_l.apply(this,arguments);try{if(w=="sw")hit(g,ok)}catch(e){}};
 const box=c=>{const w=W(),L=GLO.filter(G=>w[G.k]>0&&!G.src.test(c.g)&&has(c,G)).sort((a,b)=>w[b.k]-w[a.k]).slice(0,3);
  return L.length?`<div class="th" id="glo" style="margin:8px 0"><b>📌 Recordá</b>${L.map(G=>`<div style="margin-top:4px"><b>${esc(G.k)}:</b> ${esc(G.d)}</div>`).join("")}</div>`:""};
 const _d=swDraw;swDraw=function(){_d.apply(this,arguments);try{if(TAB!=3||!SW||!SW.c||SW.recap)return;seed();const q=V.querySelector("#swc .qt")||V.querySelector(".swc .qt");if(q&&!V.querySelector("#glo"))q.insertAdjacentHTML("beforebegin",box(SW.c))}catch(e){}};
 window.GLO=GLO})();
