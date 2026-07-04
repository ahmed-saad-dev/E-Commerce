import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Offers.module.css";
import { Link } from "react-router-dom";
import { FaPercentage } from "react-icons/fa";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOffers();
  }, []);

  async function getOffers() {
    try {
      const { data } = await axios.get(
        "https://egzone.runasp.net/api/Products"
      );

      const products = data?.data || data || [];

      // المنتجات اللي عليها خصم
      const discountedProducts = products.filter(
        (item) =>
          item.discountPercentage > 0 ||
          item.discount > 0 ||
          item.oldPrice > item.price
      );

      setOffers(discountedProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <h3>جاري تحميل العروض...</h3>
      </div>
    );
  }

  return (
    <div className={styles.offersPage}>
      <div className={styles.header}>
        <FaPercentage />
        <h2>عروض اليوم</h2>
      </div>

      <div className={styles.productsGrid}>
        {offers.map((product) => (
          <Link
            to={`/ProductDetails/${product.id}`}
            key={product.id}
            className={styles.card}
          >
            <img
              src={
                product?.images?.[0]?.url ||
                product?.imageUrl ||
                "https://via.placeholder.com/300"
              }
              alt={product.name}
            />

            <div className={styles.content}>
              <h3>{product.name}</h3>

              <div className={styles.priceBox}>
                <span className={styles.price}>
                  {product.price} EGP
                </span>

                {(product.oldPrice || product.discountPercentage) && (
                  <>
                    <span className={styles.oldPrice}>
                      {product.oldPrice} EGP
                    </span>

                    <span className={styles.discount}>
                      -
                      {product.discountPercentage ||
                        product.discount}
                      %
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {offers.length === 0 && (
        <div className={styles.empty}>
          لا توجد عروض متاحة حالياً
        </div>
      )}
    </div>
  );
}