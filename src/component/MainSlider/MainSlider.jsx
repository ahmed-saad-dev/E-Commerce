import React from "react";
import styles from "./MainSlider.module.css";
import Slider from "react-slick";
import img1 from "../../assets/b.png";
import img2 from "../../assets/c.png";
import img3 from "../../assets/a.jpg";
import img4 from "../../assets/d.jpg";
import img5 from "../../assets/e.jpg";

export default function MainSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    dotsClass: "slick-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: true,
          autoplaySpeed: 4000,
        }
      },
      {
        breakpoint: 768,
        settings: {
          dots: true,
          autoplaySpeed: 3000,
        }
      }
    ]
  };

  // Prevent any click from doing anything
  const preventNavigation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Absolutely nothing happens - purely visual
  };

  return (
    <div style={{ textDecoration: "none", cursor: "default" }}>
      <div className={styles.sliderContainer}>
        <div className={styles.slider}>
          {/* Gradient Overlay */}
          <div className={styles.overlay}></div>

          {/* Text Content - Purely Visual */}
          <div className={styles.content} onClick={preventNavigation}>
            <span className={styles.badge}>
              🔥 LIMITED TIME OFFER
            </span>

            <h1 className={styles.title}>
              Summer Sale
            </h1>

            <p className={styles.description}>
              Up to 70% off on electronics, fashion, and home appliances.
              <br />
              Free shipping on orders over $50.
            </p>

            {/* Static Visual Button - Does NOTHING */}
            <button 
              className={styles.shopButton}
              onClick={preventNavigation}
              style={{ pointerEvents: "none" }}
            >
              SHOP NOW →
            </button>
          </div>

          <Slider {...settings} className={styles.slick}>
            <div className={styles.slide}>
              <img
                src={img1}
                alt="Summer fashion collection"
                className={styles.image}
              />
            </div>

            <div className={styles.slide}>
              <img
                src={img2}
                alt="Kids clothing sale"
                className={styles.image}
              />
            </div>

            <div className={styles.slide}>
              <img
                src={img3}
                alt="Electronics deals"
                className={styles.image}
              />
            </div>

            <div className={styles.slide}>
              <img
                src={img4}
                alt="Audio equipment sale"
                className={styles.image}
              />
            </div>

            <div className={styles.slide}>
              <img
                src={img5}
                alt="Men's fashion"
                className={styles.image}
              />
            </div>
          </Slider>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .slick-dots {
            bottom: 25px !important;
            z-index: 10 !important;
          }
          
          .slick-dots li button:before {
            color: white !important;
            font-size: 10px !important;
            opacity: 0.6 !important;
            transition: all 0.3s ease !important;
          }
          
          .slick-dots li:hover button:before {
            opacity: 1 !important;
          }
          
          .slick-dots li.slick-active button:before {
            color: #198754 !important;
            opacity: 1 !important;
            transform: scale(1.2) !important;
          }
          
          @media (max-width: 768px) {
            .slick-dots {
              bottom: 15px !important;
            }
            
            .slick-dots li button:before {
              font-size: 8px !important;
            }
          }
        `}
      </style>
    </div>
  );
}