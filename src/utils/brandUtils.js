/**
 * Helpers for extracting and filtering products by brand.
 * DummyJSON products expose a plain `brand` string field
 * (e.g. "Apple", "Samsung"). Not every category has brands
 * (e.g. furniture, home decoration), so these helpers are
 * defensive about missing/empty values.
 */

/**
 * Unique, sorted list of brand names present in a given product list.
 */
export const getAvailableBrands = (products = []) => {
  const brands = new Set(
    products.map((p) => p?.brand).filter((brand) => Boolean(brand && brand.trim()))
  );
  return [...brands].sort((a, b) => a.localeCompare(b));
};

/**
 * Whether a product matches a chosen brand ("All" always matches).
 */
export const matchesBrand = (product, activeBrand) => {
  if (activeBrand === "All") return true;
  return product?.brand === activeBrand;
};