//Interfaz de punto, hay muchas funciones que reciben indistintamente coordendas como puntos y vectores.

import { Forma } from "./Formas";

export interface Punto {
    x: number,
    y: number,
    id?: number,
    contenido?: Forma
}