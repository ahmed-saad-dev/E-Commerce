import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import Loader from "../Loader/Loader";
import { toast } from "react-hot-toast";
import MainSlider from "../MainSlider/MainSlider";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Footer from "../Footer/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { cartContext } from "../../Context/CartContext";
import CategorySlider from "../CategorySlider/Categoryslider";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { useWishlist } from "../../Context/WishlistContext";
import Navbar from "../Navbar/Navbar";
import styles from "./Products.module.css";
import api from "../../api/api";
import { getCategoryLabel } from "../../utils/categoryUtils";
import { ALL, getCategoryLabels, getSubCategoryLabels, getSlugsForSubCategory } from "../../utils/categoryTree";
import { getAvailableBrands } from "../../utils/brandUtils";

const BRAND_SEARCH_THRESHOLD = 8;

/**
 * Returns the raw DummyJSON category slug for a product, regardless
 * of whether `product.category` is a string or a { slug, name } object.
 * Kept local since it only deals with matching against CATEGORY_TREE slugs.
 */
function getRawCategorySlug(product) {
  return typeof product?.category === "string" ? product.category : product?.category?.slug || "";
}

/**
 * DummyJSON's `price` field is the actual price the customer pays;
 * `discountPercentage` tells us how much was knocked off. We derive the
 * pre-discount ("original") price from that so the card can show a
 * strikethrough price + a "-XX%" badge. Mirrors the same formula already
 * used in ProductDetails.jsx so prices are consistent across the app.
 */
function getPriceInfo(product) {
  const price = product?.price ?? 0;
  const discountPercentage = product?.discountPercentage ?? 0;
  const hasDiscount = discountPercentage >= 1;
  const originalPrice = hasDiscount ? price / (1 - discountPercentage / 100) : price;

  return {
    price,
    hasDiscount,
    originalPrice,
    discountPercent: Math.round(discountPercentage),
  };
}

