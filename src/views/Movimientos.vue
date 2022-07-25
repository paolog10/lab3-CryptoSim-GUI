<script>
import { mapState } from "pinia"
import { useUserStore } from "../stores/userStore"
import { obtenerMontoFormateado } from "../helpers/formateoMonto"
import { obtenerFechaFormateada } from "../helpers/formateoFecha"
import IconEdit from "../components/icons/IconEdit.vue"
import IconDelete from "../components/icons/IconDelete.vue"

export default {
    computed: {
        ...mapState(useUserStore, ["historialTransacciones"])
    },

    methods: {
        obtenerMontoFormateado,
        obtenerFechaFormateada,

        ordenarHistorialPorFecha() {
            return this.historialTransacciones.sort(
                (a, b) => a["datetime"].localeCompare(b["datetime"]) * -1
            )
        }
    },

    components: {
        IconDelete,
        IconEdit,
    },
}
</script>

<template>
<div class="movimientos-view">
    <p v-if="!historialTransacciones" class="historial-cargando">Cargando...</p>

    <table v-else>
        <thead>
            <tr>
                <th></th>
                <th>Fecha</th>
                <th>Operación</th>
                <th class="smaller">Moneda</th>
                <th>Cantidad</th>
                <th>Monto</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="transaccion in ordenarHistorialPorFecha()">
                <td class="opciones-transaccion">
                    <button>
                        <IconDelete/>
                    </button>
                    <button>
                        <IconEdit/>
                    </button>
                </td>
                <td>{{ obtenerFechaFormateada(transaccion["datetime"]) }}</td>
                <td>
                    {{
                        transaccion["action"] === "purchase"
                        ? "Compra"
                        : "Venta"
                    }}
                </td>
                <td>{{ transaccion["crypto_code"].toUpperCase() }}</td>
                <td>{{ transaccion["crypto_amount"] }}</td>
                <td>{{ obtenerMontoFormateado(transaccion["money"]) }}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<style scoped>
* {
    font-family: 'Montserrat', sans-serif;
}

/*
  CORREGIR MÁS TARDE:
  Refactorizar mensaje de carga en componente para reutilizar en otras vistas,
  ya que la mayoría dependen de que el historial se encuentre cargado
*/
.historial-cargando {
    font-weight: 600;
    font-size: 2rem;
    outline: solid 5px #FF9C33;
    outline-offset: 1rem;
}

.movimientos-view {
    margin-top: 2.5rem;
    margin-bottom: auto;
    display: flex;
    justify-content: center;
}

table {
    table-layout: fixed;
    border-collapse: collapse;
    text-align: center;
    font-family: 'Montserrat';
    font-size: 1.2rem;
    width: 80%;
    background-color: inherit;
    margin-bottom: 2.5rem;
    right: 2.5rem;
    position: relative;
}

th {
    border-top: 1px solid #333;
    color: #111;
}

th, td {
    border-bottom: 1px solid #333;
    padding: 0.4rem 0;
}

thead th:nth-child(2), tbody td:nth-child(2) {
    border-left: 1px solid #333;
}

thead th:nth-child(6), tbody td:nth-child(6) {
    border-right: 1px solid #333;
}

thead th:nth-child(2) {
    width: 20%;
}

thead th:nth-child(3) {
    width: 18%;
}

thead th:nth-child(4) {
    width: 16%;
}

thead th:nth-child(1) {
    width: 5rem;
    border: unset;
    background-color: #eee;
}

table tr:nth-child(odd) td:not(.opciones-transaccion) {
    background-color: #ffd7ac;
}

.opciones-transaccion {
    visibility: hidden;
    border: unset;
    display: flex;
    justify-content: center;
}

tr:hover > .opciones-transaccion {
    visibility: visible;
}

button {
    border: unset;
    padding: unset;
    margin-right: 5px;
    cursor: pointer;
}

button:hover {
    stroke: #FF9C33;
}
</style>
