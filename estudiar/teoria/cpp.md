# Implementación en C++

Teórico de Programación 4 · del DCD al código (.h y .cpp).

## Del DCD al código
<!-- re: \.h|\.cpp|class|virtual|constructor|include -->

Antes de escribir: reconocer qué patrón trae el DCD (Composite: una clase abstracta con una hoja y un compuesto hecho de otras; Singleton: instancia única y getInstancia; una interfaz con una fábrica que elige la clase concreta), qué colecciones guarda cada clase y qué pide exactamente la letra: qué clases hay que implementar y qué se puede asumir.

Del DCD al .h: los atributos van privados. Una asociación navegable es un pseudoatributo: multiplicidad máxima 1 → puntero; mayor → colección de punteros (vector si hay orden, set si no, map si se busca por clave). Generalización o realización → «: public Base». Operación abstracta → virtual … = 0; la subclase la declara sin = 0. Clase base usada por puntero → destructor virtual. Singleton → instancia y getInstancia con static, constructor privado.

En el .cpp cada operación lleva Clase:: delante. Los objetos se crean con new y se guarda su puntero; con un puntero se usa ->, con un objeto o una colección se usa punto. Recorrer: for con índice de 0 a size()-1, o un iterador (el elemento es *it). Acumular: variable en 0 y total = total + …. Guardar: vector.push_back(x), set.insert(x), map[clave] = x. Lo que la clase creó con new y es solo suyo se libera con delete. Una subclase pasa los datos heredados al constructor de su base (: Base(…)).

Un atributo static se declara en el .h con static y se define una sola vez en el .cpp, fuera de la clase, con el nombre de la clase delante y sin repetir static: Tipo Clase::atributo = valor;

## Singleton
<!-- re: [Ss]ingleton|static|getInstancia|constructor -->

Singleton garantiza una sola instancia de una clase. El constructor es privado (nadie más puede hacer new).

La instancia se guarda en un atributo static y se obtiene con getInstancia(), también static: se llama sobre la clase, sin tener un objeto (si no hay instancia, la crea).

## Quién libera la memoria (C++)
<!-- re: delete|new|libera|memoria -->

En C++, lo que se crea con new hay que liberarlo con delete. En general lo libera quien lo recibe y termina de usarlo (si una operación devuelve un objeto nuevo, el que la llamó se hace cargo).

Antes del delete se copia lo que se necesita del objeto (por ejemplo, un valor de retorno), porque después ya no se puede acceder.

