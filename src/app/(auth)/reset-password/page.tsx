import type { Metadata } from "next";
import ResetPasswordPageClient from "./ResetPasswordPageClient";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your Dice & Decks account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}
