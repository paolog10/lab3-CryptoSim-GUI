<script>
import { mapState, mapActions } from "pinia"
import { useCoinDataStore } from "../stores/coinDataStore"
import { useUserStore } from "../stores/userStore"
import { obtenerMontoFormateado } from "../helpers/formateoMonto"
import CargandoCartel from "../components/CargandoCartel.vue"
import AvisoHistoralVacio from "../components/AvisoHistoralVacio.vue"

export default {
    data() {
        return {
            resultados: null,
        }
    },

    computed: {
        ...mapState(useUserStore, ["historialTransacciones", "cartera"]),
        ...mapState(useCoinDataStore, ["cotizaciones"]),

        totalResultados() {
            let total = 0
            for (const moneda in this.resultados) {
                total += this.resultados[moneda]
            }
            return total
        }
    },

    methods: {
        ...mapActions(useUserStore, ["valorizarCartera"]),
        obtenerMontoFormateado,

        cargarResultados() {
            const resultados = {}
            for (const transaccion of this.historialTransacciones) {
                if (!(transaccion["crypto_code"] in resultados)) {
                    resultados[transaccion["crypto_code"]] = 0
                }

                if (transaccion["action"] === "purchase") {
                    resultados[transaccion["crypto_code"]] -= transaccion["money"]
                }
                else {
                    resultados[transaccion["crypto_code"]] += transaccion["money"]
                }
            }

            // Sumar a resultados las posibles ganancias o pérdidas de vender
            // lo que queda en la cartera
            this.valorizarCartera(this.cotizaciones)
            for (const moneda in this.cartera) {
                resultados[moneda] += this.cartera[moneda].valor
            }

            this.resultados = resultados

            return resultados
        }
    },

    components: {
        CargandoCartel,
        AvisoHistoralVacio
    },
}
</script>

<template>
<div class="resultados-view">
    <CargandoCartel v-if="!historialTransacciones"/>
    <AvisoHistoralVacio v-else-if="historialTransacciones.length === 0"/>
    <template v-else>
        <table>
            <thead>
                <tr>
                    <th>Moneda</th>
                    <th>Resultado</th>
                </tr>
            </thead>
            <tbody v-if="this.cartera">
                <tr v-for="resultado, moneda in this.cargarResultados()">
                    <td>{{ moneda.toUpperCase() }}</td>
                    <td>
                        <span>{{ (resultado < 0) ? "-" : "+" }}</span>
                        {{ obtenerMontoFormateado(resultado) }}
                    </td>
                </tr>
                <tr>
                    <th>TOTAL</th>
                    <td>
                        <span>{{ (totalResultados < 0) ? "-" : "+" }}</span>
                        {{ obtenerMontoFormateado(totalResultados) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </template>

</div>
</template>

<style scoped>
* {
    font-family: 'Montserrat', sans-serif;
}
.resultados-view {
    margin-top: 4.5rem;
    margin-bottom: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

table {
    table-layout: fixed;
    border-collapse: collapse;
    text-align: center;
    font-size: 1.2rem;
    width: 40%;
    border-left: solid 1px #333;
    border-right: solid 1px #333;
}

th {
    border-top: 1px solid #333;
    color: #111;
}

th, td {
    border-bottom: 1px solid #333;
    padding: 0.4rem 0;
}

tbody tr:nth-child(odd) {
    background-color: #ffd7ac;
}


.historial-vacio {
    position: absolute;
    top: 40%;
}

@media (max-width: 700px) {
    table {
        width: 75%;
    }
}
</style>
