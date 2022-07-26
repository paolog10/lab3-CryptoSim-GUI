<script>
import { mapState, mapActions, mapWritableState } from "pinia"
import { useUserStore } from "../stores/userStore"
import { obtenerMontoFormateado } from "../helpers/formateoMonto"
import { obtenerFechaFormateada } from "../helpers/formateoFecha"
import IconEdit from "../components/icons/IconEdit.vue"
import IconDelete from "../components/icons/IconDelete.vue"

export default {
    data() {
        return {
            intentoEliminarTransaccionInvalido: false,
        }
    },

    computed: {
        ...mapState(useUserStore, ["historialTransacciones", "cartera"]),
        ...mapWritableState(useUserStore, ["estadoTransaccionEliminandose"]),
    },

    methods: {
        ...mapActions(useUserStore, ["eliminarTransaccion"]),
        obtenerMontoFormateado,
        obtenerFechaFormateada,

        ordenarHistorialPorFecha() {
            return this.historialTransacciones.sort(
                (a, b) => a["_id"].localeCompare(b["_id"]) * -1
            )
        },

        sePuedeEliminarTransaccion(transaccion) {
            if (
                transaccion["action"] === "purchase"
                && (this.cartera[transaccion["crypto_code"]].cantidad - transaccion["crypto_amount"]) < 0
            ) {
                return false
            }

            return true
        },

        intentarEliminarTransaccion(transaccion) {
            if (!this.sePuedeEliminarTransaccion(transaccion)) {
                return this.intentoEliminarTransaccionInvalido = true
            }

            this.intentoEliminarTransaccionInvalido = false
            this.eliminarTransaccion(transaccion)
        },
    },

    components: {
        IconDelete,
        IconEdit,
    },

    mounted() {
        this.estadoTransaccionEliminandose = null
    }
}
</script>

<template>
<div class="movimientos-view">
    <p v-if="!historialTransacciones" class="historial-cargando">Cargando...</p>

    <div
        v-else-if="historialTransacciones.length === 0"
        class="historial-vacio"
    >
        <p>No tenés transacciones registradas</p>
        <p>Realiza una en la pestaña "Tradear" para poder utilizar esta función</p>
    </div>

    <template v-else>
        <div class="eliminar-feedback">
            <p v-if="intentoEliminarTransaccionInvalido">
                No se puede eliminar: las ventas posteriores serían inválidas
            </p>
            <p v-else-if="estadoTransaccionEliminandose === 'procesando'">
                Eliminando transacción...
            </p>
            <p v-else-if="estadoTransaccionEliminandose === 'aceptada'">
                Transacción eliminada
            </p>
            <p v-else-if="estadoTransaccionEliminandose === 'rechazada'">
                Error: no se pudo eliminar la transacción
            </p>
        </div>
        <table>
            <thead>
                <tr>
                    <!--
                      El th vacío es para la columna que contiene a los botones
                      para eliminar o editar transacciones
                    -->
                    <th></th>
                    <th>Fecha</th>
                    <th>Operación</th>
                    <th>Moneda</th>
                    <th>Cantidad</th>
                    <th>Monto</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="transaccion in ordenarHistorialPorFecha()"
                >
                    <td class="opciones-transaccion">
                        <button
                            :disabled="estadoTransaccionEliminandose === 'procesando'"
                            @click="intentarEliminarTransaccion(transaccion)"
                        >
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
    </template>
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
    position: absolute;
    top: 40vh;
}

.historial-vacio {
    font-size: 2rem;
    text-align: center;
    position: absolute;
    top: 40vh;
}

.historial-vacio p {
    margin: 1rem 0;
}

.movimientos-view {
    margin-top: 2.5rem;
    margin-bottom: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
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

button:disabled {
    cursor: default;
    fill: gray;
    stroke: gray;
}

.eliminar-feedback {
    height: 2rem;
}

.eliminar-feedback p {
    margin: 0;
    font-size: 1.2rem;
}
</style>
