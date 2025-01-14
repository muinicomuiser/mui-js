import { TipoFormas } from "../GeometriaPlana/TipoFormas.js";
import { Vector } from "../GeometriaPlana/Vector.js";
import { Geometria } from "../Utiles/Geometria.js";
/**
        =============================================
                 * MÓDULO DE COLISIONES *
        =============================================
        Trabaja usando objetos de tipo Forma.

        Usa el Teorema de ejes de separación (SAT) para detectar colisiones.

 */
/**MÓDULO DE COLISIONES
 * Trabaja usando objetos de tipo Forma.
 * Usa el Teorema de ejes de separación (SAT) para detectar colisiones.
*/
export class Colision {
    static get iteraciones() {
        return 2;
    }
    /**Detecta colisiones usando el teorema SAT entre formas de tipo circunferencia y/o polígono.
     * Retorna true si detecta una colisión.
     * Retorna false si no detecta colisión.
    */
    static detectar(formaUno, formaDos) {
        //Pondré acá la detección de la distancia límite de colisión
        if (Geometria.distanciaEntrePuntos(formaUno.posicion, formaDos.posicion) <= (formaUno.radio + formaDos.radio) * 1.05) {
            if (formaUno.tipo == TipoFormas.poligono && formaDos.tipo == TipoFormas.poligono) {
                return Colision.poligonos(formaUno, formaDos);
            }
            else if (formaUno.tipo == TipoFormas.circunferencia && formaDos.tipo == TipoFormas.poligono) {
                return Colision.circunferenciaPoligono(formaUno, formaDos);
            }
            else if (formaUno.tipo == TipoFormas.poligono && formaDos.tipo == TipoFormas.circunferencia) {
                return Colision.circunferenciaPoligono(formaDos, formaUno);
            }
            else {
                return Colision.circunferencias(formaUno, formaDos);
            }
        }
        return false;
    }
    /**Detecta la intersección entre dos circunferencias.
     * Retorna true si hay intersección.
     * Retorna false si no hay intersección.
     * Compara la distancia entre ambos centros con la suma de sus radios.
     */
    static circunferencias(circunferenciaUno, circunferenciaDos) {
        let sumaRadios = circunferenciaUno.radioTransformado + circunferenciaDos.radioTransformado;
        let distanciaCentros = Geometria.distanciaEntrePuntos(circunferenciaUno.posicion, circunferenciaDos.posicion);
        if (distanciaCentros > sumaRadios) {
            return false;
        }
        return true;
    }
    /**Detecta la colisión entre dos polígonos.
     * Retorna true si hay colisión.
     * Retorna false si no hay colisión.
     * Usa el teorema SAT. Proyecta los vértices sobre las normales de las caras de ambos polígonos y busca ejes de separación.
     */
    static poligonos(poligonoUno, poligonoDos) {
        for (let normal of poligonoUno.normales) {
            /**Búsqueda de proyecciones mínimas y máximas de los vértices de los polígonos sobre las normales del polígono uno.*/
            let menorUno = Colision.proyeccionMenor(poligonoUno.verticesTransformados, normal);
            let mayorUno = Colision.proyeccionMayor(poligonoUno.verticesTransformados, normal);
            let menorDos = Colision.proyeccionMenor(poligonoDos.verticesTransformados, normal);
            let mayorDos = Colision.proyeccionMayor(poligonoDos.verticesTransformados, normal);
            /**Comparación. Si se encuentra una separación, retorna false.*/
            if (menorUno > mayorDos || mayorUno < menorDos) {
                return false;
            }
        }
        for (let normal of poligonoDos.normales) {
            /**Búsqueda de proyecciones mínimas y máximas de los vértices de los polígonos sobre las normales del polígono uno.*/
            let menorUno = Colision.proyeccionMenor(poligonoUno.verticesTransformados, normal);
            let mayorUno = Colision.proyeccionMayor(poligonoUno.verticesTransformados, normal);
            let menorDos = Colision.proyeccionMenor(poligonoDos.verticesTransformados, normal);
            let mayorDos = Colision.proyeccionMayor(poligonoDos.verticesTransformados, normal);
            /**Comparación. Si se encuentra una separación, retorna false.*/
            if (menorUno > mayorDos || mayorUno < menorDos) {
                return false;
            }
        }
        return true;
    }
    /**Detecta la colisión entre una circunferencia y un polígono.
     * Retorna true si hay colisión.
     * Retorna false si no hay colisión.
     * Usa el teorema SAT. Proyecta los vértices del polígono y dos puntos de la circunferencia sobre las normales de las caras del polígono y busca ejes de separación.
     */
    static circunferenciaPoligono(circunferencia, poligono) {
        for (let normal of poligono.normales) {
            /**Búsqueda de proyecciones mínimas y máximas de los vértices de los polígonos sobre las normales del polígono uno.*/
            let menorPoli = Colision.proyeccionMenor(poligono.verticesTransformados, normal);
            let mayorPoli = Colision.proyeccionMayor(poligono.verticesTransformados, normal);
            let menorCirc = circunferencia.posicion.proyeccion(normal) - circunferencia.radioTransformado;
            let mayorCirc = circunferencia.posicion.proyeccion(normal) + circunferencia.radioTransformado;
            /**Comparación. Si se encuentra una separación, retorna false.*/
            if (menorPoli > mayorCirc || mayorPoli < menorCirc) {
                return false;
            }
        }
        return true;
    }
    /**Retorna el valor menor entre las proyecciones de un conjunto de vértices sobre un eje representado por un vector normal.*/
    static proyeccionMenor(vertices, normal) {
        let menor = vertices[0].proyeccion(normal);
        /**Búsqueda de proyecciones mínimas de los vértices del polígono uno.*/
        for (let vertice of vertices) {
            if (vertice.proyeccion(normal) < menor) {
                menor = vertice.proyeccion(normal);
            }
        }
        return menor;
    }
    /**Retorna el valor mayor entre las proyecciones de un conjunto de vértices sobre un eje representado por un vector normal.*/
    static proyeccionMayor(vertices, normal) {
        let mayor = vertices[0].proyeccion(normal);
        /**Búsqueda de proyecciones máximas de los vértices del polígono uno.*/
        for (let vertice of vertices) {
            if (vertice.proyeccion(normal) > mayor) {
                mayor = vertice.proyeccion(normal);
            }
        }
        return mayor;
    }
    /**Retorna un arreglo de dos vectores correspondiente a las normales de las caras de contacto entre dos formas.
     * El primero vector del arreglo corresponde a la normal de la primera forma.
     * El segundo vector del arreglo corresponde a la normal de la segunda forma.
    */
    static normalesContacto(formaUno, formaDos) {
        let normales = [];
        let normalUno;
        let normalDos;
        let vectorUnoADos = Vector.segunPuntos(formaUno.posicion, formaDos.posicion);
        let vectorDosAUno = Vector.segunPuntos(formaDos.posicion, formaUno.posicion);
        if (formaUno.tipo == TipoFormas.circunferencia) {
            normalUno = vectorUnoADos;
        }
        else {
            normalUno = formaUno.normales[0].clonar();
            for (let normal of formaUno.normales) {
                if (vectorUnoADos.punto(normal) > vectorUnoADos.punto(normalUno)) {
                    normalUno = normal.clonar();
                }
            }
        }
        if (formaDos.tipo == TipoFormas.circunferencia) {
            normalDos = vectorDosAUno.clonar();
        }
        else {
            normalDos = formaDos.normales[0].clonar();
            for (let normal of formaDos.normales) {
                if (vectorDosAUno.punto(normal) > vectorDosAUno.punto(normalDos)) {
                    normalDos = normal.clonar();
                }
            }
        }
        normales.push(normalUno);
        normales.push(normalDos);
        return normales;
    }
    /**Detecta la colisión entre una circunferencia y su entorno que la contiene.
     * Retorna el valor de solapamiento.
     * Retorna null si no hay colisión.
     * Usa el teorema SAT. Proyecta los vértices del entorno y dos puntos de la circunferencia sobre las normales de las caras del polígono
     * y verifica si hay proyecciones de la circunferencia mayores a la de los vértices del entorno.
     */
    static circunferenciaEntorno(circunferencia, entorno) {
        let distanciaCicunferenciaCentro = Geometria.distanciaEntrePuntos(circunferencia.posicion, entorno.posicion);
        if (distanciaCicunferenciaCentro + circunferencia.radio * 1.2 > entorno.apotema) {
            for (let normal of entorno.normales) {
                /**Búsqueda de proyecciones mínimas y máximas de los vértices de los polígonos sobre las normales del polígono uno.*/
                let menorPoli = Colision.proyeccionMenor(entorno.verticesTransformados, normal);
                let mayorPoli = Colision.proyeccionMayor(entorno.verticesTransformados, normal);
                let menorCirc = circunferencia.posicion.proyeccion(normal) - circunferencia.radioTransformado;
                let mayorCirc = circunferencia.posicion.proyeccion(normal) + circunferencia.radioTransformado;
                /**Comparación. Si se encuentra una separación, retorna true.*/
                if (menorPoli > menorCirc) {
                    return menorPoli - menorCirc;
                }
                if (mayorPoli < mayorCirc) {
                    return mayorCirc - mayorPoli;
                }
            }
        }
        return null;
    }
    /**Retorna la normal del borde del entorno contra el que ha colisionado una forma.*/
    static normalContactoConEntorno(forma, entorno) {
        let numeroVertices = entorno.verticesTransformados.length;
        let normalEntorno = entorno.normales[numeroVertices - 1];
        let vectorCentroAForma = Vector.segunPuntos(entorno.posicion, forma.posicion);
        for (let i = 0; i < numeroVertices - 1; i++) {
            let vectorCentroAVerticeUno = Vector.segunPuntos(entorno.posicion, entorno.verticesTransformados[i]);
            let vectorCentroAVerticeDos = Vector.segunPuntos(entorno.posicion, entorno.verticesTransformados[i + 1]);
            let anguloVertices = vectorCentroAVerticeDos.anguloVectores(vectorCentroAVerticeUno);
            if (vectorCentroAForma.anguloVectores(vectorCentroAVerticeUno) < anguloVertices
                && vectorCentroAForma.anguloVectores(vectorCentroAVerticeDos) < anguloVertices) {
                normalEntorno = entorno.normales[i];
            }
        }
        return normalEntorno;
        ;
    }
}
