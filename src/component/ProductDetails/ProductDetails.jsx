import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import RelatedProduct from "../RelatedProduct/RelatedProduct";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import Footer from "../Footer/Footer";
// import { CartContext } from "../../Context/CartContext";
import { cartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../Context/ThemeContext"; // ✅
import Navbar from "../Navbar/Navbar";

export default function ProductDetails() {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext); // ✅
  const dk = theme === "dark"; // ✅ shortcut

  const [product, setProduct]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [activeImg, setActiveImg]     = useState(0);
  const [zoom, setZoom]               = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingFav, setLoadingFav]   = useState(false);
  const [qty, setQty]                 = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useContext(cartContext);
  const { toggleWishlist, isInWishlist }  = useContext(WishlistContext);

  const fav = product ? isInWishlist(product.id) : false;

  async function getProduct() {
    try {
      const { data } = await axios.get(`https://egzone.runasp.net/api/Products/${id}`);
      setProduct(data);
    } catch {
      toast.error("Error loading product");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getProduct(); setActiveImg(0); }, [id]);

  const imgFix = (url) => url?.startsWith("http") ? url : `https://egzone.runasp.net${url}`;

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
    if (!token) { toast.error("Please login first"); return; }
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

  const discountedPrice = Math.round(product?.price * 1.2);
  const saving = discountedPrice - product?.price;

  // ✅ الـ styles دلوقتي بتتغير حسب الـ theme
  const styles = {
    page: {
      background: dk ? "#121212" : "#faf8f4",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.3s ease",
      marginBottom: "30px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      minHeight: "calc(100vh - 80px)",
    },
    left: {
      background: dk ? "#1e1e1e" : "#fff",
      padding: 32,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      borderRight: `1px solid ${dk ? "#333" : "#e8e2d9"}`,
      position: "sticky",
      top: 0,
      height: "100vh",
      overflowY: "auto",
    },
    galleryMain: {
      background: dk ? "#2a2a2a" : "#faf8f4",
      borderRadius: 16,
      aspectRatio: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      cursor: "zoom-in",
    },
    mainImg: { width: "80%", height: "80%", objectFit: "contain" },
    zoomBadge: {
      position: "absolute",
      top: 12,
      right: 12,
      background: dk ? "rgba(30,30,30,0.9)" : "rgba(255,255,255,0.9)",
      border: `1px solid ${dk ? "#444" : "#e8e2d9"}`,
      borderRadius: 20,
      padding: "4px 10px",
      fontSize: 11,
      color: dk ? "#aaa" : "#8a8580",
    },
    thumbRow: { display: "flex", gap: 10, flexWrap: "wrap" },
    right: {
      padding: "40px 36px",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      height: "100vh",
      background: dk ? "#121212" : "#fff",
    },
    tag: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: dk ? "#2a2a2a" : "#f5edd8",
      color: dk ? "#c8a96e" : "#9a7030",
      borderRadius: 20,
      padding: "4px 14px",
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: ".5px",
      marginBottom: 14,
      width: "fit-content",
    },
    productName: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 34,
      fontWeight: 900,
      lineHeight: 1.15,
      color: dk ? "#fff" : "#1a1714",
      marginBottom: 10,
    },
    ratingRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 18 },
    desc: {
      fontSize: 15,
      color: dk ? "#aaa" : "#8a8580",
      lineHeight: 1.75,
      marginBottom: 20,
    },
    divider: { height: 1, background: dk ? "#333" : "#e8e2d9", margin: "18px 0" },
    priceRow: { display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 },
    priceMain: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 38,
      fontWeight: 700,
      color: dk ? "#fff" : "#1a1714",
    },
    priceOld: {
      fontSize: 18,
      color: dk ? "#777" : "#8a8580",
      textDecoration: "line-through",
    },
    saleChip: {
      background: "#b5392a",
      color: "#fff",
      borderRadius: 6,
      padding: "3px 8px",
      fontSize: 11,
      fontWeight: 500,
    },
    saving: { fontSize: 13, color: dk ? "#4ade80" : "#2d5a3d", marginBottom: 0 },
    actionRow: { display: "flex", alignItems: "center", gap: 12, marginTop: 4 },
    qtyCtrl: {
      display: "flex",
      alignItems: "center",
      border: `1.5px solid ${dk ? "#444" : "#e8e2d9"}`,
      borderRadius: 10,
      overflow: "hidden",
      flexShrink: 0,
    },
    qtyBtn: {
      width: 36, height: 48,
      background: dk ? "#2a2a2a" : "none",
      border: "none",
      cursor: "pointer",
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: dk ? "#fff" : "#1a1714",
    },
    qtyNum: {
      width: 38, textAlign: "center", fontWeight: 600, fontSize: 15,
      borderLeft: `1.5px solid ${dk ? "#444" : "#e8e2d9"}`,
      borderRight: `1.5px solid ${dk ? "#444" : "#e8e2d9"}`,
      height: 48, display: "flex", alignItems: "center", justifyContent: "center",
      color: dk ? "#fff" : "#1a1714",
      background: dk ? "#1e1e1e" : "none",
    },
    btnCart: {
      flex: 1, border: "none", borderRadius: 12,
      padding: "14px 20px", fontSize: 15, fontWeight: 500,
      cursor: "pointer", display: "flex", alignItems: "center",
      justifyContent: "center", gap: 8, fontFamily: "inherit",
      transition: "background .2s, box-shadow .2s",
    },
    btnFav: {
      width: 50, height: 50,
      border: `1.5px solid ${dk ? "#444" : "#e8e2d9"}`,
      borderRadius: 12, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 22, flexShrink: 0, transition: "all .2s",
      background: dk ? "#2a2a2a" : "#fff",
    },
    features: { display: "flex", flexWrap: "wrap", gap: 8 },
    feature: {
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 12, color: dk ? "#ccc" : "#5a5750",
      background: dk ? "#2a2a2a" : "#f5f2ee",
      border: `1px solid ${dk ? "#444" : "#e8e2d9"}`,
      borderRadius: 20, padding: "5px 12px", fontWeight: 500,
    },
    trust: { display: "flex", gap: 10, marginTop: 18 },
    trustItem: {
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, flex: 1, padding: "12px 8px",
      background: dk ? "#1e1e1e" : "#faf8f4",
      border: `1px solid ${dk ? "#333" : "#e8e2d9"}`,
      borderRadius: 10, textAlign: "center",
    },
  };

  return (
    <>
      <Helmet>
        <title>{product?.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </Helmet>

        <Navbar></Navbar>

      <div style={styles.page}>
        <div style={styles.grid}>

          {/* LEFT */}
          <div style={styles.left}>
            <motion.div style={styles.galleryMain} onClick={() => setZoom(true)}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={imgFix(product?.images?.[activeImg]?.url)}
                  alt={product?.name}
                  style={styles.mainImg}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>
              <div style={styles.zoomBadge}>🔍 zoom</div>
            </motion.div>

            <div style={styles.thumbRow}>
              {product?.images?.map((img, i) => (
                <motion.img
                  key={i}
                  src={imgFix(img?.url)}
                  alt={`View ${i + 1}`}
                  whileHover={{ scale: 1.08, y: -2 }}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 64, height: 64, borderRadius: 10,
                    objectFit: "cover", cursor: "pointer",
                    border: activeImg === i
                      ? "2px solid #c8a96e"
                      : `1.5px solid ${dk ? "#444" : "#e8e2d9"}`,
                    transition: "border-color .2s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={styles.right}>
            <div style={styles.tag}>🏷 {product?.category}</div>
            <h1 style={styles.productName}>{product?.name}</h1>

            <div style={styles.ratingRow}>
              <span style={{ color: "#c8a96e", fontSize: 14, letterSpacing: 2 }}>★★★★★</span>
              <span style={{ fontSize: 13, color: dk ? "#aaa" : "#8a8580" }}>Premium product</span>
            </div>

            <p style={styles.desc}>{product?.description}</p>
            <div style={styles.divider} />

            <div style={styles.priceRow}>
              <span style={styles.priceMain}>{product?.price} EGP</span>
              <span style={styles.priceOld}>{discountedPrice} EGP</span>
              <span style={styles.saleChip}>SALE</span>
            </div>
            <div style={styles.saving}>💚 You save {saving} EGP</div>
            <div style={styles.divider} />

            <div style={styles.actionRow}>
              <div style={styles.qtyCtrl}>
                <button style={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <div style={styles.qtyNum}>{qty}</div>
                <button style={styles.qtyBtn} onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                style={{
                  ...styles.btnCart,
                  background: added
                    ? "linear-gradient(135deg,#065f46,#047857)"
                    : "linear-gradient(135deg,#16a34a,#059669)",
                  color: "#fff",
                  boxShadow: added ? "0 4px 24px rgba(16,185,129,.35)" : "0 4px 20px rgba(16,185,129,.22)",
                }}
                onClick={handleCart}
                disabled={loadingCart}
              >
                {loadingCart ? "Adding..." : added ? "✓ Added!" : "🛒 Add to Cart"}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.85 }}
                style={{
                  ...styles.btnFav,
                  borderColor: fav ? "#e11d48" : (dk ? "#444" : "#e8e2d9"),
                  background: fav ? "#fff1f2" : (dk ? "#2a2a2a" : "#fff"),
                  color: fav ? "#e11d48" : (dk ? "#fff" : "#1a1714"),
                }}
                onClick={handleFav}
                disabled={loadingFav}
                aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
              >
                {loadingFav ? "..." : fav ? "♥" : "♡"}
              </motion.button>
            </div>

            <div style={styles.divider} />

            <div style={styles.features}>
              {[
                { icon: "🚚", label: "Fast Delivery" },
                { icon: "🔒", label: "Secure Payment" },
                { icon: "⭐", label: "Premium Quality" },
                { icon: "🔄", label: "30-Day Returns" },
              ].map(({ icon, label }) => (
                <div key={label} style={styles.feature}>
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>

            <div style={styles.trust}>
              {[
                { icon: "🚚", label: "Fast\nDelivery" },
                { icon: "🛡", label: "Secure\nPayment" },
                { icon: "🔄", label: "30-Day\nReturns" },
                { icon: "🏅", label: "2-Year\nWarranty" },
              ].map(({ icon, label }) => (
                <div key={label} style={styles.trustItem}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: dk ? "#aaa" : "#8a8580", whiteSpace: "pre-line", lineHeight: 1.3 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ZOOM MODAL */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "zoom-out" }}
          >
            <motion.img
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={imgFix(product?.images?.[activeImg]?.url)}
              alt={product?.name}
              style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 16 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <RelatedProduct ProductID={id} CategoryName={product?.category} />
      <Footer />
    </>
  );
}