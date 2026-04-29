"use client";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import ShippingForm from "@/components/checkout/ShippingForm";
import { useMemo, useState } from "react";
import ProductsTable from "@/components/checkout/ProductsTable";
import DeliveryOptions, { DeliveryOption } from "@/components/checkout/DeliveryOptions";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

function CheckoutPage() {
  const { t } = useTranslation();
  const breadcrumbItems = useMemo(
    () => [
      { label: t("checkoutOrder.breadcrumb.home"), href: "/" },
      { label: t("checkoutOrder.breadcrumb.boardGames"), href: "/catalog" },
      { label: t("checkoutOrder.breadcrumb.cart"), href: "/cart" },
      { label: t("checkoutOrder.breadcrumb.checkout"), current: true },
    ],
    [t],
  );

  const [paymentMethod, setPaymentMethod] = useState<DeliveryOption | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <div className="md:py-8 min-h-screen">
      <div className="mx-auto max-w-[1320px]">
        {/* Desktop Breadcrumb */}
        <CustomBreadcrumb items={breadcrumbItems} className="hidden md:flex px-6 md:px-0" />

        {/* Mobile Header & Summary Toggle */}
        <div className="md:hidden flex flex-col px-4 w-full">
          <div className="flex flex-col items-center bg-[#FCFBF9]/30 backdrop-blur-[5px] py-4 rounded-lg w-full">
            <button
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              className="flex justify-between items-center w-full text-[#494791]"
            >
              <span className="flex-1 font-normal text-base text-left">
                {t("checkoutOrder.yourOrderSummary")}
              </span>
              {isSummaryOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            <div className="mt-4 border-[#A4A3C8] border-b w-full h-px"></div>

            {isSummaryOpen && (
              <div className="mt-4 w-full">
                <ProductsTable
                    setSubtotal={setSubtotal}
                    shippingPrice={paymentMethod?.price || 0}
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
            <h3 className="mb-6 font-medium text-[#040404] md:text-title text-xl uppercase">
              {t("checkoutOrder.pageTitle")}
            </h3>

            <ShippingForm paymentMethod={paymentMethod}>
              {/* Mobile-only sections inside the form to ensure they appear before the button */}
              <div className="md:hidden flex flex-col gap-10 mt-12 mb-6">
                <DeliveryOptions onPaymentMethodChange={setPaymentMethod} />
                <div className="flex justify-between items-center -mt-4 text-purple">
                  <div className="font-bold text-foreground text-base uppercase">
                    {t("checkoutOrder.orderTotal")}
                  </div>
                  <div className="font-bold text-foreground text-base">
                    ${((paymentMethod?.price || 0) + subtotal).toFixed(2)}
                  </div>
                </div>
              </div>
            </ShippingForm>
          </div>

          {/* Desktop-only Side Column (Summary & Delivery) */}
          <div className="hidden md:flex flex-col gap-10 p-6 border border-[#A4A3C8] w-[648px] h-fit">
            <ProductsTable setSubtotal={setSubtotal} />
            <DeliveryOptions onPaymentMethodChange={setPaymentMethod} />
            <div className="flex justify-between items-center -mt-4 px-6 h-10 text-purple">
              <div className="font-bold text-[#494791] text-base uppercase">{t("checkoutOrder.orderTotal")}</div>
              <div className="font-bold text-[#494791] text-lg">
                ${((paymentMethod?.price || 0) + subtotal).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
