import Navbar from "../../../components/layout/Navbar.jsx";
import Footer from "../../../components/layout/Footer.jsx";
import { CustomBreadcrumb } from "../../../components/shared/CustomBreadcrumb.jsx";

export default function CheckoutLayout({ children, params }) {
  // Check if we're on the order-review subroute
  const isOrderReview = typeof window !== 'undefined' && window.location.pathname.includes('/order-review');
  
  const breadcrumbItems = isOrderReview ? [
    { label: "Home", href: "/" },
    { label: "Board Games", href: "/catalog" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
    { label: "Order Review", current: true },
  ] : [
    { label: "Home", href: "/" },
    { label: "Board Games", href: "/catalog" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", current: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-very-light-gray)]">
      <div className="px-8 lg:px-16 py-6">
        <Navbar />
      </div>

      <div className="px-8 lg:px-16 mb-6">
        <div className="max-w-[1320px] mx-auto">
          <CustomBreadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}