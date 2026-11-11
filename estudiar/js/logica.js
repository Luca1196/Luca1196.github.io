/* SECCIÓN LÓGICA: tarjetas de Repaso, cadenas de Deslizar (deducción natural), combinaciones de examen, contexto por paso (LGX/LGR) y árboles (TRS). lgApply() lo llama nucleo.js después de portar tarjetas. */
/* DECISIONES DIDÁCTICAS DE LÓGICA (ver también bloques.js y la sección Deslizar de nucleo.js):
   - Preguntarse siempre «¿la fórmula está en lo que busco (introducción) o en lo que tengo (eliminación)?».
   - Cada «No sé» de la exportación de errores se responde con teoría (THT y recuadros th) y tarjetas previas más fáciles;
     cada confusión repetida, con una serie que contraste las dos opciones.
   - Los ejercicios de examen se practican como árboles en Bloques, partidos en pasos intermedios con previas. */
/* ---- Tarjetas (cortas): Lógica ---- */
const LGA=[
/* d = distractores. "texto||por que no" => el motivo se muestra al elegir esa opcion. */
/* Armar: meta + lo que tengo; se arma desde la META */
mc("lg","Armar","Tengo: φ, ψ\nMeta: φ∧ψ\n¿Qué regla cierra la derivación?","I∧: pruebo φ y pruebo ψ",["I∨: pruebo solo φ||I∨ arma una disyunción; la meta es una conjunción y pide los dos lados.","E∧: separo φ y ψ||E∧ saca partes de una conjunción que ya tenés; acá φ∧ψ es la meta.","I→: supongo φ||I→ arma una implicación, no una conjunción."],"La meta es una conjunción: se arma con I∧."),
mc("lg","Armar","Tengo: φ→σ, σ→ψ\nMeta: φ→ψ\n¿Cómo la armo?","I→: supongo φ, llego a ψ (con E→ dos veces) y cancelo φ",["I→: supongo ψ, llego a φ y cancelo ψ||Invertiste la implicación: se supone el antecedente (φ) y se busca el consecuente (ψ).","E→: de φ→σ y σ→ψ saco φ→ψ||E→ necesita φ como premisa. No hay una regla que encadene implicaciones sin suponer φ.","I∧: junto φ→σ y σ→ψ||I∧ da una conjunción, no la implicación pedida."],"La meta es una implicación: supongo el antecedente y busco el consecuente."),
mc("lg","Armar","Tengo: φ→ψ, ¬ψ\nMeta: ¬φ\n¿Cómo la armo?","I¬: supongo φ y llego a ⊥",["RAA: supongo ¬φ y llego a ⊥||Suponer ¬φ sirve para probar φ, no ¬φ.","E¬: de ¬ψ saco ¬φ||E¬ no concluye negaciones: junta φ y ¬φ para dar ⊥.","E→: de φ→ψ saco ¬φ||E→ necesita φ, y φ es justo lo que no tengo."],"La meta empieza con ¬: supongo φ, saco ψ con E→ y ⊥ con E¬."),
mc("lg","Armar","Tengo: ¬¬φ\nMeta: φ\n¿Cómo la armo?","RAA: supongo ¬φ y llego a ⊥",["I¬: supongo φ y llego a ⊥||I¬ concluye ¬φ, no φ.","E¬: de ¬¬φ saco φ||E¬ junta φ y ¬φ para dar ⊥; no quita dobles negaciones.","E⊥: de ¬¬φ concluyo φ||E⊥ necesita un ⊥ ya probado."],"φ no tiene conector que pueda introducir. Con ¬¬φ y ¬φ, E¬ da ⊥."),
mc("lg","Armar","Tengo: φ\nMeta: φ∨ψ\n¿Cómo la armo?","I∨: parto de φ",["I∧: parto de φ||Habría que probar también ψ; I∧ pide los dos lados.","E∨: separo φ∨ψ||E∨ usa una disyunción que ya tenés; acá es la meta.","I→: supongo φ||I→ arma una implicación, no una disyunción."],"En una disyunción alcanza probar un lado."),
mc("lg","Armar","Tengo: nada\nMeta: φ∨¬φ\n¿Cómo la armo?","RAA: supongo ¬(φ∨¬φ)",["I∨: pruebo φ||Sin hipótesis no puedo probar φ.","I∨: pruebo ¬φ||Sin hipótesis no puedo probar ¬φ.","I¬: supongo φ||I¬ concluye ¬φ, no una disyunción."],"No puedo probar ni φ ni ¬φ por separado, así que I∨ directo no sirve."),
mc("lg","Armar","Tengo: (∀x)(P(x)∧Q(x))\nMeta: (∀x)P(x)\n¿Cómo la armo?","I∀: con x arbitraria, derivo P(x)",["I∃: busco un testigo||I∃ arma un ∃; la meta es un ∀.","E∀ con t = a: obtengo P(a)||Eso prueba P(a) para un a concreto, no para todo x.","E∃: supongo P(x)||No hay ningún ∃ para eliminar."],"La meta es un ∀: tomo x arbitraria. x no está libre en la hipótesis, así que se puede."),
mc("lg","Armar","Tengo: P(a)\nMeta: (∃x)P(x)\n¿Cómo la armo?","I∃: el testigo es a",["I∀: x arbitraria||La meta es un ∃; además P(a) no vale para todo x.","E∃: supongo P(x), x nueva||E∃ usa un ∃ que ya tenés; acá es la meta.","E∀ con t = a||No tengo ningún ∀ para instanciar."],"La meta es un ∃: busco un término t con P(t). Acá t = a."),
mc("lg","Armar","Tengo: φ→ψ, ψ→φ\nMeta: φ↔ψ\n¿Cómo la armo?","I↔: uso φ→ψ y ψ→φ",["I∧: junto φ→ψ y ψ→φ||I∧ da (φ→ψ)∧(ψ→φ), que no es la fórmula φ↔ψ.","E→: de φ→ψ saco ψ||E→ necesita φ y no la tengo.","I→: supongo φ||I→ arma una implicación, no una equivalencia."],"La meta es una equivalencia: se arma con φ→ψ y ψ→φ."),
mc("lg","Armar","Tengo: φ, ¬φ\nMeta: ⊥\n¿Qué regla?","E¬: junto φ y ¬φ",["E⊥: parto de un ⊥||E⊥ necesita un ⊥ ya probado; acá ⊥ es la meta.","I¬: concluyo ¬φ||I¬ concluye una negación cancelando una hipótesis; la meta es ⊥.","I∧: junto φ y ¬φ||Daría φ∧¬φ, no ⊥."],"⊥ se obtiene de una contradicción: φ y ¬φ.","⊥ no se arma con una introducción: sale de E¬ al juntar φ y ¬φ. E⊥ es al revés: parte de un ⊥ que ya tenés."),
mc("lg","Armar","Tengo: φ, ψ\nMeta: ψ\n¿Qué hago?","Nada: ψ ya está entre las hipótesis",["I∧: junto φ y ψ||Daría φ∧ψ; la meta es ψ.","E∧: saco ψ de φ∧ψ||No tengo ninguna conjunción.","I→: supongo ψ||La meta no es una implicación."],"Si la meta ya es una hipótesis, queda como hoja del árbol.","Antes de armar nada, mirá si la meta ya está entre lo que tenés."),
/* Desarmar: se desarma la HIPOTESIS que hace falta */
mc("lg","Desarmar","Tengo: φ∧ψ\nMeta: ψ\n¿Qué regla uso?","E∧: me quedo con ψ",["I∧: junto φ y ψ||I∧ arma φ∧ψ; esa ya la tengo y quiero ψ.","E→: de φ saco ψ||No hay ninguna implicación.","I∨: parto de ψ||Daría ψ∨algo, no ψ."],"Una conjunción se separa con E∧."),
mc("lg","Desarmar","Tengo: φ→ψ, φ\nMeta: ψ\n¿Qué regla?","E→: de φ→ψ y φ obtengo ψ",["I→: supongo φ||Ya tengo φ como premisa; I→ sirve para armar una implicación.","E∧: separo φ→ψ||φ→ψ no es una conjunción.","I∧: junto φ→ψ y φ||Daría una conjunción, no ψ."],"Es el modus ponens."),
mc("lg","Desarmar","Tengo: φ∨ψ, φ→σ, ψ→σ\nMeta: σ\n¿Qué regla?","E∨: pruebo σ bajo φ y bajo ψ",["E→: de φ→σ saco σ||E→ necesita φ, y todavía no tengo φ.","I∨: elijo un lado||I∨ arma disyunciones; acá hay que usar una que ya tengo.","E∧: separo φ∨ψ||φ∨ψ no es una conjunción."],"Con una disyunción no avanzo sin separar casos."),
mc("lg","Desarmar","Tengo: (∀x)P(x)\nMeta: P(a)\n¿Qué regla?","E∀: instancio x con a",["I∀: x arbitraria||I∀ arma un ∀; acá ya lo tengo y quiero instanciarlo.","E∃: supongo P(x)||No tengo ningún ∃.","I∃: el testigo es a||Daría (∃x)P(x), no P(a)."],"Instancio con un término a que sea libre para x."),
mc("lg","Desarmar","Tengo: (∃x)P(x), (∀x)(P(x)→Q(x))\nMeta: (∃x)Q(x)\n¿Cómo uso el ∃?","E∃: supongo P(x) con x nueva",["E∀ con una constante a: obtengo P(a)→Q(a)||No sé que exista un a con P(a); el ∃ sigue sin usarse.","I∃ directo: elijo un testigo||Antes necesito un t con Q(t), y para eso hay que usar el ∃ de P.","I∀: x arbitraria||La meta es un ∃, no un ∀."],"Para usar un ∃ supongo el testigo con una variable nueva y sigo hasta la meta."),
mc("lg","Desarmar","Tengo: ⊥\nMeta: ψ\n¿Qué regla?","E⊥: de ⊥ concluyo ψ",["E¬: junto ⊥ y ¬ψ||E¬ da ⊥, y ⊥ ya lo tengo.","I¬: supongo ψ||I¬ concluye ¬ψ, no ψ."],"Ex falso: de ⊥ sale cualquier fórmula."),
/* Primer paso: decidir armar la meta o desarmar hipotesis */
mc("lg","Primer paso","Tengo: φ∧ψ\nMeta: ψ∧φ\n¿Primer paso?","Armar: I∧ (pruebo ψ y pruebo φ)",["Desarmar: E∧ y listo||E∧ da φ y ψ por separado, no ψ∧φ: falta juntarlas con I∧.","I→: supongo ψ||La meta no es una implicación.","I∨: pruebo ψ||La meta es una conjunción, no una disyunción."],"Miro primero la meta (∧ → I∧). Después saco ψ y φ de la hipótesis con E∧."),
mc("lg","Primer paso","Tengo: nada\nMeta: φ→(ψ→φ)\n¿Primer paso?","I→: supongo φ",["I→: supongo ψ||El antecedente del conector principal es φ, no ψ.","E→ sobre la meta||E→ necesita premisas y no tengo nada.","I∧: pruebo φ y ψ→φ||La meta es una implicación, no una conjunción."],"La meta es una implicación. Después supongo ψ y φ es una hipótesis."),
mc("lg","Primer paso","Tengo: nada\nMeta: ¬(φ∧¬φ)\n¿Primer paso?","I¬: supongo φ∧¬φ",["I¬: supongo φ||Hay que suponer toda la conjunción φ∧¬φ, que es lo que niega la meta.","RAA: supongo φ∧¬φ||RAA supone ¬φ para probar φ; la meta empieza con ¬ y se arma con I¬.","I∧: pruebo φ y ¬φ||Eso sería probar una contradicción, que no se puede."],"La meta empieza con ¬. Con E∧ saco φ y ¬φ, y con E¬ llego a ⊥."),
mc("lg","Primer paso","Tengo: φ∨ψ, ¬ψ\nMeta: φ\n¿Primer paso?","E∨ sobre φ∨ψ",["I∨: pruebo φ||φ no está probada: viene de separar la disyunción.","E¬: junto ψ y ¬ψ||No tengo ψ sola; tengo φ∨ψ.","I¬: supongo φ||La meta es φ, no ¬φ."],"Hay una disyunción y la meta no tiene conector que armar: separo casos. En el caso ψ, con ¬ψ llego a ⊥ y uso E⊥."),
mc("lg","Primer paso","Tengo: φ→ψ, φ\nMeta: ψ∨σ\n¿Primer paso?","I∨: saco ψ con E→ y elijo ese lado",["I∨: pruebo σ||No tengo forma de probar σ.","E∨: separo ψ∨σ||La disyunción es la meta; no hay una para usar.","I∧: junto ψ y σ||Daría ψ∧σ, no ψ∨σ."],"Con φ→ψ y φ saco ψ por E→, y alcanza un lado de la disyunción."),
/* Teoremas de los practicos 4 y 8: primer paso segun el conector principal */
mc("lg","Primer paso","Práctico 4 · 1a\nTengo: nada\nMeta: φ→φ\n¿Primer paso?","I→: supongo φ (y la meta φ es esa misma hipótesis)",["E→: uso φ→φ y φ||Sería circular: φ→φ es lo que quiero probar.","I∧: pruebo φ y φ||La meta es una implicación, no una conjunción.","RAA: supongo ¬φ||No hace falta: la meta se arma con la introducción de su conector."],"Supongo φ, la meta φ ya está como hipótesis y la cancelo con I→."),
mc("lg","Primer paso","Práctico 4 · 1b\nTengo: nada\nMeta: ⊥→φ\n¿Primer paso?","I→: supongo ⊥; después E⊥ da φ",["E⊥ sobre la meta||E⊥ necesita un ⊥ ya probado; antes hay que suponerlo con I→.","I¬: supongo ⊥||I¬ concluye ¬⊥, no ⊥→φ.","I∨: parto de φ||La meta no es una disyunción."],"El conector principal es →: supongo ⊥ y de ⊥ sale φ."),
mc("lg","Primer paso","Práctico 4 · 1d\nTengo: nada\nMeta: φ→(ψ→φ∧ψ)\n¿Primer paso?","I→ dos veces (supongo φ y supongo ψ) y al final I∧",["I∧: pruebo φ y ψ→φ∧ψ||El conector principal de la meta es →, no ∧.","E→ con φ y ψ||No tengo ninguna implicación para eliminar.","I¬: supongo φ||La meta no es una negación."],"Dos implicaciones anidadas: supongo φ, supongo ψ, y armo φ∧ψ."),
mc("lg","Primer paso","Práctico 4 · 1h\nTengo: nada\nMeta: (φ→ψ)∧(φ→¬ψ)→¬φ\n¿Primer paso?","I→: supongo (φ→ψ)∧(φ→¬ψ); después I¬ suponiendo φ",["I∧: pruebo cada lado||El conector principal es →, no ∧: el ∧ está dentro del antecedente.","I¬: supongo (φ→ψ)∧(φ→¬ψ)||I¬ concluye una negación; el conector principal de la meta es →.","RAA: supongo ¬¬φ||La meta es una implicación."],"Hay que ubicar el conector principal: acá es →, cuyo consecuente ¬φ se arma después con I¬."),
mc("lg","Primer paso","Práctico 4 · 1k\nYa supuse (φ→ψ)→φ con I→.\nMeta: φ\n¿Cómo sigo?","RAA: supongo ¬φ",["I→: supongo φ||φ no es una implicación: no hay I→ para probarla.","E→: de (φ→ψ)→φ saco φ||Necesita φ→ψ y todavía no la tengo.","I¬: supongo φ||I¬ concluye ¬φ, no φ."],"φ no tiene conector que introducir: RAA. Con ¬φ pruebo φ→ψ (E¬ y E⊥) y después E→ da φ."),
mc("lg","Primer paso","Práctico 4 · 3c\nTengo: ¬(φ∧¬ψ), φ\nMeta: ψ\n¿Cómo sigo?","RAA: supongo ¬ψ; con φ armo φ∧¬ψ y E¬ da ⊥",["I¬: supongo ψ||I¬ concluye ¬ψ, no ψ.","E∧: separo ¬(φ∧¬ψ)||No es una conjunción: es la negación de una.","I→: supongo φ||φ ya es premisa y la meta no es una implicación."],"ψ no tiene conector que armar: RAA. Con ¬ψ y φ armo φ∧¬ψ, y chocando con la premisa llego a ⊥."),
mc("lg","Primer paso","Práctico 4 · 3e\nTengo: ¬φ\nMeta: φ→ψ\n¿Primer paso?","I→: supongo φ; con ¬φ, E¬ da ⊥ y E⊥ da ψ",["E¬: junto ¬φ y φ||Todavía no tengo φ: primero hay que suponerla con I→.","I∨: parto de ¬φ||La meta no es una disyunción.","E→: uso ¬φ||¬φ no es una implicación con antecedente que pueda usar."],"El conector principal es →: supongo φ, choca con ¬φ y de ⊥ sale ψ."),
mc("lg","Primer paso","Práctico 4 · 3a\nTengo: φ\nMeta: ¬(¬φ∧¬ψ)\n¿Primer paso?","I¬: supongo ¬φ∧¬ψ; con E∧ saco ¬φ y con φ llego a ⊥",["RAA: supongo ¬¬(¬φ∧¬ψ)||La meta empieza con ¬ y se arma con I¬.","I∧: pruebo ¬φ y ¬ψ||Eso probaría ¬φ∧¬ψ, que choca con φ.","E∧ sobre la hipótesis||Todavía no hay ninguna conjunción que separar."],"La meta es una negación: supongo lo que niega y busco ⊥."),
mc("lg","Primer paso","Práctico 4 · 7a\nTengo: nada\nMeta: φ∨ψ→ψ∨φ\n¿Primer paso?","I→: supongo φ∨ψ y uso E∨ (en cada caso, I∨)",["I∨: pruebo ψ||Sin la disyunción no puedo probar ψ ni φ.","E∨ sin suponer nada||Todavía no tengo la disyunción: la introduce I→.","I∧: pruebo φ∨ψ y ψ∨φ||El conector principal es →, no ∧."],"Supongo el antecedente y lo separo en casos con E∨."),
mc("lg","Primer paso","Práctico 4 · 7e\nTengo: nada\nMeta: (φ→ψ)↔(¬φ∨ψ)\n¿Primer paso?","I↔: pruebo (φ→ψ)→(¬φ∨ψ) y (¬φ∨ψ)→(φ→ψ)",["I∧: pruebo cada lado||I∧ arma una conjunción, no una equivalencia.","I→: supongo φ→ψ||Solo cubre una de las dos direcciones.","RAA: supongo ¬(φ→ψ)||La meta tiene un conector que se arma directo."],"Una equivalencia se arma con las dos implicaciones."),
mc("lg","Primer paso","Práctico 4 · 7f\nTengo: nada\nMeta: (φ→ψ)∨(ψ→φ)\n¿Primer paso?","RAA: supongo ¬((φ→ψ)∨(ψ→φ))",["I∨: pruebo φ→ψ||Sin hipótesis no hay forma directa de probar φ→ψ.","I∨: pruebo ψ→φ||Sin hipótesis no hay forma directa de probar ψ→φ."],"Ningún lado se prueba solo: se va por RAA, como en φ∨¬φ."),
mc("lg","Primer paso","Práctico 4 · 8a\nYa supuse ¬(¬φ∧¬ψ).\nMeta: φ∨ψ\n¿Cómo sigo?","RAA: supongo ¬(φ∨ψ) y busco ⊥",["I∨: pruebo φ||No tengo φ probada.","E¬ sobre ¬(¬φ∧¬ψ)||Necesito ¬φ∧¬ψ para juntarla, y todavía no la tengo.","I∧: pruebo ¬φ y ¬ψ||Es parte del camino, pero antes hay que suponer ¬(φ∨ψ)."],"Ni φ ni ψ se prueban solos: RAA. Con ¬(φ∨ψ) pruebo ¬φ y ¬ψ, armo ¬φ∧¬ψ y choca con la hipótesis."),
mc("lg","Primer paso","Práctico 8 · 3a\nTengo: ∀x(φ→ψ)\nMeta: ∀xφ→∀xψ\n¿Primer paso?","I→: supongo ∀xφ y busco ∀xψ",["I∀: x arbitraria||El conector principal de la meta es →, no ∀.","E∀ sobre ∀x(φ→ψ)||Es un paso posterior: primero se arma la meta con I→.","I∃: busco un testigo||No hay ningún ∃."],"El conector principal es →. Después, con ∀xφ supuesta, hago I∀ sobre ∀xψ."),
mc("lg","Primer paso","Práctico 8 · 3a\nTengo: ∀x(φ→ψ), ∀xφ\nMeta: ∀xψ\n¿Cómo sigo?","I∀: x arbitraria; con E∀ y E→ derivo ψ",["E∀ sobre la meta||La meta es un ∀: se arma, no se instancia.","I→: supongo ψ||La meta no es una implicación.","E∃: supongo ψ||No hay ningún ∃."],"x no está libre en las hipótesis abiertas (está ligada), así que puedo generalizar."),
/* Detectar errores (practico 4 ej. 5 y practico 8 ej. 2) */
mc("lg","Detectar error","Práctico 4 · 5\nDe ¬p₂∧¬p₃ obtengo ¬p₂, y el paso está rotulado «I∧».\n¿Es correcto?","No: debe ser E∧ (separa una conjunción)",["Sí: I∧ también separa||I∧ solo arma conjunciones.","No: debe ser E→||E→ necesita una implicación y una premisa.","No: debe ser I∨||I∨ arma una disyunción."],"Cuando una fórmula pierde un componente, la regla es una eliminación.","Revisá cada paso: ¿la regla es introducción (arma el conector) o eliminación (lo usa)? ¿Se cancelan las hipótesis que dicen? ¿Se cumple la restricción (∗)?"),
mc("lg","Detectar error","Práctico 4 · 5\nTengo la hipótesis [p₂∨p₃]² y escribo «p₂», rotulado E∨.\n¿Qué falla?","E∨ exige llegar a la misma conclusión suponiendo p₂ y suponiendo p₃",["Nada: E∨ saca el primer disyunto||E∨ no elige un lado: analiza los dos casos.","Falta cancelar p₂∨p₃ aquí||Se cancela con I→(2), no con E∨.","Debería ser I∨||I∨ arma disyunciones, no las usa."],"Una disyunción no da uno de sus lados: hay que probar lo mismo en las dos ramas.","Revisá cada paso: ¿la regla es introducción o eliminación? ¿Se cancelan las hipótesis que dicen? ¿Se cumple la restricción (∗)?"),
mc("lg","Detectar error","Práctico 4 · 5\nJunto p₂ y ¬p₂ y obtengo ⊥, rotulado «I⊥».\n¿Qué regla corresponde?","E¬ (φ y ¬φ dan ⊥)",["I¬||I¬ concluye ¬φ cancelando φ.","E⊥||E⊥ parte de un ⊥ ya probado.","Está bien: I⊥||En este cálculo ⊥ sale por E¬, como en el ejercicio 2."],"⊥ se obtiene juntando una fórmula y su negación con E¬.","Revisá cada paso: ¿la regla es introducción o eliminación? ¿Se cancelan las hipótesis que dicen? ¿Se cumple la restricción (∗)?"),
mc("lg","Detectar error","Práctico 8 · 2\nTengo ∃xP(x,y) y [P(x,y)]¹. Concluyo P(x,y) con E∃¹.\n¿Qué restricción se viola?","x ∉ FV(ψ): la conclusión P(x,y) tiene x libre",["y debe ser constante||Las variables libres están permitidas; el problema es otro.","Falta cancelar ∃xP(x,y)||E∃ cancela la suposición P(x,y); el ∃xP(x,y) queda como premisa.","Ninguna: E∃ admite cualquier conclusión||E∃ exige que x no esté libre en la conclusión."],"En E∃ la conclusión no puede mencionar la variable del testigo.","Mirá las condiciones (∗): E∃ pide x ∉ FV(ψ) y x ∉ FV de las hipótesis abiertas; I∀ pide x ∉ FV de las hipótesis abiertas."),
mc("lg","Detectar error","Práctico 8 · 2\nAplico I∀ sobre y para obtener ∀yP(x,y), pero [P(x,y)]¹ sigue abierta.\n¿Qué restricción se viola?","y está libre en una hipótesis abierta",["x debería ser nueva||El problema es y, la variable que se generaliza.","∀y ya estaba en una hipótesis||Que haya otro ∀y no es el problema.","Ninguna: I∀ siempre se puede||I∀ exige x∉FV de las hipótesis abiertas (acá, y)."],"I∀ no se puede cuando la variable aparece libre en una hipótesis aún sin cancelar.","Mirá las condiciones (∗): E∃ pide x ∉ FV(ψ) y x ∉ FV de las hipótesis abiertas; I∀ pide x ∉ FV de las hipótesis abiertas."),
/* Leer derivaciones: dar Γ y ρ (practico 4 ej. 2 y 4) */
mc("lg","Leer derivación","En Γ ⊢ ρ, ¿qué es Γ?","Las hipótesis sin cancelar (sin corchetes)",["Las hipótesis canceladas||Las canceladas ya no cuentan: se descargaron.","Todas las fórmulas del árbol||Solo cuentan las hojas sin cancelar.","La última regla aplicada||Γ es un conjunto de fórmulas, no una regla."],"Γ = hojas abiertas; ρ = la fórmula de la raíz."),
mc("lg","Leer derivación","Práctico 4 · 2a\nDerivación de (φ→¬φ)→¬φ. La hoja φ→¬φ no tiene corchetes; [φ]¹ se cancela con I¬(1); el I→ final no cancela nada.\n¿Qué Γ sirve?","Γ = {φ→¬φ} (o cualquier conjunto que la incluya)",["Γ = ∅||φ→¬φ quedó abierta, así que tiene que estar en Γ.","Γ = {φ}||φ se canceló con I¬(1).","Γ = {¬φ}||¬φ es una fórmula intermedia, no una hoja."],"Γ puede tener fórmulas de más (por eso piden tres Γ distintos)."),
mc("lg","Leer derivación","Práctico 4 · 2b\nDerivación de (φ→¬φ)→¬φ con [φ→¬φ]² y [φ]¹ ambas canceladas (I¬(1) e I→(2)).\n¿Qué Γ sirve?","Γ = ∅: es un teorema",["Γ = {φ→¬φ}||Se canceló con I→(2).","Γ = {φ}||Se canceló con I¬(1).","Γ = {φ, φ→¬φ}||Ambas están canceladas."],"Sin hojas abiertas, ⊢ ρ."),
mc("lg","Leer derivación","Práctico 4 · 2c\nIgual que 2b pero la hoja φ (la usada en E→) no tiene corchetes.\n¿Qué Γ sirve?","Γ = {φ} (o un superconjunto)",["Γ = ∅||φ quedó sin cancelar.","Γ = {φ→¬φ}||Esa sí se canceló con I→(2).","Γ = {¬φ}||¬φ es una fórmula intermedia."],"Las hojas abiertas definen Γ."),
mc("lg","Leer derivación","Práctico 4 · 4\nTengo ψ (de φ→ψ y φ) y γ. Necesito llegar a ⊥ usando ¬(ψ∧γ).\n¿Qué pasos faltan?","I∧ para armar ψ∧γ, y E¬ con ¬(ψ∧γ)",["E∧ sobre ψ y γ||No hay ninguna conjunción que separar.","I¬ directo||I¬ concluye una negación; antes hay que llegar a ⊥.","E→ con ψ y γ||No hay ninguna implicación entre ellas."],"ψ∧γ choca con ¬(ψ∧γ): E¬ da ⊥."),
mc("lg","Leer derivación","Práctico 4 · 4\nLa derivación sigue ⊥ → ¬γ → φ→¬γ.\n¿Qué cancela cada regla?","I¬ cancela γ; I→ cancela φ",["I¬ cancela φ; I→ cancela γ||Al revés: ¬γ se prueba suponiendo γ.","Las dos cancelan φ||I¬ cancela la suposición del consecuente que niega.","Ninguna cancela nada||Ambas cancelan la hipótesis supuesta."],"¬γ: supuse γ. φ→¬γ: supuse φ."),
/* Igualdad (practico 8 ej. 7 y 8) */
mc("lg","Igualdad","¿Qué da la regla I= (reflexividad)?","t =′ t, sin hipótesis",["x =′ y a partir de x||No se puede obtener una igualdad entre dos variables distintas sin hipótesis.","φ(y) a partir de x =′ y||Eso es E= (sustitución).","(∀x)(x =′ y)||Una igualdad con ∀ no sale de I=."],"I= solo prueba que cada término es igual a sí mismo."),
mc("lg","Igualdad","Tengo x =′ y y φ(x).\nQuiero φ(y).\n¿Qué regla?","E=: sustituyo x por y (t libre para x)",["I=: reflexividad||I= solo da t =′ t.","E∀: instancio||No hay ningún ∀ que instanciar.","I∃: busco un testigo||La meta no es un ∃."],"E= reemplaza iguales dentro de una fórmula."),
mc("lg","Igualdad","Práctico 8 · 7c\nTengo: nada\nMeta: (∀x)(∃y)x =′ y\n¿Cómo la armo?","I∀ (x arbitraria), I∃ con y := x, y x =′ x por I=",["E=: de x =′ y saco ∃y||E= necesita una igualdad ya probada y una fórmula donde sustituir.","E∀: instancio ∀x||No hay ningún ∀ que instanciar.","RAA: supongo ¬(∀x)(∃y)x =′ y||Es un rodeo: la meta se arma con la introducción de su conector."],"Armo ∀ (x arbitraria) y ∃ (testigo x); la igualdad sale de I=."),
mc("lg","Igualdad","Práctico 8 · 7a\nTengo: (∀x)(∀y)x =′ y\nMeta: (∀y)(∀x)y =′ x\n¿Cómo la armo?","I∀ dos veces (y, x arbitrarias) y E∀ dos veces sobre la hipótesis",["E=: sustituyo x por y||No hace falta: la hipótesis ya da cualquier igualdad con E∀.","I∃: busco un testigo||No hay ningún ∃.","I=: reflexividad||I= da t =′ t; acá necesito y =′ x con variables distintas."],"La hipótesis ya dice que todo es igual a todo: instancio y armo ∀."),
/* Cancelar */
mc("lg","Cancelar","Cierro con I→ y concluyo φ→ψ.\n¿Qué hipótesis cancelo?","φ, el antecedente (si la usé)",["ψ, el consecuente||ψ es lo que concluyo, no lo que supuse.","Todas las abiertas||Solo se cancela el antecedente; las demás quedan abiertas.","Ninguna: I→ no cancela||I→ cancela la hipótesis del antecedente."],"La cancelación puede ser vacía si nunca usé φ."),
mc("lg","Cancelar","Cierro con I¬ y concluyo ¬φ.\n¿Qué cancelo?","φ",["¬φ||¬φ es la conclusión, no la hipótesis.","⊥||⊥ es lo que obtengo, no lo que supuse.","¬¬φ||I¬ supone φ, no su doble negación."],"Supuse φ y llegué a ⊥."),
mc("lg","Cancelar","Cierro con RAA y concluyo φ.\n¿Qué cancelo?","¬φ",["φ||φ es la conclusión, no la hipótesis.","⊥||⊥ es lo que obtengo, no lo que supuse.","¬¬φ||RAA supone ¬φ, no su doble negación."],"Supuse ¬φ y llegué a ⊥."),
mc("lg","Cancelar","Cierro con E∨ sobre φ∨ψ.\n¿Qué cancelo?","φ y ψ, una en cada rama",["Solo φ∨ψ||Esa es la premisa mayor; no se cancela.","Solo φ, en la rama izquierda||También hay que cancelar ψ en la otra rama.","Nada||E∨ cancela las dos suposiciones."],"Las dos suposiciones, con etiquetas distintas."),
mc("lg","Cancelar","E∃ elimina el ∃: de (∃x)P(x) paso a trabajar con P(x). Al cerrar con E∃, ¿qué hipótesis queda entre corchetes [ ]ⁿ?","P(x), la suposición con la que trabajé",["(∃x)P(x)||No se corchetea: sigue como premisa abierta (queda en Γ); lo que desaparece es su ∃ al pasar a P(x).","ψ||ψ es la conclusión.","P(a)||E∃ supone el testigo con una variable nueva x, no con una constante."],"E∃ quita el ∃ (se pasa a trabajar con P(x), x nueva) y al cerrar se cancela esa suposición P(x); (∃x)P(x) queda como premisa."),
mc("lg","Cancelar","La hipótesis φ es una premisa del enunciado (Γ).\n¿La encierro entre corchetes?","No: solo se cancelan las que supuse yo",["Sí, con una etiqueta||Las premisas de Γ quedan abiertas.","Sí, al usar I→||I→ cancela lo que supuse para esa regla, no las premisas."],"Las premisas quedan abiertas."),
/* Condiciones (∗) con casos concretos */
mc("lg","Condición (∗)","Aplico E∀ a (∀x)(∃y)Q(x,y) con t = y.\n¿Se puede?","No: y queda capturada por ∃y",["Sí: y es un término||Cualquier término sirve solo si es libre para x; y queda capturada.","Sí: y es una variable nueva||No es nueva: aparece ligada en la fórmula."],"t tiene que ser libre para x: daría (∃y)Q(y,y)."),
mc("lg","Condición (∗)","Aplico E∀ a (∀x)(∃y)Q(x,y) con t = a.\n¿Se puede?","Sí: a es libre para x",["No: hay un ∃ adentro||Un cuantificador no impide sustituir si t no queda capturado.","No: a no es una variable||t puede ser cualquier término libre para x."],"Ningún cuantificador captura a."),
mc("lg","Condición (∗)","Meta: (∀x)P(x). Hipótesis abierta: Q(x).\n¿Puedo usar I∀?","No: x está libre en una hipótesis abierta",["Sí: Q(x) no es P(x)||I∀ no mira qué fórmula es la hipótesis, sino si x aparece libre.","Sí: siempre se puede||I∀ pide x ∉ FV de las hipótesis abiertas."],"x tiene que ser arbitraria."),
mc("lg","Condición (∗)","Meta: (∀x)P(x). Hipótesis abierta: Q(y).\n¿Puedo usar I∀?","Sí: x no está libre en ninguna hipótesis abierta",["No: hay una hipótesis abierta||Que haya hipótesis abiertas no alcanza: importa si x está libre en ellas.","No: y es libre||y no es la variable que estoy generalizando."],"Solo importa x."),
mc("lg","Condición (∗)","Tengo (∃x)P(x) y quiero concluir ψ = P(x) con E∃.\n¿Se puede?","No: x es libre en ψ",["Sí: x es una variable nueva||x aparece libre en la conclusión ψ.","Sí: E∃ admite cualquier ψ||E∃ exige x ∉ FV(ψ)."],"E∃ exige que x no esté libre en ψ."),
mc("lg","Condición (∗)","Tengo P(f(a)). Quiero concluir (∃x)P(x) con I∃.\n¿Se puede?","Sí: t = f(a) es libre para x",["No: f(a) no es una variable||t puede ser cualquier término libre para x.","No: falta un testigo||f(a) es el testigo."],"Cualquier término sirve si es libre para x."),
mc("lg","Condición (∗)","¿Es y libre para x en (∀y)P(x,y)?","No: queda capturada por ∀y",["Sí: y no cuantifica a x||La y que sustituiría a x quedaría dentro del alcance de ∀y.","Depende de la regla||Es una propiedad de la fórmula, no de la regla."],"Daría (∀y)P(y,y)."),
mc("lg","Condición (∗)","¿Es f(x) libre para x en ¬P(x)?","Sí: nada la captura",["No: f(x) contiene a x||Ser libre para x no prohíbe que el término contenga a x.","Depende de las hipótesis||Es una propiedad de la fórmula, no de las hipótesis."],"Sin cuantificadores no hay captura."),
/* Fórmulas */
mc("lg","Fórmulas","Variables libres en (∀x)P(x,y)","Solo y",["x e y||x queda ligada por ∀x.","Solo x||x está ligada; la libre es y."],"x queda ligada por ∀x."),
mc("lg","Fórmulas","En (∀x)P(x) ∧ Q(x)\n¿La x de Q(x) es libre?","Sí",["No||∀x solo alcanza a P(x): ∀ liga más fuerte que ∧."],"∀x solo alcanza a P(x)."),
mc("lg","Fórmulas","¿Cómo se lee φ∨ψ∧σ?","φ∨(ψ∧σ)",["(φ∨ψ)∧σ||En la app ∧ liga más que ∨."],"∧ liga más que ∨."),
/* Estrategia: movimientos recursivos (armar meta / desarmar hipotesis) y estado de la derivacion */
mc("lg","Estrategia","Tengo: φ→ψ\nMeta: ψ\n¿Qué subobjetivo aparece?","Probar φ (y después E→)",["Probar ψ||Es la meta original: sería circular.","Suponer ψ||Si lo supongo no pruebo nada.","Probar ψ→φ||No se necesita la recíproca."],"Para usar una implicación hay que conseguir su antecedente: un subobjetivo más chico."),
mc("lg","Estrategia","Tengo: ¬φ\nMeta: ⊥\n¿Qué subobjetivo aparece?","Probar φ y juntar con ¬φ por E¬",["Probar ¬¬φ||Es más fuerte de lo necesario.","Aplicar E⊥||E⊥ parte de un ⊥ que todavía no tengo.","Suponer φ||Suponer no basta: hay que probarla desde lo que tengo."],"Una negación en las hipótesis pide su φ para contradecirla."),
mc("lg","Estrategia","Tengo: q→p, q∧r\nMeta: p (atómica)\n¿Cómo sigo?","E∧ para sacar q y E→ con q→p",["I→: supongo q||La meta p no es una implicación.","I∧: junto q y r||Daría q∧r, no p.","RAA enseguida||RAA va al final: antes miro si p sale de las hipótesis."],"Meta atómica: busco si está o si sale eliminando hipótesis; si no, RAA."),
mc("lg","Estrategia","Meta: φ→(ψ→σ)\nHago I→ dos veces.\n¿Qué queda?","Hipótesis abiertas φ y ψ; meta σ",["Hipótesis abiertas ψ y σ; meta φ||Se suponen los antecedentes, no los consecuentes.","Sin hipótesis; meta σ||Las suposiciones siguen abiertas hasta que las cancelen las I→.","Hipótesis φ→(ψ→σ); meta ⊥||La meta es σ, no ⊥."],"Cada I→ baja un nivel: sube una hipótesis y la meta pasa a ser el consecuente."),
mc("lg","Estrategia","Meta: φ\nAplico RAA.\n¿Qué queda?","Hipótesis nueva ¬φ; meta ⊥",["Hipótesis nueva φ; meta ⊥||Eso es I¬ (para probar ¬φ).","Hipótesis nueva ¬φ; meta φ||La meta pasa a ser ⊥.","Sin cambios||RAA agrega la suposición ¬φ."],"RAA cambia el problema: ahora busco una contradicción."),
mc("lg","Estrategia","Tengo: φ∨ψ\nMeta: χ\n¿Qué pruebo en cada rama de E∨?","χ, suponiendo φ en una rama y ψ en la otra",["φ y ψ por separado||Hay que llegar a la misma conclusión χ en ambas.","χ∨χ||E∨ concluye χ, no una disyunción.","φ∧ψ||No se pueden suponer los dos a la vez."],"Dos subproblemas con la misma meta χ."),
mc("lg","Estrategia","Práctico 8 · 10c\nTengo: ∀z(P(x,z)∧P(y,z)→P(f(x,y),z)), P(x,f(y,x)), P(y,f(y,x))\nMeta: P(f(x,y), f(y,x))\n¿Con qué término instancio z?","z := f(y,x): el que aparece en la meta y en las otras hipótesis",["z := x||No coincide con las hipótesis ni con la meta.","z := f(x,y)||No coincide con los P(·, f(y,x)) que tengo.","Una variable nueva||Para E∀ elijo el término que me sirve; la variable nueva es para I∀."],"En E∀ el término se elige mirando la meta y los antecedentes que ya tengo."),
mc("lg","Estrategia","Meta con conector principal y hipótesis con conectores.\n¿Qué conviene hacer primero?","Armar la meta con su introducción; desarmar hipótesis cuando falte material para un subobjetivo",["Desarmar todas las hipótesis antes de tocar la meta||Se llena de fórmulas que quizás no hacen falta: guiate por la meta.","Aplicar RAA de entrada||RAA es el último recurso, para metas sin conector útil.","Elegir cualquier regla aplicable||Sin criterio la derivación se desordena."],"Se repite en cada subobjetivo hasta llegar a fórmulas atómicas."),
/* Quiz de la pestaña Ejercicios Lógica (viene de logica.html: const Q) */
mc("lg","Quiz ejercicios","Querés probar φ→ψ. ¿Qué regla usás y qué se cancela?","I→: suponés φ, llegás a ψ y cancelás φ",["I→: suponés ψ, llegás a φ y cancelás ψ","E→: tomás φ y ψ como premisas","RAA: suponés ¬ψ y cancelás ¬ψ"],"I→ cancela el antecedente: de la hipótesis φ deducís ψ y queda φ→ψ."),
mc("lg","Quiz ejercicios","Querés probar ¬φ. ¿Qué regla usás?","I¬: suponés φ, llegás a ⊥ y cancelás φ",["RAA: suponés ¬φ, llegás a ⊥ y cancelás ¬φ","E¬ aplicada a φ","E⊥ desde φ"],"I¬ concluye ¬φ cancelando φ. RAA concluye φ cancelando ¬φ: no las confundas."),
mc("lg","Quiz ejercicios","¿Qué premisas necesita E¬ y qué concluye?","¬φ y φ; concluye ⊥",["φ y ψ; concluye φ∧ψ","⊥; concluye cualquier φ","φ→⊥; concluye ¬φ"],"E¬ junta una fórmula y su negación para llegar a ⊥. En el examen: primero ¬φ y después φ."),
mc("lg","Quiz ejercicios","¿Qué hace E⊥?","De ⊥ concluye cualquier fórmula",["De φ y ¬φ concluye ⊥","Cancela ¬φ y concluye φ","De ⊥ concluye ¬φ cancelando φ"],"Ex falso: de una contradicción sale cualquier cosa. Ej. 2c: de ⊥ se concluye (∀x)Q(x)."),
mc("lg","Quiz ejercicios","Ninguna introducción ni eliminación directa te lleva a la conclusión φ. ¿Qué intentás?","RAA: suponer ¬φ y buscar ⊥",["I¬ suponiendo φ","I→ suponiendo ⊥","E⊥ sin tener ⊥"],"RAA es el recurso general: suponés ¬φ, llegás a ⊥ y cancelás ¬φ."),
mc("lg","Quiz ejercicios","En E∨ (de φ∨ψ a σ), ¿qué se cancela?","φ en una rama y ψ en la otra; ambas ramas llegan a σ",["Solo φ∨ψ","Solo ¬σ","Nada"],"Hay dos derivaciones de σ, una bajo φ y otra bajo ψ; las dos hipótesis se cancelan con etiquetas distintas."),
mc("lg","Quiz ejercicios","Para I∨ con conclusión φ∨ψ, ¿qué necesitás?","Probar φ o probar ψ (alcanza uno)",["Probar φ y ψ","Probar ¬φ","Probar φ→ψ"],"I∨ solo pide un disyunto. En 3a hay que elegir el que se puede probar."),
mc("lg","Quiz ejercicios","¿Qué premisas tiene E→ para concluir ψ?","φ→ψ y φ",["φ→ψ y ψ","φ y ψ","¬ψ→¬φ"],"Modus ponens. La decisión clave es el antecedente φ."),
mc("lg","Quiz ejercicios","¿Condición lateral de E∀ (de (∀x)φ(x) a φ(t))?","t libre para x en φ",["x ∉ FV de las hipótesis abiertas","x ∉ FV(ψ) ni de las hipótesis abiertas","Ninguna"],"Al sustituir x por t no se debe capturar ninguna variable de t. Ej. 2c: f(x) libre para x en ¬P(x)."),
mc("lg","Quiz ejercicios","¿Condición lateral de I∃ (de φ(t) a (∃x)φ(x))?","t libre para x en φ",["x ∉ FV de las hipótesis abiertas","x ∉ FV(ψ) ni de las hipótesis abiertas","Ninguna"],"Igual que E∀: t libre para x en φ. Ej. 3b: x libre para x en P(x,x)."),
mc("lg","Quiz ejercicios","¿Condición lateral de I∀ (de φ(x) a (∀x)φ(x))?","x ∉ FV de las hipótesis abiertas (no canceladas)",["t libre para x en φ","x ∉ FV(ψ) únicamente","Ninguna"],"Si x es libre en una hipótesis abierta no es arbitraria y no se puede generalizar."),
mc("lg","Quiz ejercicios","¿Condición lateral de E∃ (de (∃x)φ(x) y ψ bajo [φ(x)])?","x ∉ FV(ψ) ni de las hipótesis abiertas distintas de φ(x)",["t libre para x en φ","x ∉ FV(φ)","Ninguna"],"Ej. 3b: x ∉ FV((∃x)P(x,x), (∀x)(∀y)(∀z)(...))."),
mc("lg","Quiz ejercicios","¿Cuándo una hipótesis no lleva corchetes ni etiqueta?","Cuando es premisa del juicio (Γ) y no se cancela",["Cuando se cancela con RAA","Cuando se usa dos veces","Cuando es ⊥"],"Las canceladas van como [φ]ⁿ; las premisas de Γ quedan abiertas."),
mc("lg","Quiz ejercicios","¿Puede aplicarse I→ sin cancelar ninguna hipótesis?","Sí, la cancelación puede ser vacía",["No, siempre debe cancelar φ","Solo si ψ es ⊥","Solo dentro de RAA"],"En 3a, β→γ se obtiene de γ por I→ sin cancelar β."),
mc("lg","Quiz ejercicios","¿Qué necesita I↔ para concluir φ↔ψ?","φ→ψ y ψ→φ",["φ y ψ","φ∧ψ","¬φ y ¬ψ"],"I↔ junta las dos implicaciones; en 3a se derivan por separado.")
];
SWC.push(
/* ===== Lógica: armar la meta y desarmar hipótesis, paso a paso ===== */
sw("lg","Meta ∧","Tengo: φ, ψ\nMeta: φ∧ψ",[
 st("¿Armo la meta o desarmo una hipótesis?","Armo: la meta tiene conector ∧","Desarmo una hipótesis","La meta tiene conector principal: se arma con su introducción.",""),
 st("¿Qué regla?","I∧","E∧","I∧ arma conjunciones; E∧ las separa.","I∧"),
 st("¿Qué subobjetivos quedan?","Probar φ y probar ψ","Probar φ→ψ","Una conjunción pide las dos partes.","φ, ψ")
],"I∧: de φ y ψ obtengo φ∧ψ"),
sw("lg","Meta →","Tengo: φ→σ, σ→ψ\nMeta: φ→ψ",[
 st("¿Qué regla arma la meta?","I→","E→","El conector principal es →.","I→"),
 st("¿Qué supongo?","φ, el antecedente","ψ, el consecuente","Se supone el antecedente.","supongo φ"),
 st("¿Qué busco ahora?","ψ","φ","Hay que llegar al consecuente.","busco ψ"),
 st("¿Cómo llego a ψ?","E→ dos veces: φ→σ y σ→ψ","I∧ con φ y ψ","Cadena de modus ponens.","E→ ×2"),
 st("Al cerrar con I→, ¿qué cancelo?","φ","ψ","La hipótesis supuesta.","cancelo φ")
],"I→: supongo φ, llego a ψ con E→ ×2 y cancelo φ"),
sw("lg","Meta ¬","Tengo: φ→ψ, ¬ψ\nMeta: ¬φ",[
 st("¿Qué regla?","I¬","RAA","La meta empieza con ¬: I¬. RAA concluye una fórmula suponiendo su negación.","I¬"),
 st("¿Qué supongo?","φ","¬φ","I¬ supone lo que niega la meta.","supongo φ"),
 st("¿Qué busco?","⊥","ψ","Hay que llegar a una contradicción.","busco ⊥"),
 st("¿Cómo llego a ⊥?","E→ da ψ, y E¬ con ¬ψ da ⊥","I∧ con φ y ψ","Primero ψ, después choco con ¬ψ.","E→, E¬"),
 st("¿Qué cancelo?","φ","¬φ","La suposición de I¬.","cancelo φ")
],"I¬: supongo φ, E→ da ψ, E¬ con ¬ψ da ⊥ y cancelo φ"),
sw("lg","Meta atómica (RAA)","Tengo: ¬¬φ\nMeta: φ",[
 st("¿La meta φ tiene un conector para armar?","No: es atómica","Sí","Sin conector no hay introducción que usar.",""),
 st("¿Sale directo de las hipótesis?","No: tengo ¬¬φ, no φ","Sí","¬¬φ no es φ en este cálculo.",""),
 st("Entonces uso…","RAA","I¬","Es el último recurso para metas sin conector.","RAA"),
 st("¿Qué supongo?","¬φ","φ","RAA supone la negación de la meta.","supongo ¬φ"),
 st("¿Qué regla junta ¬φ y ¬¬φ?","E¬, da ⊥","E⊥","E¬ junta φ y ¬φ (acá ¬φ y ¬¬φ).","E¬")
],"RAA: supongo ¬φ, E¬ con ¬¬φ da ⊥ y cancelo ¬φ"),
sw("lg","Meta ∨","Tengo: φ\nMeta: φ∨ψ",[
 st("¿Qué regla?","I∨","I∧","La meta es una disyunción.","I∨"),
 st("¿Qué lado pruebo?","φ, el que tengo","ψ","Alcanza con un lado.","φ"),
 st("¿Necesito probar los dos lados?","No","Sí","Eso sería una conjunción.","")
],"I∨: de φ obtengo φ∨ψ"),
sw("lg","Meta ∨ sin hipótesis","Tengo: nada\nMeta: φ∨¬φ",[
 st("¿Puedo probar φ solo?","No","Sí","Sin hipótesis no hay forma.",""),
 st("¿Puedo probar ¬φ solo?","No","Sí","Tampoco.",""),
 st("Entonces, ¿qué regla?","RAA","I∨","Ningún lado se prueba directo.","RAA"),
 st("¿Qué supongo?","¬(φ∨¬φ)","φ∨¬φ","RAA supone la negación de la meta.","supongo ¬(φ∨¬φ)")
],"RAA: supongo ¬(φ∨¬φ) y busco ⊥"),
sw("lg","Meta ∀","Tengo: ∀x(P(x)∧Q(x))\nMeta: ∀xP(x)",[
 st("¿Qué regla arma la meta?","I∀","E∀","La meta es un ∀.","I∀"),
 st("¿Cómo tiene que ser x?","Arbitraria","Una constante","I∀ generaliza sobre una x cualquiera.","x arbitraria"),
 st("¿Cómo uso la hipótesis?","E∀ con x, y después E∧","I∃","Instancio y separo la conjunción.","E∀, E∧"),
 st("¿x está libre en alguna hipótesis abierta?","No: está ligada por ∀","Sí","Se cumple la condición (∗).","")
],"I∀: x arbitraria; E∀ y E∧ dan P(x)"),
sw("lg","Meta ∃","Tengo: P(a)\nMeta: ∃xP(x)",[
 st("¿Qué regla?","I∃","E∃","La meta es un ∃.","I∃"),
 st("¿Qué testigo uso?","a","Una variable nueva","Ya tengo un término que funciona.","t = a"),
 st("¿Debe ser a libre para x?","Sí","No","Que no quede capturado.","")
],"I∃: el testigo es a"),
sw("lg","Meta ↔","Tengo: φ→ψ, ψ→φ\nMeta: φ↔ψ",[
 st("¿Qué regla?","I↔","I∧","I↔ arma equivalencias.","I↔"),
 st("¿Qué pruebo?","φ→ψ y ψ→φ","φ∧ψ","Las dos implicaciones.","φ→ψ, ψ→φ")
],"I↔: de φ→ψ y ψ→φ obtengo φ↔ψ"),
sw("lg","Meta ⊥","Tengo: φ, ¬φ\nMeta: ⊥",[
 st("¿Qué regla da ⊥?","E¬","E⊥","E¬ junta φ y ¬φ. E⊥ parte de ⊥.","E¬"),
 st("¿Qué junto?","φ y ¬φ","φ∧¬φ","Las dos premisas directas.","")
],"E¬: de φ y ¬φ obtengo ⊥"),
sw("lg","Usar ∧","Tengo: φ∧ψ\nMeta: ψ",[
 st("¿Armo o desarmo?","Desarmo: ψ está dentro de una hipótesis","Armo","La meta es atómica y sale de la hipótesis.",""),
 st("¿Qué regla?","E∧","I∧","E∧ separa conjunciones.","E∧"),
 st("¿Qué me quedo?","ψ","φ","Lo que pide la meta.","ψ")
],"E∧: de φ∧ψ obtengo ψ"),
sw("lg","Usar →","Tengo: φ→ψ\nMeta: ψ",[
 st("¿Qué regla uso?","E→","I→","E→ usa la implicación.","E→"),
 st("¿Qué necesito además?","φ","ψ","El antecedente.","necesito φ"),
 st("Entonces el subobjetivo es…","Probar φ","Probar ψ","Probar ψ es la meta original: circular.","subobjetivo φ")
],"E→: con φ→ψ y φ obtengo ψ (subobjetivo: φ)"),
sw("lg","Usar ∨","Tengo: φ∨ψ, φ→χ, ψ→χ\nMeta: χ",[
 st("¿Qué hipótesis desarmo?","φ∨ψ","φ→χ","Con una disyunción no avanzo sin separar casos.","E∨ sobre φ∨ψ"),
 st("¿Cuántas ramas tiene E∨?","Dos","Una","Una por disyunto.",""),
 st("¿Qué pruebo en cada rama?","χ, suponiendo φ y suponiendo ψ","φ y ψ","Misma conclusión en ambas.","χ en cada rama"),
 st("¿Qué cancelo?","φ y ψ, una por rama","φ∨ψ","Las suposiciones de las ramas.","cancelo φ y ψ")
],"E∨: χ bajo φ (E→) y χ bajo ψ (E→); cancelo φ y ψ"),
sw("lg","Usar ∃","Tengo: ∃xP(x), ∀x(P(x)→Q(x))\nMeta: ∃xQ(x)",[
 st("La meta es un ∃. ¿Puedo hacer I∃ ya?","No: no tengo Q(t) para ningún t","Sí, con t = x","I∃ pide tener ya probada una instancia Q(t).",""),
 st("¿Qué hipótesis desarmo primero?","∃xP(x), con E∃: me da un testigo","∀x(P(x)→Q(x)), con E∀","El ∀ se puede instanciar con cualquier término; conviene tener primero el testigo del ∃ para instanciar justo con él.","E∃ ·"),
 st("¿Qué supongo para usar E∃?","P(x), con x nueva","P(a), con a constante","E∃ supone la fórmula sin el ∃, con una variable que no aparezca libre en otro lado.","supongo P(x)"),
 st("Bajo esa suposición, ¿qué meta busco?","∃xQ(x), la misma meta","Q(x)","E∃ concluye lo mismo que se prueba adentro; Q(x) será un paso intermedio.",""),
 st("Tengo P(x). ¿Cómo uso ∀x(P(x)→Q(x))?","E∀ con t = x: P(x)→Q(x)","E→ directo sobre el ∀","Una fórmula con ∀ adelante primero se instancia; recién después aparece la →.","E∀ ·"),
 st("Tengo P(x)→Q(x) y P(x).","E→: obtengo Q(x)","I→","La → está en lo que tengo y tengo su antecedente: E→.","E→ ·"),
 st("Tengo Q(x). Meta ∃xQ(x).","I∃ con t = x","I∀","La meta es un ∃ y Q(x) es su instancia con x.","I∃ ·"),
 st("Al cerrar E∃, ¿qué va entre corchetes [ ]ⁿ?","P(x), la suposición","∃xP(x), la premisa","∃xP(x) sigue abierta (en Γ); se cancela la suposición del testigo.","cancelo P(x)"),
 st("Condición (∗) de E∃","x ∉ FV de ∃xQ(x) ni de ∀x(P(x)→Q(x))","t libre para x","La x supuesta no puede quedar libre en la conclusión ni en otra hipótesis abierta. En ∃xQ(x) y en ∀x(…) x está ligada: se cumple.","")
],"E∃ sobre ∃xP(x) con [P(x)]: E∀ con x, E→ da Q(x), I∃ da ∃xQ(x)"),
sw("lg","Usar ¬ y ⊥",null,[
 st("Tengo ¬φ y quiero ⊥. ¿Qué me falta?","φ","ψ, cualquier otra fórmula","E¬ pide una fórmula y su negación: acá φ y ¬φ."),
 st("Tengo ⊥ y quiero ψ.","E⊥","E¬","Ex falso: de ⊥ sale cualquier fórmula."),
 st("Tengo φ→ψ y φ.","E→","I→","Modus ponens."),
 st("Tengo φ∨ψ.","E∨, con dos ramas","I∨","Una disyunción se usa separando casos."),
 st("Tengo ∀xP(x).","E∀: instancio con un término","I∀","Para usar un ∀ lo instancio."),
 st("Tengo ∃xP(x).","E∃: supongo P(x), x nueva","E∀","Para usar un ∃ supongo el testigo.")
]),
sw("lg","Estrategia",null,[
 st("¿Qué miro primero?","La meta: ¿tiene conector?","Las hipótesis","Con conector, la meta se arma con su introducción."),
 st("La meta ya está entre las hipótesis.","Nada: es una hoja","I∧","No hace falta ninguna regla."),
 st("Meta atómica que no está.\n¿Qué pruebo primero?","Si sale de eliminar hipótesis","RAA","RAA es el último recurso."),
 st("Meta atómica y nada sirve.","RAA","I→","Suponer ¬meta y buscar ⊥."),
 st("Después de RAA o I¬ la meta pasa a ser…","⊥","La misma fórmula","Busco una contradicción."),
 st("Armo la meta o desarmo hipótesis.\n¿Qué hago primero?","Armar la meta","Desarmar todo","Guiate por la meta; desarmá cuando falte material.")
]),
sw("lg","Cancelación",null,[
 st("I→ cancela…","El antecedente","El consecuente","Se supone el antecedente."),
 st("I¬ cancela…","φ","¬φ","Supongo φ para llegar a ⊥."),
 st("RAA cancela…","¬φ","φ","Supongo ¬φ para llegar a ⊥."),
 st("E∨ cancela…","Las dos suposiciones","La disyunción","Una por rama."),
 st("En E∃: ¿qué hipótesis se cancela [ ]ⁿ?","P(x), la suposición sin el ∃","∃xP(x), la premisa","E∃ quita el ∃ para trabajar con P(x); esa suposición se cancela al cerrar. ∃xP(x) queda como premisa abierta (en Γ)."),
 st("Una premisa de Γ lleva corchetes.","No: solo se cancelan las supuestas","Sí","Las premisas quedan abiertas.")
]),
sw("lg","Condiciones (∗)",null,[
 st("I∀ con x libre en una hipótesis abierta.","No se puede","Se puede","x tiene que ser arbitraria."),
 st("E∃ con x libre en la conclusión.","No se puede","Se puede","Exige x ∉ FV(ψ)."),
 st("E∀ con t = y sobre (∀x)(∃y)Q(x,y).","No se puede: y queda capturada","Se puede","t debe ser libre para x."),
 st("E∀ con t = a sobre (∀x)(∃y)Q(x,y).","Se puede: a es libre para x","No se puede","Nada captura a a."),
 st("¿Es f(x) libre para x en ¬P(x)?","Sí","No","Sin cuantificadores no hay captura."),
 st("I∃ con t = f(a) sobre P(f(a)).","Se puede","No se puede","f(a) es libre para x.")
]),
sw("lg","Detectar errores",null,[
 st("De ¬p₂∧¬p₃ saco ¬p₂ y rotulo I∧.","Mal: es E∧","Bien","Separar una conjunción es eliminación."),
 st("De p₂∨p₃ escribo p₂ con E∨ sin ramas.","Mal: faltan los dos casos","Bien","E∨ exige probar lo mismo bajo cada disyunto."),
 st("De p₂ y ¬p₂ obtengo ⊥ con «I⊥».","Mal: es E¬","Bien","⊥ sale de E¬."),
 st("¿Qué es Γ en Γ ⊢ ρ?","Las hojas sin cancelar","Las hojas canceladas","Las canceladas ya no cuentan."),
 st("I∀ con [P(x,y)]¹ abierta y y libre.","Mal: y libre en hipótesis abierta","Bien","Viola (∗) de I∀.")
]),
sw("lg","Igualdad",null,[
 st("I= da…","t =′ t","x =′ y","Reflexividad."),
 st("E= sirve para…","Reemplazar iguales dentro de una fórmula","Instanciar un ∀","Sustitución de iguales."),
 st("(∀x)(∃y)x =′ y: ¿qué pone de testigo?","y := x","y := a","I= da x =′ x.")
])
);
/* ===== Lógica: combinaciones de átomos (ejercicios del examen: 2c, 3b, 3a) ===== */
SWC.push(
sw("lg","Combinar 2c (∀ desde contradicción)","Tengo: ψ = (∀x)P(f(x)) ∧ (∃z)¬P(z)   y   (∀x)¬P(x)\nMeta: (∀x)Q(x)",[
 st("¿Qué miro primero?","La meta: tiene ∀, se arma con I∀","Las hipótesis, para desarmarlas","El conector de la meta se arma sin perder nada.","I∀ ·"),
 st("Tras I∀, la meta pasa a ser…","Q(x), con x arbitraria","Q(a), con a una constante","I∀ pide una x genérica, no un caso particular."),
 st("¿Alguna hipótesis habla de Q?","No: Q(x) no sale por eliminaciones","Sí: con E∀ sale Q(x)","P y Q no se relacionan: no hay camino directo a Q."),
 st("Entonces Q(x) solo puede salir de…","⊥, con E⊥","I¬ suponiendo Q(x)","De una contradicción sale cualquier fórmula.","E⊥ ·"),
 st("Nueva meta ⊥. ¿Qué regla da ⊥?","E¬: necesito una fórmula y su negación","E⊥","E⊥ usa ⊥, no lo produce.","E¬ ·"),
 st("Busco una fórmula y su negación. ¿Qué hipótesis me da negaciones a mi elección?","(∀x)¬P(x): con E∀ da ¬P(t) para el t que quiera","(∃z)¬P(z): da ¬P(z)","(∃z)¬P(z) da ¬P de un z que no elijo; el ∀ me deja elegir el término."),
 st("¿Y qué hipótesis me da fórmulas P(…) sin negar?","(∀x)P(f(x)), dentro de ψ: da P(f(t))","Ninguna: tengo que suponer P(x)","Lo único positivo sobre P está en la primera mitad de ψ."),
 st("Lo positivo siempre tiene la forma P(f(…)). ¿Qué par busco?","P(f(x)) y ¬P(f(x))","P(x) y ¬P(x)","P(x) no sale de ninguna hipótesis; ¬P(f(x)) sí, eligiendo t = f(x) en (∀x)¬P(x).","busco P(f(x)), ¬P(f(x)) ·"),
 st("¿De dónde saco P(f(x))?","De (∀x)P(f(x)), que está dentro de ψ: primero E∧","De (∃z)¬P(z)","(∃z)¬P(z) no sirve: solo afirma que algo no cumple P.","E∧ ·"),
 st("Instancio (∀x)P(f(x)) con t = …","x, y obtengo P(f(x))","f(x), y obtengo P(f(f(x)))","Quiero P(f(x)) para que encaje con la negación.","E∀ x ·"),
 st("Instancio (∀x)¬P(x) con t = …","f(x), y obtengo ¬P(f(x))","x, y obtengo ¬P(x)","Tiene que ser exactamente la negación de P(f(x)).","E∀ f(x) ·"),
 st("¿Es f(x) libre para x en ¬P(x)?","Sí: no hay cuantificador que capture x","No","No hay ningún ∀ o ∃ dentro de ¬P(x) que ligue la x de f(x)."),
 st("Cierro con E¬ y después…","E⊥ da Q(x) e I∀ da (∀x)Q(x)","I→","El orden es E¬ → ⊥ → E⊥ → I∀.","E¬"),
 st("Condición (∗) de I∀","x ∉ FV de las hipótesis abiertas: en ψ y en (∀x)¬P(x) x está ligada","x puede ser libre","Las hipótesis abiertas no tienen x libre: se puede generalizar.")
],"I∀ ← E⊥ ← E¬ (P(f(x)) por E∀ con x, ¬P(f(x)) por E∀ con f(x))"),
sw("lg","Combinar 3b (∃ en hipótesis y en meta)","Tengo: (∃x)R(x,x)   y   (∀x)(∀y)(∀z)(R(x,y)∧R(x,z)→P(y,z))\nMeta: (∃x)P(x,x)",[
 st("¿Puedo hacer I∃ directo?","No: todavía no tengo P(t,t) para ningún t","Sí","I∃ pide ya tener el testigo probado."),
 st("¿Qué hipótesis desarmo primero?","(∃x)R(x,x), con E∃","La ∀∀∀","El ∃ da un testigo con el que instanciar la otra.","E∃ ·"),
 st("¿Qué supongo?","R(x,x), con x nueva","R(a,a), con a constante","E∃ supone la fórmula con una variable nueva."),
 st("Bajo esa suposición, ¿qué meta busco?","(∃x)P(x,x), la misma meta","⊥","E∃ concluye la misma ψ que se prueba adentro."),
 st("¿Cuántas veces uso E∀ en la ∀∀∀?","Tres: una por cada cuantificador","Una","Hay que quitar ∀x, ∀y y ∀z."),
 st("¿Con qué términos?","x, x, x: así sale R(x,x)∧R(x,x)→P(x,x)","x, y, z","Quiero que el antecedente use R(x,x), que es lo que tengo.","E∀ ×3 ·"),
 st("Para el antecedente R(x,x)∧R(x,x)…","I∧ con R(x,x) usada dos veces","No se puede: falta otra premisa","La misma hipótesis puede usarse dos veces.","I∧ ·"),
 st("Con el antecedente probado, ¿qué regla?","E→, obtengo P(x,x)","I→","E→ saca el consecuente.","E→ ·"),
 st("Y para llegar a (∃x)P(x,x)…","I∃ con t = x","E∃","I∃ construye el ∃ a partir de P(x,x).","I∃ ·"),
 st("Al cerrar E∃, ¿qué hipótesis queda entre corchetes [ ]ⁿ?","R(x,x), la suposición sin el ∃","(∃x)R(x,x), la premisa","E∃ quita el ∃ para trabajar con R(x,x); esa suposición se cancela. (∃x)R(x,x) sigue como premisa abierta."),
 st("Condición (∗) de E∃","x ∉ FV((∃x)P(x,x)) ni de las hipótesis abiertas","t libre para x","La x supuesta no puede escapar a la conclusión.")
],"E∃ sobre (∃x)R(x,x): bajo [R(x,x)]: E∀×3 → I∧ → E→ → I∃ → (∃x)P(x,x)"),
sw("lg","Combinar 3a → (casos y contradicción)","Meta: ⊢ (α∨(β∧¬γ)) → (¬α→¬(β→γ))\nTengo: nada",[
 st("Meta A→B: ¿qué hago?","I→, supongo α∨(β∧¬γ)","I→, supongo ¬α→¬(β→γ)","I→ supone el antecedente de la meta.","I→ ·"),
 st("Nueva meta ¬α→¬(β→γ).","I→, supongo ¬α","E→","Otra implicación: otro I→.","I→ ·"),
 st("Nueva meta ¬(β→γ).","I¬, supongo β→γ","I→, supongo β","La meta empieza con ¬: I¬.","I¬ ·"),
 st("Meta ⊥. Tengo α∨(β∧¬γ), ¬α, β→γ. ¿Qué desarmo?","La disyunción, con E∨","β→γ, con E→","β→γ pide β, que todavía no tengo.","E∨ ·"),
 st("¿Qué meta lleva cada rama del E∨?","⊥ en las dos","α∨(β∧¬γ)","E∨ concluye lo que se prueba en ambas ramas: ⊥."),
 st("Rama α: ¿cómo llego a ⊥?","E¬ con ¬α y α","E⊥","Tengo α y ¬α: contradicción directa."),
 st("Rama β∧¬γ: ¿qué saco primero?","E∧: β y ¬γ","I∧","Hay que desarmar la conjunción.","E∧ ·"),
 st("Con β y β→γ obtengo…","γ, por E→","¬γ","Modus ponens."),
 st("Con γ y ¬γ…","E¬ da ⊥","E⊥","γ y ¬γ son fórmula y negación."),
 st("E∨ cancela…","α y β∧¬γ, una por rama","α∨(β∧¬γ)","Cancela las suposiciones de las ramas, no la disyunción."),
 st("Orden de cierre, de adentro hacia afuera","I¬ cancela β→γ; I→ cancela ¬α; I→ cancela α∨(β∧¬γ)","I→ cancela α∨(β∧¬γ) primero","Cada cancelación corresponde a la suposición más reciente.")
],"I→, I→, I¬ y adentro E∨ (rama α: E¬; rama β∧¬γ: E∧, E→, E¬)"),
sw("lg","Combinar 3a ← (cuando no sé qué disyunto)","Meta: ⊢ (¬α→¬(β→γ)) → (α∨(β∧¬γ))\nTengo: nada",[
 st("Meta A→B: ¿qué hago?","I→, supongo ¬α→¬(β→γ)","I→, supongo α∨(β∧¬γ)","I→ supone el antecedente de la meta.","I→ ·"),
 st("Meta α∨(β∧¬γ): ¿I∨ directo?","No: no sé qué lado probar","Sí, con α","Sin saber qué disyunto vale, I∨ es un camino sin salida."),
 st("Entonces…","RAA: supongo ¬(α∨(β∧¬γ)) y busco ⊥","I¬","Es el recurso cuando un ∨ no se puede elegir.","RAA ·"),
 st("Tengo la hipótesis ¬α→¬(β→γ). ¿Qué pruebo para usarla?","¬α, su antecedente","β→γ","E→ necesita el antecedente."),
 st("Probar ¬α: ¿regla?","I¬: supongo α, busco ⊥","RAA","La meta empieza con ¬: I¬.","I¬ ·"),
 st("Con α, ¿cómo llego a ⊥?","I∨ da α∨(β∧¬γ); E¬ con su negación","E→","Tengo ¬(α∨(β∧¬γ)): armo la disyunción desde α.","I∨ ·"),
 st("Con ¬α y la hipótesis, E→ me da…","¬(β→γ)","β→γ","Es el consecuente de la hipótesis."),
 st("Para usar ¬(β→γ) pruebo…","β→γ, y obtengo ⊥ con E¬","β∧¬γ","E¬ junta β→γ con su negación."),
 st("Probar β→γ: ¿regla?","I→: supongo β, busco γ","RAA","La meta es una implicación: I→.","I→ ·"),
 st("γ es atómica y no está. ¿Qué uso?","RAA: supongo ¬γ","I∨","Es el caso de meta atómica sin salida directa.","RAA ·"),
 st("Con β y ¬γ armo…","β∧¬γ por I∧, luego α∨(β∧¬γ) por I∨; E¬ con ¬(α∨(β∧¬γ)) da ⊥","E→","Esta vez sí puedo elegir el lado: tengo β∧¬γ.","I∧ · I∨ ·"),
 st("El RAA interno cancela…","¬γ","¬(α∨(β∧¬γ))","Cancela su propia suposición."),
 st("El RAA externo cancela…","¬(α∨(β∧¬γ))","¬α","Cancela la suposición que abrió el camino."),
 st("El último I→ cancela…","¬α→¬(β→γ)","α∨(β∧¬γ)","Cancela el antecedente de la meta original.")
],"I→; RAA; I¬ (¬α); E→; I→ + RAA (β→γ); E¬; cierre"),
sw("lg","Patrones: qué hago cuando…",null,[
 st("Meta (∀x)Q(x) y ninguna hipótesis nombra Q.","Busco ⊥ y uso E⊥ + I∀","Busco una instancia Q(a)","Sin Q en las hipótesis, solo una contradicción prueba Q."),
 st("Tengo (∃x)R(x,x) y la meta es otra fórmula.","E∃ primero: supongo R(x,x)","I∃ de entrada","El ∃ de las hipótesis se abre para trabajar con su testigo."),
 st("Meta (∃x)P(x,x) sin testigo a la vista.","Primero consigo P(t,t), después I∃","I∃ con cualquier t","I∃ necesita P(t,t) ya probado."),
 st("Tengo A∨B y la meta es ⊥ o una fórmula.","E∨: la misma meta en cada rama","E∧","Una disyunción se usa por casos."),
 st("Meta A∨B y no sé cuál lado vale.","RAA suponiendo ¬(A∨B)","I∨ con A","I∨ solo si ya sé cuál lado se prueba."),
 st("Meta ¬(β→γ).","I¬: supongo β→γ y busco ⊥","I→ suponiendo β","La meta empieza con ¬."),
 st("Meta β→γ, con γ atómica.","I→ suponiendo β; si γ no sale, RAA con ¬γ","I¬","La meta es una implicación."),
 st("Meta φ↔ψ.","I↔: pruebo φ→ψ y ψ→φ por separado","I∧","↔ se arma con dos implicaciones."),
 st("Tengo φ y ¬φ en algún punto.","E¬ da ⊥, y E⊥ da cualquier meta","I∧","Una contradicción vale para cualquier meta."),
 st("Tengo ∀xP(x) y necesito P(t).","E∀ con el t que encaja con otra fórmula que tengo","E∀ con cualquier t","Elijo el t que haga coincidir las fórmulas.")
])
);
/* ===== Lógica: examen febrero 2026, ejercicio 3 ===== */
SWC.push(
sw("lg","Febrero 3a (RAA dentro de I→)","Examen feb 2026 · 3a\nMeta: ⊢ ((p→q)∧(¬r→p))→(¬q→r)",[
 Object.assign(st("Meta A→B: ¿qué hago?","I→, supongo (p→q)∧(¬r→p)","I→, supongo ¬q→r","I→ supone el antecedente de la meta.","I→ ·"),{x:"Tengo: nada\nMeta: ((p→q)∧(¬r→p))→(¬q→r)"}),
 Object.assign(st("Nueva meta ¬q→r. ¿Qué hago?","I→, supongo ¬q","I¬, supongo q","Es una implicación: otro I→.","I→ ·"),{x:"Supuesto: (p→q)∧(¬r→p)\nMeta: ¬q→r"}),
 Object.assign(st("Meta r: atómica. ¿Sale eliminando hipótesis?","No: r no es consecuente de nada; uso RAA","Sí: E→ sobre ¬r→p","¬r→p da p, no r. Sin camino directo: RAA.","RAA ·"),{x:"Supuestos: (p→q)∧(¬r→p), ¬q\nMeta: r"}),
 Object.assign(st("¿Qué supongo para RAA?","¬r","r","RAA supone la negación de la meta.","supongo ¬r"),{x:"Supuestos: (p→q)∧(¬r→p), ¬q\nMeta: r (con RAA)"}),
 Object.assign(st("Meta ⊥. ¿Qué par fórmula/negación busco?","q y ¬q: ¬q ya lo tengo","r y ¬r","q sale de las hipótesis; r no.","busco q"),{x:"Supuestos: (p→q)∧(¬r→p), ¬q, ¬r\nMeta: ⊥"}),
 Object.assign(st("¿Cómo saco p?","E∧ da ¬r→p; E→ con ¬r","E∧ da p→q; E→ con q","¬r está supuesto: es justo el antecedente.","E∧, E→ ·"),{x:"Supuestos: (p→q)∧(¬r→p), ¬q, ¬r\nMeta: q (para chocar con ¬q)"}),
 Object.assign(st("Tengo p. ¿Cómo saco q?","E∧ da p→q; E→ con p","I→ con p","Modus ponens con la otra mitad de la conjunción.","E∧, E→ ·"),{x:"Tengo: p, ¬q, (p→q)∧(¬r→p)\nMeta: q"}),
 Object.assign(st("Tengo q y ¬q.","E¬ da ⊥","E⊥ da ⊥","E¬ junta fórmula y negación; E⊥ parte de ⊥.","E¬"),{x:"Tengo: q, ¬q\nMeta: ⊥"}),
 Object.assign(st("Orden de cierre, de adentro hacia afuera","RAA cancela ¬r; I→ cancela ¬q; I→ cancela la conjunción","I→ cancela la conjunción primero","Cada regla cancela su propia suposición, de la más reciente a la más vieja.",""),{x:"Llegué a ⊥ con supuestos: (p→q)∧(¬r→p), ¬q, ¬r"})
],"I→(1), I→(2), RAA(3): q por E∧+E→ (con p de E∧+E→ y [¬r]), E¬ con [¬q]"),
sw("lg","Febrero 3b (∃ con igualdad)","Examen feb 2026 · 3b\nTengo: φ1 = (∀x)f(g(x)) =′ g(f(x)), φ2 = (∀y)(P(y)→h(y) =′ g(y)), φ3 = (∃z)P(z)\nMeta: (∃w)f(h(w)) =′ g(f(w))",[
 Object.assign(st("¿Puedo hacer I∃ directo?","No: no tengo f(h(t)) =′ g(f(t)) para ningún t","Sí, con t = z","I∃ pide ya tener probada la instancia.",""),{x:"Tengo: φ1 = (∀x)f(g(x)) =′ g(f(x)), φ2 = (∀y)(P(y)→h(y) =′ g(y)), φ3 = (∃z)P(z)\nMeta: (∃w)f(h(w)) =′ g(f(w))"}),
 Object.assign(st("¿Qué desarmo primero?","φ3 = (∃z)P(z), con E∃","φ1, con E∀","El ∃ da el testigo z con el que instancio φ1 y φ2.","E∃ ·"),{x:"Tengo: φ1 = (∀x)f(g(x)) =′ g(f(x)), φ2 = (∀y)(P(y)→h(y) =′ g(y)), φ3 = (∃z)P(z)\nMeta: (∃w)f(h(w)) =′ g(f(w))"}),
 Object.assign(st("¿Qué supongo?","P(z), con z que no esté libre en φ1, φ2 ni en la meta","P(a), con a constante","E∃ supone la fórmula con una variable nueva.","supongo P(z)"),{x:"Abro E∃ sobre (∃z)P(z)\nMeta: (∃w)f(h(w)) =′ g(f(w))"}),
 Object.assign(st("¿Cómo uso φ2?","E∀ con z, y E→ con [P(z)]","E→ directo sobre φ2","φ2 empieza con ∀: primero se instancia.","E∀, E→ ·"),{x:"Supuesto: P(z)\nTengo: φ2 = (∀y)(P(y)→h(y) =′ g(y))\nMeta: (∃w)f(h(w)) =′ g(f(w))"}),
 Object.assign(st("Quiero cambiar g(z) por h(z) dentro de f(g(z)). Tengo h(z) =′ g(z).","RI2: la doy vuelta a g(z) =′ h(z)","RI4 directo con h(z) =′ g(z)","RI4 reemplaza el término de la izquierda por el de la derecha: g(z) tiene que quedar a la izquierda.","RI2 ·"),{x:"Tengo: h(z) =′ g(z)\nMeta: f(h(z)) =′ g(f(z))"}),
 Object.assign(st("¿De dónde saco f(g(z)) =′ g(f(z))?","E∀ en φ1 con x := z","E∀ en φ1 con x := h(z)","Con h(z) saldría f(g(h(z))), que no sirve.","E∀ z ·"),{x:"Tengo: g(z) =′ h(z), φ1 = (∀x)f(g(x)) =′ g(f(x))\nMeta: f(h(z)) =′ g(f(z))"}),
 Object.assign(st("RI4 con g(z) =′ h(z) sobre f(u) =′ g(f(z)) da…","f(h(z)) =′ g(f(z))","f(h(z)) =′ h(f(z))","Solo se reemplaza el lugar marcado con u; g(f(z)) no es g(z).","RI4 ·"),{x:"Tengo: g(z) =′ h(z), f(g(z)) =′ g(f(z))\nMeta: f(h(z)) =′ g(f(z))"}),
 Object.assign(st("¿Cómo llego a (∃w)f(h(w)) =′ g(f(w))?","I∃ con t = z","I∀","La meta es un ∃ y z es su testigo.","I∃ ·"),{x:"Tengo: f(h(z)) =′ g(f(z))\nMeta: (∃w)f(h(w)) =′ g(f(w))"}),
 Object.assign(st("Al cerrar E∃, ¿qué hipótesis queda entre corchetes [ ]ⁿ?","P(z), la suposición","(∃z)P(z), la premisa","φ3 sigue abierta en Γ; se cancela la suposición del testigo.","cancelo P(z)"),{x:"Derivé (∃w)f(h(w)) =′ g(f(w)) bajo el supuesto P(z)"}),
 Object.assign(st("Condición (∗) de E∃","z ∉ FV de la meta, ni de φ1 ni de φ2","z libre para w","La z supuesta no puede escapar a la conclusión ni estar en otra hipótesis abierta.",""),{x:"Cierro E∃ sobre (∃z)P(z)\nHipótesis abiertas: φ1, φ2"})
],"E∃ sobre φ3 con [P(z)]: E∀+E→ en φ2, RI2, E∀ en φ1, RI4, I∃"));
/* Contexto propio de cada paso (Tengo / Meta en ese punto): cada tarjeta se entiende sola */
const LGX={
"Meta →":[0,0,"Tengo: φ→σ, σ→ψ y el supuesto φ (de I→)\nMeta original: φ→ψ","Tengo: φ→σ, σ→ψ, supuesto φ\nMeta: ψ","Derivé ψ bajo el supuesto φ\nMeta original: φ→ψ (con I→)"],
"Meta ¬":[0,0,"Tengo: φ→ψ, ¬ψ y el supuesto φ (de I¬)\nMeta original: ¬φ","Tengo: φ→ψ, ¬ψ, supuesto φ\nMeta: ⊥","Derivé ⊥ bajo el supuesto φ\nMeta original: ¬φ (con I¬)"],
"Meta atómica (RAA)":[0,0,0,0,"Tengo: ¬¬φ y el supuesto ¬φ (de RAA)\nMeta: ⊥"],
"Meta ∀":[0,0,"Tengo: ∀x(P(x)∧Q(x))\nMeta tras I∀: P(x), con x arbitraria","Cierro con I∀ hacia ∀xP(x)\nHipótesis abierta: ∀x(P(x)∧Q(x))"],
"Usar ∃":[0,"Tengo: ∃xP(x), ∀x(P(x)→Q(x))\nMeta: ∃xQ(x)\nTodavía no tengo nada de la forma Q(…)","Abro E∃ sobre ∃xP(x)\nMeta: ∃xQ(x)","Supuesto: P(x) (x nueva, de E∃)\nTengo además: ∀x(P(x)→Q(x))","Supuesto: P(x)\nTengo: ∀x(P(x)→Q(x))\nMeta: ∃xQ(x)","Tengo: P(x), P(x)→Q(x) (por E∀)\nMeta: ∃xQ(x)","Tengo: Q(x) (por E→)\nMeta: ∃xQ(x)","Llegué a ∃xQ(x) bajo el supuesto P(x)\nPremisa del E∃: ∃xP(x)","Cierro E∃ sobre ∃xP(x) con conclusión ∃xQ(x)\nHipótesis abierta: ∀x(P(x)→Q(x))"],
"Combinar 2c (∀ desde contradicción)":[0,"Tengo: ψ, (∀x)¬P(x)\nMeta: (∀x)Q(x), armo con I∀","Tengo: ψ, (∀x)¬P(x)\nMeta: Q(x), con x arbitraria","Tengo: ψ, (∀x)¬P(x)\nMeta: Q(x), con x arbitraria","Tengo: ψ, (∀x)¬P(x)\nMeta: ⊥ (de ahí saldrá Q(x) con E⊥)","Tengo: ψ = (∀x)P(f(x))∧(∃z)¬P(z), (∀x)¬P(x)\nMeta: ⊥ (E¬: busco una fórmula y su negación)","Tengo: ψ = (∀x)P(f(x))∧(∃z)¬P(z), (∀x)¬P(x)\nMeta: ⊥ (E¬: busco una fórmula y su negación)","Tengo: ψ = (∀x)P(f(x))∧(∃z)¬P(z), (∀x)¬P(x)\nMeta: ⊥ (E¬: busco una fórmula y su negación)","Tengo: ψ = (∀x)P(f(x))∧(∃z)¬P(z), (∀x)¬P(x)\nMeta: ⊥ (por E¬ necesito P(f(x)) y ¬P(f(x)))","Tengo: (∀x)P(f(x)) (salió de ψ por E∧), (∀x)¬P(x)\nMeta: ⊥","Tengo: P(f(x)), (∀x)¬P(x)\nMeta: ⊥","Tengo: P(f(x)), (∀x)¬P(x)\nQuiero instanciar con t = f(x)","Tengo: P(f(x)), ¬P(f(x))\nMeta: ⊥, y después Q(x)","Tengo: Q(x) (por E⊥)\nMeta: (∀x)Q(x), cierro con I∀\nHipótesis abiertas: ψ, (∀x)¬P(x)"],
"Combinar 3b (∃ en hipótesis y en meta)":[0,0,"Tengo: (∃x)R(x,x), (∀x)(∀y)(∀z)(R(x,y)∧R(x,z)→P(y,z))\nMeta: (∃x)P(x,x)\nAbro E∃ sobre (∃x)R(x,x)","Supuesto: R(x,x), x nueva (de E∃)\nTengo además: la ∀∀∀\nMeta: (∃x)P(x,x)","Supuesto: R(x,x)\nTengo: (∀x)(∀y)(∀z)(R(x,y)∧R(x,z)→P(y,z))\nMeta: (∃x)P(x,x)","Supuesto: R(x,x)\nTengo: (∀x)(∀y)(∀z)(R(x,y)∧R(x,z)→P(y,z))\nMeta: (∃x)P(x,x)","Tengo: R(x,x) y R(x,x)∧R(x,x)→P(x,x)\nMeta: (∃x)P(x,x)","Tengo: R(x,x)∧R(x,x) y R(x,x)∧R(x,x)→P(x,x)\nMeta: (∃x)P(x,x)","Tengo: P(x,x)\nMeta: (∃x)P(x,x)","Derivé (∃x)P(x,x) bajo el supuesto R(x,x)\nPremisa del E∃: (∃x)R(x,x)","Cierro E∃ sobre (∃x)R(x,x) con conclusión (∃x)P(x,x)\nHipótesis abierta: la ∀∀∀"],
"Combinar 3a → (casos y contradicción)":[0,"Supuesto: α∨(β∧¬γ)\nMeta: ¬α→¬(β→γ)","Supuestos: α∨(β∧¬γ), ¬α\nMeta: ¬(β→γ)","Supuestos: α∨(β∧¬γ), ¬α, β→γ\nMeta: ⊥","Abro E∨ sobre α∨(β∧¬γ)\nSupuestos: ¬α, β→γ\nMeta: ⊥","Rama α. Supuestos: α, ¬α, β→γ\nMeta: ⊥","Rama β∧¬γ. Supuestos: β∧¬γ, ¬α, β→γ\nMeta: ⊥","Rama β∧¬γ. Tengo: β, ¬γ, β→γ\nMeta: ⊥","Rama β∧¬γ. Tengo: γ, ¬γ\nMeta: ⊥","Las dos ramas llegaron a ⊥ (E∨ sobre α∨(β∧¬γ))\nCierro E∨","Llegué a ⊥ con supuestos: α∨(β∧¬γ), ¬α, β→γ\nMeta original: ⊢ (α∨(β∧¬γ))→(¬α→¬(β→γ))"],
"Combinar 3a ← (cuando no sé qué disyunto)":[0,"Supuesto: ¬α→¬(β→γ)\nMeta: α∨(β∧¬γ)","Supuesto: ¬α→¬(β→γ)\nMeta: α∨(β∧¬γ)","Supuestos: ¬α→¬(β→γ), ¬(α∨(β∧¬γ)) (de RAA)\nMeta: ⊥","Supuestos: ¬α→¬(β→γ), ¬(α∨(β∧¬γ))\nMeta: ¬α (para usar E→ con la hipótesis)","Supuestos: ¬α→¬(β→γ), ¬(α∨(β∧¬γ)), α (de I¬)\nMeta: ⊥","Tengo: ¬α→¬(β→γ), ¬α\nMeta: ⊥ (¬α ya probado)","Tengo: ¬(β→γ), ¬(α∨(β∧¬γ))\nMeta: ⊥","Tengo: ¬(β→γ), ¬(α∨(β∧¬γ))\nMeta: β→γ (para E¬ con ¬(β→γ))","Supuestos: …, ¬(β→γ), β (de I→)\nMeta: γ","Supuestos: …, β, ¬γ (de RAA)\nMeta: ⊥","Probé ⊥ bajo el supuesto ¬γ\nMeta del bloque: γ","Probé ⊥ bajo el supuesto ¬(α∨(β∧¬γ))\nMeta del bloque: α∨(β∧¬γ)","Derivé α∨(β∧¬γ) bajo ¬α→¬(β→γ)\nMeta original: ⊢ (¬α→¬(β→γ))→(α∨(β∧¬γ))"]
};
SWC.push(
sw("lg","Usar ∀","Tengo: ∀x(P(x)→Q(x)), P(a)\nMeta: Q(a)",[
 st("¿Armo o desarmo?","Desarmo: la hipótesis es ∀","Armo con I∀","La meta Q(a) es atómica y sale de eliminar."),
 st("¿Qué regla?","E∀","I∀","E∀ instancia un ∀ con un término."),
 st("¿Qué término uso?","a, el que pide la meta","Una variable nueva","Se elige el término que sirve: a."),
 st("¿Debe ser a libre para x?","Sí","No","Si no, a quedaría capturada por un cuantificador."),
 st("Tras E∀ tengo P(a)→Q(a). ¿Qué hago?","E→ con P(a)","I→","Con el antecedente P(a) alcanza.")])
);
const LGR={"Meta ∧":[0,0,"I∧"],"Meta →":[0,"I→","I→","I→","I→"],"Meta ¬":[0,"I¬","I¬","I¬","I¬"],"Meta atómica (RAA)":[0,0,0,"RAA","RAA"],"Meta ∨":[0,"I∨","I∨"],"Meta ∨ sin hipótesis":[0,0,0,"RAA"],"Meta ∀":[0,"I∀","I∀","I∀"],"Meta ∃":[0,"I∃","I∃"],"Meta ↔":[0,"I↔"],"Usar ∧":[0,"E∧","E∧"],"Usar →":[0,"E→","E→"],"Usar ∨":[0,"E∨","E∨","E∨"],"Usar ∃":[0,0,"E∃","E∃","E∃","E∃","E∃","E∃","E∃"],"Usar ∀":[0,"E∀","E∀","E∀"]};
/* ---- Árboles de las cadenas de Lógica (se asignan por título) ---- */
const N=(f,at,r,ra,k,o)=>({f,at,r,ra,k:k||[],o:o||{}});
const TRS={
"Meta ∧":N("φ∧ψ",0,"I∧",2,[N("φ",3),N("ψ",3)]),
"Meta →":N("φ→ψ",0,"I→",1,[N("ψ",3,"E→",4,[N("σ",4,"E→",4,[N("φ",4,0,0,0,{c:1,ca:5}),N("φ→σ",4)]),N("σ→ψ",4)])],{c:1,ca:5}),
"Meta ¬":N("¬φ",0,"I¬",1,[N("⊥",3,"E¬",4,[N("ψ",4,"E→",4,[N("φ",4,0,0,0,{c:1,ca:5}),N("φ→ψ",4)]),N("¬ψ",4)])],{c:1,ca:5}),
"Meta atómica (RAA)":N("φ",0,"RAA",3,[N("⊥",4,"E¬",5,[N("¬φ",5,0,0,0,{c:1,ca:5}),N("¬¬φ",5)])],{c:1,ca:5}),
"Meta ∨":N("φ∨ψ",0,"I∨",1,[N("φ",2)]),
"Meta ∨ sin hipótesis":N("φ∨¬φ",0,"RAA",3,[N("⊥",4,0,0,0,{open:1})]),
"Meta ∀":N("∀xP(x)",0,"I∀",1,[N("P(x)",3,"E∧",3,[N("P(x)∧Q(x)",3,"E∀",3,[N("∀x(P(x)∧Q(x))",3)])])]),
"Meta ∃":N("∃xP(x)",0,"I∃",1,[N("P(a)",2)]),
"Meta ↔":N("φ↔ψ",0,"I↔",1,[N("φ→ψ",2),N("ψ→φ",2)]),
"Meta ⊥":N("⊥",0,"E¬",1,[N("φ",2),N("¬φ",2)]),
"Usar ∧":N("ψ",0,"E∧",2,[N("φ∧ψ",2)]),
"Usar →":N("ψ",0,"E→",1,[N("φ→ψ",1),N("φ",2,0,0,0,{open:1})]),
"Usar ∨":N("χ",0,"E∨",1,[N("φ∨ψ",1),N("χ",3,"E→",3,[N("φ",3,0,0,0,{c:1,ca:4}),N("φ→χ",3)]),N("χ",3,"E→",3,[N("ψ",3,0,0,0,{c:2,ca:4}),N("ψ→χ",3)])],{c:"1,2",ca:4}),
"Usar ∃":N("∃xQ(x)",0,"E∃",2,[N("∃xP(x)",2),N("∃xQ(x)",2,"I∃",7,[N("Q(x)",3,"E→",6,[N("P(x)",3,0,0,0,{c:1,ca:8}),N("P(x)→Q(x)",5,"E∀",5,[N("∀x(P(x)→Q(x))",5)])],{fa:6})])],{c:1,ca:8}),
"Febrero 3a (RAA dentro de I→)":N("((p→q)∧(¬r→p))→(¬q→r)",0,"I→",1,[N("¬q→r",1,"I→",2,[N("r",2,"RAA",3,[N("⊥",4,"E¬",8,[N("q",5,"E→",7,[N("p→q",7,"E∧",7,[N("(p→q)∧(¬r→p)",7,0,0,0,{c:1,ca:9})]),N("p",6,"E→",6,[N("¬r→p",6,"E∧",6,[N("(p→q)∧(¬r→p)",6,0,0,0,{c:1,ca:9})]),N("¬r",6,0,0,0,{c:3,ca:9})])]),N("¬q",5,0,0,0,{c:2,ca:9})])],{c:3,ca:9})],{c:2,ca:9})],{c:1,ca:9}),
"Febrero 3b (∃ con igualdad)":N("(∃w)f(h(w)) =′ g(f(w))",0,"E∃",2,[N("(∃z)P(z)",2),N("(∃w)f(h(w)) =′ g(f(w))",2,"I∃",8,[N("f(h(z)) =′ g(f(z))",4,"RI4",7,[N("g(z) =′ h(z)",5,"RI2",5,[N("h(z) =′ g(z)",4,"E→",4,[N("P(z)→h(z) =′ g(z)",4,"E∀",4,[N("(∀y)(P(y)→h(y) =′ g(y))",4)]),N("P(z)",4,0,0,0,{c:1,ca:9})])]),N("f(g(z)) =′ g(f(z))",6,"E∀",6,[N("(∀x)f(g(x)) =′ g(f(x))",6)])],{fa:7})])],{c:1,ca:9}),
"Combinar 2c (∀ desde contradicción)":N("(∀x)Q(x)",0,"I∀",1,[N("Q(x)",2,"E⊥",4,[N("⊥",4,"E¬",5,[N("P(f(x))",5,"E∀",10,[N("(∀x)P(f(x))",9,"E∧",9,[N("(∀x)P(f(x))∧(∃z)¬P(z)",9)])],{fa:8}),N("¬P(f(x))",5,"E∀",11,[N("(∀x)¬P(x)",11)],{fa:8})])])]),
"Combinar 3b (∃ en hipótesis y en meta)":N("(∃x)P(x,x)",0,"E∃",2,[N("(∃x)R(x,x)",2),N("(∃x)P(x,x)",4,"I∃",9,[N("P(x,x)",6,"E→",8,[N("R(x,x)∧R(x,x)",7,"I∧",7,[N("R(x,x)",7,0,0,0,{c:1,ca:10}),N("R(x,x)",7,0,0,0,{c:1,ca:10})]),N("R(x,x)∧R(x,x)→P(x,x)",6,"E∀",6,[N("(∀z)(R(x,x)∧R(x,z)→P(x,z))",6,"E∀",6,[N("(∀y)(∀z)(R(x,y)∧R(x,z)→P(y,z))",6,"E∀",6,[N("(∀x)(∀y)(∀z)(R(x,y)∧R(x,z)→P(y,z))",6)])])])])])],{c:1,ca:10}),
"Combinar 3a → (casos y contradicción)":N("(α∨(β∧¬γ))→(¬α→¬(β→γ))",0,"I→",1,[N("¬α→¬(β→γ)",1,"I→",2,[N("¬(β→γ)",2,"I¬",3,[N("⊥",3,"E∨",4,[N("α∨(β∧¬γ)",4,0,0,0,{c:3,ca:11}),N("⊥",5,"E¬",6,[N("α",6,0,0,0,{c:4,ca:10}),N("¬α",6,0,0,0,{c:2,ca:11})]),N("⊥",5,"E¬",9,[N("γ",8,"E→",8,[N("β",7,"E∧",7,[N("β∧¬γ",7,0,0,0,{c:5,ca:10})]),N("β→γ",8,0,0,0,{c:1,ca:11})]),N("¬γ",7,"E∧",7,[N("β∧¬γ",7,0,0,0,{c:5,ca:10})])])],{c:"4,5",ca:10})],{c:1,ca:11})],{c:2,ca:11})],{c:3,ca:11}),
"Combinar 3a ← (cuando no sé qué disyunto)":N("(¬α→¬(β→γ))→(α∨(β∧¬γ))",0,"I→",1,[N("α∨(β∧¬γ)",1,"RAA",3,[N("⊥",3,"E¬",8,[N("β→γ",8,"I→",9,[N("γ",9,"RAA",10,[N("⊥",10,"E¬",11,[N("α∨(β∧¬γ)",11,"I∨",11,[N("β∧¬γ",11,"I∧",11,[N("β",11,0,0,0,{c:4,ca:14}),N("¬γ",11,0,0,0,{c:5,ca:12})])]),N("¬(α∨(β∧¬γ))",11,0,0,0,{c:2,ca:13})])],{c:5,ca:12})],{c:4,ca:14}),N("¬(β→γ)",4,"E→",7,[N("¬α",4,"I¬",5,[N("⊥",5,"E¬",6,[N("α∨(β∧¬γ)",6,"I∨",6,[N("α",6,0,0,0,{c:3,ca:14})]),N("¬(α∨(β∧¬γ))",6,0,0,0,{c:2,ca:13})])],{c:3,ca:14}),N("¬α→¬(β→γ)",4,0,0,0,{c:1,ca:14})],{fa:7})])],{c:2,ca:13})],{c:1,ca:14})};
function lgApply(){
SWC.forEach(c=>{const m=c.s=="lg"&&LGX[c.g];if(m)c.steps.forEach((s,i)=>{if(m[i])s.x=m[i]})});
SWC.forEach(c=>{const m=c.s=="lg"&&LGR[c.g];if(m)c.steps.forEach((s,i)=>{if(m[i])s.x=(s.x||c.ctx)+"\nRegla elegida: "+m[i]})});
SWC.forEach(c=>{if(c.s=="lg"&&TRS[c.g])c.tr=TRS[c.g]});
}

