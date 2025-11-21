"use client";

import Link from "next/link";
import ArrowNext from "../../../../../public/icons/ArrowNext.svg";
import Image from "next/image";
import { useEffect } from "react";
import { showCustomToast } from "@/components/shared/Toast";

export default function ForgotPasswordPage() {
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      showCustomToast({
        type: "success",
        title: "Success! You are logged.",
        description: "A password reset link has been sent to your inbox.",
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center mx-auto mt-32 mb-32 md:w-[464px] w-xs">
      <h1 className="mb-9 md:text-title text-2xl uppercase">
        ✉️ Check Your Inbox
      </h1>
      <p className="mb-12 text-base text-center">
        If the email address you entered is associated with an account, you’ll
        receive a password reset link shortly
      </p>
      <p className="mb-12 text-base">
        Check the message for 5-10 minutes. If you don&apos;t find the list,
        please check your spam folder and resend it again.
      </p>
      <div className="flex flex-row justify-center items-center gap-1 mb-12">
        <p className="text-base">Didn’t receive the email?</p>
        <Link href="/forgot-password" className="flex gap-1">
          <span className="underline">Resend</span>
        </Link>
      </div>

      <Link href="/catalog" className="flex gap-1">
        <span className="text-purple underline">Continue shopping</span>
        <Image src={ArrowNext} alt="arrow" />
      </Link>
    </div>
  );
}
