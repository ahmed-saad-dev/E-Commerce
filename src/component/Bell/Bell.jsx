import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";

import styles from "./Bell.module.css";

export default function Bell() {
  const navigate = useNavigate();
  const { notifications, fetchNotifications, markAsRead } =
    useNotifications();

  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>

        <h2>Notifications</h2>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>
            لا يوجد إشعارات
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={styles.card}
              onClick={() => markAsRead(n.id)}
            >
              <FaBell className={styles.icon} />
              <div>
                <p className={styles.title}>{n.title}</p>
                <p className={styles.msg}>{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}