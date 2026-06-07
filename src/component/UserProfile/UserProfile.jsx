import React, { useContext, useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaRegBell,
  FaUser,
  FaMoon,
  FaGlobe,
  FaQuestionCircle,
  FaInfoCircle,
  FaLock,
  FaMapMarkerAlt,
  FaHeart,
  FaBell,
  FaShoppingBag,
  FaTicketAlt,
  FaPhone,
  FaEnvelope,
  FaSpinner,
  FaEdit,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { userContext } from "../../Context/userContext";
import { ThemeContext } from "../../Context/ThemeContext"; // ✅ ضيفنا ده
import axios from "axios";
import styles from "./UserProfile.module.css";

const BASE_URL = "https://egzone.runasp.net/api/UserProfile";

export default function UserProfile() {
  const [alerts, setAlerts] = useState(true);

  const { theme, toggleTheme } = useContext(ThemeContext); // ✅ بدل الـ local state

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifications, setNotifications] = useState(1);

  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "ar"
  );
  const [showLangModal, setShowLangModal] = useState(false);

  const navigate = useNavigate();
  const permission = useContext(userContext);

  useEffect(() => {
    getUserData();
    getOrdersCount();
    getWishlistCount();
  }, []);

  // ================= API =================

  async function getUserData() {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return setLoading(false);

      const { data } = await axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function getOrdersCount() {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const { data } = await axios.get(`${BASE_URL}/orders/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrdersCount(data.count || 0);
    } catch (err) {
      console.error(err);
    }
  }

  async function getWishlistCount() {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const { data } = await axios.get(`${BASE_URL}/wishlist/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlistCount(data.count || 0);
    } catch (err) {
      console.error(err);
    }
  }

  async function saveAlertPreference(value) {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      await axios.put(
        `${BASE_URL}/preferences/alerts`,
        { priceDropAlerts: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
    }
  }

  // ================= HANDLERS =================

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    permission.setLogin(null);
    setUserData(null);
    navigate("/login");
  };

  const handleLanguage = () => setShowLangModal(true);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    setShowLangModal(false);
  };

  const handleHelpCenter = () => navigate("/help-center");
  const handleAboutUs = () => navigate("/about");
  const handleSavedItems = () => navigate("/wishlist");

  const handlePriceDropAlerts = () => {
    const newValue = !alerts;
    setAlerts(newValue);
    saveAlertPreference(newValue);
  };

  const initials = userData?.fullName
    ? userData.fullName
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "?";

  const isLoggedIn = !!userData && permission.isLogin;

  return (
    <div className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}> {/* ✅ عدلنا الشرط */}

      {/* LANGUAGE MODAL */}
      {showLangModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Choose Language</h3>

            <button onClick={() => selectLanguage("ar")}>🇪🇬 العربية</button>
            <button onClick={() => selectLanguage("en")}>🇺🇸 English</button>
            <button onClick={() => selectLanguage("fr")}>🇫🇷 Français</button>

            <button
              className={styles.closeBtn}
              onClick={() => setShowLangModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className={styles.topHeader}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>

        <h1 className={styles.headerTitle}>Profile</h1>

        <button
          className={styles.notificationBtn}
          onClick={() => navigate("/bell")}
        >
          <FaRegBell />
          {notifications > 0 && (
            <span className={styles.badge}>{notifications}</span>
          )}
        </button>
      </div>

      {/* PROFILE */}
      {!isLoggedIn ? (
        <div className={styles.guestProfile}>
          <div className={styles.guestAvatar}>
            <FaUser />
          </div>
          <h2>Guest</h2>
          <p>Sign in to unlock full features</p>
          <button onClick={() => navigate("/login")}>
            Login / Sign Up
          </button>
        </div>
      ) : (
        <>
          <div className={styles.profileHeader}>
            <div className={styles.avatarLarge}>
              {loading ? (
                <FaSpinner className={styles.spinner} />
              ) : (
                <span className={styles.initials}>{initials}</span>
              )}
            </div>

            <h2>{userData?.fullName || "User"}</h2>

            <button
              className={styles.editBtn}
              onClick={() => navigate("/edit-profile")}
            >
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className={styles.quickActions}>
            <QuickItem
              icon={<FaShoppingBag />}
              title="Orders"
              number={ordersCount}
              onClick={() => navigate("/allorders")}
            />
            <QuickItem
              icon={<FaHeart />}
              title="Wishlist"
              number={wishlistCount}
              onClick={() => navigate("/wishlist")}
            />
          </div>
        </>
      )}

      {/* SETTINGS */}
      <p className={styles.sectionTitle}>Settings</p>

      <div className={styles.card}>
        <div className={styles.item} onClick={toggleTheme}> {/* ✅ بدل handleThemeToggle */}
          <div className={styles.left}>
            <FaMoon />
            <span>Theme</span>
          </div>
        </div>

        <div className={styles.item} onClick={handleLanguage}>
          <div className={styles.left}>
            <FaGlobe />
            <span>Language</span>
          </div>
          <FaChevronRight />
        </div>
      </div>

      {/* SUPPORT */}
      <p className={styles.sectionTitle}>Support</p>

      <div className={styles.card}>
        <Item icon={<FaQuestionCircle />} text="Help Center" onClick={handleHelpCenter} />
        <Item icon={<FaInfoCircle />} text="About Us" onClick={handleAboutUs} />
      </div>

      {/* WISHLIST */}
      <p className={styles.sectionTitle}>Wishlist</p>

      <div className={styles.card}>
        <Item
          icon={<FaHeart />}
          text="Saved Items"
          badge={wishlistCount}
          onClick={handleSavedItems}
        />

        <SwitchItem
          icon={<FaBell />}
          text="Price Drop Alerts"
          value={alerts}
          onChange={handlePriceDropAlerts}
        />
      </div>

      {/* LOGOUT */}
      {isLoggedIn && (
        <div className={styles.logoutSection}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Item({ icon, text, badge, onClick }) {
  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.left}>
        {icon}
        <span>{text}</span>
      </div>

      <div className={styles.rightContent}>
        {badge ? <span className={styles.itemBadge}>{badge}</span> : null}
        <span className={styles.arrow}>
          <FaChevronRight />
        </span>
      </div>
    </div>
  );
}

function SwitchItem({ icon, text, value, onChange }) {
  return (
    <div className={styles.item}>
      <div className={styles.left}>
        {icon}
        <span>{text}</span>
      </div>

      <label className={styles.switch}>
        <input type="checkbox" checked={value} onChange={onChange} />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
}

function QuickItem({ icon, title, number, onClick }) {
  return (
    <div className={styles.quickItem} onClick={onClick}>
      <div className={styles.quickIcon}>{icon}</div>
      <h3 className={styles.quickNumber}>{number}</h3>
      <span className={styles.quickTitle}>{title}</span>
    </div>
  );
}