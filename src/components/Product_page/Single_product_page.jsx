"use client";
import Image from "next/image";
import { useState } from "react";

const images = ["/images/monopoly1.jpg", "/images/monopoly2.jpg", "/images/monopoly3.jpg"];

export default function ProductPage() {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div>
        <div className="relative w-full h-96 border rounded-2xl overflow-hidden">
          <Image src={images[selectedImage]} alt="Monopoly" fill className="object-cover" />
        </div>
        <div className="flex mt-4 space-x-2">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`w-20 h-16 border rounded-lg overflow-hidden cursor-pointer ${
                selectedImage === i ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <Image src={img} alt={`Thumbnail ${i}`} width={80} height={64} />
            </div>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">MONOPOLY</h2>
        <p className="text-xl text-red-600 font-semibold">
          $34.99 <span className="line-through text-gray-400">$49.99</span>
        </p>
        <p className="text-sm text-red-500">• Very low stock</p>

        <div className="flex items-center space-x-4">
          <div className="flex items-center border px-2 rounded">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
            <span className="px-4">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <button className="px-4 py-2 border rounded-lg">ADD TO WISHLIST</button>
        </div>

        <button className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl text-lg font-semibold">
          BUY
        </button>

        {/* Accordions */}
        <Accordion title="DESCRIPTION">
          <p>Monopoly is a classic board game where players compete to own property...</p>
        </Accordion>

        <Accordion title="GAME INFORMATION">
          <ul className="list-disc list-inside space-y-1">
            <li>Designer – Adam Walker</li>
            <li>Publisher – UNVERS</li>
            <li>Players – 5</li>
            <li>Playing Time – 30 Min</li>
            <li>Suggested Age – 12+</li>
          </ul>
        </Accordion>

        <Accordion title="DELIVERY AND PAYMENT">
          <p>We ship all over Ukraine:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Nova Poshta – 1-3 business days</li>
            <li>Ukrposhta – 2-5 business days</li>
            <li>Courier delivery – Same-day delivery in Kyiv & major cities</li>
          </ul>
        </Accordion>
      </div>
    </div>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full text-left font-semibold py-2 text-gray-700 border-b">
        {title} {open ? "▲" : "▼"}
      </button>
      {open && <div className="mt-2 text-sm text-gray-600">{children}</div>}
    </div>
  );
}
