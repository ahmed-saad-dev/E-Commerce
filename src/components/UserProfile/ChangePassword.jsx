import React, { useState } from "react";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaKey,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ChangePassword.module.css";

const BASE_URL = "https://egzone.runasp.net/api/UserProfile";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  const toggleShow = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const validateForm = () => {
    if (!formData.oldPassword) {
      setError("Current password is required.");
      return false;
    }
    if (!formData.newPassword) {
      setError("New password is required.");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return false;
    }
    if (formData.oldPassword === formData.newPassword) {
      setError("New password must be different from current password.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("userToken");

      await axios.post(
        `${BASE_URL}/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("✅ Password changed successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => navigate("/userProf"), 2000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Current password is incorrect.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid password format.");
      } else {
        setError(err?.response?.data?.message || "Failed to change password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = () => {
    const pwd = formData.newPassword;
    if (!pwd) return { level: 0, text: "" };
    if (pwd.length < 6) return { level: 1, text: "Weak", color: "#dc3545" };
    if (pwd.length < 10) return { level: 2, text: "Medium", color: "#f59e0b" };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) {
      return { level: 4, text: "Strong", color: "#22c55e" };
    }
    return { level: 3, text: "Good", color: "#0ea5e9" };
  };

  const pwdStrength = strength();

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <button className={styles.backBtn} onClick={() => navigate("/userProf")}>
          <FaArrowLeft />
        </button>
        <h2 className={styles.headerTitle}>Change Password</h2>
        <div className={styles.placeholder}></div>
      </div>

      <div className={styles.content}>
        {/* Icon */}
        <div className={styles.iconContainer}>
          <div className={styles.iconCircle}>
            <FaKey size={28} color="#fff" />
          </div>
        </div>

        <p className={styles.subtitle}>
          Enter your current password and choose a new one
        </p>

        {/* Alerts */}
        {error && <div className={styles.errorMsg}>{error}</div>}
        {success && <div className={styles.successMsg}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FaLock />
              Current Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type={showPassword.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => toggleShow("old")}
              >
                {showPassword.old ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FaLock />
              New Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => toggleShow("new")}
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Strength */}
            {formData.newPassword && (
              <div className={styles.strengthBar}>
                <div
                  className={styles.strengthFill}
                  style={{
                    width: `${(pwdStrength.level / 4) * 100}%`,
                    background: pwdStrength.color,
                  }}
                />
                <span style={{ color: pwdStrength.color, fontSize: 12, marginTop: 4 }}>
                  {pwdStrength.text}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FaLock />
              Confirm New Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => toggleShow("confirm")}
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <span className={styles.matchError}>Passwords do not match</span>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <span className={styles.matchSuccess}>Passwords match ✓</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className={styles.spinner} style={{ marginRight: 8 }} />
                Changing...
              </>
            ) : (
              <>
                <FaKey style={{ marginRight: 8 }} />
                Change Password
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/userProf")}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}