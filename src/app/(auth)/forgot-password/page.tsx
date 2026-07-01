import type { Metadata } from "next";
import ForgotPasswordPageClient from "./ForgotPasswordPageClient";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a password reset link for your Dice & Decks account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}
