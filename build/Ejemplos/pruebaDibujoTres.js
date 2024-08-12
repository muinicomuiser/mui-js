import { Forma } from "../Fuente/GeometriaPlana/Formas.js";
import { Dibujante } from "../Fuente/Renderizado/Dibujante.js";
import { Colision } from "../Fuente/Interaccion/Colision.js";
import { Geometria } from "../Fuente/Utiles/Geometria.js";
/**AQUÍ EMPECÉ A PROBAR EL MÓDULO DE COLISIONES.*/
const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
CANVAS.width = 650;
CANVAS.height = 650;
CANVAS.style.backgroundColor = Dibujante.colorHSL(220, 70, 100);
let centroCanvas = { x: CANVAS.width / 2, y: CANVAS.height / 2 };
window.addEventListener("load", () => {
    let poligonoUno = Forma.poligono(centroCanvas.x, centroCanvas.y, 3, 150);
    let cuadradoDos = Forma.rectangulo(centroCanvas.x + 150, centroCanvas.y + 150, 170, 170);
    let circunferenciaTres = Forma.circunferencia(centroCanvas.x - 200, centroCanvas.y - 200, 100);
    let dibu = new Dibujante(CONTEXT);
    poligonoUno.color = Dibujante.colorHSL(120, 100, 50);
    cuadradoDos.color = "purple";
    circunferenciaTres.color = "yellow";
    dibu.opacidad = 0.4;
    function animar() {
        dibu.limpiarCanvas(CANVAS);
        poligonoUno.rotar(Geometria.gradoARadian(1));
        cuadradoDos.rotarSegunPunto(centroCanvas, Geometria.gradoARadian(-1));
        if (Colision.detectar(poligonoUno, cuadradoDos)) {
            cuadradoDos.color = "red";
        }
        else {
            cuadradoDos.color = "purple";
        }
        if (Colision.detectar(circunferenciaTres, cuadradoDos)) {
            circunferenciaTres.color = "red";
        }
        else {
            circunferenciaTres.color = "yellow";
        }
        poligonoUno.rellenar(dibu);
        cuadradoDos.rellenar(dibu);
        circunferenciaTres.rellenar(dibu);
        requestAnimationFrame(animar);
    }
    animar();
});
