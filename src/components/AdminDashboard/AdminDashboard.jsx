
import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import { FaUsers, FaClipboardCheck, FaExclamationTriangle, FaTicketAlt, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  // 1️⃣ تعيين state واحدة لحفظ بيانات الـ Dashboard كاملة كـ Object
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    reportedContent: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 2️⃣ دالة واحدة لجلب بيانات الإحصائيات من الـ API المخصص
  async function getDashboardData() {
    const token = localStorage.getItem('userToken');
    setLoading(true);

    axios.get('https://egzone.runasp.net/api/Admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      console.log('Admin Dashboard response: ', res);
      // تخزين الـ Object القادم مباشرة (تحتوي على totalUsers, pendingApprovals, reportedContent)
      if (res.data) {
        setDashboardData(res.data);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.log('Admin Dashboard Error: ', err);
      setLoading(false);
    });
  }

  // استدعاء الدالة لمرة واحدة عند تحميل الصفحة
  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className={styles.adminLayout}>
      {/* الـ Sidebar الجانبية */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <h2>EgyZone <span>Admin</span></h2>
        </div>
        <nav className={styles.navMenu}>
          <button className={`${styles.navItem} ${styles.active}`}>📊 Dashboard</button>
          <button onClick={() => navigate('/admin')} className={styles.navItem}>👥 Users</button>
          <button onClick={() => navigate('/adminProduct')} className={styles.navItem}>📦 Products</button>
          <button onClick={()=>{navigate('/adminReports')}} className={styles.navItem}>📋 Reports</button>
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

      {/* المحتوى الرئيسي للويب */}
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <h2>System Overview</h2>
          <div className={styles.adminProfile}>
            <span>Welcome, Admin 👑</span>
          </div>
        </header>

        {/* شبكة الكروت المربوطة بالـ API الحقيقي */}
        <section className={styles.statsGrid}>
          
          {/* كارت إجمالي المستخدمين المحدث من السيرفر */}
          <div className={styles.statCard} id={styles.totalUsersCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle}><FaUsers /></div>
              <span className={styles.trendIcon}>📈</span>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.statLabel}>Total Users</span>
              <h3 className={styles.statNumber}>
                {loading ? "..." : dashboardData.totalUsers}
              </h3>
            </div>
          </div>

          {/* كارت الموافقات المعلقة المحدث من السيرفر */}
          <div className={styles.statCard} id={styles.pendingCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle}><FaClipboardCheck /></div>
              <span className={styles.trendIcon}>📈</span>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.statLabel}>Pending Approvals</span>
              <h3 className={styles.statNumber}>
                {loading ? "..." : dashboardData.pendingApprovals}
              </h3>
            </div>
          </div>

          {/* كارت البلاغات المفتوحة المحدث من السيرفر */}
          <div className={styles.statCard} id={styles.reportsCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle}><FaExclamationTriangle /></div>
              <span className={styles.trendIcon}>📈</span>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.statLabel}>Open Reports</span>
              <h3 className={styles.statNumber}>
                {loading ? "..." : dashboardData.reportedContent}
              </h3>
            </div>
          </div>
          
        </section>

        <h3 className={styles.subTitle}>Quick Actions</h3>

        {/* قسم الأكشنز */}
        <section className={styles.actionsGrid}>
          <button className={styles.couponButton}>
            <div className={styles.couponLeft}>
              <div className={styles.couponIconCircle}><FaTicketAlt /></div>
              <div className={styles.couponText}>
                <h5>Generate Coupon</h5>
                <p>Create a new discount code for your store campaigns</p>
              </div>
            </div>
            <FaChevronRight className={styles.arrowIcon} />
          </button>
        </section>
      </main>
    </div>
  );
}

