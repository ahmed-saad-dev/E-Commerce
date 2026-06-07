import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import navlogo from "../../assets/logo.png";
import styles from "./Navbar.module.css";

import { userContext } from "../../Context/userContext.jsx";
import { useWishlist } from "../../Context/WishlistContext";

import {
  FaBell,
  FaShoppingCart,
  FaUserCircle,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const permission = useContext(userContext);
  const { wishlist } = useWishlist();

  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const inputRef = useRef();

  async function getProducts() {
    try {
      const { data } = await axios.get(
        "https://egzone.runasp.net/api/Products"
      );
      setProducts(data?.data || data || []);
    } catch {
      setProducts([]);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (!searchInput) return setSuggestions([]);

    const filtered = products.filter((p) =>
      p?.name?.toLowerCase().includes(searchInput.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 6));
  }, [searchInput, products]);

  const getImage = (item) =>
    item?.images?.[0]?.url ||
    item?.imageUrl ||
    "https://via.placeholder.com/50";

  return (
    <>
      <div className={styles.navbar}>
        {/* LOGO */}
        <Link to="/">
          <img src={navlogo} className={styles.logo} alt="logo" />
        </Link>

        {/* SEARCH */}
        {permission.isLogin && (
          <div className={styles.searchBox}>
            <input
              ref={inputRef}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className={styles.searchInput}
            />

            {suggestions.length > 0 && (
              <div className={styles.searchDropdown}>
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className={styles.searchItem}
                    onClick={() => {
                      setSearchInput("");
                      setSuggestions([]);
                      navigate(`/ProductDetails/${item.id}`);
                      setMenuOpen(false);
                    }}
                  >
                    <img src={getImage(item)} alt="" />
                    <div>
                      <p>{item.name}</p>
                      <span>{item.price} EGP</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DESKTOP ICONS */}
        <div className={styles.icons}>
          {[
            { icon: <FaBell />, link: "/bell" },
            { icon: <FaShoppingCart />, link: "/cart" },
            { icon: <FaHeart />, link: "/wishlist", badge: wishlist?.length },
            { icon: <FaUserCircle />, link: "/userProf" },
          ].map((item, i) => (
            <Link key={i} to={item.link} className={styles.iconBtn}>
              {item.icon}
              {item.badge > 0 && (
                <span className={styles.badge}>{item.badge}</span>
              )}
            </Link>
          ))}
        </div>

        {/* MOBILE ICONS (الجديد 🔥) */}
        <div className={styles.mobileIcons}>
          <Link to="/bell" className={styles.iconBtn}>
            <FaBell />
          </Link>

          <Link to="/cart" className={styles.iconBtn}>
            <FaShoppingCart />
          </Link>

          <Link to="/wishlist" className={styles.iconBtn}>
            <FaHeart />
            {wishlist?.length > 0 && (
              <span className={styles.badge}>{wishlist.length}</span>
            )}
          </Link>
        </div>

        {/* HAMBURGER */}
        <div className={styles.hamburger} onClick={() => setMenuOpen(true)}>
          <FaBars />
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)}>
          <div
            className={styles.mobileMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <FaTimes
              className={styles.close}
              onClick={() => setMenuOpen(false)}
            />

            <Link onClick={() => setMenuOpen(false)} to="/">
              Home
            </Link>
            <Link onClick={() => setMenuOpen(false)} to="/cart">
              Cart
            </Link>
            <Link onClick={() => setMenuOpen(false)} to="/wishlist">
              Wishlist
            </Link>
            <Link onClick={() => setMenuOpen(false)} to="/userProf">
              Profile
            </Link>
          </div>
        </div>
      )}
    </>
  );
}