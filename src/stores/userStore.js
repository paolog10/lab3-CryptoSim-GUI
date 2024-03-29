import { defineStore } from "pinia"
import axios from "axios"
import Decimal from "decimal.js"

const apiTransacciones = axios.create({
    baseURL: "https://laboratorio3-f36a.restdb.io/rest",
    headers: {
        // Recordatorio: Las claves no deberían ser públicas, pero para este TP
        // no creo que importe mucho.
        "x-apikey": "60eb09146661365596af552f"
    }
})

export const useUserStore = defineStore('user', {
    state: () => ({
        // Defaultea a 'null' si no hay sesión abierta
        username: localStorage.getItem('username'),
        historialTransacciones: null,
        estadoTransaccionRegistrandose: null,
        estadoTransaccionEliminandose: null,
        estadoTransaccionEditandose: null,
        cartera: null,
    }),

    actions: {
        login(username, mantenerSesionAbierta) {
            this.username = username
            this.cargarHistorialTransacciones()
                .then(() => this.cargarCartera())

            if (mantenerSesionAbierta) {
                localStorage.setItem('username', username)
            }
        },

        logout() {
            this.historialTransacciones = null
            this.cartera = null
            this.username = null
            localStorage.removeItem('username')
        },

        async cargarHistorialTransacciones() {
            const respuesta = await apiTransacciones.get("transactions", {
                params: {
                    q: `{"user_id": "${this.username}"}`
                }
            })

            this.historialTransacciones = await respuesta.data
        },

        async registrarTransaccion(transaccion) {
            this.estadoTransaccionRegistrandose = "procesando"
            const respuesta = await apiTransacciones.post("transactions", transaccion)
            this.estadoTransaccionRegistrandose = (respuesta.status === 201) ? "aceptada" : "rechazada"

            const transaccionRegistrada = {
                "_id": respuesta.data["_id"],
                "crypto_code": respuesta.data["crypto_code"],
                "crypto_amount": respuesta.data["crypto_amount"],
                "user_id": respuesta.data["user_id"],
                "action": respuesta.data["action"],
                "datetime": respuesta.data["datetime"],
                "money": respuesta.data["money"],
            }

            // Mantener historial actualizado para no tener que llamar de nuevo a la API
            this.historialTransacciones.push(transaccionRegistrada)
            this.cargarCartera()
        },

        cargarCartera() {
            this.cartera = {}
            for (const transaccion of this.historialTransacciones) {
                if (!(transaccion["crypto_code"] in this.cartera)) {
                    this.cartera[transaccion["crypto_code"]] = {
                        cantidad: 0,
                    }
                }

                // Se usa Decimal para poder sumar numeros decimales con mayor precisión
                // Ejemplo: evitar que operaciones como 0.4 + 0.2 resulten en 0.6000000000000001
                const cantidadActual = new Decimal(this.cartera[transaccion["crypto_code"]].cantidad)
                const cantidadTransaccion = new Decimal(transaccion["crypto_amount"])
                if (transaccion["action"] === "purchase") {
                    this.cartera[transaccion["crypto_code"]].cantidad = cantidadActual
                        .plus(cantidadTransaccion)
                        .toNumber()
                }
                else {
                    this.cartera[transaccion["crypto_code"]].cantidad = cantidadActual
                        .minus(cantidadTransaccion)
                        .toNumber()
                }
            }

            /*
            Ya que se agregan las monedas al objeto cartera a medida que se compran,
            estas también se eliminan de la cartera si la cantidad se reduce a 0
            */
            for (const moneda in this.cartera) {
                if (this.cartera[moneda].cantidad === 0) {
                    delete this.cartera[moneda]
                }
            }
        },

        async eliminarTransaccion(transaccion) {
            this.estadoTransaccionEliminandose = "procesando"
            const respuesta = await apiTransacciones.delete(`transactions/${transaccion["_id"]}`)
            this.estadoTransaccionEliminandose = (respuesta.status === 200) ? "aceptada" : "rechazada"

            this.historialTransacciones = this.historialTransacciones
                .filter(transaccionRegistrada => transaccionRegistrada["_id"] !== transaccion["_id"])

            this.cargarCartera()
        },

        async editarTransaccion(transaccionEditada) {
            this.estadoTransaccionEditandose = "procesando"
            const respuesta = await apiTransacciones.patch(
                `transactions/${transaccionEditada["_id"]}`,
                transaccionEditada
            )
            this.estadoTransaccionEditandose = (respuesta.status === 200) ? "aceptada" : "rechazada"

            // Modificar transaccion correspondiente en el historial
            const posicionTransaccion = this.historialTransacciones.findIndex(
                transaccion => transaccion["_id"] === transaccionEditada["_id"]
            )

            // En el historial, datetime se guarda con el formato que usa la API
            transaccionEditada["datetime"] = respuesta.data["datetime"]

            this.historialTransacciones[posicionTransaccion] = transaccionEditada
            this.cargarCartera()
        },

        reiniciarEstados() {
            this.estadoTransaccionRegistrandose = null
            this.estadoTransaccionEditandose = null
            this.estadoTransaccionEliminandose = null
        },

        valorizarCartera(cotizaciones) {
            for (const moneda in this.cartera) {
                // Se usa el primer exchange que se encuentre para la moneda
                // Podría mejorarse para usar el exchange mejor cotizado
                const nombreExchange = Object.keys(cotizaciones[moneda])[0]
                const cotizacion = Math.round(cotizaciones[moneda][nombreExchange].totalBid)

                this.cartera[moneda].valor = this.cartera[moneda].cantidad * cotizacion
                this.cartera[moneda].exchangeConsultado = nombreExchange
            }

            return this.cartera
        }
    }
})
