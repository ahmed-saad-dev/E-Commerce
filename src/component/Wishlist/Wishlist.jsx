import React, { useEffect } from "react";
import { useWishlist } from "../../Context/WishlistContext";
import { Link } from "react-router-dom";
import { FaHeartBroken } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";

export default function Wishlist() {
  const { wishlist, getWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    getWishlist();
  }, []);

  const getWishlistItemId = (item) =>
    item?.id || item?.wishlistItemId || item?.productId;

  const getProduct = (item) => item?.product ?? item;

  return (
    <>
      <div className="container py-5">
        <Navbar></Navbar>
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold mb-1">My Wishlist</h2>
            <p className="text-muted mb-0">
              {wishlist?.length || 0} Items Saved
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {!wishlist || wishlist.length === 0 ? (
          <div
            className="text-center py-5"
            style={{
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,.06)",
            }}
          >
            <FaHeartBroken size={70} className="text-danger mb-3" />

            <h3 className="fw-bold">Your Wishlist Is Empty</h3>

            <p className="text-muted">
              Save products you like and they'll appear here.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {wishlist.map((item) => {
              const product = getProduct(item);

              const productId =
                product?.id || item?.productId || item?.id;

              return (
                <div
                  key={getWishlistItemId(item)}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <div
                    className="card h-100 border-0 overflow-hidden wishlist-card"
                    style={{
                      borderRadius: "18px",
                      transition: "0.3s",
                      boxShadow: "0 4px 20px rgba(0,0,0,.08)",
                    }}
                  >
                    {/* IMAGE */}
                    <div
                      style={{
                        height: "260px",
                        background: "#f8f9fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "15px",
                      }}
                    >
                      <img
                        src={
                          product?.imageUrl ||
                          product?.image ||
                          product?.mainImage ||
                          "https://via.placeholder.com/300"
                        }
                        alt={product?.name}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    {/* BODY */}
                    <div className="card-body d-flex flex-column p-3">
                      <h6
                        className="fw-semibold mb-2"
                        style={{
                          minHeight: "48px",
                          lineHeight: "1.4",
                          overflow: "hidden",
                        }}
                      >
                        {product?.name || "Product"}
                      </h6>

                      <div className="mb-3">
                        <span
                          className="fw-bold"
                          style={{
                            color: "#198754",
                            fontSize: "1.25rem",
                          }}
                        >
                          {product?.price || 0} EGP
                        </span>
                      </div>

                      {/* BUTTONS */}
                      <div className="mt-auto d-grid gap-2">
                        <Link
                          to={`/ProductDetails/${productId}`}
                          className="btn btn-success"
                          onClick={(e) => {
                            if (!productId) {
                              e.preventDefault();
                              console.log("Missing productId:", item);
                            }
                          }}
                        >
                          View Details
                        </Link>

                        <button
                          className="btn btn-outline-danger"
                          onClick={() =>
                            removeFromWishlist(getWishlistItemId(item))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INLINE RESPONSIVE CSS */}
      <style>
        {`
          /* Hover effect */
          .wishlist-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 10px 30px rgba(0,0,0,.15);
          }

          /* Mobile fixes */
          @media (max-width: 768px) {
            .wishlist-card {
              border-radius: 14px;
            }

            .card-body h6 {
              font-size: 14px;
            }

            .btn {
              font-size: 14px;
            }
          }
        `}
      </style>
    </>
  );
}