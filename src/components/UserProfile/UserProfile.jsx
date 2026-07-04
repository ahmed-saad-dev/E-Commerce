import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaRegBell,
  FaUser,
  FaMoon,
  FaSun,
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
  FaKey,
  FaCreditCard,
  FaShoppingCart,
  FaCalendarAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import styles from "./UserProfile.module.css";

const BASE_URL = "https://egzone.runasp.net/api/UserProfile";

export default function UserProfile() {
  const [alerts, setAlerts] = useState(true);

  const { theme, toggleTheme } = useContext(ThemeContext);

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
  const handleChangePassword = () => navigate("/change-password");

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
    <div className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={styles.profileWrapper}>
        
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

        {/* TOP HEADER */}
        <div className={styles.topHeader}>
          <Link to="/" className={styles.backBtn}>
            <FaArrowLeft />
          </Link>
          <h1 className={styles.headerTitle}>EGZONE PROFILE</h1>
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

        {/* MAIN PROFILE CARD */}
        <div className={styles.mainGlassCard}>
          
          {/* PROFILE HEADER SECTION */}
          {!isLoggedIn ? (
            <div className={styles.guestProfile}>
              <div className={styles.guestAvatar}>
                <FaUser />
              </div>
              <h2>Welcome, Guest</h2>
              <p>Sign in to unlock full premium luxury features</p>
              <button className={styles.primaryGradientBtn} onClick={() => navigate("/login")}>
                Login / Sign Up
              </button>
            </div>
          ) : (
            <>
              <div className={styles.profileHeaderInfo}>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarLarge}>
                    {loading ? (
                      <FaSpinner className={styles.spinner} />
                    ) : (
                      <span className={styles.initials}>{initials}</span>
                    )}
                  </div>
                  <span className={styles.onlineStatus}></span>
                </div>

                <div className={styles.userMeta}>
                  <div className={styles.nameBadgeRow}>
                    <h2>{userData?.fullName || "EGZone User"}</h2>
                    <span className={styles.premiumBadge}>PREMIUM</span>
                  </div>
                  <p className={styles.userEmail}>
                    <FaEnvelope className={styles.metaIcon} /> {userData?.email || "user@egzone.com"}
                  </p>
                  <p className={styles.userJoined}>
                    <FaCalendarAlt className={styles.metaIcon} /> Member Since: 2026
                  </p>
                </div>

                <button
                  className={styles.secondaryGoldBtn}
                  onClick={() => navigate("/edit-profile")}
                >
                  <FaEdit /> <span>Edit Profile</span>
                </button>
              </div>

              {/* 4 BEAUTIFUL STATS CARDS */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard} onClick={() => navigate("/allorders")}>
                  <div className={styles.statIconWrapper}><FaShoppingBag /></div>
                  <h3 className={styles.statNumber}>{ordersCount}</h3>
                  <span className={styles.statTitle}>Orders</span>
                </div>
                <div className={styles.statCard} onClick={() => navigate("/wishlist")}>
                  <div className={styles.statIconWrapper}><FaHeart /></div>
                  <h3 className={styles.statNumber}>{wishlistCount}</h3>
                  <span className={styles.statTitle}>Wishlist</span>
                </div>
                <div className={styles.statCard} onClick={() => navigate("/cart")}>
                  <div className={styles.statIconWrapper}><FaShoppingCart /></div>
                  <h3 className={styles.statNumber}>0</h3>
                  <span className={styles.statTitle}>Cart</span>
                </div>
                <div className={styles.statCard} onClick={() => navigate("/bell")}>
                  <div className={styles.statIconWrapper}><FaBell /></div>
                  <h3 className={styles.statNumber}>{notifications}</h3>
                  <span className={styles.statTitle}>Notifications</span>
                </div>
              </div>
            </>
          )}

          {/* TWO COLUMN RESPONSIVE LAYOUT FOR ACCOUNT MENU */}
          <div className={styles.menuDashboardLayout}>
            
            {/* COLUMN 1: core settings */}
            <div className={styles.menuColumn}>
              <p className={styles.sectionTitle}>Personal Dashboard</p>
              <div className={styles.glassList}>
                <Item icon={<FaUser />} text="Personal Information" onClick={() => navigate("/edit-profile")} />
                <Item icon={<FaShoppingBag />} text="My Orders" onClick={() => navigate("/allorders")} />
                <Item icon={<FaHeart />} text="Wishlist" badge={wishlistCount} onClick={handleSavedItems} />
                <Item icon={<FaShoppingCart />} text="Shopping Cart" onClick={() => navigate("/cart")} />
                <Item icon={<FaMapMarkerAlt />} text="Addresses" onClick={() => navigate("/addresses")} />
                <Item icon={<FaCreditCard />} text="Payment Methods" onClick={() => navigate("/payment")} />
              </div>
            </div>

            {/* COLUMN 2: system & preferences */}
            <div className={styles.menuColumn}>
              <p className={styles.sectionTitle}>Preferences & System</p>
              <div className={styles.glassList}>
                
                <SwitchItem
                  icon={<FaBell />}
                  text="Notifications Alerts"
                  value={alerts}
                  onChange={handlePriceDropAlerts}
                />

                <div className={styles.item} onClick={toggleTheme}>
                  <div className={styles.left}>
                    {theme === "dark" ? <FaSun className={styles.goldIcon} /> : <FaMoon className={styles.purpleIcon} />}
                    <span>Theme</span>
                  </div>
                  <div className={styles.rightContent}>
                    <span className={styles.themeLabel}>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                  </div>
                </div>

                <div className={styles.item} onClick={handleLanguage}>
                  <div className={styles.left}>
                    <FaGlobe className={styles.purpleIcon} />
                    <span>Language</span>
                  </div>
                  <div className={styles.rightContent}>
                    <span className={styles.langLabel}>{language.toUpperCase()}</span>
                    <FaChevronRight className={styles.arrowIcon} />
                  </div>
                </div>

                {isLoggedIn && (
                  <div className={styles.item} onClick={handleChangePassword}>
                    <div className={styles.left}>
                      <FaKey className={styles.purpleIcon} />
                      <span>Security & Password</span>
                    </div>
                    <FaChevronRight className={styles.arrowIcon} />
                  </div>
                )}
                
                <Item icon={<FaQuestionCircle />} text="Support Center" onClick={handleHelpCenter} />
                <Item icon={<FaInfoCircle />} text="About EGZone" onClick={handleAboutUs} />
              </div>

              {/* LOGOUT */}
              {isLoggedIn && (
                <div className={styles.logoutWrapper}>
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    <FaSignOutAlt /> Logout Account
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= UTILITY UI COMPONENTS ================= */

function Item({ icon, text, badge, onClick }) {
  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.left}>
        <span className={styles.purpleIcon}>{icon}</span>
        <span>{text}</span>
      </div>
      <div className={styles.rightContent}>
        {badge ? <span className={styles.itemBadge}>{badge}</span> : null}
        <FaChevronRight className={styles.arrowIcon} />
      </div>
    </div>
  );
}

function SwitchItem({ icon, text, value, onChange }) {
  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <span className={styles.purpleIcon}>{icon}</span>
        <span>{text}</span>
      </div>
      <label className={styles.switch}>
        <input type="checkbox" checked={value} onChange={onChange} />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
}