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
import { useTranslation } from "react-i18next";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  console.log(userId, token);
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

    setToken(tokenParam);
    setUserId(uidParam);
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError("");

    try {
      const response = await fetchAPI("users/reset-password/", {
        method: "POST",
        body: { uid: userId, access_token: token, new_password: data.password },
      });
      if (response) {
        showCustomToast({
          type: "success",
          title: t("resetPass.toastTitle"),
          description: t("resetPass.toastDescription"),
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
          setError(t("resetPass.errorResettingPassword"));
        }
      } else {
        setError(t("resetPass.errorResettingPassword"));
      }
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto mt-20 mb-32">
      <h1 className="mb-9 font-normal md:text-title text-xl text-center uppercase">
        {t("resetPass.title")}
      </h1>
      <div className="mb-12 text-base text-center">
        {t("resetPass.descriptionLine1")}
        <br /> {t("resetPass.descriptionLine2")}
      </div>

      <form
        className="space-y-6 md:w-[504px] w-xs"
        onSubmit={handleSubmit(onSubmit)}
      >
        <PasswordInput
          placeholder={t("resetPass.placeholderPassword")}
          id="password"
          label={t("resetPass.labelPassword")}
          name="password"
          {...register("password")}
          disabled={isSubmitting}
          error={
            errors.password?.message ? [errors.password.message] : undefined
          }
        />
        <PasswordInput
          placeholder={t("resetPass.placeholderConfirmPassword")}
          id="confirmPassword"
          label={t("resetPass.labelConfirmPassword")}
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
          {isSubmitting ? t("resetPass.resetting") : t("resetPass.reset")}
        </CustomButton>
      </form>

      <div className="flex flex-row justify-center items-center gap-1 mt-12 text-purple text-center">
        {t("resetPass.dontNeedHelpAnymore")}
        <Link href="/login" className="underline">
          {t("resetPass.signIn")}
          <span className="inline-block ml-1">→</span>
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
