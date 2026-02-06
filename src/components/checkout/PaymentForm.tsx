import {
  useStripe,
  useElements,
  CardElement,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { CustomInput } from "../shared/CustomInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";
import { usePaymentProcess } from "@/hooks/usePaymentProcess";
import { useCartQuery } from "@/hooks/useCartQuery";
import { showCustomToast } from "../shared/Toast";

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
});

type PaymentFormData = z.infer<typeof schema>;

interface PaymentFormProps {
  onDataChange?: (data: PaymentFormData) => void;
  initialData?: Partial<PaymentFormData>;
}

export default function PaymentForm({
  onDataChange,
  initialData,
}: PaymentFormProps) {
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
    mode: "onBlur",
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
    },
  });
  const { processPayment, isProcessing, error } = usePaymentProcess();
  const { data: cartItems = [], isLoading: cartLoading } = useCartQuery();
  const amountInCents = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );
  const formData = watch();
  const stableFormData = useMemo(() => formData, [formData]);

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

  const handleSubmitForm = async (data: any) => {
    console.log("   data", data);
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
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
      <div className="pb-10 text-xl uppercase">Payment</div>
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
            className="relative px-4 pt-4 border border-black rounded h-12"
            style={{ position: "relative" }}
          >
            <CardNumberElement
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
        </label>

        <div className="flex gap-6">
          <div className={cn("w-1/2 font-normal text-base uppercase")}>
            Expiration Date
            <div
              className={cn(
                "px-4 pt-4 border-1 border-black rounded-none h-12"
              )}
            >
              <CardExpiryElement
                options={{
                  placeholder: "MM/YY",
                  ...CARD_ELEMENT_OPTIONS,
                }}
              />
            </div>
          </div>
          <label className={cn("w-1/2 font-normal text-base uppercase")}>
            cvv
            <div
              className={cn(
                "px-4 pt-4 border-1 border-black rounded-none h-12"
              )}
            >
              <CardCvcElement
                options={{
                  placeholder: "• • •",
                  ...CARD_ELEMENT_OPTIONS,
                }}
              />
            </div>
          </label>
        </div>
      </form>
    </>
  );
}
