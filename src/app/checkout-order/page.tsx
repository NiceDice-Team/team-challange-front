"use client";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import ShippingForm from "@/components/checkout/ShippingForm";
import BillingForm from "@/components/checkout/BillingForm";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import { useState } from "react";
import Link from "next/link";
import { CustomButton } from "@/components/shared/CustomButton";
import PaymentWrapper from "@/components/checkout/PaymentWrapper";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Board games", href: "/catalog" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", current: true },
];

type ShippingFormData = {
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  zipCode: string;
  city: string;
  email: string;
  phone: string;
};

type BillingFormData = {
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  zipCode: string;
  city: string;
  email: string;
  phone: string;
};

function CheckoutPage() {
  const [copyBilling, setCopyBilling] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(
    null
  );
  const [manualBillingData, setManualBillingData] =
    useState<BillingFormData | null>(null);

  const billingData = copyBilling ? shippingData : manualBillingData;

  const handleShippingDataChange = (data: ShippingFormData) => {
    setShippingData(data);
  };

  const handleBillingDataChange = (data: BillingFormData) => {
    setManualBillingData(data);
  };

  return (
    <div className="py-8 min-h-screen">
      <CustomBreadcrumb items={breadcrumbItems} />

      <h3 className="mt-6 mb-4 text-title uppercase">Checkout</h3>
      <div className="flex gap-6">
        <div className="flex flex-col py-6 w-1/2">
          <div className="flex flex-col mb-10">
            <ShippingForm onDataChange={handleShippingDataChange} />
          </div>
          <CustomCheckbox
            label="Use shipping address as billing address"
            id="copyBilling"
            checked={copyBilling}
            onCheckedChange={setCopyBilling}
          />
          {!copyBilling && (
            <div className="flex flex-col mt-6">
              <BillingForm
                onDataChange={handleBillingDataChange}
                initialData={copyBilling ? shippingData : undefined}
              />
            </div>
          )}
          <div className="flex flex-col mt-6">
            <PaymentWrapper />
          </div>

          <div className="flex justify-between mt-12">
            <Link href="/cart">Return to cart</Link>
            <Link href="/checkout/order-review">
              <CustomButton className="w-[144px]">Order review</CustomButton>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6 border-1 w-1/2">
          <div className="pb-10 text-xl uppercase">Your order</div>

          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="mb-2 font-semibold">Shipping Data:</h4>
              <pre className="text-gray-600 text-xs">
                {shippingData
                  ? JSON.stringify(shippingData, null, 2)
                  : "No data"}
              </pre>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="mb-2 font-semibold">Billing Data:</h4>
              <pre className="text-gray-600 text-xs">
                {billingData ? JSON.stringify(billingData, null, 2) : "No data"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
