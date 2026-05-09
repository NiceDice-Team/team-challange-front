"use client";

import ARROW_IMG from "../../../public/Features/arrow.png";
import LOCK_IMG from "../../../public/Features/lock.png";
import PHONE_IMG from "../../../public/Features/phone.png";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function FeatureSection() {
  const { t } = useTranslation();

  return (
    <section className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
      <div className="flex flex-col sm:flex-row flex-wrap justify-around items-center gap-8 sm:gap-6 md:gap-8 lg:gap-10 w-full text-center text-pretty bg-[#494791] text-white py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
            <Image src={ARROW_IMG} alt={t("layout.feature.shipping.iconAlt")} className="w-full h-full" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-1">{t("layout.feature.shipping.title")}</h3>
          <p className="text-xs sm:text-sm md:text-base text-pretty">{t("layout.feature.shipping.description")}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
            <Image src={LOCK_IMG} alt={t("layout.feature.securePayment.iconAlt")} className="w-full h-full" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-1">{t("layout.feature.securePayment.title")}</h3>
          <p className="text-xs sm:text-sm md:text-base text-pretty">{t("layout.feature.securePayment.description")}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
            <Image src={PHONE_IMG} alt={t("layout.feature.returns.iconAlt")} className="w-full h-full" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-1">{t("layout.feature.returns.title")}</h3>
          <p className="text-xs sm:text-sm md:text-base text-pretty">{t("layout.feature.returns.description")}</p>
        </div>
      </div>
    </section>
  );
}
