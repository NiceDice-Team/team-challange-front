"use client";

import Link from "next/link";
import { CustomButton } from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";
import { RadioButton } from "@/components/shared/CustomRadio";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import { ChevronLeft } from "lucide-react";
import { GooglePayIcon, ApplePayIcon, CreditCardIcon, ChevronDownIcon } from "@/svgs/icons";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCartQuery } from "@/hooks/useCartQuery";
import { useCheckoutFormData, usePaymentMethod, usePaymentCard, useCheckoutActions } from "@/store/checkout";

interface SectionProps {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
  className?: string;
}

// Section Component for consistent styling
const Section = ({ title, onEdit, children, className = "" }: SectionProps) => {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-normal text-foreground text-xl uppercase leading-6">{title}</h3>
        {onEdit && (
          <button onClick={onEdit} className="hover:opacity-80 text-purple text-base underline leading-[19px]">
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Board games", href: "/catalog" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout-order" },
  { label: "Order review", current: true },
];

interface PaymentCardData {
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function OrderReviewPage() {
  const router = useRouter();
  const [paymentMethodType, setPaymentMethodType] = useState<string>("credit-card");
  const [isPaymentExpanded, setIsPaymentExpanded] = useState<boolean>(true);

  // Get data from Zustand store
  const checkoutUserData = useCheckoutFormData();
  const deliveryMethod = usePaymentMethod();
  const savedPaymentCard = usePaymentCard();
  const { setPaymentCard } = useCheckoutActions();
console.log('checkoutUserData', checkoutUserData);
  // Use existing cart functionality
  const { data: cartItems = [], isLoading: cartLoading } = useCartQuery();

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

  const handlePlaceOrder = () => {
    console.log("🚀 Place Order button clicked!");

    // Save payment card data before placing order
    setPaymentCard(paymentCardData);

    // TODO: Integrate with actual payment/order API
    console.log("Placing order with:", {
      checkoutUserData,
      deliveryMethod,
      paymentCard: paymentCardData,
      cartItems,
      total,
    });

    alert("Order placed! Check the console for details.");
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
            Order review
          </h1>
        </div>

        {/* Main Layout - Two Columns */}
        <div className="flex lg:flex-row flex-col items-start gap-6">
          {/* Left Column - Order Information */}
          <div className="flex flex-col gap-12 py-6 w-full lg:w-[648px]">
            {/* Shipping Information */}
            <Section title="Shipping" onEdit={handleEditShipping}>
              <div className="flex flex-col gap-2 text-gray-2 text-base leading-[19px]">
                <div>
                  {checkoutUserData.shippingFirstName} {checkoutUserData.shippingLastName}
                </div>
                <div>
                  {checkoutUserData.shippingAddress}
                  {checkoutUserData.shippingApartment && `, ${checkoutUserData.shippingApartment}`}
                </div>
                <div>
                  {checkoutUserData.shippingCity}{checkoutUserData.shippingCity && checkoutUserData.shippingZipCode && ", "}
                  {checkoutUserData.shippingZipCode}{(checkoutUserData.shippingCity || checkoutUserData.shippingZipCode) && checkoutUserData.shippingCountry && ", "}
                  {checkoutUserData.shippingCountry}
                </div>
                {checkoutUserData.shippingEmail && (
                  <div className="underline underline-offset-2">{checkoutUserData.shippingEmail}</div>
                )}
                {checkoutUserData.shippingPhone && <div>{checkoutUserData.shippingPhone}</div>}
              </div>
            </Section>

            {/* Billing Address */}
            <Section title="Billing address" onEdit={handleEditBilling}>
              <div className="flex flex-col gap-2 text-gray-2 text-base leading-[19px]">
                <div>
                  {checkoutUserData.billingFirstName} {checkoutUserData.billingLastName}
                </div>
                <div>
                  {checkoutUserData.billingAddress}
                  {checkoutUserData.billingApartment && `, ${checkoutUserData.billingApartment}`}
                </div>
                <div>
                  {checkoutUserData.billingCity}{checkoutUserData.billingCity && checkoutUserData.billingZipCode && ", "}
                  {checkoutUserData.billingZipCode}{(checkoutUserData.billingCity || checkoutUserData.billingZipCode) && checkoutUserData.billingCountry && ", "}
                  {checkoutUserData.billingCountry}
                </div>
                {checkoutUserData.billingEmail && (
                  <div className="underline underline-offset-2">{checkoutUserData.billingEmail}</div>
                )}
                {checkoutUserData.billingPhone && <div>{checkoutUserData.billingPhone}</div>}
              </div>
            </Section>

            {/* Payment Method */}
            <div className="flex flex-col gap-6">
              {/* Payment Header */}
              <div className="flex justify-between items-center h-6">
                <h3 className="font-normal text-foreground text-xl uppercase leading-6">Payment</h3>
                <button
                  onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}
                  className="flex justify-center items-center"
                  aria-label="Toggle payment section"
                >
                  <ChevronDownIcon className="w-6 h-6" isExpanded={isPaymentExpanded} />
                </button>
              </div>

              {/* Payment Options */}
              {isPaymentExpanded && (
                <>
                  <div className="flex flex-col gap-1">
                    {/* Google Pay Option */}
                    <RadioButton
                      id="google-pay"
                      name="payment-method"
                      value="google-pay"
                      checked={paymentMethodType === "google-pay"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethodType(e.target.value)}
                      className="gap-6 px-4 py-2"
                    >
                      <div className="flex items-center gap-1">
                        <GooglePayIcon />
                        <span className="text-black text-base leading-[18px]">Pay</span>
                      </div>
                    </RadioButton>

                    {/* Apple Pay Option */}
                    <RadioButton
                      id="apple-pay"
                      name="payment-method"
                      value="apple-pay"
                      checked={paymentMethodType === "apple-pay"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethodType(e.target.value)}
                      className="gap-6 px-4 py-2"
                    >
                      <div className="flex items-center gap-1">
                        <ApplePayIcon />
                        <span className="text-black text-base leading-[18px]">Pay</span>
                      </div>
                    </RadioButton>

                    {/* Credit Card Option */}
                    <RadioButton
                      id="credit-card"
                      name="payment-method"
                      value="credit-card"
                      checked={paymentMethodType === "credit-card"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethodType(e.target.value)}
                      className="gap-6 bg-white px-4 py-2"
                    >
                      <div className="flex items-center gap-1">
                        <CreditCardIcon />
                        <span className="text-black text-base leading-[18px]">Credit card</span>
                      </div>
                    </RadioButton>
                  </div>

                  {/* Credit Card Form */}
                  {paymentMethodType === "credit-card" && (
                    <div className="flex flex-col gap-4 max-w-[424px]">
                      <CustomInput
                        label="First name"
                        id="cardFirstName"
                        name="cardFirstName"
                        value={paymentCardData.firstName}
                        onChange={(e) => setPaymentCardData({ ...paymentCardData, firstName: e.target.value })}
                        placeholder="Olena"
                      />

                      <CustomInput
                        label="Last Name"
                        id="cardLastName"
                        name="cardLastName"
                        value={paymentCardData.lastName}
                        onChange={(e) => setPaymentCardData({ ...paymentCardData, lastName: e.target.value })}
                        placeholder="Petrenko"
                      />

                      <CustomInput
                        label="Card number"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentCardData.cardNumber}
                        onChange={(e) => setPaymentCardData({ ...paymentCardData, cardNumber: e.target.value })}
                        placeholder="···· ···· ···· ····"
                      />

                      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                        <CustomInput
                          label="Expiration Date"
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentCardData.expiryDate}
                          onChange={(e) => setPaymentCardData({ ...paymentCardData, expiryDate: e.target.value })}
                          placeholder="MM/YY"
                        />

                        <div className="flex flex-col gap-1">
                          <CustomInput
                            label="cvv"
                            id="cvv"
                            name="cvv"
                            value={paymentCardData.cvv}
                            onChange={(e) => setPaymentCardData({ ...paymentCardData, cvv: e.target.value })}
                            placeholder="···"
                          />
                          <button className="self-start text-purple text-base underline underline-offset-3 leading-[19px]">
                            Where is my CVV?
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                Return to checkout
              </Link>
              <CustomButton
                type="button"
                onClick={handlePlaceOrder}
                className="bg-purple hover:bg-purple/90 border border-purple w-full sm:w-72 h-12 text-white text-base uppercase leading-[19px]"
              >
                Place order
              </CustomButton>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="flex flex-col gap-10 p-6 border border-[#A4A3C8] w-full lg:w-[648px]">
            <h2 className="flex items-center w-full font-normal text-foreground text-xl uppercase leading-6">
              Your order
            </h2>

            {cartLoading ? (
              <div className="animate-pulse">Loading order...</div>
            ) : (
              <>
                {/* Product Table */}
                <div className="flex flex-col gap-2">
                  {/* Table Header */}
                  <div className="flex justify-between items-center h-12 font-normal text-foreground text-sm sm:text-base uppercase leading-[19px]">
                    <div className="flex-1 min-w-0">Product</div>
                    <div className="w-16 sm:w-24 text-center shrink-0">Quantity</div>
                    <div className="w-16 sm:w-24 text-right shrink-0">Total</div>
                  </div>

                  {/* Divider */}
                  <div className="border-purple/50 border-t w-full h-px"></div>

                  {/* Product Rows - Dynamic from cart */}
                  {cartItems.map((item, index) => (
                    <div key={item.id || index}>
                      <div className="flex justify-between items-center py-2 min-h-12 text-foreground text-sm sm:text-base leading-[19px]">
                        <div className="flex-1 pr-2 min-w-0 break-words">{item.product?.name || "Product"}</div>
                        <div className="w-16 sm:w-24 text-center shrink-0">{item.quantity}</div>
                        <div className="w-16 sm:w-24 text-right shrink-0">
                          ${((Number(item.product?.price) || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      <div className="border-purple/50 border-t w-full h-px"></div>
                    </div>
                  ))}

                  {/* Empty cart fallback */}
                  {cartItems.length === 0 && (
                    <div className="flex justify-center items-center py-8">
                      <p className="text-gray-2 text-base leading-[19px]">No items in cart</p>
                    </div>
                  )}

                  {/* Subtotal */}
                  <div className="flex justify-between items-center h-12">
                    <div className="font-bold text-foreground text-base uppercase leading-[19px]">Subtotal</div>
                    <div className="font-bold text-foreground text-base leading-[19px]">${subtotal.toFixed(2)}</div>
                  </div>

                  {/* Divider */}
                  <div className="border-purple/50 border-t w-full h-px"></div>
                </div>
              </>
            )}

            {/* Delivery Section */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="font-normal text-foreground text-xl uppercase leading-6">Delivery</h3>
                <button
                  onClick={handleEditShipping}
                  className="hover:opacity-80 text-purple text-base underline leading-[19px]"
                >
                  Edit
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
                    <div className="font-bold text-purple text-base leading-[19px]">${shipping.toFixed(2)}</div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start gap-1 text-foreground text-base leading-[19px]">
                        <span className="font-medium uppercase">{deliveryMethod.name}</span>
                      </div>
                      <div className="text-gray-2 text-base leading-[19px]">{deliveryMethod.description}</div>
                    </div>
                  </div>
                </RadioButton>
              ) : (
                <div className="px-4 py-2 text-gray-2 text-base leading-[19px]">No delivery method selected</div>
              )}
            </div>

            {/* Order Total */}
            <div className="flex flex-col gap-2 font-bold text-base leading-[19px]">
              <div className="flex justify-between items-center h-12 text-foreground">
                <div className="uppercase">Shipping</div>
                <div>${shipping.toFixed(2)}</div>
              </div>

              <div className="border-purple/50 border-t w-full h-px"></div>

              <div className="flex justify-between items-center h-12 text-purple">
                <div className="uppercase">Order Total</div>
                <div>${total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
