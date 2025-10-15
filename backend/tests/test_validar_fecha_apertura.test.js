const validar_fecha_apertura = require('../utils/validar_fecha_apertura');

test('fecha invalida dias lunes', () => {
  const fecha = new Date(2024, 9, 7);
  expect(validar_fecha_apertura(fecha)).toBe('Parque cerrado los días lunes');
});


test('fecha invalida 25 de diciembre', () => {
  const fecha = new Date();
  fecha.setDate(25);
  fecha.setMonth(11);
  expect(validar_fecha_apertura(fecha)).toBe('Parque cerrado el 25 de diciembre');
});

test('fecha invalida 1 de enero', () => {
  const fecha = new Date();
  fecha.setDate(1);
  fecha.setMonth(0);
  expect(validar_fecha_apertura(fecha)).toBe('Parque cerrado el 1 de enero');
});

test('fecha valida', () => {
  const hoy = new Date();
  const fecha = new Date();
  fecha.setDate(hoy.getDate() + 15);
  expect(validar_fecha_apertura(fecha)).toBe('Se ingresó correctamente la fecha del evento');
});
