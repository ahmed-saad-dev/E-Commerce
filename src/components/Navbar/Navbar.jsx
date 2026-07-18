import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import navlogo from "../../assets/logo.png";
import styles from "./Navbar.module.css";

import { userContext } from "../../Context/userContext.jsx";
import { cartContext } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { useNotifications } from "../../Context/NotificationContext.jsx";

import {
  FaBell, FaShoppingCart, FaHeart,
  FaBars, FaTimes, FaHome, FaUser,
} from "react-icons/fa";
import { FiSearch, FiX } from "react-icons/fi";
import { MdFlashOn } from "react-icons/md";

const CATEGORIES = [
  "الكل",
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mobile-accessories",
  "smartphones",
  "sports-accessories",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
];

export default function Navbar() {
  const navigate   = useNavigate();
  const permission = useContext(userContext);
  const { cartQuantity } = useContext(cartContext);
  const { wishlist }     = useWishlist();
  const { unreadCount }  = useNotifications();

  const [searchInput,       setSearchInput]       = useState("");
  const [mobileSearchInput, setMobileSearchInput] = useState("");
  const [suggestions,       setSuggestions]       = useState([]);
  const [mobileSuggestions, setMobileSuggestions] = useState([]);
  const [products,          setProducts]          = useState([]);
  const [menuOpen,          setMenuOpen]          = useState(false);
  const [category,          setCategory]          = useState("الكل");

  const desktopInputRef = useRef();
  const drawerSearchInputRef = useRef();

  const searchProducts = async (keyword, setState) => {
    if (!keyword.trim()) {
      setState([]);
      return;
    }

    try {
      const { data } = await axios.get(
        "https://dummyjson.com/products/search",
        {
          params: {
            q: keyword,
          },
        }
      );

      let result = data.products;

      if (category !== "الكل") {
        result = result.filter(
          (product) =>
            product.category.toLowerCase() === category.toLowerCase()
        );
      }

      setState(result.slice(0, 6));
    } catch (error) {
      console.error(error);
      setState([]);
    }
  };

  /* ── desktop suggestions ── */
  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `https://dummyjson.com/products/search?q=${searchInput}`
        );

        setSuggestions(data.products.slice(0, 6));
      } catch (error) {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ── mobile suggestions ── */
  useEffect(() => {
    if (!mobileSearchInput.trim()) {
      setMobileSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `https://dummyjson.com/products/search?q=${mobileSearchInput}`
        );

        setMobileSuggestions(data.products.slice(0, 6));
      } catch (error) {
        setMobileSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [mobileSearchInput]);

  /* ── keyboard close ── */
  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [menuOpen]);

  /* ── lock background scroll while drawer is open ── */
  useEffect(() => {
    if (menuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [menuOpen]);

  /* ── autofocus the drawer search input once the slide-in finishes ── */
  useEffect(() => {
    if (menuOpen) {
      const t = setTimeout(() => drawerSearchInputRef.current?.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [menuOpen]);

  const getImage = (item) => {
    return item.thumbnail || item.images?.[0] || null;
  };

  const handleSelect = (item) => {
    setSearchInput("");
    setMobileSearchInput("");
    setSuggestions([]);
    setMobileSuggestions([]);
    setMenuOpen(false);

    navigate(`/ProductDetails/${item.id}`);
  };

  /* ── reusable dropdown ── */
  const Dropdown = ({ items }) => (
    <div className={styles.dropdown}>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.dropItem}
          onClick={() => handleSelect(item)}
        >
          <div className={styles.dropThumb}>
            <img src={getImage(item)} alt={item.title} />
          </div>

          <div className={styles.dropContent}>
            <h6 className={styles.dropName}>
              {item.title}
            </h6>

            <p className={styles.dropCategory}>
              {item.category}
            </p>

            <div className={styles.dropBottom}>
              <span className={styles.dropPrice}>
                ${item.price}
              </span>

              <span className={styles.dropRating}>
                ⭐ {item.rating}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  /* ── drawer navigation ── */
  const drawerSections = [
    [
      { icon: <FaHome />,         label: "الرئيسية", to: "/"          },
      { icon: <FaShoppingCart />, label: "السلة",    to: "/cart",     badge: cartQuantity     },
      { icon: <FaHeart />,        label: "المفضلة",  to: "/wishlist", badge: wishlist?.length },
      { icon: <FaUser />,         label: "الحساب",   to: "/userProf"  },
    ],
  ];

  return (
    <>
      {/* ══════════ DESKTOP NAVBAR ══════════ */}
      <header className={styles.header}>

        {/* TOP ROW */}
        <div className={styles.topRow}>

          {/* LOGO + MOBILE QUICK ACTIONS */}
          <div className={styles.leftGroup}>
            <Link to="/" className={styles.logo}>
              <img src={navlogo} alt="EGZone" className={styles.logoImg} />
            </Link>

            {/* mobile-only quick actions: heart + cart */}
            <div className={styles.mobileQuickActions}>
              <Link
                to="/wishlist"
                className={styles.mobileIconBtn}
                aria-label="المفضلة"
              >
                <FaHeart className={styles.mobileIcon} />
                {wishlist?.length > 0 && (
                  <span className={styles.mobileBadge}>{wishlist.length}</span>
                )}
              </Link>

              <Link
                to="/cart"
                className={styles.mobileIconBtn}
                aria-label="السلة"
              >
                <FaShoppingCart className={styles.mobileIcon} />
                {cartQuantity > 0 && (
                  <span className={styles.mobileBadge}>{cartQuantity}</span>
                )}
              </Link>
            </div>
          </div>

          {/* SEARCH */}
          {permission.isLogin && (
            <div className={styles.searchWrap}>
              <div className={styles.searchBox}>
                <select
                  className={styles.catSelect}
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <div className={styles.catDivider} />
                <input
                  ref={desktopInputRef}
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="بتدور على ايه؟"
                  dir="rtl"
                  className={styles.searchInput}
                  autoComplete="off"
                />
                <button className={styles.searchBtn} aria-label="بحث">
                  <FiSearch />
                </button>
              </div>
              {suggestions.length > 0 && <Dropdown items={suggestions} />}
            </div>
          )}

          {/* RIGHT ICONS */}
          <nav className={styles.navRight} aria-label="روابط رئيسية">

            {/* Account */}
            <Link to="/userProf" className={styles.navBtn}>
              <span className={styles.navBtnTop}>أهلاً، سجل دخولك</span>
              <span className={styles.navBtnBot}>
                <FaUser className={styles.navBtnIcon} /> حسابي
              </span>
            </Link>

            <div className={styles.vDivider} />

            {/* Wishlist */}
            <Link to="/wishlist" className={styles.navBtn}>
              <span className={styles.navBtnTop}>قائمة الرغبات</span>
              <span className={styles.navBtnBot}>
                <FaHeart className={styles.navBtnIconGold} />
                المفضلة
                {wishlist?.length > 0 && (
                  <span className={styles.pillBadge}>{wishlist.length}</span>
                )}
              </span>
            </Link>

            {/* Bell */}
            <Link to="/bell" className={styles.navBtn}>
              <span className={styles.navBtnTop}> التنبيهات  </span>
              <span className={styles.navBtnBot}>
                <FaBell className={styles.navBtnIcon} />
                {unreadCount > 0
                  ? <span className={styles.pillBadge}>{unreadCount}</span>
                  : "الإشعارات"}
              </span>
            </Link>

            <div className={styles.vDivider} />

            {/* Cart */}
            <Link to="/cart" className={styles.cartBtn} aria-label="السلة">
              <div className={styles.cartIconWrap} style={{ position: "relative" }}>
                <FaShoppingCart className={styles.cartIcon} />
                {cartQuantity > 0 && (
                  <span
                    className={styles.pillBadge}
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-10px",
                      minWidth: "18px",
                      height: "18px",
                      padding: "0 4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {cartQuantity}
                  </span>
                )}
              </div>
              <span className={styles.cartLabel}>السلة</span>
            </Link>
          </nav>

          {/* HAMBURGER */}
          <button className={styles.hamburger} onClick={() => setMenuOpen(true)} aria-label="القائمة">
            <FaBars />
          </button>
        </div>

        {/* BOTTOM NAV BAR */}
        <div className={styles.bottomBar}>
          <Link to="/" className={`${styles.bLink} ${styles.bLinkAll}`}>
            <FaBars className={styles.bIcon} /> كل الأقسام
          </Link>
          <Link to="/offers" className={`${styles.bLink} ${styles.bLinkGold}`}>
            <MdFlashOn className={styles.bIconPulse} /> عروض اليوم
          </Link>
          {["إلكترونيات","ملابس","منزل ومطبخ","كتب","رياضة"].map(cat => (
            <Link key={cat} to={`/category/${cat}`} className={styles.bLink}>{cat}</Link>
          ))}
        </div>
      </header>

      {/* ══════════ MOBILE MENU — RIGHT-SIDE SLIDE-IN DRAWER ══════════
          Always mounted (not conditionally rendered) so both the open
          and close transitions animate smoothly over 300ms. */}
      <div
        className={`${styles.drawerOverlay} ${menuOpen ? styles.drawerOverlayOpen : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      >
        <div
          className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="القائمة"
        >
          {/* drawer header */}
          <div className={styles.drawerHeader}>
            <span className={styles.drawerTitle}>القائمة</span>
            <button className={styles.closeBtn} onClick={() => setMenuOpen(false)} aria-label="إغلاق">
              <FaTimes />
            </button>
          </div>

          {/* search bar */}
          <div className={styles.drawerSearchWrap}>
            <div className={styles.drawerSearchBox}>
              <FiSearch className={styles.drawerSearchIcon} />
              <input
                ref={drawerSearchInputRef}
                value={mobileSearchInput}
                onChange={e => setMobileSearchInput(e.target.value)}
                placeholder="بتدور على ايه؟"
                dir="rtl"
                autoComplete="off"
                className={styles.drawerSearchInput}
              />
              {mobileSearchInput.length > 0 && (
                <button
                  type="button"
                  className={styles.drawerSearchClear}
                  aria-label="مسح"
                  onClick={() => {
                    setMobileSearchInput("");
                    drawerSearchInputRef.current?.focus();
                  }}
                >
                  <FiX />
                </button>
              )}
            </div>
            {mobileSuggestions.length > 0 && <Dropdown items={mobileSuggestions} />}
          </div>

          {/* sectioned links */}
          <div className={styles.drawerBody}>
            {drawerSections.map((section, si) => (
              <React.Fragment key={si}>
                {si > 0 && <div className={styles.drawerDivider} />}
                <div className={styles.drawerSection}>
                  {section.map((item, i) => (
                    <Link
                      key={i}
                      to={item.to}
                      className={styles.drawerLink}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className={styles.drawerLinkIcon}>{item.icon}</span>
                      <span>{item.label}</span>
                      {item.badge > 0 && (
                        <span className={styles.drawerBadge}>{item.badge}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}