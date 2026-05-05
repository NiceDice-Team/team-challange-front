"use client";

import Link from "next/link";
import ArrowNext from "../../../../public/icons/ArrowNext.svg";
import Image from "next/image";
import { PublicRoute } from "@/components/auth/RouteGuards";
import { showCustomToast } from "@/components/shared/Toast";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function ConfirmSignUpContent() {
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      showCustomToast({
        type: "success",
        title: t("register.success.toastTitle"),
        description: t("register.success.toastDescription"),
      });
    }
  }, [t]);
  return (
    <div className="flex flex-col items-center mt-23 mb-65">
      <h1 className="mb-9 md:text-title text-xl text-center uppercase">
        {t("register.success.title")}
      </h1>
      <p className="text-base">
        {t("register.success.descriptionLine1")}
      </p>
      <p className="mb-9 text-base">
        {t("register.success.descriptionLine2")}
      </p>
      <p className="mb-12 text-base">
        {t("register.success.descriptionLine3")}
      </p>
      <Link href="/catalog" className="flex gap-1">
        <span className="text-purple underline">{t("register.success.browseGames")}</span>
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
