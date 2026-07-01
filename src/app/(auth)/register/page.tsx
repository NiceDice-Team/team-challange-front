import type { Metadata } from "next";
import RegisterPageClient from "./RegisterPageClient";

export const metadata: Metadata = {
  title: "Create account",
  description: "Register for a Dice & Decks account to track orders and checkout faster.",
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
