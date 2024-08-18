import { Geometria } from "../Utiles/Geometria.js";
//POR REVISAR
export class Vector {
    _x;
    _y;
    _origen;
    _id;
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._origen = { x: 0, y: 0 };
        this._id = 0;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get magnitud() {
        return Vector.magnitud(this);
    }
    get angulo() {
        return Vector.angulo(this);
    }
    get origen() {
        return { x: this._origen.x, y: this._origen.y };
    }
    set origen(origen) {
        this._origen = { x: origen.x, y: origen.y };
    }
    static magnitud(vector) {
        return (vector.x ** 2 + vector.y ** 2) ** (1 / 2);
    }
    //REVISARRRRRRRRRRRRRRRR
    static angulo(vector) {
        if (vector.x == 0 && vector.y == 0) {
            return 0;
        }
        else if (vector.y > 0 && vector.x == 0) {
            return Geometria.PI_MEDIO;
        }
        else if (vector.y < 0 && vector.x == 0) {
            return (3 / 2) * Math.PI;
        }
        else {
            if (vector.y > 0 && vector.x > 0) {
                return Math.atan(vector.y / vector.x);
            }
            else if (vector.y > 0 && vector.x < 0) {
                return Math.acos(vector.x / Vector.magnitud(vector));
            }
            else if (vector.y < 0 && vector.x < 0) {
                return Math.PI - Math.asin(vector.y / Vector.magnitud(vector));
            }
            return Geometria.DOS_PI - Math.acos(vector.x / Vector.magnitud(vector));
            ;
        }
    }
    static cero() {
        return new Vector(0, 0);
    }
    static arriba() {
        return new Vector(0, -1);
    }
    static abajo() {
        return new Vector(0, 1);
    }
    static izquierda() {
        return new Vector(-1, 0);
    }
    static derecha() {
        return new Vector(1, 0);
    }
    /**Retorna un vector nuevo correspondiente a las componentes x e y ingresadas.*/
    static crear(x, y) {
        return new Vector(x, y);
    }
    static segunPuntos(origen, extremo) {
        let vector = new Vector(extremo.x - origen.x, extremo.y - origen.y);
        return vector;
    }
    static clonar(vector) {
        let x = vector.x;
        let y = vector.y;
        return new Vector(x, y);
    }
    static suma(vectorUno, vectorDos) {
        let vectorSuma = new Vector((vectorUno.x + vectorDos.x), (vectorUno.y + vectorDos.y));
        return vectorSuma;
    }
    static resta(vectorUno, vectorDos) {
        let vectorResta = new Vector((vectorUno.x - vectorDos.x), (vectorUno.y - vectorDos.y));
        return vectorResta;
    }
    /**Retorna un vector nuevo resultante de multiplicar las componentes de un vector por un escalar.*/
    static escalar(vector, escalar) {
        let vectorEscalado = new Vector((vector.x * escalar), (vector.y * escalar));
        return vectorEscalado;
    }
    /**Retorna una copia del vector ingresado con magnitud 1.*/
    static normalizar(vector) {
        return new Vector(vector.x / vector.magnitud, vector.y / vector.magnitud);
    }
    /**Retorna un vector resultante de invertir la dirección del vector ingresado.*/
    static invertir(vector) {
        return new Vector(-vector.x, -vector.y);
    }
    /**Retorna el vector normal de un segmento formado por dos vectores.
     * El ángulo de la normal va en sentido antihorario según la dirección del primer al segundo vector.
     * (Según la inverción de ejes de las coordenadas de JS, donde los ángulos crecen en sentido horario).
    */
    static normal(vectorUno, vectorDos) {
        let vectorSegmento = Vector.segunPuntos(vectorUno, vectorDos);
        return Vector.rotar(vectorSegmento, -Geometria.PI_MEDIO);
    }
    static punto(vectorUno, vectorDos) {
        return (vectorUno.x * vectorDos.x) + (vectorUno.y * vectorDos.y);
    }
    static cruz(vectorUno, vectorDos) {
        return vectorUno.x * vectorDos.y - vectorUno.y * vectorDos.x;
    }
    /**Retorna el valor de la proyección de un vector sobre un eje representado por otro vector.*/
    static proyeccion(vectorUno, vectorEje) {
        return (Vector.punto(vectorUno, vectorEje) / Vector.magnitud(vectorEje));
    }
    //O DEBERÍA ENTREGAR LA RESTA DEL MAYOR CON EL MENOR??? 
    /**Retorna el valor del ángulo entre dos vectores.*/
    static anguloVectores(vectorUno, vectorDos) {
        let punto = Vector.punto(vectorUno, vectorDos);
        let magnitudes = vectorUno.magnitud * vectorDos.magnitud;
        return Math.acos(punto / magnitudes);
    }
    static clonarConjunto(vectores) {
        let conjuntoCopia = [];
        for (let vector of vectores) {
            conjuntoCopia.push(Vector.clonar(vector));
        }
        return conjuntoCopia;
    }
    static rotar(vector, angulo) {
        let x = (Math.cos(angulo) * vector.x) - (Math.sin(angulo) * vector.y);
        let y = (Math.sin(angulo) * vector.x) + (Math.cos(angulo) * vector.y);
        return new Vector(x, y);
    }
}