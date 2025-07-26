"use client";

import React, { useState, Suspense } from "react";
import { CustomButton } from "@/components/shared/CustomButton";
import Link from "next/link";
import { fetchAPI } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { resetPasswordSchema } from "@/lib/definitions";

function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  }>({});

  const router = useRouter();
  const searchParams = useSearchParams();

  const validateForm = () => {
    try {
      resetPasswordSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        const errors: { [key: string]: string[] } = {};
        error.errors.forEach((err: any) => {
          const field = err.path[0];
          if (!errors[field]) errors[field] = [];
          errors[field].push(err.message);
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFormData = { ...formData, [field]: e.target.value };
      setFormData(newFormData);

      // Валидируем только если есть ошибки
      if (Object.keys(validationErrors).length > 0) {
        validateForm();
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const token = searchParams.get("token");
      if (!token) {
        setError("Token not found");
        return;
      }

      console.log("body", token, formData.password);
      // await fetchAPI("users/reset-password/", {
      //   method: "POST",
      //   body: { token, password: formData.password },
      // });
      // router.push("/reset-password/success");
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Error resetting password. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.password.trim() &&
    formData.confirmPassword.trim() &&
    Object.keys(validationErrors).length === 0;

  return (
    <div className="flex flex-col items-center mx-auto mt-20 mb-32">
      <h1 className="mb-9 font-normal text-4xl text-center uppercase">
        🔐 Reset Your Password
      </h1>
      <div className="mb-12 text-base text-center">
        You&apos;ve made it!
        <br /> Now enter a new password to continue your quest
      </div>

      <form className="space-y-6 w-[504px]" onSubmit={handleSubmit}>
        <PasswordInput
          placeholder="Enter password"
          id="password"
          label="Password"
          name="password"
          onChange={handleInputChange("password")}
          disabled={isSubmitting}
          error={validationErrors.password}
        />
        <PasswordInput
          placeholder="Enter password"
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          onChange={handleInputChange("confirmPassword")}
          disabled={isSubmitting}
          error={validationErrors.confirmPassword}
        />

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <CustomButton
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isFormValid}
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
