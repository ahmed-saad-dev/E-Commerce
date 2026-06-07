


import React, { useState } from "react";
import styles from "./SellerUploadProduct.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

export default function SellerUploadProduct() {
  let navigate = useNavigate();
  
  // 1️⃣ تحديث الـ State لتشمل الـ IDs والملفات الحقيقية للصور
  const [form, setForm] = useState({
    productName: "",
    price: "",
    brandId: "1",       // السيرفر يطلب BrandId (رقم)
    categoryId: "",    // السيرفر يطلب CategoryId (رقم)
    subCategoryId: "", 
    description: "",
    imageFiles: [],    // هنا هنخزن ملفات الـ File الحقيقية للرفع
    imagePreviews: [], // هنا هنخزن الـ Blob URLs للعرض فقط في الـ JSX
  });

  const [editingIndex, setEditingIndex] = useState(null);

  // 2️⃣ دالة الرفع الكبرى باستخدام FormData
  async function handleUplaodedProduct() {
    const token = localStorage.getItem("userToken");

    // إنشاء كائن FormData لأن الـ Content-Type هو multipart/form-data
    const formData = new FormData();
    
    // إضافة الحقول بنفس الأسماء المطلوبة في الـ Swagger بالظبط (بحرف كابيتال)
    formData.append("Name", form.productName);
    formData.append("Price", Number(form.price) || 0);
    formData.append("Description", form.description || "No description provided");
    formData.append("CategoryId", Number(form.categoryId) || 1);
    formData.append("SubCategoryId", Number(form.subCategoryId) || 1);
    formData.append("BrandId", Number(form.brandId) || 1);

    // إضافة ملفات الصور الحقيقية بداخل الـ FormData
    if (form.imageFiles && form.imageFiles.length > 0) {
      form.imageFiles.forEach((file) => {
        formData.append("ImageFiles", file); // نفس الاسم المكتوب في الـ Swagger
      });
    }

    try {
      let response = await axios.post(
        `https://egzone.runasp.net/api/Products`, 
        formData, 
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'multipart/form-data', // 👈 تغيير نوع المحتوى هنا
            'Authorization': `Bearer ${token}` 
          }
        }
      );
      
      console.log("UploadResponse: ", response);
      alert("🚀 مبروك! تم رفع المنتج بنجاح كـ FormData إلى السيرفر!");

      // تصفير الفورم
      setForm({
        productName: "",
        price: "",
        brandId: "1",
        category: "",
        categoryId: "",
        subCategoryId: "", 
        description: "",
        imageFiles: [],
        imagePreviews: [],
      });

    } catch (error) {
      console.error("خطأ الـ API التفصيلي:", error.response);
      alert(`فشل الرفع: ${error.response?.data?.title || "تأكد من الصلاحية والبيانات"}`);
    }
  }
  
  // دالة الـ Change العادية مع تحديث الـ CategoryId رقمياً بالمرة لتسهيل التجربة
  // const handleChange = (e) => {
  //   if (e.target.name === "category") {
  //     // خريطة سريعة لربط اسم القسم بالـ ID المقترح له في الـ Backend
  //     const categoryMap = {
  //       "electronics": 1,
  //       "fashion": 2,
  //       "home-furniture-kitchen": 3,
  //       "beauty-personal-care": 4,
  //       "grocery-essentials": 5,
  //       "health-fitness-wellness": 6,
  //       "books-stationery-office": 7,
  //       "toys-games-baby": 8,
  //       "automotive-tools": 9,
  //       "sports-outdoor": 10,
  //       "digital-products": 11
  //     };
  //     const selectedId = categoryMap[e.target.value] || "";
  //     setForm({ ...form, category: e.target.value, categoryId: selectedId, subCategoryId: "" });
  //   } else {
  //     setForm({ ...form, [e.target.name]: e.target.value });
  //   }
  // };


  // دالة الـ Change الذكية والمصلحة تماماً
  const handleChange = (e) => {
    if (e.target.name === "category") {
      const selectedValue = e.target.value; // دي هتكون "1" أو "2" إلخ
      
      setForm({ 
        ...form, 
        category: selectedValue, 
        categoryId: selectedValue ? Number(selectedValue) : "", // تحويل مباشر لرقم
        subCategoryId: "" // 👈 تصفير القسم الفرعي فوراً لمنع تداخل الأقسام القديمة
      });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };



  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span onClick={() => navigate(-1)} className={styles.back}>←</span>
            <h2>Add New Product</h2>
          </div>

          {/* Product Images */}
          <div className={styles.section}>
            <h3 style={{padding: "10px 0"}}>Product Gallery (Up to 3 photos)</h3>
            <div className={styles.imagesFlexContainer}>
              <input
                type="file"
                id="image-upload"
                name="images"
                accept="image/*"
                multiple={editingIndex === null} 
                className={styles.hiddenInput}
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length === 0) return;

                  // الاحتفاظ بالروابط الوهمية للعرض والملفات الحقيقية للرفع
                  const newPreviews = files.map(file => URL.createObjectURL(file));

                  if (editingIndex !== null) {
                    const updatedFiles = [...form.imageFiles];
                    const updatedPreviews = [...form.imagePreviews];
                    
                    updatedFiles[editingIndex] = files[0];
                    updatedPreviews[editingIndex] = newPreviews[0];

                    setForm({ ...form, imageFiles: updatedFiles, imagePreviews: updatedPreviews });
                    setEditingIndex(null); 
                  } else {
                    const totalFiles = [...form.imageFiles, ...files].slice(0, 3);
                    const totalPreviews = [...form.imagePreviews, ...newPreviews].slice(0, 3);
                    setForm({ ...form, imageFiles: totalFiles, imagePreviews: totalPreviews });
                  }
                  e.target.value = ""; 
                }}
              />

              {form.imagePreviews?.map((imgUrl, index) => (
                <label
                  key={index}
                  htmlFor="image-upload" 
                  className={styles.imageBox}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setEditingIndex(index)} 
                >
                  <img src={imgUrl} alt={`Product ${index + 1}`} className={styles.previewImg} />
                  <div className={styles.replaceOverlay}>
                    <span>Click to Replace</span>
                  </div>
                </label>
              ))}

              {form.imagePreviews.length < 3 && (
                <label 
                  htmlFor="image-upload" 
                  className={styles.imageBox} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setEditingIndex(null)} 
                >
                  <div className={styles.upload}>
                    <span className={styles.plus}>＋</span>
                    <p>{form.imagePreviews.length > 0 ? "Add Another" : "Add Photo"}</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className={styles.section}>
            <h3>Basic Information</h3>
            <input
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="Product Name"
              className={styles.input}
            />
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price (EGP)"
              className={styles.input}
            />
            <input
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              placeholder="Brand ID (e.g. 1)"
              className={styles.input}
            />
          </div>

          {/* Category */}
          <div className={styles.section}>
            <h3>Category</h3>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={styles.inputs}
            >
              <option value="">Category</option>

              <option value="1">Electronics</option>
              <option value="2">Fashion & Baby</option>
              <option value="3">Home & Furniture</option>
              <option value="4">Beauty & Personal Care</option>
              <option value="5">Home Appliances</option>
              <option value="6">Watches & Jewelry</option>
              <option value="7">Automotive</option>
              <option value="8">Toys & Gaming</option>
              <option value="9">Grocery & Food</option>
              <option value="10">Books & Office Supplies</option>
              <option value="11">Pet Supplies</option>
              <option value="12">Health & Fitness</option>
              <option value="13">Tools & Hardware</option>
            </select>
          </div>

          {/* Subcategory */}
          <div className={styles.section}>
            <h3>Subcategory</h3>
            <select
              name="subCategoryId" 
              value={form.subCategoryId} 
              onChange={handleChange}
              className={styles.inputs}
            >
              {form.category !== "" ? (
                <option value="">Select a Subcategory</option>
              ) : (
                <option value="">Select a category first</option>
              )}

               {form.category === "1" && (
                <>
                  <option value="1">Mobile Phones</option>
                  <option value="2">Computers</option>
                  <option value="3">Audio & Video</option>
                  <option value="4">Accessories</option>
                  <option value="21">Audio</option>
                  <option value="22">Furniture</option>
                  <option value="23">Headphones</option>
                  <option value="24">Smart Home</option>
                  <option value="25">Storage</option>
                  <option value="85">Musical Instruments</option>
                  <option value="86">Studio & Pro Audio</option>
                  <option value="87">Speakers & Audio</option>
                </>
              )}

              {form.category === "2" && (
                <>
                  <option value="5">Men</option>
                  <option value="6">Women</option>
                  <option value="7">Kids</option>
                  <option value="8">Accessories</option>
                  <option value="26">Footwear</option>
                  <option value="27">Kids' Clothing</option>
                  <option value="28">Men's Clothing</option>
                  <option value="29">Travel</option>
                  <option value="30">Women's Clothing</option>
                  <option value="88">Strollers & Car Seats</option>
                  <option value="89">Baby Diapering</option>
                  <option value="90">Baby Feeding</option>
                  <option value="91">Baby Skin & Hair Care</option>
                  <option value="92">Baby Furniture</option>
                </>
              )}

              {form.category === "3" && (
                <>
                  <option value="9">Furniture</option>
                  <option value="10">Kitchen & Dining</option>
                  <option value="11">Home Decor</option>
                  <option value="12">Home Improvement</option>
                  <option value="31">Decor</option>
                  <option value="32">Lighting</option>
                  <option value="33">Living Room</option>
                  <option value="34">Office</option>
                  <option value="35">Tables</option>
                </>
              )}

              {form.category === "4" && (
                <>
                  <option value="13">Make Up</option>
                  <option value="14">Skin Care</option>
                  <option value="15">Hair Care</option>
                  <option value="16">Fragrances</option>
                  <option value="19">Health</option>
                  <option value="20">Men's Grooming</option>
                </>
              )}

              {form.category === "5" && (
                <>
                  <option value="36">Climate Control</option>
                  <option value="37">Kitchen</option>
                </>
              )}

              {form.category === "6" && (
                <>
                  <option value="42">Men Watches</option>
                  <option value="43">Sports Watches</option>
                  <option value="44">Jewelry</option>
                  <option value="45">Luxury Watches</option>
                  <option value="46">Women Watches</option>
                  <option value="47">Casual Watches</option>
                </>
              )}

              {form.category === "7" && (
                <>
                  <option value="48">Car Electronics</option>
                  <option value="49">Car Maintenance Tools</option>
                  <option value="50">Car Care & Cleaning</option>
                  <option value="51">Car Lighting</option>
                  <option value="52">Car Interior Accessories</option>
                </>
              )}

              {form.category === "8" && (
                <>
                  <option value="53">Video Game Consoles</option>
                  <option value="54">Building Blocks</option>
                  <option value="55">Gaming Accessories</option>
                  <option value="56">Dolls & Playsets</option>
                  <option value="57">Board Games</option>
                  <option value="58">RC Toys</option>
                  <option value="59">Toy Vehicles</option>
                  <option value="60">Collectible Figures</option>
                </>
              )}

              {form.category === "9" && (
                <>
                  <option value="61">Beverages</option>
                  <option value="62">Chocolates & Sweets</option>
                  <option value="63">Canned & Packaged Food</option>
                  <option value="64">Cooking Essential</option>
                  <option value="65">Breakfast Spreads</option>
                  <option value="66">Sauces & Condiments</option>
                  <option value="67">Chips & Snacks</option>
                </>
              )}

              {form.category === "10" && (
                <>
                  <option value="68">Self-Development Books</option>
                  <option value="69">Luxury Pens</option>
                  <option value="70">Notebooks & Diaries</option>
                  <option value="71">Art Supplies</option>
                  <option value="72">Finance & Business Books</option>
                  <option value="73">Office Electronics</option>
                  <option value="74">Writing & Markers</option>
                  <option value="75">Psychology Books</option>
                  <option value="76">Office Paper Supplies</option>
                </>
              )}

              {form.category === "11" && (
                <>
                  <option value="81">Cat Food & Treats</option>
                  <option value="82">Dog Food & Crates</option>
                  <option value="83">Pet Accessories</option>
                  <option value="84">Cat Litter</option>
                </>
              )}

              {form.category === "12" && (
                <>
                  <option value="39">Fitness</option>
                  <option value="77">Supplements</option>
                  <option value="78">Medical Devices</option>
                  <option value="79">Massagers & Wellness</option>
                  <option value="80">Fitness Equipment</option>
                </>
              )}

              {form.category === "13" && (
                <>
                  <option value="40">Hand Tools</option>
                  <option value="41">Power Tools</option>
                </>
              )}
         {/* باقي الـ options تعمل بنفس الشكل... */}
            </select>
          </div>

          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Full Description"
          ></textarea>

          <div className={styles.btnContainer}>
            <button 
              disabled={form.category === '' || form.price === '' || form.productName === '' || form.subCategoryId === '' || form.imageFiles.length === 0} 
              onClick={handleUplaodedProduct} 
              className={styles.publishBtn}
            >
              Publish Product
            </button>
          </div>      
        </div>
      </div>
      <Footer />
    </>
  );
}








