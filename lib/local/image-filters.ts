// Generate CSS filters based on product attributes to recolor base images

type FilterConfig = {
  hueRotate?: number; // 0-360 degrees
  saturate?: number; // 0-200%
  brightness?: number; // 0-200%
  contrast?: number; // 0-200%
  sepia?: number; // 0-100%
};

// Helper to get attribute value (case-insensitive)
function getAttributeValue(attrs: Record<string, string>, key: string): string | undefined {
  const lowerKey = key.toLowerCase();
  const foundKey = Object.keys(attrs).find((k) => k.toLowerCase() === lowerKey);
  return foundKey ? attrs[foundKey] : undefined;
}

// Extract product type from baseId (format: "product-type:variant-info")
function getProductType(baseId?: string): string | undefined {
  if (!baseId) return undefined;
  return baseId.split(":")[0];
}

// Base image configuration - maps product types to their images
const PRODUCT_TYPE_IMAGE_MAP: Record<string, string> = {
  // Decks
  "street-deck": "/images/base-skateboard.jpg",
  "longboard-deck": "/images/base-longboard.jpg",

  // Trucks
  "tkp-trucks": "/images/base-tkp.webp",
  "rkp-trucks": "/images/base-rkp.jpg",

  // Wheels
  "street-wheels": "/images/base-skatewheels.webp",
  "cruiser-wheels": "/images/base-cruiserwheels.webp",

  // Bearings
  "bearings": "/images/base-bearings.jpg",

  // Grip Tape
  "griptape": "/images/base-griptape.webp",
};

// Category fallback images
const CATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  Decks: "/images/base-skateboard.jpg",
  Trucks: "/images/base-tkp.webp",
  Wheels: "/images/base-skatewheels.webp",
  Bearings: "/images/base-bearings.jpg",
  "Grip Tape": "/images/base-griptape.webp",
};

// Base image mapping by category and product type
export function getBaseImageForProduct(
  category: string,
  attributes: Record<string, string>,
  baseId?: string
): string {
  // Extract product type from baseId
  const productType = getProductType(baseId);

  // Look up image by product type
  if (productType && PRODUCT_TYPE_IMAGE_MAP[productType]) {
    return PRODUCT_TYPE_IMAGE_MAP[productType];
  }

  // Fall back to category default
  return CATEGORY_FALLBACK_IMAGE[category] || "/images/base-skateboard.jpg";
}

// Attribute value to filter mapping
const ATTRIBUTE_FILTER_MAP: Record<string, Partial<FilterConfig>> = {
  // Deck graphics - varying hue rotations for visual variety
  Flames: { hueRotate: 350, saturate: 300, contrast: 200, brightness: 80 },
  Geometric: { hueRotate: 180, saturate: 110, brightness: 100 },
  Abstract: { hueRotate: 270, saturate: 115, brightness: 102 },
  Skull: { saturate: 0, brightness: 70, contrast: 200 },
  Minimalist: { hueRotate: 0, saturate: 85, brightness: 105 },

  // Longboard flex - subtle variations
  Stiff: { hueRotate:10, brightness: 100, contrast:120, saturate: 50 },
  Medium: { hueRotate: 300, brightness: 100, saturate: 100 },
  Flexy: { hueRotate: 60, saturate: 90 },

  // Truck construction
  Standard: { brightness: 100, saturate: 200, hueRotate: 25 },
  Hollow: { brightness: 110, saturate: 90, hueRotate: 250},
  Forged: { brightness: 100, saturate: 200, hueRotate: 150 },
  Precision: { brightness: 95, saturate: 110, contrast: 120, hueRotate: 200 },

  // Wheel profiles
  Classic: { saturate: 100, brightness: 100 },
  Bighead: { saturate: 300, brightness: 105, hueRotate: 300  },

  // Wheel types (lowercase as in config)
  cruiser: { saturate: 120, brightness: 105 },
  downhill: { saturate: 20, contrast: 200, brightness: 90, hueRotate: 300 },

  // Bearing materials
  Steel:  { hueRotate: 25 },
  Ceramic: { hueRotate: 100 },

  // Bearing types
  "6-ball": { contrast: 150 },
  "7-ball": { saturate: 150 },

  // Spacer types
  "Built-In": { hueRotate: 200},
  classic: { hueRotate: 100 },

  // Grip tape colors
  Black: { brightness: 90, saturate: 50, contrast: 200 },
  Clear: { brightness: 110, saturate: 120, hueRotate: 80 },
};

// Generate a deterministic filter based on product attributes
export function generateImageFilter(
  category: string,
  attributes: Record<string, string>
): FilterConfig {
  const filter: FilterConfig = {
    hueRotate: 0,
    saturate: 100,
    brightness: 100,
    contrast: 100,
    sepia: 0,
  };

  // Apply filters from all attribute values
  for (const value of Object.values(attributes)) {
    if (ATTRIBUTE_FILTER_MAP[value]) {
      Object.assign(filter, ATTRIBUTE_FILTER_MAP[value]);
    }
  }

  // Add some variance based on attributes to make similar products slightly different
  const hash = hashString(JSON.stringify(attributes));
  const variance = (hash % 20) - 10; // -10 to +10
  filter.hueRotate = (filter.hueRotate || 0) + variance;

  return filter;
}

// Convert filter config to CSS filter string
export function filterToCSS(filter: FilterConfig): string {
  const filters: string[] = [];

  if (filter.hueRotate) {
    filters.push(`hue-rotate(${filter.hueRotate}deg)`);
  }
  if (filter.saturate !== undefined && filter.saturate !== 100) {
    filters.push(`saturate(${filter.saturate}%)`);
  }
  if (filter.brightness !== undefined && filter.brightness !== 100) {
    filters.push(`brightness(${filter.brightness}%)`);
  }
  if (filter.contrast !== undefined && filter.contrast !== 100) {
    filters.push(`contrast(${filter.contrast}%)`);
  }
  if (filter.sepia) {
    filters.push(`sepia(${filter.sepia}%)`);
  }

  return filters.join(" ");
}

// Simple string hash function for deterministic variance
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Legacy function - use getBaseImageForProduct instead
export function getBaseImageUrl(
  category: string,
  attributes: Record<string, string> = {},
  baseId?: string
): string {
  return getBaseImageForProduct(category, attributes, baseId);
}
