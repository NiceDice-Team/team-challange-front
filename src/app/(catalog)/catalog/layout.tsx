import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import MobileFooter from "../../../components/layout/MobileFooter";
import { CustomBreadcrumb } from "../../../components/shared/CustomBreadcrumb";

export default function CatalogLayout({ children }) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Board games", current: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-very-light-gray)]">
      <div className="px-4 pt-4 pb-0 sm:px-6 sm:py-6 md:px-8 lg:px-12 xl:px-16">
        <Navbar hideMobilePaginationChrome />
      </div>

      <div className="px-4 sm:hidden">
        <div className="mx-auto max-w-[396px] border-b border-[var(--color-light-purple-2)] py-6">
          <div className="w-full overflow-x-auto no-scrollbar">
            <CustomBreadcrumb
              items={breadcrumbItems}
              className="w-max"
              listClassName="gap-2"
              linkClassName="text-base leading-[19px]"
              pageClassName="text-base leading-[19px]"
              separatorClassName="mx-0"
            />
          </div>
        </div>
      </div>

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