/* ===== Series armadas desde la exportación de errores del 5/11 (confusión E→/I→ y condiciones de cuantificadores) ===== */
SWC.push(
sw("lg","→: ¿uso o armo?",null,[
 Object.assign(st("¿Qué regla?","E→","I→","La → está en lo que TENGO: la uso (elimino)."),{x:"Tengo: φ→ψ, φ\nMeta: ψ"}),
 Object.assign(st("¿Qué regla?","I→, supongo φ","E→","La → está en la META: la armo (introduzco)."),{x:"Tengo: ψ\nMeta: φ→ψ"}),
 Object.assign(st("¿Qué regla?","E→, obtengo P(x,x)","I→","La → está en lo que tengo y ya probé su antecedente."),{x:"Tengo: R(x,x)∧R(x,x)→P(x,x), R(x,x)∧R(x,x)\nMeta: P(x,x)"}),
 Object.assign(st("¿Qué regla?","E→","I→","¬r→p está en lo que tengo y ¬r es su antecedente."),{x:"Tengo: ¬r→p, ¬r\nMeta: p"}),
 Object.assign(st("¿Qué regla?","I→, supongo ¬q","E→ con ¬q","La meta es una implicación: se arma."),{x:"Tengo: (p→q)∧(¬r→p)\nMeta: ¬q→r"}),
 st("¿Cómo decido entre E→ e I→?","→ en lo que tengo: E→. → en la meta: I→","Si aparece una →, I→","Introducción arma la meta; eliminación usa una hipótesis.")
]),
sw("lg","Condiciones: ¿cuál va con qué regla?",null,[
 st("E∃ (cierro con la suposición [P(x)]). Condición:","x ∉ FV de la conclusión ni de las hipótesis abiertas","t libre para x","E∃ no sustituye ningún término: pide que la x supuesta no escape."),
 st("I∃ (de P(t) a ∃xP(x)). Condición:","t libre para x","x ∉ FV de las hipótesis abiertas","I∃ pone un término en lugar de x: no tiene que quedar capturado."),
 st("I∀ (de P(x) a ∀xP(x)). Condición:","x ∉ FV de las hipótesis abiertas","t libre para x","Generalizar exige que x sea arbitraria."),
 st("E∀ (de ∀xP(x) a P(t)). Condición:","t libre para x","x ∉ FV de las hipótesis abiertas","E∀ sustituye x por t: no tiene que quedar capturado."),
 st("Regla para acordarse","I∀ y E∃ piden x no libre; E∀ e I∃ piden t libre para x","Todas piden t libre para x","Las que trabajan con una variable genérica piden x no libre; las que meten un término piden t libre."),
 Object.assign(st("Al cerrar E∃, ¿qué va entre corchetes [ ]ⁿ?","R(x,x), la suposición","(∃x)R(x,x), la premisa","La premisa con ∃ queda abierta; se cancela la suposición del testigo."),{x:"Premisa: (∃x)R(x,x)\nSupuse R(x,x) y llegué a (∃x)P(x,x)"})
]));

