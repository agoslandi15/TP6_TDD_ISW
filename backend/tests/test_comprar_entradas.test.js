const validar = require('../utils/comprar_entradas');

test('acepta 0', () => {
    var cantidadEntradas = 0;
  expect(validar(cantidadEntradas)).toBe('Se ingresó correctamente la cantidad de entradas');
});

test('acepta 10', () => {
    // Precondiciones
  var cantidadEntradas = 10;
  // Llamada a la función
  var resultado = validar(cantidadEntradas);
  // Resultados
  expect(resultado).toBe('Se ingresó correctamente la cantidad de entradas');
});

test('rechaza 11', () => {
  var cantidadEntradas = 11;
  var resultado = validar(cantidadEntradas);
  expect(resultado).toBe('No puede superar las 10 entradas');
});