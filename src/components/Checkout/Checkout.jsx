// Checkout.jsx
import React, { useContext, useState, useEffect } from 'react';
import styles from './Checkout.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { cartContext } from "../../Context/CartContext";
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaTruck, FaUndo, FaHeadset, FaCreditCard, FaPaypal, FaApplePay, FaUser, FaPhone, FaMapMarkerAlt, FaCity, FaBuilding, FaLayerGroup, FaDoorOpen, FaStickyNote, FaSpinner, FaCheck, FaTimes, FaClock, FaGift, FaBox, FaShippingFast, FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa';
import { SiGooglepay, SiVodafone } from 'react-icons/si';
import { MdOutlineLocalOffer } from 'react-icons/md';

export default function Checkout() {
  let { cartID, getCarts } = useContext(cartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0); // نسبة الخصم
  const [vcashNumber, setVcashNumber] = useState('');
  const [vcashError, setVcashError] = useState('');
  
  // Real cart state variables mirroring Carts.jsx calculations
  const [prodOfCarts, setProdOfCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Fetch real cart items on mount to compute live totals
  useEffect(() => {
    async function fetchCartData() {
      try {
        const { data } = await getCarts();
        setProdOfCarts(data || []);
      } catch (error) {
        console.error('Error fetching real cart data:', error);
      }
    }
    fetchCartData();
  }, [getCarts]);

  // Compute total price matching Carts.jsx logic
  useEffect(() => {
    let total = 0;
    prodOfCarts?.forEach((item) => {
      total += (item?.price || 0) * (item?.quantity || 1);
    });
    setTotalPrice(total);
  }, [prodOfCarts]);

  // Calculated values matching Cart summary structure exactly
  const totalItems = prodOfCarts.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = totalPrice;
  const shippingCost = 0; // Matching Cart page: "FREE" / 0 EGP
  const taxAmount = 0; // Matching Cart page: 0.00 EGP
  
  // حساب قيمة الخصم بناءً على نسبة الخصم (نصف المبلغ لو كود ahmed love bosy)
  const savingsAmount = (subtotal * discountPercent) / 100;
  const grandTotal = subtotal + shippingCost + taxAmount - savingsAmount;

  const handleBackNavigation = () => {
    const fromCart = location.state?.from === '/cart' || document.referrer.includes('/cart');
    if (fromCart) {
      navigate('/cart');
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/cart');
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('الاسم بالكامل مطلوب')
      .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
      .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'الاسم يحتوي على أحرف غير صالحة'),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صحيح (مثال: 01012345678)')
      .required('رقم الهاتف مطلوب'),
    city: Yup.string()
      .required('المدينة مطلوبة')
      .min(2, 'اسم المدينة قصير جداً'),
    details: Yup.string()
      .required('تفاصيل العنوان مطلوبة')
      .min(5, 'تفاصيل العنوان يجب أن تكون 5 أحرف على الأقل'),
  });

  let checkoutForm = useFormik({
    initialValues: { name: '', phone: '', city: '', details: '', building: '', floor: '', apartment: '', notes: '' },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => handleCheckOut(values),
  });

  async function handleCheckOut(formObj) {
    if (paymentMethod === 'card') {
      setLoading(true);
      try {
        const response = await axios.post(
          `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartID}`,
          { shippingAddress: formObj },
          { 
            headers: { token: localStorage.getItem("userToken") },
            params: { url: `http://localhost:5173` }
          }
        );
        if (response?.data?.session?.url) {
          location.href = response.data.session.url;
        } else {
          throw new Error('فشل في إنء جلسة الدفع');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        setLoading(false);
      }
    } else if (paymentMethod === 'vcash') {
      if (!vcashNumber || !/^01[0125][0-9]{8}$/.test(vcashNumber)) {
        setVcashError('يرجى إدخال رقم فودافون كاش صحيح');
        return;
      }
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setOrderSuccess(true);
        setTimeout(() => {
          alert('تم إرسال طلب الدفع عبر فودافون كاش بنجاح. سيتم تأكيد الطلب بعد استلام الدفعة.');
          setLoading(false);
          setOrderSuccess(false);
        }, 1500);
      } catch (error) {
        console.error('Vodafone Cash error:', error);
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOrderSuccess(true);
        setTimeout(() => {
          alert(`تم اختيار طريقة الدفع: ${paymentMethod}`);
          setLoading(false);
          setOrderSuccess(false);
        }, 1500);
      } catch (error) {
        console.error('Payment error:', error);
        setLoading(false);
      }
    }
  }

  const handleVcashChange = (e) => {
    const value = e.target.value;
    setVcashNumber(value);
    if (/^01[0125][0-9]{8}$/.test(value)) {
      setVcashError('');
    } else if (value.length > 0) {
      setVcashError('رقم غير صحيح (مثال: 01012345678)');
    } else {
      setVcashError('');
    }
  };

  const handleCouponApply = async () => {
    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const couponInput = document.querySelector(`.${styles.couponInput}`);
      const code = couponInput?.value?.trim() || '';

      if (!code) {
        setCouponError('⚠️ يرجى إدخال كود الخصم');
        setCouponLoading(false);
        return;
      }

      // التحقق من كود الخصم الجديد وكواد إضافية
      if (code.toLowerCase() === 'ahmed love bosy') {
        setDiscountPercent(50); // خصم 50% (نصف المبلغ)
        setCouponSuccess('✅ تم تطبيق خصم 50% بنجاح!');
      } else if (code === 'DISCOUNT10' || code === 'SAVE20') {
        setDiscountPercent(20);
        setCouponSuccess('✅ تم تطبيق الخصم بنجاح!');
      } else {
        setCouponError('❌ كود الخصم غير صحيح');
      }
    } catch (error) {
      setCouponError('❌ حدث خطأ في تطبيق الكود');
    } finally {
      setCouponLoading(false);
    }
  };

  const getFieldIcon = (fieldName) => {
    switch(fieldName) {
      case 'name': return <FaUser className={styles.inputIcon} />;
      case 'phone': return <FaPhone className={styles.inputIcon} />;
      case 'city': return <FaCity className={styles.inputIcon} />;
      case 'details': return <FaMapMarkerAlt className={styles.inputIcon} />;
      case 'building': return <FaBuilding className={styles.inputIcon} />;
      case 'floor': return <FaLayerGroup className={styles.inputIcon} />;
      case 'apartment': return <FaDoorOpen className={styles.inputIcon} />;
      case 'notes': return <FaStickyNote className={styles.inputIcon} />;
      default: return null;
    }
  };

  const getFieldLabel = (fieldName) => {
    const labels = {
      name: 'الاسم بالكامل',
      phone: 'رقم الهاتف',
      city: 'المدينة',
      details: 'تفاصيل العنوان',
      building: 'المبنى',
      floor: 'الدور',
      apartment: 'الشقة',
      notes: 'ملاحظات الطلب (اختياري)'
    };
    return labels[fieldName] || fieldName;
  };

  const getFieldType = (fieldName) => {
    switch(fieldName) {
      case 'phone': return 'tel';
      case 'name': return 'text';
      default: return 'text';
    }
  };

  const getAutoComplete = (fieldName) => {
    switch(fieldName) {
      case 'name': return 'name';
      case 'phone': return 'tel';
      case 'city': return 'address-level2';
      case 'details': return 'street-address';
      case 'building': return 'address-line1';
      default: return 'off';
    }
  };

  return (
    <>
      <Helmet><title>إتمام الطلب | EGZone Premium</title></Helmet>
      <div className={styles.pageWrapper}>
        <div className={styles.glowCircle1}></div>
        <div className={styles.glowCircle2}></div>
        <div className={styles.Checkout}>
          <div className={styles.topBarWrapper}>
            <button 
              type="button" 
              className={styles.backButton} 
              onClick={handleBackNavigation}
            >
              <FaArrowLeft className={styles.backIcon} />
              <span>العودة إلى السلة</span>
            </button>
          </div>
          <form onSubmit={checkoutForm.handleSubmit}>
            <div className={styles.checkoutLayout}>
            <div className={styles.leftColumn}>
              <div className={styles.glassCard}>
                <h3 className={styles.sectionTitle}><FaTruck /> معلومات الشحن والتواصل</h3>
                <div className={styles.formGrid}>
                  {['name', 'phone', 'city', 'details', 'building', 'floor', 'apartment'].map((field) => (
                    <div className={styles.inputWrapper} key={field}>
                      <div className={styles.inputContainer}>
                        <span className={styles.inputIconWrapper}>{getFieldIcon(field)}</span>
                        <input 
                          name={field}
                          type={getFieldType(field)}
                          autoComplete={getAutoComplete(field)}
                          inputMode={field === 'phone' ? 'numeric' : 'text'}
                          className={`${styles.formInput} ${checkoutForm.touched[field] && checkoutForm.errors[field] ? styles.inputError : ''} ${checkoutForm.touched[field] && !checkoutForm.errors[field] && checkoutForm.values[field] ? styles.inputSuccess : ''}`}
                          placeholder=" " 
                          onChange={checkoutForm.handleChange} 
                          onBlur={checkoutForm.handleBlur} 
                          value={checkoutForm.values[field]} 
                          disabled={loading}
                        />
                        <label className={styles.floatingLabel}>
                          {getFieldLabel(field)}
                        </label>
                      </div>
                      {checkoutForm.touched[field] && checkoutForm.errors[field] && (
                        <div className={styles.errorMsg}>
                          <FaTimes className={styles.errorIcon} />
                          {checkoutForm.errors[field]}
                        </div>
                      )}
                      {checkoutForm.touched[field] && !checkoutForm.errors[field] && checkoutForm.values[field] && (
                        <div className={styles.successMsg}>
                          <FaCheck className={styles.successIcon} />
                          ✓ صحيح
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Notes (optional) field spanning full width */}
                  <div className={`${styles.inputWrapper} ${styles.fullWidthField}`}>
                    <div className={styles.inputContainer}>
                      <span className={styles.inputIconWrapper}>{getFieldIcon('notes')}</span>
                      <input 
                        name="notes"
                        type="text"
                        autoComplete="off"
                        className={`${styles.formInput} ${checkoutForm.touched.notes && checkoutForm.values.notes ? styles.inputSuccess : ''}`}
                        placeholder=" " 
                        onChange={checkoutForm.handleChange} 
                        onBlur={checkoutForm.handleBlur} 
                        value={checkoutForm.values.notes} 
                        disabled={loading}
                      />
                      <label className={styles.floatingLabel}>
                        {getFieldLabel('notes')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.glassCard}>
                <h3 className={styles.sectionTitle}><FaCreditCard /> طريقة الدفع</h3>
                <div className={styles.paymentGrid}>
                  {[ 
                    {id:'card', name:'بطاقة ائتمان', icon:<FaCreditCard/>}, 
                    {id:'vcash', name:'فودافون كاش', icon:<SiVodafone/>}, 
                    {id:'paypal', name:'باي بال', icon:<FaPaypal/>}, 
                    {id:'apple', name:'آبل باي', icon:<FaApplePay/>}, 
                    {id:'google', name:'جوجل باي', icon:<SiGooglepay/>} 
                  ].map(m => (
                    <div 
                      key={m.id} 
                      role="button"
                      tabIndex={0}
                      className={`${styles.paymentMethodCard} ${paymentMethod === m.id ? styles.activePayment : ''}`} 
                      onClick={() => {
                        setPaymentMethod(m.id);
                        if (m.id !== 'vcash') {
                          setVcashError('');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setPaymentMethod(m.id);
                          if (m.id !== 'vcash') {
                            setVcashError('');
                          }
                        }
                      }}
                    >
                      {m.icon} <span>{m.name}</span>
                    </div>
                  ))}
                </div>
                {paymentMethod === 'vcash' && (
                  <div className={styles.vcashContainer}>
                    <div className={styles.vcashInput}>
                      <div className={styles.inputContainer}>
                        <span className={styles.inputIconWrapper}><FaPhone /></span>
                        <input 
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder=" " 
                          className={`${styles.formInput} ${vcashError ? styles.inputError : ''} ${vcashNumber && !vcashError ? styles.inputSuccess : ''}`}
                          value={vcashNumber}
                          onChange={handleVcashChange}
                          disabled={loading}
                        />
                        <label className={styles.floatingLabel}>رقم فودافون كاش</label>
                      </div>
                      {vcashError && (
                        <div className={styles.errorMsg}>
                          <FaTimes className={styles.errorIcon} />
                          {vcashError}
                        </div>
                      )}
                    </div>
                    <div className={styles.vcashInstructions}>
                      <p className={styles.instructions}>📱 يرجى تحويل المبلغ للرقم الموضح بعد تأكيد الطلب</p>
                      <p className={styles.instructions}>⏳ سيتم تأكيد الطلب خلال 24 ساعة من استلام الدفعة</p>
                      <p className={styles.instructions}>💰 المبلغ المطلوب: {grandTotal.toFixed(2)} ج.م</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.stickySummary}>
                <div className={styles.glassCardSummary}>
                  <h3 className={styles.summaryTitle}>ملخص الطلب</h3>
                  
                  <div className={styles.orderSummary}>
                    <div className={styles.summaryItem}>
                      <FaBox className={styles.summaryIcon} />
                      <span>عدد المنتجات</span>
                      <span className={styles.summaryValue}>{totalItems}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <FaShippingFast className={styles.summaryIcon} />
                      <span>التوصيل المتوقع</span>
                      <span className={styles.summaryValue}>2-3 أيام</span>
                    </div>
                    {savingsAmount > 0 && (
                      <div className={`${styles.summaryItem} ${styles.savingsItem}`}>
                        <FaGift className={styles.summaryIcon} />
                        <span>وفّرت</span>
                        <span className={styles.savingsValue}>{savingsAmount.toFixed(2)} ج.م</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.couponSection}>
                    <input 
                      type="text" 
                      placeholder="كود الخصم" 
                      className={styles.couponInput} 
                      disabled={couponLoading || loading}
                    />
                    <button 
                      type="button" 
                      className={styles.couponBtn} 
                      onClick={handleCouponApply}
                      disabled={couponLoading || loading}
                    >
                      {couponLoading ? <FaSpinner className={styles.spinner} /> : 'تطبيق'}
                    </button>
                  </div>
                  {couponError && (
                    <div className={`${styles.couponMsg} ${styles.couponErrorMsg}`}>
                      {couponError}
                    </div>
                  )}
                  {couponSuccess && (
                    <div className={`${styles.couponMsg} ${styles.couponSuccessMsg}`}>
                      {couponSuccess}
                    </div>
                  )}
                  <div className={styles.priceSummaryLines}>
                    <div className={styles.summaryLine}>
                      <span>إجمالي المنتجات</span>
                      <span>{subtotal.toFixed(2)} ج.م</span>
                    </div>
                    <div className={styles.summaryLine}>
                      <span>الشحن</span>
                      <span style={{ color: '#34d399', fontWeight: '600' }}>مجاني</span>
                    </div>
                    <div className={styles.summaryLine}>
                      <span>الضرائب</span>
                      <span>{taxAmount.toFixed(2)} ج.م</span>
                    </div>
                    <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                      <span>الخصومات</span>
                      <span>-{savingsAmount.toFixed(2)} ج.م</span>
                    </div>
                    <div className={styles.grandTotalLine}>
                      <span>الإجمالي النهائي</span>
                      <span>{grandTotal.toFixed(2)} ج.م</span>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className={`${styles.payBtn} ${orderSuccess ? styles.payBtnSuccess : ''} ${loading ? styles.payBtnLoading : ''}`}
                    disabled={loading || !checkoutForm.isValid || (paymentMethod === 'vcash' && !vcashNumber)}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className={styles.spinner} /> جاري المعالجة...
                      </>
                    ) : orderSuccess ? (
                      <>
                        <FaCheck /> تم الدفع
                      </>
                    ) : (
                      <>
                        <FaLock className={styles.lockIcon} /> تأكيد والدفع
                      </>
                    )}
                  </button>
                  {paymentMethod === 'vcash' && !vcashNumber && checkoutForm.isValid && (
                    <div className={styles.vcashRequiredMsg}>
                      ⚠️ يرجى إدخال رقم فودافون كاش
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </form>
        </div>
      </div>
    </>
  )
}