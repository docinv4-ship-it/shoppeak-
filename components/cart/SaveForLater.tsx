"use client";

import React, { useEffect, useState } from "react";
import { useShopStore } from "@/store/useShopStore";

export default function SaveForLater() {
  const { saveForLater, moveToCartFromLater, removeFromLater } = useShopStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || saveForLater.length === 0) return null;

  return (
    <div className="mt-12 border-t border-neutral-800 pt-8 animate-fadeIn">
      <div className="flex items-center gap-2.5 mb-6">
        <h2 className="text-xl font-extrabold tracking-tight">Saved For Later</h2>
        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
          {saveForLater.length} Items
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {saveForLater.map((item) => (
          <div 
            key={item.product_id} 
            className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between p-4 group hover:border-neutral-700/60 transition-all duration-300"
          >
            <div className="flex gap-4">
              <div className="relative w-20 h-20 bg-neutral-950 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={item.product_main_image_url} 
                  alt={item.product_title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-neutral-300 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                    {item.product_title}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-base font-black text-white">${item.sale_price}</span>
                    {item.original_price && (
                      <span className="text-[10px] text-neutral-500 line-through">${item.original_price}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 border-t border-neutral-800/60 pt-3">
              <button
                onClick={() => removeFromLater(item.product_id)}
                className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => moveToCartFromLater(item.product_id)}
                className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs transition-colors border border-neutral-700/50 flex items-center justify-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
