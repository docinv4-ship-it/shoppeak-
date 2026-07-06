export type KeywordProfile = {
  seeds: string[];
  modifiers: string[];
  intents: string[];
  brands: string[];
  strict: string[];
  excludes: string[];
};

export type KeywordPack = {
  primary: string[];
  fallback: string[];
  strict: string[];
  excludes: string[];
};

const COMMON_INTENTS = [
  "buy",
  "best",
  "top rated",
  "premium",
  "new arrival",
  "hot sale",
  "discount",
  "clearance",
  "popular",
  "recommended",
  "official",
  "pro",
];

const COMMON_MODIFIERS = [
  "budget",
  "cheap",
  "affordable",
  "flagship",
  "luxury",
  "premium",
  "wireless",
  "smart",
  "portable",
  "mini",
  "heavy duty",
  "high power",
  "high precision",
  "professional",
  "fast charging",
  "foldable",
  "automatic",
  "waterproof",
  "rechargeable",
  "durable",
];

const CATEGORY_PROFILES: Record<string, KeywordProfile> = {
  "phones-smartphones": {
    seeds: [
      "smartphone",
      "mobile phone",
      "android phone",
      "5g phone",
      "cell phone",
      "flagship phone",
      "gaming phone",
      "rugged phone",
      "foldable phone",
      "tablet",
    ],
    modifiers: [
      "budget",
      "flagship",
      "gaming",
      "rugged",
      "foldable",
      "5g",
      "camera",
      "large screen",
      "dual sim",
      "long battery",
    ],
    intents: COMMON_INTENTS,
    brands: ["Samsung", "Xiaomi", "Redmi", "POCO", "OnePlus", "Realme", "Tecno", "Infinix", "Oppo", "Vivo"],
    strict: ["phone", "smartphone", "mobile", "tablet"],
    excludes: ["charger cable", "case only", "screen protector only", "car phone holder"],
  },
  "jewelry-watches": {
    seeds: ["ring", "necklace", "bracelet", "earrings", "watch", "pendant", "jewelry set", "moissanite ring"],
    modifiers: ["luxury", "gold plated", "925 silver", "fashion", "wedding", "men", "women", "custom", "diamond"],
    intents: COMMON_INTENTS,
    brands: ["Casio", "Seiko", "Tissot", "Cartier", "Swarovski", "Michael Kors", "Pandora"],
    strict: ["ring", "necklace", "bracelet", "earrings", "watch", "jewelry"],
    excludes: ["smartphone", "phone case", "charger", "headphone"],
  },
  "home-furniture": {
    seeds: ["sofa", "bed frame", "dining table", "wardrobe", "coffee table", "recliner", "home decor", "wall art"],
    modifiers: ["luxury", "modern", "minimalist", "wooden", "living room", "bedroom", "designer", "premium"],
    intents: COMMON_INTENTS,
    brands: ["IKEA", "Ashley", "West Elm", "Wayfair"],
    strict: ["sofa", "bed", "table", "wardrobe", "recliner", "decor", "wall art", "furniture"],
    excludes: ["charger", "phone", "earbud", "cable"],
  },
  "lighting-chandeliers": {
    seeds: ["chandelier", "ceiling light", "led light", "strip light", "floor lamp", "wall sconce", "smart bulb"],
    modifiers: ["crystal", "modern", "rgb", "warm white", "luxury", "decorative", "smart", "ceiling"],
    intents: COMMON_INTENTS,
    brands: ["Philips", "Yeelight", "Tuya", "Xiaomi"],
    strict: ["light", "lamp", "chandelier", "bulb", "sconce", "strip"],
    excludes: ["phone", "charger", "tablet", "watch"],
  },
  "home-appliances": {
    seeds: ["air fryer", "coffee machine", "robot vacuum", "air purifier", "washing machine", "blender", "mini fridge", "ice maker"],
    modifiers: ["digital", "smart", "portable", "compact", "kitchen", "automatic", "stainless steel", "home"],
    intents: COMMON_INTENTS,
    brands: ["Philips", "Midea", "Xiaomi", "DeLonghi", "LG", "Samsung", "Bosch"],
    strict: ["air fryer", "coffee machine", "vacuum", "purifier", "washing machine", "blender", "fridge", "ice maker", "appliance"],
    excludes: ["mobile charger", "phone case", "earbuds", "watch band"],
  },
  "consumer-electronics": {
    seeds: ["laptop", "tv", "earbuds", "headphones", "mechanical keyboard", "camera", "drone", "vr headset", "projector"],
    modifiers: ["gaming", "wireless", "4k", "bluetooth", "android", "smart", "portable", "high performance"],
    intents: COMMON_INTENTS,
    brands: ["Dell", "HP", "Lenovo", "ASUS", "Acer", "Sony", "JBL", "Samsung", "Xiaomi"],
    strict: ["laptop", "tv", "earbud", "headphone", "camera", "drone", "projector", "vr", "keyboard", "electronics"],
    excludes: ["jewelry", "furniture", "medical", "scooter"],
  },
  automotive: {
    seeds: ["car accessory", "dash cam", "car charger", "car play", "car phone holder", "car cleaning", "car seat cover", "gps tracker"],
    modifiers: ["universal", "wireless", "fast charging", "heavy duty", "12v", "premium", "interior", "exterior"],
    intents: COMMON_INTENTS,
    brands: ["Baseus", "70mai", "YI", "Aukey", "Anker"],
    strict: ["car", "automotive", "dash cam", "charger", "holder", "seat cover", "tracker", "gps"],
    excludes: ["home decor", "jewelry", "phone only"],
  },
  "machinery-industrial": {
    seeds: ["laser engraver", "cnc machine", "3d printer", "welding machine", "power tool", "hydraulic press", "industrial tool", "food machine"],
    modifiers: ["industrial", "high precision", "heavy duty", "professional", "desktop", "automatic", "brushless", "commercial"],
    intents: COMMON_INTENTS,
    brands: ["Creality", "Anycubic", "Makita", "Bosch", "RYOBI", "Miller"],
    strict: ["laser", "cnc", "3d printer", "welding", "power tool", "hydraulic", "industrial", "machine"],
    excludes: ["fashion", "toy", "decor", "phone case"],
  },
  "outdoor-recreational": {
    seeds: ["camping tent", "fitness equipment", "bicycle", "paddle board", "telescope", "trampoline", "garden tool", "survival gear"],
    modifiers: ["outdoor", "portable", "waterproof", "heavy duty", "foldable", "sports", "adventure", "professional"],
    intents: COMMON_INTENTS,
    brands: ["Decathlon", "Coleman", "Naturehike", "Garmin"],
    strict: ["camping", "fitness", "bike", "board", "telescope", "trampoline", "garden", "outdoor", "sports"],
    excludes: ["phone", "charger", "watch band"],
  },
  "fashion-wearables": {
    seeds: ["women dress", "men jacket", "handbag", "sneakers", "sunglasses", "fur coat", "wedding dress", "fashion accessory"],
    modifiers: ["luxury", "designer", "casual", "streetwear", "elegant", "summer", "winter", "premium"],
    intents: COMMON_INTENTS,
    brands: ["Zara", "H&M", "Nike", "Adidas", "Gucci", "Louis Vuitton"],
    strict: ["dress", "jacket", "handbag", "sneakers", "sunglasses", "coat", "fashion"],
    excludes: ["charger", "cable", "phone", "tablet"],
  },
  "health-beauty": {
    seeds: ["skincare device", "hair straightener", "laser hair removal", "massage chair", "electric toothbrush", "makeup brush", "beauty tool"],
    modifiers: ["portable", "professional", "automatic", "safe", "rechargeable", "anti aging", "spa", "home"],
    intents: COMMON_INTENTS,
    brands: ["Philips", "Braun", "Revlon", "Dyson", "Foreo"],
    strict: ["skincare", "beauty", "hair", "massage", "toothbrush", "makeup", "device"],
    excludes: ["mobile", "laptop", "car part"],
  },
  "solar-energy": {
    seeds: ["solar panel", "power station", "inverter", "generator", "lithium battery", "solar light", "solar charger"],
    modifiers: ["portable", "off grid", "home backup", "high power", "monocrystalline", "lifepo4", "renewable", "energy"],
    intents: COMMON_INTENTS,
    brands: ["EcoFlow", "Bluetti", "Jackery", "Anker", "Renogy"],
    strict: ["solar", "inverter", "battery", "generator", "power station", "charger", "energy"],
    excludes: ["phone case", "watch", "toy"],
  },
  "security-systems": {
    seeds: ["cctv camera", "smart lock", "video doorbell", "security system", "safe box", "surveillance camera", "nvr kit"],
    modifiers: ["wireless", "wifi", "outdoor", "night vision", "biometric", "tuya", "smart", "hd"],
    intents: COMMON_INTENTS,
    brands: ["Hikvision", "Dahua", "EZVIZ", "Reolink", "Tuya"],
    strict: ["cctv", "camera", "lock", "doorbell", "security", "surveillance", "safe"],
    excludes: ["headphone", "fashion", "furniture"],
  },
  "luxury-high-value": {
    seeds: ["grand piano", "billiard table", "sauna", "wine cabinet", "bronze statue", "arcade machine", "luxury decor"],
    modifiers: ["luxury", "premium", "full size", "professional", "handcrafted", "collectible", "designer", "high value"],
    intents: COMMON_INTENTS,
    brands: ["Yamaha", "Roland", "Samick", "Kawai"],
    strict: ["piano", "billiard", "sauna", "wine", "statue", "arcade", "luxury"],
    excludes: ["cheap", "phone", "usb cable"],
  },
  "professional-audio": {
    seeds: ["pa system", "studio microphone", "dj controller", "audio mixer", "speaker system", "monitor headphones", "led wall"],
    modifiers: ["professional", "studio", "concert", "stage", "wireless", "high fidelity", "portable", "sound"],
    intents: COMMON_INTENTS,
    brands: ["Shure", "Behringer", "Pioneer", "Yamaha", "JBL"],
    strict: ["audio", "speaker", "microphone", "mixer", "dj", "studio", "pa"],
    excludes: ["headband", "phone case", "fashion"],
  },
  "medical-mobility": {
    seeds: ["electric wheelchair", "mobility scooter", "medical device", "oxygen concentrator", "blood pressure monitor", "rehabilitation equipment"],
    modifiers: ["foldable", "lightweight", "portable", "elderly", "home care", "medical", "digital", "motorized"],
    intents: COMMON_INTENTS,
    brands: ["Drive Medical", "Invacare", "Omron", "Philips"],
    strict: ["wheelchair", "scooter", "medical", "oxygen", "monitor", "rehabilitation", "mobility"],
    excludes: ["fashion", "toy", "charger cable"],
  },
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_/]+/g, " ")
    .replace(/\s*&\s*/g, " and ")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((v) => normalizeText(v)).filter(Boolean))];
}

