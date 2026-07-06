export interface Subcategory {
  name: string;
  keywords: string[];
  slug: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  keywords: string[];
  color: string;
  subcategories: Subcategory[];
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))];
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_/]+/g, " ")
    .replace(/\s*&\s*/g, " and ")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const CATEGORIES: Category[] = [
  {
    id: "509",
    slug: "phones-smartphones",
    name: "Phones & Smartphones",
    icon: "📱",
    description: "Budget phones, flagship killers, gaming phones, rugged phones, tablets, and 5G mobiles",
    keywords: [
      "smartphone",
      "mobile phone",
      "android phone",
      "5g phone",
      "flagship phone",
      "gaming phone",
      "rugged phone",
      "foldable phone",
      "flip phone",
      "budget phone",
      "camera phone",
      "dual sim phone",
      "phone unlocked",
      "tablet pc",
      "android tablet",
      "cell phone",
      "mobile device",
      "smart device",
      "phone accessories",
    ],
    color: "bg-blue-500",
    subcategories: [
      { name: "Budget Phones", keywords: ["budget smartphone", "cheap android phone", "entry level mobile phone"], slug: "budget-phones" },
      { name: "Mid-Range", keywords: ["redmi note phone", "poco phone", "mid range smartphone"], slug: "mid-range-smartphones" },
      { name: "Gaming Phones", keywords: ["gaming smartphone", "redmagic phone", "rog phone", "performance phone"], slug: "gaming-phones" },
      { name: "Rugged Phones", keywords: ["rugged waterproof phone", "ulefone phone", "oukitel phone", "survival phone"], slug: "rugged-phones" },
      { name: "Foldable & Flip", keywords: ["foldable phone", "flip smartphone", "folding mobile"], slug: "foldable-phones" },
      { name: "Tablets", keywords: ["android tablet", "tablet pc", "ipad style tablet", "10 inch tablet"], slug: "tablet-combos" },
      { name: "5G Phones", keywords: ["5g smartphone", "5g mobile phone", "high speed cellular phone"], slug: "5g-phones" },
      { name: "iPhone Style", keywords: ["iphone style phone", "dynamic island phone", "luxury phone"], slug: "iphone-clones" },
    ],
  },
  {
    id: "200003655",
    slug: "jewelry-watches",
    name: "Jewelry & Watches",
    icon: "💎",
    description: "Luxury watches, rings, necklaces, bracelets, moissanite, and fine jewelry",
    keywords: [
      "jewelry",
      "watch",
      "luxury watch",
      "diamond ring",
      "necklace",
      "bracelet",
      "earrings",
      "moissanite",
      "silver jewelry",
      "gold jewelry",
      "fashion jewelry",
      "wrist watch",
      "automatic watch",
      "mechanical watch",
      "smart watch",
      "men watch",
      "women watch",
      "bridal jewelry",
    ],
    color: "bg-yellow-500",
    subcategories: [
      { name: "Luxury Watches", keywords: ["luxury automatic watch", "mechanical watch men", "premium wrist watch"], slug: "luxury-watches" },
      { name: "Diamond Rings", keywords: ["moissanite ring", "diamond ring", "925 silver ring"], slug: "rings" },
      { name: "Necklaces", keywords: ["pendant necklace", "women necklace", "fashion pendant jewelry"], slug: "necklaces" },
      { name: "Bracelets", keywords: ["bangle bracelet", "luxury bracelet", "women bracelet"], slug: "bracelets" },
      { name: "Earrings", keywords: ["drop earrings", "stud earrings", "fashion earrings"], slug: "earrings" },
      { name: "Smart Watches", keywords: ["smartwatch", "fitness tracker watch", "sport watch"], slug: "smart-watches" },
      { name: "Jewelry Sets", keywords: ["gold plated jewelry set", "bridal jewelry set", "women jewelry set"], slug: "jewelry-sets" },
      { name: "Custom Jewelry", keywords: ["custom jewelry", "personalized name necklace", "engraved jewelry"], slug: "custom-jewelry" },
    ],
  },
  {
    id: "1503",
    slug: "home-furniture",
    name: "Home Furniture",
    icon: "🛋️",
    description: "Luxury sofas, beds, tables, wardrobes, chairs, and premium home decor",
    keywords: [
      "furniture",
      "home furniture",
      "sofa",
      "sectional sofa",
      "bed frame",
      "dining table",
      "wardrobe",
      "coffee table",
      "recliner",
      "bookshelf",
      "cabinet",
      "desk",
      "chair",
      "living room furniture",
      "bedroom furniture",
      "office furniture",
      "home decor",
      "wall art",
      "storage furniture",
    ],
    color: "bg-orange-400",
    subcategories: [
      { name: "Sofas & Sectionals", keywords: ["luxury sofa", "sectional sofa", "living room couch"], slug: "automated-sofas" },
      { name: "Beds & Frames", keywords: ["bed frame", "luxury bed", "bedroom furniture"], slug: "beds" },
      { name: "Dining Sets", keywords: ["dining table set", "kitchen table chairs", "dining room furniture"], slug: "dining" },
      { name: "Wardrobes", keywords: ["wardrobe cabinet", "closet furniture", "bedroom closet"], slug: "wardrobes" },
      { name: "Coffee Tables", keywords: ["coffee table", "modern side table", "living room table"], slug: "coffee-tables" },
      { name: "Recliners", keywords: ["recliner chair", "armchair", "sofa chair"], slug: "recliners" },
      { name: "Home Decor", keywords: ["home decor", "room decoration", "aesthetic decor"], slug: "luxury-decor" },
      { name: "Wall Art", keywords: ["wall art", "canvas painting", "large frame art"], slug: "wall-art" },
    ],
  },
  {
    id: "1972639",
    slug: "lighting-chandeliers",
    name: "Lighting & Chandeliers",
    icon: "💡",
    description: "Crystal chandeliers, LED lighting, smart lights, lamps, and luxury fixtures",
    keywords: [
      "lighting",
      "chandelier",
      "ceiling light",
      "led light",
      "lamp",
      "floor lamp",
      "wall light",
      "smart light",
      "strip light",
      "pendant light",
      "light bulb",
      "rgb light",
      "modern lighting",
      "decorative light",
    ],
    color: "bg-amber-400",
    subcategories: [
      { name: "Crystal Chandeliers", keywords: ["crystal chandelier", "luxury ceiling chandelier", "gold chandelier"], slug: "crystal-chandeliers" },
      { name: "Modern LED", keywords: ["led ceiling light", "modern lamp", "minimalist lighting"], slug: "modern-led" },
      { name: "LED Strips", keywords: ["rgb led strip", "flexible led light", "ambient strip light"], slug: "led-strips" },
      { name: "Floor Lamps", keywords: ["floor lamp", "standing lamp", "nordic lamp"], slug: "floor-lamps" },
      { name: "Wall Sconces", keywords: ["wall sconce", "indoor wall light", "luxury wall lamp"], slug: "wall-sconces" },
      { name: "Smart Lighting", keywords: ["smart bulb", "tuya light", "wifi light bulb"], slug: "smart-lighting" },
    ],
  },
  {
    id: "6000006",
    slug: "home-appliances",
    name: "Home Appliances",
    icon: "🏠",
    description: "Kitchen appliances, vacuum cleaners, purifiers, fridges, and smart home machines",
    keywords: [
      "home appliance",
      "kitchen appliance",
      "air fryer",
      "coffee machine",
      "robot vacuum",
      "air purifier",
      "washing machine",
      "blender",
      "juicer",
      "mini fridge",
      "ice maker",
      "toaster",
      "microwave",
      "water dispenser",
      "electric kettle",
      "dishwasher",
      "pressure cooker",
      "stand mixer",
    ],
    color: "bg-cyan-500",
    subcategories: [
      { name: "Air Fryers", keywords: ["air fryer", "digital air fryer", "oil free cooker"], slug: "air-fryers" },
      { name: "Coffee Machines", keywords: ["espresso machine", "coffee maker", "milk frother"], slug: "coffee-machines" },
      { name: "Robot Vacuums", keywords: ["robot vacuum cleaner", "lidar vacuum", "smart vacuum"], slug: "robot-vacuums" },
      { name: "Air Purifiers", keywords: ["air purifier", "hepa air cleaner", "room purifier"], slug: "air-purifiers" },
      { name: "Washing Machines", keywords: ["mini washing machine", "portable washer", "spin dryer"], slug: "washing-machines" },
      { name: "Blenders & Juicers", keywords: ["electric blender", "juicer machine", "smoothie mixer"], slug: "blenders" },
      { name: "Mini Fridges", keywords: ["mini fridge", "portable refrigerator", "cooler fridge"], slug: "refrigerators" },
      { name: "Ice Makers", keywords: ["ice maker", "countertop ice machine", "compact ice maker"], slug: "ice-makers" },
    ],
  },
  {
    id: "44",
    slug: "consumer-electronics",
    name: "Consumer Electronics",
    icon: "🔌",
    description: "Laptops, TVs, gaming, cameras, audio, VR, projectors, and smart devices",
    keywords: [
      "consumer electronics",
      "electronics",
      "laptop",
      "gaming laptop",
      "smart tv",
      "wireless earbuds",
      "headphones",
      "gaming keyboard",
      "gaming mouse",
      "camera",
      "drone",
      "vr headset",
      "projector",
      "smart home",
      "bluetooth speaker",
      "soundbar",
      "monitor",
      "tablet",
      "tech gadget",
    ],
    color: "bg-purple-500",
    subcategories: [
      { name: "Laptops", keywords: ["gaming laptop", "intel notebook", "amd laptop"], slug: "laptops" },
      { name: "Smart TVs", keywords: ["smart tv", "4k television", "android tv"], slug: "televisions" },
      { name: "Wireless Earbuds", keywords: ["wireless earbuds", "tws earbuds", "bluetooth earphones"], slug: "earbuds" },
      { name: "Headphones", keywords: ["noise cancelling headphones", "over ear headphones", "wireless headphones"], slug: "headphones" },
      { name: "Gaming Accessories", keywords: ["gaming keyboard", "gaming mouse", "rgb gaming accessories"], slug: "gaming-accessories" },
      { name: "Cameras", keywords: ["digital camera", "4k camera", "mirrorless camera"], slug: "cameras" },
      { name: "Drones", keywords: ["camera drone", "gps drone", "professional drone"], slug: "drones" },
      { name: "VR & AR", keywords: ["vr headset", "virtual reality glasses", "ar headset"], slug: "vr-ar" },
      { name: "Smart Home", keywords: ["smart home", "tuya device", "zigbee sensor"], slug: "smart-home" },
      { name: "Projectors", keywords: ["4k projector", "home theater projector", "portable projector"], slug: "projectors" },
    ],
  },
  {
    id: "34",
    slug: "automotive",
    name: "Vehicles & Automotive",
    icon: "🚗",
    description: "Car accessories, electric bikes, scooters, tools, and vehicle upgrades",
    keywords: [
      "automotive",
      "car accessory",
      "car electronics",
      "car tool",
      "dash cam",
      "car charger",
      "car phone holder",
      "car seat cover",
      "electric bike",
      "electric scooter",
      "motorcycle accessory",
      "car led light",
      "car organizer",
      "car repair tool",
      "vehicle upgrade",
    ],
    color: "bg-red-500",
    subcategories: [
      { name: "Electric Bikes", keywords: ["electric bike", "ebike", "motor bicycle"], slug: "electric-bikes" },
      { name: "Electric Scooters", keywords: ["electric scooter", "foldable scooter", "adult e-scooter"], slug: "electric-scooters" },
      { name: "Car Electronics", keywords: ["dash cam", "rear view camera", "carplay screen"], slug: "car-electronics" },
      { name: "Car Accessories", keywords: ["car interior accessory", "car organizer", "universal car accessory"], slug: "car-accessories" },
      { name: "Car Tools", keywords: ["obd2 scanner", "car diagnostic tool", "car repair kit"], slug: "car-tools" },
      { name: "Go-Karts & ATVs", keywords: ["go kart", "atv quad bike", "offroad vehicle"], slug: "go-karts" },
    ],
  },
  {
    id: "100005706",
    slug: "machinery-industrial",
    name: "Machinery & Industrial",
    icon: "⚙️",
    description: "Laser cutters, CNC machines, 3D printers, welding tools, and industrial equipment",
    keywords: [
      "machinery",
      "industrial equipment",
      "laser engraver",
      "cnc machine",
      "3d printer",
      "welding machine",
      "power tool",
      "industrial tool",
      "workshop machine",
      "hardware machine",
      "manufacturing equipment",
      "fiber laser",
      "router machine",
    ],
    color: "bg-gray-600",
    subcategories: [
      { name: "Laser Engravers", keywords: ["laser engraver", "fiber laser", "laser cutter"], slug: "laser-engravers" },
      { name: "CNC Machines", keywords: ["cnc machine", "cnc router", "engraving machine"], slug: "cnc-machines" },
      { name: "3D Printers", keywords: ["3d printer", "resin printer", "fdm printer"], slug: "3d-printers" },
      { name: "Welding Machines", keywords: ["welding machine", "mig welder", "tig welder"], slug: "welding" },
      { name: "Power Tools", keywords: ["cordless drill", "power tool", "brushless drill"], slug: "power-tools" },
      { name: "Hydraulic Equipment", keywords: ["hydraulic press", "hydraulic pump", "industrial lifting"], slug: "hydraulic" },
      { name: "Food Machines", keywords: ["food processing machine", "commercial mixer", "restaurant equipment"], slug: "food-machines" },
    ],
  },
  {
    id: "6000000560",
    slug: "outdoor-recreational",
    name: "Outdoor & Sports",
    icon: "🏕️",
    description: "Camping, fitness equipment, telescopes, inflatable gear, and outdoor adventures",
    keywords: [
      "outdoor",
      "sports",
      "camping",
      "fitness equipment",
      "cycling",
      "water sports",
      "telescope",
      "trampoline",
      "garden tools",
      "survival gear",
      "hiking gear",
      "exercise equipment",
      "outdoor gear",
    ],
    color: "bg-green-500",
    subcategories: [
      { name: "Camping & Survival", keywords: ["camping tent", "survival gear", "waterproof camping"], slug: "camping" },
      { name: "Fitness Equipment", keywords: ["home gym", "dumbbells", "treadmill", "fitness equipment"], slug: "fitness" },
      { name: "Cycling", keywords: ["mountain bike", "road bike", "cycling accessory"], slug: "cycling" },
      { name: "Water Sports", keywords: ["inflatable boat", "paddle board", "water sports"], slug: "water-sports" },
      { name: "Telescopes", keywords: ["astronomical telescope", "binoculars", "night vision"], slug: "telescopes" },
      { name: "Trampolines", keywords: ["outdoor trampoline", "safety net trampoline"], slug: "trampolines" },
      { name: "Gardening", keywords: ["hydroponic system", "garden tool", "grow light"], slug: "gardening" },
    ],
  },
  {
    id: "200003727",
    slug: "fashion-wearables",
    name: "Fashion & Style",
    icon: "👗",
    description: "Clothing, luxury bags, shoes, accessories, coats, and designer fashion",
    keywords: [
      "fashion",
      "clothing",
      "dress",
      "sneakers",
      "handbag",
      "jacket",
      "hoodie",
      "shirt",
      "women clothing",
      "men clothing",
      "designer fashion",
      "luxury bag",
      "sunglasses",
      "winter coat",
      "wedding dress",
      "fashion accessories",
      "streetwear",
    ],
    color: "bg-pink-500",
    subcategories: [
      { name: "Women's Clothing", keywords: ["women dress", "women clothing", "designer women fashion"], slug: "womens-clothing" },
      { name: "Men's Clothing", keywords: ["men jacket", "men clothing", "men suit"], slug: "mens-clothing" },
      { name: "Luxury Bags", keywords: ["luxury handbag", "designer bag", "leather tote bag"], slug: "luxury-bags" },
      { name: "Shoes & Sneakers", keywords: ["running sneakers", "sports shoes", "fashion sneakers"], slug: "shoes" },
      { name: "Sunglasses", keywords: ["polarized sunglasses", "designer eyewear", "fashion glasses"], slug: "sunglasses" },
      { name: "Fur Coats", keywords: ["fur coat", "winter coat women", "luxury jacket"], slug: "fur-coats" },
      { name: "Wedding Dresses", keywords: ["wedding dress", "bridal gown", "luxury bridal dress"], slug: "wedding-dresses" },
    ],
  },
  {
    id: "7000008",
    slug: "health-beauty",
    name: "Health & Beauty",
    icon: "💄",
    description: "Beauty devices, skincare, hair removal, massage chairs, and wellness products",
    keywords: [
      "health",
      "beauty",
      "skincare",
      "laser hair removal",
      "massage device",
      "hair styling",
      "electric toothbrush",
      "facial massager",
      "wellness product",
      "beauty device",
      "body care",
      "face mask",
      "hair remover",
      "makeup tools",
    ],
    color: "bg-rose-400",
    subcategories: [
      { name: "Laser Hair Removal", keywords: ["ipl hair removal", "laser hair remover", "epilator"], slug: "laser-hair-removal" },
      { name: "Massage Chairs", keywords: ["massage chair", "full body massage", "zero gravity chair"], slug: "massage-chairs" },
      { name: "Skincare Devices", keywords: ["facial massager", "microcurrent device", "ultrasonic skincare"], slug: "skincare-devices" },
      { name: "Hair Styling", keywords: ["hair straightener", "hair curler", "hair dryer brush"], slug: "hair-styling" },
      { name: "Electric Toothbrush", keywords: ["electric toothbrush", "sonic toothbrush", "smart toothbrush"], slug: "electric-toothbrush" },
    ],
  },
  {
    id: "5090300",
    slug: "solar-energy",
    name: "Solar & Energy",
    icon: "☀️",
    description: "Solar panels, inverters, generators, power stations, and renewable energy systems",
    keywords: [
      "solar",
      "solar panel",
      "solar energy",
      "inverter",
      "power station",
      "generator",
      "battery",
      "lithium battery",
      "solar charger",
      "energy storage",
      "solar kit",
      "portable power",
      "backup power",
    ],
    color: "bg-yellow-400",
    subcategories: [
      { name: "Solar Panels", keywords: ["solar panel", "monocrystalline solar", "flexible solar panel"], slug: "solar-panels" },
      { name: "Power Stations", keywords: ["portable power station", "lifepo4 battery", "solar generator"], slug: "power-stations" },
      { name: "Generators", keywords: ["silent generator", "diesel generator", "inverter generator"], slug: "generators" },
      { name: "Inverters", keywords: ["solar inverter", "pure sine wave inverter", "hybrid inverter"], slug: "inverters" },
    ],
  },
  {
    id: "100003070",
    slug: "security-systems",
    name: "Security & CCTV",
    icon: "🔒",
    description: "Security cameras, CCTV systems, smart locks, safes, and surveillance equipment",
    keywords: [
      "security",
      "cctv",
      "security camera",
      "surveillance camera",
      "smart lock",
      "smart doorbell",
      "alarm system",
      "nvr system",
      "camera system",
      "video doorbell",
      "safe box",
      "home security",
    ],
    color: "bg-gray-500",
    subcategories: [
      { name: "CCTV Systems", keywords: ["cctv system", "security camera kit", "nvr camera system"], slug: "cctv" },
      { name: "Smart Locks", keywords: ["smart lock", "fingerprint lock", "wifi door lock"], slug: "smart-locks" },
      { name: "Safes", keywords: ["safe box", "fireproof safe", "digital safe"], slug: "safes" },
      { name: "Video Doorbells", keywords: ["video doorbell", "smart doorbell", "wifi ring camera"], slug: "doorbells" },
    ],
  },
  {
    id: "200003772",
    slug: "luxury-high-value",
    name: "Luxury & High-Value",
    icon: "👑",
    description: "Grand pianos, bronze statues, billiard tables, saunas, and premium lifestyle",
    keywords: [
      "luxury",
      "premium",
      "grand piano",
      "billiard table",
      "sauna",
      "wine cabinet",
      "bronze statue",
      "arcade machine",
      "premium decor",
      "luxury furniture",
      "high value item",
    ],
    color: "bg-amber-600",
    subcategories: [
      { name: "Piano & Keyboards", keywords: ["grand piano", "digital piano", "professional keyboard"], slug: "pianos" },
      { name: "Billiard Tables", keywords: ["billiard table", "pool table", "snooker table"], slug: "billiard-tables" },
      { name: "Saunas & Steam", keywords: ["home sauna", "steam room", "infrared sauna"], slug: "saunas" },
      { name: "Wine Cabinets", keywords: ["wine cooler", "wine cabinet", "wine storage fridge"], slug: "wine-cabinets" },
      { name: "Bronze Statues", keywords: ["bronze statue", "luxury sculpture", "garden statue"], slug: "bronze-statues" },
      { name: "Game Rooms", keywords: ["arcade machine", "air hockey table", "game room furniture"], slug: "game-rooms" },
    ],
  },
  {
    id: "2204",
    slug: "professional-audio",
    name: "Professional Audio",
    icon: "🎵",
    description: "PA systems, studio monitors, DJ equipment, microphones, and professional audio",
    keywords: [
      "audio",
      "sound",
      "pa system",
      "studio microphone",
      "dj controller",
      "audio mixer",
      "speaker system",
      "studio monitor",
      "recording equipment",
      "microphone",
      "soundboard",
      "turntable",
    ],
    color: "bg-indigo-500",
    subcategories: [
      { name: "PA Systems", keywords: ["pa system", "stage speaker system", "line array speaker"], slug: "pa-systems" },
      { name: "Studio Equipment", keywords: ["studio microphone", "audio interface", "recording microphone"], slug: "studio" },
      { name: "DJ Equipment", keywords: ["dj controller", "dj mixer", "turntable"], slug: "dj-equipment" },
      { name: "LED Video Walls", keywords: ["led video wall", "stage led display", "indoor led screen"], slug: "led-walls" },
    ],
  },
  {
    id: "1511",
    slug: "medical-mobility",
    name: "Medical & Mobility",
    icon: "♿",
    description: "Electric wheelchairs, medical devices, mobility scooters, and health equipment",
    keywords: [
      "medical",
      "mobility",
      "electric wheelchair",
      "mobility scooter",
      "medical device",
      "health equipment",
      "oxygen concentrator",
      "blood pressure monitor",
      "rehabilitation device",
      "elderly care",
      "therapy device",
    ],
    color: "bg-teal-500",
    subcategories: [
      { name: "Electric Wheelchairs", keywords: ["electric wheelchair", "foldable wheelchair", "motorized wheelchair"], slug: "wheelchairs" },
      { name: "Mobility Scooters", keywords: ["mobility scooter", "adult electric scooter", "elderly scooter"], slug: "mobility-scooters" },
      { name: "Medical Devices", keywords: ["oxygen concentrator", "blood pressure monitor", "medical diagnostic device"], slug: "medical-devices" },
      { name: "Elderly Fitness", keywords: ["elderly fitness", "rehabilitation trainer", "recovery exercise device"], slug: "elderly-fitness" },
    ],
  },
];

