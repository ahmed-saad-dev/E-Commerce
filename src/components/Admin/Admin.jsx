


// test user data=================================================================================================

import React, { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import { FaUsers, FaStore, FaUserShield, FaSearch, FaEllipsisV, FaBan, FaUserCheck } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [activeMenu, setActiveMenu] = useState(null);
  // 1️⃣ تعريف الـ States لحفظ المستخدمين وحالة التحميل والبحث
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  let navigate = useNavigate();
  // دالة جلب البيانات من السيرفر
  async function Admin_users() {
    const token = localStorage.getItem('userToken');
    setLoading(true);

    axios.get('https://egzone.runasp.net/api/Admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      // 2️⃣ تخزين الـ array الحقيقية القادمة بداخل الـ state
      if (res.data) {
        setUsersList(res.data);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.log('Admin User Error: ', err);
      setLoading(false);
    });
  }



  async function Admin_Products() {
    const token = localStorage.getItem('userToken');

    axios.get('https://egzone.runasp.net/api/Admin/products/pending', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

      .then((res) => {
      console.log('Admin Products Response: ', res);
      // 2️⃣ تخزين الـ array الحقيقية القادمة بداخل الـ state
      setLoading(false);
    })
    .catch((err) => {
      console.log('Admin Products Error: ', err);
      setLoading(false);
    });
  }

  useEffect(() => {
    Admin_users();
    Admin_Products();
  }, []);

  // 3️⃣ حساب الإحصائيات ديناميكياً من الـ Array الحقيقية
  const totalCustomers = usersList.filter(u => u.role?.toLowerCase() === 'customer').length;
  const totalSellers = usersList.filter(u => u.role?.toLowerCase() === 'seller').length;
  const totalBanned = usersList.filter(u => u.isActive === false).length;

  // 4️⃣ فلترة المستخدمين بحسب نص البحث (البحث بالإسم أو الإيميل)
  const filteredUsers = usersList.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.adminLayout}>
      {/* الـ Sidebar الجانبية */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <h2>EgyZone <span>Admin</span></h2>
        </div>
        <nav className={styles.navMenu}>
          <button onClick={()=>{navigate('/adminDashboard')}} className={styles.navItem}>📊 Dashboard</button>
          <button className={`${styles.navItem} ${styles.active}`}>👥 Users</button>
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

      {/* المحتوى الرئيسي */}
      <main className={styles.mainContent}>
        {/* شريط البحث العلوي */}
        <header className={styles.topHeader}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.adminProfile}>
            <span>Welcome, Admin 👑</span>
          </div>
        </header>

        {/* كروت الإحصائيات الديناميكية */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <FaUsers className={styles.statIcon} />
            <div><h4>Customers</h4><p>{loading ? "..." : totalCustomers}</p></div>
          </div>
          <div className={styles.statCard}>
            <FaStore className={styles.statIcon} />
            <div><h4>Sellers</h4><p>{loading ? "..." : totalSellers}</p></div>
          </div>
          <div className={styles.statCard}>
            <FaUserShield className={styles.statIcon} />
            <div><h4>Banned</h4><p>{loading ? "..." : totalBanned}</p></div>
          </div>
        </section>

        {/* جدول عرض البيانات */}
        <section className={styles.tableSection}>
          {loading ? (
            <div className="text-center p-5" style={{ fontSize: '22px', color: '#6366F1' }}>
              <i className="fa fa-spinner fa-spin me-2"></i> Loading Users Data...
            </div>
          ) : (
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>
                        <div className={styles.userBadge}>
                          <span className={styles.avatarLetter}>
                            {(user.fullName || "UN").substring(0, 2).toUpperCase()}
                          </span>
                          <span className={styles.userName}>{user.fullName || "No Name"}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber || "N/A"}</td>
                      <td>
                        <span className={`${styles.roleTag} ${user.role?.toLowerCase() === "seller" ? styles.seller : styles.customer}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.isActive ? (
                          <span className={styles.statusDot} style={{ color: '#10B981' }}>🟢 Active</span>
                        ) : (
                          <span className={styles.statusDot} style={{ color: '#EF4444' }}>🔴 Banned</span>
                        )}
                      </td>
                      <td className={styles.actionCell}>
                        <button 
                          className={styles.moreBtn} 
                          onClick={() => setActiveMenu(activeMenu === user.userId ? null : user.userId)}
                        >
                          <FaEllipsisV />
                        </button>
                        
                        {/* القائمة المنبثقة للتحكم */}
                        {activeMenu === user.userId && (
                          <div className={styles.dropdownMenu}>
                            <button><FaUserCheck /> Change Role</button>
                            <button className={styles.banBtn}><FaBan /> Ban User</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-muted">
                      No users found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
// test user data=================================================================================================
