import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripeKey = process.env.STRIPE_KEY;
const stripePromise = loadStripe(stripeKey);

export default function PaymentWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
