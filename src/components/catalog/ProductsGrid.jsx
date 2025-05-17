"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { productServices } from "../../services/productServices";

export default function ProductsGrid() {
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productServices.getProducts,
  });

  return (
    <section className="">
      <div className="grid grid-cols-4 grid-rows-4 gap-4">
        {productsLoading && <div>Loading products...</div>}
        {productsError && <div>Error loading products</div>}
        {products &&
          products.map((product) => (
            <div className="max-w-56" key={product.id}>
              <h3>{product.title}</h3>
              <p>{product.category}</p>
              <img src={product.images[0].url} alt={product.title} />
              <div>
                <p>{product.description}</p>
                <span>${product.price}</span>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