function singularizeToken(token: string): string {
  if (token.endsWith("ies")) return token.slice(0, -3) + "y";
  if (token.endsWith("ses")) return token.slice(0, -2);
  if (token.endsWith("s") && token.length > 3) return token.slice(0, -1);
  return token;
}

function deriveTokens(name: string): string[] {
  const text = normalizeText(name);
  if (!text) return [];

  const tokens = text.split(" ").filter(Boolean);
  const output = new Set<string>();
  output.add(text);
  output.add(tokens.map(singularizeToken).join(" "));

  if (tokens.length >= 2) {
    output.add(tokens.slice(-1)[0]);
    output.add(tokens.slice(0, 2).join(" "));
  }

  if (text.includes("phone")) {
    output.add("smartphone");
    output.add("mobile phone");
  }
  if (text.includes("watch")) {
    output.add("watch");
    output.add("smart watch");
  }
  if (text.includes("light")) {
    output.add("light");
    output.add("lamp");
  }
  if (text.includes("jewelry") || text.includes("jewellery")) {
    output.add("jewelry");
    output.add("fashion jewelry");
  }
  if (text.includes("appliance")) {
    output.add("appliance");
    output.add("kitchen appliance");
  }
  if (text.includes("camera")) {
    output.add("camera");
    output.add("security camera");
  }

  return [...output];
}

