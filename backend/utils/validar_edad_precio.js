//Precio de las entradas:
//VIP: $10000
//Regular: $5000
//Condiciones de precio según edad:
//edad <= 3 : no pagan
//edad >= 60: no pagan
//4 >= edad <= 15: pagan la mitad (50% descuento)
//otra edad: precio normal

function validar_edad_precio(edad, tipo_entrada) {
    if (edad === null || edad === undefined || edad === '') {
        throw new Error('La edad es obligatoria');
    }
    
    if (typeof edad !== 'number' || isNaN(edad) || edad < 0) {
        throw new Error('La edad debe ser un número válido mayor o igual a 0');
    }
    
    if (!tipo_entrada || tipo_entrada.trim() === '') {
        throw new Error('El tipo de entrada es obligatorio');
    }
    
    if (tipo_entrada == 'VIP') {
        return calcular_precio_entrada(edad, 10000);
    } else if (tipo_entrada == 'Regular') {
        return calcular_precio_entrada(edad, 5000);
    } else {
        throw new Error('Tipo de entrada inválido');
    }
}

function calcular_precio_entrada(edad, precio_base) {
    if (edad <= 3 || edad >= 60) {
        // Menores de 3 años y mayores de 60 no pagan
        return 0;
    } else if (edad >= 4 && edad <= 15) {
        // Entre 4 y 15 años pagan la mitad
        return precio_base / 2;
    } else {
        // Resto paga precio normal
        return precio_base;
    }
}

module.exports = validar_edad_precio;