import { useMutation } from "@tanstack/react-query";

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
