import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import RelatedProduct from "../RelatedProduct/RelatedProduct";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import Footer from "../Footer/Footer";
import { cartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import Navbar from "../Navbar/Navbar";
import styles from "./ProductDetails.module.css"; // ✅ استيراد الـ CSS المنفصل
import api from "../../api/api";
import { getCategoryLabel } from "../../utils/categoryUtils";

/* ─── responsive breakpoint helpers ─── */
const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
};

export default function ProductDetails() {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const dk = theme === "dark";
  const width = useWindowWidth();

  /* breakpoints */
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useContext(cartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const fav = product ? isInWishlist(product.id) : false;

  async function getProduct() {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch {
      toast.error("Error loading product");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
    setActiveImg(0);
  }, [id]);

  /* DummyJSON already returns full, absolute image URLs (cdn.dummyjson.com),
     so no prefixing is needed — kept as a thin pass-through helper in case
     a future API ever returns relative paths again. */
  const imgFix = (url) => url;

  /* DummyJSON `images` is an array of plain string URLs (not objects),
     with `thumbnail` as a safe single-image fallback. */
  const productImages = product?.images?.length ? product.images : [product?.thumbnail].filter(Boolean);

  async function handleCart() {
    try {
      setLoadingCart(true);
      await addToCart(product.id, qty);
      setAdded(true);
      toast.success("Added to cart 🛒");
      setTimeout(() => setAdded(false), 2000);
    } catch {
      toast.error("Error adding to cart");
    } finally {
      setLoadingCart(false);
    }
  }

  async function handleFav() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      return;
    }
    setLoadingFav(true);
    const ok = await toggleWishlist(product.id);
    if (ok) {
      toast.success(fav ? "Removed from wishlist" : "Added to wishlist ❤️");
    } else {
      toast.error("Something went wrong");
    }
    setLoadingFav(false);
  }

  if (loading) return <Loader />;
  if (!product) return null;

  /* DummyJSON ships its own discountPercentage; fall back to the
     original 1.2x markup only if that field is ever missing. */
  const discountedPrice = product?.discountPercentage
    ? Math.round(product.price / (1 - product.discountPercentage / 100))
    : Math.round(product?.price * 1.2);
  const saving = discountedPrice - product?.price;

  return (
    <>
      <Helmet>
        <title>{product?.title}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <Navbar />

      <div className={`${styles.page} ${dk ? styles.dark : ""}`}>
        <div className={styles.grid} data-desktop={isDesktop}>

          {/* ── LEFT: image panel ── */}
          <div className={styles.left}>
            <motion.div className={styles.galleryMain} onClick={() => setZoom(true)}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={imgFix(productImages?.[activeImg])}
                  alt={product?.title}
                  className={styles.mainImg}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>
              <div className={styles.zoomBadge}>🔍 zoom</div>
            </motion.div>

            <div className={styles.thumbRow}>
              {productImages?.map((img, i) => (
                <motion.img
                  key={i}
                  src={imgFix(img)}
                  alt={`View ${i + 1}`}
                  whileHover={{ scale: 1.08, y: -2 }}
                  onClick={() => setActiveImg(i)}
                  className={`${styles.thumbImg} ${activeImg === i ? styles.activeThumb : ""}`}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT: info panel ── */}
          <div className={styles.right}>
            <div className={styles.tag}>🏷 {getCategoryLabel(product)}</div>
            <h1 className={styles.productName}>{product?.title}</h1>

            <div className={styles.ratingRow}>
              <span className={styles.stars}>★★★★★</span>
              <span className={styles.ratingText}>
                {product?.brand ? `${product.brand} · Premium product` : "Premium product"}
              </span>
            </div>

            <p className={styles.desc}>{product?.description}</p>
            <div className={styles.divider} />

            <div className={styles.priceRow}>
              <span className={styles.priceMain}>${product?.price}</span>
              <span className={styles.priceOld}>${discountedPrice}</span>
              <span className={styles.saleChip}>SALE</span>
            </div>
            <div className={styles.saving}>💚 You save ${saving}</div>
            <div className={styles.divider} />

            <div className={styles.actionRow}>
              <div className={styles.qtyCtrl}>
                <button className={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <div className={styles.qtyNum}>{qty}</div>
                <button className={styles.qtyBtn} onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                className={`${styles.btnCart} ${added ? styles.btnCartAdded : ""}`}
                onClick={handleCart}
                disabled={loadingCart}
              >
                {loadingCart ? "Adding..." : added ? "✓ Added!" : "🛒 Add to Cart"}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.85 }}
                className={`${styles.btnFav} ${fav ? styles.btnFavActive : ""}`}
                onClick={handleFav}
                disabled={loadingFav}
                aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
              >
                {loadingFav ? "..." : fav ? "♥" : "♡"}
              </motion.button>
            </div>

            <div className={styles.divider} />

            <div className={styles.features}>
              {[
                { icon: "🚚", label: "Fast Delivery" },
                { icon: "🔒", label: "Secure Payment" },
                { icon: "⭐", label: "Premium Quality" },
                { icon: "🔄", label: "30-Day Returns" },
              ].map(({ icon, label }) => (
                <div key={label} className={styles.feature}>
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>

            <div className={styles.trust}>
              {[
                { icon: "🚚", label: "Fast\nDelivery" },
                { icon: "🛡", label: "Secure\nPayment" },
                { icon: "🔄", label: "30-Day\nReturns" },
                { icon: "🏅", label: "2-Year\nWarranty" },
              ].map(({ icon, label }) => (
                <div key={label} className={styles.trustItem}>
                  <span className={styles.trustIcon}>{icon}</span>
                  <span className={styles.trustLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ZOOM MODAL ── */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className={styles.zoomModal}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={imgFix(productImages?.[activeImg])}
              alt={product?.title}
              className={styles.zoomImg}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <RelatedProduct ProductID={id} CategoryName={getCategoryLabel(product)} />
      <Footer />
    </>
  );
}