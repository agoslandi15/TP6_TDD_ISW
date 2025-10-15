const validar_cantidad_entradas = require('../utils/validar_cantidad_entradas');

test('cantidad válida dentro del rango', () => {
    expect(validar_cantidad_entradas(5)).toBe('Se ingresó una cantidad válida de entradas');
});

test('cantidad inválida mayor a 10', () => {
    expect(validar_cantidad_entradas(15)).toBe('No puede superar las 10 entradas');
});

test('cantidad inválida menor a 1', () => {
    expect(validar_cantidad_entradas(0)).toBe('La cantidad de entradas debe ser al menos 1');
});