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
        <h3 className="text-xl leading-6 font-normal uppercase text-foreground">{title}</h3>
        {onEdit && (
          <button onClick={onEdit} className="text-base leading-[19px] underline text-purple hover:opacity-80">
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
  const formData = useCheckoutFormData();
  const deliveryMethod = usePaymentMethod();
  const savedPaymentCard = usePaymentCard();
  const { setPaymentCard } = useCheckoutActions();

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
      const price = parseFloat(item.product?.price || 0);
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
      formData,
      deliveryMethod,
      paymentCard: paymentCardData,
      cartItems,
      total,
    });

    alert("Order placed! Check the console for details.");
  };

  return (
    <div className="px-8 lg:px-16">
      <div className="max-w-[1320px] mx-auto">
        {/* Breadcrumbs */}
        <div className="mt-6 mb-6">
          <CustomBreadcrumb items={breadcrumbItems} />
        </div>

        {/* Page Title */}
        <div className="flex flex-col gap-4 mb-18">
          <h1 className="text-[var(--text-title)] leading-[48px] font-normal uppercase flex items-center">
            Order review
          </h1>
        </div>

        {/* Main Layout - Two Columns */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Column - Order Information */}
          <div className="flex flex-col py-6 gap-12 w-full lg:w-[648px]">
            {/* Shipping Information */}
            <Section title="Shipping" onEdit={handleEditShipping}>
              <div className="flex flex-col gap-2 text-base leading-[19px] text-gray-2">
                <div>
                  {formData.shippingFirstName || "Putin"} {formData.shippingLastName || "Huilo"}
                </div>
                <div>
                  {formData.shippingAddress || "Address"}
                  {formData.shippingApartment && `, ${formData.shippingApartment}`}
                </div>
                <div>
                  {formData.shippingCity || "City"}, {formData.shippingZipCode || "Zip code"},{" "}
                  {formData.shippingCountry || "Country"}
                </div>
                <div className="underline underline-offset-2">{formData.shippingEmail || "email@example.com"}</div>
                <div>{formData.shippingPhone || "+380 00 000 0000"}</div>
              </div>
            </Section>

            {/* Billing Address */}
            <Section title="Billing address" onEdit={handleEditBilling}>
              <div className="flex flex-col gap-2 text-base leading-[19px] text-gray-2">
                <div>
                  {formData.billingFirstName || "First name"} {formData.billingLastName || "Last name"}
                </div>
                <div>
                  {formData.billingAddress || "Address"}
                  {formData.billingApartment && `, ${formData.billingApartment}`}
                </div>
                <div>
                  {formData.billingCity || "City"}, {formData.billingZipCode || "Zip code"},{" "}
                  {formData.billingCountry || "Country"}
                </div>
                <div className="underline underline-offset-2">{formData.billingEmail || "email@example.com"}</div>
                <div>{formData.billingPhone || "+380 00 000 0000"}</div>
              </div>
            </Section>

            {/* Payment Method */}
            <div className="flex flex-col gap-6">
              {/* Payment Header */}
              <div className="flex justify-between items-center h-6">
                <h3 className="text-xl leading-6 font-normal uppercase text-foreground">Payment</h3>
                <button
                  onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}
                  className="flex items-center justify-center"
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
                      className="py-2 px-4 gap-6"
                    >
                      <div className="flex items-center gap-1">
                        <GooglePayIcon />
                        <span className="text-base leading-[18px] text-black">Pay</span>
                      </div>
                    </RadioButton>

                    {/* Apple Pay Option */}
                    <RadioButton
                      id="apple-pay"
                      name="payment-method"
                      value="apple-pay"
                      checked={paymentMethodType === "apple-pay"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethodType(e.target.value)}
                      className="py-2 px-4 gap-6"
                    >
                      <div className="flex items-center gap-1">
                        <ApplePayIcon />
                        <span className="text-base leading-[18px] text-black">Pay</span>
                      </div>
                    </RadioButton>

                    {/* Credit Card Option */}
                    <RadioButton
                      id="credit-card"
                      name="payment-method"
                      value="credit-card"
                      checked={paymentMethodType === "credit-card"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethodType(e.target.value)}
                      className="bg-white py-2 px-4 gap-6"
                    >
                      <div className="flex items-center gap-1">
                        <CreditCardIcon />
                        <span className="text-base leading-[18px] text-black">Credit card</span>
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
                          <button className="text-base leading-[19px] text-purple underline underline-offset-3 self-start">
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
            <div className="flex flex-row justify-between items-center w-full max-w-[648px] h-12">
              <Link
                href="/checkout-order"
                className="flex items-center gap-2 text-base leading-[19px] text-foreground hover:opacity-80"
              >
                <ChevronLeft className="w-6 h-6 text-purple" />
                Return to checkout
              </Link>
              <CustomButton
                type="button"
                onClick={handlePlaceOrder}
                className="w-72 h-12 bg-purple text-white border border-purple hover:bg-purple/90 text-base leading-[19px] uppercase"
              >
                Place order
              </CustomButton>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="flex flex-col p-6 gap-10 w-full lg:w-[648px] border border-[#A4A3C8]">
            <h2 className="text-xl leading-6 font-normal uppercase text-foreground w-full flex items-center">
              Your order
            </h2>

            {cartLoading ? (
              <div className="animate-pulse">Loading order...</div>
            ) : (
              <>
                {/* Product Table */}
                <div className="flex flex-col gap-2">
                  {/* Table Header */}
                  <div className="flex justify-between items-center h-12 text-base leading-[19px] font-normal uppercase text-foreground">
                    <div className="w-[200px]">Product</div>
                    <div className="w-[200px] text-center">Quantity</div>
                    <div className="w-[200px] text-right">Total</div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px border-t border-purple/50"></div>

                  {/* Product Rows - Dynamic from cart */}
                  {cartItems.map((item, index) => (
                    <div key={item.id || index}>
                      <div className="flex justify-between items-center min-h-12 py-2 text-base leading-[19px] text-foreground">
                        <div className="w-[200px]">{item.product?.name || "Product"}</div>
                        <div className="w-[200px] text-center">{item.quantity}</div>
                        <div className="w-[200px] text-right">
                          ${(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      <div className="w-full h-px border-t border-purple/50"></div>
                    </div>
                  ))}

                  {/* Empty cart fallback */}
                  {cartItems.length === 0 && (
                    <div className="flex justify-center items-center py-8">
                      <p className="text-base leading-[19px] text-gray-2">No items in cart</p>
                    </div>
                  )}

                  {/* Subtotal */}
                  <div className="flex justify-between items-center h-12">
                    <div className="text-base leading-[19px] font-bold uppercase text-foreground">Subtotal</div>
                    <div className="text-base leading-[19px] font-bold text-foreground">${subtotal.toFixed(2)}</div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px border-t border-purple/50"></div>
                </div>
              </>
            )}

            {/* Delivery Section */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl leading-6 font-normal uppercase text-foreground">Delivery</h3>
                <button
                  onClick={handleEditShipping}
                  className="text-base leading-[19px] underline text-purple hover:opacity-80"
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
                  className="py-2 px-4 gap-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-base leading-[19px] font-bold text-purple">${shipping.toFixed(2)}</div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start gap-1 text-base leading-[19px] text-foreground">
                        <span className="font-medium uppercase">{deliveryMethod.name}</span>
                      </div>
                      <div className="text-base leading-[19px] text-gray-2">{deliveryMethod.description}</div>
                    </div>
                  </div>
                </RadioButton>
              ) : (
                <div className="py-2 px-4 text-base leading-[19px] text-gray-2">No delivery method selected</div>
              )}
            </div>

            {/* Order Total */}
            <div className="flex flex-col gap-2 text-base leading-[19px] font-bold">
              <div className="flex justify-between items-center h-12 text-foreground">
                <div className="uppercase">Shipping</div>
                <div>${shipping.toFixed(2)}</div>
              </div>

              <div className="w-full h-px border-t border-purple/50"></div>

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
