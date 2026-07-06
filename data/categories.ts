import { getCategoryKeywords, getSubcategoryKeywords } from "./category-keywords";

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  keywords: string[];
  color: string;
  subcategories: { name: string; keywords: string[]; slug: string }[];
}

interface RawCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  subcategories: { name: string; slug: string }[];
}

const RAW_CATEGORIES: RawCategory[] = [
  {
    id: "509",
    slug: "phones-smartphones",
    name: "Phones & Smartphones",
    icon: "📱",
    description: "Budget phones, flagship killers, gaming phones, rugged phones, and more",
    color: "bg-blue-500",
    subcategories: [
      { name: "Budget Phones", slug: "budget-phones" },
      { name: "Mid-Range", slug: "mid-range-smartphones" },
      { name: "Gaming Phones", slug: "gaming-phones" },
      { name: "Rugged Phones", slug: "rugged-phones" },
      { name: "Foldable & Flip", slug: "foldable-phones" },
      { name: "Tablets", slug: "tablet-combos" },
      { name: "5G Phones", slug: "5g-phones" },
      { name: "iPhone Style", slug: "iphone-clones" },
    ],
  },
  {
    id: "200003655",
    slug: "jewelry-watches",
    name: "Jewelry & Watches",
    icon: "💎",
    description: "Luxury watches, rings, necklaces, bracelets, moissanite and fine jewelry",
    color: "bg-yellow-500",
    subcategories: [
      { name: "Luxury Watches", slug: "luxury-watches" },
      { name: "Diamond Rings", slug: "rings" },
      { name: "Necklaces", slug: "necklaces" },
      { name: "Bracelets", slug: "bracelets" },
      { name: "Earrings", slug: "earrings" },
      { name: "Smart Watches", slug: "smart-watches" },
      { name: "Jewelry Sets", slug: "jewelry-sets" },
      { name: "Custom Jewelry", slug: "custom-jewelry" },
    ],
  },
  {
    id: "1503",
    slug: "home-furniture",
    name: "Home Furniture",
    icon: "🛋️",
    description: "Luxury sofas, beds, dining sets, wardrobes, and premium home decor",
    color: "bg-orange-400",
    subcategories: [
      { name: "Sofas & Sectionals", slug: "automated-sofas" },
      { name: "Beds & Frames", slug: "beds" },
      { name: "Dining Sets", slug: "dining" },
      { name: "Wardrobes", slug: "wardrobes" },
      { name: "Coffee Tables", slug: "coffee-tables" },
      { name: "Recliners", slug: "recliners" },
      { name: "Home Decor", slug: "luxury-decor" },
      { name: "Wall Art", slug: "wall-art" },
    ],
  },
  {
    id: "1972639",
    slug: "lighting-chandeliers",
    name: "Lighting & Chandeliers",
    icon: "💡",
    description: "Crystal chandeliers, LED lighting, smart lights, and luxury fixtures",
    color: "bg-amber-400",
    subcategories: [
      { name: "Crystal Chandeliers", slug: "crystal-chandeliers" },
      { name: "Modern LED", slug: "modern-led" },
      { name: "LED Strips", slug: "led-strips" },
      { name: "Floor Lamps", slug: "floor-lamps" },
      { name: "Wall Sconces", slug: "wall-sconces" },
      { name: "Smart Lighting", slug: "smart-lighting" },
    ],
  },
  {
    id: "6000006",
    slug: "home-appliances",
    name: "Home Appliances",
    icon: "🏠",
    description: "Kitchen appliances, washing machines, air conditioners, and smart home gadgets",
    color: "bg-cyan-500",
    subcategories: [
      { name: "Air Fryers", slug: "air-fryers" },
      { name: "Coffee Machines", slug: "coffee-machines" },
      { name: "Robot Vacuums", slug: "robot-vacuums" },
      { name: "Air Purifiers", slug: "air-purifiers" },
      { name: "Washing Machines", slug: "washing-machines" },
      { name: "Blenders & Juicers", slug: "blenders" },
      { name: "Mini Fridges", slug: "refrigerators" },
      { name: "Ice Makers", slug: "ice-makers" },
    ],
  },
  {
    id: "44",
    slug: "consumer-electronics",
    name: "Consumer Electronics",
    icon: "🔌",
    description: "Laptops, TVs, gaming, cameras, audio, VR, and tech accessories",
    color: "bg-purple-500",
    subcategories: [
      { name: "Laptops", slug: "laptops" },
      { name: "Smart TVs", slug: "televisions" },
      { name: "Wireless Earbuds", slug: "earbuds" },
      { name: "Headphones", slug: "headphones" },
      { name: "Gaming Accessories", slug: "gaming-accessories" },
      { name: "Cameras", slug: "cameras" },
      { name: "Drones", slug: "drones" },
      { name: "VR & AR", slug: "vr-ar" },
      { name: "Smart Home", slug: "smart-home" },
      { name: "Projectors", slug: "projectors" },
    ],
  },
  {
    id: "34",
    slug: "automotive",
    name: "Vehicles & Automotive",
    icon: "🚗",
    description: "Car accessories, electric bikes, scooters, tools, and vehicle upgrades",
    color: "bg-red-500",
    subcategories: [
      { name: "Electric Bikes", slug: "electric-bikes" },
      { name: "Electric Scooters", slug: "electric-scooters" },
      { name: "Car Electronics", slug: "car-electronics" },
      { name: "Car Accessories", slug: "car-accessories" },
      { name: "Car Tools", slug: "car-tools" },
      { name: "Go-Karts & ATVs", slug: "go-karts" },
    ],
  },
  {
    id: "100005706",
    slug: "machinery-industrial",
    name: "Machinery & Industrial",
    icon: "⚙️",
    description: "Laser cutters, CNC machines, 3D printers, welding tools, and industrial equipment",
    color: "bg-gray-600",
    subcategories: [
      { name: "Laser Engravers", slug: "laser-engravers" },
      { name: "CNC Machines", slug: "cnc-machines" },
      { name: "3D Printers", slug: "3d-printers" },
      { name: "Welding Machines", slug: "welding" },
      { name: "Power Tools", slug: "power-tools" },
      { name: "Hydraulic Equipment", slug: "hydraulic" },
      { name: "Food Machines", slug: "food-machines" },
    ],
  },
  {
    id: "6000000560",
    slug: "outdoor-recreational",
    name: "Outdoor & Sports",
    icon: "🏕️",
    description: "Camping, fitness equipment, telescopes, inflatable parks, and outdoor adventures",
    color: "bg-green-500",
    subcategories: [
      { name: "Camping & Survival", slug: "camping" },
      { name: "Fitness Equipment", slug: "fitness" },
      { name: "Cycling", slug: "cycling" },
      { name: "Water Sports", slug: "water-sports" },
      { name: "Telescopes", slug: "telescopes" },
      { name: "Trampolines", slug: "trampolines" },
      { name: "Gardening", slug: "gardening" },
    ],
  },
  {
    id: "200003727",
    slug: "fashion-wearables",
    name: "Fashion & Style",
    icon: "👗",
    description: "Clothing, luxury bags, shoes, accessories, fur coats, and designer fashion",
    color: "bg-pink-500",
    subcategories: [
      { name: "Women's Clothing", slug: "womens-clothing" },
      { name: "Men's Clothing", slug: "mens-clothing" },
      { name: "Luxury Bags", slug: "luxury-bags" },
      { name: "Shoes & Sneakers", slug: "shoes" },
      { name: "Sunglasses", slug: "sunglasses" },
      { name: "Fur Coats", slug: "fur-coats" },
      { name: "Wedding Dresses", slug: "wedding-dresses" },
    ],
  },
  {
    id: "7000008",
    slug: "health-beauty",
    name: "Health & Beauty",
    icon: "💄",
    description: "Beauty devices, skincare, hair removal, massage chairs, and wellness products",
    color: "bg-rose-400",
    subcategories: [
      { name: "Laser Hair Removal", slug: "laser-hair-removal" },
      { name: "Massage Chairs", slug: "massage-chairs" },
      { name: "Skincare Devices", slug: "skincare-devices" },
      { name: "Hair Styling", slug: "hair-styling" },
      { name: "Electric Toothbrush", slug: "electric-toothbrush" },
    ],
  },
  {
    id: "5090300",
    slug: "solar-energy",
    name: "Solar & Energy",
    icon: "☀️",
    description: "Solar panels, inverters, generators, power banks, and renewable energy systems",
    color: "bg-yellow-400",
    subcategories: [
      { name: "Solar Panels", slug: "solar-panels" },
      { name: "Power Stations", slug: "power-stations" },
      { name: "Generators", slug: "generators" },
      { name: "Inverters", slug: "inverters" },
    ],
  },
  {
    id: "100003070",
    slug: "security-systems",
    name: "Security & CCTV",
    icon: "🔒",
    description: "Security cameras, CCTV systems, smart locks, safes, and surveillance equipment",
    color: "bg-gray-500",
    subcategories: [
      { name: "CCTV Systems", slug: "cctv" },
      { name: "Smart Locks", slug: "smart-locks" },
      { name: "Safes", slug: "safes" },
      { name: "Video Doorbells", slug: "doorbells" },
    ],
  },
  {
    id: "200003772",
    slug: "luxury-high-value",
    name: "Luxury & High-Value",
    icon: "👑",
    description: "Grand pianos, bronze statues, billiard tables, saunas, and premium lifestyle",
    color: "bg-amber-600",
    subcategories: [
      { name: "Piano & Keyboards", slug: "pianos" },
      { name: "Billiard Tables", slug: "billiard-tables" },
      { name: "Saunas & Steam", slug: "saunas" },
      { name: "Wine Cabinets", slug: "wine-cabinets" },
      { name: "Bronze Statues", slug: "bronze-statues" },
      { name: "Game Rooms", slug: "game-rooms" },
    ],
  },
  {
    id: "2204",
    slug: "professional-audio",
    name: "Professional Audio",
    icon: "🎵",
    description: "PA systems, studio monitors, DJ equipment, microphones, and professional audio",
    color: "bg-indigo-500",
    subcategories: [
      { name: "PA Systems", slug: "pa-systems" },
      { name: "Studio Equipment", slug: "studio" },
      { name: "DJ Equipment", slug: "dj-equipment" },
      { name: "LED Video Walls", slug: "led-walls" },
    ],
  },
  {
    id: "1511",
    slug: "medical-mobility",
    name: "Medical & Mobility",
    icon: "♿",
    description: "Electric wheelchairs, medical devices, mobility scooters, and health equipment",
    color: "bg-teal-500",
    subcategories: [
      { name: "Electric Wheelchairs", slug: "wheelchairs" },
      { name: "Mobility Scooters", slug: "mobility-scooters" },
      { name: "Medical Devices", slug: "medical-devices" },
      { name: "Elderly Fitness", slug: "elderly-fitness" },
    ],
  },
];

export const CATEGORIES: Category[] = RAW_CATEGORIES.map((cat) => ({
  ...cat,
  keywords: getCategoryKeywords(cat.slug, cat.name),
  subcategories: cat.subcategories.map((sub) => ({
    ...sub,
    keywords: getSubcategoryKeywords(cat.slug, sub.slug, sub.name),
  })),
}));

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategoryBySlug(catSlug: string, subSlug: string) {
  const cat = getCategoryBySlug(catSlug);
  return cat?.subcategories.find((s) => s.slug === subSlug);
}