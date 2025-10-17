import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Crear instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (opcional - para logging o auth)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Realizando petición: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses (opcional - para manejo global de errores)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta exitosa: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Service para comprar entradas del parque ecológico
 */
export const comprarEntradasService = {
  
  /**
   * Realizar compra de entradas
   * @param {Object} datosCompra - Datos de la compra
   * @param {string} datosCompra.fecha_evento - Fecha del evento (YYYY-MM-DD)
   * @param {number} datosCompra.cantidad_entradas - Cantidad de entradas (máx. 10)
   * @param {number[]} datosCompra.edad_comprador - Array con las edades de cada comprador
   * @param {string[]} datosCompra.tipo_entrada - Array con los tipos de entrada ("Regular" o "VIP")
   * @param {string} datosCompra.forma_pago - Forma de pago ("mercado pago" o "efectivo")
   * @param {string} datosCompra.email_usuario - Email del usuario para confirmación
   * @returns {Promise<Object>} Respuesta de la API con los datos de la compra
   */
  async comprarEntradas(datosCompra) {
    try {
      // Validar datos antes de enviar
      this.validarDatosCompra(datosCompra);

      const response = await apiClient.post('/api/comprar-entrada', datosCompra);
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
      
    } catch (error) {
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
   * @param {Object} datosCompra - Datos a validar
   * @throws {Error} Si los datos no son válidos
   */
  validarDatosCompra(datosCompra) {
    const { 
      fecha_evento, 
      cantidad_entradas, 
      edad_comprador, 
      tipo_entrada, 
      forma_pago, 
      email_usuario 
    } = datosCompra;

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_usuario)) {
      throw new Error('El formato del email no es válido');
    }

    // Validar cantidad máxima
    if (cantidad_entradas > 10) {
      throw new Error('No se pueden comprar más de 10 entradas');
    }

    // Validar formas de pago válidas
    const formasPagoValidas = ['mercado pago', 'efectivo'];
    if (!formasPagoValidas.includes(forma_pago.toLowerCase())) {
      throw new Error('Forma de pago no válida. Use "mercado pago" o "efectivo"');
    }

    // Validar tipos de entrada válidos
    const tiposEntradaValidos = ['Regular', 'VIP'];
    tipo_entrada.forEach((tipo, index) => {
      if (!tiposEntradaValidos.includes(tipo)) {
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
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha_evento)) {
      throw new Error('El formato de fecha debe ser YYYY-MM-DD');
    }
  },

  /**
   * Función auxiliar para crear datos de compra con formato correcto
   * @param {Object} params - Parámetros de la compra
   * @returns {Object} Objeto con formato correcto para la API
   */
  crearDatosCompra(params) {
    return {
      fecha_evento: params.fechaEvento,
      cantidad_entradas: parseInt(params.cantidadEntradas),
      edad_comprador: params.edadComprador.map(edad => parseInt(edad)),
      tipo_entrada: params.tipoEntrada,
      forma_pago: params.formaPago.toLowerCase(),
      email_usuario: params.emailUsuario.toLowerCase().trim()
    };
  }
};

// Export por defecto del service
export default comprarEntradasService;

// Exportar también la instancia de axios por si se necesita en otros lugares
export { apiClient };
