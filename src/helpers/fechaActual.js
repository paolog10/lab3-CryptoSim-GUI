export const obtenerFechaActual = () => {
    const fechaUTC = new Date()
        .toISOString()
        .replace(/:[0-9]{2}\..*/g, "")

    return fechaUTC
        .replace(/(?<=T)(.*)(?=:)/, fechaUTC.match(/(?<=T)(.*)(?=:)/)[0] - 3)
}
