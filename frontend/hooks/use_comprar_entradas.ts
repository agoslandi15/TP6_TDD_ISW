import { useState } from 'react';
import { useRouter } from 'next/navigation';
import comprar_entradas_service from '../services/comprar_entradas';

interface Visitor {
  age: number | null;
  pass_type: "VIP" | "Regular";
}

interface use_comprar_entradas_props {
  on_success?: (codigo_entrada: string) => void;
  on_error?: (error: string) => void;
}

export function use_comprar_entradas({ on_success, on_error }: use_comprar_entradas_props = {}) {
  const router = useRouter();
  const [is_loading, set_is_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  const comprar_entradas = async (
    visit_date: string,
    quantity: number,
    visitors: Visitor[],
    payment_method: "cash" | "card",
    user_email: string,
    user_id: string
  ) => {
    set_is_loading(true);
    set_error(null);

    try {
      // Preparar datos para el backend
      const datos_compra = {
        fecha_evento: visit_date,
        cantidad_entradas: quantity,
        edad_comprador: visitors.map(v => v.age!),
        tipo_entrada: visitors.map(v => v.pass_type),
        forma_pago: payment_method === "card" ? "mercado pago" : "efectivo",
        email_usuario: user_email
      };

      console.log("Enviando datos al backend:", datos_compra);

      // Realizar la compra usando el service
      const resultado = await comprar_entradas_service.comprar_entradas(datos_compra) as any;

      if (resultado.success) {
        console.log("Compra exitosa:", resultado.data);
        
        // Guardar datos de la compra en localStorage para las páginas de confirmación
        const ticket_data = {
          id: resultado.data.codigo_entrada,
          user_id: user_id,
          visit_date: visit_date,
          quantity,
          visitors,
          payment_method: payment_method,
          total_amount: resultado.data.total,
          purchase_date: new Date().toISOString(),
          status: "confirmed",
          codigoEntrada: resultado.data.codigo_entrada
        };

        localStorage.setItem(`ticket_${resultado.data.codigo_entrada}`, JSON.stringify(ticket_data));

        // Callback de éxito
        if (on_success) {
          on_success(resultado.data.codigo_entrada);
        }

        return {
          success: true,
          codigoEntrada: resultado.data.codigo_entrada,
          total: resultado.data.total,
          data: ticket_data
        };
      } else {
        const error_message = resultado.error || "Error desconocido al procesar la compra";
        set_error(error_message);
        
        if (on_error) {
          on_error(error_message);
        }

        return {
          success: false,
          error: error_message
        };
      }
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      const error_message = "Error de conexión. Por favor, verifica que el backend esté funcionando.";
      set_error(error_message);
      
      if (on_error) {
        on_error(error_message);
      }

      return {
        success: false,
        error: error_message
      };
    } finally {
      set_is_loading(false);
    }
  };

  const redirect_to_payment = (ticket_id: string) => {
    router.push(`/pag_mp?ticketId=${ticket_id}`);
  };

  const redirect_to_confirmation = (ticket_id: string) => {
    router.push(`/pag_confirmacion?ticketId=${ticket_id}`);
  };

  const clear_error = () => {
    set_error(null);
  };

  return {
    comprar_entradas,
    redirect_to_payment,
    redirect_to_confirmation,
    clear_error,
    is_loading,
    error
  };
}