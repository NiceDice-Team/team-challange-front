"use client";

import Link from "next/link";
import ArrowNext from "../../../../../public/icons/ArrowNext.svg";
import Image from "next/image";
import { useEffect } from "react";
import { showCustomToast } from "@/components/shared/Toast";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      showCustomToast({
        type: "success",
        title: t("forgot-pass.success.toastTitle"),
        description: t("forgot-pass.success.toastDescription"),
      });
    }
  }, [t]);

  return (
    <div className="flex flex-col items-center mx-auto mt-32 mb-32 md:w-[464px] w-xs">
      <h1 className="mb-9 md:text-title text-xl uppercase">
        {t("forgot-pass.success.title")}
      </h1>
      <p className="mb-12 text-base text-center">
        {t("forgot-pass.success.descriptionLine1")}
      </p>
      <p className="mb-12 text-base">
        {t("forgot-pass.success.descriptionLine2")}
      </p>
      <div className="flex flex-row justify-center items-center gap-1 mb-12">
        <p className="text-base">{t("forgot-pass.success.didntReceiveEmail")}</p>
        <Link href="/forgot-password" className="flex gap-1">
          <span className="underline">{t("forgot-pass.success.resend")}</span>
        </Link>
      </div>

      <Link href="/catalog" className="flex gap-1">
        <span className="text-purple underline">{t("forgot-pass.success.continueShopping")}</span>
        <Image src={ArrowNext} alt="arrow" />
      </Link>
    </div>
  );
}
