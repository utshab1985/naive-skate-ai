import { generateProducts } from "./product-generator";
import { skateboardConfigs } from "./skateboard-config";
import { Collection, Menu } from "./types";

// Generate all skateboard products from configurations
export const MOCK_PRODUCTS = generateProducts(skateboardConfigs);

export const MOCK_COLLECTIONS: Collection[] = [
  {
    handle: "",
    title: "All Products",
    description: "Browse our complete skateboard gear collection",
    seo: {
      title: "All Skateboard Products",
      description: "Complete selection of skateboards, longboards, wheels, trucks, and accessories",
    },
    updatedAt: new Date().toISOString(),
    path: "/search",
  },
  {
    handle: "decks",
    title: "Decks",
    description: "Skatboard and longboard Decks",
    seo: {
      title: "Skateboard Decks Collection",
      description: "Premium skateboard decks, cruisers, and longboards for every riding style",
    },
    updatedAt: new Date().toISOString(),
    path: "/search/decks",
  },
  {
    handle: "wheels",
    title: "Wheels",
    description: "Street, cruiser, and longboard wheels",
    seo: {
      title: "Skateboard Wheels Collection",
      description: "High-performance skateboard wheels for street, park, and cruising",
    },
    updatedAt: new Date().toISOString(),
    path: "/search/wheels",
  },
  {
    handle: "trucks",
    title: "Trucks",
    description: "Trucks, bearings, and mounting hardware",
    seo: {
      title: "Trucks & Hardware Collection",
      description: "Durable trucks, precision bearings, and essential hardware",
    },
    updatedAt: new Date().toISOString(),
    path: "/search/trucks",
  },
  {
    handle: "accessories",
    title: "Accessories",
    description: "Grip tape, bearings, and essential gear",
    seo: {
      title: "Skateboard Accessories",
      description: "Grip tape, bearings, tools, and other essential skateboard accessories",
    },
    updatedAt: new Date().toISOString(),
    path: "/search/accessories",
  },
];

export const MOCK_MENU: Menu[] = [
  {
    title: "All",
    path: "/search",
  },
  {
    title: "Decks",
    path: "/search/decks",
  },
  {
    title: "Wheels",
    path: "/search/wheels",
  },
  {
    title: "Trucks",
    path: "/search/trucks",
  },
  {
    title: "Accessories",
    path: "/search/accessories",
  },
];
