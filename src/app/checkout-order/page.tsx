"use client";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import ShippingForm from "@/components/checkout/ShippingForm";
import { useState } from "react";
import ProductsTable from "@/components/checkout/ProductsTable";
import DeliveryOptions, { DeliveryOption } from "@/components/checkout/DeliveryOptions";
import { ChevronDown, ChevronUp } from "lucide-react";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Board games", href: "/catalog" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", current: true },
];

function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<DeliveryOption | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <div className="md:py-8 min-h-screen">
      <div className="mx-auto max-w-[1320px]">
        {/* Desktop Breadcrumb */}
        <CustomBreadcrumb items={breadcrumbItems} className="hidden md:flex px-6 md:px-0" />

        {/* Mobile Header & Summary Toggle */}
        <div className="md:hidden flex flex-col pt-6 px-4 mb-4 w-full">
          <div 
            className="flex flex-col bg-[#FCFBF9]/30 backdrop-blur-[5px] rounded-lg w-full overflow-hidden"
          >
            <button 
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              className="flex justify-between items-center py-4 w-full text-[#494791]"
            >
              <span className="flex-1 text-left font-normal text-base uppercase">Your order summary</span>
              {isSummaryOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            <div className="border-[#494791]/50 border-t w-full h-px"></div>

            {isSummaryOpen && (
              <div className="pb-4 w-full">
                <ProductsTable 
                  setSubtotal={setSubtotal} 
                  shippingPrice={paymentMethod?.price || 0}
                  paymentMethod={paymentMethod}
                  hideTitle={true}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-6 md:gap-16 lg:gap-24 mt-4">
          {/* Main Column (Shipping Form) */}
          <div className="flex flex-col px-4 md:px-0 w-full md:w-[60%] lg:w-[65%]">
            <h3 className="mb-6 font-medium text-2xl md:text-title uppercase text-[#040404]">Checkout</h3>

            <ShippingForm paymentMethod={paymentMethod}>
              {/* Mobile-only sections inside the form to ensure they appear before the button */}
              <div className="md:hidden flex flex-col gap-10 mt-12 mb-6">
                <DeliveryOptions onPaymentMethodChange={setPaymentMethod} />
                <div className="flex justify-between items-center -mt-4 text-purple">
                  <div className="font-bold text-foreground text-base uppercase">Order Total</div>
                  <div className="font-bold text-foreground text-base">
                    ${((paymentMethod?.price || 0) + subtotal).toFixed(2)}
                  </div>
                </div>
              </div>
            </ShippingForm>
          </div>

          {/* Desktop-only Side Column (Summary & Delivery) */}
          <div className="hidden md:flex flex-col gap-10 px-6 py-6 border border-[#494791]/50 rounded-lg w-full md:w-[40%] lg:w-[35%] h-fit">
            <ProductsTable 
               setSubtotal={setSubtotal} 
            />
            <DeliveryOptions onPaymentMethodChange={setPaymentMethod} />
            <div className="flex justify-between items-center -mt-4 h-10 text-purple">
              <div className="font-bold text-[#494791] text-base uppercase">
                Order Total
              </div>
              <div className="font-bold text-[#494791] text-lg">
                ${((paymentMethod?.price || 0) + subtotal).toFixed(2)}
              </div>
            </div>
          </div>        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
