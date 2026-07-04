import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from '../Loader/Loader';
import styles from './RelatedProduct.module.css';

export default function RelatedProduct(props) {

  let { id } = useParams();
  let Category = props?.CategoryName;

  let [RelateProd, setRelateProd] = useState([]);
  let [Loading, setLoading] = useState(true);

  // ================= GET RELATED PRODUCTS =================
  function getRelatedProducts() {
    axios.get(`https://egzone.runasp.net/api/Products`)
      .then(({ data }) => {

        // تأمين الداتا
        let allProducts = Array.isArray(data) ? data : data?.data || [];

        // فلترة حسب الكاتيجوري
        let related = allProducts.filter((product) => {
          return (
            product?.category?.toLowerCase() ===
            Category?.toLowerCase()
          );
        });

        setRelateProd(related);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (Category) getRelatedProducts();
  }, [Category]);

  return (
    <div className='container'>

      <p
        style={{
          margin: "90px 0 30px",
          fontWeight: "300",
          textAlign: "center",
          fontSize: "42px",
          letterSpacing: "2px",
          color: "#198754"
        }}
      >
        Suggestions
      </p>

      {/* LOADER */}
      {Loading ? (
        <Loader />
      ) : (
        <div
          className='col-12 d-flex flex-wrap justify-content-center'
          style={{ gap: "20px" }}
        >

          {/* PRODUCTS */}
          {RelateProd?.map((product) => (
            <div
              key={product?.id}   // 🔥 FIXED HERE
              className='row col-2 d-flex mx-2 pb-3'
              style={{
                width: "250px",
                minHeight: "350px",
                borderRadius: "10px",
                background: "white"
              }}
            >

              <Link
                className={styles.cardBox}
                to={`/ProductDetails/${product?.id}/${product?.category}`}
              >

                <span className={styles.imgBox}>
                  <img
                    className='w-100'
                    src={product?.images?.[0]?.url}
                    alt={product?.name}
                    style={{
                      height: "200px",
                      borderRadius: "4px"
                    }}
                  />
                </span>

                <span className='text-muted mt-3 fw-semibold d-block'>
                  {product?.category}
                </span>

                <span className='text-dark mt-1 fw-bold d-block'>
                  {product?.name}
                </span>

                <div className='d-flex justify-content-between px-1 mt-3'>
                  <span className='d-block text-dark'>
                    {product?.price} <span className='text-muted'>EG</span>
                  </span>

                  <span className='d-block text-dark'>
                    <span className='fw-semibold'>
                      {product?.rating}
                    </span>
                    <i className='fas fa-star text-warning'></i>
                  </span>
                </div>

              </Link>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}