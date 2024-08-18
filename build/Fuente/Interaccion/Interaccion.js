//Interacciones entre cuerpos.
import { Cinematica } from "../Fisicas/Cinematica.js";
import { Vector } from "../GeometriaPlana/Vector.js";
import { Geometria } from "../Utiles/Geometria.js";
import { Colision } from "./Colision.js";
export class Interaccion {
    /**Retorna una copia del conjunto de cuerpos con la resolución de rebote para cuerpos que han colisionado.      */
    static reboteEntreCuerpos(cuerpos) {
        let cuerposRebotados = [];
        for (let i = 0; i < cuerpos.length - 1; i++) {
            for (let j = i + 1; j < cuerpos.length; j++) {
                if (Colision.detectar(cuerpos[i], cuerpos[j])) {
                    let normales = Colision.normalesContacto(cuerpos[i], cuerpos[j]);
                    cuerpos[i].velocidad = Cinematica.reboteSimple(cuerpos[i], normales[1]);
                    cuerpos[j].velocidad = Cinematica.reboteSimple(cuerpos[j], normales[0]);
                    cuerpos[i].posicion = Vector.suma(cuerpos[i].posicion, Interaccion.resolverSolapamiento(cuerpos[i], cuerpos[j], normales[1]));
                    cuerpos[j].posicion = Vector.suma(cuerpos[j].posicion, Interaccion.resolverSolapamiento(cuerpos[j], cuerpos[i], normales[0]));
                }
            }
            cuerposRebotados.push(cuerpos[i]);
        }
        cuerposRebotados.push(cuerpos[cuerpos.length - 1]);
        return cuerpos;
        // return cuerposRebotados;
    }
    static resolverSolapamiento(cuerpoUno, cuerpoDos, normal) {
        let vectorDesplazamiento = Vector.normalizar(normal);
        let solapamiento = (cuerpoDos.radio + cuerpoUno.radio) - Geometria.distanciaEntrePuntos(cuerpoDos.posicion, cuerpoUno.posicion);
        if (cuerpoDos.fijo) {
            vectorDesplazamiento = Vector.escalar(vectorDesplazamiento, solapamiento);
            return vectorDesplazamiento;
        }
        vectorDesplazamiento = Vector.escalar(vectorDesplazamiento, 0.5 * solapamiento);
        return vectorDesplazamiento;
    }
    /**Retorna una copia del conjunto de circunferencias con la resolución de rebote para cuerpos que han colisionado con los bordes de un entorno.      */
    static reboteCircunferenciasConEntorno(circunferencias, entorno) {
        let cuerposRebotados = [];
        for (let i = 0; i < circunferencias.length; i++) {
            let solapamiento = Colision.circunferenciaEntorno(circunferencias[i], entorno);
            if (solapamiento != null) {
                let normal = Colision.normalContactoConEntorno(circunferencias[i], entorno);
                let normalInvertida = Vector.invertir(normal);
                circunferencias[i].velocidad = Cinematica.reboteSimple(circunferencias[i], normalInvertida);
                circunferencias[i].posicion = Vector.suma(circunferencias[i].posicion, Interaccion.resolverSolapamientoEntorno(normalInvertida, solapamiento));
            }
            cuerposRebotados.push(circunferencias[i]);
        }
        return cuerposRebotados;
    }
    static resolverSolapamientoEntorno(normal, solapamiento) {
        let vectorDesplazamiento = Vector.normalizar(normal);
        vectorDesplazamiento = Vector.escalar(vectorDesplazamiento, 1 * solapamiento);
        return vectorDesplazamiento;
    }
}