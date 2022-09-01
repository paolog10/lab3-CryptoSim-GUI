<script>
import { mapActions, mapState, mapWritableState } from "pinia"
import { useCoinDataStore } from "../stores/coinDataStore"
import { useUserStore } from "../stores/userStore"
import { obtenerFechaActual } from "../helpers/fechaActual"
import { useTransactionInputs } from "../composables/transactionInputs"

export default {
    setup() {
        return {
            ...useTransactionInputs()
        }
    },

    data() {
        return {
            inputsDefault: {
                tipoDeOperacion: "purchase",
                monedaSeleccionada: useCoinDataStore().monedasAceptadas[0],
                cantidadMoneda: null,
                monto: null,
                fechaSeleccionada: null,
                transaccionInvalida: false,
            },
        }
    },

    computed: {
        ...mapState(useCoinDataStore, ["monedasAceptadas"]),
        ...mapState(useUserStore, ["username", "historialTransacciones", "cartera"]),
        ...mapWritableState(useUserStore, ["estadoTransaccionRegistrandose"]),

        ventaInvalida() {
            let cantidadMonedaEnPosesion = this.cartera[this.monedaSeleccionada]?.cantidad
            cantidadMonedaEnPosesion = cantidadMonedaEnPosesion === undefined
                ? 0
                : cantidadMonedaEnPosesion

            return this.tipoDeOperacion === "sale"
                && this.cantidadMoneda > cantidadMonedaEnPosesion
        }
    },

    methods: {
        ...mapActions(useUserStore, ["registrarTransaccion"]),
        obtenerFechaActual,

        async intentarTransaccion() {
            if (
                !this.esCantidadMonedaValida
                || this.ventaInvalida
                || !this.esMontoValido
                || !this.esFechaValida
            ) {
                return this.transaccionInvalida = true
            }

            this.registrarTransaccion({
                "user_id": this.username,
                "action": this.tipoDeOperacion,
                "crypto_code": this.monedaSeleccionada,
                "crypto_amount": this.cantidadMoneda,
                "money": this.monto,
                // La API de transacciones guarda fechas en el mismo formato pero sin la 'T'
                "datetime": this.fechaSeleccionada.replace("T", " "),
            })

            this.setInputs(this.inputsDefault)
        },
    },

    mounted() {
        this.estadoTransaccionRegistrandose = null
        this.setInputs(this.inputsDefault)
    },
}
</script>

<template>
<div class="trade-view">
    <div class="form-cargando">
        <p v-if="!historialTransacciones">Cargando...</p>
    </div>
    <form novalidate @submit.prevent="intentarTransaccion">
        <fieldset :disabled="
            estadoTransaccionRegistrandose === 'procesando'
            || !historialTransacciones
        ">
            <label class="control-without-feedback">
                <span class="label-text">Tipo de operación</span>
                <select
                    name="operaciones"
                    v-model="tipoDeOperacion"
                >
                    <option value="purchase">Compra</option>
                    <option value="sale">Venta</option>
                </select>
            </label>

            <label class="control-without-feedback">
                <span class="label-text">Moneda</span>
                <select
                    name="coins"
                    v-model="monedaSeleccionada"
                >
                    <option
                        :value="moneda"
                        v-for="moneda in monedasAceptadas"
                    >
                        {{ moneda.toUpperCase() }}
                    </option>
                </select>
            </label>

            <label class="control-with-feedback">
                <span class="label-text">Cantidad</span>
                <input
                    type="number"
                    v-model="cantidadMoneda"
                    step="any"
                    @input=""
                >
                <div class="input-feedback">
                    <small
                        v-if="
                            (!esCantidadMonedaValida && cantidadMoneda !== null)
                            || (!esCantidadMonedaValida && transaccionInvalida)
                        "
                    >
                        <template v-if="!esCantidadMonedaValida">
                            Debe ser mayor a 0
                        </template>
                    </small>
                </div>
            </label>

            <label class="control-with-feedback">
                <span class="label-text">Monto</span>
                <span class="signo-monto">$</span>
                <input
                    type="number"
                    v-model="monto"
                >
                <div class="input-feedback">
                    <small
                        v-if="
                            (!esMontoValido && monto !== null)
                            || (!esMontoValido && transaccionInvalida)
                        "
                    >
                        Debe ser un entero mayor a 0
                    </small>
                </div>
            </label>

            <label class="control-with-feedback">
                <span class="label-text">Fecha</span>
                <input
                    type="datetime-local"
                    :max="obtenerFechaActual()"
                    v-model="fechaSeleccionada"
                >
                <div class="input-feedback">
                    <small
                        v-if="
                            (!esFechaValida && fechaSeleccionada !== null)
                            || (!esFechaValida && transaccionInvalida)
                        "
                    >
                        Debe ser igual o previo a la hora actual
                    </small>
                </div>
            </label>

            <button
                type="submit"
                class="submit-button"
            >
                Registrar operación
            </button>
        </fieldset>
    </form>

    <div class="transaction-feedback">
        <p v-if="estadoTransaccionRegistrandose === 'procesando'">
            Procesando transacción...
        </p>
        <p
            v-else-if="estadoTransaccionRegistrandose === 'aceptada'"
            class="success"
        >
            Transacción registrada con éxito
        </p>
        <p
            v-else-if="estadoTransaccionRegistrandose === 'rechazada'"
            class="failure"
        >
            Error: transacción rechazada
        </p>
        <p v-else-if="ventaInvalida">
            No se puede vender más de lo que se tiene en la cartera
        </p>
    </div>
</div>
</template>

<style scoped>
* {
    font-family: "Montserrat", sans-serif;
}

.trade-view {
    display: flex;
    flex-direction: column;
    align-items: center;
}

form, input, select, .submit-button {
    border: solid 1px #333;
    border-radius: 0.3rem;
}

form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 1.6rem 3rem;
    border: solid 1px #333;
    background-color: rgb(235, 235, 235);
    width: 15.5rem;
}

.form-cargando {
    height: 1.3rem;
}

.form-cargando p {
    margin: 0;
}

fieldset {
    all: initial;
    font-size: 0.9rem;
}

label {
    display: flex;
    flex-direction: column;
}

.label-text {
    margin-bottom: 0.2rem;
}

.control-without-feedback {
    margin-bottom: 1.5rem;
}

.control-with-feedback {
    margin-bottom: 0.5rem
}

input {
    padding: 0.25rem;
    padding-left: 0.45rem;
}

select {
    background-color: white;
    padding: 0.25rem 0.15rem;
}

.signo-monto {
    position: relative;
    height: 0;
    top: 5px;
    right: 15px;
}

.submit-button {
    background-color: #FF9C33;
    padding: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    font-weight: 600;
    margin-top: 0.5rem;
    width: 100%;
}

.submit-button:hover {
    background-color: #ffa647;
}

.submit-button:active {
    background-color: #ff9320;
}

fieldset:disabled * {
    cursor: default;
}

.input-feedback {
    height: 1rem;
    color: rgb(155, 0, 0);
}

.transaction-feedback {
    height: 1rem;
}

.success {
    color: green;
}

.failure {
    color: rgb(155, 0, 0);
}
</style>
