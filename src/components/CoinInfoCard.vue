<script>
import { mapState, mapActions } from "pinia"
import { useCoinDataStore } from "../stores/coinDataStore"
import { obtenerMontoFormateado } from "../helpers/formateoMonto"

export default {
    data() {
        return {
            // Moneda por defecto será siempre la primera en la lista de monedas aceptadas
            monedaSeleccionada: useCoinDataStore().monedasAceptadas[0],
        }
    },

    computed: {
        ...mapState(useCoinDataStore, ["cotizaciones", "exchanges", "monedasAceptadas"]),
    },

    methods: {
        ...mapActions(useCoinDataStore, ["actualizarCotizaciones"]),
        obtenerMontoFormateado,
    },

    mounted() {
        this.actualizarCotizaciones()
    },
}
</script>

<template>
<div class="coin-info-card">
    <table>
        <thead>
            <tr>
                <th colspan="3">
                    <label>
                        <select
                            name="coins"
                            v-model="monedaSeleccionada"
                        >
                            <option
                                selected
                                :value="moneda"
                                v-for="moneda in monedasAceptadas"
                            >
                                {{ moneda.toUpperCase() }}
                            </option>
                        </select>
                    </label>
                </th>
            </tr>
            <tr>
                <th>
                    EXCHANGE
                </th>
                <th>
                    COMPRA
                </th>
                <th>
                    VENTA
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(cotizacion, exchange) in cotizaciones[monedaSeleccionada]">
                <template v-if="cotizaciones[monedaSeleccionada]?.[exchange]">
                    <td>
                        <a
                            :href="exchanges[exchange].sitioWeb"
                            target="_blank"
                        >
                            {{ exchanges[exchange].nombreMostrado }}
                        </a>
                    </td>

                    <td>{{ obtenerMontoFormateado(cotizacion.totalAsk) }}</td>
                    <td>{{ obtenerMontoFormateado(cotizacion.totalBid) }}</td>
                </template>
            </tr>
        </tbody>
    </table>
</div>
</template>

<style scoped>
.coin-info-card {
    background-color: whitesmoke;
    border: 4px solid #FF9C33;
    border-radius: 0.6rem;
}

table {
    table-layout: fixed;
    border-collapse: collapse;
    text-align: center;
    font-family: 'Montserrat';
    font-size: 1.2rem;
    width: 33rem;
}

th, td {
    border-bottom: 1px solid #333;
    padding: 0.5rem 2rem;
}

tr:last-child td {
    border: unset;
}

select {
    font: inherit;
    background-color: inherit;
    border: none;
    outline: none;
    cursor: pointer;
}

a {
    color: #222;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>
