
//POR INTEGRAR
// Para una forma personalizada, ya sea abierta o cerrada, agregar un método para calcular su radio o su centro
// Función de reflejar
// SUMAR FORMAS

import { Lapiz } from "../renderizado/lapiz";
import { OpcionesGraficasForma, Punto, OpcionesForma } from "../tipos/tipos";
import { Geometria } from "../utiles/geometria";
import { TipoFormas } from "./tipo-formas";
import { Transformacion } from "./transformacion";
import { Vector } from "./vector";


//Agregar propiedad de vértices transformados, normales rotadas y apotema, para no estar calculándolo en cada momento,
//ademas de una propiedad que avise cuando haya que aplicar la transformación.

/**MÓDULO FORMA         
 * Instancias de formas geométricas.            
 * Permite cambiar su posición, rotar, escalar, crear formas básicas y personalizadas, y dibujarlas.            
 */
export class Forma {
    protected _vertices: Vector[] = [];

    protected _verticesTransformados: Vector[] = [];

    protected _transformacion: Transformacion = new Transformacion();

    protected verticesTransformadosAnteriores: Vector[] = []

    protected transformacionAnterior: Transformacion = new Transformacion();

    protected transformar: boolean = true;

    id?: number;

    radio: number = 0;

    lados: number = 0;

    tipo: TipoFormas = TipoFormas.poligono;

    colorTrazo: string | undefined;

    colorRelleno: string | undefined;

    /**Determina si la forma debe ser trazada al dibujar.*/
    trazada: boolean = true;
    /**Determina si la forma debe ser rellenada al dibujar.*/
    rellenada: boolean = true;

    grosorTrazo: number | undefined

    opacidad: number | undefined

    protected constructor() { }

    /**Retorna el valor del radio con la transformación de escala aplicada.*/
    get radioTransformado(): number {
        let radioTransformado: number = this.radio * this._transformacion.escala;
        return radioTransformado;
    }

    /**Retorna una copia de la transformación de la forma.*/
    get transformacion(): Transformacion {
        return new Transformacion(this._transformacion.posicion.x, this._transformacion.posicion.y, this._transformacion.rotacion, this._transformacion.escala);
    }

    /**Retorna una copia del vector de la posición después de aplicar las transformaciones.*/
    get posicion(): Vector {
        return this._transformacion.posicion.clonar()
    }

    /**Retorna una copia del vector de la posición antes de aplicar las transformaciones.*/
    get posicionAnterior(): Vector {
        return this.transformacionAnterior.posicion.clonar()
    }

    /**Retorna el ángulo de rotación actual de la forma.*/
    get rotacion(): number {
        return this._transformacion.rotacion;
    }

    /**Retorna el valor de la escala de la forma.*/
    get escala(): number {
        return this._transformacion.escala;
    }

    /**Retorna una copia del arreglo de vértices sin transformaciones.*/
    get vertices(): Vector[] {
        return Vector.clonarConjunto(this._vertices);
    }

    /**Retorna una copia del arreglo de vértices después de aplicar las transformaciones de escala, rotación y desplazamiento.*/
    get verticesTransformados(): Vector[] {
        if (this.transformar) {
            this.verticesTransformadosAnteriores = Vector.clonarConjunto(this._verticesTransformados)
            this.transformarVertices()
        }
        return Vector.clonarConjunto(this._verticesTransformados)
    }

    /**Retorna el conjunto de vectores normales de cada arista del polígono.        
     * El orden de las aristas es en sentido horario.       
    */
    get normales(): Vector[] {
        let normales: Vector[] = [];
        for (let i: number = 0; i < this.verticesTransformados.length; i++) {
            if (i != this.verticesTransformados.length - 1) {
                let normal: Vector = Vector.normal(this.verticesTransformados[i], this.verticesTransformados[i + 1]);
                normales.push(normal)
            }
            else {
                let normal: Vector = Vector.normal(this.verticesTransformados[i], this.verticesTransformados[0]);
                normales.push(normal)
            }
        }
        return normales;
    }

    /**Retorna la distancia entre el centro del polígono y el punto más cercano de sus aristas.*/
    get apotema(): number {
        if (this.tipo == TipoFormas.circunferencia) {
            return this.radioTransformado;
        }
        return Math.cos(Math.PI / this.lados) * this.radio;
    }


    /**Reemplaza la transformación de la forma.*/
    set transformacion(transformacion: Transformacion) {
        this.transformar = true;
        this.transformacionAnterior = this._transformacion.clonarTransformación()
        this._transformacion = transformacion;
    }

    /**Reemplaza el vector posición de la forma.*/
    set posicion(nuevaPosicion: Vector) {
        this.transformar = true;
        this.transformacionAnterior.posicion = this._transformacion.posicion;
        this._transformacion.posicion = nuevaPosicion.clonar();
    }

