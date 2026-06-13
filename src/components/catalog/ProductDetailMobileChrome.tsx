"use client";

import Navbar from "@/components/layout/Navbar";
import MobileFooter from "@/components/layout/MobileFooter";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";

type MobileBreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

type ProductDetailMobileHeaderProps = {
  breadcrumbItems?: MobileBreadcrumbItem[];
};

export function ProductDetailMobileHeader({
  breadcrumbItems = [],
}: ProductDetailMobileHeaderProps) {
  return (
    <>
      <div className="sticky top-0 z-40 bg-white px-4 pt-6 sm:hidden">
        <Navbar
          hideMobilePaginationChrome
          showMobileDivider={breadcrumbItems.length > 0}
        />
      </div>
      <MobileHeaderBreadcrumbs items={breadcrumbItems} />
    </>
  );
}

export function MobileHeaderBreadcrumbs({ items }: { items: MobileBreadcrumbItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div data-testid="navbar-mobile-breadcrumb" className="px-4 pt-6 sm:hidden">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="w-full overflow-x-auto no-scrollbar">
          <CustomBreadcrumb
            items={items}
            className="w-max"
            listClassName="gap-2"
            linkClassName="text-base leading-[19px]"
            pageClassName="text-base leading-[19px]"
            separatorClassName="mx-0"
          />
        </div>
        <div
          aria-hidden="true"
          data-testid="navbar-mobile-breadcrumb-divider"
          className="mt-6 h-0 w-full border-t border-[#A4A3C8]"
        />
      </div>
    </div>
  );
}

export function ProductDetailMobileFooter() {
  return <MobileFooter />;
}
