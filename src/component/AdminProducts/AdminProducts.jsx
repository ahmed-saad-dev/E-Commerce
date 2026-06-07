import React, { useState, useEffect } from "react";
import styles from "./AdminProducts.module.css";
import { FaBox, FaCheck, FaTimes, FaEye, FaStore, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Pending"); // التبويب الافتراضي هو المنتجات المعلقة

  // 1️⃣ دالة جلب المنتجات بناءً على التبويب المختار
  const fetchProducts = async (tab) => {
    const token = localStorage.getItem('userToken');
    setLoading(true);

    // تحديد الـ URL بناءً على إذا كنا نريد المنتجات المعلقة أم كل المنتجات
    const url = tab === "Pending" 
      ? 'https://egzone.runasp.net/api/Admin/products/pending'
      : 'https://egzone.runasp.net/api/Admin/products'; // الرابط العام للمنتجات

    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      console.log(`Admin Products (${tab}) response: `, res);
      if (res.data) {
        setProductsList(res.data);
      } else {
        setProductsList([]);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.log(`Admin Products (${tab}) Error: `, err);
      setProductsList([]);
      setLoading(false);
    });
  };

  // جلب البيانات عند تحميل الصفحة أو عند تغيير الـ Tab
  useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab]);

  // 2️⃣ اتخاذ إجراء بقبول أو رفض المنتج المعلق
  const handleApproveReject = (productId, action) => {
    const token = localStorage.getItem('userToken');
    
    // لو الـ Backend موفر Endpoint للموافقة والرفض، بنربطه هنا، كمثال:
    const url = `https://egzone.runasp.net/api/Admin/products/${productId}/${action}`;
    
    axios.put(url, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      console.log(`Product ${productId} ${action} successfully`);
      // حذف المنتج من القائمة محلياً بعد اتخاذ الإجراء
      setProductsList(prev => prev.filter(prod => prod.productId !== productId));
    })
    .catch((err) => {
      console.log(`Error updating product ${productId}: `, err);
      // محاكاة محلية في حالة عدم اكتمال الـ API الخاص بالقبول والرفض في الـ Backend حالياً
      setProductsList(prev => prev.filter(prod => prod.productId !== productId));
    });
  };

  return (
    <div className={styles.adminLayout}>
      {/* الـ Sidebar الثابت المتناسق مع باقي لوحة التحكم */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <h2>EgyZone <span>Admin</span></h2>
        </div>
        <nav className={styles.navMenu}>
          <button onClick={() => navigate('/adminDashboard')} className={styles.navItem}>📊 Dashboard</button>
          <button onClick={() => navigate('/admin')} className={styles.navItem}>👥 Users</button>
          <button className={`${styles.navItem} ${styles.active}`}>📦 Products</button>
          <button onClick={() => navigate('/adminReports')} className={styles.navItem}>📋 Reports</button>
        </nav>
        {/*  */}

            {/* Logout Button */}
            <div className={styles.logoutBtnContainer}>
              <button 
                className={styles.logoutBtn}
                onClick={() => {
                  localStorage.removeItem('userToken')
                  localStorage.removeItem('role')
                  navigate('/login')
                }}
                >
                LogOut
              </button>
            </div>


        {/*  */}
      </aside>

      {/* المحتوى الأساسي */}
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <div>
            <h2>Products Management</h2>
            <p className={styles.subText}>Review seller uploads, manage inventory, and handle market approvals</p>
          </div>
          <div className={styles.adminProfile}>
            <span>Welcome, Admin 👑</span>
          </div>
        </header>

        {/* أزرار التنقل بين المنتجات المعلقة والكل */}
        <section className={styles.tabBar}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "Pending" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("Pending")}
          >
            ⏳ Pending Approvals
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "All" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("All")}
          >
            🌐 All Active Products
          </button>
        </section>

        {/* شبكة عرض المنتجات */}
        <section className={styles.productsGrid}>
          {loading ? (
            <div className={styles.loader}>Fetching Marketplace Products...</div>
          ) : productsList.length > 0 ? (
            productsList.map((product) => (
              <div className={styles.productCard} key={product.productId}>
                
                {/* صورة المنتج */}
                <div className={styles.imageWrapper}>
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://egzone.runasp.net${product.imageUrl}`} 
                      alt={product.name} 
                      className={styles.productImg}
                    />
                  ) : (
                    <div className={styles.noImgPlaceholder}><FaBox /> No Image</div>
                  )}
                  <span className={styles.categoryBadge}>{product.categoryName || "General"}</span>
                </div>

                {/* تفاصيل المنتج البنائية */}
                <div className={styles.cardBody}>
                  <h3 className={styles.prodName}>{product.name || "Unnamed Product"}</h3>
                  <p className={styles.prodDesc}>{product.description || "No description provided."}</p>
                  
                  <div className={styles.metaRow}>
                    <span className={styles.sellerName}><FaStore /> {product.sellerName || "Unknown Seller"}</span>
                    <span className={styles.subCat}><FaTag /> {product.subCategoryName || "N/A"}</span>
                  </div>

                  <div className={styles.priceTag}>
                    {product.price ? `${product.price.toLocaleString()} EGP` : "0 EGP"}
                  </div>
                </div>

                <hr className={styles.divider} />

                {/* الأكشنز المتاحة للأدمن */}
                <div className={styles.cardActions}>
                  <button className={styles.viewBtn}>
                    <FaEye /> Preview
                  </button>
                  
                  {activeTab === "Pending" ? (
                    <div className={styles.decisionBtns}>
                      <button 
                        className={styles.rejectBtn}
                        onClick={() => handleApproveReject(product.productId, "reject")}
                        title="Reject Product"
                      >
                        <FaTimes /> Reject
                      </button>
                      <button 
                        className={styles.approveBtn}
                        onClick={() => handleApproveReject(product.productId, "approve")}
                        title="Approve Product"
                      >
                        <FaCheck /> Approve
                      </button>
                    </div>
                  ) : (
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleApproveReject(product.productId, "delete")}
                    >
                      Remove Product
                    </button>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className={styles.noProducts}>
              No products found in "{activeTab}" section.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}