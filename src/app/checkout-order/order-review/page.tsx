"use client";

import Link from "next/link";
import { CustomButton } from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";
import { RadioButton } from "@/components/shared/CustomRadio";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import { ChevronLeft } from "lucide-react";
import { CreditCardIcon, ChevronDownIcon } from "@/svgs/icons";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartQuery } from "@/hooks/useCartQuery";
import {
  useCheckoutFormData,
  usePaymentMethod,
  usePaymentCard,
  useCheckoutActions,
} from "@/store/checkout";
import PaymentWrapper from "@/components/checkout/PaymentWrapper";
import { useQuery } from "@tanstack/react-query";
import { orderServices, type PaymentMethod } from "@/services/orderServices";
import { showCustomToast } from "@/components/shared/Toast";
import { cartServices } from "@/services/cartServices";
import { useTranslation } from "react-i18next";

interface SectionProps {
  title: string;
  editLabel: string;
  onEdit?: () => void;
  children: React.ReactNode;
  className?: string;
}

// Section Component for consistent styling
const Section = ({ title, editLabel, onEdit, children, className = "" }: SectionProps) => {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-normal text-foreground text-xl uppercase leading-6">
          {title}
        </h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="hover:opacity-80 text-purple text-base underline leading-[19px]"
          >
            {editLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

interface PaymentCardData {
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function OrderReviewPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const breadcrumbItems = useMemo(
    () => [
      { label: t("orderReview.breadcrumb.home"), href: "/" },
      { label: t("orderReview.breadcrumb.boardGames"), href: "/catalog" },
      { label: t("orderReview.breadcrumb.cart"), href: "/cart" },
      { label: t("orderReview.breadcrumb.checkout"), href: "/checkout-order" },
      { label: t("orderReview.title"), current: true },
    ],
    [t],
  );

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    number | null
  >(null);
  const [isPaymentExpanded, setIsPaymentExpanded] = useState<boolean>(true);

  // Get data from Zustand store
  const checkoutUserData = useCheckoutFormData();
  const deliveryMethod = usePaymentMethod();
  const savedPaymentCard = usePaymentCard();
  const { setPaymentCard } = useCheckoutActions();
  // Use existing cart functionality
  const { data: cartItems = [], isLoading: cartLoading } = useCartQuery();

  const {
    data: paymentMethods = [],
    isLoading: paymentMethodsLoading,
    error: paymentMethodsError,
  } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => orderServices.getPaymentMethods(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (paymentMethodsLoading) return;
    if (!paymentMethods?.length) return;
    if (selectedPaymentMethodId !== null) return;

    const preferred = paymentMethods.find((m: PaymentMethod) => m.id === 1);
    setSelectedPaymentMethodId(preferred?.id ?? paymentMethods[0].id);
  }, [paymentMethods, paymentMethodsLoading, selectedPaymentMethodId]);

  // Local state for payment form
  const [paymentCardData, setPaymentCardData] = useState<PaymentCardData>({
    firstName: savedPaymentCard?.firstName || "",
    lastName: savedPaymentCard?.lastName || "",
    cardNumber: savedPaymentCard?.cardNumber || "",
    expiryDate: savedPaymentCard?.expiryDate || "",
    cvv: savedPaymentCard?.cvv || "",
  });

  // Calculate totals using the same logic as cart page
  const { subtotal, shipping, total } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((sum, item) => {
      const price = Number(item.product?.price) || 0;
      return sum + price * item.quantity;
    }, 0);

    const shippingCost = deliveryMethod?.price || 0;
    const calculatedTotal = calculatedSubtotal + shippingCost;

    return {
      subtotal: calculatedSubtotal,
      shipping: shippingCost,
      total: calculatedTotal,
    };
  }, [cartItems, deliveryMethod]);

  // Handle navigation back to checkout
  const handleEditShipping = () => {
    router.push("/checkout-order");
  };

  const handleEditBilling = () => {
    router.push("/checkout-order");
  };

  const handlePlaceOrder = async () => {
    setPaymentCard(paymentCardData);

    let cartId = 0
    try {
      cartId = await cartServices.getCartId();
    } catch (err) {
      showCustomToast({
        type: "error",
        title: t("orderReview.toast.failedLoadCart"),
      });
      return;
    }

    orderServices
      .createOrder({
        checkoutUserData,
        deliveryOptionId: deliveryMethod?.id ?? 0,
        paymentMethodId: selectedPaymentMethodId ?? 0,
        cartId,
        delivery_option: deliveryMethod?.id ?? 0,
        payment_method: selectedPaymentMethodId,
      })
      .then((res) => {
        showCustomToast({
          type: "success",
          title: t("orderReview.toast.orderPlacedTitle"),
          description: t("orderReview.toast.orderPlacedDescription"),
        });
      })
      .catch((err) => {
        showCustomToast({
          type: "error",
          title: t("orderReview.toast.failedPlaceOrderTitle"),
          description: t("orderReview.toast.failedPlaceOrderDescription"),
        });
      });
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1320px]">
        {/* Breadcrumbs */}
        <div className="mt-6 mb-6">
          <CustomBreadcrumb items={breadcrumbItems} />
        </div>

        {/* Page Title */}
        <div className="flex flex-col gap-4 mb-18">
          <h1 className="flex items-center font-normal text-[var(--text-title)] uppercase leading-[48px]">
            {t("orderReview.title")}
          </h1>
        </div>

        {/* Main Layout - Two Columns */}
        <div className="flex lg:flex-row flex-col items-start gap-6">
          {/* Left Column - Order Information */}
          <div className="flex flex-col gap-12 py-6 w-full lg:w-[648px]">
            {/* Shipping Information */}
            <Section
              title={t("orderReview.shipping")}
              editLabel={t("orderReview.edit")}
              onEdit={handleEditShipping}
            >
              <div className="flex flex-col gap-2 text-gray-2 text-base leading-[19px]">
                <div>
                  {checkoutUserData.shippingFirstName}{" "}
                  {checkoutUserData.shippingLastName}
                </div>
                <div>
                  {checkoutUserData.shippingAddress}
                  {checkoutUserData.shippingApartment &&
                    `, ${checkoutUserData.shippingApartment}`}
                </div>
                <div>
                  {checkoutUserData.shippingCity}
                  {checkoutUserData.shippingCity &&
                    checkoutUserData.shippingZipCode &&
                    ", "}
                  {checkoutUserData.shippingZipCode}
                  {(checkoutUserData.shippingCity ||
                    checkoutUserData.shippingZipCode) &&
                    checkoutUserData.shippingCountry &&
                    ", "}
                  {checkoutUserData.shippingCountry}
                </div>
                {checkoutUserData.shippingEmail && (
                  <div className="underline underline-offset-2">
                    {checkoutUserData.shippingEmail}
                  </div>
                )}
                {checkoutUserData.shippingPhone && (
                  <div>{checkoutUserData.shippingPhone}</div>
                )}
              </div>
            </Section>

            {/* Billing Address */}
            <Section
              title={t("orderReview.billingAddress")}
              editLabel={t("orderReview.edit")}
              onEdit={handleEditBilling}
            >
              <div className="flex flex-col gap-2 text-gray-2 text-base leading-[19px]">
                <div>
                  {checkoutUserData.billingFirstName}{" "}
                  {checkoutUserData.billingLastName}
                </div>
                <div>
                  {checkoutUserData.billingAddress}
                  {checkoutUserData.billingApartment &&
                    `, ${checkoutUserData.billingApartment}`}
                </div>
                <div>
                  {checkoutUserData.billingCity}
                  {checkoutUserData.billingCity &&
                    checkoutUserData.billingZipCode &&
                    ", "}
                  {checkoutUserData.billingZipCode}
                  {(checkoutUserData.billingCity ||
                    checkoutUserData.billingZipCode) &&
                    checkoutUserData.billingCountry &&
                    ", "}
                  {checkoutUserData.billingCountry}
                </div>
                {checkoutUserData.billingEmail && (
                  <div className="underline underline-offset-2">
                    {checkoutUserData.billingEmail}
                  </div>
                )}
                {checkoutUserData.billingPhone && (
                  <div>{checkoutUserData.billingPhone}</div>
                )}
              </div>
            </Section>

            {/* Payment Method */}
            <div className="flex flex-col gap-6">
              {/* Payment Header */}
              <div className="flex justify-between items-center h-6">
                <h3 className="font-normal text-foreground text-xl uppercase leading-6">
                  {t("orderReview.payment")}
                </h3>
                <button
                  onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}
                  className="flex justify-center items-center"
                  aria-label={t("orderReview.togglePaymentAriaLabel")}
                >
                  <ChevronDownIcon
                    className="w-6 h-6"
                    isExpanded={isPaymentExpanded}
                  />
                </button>
              </div>

              {/* Payment Options */}
              {isPaymentExpanded && (
                <>
                  <div className="flex flex-col gap-1">
                    {paymentMethodsLoading ? (
                      <div className="px-4 py-2 text-gray-2 text-base">
                        {t("orderReview.loadingPaymentMethods")}
                      </div>
                    ) : paymentMethodsError ? (
                      <div className="px-4 py-2 text-red-600 text-base">
                        {t("orderReview.failedToLoadPaymentMethods")}
                      </div>
                    ) : (
                      paymentMethods.map((method: PaymentMethod) => (
                        <RadioButton
                          key={method.id}
                          id={`payment-method-${method.id}`}
                          name="payment-method"
                          value={method.id.toString()}
                          checked={selectedPaymentMethodId === method.id}
                          onChange={() => setSelectedPaymentMethodId(method.id)}
                          className="gap-6 bg-white px-4 py-2"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {method.id === 1 ? <CreditCardIcon /> : null}
                              <span className="text-black text-base leading-[18px]">
                                {method.name}
                              </span>
                            </div>
                            <div className="text-gray-2 text-base leading-[19px]">
                              {method.description}
                            </div>
                          </div>
                        </RadioButton>
                      ))
                    )}
                  </div>

                  {selectedPaymentMethodId === 1 && <PaymentWrapper />}
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex sm:flex-row flex-col-reverse justify-between items-center gap-4 w-full max-w-[648px]">
              <Link
                href="/checkout-order"
                className="flex items-center gap-2 hover:opacity-80 text-foreground text-base leading-[19px]"
              >
                <ChevronLeft className="w-6 h-6 text-purple" />
                {t("orderReview.returnToCheckout")}
              </Link>
              <CustomButton
                type="button"
                onClick={handlePlaceOrder}
                className="bg-purple hover:bg-purple/90 border border-purple w-full sm:w-72 h-12 text-white text-base uppercase leading-[19px]"
              >
                {t("orderReview.placeOrder")}
              </CustomButton>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="flex flex-col gap-10 p-6 border border-[#A4A3C8] w-full lg:w-[648px]">
            <h2 className="flex items-center w-full font-normal text-foreground text-xl uppercase leading-6">
              {t("orderReview.yourOrder")}
            </h2>

            {cartLoading ? (
              <div className="animate-pulse">{t("orderReview.loadingOrder")}</div>
            ) : (
              <>
                {/* Product Table */}
                <div className="flex flex-col gap-2">
                  {/* Table Header */}
                  <div className="flex justify-between items-center h-12 font-normal text-foreground text-sm sm:text-base uppercase leading-[19px]">
                    <div className="flex-1 min-w-0">
                      {t("orderReview.headers.product")}
                    </div>
                    <div className="w-16 sm:w-24 text-center shrink-0">
                      {t("orderReview.headers.quantity")}
                    </div>
                    <div className="w-16 sm:w-24 text-right shrink-0">
                      {t("orderReview.headers.total")}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-purple/50 border-t w-full h-px"></div>

                  {/* Product Rows - Dynamic from cart */}
                  {cartItems.map((item, index) => (
                    <div key={item.id || index}>
                      <div className="flex justify-between items-center py-2 min-h-12 text-foreground text-sm sm:text-base leading-[19px]">
                        <div className="flex-1 pr-2 min-w-0 break-words">
                          {item.product?.name || t("orderReview.productFallback")}
                        </div>
                        <div className="w-16 sm:w-24 text-center shrink-0">
                          {item.quantity}
                        </div>
                        <div className="w-16 sm:w-24 text-right shrink-0">
                          $
                          {(
                            (Number(item.product?.price) || 0) * item.quantity
                          ).toFixed(2)}
                        </div>
                      </div>
                      <div className="border-purple/50 border-t w-full h-px"></div>
                    </div>
                  ))}

                  {/* Empty cart fallback */}
                  {cartItems.length === 0 && (
                    <div className="flex justify-center items-center py-8">
                      <p className="text-gray-2 text-base leading-[19px]">
                        {t("orderReview.emptyCart")}
                      </p>
                    </div>
                  )}

                  {/* Subtotal */}
                  <div className="flex justify-between items-center h-12">
                    <div className="font-bold text-foreground text-base uppercase leading-[19px]">
                      {t("orderReview.subtotal")}
                    </div>
                    <div className="font-bold text-foreground text-base leading-[19px]">
                      ${subtotal.toFixed(2)}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-purple/50 border-t w-full h-px"></div>
                </div>
              </>
            )}

            {/* Delivery Section */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="font-normal text-foreground text-xl uppercase leading-6">
                  {t("orderReview.delivery")}
                </h3>
                <button
                  onClick={handleEditShipping}
                  className="hover:opacity-80 text-purple text-base underline leading-[19px]"
                >
                  {t("orderReview.edit")}
                </button>
              </div>

              {deliveryMethod ? (
                <RadioButton
                  id={`delivery-${deliveryMethod.id}`}
                  name="delivery-method"
                  value={deliveryMethod.id.toString()}
                  checked={true}
                  onChange={() => {}}
                  className="gap-4 px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-purple text-base leading-[19px]">
                      ${shipping.toFixed(2)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start gap-1 text-foreground text-base leading-[19px]">
                        <span className="font-medium uppercase">
                          {deliveryMethod.name}
                        </span>
                      </div>
                      <div className="text-gray-2 text-base leading-[19px]">
                        {deliveryMethod.description}
                      </div>
                    </div>
                  </div>
                </RadioButton>
              ) : (
                <div className="px-4 py-2 text-gray-2 text-base leading-[19px]">
                  {t("orderReview.noDeliveryMethod")}
                </div>
              )}
            </div>

            {/* Order Total */}
            <div className="flex flex-col gap-2 font-bold text-base leading-[19px]">
              <div className="flex justify-between items-center h-12 text-foreground">
                <div className="uppercase">{t("orderReview.shippingRow")}</div>
                <div>${shipping.toFixed(2)}</div>
              </div>

              <div className="border-purple/50 border-t w-full h-px"></div>

              <div className="flex justify-between items-center h-12 text-purple">
                <div className="uppercase">{t("orderReview.orderTotal")}</div>
                <div>${total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
