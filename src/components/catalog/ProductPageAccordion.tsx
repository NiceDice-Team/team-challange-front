"use client";

import Link from "next/link";
import {
  CustomAccordion,
  CustomAccordionContent,
  CustomAccordionItem,
  CustomAccordionTrigger,
} from "@/components/shared/CustomAccordion";
import type { Product, ProductDeliveryAndPayment, ProductGameInfoValue, ProductGameInformation } from "@/types/product";

const GAME_INFORMATION_FIELDS = [
  { key: "publisher", label: "Publisher", aliases: ["publisher"] },
  { key: "players", label: "Players", aliases: ["players"] },
  { key: "age", label: "Ages", aliases: ["age", "ages"] },
  { key: "time", label: "Play Time", aliases: ["time", "playTime", "play_time", "play time"] },
  { key: "includes", label: "Includes", aliases: ["includes"] },
  { key: "gameFeatures", label: "Game Features", aliases: ["gameFeatures", "game_features", "game features"] },
];

const GAME_INFORMATION_ALIASES = new Set(GAME_INFORMATION_FIELDS.flatMap((field) => field.aliases));

const hasDisplayValue = (value: ProductGameInfoValue): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.some(hasDisplayValue);
  }

  if (typeof value === "object") {
    return Object.values(value).some(hasDisplayValue);
  }

  return true;
};

const formatDisplayValue = (value: ProductGameInfoValue): string => {
  if (!hasDisplayValue(value)) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map(formatDisplayValue).filter(Boolean).join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .filter(([, nestedValue]) => hasDisplayValue(nestedValue))
      .map(([key, nestedValue]) => `${formatFieldLabel(key)}: ${formatDisplayValue(nestedValue)}`)
      .join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const formatFieldLabel = (key: string): string =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getGameInformationValue = (
  gameInformation: ProductGameInformation,
  aliases: string[]
): ProductGameInfoValue => {
  const matchingAlias = aliases.find((alias) => hasDisplayValue(gameInformation[alias]));
  return matchingAlias ? gameInformation[matchingAlias] : undefined;
};

const getGameInformationRows = (gameInformation?: ProductGameInformation) => {
  if (!gameInformation) {
    return [];
  }

  const primaryRows = GAME_INFORMATION_FIELDS
    .map(({ label, aliases }) => ({
      label,
      value: getGameInformationValue(gameInformation, aliases),
    }))
    .filter(({ value }) => hasDisplayValue(value))
    .map(({ label, value }) => ({ label, value: formatDisplayValue(value) }));

  const extraRows = Object.entries(gameInformation)
    .filter(([key, value]) => !GAME_INFORMATION_ALIASES.has(key) && hasDisplayValue(value))
    .map(([key, value]) => ({
      label: formatFieldLabel(key),
      value: formatDisplayValue(value),
    }));

  return [...primaryRows, ...extraRows];
};

const getDeliveryAndPaymentRows = (deliveryAndPayment?: ProductDeliveryAndPayment): string[] => {
  if (!hasDisplayValue(deliveryAndPayment)) {
    return [];
  }

  if (Array.isArray(deliveryAndPayment)) {
    return deliveryAndPayment.map(formatDisplayValue).filter(Boolean);
  }

  return [formatDisplayValue(deliveryAndPayment)];
};

const productAccordionItemClassName = "first:pt-4 sm:first:pt-0";
const productAccordionTriggerClassName = "py-0 data-[state=closed]:pb-4 hover:no-underline";
const productAccordionContentClassName = "pb-4 pt-0";
const productAccordionContentRootClassName = "pt-0 data-[state=closed]:pt-0 data-[state=open]:pt-6";

// Component props
interface ProductAccordionProps {
  accordionParams?: Product;
  className?: string;
  defaultValue?: string[];
  publisherHref?: string;
}

export const ProductAccordion = ({
  accordionParams,
  className = "",
  defaultValue,
  publisherHref,
}: ProductAccordionProps) => {
  const gameInformationRows = getGameInformationRows(accordionParams?.gameInformation);
  const deliveryAndPaymentRows = getDeliveryAndPaymentRows(accordionParams?.deliveryAndPayment);

  return (
    <CustomAccordion type="multiple" defaultValue={defaultValue} className={`flex w-full flex-col gap-4 ${className}`}>
      {/* Description */}
      <CustomAccordionItem value="description" className={productAccordionItemClassName}>
        <CustomAccordionTrigger className={productAccordionTriggerClassName}>Description</CustomAccordionTrigger>
        <CustomAccordionContent
          className={productAccordionContentClassName}
          rootClassName={productAccordionContentRootClassName}
        >
          <span className="text-base text-pretty">
            {accordionParams?.description || "Product description is unavailable"}
          </span>
        </CustomAccordionContent>
      </CustomAccordionItem>

      {/* Game information */}
      <CustomAccordionItem value="game-info" className={productAccordionItemClassName}>
        <CustomAccordionTrigger className={productAccordionTriggerClassName}>Game Information</CustomAccordionTrigger>
        <CustomAccordionContent
          className={productAccordionContentClassName}
          rootClassName={productAccordionContentRootClassName}
        >
          <div className="flex flex-col gap-4 text-base">
            {gameInformationRows.length > 0 ? (
              gameInformationRows.map(({ label, value }) => (
                <div key={label}>
                  <span className="font-semibold">• {label}: </span>
                  {label === "Publisher" && publisherHref ? (
                    <Link href={publisherHref} className="underline underline-offset-2">
                      {value}
                    </Link>
                  ) : (
                    <span className={label === "Publisher" ? "underline underline-offset-2" : undefined}>{value}</span>
                  )}
                </div>
              ))
            ) : (
              <span>Game information is unavailable</span>
            )}
          </div>
        </CustomAccordionContent>
      </CustomAccordionItem>

      {/* Delivery and payment */}
      <CustomAccordionItem value="delivery" className={productAccordionItemClassName}>
        <CustomAccordionTrigger className={productAccordionTriggerClassName}>Delivery and payment</CustomAccordionTrigger>
        <CustomAccordionContent
          className={productAccordionContentClassName}
          rootClassName={productAccordionContentRootClassName}
        >
          <div className="flex flex-col gap-6 text-base">
            {deliveryAndPaymentRows.length > 0 ? (
              deliveryAndPaymentRows.map((row, index) => <p key={`${row}-${index}`}>{row}</p>)
            ) : (
              <p>Delivery and payment information is unavailable</p>
            )}
          </div>
        </CustomAccordionContent>
      </CustomAccordionItem>
    </CustomAccordion>
  );
};
