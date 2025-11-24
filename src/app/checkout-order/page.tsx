"use client";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import ShippingForm, {
  CombinedFormData,
} from "@/components/checkout/ShippingForm";
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
  const [paymentMethod, setPaymentMethod] = useState<DeliveryOption | null>(
    null
  );
  const [subtotal, setSubtotal] = useState<number>(0);

  return (
    <div className="py-8 min-h-screen">
      <CustomBreadcrumb items={breadcrumbItems} className="px-6 md:px-0" />

      <h3 className="mt-6 mb-4 px-6 md:px-0 md:text-title text-2xl uppercase">
        Checkout
      </h3>
      <div className="flex md:flex-row flex-col gap-6">
        <div className="flex flex-col p-6 md:py-0 w-full md:w-1/2">
          <div className="flex flex-col mb-10">
            <ShippingForm paymentMethod={paymentMethod} />
          </div>
        </div>

        <div className="flex flex-col gap-10 p-6 border-1 w-full md:w-1/2 h-fit">
          <ProductsTable setSubtotal={setSubtotal} />
          <DeliveryOptions onPaymentMethodChange={setPaymentMethod} />
          <div className="flex justify-between items-center -mt-4 h-10 text-purple">
            <div className="font-bold text-foreground text-base uppercase">
              Order Total
            </div>
            <div className="font-bold text-foreground text-base">
              ${(paymentMethod?.price || 0) + subtotal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
