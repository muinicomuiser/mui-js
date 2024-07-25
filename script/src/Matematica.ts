import { Punto } from "./Punto.js";

/**
 * MÓDULO MATEMÁTICO EN ESPAÑOL
 * 
 * Por agregar: floor, ceil, logaritmo, trigonometrías, exp, raizcuadrada, cuadrado, cubo, max, min, promedio.
 * POR CORREGIR: Reemplazar multiplicaciones por multiplicacionSegura, y las sumas también.
 */
export class Matematica{
    
    //CONSTANTES
    /**Retorna el valor de PI usando quince decimales.*/
    static get PI(): number{
        return 3.141592653589793;
    }
    
    
    /**Retorna el doble del valor de PI usando quince decimales.*/
    static get DOS_PI(): number{
        return Matematica.multiplicacionSegura(this.PI, 2);
    }
    
    
    /**Retorna el valor de PHI (número áureo) usando quince decimales*/
    static get PHI(): number{
        return 1.618033988749895;
    }


    /**Retorna el valor del número e usando quince decimales.*/
    static get e(): number{
        return 2.718281828459045;
    }


    /**Retorna la parte entera de cualquier número real.
     * 
     *ANOTACIÓN:
     *Para cualquier número con más de 15 decimales que podría ser aproximado al número superior, javascript
     *lo aproximará automáticamente. Pueden ocurrir cosas raras con más de 15 decimales.
    */
    static parteEntera(numero: number): number{
        let numeroPrueba: number = Matematica.sumaSegura(numero, - Matematica.parteDecimal(numero));
        return numeroPrueba;
        //ANOTACIÓN
        //Para cualquier número con más de 15 decimales que podría ser aproximado al número superior, typescript
        //lo aproximará automáticamente.
    }
    
    
    /**Retorna la parte decimal de cualquier número real.*/
    static parteDecimal(numero: number):number{
        let num: string = "0" + numero;
        num = num.split(".")[1];
        num = "0." + num;        
        if(numero < 0 && parseFloat(num) > 0){
            return -parseFloat(num)
        }
        return parseFloat(num);
    }
    
    
    /**Retorna 1 si el número es positivo, -1 si es negativo y 0 cuando el número es 0.*/
    static signo(numero: number): number{
        let signo: number;
        if(numero == 0){
            return 0;
        }
        return signo = numero > 0 ? 1 : -1;
    }


    /**Retorna la copia de un número con la cantidad de decimales especificada.
     * Solo acepta números entre 0 y 100.
    */
    static truncar(numero: number, decimales: number):number{
        if(decimales < 0){
            throw new Error("El método truncar solo acepta números entre 0 y 100")
        }
        // let dec: number = Matematica.parteEntera(decimales);
        let dec: number = Matematica.sumaSegura(decimales, - Matematica.parteDecimal(decimales));
        let numString: string = numero.toFixed(dec + 1);
        let num: number = parseFloat(numString.slice(0, -1));
        return num;
    }


    /**Retorna el valor absoluto de cualquier número real.*/
    static absoluto(numero: number): number{
        if(numero < 0){
            return -numero;
        }
        return numero;
    }


    /**Retorna un número truncado según la cantidad de decimales especificada, con la última cifra redondeada.*/
    static redondear(numero: number, decimales: number): number{
        let num: string = numero.toFixed(decimales + 1);
    
        if(num.slice(-1) == "5"){
            num += "6";
            num = parseFloat(num).toFixed(decimales + 1);
        }
        num = parseFloat(num).toFixed(decimales);
        return parseFloat(num);
    }


    /**Retorna true o false dependiendo de si los números ingresados son iguales o no.
     * Permite definir el nivel de tolerancia de comparación. Si no se define, se usa por
     * defecto el rango de Number.EPSILON (2.220446049250313e-16)
    */
    static comparar(a: number, b: number, tolerancia: number = Number.EPSILON){
        return (Matematica.absoluto(a - b) < tolerancia) 
    }


