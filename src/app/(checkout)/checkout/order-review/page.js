'use client';

import Link from 'next/link';
import { CustomInput } from '@/components/shared/CustomInput';
import { CustomButton } from '@/components/shared/CustomButton';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCartQuery } from '@/hooks/useCartQuery';

// Custom Radio Button Component for Payment/Delivery Selection
const RadioButton = ({ id, name, value, checked, onChange, children, className = "" }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div 
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            checked 
              ? 'border-purple bg-white' 
              : 'border-purple bg-white'
          }`}
        >
          {checked && (
            <div className="w-3 h-3 rounded-full bg-purple"></div>
          )}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

// Section Component for consistent styling
const Section = ({ title, onEdit, children, className = "" }) => {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-normal uppercase text-foreground">
          {title}
        </h3>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="text-base underline text-purple hover:opacity-80"
          >
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

// Mock data for order review
const mockOrderData = {
  shipping: {
    name: "Milana Sovenko",
    address: "Pasinger st. 12, app. 88",
    location: "Germany, Munich, 81241", 
    email: "milanasov@gmail.com",
    phone: "+49 (89) 39295921"
  },
  billing: {
    name: "Milana Sovenko",
    address: "Berliner Str. 45,",
    location: "Germany, Cologne, 50674",
    email: "milanasov@gmail.com", 
    phone: "+49 (89) 39295921"
  },
  payment: {
    firstName: "Milana",
    lastName: "Sovenko",
    cardNumber: "1228 ···· ···· 4488",
    expiryDate: "12/28",
    cvv: "···"
  },
  delivery: {
    method: "Ukrposhta",
    duration: "7-10 business days",
    arrival: "Mon, June 12 - Thu, June 15",
    cost: 12.00
  }
};

export default function OrderReviewPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [deliveryMethod, setDeliveryMethod] = useState('ukrposhta');
  
  // Use existing cart functionality
  const { data: cartItems = [], isLoading: cartLoading } = useCartQuery();
  
  // Calculate totals using the same logic as cart page
  const { subtotal, shipping, total } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product?.price || 0);
      return sum + price * item.quantity;
    }, 0);
    
    const shippingCost = mockOrderData.delivery.cost;
    const calculatedTotal = calculatedSubtotal + shippingCost;
    
    return {
      subtotal: calculatedSubtotal,
      shipping: shippingCost,
      total: calculatedTotal,
    };
  }, [cartItems]);

  return (
    <div className="px-8 lg:px-16">
      <div className="max-w-[1320px] mx-auto">
        {/* Page Title */}
        <div className="flex flex-col gap-4 mb-18">
          <h1 className="text-[var(--text-title)] leading-[48px] font-normal uppercase flex items-center">
            Order review
          </h1>
        </div>

        {/* Main Layout - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column - Order Information */}
          <div className="flex flex-col py-6 gap-12 w-full max-w-[648px]">
            
            {/* Shipping Information */}
            <Section title="Shipping" onEdit={() => console.log('Edit shipping')}>
              <div className="flex flex-col gap-2 text-base text-gray-2">
                <div>{mockOrderData.shipping.name}</div>
                <div>{mockOrderData.shipping.address}</div>
                <div>{mockOrderData.shipping.location}</div>
                <div className="underline">{mockOrderData.shipping.email}</div>
                <div>{mockOrderData.shipping.phone}</div>
              </div>
            </Section>

            {/* Billing Address */}
            <Section title="Billing address" onEdit={() => console.log('Edit billing')}>
              <div className="flex flex-col gap-2 text-base text-gray-2">
                <div>{mockOrderData.billing.name}</div>
                <div>{mockOrderData.billing.address}</div>
                <div>{mockOrderData.billing.location}</div>
                <div className="underline">{mockOrderData.billing.email}</div>
                <div>{mockOrderData.billing.phone}</div>
              </div>
            </Section>

            {/* Payment Method */}
            <Section title="Payment" onEdit={() => console.log('Edit payment')}>
              <div className="flex flex-col gap-6">
                {/* Payment Method Selection */}
                <RadioButton
                  id="credit-card"
                  name="payment-method"
                  value="credit-card"
                  checked={paymentMethod === 'credit-card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="bg-white p-4"
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-6 h-6 text-black" />
                    <span className="text-base text-black">Credit card</span>
                  </div>
                </RadioButton>

                {/* Credit Card Form */}
                {paymentMethod === 'credit-card' && (
                  <div className="flex flex-col gap-4 max-w-[424px]">
                    <CustomInput
                      label="First name"
                      placeholder={mockOrderData.payment.firstName}
                      className="h-12 border border-gray-2 bg-white text-gray-2 px-5"
                      labelStyle="text-base font-normal uppercase text-foreground"
                    />
                    <CustomInput
                      label="Last Name"
                      placeholder={mockOrderData.payment.lastName}
                      className="h-12 border border-gray-2 bg-white text-gray-2 px-5"
                      labelStyle="text-base font-normal uppercase text-foreground"
                    />
                    <CustomInput
                      label="Card number"
                      placeholder={mockOrderData.payment.cardNumber}
                      className="h-12 border border-gray-2 bg-white text-foreground px-5"
                      labelStyle="text-base font-normal uppercase text-foreground"
                    />
                    <div className="flex gap-6">
                      <CustomInput
                        label="Expiration Date"
                        placeholder={mockOrderData.payment.expiryDate}
                        className="h-12 border border-gray-2 bg-white text-foreground px-5 w-[200px]"
                        labelStyle="text-base font-normal uppercase text-foreground"
                      />
                      <div className="flex flex-col gap-1">
                        <CustomInput
                          label="CVV"
                          placeholder={mockOrderData.payment.cvv}
                          className="h-12 border border-gray-2 bg-white text-foreground px-5 w-[200px]"
                          labelStyle="text-base font-normal uppercase text-foreground"
                        />
                        <button className="text-base text-purple underline self-start">
                          Where is my CVV?
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* Action Buttons */}
            <div className="flex justify-between items-center px-6">
              <Link href="/checkout" className="flex items-center gap-2 text-base text-foreground hover:opacity-80">
                <ArrowLeft className="w-6 h-6 text-purple" />
                Return to checkout
              </Link>
              <CustomButton className="w-72 h-12 bg-purple text-white border border-purple hover:bg-purple/90">
                PLACE ORDER
              </CustomButton>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="flex flex-col p-6 gap-10 w-full max-w-[648px] border border-light-purple-2">
            <h2 className="text-xl font-normal uppercase text-foreground w-full flex items-center">
              Your order
            </h2>
            
            {cartLoading ? (
              <div className="animate-pulse">Loading order...</div>
            ) : (
              <>
                {/* Product Table */}
                <div className="flex flex-col gap-2">
                  {/* Table Header */}
                  <div className="flex justify-between items-center h-12 text-base font-normal uppercase text-foreground">
                    <div className="w-[200px]">Product</div>
                    <div className="w-[200px] text-center">Quantity</div>
                    <div className="w-[200px] text-right">Total</div>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-full h-px border-t border-purple/50"></div>
                  
                  {/* Product Rows - Dynamic from cart */}
                  {cartItems.map((item, index) => (
                    <div key={item.id || index}>
                      <div className="flex justify-between items-center min-h-12 py-2 text-base text-foreground">
                        <div className="w-[200px]">
                          {item.product?.name || 'Product'}
                        </div>
                        <div className="w-[200px] text-center">
                          {item.quantity}
                        </div>
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
                      <p className="text-base text-gray-2">No items in cart</p>
                    </div>
                  )}
                  
                  {/* Subtotal */}
                  <div className="flex justify-between items-center h-12">
                    <div className="text-base font-bold uppercase text-foreground">Subtotal</div>
                    <div className="text-base font-bold text-foreground">${subtotal.toFixed(2)}</div>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-full h-px border-t border-purple/50"></div>
                </div>
              </>
            )}

            {/* Delivery Section */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-normal uppercase text-foreground">
                  Delivery
                </h3>
                <button className="text-base underline text-purple hover:opacity-80">
                  Edit
                </button>
              </div>
              
              <RadioButton
                id="ukrposhta"
                name="delivery-method"
                value="ukrposhta"
                checked={deliveryMethod === 'ukrposhta'}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="text-base font-bold text-purple">${shipping.toFixed(2)}</div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-1 text-base text-foreground">
                      <span className="font-medium uppercase">{mockOrderData.delivery.method}</span>
                      <span className="font-normal lowercase">{mockOrderData.delivery.duration}</span>
                    </div>
                    <div className="text-base text-gray-2">
                      {mockOrderData.delivery.arrival}
                    </div>
                  </div>
                </div>
              </RadioButton>
            </div>

            {/* Order Total */}
            <div className="flex flex-col gap-2 text-base font-bold">
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