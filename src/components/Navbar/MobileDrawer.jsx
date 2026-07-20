import { Fragment } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import styles from "./Navbar.module.css";
import SearchBar from "./SearchBar";

export default function MobileDrawer({
  open,
  onClose,
  sections,
  searchValue,
  onSearchChange,
  category,
  onSelectSuggestion,
  searchInputRef,
}) {
  return (
    <div
      className={`${styles.drawerOverlay} ${open ? styles.drawerOverlayOpen : ""}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="القائمة"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>القائمة</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="إغلاق">
            <FaTimes />
          </button>
        </div>

        <SearchBar
          variant="mobile"
          value={searchValue}
          onChange={onSearchChange}
          category={category}
          onSelect={onSelectSuggestion}
          inputRef={searchInputRef}
        />

        <div className={styles.drawerBody}>
          {sections.map((section, sectionIndex) => (
            <Fragment key={section.map((item) => item.to).join("|")}>
              {sectionIndex > 0 && <div className={styles.drawerDivider} />}
              <div className={styles.drawerSection}>
                {section.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={styles.drawerLink}
                    onClick={onClose}
                  >
                    <span className={styles.drawerLinkIcon}>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className={styles.drawerBadge}>{item.badge}</span>
                    )}
                  </Link>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
