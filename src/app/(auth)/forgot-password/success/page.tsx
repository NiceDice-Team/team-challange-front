import type { Metadata } from "next";
import ForgotPasswordSuccessPageClient from "./ForgotPasswordSuccessPageClient";

export const metadata: Metadata = {
  title: "Check your inbox",
  description: "We sent a password reset link to your email.",
};

export default function ForgotPasswordSuccessPage() {
  return <ForgotPasswordSuccessPageClient />;
}