/* ===== Desde errores del 6/11: teoría previa (th) para los «No sé» y contrastes ===== */
SWC.push(
sw("lg","Leer una derivación",null,[{"q": "¿Dónde está la conclusión?", "a": "Abajo, en la raíz", "b": "Arriba, en las hojas", "w": "El árbol baja de las hojas a la raíz.", "th": "Una derivación es un árbol: arriba las hojas (hipótesis), abajo la conclusión (la raíz)."}, {"q": "[φ]¹ en una hoja significa…", "a": "φ fue supuesta y la canceló la regla marcada 1", "b": "φ es una premisa del ejercicio", "w": "Las premisas no llevan corchetes.", "th": "Una hoja entre corchetes [φ]ⁿ fue supuesta y después la canceló la regla n. Una hoja sin corchetes sigue abierta."}, {"q": "En Γ ⊢ ρ, ¿qué es Γ?", "a": "Las hojas sin cancelar", "b": "Las hojas canceladas", "w": "Las canceladas ya no cuentan.", "th": "En Γ ⊢ ρ: Γ son las hojas abiertas (sin corchetes) y ρ es la raíz."}, {"q": "¿Qué es ρ?", "a": "La fórmula de abajo, la raíz", "b": "La última hipótesis", "w": "ρ es lo que se probó."}, {"q": "⊢ ρ (un teorema) significa que…", "a": "todas las hojas están canceladas: Γ vacío", "b": "no hay hojas", "w": "Hojas hay; ninguna queda abierta."}].map(o=>Object.assign(st(o.q,o.a,o.b,o.w),o.th?{th:o.th}:{},o.x?{x:o.x}:{}))),
sw("lg","Quién cancela qué",null,[{"q": "Abro I→ (supongo A) y adentro RAA (supongo ¬B). ¿Qué se cierra primero?", "a": "RAA, que cancela ¬B", "b": "I→, que cancela A", "w": "Como paréntesis: se cierra primero el último que se abrió.", "th": "Cada regla que supone algo (I→, I¬, RAA, E∨, E∃) abre un bloque y lo cierra cancelando SU propia suposición. Se cierran del más nuevo al más viejo, como paréntesis."}, {"q": "El RAA interno (supuse ¬γ para probar γ) cancela…", "a": "¬γ", "b": "¬(α∨(β∧¬γ)), la del RAA de afuera", "w": "Cada RAA cancela la suposición que hizo él."}, {"q": "I¬ para probar ¬(β→γ) cancela…", "a": "β→γ", "b": "¬(β→γ)", "w": "I¬ supone lo que está bajo el ¬."}, {"q": "El último I→ de ⊢ A→B cancela…", "a": "A", "b": "B", "w": "I→ cancela el antecedente que supuso."}, {"q": "E∨ sobre A∨B cancela…", "a": "A y B, una por rama", "b": "A∨B", "w": "La disyunción es premisa; se cancelan las suposiciones de cada rama."}].map(o=>Object.assign(st(o.q,o.a,o.b,o.w),o.th?{th:o.th}:{},o.x?{x:o.x}:{}))),
sw("lg","Usar ¬ y → que tengo",null,[{"q": "Tengo ¬(β→γ). Meta ⊥. ¿Qué tengo que probar?", "a": "β→γ", "b": "β∧¬γ", "w": "Para E¬ me falta justo lo que está bajo el ¬.", "th": "Una fórmula ¬φ que tengo se usa con E¬: si consigo φ, junto φ y ¬φ y obtengo ⊥."}, {"q": "Tengo ¬α→¬(β→γ). Para usarla pruebo…", "a": "¬α, el antecedente", "b": "¬(β→γ)", "w": "E→ pide el antecedente; el consecuente es lo que obtengo.", "th": "Una implicación que tengo se usa con E→: primero hay que probar su antecedente."}, {"q": "Meta β→γ, aunque estoy dentro de un RAA.", "a": "I→: supongo β, busco γ", "b": "RAA", "w": "Se mira el conector de la meta actual: →.", "th": "Siempre decidí por la meta de ESTE momento, no por la regla que abriste antes."}].map(o=>Object.assign(st(o.q,o.a,o.b,o.w),o.th?{th:o.th}:{},o.x?{x:o.x}:{}))),
sw("lg","¿Uso o armo? (∧, ∨, ¬)",null,[{"q": "Tengo φ∧ψ. Meta ψ∧φ. Primer paso.", "a": "Armar: I∧ (pruebo ψ y pruebo φ)", "b": "Desarmar: E∧ y listo", "w": "E∧ da las partes sueltas; para tenerlas juntas en otro orden hace falta I∧.", "th": "Si la meta tiene conector, primero se arma. Desarmar las hipótesis viene después, para conseguir las piezas."}, {"q": "Tengo β∧¬γ (rama de un E∨). ¿Qué hago?", "a": "E∧: saco β y ¬γ", "b": "I∧", "w": "Tengo la conjunción; la desarmo para usar sus partes."}, {"q": "Tengo A∨B. Meta ⊥.", "a": "E∨: ⊥ en cada rama", "b": "E∧", "w": "Una disyunción se usa por casos."}, {"q": "Meta A∨B y no sé qué lado vale.", "a": "RAA suponiendo ¬(A∨B)", "b": "I∨ con A", "w": "Si elijo mal el lado, quedo trabado."}, {"q": "Meta ¬(φ∧¬φ). Primer paso.", "a": "I¬: supongo φ∧¬φ", "b": "I¬: supongo φ", "w": "I¬ supone todo lo que está bajo el ¬."}, {"q": "Meta (∃x)P(x,x) y no tengo ningún P(t,t).", "a": "Primero consigo P(t,t), después I∃", "b": "I∃ ya", "w": "I∃ necesita la instancia probada."}].map(o=>Object.assign(st(o.q,o.a,o.b,o.w),o.th?{th:o.th}:{},o.x?{x:o.x}:{}))));

