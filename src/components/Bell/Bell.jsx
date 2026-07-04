import React, { useEffect } from "react";
import { FaArrowLeft, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext"; // ✅ Capital C
import styles from "./Bell.module.css";

export default function Bell() {
  const navigate = useNavigate();
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    unreadCount,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []); // fetchNotifications is stable (useCallback with no deps)

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h2>Notifications</h2>
        {unreadCount > 0 && (
          <button className={styles.markAllBtn} onClick={markAllAsRead}>
            Mark all read
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className={styles.content}>

        {isLoading && (
          <div className={styles.empty}>Loading…</div>
        )}

        {!isLoading && error && (
          <div className={styles.empty} style={{ color: "#ef4444" }}>
            {error}
            <button className={styles.retryBtn} onClick={fetchNotifications}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && notifications.length === 0 && (
          <div className={styles.empty}>لا يوجد إشعارات</div>
        )}

        {!isLoading && !error && notifications.map((n) => (
          <div
            key={n.id}
            className={`${styles.card} ${n.isRead ? styles.read : styles.unread}`}
            onClick={() => markAsRead(n.id)}
          >
            <div className={styles.iconWrap}>
              <FaBell className={styles.icon} />
              {!n.isRead && <span className={styles.dot} />}
            </div>

            <div className={styles.body}>
              {n.title && <p className={styles.title}>{n.title}</p>}
              <p className={styles.msg}>{n.message}</p>
              {n.createdAt && (
                <time className={styles.time}>{n.createdAt}</time>
              )}
            </div>

            <button
              className={styles.deleteBtn}
              onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
              aria-label="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}