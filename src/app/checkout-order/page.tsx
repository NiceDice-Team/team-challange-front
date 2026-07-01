import type { Metadata } from "next";
import CheckoutPageClient from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Dice & Decks order with shipping and delivery options.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
