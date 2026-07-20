import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import navlogo from "../../assets/logo.png";
import styles from "./Navbar.module.css";

import { userContext } from "../../Context/userContext.jsx";
import { cartContext } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { useNotifications } from "../../Context/NotificationContext.jsx";

import { FaBell, FaShoppingCart, FaHeart, FaBars, FaHome, FaUser } from "react-icons/fa";

import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import CategoryBottomBar from "./CategoryBottomBar";
import MobileDrawer from "./MobileDrawer";
import { ALL_CATEGORY } from "./navCategories";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLogin } = useContext(userContext);
  const { cartQuantity } = useContext(cartContext);
  const { wishlist } = useWishlist();
  const { unreadCount } = useNotifications();

  const [searchInput, setSearchInput] = useState("");
  const [mobileSearchInput, setMobileSearchInput] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [menuOpen, setMenuOpen] = useState(false);

  const drawerSearchInputRef = useRef();

  /* ── close drawer on Escape ── */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  /* ── lock background scroll while drawer is open ── */
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  /* ── autofocus the drawer search input once the slide-in finishes ── */
  useEffect(() => {
    if (!menuOpen) return;
    const timer = setTimeout(() => drawerSearchInputRef.current?.focus(), 320);
    return () => clearTimeout(timer);
  }, [menuOpen]);

  const handleSelectSuggestion = (item) => {
    setSearchInput("");
    setMobileSearchInput("");
    setMenuOpen(false);
    navigate(`/ProductDetails/${item.id}`);
  };

  const drawerSections = [
    [
      { icon: <FaHome />, label: "الرئيسية", to: "/" },
      { icon: <FaShoppingCart />, label: "السلة", to: "/cart", badge: cartQuantity },
      { icon: <FaHeart />, label: "المفضلة", to: "/wishlist", badge: wishlist?.length },
      { icon: <FaUser />, label: "الحساب", to: "/userProf" },
    ],
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.leftGroup}>
            <Link to="/" className={styles.logo}>
              <img src={navlogo} alt="EGZone" className={styles.logoImg} />
            </Link>

            <div className={styles.mobileQuickActions}>
              <Link to="/wishlist" className={styles.mobileIconBtn} aria-label="المفضلة">
                <FaHeart className={styles.mobileIcon} />
                {wishlist?.length > 0 && (
                  <span className={styles.mobileBadge}>{wishlist.length}</span>
                )}
              </Link>

              <Link to="/cart" className={styles.mobileIconBtn} aria-label="السلة">
                <FaShoppingCart className={styles.mobileIcon} />
                {cartQuantity > 0 && (
                  <span className={styles.mobileBadge}>{cartQuantity}</span>
                )}
              </Link>
            </div>
          </div>

          <SearchBar
            variant="desktop"
            value={searchInput}
            onChange={setSearchInput}
            category={category}
            onCategoryChange={setCategory}
            onSelect={handleSelectSuggestion}
          />

          <nav className={styles.navRight} aria-label="روابط رئيسية">
            <UserMenu isLoggedIn={!!isLogin} />

            <div className={styles.vDivider} />

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

            <Link to="/bell" className={styles.navBtn}>
              <span className={styles.navBtnTop}>التنبيهات</span>
              <span className={styles.navBtnBot}>
                <FaBell className={styles.navBtnIcon} />
                {unreadCount > 0 ? (
                  <span className={styles.pillBadge}>{unreadCount}</span>
                ) : (
                  "الإشعارات"
                )}
              </span>
            </Link>

            <div className={styles.vDivider} />

            <Link to="/cart" className={styles.cartBtn} aria-label="السلة">
              <div className={styles.cartIconWrap}>
                <FaShoppingCart className={styles.cartIcon} />
                {cartQuantity > 0 && (
                  <span className={`${styles.pillBadge} ${styles.cartBadge}`}>
                    {cartQuantity}
                  </span>
                )}
              </div>
              <span className={styles.cartLabel}>السلة</span>
            </Link>
          </nav>

          <button className={styles.hamburger} onClick={() => setMenuOpen(true)} aria-label="القائمة">
            <FaBars />
          </button>
        </div>

        <CategoryBottomBar />
      </header>

      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sections={drawerSections}
        searchValue={mobileSearchInput}
        onSearchChange={setMobileSearchInput}
        category={category}
        onSelectSuggestion={handleSelectSuggestion}
        searchInputRef={drawerSearchInputRef}
      />
    </>
  );
}
