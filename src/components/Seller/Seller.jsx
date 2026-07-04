





import React, { useState, useContext, useEffect } from "react";
import styles from "./Seller.module.css";
import { userContext } from "../../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import {
  FaUser,
  FaStore,
  FaMoon,
  FaGlobe,
  FaUserEdit,
  FaLock,
  FaChevronRight,
  FaBox,
  FaPlusCircle,
  FaTachometerAlt,
} from "react-icons/fa";
import axios from "axios";

export default function Seller() {
  const [darkMode, setDarkMode] = useState(false);
  
  // 1️⃣ استخدام الـ State لتخزين بيانات السيرفر فور جلبها
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  let { 
    setLogin, 
    sellerEmail, 
    sellerEditName, 
    sellerEditImage, 
    sellerEditPhone 
  } = useContext(userContext);
  
  let navigate = useNavigate();

  // 2️⃣ جلب الداتا الاحتياطية من الـ Local Storage لمنع الـ Flash أثناء التحميل
  const token = localStorage.getItem("userToken");
  const savedData = token ? JSON.parse(localStorage.getItem(`profile_${token}`)) : null;

  async function sellerProfile() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get(`https://egzone.runasp.net/api/Sellers/my-profile`, {
      headers: {
        'accept': 'text/plain',
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      console.log('profRes: ', res.data);
      // setProfileData(res.data); // 👈 حفظ البيانات القادمة من السيرفر في الـ State
      // setLoading(false);
      
      // حفظ النسخة الجديدة في الـ localStorage تحديثاً للـ Refresh
      localStorage.setItem(`profile_${token}`, JSON.stringify(res.data));
    })
    .catch((err) => {
      console.error('proErr: ', err.response || err);
      // setLoading(false);
    });
  }

  useEffect(() => {
    sellerProfile();
  }, []);












    async function seller_Profile() {
        // 1. نجيب التوكن اللي أنت مخزنه في الـ localStorage عند تسجيل الدخول
        const token = localStorage.getItem("userToken"); 

        axios.get('https://egzone.runasp.net/api/Sellers/my-profile', {
            headers: {
                // 2. نمرر التوكن في الهيدر بالشكل الصحيح
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log('seller Profile res: ', res);
        })
        .catch((err) => {
            console.log('seller Profile err: ', err);
        });
    }

    useEffect(() => {
        seller_Profile();
    }, []);















  // 3️⃣ دمج مصادر البيانات (السيرفر أولاً -> الـ Context -> الـ LocalStorage -> القيمة الافتراضية)
  const finalName = profileData?.userName || sellerEditName || savedData?.userName || "EGzoneMarket";
  const finalEmail = profileData?.email || sellerEmail || savedData?.email || "EGzoneMarket@gmail.com";
  const finalPhone = profileData?.phoneNumber || sellerEditPhone || savedData?.phoneNumber || "012345678912";
  const finalImage = profileData?.profileImage || sellerEditImage || savedData?.profileImage;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <div className={styles.header}></div>

        {/* User Info */}
        <div className={styles.userInfo}>
          
          {/* عرض الصورة المرفوعة أو الآتية من الـ API */}
          <div className={styles.avatar}>
            {finalImage ? (
              <img src={finalImage} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <FaUser />
            )}
          </div>

          {/* عرض البيانات المدمجة مباشرة بدون عمل map غير ضروري على الـ Object */}
          <div>
            <h3>{finalName}</h3>
            <p>{finalEmail}</p>
            <span>{finalPhone}</span>
          </div>

          <div className={styles.badge}>
            Account Type: Seller
          </div>
        </div>

        {/* Store Management */}
        <div className={styles.section}>
          <h4>STORE MANAGEMENT</h4>
          <Link to={'/manageInventory'} className={styles.item}>
            <div>
              <FaBox />
              <span>Manage Inventory</span>
            </div>
            <FaChevronRight />
          </Link>
          {/* <div className={styles.item}>
            <div>
              <FaStore />
              <span>Shop Settings</span>
            </div>
            <FaChevronRight />
          </div> */}
          <Link to="/sellerUploadProduct" className={styles.item}>
            <div>
              <FaPlusCircle />
              <span>Upload Product</span>
            </div>
            <FaChevronRight />
          </Link>
          {/* <Link to="/SellerDashboard" className={styles.item}>
            <div>
              <FaTachometerAlt />
              <span>Dashboard</span>
            </div>
            <FaChevronRight />
          </Link> */}
        </div>

        {/* Settings */}
        {/* <div className={styles.section}>
          <h4>SETTINGS</h4>
          <div className={styles.item}>
            <div>
              <FaMoon />
              <span>Theme</span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          <div className={styles.item}>
            <div>
              <FaGlobe />
              <span>Language</span>
            </div>
            <FaChevronRight />
          </div>
        </div> */}

        {/* Account */}
        <div className={styles.section}>
          <h4>ACCOUNT</h4>
          <Link to={'/editSellerProfile'} className={styles.item}>
            <div>
              <FaUserEdit />
              <span>Edit Profile</span>
            </div>
            <FaChevronRight />
          </Link>
          <div className={styles.item}>
            <div>
              <FaLock />
              <span>Change Password</span>
            </div>
            <FaChevronRight />
          </div>
        </div>

        {/* Logout Button */}
        <div className={styles.logoutBtnContainer}>
          <button 
            className={styles.logoutBtn}
            onClick={() => {
              localStorage.removeItem('userToken')
              navigate('/login')
            }}
            >
            LogOut
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}