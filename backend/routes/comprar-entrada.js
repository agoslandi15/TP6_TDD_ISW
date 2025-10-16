const express = require('express');
const router = express.Router();
const comprar_entradas = require('../utils/comprar_entradas');
const enviar_correo_responsable = require('../mailer/enviar_correo');

// POST /api/comprar-entrada
router.post('/', async (req, res) => {
  try {
    const { 
      fecha_evento, 
      cantidad_entradas, 
      edad_comprador, 
      tipo_entrada, 
      forma_pago,
      email_usuario 
    } = req.body;

    // Validar que se reciban todos los parámetros necesarios
    if (!fecha_evento || !cantidad_entradas || !edad_comprador || !tipo_entrada || !forma_pago || !email_usuario) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos'
      });
    }

    // Procesar la compra utilizando la lógica existente
    const resultado = comprar_entradas(
      fecha_evento,
      cantidad_entradas,
      edad_comprador,
      tipo_entrada,
      forma_pago
    );

    // Verificar si la compra fue exitosa
    if (resultado !== "Compra realizada con éxito") {
      return res.status(400).json({
        success: false,
        message: resultado
      });
    }

    // Generar código único de entrada
    const codigo_entrada = `EHP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calcular precio total usando la lógica real de validar_edad_precio
    const validar_edad_precio = require('../utils/validar_edad_precio');
    let precio_total = 0;
    const entradas_detalle = [];
    
    for (let i = 0; i < cantidad_entradas; i++) {
      const edad = edad_comprador[i];
      const tipo = tipo_entrada[i];

      // Lógica de precios según edad y tipo usando la función de utils
      const precio_entrada = validar_edad_precio(edad, tipo);

      precio_total += precio_entrada;
      
      entradas_detalle.push({
        numero: i + 1,
        tipo: tipo,
        edad: edad,
        precio: precio_entrada
      });
    }

    // Preparar datos para el correo
    const datos_correo = {
      codigo_entrada,
      fecha_evento,
      cantidad_entradas,
      entradas_detalle,
      forma_pago: forma_pago.charAt(0).toUpperCase() + forma_pago.slice(1),
      total: precio_total
    };

    // Intentar enviar correo con el código QR (no bloqueante)
    let correo_enviado = false;
    let error_correo = null;
    
    try {
      await enviar_correo_responsable(email_usuario, datos_correo);
      correo_enviado = true;
      console.log(`✅ Correo enviado exitosamente a ${email_usuario}`);
    } catch (email_error) {
      correo_enviado = false;
      error_correo = email_error.message;
      console.error('⚠️ Error al enviar correo (la compra se completó):', email_error.message);
    }

    // Responder con éxito (incluso si falla el correo)
    const response = {
      success: true,
      message: correo_enviado 
        ? 'Compra realizada con éxito. Se ha enviado un correo de confirmación.'
        : 'Compra realizada con éxito. No se pudo enviar el correo de confirmación.',
      codigo_entrada,
      total: precio_total,
      correo_enviado: correo_enviado
    };

    if (!correo_enviado && error_correo) {
      response.advertencia = `El correo no se pudo enviar: ${error_correo}`;
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Error en la compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la compra',
      error: error.message
    });
  }
});

module.exports = router;
