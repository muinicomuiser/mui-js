import { Celda } from "../cuadricula/celda";
import { Forma } from "../geometria-plana/formas";
import { Punto } from "../geometria-plana/punto";
import { TipoFormas } from "../geometria-plana/tipo-formas";
import { Vector } from "../geometria-plana/vector";
import { Geometria } from "../utiles/geometria";
import { OpcionesGraficasForma } from "./opciones-graficas-forma";
import { OpcionesGraficasVector } from "./opciones-graficas-vector";
import { OpcionesGraficasTexto } from "./opciones-texto";

/**MÓDULO DE DIBUJO         
 * Instancia una herramienta dibujante.         
 * Métodos para definir colores hsla y rgba, dibujar objetos tipo Forma y escribir.         
 */
export class Dibujante {

    colorCelda: string;

    /**Interfaz de dibujo sobre el canvas. 2D*/
    context: CanvasRenderingContext2D;

    // opcionesCelda:
    /**Opciones del método en que se graficará.     
     * 'colorTrazo', 'colorRelleno', 'trazada', 'rellenada', 'grosorTrazo' y 'opacidad'.
    */
    estiloForma: OpcionesGraficasForma = {
        colorTrazo: 'blue',
        colorRelleno: "skyblue",
        trazada: true,
        rellenada: true,
        grosorTrazo: 1,
        opacidad: 1,
    }

    /**Opciones de 'color', 'tamano', 'fuente', 'opacidad' y 'alineacion'.*/
    estiloTexto: OpcionesGraficasTexto = {
        color: "red",
        tamano: 10,
        fuente: "calibri",
        opacidad: 1,
        alineacion: "right"
    };

