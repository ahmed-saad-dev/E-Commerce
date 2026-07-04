
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditSellerProfile.module.css";
import { userContext } from '../../Context/userContext';

export default function EditSellerProfile() {
  const navigate = useNavigate();
  
  // فك التفكيك للقيم والـ setters من الـ Context
  let { 
    setSellerEmail,
    sellerEmail, 
    setSellerEditImage, 
    setSellerEditName, 
    setSellerEditPhone 
  } = useContext(userContext);
  
  const token = localStorage.getItem("userToken");
  const localStorageKey = `profile_${token}`;

  // 1️⃣ الـ State الأساسية للـ Form
  const [form, setForm] = useState({
    userName: "EGzoneMarket",
    phoneNumber: "012345678912",
    profileImage: "", 
  });

  // 2️⃣ جلب البيانات المحفوظة من الـ localStorage عند فتح الصفحة لأول مرة فقط
  useEffect(() => {
    if (token) {
      const savedData = localStorage.getItem(localStorageKey);
      if (savedData) {
        setForm(JSON.parse(savedData));
      }
    }
  }, [token, localStorageKey]); // تشغيل فقط عند تغيير التوكن (الفتح أول مرة)

  // 3️⃣ تحويل الصورة المرفوعة لـ Base64 وعرضها فوراً
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 4️⃣ دالة الحفظ وتحديث الـ Context
  const handleSave = (e) => {
    e.preventDefault(); // منع الصفحة من عمل Refresh

    if (!token) {
      alert("❌ خطأ: لم يتم العثور على توكن المستخدم.");
      return;
    }

    // أولاً: حفظ البيانات في الـ localStorage عشان لو قفل المتصفح وفتح
    localStorage.setItem(localStorageKey, JSON.stringify(form));

    // ثانياً: تحديث الـ Context فوراً عشان التغيير يظهر في صفحة الـ Seller
    setSellerEditName(form?.userName);
    setSellerEditPhone(form?.phoneNumber);
    setSellerEditImage(form?.profileImage);

    alert("✅ تم حفظ تعديلات الحساب بنجاح!");
    navigate(-1); // الرجوع لصفحة الـ Seller
  };

  return (
    <div className={styles.mainEditContainer}>
      <div className={styles.editProfileContainer}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>←</button>
          <h2>Edit Profile</h2>
        </div>

        {/* ربط الفورم بدالة الـ handleSave */}
        <form onSubmit={handleSave} className={styles.form}>
          
          {/* قسم الصورة الشخصية */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <img 
                src={form.profileImage || "https://api.dicebear.com/7.x/bottts/svg?seed=EGzone"} 
                alt="Profile" 
                className={styles.profileImg} 
              />
              <label htmlFor="imageInput" className={styles.editIcon}>
                📸
              </label>
              <input 
                type="file" 
                id="imageInput" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: "none" }} 
              />
            </div>
            <p>Tap icon to change photo</p>
          </div>

          {/* مدخلات البيانات */}
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              value={form.userName} 
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={sellerEmail || "EGzoneMarket@gmail.com"} 
              disabled 
              className={styles.disabledInput} 
            />
            <small>Email cannot be changed</small>
          </div>

          <div className={styles.inputGroup}>
            <label>Phone Number</label>
            <input 
              type="text" 
              value={form.phoneNumber} 
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              required
            />
          </div>

          {/* الزرار هنا نوعه submit عشان يشغل الـ onSubmit بتاعة الفورم */}
          <button type="submit" className={styles.saveBtn}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}