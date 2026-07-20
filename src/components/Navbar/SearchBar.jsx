import { FiSearch, FiX } from "react-icons/fi";
import styles from "./Navbar.module.css";
import SearchDropdown from "./SearchDropdown";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch";
import { NAV_CATEGORIES } from "./navCategories";

const PLACEHOLDER = "بتدور على ايه؟";

/**
 * variant="desktop" → category select + input + search button (top header)
 * variant="mobile"  → icon + input + clear button (drawer)
 */
export default function SearchBar({
  variant = "desktop",
  value,
  onChange,
  category,
  onCategoryChange,
  onSelect,
  inputRef,
}) {
  const { suggestions } = useDebouncedSearch(value, category);

  const handleClear = () => {
    onChange("");
    inputRef?.current?.focus();
  };

  if (variant === "mobile") {
    return (
      <div className={styles.drawerSearchWrap}>
        <div className={styles.drawerSearchBox}>
          <FiSearch className={styles.drawerSearchIcon} />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={PLACEHOLDER}
            dir="rtl"
            autoComplete="off"
            className={styles.drawerSearchInput}
          />
          {value.length > 0 && (
            <button
              type="button"
              className={styles.drawerSearchClear}
              aria-label="مسح"
              onClick={handleClear}
            >
              <FiX />
            </button>
          )}
        </div>
        <SearchDropdown items={suggestions} onSelect={onSelect} />
      </div>
    );
  }

  return (
    <div className={styles.searchWrap}>
      <div className={styles.searchBox}>
        <select
          className={styles.catSelect}
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {NAV_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <div className={styles.catDivider} />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PLACEHOLDER}
          dir="rtl"
          className={styles.searchInput}
          autoComplete="off"
        />
        <button className={styles.searchBtn} aria-label="بحث">
          <FiSearch />
        </button>
      </div>
      <SearchDropdown items={suggestions} onSelect={onSelect} />
    </div>
  );
}
