# Semántica proposicional

Teórico de Lógica · valuaciones, tautologías y cómo justificar.

## Valuaciones y tipos de fórmulas
<!-- re: v\(|valuaci|tautolog|contradicci|contingen -->

Valuación: v(⊥) = 0, v(¬φ) = 1 − v(φ), v(α ∧ β) = mín, v(α ∨ β) = máx, v(α → β) = máx{1 − v(α), v(β)}.

Tautología: vale 1 en toda valuación;
contradicción: 0 en toda;
contingencia: ni una ni otra.

Para justificar: un «para toda» verdadero se prueba con un elemento arbitrario;
un «para toda» falso se refuta con un contraejemplo que cumpla la hipótesis y no la conclusión;
un «existe» verdadero se prueba dando el testigo y verificándolo.

## Semántica proposicional
<!-- re: valuaci|tautolog|contingen|#|v\( -->

Una valuación da 0 o 1 a cada fórmula: v(⊥)=0, v(¬φ)=1−v(φ), ∧ = mínimo, ∨ = máximo, v(φ→ψ)=0 solo si v(φ)=1 y v(ψ)=0. Tautología: 1 en toda v; contradicción: 0 en toda v; contingencia: depende.

Relaciones como φ#ψ ⇔ (∀v)(v(φ) ≤ v(ψ)) solo fallan con v(φ)=1 y v(ψ)=0. ⊥ (siempre 0) y ¬⊥ (siempre 1) son los ejemplos cómodos.

Estrategia: ∀ verdadera → demostración con φ arbitraria (cadena de ⇔ justificando cada paso con una definición); ∀ falsa → un contraejemplo; ∃ verdadera → un ejemplo verificado.

## Lectura de fórmulas
<!-- re: [Ll]ee|precedencia|paréntesis|Fórmula -->

Precedencia (de más fuerte a más débil): ¬ y los cuantificadores, después ∧, después ∨, después →, después ↔. φ∨ψ∧σ se lee φ∨(ψ∧σ).

El conector principal es el que queda «afuera» de todo: es el que decide qué regla arma o desarma la fórmula.

