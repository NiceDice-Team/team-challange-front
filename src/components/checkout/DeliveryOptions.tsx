"use client";
import Image from "next/image";
import icon from "../../assets/icons/attention.svg";
import { RadioButton } from "../shared/CustomRadio";
import { useState } from "react";

export interface DeliveryOption {
  id: number;
  name: string;
  price: number;
  description: string;
}

export const deliveryOptions: DeliveryOption[] = [
  {
    id: 1,
    name: "DHL",
    price: 35,
    description: "1-3 business days",
  },
  {
    id: 2,
    name: "Nova poshta",
    price: 20,
    description: "3-5 business days",
  },
  {
    id: 3,
    name: "Fedex",
    price: 15,
    description: "5-7 business days",
  },
  {
    id: 4,
    name: "Ukrposhta",
    price: 12,
    description: "7-10 business days",
  },
];

const DeliveryOptions = ({
  onPaymentMethodChange,
}: {
  onPaymentMethodChange: (paymentMethod: DeliveryOption) => void;
}) => {
  const [payment, setPayment] = useState<DeliveryOption>(deliveryOptions[0]);

  const handlePaymentMethodChange = (e) => {
    const val = e.target.value;
    const method = deliveryOptions.find((option) => option.name === val);
    setPayment(method);
    onPaymentMethodChange(method);
  };
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="mb-6 text-xl uppercase">Choose delivery option</div>
      <div className="flex flex-col gap-3">
        {deliveryOptions.map((option) => (
          <RadioButton
            className="flex items-center gap-3 h-10"
            key={option.id}
            name="payment"
            value={option.name}
            id={option.id.toString()}
            checked={payment?.name === option.name}
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
          Please note that all international shipments may be subject to customs
          duties and taxes depending on your local regulations. These charges
          are the full responsibility of the buyer and are not included in the
          item price.
        </p>
      </div>
      <div className="flex justify-between items-center mb-2 font-bold uppercase">
        <span>Shipping</span>
        <span>${payment?.price}</span>
      </div>
      <div className="border-purple/50 border-t w-full h-px"></div>
    </div>
  );
};

export default DeliveryOptions;
