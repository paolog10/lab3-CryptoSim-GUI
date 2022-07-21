import { defineStore } from "pinia"
import axios from "axios"

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
        estadoUltimaTransaccion: null,
    }),

    actions: {
        login(username, mantenerSesionAbierta) {
            this.username = username

            if (mantenerSesionAbierta) {
                localStorage.setItem('username', username)
            }
        },

        logout() {
            this.username = null;
            localStorage.removeItem('username');
        },

        async actualizarHistorialTransacciones() {
            const respuesta = await apiTransacciones.get("transactions", {
                params: {
                    q: `{"user_id": "${this.username}"}`
                }
            })

            this.historialTransacciones = await respuesta.data
        },

        async registrarTransaccion(datos) {
            this.estadoUltimaTransaccion = "procesando"
            const respuesta = await apiTransacciones.post("transactions", datos)
            this.estadoUltimaTransaccion = (respuesta.status === 201) ? "aceptada" : "rechazada"
        }
    }
})
