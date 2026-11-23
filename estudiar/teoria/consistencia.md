# Consistencia, teorías y completitud

Teórico de Lógica · Práctico 5 y temas de consistencia de los exámenes. Todo se explica con el mismo ejemplo: **Γ = {p0, p1}**.

## Conjuntos de fórmulas y derivación
<!-- re: Γ ⊢|⊢ φ|deriva|derivaci|hipótesis -->

**Γ** es un conjunto de fórmulas: las hipótesis, o los «axiomas».

**Γ ⊢ φ** quiere decir que hay una derivación (un árbol de deducción natural) que llega a φ usando solo hipótesis de Γ.

- Con Γ = {p0, p1}: Γ ⊢ p0 ∧ p1 (con I∧), Γ ⊢ p0 ∨ p7 (con I∨), Γ ⊢ p5 → p0 (con I→).
- Γ ⊬ p2 y Γ ⊬ ¬p2: Γ no dice nada de p2.
- Si Γ ⊆ Δ y Γ ⊢ φ, entonces Δ ⊢ φ: agregar hipótesis no quita derivaciones.

## Consecuencias: Cons(Γ)
<!-- re: Cons\(|consecuencia -->

**Cons(Γ) = {φ | Γ ⊢ φ}**: todo lo que se deriva de Γ.

- Siempre Γ ⊆ Cons(Γ): lo que suponés, lo derivás.
- Con Γ = {p0, p1}: p0 ∧ p1 ∈ Cons(Γ); p2 ∉ Cons(Γ) y ¬p2 ∉ Cons(Γ).
- Si Γ ⊆ Δ, entonces Cons(Γ) ⊆ Cons(Δ).

## Teoría
<!-- re: teoría|Cons\(T\)|cerrad -->

Una **teoría** es un conjunto T que ya contiene todo lo que se deriva de él: **Cons(T) = T** (equivale a: si T ⊢ φ, entonces φ ∈ T).

Pensalo como «los axiomas más todos sus teoremas».

- {p0, p1} **no** es teoría: se deriva p0 ∧ p1 y no está.
- **Cons(Γ) siempre es teoría**: derivar de nuevo desde Cons(Γ) no agrega nada. Es la forma más simple de armar una teoría que contenga ciertas fórmulas.
- Una teoría puede ser consistente o no, y completa o no.

## Valuaciones y modelos
<!-- re: modelo de|modelos|valuaci|⊨ φ -->

Una **valuación** v le da 0 o 1 a cada letra, y de ahí a cada fórmula.

v es **modelo de Γ** (v satisface Γ) si v(φ) = 1 para **todas** las φ ∈ Γ. En predicados es lo mismo con una estructura M: M ⊨ Γ si todas las sentencias de Γ son verdaderas en M. Un modelo siempre es modelo **de algo**.

- Para Γ = {p0, p1}, los modelos son todas las v con v(p0) = v(p1) = 1. Las demás letras (p2, p3…) pueden valer cualquier cosa: hay muchos modelos.

**Γ ⊨ φ** quiere decir que φ vale 1 en **todos** los modelos de Γ. Se refuta con **un** modelo de Γ donde φ vale 0.

## Corrección y completitud: ⊢ y ⊨ dicen lo mismo
<!-- re: corrección|completitud|Th\(Mod|Mod\(|Th\( -->

- **Corrección:** si Γ ⊢ φ, entonces Γ ⊨ φ. Lo que se deriva vale en todo modelo.
- **Completitud:** si Γ ⊨ φ, entonces Γ ⊢ φ. Lo que vale en todo modelo se puede derivar.

Juntas: **Cons(Γ) = lo que vale en todos los modelos de Γ**. En predicados: Mod(Γ) = las estructuras que modelan Γ; Th(K) = las sentencias verdaderas en todas las estructuras de K; y **Cons(Γ) = Th(Mod(Γ))**.

## Consistente
<!-- re: consistent|⊥|satisfacible -->

**Γ es consistente si Γ ⊬ ⊥.** Inconsistente equivale a: Γ ⊢ φ para **toda** φ, y también a: Γ deriva alguna φ y su ¬φ (Lema 1.6.3).

**Condición suficiente (1.6.4): si Γ tiene un modelo, es consistente.** Alcanza con **una** valuación:

1. Supongamos Γ ⊢ ⊥.
2. Por corrección, ⊥ valdría 1 en todo modelo de Γ.
3. Pero ⊥ vale 0 en cualquier valuación.
4. Si existe aunque sea un modelo v de Γ, en v valdría ⊥: imposible. Entonces Γ ⊬ ⊥.

«Γ ⊢ ⊥» sería una afirmación sobre **todos** los modelos; un solo modelo la rompe (como un cuervo blanco rompe «todos los cuervos son negros»). Es al revés que la validez: para ⊨ φ hay que mirar todas las valuaciones; para consistencia alcanza con que **exista** una.

**La vuelta (1.6.10, por completitud): todo consistente tiene un modelo.** Juntas: **consistente ⇔ tiene un modelo (es satisfacible)**.

- Para mostrar que algo **es** consistente: das una valuación que satisfaga todo. Ej.: v(p0) = v(p1) = 1 satisface {p0, p1}.
- Para mostrar que **no** lo es: derivás ⊥, o mostrás que ninguna valuación satisface todo. Ej.: {p0, ¬p0}.

**Lema 1.6.5:** si Γ ∪ {¬φ} es inconsistente, Γ ⊢ φ (es RAA); si Γ ∪ {φ} es inconsistente, Γ ⊢ ¬φ (es I¬).

## Completo
<!-- re: complet|decide -->

**Γ es completo** si es consistente y **decide** toda φ: para toda φ, Γ ⊢ φ o Γ ⊢ ¬φ.

En modelos: completo ⇔ todos sus modelos coinciden en todo ⇔ (en PROP) hay **una única** valuación que lo satisface ⇔ Cons(Γ) es consistente maximal.

- {p0, p1} **no** es completo: hay un modelo con p2 = 1 y otro con p2 = 0, así que no decide p2.
- **Para mostrar que algo NO es completo:** una φ que no decide, y **dos** modelos de Γ que no coinciden en φ. Por corrección, el que hace φ falsa muestra Γ ⊬ φ, y el que la hace verdadera muestra Γ ⊬ ¬φ.
- **Para mostrar que algo ES completo:** ver que lo satisface una única valuación (fija el valor de cada letra).

## Consistente maximal
<!-- re: maximal|Lindenbaum|∆0|∆1|\{φ \| v\(φ\) = 1\} -->

**Γ es consistente maximal** si es consistente y no le entra nada más: si φ ∉ Γ, entonces Γ ∪ {φ} es inconsistente.

Equivale a: para toda φ, **φ ∈ Γ o ¬φ ∈ Γ** (1.6.9).

- **Completo frente a maximal:** completo habla de lo que se **deriva** (⊢); maximal, de lo que **está adentro** (∈). Un maximal es teoría (1.6.8: si Γ ⊢ α, α ∈ Γ), así que **maximal = teoría completa**.
- **El maximal típico:** {φ | v(φ) = 1} para una valuación v: todas las fórmulas verdaderas en v. Es consistente (v lo satisface) y tiene φ o ¬φ para cada φ (una de las dos vale 1 en v).
- **Para que un maximal contenga a T:** elegí una v que satisfaga T. Ej.: para T = Cons({p0, p1, ¬p2}), v(p0) = v(p1) = 1 y v(p2) = 0.
- **Lindenbaum (1.6.7):** todo consistente está incluido en algún maximal.
- La unión de dos maximales distintos es inconsistente: cada uno decidió alguna letra al revés que el otro.

## La imagen que une todo
<!-- re: imagen|menos modelos -->

**Más fórmulas en Γ, menos modelos.** Cada fórmula que agregás descarta los modelos que no la cumplen.

| Γ | Sus modelos | Qué es |
|---|---|---|
| {p0, p1} | las v con p0 = p1 = 1 (p2, p3… libres) | consistente, no completo |
| {p0, p1, ¬p2} | además p2 = 0 (p3… libres) | más decidido, todavía no completo |
| {φ \| v(φ) = 1} | una sola valuación | maximal (teoría completa) |
| {p0, ¬p0} | ninguno | inconsistente |

- **Consistente** = al menos un modelo.
- **Completo** = todos los modelos coinciden (en PROP, uno solo).
- **Consecuencia** = lo que comparten todos los modelos.
- **No decide φ** = hay un modelo con φ verdadera y otro con φ falsa.
