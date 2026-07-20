import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { cartContext } from "../../Context/CartContext";
import { userContext } from "../../Context/userContext";
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

  const { isLogin } = useContext(userContext);

  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navigate = useNavigate();

  // ---------------- GET CARTS ----------------
  const fetchCarts = useCallback(async () => {
    const { data } = await getCarts();
    setCartProducts(data || []);
    setLoading(false);
  }, [getCarts]);

  // ---------------- UPDATE CART ----------------
  const updateCartQuantity = useCallback(async (id, count) => {
    const { data } = await updateCart(id, count);
    if (data) setCartProducts(data);
  }, [updateCart]);

  // ---------------- DELETE ITEM ----------------
  const deleteCartItem = useCallback(async (id) => {
    await deleteCartProduct(id);
    fetchCarts();
  }, [deleteCartProduct, fetchCarts]);

  // ---------------- DELETE ALL ----------------
  const clearAllCart = useCallback(async () => {
    const { data } = await deleteAllCart();
    if (data) setCartProducts(data);
  }, [deleteAllCart]);

  // ---------------- NAVIGATION ----------------
  const continueShopping = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // ---------------- AUTHENTICATION CHECK ----------------
  const isAuthenticated = useMemo(() => {
    const tokenFromContext = isLogin;
    const tokenFromStorage = localStorage.getItem('userToken');
    return !!(tokenFromContext || tokenFromStorage);
  }, [isLogin]);

  // ---------------- CHECKOUT HANDLER ----------------
  const openCheckout = useCallback((e) => {
    // منع أي سلوك افتراضي للزر
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // التحقق من المصادقة
    if (isAuthenticated) {
      navigate("/Checkout");
    } else {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, navigate]);

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  // ---------------- DERIVED STATE ----------------
  const totalPrice = useMemo(() => {
    return cartProducts?.reduce((total, item) => {
      return total + (item?.price || 0) * (item?.quantity || 1);
    }, 0) || 0;
  }, [cartProducts]);

  const totalItems = useMemo(() => {
    return cartProducts?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  }, [cartProducts]);

  const itemCount = useMemo(() => {
    return cartProducts?.length || 0;
  }, [cartProducts]);

  // ---------------- QUANTITY HANDLERS ----------------
  const handleQuantityPlus = useCallback((id) => {
    const item = cartProducts.find((i) => i.cartItemId === id);
    if (!item) return;
    updateCartQuantity(id, item.quantity + 1);
  }, [cartProducts, updateCartQuantity]);

  const handleQuantityMinus = useCallback((id) => {
    const item = cartProducts.find((i) => i.cartItemId === id);
    if (!item) return;
    updateCartQuantity(id, Math.max(1, item.quantity - 1));
  }, [cartProducts, updateCartQuantity]);

  // ---------------- INIT ----------------
  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  return (
    <>
      <Helmet>
        <title>سلة التسوق</title>
      </Helmet>

      <Navbar />

      <div className={styles.cartContainer}>
        <div className="container">
          {!loading ? (
            cartProducts.length === 0 ? (
              <div className={styles.emptyCartState}>
                <div className={styles.emptyIconContainer}>
                  <i className="fa-solid fa-bag-shopping"></i>
                </div>
                <h2 className={styles.emptyTitle}>سلتك فارغة</h2>
                <p className={styles.emptyText}>
                  ابدأ بإضافة منتجات إلى سلتك للاستمتاع بتجربة التسوق.
                </p>
                <button onClick={continueShopping} className={styles.emptyBtn}>
                  ابدأ التسوق
                </button>
              </div>
            ) : (
              <div className="row g-4 mt-2">
                <div className="col-12">
                  <div className={styles.listHeader}>
                    <div>
                      <h1 className={styles.title}>
                        سلة <span className={styles.titleSpan}>التسوق</span>
                      </h1>
                      <span className={styles.itemCountText}>
                        ({itemCount} {itemCount === 1 ? 'منتج' : 'منتجات'})
                      </span>
                    </div>
                    <button onClick={clearAllCart} className={styles.clearAllBtn}>
                      إفراغ السلة
                    </button>
                  </div>
                </div>

                <div className={styles.cartLayout}>
                  <div className={styles.itemsList}>
                    {cartProducts.map((item) => {
                      const hasDiscount = item?.discount && item.discount > 0;
                      const oldPrice = hasDiscount ? Math.round(item.price / (1 - item.discount / 100)) : null;

                      return (
                        <div key={item.cartItemId} className={styles.productCard}>
                          <div className={styles.productInfoSection}>
                            <div className={styles.imgContainer}>
                              <img
                                src={item?.image}
                                alt={item?.productName}
                                className={styles.cartImg}
                              />
                              {hasDiscount && (
                                <span className={styles.discountBadge}>
                                  -{item.discount}%
                                </span>
                              )}
                            </div>

                            <div className={styles.metaDetails}>
                              {item?.categoryName && (
                                <span className={styles.categoryText}>{item.categoryName}</span>
                              )}
                              <h4 className={styles.productName}>{item?.productName}</h4>
                              {item?.stock && item.stock > 0 && (
                                <div className={styles.ratingStockRow}>
                                  <span className={styles.stockStatus}>متوفر</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className={styles.priceSection}>
                            <div className={styles.currentPrice}>
                              {item?.price} <span className={styles.currencyLabel}>ج.م</span>
                            </div>
                            {oldPrice && (
                              <div className={styles.oldPrice}>
                                {oldPrice} ج.م
                              </div>
                            )}
                          </div>

                          <div className={styles.controlsSection}>
                            <div className={styles.cartCount}>
                              <button
                                onClick={() => handleQuantityMinus(item?.cartItemId)}
                                className={styles.quantityBtn}
                                aria-label="تقليل الكمية"
                              >
                                <i className="fa-solid fa-minus"></i>
                              </button>
                              <input
                                className={styles.quantityInput}
                                value={item?.quantity}
                                readOnly
                                aria-label="الكمية"
                              />
                              <button
                                onClick={() => handleQuantityPlus(item?.cartItemId)}
                                className={styles.quantityBtn}
                                aria-label="زيادة الكمية"
                              >
                                <i className="fa-solid fa-plus"></i>
                              </button>
                            </div>

                            <button
                              onClick={() => deleteCartItem(item?.cartItemId)}
                              className={styles.removeBtn}
                              aria-label="حذف المنتج"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={styles.summaryCard}>
                    <h3 className={styles.summaryTitle}>ملخص الطلب</h3>
                    
                    <div className={styles.summaryRow}>
                      <span>عدد المنتجات</span>
                      <span>{totalItems}</span>
                    </div>

                    <div className={styles.summaryRow}>
                      <span>إجمالي المنتجات</span>
                      <span>{totalPrice} ج.م</span>
                    </div>

                    <div className={styles.summaryRow}>
                      <span>تكلفة الشحن</span>
                      <span className={styles.freeShipping}>مجاني</span>
                    </div>

                    <div className={`${styles.summaryRow} ${styles.summaryRowHighlight}`}>
                      <span>الخصومات</span>
                      <span>-0.00 ج.م</span>
                    </div>

                    <div className={styles.summaryRow}>
                      <span>الضريبة</span>
                      <span>0.00 ج.م</span>
                    </div>

                    <div className={styles.summaryDivider}></div>

                    <div className={styles.totalRow}>
                      <span>الإجمالي</span>
                      <span className={styles.totalAmount}>
                        {totalPrice}
                        <span className={styles.currency}>ج.م</span>
                      </span>
                    </div>

                    <button 
                      onClick={openCheckout} 
                      className={styles.checkoutBtn}
                      type="button"
                    >
                      إتمام الطلب <i className="fa-solid fa-arrow-left ms-1"></i>
                    </button>

                    <button onClick={continueShopping} className={styles.continueBtn}>
                      متابعة التسوق
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

      {/* مودال تسجيل الدخول */}
      {showAuthModal && (
        <div 
          className={styles.modalOverlay}
          onClick={closeAuthModal}
        >
          <div 
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            <div className={styles.modalIconContainer}>
              <i className="fa-solid fa-lock"></i>
            </div>
            
            <h3 id="auth-modal-title" className={styles.modalTitle}>
              تسجيل الدخول مطلوب
            </h3>
            
            <p className={styles.modalDescription}>
              لإكمال عملية الشراء، يجب تسجيل الدخول إلى حسابك أولاً.
            </p>

            <div className={styles.modalActions}>
              <button 
                onClick={() => navigate("/login")} 
                className={styles.modalPrimaryBtn}
              >
                تسجيل الدخول
              </button>

              <button 
                onClick={() => navigate("/register")} 
                className={styles.modalSecondaryBtn}
              >
                إنشاء حساب
              </button>

              <button 
                onClick={closeAuthModal} 
                className={styles.modalTextBtn}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}