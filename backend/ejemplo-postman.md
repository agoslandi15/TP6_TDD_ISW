# Ejemplos para Postman - Comprar Entrada

## 🚀 Configuración Inicial

1. **Método:** `POST`
2. **URL:** `http://localhost:3000/api/comprar-entrada`
3. **Headers:**
   - `Content-Type: application/json`

---

## 📝 Ejemplo 1: Compra Básica Exitosa

### Request Body (JSON)
```json
{
  "fecha_evento": "2025-11-15",
  "cantidad_entradas": 2,
  "edad_comprador": [30, 10],
  "tipo_entrada": ["VIP", "Regular"],
  "forma_pago": "mercado pago",
  "email_usuario": "tu-email@gmail.com"
}
```

### Response Esperado (200 OK)
```json
{
  "success": true,
  "message": "Compra realizada con éxito. Se ha enviado un correo de confirmación.",
  "codigo_entrada": "EHP-1729012345678-A1B2C3D4E",
  "total": 12500
}
```

**Cálculo del Total:**
- Edad 30, VIP: $10,000 (precio completo)
- Edad 10, Regular: $2,500 (50% descuento)
- **Total: $12,500**

---

## 📝 Ejemplo 2: Con Entradas Gratis (Menores y Adultos Mayores)

### Request Body (JSON)
```json
{
  "fecha_evento": "2025-10-20",
  "cantidad_entradas": 4,
  "edad_comprador": [2, 35, 65, 14],
  "tipo_entrada": ["Regular", "VIP", "VIP", "Regular"],
  "forma_pago": "efectivo",
  "email_usuario": "franciscofigueroa303@gmail.com"
}
```

### Response Esperado (200 OK)
```json
{
  "success": true,
  "message": "Compra realizada con éxito. Se ha enviado un correo de confirmación.",
  "codigo_entrada": "EHP-1729012345679-B2C3D4E5F",
  "total": 12500
}
```

**Cálculo del Total:**
- Edad 2, Regular: $0 (gratis, menor de 3)
- Edad 35, VIP: $10,000 (precio completo)
- Edad 65, VIP: $0 (gratis, mayor de 60)
- Edad 14, Regular: $2,500 (50% descuento)
- **Total: $12,500**

---

## 📝 Ejemplo 3: Todas Entradas Gratis

### Request Body (JSON)
```json
{
  "fecha_evento": "2025-10-25",
  "cantidad_entradas": 3,
  "edad_comprador": [1, 70, 80],
  "tipo_entrada": ["Regular", "VIP", "Regular"],
  "forma_pago": "mercado pago",
  "email_usuario": "franciscofigueroa303@gmail"
}
```

### Response Esperado (200 OK)
```json
{
  "success": true,
  "message": "Compra realizada con éxito. Se ha enviado un correo de confirmación.",
  "codigo_entrada": "EHP-1729012345680-C3D4E5F6G",
  "total": 0
}
```

**Cálculo del Total:**
- Edad 1, Regular: $0 (gratis)
- Edad 70, VIP: $0 (gratis)
- Edad 80, Regular: $0 (gratis)
- **Total: $0**

---

## ❌ Ejemplo 4: Error - Cantidad Inválida

### Request Body (JSON)
```json
{
  "fecha_evento": "2025-11-15",
  "cantidad_entradas": 15,
  "edad_comprador": [30, 25, 22, 28, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
  "tipo_entrada": ["Regular", "Regular", "VIP", "Regular", "VIP", "Regular", "VIP", "Regular", "VIP", "Regular", "VIP", "Regular", "VIP", "Regular", "VIP"],
  "forma_pago": "mercado pago",
  "email_usuario": "franciscofigueroa303@gmail"
}
```

### Response Esperado (400 Bad Request)
```json
{
  "success": false,
  "message": "Cantidad de entradas no válida, no puede superar las 10 entradas"
}
```

---

## ❌ Ejemplo 5: Error - Forma de Pago Inválida

### Request Body (JSON)
```json
{
  "fecha_evento": "2025-11-15",
  "cantidad_entradas": 2,
  "edad_comprador": [30, 10],
  "tipo_entrada": ["VIP", "Regular"],
  "forma_pago": "tarjeta de credito",
  "email_usuario": "franciscofigueroa303@gmail"
}
```

### Response Esperado (400 Bad Request)
```json
{
  "success": false,
  "message": "Forma de pago no válida"
}
```

---

## ❌ Ejemplo 6: Error - Fecha Inválida (Lunes)

### Request Body (JSON)
```json
{
  "fecha_evento": "2025-11-03",
  "cantidad_entradas": 2,
  "edad_comprador": [30, 10],
  "tipo_entrada": ["VIP", "Regular"],
  "forma_pago": "mercado pago",
  "email_usuario": "franciscofigueroa303@gmail"
}
```

### Response Esperado (400 Bad Request)
```json
{
  "success": false,
  "message": "Fecha de evento no válida, el parque está cerrado ese día"
}
```


