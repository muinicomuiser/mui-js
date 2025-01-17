/**MÓDULO DE DIBUJANTE        
 * Extiende las funciones de Lapiz.         
 * Permite trabajar con conjuntos de formas y sobre el canvas.          
 * Se instancia usando el canvas.
 */

import { Forma } from "../geometria-plana/formas";
import { Vector } from "../geometria-plana/vector";
import { Punto } from "../tipos/tipos";
import { Lapiz } from "./lapiz";

export class Dibujante extends Lapiz {
    canvas: HTMLCanvasElement;
    private _anchoCanvas: number;
    private _altoCanvas: number;
    private _colorFondo?: string;
    private constructor(canvas: HTMLCanvasElement) {
        super(canvas.getContext("2d")!);
        this.canvas = canvas;
        if (this.canvas.style.backgroundColor) {
            this._colorFondo = this.canvas.style.backgroundColor;
        }
        this._anchoCanvas = this.canvas.width;
        this._altoCanvas = this.canvas.height;
    }

    /**Retorna la medida horizontal del canvas.*/
    get anchoCanvas(): number {
        return this._anchoCanvas;
    }

    /**Retorna la media vertical del canvas. */
    get altoCanvas(): number {
        return this._altoCanvas;
    }

    /**Retorna un punto ubicado en el centro del canvas.*/
    get centroCanvas(): Punto {
        return { x: this.anchoCanvas / 2, y: this.altoCanvas / 2 };
    }

    /**Retorna el color del canvas.*/
    get colorCanvas(): string | undefined {
        return this._colorFondo
    }

    /**Modifica la medida horizontal del canvas.*/
    set anchoCanvas(ancho: number) {
        this._anchoCanvas = ancho;
        this.canvas.width = this._anchoCanvas;
    }

    /**Modifica la medida vertical del canvas. */
    set altoCanvas(alto: number) {
        this._altoCanvas = alto;
        this.canvas.height = this._altoCanvas;
    }

    /**Modifica el color del canvas.*/
    set colorCanvas(color: string) {
        this._colorFondo = color;
        this.canvas.style.backgroundColor = this._colorFondo;
    }

    /**Retorna una instancia de Dibujante usando como parámetro el id de un canvas presente en el documento HTML. */
    static crearConIdCanvas(idCanvas: string): Dibujante {
        const CANVAS: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(idCanvas);
        let nuevoDibujante: Dibujante = new Dibujante(CANVAS);
        return nuevoDibujante;
    }

    /**Retorna una instancia de Dibujante usando como parámetro el canvas presente en el documento HTML. */
    static crearConCanvas(canvas: HTMLCanvasElement): Dibujante {
        const nuevoRender: Dibujante = new Dibujante(canvas);
        return nuevoRender;
    }

    /**Traza un conjunto de formas.*/
    trazarFormas(formas: Forma[]): void {
        for (let forma of formas) {
            forma.trazar(this);
        }
    }

    /**Rellena un conjunto de formas.*/
    rellenarFormas(formas: Forma[]): void {
        for (let forma of formas) {
            forma.rellenar(this);
        }
    }

    /**Rellena y/o traza, según el caso, un conjunto de formas.*/
    dibujarFormas(formas: Forma[]): void {
        for (let forma of formas) {
            if (forma.rellenada) {
                this.rellenar(forma)
                // forma.rellenar(this);
            }
            if (forma.trazada) {
                this.trazar(forma)
                // forma.trazar(this);
            }
        }
    }

    /**Borra el contenido del canvas.       
     * Si se especifica opacidad, pinta el canvas completo usando como color el atributo colorCanvas y con la opacidad especificada.        
     * Si no hay colorCanvas especificado, se pintará de blanco.
     */
    limpiarCanvas(opacidad?: number): void {
        if (opacidad != undefined) {
            this.context.globalAlpha = opacidad;
            if (this._colorFondo) {
                this.context.fillStyle = this._colorFondo;
            }
            else {
                this.context.fillStyle = 'white';
            }
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.globalAlpha = this.estiloForma.opacidad!;
        }
        else {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**Traza las normales de una forma geométrica.*/
    trazarNormales(forma: Forma): void {
        forma.normales.forEach((normal) => {
            let normalTrazable: Vector = normal.clonar();
            normalTrazable.origen = forma.posicion.sumar(normal.normalizar().escalar(forma.apotema));
            this.trazarVector(normalTrazable)
        })
    }
}