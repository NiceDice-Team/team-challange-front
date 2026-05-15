"use client";

import Link from "next/link";
import ArrowNext from "../../../../public/icons/ArrowNext.svg";
import Image from "next/image";
import { PublicRoute } from "@/components/auth/RouteGuards";
import { showCustomToast } from "@/components/shared/Toast";
import { useEffect } from "react";

function ConfirmSignUpContent() {
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      showCustomToast({
        type: "success",
        title: "Success! You are registered.",
        description: "A confirmation email has been sent to your inbox.",
      });
    }
  }, []);
  return (
    <div className="flex flex-col items-center mt-23 mb-65">
      <h1 className="mb-9 md:text-title text-2xl text-center uppercase">
        Thank you for registering!
      </h1>
      <p className="text-base">
        A confirmation email has been sent to your inbox.
      </p>
      <p className="mb-9 text-base">
        Please click the link in that email to activate your account.
      </p>
      <p className="mb-12 text-base">
        Check the message for 5-10 minutes. If you don&apos;t find the list,
        please check your spam folder and resend it again.
      </p>
      <Link href="/catalog" className="flex gap-1">
        <span className="text-purple underline">Browse games</span>
        <Image src={ArrowNext} alt="arrow" />
      </Link>
    </div>
  );
}

export default function CofirmSignUp() {
  return (
    <PublicRoute>
      <ConfirmSignUpContent />
    </PublicRoute>
  );
}
