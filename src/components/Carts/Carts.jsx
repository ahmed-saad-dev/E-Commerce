import React, { useContext, useEffect, useState } from "react";
import { cartContext } from "../../context/CartContext";
import styles from "./Carts.module.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { Helmet } from "react-helmet";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

export default function Carts() {
  const {
    getCarts,
    updateCart,
    deleteCartProduct,
    deleteAllCart,
  } = useContext(cartContext);

  const [ProdOfCarts, setProdOfCarts] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  // ---------------- GET CARTS ----------------
  async function waitGetCarts() {
    const { data } = await getCarts();
    setProdOfCarts(data || []);
    setLoading(false);
  }

  // ---------------- UPDATE CART ----------------
  async function waitUpdateCarts(id, count) {
    const { data } = await updateCart(id, count);
    if (data) setProdOfCarts(data);
  }

  // ---------------- DELETE ITEM ----------------
  async function waitDeleteCartProd(id) {
    await deleteCartProduct(id);
    waitGetCarts();
  }

  // ---------------- DELETE ALL ----------------
  async function waitDeleteAllCart() {
    const { data } = await deleteAllCart();
    if (data) setProdOfCarts(data);
  }

  // ---------------- NAVIGATION ----------------
  function continueShopping() {
    navigate("/");
  }

  // Target checkout route exactly as specified
  function openChekOut() {
    navigate("/Checkout");
  }

  // ---------------- TOTAL PRICE ----------------
  function totalPriceFunc() {
    let total = 0;
    ProdOfCarts?.forEach((item) => {
      total += (item?.price || 0) * (item?.quantity || 1);
    });
    setTotalPrice(total);
  }

  useEffect(() => {
    totalPriceFunc();
  }, [ProdOfCarts]);

  // ---------------- QUANTITY ----------------
  function quantityPlus(id) {
    const item = ProdOfCarts.find((i) => i.cartItemId === id);
    if (!item) return;
    waitUpdateCarts(id, item.quantity + 1);
  }

  function quantityMinus(id) {
    const item = ProdOfCarts.find((i) => i.cartItemId === id);
    if (!item) return;
    waitUpdateCarts(id, Math.max(1, item.quantity - 1));
  }

  // ---------------- INIT ----------------
  useEffect(() => {
    waitGetCarts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Your Cart</title>
      </Helmet>

      <Navbar />

      <div className={styles.cartContainer}>
        <div className="container">
          {!Loading ? (
            ProdOfCarts.length === 0 ? (
              /* PREMIUM EMPTY STATE ILLUSTRATION */
              <div className={styles.emptyCartState}>
                <div className={styles.emptyIconContainer}>
                  <i className="fa-solid fa-bag-shopping"></i>
                </div>
                <h2 className={styles.emptyTitle}>Your cart feels light</h2>
                <p className={styles.emptyText}>
                  Explore our exclusive collection and add products to get started.
                </p>
                <button onClick={continueShopping} className={styles.emptyBtn}>
                  Start Shopping
                </button>
              </div>
            ) : (
              /* MODERN 2-COLUMN GRID SYSTEM */
              <div className="row g-4 mt-2">
                <div className="col-12">
                  <div className={styles.listHeader}>
                    <div>
                      <h1 className={styles.title}>
                        Shopping <span className={styles.titleSpan}>Cart</span>
                      </h1>
                      <span className={styles.itemCountText}>
                        ({ProdOfCarts.length} {ProdOfCarts.length === 1 ? 'item' : 'items'})
                      </span>
                    </div>
                    <button onClick={waitDeleteAllCart} className={styles.clearAllBtn}>
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className={styles.cartLayout}>
                  {/* LEFT COLUMN: LIVE PRODUCT CARDS */}
                  <div className={styles.itemsList}>
                    {ProdOfCarts.map((item) => {
                      // Dynamically calculate/mock UI metadata requested without modifying schema
                      const fallbackOldPrice = Math.round(item?.price * 1.25);
                      const fallbackDiscount = 20;

                      return (
                        <div key={item.cartItemId} className={styles.productCard}>
                          {/* Left Item Sub-grouping */}
                          <div className={styles.productInfoSection}>
                            <div className={styles.imgContainer}>
                              <img
                                src={item?.image}
                                alt={item?.productName}
                                className={styles.cartImg}
                              />
                              <span className={styles.discountBadge}>
                                -{fallbackDiscount}%
                              </span>
                            </div>

                            <div className={styles.metaDetails}>
                              <span className={styles.categoryText}>Premium Tech</span>
                              <h4 className={styles.productName}>{item?.productName}</h4>
                              <div className={styles.ratingStockRow}>
                                <span className={styles.rating}>
                                  <i className="fa-solid fa-star"></i> 4.8
                                </span>
                                <span className={styles.stockStatus}>In Stock</span>
                              </div>
                            </div>
                          </div>

                          {/* Center Price Information Display */}
                          <div className={styles.priceSection}>
                            <div className={styles.currentPrice}>
                              {item?.price} <span style={{ fontSize: '12px' }}>EGP</span>
                            </div>
                            <div className={styles.oldPrice}>
                              {fallbackOldPrice} EGP
                            </div>
                          </div>

                          {/* Controls Row: Counter & Trash Trigger */}
                          <div className={styles.controlsSection}>
                            <div className={styles.cartCount}>
                              <button
                                onClick={() => quantityMinus(item?.cartItemId)}
                                className={styles.quantityBtn}
                                aria-label="Decrease Quantity"
                              >
                                <i className="fa-solid fa-minus"></i>
                              </button>
                              <input
                                className={styles.quantityInput}
                                value={item?.quantity}
                                readOnly
                              />
                              <button
                                onClick={() => quantityPlus(item?.cartItemId)}
                                className={styles.quantityBtn}
                                aria-label="Increase Quantity"
                              >
                                <i className="fa-solid fa-plus"></i>
                              </button>
                            </div>

                            <button
                              onClick={() => waitDeleteCartProd(item?.cartItemId)}
                              className={styles.removeBtn}
                              aria-label="Remove Item"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* RIGHT COLUMN: STICKY ORDER SUMMARY PANEL */}
                  <div className={styles.summaryCard}>
                    <h3 className={styles.summaryTitle}>Order Summary</h3>
                    
                    <div className={styles.summaryRow}>
                      <span>Total Items</span>
                      <span>{ProdOfCarts.reduce((acc, i) => acc + i.quantity, 0)}</span>
                    </div>

                    <div className={styles.summaryRow}>
                      <span>Subtotal</span>
                      <span>{totalPrice} EGP</span>
                    </div>

                    <div className={styles.summaryRow}>
                      <span>Estimated Shipping</span>
                      <span className="text-success">FREE</span>
                    </div>

                    <div className={`${styles.summaryRow} ${styles.summaryRowHighlight}`}>
                      <span>Discounts applied</span>
                      <span>-0.00 EGP</span>
                    </div>

                    <div className={styles.summaryRow}>
                      <span>Estimated Tax</span>
                      <span>0.00 EGP</span>
                    </div>

                    <div className={styles.summaryDivider}></div>

                    <div className={styles.totalRow}>
                      <span>Total</span>
                      <span className={styles.totalAmount}>
                        {totalPrice}
                        <span className={styles.currency}>EGP</span>
                      </span>
                    </div>

                    <button onClick={openChekOut} className={styles.checkoutBtn}>
                      Proceed to Checkout <i className="fa-solid fa-arrow-right ms-1"></i>
                    </button>

                    <button onClick={continueShopping} className={styles.continueBtn}>
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}