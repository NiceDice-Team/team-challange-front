import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import ShippingForm from "@/components/checkout/ShippingForm";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Board games", href: "/catalog" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", current: true },
];

function CheckoutPage() {
  return (
    <div className="py-8 min-h-screen">
      <CustomBreadcrumb items={breadcrumbItems} />

      <h3 className="mb-4 text-title uppercase">Checkout</h3>
      <div className="flex gap-6">
        <div className="flex flex-col py-6 w-1/2">
          <div className="pb-10 text-xl uppercase">Shipping</div>

          <div className="flex flex-col gap-4">
            <ShippingForm />
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6 border-1 w-1/2">
          <div className="pb-10 text-xl uppercase">Your order</div>

          <div className="flex flex-col gap-4">form</div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
