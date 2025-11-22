import Navbar from "../../../components/layout/Navbar.jsx";
import Footer from "../../../components/layout/Footer.jsx";
import { CustomBreadcrumb } from "../../../components/shared/CustomBreadcrumb.jsx";

export default function CatalogLayout({ children }) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Board Games", current: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-very-light-gray)]">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6">
        <Navbar />
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mb-4 sm:mb-6">
        <div className="max-w-[1320px] mx-auto">
          <CustomBreadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
