import React, { useContext } from 'react'
import styles from './Checkout.module.css';
import img1 from '../../assets/p4.jpg'
import { useFormik } from 'formik';
import axios from 'axios';
import { cartContext } from '../../context/CartContext';
import { Helmet } from 'react-helmet';

// استيراد الأيقونات الفاخرة لتعزيز تجربة المستخدم
import { 
  FaShieldAlt, FaLock, FaTruck, FaUndo, 
  FaHeadset, FaCreditCard, FaPaypal, FaApplePay 
} from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';
import { MdOutlineLocalOffer } from 'react-icons/md';

export default function Checkout() {

  let {cartID} = useContext(cartContext);

  let checkoutForm = useFormik({
    initialValues: {
      details: '',
      phone: '',
      city: '',
    },
    onSubmit: handleCheckOut,
  });

  async function handleCheckOut(formObj) {
    await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartID}`, 

      {
        'shippingAddress': formObj,
      },
      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
        params: {
          url: `http://localhost:5173`
        }
      },

    )
    .then((response) => {
      console.log(response)
      location.href = response?.data?.session?.url;
    })
    .catch((error) => {error})
  }

  return (
    <>
      <Helmet>
        <title>Checkout | EGZone Premium</title>
      </Helmet>

      <div className={styles.pageWrapper}>
        {/* الدوائر المتوهجة في الخلفية الفاخرة */}
        <div className={styles.glowCircle1}></div>
        <div className={styles.glowCircle2}></div>

        <form className={styles.Checkout} onSubmit={checkoutForm.handleSubmit}>
          <div className={styles.checkoutLayout}>
            
            {/* ══════════ LEFT SIDE: SHIPPING & PAYMENT (70%) ══════════ */}
            <div className={styles.leftColumn}>
              
              {/* كارت معلومات الشحن والاتصال */}
              <div className={styles.glassCard}>
                <h3 className={styles.sectionTitle}>
                  <FaTruck className={styles.titleIcon} /> تفاصيل الشحن والتوصيل
                </h3>
                
                <div className={styles.formGrid}>
                  {/* حقل تفاصيل العنوان */}
                  <div className={styles.inputWrapper}>
                    <input 
                      value={checkoutForm.values.details} 
                      name='details' 
                      type="text" 
                      id="detailsInput" 
                      className={styles.formInput} 
                      onChange={checkoutForm.handleChange} 
                      onBlur={checkoutForm.handleBlur}
                      placeholder=" "
                      required
                    />
                    <label className={styles.floatingLabel} htmlFor="detailsInput">تفاصيل العنوان (الشارع / البناء / الشقة)</label>
                  </div>

                  {/* حقل رقم الهاتف */}
                  <div className={styles.inputWrapper}>
                    <input 
                      value={checkoutForm.values.phone} 
                      name='phone' 
                      type="tel" 
                      id="phoneInput" 
                      className={styles.formInput} 
                      onChange={checkoutForm.handleChange} 
                      onBlur={checkoutForm.handleBlur}
                      placeholder=" "
                      required
                    />
                    <label className={styles.floatingLabel} htmlFor="phoneInput">رقم الهاتف النشط</label>
                  </div>

                  {/* حقل المدينة */}
                  <div className={styles.inputWrapper}>
                    <input 
                      value={checkoutForm.values.city} 
                      name='city' 
                      type="text" 
                      id="cityInput" 
                      className={styles.formInput} 
                      onChange={checkoutForm.handleChange} 
                      onBlur={checkoutForm.handleBlur}
                      placeholder=" "
                      required
                    />
                    <label className={styles.floatingLabel} htmlFor="cityInput">المدينة / المحافظة</label>
                  </div>
                </div>
              </div>

              {/* كارت طرق الدفع المتاحة */}
              <div className={styles.glassCard}>
                <h3 className={styles.sectionTitle}>
                  <FaCreditCard className={styles.titleIcon} /> طريقة الدفع المفضلة
                </h3>
                <div className={styles.paymentGrid}>
                  <div className={`${styles.paymentMethodCard} ${styles.activePayment}`}>
                    <FaCreditCard className={styles.payIcon} />
                    <span>بطاقة ائتمان</span>
                  </div>
                  <div className={styles.paymentMethodCard}>
                    <FaPaypal className={styles.payIcon} style={{color: '#003087'}} />
                    <span>PayPal</span>
                  </div>
                  <div className={styles.paymentMethodCard}>
                    <FaApplePay className={styles.payIcon} style={{fontSize: '2rem'}} />
                    <span>Apple Pay</span>
                  </div>
                  <div className={styles.paymentMethodCard}>
                    <SiGooglepay className={styles.payIcon} style={{fontSize: '2rem'}} />
                    <span>Google Pay</span>
                  </div>
                </div>
              </div>

              {/* كارت معلومات الأمان وسلامة التوصيل */}
              <div className={styles.deliveryInfoRow}>
                <div className={styles.infoBadge}>
                  <FaTruck /> شحن سريع وآمن
                </div>
                <div className={styles.infoBadge}>
                  <FaUndo /> إرجاع مرن خلال 14 يوم
                </div>
                <div className={styles.infoBadge}>
                  <FaHeadset /> دعم فني 24/7
                </div>
              </div>

            </div>

            {/* ══════════ RIGHT SIDE: STICKY ORDER SUMMARY (30%) ══════════ */}
            <div className={styles.rightColumn}>
              <div className={styles.stickySummary}>
                
                <div className={styles.glassCardSummary}>
                  <h3 className={styles.summaryTitle}>ملخص الطلب</h3>
                  
                  {/* عرض المنتج الافتراضي الفاخر داخل السلة */}
                  <div className={styles.productSummaryList}>
                    <div className={styles.productSummaryItem}>
                      <div className={styles.productThumbWrapper}>
                        <img src={img1} alt="Product Thumbnail" className={styles.productThumb} />
                      </div>
                      <div className={styles.productDetails}>
                        <h4 className={styles.productName}>المنتجات المختارة بالسلة</h4>
                        <p className={styles.productMeta}>الرقم التعريفي للطلب: {cartID || 'جاري التحميل...'}</p>
                      </div>
                    </div>
                  </div>

                  {/* حقل قسائم الشراء الترويجي */}
                  <div className={styles.couponSection}>
                    <div className={styles.couponInputWrapper}>
                      <MdOutlineLocalOffer className={styles.couponIcon} />
                      <input type="text" placeholder="رمز القسيمة (كود الخصم)" className={styles.couponInput} disabled />
                    </div>
                    <button type="button" className={styles.couponBtn} disabled>تطبيق</button>
                  </div>

                  {/* تفاصيل الحساب والأسعار المالية */}
                  <div className={styles.priceSummaryLines}>
                    <div className={styles.summaryLine}>
                      <span>إجمالي المنتجات</span>
                      <span>يحتسب في الخطوة التالية</span>
                    </div>
                    <div className={styles.summaryLine}>
                      <span>تكلفة الشحن</span>
                      <span className={styles.freeShipping}>مجاني</span>
                    </div>
                    <div className={styles.summaryLine}>
                      <span>الضرائب والرسوم</span>
                      <span>مشمولة</span>
                    </div>
                    
                    <div className={styles.totalDivider}></div>
                    
                    <div className={styles.grandTotalLine}>
                      <span>الإجمالي الكلي</span>
                      <span className={styles.goldPrice}>آمن تماماً</span>
                    </div>
                  </div>

                  {/* زر الدفع والإنهاء النهائي المربوط بالـ Formik */}
                  <button 
                    type="submit" 
                    className={styles.payBtn}
                  >
                    <span>تأكيد والدفع الآن</span>
                    <FaLock className={styles.btnLockIcon} />
                  </button>

                  {/* أختام الأمان والحماية الحيوية */}
                  <div className={styles.securitySeal}>
                    <div className={styles.sealItem}>
                      <FaShieldAlt className={styles.sealIcon} />
                      <span>اتصال مشفر SSL</span>
                    </div>
                    <div className={styles.sealItem}>
                      <FaLock className={styles.sealIcon} />
                      <span>دفع إلكتروني آمن 100%</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </form>
      </div>
    </>
  )
}