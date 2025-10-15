const validar_seleccion_forma_pago = require('../utils/validar_seleccion_forma_pago');

test(
    'Deberia validar forma de pago correcta', () => {
        expect(validar_seleccion_forma_pago('mercado pago')).toBe("Forma de pago válida");
    }
);

test(
    'Deberia validar forma de pago correcta', () => {
        expect(validar_seleccion_forma_pago('efectivo')).toBe("Forma de pago válida");
    }
);

test(
    'Deberia devolver error por forma de pago no seleccionada', () => {
        expect(validar_seleccion_forma_pago('')).toBe("Forma de pago inválida");
    }
);

test(
    'Deberia devolver error por forma de pago no válida', () => {
        expect(validar_seleccion_forma_pago('tarjeta')).toBe("Forma de pago inválida");
    }
); 
