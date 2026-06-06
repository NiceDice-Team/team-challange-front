"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm, {
  type PaymentFormData,
  type PaymentFormHandle,
} from "./PaymentForm";
import { forwardRef } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);

interface PaymentWrapperProps {
  onDataChange?: (data: PaymentFormData) => void;
  onValidityChange?: (isValid: boolean) => void;
  initialData?: Partial<PaymentFormData>;
}

const PaymentWrapper = forwardRef<PaymentFormHandle, PaymentWrapperProps>(
  function PaymentWrapper({ onDataChange, onValidityChange, initialData }, ref) {
    return (
      <Elements stripe={stripePromise}>
        <PaymentForm
          ref={ref}
          onDataChange={onDataChange}
          onValidityChange={onValidityChange}
          initialData={initialData}
        />
      </Elements>
    );
  }
);

export default PaymentWrapper;
