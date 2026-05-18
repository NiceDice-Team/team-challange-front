"use client";

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { CustomInput } from "../shared/CustomInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { usePaymentProcess } from "@/hooks/usePaymentProcess";
import { useCartQuery } from "@/hooks/useCartQuery";
import { showCustomToast } from "../shared/Toast";
import { CustomButton } from "../shared/CustomButton";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-1 mt-1">
      <Info size={16} color="#e30000" />
      <p className="text-error text-sm normal-case">{message}</p>
    </div>
  );
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      "::placeholder": {
        color: "#B3B3B3",
      },
    },
    invalid: {
      color: "#e30000",
    },
  },
};

const requiredCardField = (message: string) =>
  z.boolean().refine((value) => value === true, { message });

const schema = z.object({
  firstName: z
    .string()
    .min(2, "First name is required")
    .trim()
    .regex(/^[a-zA-Z]+$/, "Only letters are allowed"),
  lastName: z
    .string()
    .min(2, "Last name is required")
    .trim()
    .regex(/^[a-zA-Z]+$/, "Only letters are allowed"),
  cardNumberComplete: requiredCardField("Card number is required"),
  cardExpiryComplete: requiredCardField("Expiration date is required"),
  cardCvcComplete: requiredCardField("CVV is required"),
});

export type PaymentFormData = z.infer<typeof schema>;

export type PaymentFormHandle = {
  validate: () => Promise<boolean>;
};

interface PaymentFormProps {
  onDataChange?: (data: PaymentFormData) => void;
  onValidityChange?: (isValid: boolean) => void;
  initialData?: Partial<PaymentFormData>;
}

const PaymentForm = forwardRef<PaymentFormHandle, PaymentFormProps>(
  function PaymentForm({ onDataChange, onValidityChange, initialData }, ref) {
  const stripe = useStripe();
  const elements = useElements();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      cardNumberComplete: false,
      cardExpiryComplete: false,
      cardCvcComplete: false,
    },
  });

  const handleCardChange =
    (field: "cardNumberComplete" | "cardExpiryComplete" | "cardCvcComplete") =>
    (event: { complete: boolean }) => {
      setValue(field, event.complete, { shouldValidate: true });
    };

  const handleCardBlur =
    (field: "cardNumberComplete" | "cardExpiryComplete" | "cardCvcComplete") =>
    () => {
      void trigger(field);
    };
  const { processPayment, isProcessing, error } = usePaymentProcess();
  const { data: cartItems = [], isLoading: cartLoading } = useCartQuery();
  const amountInCents = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );
  const formData = watch();
  const stableFormData = useMemo(() => formData, [formData]);

  const isPaymentReady = useMemo(
    () => schema.safeParse(formData).success,
    [formData]
  );

  const isPayDisabled =
    !stripe ||
    !isPaymentReady ||
    isProcessing ||
    cartLoading ||
    amountInCents <= 0;

  useImperativeHandle(ref, () => ({
    validate: () => trigger(),
  }));

  useEffect(() => {
    onValidityChange?.(isPaymentReady && !!stripe);
  }, [isPaymentReady, stripe, onValidityChange]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onDataChange?.(stableFormData);
    }, 500);

    return () => clearTimeout(handler);
  }, [stableFormData, onDataChange]);

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof PaymentFormData, value);
        }
      });
    }
  }, [initialData, setValue]);

  const handleSubmitForm = async (data: PaymentFormData) => {
    if (!stripe || !elements) return;

    const card = elements.getElement(CardNumberElement);
    if (card) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: { name: `${data.firstName} ${data.lastName}` },
      });
      if (error) {
        console.error(error);
        showCustomToast({
          type: "error",
          title: "Payment failed",
          description: error.message,
        });
      } else {
        processPayment(amountInCents, "usd", paymentMethod.id);
        showCustomToast({ type: "success", title: "Payment successful" });
      }
    }
  };

  return (
    <>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <CustomInput
          label="First Name"
          id="firstName"
          name="firstName"
          placeholder="Enter your first name"
          blockClassName="gap-1"
          {...register("firstName")}
          onBlur={() => {
            void trigger("firstName");
          }}
          error={
            errors.firstName?.message ? [errors.firstName?.message] : undefined
          }
        />
        <CustomInput
          label="Last Name"
          id="lastName"
          name="lastName"
          placeholder="Enter your last name"
          blockClassName="gap-1"
          {...register("lastName")}
          onBlur={() => {
            void trigger("lastName");
          }}
          error={
            errors.lastName?.message ? [errors.lastName?.message] : undefined
          }
        />
        <label className="font-normal text-base uppercase">
          Card number
          <div
            className={cn(
              "relative px-4 pt-4 border border-black rounded h-12",
              errors.cardNumberComplete && "border-error"
            )}
            style={{ position: "relative" }}
          >
            <CardNumberElement
              onChange={handleCardChange("cardNumberComplete")}
              onBlur={handleCardBlur("cardNumberComplete")}
              options={{
                placeholder: "• • • •  • • • •  • • • •  • • • •",
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#000",
                    "::placeholder": { color: "#888" },
                  },
                  invalid: { color: "#fa755a" },
                },
              }}
            />
          </div>
          <FieldError message={errors.cardNumberComplete?.message} />
        </label>

        <div className="flex gap-6">
          <div className={cn("w-1/2 font-normal text-base uppercase")}>
            Expiration Date
            <div
              className={cn(
                "px-4 pt-4 border-1 border-black rounded-none h-12",
                errors.cardExpiryComplete && "border-error"
              )}
            >
              <CardExpiryElement
                onChange={handleCardChange("cardExpiryComplete")}
                onBlur={handleCardBlur("cardExpiryComplete")}
                options={{
                  placeholder: "MM/YY",
                  ...CARD_ELEMENT_OPTIONS,
                }}
              />
            </div>
            <FieldError message={errors.cardExpiryComplete?.message} />
          </div>
          <label className={cn("w-1/2 font-normal text-base uppercase")}>
            cvv
            <div
              className={cn(
                "px-4 pt-4 border-1 border-black rounded-none h-12",
                errors.cardCvcComplete && "border-error"
              )}
            >
              <CardCvcElement
                onChange={handleCardChange("cardCvcComplete")}
                onBlur={handleCardBlur("cardCvcComplete")}
                options={{
                  placeholder: "• • •",
                  ...CARD_ELEMENT_OPTIONS,
                }}
              />
            </div>
            <FieldError message={errors.cardCvcComplete?.message} />
          </label>
        </div>

        <CustomButton
          type="submit"
          disabled={isPayDisabled}
          loading={isProcessing}
          className="bg-purple hover:bg-purple/90 border border-purple w-full h-12 text-white text-base uppercase leading-[19px]"
        >
          Pay
        </CustomButton>
      </form>
    </>
  );
});

export default PaymentForm;
