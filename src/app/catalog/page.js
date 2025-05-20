"use client";
import Footer from "../../components/layout/Footer.jsx";
import Navbar from "../../components/layout/Navbar.jsx";
import ProductsGrid from "../../components/catalog/ProductsGrid.jsx";
import { useState } from "react";
import FilterSideBar from "../../components/catalog/FilterSideBar.jsx";

export default function Catalog() {
  return (
    <div className="py-6 min-h-screen ">
      <div className="px-8 lg:px-50">
        <Navbar />
      </div>
      <div className="flex flex-row justify-center gap-10 mt-10">
        <FilterSideBar />
        <ProductsGrid className="flex-1 " />
      </div>

      <Footer />
    </div>
  );
}
