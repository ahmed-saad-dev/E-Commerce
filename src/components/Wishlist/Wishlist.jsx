import React, { useEffect, useContext } from "react";
import { useWishlist } from "../../Context/WishlistContext";
import { Link } from "react-router-dom";
import { FaHeartBroken, FaHeart, FaTrashAlt, FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../Context/ThemeContext";
import Navbar from "../Navbar/Navbar";
import styles from "./Wishlist.module.css";

export default function Wishlist() {
  const { wishlist, getWishlist, removeFromWishlist } = useWishlist();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  useEffect(() => {
    getWishlist();
  }, []);

  const getProduct = (item) => item?.product ?? item;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <Navbar />

      <div className={`${styles.container} ${isDark ? styles.dark : ""}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>My Wishlist</h1>
            <p className={styles.subtitle}>
              {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"} Saved
            </p>
          </div>

          <div className={styles.headerDecoration}>
            <FaHeart className={styles.headerIcon} />
          </div>
        </div>

        {/* Empty */}
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.emptyState}
          >
            <div className={styles.emptyIcon}>
              <FaHeartBroken />
            </div>

            <h3 className={styles.emptyTitle}>
              Your Wishlist Is Empty
            </h3>

            <p className={styles.emptyText}>
              Save products you love and they'll appear here.
            </p>

            <Link to="/" className={styles.shopBtn}>
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.grid}
          >
            <AnimatePresence>
              {wishlist.map((item) => {
                const product = getProduct(item);

                const imageUrl =
                  product.thumbnail ||
                  product.images?.[0] ||
                  product.imageUrl ||
                  product.image ||
                  "https://via.placeholder.com/400x400?text=No+Image";

                return (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    layout
                    exit="exit"
                    whileHover={{ y: -8 }}
                    className={styles.card}
                  >
                    {/* Image */}
                    <div className={styles.imageContainer}>
                      <img
                        src={imageUrl}
                        alt={product.title || product.name || "Product"}
                        className={styles.productImage}
                        loading="lazy"
                      />

                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <FaTrashAlt />
                      </button>

                      <div className={styles.imageOverlay}>
                        <Link
                          to={`/ProductDetails/${product.id}`}
                          className={styles.viewBtn}
                        >
                          <FaEye /> Quick View
                        </Link>
                      </div>
                    </div>

                    {/* Body */}
                    <div className={styles.cardBody}>
                      <h3 className={styles.productName}>
                        {product.title || product.name}
                      </h3>

                      <div className={styles.priceRow}>
                        <span className={styles.price}>
                          ${product.price}
                        </span>

                        {product.discountPercentage && (
                          <span className={styles.oldPrice}>
                            -{Math.round(product.discountPercentage)}%
                          </span>
                        )}
                      </div>

                      <div className={styles.rating}>
                        <span className={styles.stars}>
                          ⭐⭐⭐⭐⭐
                        </span>

                        <span className={styles.ratingCount}>
                          ({product.rating})
                        </span>
                      </div>

                      <div className={styles.actions}>
                        <Link
                          to={`/ProductDetails/${product.id}`}
                          className={styles.detailsBtn}
                        >
                          View Details
                        </Link>

                        <button
                          className={styles.removeWishlistBtn}
                          onClick={() => removeFromWishlist(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
}