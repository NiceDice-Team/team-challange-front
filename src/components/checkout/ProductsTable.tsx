import { useCartQuery } from "@/hooks/useCartQuery";
import { useMemo, useEffect } from "react";

const ProductsTable = ({ setSubtotal }: { setSubtotal: (subtotal: number) => void }) => {
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

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="text-xl uppercase">Your order</div>
      {cartLoading ? (
        <div className="animate-pulse">Loading order...</div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center h-12 font-normal text-foreground text-sm sm:text-base uppercase">
              <div className="flex-1 min-w-0">Product</div>
              <div className="w-16 sm:w-24 text-center shrink-0">Quantity</div>
              <div className="w-16 sm:w-24 text-right shrink-0">Total</div>
            </div>

            <div className="border-purple/50 border-t w-full h-px"></div>
            {cartItems.map((item, index) => (
              <div key={item.id || index}>
                <div className="flex justify-between items-center py-2 min-h-12 text-foreground text-sm sm:text-base">
                  <div className="flex-1 min-w-0 pr-2 break-words">
                    {item.product?.name || "Product"}
                  </div>
                  <div className="w-16 sm:w-24 text-center shrink-0">{item.quantity}</div>
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

            {cartItems.length === 0 && (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-2 text-base">No items in cart</p>
              </div>
            )}

            <div className="flex justify-between items-center h-12">
              <div className="font-bold text-foreground text-base uppercase">
                Subtotal
              </div>
              <div className="font-bold text-foreground text-base">
                ${subtotal.toFixed(2)}
              </div>
            </div>
            <div className="border-purple/50 border-t w-full h-px"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsTable;
