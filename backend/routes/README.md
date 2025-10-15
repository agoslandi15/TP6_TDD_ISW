# Endpoint de Compra de Entradas

## POST /api/comprar-entrada

### Descripción
Endpoint para procesar la compra de entradas al parque EcoHarmony. Valida los datos, calcula el precio total y envía un correo de confirmación con un código QR único.

### Request Body

```json
{
  "fecha_evento": "2025-11-15",
  "cantidad_entradas": 3,
  "edad_comprador": [25, 8, 70],
  "tipo_entrada": ["Regular", "Regular", "VIP"],
  "forma_pago": "mercado pago",
  "email_usuario": "usuario@ejemplo.com"
}
```

### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `fecha_evento` | String | Fecha del evento en formato YYYY-MM-DD | "2025-11-15" |
| `cantidad_entradas` | Number | Número de entradas a comprar (máx 10) | 3 |
| `edad_comprador` | Array[Number] | Array con las edades de cada comprador | [25, 8, 70] |
| `tipo_entrada` | Array[String] | Array con el tipo de cada entrada ("Regular" o "VIP") | ["Regular", "Regular", "VIP"] |
| `forma_pago` | String | Método de pago seleccionado ("mercado pago" o "efectivo") | "mercado pago" |
| `email_usuario` | String | Email del usuario para enviar la confirmación | "usuario@ejemplo.com" |

### Response Exitoso (200)

```json
{
  "success": true,
  "message": "Compra realizada con éxito. Se ha enviado un correo de confirmación.",
  "codigo_entrada": "EHP-1729012345678-A1B2C3D4E",
  "total": 7500
}
```

**Explicación del total del ejemplo:**
- Entrada 1: Edad 25, Regular = $5,000
- Entrada 2: Edad 8, Regular = $2,500 (50% descuento)
- Entrada 3: Edad 70, VIP = $0 (gratis, +60 años)
- **Total: $7,500**

### Responses de Error

#### 400 - Parámetros Faltantes
```json
{
  "success": false,
  "message": "Faltan parámetros requeridos"
}
```

#### 400 - Validación Fallida
```json
{
  "success": false,
  "message": "Cantidad de entradas no válida, no puede superar las 10 entradas"
}
```

#### 500 - Error del Servidor
```json
{
  "success": false,
  "message": "Error al procesar la compra",
  "error": "Descripción del error"
}
```

### Lógica de Precios

| Edad | Tipo Regular | Tipo VIP |
|------|--------------|----------|
| <= 3 años | $0 (Gratis) | $0 (Gratis) |
| 4-14 años | $2,500 (50%) | $5,000 (50%) |
| 15-59 años | $5,000 | $10,000 |
| >= 60 años | $0 (Gratis) | $0 (Gratis) |

**Notas de precios:**
- Menores de 3 años y mayores de 60 años no pagan
- Menores de 15 años pagan mitad de entrada
- VIP precio base: $10,000
- Regular precio base: $5,000

### Email de Confirmación

El correo incluye:
- ✅ Código QR único generado dinámicamente
- ✅ Código de entrada alfanumérico
- ✅ Fecha del evento
- ✅ Cantidad de entradas
- ✅ Detalle de cada entrada (número, tipo, edad, precio)
- ✅ Total a pagar con IVA incluido
- ✅ Método de pago

### Ejemplo de uso con curl

```bash
curl -X POST http://localhost:3000/api/comprar-entrada \
  -H "Content-Type: application/json" \
  -d '{
    "fecha_evento": "2025-11-15",
    "cantidad_entradas": 2,
    "edad_comprador": [30, 10],
    "tipo_entrada": ["VIP", "Regular"],
    "forma_pago": "mercado pago",
    "email_usuario": "tu-email@ejemplo.com"
  }'
```

### Ejemplo de uso con JavaScript (Fetch)

```javascript
const comprarEntrada = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/comprar-entrada', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha_evento: '2025-11-15',
        cantidad_entradas: 2,
        edad_comprador: [30, 10],
        tipo_entrada: ['VIP', 'Regular'],
        forma_pago: 'mercado pago',
        email_usuario: 'tu-email@ejemplo.com'
      })
    });

    const data = await response.json();
    console.log(data);
    // Total esperado: $10,000 (VIP adulto) + $2,500 (Regular niño) = $12,500
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Configuración Requerida

1. Crear archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor:

```bash
npm start
# o en modo desarrollo
npm run dev
```

### Validaciones Aplicadas

1. **Cantidad de entradas**: Mínimo 1, máximo 10
2. **Forma de pago**: Solo se aceptan "mercado pago" o "efectivo"
3. **Fecha del evento**: 
   - No puede ser anterior a hoy
   - No puede ser con más de un mes de anticipación
   - El parque está cerrado los días lunes
   - El parque está cerrado el 25 de diciembre y 1 de enero
4. **Tipos de entrada**: Solo "Regular" o "VIP" (case sensitive)

### Notas Importantes

- El código QR se genera automáticamente usando la API pública de qrserver.com
- El código de entrada es único y se genera con timestamp + string aleatorio
- El array de edades y tipos de entrada debe tener la misma longitud que `cantidad_entradas`
- Las validaciones incluyen: cantidad máxima, fechas válidas, compra anticipada, y forma de pago
- Los precios se calculan automáticamente según la edad del comprador
