/**
 * CATEGORY_TREE
 * ─────────────
 * DummyJSON does not expose a real "sub category" or hierarchical
 * structure — every product only has a flat `category` slug
 * (e.g. "smartphones", "mens-shirts", "skin-care"...).
 *
 * To build an Amazon/Noon-style Category → SubCategory → Brand
 * cascading filter, we define this tree once, statically, and map
 * each business-friendly SubCategory to the real DummyJSON slug(s)
 * that belong to it.
 *
 * Structure:
 * {
 *   "<Category Label>": {
 *     "<SubCategory Label>": ["dummyjson-slug", "dummyjson-slug", ...]
 *   }
 * }
 */
export const CATEGORY_TREE = {
  Electronics: {
    Smartphones: ["smartphones"],
    Laptops: ["laptops"],
    Tablets: ["tablets"],
    Accessories: ["mobile-accessories"],
  },
  Fashion: {
    Men: ["mens-shirts", "mens-shoes", "mens-watches"],
    Women: [
      "womens-dresses",
      "womens-shoes",
      "womens-bags",
      "womens-jewellery",
      "womens-watches",
      "tops",
    ],
    Eyewear: ["sunglasses"],
  },
  Beauty: {
    Makeup: ["beauty"],
    "Skin Care": ["skin-care"],
    Fragrances: ["fragrances"],
  },
  Home: {
    Furniture: ["furniture"],
    Decoration: ["home-decoration"],
    Kitchen: ["kitchen-accessories"],
    Groceries: ["groceries"],
  },
  Sports: {
    Accessories: ["sports-accessories"],
  },
  Vehicles: {
    Motorcycles: ["motorcycle"],
    Cars: ["vehicle"],
  },
};

export const ALL = "All";

/** Top-level category labels, e.g. ["Electronics", "Fashion", ...] */
export const getCategoryLabels = () => Object.keys(CATEGORY_TREE);

/** SubCategory labels that belong to a given top-level category. */
export const getSubCategoryLabels = (categoryLabel) => {
  if (categoryLabel === ALL || !CATEGORY_TREE[categoryLabel]) return [];
  return Object.keys(CATEGORY_TREE[categoryLabel]);
};

/** Flat list of every DummyJSON slug that belongs to a category (all its sub categories combined). */
export const getSlugsForCategory = (categoryLabel) => {
  const subTree = CATEGORY_TREE[categoryLabel];
  if (!subTree) return [];
  return Object.values(subTree).flat();
};

/** DummyJSON slugs that belong to one specific sub category. */
export const getSlugsForSubCategory = (categoryLabel, subCategoryLabel) => {
  if (subCategoryLabel === ALL) return getSlugsForCategory(categoryLabel);
  return CATEGORY_TREE[categoryLabel]?.[subCategoryLabel] || [];
};

/**
 * Finds which top-level Category + SubCategory a raw DummyJSON slug
 * belongs to. Useful for showing a readable label for a single product.
 */
export const findCategoryPathForSlug = (slug) => {
  for (const [categoryLabel, subTree] of Object.entries(CATEGORY_TREE)) {
    for (const [subCategoryLabel, slugs] of Object.entries(subTree)) {
      if (slugs.includes(slug)) {
        return { category: categoryLabel, subCategory: subCategoryLabel };
      }
    }
  }
  return { category: null, subCategory: null };
};