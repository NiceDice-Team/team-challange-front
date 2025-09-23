"use client";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import ShippingForm, {
  CombinedFormData,
} from "@/components/checkout/ShippingForm";
import PaymentWrapper from "@/components/checkout/PaymentWrapper";
import { useState } from "react";
import ProductsTable from "@/components/checkout/ProductsTable";
import DeliveryOptions, {
  DeliveryOption,
} from "@/components/checkout/DeliveryOptions";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Board games", href: "/catalog" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", current: true },
];

function CheckoutPage() {
  const [shippingData, setShippingData] = useState<CombinedFormData | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<DeliveryOption | null>(
    null
  );
  const handleShippingDataChange = (data) => {
    setShippingData(data);
  };
  console.log("paymentMethod", paymentMethod, shippingData);
  return (
    <div className="py-8 min-h-screen">
      <CustomBreadcrumb items={breadcrumbItems} />

      <h3 className="mt-6 mb-4 text-title uppercase">Checkout</h3>
      <div className="flex gap-6">
        <div className="flex flex-col py-6 w-1/2">
          <div className="flex flex-col mb-10">
            <ShippingForm onDataChange={handleShippingDataChange} />
          </div>
        </div>

        <div className="flex flex-col gap-10 p-6 border-1 w-1/2 h-fit">
          <ProductsTable />
          <DeliveryOptions onPaymentMethodChange={setPaymentMethod} />
          <div className="flex justify-between items-center -mt-4 h-10 text-purple">
            <div className="font-bold text-foreground text-base uppercase">
              Order Total
            </div>
            <div className="font-bold text-foreground text-base">$55</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
