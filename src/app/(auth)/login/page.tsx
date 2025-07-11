"use client";

import { CustomButton } from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { FormEvent } from "react";
import Link from "next/link";
import { API_URL } from "@/services/api";

export default function LoginPage() {
  return (
    <div className="mx-auto mt-20">
      <h1 className="text-4xl font-normal text-center mb-9 uppercase">
        Log in here or{" "}
        <Link href="/register" className="underline">
          create account
        </Link>
      </h1>
      <div className="text-center text-base mb-12">
        <p>🎯 Don’t forget to log in!</p>
        <p>Unlock exclusive rewards, and track your orders with ease.</p>
      </div>

      <div className="flex flex-col items-center justify-center mb-28">
        <Link href="/" className="underline text-[#494791]">
          Continue as a guest<span className="inline-block ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}