export default function Products() {
  const { addToCart } = useContext(cartContext);
const { toggleWishlist, isInWishlist, wishlist } = useWishlist();

  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const initialCategory =
    categoryFromUrl && getCategoryLabels().includes(categoryFromUrl) ? categoryFromUrl : ALL;

  /* ── hierarchical filter state ── */
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSubCategory, setActiveSubCategory] = useState(ALL);
  const [activeBrands, setActiveBrands] = useState([]); // multi-select
  const [brandSearch, setBrandSearch] = useState("");

  /* ── fetch products ──
     Full catalog fetched once; every filter level (category → sub
     category → brand) is derived from it on the client. No extra
     API requests are made when filters change. */
  const getProducts = async () => {
    const { data } = await api.get("/products?limit=100");
    return data.products;
  };

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (categoryFromUrl && getCategoryLabels().includes(categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
      setActiveSubCategory(ALL);
    }
  }, [categoryFromUrl]);

  /* ── products filtered by category only (used for category counts) ── */
  const getProductsForCategory = useCallback(
    (categoryLabel) => {
      if (categoryLabel === ALL) return products;
      const allowedSlugs = getSlugsForSubCategory(categoryLabel, ALL);
      return products.filter((product) => allowedSlugs.includes(getRawCategorySlug(product)));
    },
    [products]
  );

  /* ── LEVEL 1 — category chips, each with a product count ── */
  const categoryOptions = useMemo(
    () =>
      getCategoryLabels().map((label) => ({
        label,
        count: getProductsForCategory(label).length,
      })),
    [getProductsForCategory]
  );

  /* ── products scoped to the active category (sub category not yet applied) ── */
  const productsInCategory = useMemo(
    () => getProductsForCategory(activeCategory),
    [getProductsForCategory, activeCategory]
  );

  /* ── LEVEL 2 — sub category chips, scoped to the active category, with counts ── */
  const subCategoryOptions = useMemo(() => {
    if (activeCategory === ALL) return [];
    return getSubCategoryLabels(activeCategory).map((label) => {
      const slugs = getSlugsForSubCategory(activeCategory, label);
      const count = products.filter((product) => slugs.includes(getRawCategorySlug(product))).length;
      return { label, count };
    });
  }, [products, activeCategory]);

  /* ── products scoped to category + sub category (brand not yet applied) ── */
  const productsInScope = useMemo(() => {
    if (activeCategory === ALL) return products;
    const allowedSlugs = getSlugsForSubCategory(activeCategory, activeSubCategory);
    return products.filter((product) => allowedSlugs.includes(getRawCategorySlug(product)));
  }, [products, activeCategory, activeSubCategory]);

  /* ── LEVEL 3 — brand chips, scoped to whatever is currently in scope, with counts ── */
  const brandOptions = useMemo(() => {
    if (activeCategory === ALL) return [];
    return getAvailableBrands(productsInScope).map((brand) => ({
      label: brand,
      count: productsInScope.filter((product) => product?.brand === brand).length,
    }));
  }, [activeCategory, productsInScope]);

  const visibleBrandOptions = useMemo(() => {
    if (!brandSearch.trim()) return brandOptions;
    const query = brandSearch.trim().toLowerCase();
    return brandOptions.filter((brand) => brand.label.toLowerCase().includes(query));
  }, [brandOptions, brandSearch]);

  /* ── final product list after applying the (multi-select) brand filter ── */
  const finalProducts = useMemo(() => {
    if (activeBrands.length === 0) return productsInScope;
    return productsInScope.filter((product) => activeBrands.includes(product?.brand));
  }, [productsInScope, activeBrands]);

  const activeCategoryLabel = activeCategory === ALL ? "Our Products" : activeCategory;

  /* ── handlers ──
     Selecting a category resets sub category + brand.
     Selecting a sub category resets brand only. */
  const handleCategorySelect = useCallback((categoryLabel) => {
    setActiveCategory(categoryLabel);
    setActiveSubCategory(ALL);
    setActiveBrands([]);
    setBrandSearch("");
  }, []);

  const handleSubCategorySelect = useCallback((subCategoryLabel) => {
    setActiveSubCategory(subCategoryLabel);
    setActiveBrands([]);
    setBrandSearch("");
  }, []);

  const handleBrandToggle = useCallback((brand) => {
    setActiveBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }, []);

  const handleClearBrands = useCallback(() => setActiveBrands([]), []);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(productId);
      toast.success("Added to Cart ✓");
    } catch {
      toast.error("Failed to add");
    }
  };

