import type { Metadata } from "next";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "My account",
  description: "Manage your Dice & Decks profile, orders, and account settings.",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
