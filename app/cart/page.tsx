"use client";

import React, { useEffect, useState } from "react";
import { useShopStore } from "@/store/useShopStore";
import SaveForLater from "@/components/cart/SaveForLater";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, moveToSaveForLater, getGroupedAffiliateUrl } = useShopStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((acc, item) => acc + parseFloat(item.sale_price) * (item.quantity || 1), 0);
  const affiliateCheckoutUrl = getGroupedAffiliateUrl();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-6 md:p-12 animate-fadeIn font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-neutral-900 border-b border-neutral-200 pb-4">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-200 rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-neutral-400 text-sm font-medium">Your active cart is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item) => (
                <div 
                  key={item.product_id} 
                  className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200 hover:border-neutral-300 shadow-sm"
                >
                  <div className="flex gap-4 items-center w-full sm:w-auto">
                    <img 
                      src={item.product_main_image_url} 
                      alt={item.product_title} 
                      className="w-16 h-16 object-cover rounded-lg bg-neutral-100 flex-shrink-0 border border-neutral-100"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-neutral-800 line-clamp-1 leading-snug hover:text-orange-600 transition-colors">
                        {item.product_title}
                      </h3>
                      <div className="flex gap-4 items-center mt-1.5">
                        <span className="text-base font-bold text-neutral-900">${item.sale_price}</span>
                        <button
                          onClick={() => moveToSaveForLater(item.product_id)}
                          className="text-xs font-medium text-neutral-400 hover:text-orange-500 transition-colors"
                        >
                          Save For Later
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls & Delete Action */}
                  <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end w-full sm:w-auto gap-4 sm:gap-2 border-t sm:border-t-0 border-neutral-100 pt-3 sm:pt-0">
                    <div className="flex items-center bg-neutral-50 rounded-lg border border-neutral-200 p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product_id, (item.quantity || 1) - 1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-neutral-800">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, (item.quantity || 1) + 1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-xs font-medium text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Checkout Container */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5 shadow-sm">
              <h2 className="text-base font-bold text-neutral-900 tracking-tight border-b border-neutral-100 pb-3">Order Summary</h2>

              <div className="space-y-2.5 text-sm font-medium text-neutral-500">
                <div className="flex justify-between">
                  <span>Items Count</span>
                  <span className="text-neutral-900 font-semibold">{totalItems}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-3 text-base text-neutral-800 font-bold">
                  <span>Subtotal</span>
                  <span className="text-orange-600 font-bold text-lg">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <a
                  href={affiliateCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm"
                >
                  Proceed to Secure Checkout
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
                <p className="text-[11px] text-neutral-400 font-normal text-center leading-normal">
                  Prices and logistics fulfillment are secure and absolute across global suppliers.
                </p>
              </div>
            </div>

          </div>
        )}

        <div className="mt-12">
          <SaveForLater />
        </div>
      </div>
    </div>
  );
}
