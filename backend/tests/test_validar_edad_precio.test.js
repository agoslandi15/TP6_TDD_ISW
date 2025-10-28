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

test(
    'Deberia lanzar error cuando edad es null', () => {
        expect(() => validar_edad_precio(null, 'VIP')).toThrow('La edad es obligatoria');
    }
);

test(
    'Deberia lanzar error cuando edad es undefined', () => {
        expect(() => validar_edad_precio(undefined, 'VIP')).toThrow('La edad es obligatoria');
    }
);

test(
    'Deberia lanzar error cuando edad es vacía', () => {
        expect(() => validar_edad_precio('', 'VIP')).toThrow('La edad es obligatoria');
    }
);

test(
    'Deberia lanzar error cuando tipo de entrada es null', () => {
        expect(() => validar_edad_precio(25, null)).toThrow('El tipo de entrada es obligatorio');
    }
);

test(
    'Deberia lanzar error cuando tipo de entrada es undefined', () => {
        expect(() => validar_edad_precio(25, undefined)).toThrow('El tipo de entrada es obligatorio');
    }
);

test(
    'Deberia lanzar error cuando tipo de entrada es vacío', () => {
        expect(() => validar_edad_precio(25, '')).toThrow('El tipo de entrada es obligatorio');
    }
);

test(
    'Deberia lanzar error cuando tipo de entrada es inválido', () => {
        expect(() => validar_edad_precio(25, 'Premium')).toThrow('Tipo de entrada inválido');
    }
);

test(
    'Deberia lanzar error cuando edad no es un número', () => {
        expect(() => validar_edad_precio('veinte', 'VIP')).toThrow('La edad debe ser un número válido mayor o igual a 0');
    }
);

test(
    'Deberia lanzar error cuando edad es negativa', () => {
        expect(() => validar_edad_precio(-5, 'VIP')).toThrow('La edad debe ser un número válido mayor o igual a 0');
    }
);

