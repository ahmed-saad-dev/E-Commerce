
import React, { useState, useEffect } from "react";
import styles from "./AdminReports.module.css";
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminReports() {
  const navigate = useNavigate();
  const [reportsList, setReportsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // 1️⃣ جلب البلاغات عند تحميل الصفحة
  async function Admin_reports() {
    const token = localStorage.getItem('userToken');
    setLoading(true);

    axios.get('https://egzone.runasp.net/api/Admin/reports', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      console.log('Admin Report response: ', res);
      if (res.data) {
        setReportsList(res.data);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.log('Admin Report Error: ', err);
      setLoading(false);
    });
  }

  useEffect(() => {
    Admin_reports();
  }, []);

  // 2️⃣ تحديث حالة التقرير بربط الـ APIs الفعلية (Resolve & Dismiss)
  const handleUpdateStatus = (id, newStatus) => {
    const token = localStorage.getItem('userToken');
    
    // تحديد الـ Endpoint بناءً على القرار المتخذ
    const endpointUrl = newStatus.toLowerCase() === "resolved" 
      ? `https://egzone.runasp.net/api/Admin/reports/${id}/resolve`
      : `https://egzone.runasp.net/api/Admin/reports/${id}/dismiss`;

    // إرسال الـ PUT Request الفعلي للسيرفر (تمرير الـ Token يحميك من خطأ 401)
    axios.put(endpointUrl, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      }
    })
    .then((res) => {
      console.log(`Report ${id} updated to ${newStatus} successfully`, res);
      
      // تحديث الـ state محلياً فوراً بعد نجاح العملية في قاعدة البيانات
      setReportsList(prev => 
        prev.map(rep => rep.reportId === id ? { ...rep, status: newStatus } : rep)
      );
    })
    .catch((err) => {
      console.log(`Error updating report ${id} to ${newStatus}:`, err);
      alert(`فشلت العملية، تأكد من تسجيل الدخول بصلاحيات الأدمن.`);
    });
  };

  // 3️⃣ الفلترة
  const filteredReports = reportsList.filter(report => {
    if (activeFilter === "All") return true;
    return report.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <h2>EgyZone <span>Admin</span></h2>
        </div>
        <nav className={styles.navMenu}>
          <button onClick={() => navigate('/adminDashboard')} className={styles.navItem}>📊 Dashboard</button>
          <button onClick={() => navigate('/admin')} className={styles.navItem}>👥 Users</button>
          <button onClick={() => navigate('/adminProduct')} className={styles.navItem}>📦 Products</button>
          <button className={`${styles.navItem} ${styles.active}`}>📋 Reports</button>
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

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <div>
            <h2>Reports Management</h2>
            <p className={styles.subText}>Review and resolve system flags and user reports</p>
          </div>
          <div className={styles.adminProfile}>
            <span>Welcome, Admin 👑</span>
          </div>
        </header>

        <section className={styles.filterBar}>
          {["All", "Open", "Resolved", "Dismissed"].map((filter) => (
            <button
              key={filter}
              className={`${styles.filterBtn} ${activeFilter === filter ? styles.activeFilter : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "All" && "✓ "}
              {filter}
            </button>
          ))}
        </section>

        <section className={styles.reportsGrid}>
          {loading ? (
            <div className={styles.loader}>Loading Reports...</div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div className={styles.reportCard} key={report.reportId}>
                
                <div className={styles.cardTop}>
                  <div className={styles.titleInfo}>
                    <FaExclamationTriangle className={styles.reportIcon} />
                    <div>
                      <h4>Report Type: {report.contentType}</h4>
                      <p className={styles.targetName}>Target Content ID: <strong>{report.contentId}</strong></p>
                    </div>
                  </div>
                  
                  <span className={`${styles.statusBadge} ${styles[report.status?.toLowerCase() || 'open']}`}>
                    Status: {report.status}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.reasonText}><strong>Reason:</strong> {report.reason || "No reason provided"}</p>
                  <div className={styles.metaInfo}>
                    <span>👤 Reported By: {report.reportedByUserName}</span>
                    <span>📅 Date: {formatDate(report.createdAt)}</span>
                  </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.cardActions}>
                  <div className={styles.leftActions}>
                    <button className={styles.viewBtn}>
                      <FaEye /> View Target Content
                    </button>
                  </div>
                  
                  <div className={styles.rightActions}>
                    {report.status?.toLowerCase() === "open" ? (
                      <>
                        <button 
                          className={styles.dismissBtn} 
                          onClick={() => handleUpdateStatus(report.reportId, "Dismissed")}
                        >
                          Dismiss
                        </button>
                        <button 
                          className={styles.resolveBtn} 
                          onClick={() => handleUpdateStatus(report.reportId, "Resolved")}
                        >
                          Resolve
                        </button>
                      </>
                    ) : report.status?.toLowerCase() === "resolved" ? (
                      <span className={styles.completedText}><FaCheckCircle /> Handled</span>
                    ) : (
                      <span className={styles.dismissedText}><FaTimesCircle /> Archived</span>
                    )}
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className={styles.noReports}>
              No reports found in "{activeFilter}" category.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


// test put Dissminse API===================================================================================================
