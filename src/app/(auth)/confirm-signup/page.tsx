import type { Metadata } from "next";
import ConfirmSignupPageClient from "./ConfirmSignupPageClient";

export const metadata: Metadata = {
  title: "Confirm registration",
  description: "Thank you for registering with Dice & Decks.",
};

export default function ConfirmSignupPage() {
  return <ConfirmSignupPageClient />;
}