function buildKeywordBank(profile: KeywordProfile, extraSeeds: string[] = []): string[] {
  const seeds = unique([...profile.seeds, ...extraSeeds]);
  const modifiers = unique(profile.modifiers.length ? profile.modifiers : COMMON_MODIFIERS);
  const intents = unique(profile.intents.length ? profile.intents : COMMON_INTENTS);
  const brands = unique(profile.brands);
  const strict = unique(profile.strict);
  const excludes = unique(profile.excludes);

  const result: string[] = [];
  const push = (value: string) => {
    const text = normalizeText(value);
    if (text) result.push(text);
  };

  for (const seed of seeds) {
    push(seed);
    for (const modifier of modifiers) {
      push(`${modifier} ${seed}`);
      push(`${seed} ${modifier}`);
    }
    for (const intent of intents) {
      push(`${intent} ${seed}`);
      push(`${seed} ${intent}`);
    }
    for (const brand of brands) {
      push(`${brand} ${seed}`);
      push(`${seed} ${brand}`);
      for (const modifier of modifiers.slice(0, 6)) {
        push(`${brand} ${modifier} ${seed}`);
      }
    }
  }

  for (const strictToken of strict) {
    push(strictToken);
    for (const modifier of modifiers.slice(0, 6)) {
      push(`${modifier} ${strictToken}`);
    }
  }

  // A few broad but still category-safe long-tail variants.
  for (const seed of seeds.slice(0, 8)) {
    push(`${seed} buy online`);
    push(`${seed} best price`);
    push(`${seed} top rated`);
    push(`${seed} new arrival`);
  }

  // Remove obvious excluded duplicates if they slip in.
  const excludedSet = new Set(excludes);
  return unique(result).filter((keyword) => {
    const text = normalizeText(keyword);
    return ![...excludedSet].some((ex) => ex && text.includes(ex));
  });
}

