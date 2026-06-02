import {
  filterToCSS,
  generateImageFilter,
  getBaseImageUrl,
} from "./image-filters";
import { Product, ProductVariant } from "./types";

// Configuration types
type AttributeConfig = {
  name: string;
  values: string[];
};

export type ProductConfig = {
  baseId: string;
  category: string;
  nameTemplate: string; // e.g., "${brand} ${style} Skateboard Deck"
  descriptionTemplate: string;
  attributes: AttributeConfig[];
  pricing: {
    base: number;
    modifiers?: {
      [attributeName: string]: {
        [value: string]: number; // price adjustment
      };
    };
  };
  images: {
    base: string; // base URL or seed
    variants?: {
      [attributeName: string]: {
        [value: string]: string; // different image per variant
      };
    };
  };
};

// Helper to generate all combinations
function generateCombinations(
  attributes: AttributeConfig[]
): Record<string, string>[] {
  if (attributes.length === 0) return [{}];

  const [first, ...rest] = attributes;
  const restCombinations = generateCombinations(rest);
  const combinations: Record<string, string>[] = [];

  for (const value of first!.values) {
    for (const combo of restCombinations) {
      combinations.push({ [first!.name]: value, ...combo });
    }
  }

  return combinations;
}

// Template interpolation
function fillTemplate(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => values[key] || "");
}

// Calculate price based on attributes
function calculatePrice(
  basePrice: number,
  attributes: Record<string, string>,
  modifiers?: ProductConfig["pricing"]["modifiers"]
): number {
  let price = basePrice;

  if (modifiers) {
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      if (modifiers[attrName] && modifiers[attrName][attrValue]) {
        price += modifiers[attrName][attrValue];
      }
    }
  }

  return Math.round(price * 100) / 100;
}

// Generate individual products (one per variant combination)
export function generateProduct(config: ProductConfig): Product[] {
  const combinations = generateCombinations(config.attributes);
  const products: Product[] = [];

  // Generate one product per combination
  combinations.forEach((combo, idx) => {
    const price = calculatePrice(
      config.pricing.base,
      combo,
      config.pricing.modifiers
    );

    // Generate product name and handle from the specific combination
    const productName = fillTemplate(config.nameTemplate, {
      category: config.category,
      ...combo,
    });
    const handle = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Generate description
    const description = fillTemplate(config.descriptionTemplate, {
      category: config.category,
      ...combo,
    });

    // Generate base image URL and CSS filter
    const baseImageUrl = getBaseImageUrl(config.category, combo, config.baseId);
    const imageFilter = generateImageFilter(config.category, combo);
    const cssFilter = filterToCSS(imageFilter);

    const imageUrl = baseImageUrl;

    // Create a single variant for this product
    const variant: ProductVariant = {
      id: `gid://local/ProductVariant/${config.baseId}-${idx + 1}`,
      title: "Default",
      availableForSale: true,
      selectedOptions: Object.entries(combo).map(([name, value]) => ({
        name,
        value,
      })),
      price: {
        amount: price.toFixed(2),
        currencyCode: "USD",
      },
    };

    products.push({
      id: `gid://local/Product/${config.baseId}-${idx + 1}`,
      handle: `${handle}-${idx + 1}`,
      availableForSale: true,
      title: productName,
      description,
      descriptionHtml: `<p>${description}</p>`,
      options: [], // No options since each product is a specific variant
      priceRange: {
        maxVariantPrice: {
          amount: price.toFixed(2),
          currencyCode: "USD",
        },
        minVariantPrice: {
          amount: price.toFixed(2),
          currencyCode: "USD",
        },
      },
      variants: [variant],
      featuredImage: {
        url: imageUrl,
        altText: productName,
        width: 400,
        height: 400,
      },
      images: [
        {
          url: imageUrl,
          altText: productName,
          width: 400,
          height: 400,
        },
        {
          url: imageUrl,
          altText: `${productName} - Detail`,
          width: 400,
          height: 400,
        },
      ],
      cssFilter,
      seo: {
        title: productName,
        description,
      },
      tags: [config.category],
      updatedAt: new Date().toISOString(),
    });
  });

  return products;
}

// Generate multiple products from configs
export function generateProducts(configs: ProductConfig[]): Product[] {
  return configs.flatMap(generateProduct);
}
