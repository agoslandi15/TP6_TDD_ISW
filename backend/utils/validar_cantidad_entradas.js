function validar_cantidad_entradas(cantidad) {
	if (typeof cantidad !== 'number' || Number.isNaN(cantidad)) {
		throw new TypeError('cantidad debe ser un número');
	}

	if (cantidad > 10) {
		return "No puede superar las 10 entradas";
	} else if (cantidad < 1) {
		return "La cantidad de entradas debe ser al menos 1";
	} else {
		return "Se ingresó una cantidad válida de entradas";
	}
}

module.exports = validar_cantidad_entradas;
