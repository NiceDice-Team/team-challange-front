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

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const handleSubmit = async (data: any) => {
    console.log("   data", data);
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: { name: `${data.firstName} ${data.lastName}` },
      });
      console.log("error", error, "paymentMethod", paymentMethod);
    }
  };

  return (
    <>
      <div className="pb-10 text-xl uppercase">Payment</div>
      <form
        onSubmit={handleSubmitForm(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <CustomInput
          label="First Name"
          id="firstName"
          name="firstName"
          placeholder="Enter your first name"
          blockClassName="gap-1"
          {...register("firstName")}
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
