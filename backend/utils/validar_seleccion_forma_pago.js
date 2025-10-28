function validar_seleccion_forma_pago(forma_pago) {
	if (!forma_pago || forma_pago.trim() === '') {
		return "Forma de pago no válida";
	}
	
	if (forma_pago === 'mercado pago' || forma_pago === 'efectivo') {
		return "Forma de pago válida";
	} else {
		return "Forma de pago no válida";
	}
}

module.exports = validar_seleccion_forma_pago;