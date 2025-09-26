import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStripe, useElements } from "@stripe/react-stripe-js";

export interface CreatePaymentIntentRequest {
  amount: number; // сумма в копейках
  currency: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ConfirmPaymentRequest {
  clientSecret: string;
  paymentMethodId: string;
  billingDetails?: {
    name: string;
    email?: string;
    phone?: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      postal_code: string;
      country: string;
    };
  };
}

export interface ConfirmPaymentResponse {
  paymentIntent: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
  error?: {
    type: string;
    code: string;
    message: string;
  };
}

const createPaymentIntent = async (
  data: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  const response = await fetch("/api/orders/create-payment-intent/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

const confirmPayment = async (
  stripe: any,
  data: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> => {
  const { error, paymentIntent } = await stripe.confirmCardPayment(
    data.clientSecret,
    {
      payment_method: data.paymentMethodId,
      billing_details: data.billingDetails,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return { paymentIntent };
};

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: (data) => {
      console.log("Payment intent создан успешно:", data);
    },
    onError: (error) => {
      console.error("Ошибка при создании payment intent:", error);
    },
  });
};

export const useConfirmPayment = () => {
  const stripe = useStripe();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmPaymentRequest) => {
      if (!stripe) {
        throw new Error("Stripe не инициализирован");
      }
      return confirmPayment(stripe, data);
    },
    onSuccess: (data) => {
      console.log("Платеж подтвержден успешно:", data);

      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Ошибка при подтверждении платежа:", error);
    },
  });
};

export const usePaymentProcess = () => {
  const createPaymentIntentMutation = useCreatePaymentIntent();
  const confirmPaymentMutation = useConfirmPayment();

  const processPayment = async (
    amount: number,
    currency: string,
    paymentMethodId: string
  ) => {
    try {
      const paymentIntent = await createPaymentIntentMutation.mutateAsync({
        amount,
        currency,
      });

      const result = await confirmPaymentMutation.mutateAsync({
        clientSecret: paymentIntent.clientSecret,
        paymentMethodId,
      });

      return result;
    } catch (error) {
      console.error("Ошибка в процессе платежа:", error);
      throw error;
    }
  };

  return {
    processPayment,
    isCreatingPaymentIntent: createPaymentIntentMutation.isPending,
    isConfirmingPayment: confirmPaymentMutation.isPending,
    isProcessing:
      createPaymentIntentMutation.isPending || confirmPaymentMutation.isPending,
    createPaymentIntentError: createPaymentIntentMutation.error,
    confirmPaymentError: confirmPaymentMutation.error,
    error: createPaymentIntentMutation.error || confirmPaymentMutation.error,
  };
};