/* Teoría de la forma de E→ en el paso «Con ¬α y la hipótesis, E→ me da…» (pedido 9/11) */
{const c=SWC.find(c=>c.g=="Combinar 3a ← (cuando no sé qué disyunto)"),s=c&&c.steps.find(s=>s.q.startsWith("Con ¬α y la hipótesis"));if(s)s.th="E→ se escribe con dos premisas arriba de la raya: la implicación A→B y su antecedente A (acá, todo el subárbol que terminó en ¬α). Abajo de la raya va el consecuente B.";}

/* ===== Desde errores del 9/11 ===== */
SWC.push(
sw("lg","Meta nueva dentro de un RAA",null,[{"q": "Estoy dentro de un RAA. Meta nueva: β→γ.", "a": "I→: supongo β, busco γ", "b": "RAA otra vez", "w": "La meta actual tiene conector →: se arma con I→.", "th": "Cada meta nueva se decide igual, esté donde esté: ¿tiene conector? → su introducción. ¿Es atómica? → buscarla en las hipótesis; si no sale, RAA."}, {"q": "Dentro de un RAA. Meta nueva: ¬α.", "a": "I¬: supongo α, busco ⊥", "b": "RAA suponiendo ¬¬α", "w": "Empieza con ¬: I¬."}, {"q": "Dentro de un RAA. Meta nueva: α∧β.", "a": "I∧: pruebo α y β", "b": "RAA", "w": "Conector ∧: I∧."}, {"q": "Dentro de un RAA. Meta nueva: γ, atómica, y no sale de las hipótesis.", "a": "RAA: supongo ¬γ", "b": "I→", "w": "Sin conector y sin salida directa: recién ahí RAA."}].map(o=>Object.assign(st(o.q,o.a,o.b,o.w),o.th?{th:o.th}:{},o.x?{x:o.x}:{}))),
sw("lg","I¬ o RAA: qué supone cada una",null,[{"q": "Meta ¬φ. ¿Qué regla y qué supongo?", "a": "I¬, supongo φ", "b": "RAA, supongo ¬φ", "w": "La meta empieza con ¬: I¬ supone lo de adentro.", "th": "I¬ prueba ¬φ: supone φ y llega a ⊥. RAA prueba φ: supone ¬φ y llega a ⊥. Cada una cancela lo que supuso."}, {"q": "Meta φ (atómica, sin salida). ¿Qué supongo?", "a": "¬φ, con RAA", "b": "φ, con I¬", "w": "RAA supone la negación de la meta."}, {"q": "RAA cancela…", "a": "¬φ", "b": "φ", "w": "Cancela lo que supuso: la negación de la meta."}, {"q": "I¬ cancela…", "a": "φ", "b": "¬φ", "w": "Cancela lo que supuso: lo que está bajo el ¬ de la meta."}].map(o=>Object.assign(st(o.q,o.a,o.b,o.w),o.th?{th:o.th}:{},o.x?{x:o.x}:{}))));
window.THL=window.THL||[];THL.push({s:"lg",re:/Γ|hojas|raíz|corchete/,g:"Leer una derivación"},{s:"lg",re:/cancela/,g:"Quién cancela qué"},{s:"lg",re:/RAA|I¬/,g:"I¬ o RAA: qué supone cada una"},{s:"lg",re:/Condici|libre/,g:"Condiciones: ¿cuál va con qué regla?"},{s:"lg",re:/E→|I→/,g:"→: ¿uso o armo?"});
/* Teoría pegada a los pasos sobre Γ (3 «No sé» seguidos) y al arranque de «Usar ∃» */
SWC.forEach(c=>c.steps.forEach(s=>{if(/Γ/.test(s.q)&&!s.th)s.th="En una derivación, las hojas son las fórmulas de arriba. Las que tienen corchetes [ ]ⁿ fueron supuestas y canceladas; las que no, siguen abiertas. Γ ⊢ ρ: Γ = hojas abiertas, ρ = la raíz (abajo)."}));
{const c=SWC.find(c=>c.g=="Usar ∃");if(c){c.steps[0].th="I∃ arma ∃xQ(x) a partir de una instancia Q(t) que ya esté probada en el árbol.";c.steps[1].th="Con un ∃ en las hipótesis y un ∀: primero abrí el ∃ (E∃) para tener un testigo concreto; después instanciás el ∀ justo con ese testigo."}}

