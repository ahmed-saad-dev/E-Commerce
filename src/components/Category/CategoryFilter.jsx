import React from "react";
import "./CategoryFilter.css";

const categories = [
  { id: "electronics", name: "Electronics", icon: "bi bi-laptop" },
  { id: "fashion", name: "Fashion", icon: "bi bi-bag" },
  { id: "home", name: "Home", icon: "bi bi-house" },
  { id: "beauty", name: "Beauty", icon: "bi bi-heart" },
  { id: "grocery", name: "Grocery", icon: "bi bi-cart" },
  { id: "health", name: "Health", icon: "bi bi-heart-pulse" },
  { id: "books", name: "Books", icon: "bi bi-book" },
  { id: "toys", name: "Toys", icon: "bi bi-controller" },
  { id: "sports", name: "Sports", icon: "bi bi-trophy" },
];

export default function CategoryFilter() {
  return (
    <div className="category-slider-wrapper">

      <div className="category-slider">

        {categories.map((cat) => (
          <div
            key={cat.id}
            className="category-slide-item"
          >
            <i className={`${cat.icon} icon`}></i>
            <span>{cat.name}</span>
          </div>
        ))}

      </div>

    </div>
  );
}