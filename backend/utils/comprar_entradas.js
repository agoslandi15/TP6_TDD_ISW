const validar_cantidad_entradas = require('./validar_cantidad_entradas');
const validar_seleccion_forma_pago = require('./validar_seleccion_forma_pago.js');
const validar_edad_precio = require('./validar_edad_precio');
const validar_fecha_apertura = require('./validar_fecha_apertura');
const validar_compra_anticipada = require('./validar_compra_anticipada');

function comprar_entradas(fecha_evento, cantidad_entradas, edad_comprador, tipo_entrada, forma_pago)    {
    
    // Parse date string to local date (YYYY-MM-DD format)
    const parts = fecha_evento.split('-');
    const año = parseInt(parts[0]);
    const mes = parseInt(parts[1]) - 1;  
    const día = parseInt(parts[2]);
    const fecha_evento_date = new Date(año, mes, día);

    if (validar_cantidad_entradas(cantidad_entradas) !== "Se ingresó una cantidad válida de entradas") {
        return "Cantidad de entradas no válida, no puede superar las 10 entradas";
    }
    if (validar_fecha_apertura(fecha_evento_date) !== "Se ingresó correctamente la fecha del evento") {
        return "Fecha de evento no válida, el parque está cerrado ese día";
    }
    if (validar_compra_anticipada(fecha_evento_date) !== "Se ingresó correctamente la fecha del evento") {
        return "Compra anticipada no válida, se permiten compras con hasta un mes de anticipación";
    }
    for (let i = 1; i < cantidad_entradas; i++) {
        validar_edad_precio(edad_comprador[i], tipo_entrada[i]);
    }
    if (validar_seleccion_forma_pago(forma_pago) !== "Forma de pago válida") {
        return "Forma de pago no válida";
    }
    return "Compra realizada con éxito";
}

module.exports = comprar_entradas;
