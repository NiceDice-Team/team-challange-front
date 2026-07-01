import type { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your Dice & Decks account.",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
