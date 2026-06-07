// import axios from "axios";
// import { createContext } from "react";

// export const CartContext = createContext();

// const BASE_URL = "https://egzone.runasp.net/api/CartItems";

// export default function CartProvider({ children }) {

//   // ================= GET TOKEN =================
//   function getToken() {
//     return localStorage.getItem("userToken");
//   }

//   // ================= GET CART =================
//   async function getCartItems() {

//     try {

//       const { data } = await axios.get(BASE_URL, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });

//       return Array.isArray(data)
//         ? data
//         : data?.data || [];

//     } catch (error) {

//       console.log("GET CART ERROR:", error.response?.data || error);

//       return [];
//     }
//   }

//   // ================= ADD TO CART =================
//   async function addToCart(productId) {

//   try {

//     const token = getToken();

//     const { data } = await axios.post(
//       BASE_URL,
//       {
//         productId: productId,
//         quantity: 1,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return data;

//   } catch (error) {

//     console.log("STATUS =>", error.response?.status);

//     console.log("DATA =>", error.response?.data);

//     throw error;
//   }
// }
//   // ================= REMOVE =================
//   async function removeFromCart(id) {

//     try {

//       const { data } = await axios.delete(
//         `${BASE_URL}/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );

//       return data;

//     } catch (error) {

//       console.log(
//         "REMOVE ERROR:",
//         error.response?.data || error
//       );

//       throw error;
//     }
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         getCartItems,
//         addToCart,
//         removeFromCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }














// import axios from "axios";
// import { createContext, useEffect, useState } from "react";
// import Products from './../component/Products/Products';
// import { useNavigate } from "react-router-dom";
// import { CartContext } from './CartContext';

// export let cartContext = createContext();


// export function CartContextProvider(props) {
    
//     let [cartQuantity, setCartQuantity] = useState(0);
//     let [cartID, setCartID] = useState(0);
//     let [product_ID, setProduct_ID] = useState(0);
//     const [cartItemImage, setCartItemImage] = useState([]);
    

//     async function addToCart(product_ID) {
//     const token = localStorage.getItem("userToken");

//     return axios.post(
//         "https://egzone.runasp.net/api/CartItems",
//         {
//             productId: product_ID,
//             quantity: 1
//         },
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         }
//     )
//     setProduct_ID(product_ID);
//     // .then((response) => {
//     //     setCartQuantity(prev => prev + 1);
//     //     return response.data;
//     // })
//     // .catch((error) => {
//     //     return error.response?.data;
//     // });
// }

//     async function getCarts() {
//         const token = localStorage.getItem("userToken");
 
//         return await axios.get("https://egzone.runasp.net/api/CartItems", {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             }
//         })  
//         // .then(res => res.data)
//         // .catch(err => err.response?.data);
//     }

//     async function updateCart(id, count) {
//         const token = localStorage.getItem("userToken");

//         return await axios.put(`https://egzone.runasp.net/api/CartItems/${id}`,  
            
//             {
//                 count: count,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             }
//         )
//         // .then((response) => {return response})
//         // .catch((error) => {return error})
//     }

//     async function deleteCartProduct(id) {
//         const token = localStorage.getItem("userToken");

//         return await axios.delete(
//             `https://egzone.runasp.net/api/CartItems/${id}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             }
//         );
//     }

//     // async function deleteAllCart() {
//     //     return await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart`,  

//     //         {
//     //             headers: headers,
//     //         })
//     //     .then((response) => {
//     //         setCartQuantity(1);
//     //         return response
//     //     })
//     //     .catch((error) => {return error})
//     // }

//  return <>
//     <CartContext.Provider value={{addToCart, getCarts, cartQuantity, cartID, deleteCartProduct, product_ID}}>
//         {props.children}
//     </CartContext.Provider>
//  </>
// }





import axios from "axios";
import { createContext, useState } from "react";

export let cartContext = createContext();

export function CartContextProvider(props) {
    let [cartQuantity, setCartQuantity] = useState(0);
    let [cartID, setCartID] = useState(0);
    let [product_ID, setProduct_ID] = useState(0);

    async function addToCart(p_ID) {
        const token = localStorage.getItem("userToken");
        setProduct_ID(p_ID);
        return axios.post(
            "https://egzone.runasp.net/api/CartItems",
            {
                productId: p_ID,
                quantity: 1
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    async function getCarts() {
        const token = localStorage.getItem("userToken");
        return await axios.get("https://egzone.runasp.net/api/CartItems", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    }

    // تعديل استقبال البارامترات في الـ PUT ليتوافق مع السيرفر (إرسال الـ quantity مباشرة في الـ body)
    async function updateCart(id, count) {
        const token = localStorage.getItem("userToken");
        return await axios.put(`https://egzone.runasp.net/api/CartItems/${id}`, 
            {
                quantity: count // غيرناها لـ quantity بدل count بناء على هيكلة الـ Swagger الشائعة لمشروعك
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    async function deleteCartProduct(id) {
        const token = localStorage.getItem("userToken");
        return await axios.delete(
            `https://egzone.runasp.net/api/CartItems/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    return (
        // 🔥 تم الإصلاح هنا: تمرير القيم لـ cartContext.Provider بالحرف الصغير المطابق للـ createContext
        <cartContext.Provider value={{ addToCart, getCarts, updateCart, deleteCartProduct, cartQuantity, cartID, product_ID }}>
            {props.children}
        </cartContext.Provider>
    );
}