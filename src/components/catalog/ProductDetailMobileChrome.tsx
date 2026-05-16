"use client";

import Navbar from "@/components/layout/Navbar";
import MobileFooter from "@/components/layout/MobileFooter";

export function ProductDetailMobileHeader() {
  return (
    <div className="sm:hidden px-4 pt-6">
      <Navbar hideMobilePaginationChrome />
    </div>
  );
}

export function ProductDetailMobileFooter() {
  return <MobileFooter />;
}