    /**Modifica el valor de la rotación de la figura con respecto a su forma sin transformaciones.*/
    set rotacion(rotacion: number) {
        this.transformar = true;
        this.transformacionAnterior.rotacion = this._transformacion.rotacion;
        this._transformacion.rotacion = rotacion;
    }

    /**Reemplaza el valor de la escala de la forma.*/
    set escala(nuevaEscala: number) {
        this.transformar = true;
        this.transformacionAnterior.escala = this._transformacion.escala;
        this._transformacion.escala = nuevaEscala;
    }

    /**Reemplaza el conjunto de vértices base de la forma.*/
    set vertices(vertices: Vector[]) {
        this._vertices = Vector.clonarConjunto(vertices);
    }

    /**Permite modificar las opciones gráficas con la interfaz OpcionesGraficasForma*/
    set estiloGrafico(opciones: OpcionesGraficasForma) {
        Object.assign(this, opciones)
    }

    ////////Agregar control de errores para índices mayores al número de vértices

    public moverVertice(indice: number, punto: Punto) {
        this._vertices[indice] = Vector.crear(punto.x, punto.y);
    }

    /**Inicia los vértices de la forma creada.*/
    private crearVertices(): void {
        if (this.lados == 0) {
            this._vertices = [];
        }
        let theta = Geometria.DOS_PI / this.lados;
        let offset = theta * 0.5;
        let nVertices = [];
        for (let i: number = 0; i < this.lados; i++) {
            let angulo = offset + (i * theta);
            let xx = Math.cos(angulo) * this.radio;
            let yy = Math.sin(angulo) * this.radio;
            let vertice: Vector = Vector.crear(xx, yy);
            nVertices.push(vertice);
        }
        this._vertices = nVertices;
    }

    /**Retorna una forma de tipo polígono. El radio es el valor de la distancia entre el centro y cualquiera de sus vértices.*/
    static poligono(x: number, y: number, lados: number, radio: number, opciones?: OpcionesForma & OpcionesGraficasForma) {
        let nuevoPoligono = new Forma();
        nuevoPoligono.lados = lados;
        nuevoPoligono.radio = radio;
        nuevoPoligono.crearVertices();
        nuevoPoligono.tipo = TipoFormas.poligono;
        if (opciones) {
            Object.assign(nuevoPoligono, opciones)
        }
        nuevoPoligono.iniciarTransformacion(x, y)
        return nuevoPoligono;
    }

    /**Retorna una forma de tipo circunferencia. */
    static circunferencia(x: number, y: number, radio: number, opciones?: OpcionesForma & OpcionesGraficasForma) {
        let nuevaCircunferencia = new Forma();
        nuevaCircunferencia.radio = radio;
        let lados = 10 + Math.trunc(radio / 10);
        if (lados % 2 == 1) {
            lados++
        }
        if (lados > 30) {
            lados = 30;
        }
        nuevaCircunferencia.lados = lados;
        nuevaCircunferencia.crearVertices();
        nuevaCircunferencia.tipo = TipoFormas.circunferencia;
        if (opciones) {
            Object.assign(nuevaCircunferencia, opciones)
        }
        nuevaCircunferencia.iniciarTransformacion(x, y)
        return nuevaCircunferencia;
    }

    /**Retorna una forma de tipo rectángulo. El radio es el valor de la distancia entre el centro y cualquiera de sus vértices.*/
    static rectangulo(x: number, y: number, base: number, altura: number, opciones?: OpcionesForma & OpcionesGraficasForma) {
        let rectangulo = new Forma();
        rectangulo.lados = 4;
        rectangulo.radio = Geometria.hipotenusa(base * 0.5, altura * 0.5);
        let ver1: Vector = Vector.crear(base / 2, altura / 2);
        let ver2: Vector = Vector.crear(-base / 2, altura / 2);
        let ver3: Vector = Vector.crear(-base / 2, -altura / 2);
        let ver4: Vector = Vector.crear(base / 2, -altura / 2);
        rectangulo.vertices = [ver1, ver2, ver3, ver4];
        rectangulo.tipo = TipoFormas.poligono;
        if (opciones) {
            Object.assign(rectangulo, opciones)
        }
        rectangulo.iniciarTransformacion(x, y);
        return rectangulo;
    }


    /**Crea una recta centrada en la posición ingresada.*/
    static recta(puntoUno: Punto, puntoDos: Punto, opciones?: OpcionesForma & OpcionesGraficasForma) {
        let linea: Forma = new Forma();
        linea.lados = 1;
        linea.radio = Geometria.distanciaEntrePuntos(puntoUno, puntoDos) / 2;
        let centro = Vector.crear(puntoUno.x / 2 + puntoDos.x / 2, puntoUno.y / 2 + puntoDos.y / 2);
        linea.vertices = [Vector.crear(puntoUno.x - centro.x, puntoUno.y - centro.y), Vector.crear(puntoDos.x - centro.x, puntoDos.y - centro.y)];
        linea.tipo = TipoFormas.linea;
        if (opciones) {
            Object.assign(linea, opciones)
        }
        linea.iniciarTransformacion(centro.x, centro.y);
        return linea;
    }


