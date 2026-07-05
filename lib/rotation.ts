export const KEYWORD_POOLS = {
  trending: [
    "trending products 2024", "best seller global", "new arrival popular", "top rated products",
    "hot items worldwide", "viral products", "most ordered items", "recommended products",
    "flash sale limited", "top picks worldwide", "must have items", "highly recommended",
    "staff picks bestseller", "customer favorites", "quality products sale",
  ],
  phones: [
    "smartphone android 5G 2024", "POCO X7 Pro Redmi Note 14", "budget phone under 150 USD",
    "gaming phone ROG Red Magic", "rugged phone Ulefone Blackview", "iPhone clone i16 Pro Max replica",
    "flagship killer phone Xiaomi", "Samsung Galaxy refurbished S22 S23", "foldable flip phone fold",
    "OnePlus Ace5 Xiaomi 14T Pro", "Infinix Note 50 Realme C75", "Doogee mini compact phone",
    "Oukitel WP35 rugged smartphone", "Hotwav Cyber rugged 5G", "Unihertz Tank rugged phone",
    "Honor Magic OnePlus smartphone", "OPPO Find X smartphone", "Nubia Red Magic gaming phone",
  ],
  jewelry: [
    "luxury diamond ring gold jewelry", "emerald sapphire jewelry set", "real gold chain necklace",
    "platinum lab diamond ring", "skeleton automatic watch luxury", "custom gold jewelry bracelet",
    "pearl precious stone jewelry set", "moissanite diamond engagement ring", "luxury watch men automatic",
    "rose gold jewelry women", "silver sterling 925 necklace", "crystal chandelier earrings",
    "vintage gold brooch jewelry", "luxury smartwatch gold", "wedding band diamond ring",
  ],
  furniture: [
    "luxury sofa set leather living room", "king size bed frame luxury", "baroque dining table set",
    "royal antique leather sofa", "wooden bedroom furniture set", "luxury coffee table marble",
    "recliner armchair luxury velvet", "executive office desk furniture", "luxury wardrobe cabinet",
    "massage chair full body", "billiard pool table", "wine cabinet humidor",
  ],
  electronics: [
    "gaming laptop high performance RTX", "smart TV 4K OLED 55 inch", "wireless earbuds ANC",
    "professional camera DSLR mirrorless", "tablet Android iPad alternative", "home theater system speaker",
    "professional drone 4K camera", "VR AR headset gaming", "laptop ultrabook thin light",
    "mechanical keyboard RGB gaming", "gaming monitor 144Hz curved", "smart home hub automation",
  ],
  deals: [
    "flash sale 50% off", "clearance sale discount", "limited time offer", "bundle deal combo pack",
    "free shipping sale", "mega deals electronics", "hot offers fashion", "seasonal clearance",
    "buy 2 get 1 free", "special promotion deals", "daily deals marketplace", "weekend sale offers",
  ],
  home: [
    "crystal chandelier LED luxury", "smart home devices automation", "air purifier HEPA filter",
    "robot vacuum cleaner automatic", "air fryer kitchen appliance", "coffee machine espresso",
    "washing machine portable mini", "refrigerator double door", "sauna steam room home",
    "garden outdoor furniture", "swimming pool inflatable", "security camera CCTV system",
  ],
  fashion: [
    "mink fur coat jacket luxury", "leather bag genuine crocodile", "luxury sunglasses designer",
    "wedding dress bridal gown", "men suit formal luxury", "women dress elegant party",
    "sneakers running shoes fashion", "handbag purse leather women", "men shoes Oxford formal",
  ],
  outdoor: [
    "camping tent outdoor gear", "electric bike ebike motor", "inflatable water park",
    "children playground outdoor", "professional telescope astronomy", "go kart ATV outdoor",
    "fishing boat marine equipment", "solar panel system inverter", "generator diesel industrial",
    "trampoline outdoor children", "gazebo pergola outdoor", "hydroponic farming system",
  ],
  industrial: [
    "laser cutting engraving machine", "CNC router machine industrial", "welding machine MIG TIG",
    "3D printer FDM resin professional", "hydraulic press lift", "agricultural machinery tractor",
    "food processing machine commercial", "commercial coffee machine espresso", "bakery oven commercial",
    "construction tools heavy duty", "portable medical device", "electric wheelchair mobility",
  ],
};

export function getKeywordsForPage(pool: keyof typeof KEYWORD_POOLS, page: number): string {
  const keywords = KEYWORD_POOLS[pool];
  const idx = Math.abs((page - 1) % keywords.length);
  return keywords[idx];
}

export function getRandomKeyword(pool: keyof typeof KEYWORD_POOLS, seed?: number): string {
  const keywords = KEYWORD_POOLS[pool];
  const idx = seed !== undefined ? Math.abs(seed % keywords.length) : Math.floor(Math.random() * keywords.length);
  return keywords[idx];
}

export function getMultipleKeywords(pool: keyof typeof KEYWORD_POOLS, page: number, count: number = 3): string[] {
  const keywords = KEYWORD_POOLS[pool];
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.abs(((page - 1) * count + i) % keywords.length);
    result.push(keywords[idx]);
  }
  return result;
}

export function generateSessionSeed(): number {
  return Math.floor(Math.random() * 10000);
}

export function seedFromPageAndSession(page: number, seed: number): number {
  return (page * 37 + seed * 13) % 10000;
}
