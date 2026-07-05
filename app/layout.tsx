import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartBubble from "@/components/cart/CartBubble"; // Dynamic Floating Cart Hub

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopPeak — Millions of Products at Unbeatable Prices",
  description: "Discover phones, electronics, jewelry, home decor, fashion and more. ShopPeak is your AliExpress affiliate marketplace with millions of products and exclusive deals.",
  keywords: "shopping, deals, aliexpress, electronics, phones, jewelry, fashion, home decor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased selection:bg-amber-500/30 selection:text-amber-200">
      <body className={`${inter.className} min-h-full flex flex-col bg-black text-white`}>
        {/* Top Sticky & Responsive Navigation Panel */}
        <Header />
        
        {/* Primary Page Layout Streams */}
        <main className="flex-1 w-full relative z-10">
          {children}
        </main>
        
        {/* Global Floating High-Conversion Indicator Panel */}
        <CartBubble />
        
        {/* Footnotes & Marketplace Disclaimers */}
        <Footer />
      </body>
    </html>
  );
}
