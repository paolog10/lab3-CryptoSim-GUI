<script>
import { mapActions, mapState, mapWritableState } from "pinia"
import { useCoinDataStore } from "../stores/coinDataStore"
import { useUserStore } from "../stores/userStore"

export default {
    data() {
        return {
            tipoDeOperacion: "purchase",
            monedaSeleccionada: useCoinDataStore().monedasAceptadas[0],
            cantidadMoneda: null,
            monto: null,
            fechaSeleccionada: null,
            transaccionInvalida: false,
        }
    },

    computed: {
        ...mapState(useCoinDataStore, ["monedasAceptadas"]),
        ...mapState(useUserStore, ["username"]),
        ...mapWritableState(useUserStore, ["estadoUltimaTransaccion"]),

        esCantidadMonedaValida() {
            return this.cantidadMoneda > 0
        },

        // Los montos se expresarán solo en pesos, sin centavos
        esMontoValido() {
            return this.monto > 0
                && Number.isInteger(this.monto)
        },

        esFechaValida() {
            return this.fechaSeleccionada !== ""
                && this.fechaSeleccionada <= this.obtenerFechaActual()
        }
    },

    methods: {
        ...mapActions(useUserStore, ["registrarTransaccion"]),

        obtenerFechaActual() {
            const fechaUTC = new Date()
                .toISOString()
                .replace(/:[0-9]{2}\..*/g, "")

            return fechaUTC
                .replace(/(?<=T)(.*)(?=:)/, fechaUTC.match(/(?<=T)(.*)(?=:)/)[0] - 3)
        },

        async intentarTransaccion() {
            if (
                !this.esCantidadMonedaValida
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
        },
    },

    mounted() {
        this.estadoUltimaTransaccion = null
    },
}
</script>

<template>
<div class="trade-view">
    <form novalidate @submit.prevent="intentarTransaccion">
        <label class="control-without-feedback">
            <span class="label-text">Tipo de operación</span>
            <select
                name="operaciones"
                v-model="tipoDeOperacion"
            >
                <option value="purchase">Compra</option>
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
                    Debe ser un número mayor a 0
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
            :disabled="estadoUltimaTransaccion === 'procesando'"
        >
            Registrar operación
        </button>
    </form>

    <div class="transaction-feedback">
        <p v-if="estadoUltimaTransaccion === 'procesando'">
            Procesando transacción...
        </p>
        <p
            v-else-if="estadoUltimaTransaccion === 'aceptada'"
            class="success"
        >
            Transacción registrada con éxito
        </p>
        <p
            v-else-if="estadoUltimaTransaccion === 'rechazada'"
            class="failure"
        >
            Error: transacción rechazada
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
    font-size: 0.9rem;
    font-weight: 400;
    width: 15rem;
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
}

.submit-button:hover {
    background-color: #ffa647;
}

.submit-button:active {
    background-color: #ff9320;
}

.submit-button:disabled {
    cursor: default;
    background-color: #FF9C33;
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
