import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { comprarEntradasService } from '@/services/comprarEntradas';

interface Visitor {
  age: number | null;
  passType: "VIP" | "Regular";
}

interface UseComprarEntradasProps {
  onSuccess?: (codigoEntrada: string) => void;
  onError?: (error: string) => void;
}

export function useComprarEntradas({ onSuccess, onError }: UseComprarEntradasProps = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const comprarEntradas = async (
    visitDate: string,
    quantity: number,
    visitors: Visitor[],
    paymentMethod: "cash" | "card",
    userEmail: string,
    userId: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Preparar datos para el backend
      const datosCompra = {
        fecha_evento: visitDate,
        cantidad_entradas: quantity,
        edad_comprador: visitors.map(v => v.age!),
        tipo_entrada: visitors.map(v => v.passType),
        forma_pago: paymentMethod === "card" ? "mercado pago" : "efectivo",
        email_usuario: userEmail
      };

      console.log("Enviando datos al backend:", datosCompra);

      // Realizar la compra usando el service
      const resultado = await comprarEntradasService.comprarEntradas(datosCompra) as any;

      if (resultado.success) {
        console.log("Compra exitosa:", resultado.data);
        
        // Guardar datos de la compra en localStorage para las páginas de confirmación
        const ticketData = {
          id: resultado.data.codigo_entrada,
          userId: userId,
          visitDate,
          quantity,
          visitors,
          paymentMethod: paymentMethod,
          totalAmount: resultado.data.total,
          purchaseDate: new Date().toISOString(),
          status: "confirmed",
          codigoEntrada: resultado.data.codigo_entrada
        };

        localStorage.setItem(`ticket_${resultado.data.codigo_entrada}`, JSON.stringify(ticketData));

        // Callback de éxito
        if (onSuccess) {
          onSuccess(resultado.data.codigo_entrada);
        }

        return {
          success: true,
          codigoEntrada: resultado.data.codigo_entrada,
          total: resultado.data.total,
          data: ticketData
        };
      } else {
        const errorMessage = resultado.error || "Error desconocido al procesar la compra";
        setError(errorMessage);
        
        if (onError) {
          onError(errorMessage);
        }

        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      const errorMessage = "Error de conexión. Por favor, verifica que el backend esté funcionando.";
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToPayment = (ticketId: string) => {
    router.push(`/payment?ticketId=${ticketId}`);
  };

  const redirectToConfirmation = (ticketId: string) => {
    router.push(`/confirmation?ticketId=${ticketId}`);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    comprarEntradas,
    redirectToPayment,
    redirectToConfirmation,
    clearError,
    isLoading,
    error
  };
}