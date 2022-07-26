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
        },

        async eliminarTransaccion(transaccion) {
            this.estadoTransaccionEliminandose = "procesando"
            const respuesta = await apiTransacciones.delete(`transactions/${transaccion["_id"]}`)
            this.estadoTransaccionEliminandose = (respuesta.status === 200) ? "aceptada" : "rechazada"

            this.historialTransacciones = this.historialTransacciones
                .filter(transaccionRegistrada => transaccionRegistrada["_id"] !== transaccion["_id"])

            this.cargarCartera()
        },
    }
})
