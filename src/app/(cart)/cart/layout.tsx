import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import { ProductDetailMobileHeader } from "@/components/catalog/ProductDetailMobileChrome";

interface CartLayoutProps {
  children: React.ReactNode;
}

/**
 * Cart layout wrapper
 * Used for cart-related pages
 */
export default function CartLayout({ children }: CartLayoutProps): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col">
      <ProductDetailMobileHeader />

      <div className="hidden sm:block px-8 lg:px-16 py-6">
        <Navbar />
      </div>

      <main className="flex-1 px-4 pb-10 sm:px-8 lg:px-16 sm:py-10">{children}</main>

      <Footer />
    </div>
  );
}
