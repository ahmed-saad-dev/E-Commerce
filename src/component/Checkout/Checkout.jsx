// import React, { useContext } from 'react'
// import styles from './Checkout.module.css';
// import img1 from '../../assets/p4.jpg'
// import { useFormik } from 'formik';
// import axios from 'axios';
// // import { cartContext } from '../../Context/CartContext';
// import { Helmet } from 'react-helmet';

// export default function Checkout() {

//   let {cartID} = useContext(cartContext);

//   let checkoutForm = useFormik({
//     initialValues: {
//       details: '',
//       phone: '',
//       city: '',
//     },
//     onSubmit: handleCheckOut,
//   });

//   async function handleCheckOut(formObj) {
//     await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartID}`, 

//       {
//         'shippingAddress': formObj,
//       },
//       {
//         headers: {
//           token: localStorage.getItem("userToken"),
//         },
//         params: {
//           url: `http://localhost:5173`
//         }
//       },

//     )
//     .then((response) => {
//       console.log(response)
//       location.href = response?.data?.session?.url;
//     })
//     .catch((error) => {error})
//   }

//   return (
//     <>
//     <Helmet>
//         <title>Checkout</title>
//       </Helmet>
// <form className= {styles.Checkout} onSubmit={checkoutForm.handleSubmit}>
//   <div className="container h-100 w-100">
//         <div className="card card-registration">
//           <div className="row g-0">
//             <div className="col-xl-6 d-none d-xl-block">
//               <img src={img1}
//                 alt="Sample photo" className={styles.checkImg}
//                  />
//             </div>
//             <div className="col-6">
//               <div className="card-body text-black">
//                 <h3 className="text-uppercase mt-2 mb-4">Payment</h3>

//                 <div data-mdb-input-init className="form-outline mb-4">
//                   <label className="form-label" htmlFor="form3Example8">Details</label>
//                   <input value={checkoutForm.values.details} name='details' type="text" id="form3Example8" className="form-control form-control-lg" onChange={checkoutForm.handleChange} onBlur={checkoutForm.handleBlur} />
//                 </div>
//                 <div data-mdb-input-init className="form-outline mb-4">
//                   <label className="form-label" htmlFor="form3Example8">Phone</label>
//                   <input value={checkoutForm.values.phone} name='phone' type="text" id="form3Example8" className="form-control form-control-lg" onChange={checkoutForm.handleChange} onBlur={checkoutForm.handleBlur} />
//                 </div>
//                 <div data-mdb-input-init className="form-outline mb-4">
//                   <label className="form-label" htmlFor="form3Example8">City</label>
//                   <input value={checkoutForm.values.city} name='city' type="text" id="form3Example8" className="form-control form-control-lg" onChange={checkoutForm.handleChange} onBlur={checkoutForm.handleBlur} />
//                 </div>

//                 <div className="d-flex justify-content-center pt-3">
//                   <button type="submit" data-mdb-button-init data-mdb-ripple-init className= {styles.payBtn}>Pay Now <i className="fa-solid fa-money-check-dollar mx-1"></i></button>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>

//     </>
//   )
// }



















import React, { useContext } from 'react'
import styles from './Checkout.module.css';
import img1 from '../../assets/p4.jpg'
import { useFormik } from 'formik';
import axios from 'axios';
import { cartContext } from '../../Context/CartContext';
import { Helmet } from 'react-helmet';

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
        <title>Checkout</title>
      </Helmet>
<form className= {styles.Checkout} onSubmit={checkoutForm.handleSubmit}>
  <div className="container h-100 w-100">
        <div className="card card-registration">
          <div className="row g-0">
            <div className="col-xl-6 d-none d-xl-block">
              <img src={img1}
                alt="Sample photo" className={styles.checkImg}
                 />
            </div>
            <div className="col-6">
              <div className="card-body text-black">
                <h3 className="text-uppercase mt-2 mb-4">Payment</h3>

                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example8">Details</label>
                  <input value={checkoutForm.values.details} name='details' type="text" id="form3Example8" className="form-control form-control-lg" onChange={checkoutForm.handleChange} onBlur={checkoutForm.handleBlur} />
                </div>
                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example8">Phone</label>
                  <input value={checkoutForm.values.phone} name='phone' type="text" id="form3Example8" className="form-control form-control-lg" onChange={checkoutForm.handleChange} onBlur={checkoutForm.handleBlur} />
                </div>
                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example8">City</label>
                  <input value={checkoutForm.values.city} name='city' type="text" id="form3Example8" className="form-control form-control-lg" onChange={checkoutForm.handleChange} onBlur={checkoutForm.handleBlur} />
                </div>

                <div className="d-flex justify-content-center pt-3">
                  <button type="submit" data-mdb-button-init data-mdb-ripple-init className= {styles.payBtn}>Pay Now <i className="fa-solid fa-money-check-dollar mx-1"></i></button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    </>
  )
}

