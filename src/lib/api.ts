import { products as fallbackProducts } from "@/data/products";
import type { Product } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const list = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  const normalized = value.trim();
  if (!normalized) return [];
  try {
    const parsed: unknown = JSON.parse(normalized);
    if (Array.isArray(parsed)) return parsed.map(String).map((item) => item.trim()).filter(Boolean);
  } catch {
    // Database text fields may use comma-separated values instead of JSON.
  }
  return normalized.split(",").map((item) => item.trim()).filter(Boolean);
};

const booleanValue = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return ["1", "true", "yes"].includes(value.trim().toLowerCase());
  return fallback;
};

export function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug || ""),
    name: String(row.name || ""),
    category: String(row.category_name || row.category || ""),
    description: String(row.description || ""),
    price: Number(row.price) || 0,
    mrp: Number(row.mrp) || Number(row.price) || 0,
    rating: Number(row.rating) || 0,
    reviewCount: Number(row.review_count ?? row.reviewCount) || 0,
    packSizes: list(row.pack_sizes ?? row.packSizes),
    spiceLevel: String(row.spice_level || row.spiceLevel || ""),
    dishTypes: list(row.dish_type ?? row.dishTypes),
    region: String(row.region || ""),
    veg: booleanValue(row.is_vegetarian ?? row.veg),
    ingredients: list(row.ingredients),
    image: String(row.image_url || row.image || ""),
    badge: row.badge ? String(row.badge) : undefined,
    stockQuantity: Number(row.stock_quantity ?? row.stockQuantity) || 0,
    isActive: row.is_active === undefined ? true : booleanValue(row.is_active),
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/api/products`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Product API returned ${response.status}`);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error("Product API returned an invalid response");
    return rows.map(mapProduct);
  } catch (error) {
    console.error("Unable to load products from the API:", error);
    return fallbackProducts;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function getCategories(): Promise<{ id: number; name: string; slug: string; image_url?: string }[]> {
  try {
    const response = await fetch(`${API_URL}/api/categories`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Category API returned ${response.status}`);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error("Category API returned an invalid response");
    return rows;
  } catch (error) {
    console.error("Unable to load categories from the API:", error);
    return [];
  }
}

export async function createOrder(payload: unknown) {
  const response = await fetch(`${API_URL}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Unable to place order");
  return body as { orderNumber: string; total: number };
}

export { API_URL };
