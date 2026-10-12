import type { Metadata } from "next";
import OrderReviewPageClient from "./OrderReviewPageClient";

export const metadata: Metadata = {
  title: "Order review",
  description: "Review your order and payment details before placing your purchase.",
};

export default function OrderReviewPage() {
  return <OrderReviewPageClient />;
}
