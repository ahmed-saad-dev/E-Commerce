import { useRef } from "react";

const CATEGORIES_CONFIG = {
  beauty: { icon: "💄", color: "#e83e8c" },
  fragrances: { icon: "🌸", color: "#9c27b0" },
  furniture: { icon: "🛋️", color: "#795548" },
  groceries: { icon: "🛒", color: "#4caf50" },
  "home-decoration": { icon: "🏠", color: "#20c997" },
  "kitchen-accessories": { icon: "🍽️", color: "#ff9800" },
  laptops: { icon: "💻", color: "#0d6efd" },
  "mens-shirts": { icon: "👕", color: "#6f42c1" },
  "mens-shoes": { icon: "👟", color: "#20c997" },
  "mens-watches": { icon: "⌚", color: "#ffc107" },
  smartphones: { icon: "📱", color: "#2196f3" },
  tablets: { icon: "📲", color: "#3f51b5" },
  "sports-accessories": { icon: "⚽", color: "#198754" },
  sunglasses: { icon: "🕶️", color: "#607d8b" },
  "skin-care": { icon: "🧴", color: "#ff69b4" },
  "mobile-accessories": { icon: "🎧", color: "#673ab7" },
  motorcycle: { icon: "🏍️", color: "#f44336" },
  vehicle: { icon: "🚗", color: "#607d8b" },
  tops: { icon: "👚", color: "#ff4081" },
  "womens-bags": { icon: "👜", color: "#e91e63" },
  "womens-dresses": { icon: "👗", color: "#ec407a" },
  "womens-jewellery": { icon: "💍", color: "#ffd54f" },
  "womens-shoes": { icon: "👠", color: "#ff7043" },
  "womens-watches": { icon: "⌚", color: "#ffa000" },
};

export default function CategorySlider({
  categories = [],
  onFilter,
  activeCategory,
}) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    sliderRef.current?.scrollBy({
      left: direction * 250,
      behavior: "smooth",
    });
  };

  return (
    <div style={{ margin: "20px 0 30px" }}>
      <div style={{ position: "relative" }}>
        {categories.length > 4 && (
          <button
            onClick={() => scroll(-1)}
            style={{
              position: "absolute",
              left: "-12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            ‹
          </button>
        )}

        <div
          ref={sliderRef}
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            padding: "10px 40px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* All */}

          <button
            onClick={() => onFilter("All")}
            style={{
              flexShrink: 0,
              padding: "10px 20px",
              borderRadius: "999px",
              border:
                activeCategory === "All"
                  ? "2px solid #198754"
                  : "2px solid #ddd",
              background:
                activeCategory === "All" ? "#198754" : "#fff",
              color: activeCategory === "All" ? "#fff" : "#444",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✨ All
          </button>

          {categories.map((cat) => {
            const slug = cat.slug;
            const name = cat.name;

            const config = CATEGORIES_CONFIG[slug] || {
              icon: "🏷️",
              color: "#198754",
            };

            const isActive = activeCategory === slug;

            return (
              <button
                key={slug}
                onClick={() => onFilter(slug)}
                style={{
                  flexShrink: 0,
                  padding: "10px 20px",
                  borderRadius: "999px",
                  border: isActive
                    ? `2px solid ${config.color}`
                    : "2px solid #ddd",
                  background: isActive ? config.color : "#fff",
                  color: isActive ? "#fff" : "#444",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: ".2s",
                }}
              >
                <span>{config.icon}</span>
                {name}
              </button>
            );
          })}
        </div>

        {categories.length > 4 && (
          <button
            onClick={() => scroll(1)}
            style={{
              position: "absolute",
              right: "-12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}