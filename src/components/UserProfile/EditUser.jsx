import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaArrowLeft,
  FaSave,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EditUser.module.css";

const BASE_URL = "https://egzone.runasp.net/api/UserProfile";

export default function EditUser() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const [originalUser, setOriginalUser] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  async function getUserData() {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const { data } = await axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = {
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
      };

      setUser(userData);
      setOriginalUser(userData);
    } catch (err) {
      setError("Failed to load user data.");
      if (err.response?.status === 401) {
        localStorage.removeItem("userToken");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedUser = { ...user, [name]: value };
    setUser(updatedUser);
    setError("");
    setSuccess("");

    setHasChanges(
      updatedUser.fullName !== originalUser.fullName ||
      updatedUser.phoneNumber !== originalUser.phoneNumber
    );
  };

  const handleSave = async () => {
    if (!user.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!hasChanges) {
      setError("No changes to save.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("userToken");
      await axios.put(
        `${BASE_URL}/update`,
        {
          fullName: user.fullName.trim(),
          phoneNumber: user.phoneNumber.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("✅ Profile updated successfully!");
      setOriginalUser({ ...user });
      setHasChanges(false);

      setTimeout(() => navigate("/userProf"), 1500);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err?.response?.data?.message || "Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) return;
    }
    navigate("/userProf");
  };

  // Build initials safely: drop empty fragments (extra spaces) and
  // guard against missing characters instead of assuming they exist.
  const initials = user.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() ?? "")
        .join("") || "?"
    : "?";

  if (loading) {
    return (
      <div className={styles.centered}>
        <FaSpinner className={styles.spinner} size={40} color="#22c55e" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <button className={styles.backBtn} onClick={handleCancel}>
          <FaArrowLeft />
        </button>
        <h2 className={styles.headerTitle}>Edit Profile</h2>
        <div className={styles.placeholder}></div>
      </div>

      <div className={styles.content}>
        {/* Avatar */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <span className={styles.initials}>{initials}</span>
          </div>
        </div>

        {/* Alerts */}
        {error && <div className={styles.errorMsg}>{error}</div>}
        {success && <div className={styles.successMsg}>{success}</div>}

        {/* Form */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FaUser />
            Full Name *
          </label>
          <input
            className={styles.input}
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            maxLength={100}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FaPhone />
            Phone Number
          </label>
          <input
            className={styles.input}
            type="tel"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            maxLength={20}
          />
        </div>

        {/* Buttons */}
        <button
          onClick={handleSave}
          className={`${styles.saveBtn} ${!hasChanges ? styles.disabled : ''}`}
          disabled={saving || !hasChanges}
        >
          {saving ? (
            <>
              <FaSpinner className={styles.spinner} style={{ marginRight: 8 }} />
              Saving...
            </>
          ) : (
            <>
              <FaSave style={{ marginRight: 8 }} />
              Save Changes
            </>
          )}
        </button>

        <button onClick={handleCancel} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
}