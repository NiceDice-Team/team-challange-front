"use client";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import ShippingForm, {
  CombinedFormData,
} from "@/components/checkout/ShippingForm";
import PaymentWrapper from "@/components/checkout/PaymentWrapper";
import { useState } from "react";
import ProductsTable from "@/components/checkout/ProductsTable";
import DeliveryOptions from "@/components/checkout/DeliveryOptions";

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
  const handleShippingDataChange = (data) => {
    setShippingData(data);
    console.log(data);
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
        </div>

        <div className="flex flex-col gap-10 p-6 border-1 w-1/2">
          <ProductsTable />
          <DeliveryOptions />
          <div>
            <div className="border-purple/50 border-t w-full h-px"></div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="mb-2 font-semibold">Shipping Data:</h4>
              <pre className="text-gray-600 text-xs">
                {shippingData
                  ? JSON.stringify(shippingData, null, 2)
                  : "No data"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
