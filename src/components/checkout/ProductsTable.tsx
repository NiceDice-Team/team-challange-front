import { useCartQuery } from "@/hooks/useCartQuery";
import { useMemo } from "react";

const ProductsTable = () => {
  const { data: cartItems = [], isLoading: cartLoading } = useCartQuery();

  const subtotal = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product?.price || 0);
      return sum + price * item.quantity;
    }, 0);

    return calculatedSubtotal;
  }, [cartItems]);

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="text-xl uppercase">Your order</div>
      {cartLoading ? (
        <div className="animate-pulse">Loading order...</div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center h-12 font-normal text-foreground text-base uppercase">
              <div>Product</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>

            <div className="border-purple/50 border-t w-full h-px"></div>
            {cartItems.map((item, index) => (
              <div key={item.id || index}>
                <div className="flex justify-between items-center py-2 min-h-12 text-foreground text-base">
                  <div className="w-[200px]">
                    {item.product?.name || "Product"}
                  </div>
                  <div className="w-[200px] text-center">{item.quantity}</div>
                  <div className="w-[200px] text-right">
                    $
                    {(
                      parseFloat(item.product?.price || 0) * item.quantity
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
