import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your shopping cart at Dice & Decks.",
};

export default function CartPage() {
  return <CartPageClient />;
}
