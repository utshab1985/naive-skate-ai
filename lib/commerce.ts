/**
 * Commerce provider - using local provider
 */

// Export all functions from the local provider
export {
  createCart,
  addToCart,
  removeFromCart,
  updateCart,
  getCart,
  getCollection,
  getCollectionProducts,
  getCollections,
  getMenu,
  getProduct,
  getProductRecommendations,
  getProducts,
  revalidate,
} from "./local";

// Export types from the local provider
export type {
  Cart,
  CartItem,
  Collection,
  Image,
  Menu,
  Money,
  Product,
  ProductOption,
  ProductVariant,
  SEO,
} from "./local/types";
