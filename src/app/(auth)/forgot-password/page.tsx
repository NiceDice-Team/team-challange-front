"use client";

import React, { useState } from "react";
import { CustomButton } from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";
import Link from "next/link";
import { fetchAPI } from "@/services/api";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/definitions";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const router = useRouter();
  
  const validateEmail = (email: string) => {
    try {
      forgotPasswordSchema.parse({ email });
      setValidationErrors([]);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => err.message);
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await fetchAPI("users/forgot-password/", {
        method: "POST",
        body: {
          email: email,
        },
      });
      router.push("/forgot-password/success");
    } catch (error) {
      console.error("Error sending reset email:", error);
      setError("Error sending reset email. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto mt-20 mb-32">
      <h1 className="mb-9 font-normal text-4xl text-center uppercase">
        🔒Forgot your password?
      </h1>
      <div className="mb-12 text-base text-center">
        🧩 No problem! Just enter your email address below and <br /> we’ll send
        you a link to reset your password
      </div>

      <form className="space-y-6 w-[504px]" onSubmit={handleSubmit}>
        <CustomInput
          placeholder="Enter email address"
          id="email"
          label="Email"
          name="email"
          onChange={handleEmailChange}
          disabled={isSubmitting}
          error={validationErrors.length > 0 ? validationErrors : undefined}
        />
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <CustomButton
          type="submit"
          className="w-full"
          disabled={
            isSubmitting || validationErrors.length > 0 || !email.trim()
          }
          loading={isSubmitting}
        >
          {isSubmitting ? "SUBMITINNG..." : "SUBMIT"}
        </CustomButton>
      </form>

      <div className="flex flex-row justify-center items-center gap-1 mt-12 text-purple text-center">
        Don’t need help anymore?
        <Link href="/login" className="underline">
          Sign in<span className="inline-block ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}