const handleWishlistToggle = (e, product) => {
  e.preventDefault();
  e.stopPropagation();

  const wasInWishlist = isInWishlist(product.id);

  toggleWishlist(product);

  toast.success(
    wasInWishlist
      ? "Removed from Wishlist 💔"
      : "Added to Wishlist ❤️"
  );
};

  /* ── states ── */
  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <p style={{ color: "#8888aa", marginBottom: 16 }}>Error loading products.</p>
        <button onClick={() => window.location.reload()} className={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Products — EGZone</title>
      </Helmet>

      <Navbar />
      <MainSlider />

      <div className="container my-5">
        {/* BREADCRUMB */}
        <nav className={styles.subCategoriesTitle} aria-label="breadcrumb">
          Home
          {activeCategory !== ALL && <> &gt; {activeCategory}</>}
          {activeCategory !== ALL && activeSubCategory !== ALL && <> &gt; {activeSubCategory}</>}
          {activeBrands.length > 0 && <> &gt; {activeBrands.join(", ")}</>}
        </nav>

        {/* LEVEL 1 — CATEGORY */}
        <CategorySlider
          categories={categoryOptions.map(({ label, count }) => ({
            slug: label,
            name: `${label} (${count})`,
          }))}
          onFilter={handleCategorySelect}
          activeCategory={activeCategory}
        />

        {/* LEVEL 2 — SUB CATEGORY */}
        {subCategoryOptions.length > 0 && (
          <div className={styles.subCategoriesWrapper}>
            <div className={styles.subCategoriesTitle}>Browse {activeCategoryLabel}</div>
            <div className={styles.subCategoriesGrid}>
              <button
                type="button"
                className={`${styles.subCategoryBtn} ${activeSubCategory === ALL ? styles.activeSub : ""}`}
                onClick={() => handleSubCategorySelect(ALL)}
                aria-pressed={activeSubCategory === ALL}
              >
                All ({productsInCategory.length})
              </button>
              {subCategoryOptions.map(({ label, count }) => (
                <button
                  key={label}
                  type="button"
                  className={`${styles.subCategoryBtn} ${
                    activeSubCategory === label ? styles.activeSub : ""
                  }`}
                  onClick={() => handleSubCategorySelect(label)}
                  aria-pressed={activeSubCategory === label}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LEVEL 3 — BRAND (multi-select) */}
        {brandOptions.length > 0 && (
          <div className={styles.subCategoriesWrapper}>
            <div className={styles.subCategoriesTitle}>
              Filter by Brand
              {activeBrands.length > 0 && (
                <button type="button" onClick={handleClearBrands} className={styles.subCategoryBtn}>
                  Clear
                </button>
              )}
            </div>

            {brandOptions.length > BRAND_SEARCH_THRESHOLD && (
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands..."
                className={styles.subCategoryBtn}
                style={{ width: "100%", maxWidth: 280, marginBottom: 10, textAlign: "left", cursor: "text" }}
                aria-label="Search brands"
              />
            )}

            <div className={styles.subCategoriesGrid}>
              {visibleBrandOptions.map(({ label, count }) => {
                const isChecked = activeBrands.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleBrandToggle(label)}
                    className={`${styles.subCategoryBtn} ${isChecked ? styles.activeSub : ""}`}
                    aria-pressed={isChecked}
                  >
                    {isChecked ? "☑" : "☐"} {label} ({count})
                  </button>
                );
              })}
              {visibleBrandOptions.length === 0 && (
                <span className={styles.productsCount}>No brands match "{brandSearch}"</span>
              )}
            </div>
          </div>
        )}

        {/* HEADER ROW */}
        <div className={styles.headerRow}>
          <h5 className={styles.productsTitle}>
            {activeCategoryLabel}
           {wishlist?.length > 0 && (
  <span className={styles.wishlistBadge}>
    ❤️ {wishlist.length}
  </span>
)}
          </h5>
          <span className={styles.productsCount}>{finalProducts.length} products</span>
        </div>

        {/* PRODUCTS GRID */}
        {finalProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No products found in this category.</p>
            <button onClick={() => handleCategorySelect(ALL)} className={styles.viewAllBtn}>
              View All Products
            </button>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {finalProducts.map((product) => {
              const { price, hasDiscount, originalPrice, discountPercent } = getPriceInfo(product);

              return (
                <div key={product.id} className={styles.productCard}>
                  <Link to={`/ProductDetails/${product.id}`} className={styles.productLink}>
                    {/* IMAGE */}
                    <div className={styles.imageContainer}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleWishlistToggle(e, product);
                        }}
                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                        className={`${styles.wishlistBtn} ${
                          isInWishlist(product.id) ? styles.wishlistActive : ""
                        }`}
                      >
                        {isInWishlist(product.id) ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
                      </button>

                      {hasDiscount && (
                        <span className={styles.discountBadge}>-{discountPercent}%</span>
                      )}

                      <img
                        src={product.images?.[0] || product.thumbnail || "/default-product.png"}
                        className={styles.productImage}
                        alt={product.title}
                        loading="lazy"
                        onError={(e) => (e.target.src = "/default-product.png")}
                      />

                      <span className={styles.categoryTag}>{getCategoryLabel(product)}</span>
                    </div>

                    {/* INFO */}
                    <div className={styles.productInfo}>
                      <h6 className={styles.productName}>{product.title}</h6>

                      {typeof product.rating === "number" && (
                        <div className={styles.ratingRow}>
                          <FaStar className={styles.ratingStar} />
                          <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
                        </div>
                      )}

                      <div className={styles.priceRow}>
                        <span className={styles.productPrice}>${price.toFixed(2)}</span>
                        {hasDiscount && (
                          <span className={styles.originalPrice}>${originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* CART */}
                  <div className={styles.cartBtnWrapper}>
                    <button onClick={(e) => handleAddToCart(e, product.id)} className={styles.cartBtn}>
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}