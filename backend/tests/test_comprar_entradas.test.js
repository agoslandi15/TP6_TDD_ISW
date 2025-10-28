const comprar_entradas = require('../utils/comprar_entradas');

test(
    'Deberia realizar la compra de entradas correctamente', () => {
        const resultado = comprar_entradas(
            '2025-10-25',
            2,
            [25, 30],
            ['VIP', 'Regular'],
            'mercado pago'
        );
        expect(resultado).toBe("Compra realizada con éxito");
    }
);

test(
    'Deberia devolver error por cantidad de entradas no válida', () => {
        const resultado = comprar_entradas(
            '2025-11-01',
            11,
            [25, 30],
            ['VIP', 'Regular'],
            'efectivo'
        );
        expect(resultado).toBe("No puede superar las 10 entradas");
    }
);

test(
    'Deberia devolver error por fecha de evento no válida', () => {
        const resultado = comprar_entradas(
            '2025-10-27', // lunes
            2,
            [25, 30],
            ['VIP', 'Regular'],
            'mercado pago'
        );
        expect(resultado).toBe("Parque cerrado los días lunes");
    }
);

test(
    'Deberia devolver error por compra en fecha pasada', () => {
        const resultado = comprar_entradas(
            '2023-12-01',
            2,
            [25, 30],
            ['VIP', 'Regular'],
            'mercado pago'
        );
        expect(resultado).toBe("La fecha del evento debe ser igual o mayor a la actual");
    }
);

test(
    'Deberia devolver error por forma de pago no válida', () => {
        const resultado = comprar_entradas(
            '2025-10-25',
            2,
            [25, 30],
            ['VIP', 'Regular'],
            ''
        );
        expect(resultado).toBe("Forma de pago no válida");
    }
);
