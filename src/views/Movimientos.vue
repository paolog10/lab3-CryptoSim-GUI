<script>
import { mapState, mapActions, mapWritableState } from "pinia"
import { useUserStore } from "../stores/userStore"
import { useCoinDataStore } from "../stores/coinDataStore"
import { useTransactionInputs } from "../composables/transactionInputs"
import { obtenerMontoFormateado } from "../helpers/formateoMonto"
import { obtenerFechaFormateada } from "../helpers/formateoFecha"
import IconEdit from "../components/icons/IconEdit.vue"
import IconDelete from "../components/icons/IconDelete.vue"
import IconCheck from "../components/icons/IconCheck.vue"
import IconCancel from "../components/icons/IconCancel.vue"
import CargandoCartel from "../components/CargandoCartel.vue"
import AvisoHistoralVacio from "../components/AvisoHistoralVacio.vue"

export default {
    setup() {
        return {
            ...useTransactionInputs()
        }
    },

    data() {
        return {
            intentoEliminarTransaccionInvalido: false,
            transaccionSeleccionada: null,
        }
    },

    computed: {
        ...mapState(useCoinDataStore, ["monedasAceptadas"]),
        ...mapState(useUserStore, ["historialTransacciones", "cartera"]),
        ...mapWritableState(useUserStore, ["estadoTransaccionEliminandose", "estadoTransaccionEditandose"]),

        transaccionEditada() {
            return {
                "_id": this.transaccionSeleccionada["_id"],
                "action": this.tipoDeOperacion,
                "crypto_code": this.monedaSeleccionada,
                "crypto_amount": this.cantidadMoneda,
                "money": this.monto,
                "datetime": this.fechaSeleccionada.replace("T", " ")
            }
        }
    },

    methods: {
        ...mapActions(useUserStore, ["eliminarTransaccion", "editarTransaccion", "reiniciarEstados"]),
        obtenerMontoFormateado,
        obtenerFechaFormateada,

        ordenarHistorialPorFecha() {
            return this.historialTransacciones.sort(
                (a, b) => {
                    // "Desempatar" con el id si las fechas son iguales
                    if (a["datetime"] === b["datetime"]) {
                        return b["_id"].localeCompare(a["_id"])
                    }

                    return b["datetime"].localeCompare(a["datetime"])
                }
            )
        },

        sePuedeEliminarTransaccion(transaccion) {
            if (
                transaccion["action"] === "purchase"
                && ((this.cartera[transaccion["crypto_code"]]?.cantidad ?? 0) - transaccion["crypto_amount"]) < 0
            ) {
                return false
            }

            return true
        },

        intentarEliminarTransaccion() {
            this.reiniciarEstados()

            if (!this.sePuedeEliminarTransaccion(this.transaccionSeleccionada)) {
                return this.intentoEliminarTransaccionInvalido = true
            }

            this.intentoEliminarTransaccionInvalido = false
            this.eliminarTransaccion(this.transaccionSeleccionada)
            this.deseleccionarTransaccion()
        },

        intentarEditarTransaccion(transaccionEditada) {
            this.reiniciarEstados()

            if (
                !this.esCantidadMonedaValida
                || !this.esMontoValido
                || !this.esFechaValida
            ) {
                return false
            }

            this.editarTransaccion(transaccionEditada)
            this.deseleccionarTransaccion()
        },

        seleccionarTransaccion(transaccion) {
            if (this.transaccionSeleccionada === transaccion) {
                return
            }
            this.transaccionSeleccionada = transaccion
            this.transaccionSeleccionada.editandose = false;

        },

        deseleccionarTransaccion() {
            this.transaccionSeleccionada = null
        },

        permitirEditar() {
            this.transaccionSeleccionada.editandose = true
            this.setInputs({
                tipoDeOperacion: this.transaccionSeleccionada["action"],
                monedaSeleccionada: this.transaccionSeleccionada["crypto_code"],
                cantidadMoneda: this.transaccionSeleccionada["crypto_amount"],
                monto: this.transaccionSeleccionada["money"],
                fechaSeleccionada: this.transaccionSeleccionada["datetime"].substring(0, 16),
                transaccionInvalida: false
            })
        },
    },

    components: {
        IconDelete,
        IconEdit,
        IconCheck,
        IconCancel,
        CargandoCartel,
        AvisoHistoralVacio,
    },

    mounted() {
        this.reiniciarEstados()
    }
}
</script>

