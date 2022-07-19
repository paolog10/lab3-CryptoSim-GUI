import { defineStore } from "pinia"
import axios from "axios"

export const useCoinDataStore = defineStore("coinData", {
    state: () => ({
        // Como usamos la api de CriptoYa para consultar las cotizaciones, ambas monedas
        // y exchanges aceptados por la app deben ser también soportados por CriptoYa

        // Se usa el "símbolo ticker" de cada moneda para identificarla
        monedasAceptadas: [
            "btc",
            "eth",
            "dai",
            "sol",
            "ada",
        ],

        /* 
        ** Cada propiedad es el nombre "normalizado" del exchange, es el que se
        ** usa para hacer llamadas a la api y también para identificar a cada exchange
        ** en el objeto 'cotizaciones'.
        ** nombreMostrado usa el formato oficial que usa el exchange en su sitio web, logo, etc.
        ** Así es como se muestra el nombre de exchange al usuario
        */
        exchanges: {
            argenbtc: {
                nombreMostrado: "Argenbtc",
                sitioWeb: "https://argenbtc.com/",
            },

            buenbit: {
                nombreMostrado: "Buenbit",
                sitioWeb: "https://app.buenbit.com/",
            },

            tiendacrypto: {
                nombreMostrado: "TiendaCrypto",
                sitioWeb: "https://tiendacrypto.com/",
            },
        },

        cotizaciones: {},
    }),

    actions: {
        async actualizarCotizaciones() {
            for (const moneda of this.monedasAceptadas) {
                const respuesta = await axios.get(`https://criptoya.com/api/${moneda}/ars`)
                const cotizacionesObtenidas = await respuesta.data

                // Para guardar las cotizaciones obtenidas de la moneda actual
                this.cotizaciones[moneda] = {}

                for (let exchange in this.exchanges) {
                    if (exchange in cotizacionesObtenidas) {
                        this.cotizaciones[moneda][exchange] = cotizacionesObtenidas[exchange]
                    }
                }
            }
        },
    }
})
