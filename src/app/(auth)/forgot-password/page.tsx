"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomButton } from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";
import Link from "next/link";
import { fetchAPI } from "@/services/api";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { PublicRoute } from "@/components/auth/RouteGuards";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordPageContent() {
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError("");
    try {
      await fetchAPI("users/forgot-password/", {
        method: "POST",
        body: {
          email: data.email,
        },
      });
      router.push("/forgot-password/success");
    } catch (error) {
      console.error("Error sending reset email:", error);
      setError("Error sending reset email. Try again.");
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

      <form className="space-y-6 w-[504px]" onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          placeholder="Enter email address"
          id="email"
          label="Email"
          name="email"
          {...register("email")}
          disabled={isSubmitting}
          error={errors.email?.message ? [errors.email.message] : undefined}
        />
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <CustomButton
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
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

export default function ForgotPasswordPage() {
  return (
    <PublicRoute>
      <ForgotPasswordPageContent />
    </PublicRoute>
  );
}
