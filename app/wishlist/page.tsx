"use client";

import React, { useEffect, useState } from "react";
import { useShopStore } from "@/store/useShopStore";

export default function WishlistPage() {
  const { wishlistBoards, removeFromBoard, addToCart } = useShopStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Flattening mechanism: direct collections arrays match mapping perfectly
  // Bina kisi card collections ya configuration screen ke direct products access kar raha hai
  const allSavedProducts = wishlistBoards.flatMap((board) => 
    board.products.map(product => ({ ...product, boardSlug: board.slug }))
  );

  // Elite bulk pipeline action to shift items straight into operation cart
  const handleMoveAllToCart = () => {
    if (allSavedProducts.length === 0) return;
    allSavedProducts.forEach((product) => {
      addToCart({
        product_id: product.product_id,
        product_title: product.product_title,
        product_main_image_url: product.product_main_image_url,
        sale_price: product.sale_price,
        original_price: product.original_price,
        promotion_link: product.promotion_link,
        discount: product.discount
      });
      removeFromBoard(product.boardSlug, product.product_id);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Dynamic Minimalist Title & Action Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-neutral-200 pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              Saved Items
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              {allSavedProducts.length === 0 ? "No active items curated" : `${allSavedProducts.length} Premium essentials monitored`}
            </p>
          </div>

          {allSavedProducts.length > 0 && (
            <button
              onClick={handleMoveAllToCart}
              className="py-2 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs md:text-sm transition-colors duration-150 shadow-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Move All to Cart
            </button>
          )}
        </div>

        {/* Straight Horizontal/Grid Streamlining - Pure Premium UI Listing without Card Blocks */}
        {allSavedProducts.length === 0 ? (
          <div className="text-center py-24 bg-white border border-neutral-200 rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-neutral-400 text-sm font-medium">Your saved items collection is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allSavedProducts.map((product) => (
              <div 
                key={`${product.boardSlug}-${product.product_id}`} 
                className="bg-white border border-neutral-200 rounded-xl p-4 flex gap-4 relative group hover:border-neutral-300 transition-all duration-200 shadow-sm"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 h-20 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100 flex-shrink-0">
                  <img
                    src={product.product_main_image_url}
                    alt={product.product_title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info and Actions Area */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-semibold text-neutral-800 line-clamp-1 leading-snug group-hover:text-orange-500 transition-colors">
                        {product.product_title}
                      </h3>
                      <button
                        onClick={() => removeFromBoard(product.boardSlug, product.product_id)}
                        className="text-neutral-300 hover:text-red-500 p-0.5 rounded transition-colors flex-shrink-0"
                        title="Remove product"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-base font-bold text-neutral-900">${product.sale_price}</span>
                      {product.original_price && (
                        <span className="text-xs text-neutral-400 line-through">${product.original_price}</span>
                      )}
                      {product.discount && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-100">
                          {product.discount} OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Operational Deal Redirection Route */}
                  <div className="mt-2 pt-2 border-t border-neutral-50 flex items-center justify-between">
                    <span className="text-[11px] text-orange-600 font-medium tracking-tight bg-orange-50/50 px-2 py-0.5 rounded">
                      ⚡ Active Deal
                    </span>
                    <a
                      href={product.promotion_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-neutral-600 hover:text-orange-500 flex items-center gap-1 transition-colors"
                    >
                      View Deal
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      </svg>
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
