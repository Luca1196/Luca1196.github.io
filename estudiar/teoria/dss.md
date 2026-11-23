# Diagrama de secuencia del sistema (DSS)

Teórico de Programación 4 · DSS de un caso de uso.

## Diagrama de secuencia del sistema (DSS)
<!-- re: DSS|:Sistema|[Ss]ecuencia del sistema|loop|alt\b|Set\(DT|DTU|DTC|fragmento|recuerda|[Nn]ota de -->

El DSS muestra al actor hablando con :Sistema como caja negra: los mensajes son las operaciones del sistema, sin objetos del dominio.

Los parámetros son datos simples (strings, números, DataTypes), nunca objetos del dominio. Si el sistema ya recibió un dato (el espacio elegido), lo recuerda: no se vuelve a pasar.

Lo que devuelve va como retorno, por ejemplo Set(DTCentro) si son varios. loop [guarda] repite (para cada / mientras quiera agregar otro); alt [cond1] [cond2] elige entre alternativas (confirmar o cancelar). Una nota aclara lo que el sistema recuerda o da de alta.

## Cómo se arma, mensaje por mensaje
<!-- re: DSS|mensaje|fragmento|loop|alt|opt|memoria|recuerda|DT -->

Un mensaje del DSS es algo que el ACTOR le da o le pide al Sistema (ingresa un dato, elige, confirma, cancela). Lo que el Sistema muestra, lista o retorna no es un mensaje: es el retorno del mensaje anterior. El Sistema nunca le manda mensajes al actor. Si el Sistema tiene que mostrar algo en cada vuelta de una repetición, hace falta un mensaje del actor en cada vuelta.

Fragmentos: loop [guarda] encierra los mensajes que se repiten («para cada…», «puede repetirse»); alt [guarda 1] / [guarda 2] separa caminos excluyentes, cada uno con su mensaje (confirmar o cancelar); opt [guarda] es un solo camino que puede darse una vez o ninguna. Lo que la letra hace «primero» o «finalmente» queda fuera del loop.

Parámetros: los datos que el actor ingresa en ese paso (identificadores, valores o DataTypes; nunca objetos del dominio) y nada que el Sistema ya recuerde. Retorno: solo si la letra dice que el Sistema muestra, lista o retorna algo; es un DataType o Set(DataType). Memoria, cómo decidirla: por cada dato que llega en el mensaje, recorré los mensajes que siguen. Si alguno lo vuelve a mandar, no hace falta recordarlo; si ninguno lo manda pero se usa después (casi siempre al confirmar, para dar de alta), va una nota «el Sistema recuerda…». Lo que el Sistema elige o genera él mismo (un código autogenerado) también se recuerda si se usa después; cuando el caso de uso termina (confirmar o cancelar), «se libera la memoria».

Un DataType lleva exactamente lo que la letra dice que el Sistema muestra: atributos simples, enumerados u otros DataTypes (Set si son varios). Nunca objetos del dominio. Si un dato es «el tipo» y en el dominio es una subclase, en el DataType va como un dato (enumerado o texto).

