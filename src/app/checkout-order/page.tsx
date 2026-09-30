"use client";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import ShippingForm from "@/components/checkout/ShippingForm";
import { useMemo, useState } from "react";
import ProductsTable from "@/components/checkout/ProductsTable";
import DeliveryOptions from "@/components/checkout/DeliveryOptions";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCartQuery } from "@/hooks/useCartQuery";
import { usePaymentMethod } from "@/store/checkout";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Board games", href: "/catalog" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", current: true },
];

function CheckoutPage() {
  const paymentMethod = usePaymentMethod();
  const { data: cartItems = [] } = useCartQuery();
  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = Number(item.product?.price) || 0;
        return sum + price * item.quantity;
      }, 0),
    [cartItems],
  );
  const orderTotal = subtotal + (Number(paymentMethod?.price) || 0);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <div className="md:py-8 min-h-screen">
      <div className="mx-auto max-w-[1320px]">
        {/* Desktop Breadcrumb */}
        <CustomBreadcrumb items={breadcrumbItems} className="hidden md:flex px-6 md:px-0" />

        {/* Mobile Header & Summary Toggle */}
        <div className="md:hidden flex flex-col px-4 w-full">
          <div className="flex flex-col items-center py-4 bg-[#FCFBF9]/30 backdrop-blur-[5px] rounded-lg w-full">
            <button
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              className="flex justify-between items-center w-full text-[#494791]"
            >
              <span className="flex-1 text-left font-normal text-base">Your order summary</span>
              {isSummaryOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            <div className="border-[#A4A3C8] border-b w-full h-px mt-4"></div>

            {isSummaryOpen && (
              <div className="w-full mt-4">
                <ProductsTable
                    shippingPrice={Number(paymentMethod?.price) || 0}
                    paymentMethod={paymentMethod}
                    hideTitle={true}
                  />
                  </div>
                  )}
                  </div>{" "}
        </div>

        <div className="flex md:flex-row flex-col justify-between gap-6 md:gap-6 mt-4">
          {/* Main Column (Shipping Form) */}
          <div className="flex flex-col px-4 md:px-0 w-full md:w-[648px]">
            <h3 className="mb-6 font-medium text-2xl md:text-title uppercase text-[#040404]">Checkout</h3>

            <ShippingForm paymentMethod={paymentMethod}>
              {/* Mobile-only sections inside the form to ensure they appear before the button */}
              <div className="md:hidden flex flex-col gap-10 mt-12 mb-6">
                <DeliveryOptions />
                <div className="flex justify-between items-center -mt-4 text-purple">
                  <div className="font-bold text-foreground text-base uppercase">Order Total</div>
                  <div className="font-bold text-foreground text-base ">
                    ${orderTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            </ShippingForm>
          </div>

          {/* Desktop-only Side Column (Summary & Delivery) */}
          <div className="hidden md:flex flex-col gap-10 p-6 border border-[#A4A3C8] w-[648px] h-fit ">
            <ProductsTable />
            <DeliveryOptions />
            <div className="flex justify-between items-center -mt-4 h-10 text-purple px-6">
              <div className="font-bold text-[#494791] text-base uppercase">Order Total</div>
              <div className="font-bold text-[#494791] text-lg">
                ${orderTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
