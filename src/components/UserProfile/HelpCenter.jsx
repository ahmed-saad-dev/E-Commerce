import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";

export default function HelpCenter() {
  const { theme } = useContext(ThemeContext);
  const dk = theme === "dark";

  const styles = {
    container: {
      padding: "30px",
      maxWidth: "900px",
      margin: "auto",
      background: dk ? "#121212" : "#fff",
      minHeight: "100vh",
      color: dk ? "#fff" : "#111",
      transition: "background 0.3s ease",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: dk ? "#fff" : "#111",
    },
    subtitle: {
      color: dk ? "#aaa" : "#666",
      marginBottom: "20px",
    },
    section: {
      marginTop: "30px",
      padding: "20px",
      background: dk ? "#1e1e1e" : "#f9f9f9",
      borderRadius: "10px",
      color: dk ? "#fff" : "#111",
      transition: "background 0.3s ease",
    },
    list: {
      listStyle: "none",
      padding: 0,
      lineHeight: "2",
      color: dk ? "#ccc" : "#333",
    },
    faq: {
      marginBottom: "15px",
      color: dk ? "#ccc" : "#333",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Help Center</h1>
      <p style={styles.subtitle}>How can we help you today?</p>

      <div style={styles.section}>
        <h3>Quick Help</h3>
        <ul style={styles.list}>
          <li>🛒 <Link to="/cart" style={{ color: "#28a745" }}>Check your cart</Link></li>
          <li>📦 Track your orders</li>
          <li>👤 Account settings</li>
          <li>💳 Payment issues</li>
        </ul>
      </div>

      <div style={styles.section}>
        <h3>FAQ</h3>
        <div style={styles.faq}>
          <p><b>How do I place an order?</b></p>
          <p>Go to any product and click Add to Cart, then checkout.</p>
        </div>
        <div style={styles.faq}>
          <p><b>Can I cancel my order?</b></p>
          <p>Yes, from your order history before shipping.</p>
        </div>
        <div style={styles.faq}>
          <p><b>How to contact support?</b></p>
          <p>You can email us or use live chat.</p>
        </div>
      </div>

      <div style={styles.section}>
        <h3>Contact Us</h3>
        <p>Email: support@yourstore.com</p>
        <p>Phone: +20 01xxxxxxxxx</p>
      </div>
    </div>
  );
}