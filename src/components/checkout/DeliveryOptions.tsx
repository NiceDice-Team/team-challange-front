"use client";
import Image from "next/image";
import icon from "../../assets/icons/attention.svg";
import { RadioButton } from "../shared/CustomRadio";
import { useEffect, useState, type ChangeEvent } from "react";
import { useDeliveryOptionsQuery } from "@/hooks/useDeliveryOptionsQuery";
import { useCheckoutStore } from "@/store/checkout";
import type { DeliveryOption } from "@/types/order";

const DeliveryOptions = ({ onPaymentMethodChange }: { onPaymentMethodChange: (method: DeliveryOption) => void }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const storedPaymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod);
  const {
    data: deliveryOptions = [],
    isLoading,
    isError,
  } = useDeliveryOptionsQuery();

  const selectOption = (method: DeliveryOption) => {
    setSelectedOptionId(method.id);
    setPaymentMethod(method);
    onPaymentMethodChange(method);
  };

  useEffect(() => {
    if (!deliveryOptions.length) {
      return;
    }

    const preferredOption =
      deliveryOptions.find((option) => option.id === selectedOptionId) ||
      deliveryOptions.find((option) => option.id === storedPaymentMethod?.id) ||
      deliveryOptions[0];

    if (selectedOptionId === preferredOption.id) {
      return;
    }

    setSelectedOptionId(preferredOption.id);
    setPaymentMethod(preferredOption);
    onPaymentMethodChange(preferredOption);
  }, [deliveryOptions, onPaymentMethodChange, selectedOptionId, setPaymentMethod, storedPaymentMethod?.id]);

  const handlePaymentMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
    const method = deliveryOptions.find((option) => option.id === Number(e.target.value));

    if (!method) {
      return;
    }

    selectOption(method);
  };

  const selectedOption = deliveryOptions.find((option) => option.id === selectedOptionId) || null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="mb-6 text-xl uppercase">Choose delivery option</div>
      {isLoading ? (
        <div className="py-4 text-base text-gray-2">Loading delivery options...</div>
      ) : isError ? (
        <div className="py-4 text-base text-red-600">Unable to load delivery options.</div>
      ) : deliveryOptions.length === 0 ? (
        <div className="py-4 text-base text-gray-2">No delivery options available.</div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {deliveryOptions.map((option) => (
              <RadioButton
                className="flex items-center gap-3 h-10"
                key={option.id}
                name="payment"
                value={option.id.toString()}
                id={option.id.toString()}
                checked={selectedOptionId === option.id}
                onChange={handlePaymentMethodChange}
              >
                <div className="flex gap-2">
                  <p className="font-bold text-purple">${option.price}</p>
                  <h3 className="font-medium uppercase">{option.name}</h3>
                  <p className="text-gray-2">{option.description}</p>
                </div>
              </RadioButton>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-10">
            <Image src={icon} alt="info" className="w-6 h-6" />
            <p className="max-w-[566px] text-gray-2">
              Please note that all international shipments may be subject to customs duties and taxes depending on your
              local regulations. These charges are the full responsibility of the buyer and are not included in the
              item price.
            </p>
          </div>
        </>
      )}
      <div className="flex justify-between items-center mb-2 font-bold uppercase px-6">
        <span>Shipping</span>
        <span>{selectedOption ? `$${selectedOption.price}` : "-"}</span>
      </div>
      <div className="border-purple/50 border-t w-full h-px"></div>
    </div>
  );
};

export default DeliveryOptions;
