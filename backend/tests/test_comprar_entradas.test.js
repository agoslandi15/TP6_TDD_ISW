const comprar_entradas = require('../utils/comprar_entradas');

test(
    'Deberia realizar la compra de entradas correctamente', () => {
        const resultado = comprar_entradas(
            '2025-10-22',
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
            '2023-12-01',
            11,
            [25, 30],
            ['VIP', 'Regular'],
            'efectivo'
        );
        expect(resultado).toBe("Cantidad de entradas no válida, no puede superar las 10 entradas");
    }
);

test(
    'Deberia devolver error por fecha de evento no válida', () => {
        const resultado = comprar_entradas(
            '2025-10-20', // lunes
            2,
            [25, 30],
            ['VIP', 'Regular'],
            'mercado pago'
        );
        expect(resultado).toBe("Fecha de evento no válida, el parque está cerrado ese día");
    }
);

test(
    'Deberia devolver error por compra anticipada no válida', () => {
        const resultado = comprar_entradas(
            '2023-12-01',
            2,
            [25, 30],
            ['VIP', 'Regular'],
            'mercado pago'
        );
        expect(resultado).toBe("Compra anticipada no válida, se permiten compras con hasta un mes de anticipación");
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
