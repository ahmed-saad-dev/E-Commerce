import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../Bell/NotificationContext";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./Bell.module.css";

export default function Bell() {
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  } = useNotifications();

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.header}>

        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>

        <div className={styles.titleBox}>
          <h2>Notifications</h2>
          <span>{notifications.length} items</span>
        </div>

        <div style={{ width: 35 }} />
      </div>

      {/* BODY */}
      <div className={styles.body}>

        {isLoading && (
          <div className={styles.center}>
            <div className={styles.loader}></div>
            <p>Loading notifications...</p>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {!isLoading && notifications.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.icon}>🔔</div>
            <h3>لا يوجد إشعارات</h3>
            <p>سيتم عرض الإشعارات هنا عند وصولها</p>
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`${styles.card} ${n.isRead ? "" : styles.unread}`}
            onClick={() => markAsRead(n.id)}
          >
            <div className={styles.dot} />

            <div className={styles.content}>
              <h4>{n.title || "Notification"}</h4>
              <p>{n.message}</p>
            </div>

            <button
              className={styles.delete}
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(n.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}