<template>
<div class="movimientos-view">
    <CargandoCartel v-if="!historialTransacciones"/>
    <AvisoHistoralVacio class="historial-vacio" v-else-if="historialTransacciones.length === 0"/>

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
            <p v-else-if="estadoTransaccionEditandose === 'procesando'">
                Editando transacción...
            </p>
            <p v-else-if="estadoTransaccionEditandose === 'aceptada'">
                Transacción editada
            </p>
            <p v-else-if="estadoTransaccionEditandose === 'rechazada'">
                Error: no se pudo editar la transacción
            </p>
        </div>

        <div class="movimientos-container">
            <div
                class="movimientos-menu"
                :class="{ visible: transaccionSeleccionada }"
            >
                <div class="menu-actions">
                    <button @click="intentarEliminarTransaccion()">
                        <IconDelete/>
                    </button>

                    <button @click="permitirEditar()">
                        <IconEdit/>
                    </button>
                </div>

                <div
                    class="confirm-cancel"
                    :class="{visible: transaccionSeleccionada?.editandose}"
                >
                    <button @click="intentarEditarTransaccion(transaccionEditada)">
                        <IconCheck/>
                    </button>

                    <button @click="deseleccionarTransaccion">
                        <IconCancel/>
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
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
                        class="transaccion-fila"
                        :class="{
                            'transaccion-seleccionada': transaccion === transaccionSeleccionada,
                            disabled: [estadoTransaccionEliminandose, estadoTransaccionEditandose]
                                    .includes('procesando')
                        }"
                        @click="seleccionarTransaccion(transaccion)"

                    >
                        <template
                            v-if="
                                transaccion['_id'] !== this.transaccionSeleccionada?.['_id']
                                || transaccion['_id'] === this.transaccionSeleccionada?.['_id']
                                && !this.transaccionSeleccionada.editandose
                            "
                        >
                            <td>
                            {{ obtenerFechaFormateada(transaccion["datetime"]) }}
                            </td>
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
                        </template>

                        <template v-else>

                            <!--PENDIENTE: validar cantidad al vender-->
                            <td>
                                <input
                                    class="input-fecha"
                                    type="datetime-local"
                                    v-model="fechaSeleccionada"
                                >
                                <div
                                    v-if="!esFechaValida"
                                    class="relative-container"
                                >
                                    <div class="ingresado-feedback fecha-feedback">
                                        Debe ser igual o previo a la fecha actual
                                    </div>
                                </div>
                            </td>
                            <td>
                                <select
                                    name="operaciones"
                                    v-model="tipoDeOperacion"
                                >
                                    <option value="purchase">Compra</option>
                                    <option
                                        value="sale"
                                        :selected="transaccion['action'] === 'sale'"
                                    >
                                        Venta
                                    </option>
                                </select>
                            </td>
                            <td>
                                <select
                                    name="coins"
                                    v-model="monedaSeleccionada"
                                >
                                    <option
                                        v-for="moneda in monedasAceptadas"
                                        :value="moneda"
                                        :selected="transaccion['crypto_code'] === moneda"
                                    >
                                        {{ moneda.toUpperCase() }}
                                    </option>
                                </select>
                            </td>
                            <td>
                                <input
                                    class="input-numero"
                                    type="number"
                                    step="any"
                                    v-model="cantidadMoneda"
                                >
                                <div
                                    v-if="!esCantidadMonedaValida"
                                    class="relative-container"
                                >
                                    <div class="ingresado-feedback cantidad-feedback">
                                        Debe ser mayor a 0
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="signo-monto">$</span>
                                <input
                                    class="input-numero"
                                    type="number"
                                    v-model="monto"
                                >
                                <div
                                    v-if="!esMontoValido"
                                    class="relative-container"
                                >
                                    <div class="ingresado-feedback monto-feedback">
                                        Debe ser un entero mayor a 0
                                    </div>
                                </div>
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
    </template>
</div>
</template>

<style scoped>
* {
    font-family: 'Montserrat', sans-serif;
}

.movimientos-view {
    margin-top: 2.5rem;
    margin-bottom: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.movimientos-container {
    width: 70%;
}

.movimientos-menu {
    display: flex;
    visibility: hidden;
    justify-content: space-between;
    padding: 0 1%;
}

.confirm-cancel {
    visibility: hidden;
}

.visible {
    visibility: visible;
}

table {
    table-layout: fixed;
    border-collapse: collapse;
    text-align: center;
    font-size: 1.2rem;
    width: 100%;
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

.confirmar-edicion {
    border: unset;
}

button {
    border: unset;
    padding: unset;
    margin-right: 5px;
    cursor: pointer;
    background-color: transparent;
}

button:hover {
    stroke: #FF9C33;
}

.disabled {
    cursor: default;
    fill: gray;
    stroke: gray;
    pointer-events: none;
    color: gray;
}

.eliminar-feedback {
    height: 2rem;
}

.eliminar-feedback p {
    margin: 0;
    font-size: 1.2rem;
}

.signo-monto {
    font-size: 0.8rem;
    margin-right: 0.2rem;
}

.relative-container {
    position: relative;
}

.ingresado-feedback {
    position: absolute;
    top: 5px;
    width: 13rem;
    color: white;
    background-color: #222;
    border: solid 1px white;
    outline: solid 1px #222;
    font-size: 0.8rem;
    padding: 2px;
}

.fecha-feedback {
    left: 9%;
}

.cantidad-feedback {
    left: 1%;
}

.monto-feedback {
    left: 3%;
}

.transaccion-fila:hover {
    cursor: pointer;
}

.transaccion-fila:nth-child(odd):hover {
    background-color: #fdc27d;
}

.transaccion-fila:nth-child(even):hover {
    background-color: rgb(250, 250, 250);
}

.transaccion-seleccionada {
    font-weight: bold;
}

.historial-vacio {
    position: absolute;
    top: 40%;
}

.input-numero {
    width: 60%;
}

@media (max-width: 1100px) {
    .movimientos-container {
        width: 95%;
    }

    table {
        font-size: 0.9rem;
    }
}

@media (min-width: 500px) and (max-width: 615px) {
    table {
        font-size: 0.7rem;
    }
}

@media (max-width: 499px) {
    table {
        font-size: 0.5rem;
    }
}
</style>
