function validar_compra_anticipada(fecha_evento) {
    const hoy = new Date();
    const unMesDespues = new Date();
    unMesDespues.setMonth(hoy.getMonth() + 1);

    if (fecha_evento < hoy ) {
        return 'La fecha del evento debe ser igual o mayor a la actual';
    }
	else if (fecha_evento > unMesDespues) {
		return 'No se pueden comprar entradas con más de un mes de anticipación';
	}

    return 'Se ingresó correctamente la fecha de compra';
}

module.exports = { validar_compra_anticipada };
