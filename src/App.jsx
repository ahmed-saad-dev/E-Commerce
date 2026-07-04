import "./App.css";


import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import Chatbot from "./components/chatbot/Chat.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";

import Products from "./components/Products/Products.jsx";
import AboutUs from "./components/UserProfile/AboutUs.jsx";
import Notfound from "./components/Notfound/Notfound.jsx";

import EditUser from "./components/UserProfile/EditUser.jsx";
import UserProfile from "./components/UserProfile/UserProfile.jsx";
import ChangePassword from "./components/UserProfile/ChangePassword.jsx";

import ProtectedRout from "./components/protectedRout/protectedRout.jsx";
import ProductDetails from "./components/ProductDetails/ProductDetails.jsx";
import AllOrders from "./components/AllOrders/AllOrders.jsx";
import Bell from "./components/Bell/Bell.jsx"; // ✅ رجعناه

import Cart from "./components/Carts/Carts.jsx";
import Wishlist from "./components/Wishlist/Wishlist.jsx";

import UserContextProvider from "./Context/userContext.jsx";
import { CartContextProvider } from "./Context/CartContext.jsx";
import { WishlistProvider } from "./Context/WishlistContext.jsx";
import ThemeProvider from "./Context/ThemeContext.jsx";
import { NotificationProvider } from "./Context/NotificationContext.jsx";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Offline } from "react-detect-offline";

import "./styles/responsive.css";

import HelpCenter from "./components/UserProfile/HelpCenter.jsx";
import Seller from "./components/Seller/Seller.jsx";
import SellerUploadProduct from "./components/SellerUploadProduct/SellerUploadProduct.jsx";
import EditSellerProfile from "./components/EditSellerProfile/EditSellerProfile.jsx";
import ManageInventory from "./components/ManageInventory/ManageInventory.jsx";
import Admin from "./components/Admin/Admin.jsx";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import AdminProducts from "./components/AdminProducts/AdminProducts.jsx";
import AdminReports from "./components/AdminReports/AdminReports.jsx";
import Checkout from "./components/Checkout/Checkout.jsx";
import Offers from "./components/Navbar/Offers.jsx";
const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
  index: true,
  element: <Products />,
},
      { path: "register", element: <Register /> },
      { path: "login",    element: <Login /> },

      { path: "about",   element: <ProtectedRout><AboutUs /></ProtectedRout> },
 

      {
        path: "ProductDetails/:id/:name?",
        element: <ProtectedRout><ProductDetails /></ProtectedRout>,
      },

      { path: "allorders",           element: <ProtectedRout><AllOrders /></ProtectedRout> },
      { path: "cart",                element: <ProtectedRout><Cart /></ProtectedRout> },
      { path: "checkout",            element: <ProtectedRout><Checkout /></ProtectedRout> },
      { path: "wishlist",            element: <ProtectedRout><Wishlist /></ProtectedRout> },
      { path: "userProf",            element: <ProtectedRout><UserProfile /></ProtectedRout> },
      { path: "seller",              element: <ProtectedRout><Seller /></ProtectedRout> },
      { path: "sellerUploadProduct", element: <ProtectedRout><SellerUploadProduct /></ProtectedRout> },
      { path: "editSellerProfile",   element: <ProtectedRout><EditSellerProfile /></ProtectedRout> },
      { path: "manageInventory",     element: <ProtectedRout><ManageInventory /></ProtectedRout> },
      { path: "admin",               element: <ProtectedRout><Admin /></ProtectedRout> },
      { path: "adminDashboard",      element: <ProtectedRout><AdminDashboard /></ProtectedRout> },
      { path: "adminProduct",        element: <ProtectedRout><AdminProducts /></ProtectedRout> },
      { path: "adminReports",        element: <ProtectedRout><AdminReports /></ProtectedRout> },
      { path: "edit-profile",        element: <ProtectedRout><EditUser /></ProtectedRout> },
      { path: "change-password",     element: <ProtectedRout><ChangePassword /></ProtectedRout> },

      { path: "bell",        element: <ProtectedRout><Bell /></ProtectedRout> }, // ✅ ده كان ناقص
      { path: "help-center", element: <HelpCenter /> },
      { path: "*",           element: <Notfound /> },
      {
  path: "/offers",
  element: <Offers />,
}
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <CartContextProvider>
            <WishlistProvider>
              <NotificationProvider>
                <RouterProvider router={routes} />
                <Offline>
                  <div className="offline bg-warning py-3 d-flex justify-content-center mb-1 mx-1 rounded-1 fw-semibold">
                    Sorry, You are currently{" "}
                    <span className="fw-bold mx-1">offline</span>
                  </div>
                </Offline>
                <Toaster />
              </NotificationProvider>
            </WishlistProvider>
          </CartContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}