/* ===== Teoría por tema para el «No sé» (se muestra en la tarjeta del error) ===== */
window.THT=window.THT||[];THT.push(
{s:"lg",re:/Γ|hojas|raíz|ρ/,t:"Leer una derivación",p:["Una derivación es un árbol. Arriba están las hojas (las fórmulas de las que partís) y abajo, la raíz (lo que probaste). Cada raya horizontal es una regla, con su nombre al costado.", "Una hoja entre corchetes [φ]ⁿ fue supuesta y después cancelada por la regla que lleva el mismo número n. Una hoja sin corchetes sigue abierta: es una hipótesis de la que depende la conclusión.", "Γ ⊢ ρ se lee «de Γ se deriva ρ». Γ es el conjunto de hojas abiertas (sin corchetes) y ρ es la raíz. Si todas las hojas están canceladas, Γ es vacío y se escribe ⊢ ρ: ρ es un teorema."]},
{s:"lg",re:/cancela|corchete|\[ \]/,t:"Cancelación de suposiciones",p:["Algunas reglas permiten suponer algo provisoriamente: I→ supone el antecedente, I¬ supone lo que está bajo el ¬, RAA supone la negación de la meta, E∨ supone cada disyunto (una rama cada uno) y E∃ supone la fórmula sin el ∃.", "Al aplicar la regla, esa suposición se cancela: se le ponen corchetes y el número de la regla. Cada regla cancela SU propia suposición, nunca la de otra.", "Las suposiciones se abren y se cierran como paréntesis: la última que abriste es la primera que cerrás. Las premisas del ejercicio nunca se cancelan."]},
{s:"lg",re:/RAA|I¬/,t:"I¬ y RAA",p:["Las dos llegan a ⊥ desde una suposición, pero prueban cosas distintas.", "I¬ prueba una fórmula que EMPIEZA con ¬ (meta ¬φ): supone φ, deriva ⊥ y cancela φ.", "RAA prueba cualquier fórmula φ, típicamente atómica o una disyunción que no sabés armar: supone ¬φ, deriva ⊥ y cancela ¬φ. Es el último recurso: primero se mira si la meta tiene conector para armar."]},
{s:"lg",re:/E→|I→|antecedente|implicaci/,t:"Implicación: E→ e I→",p:["I→ ARMA una implicación que está en la meta: para probar A→B suponés A, derivás B y cancelás A.", "E→ USA una implicación que ya tenés (modus ponens): con A→B y A, obtenés B. Se dibuja con las dos premisas arriba de la raya (pueden ser subárboles enteros) y B abajo.", "Para decidir: si la → está en lo que buscás, I→; si está en lo que tenés, E→, y lo que te falta probar es su antecedente."]},
{s:"lg",re:/E∨|ramas|disyun|I∨/,t:"Disyunción: I∨ y E∨",p:["I∨ arma A∨B a partir de uno solo de los lados. Sirve cuando sabés cuál lado vale; si no lo sabés, suele convenir RAA suponiendo ¬(A∨B).", "E∨ usa una disyunción A∨B que tenés: abrís dos ramas, una suponiendo A y otra suponiendo B, y en las dos probás la MISMA fórmula C (muchas veces ⊥). Al cerrar, E∨ da C y cancela A y B; la disyunción no se cancela."]},
{s:"lg",re:/E∃|testigo/,t:"Eliminación del ∃ (E∃)",p:["Con ∃xφ(x) sabés que algo cumple φ, pero no cuál. E∃ te deja trabajar con ese «algo»: suponés φ(x) con una variable x nueva y desde ahí derivás la conclusión ψ que buscás.", "Al cerrar, E∃ da ψ y cancela la suposición φ(x). La premisa ∃xφ(x) no se cancela.", "Condición (∗): x no puede estar libre en ψ ni en otras hipótesis abiertas; la x supuesta no puede «escapar» del bloque."]},
{s:"lg",re:/I∃|∃x.*meta|Meta.*∃/,t:"Introducción del ∃ (I∃)",p:["Para probar ∃xφ(x) alcanza con un ejemplo: si ya tenés probado φ(t) para algún término t, I∃ te da ∃xφ(x).", "Primero hay que conseguir φ(t) en el árbol; I∃ es el último paso. Condición: t tiene que ser libre para x en φ (que al ponerlo no quede capturado por otro cuantificador)."]},
{s:"lg",re:/E∀|I∀|∀/,t:"Cuantificador universal: E∀ e I∀",p:["E∀ usa ∀xφ(x): podés instanciarlo con cualquier término t y obtener φ(t). Conviene elegir el t que encaje con otra fórmula que tenés. Condición: t libre para x.", "I∀ arma ∀xφ(x) si probaste φ(x) con x arbitraria. Condición (∗): x no puede estar libre en ninguna hipótesis abierta; si lo estuviera, x no sería «cualquiera»."]},
{s:"lg",re:/libre|ligad|FV|Condici/,t:"Variables libres y ligadas",p:["Una aparición de x está ligada si está dentro del alcance de un ∀x o ∃x; si no, está libre. El alcance es la fórmula que sigue al cuantificador: todo el paréntesis si lo hay, o solo la atómica siguiente.", "FV(φ) es el conjunto de variables con alguna aparición libre. Ej.: en ∀xP(x)∧Q(x), la x de Q(x) está libre.", "«t libre para x en φ»: al reemplazar x por t, ninguna variable de t queda capturada por un cuantificador de φ. Lo piden E∀ e I∃. «x ∉ FV(…)» lo piden I∀ y E∃."]},
{s:"lg",re:/⊥|E¬|E⊥|contradic/,t:"Contradicción: E¬ y E⊥",p:["E¬ produce ⊥: si tenés una fórmula φ y su negación ¬φ, juntándolas obtenés ⊥. Para usar un ¬φ que tenés, lo que te falta probar es φ.", "E⊥ parte de ⊥: de ⊥ sale cualquier fórmula. Sirve cuando la meta no tiene relación con las hipótesis pero estas son contradictorias."]},
{s:"lg",re:/=′|RI|igual/,t:"Igualdad",p:["RI1: t =′ t. RI2 (simetría): de t₁ =′ t₂ obtengo t₂ =′ t₁. RI3: transitividad.", "RI4 (sustitución): con t₁ =′ t₂ y una fórmula donde aparece t₁ en el lugar marcado, obtengo la misma fórmula con t₂ en ese lugar. Solo se reemplaza el lugar marcado, no todas las apariciones."]},
{s:"lg",re:/[Aa]rm|[Dd]esarm|[Pp]rimer paso|[Ee]strategia|conector/,t:"Estrategia: armar y desarmar",p:["Primero mirá la meta. Si tiene conector principal, se arma con su introducción (I∧, I→, I¬, I∨, I∀, I∃, I↔) y aparecen submetas más chicas.", "Si la meta es atómica: buscala en las hipótesis desarmándolas con eliminaciones (E∧, E→, E∨, E∀, E∃). Si no sale, RAA.", "Esto se repite con cada meta nueva, esté donde esté (también dentro de un RAA o de una rama)."]});

