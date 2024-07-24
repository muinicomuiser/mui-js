import { Forma } from "../src/Formas.js";
import { Matematica } from "../src/Matematica.js";
import { Punto } from "../src/Punto.js";
import { Dibujante } from "../src/Dibujante.js";
import { Vector } from "../src/Vector.js";
import { Cuerpo } from "../src/Cuerpo.js";
import { Fuerza } from "../src/Fuerza.js";

const CANVAS: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas");
const CONTEXT: CanvasRenderingContext2D = CANVAS.getContext("2d")!;
CANVAS.width = 650;
CANVAS.height = 650;
CANVAS.style.backgroundColor = Dibujante.colorHSL(220, 70, 0);
let centroCanvas: Punto = {x:CANVAS.width/2, y: CANVAS.height/2};
window.addEventListener("load", ()=>{
    let triangulo: Cuerpo = Cuerpo.poligono(centroCanvas.x*0.5, centroCanvas.y*0.3, 3, 30);
    let atractor: Cuerpo = Cuerpo.circunferencia(centroCanvas.x, centroCanvas.x, 10);
    let dibujante: Dibujante = new Dibujante(CONTEXT);
    dibujante.color = Dibujante.colorHSL(220, 70, 100);
    dibujante.colorVectores = Dibujante.colorHSL(220, 100, 70)
    dibujante.grosorTrazo = 2;
    triangulo.velocidad = Vector.crear(5, 0);
    function animar(){
        let atraccion: Vector = Vector.segunPuntos(triangulo.posicion, atractor.posicion);
        atraccion = Vector.normalizar(atraccion);
        atraccion = Vector.escalar(atraccion, 0.5);
        triangulo.aceleracion = atraccion;
        triangulo.actualizarMovimiento();
        triangulo.setearRotacinVelocidad();
        dibujante.limpiarCanvas(CANVAS);
        atractor.trazar(dibujante);
        triangulo.trazar(dibujante);
        triangulo.trazarVelocidad(dibujante)
        requestAnimationFrame(animar)
    }
    animar()
})