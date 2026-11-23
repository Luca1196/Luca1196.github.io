# Deducción natural

Teórico de Lógica · reglas de deducción natural, estrategia y cuantificadores.

## Buscar la contradicción
<!-- re: chocar|par va a|el par es|Contradicción con -->

Para llegar a ⊥ (E¬) hace falta una fórmula φ y su negación ¬φ. Primero mirá qué negaciones tenés o podés sacar, y después cómo conseguir su positivo.

Si tenés una conjunción, sus partes son material: separalas con E∧. Si tenés A→B y conseguís A (por ejemplo, de una conjunción), E→ te da B. Muchas veces el choque es entre el consecuente de una → y una parte de una ∧.

## Desarmar un ∨ para llegar a ⊥
<!-- re: E∨ con meta|cada rama|Contradicción desarmando -->

Con A∨B en lo que tenés y meta ⊥: E∨ con meta ⊥. Rama 1 supone A, rama 2 supone B, y en cada una buscás la contradicción.

La meta de las ramas es la meta que tenés en ese momento, no uno de los lados. Si en una rama la app te pide algo que no podés armar, estás en un círculo: deshacé hasta tu última suposición.

## Libre en una hipótesis abierta
<!-- re: hipótesis abierta|libre en (una|alguna)|abierta.*libre|I∀ con -->

Hipótesis abierta: una hoja del árbol (fórmula de arriba) SIN corchetes en ese momento. Es una premisa o una suposición todavía no cancelada, y la conclusión depende de ella. Las hojas con [ ]ⁿ ya están cerradas y no cuentan; las fórmulas del medio son derivadas, tampoco cuentan.

x libre: aparece sin un ∀x ni ∃x que la abarque, o sea, la fórmula habla de ESA x. En P(x) está libre; en ∀xP(x) o ∀x(P(x)∧Q(x)) está ligada.

Juntas: «x libre en una hipótesis abierta» = alguna hoja que todavía cuenta dice algo sobre esa x concreta. Entonces x no es cualquiera y I∀ no se puede aplicar (si supuse «x es par», no puedo concluir «todos son pares»).

Receta antes de I∀: mirá solo las hojas sin corchetes; en cada una buscá x fuera de un ∀x/∃x. Si en ninguna aparece así, I∀ vale. Ej.: [P(x)]¹ cancelada por I→ da P(x)→P(x), y ahí sí se puede generalizar.

## Bicondicional: I↔
<!-- re: ↔|I↔ -->

φ↔ψ se arma con I↔ probando las dos implicaciones: φ→ψ y ψ→φ (cada una suele salir con I→).

## Tercero excluido (φ∨¬φ)
<!-- re: sin hipótesis|[Pp]robar φ solo|¬φ solo|φ∨¬φ -->

Sin hipótesis no se puede probar φ ni ¬φ por separado, así que I∨ directo no sirve.

Se usa RAA: suponés ¬(φ∨¬φ) y llegás a ⊥ (con I∨ armás φ∨¬φ desde φ o desde ¬φ y chocás con la suposición).

## Leer una derivación
<!-- re: Γ|hojas|raíz|ρ -->

Una derivación es un árbol. Arriba están las hojas (las fórmulas de las que partís) y abajo, la raíz (lo que probaste). Cada raya horizontal es una regla, con su nombre al costado.

Una hoja entre corchetes [φ]ⁿ fue supuesta y después cancelada por la regla que lleva el mismo número n. Una hoja sin corchetes sigue abierta: es una hipótesis de la que depende la conclusión.

Γ ⊢ ρ se lee «de Γ se deriva ρ». Γ es el conjunto de hojas abiertas (sin corchetes) y ρ es la raíz. Si todas las hojas están canceladas, Γ es vacío y se escribe ⊢ ρ: ρ es un teorema.

## Cancelación de suposiciones
<!-- re: cancela|corchete|\[ \] -->

Algunas reglas permiten suponer algo provisoriamente: I→ supone el antecedente, I¬ supone lo que está bajo el ¬, RAA supone la negación de la meta, E∨ supone cada disyunto (una rama cada uno) y E∃ supone la fórmula sin el ∃.

Al aplicar la regla, esa suposición se cancela: se le ponen corchetes y el número de la regla. Cada regla cancela SU propia suposición, nunca la de otra.

Las suposiciones se abren y se cierran como paréntesis: la última que abriste es la primera que cerrás. Las premisas del ejercicio nunca se cancelan.

## I¬ y RAA
<!-- re: RAA|I¬ -->

Las dos llegan a ⊥ desde una suposición, pero prueban cosas distintas.

I¬ prueba una fórmula que EMPIEZA con ¬ (meta ¬φ): supone φ, deriva ⊥ y cancela φ.

RAA prueba cualquier fórmula φ, típicamente atómica o una disyunción que no sabés armar: supone ¬φ, deriva ⊥ y cancela ¬φ. Es el último recurso: primero se mira si la meta tiene conector para armar.

## Implicación: E→ e I→
<!-- re: E→|I→|antecedente|implicaci -->

