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
        cartera: {},
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
            this.cartera = {}
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

        async registrarTransaccion(datos) {
            this.estadoTransaccionRegistrandose = "procesando"
            const respuesta = await apiTransacciones.post("transactions", datos)
            this.estadoTransaccionRegistrandose = (respuesta.status === 201) ? "aceptada" : "rechazada"

            const transaccion = {
                "_id": respuesta.data["_id"],
                "crypto_code": respuesta.data["crypto_code"],
                "crypto_amount": respuesta.data["crypto_amount"],
                "user_id": respuesta.data["user_id"],
                "action": respuesta.data["action"],
                "datetime": respuesta.data["datetime"]
            }

            // Mantener historial actualizado para no tener que llamar de nuevo a la API
            this.historialTransacciones.push(transaccion)
            this.actualizarCartera(transaccion)
        },

        cargarCartera() {
            for (const transaccion of this.historialTransacciones) {
                this.actualizarCartera(transaccion, "registra")
            }
        },

        /*
        ** La cartera se actualiza según como la transacción altere al historial
        ** comoAlteraHistorial: "registra" o "elimina" (string)
        */
        actualizarCartera(transaccion, comoAlteraHistorial) {
            if (!["registra", "elimina"].includes(comoAlteraHistorial)) {
                throw new Error('Indicar cómo la transacción altera al historial pasando uno de los argumentos:\n' +
                    '"registra": Nueva transacción que se agrega al historial\n' +
                    '"elimina": Transacción ya existente que se elimina del historial'
                )
            }

            if (!(transaccion["crypto_code"] in this.cartera)) {
                this.cartera[transaccion["crypto_code"]] = {
                    cantidad: 0,
                }
            }

            // Se usa Decimal para poder sumar numeros decimales con mayor precisión
            // Ejemplo: evitar que operaciones como 0.4 + 0.2 resulten en 0.6000000000000001
            const cantidadActual = new Decimal(this.cartera[transaccion["crypto_code"]].cantidad)
            const cantidadTransaccion = new Decimal(transaccion["crypto_amount"])
            if (
                transaccion["action"] === "purchase" && comoAlteraHistorial === "registra"
                || transaccion["action"] === "sale" && comoAlteraHistorial === "elimina"
            ) {
                this.cartera[transaccion["crypto_code"]].cantidad = cantidadActual
                    .plus(cantidadTransaccion)
                    .toNumber()
            }
            else {
                this.cartera[transaccion["crypto_code"]].cantidad = cantidadActual
                    .minus(cantidadTransaccion)
                    .toNumber()
            }
        },
    }
})