THT.unshift(
{s:"lg",re:/↔|I↔/,t:"Bicondicional: I↔",p:["φ↔ψ se arma con I↔ probando las dos implicaciones: φ→ψ y ψ→φ (cada una suele salir con I→)."]},
{s:"lg",re:/[Ll]ee|precedencia|paréntesis|Fórmula/,t:"Lectura de fórmulas",p:["Precedencia (de más fuerte a más débil): ¬ y los cuantificadores, después ∧, después ∨, después →, después ↔. φ∨ψ∧σ se lee φ∨(ψ∧σ).", "El conector principal es el que queda «afuera» de todo: es el que decide qué regla arma o desarma la fórmula."]},
{s:"lg",re:/sin hipótesis|[Pp]robar φ solo|¬φ solo|φ∨¬φ/,t:"Tercero excluido (φ∨¬φ)",p:["Sin hipótesis no se puede probar φ ni ¬φ por separado, así que I∨ directo no sirve.", "Se usa RAA: suponés ¬(φ∨¬φ) y llegás a ⊥ (con I∨ armás φ∨¬φ desde φ o desde ¬φ y chocás con la suposición)."]});
THT.push({s:"lg",re:/∧|I∧|E∧/,t:"Conjunción: I∧ y E∧",p:["I∧ arma φ∧ψ: hay que probar las dos partes, φ y ψ, por separado.", "E∧ usa una φ∧ψ que tenés: te deja quedarte con cualquiera de las dos partes. Separar una conjunción es eliminación, no introducción."]});

