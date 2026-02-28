import { useCartQuery } from "@/hooks/useCartQuery";
import { useMemo, useEffect } from "react";
import { DeliveryOption } from "./DeliveryOptions";

interface ProductsTableProps {
  setSubtotal: (subtotal: number) => void;
  shippingPrice?: number;
  paymentMethod?: DeliveryOption | null;
  hideTitle?: boolean;
}

const ProductsTable = ({ 
  setSubtotal, 
  shippingPrice, 
  paymentMethod,
  hideTitle = false 
}: ProductsTableProps) => {
  const { data: cartItems = [], isLoading: cartLoading } = useCartQuery();

  const subtotal = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((sum, item) => {
      const price = Number(item.product?.price) || 0;
      return sum + price * item.quantity;
    }, 0);

    return calculatedSubtotal;
  }, [cartItems]);

  useEffect(() => {
    setSubtotal(subtotal);
  }, [subtotal, setSubtotal]);

  const total = subtotal + (shippingPrice || 0);

  return (
    <div className="flex flex-col gap-2 w-full">
      {!hideTitle && <div className="text-xl uppercase mb-4">Your order</div>}
      {cartLoading ? (
        <div className="animate-pulse">Loading order...</div>
      ) : (
        <>
          <div className="flex flex-col">
            {/* Table Header */}
            <div className="flex justify-between items-center h-10 font-normal text-[#040404] text-sm uppercase">
              <div className="flex-1 min-w-0">Product</div>
              <div className="w-20 text-center shrink-0">Quantity</div>
              <div className="w-20 text-right shrink-0">Total</div>
            </div>

            <div className="border-[#494791]/50 border-t w-full h-px mb-2"></div>
            
            {/* Product Rows */}
            <div className="flex flex-col">
              {cartItems.map((item, index) => (
                <div key={item.id || index} className="flex flex-col">
                  <div className="flex justify-between items-center py-3 min-h-[48px] text-[#000000] text-base">
                    <div className="flex-1 min-w-0 pr-2 leading-tight">
                      {item.product?.name || "Product"}
                    </div>
                    <div className="w-20 text-center shrink-0">{item.quantity}</div>
                    <div className="w-20 text-right shrink-0">
                      $
                      {(
                        (Number(item.product?.price) || 0) * item.quantity
                      ).toFixed(2)}
                    </div>
                  </div>
                  <div className="border-[#494791]/50 border-t w-full h-px"></div>
                </div>
              ))}
            </div>

            {cartItems.length === 0 && (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-2 text-base">No items in cart</p>
              </div>
            )}

            {/* Subtotal & Shipping Container */}
            <div className="flex flex-col py-4 gap-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-base">
                <div className="font-normal text-[#000000] uppercase">
                  Subtotal
                </div>
                <div className="font-bold text-[#000000]">
                  ${subtotal.toFixed(2)}
                </div>
              </div>

              {/* Shipping - Only show if props are provided (for mobile summary or full desktop summary) */}
              {shippingPrice !== undefined && (
                <div className="flex justify-between items-center text-base">
                  <div className="font-normal text-[#000000] uppercase">
                    Shipping
                  </div>
                  <div className="font-normal text-[#000000]">
                    {!paymentMethod ? "Enter shipping address" : `$${shippingPrice.toFixed(2)}`}
                  </div>
                </div>
              )}
            </div>

            {/* Order Total */}
            {shippingPrice !== undefined && (
              <>
                <div className="border-[#494791]/50 border-t w-full h-px"></div>
                <div className="flex justify-between items-center h-12 text-base">
                  <div className="font-bold text-[#494791] uppercase">
                    Order Total
                  </div>
                  <div className="font-bold text-[#494791]">
                    ${total.toFixed(2)}
                  </div>
                </div>
                <div className="border-[#494791]/50 border-t w-full h-px"></div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsTable;
