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
import { useTranslation } from "react-i18next";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordPageContent() {
  const { t } = useTranslation();
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
      setError(t("forgot-pass.errorSendingResetEmail"));
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto mt-20 mb-32">
      <h1 className="mb-9 font-normal md:text-title text-xl text-center uppercase">
        {t("forgot-pass.title")}
      </h1>
      <div className="mb-12 text-base text-center">
        {t("forgot-pass.descriptionLine1")} <br />
        {t("forgot-pass.descriptionLine2")}
      </div>

      <form
        className="space-y-6 md:w-[500px] w-xs"
        onSubmit={handleSubmit(onSubmit)}
      >
        <CustomInput
          placeholder={t("forgot-pass.placeholderEmail")}
          id="email"
          label={t("forgot-pass.labelEmail")}
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
          {isSubmitting ? t("forgot-pass.submitting") : t("forgot-pass.submit")}
        </CustomButton>
      </form>

      <div className="flex flex-row justify-center items-center gap-1 mt-12 text-purple text-center">
        {t("forgot-pass.dontNeedHelpAnymore")}
        <Link href="/login" className="underline">
          {t("forgot-pass.signIn")}
          <span className="inline-block ml-1">→</span>
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
