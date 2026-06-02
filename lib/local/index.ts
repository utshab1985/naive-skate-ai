import { Cart, CartItem, Collection, Menu, Product } from "./types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_COLLECTIONS,
  MOCK_MENU,
  MOCK_PRODUCTS,
} from "./data";

// In-memory cart storage (in a real app, use a database)
const carts = new Map<string, Cart>();

function generateId(): string {
  return `gid://local/Cart/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function getCartIdFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("cartId")?.value;
}

async function setCartIdCookie(cartId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("cartId", cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function createCart(): Promise<Cart> {
  const cartId = generateId();
  const cart: Cart = {
    id: cartId,
    checkoutUrl: `/cart`,
    cost: {
      subtotalAmount: { amount: "0.00", currencyCode: "USD" },
      totalAmount: { amount: "0.00", currencyCode: "USD" },
      totalTaxAmount: { amount: "0.00", currencyCode: "USD" },
    },
    lines: [],
    totalQuantity: 0,
  };

  carts.set(cartId, cart);
  await setCartIdCookie(cartId);

  return cart;
}

function calculateCartTotals(cart: Cart): void {
  let subtotal = 0;
  let totalQuantity = 0;

  for (const line of cart.lines) {
    const lineTotal = parseFloat(line.cost.totalAmount.amount);
    subtotal += lineTotal;
    totalQuantity += line.quantity;
  }

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  cart.cost = {
    subtotalAmount: {
      amount: subtotal.toFixed(2),
      currencyCode: "USD",
    },
    totalAmount: {
      amount: total.toFixed(2),
      currencyCode: "USD",
    },
    totalTaxAmount: {
      amount: tax.toFixed(2),
      currencyCode: "USD",
    },
  };
  cart.totalQuantity = totalQuantity;
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = await getCartIdFromCookies();
  let cart = cartId ? carts.get(cartId) : undefined;

  if (!cart) {
    cart = await createCart();
  }

  for (const line of lines) {
    // Find the product and variant
    let product: Product | undefined;
    let variantId: string | undefined;

    for (const p of MOCK_PRODUCTS) {
      const variant = p.variants.find((v) => v.id === line.merchandiseId);
      if (variant) {
        product = p;
        variantId = variant.id;
        break;
      }
    }

    if (!product || !variantId) {
      continue;
    }

    const variant = product.variants.find((v) => v.id === variantId)!;

    // Check if item already exists in cart
    const existingLine = cart.lines.find(
      (l) => l.merchandise.id === line.merchandiseId
    );

    if (existingLine) {
      existingLine.quantity += line.quantity;
      const unitPrice = parseFloat(variant.price.amount);
      const totalAmount = unitPrice * existingLine.quantity;
      existingLine.cost.totalAmount = {
        amount: totalAmount.toFixed(2),
        currencyCode: "USD",
      };
    } else {
      const unitPrice = parseFloat(variant.price.amount);
      const totalAmount = unitPrice * line.quantity;

      const cartItem: CartItem = {
        id: `${cart.id}-${variantId}`,
        quantity: line.quantity,
        cost: {
          totalAmount: {
            amount: totalAmount.toFixed(2),
            currencyCode: "USD",
          },
        },
        merchandise: {
          id: variantId,
          title: variant.title,
          selectedOptions: variant.selectedOptions,
          product: {
            id: product.id,
            handle: product.handle,
            title: product.title,
            featuredImage: product.featuredImage,
            cssFilter: product.cssFilter,
          },
        },
      };

      cart.lines.push(cartItem);
    }
  }

  calculateCartTotals(cart);
  carts.set(cart.id!, cart);

  return cart;
}

export async function removeFromCart(
  lineIds: string[]
): Promise<Cart> {
  const cartId = await getCartIdFromCookies();
  if (!cartId) {
    throw new Error("Cart not found");
  }
  const cart = carts.get(cartId);

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.lines = cart.lines.filter((line) => !lineIds.includes(line.id!));
  calculateCartTotals(cart);
  carts.set(cartId, cart);

  return cart;
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = await getCartIdFromCookies();
  if (!cartId) {
    throw new Error("Cart not found");
  }
  const cart = carts.get(cartId);

  if (!cart) {
    throw new Error("Cart not found");
  }

  for (const line of lines) {
    const cartLine = cart.lines.find((l) => l.id === line.id);
    if (cartLine) {
      cartLine.quantity = line.quantity;

      // Find variant to get price
      for (const product of MOCK_PRODUCTS) {
        const variant = product.variants.find(
          (v) => v.id === line.merchandiseId
        );
        if (variant) {
          const unitPrice = parseFloat(variant.price.amount);
          const totalAmount = unitPrice * line.quantity;
          cartLine.cost.totalAmount = {
            amount: totalAmount.toFixed(2),
            currencyCode: "USD",
          };
          break;
        }
      }
    }
  }

  calculateCartTotals(cart);
  carts.set(cartId, cart);

  return cart;
}

export async function getCart(cartId?: string): Promise<Cart | undefined> {
  const id = cartId || await getCartIdFromCookies();

  if (!id) {
    return undefined;
  }

  return carts.get(id);
}

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  return MOCK_COLLECTIONS.find((c) => c.handle === handle);
}

export async function getCollectionProducts({
  collection,
  sortKey,
  reverse,
}: {
  collection: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<Product[]> {
  let products = [...MOCK_PRODUCTS];

  // Handle special homepage collections first (before filtering)
  const collectionLower = collection?.toLowerCase();
  if (collectionLower === "hidden-homepage-featured-items") {
    return products.slice(0, 3);
  }
  if (collectionLower === "hidden-homepage-carousel") {
    return products.slice(3, 15);
  }

  // Filter by collection based on tags or category
  if (collection && collection !== "" && collection !== "all") {
    products = products.filter((p) => {
      const productCategory = p.tags[0]?.toLowerCase() || "";

      // Handle accessories collection - includes bearings and grip tape
      if (collectionLower === "accessories") {
        return productCategory === "bearings" || productCategory === "grip tape";
      }

      // For other collections, match by category tag or handle
      const hasTag = p.tags.some((tag) =>
        tag.toLowerCase().includes(collectionLower)
      );
      const hasHandle = p.handle.toLowerCase().includes(collectionLower);
      return hasTag || hasHandle;
    });
  }

  // Sort products
  if (sortKey === "PRICE") {
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? priceB - priceA : priceA - priceB;
    });
  } else if (sortKey === "CREATED_AT") {
    products.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return reverse ? dateB - dateA : dateA - dateB;
    });
  } else if (sortKey === "BEST_SELLING") {
    // For demo purposes, shuffle randomly
    products.sort(() => Math.random() - 0.5);
  }

  return products;
}

export async function getCollections(): Promise<Collection[]> {
  return MOCK_COLLECTIONS;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  return MOCK_MENU;
}

export async function getProduct(
  handle: string
): Promise<Product | undefined> {
  return MOCK_PRODUCTS.find((p) => p.handle === handle);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  // Return random products excluding the current one
  return MOCK_PRODUCTS.filter((p) => p.id !== productId).slice(0, 3);
}

export async function getProducts({
  query,
  sortKey,
  reverse,
}: {
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<Product[]> {
  let products = [...MOCK_PRODUCTS];

  // Filter by search query
  if (query) {
    const lowerQuery = query.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Sort products
  if (sortKey === "PRICE") {
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? priceB - priceA : priceA - priceB;
    });
  } else if (sortKey === "CREATED_AT") {
    products.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return reverse ? dateB - dateA : dateA - dateB;
    });
  } else if (sortKey === "BEST_SELLING") {
    // For demo purposes, shuffle randomly
    products.sort(() => Math.random() - 0.5);
  }

  return products;
}

// Stub revalidation function for local provider (not needed, but keeps API consistent)
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
