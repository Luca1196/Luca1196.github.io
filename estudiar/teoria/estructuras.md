# Estructuras y modelos (primer orden)

Teórico de Lógica · estructuras, satisfacción, Mod/Th/Cons en predicados.

## Estructuras y satisfacción
<!-- re: estructura|universo|M ⊨|⊨ \(|interpreta -->

Una estructura es ⟨universo, relaciones, funciones, constantes⟩, en el orden del tipo de similaridad.

M ⊨ (∀x)φ si φ vale para todo elemento del universo;
M ⊨ (∃x)φ si vale para alguno;
M ⊨ P(t) si la interpretación de t está en la relación de P.

Mod(Γ): las estructuras que modelan Γ.

Th(K): las fórmulas verdaderas en todas las de K.

Cons(Γ): lo que se deriva de Γ;
Th(Mod(Γ)) = Cons(Γ).

Γ ⊨ φ: φ vale en todo modelo de Γ;
se refuta con UN modelo de Γ donde φ falla, y se prueba con una derivación (corrección y completitud: ⊨ si y solo si ⊢).

## Modelos de primer orden
<!-- re: estructura|Mod\(|Th\(|Cons\(|⊨|modela|maximal|universo -->

Una estructura ⟨U, P^M, f^M, c^M⟩ interpreta cada símbolo: universo, subconjunto que cumple P, función, constante. M ⊨ (∀x)φ ⇔ para todo a ∈ U, M ⊨ φ[ā/x].

Mod(Γ): estructuras que modelan Γ. Th(K): fórmulas verdaderas en todas las de K. Cons(Γ): consecuencias (Γ ⊢ φ). Th(Mod(Γ)) = Cons(Γ) por corrección y completitud.

Para mostrar que algo NO se sigue: una estructura chica que modele lo que tenés y no lo que querés. Consistente maximal: agregar cualquier fórmula de afuera lo vuelve inconsistente; si hay una que se puede agregar con un modelo, no es maximal.

