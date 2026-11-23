# Tableaux semánticos

Teórico de Lógica · tableaux para decidir Γ ⊨ φ.

## Reglas y lectura del tableau
<!-- re: tableau|T\.|F\.|rama -->

Tableau semántico (para ver si Γ ⊨ φ): en la raíz va T.

de cada hipótesis y F.φ, y se buscan valuaciones que cumplan todo.

Siguen en la MISMA rama: T.A ∧ B (T.A, T.B) · F.A ∨ B (F.A, F.B) · F.A → B (T.A, F.B) · T.¬A (F.A) · F.¬A (T.A).

Abren DOS ramas: F.A ∧ B (F.A | F.B) · T.A ∨ B (T.A | T.B) · T.A → B (F.A | T.B).

Una rama se cierra (×) cuando tiene T.X y F.X.

Si todas cierran no hay contraejemplo: Γ ⊨ φ.

Una rama abierta y terminada da una valuación contraejemplo: Γ ⊭ φ.

Conviene aplicar primero las reglas que no abren ramas.

