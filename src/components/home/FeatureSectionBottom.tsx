"use client";

import PUZZLE_IMG from "../../../public//Features/puzzle.png";
import PRIZE_IMG from "../../../public/Features/prize.png";
import CHAT_IMG from "../../../public/Features/chat.png";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function FeatureSectionBottom() {
  const { t } = useTranslation();

  return (
    <section className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
      <div className="flex flex-col sm:flex-row flex-wrap justify-around items-center gap-8 sm:gap-6 md:gap-8 lg:gap-10 w-full text-center text-pretty bg-[#494791] text-white py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
            <Image src={PUZZLE_IMG} alt={t("layout.featureBottom.wideSelection.iconAlt")} className="w-full h-full" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-1">
            {t("layout.featureBottom.wideSelection.title")}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-pretty">
            {t("layout.featureBottom.wideSelection.description")}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
            <Image src={PRIZE_IMG} alt={t("layout.featureBottom.highQuality.iconAlt")} className="w-full h-full" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-1">
            {t("layout.featureBottom.highQuality.title")}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-pretty">
            {t("layout.featureBottom.highQuality.description")}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
            <Image src={CHAT_IMG} alt={t("layout.featureBottom.support.iconAlt")} className="w-full h-full" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-1">{t("layout.featureBottom.support.title")}</h3>
          <p className="text-xs sm:text-sm md:text-base text-pretty">
            {t("layout.featureBottom.support.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
