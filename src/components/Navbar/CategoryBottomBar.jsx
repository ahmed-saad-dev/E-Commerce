import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { MdFlashOn } from "react-icons/md";
import styles from "./Navbar.module.css";
import { NAV_CATEGORIES, ALL_CATEGORY } from "./navCategories";

export default function CategoryBottomBar() {
  return (
    <div className={styles.bottomBar}>
      <Link to="/" className={`${styles.bLink} ${styles.bLinkAll}`}>
        <FaBars className={styles.bIcon} /> كل الأقسام
      </Link>

      <Link to="/offers" className={`${styles.bLink} ${styles.bLinkGold}`}>
        <MdFlashOn className={styles.bIconPulse} /> عروض اليوم
      </Link>

      {NAV_CATEGORIES.filter((c) => c.value !== ALL_CATEGORY).map((c) => (
        <Link
          key={c.value}
          to={`/?category=${encodeURIComponent(c.value)}`}
          className={styles.bLink}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