    /**Multiplica dos números. Evita comportamientos erráticos de javascript al multiplicar ciertos números, 
     * como el caso típico 0.1 * 0.2 = 0.020000000000000004;
    */
    static multiplicacionSegura(numero1: number, numero2: number): number{
        if(numero1 == 0 || numero2 == 0){
            return 0;
        }
        if(3*(numero1.toString(10).length + numero2.toString(10).length) < (numero1*numero2).toString(10).length){
            return ((numero1*10)*(numero2*10))/100;
        }
        return numero1*numero2;
    }


    /**Divide dos números. Evita comportamientos erráticos de javascript al dividir ciertos números, 
     * como el caso típico 0.02 / 0.1 = 0.19999999999999998;
    */
    static divisionSegura(numero1: number, numero2: number): number{
        if(numero1 == 0){
            return 0;
        }
        else if(numero2 == 0){
            throw new Error("El módulo Matematica no permite divisiones por cero");
        }
        else if((numero1.toString().length + numero2.toString().length) < (numero1/numero2).toString().length){
            // return (numero1*10) / (numero2*10)
            return (Matematica.multiplicacionSegura(numero1, 100)/(Matematica.multiplicacionSegura(numero2, 100)));
        }
        return numero1/numero2;
    }


    /**Suma dos números. Evita comportamientos erráticos de javascript al sumar ciertos números, 
     * como el caso típico 0.1 + 0.2 = 0.30000000000000004;
    */
    static sumaSegura(numero1: number, numero2: number): number{
        if((numero1.toString().length + numero2.toString().length) < (numero1 + numero2).toString().length){
            return ((numero1*10) + (numero2*10))/10;
        }
        return numero1 + numero2;
    }


    /**Retorna el resultado de elevar la base ingresada al exponente ingresado.*/
    static potencia(base: number, exponente: number){
        return base ** exponente;
    }


    /**Retorna la raíz enésima de un número. Solo trabaja con números reales.*/
    static raiz(radicando: number, indice: number): number{
        if(radicando < 0 && indice % 2 == 0){
            throw new Error("El método .raiz solo trabaja con números reales. No responde a la raíz par de un número negativo.")
        }
        return radicando **Matematica.divisionSegura(1, indice);
    }


    //GRADOS  
    /**Transforma grados sexagesimales a radianes.*/      
    static gradoARadian(grado: number): number{
        return Matematica.multiplicacionSegura(Matematica.divisionSegura(grado, 180), Matematica.PI);
        // return (grado / 180) * this.PI;
    }


    /**Transfoma radianes a grados sexagesimales.*/
    static radianAGrado(rad: number): number{
        return Matematica.multiplicacionSegura(Matematica.divisionSegura(rad, Matematica.PI), 180);
        // return (rad / this.PI)*180;
    }


    //PITAGÓRICA
    /**Retorna la longitud de la hipotenusa según la longitud de los dos catetos ingresados.*/
    static hipotenusa(cateto1: number, cateto2: number): number{
        let hipotenusa: number = Matematica.raiz(Matematica.sumaSegura(cateto1**2, cateto2**2), 2);
        return hipotenusa;
    }


    /**Retorna la longitud de un cateto según la longitud de la hipotenusa y del otro cateto.*/
    static cateto(hipotenusa: number, cateto: number){
        let cateto2: number = Matematica.raiz(hipotenusa**2 - cateto**2, 2);
        return cateto2;
    }


    //COORDENADAS
    /**Retorna el valor de la distancia entre dos puntos de un plano cartesiano.*/
    static distanciaEntrePuntos(puntoUno: Punto, puntoDos: Punto): number{
        let distancia = Matematica.hipotenusa(puntoDos.x - puntoUno.x, puntoDos.y - puntoUno.y);
        return distancia;
    }


    /**Retorna el punto medio entre dos puntos de un plano cartesiano.*/
    static puntoMedio(puntoUno: Punto, puntoDos: Punto): Punto{
        let puntoMedio: Punto = {x: puntoUno.x/2 + puntoDos.x/2, y: puntoUno.y/2 + puntoDos.y/2};
        return puntoMedio;
    }
}