    /**Opciones del método en que se graficará.
    * 'color' y 'grosorTrazo'.
    */
    estiloVector: OpcionesGraficasVector = {
        color: "red",
        grosorTrazo: 1,
    }

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.colorCelda = "blue"
    }

    /**
     * Retorna un string con el color en formato HSL.            
     * (hue) recibe grados entre 0 y 360,
     * (saturation) y (lightness) reciben porcentajes.
     */
    static colorHSL(hue: number, saturation: number, lightness: number) {
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    /**
     * Retorna un string con el color en formato HSLA.           
     * (hue) recibe grados entre 0 y 360,
     * (saturation) y (lightness) reciben porcentajes, y (alpha)
     * valores entre 0 y 1.
     */
    static colorHSLA(hue: number, saturation: number, lightness: number, alpha: number) {
        return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    }

    /**
     * Retorna un string con el color en formato RGB.            
     * (red), (green) y (blue) reciben valores entre 0 y 255.
     */
    static colorRGB(red: number, green: number, blue: number) {
        return `rgb(${red}, ${green}, ${blue})`;
    }

    /**
     * Retorna un string con el color en formato RGBA.           
     * (red), (green) y (blue) reciben valores entre 0 y 255,
     * y (alpha) valores entre 0 y 1.
     */
    static colorRGBA(red: number, green: number, blue: number, alpha: number) {
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }


    protected recorrerPath(forma: Forma): void {
        if (forma.tipo == TipoFormas.circunferencia) {
            this.pathCircunferencia(forma);
        }
        else if (forma.tipo == TipoFormas.poligono) {
            this.pathPoligono(forma);
        }
        else if (forma.tipo == TipoFormas.linea || forma.tipo == TipoFormas.vector) {
            this.pathLinea(forma);
        }
    }

    /**Traza en el canvas la forma ingresada como argumento.*/
    trazar(forma: Forma): void {
        this.recorrerPath(forma)
        if (forma.tipo == TipoFormas.vector) {
            this.context.strokeStyle = this.estiloVector.color;
        }
        else {
            if (forma.colorTrazo) {
                this.context.strokeStyle = forma.colorTrazo
            }
            else {
                this.context.strokeStyle = this.estiloForma.colorTrazo!;
            }
            if (forma.opacidad) {
                this.context.globalAlpha = forma.opacidad
            }
            else {
                this.context.globalAlpha = this.estiloForma.opacidad!;
            }
            if (forma.grosorTrazo) {
                this.context.lineWidth = forma.grosorTrazo
            }
            else {
                this.context.lineWidth = this.estiloForma.grosorTrazo!;
            }
        }
        this.context.stroke();
    }


    /**Rellena en el canvas la forma ingresada como argumento.*/
    rellenar(forma: Forma): void {
        this.recorrerPath(forma);
        if (forma.opacidad) {
            this.context.globalAlpha = forma.opacidad
        }
        else {
            this.context.globalAlpha = this.estiloForma.opacidad!;
        }
        if (forma.colorRelleno) {
            this.context.fillStyle = forma.colorRelleno
        }
        else {
            this.context.fillStyle = this.estiloForma.colorRelleno!;
        }
        this.context.fill();
    }

    /**Rellena y/o traza una forma, según su estilo gráfico.*/
    renderizar(forma: Forma): void {
        if (forma.rellenada) {
            this.rellenar(forma)
        }
        if (forma.trazada) {
            this.trazar(forma)
        }
    }

    /**Rellena en el canvas la celda ingresada como argumento.*/
    rellenarCelda(celda: Celda): void {
        this.context.beginPath();
        this.context.clearRect((celda.columna - 1) * celda.tamano, (celda.fila - 1) * celda.tamano, celda.tamano, celda.tamano);
        this.context.globalAlpha = this.estiloForma.opacidad!;
        this.context.fillStyle = this.colorCelda;
        if (celda.color) {
            this.context.fillStyle = celda.color;
        }
        this.context.fillRect((celda.columna - 1) * celda.tamano, (celda.fila - 1) * celda.tamano, celda.tamano, celda.tamano);
        this.context.globalAlpha = 1;
    }

    /** Traza en el canvas el vector ingresado como argumento.      
     * Usa como color el atributo .estiloVector.color.
     */
    trazarVector(vector: Vector): void {
        let origen: Punto = vector.origen;
        let extremo: Punto = { x: vector.origen.x + vector.x, y: vector.origen.y + vector.y };
        this.context.beginPath();
        this.context.moveTo(origen.x, origen.y);
        this.context.lineTo(extremo.x, extremo.y);

        this.context.lineWidth = this.estiloVector.grosorTrazo;
        this.context.globalAlpha = this.estiloForma.opacidad!;
        this.context.strokeStyle = this.estiloVector.color;
        this.context.stroke();
    }


    /**Rellena un texto en el canvas en la posicion ingresada.          
     * Usa como opciones gráficas el atributo .estiloTexto
    */
    escribir(texto: string, posicionX: number, posicionY: number): void {
        this.context.textAlign = this.estiloTexto.alineacion!;
        this.context.font = `${this.estiloTexto.tamano}px ${this.estiloTexto.fuente}`;
        // this.context.font = `${this.opcionesTexto.grosor} ${this.opcionesTexto.tamano}px ${this.opcionesTexto.fuente}`;
        this.context.globalAlpha = this.estiloTexto.opacidad!;
        this.context.fillStyle = this.estiloTexto.color!;
        this.context.fillText(texto, posicionX, posicionY);
    }


    /**Método interno.        
    * Crea un recorrido para una forma con id "circunferencia", usando el método .arc de la interfaz context.      
    */
    protected pathCircunferencia(forma: Forma): void {
        this.context.beginPath();
        this.context.arc(forma.posicion.x, forma.posicion.y, forma.radioTransformado, 0, Geometria.DOS_PI);
    }


    /**Método interno.        
    * Crea un recorrido para una forma con id "poligono". Registra líneas entre cada vértice del polígono.      
    */
    protected pathPoligono(forma: Forma) {
        this.context.beginPath();
        this.context.moveTo(forma.verticesTransformados[0].x, forma.verticesTransformados[0].y);
        for (let vertice of forma.verticesTransformados) {
            this.context.lineTo(vertice.x, vertice.y);
        }
        this.context.closePath();
    }


    /**Método interno.        
    * Crea un recorrido para una forma con id "linea". Registra una línea entre los dos vértices.      
    */
    protected pathLinea(forma: Forma) {
        this.context.beginPath();
        this.context.moveTo(forma.verticesTransformados[0].x, forma.verticesTransformados[0].y);
        for (let vertice of forma.verticesTransformados) {
            this.context.lineTo(vertice.x, vertice.y);
        }
    }
}