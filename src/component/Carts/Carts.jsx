import React, { useContext, useEffect, useState } from "react";
import { cartContext } from "../../Context/CartContext";
import styles from "./Carts.module.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import Checkout from "../Checkout/Checkout";
import { Helmet } from "react-helmet";
import axios from "axios";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

export default function Carts() {
  const {
    getCarts,
    updateCart,
    deleteCartProduct,
    deleteAllCart,
  } = useContext(cartContext);

  const [ProdOfCarts, setProdOfCarts] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productsImages, setProductsImages] = useState({});

  const navigate = useNavigate();

  // ---------------- GET CARTS ----------------
  async function waitGetCarts() {
    let token = localStorage.getItem("userToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const { data } = await getCarts();
    setProdOfCarts(data);
    setLoading(false);
  }

  // ---------------- UPDATE CART ----------------
  async function waitUpdateCarts(id, count) {
    const { data } = await updateCart(id, count);
    setProdOfCarts(data);
  }

  // ---------------- DELETE ITEM ----------------
  async function waitDeleteCartProd(id) {
    await deleteCartProduct(id);
    waitGetCarts();
  }

  // ---------------- DELETE ALL ----------------
  async function waitDeleteAllCart() {
    const { data } = await deleteAllCart();
    setProdOfCarts(data);
  }

  // ---------------- NAVIGATION ----------------
  function continueShopping() {
    navigate("/");
  }

  function openChekOut() {
    navigate("/Checkout");
  }

  // ---------------- TOTAL PRICE ----------------
  function totalPriceFunc() {
    let total = 0;

    ProdOfCarts?.forEach((item) => {
      total += item?.price * item?.quantity;
    });

    setTotalPrice(total);
  }

  useEffect(() => {
    totalPriceFunc();
  }, [ProdOfCarts]);

  // ---------------- QUANTITY ----------------
  function quantityPlus(id) {
    setProdOfCarts((prev) =>
      prev.map((item) =>
        item.cartItemId === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function quantityMinus(id) {
    setProdOfCarts((prev) =>
      prev.map((item) =>
        item.cartItemId === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }

  // ---------------- GET IMAGES ----------------
  async function getProductsImages() {
    const response = await axios.get(
      "https://egzone.runasp.net/api/Products"
    );

    const imageMap = {};

    response.data.data.forEach((product) => {
      imageMap[product.id] = product.images?.[0]?.url;
    });

    setProductsImages(imageMap);
  }

  // ---------------- INIT ----------------
  useEffect(() => {
    waitGetCarts();
    getProductsImages();
  }, []);

  return (
    <>
      <div className="my-5">
        <Helmet>
          <title>Cart</title>
        </Helmet>

        <Navbar />

        {!Loading ? (
          <div>
            <h1
              style={{
                letterSpacing: "1px",
                fontWeight: "500",
                fontSize: "40px",
              }}
              className="text-center text-success my-4"
            >
              Shopping Cart
            </h1>

            <td className="text-center d-block mb-5 fs-4">
              <strong>
                Total Price:{" "}
                <span
                  style={{ color: "#85BB65" }}
                  className="fw-semibold px-2"
                >
                  {totalPrice}
                </span>{" "}
                <span className="text-success">EGP</span>
              </strong>
            </td>

            <div className="container" style={{ margin: "10px auto" }}>
              <div
                className="d-none d-md-flex"
                style={{
                  fontSize: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  padding: "10px 30px",
                  borderRadius: "5px",
                  margin: "15px 0",
                  color: "#333",
                }}
              >
                <span style={{ width: "50%", fontWeight: "600" }}>
                  Product
                </span>
                <span style={{ width: "10%", fontWeight: "600" }}>
                  Price
                </span>
                <span style={{ width: "18%", fontWeight: "600", textAlign: "center" }}>
                  Quantity
                </span>
                <span style={{ width: "30%", fontWeight: "600" }}>
                  Subtotal
                </span>
              </div>

              <table id="cart" className="table table-hover table-condensed">
                {ProdOfCarts?.map((item) => (
                  <tbody key={item.cartItemId}>
                    <tr>
                      <td data-th="Product">
                        <div className="d-flex align-items-center">
                          <img
                            src={productsImages[item?.productId]}
                            alt=""
                            className={styles.cartImg}
                          />
                          <div className="col-sm-10 mx-4">
                            <h4
                              style={{
                                fontWeight: "300",
                                letterSpacing: "1px",
                                fontSize: "22px",
                              }}
                            >
                              {item?.productName}
                            </h4>
                          </div>
                        </div>
                      </td>

                      <td style={{ display: "flex", alignItems: "center", height: "184px" }}>
                        {item?.price} EGP
                      </td>

                      <td>
                        <div className={styles.cartCount}>
                          <button
                            onClick={() => quantityMinus(item?.cartItemId)}
                            className="btn bg-secondary"
                          >
                            <i className="fa-solid fa-minus text-white"></i>
                          </button>

                          <input
                            className="form-control text-center"
                            value={item?.quantity}
                            readOnly
                          />

                          <button
                            onClick={() => quantityPlus(item?.cartItemId)}
                            className="btn bg-secondary"
                          >
                            <i className="fa-solid fa-plus text-white"></i>
                          </button>
                        </div>
                      </td>

                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "184px",
                        }}
                      >
                        {item?.price * item?.quantity} EGP
                      </td>

                      <td style={{ height: "184px" }}>
                        <button
                          onClick={() => waitDeleteCartProd(item?.cartItemId)}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>

              {/* ACTIONS */}
              <div
                style={{
                  color: "white",
                  padding: "10px 30px",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <button
                    onClick={continueShopping}
                    className="btn btn-warning my-3"
                  >
                    Continue Shopping
                  </button>
                </span>

                <span>
                  <button
                    onClick={openChekOut}
                    className="btn btn-success my-3"
                  >
                    Checkout
                  </button>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>

      <Footer />
    </>
  );
}