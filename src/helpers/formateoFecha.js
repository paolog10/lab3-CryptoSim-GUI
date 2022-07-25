// Solo convierte del formato ISO al formato dd/mm/yyyy HH:SS
// Ejemplo: 2022-07-25T15:36:00.000Z => 25/07/2022 15:36
export const obtenerFechaFormateada = (fechaISO) => {
    const año = fechaISO.substring(0, 4)
    const mes = fechaISO.substring(5, 7)
    const dia = fechaISO.substring(8, 10)
    const hora = fechaISO.substring(11, 13)
    const minutos = fechaISO.substring(14, 16)

    return `${dia}/${mes}/${año} ${hora}:${minutos}`
}