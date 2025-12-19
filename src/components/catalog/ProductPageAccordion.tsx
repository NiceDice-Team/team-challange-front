"use client";

import {
  CustomAccordion,
  CustomAccordionContent,
  CustomAccordionItem,
  CustomAccordionTrigger,
} from "@/components/shared/CustomAccordion";
import type { ProductAccordionProps } from "@/types/product";

export const ProductAccordion = ({ accordionParams }: ProductAccordionProps) => {
  return (
    <CustomAccordion collapsible="true" className="w-full">
      {/* Description */}
      <CustomAccordionItem value="description">
        <CustomAccordionTrigger>Description</CustomAccordionTrigger>
        <CustomAccordionContent>
          <span className="text-base text-pretty">
            {accordionParams?.description || "Product description is unavailable"}
          </span>
        </CustomAccordionContent>
      </CustomAccordionItem>

      {/* Game information */}
      <CustomAccordionItem value="game-info">
        <CustomAccordionTrigger>Game Information</CustomAccordionTrigger>
        <CustomAccordionContent>
          <div className="flex flex-col gap-4 text-base">
            <div>
              <span className="font-semibold">• Publisher: </span>
              <span className="underline underline-offset-2">{accordionParams.brand}</span>
            </div>
            <div>
              <span className="font-semibold">• Players: </span>
              <span>2-5</span>
            </div>
            <div>
              <span className="font-semibold">• Ages: </span>
              <span>8+</span>
            </div>
            <div>
              <span className="font-semibold">• Play Time: </span>
              <span>30-60 Minutes</span>
            </div>
            <div>
              <span className="font-semibold">• Includes: </span>
              <span>
                Game board of Europe, 225 colored train cars, 110 train cards, 46 destination tickets, and 3 train
                stations
              </span>
            </div>
            <div>
              <span className="font-semibold">• Game Features: </span>
              <span>
                Strategic route building, exciting challenges with tunnels and ferries, and engaging player interaction
              </span>
            </div>
          </div>
        </CustomAccordionContent>
      </CustomAccordionItem>

      {/* Delivery and payment */}
      <CustomAccordionItem value="delivery">
        <CustomAccordionTrigger>Delivery and payment</CustomAccordionTrigger>
        <CustomAccordionContent>
          <div className="flex flex-col gap-6 text-base">
            {/* Shipping Within Ukraine */}
            <div className="flex flex-col gap-4 ">
              <h4 className="font-medium  ">📦 Shipping Within Ukraine</h4>
              <div className="flex flex-col gap-2">
                <p className=" font-medium ">Delivery Methods:</p>
                <div className="flex flex-col gap-1">
                  <p className="ml-3   ">
                    •&nbsp;&nbsp;<span className="font-medium">Nova Poshta:</span> 1–3 business days
                  </p>
                  <p className="ml-3  ">
                    •&nbsp;&nbsp;<span className="font-medium">Ukrposhta:</span> 2–5 business days
                  </p>
                </div>
              </div>
            </div>

            {/* International Shipping */}
            <div className="flex flex-col gap-4">
              <h4 className="font-medium ">🌍 International Shipping</h4>
              <div className="flex flex-col gap-1">
                <p className="ml-3">
                  •&nbsp;&nbsp;<span className="font-medium">Carriers:</span> Ukrposhta, Nova Poshta, DHL, FedEx
                </p>
                <p className="ml-3">
                  •&nbsp;&nbsp;<span className="font-medium">Delivery Time:</span> Typically 7–14 business days,
                  depending on the destination and customs processing
                </p>
              </div>
            </div>

            {/* Delivery Cost */}
            <div className="flex flex-col gap-4">
              <h4 className="font-medium text-base">💰 Delivery Cost</h4>
              <div className="flex flex-col gap-1">
                <p className="ml-3 ">
                  •&nbsp;&nbsp;<span className="font-medium">Free shipping</span> for orders over{" "}
                  <span className="font-medium">$60</span>
                </p>
                <p className="ml-3">
                  •&nbsp;&nbsp;<span className="font-medium">Orders under $60:</span> according to the carrier&apos;s rates
                </p>
                <p className="ml-3">
                  •&nbsp;&nbsp;<span className="font-medium">International shipping:</span> calculated individually
                  based on destination and package weight. The final cost will be shown at checkout.
                </p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col gap-4">
              <h4 className="font-medium text-base ">💳 Payment Methods</h4>
              <div className="flex flex-col gap-1">
                <p className="ml-3">
                  •&nbsp;&nbsp;<span className="font-medium">Online Payment:</span> pay instantly via LiqPay, WayForPay,
                  or any major bank card (Visa/MasterCard)
                </p>
                <p className="ml-3">
                  •&nbsp;&nbsp;<span className="font-medium">Google Pay / Apple Pay:</span> fast and secure mobile
                  payment with just a tap
                </p>
              </div>
            </div>
          </div>
        </CustomAccordionContent>
      </CustomAccordionItem>
    </CustomAccordion>
  );
};
