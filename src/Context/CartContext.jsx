import { createContext, useEffect, useState } from "react";
import api from "../api/api";

export let cartContext = createContext();

const CART_STORAGE_KEY = "cartItems";

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be unavailable (private mode, quota, etc.) — fail silently
  }
}

export function CartContextProvider(props) {
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage());
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cartID, setCartID] = useState(0);
  const [product_ID, setProduct_ID] = useState(0);

  // Persist to localStorage + recalc total quantity (drives the Navbar badge)
  // any time the cart changes.
  useEffect(() => {
    saveCartToStorage(cartItems);
    const totalQty = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartQuantity(totalQty);
  }, [cartItems]);

  // ================= ADD TO CART =================
  // Keeps the same signature used across the app: addToCart(productId).
  // If the product is already in the cart, its quantity is bumped instead
  // of creating a duplicate row.
  async function addToCart(p_ID) {
    setProduct_ID(p_ID);

    const existing = cartItems.find((item) => item.productId === p_ID);

    if (existing) {
      const updated = cartItems.map((item) =>
        item.productId === p_ID ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updated);
      return { data: updated };
    }

    try {
      // Products come from DummyJSON now, so we fetch the product once to
      // store a full product snapshot in the cart (name, price, image, etc.)
      const { data: product } = await api.get(`/products/${p_ID}`);

      const newItem = {
        cartItemId: product.id,
        productId: product.id,
        productName: product.title,
        price: product.price,
        image: product.images?.[0] || product.thumbnail || null,
        quantity: 1,
      };

      const updated = [...cartItems, newItem];
      setCartItems(updated);
      return { data: updated };
    } catch (error) {
      throw error;
    }
  }

  // ================= GET CART =================
  async function getCarts() {
    return { data: cartItems };
  }

  // ================= UPDATE QUANTITY =================
  // Sets the item's quantity to `count` (never below 1).
  async function updateCart(id, count) {
    const updated = cartItems.map((item) =>
      item.cartItemId === id ? { ...item, quantity: Math.max(1, count) } : item
    );
    setCartItems(updated);
    return { data: updated };
  }

  // ================= REMOVE ITEM =================
  async function deleteCartProduct(id) {
    const updated = cartItems.filter((item) => item.cartItemId !== id);
    setCartItems(updated);
    return { data: updated };
  }

  // ================= CLEAR CART =================
  async function deleteAllCart() {
    setCartItems([]);
    return { data: [] };
  }

  return (
    <cartContext.Provider
      value={{
        addToCart,
        getCarts,
        updateCart,
        deleteCartProduct,
        deleteAllCart,
        cartItems,
        cartQuantity,
        cartID,
        product_ID,
      }}
    >
      {props.children}
    </cartContext.Provider>
  );
}