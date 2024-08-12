"use strict";
/**
        =============================================
                * MÓDULO DE TRANSFORMACIONES *
        =============================================
        Trabaja sobre conjuntos de vectores.

        Almacena las transformaciones como atributos.

        Siempre retorna copias nuevas de los conjuntos de vectores ingresados.

 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformacion = void 0;
const Vector_js_1 = require("./Vector.js");
/**Aplica transformaciones de escala, rotación y desplazamiento sobre arreglos de vectores.
 * Siempre retorna copias nuevas de los arreglos.
 * Almacena en sus atributos los valores de las transformaciones que aplica.
 */
class Transformacion {
    escala;
    rotacion;
    posicion;
    constructor(x = 0, y = 0, rotacion = 0, escala = 1) {
        this.escala = escala;
        this.rotacion = rotacion;
        this.posicion = Vector_js_1.Vector.crear(x, y);
    }
    /**Retorna el arreglo de vectores resultante de aplicar las transformaciones de escala, rotación y desplazamiento
     * sobre un arreglo de vectores de entrada.*/
    transformarConjuntoVectores(vectores) {
        let vectoresTransformados = Vector_js_1.Vector.clonarConjunto(vectores);
        vectoresTransformados = this.escalarVectores(vectoresTransformados);
        vectoresTransformados = this.rotarVectores(vectoresTransformados);
        vectoresTransformados = this.desplazarVectores(vectoresTransformados);
        return vectoresTransformados;
    }
    /**Escala cada uno de los vectores del arreglo ingresado y los retorna en un arreglo nuevo.*/
    escalarVectores(vectores) {
        let vectoresEscalados = [];
        for (let vector of vectores) {
            let vectorEscalado = Vector_js_1.Vector.escalar(vector, this.escala);
            vectoresEscalados.push(vectorEscalado);
        }
        return vectoresEscalados;
    }
    /**Desplaza cada uno de los vectores del arreglo ingresado y los retorna en un arreglo nuevo.*/
    desplazarVectores(vectores) {
        let vectoresDesplazados = [];
        for (let vector of vectores) {
            let x = vector.x + this.posicion.x;
            let y = vector.y + this.posicion.y;
            vectoresDesplazados.push(Vector_js_1.Vector.crear(x, y));
        }
        return vectoresDesplazados;
    }
    /**Rota cada uno de los vectores del arreglo ingresado y los retorna en un arreglo nuevo.*/
    rotarVectores(vectores) {
        let vectoresRotados = [];
        for (let vector of vectores) {
            let x = vector.x * Math.cos(this.rotacion) - vector.y * Math.sin(this.rotacion);
            let y = vector.x * Math.sin(this.rotacion) + vector.y * Math.cos(this.rotacion);
            vectoresRotados.push(Vector_js_1.Vector.crear(x, y));
        }
        return vectoresRotados;
    }
}
exports.Transformacion = Transformacion;