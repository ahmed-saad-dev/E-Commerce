import { createContext, useContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // تحميل البيانات مرة واحدة عند بداية التطبيق
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistIds, setWishlistIds] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    const items = saved ? JSON.parse(saved) : [];
    return new Set(items.map((item) => item.id));
  });

  // حفظ البيانات كلما تغيرت
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setWishlistIds(new Set(wishlist.map((item) => item.id)));
  }, [wishlist]);

  // إعادة تحميل البيانات من localStorage
  function getWishlist() {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);
    setWishlistIds(new Set(saved.map((item) => item.id)));
  }

  // إضافة منتج
  function addToWishlist(product) {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }

      return [...prev, product];
    });

    return true;
  }

  // حذف منتج
  function removeFromWishlist(productId) {
    setWishlist((prev) =>
      prev.filter((item) => item.id !== productId)
    );

    return true;
  }

  // إضافة / حذف
  function toggleWishlist(product) {
    if (wishlistIds.has(product.id)) {
      return removeFromWishlist(product.id);
    }

    return addToWishlist(product);
  }

  // هل المنتج موجود؟
  function isInWishlist(productId) {
    return wishlistIds.has(productId);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}