"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import { MobileHeaderBreadcrumbs } from "@/components/catalog/ProductDetailMobileChrome";
import {
  getCatalogBreadcrumbItems,
  parseCatalogFiltersFromSearchParams,
} from "@/lib/catalogQueryParams";

function CatalogBreadcrumbsContent() {
  const searchParams = useSearchParams();
  const breadcrumbItems = useMemo(() => {
    const filters = parseCatalogFiltersFromSearchParams(searchParams);
    return getCatalogBreadcrumbItems(filters);
  }, [searchParams]);

  return (
    <>
      <MobileHeaderBreadcrumbs items={breadcrumbItems} />

      <div className="hidden px-4 mb-4 sm:block sm:px-6 sm:mb-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1320px] mx-auto">
          <CustomBreadcrumb items={breadcrumbItems} />
        </div>
      </div>
    </>
  );
}

export function CatalogBreadcrumbs() {
  return (
    <Suspense fallback={null}>
      <CatalogBreadcrumbsContent />
    </Suspense>
  );
}
