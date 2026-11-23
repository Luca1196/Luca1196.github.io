# Modelo de dominio

Teórico de Programación 4 · clases, atributos, asociaciones y restricciones.

## Qué es cada cosa
<!-- re: clase|atributo|asociaci|enum|DataType|herencia|abstract -->

Es clase un concepto de la realidad que tiene datos propios o se relaciona con otros. No son clases: un dato simple (atributo), un conjunto fijo de valores (enumerado), otro nombre del mismo concepto, el actor del caso de uso si no se registran datos de él, ni el sistema o la empresa que lo usa.

«Tipos de X»: si cada tipo registra datos o relaciones propias van subclases (y X es abstracta si todo X es de algún tipo); si solo interesa cuál es, va un enumerado como tipo de un atributo. Un estado que cambia con el tiempo es un atributo enumerado, no subclases. Un valor compuesto sin identidad (fecha, hora) es un DataType.

Cada dato va en la clase de la que es propio: lo común a todos los tipos en la clase base, lo de un tipo en su subclase, y lo que depende de un par de objetos en la clase de asociación. No van como atributos ni las «claves foráneas» (el vínculo es la asociación) ni las colecciones de objetos de otra clase.

Multiplicidad: al lado de cada clase va cuántos objetos de ESA clase se vinculan con uno de la otra. Clase de asociación: cuando el vínculo tiene datos propios y hay a lo sumo un vínculo por par; si puede haber varios por par, es una clase común. {ordered} si la letra habla de secuencia u orden. No se agregan asociaciones que se alcanzan por otro camino.

Se escribe en lenguaje natural solo lo que el diagrama no alcanza a decir: unicidad (identificadores; «dentro de» si es relativa), integridad circular (cada ciclo del diagrama: ¿los dos caminos tienen que llegar al mismo objeto?), atributos calculados (la fórmula) y reglas de negocio. Lo que ya dicen las multiplicidades, {ordered} o una clase abstracta no se repite, y no se inventan reglas que la letra no da.

## Multiplicidad, orden y clases abstractas
<!-- re: [Mm]ultiplicidad|ordered|1\.\.\*|[Aa]bstracta, con subclases -->

La multiplicidad dice cuántos objetos de un lado se relacionan con uno del otro: 1, 0..1, * (0 o más), 1..* (al menos uno).

Si los elementos tienen un orden, se anota {ordered} en el extremo de la asociación, en vez de un atributo de orden.

Si una clase solo existe a través de sus variantes (todo Paso es TareaManual o FirmaDigital), es abstracta (nombre en cursiva) con subclases.

## Qué elemento UML uso
<!-- re: DataType|Enum|[Hh]erencia|modelo|DTFecha -->

«DataType»: valor sin identidad propia (una fecha, una dirección); se usa como tipo de atributo, no como clase asociada.

«Enum»: conjunto fijo de valores (estados, categorías); el atributo tiene ese tipo.

Herencia: cuando las variantes tienen atributos o comportamiento distinto; si solo cambia un valor, alcanza un atributo o un Enum.

## Tipos de restricción
<!-- re: [Rr]estricci|[Uu]nicidad|circular|calculado|[Rr]egla de negocio -->

Unicidad: un atributo no se repite entre instancias («el código es único»); se escribe en Restricciones y el atributo se subraya o se aclara.

Integridad circular: dos caminos de asociaciones tienen que llevar al mismo objeto.

Atributo calculado: su valor se deriva de otros (se marca con / y se explica cómo se calcula).

Regla de negocio: cualquier otra condición del dominio que el diagrama no expresa solo.