/* ===== «Libre en una hipótesis abierta» (pedido 9/11) ===== */
SWC.push(sw("lg","Libre en una hipótesis abierta",null,[{"q": "En el momento de aplicar una regla, ¿qué es una hipótesis abierta?", "a": "Una hoja sin corchetes: todavía cuenta", "b": "Cualquier fórmula del árbol", "w": "Las fórmulas del medio se derivan; las hojas con corchetes ya fueron canceladas.", "th": "Hipótesis abierta = una hoja (fórmula de arriba) SIN corchetes en ese momento: una premisa o una suposición todavía no cancelada. La conclusión depende de ella. Si ya tiene [ ]ⁿ, está cerrada y no cuenta."}, {"q": "¿x está libre en P(x)?", "a": "Sí: no hay ningún ∀x ni ∃x que la abarque", "b": "No", "w": "Dice algo de esa x concreta.", "th": "x libre = aparece sin un ∀x o ∃x que la abarque: la fórmula habla de ESA x. En ∀xP(x) está ligada: habla de todos."}, {"q": "¿x está libre en ∀x(P(x)∧Q(x))?", "a": "No: todo el paréntesis está bajo el ∀x", "b": "Sí: aparece x", "w": "Aparecer no alcanza: tiene que estar fuera del alcance de ∀x/∃x."}, {"q": "«x libre en una hipótesis abierta» significa…", "a": "alguna hoja sin corchetes dice algo sobre esa x concreta", "b": "x aparece en alguna fórmula del árbol", "w": "Solo cuentan las hojas abiertas, y solo si x está libre en ellas.", "th": "Juntas: alguna hoja que todavía cuenta habla de esa x en particular. Entonces x no es «cualquiera» y no se puede generalizar con I∀."}, {"q": "¿Se puede aplicar I∀?", "a": "No: P(x) está abierta y x libre en ella", "b": "Sí", "w": "Supuse «x es par»: no puedo concluir «todos son pares».", "x": "Árbol:\nP(x)        ← hoja abierta\n──── I∀\n∀xP(x)"}, {"q": "¿Se puede aplicar I∀?", "a": "Sí: P(x) ya está cancelada", "b": "No: P(x) tiene x libre", "w": "Una hoja cancelada no cuenta, aunque tenga x libre.", "x": "Árbol:\n[P(x)]¹\n──────── I→(1)\nP(x)→P(x)\n──────── I∀\n∀x(P(x)→P(x))"}, {"q": "¿Se puede aplicar I∀?", "a": "Sí: la única hoja abierta tiene x ligada", "b": "No: aparece P(x) en el medio", "w": "P(x) en el medio es derivada, no es una hoja; la hoja ∀x(P(x)∧Q(x)) tiene x ligada.", "x": "Árbol:\n∀x(P(x)∧Q(x))   ← hoja abierta\n───────── E∀\nP(x)∧Q(x)\n───────── E∧\nP(x)\n───────── I∀\n∀xP(x)"}, {"q": "¿Se puede aplicar I∀ sobre y?", "a": "No: [P(x,y)]¹ sigue abierta con y libre", "b": "Sí: y es una variable cualquiera", "w": "Mientras la suposición no se cancele, y está «atada» a ella.", "x": "Árbol:\n[P(x,y)]¹ (todavía sin cerrar)\n⋮\nQ(y)\n──── I∀ sobre y\n∀yQ(y)"}, {"q": "Receta antes de I∀", "a": "Miro las hojas sin corchetes y busco x fuera de ∀x/∃x", "b": "Miro si x aparece en la meta", "w": "Si ninguna hoja abierta tiene x libre, se puede."}].map(o=>Object.assign(st(o.q,o.a,o.b,o.w),o.th?{th:o.th}:{},o.x?{x:o.x}:{}))));
THT.unshift({s:"lg",re:/hipótesis abierta|libre en (una|alguna)|abierta.*libre|I∀ con/,t:"Libre en una hipótesis abierta",p:["Hipótesis abierta: una hoja del árbol (fórmula de arriba) SIN corchetes en ese momento. Es una premisa o una suposición todavía no cancelada, y la conclusión depende de ella. Las hojas con [ ]ⁿ ya están cerradas y no cuentan; las fórmulas del medio son derivadas, tampoco cuentan.","x libre: aparece sin un ∀x ni ∃x que la abarque, o sea, la fórmula habla de ESA x. En P(x) está libre; en ∀xP(x) o ∀x(P(x)∧Q(x)) está ligada.","Juntas: «x libre en una hipótesis abierta» = alguna hoja que todavía cuenta dice algo sobre esa x concreta. Entonces x no es cualquiera y I∀ no se puede aplicar (si supuse «x es par», no puedo concluir «todos son pares»).","Receta antes de I∀: mirá solo las hojas sin corchetes; en cada una buscá x fuera de un ∀x/∃x. Si en ninguna aparece así, I∀ vale. Ej.: [P(x)]¹ cancelada por I→ da P(x)→P(x), y ahí sí se puede generalizar."]});

