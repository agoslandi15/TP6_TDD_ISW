import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Crear instancia de Axios con configuración base
const api_client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos de timeout para móvil
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces TypeScript
interface datos_compra {
  fecha_evento: string;
  cantidad_entradas: number;
  edad_comprador: number[];
  tipo_entrada: string[];
  forma_pago: string;
  email_usuario: string;
}

interface resultado_compra {
  success: boolean;
  data?: any;
  status?: number;
  error?: string;
  details?: any;
}

// Interceptor para requests (opcional - para logging o auth)
api_client.interceptors.request.use(
  (config: any) => {
    console.log(`🚀 Realizando petición: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: any) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses (opcional - para manejo global de errores)
api_client.interceptors.response.use(
  (response: any) => {
    console.log(`✅ Respuesta exitosa: ${response.status}`, response.data);
    return response;
  },
  (error: any) => {
    console.error('❌ Error en response:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Service para comprar entradas del parque ecológico
 */
export const comprar_entradas_service = {
  
  /**
   * Realizar compra de entradas
   */
  async comprar_entradas(datos_compra: datos_compra): Promise<resultado_compra> {
    try {
      // Validar datos antes de enviar
      this.validar_datos_compra(datos_compra);

      const response = await api_client.post('/api/comprar-entrada', datos_compra);
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
      
    } catch (error: any) {
      console.error('Error al comprar entradas:', error);
      
      // Manejo específico de errores HTTP
      if (error.response) {
        // El servidor respondió con un status de error
        return {
          success: false,
          error: error.response.data.message || 'Error del servidor',
          status: error.response.status,
          details: error.response.data
        };
      } else if (error.request) {
        // La petición se realizó pero no hubo respuesta
        return {
          success: false,
          error: 'No se pudo conectar con el servidor. Verifica que el backend esté funcionando.',
          status: 0
        };
      } else {
        // Error en la configuración de la petición
        return {
          success: false,
          error: error.message || 'Error inesperado',
          status: 0
        };
      }
    }
  },

  /**
   * Validar los datos de compra antes de enviarlos
   */
  validar_datos_compra(datos_compra: datos_compra): void {
    const { 
      fecha_evento, 
      cantidad_entradas, 
      edad_comprador, 
      tipo_entrada, 
      forma_pago, 
      email_usuario 
    } = datos_compra;

    // Validar campos requeridos
    if (!fecha_evento) throw new Error('La fecha del evento es requerida');
    if (!cantidad_entradas) throw new Error('La cantidad de entradas es requerida');
    if (!edad_comprador || !Array.isArray(edad_comprador)) throw new Error('Las edades de los compradores son requeridas');
    if (!tipo_entrada || !Array.isArray(tipo_entrada)) throw new Error('Los tipos de entrada son requeridos');
    if (!forma_pago) throw new Error('La forma de pago es requerida');
    if (!email_usuario) throw new Error('El email del usuario es requerido');

    // Validar coherencia de arrays
    if (edad_comprador.length !== cantidad_entradas) {
      throw new Error('La cantidad de edades debe coincidir con la cantidad de entradas');
    }
    if (tipo_entrada.length !== cantidad_entradas) {
      throw new Error('La cantidad de tipos de entrada debe coincidir con la cantidad de entradas');
    }

    // Validar formato de email
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email_regex.test(email_usuario)) {
      throw new Error('El formato del email no es válido');
    }

    // Validar cantidad máxima
    if (cantidad_entradas > 10) {
      throw new Error('No se pueden comprar más de 10 entradas');
    }

    // Validar formas de pago válidas
    const formas_pago_validas = ['mercado pago', 'efectivo'];
    if (!formas_pago_validas.includes(forma_pago.toLowerCase())) {
      throw new Error('Forma de pago no válida. Use "mercado pago" o "efectivo"');
    }

    // Validar tipos de entrada válidos
    const tipos_entrada_validos = ['Regular', 'VIP'];
    tipo_entrada.forEach((tipo, index) => {
      if (!tipos_entrada_validos.includes(tipo)) {
        throw new Error(`Tipo de entrada no válido en la posición ${index + 1}. Use "Regular" o "VIP"`);
      }
    });

    // Validar edades
    edad_comprador.forEach((edad, index) => {
      if (!Number.isInteger(edad) || edad < 0 || edad > 120) {
        throw new Error(`Edad no válida en la posición ${index + 1}. Debe ser un número entre 0 y 120`);
      }
    });

    // Validar formato de fecha
    const fecha_regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fecha_regex.test(fecha_evento)) {
      throw new Error('El formato de fecha debe ser YYYY-MM-DD');
    }
  },

  /**
   * Función auxiliar para crear datos de compra con formato correcto
   */
  crear_datos_compra(params: any): datos_compra {
    return {
      fecha_evento: params.fechaEvento,
      cantidad_entradas: parseInt(params.cantidadEntradas),
      edad_comprador: params.edadComprador.map((edad: any) => parseInt(edad)),
      tipo_entrada: params.tipoEntrada,
      forma_pago: params.formaPago.toLowerCase(),
      email_usuario: params.emailUsuario.toLowerCase().trim()
    };
  }
};

// Export por defecto del service
export default comprar_entradas_service;

// Exportar también la instancia de axios por si se necesita en otros lugares
export { api_client };

// Exportar tipos
export type { datos_compra, resultado_compra };