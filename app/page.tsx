import { Suspense } from "react";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import ProductGrid from "@/components/ProductGrid";
import CategoryCard from "@/components/CategoryCard";
import { CATEGORIES } from "@/data/categories";
import { getHotProducts, searchProducts } from "@/lib/aliexpress";

async function FeaturedProducts() {
  const result = await getHotProducts(undefined, { pageSize: 20 });
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-orange-500 w-1 h-5 rounded inline-block"></span>
          Hot Products
        </h2>
        <Link href="/browse" className="text-orange-500 text-sm hover:underline">View all →</Link>
      </div>
      <ProductGrid products={result.products} cols={5} />
    </section>
  );
}

async function HomeSection({ 
  title, 
  keywords, 
  categoryId, 
  href, 
  accentColor, 
  icon 
}: { 
  title: string; 
  keywords: string; 
  categoryId: string; 
  href: string; 
  accentColor: string; 
  icon: string 
}) {
  const result = await searchProducts(keywords, { pageSize: 20, categoryId });
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className={`${accentColor} w-1 h-5 rounded inline-block`}></span>
          {icon} {title}
        </h2>
        <Link href={href} className="text-orange-500 text-sm hover:underline">View all →</Link>
      </div>
      <ProductGrid products={result.products} cols={5} />
    </section>
  );
}

async function DealsSection() {
  // CRITICAL FIX: Removed broken sort query parameter to ensure full 20 real deals fetch correctly from AliExpress
  const result = await searchProducts("clearance super sale discount", { pageSize: 20 });
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-red-500 w-1 h-5 rounded inline-block"></span>
          🔥 Flash Deals
        </h2>
        <Link href="/deals" className="text-orange-500 text-sm hover:underline">See all deals →</Link>
      </div>
      <ProductGrid products={result.products} cols={5} />
    </section>
  );
}

async function PhoneSection() {
  const result = await searchProducts("smartphone android 5G", { pageSize: 20, categoryId: "509" });
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-blue-500 w-1 h-5 rounded inline-block"></span>
          📱 Top Smartphones
        </h2>
        <Link href="/categories/phones-smartphones" className="text-orange-500 text-sm hover:underline">View all phones →</Link>
      </div>
      <ProductGrid products={result.products} cols={5} />
    </section>
  );
}

async function ElectronicsSection() {
  const result = await searchProducts("electronics gadgets", { pageSize: 20, categoryId: "44" });
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-purple-500 w-1 h-5 rounded inline-block"></span>
          🔌 Electronics
        </h2>
        <Link href="/categories/consumer-electronics" className="text-orange-500 text-sm hover:underline">View all →</Link>
      </div>
      <ProductGrid products={result.products} cols={5} />
    </section>
  );
}

async function JewelrySection() {
  const result = await searchProducts("jewelry watch ring necklace", { pageSize: 20, categoryId: "200003655" });
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-yellow-500 w-1 h-5 rounded inline-block"></span>
          💎 Jewelry & Watches
        </h2>
        <Link href="/categories/jewelry-watches" className="text-orange-500 text-sm hover:underline">View all →</Link>
      </div>
      <ProductGrid products={result.products} cols={5} />
    </section>
  );
}

function LoadingSection({ title }: { title: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <ProductGrid products={[]} cols={5} loading={true} />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <HeroBanner />
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Shop by Category</h2>
          <Link href="/categories" className="text-orange-500 text-sm hover:underline">All categories →</Link>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} variant="grid" />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <Link href="/deals" className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl hover:opacity-90 transition-opacity">
          <div className="text-2xl mb-1">🔥</div>
          <div className="font-bold">Flash Deals</div>
          <div className="text-xs text-orange-100">Up to 80% OFF today only</div>
        </Link>
        <Link href="/categories/phones-smartphones" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl hover:opacity-90 transition-opacity">
          <div className="text-2xl mb-1">📱</div>
          <div className="font-bold">Smartphones</div>
          <div className="text-xs text-blue-100">Budget to Flagship — All models</div>
        </Link>
        <Link href="/categories/jewelry-watches" className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-4 rounded-xl hover:opacity-90 transition-opacity">
          <div className="text-2xl mb-1">💎</div>
          <div className="font-bold">Jewelry & Watches</div>
          <div className="text-xs text-yellow-100">Luxury looks, affordable prices</div>
        </Link>
      </div>

      <Suspense fallback={<LoadingSection title="🔥 Hot Products" />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<LoadingSection title="⚡ Flash Deals" />}>
        <DealsSection />
      </Suspense>
      <Suspense fallback={<LoadingSection title="📱 Top Smartphones" />}>
        <PhoneSection />
      </Suspense>
      <Suspense fallback={<LoadingSection title="🔌 Electronics" />}>
        <ElectronicsSection />
      </Suspense>
      <Suspense fallback={<LoadingSection title="💎 Jewelry & Watches" />}>
        <JewelrySection />
      </Suspense>

      {/* FIXED DYNAMIC CATEGORIES VIA ACCURATE ROOT PARAMETERS */}
      <Suspense fallback={<LoadingSection title="🛋️ Home Furniture" />}>
        <HomeSection title="Home Furniture & Decor" keywords="sofa furniture" categoryId="1503" href="/categories/home-furniture" accentColor="bg-orange-400" icon="🛋️" />
      </Suspense>
      <Suspense fallback={<LoadingSection title="🏠 Home Appliances" />}>
        <HomeSection title="Home Appliances" keywords="appliances smart home" categoryId="6" href="/categories/home-appliances" accentColor="bg-cyan-500" icon="🏠" />
      </Suspense>
      <Suspense fallback={<LoadingSection title="👗 Fashion & Style" />}>
        <HomeSection title="Fashion & Style" keywords="clothing fashion" categoryId="200003727" href="/categories/fashion-wearables" accentColor="bg-pink-500" icon="👗" />
      </Suspense>
      <Suspense fallback={<LoadingSection title="🏕️ Outdoor & Sports" />}>
        <HomeSection title="Outdoor & Sports" keywords="sports fitness outdoor" categoryId="18" href="/categories/outdoor-recreational" accentColor="bg-green-500" icon="🏕️" />
      </Suspense>
      <Suspense fallback={<LoadingSection title="⚙️ Industrial & Machinery" />}>
        <HomeSection title="Industrial & Machinery" keywords="tools machine" categoryId="100005706" href="/categories/machinery-industrial" accentColor="bg-gray-600" icon="⚙️" />
      </Suspense>

      <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-gray-500 text-center mt-4">
        ShopPeak is an affiliate marketplace. We earn commissions from purchases made through our links.{" "}
        <Link href="/affiliate-disclosure" className="text-orange-500 hover:underline">Learn more</Link>
      </div>
    </div>
  );
}
