import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);
console.log( 'stripeKey', stripeKey);
export default function PaymentWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
