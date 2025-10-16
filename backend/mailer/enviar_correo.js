const nodemailer = require("nodemailer");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  // Tiempo de espera más corto para fallar rápido si no hay conexión
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
})

async function enviar_correo_responsable(destinatario, datos) {

  const { 
    codigo_entrada, 
    fecha_evento, 
    cantidad_entradas, 
    entradas_detalle,
    forma_pago,
    total
  } = datos

  // Función para determinar categoría de entrada según edad
  const obtener_categoria_edad = (edad) => {
    if (edad <= 3) return 'Bebé (Gratis)';
    if (edad < 15) return 'Niño/a';
    if (edad < 60) return 'Adulto';
    return 'Adulto Mayor (Gratis)';
  };

  const visitDate = new Date(fecha_evento + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mail_options = {
    from: `"EcoHarmony Park - G3" <${process.env.SMTP_USER}>`,
    to: destinatario,
    subject: `Confirmación de Compra - EcoHarmony Park - Código: ${codigo_entrada}`,
    html: 
    `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Compra - EcoHarmony Park</title>
</head>
<body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🌿 EcoHarmony Park 🌿</h1>
              <p style="color: #e8f5e9; margin: 10px 0 0 0; font-size: 16px;">Confirmación de Compra</p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <h2 style="color: #2d5016; margin: 0 0 15px 0; font-size: 24px;">¡Hola!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0;">Gracias por tu compra. Tu entrada ha sido confirmada exitosamente.</p>
            </td>
          </tr>
          
          <!-- Ticket Code -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-radius: 8px; border: 2px solid #4a7c2c;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="color: #2d5016; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">TU CÓDIGO DE ENTRADA</p>
                    <p style="color: #2d5016; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 3px; font-family: 'Montserrat', monospace;">${codigo_entrada}</p>
                    <p style="color: #4a7c2c; margin: 15px 0 0 0; font-size: 13px;">Presenta este código al ingresar al parque</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- QR Code -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${codigo_entrada}" alt="QR Code" style="width: 200px; height: 200px; border: 4px solid #e8f5e9; border-radius: 8px;"/>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 13px;">Escanea este código QR al ingresar</p>
            </td>
          </tr>
          
          <!-- Visit Details -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <h3 style="color: #2d5016; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e8f5e9; padding-bottom: 10px;">Detalles de tu Visita</h3>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">📅 Fecha de Visita:</td>
                  <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${visitDate}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">🎫 Cantidad de Entradas:</td>
                  <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${cantidad_entradas}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">💳 Método de Pago:</td>
                  <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${forma_pago}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">💰 Total:</td>
                  <td style="color: #2d5016; font-size: 18px; font-weight: bold; text-align: right; padding: 8px 0;">$${total.toLocaleString("es-AR")}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Visitors / Entradas -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="color: #2d5016; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e8f5e9; padding-bottom: 10px;">Detalle de Entradas</h3>
              ${entradas_detalle.map((entrada, index) => `
                <div style="background-color: #f9f9f9; border-left: 3px solid #4a7c2c; padding: 12px; margin-bottom: 10px; border-radius: 4px;">
                  <p style="margin: 0; color: #333; font-size: 14px;"><strong>Entrada ${entrada.numero}:</strong> ${obtener_categoria_edad(entrada.edad)} - Pase ${entrada.tipo}</p>
                  <p style="margin: 5px 0 0 0; color: #2d5016; font-size: 14px; font-weight: bold;">$${entrada.precio.toLocaleString("es-AR")}</p>
                  ${entrada.precio === 0 ? '<p style="margin: 5px 0 0 0; color: #4a7c2c; font-size: 12px;">✓ Entrada gratuita</p>' : ''}
                  ${entrada.edad >= 4 && entrada.edad < 15 ? '<p style="margin: 5px 0 0 0; color: #4a7c2c; font-size: 12px;">✓ Descuento 50% aplicado</p>' : ''}
                </div>
              `).join('')}
            </td>
          </tr>
          
          <!-- Important Info -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff8e1; border-radius: 8px; border: 1px solid #ffd54f;">
                <tr>
                  <td style="padding: 20px;">
                    <h4 style="color: #f57c00; margin: 0 0 10px 0; font-size: 16px;">📌 Información Importante</h4>
                    <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 13px;">
                      <li>El parque abre de martes a domingo, 9:00 AM - 6:00 PM</li>
                      <li>Presenta tu código QR o el código ${codigo_entrada} al ingresar</li>
                      <li>Si el QR no funciona, usa el código alfanumérico</li>
                      ${forma_pago.toLowerCase().includes('efectivo') ? "<li><strong>Recuerda llevar el efectivo al llegar</strong></li>" : ""}
                      <li>Las entradas no son reembolsables</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; margin: 0 0 10px 0; font-size: 13px;">¡Esperamos verte pronto en EcoHarmony Park!</p>
              <p style="color: #2d5016; margin: 10px 0; font-size: 16px; font-weight: bold;">🌿 Grupo 3</p>
              <p style="color: #999; margin: 0; font-size: 12px;">
                <a href="mailto:ecoharmonypark@gmail.com" style="color: #4a7c2c; text-decoration: none;">ecoharmonypark@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }

  await transporter.sendMail(mail_options)
  console.log(`✉️ Correo enviado a ${destinatario}`)
}

module.exports = enviar_correo_responsable