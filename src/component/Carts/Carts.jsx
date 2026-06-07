import React, { useContext, useEffect, useState } from 'react'
import { cartContext } from '../../Context/CartContext';
// import { CartContext } from '../../Context/CartContext';
import Products from './../Products/Products';
import styles from './Carts.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
// import Checkout from '../Checkout/Checkout';
import Checkout from '../Checkout/Checkout';
import {Helmet} from "react-helmet";
import axios from 'axios';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

export default function Carts() {
  let {getCarts, updateCart, deleteCartProduct, deleteAllCart, cartItemImage, product_ID} = useContext(cartContext);

  let [ProdOfCarts, setProdOfCarts] = useState([]);
  let [Loading, setLoading] = useState(true);

  // const nav = useNavigate();
        
  async function waitGetCarts() {
    let token = localStorage.getItem("userToken");
    if(!token) {
      navigate('/login');
    } 

    let {data} = await getCarts();
    setProdOfCarts(data);
    // console.log("data: ", data);
    setLoading(false);
  }

  async function waitUpdateCarts(id, count) {
    let {data} = await updateCart(id, count);
     setProdOfCarts(data);
  }

 async function waitDeleteCartProd(id) {
  await deleteCartProduct(id);
  waitGetCarts();
}

  async function waitDeleteAllCart() {
    let {data} = await deleteAllCart();
    await setProdOfCarts(data);
  }
  
  let navigate = useNavigate();
  function continueShopping() {
    navigate('/')
  }
  
  function openChekOut() {
    navigate('/Checkout')
  }

  let [totalPrice, setTotalPrice] = useState(0);
async function totalPriceFuc() {
  // console.log("prodofcarts: ",ProdOfCarts);
  let totalPrice = 0;
  await ProdOfCarts?.map((item) => {
    totalPrice += item?.price * item?.quantity;

  })
  setTotalPrice(totalPrice);
}
totalPriceFuc();
//////////////////////////////////////////
const [cartItems, setCartItems] = useState([]);

function quantityPlus(id) {
  setProdOfCarts(prev =>
    prev.map(item =>
      item.cartItemId === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );
}

function quantityMinus(id) {
  setProdOfCarts(prev =>
    prev.map(item =>
      item.cartItemId === id
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1)
          }
        : item
    )
  );
}

const [productsImages, setProductsImages] = useState({});

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




useEffect(() => {
    waitGetCarts();
    getProductsImages();

}, [])
////////////////////////////////////////////

  return (
    <>
      <div className='my-5'>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <Navbar></Navbar>
      {
        !Loading? <div>
          <h1 style={{letterSpacing: "1px", fontWeight: "500", fontSize: "40px"}} className='text-center text-success my-4'>Shopping Cart</h1>
      <td className="text-center d-block mb-5 fs-4"><strong>Total Price: <span style={{color: "#85BB65"}} className='fw-semibold px-2'>{ProdOfCarts? totalPrice: '0'}</span> <span className = "text-success">EGP</span></strong></td>
      <div>
      <link href="" rel="stylesheet" />
      <div className="container" style = {{margin: "10px auto"}} >
        <div style = {{fontSize: "18px", display: "flex", justifyContent: "space-between", backgroundColor: "white", padding: "10px 30px", borderRadius: "5px", margin: "15px 0", color: "#333"}} className="d-none d-md-flex">
          <span style={{width: '50%', fontWeight: '600', letterSpacing: '1px', fontSize: "20px"}}>Product</span>
          <span style={{width: '10%', fontWeight: '600', letterSpacing: '1px', fontSize: "20px"}}>Price</span>
          <span style={{width: '18%', fontWeight: '600', letterSpacing: '1px', fontSize: "20px", textAlign: 'center'}}>Quantity</span>
          <span style={{width: '30%', fontWeight: '600', letterSpacing: '1px', fontSize: "20px"}} className="text-center">Subtotal</span>
          {/* <span style={{width: '10%', fontWeight: '400', letterSpacing: '1px', fontSize: "20px"}} /> */}
        </div>
        <table id="cart" className="table table-hover table-condensed">
          {ProdOfCarts?.map((item) => {
            return <tbody>
            <tr>
              <td data-th="Product">
                <div className="d-flex align-items-center">
                  <div className=""><img  src={productsImages[item?.productId]} alt="..." className={styles.cartImg} /></div>
                  <div className="col-sm-10 mx-4">
                    <h4 style={{fontWeight: '300', letterSpacing: '1px', fontSize: "22px"}} className="nomargin">{item?.productName}</h4>
                    
                  </div>
                </div>
              </td>
              <td style= {{display: 'flex', alignItems: 'center', height: '184px'}}><span style={{fontWeight: '500', fontSize: "17px", marginRight: "10px"}} data-th="Price">{item?.price}</span> <span> EGP</span></td>
              <td>
              <div style= {{height: '167px'}} className={styles.cartCount}>
                <button onClick={() => {quantityMinus(item?.cartItemId)}} className='btn bg-secondary'><i class="fa-solid fa-minus text-white"></i></button>
                <input  className="form-control text-center" value = {item?.quantity} />
                <button onClick={() => {quantityPlus(item?.cartItemId)}} className='btn bg-secondary'><i class="fa-solid fa-plus text-white"></i></button>
              </div>
              </td>
              <td style= {{display: 'flex', alignItems: 'center', height: '184px', justifyContent: "center"}} data-th="Subtotal" className="text-center"><span style={{fontWeight: '500', fontSize: "17px", marginRight: "10px"}}>{item?.price * item?.quantity}</span> <span> EGP</span></td>
              <td style= {{height: '184px'}} className="actions" data-th>
                <button style= {{width: "50px", height: "40px", transform: "translateY(135%)"}} onClick={() => {waitDeleteCartProd(item?.cartItemId)}} className="btn btn-danger btn-sm m-2 fs-6"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
          })}
          
        </table>

        <div style={{display: "block", width: "30%", backgroundColor: "white", padding: "10px 30px", borderRadius: "12px" , display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px auto"}}>
          
              <span><a style={{margin: '0', padding: '15px 10px'}} href="#" onClick={() => {continueShopping()}} className="btn btn-warning my-3"><i className="fa fa-angle-left" /> Continue Shopping</a></span>
              <span colSpan={3} className="hidden-xs my-3"></span>
              {/* <span><button onClick={() => {waitDeleteAllCart()}} className = {styles.clearAllBtn}>Clear All</button></span> */}
              <span><a style={{margin: '0', padding: '15px 10px'}} href="#" className="btn btn-success btn-block my-3" onClick={openChekOut}>Checkout <i className="fa fa-angle-right" /></a></span>
          
          </div>

      </div>
    </div>
        </div>:
        <Loader></Loader>
      }
    </div>
    <Footer></Footer>
    </>

  )
}

