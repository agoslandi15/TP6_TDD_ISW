const validar_edad_precio = require('../utils/validar_edad_precio');

test(
    'Deberia devolver 0 para menores de 3 años con entrada VIP', () => {
        expect(validar_edad_precio(2, 'VIP')).toBe(0);
    }
);

test(
    'Deberia devolver 0 para mayores de 60 años con entrada VIP', () => {
        expect(validar_edad_precio(65, 'VIP')).toBe(0);
    }
);

test(
    'Deberia devolver 0 para menores de 3 años con entrada Regular', () => {
        expect(validar_edad_precio(2, 'Regular')).toBe(0);
    }
);

test(
    'Deberia devolver 0 para mayores de 60 años con entrada Regular', () => {
        expect(validar_edad_precio(65, 'Regular')).toBe(0);
    }
);

test(
    'Deberia devolver 5000 para mayores de 15 años con entrada Regular', () => {
        expect(validar_edad_precio(30, 'Regular')).toBe(5000);
    }
);

test(
    'Deberia devolver 10000 para mayores de 15 años con entrada VIP', () => {
        expect(validar_edad_precio(30, 'VIP')).toBe(10000);
    }
);

test(
    'Deberia devolver 2500 para menores de 15 años con entrada Regular', () => {
        expect(validar_edad_precio(10, 'Regular')).toBe(2500);
    }
);

test(
    'Deberia devolver 5000 para menores de 15 años con entrada VIP', () => {
        expect(validar_edad_precio(10, 'VIP')).toBe(5000);
    }
);


