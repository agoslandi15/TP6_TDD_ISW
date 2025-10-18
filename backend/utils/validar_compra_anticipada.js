function validar_compra_anticipada(fecha_evento) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche para comparar solo fechas
    
    const un_mes_despues = new Date();
    un_mes_despues.setMonth(hoy.getMonth() + 1);
    un_mes_despues.setHours(0, 0, 0, 0);

    // Normalizar fecha_evento también
    const fecha_evento_normalizada = new Date(fecha_evento);
    fecha_evento_normalizada.setHours(0, 0, 0, 0);

    if (fecha_evento_normalizada < hoy ) {
        return 'La fecha del evento debe ser igual o mayor a la actual';
    }
	else if (fecha_evento_normalizada > un_mes_despues) {
		return 'No se pueden comprar entradas con más de un mes de anticipación';
	}

    return 'Se ingresó correctamente la fecha del evento';
}

module.exports = validar_compra_anticipada;
