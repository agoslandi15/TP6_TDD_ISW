//Precio de las entradas:
//VIP: $10000
//Regular: $5000
//Menores de 3 años y mayores de 60 años no pagan
//Menores de 15 pagan mitad de entrada


function validar_edad_precio(edad, tipo_entrada) {
    if (tipo_entrada == 'VIP') {
        return calcular_precio_entrada(edad, 10000);
    } else if (tipo_entrada == 'Regular') {
        return calcular_precio_entrada(edad, 5000);
    }
}

function calcular_precio_entrada(edad, precio_base) {
    if (edad < 3 || edad > 60) {
        return 0;
    } else if (edad < 15) {
        return precio_base / 2;
    } else {
        return precio_base;
    }
}

module.exports = validar_edad_precio;