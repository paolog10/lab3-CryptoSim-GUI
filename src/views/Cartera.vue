<script>
import { mapState, mapActions } from "pinia"
import { useCoinDataStore } from "../stores/coinDataStore"
import { useUserStore } from "../stores/userStore"
import CargandoCartel from "../components/CargandoCartel.vue"
import { obtenerMontoFormateado } from "../helpers/formateoMonto"

export default {
    computed: {
        ...mapState(useCoinDataStore, ["cotizaciones", "exchanges"]),
        ...mapState(useUserStore, ["cartera", "historialTransacciones"]),

        valorTotalCartera() {
            let total = 0
            for (const moneda in this.cartera) {
                total += this.cartera[moneda].valor
            }

            return total
        },
    },

    methods: {
        ...mapActions(useUserStore, ["valorizarCartera"]),
        obtenerMontoFormateado,
    },

    components: {
        CargandoCartel,
    },
}
</script>

<template>
<div class="cartera-view">
    <CargandoCartel v-if="!historialTransacciones"/>
    <div
        v-else-if="valorTotalCartera === 0"
        class="cartera-vacia"
    >
        <p>Tu cartera se encuentra vacía</p>
        <p>Realiza algunas transacciones para usar esta función</p>
    </div>

    <template v-else>
        <table>
            <thead>
                <tr>
                    <th>Exchange consultado</th>
                    <th>Moneda</th>
                    <th>Cantidad</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="datos, moneda in valorizarCartera(cotizaciones)">
                    <td>
                        <a
                            :href="exchanges[datos.exchangeConsultado].sitioWeb"
                            target="_blank"
                        >
                            {{ exchanges[datos.exchangeConsultado].nombreMostrado }}
                        </a>
                    </td>
                    <td>{{ moneda.toUpperCase() }}</td>
                    <td>{{ datos.cantidad }}</td>
                    <td>{{ obtenerMontoFormateado(datos.valor) }}</td>

                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <th>TOTAL</th>
                    <td>{{ obtenerMontoFormateado(valorTotalCartera) }}</td>
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

.cartera-view {
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
    width: 50%;
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

.cartera-vacia {
    font-size: 1.8rem;
    text-align: center;
    padding: 0 1rem;
    position: absolute;
    top: 40%;
}

.cartera-vacia p {
    margin: 1rem 0;
}

a {
    color: #222;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

@media (max-width: 700px) {
    table {
        width: 75%;
        font-size: 0.8rem;
    }
}
</style>
