"use client";
import Image from "next/image";
import icon from "../../assets/icons/attention.svg";
import { RadioButton } from "../shared/CustomRadio";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderServices } from "@/services/orderServices";
import { useCheckoutActions, usePaymentMethod } from "@/store/checkout";

export type DeliveryOption = import("@/store/checkout").DeliveryOption;

const DeliveryOptions = ({
  onPaymentMethodChange,
}: {
  onPaymentMethodChange: (method: DeliveryOption) => void;
}) => {
  const payment = usePaymentMethod();
  const { setPaymentMethod } = useCheckoutActions();

  const {
    data: deliveryOptions = [],
    isLoading: deliveryOptionsLoading,
    error,
  } = useQuery({
    queryKey: ["delivery-options"],
    queryFn: () => orderServices.getDeliveryOptions(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const selectedDeliveryOption = payment ?? deliveryOptions?.[0] ?? null;

  useEffect(() => {
    if (deliveryOptionsLoading) return;
    if (!deliveryOptions?.length) return;

    const first = deliveryOptions[0];
    const isPaymentValid = payment && deliveryOptions.some((option) => option.id === payment.id);

    if (!payment || !isPaymentValid) {
      setPaymentMethod(first);
      onPaymentMethodChange(first);
    }
  }, [deliveryOptions, deliveryOptionsLoading, onPaymentMethodChange, payment, setPaymentMethod]);

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = Number(e.target.value);
    const method = deliveryOptions.find((option) => option.id === selectedId);

    if (!method) return;

    setPaymentMethod(method);
    onPaymentMethodChange(method);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="mb-6 text-xl uppercase">Choose delivery option</div>
      {deliveryOptionsLoading ? (
        <div className="text-gray-2">Loading...</div>
      ) : error ? (
        <div className="text-red-600">Failed to load delivery options</div>
      ) : deliveryOptions.length === 0 ? (
        <div className="text-gray-2">No delivery options available</div>
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
                checked={selectedDeliveryOption?.id === option.id}
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
              local regulations. These charges are the full responsibility of the buyer and are not included in the item
              price.
            </p>
          </div>
        </>
      )}
      <div className="flex justify-between items-center mb-2 font-bold uppercase px-6">
        <span>Shipping</span>
        <span>{selectedDeliveryOption ? `$${selectedDeliveryOption.price}` : "-"}</span>
      </div>
      <div className="border-purple/50 border-t w-full h-px"></div>
    </div>
  );
};

export default DeliveryOptions;
