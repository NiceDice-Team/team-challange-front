"use client";

import {
  CustomAccordion,
  CustomAccordionContent,
  CustomAccordionItem,
  CustomAccordionTrigger,
} from "@/components/shared/CustomAccordion";
import { useTranslation } from "react-i18next";

// Component props
interface ProductAccordionProps {
  accordionParams?: {
    description?: string;
    brand?: string;
    [key: string]: any;
  };
  className?: string;
  defaultValue?: string[];
}

export const ProductAccordion = ({ accordionParams, className = "", defaultValue }: ProductAccordionProps) => {
  const { t } = useTranslation();

  return (
    <CustomAccordion type="multiple" defaultValue={defaultValue} className={`w-full ${className}`}>
      {/* Description */}
      <CustomAccordionItem value="description" className="">
        <CustomAccordionTrigger className="">{t("product.accordion.description")}</CustomAccordionTrigger>
        <CustomAccordionContent className="">
          <span className="text-base text-pretty">
            {accordionParams?.description || t("product.descriptionUnavailable")}
          </span>
        </CustomAccordionContent>
      </CustomAccordionItem>

      {/* Game information */}
      <CustomAccordionItem value="game-info" className="">
        <CustomAccordionTrigger className="">{t("product.accordion.gameInformation")}</CustomAccordionTrigger>
        <CustomAccordionContent className="">
          <div className="flex flex-col gap-4 text-base">
            <div>
              <span className="font-semibold">• {t("product.accordion.publisher")} </span>
              <span className="underline underline-offset-2">{accordionParams?.brand}</span>
            </div>
            <div>
              <span className="font-semibold">• {t("product.accordion.players")} </span>
              <span>{t("product.accordion.playersValue")}</span>
            </div>
            <div>
              <span className="font-semibold">• {t("product.accordion.ages")} </span>
              <span>{t("product.accordion.agesValue")}</span>
            </div>
            <div>
              <span className="font-semibold">• {t("product.accordion.playTime")} </span>
              <span>{t("product.accordion.playTimeValue")}</span>
            </div>
            <div>
              <span className="font-semibold">• {t("product.accordion.includes")} </span>
              <span>{t("product.accordion.includesValue")}</span>
            </div>
            <div>
              <span className="font-semibold">• {t("product.accordion.gameFeatures")} </span>
              <span>{t("product.accordion.gameFeaturesValue")}</span>
            </div>
          </div>
        </CustomAccordionContent>
      </CustomAccordionItem>

      {/* Delivery and payment */}
      <CustomAccordionItem value="delivery" className="">
        <CustomAccordionTrigger className="">{t("product.accordion.deliveryPayment")}</CustomAccordionTrigger>
        <CustomAccordionContent className="">
          <div className="flex flex-col gap-6 text-base">
            <div className="flex flex-col gap-4 ">
              <h4 className="font-medium  ">{t("product.accordion.shippingUaTitle")}</h4>
              <div className="flex flex-col gap-2">
                <p className=" font-medium ">{t("product.accordion.deliveryMethods")}</p>
                <div className="flex flex-col gap-1">
                  <p className="ml-3   ">{t("product.accordion.ukLineNovaPoshta")}</p>
                  <p className="ml-3  ">{t("product.accordion.ukLineUkrposhta")}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-medium ">{t("product.accordion.intlShippingTitle")}</h4>
              <div className="flex flex-col gap-1">
                <p className="ml-3">{t("product.accordion.intlLineCarriers")}</p>
                <p className="ml-3">{t("product.accordion.intlLineDeliveryTime")}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-medium text-base">{t("product.accordion.deliveryCostTitle")}</h4>
              <div className="flex flex-col gap-1">
                <p className="ml-3 ">{t("product.accordion.costLineFreeOver60")}</p>
                <p className="ml-3">{t("product.accordion.costLineUnder60")}</p>
                <p className="ml-3">{t("product.accordion.costLineInternational")}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-medium text-base ">{t("product.accordion.paymentMethodsTitle")}</h4>
              <div className="flex flex-col gap-1">
                <p className="ml-3">{t("product.accordion.paymentLineOnline")}</p>
                <p className="ml-3">{t("product.accordion.paymentLineWallet")}</p>
              </div>
            </div>
          </div>
        </CustomAccordionContent>
      </CustomAccordionItem>
    </CustomAccordion>
  );
};