const CATEGORY_BY_SLUG = new Map<string, Category>(CATEGORIES.map((c) => [c.slug, c]));
const CATEGORY_BY_ID = new Map<string, Category>(CATEGORIES.map((c) => [c.id, c]));

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORY_BY_SLUG.get(slug);
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORY_BY_ID.get(id);
}

export function getSubcategoryBySlug(catSlug: string, subSlug: string) {
  const cat = getCategoryBySlug(catSlug);
  return cat?.subcategories.find((s) => s.slug === subSlug);
}

export function getCategorySearchKeywords(input: string) {
  const clean = normalizeText(input);
  const cat =
    getCategoryBySlug(clean) ||
    getCategoryById(clean) ||
    CATEGORIES.find((c) => normalizeText(c.name) === clean || normalizeText(c.slug).includes(clean) || clean.includes(normalizeText(c.name)));

  if (!cat) return [];

  return uniqueStrings([
    ...cat.keywords,
    ...cat.subcategories.flatMap((sub) => sub.keywords),
    cat.name,
    cat.slug.replace(/-/g, " "),
  ]);
}

export function getSubcategorySearchKeywords(catSlug: string, subSlug: string) {
  const sub = getSubcategoryBySlug(catSlug, subSlug);
  if (!sub) return [];
  const cat = getCategoryBySlug(catSlug);
  return uniqueStrings([
    ...(cat?.keywords || []),
    ...sub.keywords,
    sub.name,
    sub.slug.replace(/-/g, " "),
  ]);
}

export function getAllCategorySearchKeywords() {
  return uniqueStrings(
    CATEGORIES.flatMap((cat) => [
      ...cat.keywords,
      ...cat.subcategories.flatMap((sub) => sub.keywords),
      cat.name,
      cat.slug.replace(/-/g, " "),
    ])
  );
}