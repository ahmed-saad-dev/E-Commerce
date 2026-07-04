/**
 * Shared helpers for working with DummyJSON-style categories.
 *
 * A product's `category` field can be either:
 *   - a plain string, e.g. "beauty" or "mens-shirts"
 *   - an object, e.g. { slug: "beauty", name: "Beauty", url: "..." }
 *
 * These helpers normalize both shapes so the rest of the app
 * only ever has to deal with a slug + a readable display name.
 */

/**
 * Turns a slug like "mens-shirts" into "Mens Shirts".
 */
export const formatCategoryLabel = (slug = "") =>
  slug
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * Returns the category slug for a product, regardless of whether
 * `product.category` is a string or a { slug, name } object.
 */
export const getCategorySlug = (product) =>
  typeof product?.category === "string"
    ? product.category
    : product?.category?.slug || "";

/**
 * Returns a human-readable category name for a product.
 * Falls back to formatting the slug when no explicit name exists.
 */
export const getCategoryLabel = (product) => {
  const category = product?.category;

  if (typeof category === "string") {
    return formatCategoryLabel(category);
  }

  return category?.name || formatCategoryLabel(category?.slug) || "Product";
};