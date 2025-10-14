function validar_cant_entradas(cantidad) {
	if (typeof cantidad !== 'number' || Number.isNaN(cantidad)) {
		throw new TypeError('cantidad debe ser un número');
	}

	if (cantidad > 10) {
		return "No puede superar las 10 entradas";
	} else {
		return "Se ingresó correctamente la cantidad de entradas";
	}
}

module.exports = validar_cant_entradas;