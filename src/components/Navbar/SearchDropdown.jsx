import styles from "./Navbar.module.css";

function getImage(item) {
  return item.thumbnail || item.images?.[0] || null;
}

export default function SearchDropdown({ items, onSelect }) {
  if (!items.length) return null;

  return (
    <div className={styles.dropdown}>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.dropItem}
          onClick={() => onSelect(item)}
        >
          <div className={styles.dropThumb}>
            <img src={getImage(item)} alt={item.title} />
          </div>

          <div className={styles.dropContent}>
            <h6 className={styles.dropName}>{item.title}</h6>
            <p className={styles.dropCategory}>{item.category}</p>
            <div className={styles.dropBottom}>
              <span className={styles.dropPrice}>${item.price}</span>
              <span className={styles.dropRating}>⭐ {item.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