    /**
     * Crea un conjunto de rectas a partir de un grupo de vértices.
     * Calcula el centro de los vértices y centra el trazo en la posición ingresada.
     */
    static trazo(vertices: Vector[], opciones?: OpcionesForma & OpcionesGraficasForma): Forma {
        let centro: Vector = Vector.crear(0, 0)
        let trazo: Forma = new Forma();
        let verticesTrazo: Vector[] = []
        vertices.forEach((vertice) => centro = centro.sumar(vertice.escalar(1 / vertices.length)))
        vertices.forEach((vertice) => verticesTrazo.push(vertice.restar(centro)))
        trazo.vertices = verticesTrazo
        trazo.lados = vertices.length - 1;
        trazo.tipo = TipoFormas.linea;
        if (opciones) {
            Object.assign(trazo, opciones)
        }
        trazo.iniciarTransformacion(centro.x, centro.y);
        return trazo;
    }

    /**
     * Crea un polígono a partir de un grupo de vértices.
     * Calcula el centro de los vértices ingresados y lo asigna a su posición.
     */
    static poligonoSegunVertices(vertices: Vector[], opciones?: OpcionesForma & OpcionesGraficasForma): Forma {
        let centro: Vector = Vector.crear(0, 0)
        let poligono: Forma = new Forma();
        let verticesPoligono: Vector[] = []
        vertices.forEach((vertice) => centro = centro.sumar(vertice.escalar(1 / vertices.length)))
        vertices.forEach((vertice) => verticesPoligono.push(vertice.restar(centro)))
        poligono.vertices = verticesPoligono;
        poligono.lados = vertices.length - 1;
        poligono.tipo = TipoFormas.poligono;
        if (opciones) {
            Object.assign(poligono, opciones)
        }
        poligono.iniciarTransformacion(centro.x, centro.y);
        return poligono;
    }

    /**Crea una transformación nueva para formas nuevas, con la posición ingresada.*/
    protected iniciarTransformacion(x: number, y: number): void {
        this._transformacion.posicion = Vector.crear(x, y);
        this.transformacionAnterior = this._transformacion.clonarTransformación()
    }

    /**Actualiza el conjunto de vectores transformados.*/
    protected transformarVertices(): void {
        this.verticesTransformadosAnteriores = Vector.clonarConjunto(this._verticesTransformados)
        this._verticesTransformados = this._transformacion.transformarConjuntoVectores(this._vertices);
        this.transformar = false;
    }

    /**Retorna una copia de la forma como una forma nueva.*/
    public clonar(): Forma {
        const clonForma: Forma = new Forma();
        Object.assign(clonForma, this)
        clonForma.iniciarTransformacion(this.posicion.x, this.posicion.y);
        return clonForma;
    }

    /**Suma el ángulo ingresado al ángulo de rotación de la forma.*/
    public rotar(angulo: number): void {
        this.transformacionAnterior.rotacion = this._transformacion.rotacion;
        this._transformacion.rotacion += angulo;
        this.transformar = true;
    }

    /**Suma el vector ingresado al vector de posición de la forma.*/
    public desplazar(vector: Vector) {
        this.transformacionAnterior.posicion = this._transformacion.posicion;
        this._transformacion.posicion = this._transformacion.posicion.sumar(vector);
    }

    /**Rota la forma alrededor del punto (0, 0)*/
    public rotarSegunOrigen(angulo: number) {
        this.transformacionAnterior.posicion = this._transformacion.posicion;
        this._transformacion.posicion = this._transformacion.posicion.rotar(angulo);
    }

    /**Rota la forma alrededor del punto ingresado.*/
    public rotarSegunPunto(punto: Punto, angulo: number): void {
        let vectorAcomodador: Vector = Vector.crear(punto.x, punto.y);
        this.transformacionAnterior.posicion = this._transformacion.posicion;
        this._transformacion.posicion = this._transformacion.posicion.restar(vectorAcomodador);
        this.rotarSegunOrigen(angulo);
        this._transformacion.posicion = this._transformacion.posicion.sumar(vectorAcomodador);
    }

    /**Traza el contorno de la forma. Usa una instancia de la clase Lapiz o Dibujante.*/
    public trazar(lapiz: Lapiz): void {
        lapiz.trazar(this);
    }

    /**Rellena el interior de la forma. Usa una instancia de la clase Lapiz o Dibujante.*/
    public rellenar(lapiz: Lapiz): void {
        lapiz.rellenar(this);
    }

    /**Rellena el interior de la forma. Usa una instancia de la clase Lapiz o Dibujante.*/
    public dibujar(lapiz: Lapiz): void {
        lapiz.dibujar(this);
    }
}