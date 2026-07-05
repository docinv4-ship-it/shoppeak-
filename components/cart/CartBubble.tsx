"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useShopStore } from "@/store/useShopStore";

export default function CartBubble() {
  const cart = useShopStore((state) => state.cart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((acc, item) => acc + parseFloat(item.sale_price) * (item.quantity || 1), 0);

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <Link href="/cart">
        <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 text-black px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3.5 font-black border border-white/10 hover:scale-105 transition-all duration-300 backdrop-blur-md">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5.5 w-5.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-2.5 -right-2.5 bg-black text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-amber-500 animate-pulse">
              {totalItems}
            </span>
          </div>
          <div className="flex flex-col items-start leading-none tracking-tight">
            <span className="text-[9px] font-black uppercase text-black/60 tracking-wider">Cart</span>
            <span className="text-sm font-black mt-0.5">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
