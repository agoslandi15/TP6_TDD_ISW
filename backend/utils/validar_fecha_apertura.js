function validar_fecha_apertura(fecha_apertura) {    
	if (!fecha_apertura) {
		return "La fecha es obligatoria";
	}

	// Validar que sea una fecha válida
	const fecha = new Date(fecha_apertura);
	if (isNaN(fecha.getTime())) {
		return "La fecha no es válida";
	}

	const hoy = new Date();
	hoy.setHours(0, 0, 0, 0); 

	const fecha_limite = new Date();
	fecha_limite.setMonth(fecha_limite.getMonth() + 1);

	if (fecha_apertura.getDay() === 1) {
		return "Parque cerrado los días lunes";
	}

	if (fecha_apertura.getDate() === 25 && fecha_apertura.getMonth() === 11) {
		return "Parque cerrado el 25 de diciembre";
	}
	if (fecha_apertura.getDate() === 1 && fecha_apertura.getMonth() === 0) {
		return "Parque cerrado el 1 de enero";
	}
	
    return 'Se ingresó correctamente la fecha del evento';

}

module.exports = validar_fecha_apertura;