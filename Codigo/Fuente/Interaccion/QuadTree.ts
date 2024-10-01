/**
 * Inicio Quadtree
 */

import { Punto } from "../GeometriaPlana/Punto.js";
import { Forma } from "../GeometriaPlana/Formas.js"
import { Dibujante } from "../Renderizado/Dibujante.js";
import { Geometria } from "../Utiles/Geometria.js";
import { OpcionesForma } from "../GeometriaPlana/OpcionesForma.js";
import { Vector } from "../GeometriaPlana/Vector.js";
import { OpcionesGraficasForma } from "../Renderizado/OpcionesGraficasForma.js";

export class QuadTree {
    subDividido: boolean = false;
    puntos: Punto[] = [];
    puntosRepetidos: Punto[] = [];
    x: number;
    y: number;
    ancho: number;
    alto: number;
    capacidad: number;
    subDivisiones: QuadTree[] = [];
    contorno: Forma;
    constructor(x: number, y: number, ancho: number, alto: number, capacidad: number = 4) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.capacidad = capacidad;
        this.contorno = this.formaCuadrante();
    }

    /**Agrega un punto a un QuadTree. Si al agregar el punto se sobrepasa la capacidad del QuadTree, se subdivide en cuatro QuadTrees nuevos. */
    insertarPunto(punto: Punto): boolean {
        if (this.comprobarInsercion(punto)) {
            if (this.buscarPuntoRepetido(punto)) {
                this.puntosRepetidos.push(punto)
            }
            else if (this.puntos.length < this.capacidad) {
                this.puntos.push(punto)
            }
            else {
                if (!this.subDividido) {
                    let quadSurEste: QuadTree = new QuadTree(this.x + this.ancho / 2, this.y + this.alto / 2, this.ancho / 2, this.alto / 2, this.capacidad)
                    let quadSurOeste: QuadTree = new QuadTree(this.x, this.y + this.alto / 2, this.ancho / 2, this.alto / 2, this.capacidad)
                    let quadNorOeste: QuadTree = new QuadTree(this.x, this.y, this.ancho / 2, this.alto / 2, this.capacidad)
                    let quadNorEste: QuadTree = new QuadTree(this.x + this.ancho / 2, this.y, this.ancho / 2, this.alto / 2, this.capacidad)
                    this.subDivisiones.push(quadSurEste, quadSurOeste, quadNorOeste, quadNorEste)
                    this.puntos.forEach(puntoGuardado => {
                        quadSurEste.insertarPunto(puntoGuardado);
                        quadSurOeste.insertarPunto(puntoGuardado);
                        quadNorOeste.insertarPunto(puntoGuardado);
                        quadNorEste.insertarPunto(puntoGuardado);
                    })
                    this.subDividido = true;
                }
                if (this.subDivisiones[0].insertarPunto(punto)) { return true }
                else if (this.subDivisiones[1].insertarPunto(punto)) { return true }
                else if (this.subDivisiones[2].insertarPunto(punto)) { return true }
                else if (this.subDivisiones[3].insertarPunto(punto)) { return true }
            }
            return true;
        }
        return false;
    }

    comprobarInsercion(punto: Punto): boolean {
        if (punto.x >= this.x && punto.x <= this.x + this.ancho && punto.y >= this.y && punto.y <= this.y + this.alto) {
            return true;
        }
        return false;
    }

    trazar(dibujante: Dibujante, opciones?: OpcionesGraficasForma) {
        if (opciones) {
            this.contorno.estiloGrafico = opciones;
        }
        this.contorno.trazar(dibujante)
        if (this.subDivisiones.length > 0) {
            this.subDivisiones.forEach(sub => sub.trazar(dibujante, opciones))
        }
    }

    formaCuadrante(): Forma {
        const centroX: number = this.x + (this.ancho / 2)
        const centroY: number = this.y + (this.alto / 2)

        return Forma.rectangulo(centroX, centroY, this.ancho, this.alto)
    }

    buscarPuntoRepetido(punto: Punto): boolean {
        let coincidencia: boolean = false;
        this.puntos.forEach((puntoGuardado) => {
            if (punto.x == puntoGuardado.x && punto.y == puntoGuardado.y) {
                coincidencia = true
            }
        })
        return coincidencia
    }

    puntosEnRango(limiteIzquierda: number, limiteDerecha: number, limiteSuperior: number, limiteInferior: number): Punto[] {
        let PuntosDentroDelRango: Punto[] = [];
        this.puntos.forEach(punto => {
            if (punto.x >= limiteIzquierda && punto.x <= limiteDerecha && punto.y >= limiteSuperior && punto.y <= limiteInferior) {
                PuntosDentroDelRango.push(punto)
            }
        })
        this.puntosRepetidos.forEach(punto => {
            if (punto.x >= limiteIzquierda && punto.x <= limiteDerecha && punto.y >= limiteSuperior && punto.y <= limiteInferior) {
                PuntosDentroDelRango.push(punto)
            }
        })
        if (this.subDivisiones.length > 0) {
            this.subDivisiones.forEach(subdivision => {
                PuntosDentroDelRango.push(...subdivision.puntosEnRango(limiteIzquierda, limiteDerecha, limiteSuperior, limiteInferior))
            })
        }
        return PuntosDentroDelRango;
    }

}