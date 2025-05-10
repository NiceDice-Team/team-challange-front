"use client";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProductsGrid from "@/components/catalog/ProductsGrid";
import { useState } from "react";

export default function Catalog() {
  return (
    <div className="py-6 min-h-screen">
      <div className="px-8 lg:px-50">
        <Navbar />
      </div>
      <ProductsGrid />
      <Footer />
    </div>
  );
}