function profileForCategory(categorySlug: string, categoryName?: string): KeywordProfile {
  const key = normalizeText(categorySlug);
  const bySlug = CATEGORY_PROFILES[key];
  if (bySlug) return bySlug;

  const byName = Object.entries(CATEGORY_PROFILES).find(([slug]) => key.includes(slug) || slug.includes(key));
  if (byName) return byName[1];

  const fallbackSeeds = deriveTokens(categoryName || categorySlug);
  return {
    seeds: fallbackSeeds.length ? fallbackSeeds : [categorySlug],
    modifiers: COMMON_MODIFIERS,
    intents: COMMON_INTENTS,
    brands: [],
    strict: fallbackSeeds,
    excludes: [],
  };
}

export function getCategoryKeywords(categorySlug: string, categoryName?: string): string[] {
  const profile = profileForCategory(categorySlug, categoryName);
  return buildKeywordBank(profile, deriveTokens(categoryName || categorySlug));
}

export function getSubcategoryKeywords(categorySlug: string, subcategorySlug: string, subcategoryName?: string): string[] {
  const categoryProfile = profileForCategory(categorySlug, categorySlug);
  const subSeeds = unique([
    ...deriveTokens(subcategoryName || subcategorySlug),
    ...deriveTokens(categorySlug),
  ]);

  const subProfile: KeywordProfile = {
    seeds: subSeeds,
    modifiers: [
      ...categoryProfile.modifiers.slice(0, 8),
      "exact",
      "compatible",
      "replacement",
      "upgrade",
      "pro",
    ],
    intents: [
      "buy",
      "best",
      "top rated",
      "new arrival",
      "hot sale",
      "premium",
      "discount",
      "recommended",
    ],
    brands: categoryProfile.brands.slice(0, 6),
    strict: unique([
      ...deriveTokens(subcategoryName || subcategorySlug),
      ...deriveTokens(categorySlug),
    ]),
    excludes: categoryProfile.excludes,
  };

  return buildKeywordBank(subProfile, subSeeds);
}

export function isCategoryRelevant(title: string, categorySlug: string, subcategorySlug?: string): boolean {
  const text = normalizeText(title);
  if (!text) return false;

  const categoryProfile = profileForCategory(categorySlug, categorySlug);
  const categoryStrict = unique(categoryProfile.strict.length ? categoryProfile.strict : deriveTokens(categorySlug));
  const subStrict = subcategorySlug ? deriveTokens(subcategorySlug) : [];

  const excludes = unique(categoryProfile.excludes);
  if (excludes.some((bad) => bad && text.includes(bad))) return false;

  const allStrict = [...categoryStrict, ...subStrict].filter(Boolean);
  if (!allStrict.length) return true;

  return allStrict.some((token) => text.includes(token));
}

export function getCategorySearchPack(categorySlug: string, categoryName?: string): KeywordPack {
  const profile = profileForCategory(categorySlug, categoryName);
  return {
    primary: getCategoryKeywords(categorySlug, categoryName).slice(0, 80),
    fallback: getCategoryKeywords(categorySlug, categoryName).slice(80, 220),
    strict: unique(profile.strict.length ? profile.strict : deriveTokens(categoryName || categorySlug)),
    excludes: unique(profile.excludes),
  };
}