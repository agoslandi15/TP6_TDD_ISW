const validar_compra_anticipada = require('../utils/validar_compra_anticipada');

test('fecha válida dentro de un mes', () => {
    const hoy = new Date();
    const fecha_evento = new Date();
    fecha_evento.setDate(hoy.getDate() + 15);
    expect(validar_compra_anticipada(fecha_evento)).toBe('Se ingresó correctamente la fecha del evento');
});

test('fecha inválida en el pasado', () => {
    const fecha_evento = new Date();
    fecha_evento.setDate(fecha_evento.getDate() - 1);
    expect(validar_compra_anticipada(fecha_evento)).toBe('La fecha del evento debe ser igual o mayor a la actual');
});

test('fecha inválida más de un mes en el futuro', () => {
    const hoy = new Date();
    const fecha_evento = new Date();
    fecha_evento.setMonth(hoy.getMonth() + 2);
    expect(validar_compra_anticipada(fecha_evento)).toBe('No se pueden comprar entradas con más de un mes de anticipación');
});