I→ ARMA una implicación que está en la meta: para probar A→B suponés A, derivás B y cancelás A.

E→ USA una implicación que ya tenés (modus ponens): con A→B y A, obtenés B. Se dibuja con las dos premisas arriba de la raya (pueden ser subárboles enteros) y B abajo.

Para decidir: si la → está en lo que buscás, I→; si está en lo que tenés, E→, y lo que te falta probar es su antecedente.

## Disyunción: I∨ y E∨
<!-- re: E∨|ramas|disyun|I∨ -->

I∨ arma A∨B a partir de uno solo de los lados. Sirve cuando sabés cuál lado vale; si no lo sabés, suele convenir RAA suponiendo ¬(A∨B).

E∨ usa una disyunción A∨B que tenés: abrís dos ramas, una suponiendo A y otra suponiendo B, y en las dos probás la MISMA fórmula C (muchas veces ⊥). Al cerrar, E∨ da C y cancela A y B; la disyunción no se cancela.

## Eliminación del ∃ (E∃)
<!-- re: E∃|testigo -->

Con ∃xφ(x) sabés que algo cumple φ, pero no cuál. E∃ te deja trabajar con ese «algo»: suponés φ(x) con una variable x nueva y desde ahí derivás la conclusión ψ que buscás.

Al cerrar, E∃ da ψ y cancela la suposición φ(x). La premisa ∃xφ(x) no se cancela.

Condición (∗): x no puede estar libre en ψ ni en otras hipótesis abiertas; la x supuesta no puede «escapar» del bloque.

## Introducción del ∃ (I∃)
<!-- re: I∃|∃x.*meta|Meta.*∃ -->

Para probar ∃xφ(x) alcanza con un ejemplo: si ya tenés probado φ(t) para algún término t, I∃ te da ∃xφ(x).

Primero hay que conseguir φ(t) en el árbol; I∃ es el último paso. Condición: t tiene que ser libre para x en φ (que al ponerlo no quede capturado por otro cuantificador).

## Cuantificador universal: E∀ e I∀
<!-- re: E∀|I∀|∀ -->

E∀ usa ∀xφ(x): podés instanciarlo con cualquier término t y obtener φ(t). Conviene elegir el t que encaje con otra fórmula que tenés. Condición: t libre para x.

I∀ arma ∀xφ(x) si probaste φ(x) con x arbitraria. Condición (∗): x no puede estar libre en ninguna hipótesis abierta; si lo estuviera, x no sería «cualquiera».

## Variables libres y ligadas
<!-- re: libre|ligad|FV|Condici -->

Una aparición de x está ligada si está dentro del alcance de un ∀x o ∃x; si no, está libre. El alcance es la fórmula que sigue al cuantificador: todo el paréntesis si lo hay, o solo la atómica siguiente.

FV(φ) es el conjunto de variables con alguna aparición libre. Ej.: en ∀xP(x)∧Q(x), la x de Q(x) está libre.

«t libre para x en φ»: al reemplazar x por t, ninguna variable de t queda capturada por un cuantificador de φ. Lo piden E∀ e I∃. «x ∉ FV(…)» lo piden I∀ y E∃.

## Contradicción: E¬ y E⊥
<!-- re: ⊥|E¬|E⊥|contradic -->

E¬ produce ⊥: si tenés una fórmula φ y su negación ¬φ, juntándolas obtenés ⊥. Para usar un ¬φ que tenés, lo que te falta probar es φ.

E⊥ parte de ⊥: de ⊥ sale cualquier fórmula. Sirve cuando la meta no tiene relación con las hipótesis pero estas son contradictorias.

## Igualdad
<!-- re: =′|RI|igual -->

RI1: t =′ t. RI2 (simetría): de t₁ =′ t₂ obtengo t₂ =′ t₁. RI3: transitividad.

RI4 (sustitución): con t₁ =′ t₂ y una fórmula donde aparece t₁ en el lugar marcado, obtengo la misma fórmula con t₂ en ese lugar. Solo se reemplaza el lugar marcado, no todas las apariciones.

## Estrategia: armar y desarmar
<!-- re: [Aa]rm|[Dd]esarm|[Pp]rimer paso|[Ee]strategia|conector -->

Primero mirá la meta. Si tiene conector principal, se arma con su introducción (I∧, I→, I¬, I∨, I∀, I∃, I↔) y aparecen submetas más chicas.

Si la meta es atómica: buscala en las hipótesis desarmándolas con eliminaciones (E∧, E→, E∨, E∀, E∃). Si no sale, RAA.

Esto se repite con cada meta nueva, esté donde esté (también dentro de un RAA o de una rama).

## Conjunción: I∧ y E∧
<!-- re: ∧|I∧|E∧ -->

I∧ arma φ∧ψ: hay que probar las dos partes, φ y ψ, por separado.

E∧ usa una φ∧ψ que tenés: te deja quedarte con cualquiera de las dos partes. Separar una conjunción es eliminación, no introducción.

