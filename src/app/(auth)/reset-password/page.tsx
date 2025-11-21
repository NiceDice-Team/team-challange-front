"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomButton } from "@/components/shared/CustomButton";
import Link from "next/link";
import { fetchAPI } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { resetPasswordSchema } from "@/lib/definitions";
import { showCustomToast } from "@/components/shared/Toast";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const uidParam = searchParams.get("uid");

    let decodedUid: string | null = null;

    if (uidParam) {
      try {
        decodedUid = atob(uidParam);
      } catch (err) {
        console.warn("Invalid Base64 uid:", uidParam);
      }
    }

    setToken(tokenParam);
    setUserId(decodedUid);
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError("");

    try {
      const response = await fetchAPI("users/reset-password/", {
        method: "POST",
        body: { userId, token, password: data.password },
      });

      if (response) {
        showCustomToast({
          type: "success",
          title: "Success! Your password has been changed.",
          description: "You can now continue your adventure",
        });

        router.push("/login?mode=back");
      }
    } catch (error) {
      console.error("Error resetting password:", error);

      if (error?.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err: any) => {
          if (err.detail) {
            console.error("Server error detail:", err.detail);
          }
        });

        const firstError = error.errors[0];
        if (firstError?.detail) {
          setError(firstError.detail);
        } else {
          setError("Error resetting password. Try again.");
        }
      } else {
        setError("Error resetting password. Try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto mt-20 mb-32">
      <h1 className="mb-9 font-normal md:text-title text-2xl text-center uppercase">
        🔐 Reset Your Password
      </h1>
      <div className="mb-12 text-base text-center">
        You&apos;ve made it!
        <br /> Now enter a new password to continue your quest
      </div>

      <form
        className="space-y-6 md:w-[504px] w-xs"
        onSubmit={handleSubmit(onSubmit)}
      >
        <PasswordInput
          placeholder="Enter password"
          id="password"
          label="Password"
          name="password"
          {...register("password")}
          disabled={isSubmitting}
          error={
            errors.password?.message ? [errors.password.message] : undefined
          }
        />
        <PasswordInput
          placeholder="Enter password"
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          {...register("confirmPassword")}
          disabled={isSubmitting}
          error={
            errors.confirmPassword?.message
              ? [errors.confirmPassword.message]
              : undefined
          }
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
          {isSubmitting ? "RESETTING..." : "RESET"}
        </CustomButton>
      </form>

      <div className="flex flex-row justify-center items-center gap-1 mt-12 text-purple text-center">
        Don&apos;t need help anymore?
        <Link href="/login" className="underline">
          Sign in<span className="inline-block ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center mx-auto mt-20 mb-32">
      <div className="animate-pulse">
        <div className="bg-gray-200 mb-9 rounded w-96 h-12"></div>
        <div className="bg-gray-200 mb-12 rounded w-80 h-6"></div>
        <div className="space-y-6 w-[504px]">
          <div className="bg-gray-200 rounded h-12"></div>
          <div className="bg-gray-200 rounded h-12"></div>
          <div className="bg-gray-200 rounded h-12"></div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
