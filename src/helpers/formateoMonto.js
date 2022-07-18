export const obtenerMontoFormateado = (monto) => {    
    return new Intl.NumberFormat('es-AR', { 
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(monto)
}