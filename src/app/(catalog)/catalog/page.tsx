"use client";

import ProductsGrid from "@/components/catalog/ProductsGrid";
import FilterSideBar from "@/components/catalog/FilterSideBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

function CatalogContent() {
  const { t } = useTranslation();
  const { selectedFilters, setSelectedFilters } = useUrlFilters();

  return (
    <div className="px-4 pt-6 pb-6 sm:px-6 sm:pt-0 md:px-8 lg:px-12 lg:pb-12 xl:px-16">
      <div className="max-w-[1320px] mx-auto">
        <h2 className="hidden lg:flex w-full items-center justify-center mb-6 text-[40px] uppercase">
          {t("catalog.title")}
        </h2>
        <div className="flex flex-col gap-6 lg:flex-row">
          <FilterSideBar selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />

          <div className="flex-1 min-w-0 flex flex-col gap-6">
            <h2 className="flex w-full items-center justify-center text-2xl leading-[29px] uppercase text-[#040404] lg:hidden">
              {t("catalog.title")}
            </h2>
            <ProductsGrid selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Catalog() {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div>{t("catalog.loading")}</div>}>
      <CatalogContent />
    </Suspense>
  );
}