/* ===== Patrones de contradicción (pedido 10/11): ∧ con → y desarmar un ∨ ===== */
SWC.push(
sw("lg","Contradicción con ∧ y →",null,[{"q": "¿Qué par va a chocar?", "a": "γ y ¬γ", "b": "β y ¬β", "w": "¬γ está adentro de la conjunción; γ sale de β→γ.", "th": "Para ⊥ hace falta una fórmula y su negación. Las partes de una conjunción son material: se separan con E∧. Si tenés A→B y conseguís A, E→ te da B. Buscá qué parte choca con qué consecuente.", "x": "Tengo: β∧¬γ, β→γ\nMeta: ⊥"}, {"q": "¿De dónde sale ¬γ?", "a": "E∧ sobre β∧¬γ", "b": "E→ sobre β→γ", "w": "¬γ es la parte derecha de la conjunción.", "x": "Tengo: β∧¬γ, β→γ\nMeta: ⊥"}, {"q": "¿De dónde sale γ?", "a": "E→ con β→γ y β", "b": "E∧ sobre β∧¬γ", "w": "γ es el consecuente de β→γ; necesitás su antecedente β.", "x": "Tengo: β∧¬γ, β→γ\nMeta: ⊥"}, {"q": "¿Y β, el antecedente?", "a": "E∧ sobre β∧¬γ (la otra parte)", "b": "Hay que suponerlo", "w": "La conjunción te da las dos partes: β también está ahí.", "x": "Tengo: β∧¬γ, β→γ\nMeta: ⊥"}, {"q": "¿Qué regla junta γ y ¬γ?", "a": "E¬", "b": "E⊥", "w": "E¬ produce ⊥ desde φ y ¬φ; E⊥ parte de ⊥.", "x": "Tengo: β∧¬γ, β→γ\nMeta: ⊥"}, {"q": "¿Qué par va a chocar?", "a": "q y ¬q", "b": "p y ¬p", "w": "¬q sale de p→¬q (con p); q sale de la conjunción.", "x": "Tengo: p∧q, p→¬q\nMeta: ⊥"}, {"q": "¿Qué par va a chocar?", "a": "r y ¬r", "b": "p y ¬p", "w": "r sale de p→r con p (de la conjunción); ¬r está en la conjunción.", "x": "Tengo: p∧¬r, p→r\nMeta: ⊥"}, {"q": "Receta con ∧ y →", "a": "Separo la ∧, uso sus partes como antecedentes de las →, y busco el choque", "b": "Junto todo con I∧", "w": "Desarmar lo que tengo (E∧, E→) hasta que aparezcan φ y ¬φ."}].map(o=>Object.assign(st(o.q,o.a,o.b,o.w),o.th?{th:o.th}:{},o.x?{x:o.x}:{}))),
sw("lg","Contradicción desarmando un ∨",null,[{"q": "¿Qué hago con p∨q?", "a": "E∨ con meta ⊥ en cada rama", "b": "E∨ con meta p", "w": "La meta de cada rama es la que tenés ahora: ⊥.", "th": "Si tenés A∨B y la meta es ⊥: E∨ con esa misma meta. Una rama supone A y otra supone B, y en CADA rama buscás la contradicción con lo que tenés. No elijas un lado como meta: el E∨ concluye lo que tenés que probar.", "x": "Tengo: p∨q, ¬p, ¬q\nMeta: ⊥"}, {"q": "Rama [p]: ¿cómo llego a ⊥?", "a": "E¬ con [p] y ¬p", "b": "E⊥", "w": "Tengo p (supuesto) y ¬p: choque directo.", "x": "Tengo: p∨q, ¬p, ¬q\nMeta: ⊥"}, {"q": "Rama [q]: ¿cómo llego a ⊥?", "a": "E¬ con [q] y ¬q", "b": "I∨", "w": "Igual que la otra rama, con q.", "x": "Tengo: p∨q, ¬p, ¬q\nMeta: ⊥"}, {"q": "¿Qué meta lleva cada rama del E∨?", "a": "⊥ en las dos", "b": "α en una y β∧¬γ en la otra", "w": "Las dos ramas prueban lo mismo: la meta actual.", "x": "Tengo: α∨(β∧¬γ), ¬α, β→γ\nMeta: ⊥"}, {"q": "Rama [α]: ¿cómo llego a ⊥?", "a": "E¬ con [α] y ¬α", "b": "RAA suponiendo ¬α", "w": "Ya tenés α y ¬α: no hace falta suponer nada.", "x": "Tengo: α∨(β∧¬γ), ¬α, β→γ\nMeta: ⊥"}, {"q": "Rama [β∧¬γ]: ¿cómo llego a ⊥?", "a": "E∧ da β y ¬γ; E→ con β→γ da γ; E¬ con γ y ¬γ", "b": "RAA suponiendo ¬(β∧¬γ)", "w": "La contradicción está adentro de la conjunción supuesta: ∧ y → (serie anterior).", "x": "Tengo: α∨(β∧¬γ), ¬α, β→γ\nMeta: ⊥"}, {"q": "Rama [p]: ¿cómo llego a ⊥?", "a": "E→ con p→r da r; E¬ con r y ¬r", "b": "E¬ con [p] y ¬p", "w": "No tenés ¬p: el choque es entre r y ¬r.", "x": "Tengo: p∨q, p→r, q→r, ¬r\nMeta: ⊥"}, {"q": "¿Cuál es la señal de que vas en círculo?", "a": "La app te pide algo que no podés armar (como ¬(β∧¬γ))", "b": "El árbol tiene muchas ramas", "w": "Deshacé hasta tu última suposición y buscá el choque con lo que ya tenés."}].map(o=>Object.assign(st(o.q,o.a,o.b,o.w),o.th?{th:o.th}:{},o.x?{x:o.x}:{}))));
THT.unshift({s:"lg",re:/chocar|par va a|el par es|Contradicción con/,t:"Buscar la contradicción",p:["Para llegar a ⊥ (E¬) hace falta una fórmula φ y su negación ¬φ. Primero mirá qué negaciones tenés o podés sacar, y después cómo conseguir su positivo.","Si tenés una conjunción, sus partes son material: separalas con E∧. Si tenés A→B y conseguís A (por ejemplo, de una conjunción), E→ te da B. Muchas veces el choque es entre el consecuente de una → y una parte de una ∧."]},{s:"lg",re:/E∨ con meta|cada rama|Contradicción desarmando/,t:"Desarmar un ∨ para llegar a ⊥",p:["Con A∨B en lo que tenés y meta ⊥: E∨ con meta ⊥. Rama 1 supone A, rama 2 supone B, y en cada una buscás la contradicción.","La meta de las ramas es la meta que tenés en ese momento, no uno de los lados. Si en una rama la app te pide algo que no podés armar, estás en un círculo: deshacé hasta tu última suposición."]});

/* Las series largas de ejercicios (Combinar…, Febrero 3a/3b) se reemplazan en Deslizar por las tarjetas «Árbol · …» de bloques.js (pedido 10/11) */
/* Pedido 10/11: en Deslizar, Lógica son SOLO las tarjetas «Árbol · …» (se agregan después, en bloques.js). Todas las series anteriores de Lógica se quitan de Deslizar;
   su contenido sigue en el código (y la teoría THT se usa en el «No sé» de Bloques). Para volver a mostrarlas, borrar esta línea. */
for(let i=SWC.length-1;i>=0;i--)if(SWC[i].s=="lg")SWC.splice(i,1);
