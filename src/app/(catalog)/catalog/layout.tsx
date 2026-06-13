import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import MobileFooter from "../../../components/layout/MobileFooter";
import { CustomBreadcrumb } from "../../../components/shared/CustomBreadcrumb";
import { MobileHeaderBreadcrumbs } from "@/components/catalog/ProductDetailMobileChrome";

export default function CatalogLayout({ children }) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Board games", current: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-very-light-gray)]">
      <div className="sticky top-0 z-40 bg-[var(--color-very-light-gray)] px-4 pt-6 pb-0 sm:px-6 sm:py-6 md:px-8 lg:px-12 xl:px-16">
        <Navbar
          hideMobilePaginationChrome
          showMobileDivider
        />
      </div>

      <MobileHeaderBreadcrumbs items={breadcrumbItems} />

      <div className="hidden px-4 mb-4 sm:block sm:px-6 sm:mb-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1320px] mx-auto">
          <CustomBreadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <main className="flex-1">{children}</main>

      <div className="hidden sm:block">
        <Footer />
      </div>
      <MobileFooter />
    </div>
  );
}
