import { ref, computed } from "vue"
import { useCoinDataStore } from "../stores/coinDataStore"
import { useUserStore } from "../stores/userStore"
import { obtenerFechaActual } from "../helpers/fechaActual"

export function useTransactionInputs() {
    const userStore = useUserStore()

    const tipoDeOperacion = ref(null)
    const monedaSeleccionada = ref(null)
    const cantidadMoneda = ref(null)
    const monto = ref(null)
    const fechaSeleccionada = ref(null)
    const transaccionInvalida = ref(null)

    const esCantidadMonedaValida = computed(() => {
        return cantidadMoneda.value > 0
    })

    const esMontoValido = computed(() => {
        return monto.value > 0
                && Number.isInteger(monto.value)
    })

    const esFechaValida = computed(() => {
        return fechaSeleccionada.value !== ""
                && fechaSeleccionada.value <= obtenerFechaActual()
    })

    function setInputs(datos) {
        tipoDeOperacion.value = datos.tipoDeOperacion
        monedaSeleccionada.value = datos.monedaSeleccionada
        cantidadMoneda.value = datos.cantidadMoneda
        monto.value = datos.monto
        fechaSeleccionada.value = datos.fechaSeleccionada
        transaccionInvalida.value = datos.transaccionInvalida
    }

    return {
        tipoDeOperacion,
        monedaSeleccionada,
        cantidadMoneda,
        monto,
        fechaSeleccionada,
        esCantidadMonedaValida,
        esMontoValido,
        esFechaValida,
        transaccionInvalida,
        setInputs,
    }
}
