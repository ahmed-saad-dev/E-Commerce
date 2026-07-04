import React from "react";
import styles from "./MainSlider.module.css";
import Slider from "react-slick";
import img3 from "../../assets/a.jpg";
import img4 from "../../assets/d.jpg";
import img5 from "../../assets/e.jpg";

export default function MainSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    dotsClass: "slick-dots egz-dots",
    responsive: [
      { breakpoint: 1024, settings: { dots: true, autoplaySpeed: 4000 } },
      { breakpoint: 768,  settings: { dots: true, autoplaySpeed: 3500 } },
    ],
  };

  const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <div className={styles.root}>
      <div className={styles.sliderContainer}>

        {/* dark gradient overlay — left side for text readability */}
        <div className={styles.overlay} />

        {/* purple-gold bottom glow line */}
        <div className={styles.glowLine} />

        {/* TEXT CONTENT */}
        <div className={styles.content} onClick={prevent}>

          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            عرض محدود الوقت
          </span>

          <h1 className={styles.title}>
            تسوّق بلا حدود
            <span className={styles.titleAccent}> EGZone</span>
          </h1>

          <p className={styles.description}>
            خصومات تصل إلى ٧٠٪ على الإلكترونيات والملابس والمنزليات
            <br />
            شحن مجاني على الطلبات فوق ٥٠٠ جنيه
          </p>

          <div className={styles.actions}>
            <button className={styles.shopBtn} onClick={prevent} style={{ pointerEvents: "none" }}>
              تسوق الآن
              <span className={styles.btnArrow}>←</span>
            </button>
            <button className={styles.offersBtn} onClick={prevent} style={{ pointerEvents: "none" }}>
              عروض اليوم
            </button>
          </div>

          {/* trust badges */}
          <div className={styles.trust}>
            <span>✓ شحن سريع</span>
            <span>✓ ضمان الجودة</span>
            <span>✓ إرجاع مجاني</span>
          </div>
        </div>

        {/* SLIDES */}
        <Slider {...settings} className={styles.slick}>
          <div className={styles.slide}>
            <img src={img3} alt="إلكترونيات" className={styles.image} />
          </div>
          <div className={styles.slide}>
            <img src={img4} alt="أجهزة صوت" className={styles.image} />
          </div>
          <div className={styles.slide}>
            <img src={img5} alt="أزياء رجالية" className={styles.image} />
          </div>
        </Slider>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(109,40,217,0.5); }
          50%       { box-shadow: 0 0 0 7px rgba(109,40,217,0); }
        }

        /* dots */
        .egz-dots { bottom: 28px !important; z-index: 10 !important; }
        .egz-dots li button:before {
          color: rgba(255,255,255,0.5) !important;
          font-size: 9px !important;
          transition: all 0.3s ease !important;
        }
        .egz-dots li.slick-active button:before {
          color: #c9a84c !important;
          opacity: 1 !important;
          font-size: 12px !important;
        }
        .egz-dots li:hover button:before { opacity: 1 !important; }

        @media (max-width: 768px) {
          .egz-dots { bottom: 14px !important; }
        }
      `}</style>
    </div>
  );
}