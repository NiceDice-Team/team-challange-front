"use client";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProductsGrid from "@/components/catalog/ProductsGrid";
import { useState } from "react";
import FilterSideBar from "@/components/catalog/FilterSideBar";

export default function Catalog() {
  return (
    <div className="py-6 min-h-screen">
      <div className="px-8 lg:px-50">
        <Navbar />
      </div>
      <div className="flex flex-row justify-center gap-10">
        <FilterSideBar className="" />
        <ProductsGrid className="flex-1" />
      </div>

      <Footer />
    </div>
  );
}
