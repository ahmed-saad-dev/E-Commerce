import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ThemeContext } from "../../Context/ThemeContext";
import styles from "./Category.module.css";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // ================= GET PRODUCTS & EXTRACT CATEGORIES =================
  const getCategoriesFromProducts = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const { data } = await axios.get(
        "https://egzone.runasp.net/api/Products",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: { pageSize: 100 },
        }
      );

      let products = [];

      if (Array.isArray(data)) {
        products = data;
      } else if (data.data && Array.isArray(data.data)) {
        products = data.data;
      } else if (data.$values && Array.isArray(data.$values)) {
        products = data.$values;
      } else if (data.items && Array.isArray(data.items)) {
        products = data.items;
      }

      // استخراج الكاتيجوري بدون تكرار
      const uniqueCategories = [];
      const addedNames = new Set();

      products.forEach((product) => {
        const category = product.category || product.categoryDto || {};
        const categoryName = category.name || category.categoryName || product.categoryName;

        if (categoryName && !addedNames.has(categoryName)) {
          addedNames.add(categoryName);

          uniqueCategories.push({
            id: category.id || categoryName,
            name: categoryName,
            image: category.image || category.imageUrl || "/default-category.png",
          });
        }
      });

      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoriesFromProducts();
  }, []);

  // ================= RESPONSIVE =================
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2,
    },
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.container} ${isDark ? "dark" : ""}`}>
      <h2 className={styles.title}>Shop by Category</h2>

      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        transitionDuration={500}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
      >
        {categories.map((cat) => (
          <div key={cat.id} className={styles.imagContainer}>
            <img
              src={cat.image}
              alt={cat.name}
              className={styles.imgStyle}
              onError={(e) => {
                e.target.src = "/default-category.png";
              }}
            />
            <p className={styles.categoryName}>{cat.name}</p>
            <p className={styles.productCount}>Explore now →</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}