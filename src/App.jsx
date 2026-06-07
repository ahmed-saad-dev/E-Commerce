import "./App.css";

import Brands from "./component/Brands/Brands.jsx";
import Register from "./component/Register/Register.jsx";
import Login from "./component/Login/Login.jsx";
import Chatbot from "./component/chatbot/Chat";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./component/Layout/Layout.jsx";

import Products from "./component/Products/Products.jsx";
import AboutUs from "./component/UserProfile/AboutUs";
import Notfound from "./component/Notfound/Notfound.jsx";

import EditUser from "./component/UserProfile/EditUser";
import UserProfile from "./component/UserProfile/UserProfile.jsx";
import ChangePassword from "./component/UserProfile/ChangePassword.jsx";

import ProtectedRout from "./component/protectedRout/protectedRout.jsx";
import ProductDetails from "./component/ProductDetails/ProductDetails.jsx";
import AllOrders from "./component/AllOrders/AllOrders.jsx";

import Cart from "./component/Carts/Carts.jsx";
import Wishlist from "./component/Wishlist/Wishlist.jsx";

import UserContextProvider from "./Context/userContext";
import { CartContextProvider } from "./Context/CartContext.jsx";
import { WishlistProvider } from "./Context/WishlistContext";
import ThemeProvider from "./Context/ThemeContext";

import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Offline } from "react-detect-offline";

import "./styles/responsive.css";

import HelpCenter from "./component/UserProfile/HelpCenter";
import Seller from "./component/Seller/Seller.jsx";
import SellerUploadProduct from "./component/SellerUploadProduct/SellerUploadProduct.jsx";
import EditSellerProfile from "./component/EditSellerProfile/EditSellerProfile.jsx";
import ManageInventory from "./component/ManageInventory/ManageInventory.jsx";
import Admin from "./component/Admin/Admin.jsx";
import AdminDashboard from "./component/AdminDashboard/AdminDashboard.jsx";
import AdminProducts from "./component/AdminProducts/AdminProducts.jsx";
import AdminReports from "./component/AdminReports/AdminReports.jsx";
import Checkout from "./component/Checkout/Checkout";

// 🔔 NotificationContext FIX (مهم جدًا)
import { NotificationProvider } from "./Context/NotificationContext.jsx";

const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRout>
            <Products />
          </ProtectedRout>
        ),
      },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },

      {
        path: "about",
        element: (
          <ProtectedRout>
            <AboutUs />
          </ProtectedRout>
        ),
      },

      {
        path: "brands",
        element: (
          <ProtectedRout>
            <Brands />
          </ProtectedRout>
        ),
      },

      {
        path: "ProductDetails/:id/:name?",
        element: (
          <ProtectedRout>
            <ProductDetails />
          </ProtectedRout>
        ),
      },

      {
        path: "allorders",
        element: (
          <ProtectedRout>
            <AllOrders />
          </ProtectedRout>
        ),
      },

      {
        path: "cart",
        element: (
          <ProtectedRout>
            <Cart />
          </ProtectedRout>
        ),
      },

      {
        path: "checkout",
        element: (
          <ProtectedRout>
            <Checkout />
          </ProtectedRout>
        ),
      },

      {
        path: "wishlist",
        element: (
          <ProtectedRout>
            <Wishlist />
          </ProtectedRout>
        ),
      },

      {
        path: "userProf",
        element: (
          <ProtectedRout>
            <UserProfile />
          </ProtectedRout>
        ),
      },

      {
        path: "seller",
        element: (
          <ProtectedRout>
            <Seller />
          </ProtectedRout>
        ),
      },

      {
        path: "sellerUploadProduct",
        element: (
          <ProtectedRout>
            <SellerUploadProduct />
          </ProtectedRout>
        ),
      },

      {
        path: "editSellerProfile",
        element: (
          <ProtectedRout>
            <EditSellerProfile />
          </ProtectedRout>
        ),
      },

      {
        path: "manageInventory",
        element: (
          <ProtectedRout>
            <ManageInventory />
          </ProtectedRout>
        ),
      },

      {
        path: "admin",
        element: (
          <ProtectedRout>
            <Admin />
          </ProtectedRout>
        ),
      },

      {
        path: "adminDashboard",
        element: (
          <ProtectedRout>
            <AdminDashboard />
          </ProtectedRout>
        ),
      },

      {
        path: "adminProduct",
        element: (
          <ProtectedRout>
            <AdminProducts />
          </ProtectedRout>
        ),
      },

      {
        path: "adminReports",
        element: (
          <ProtectedRout>
            <AdminReports />
          </ProtectedRout>
        ),
      },

      {
        path: "edit-profile",
        element: (
          <ProtectedRout>
            <EditUser />
          </ProtectedRout>
        ),
      },

      {
        path: "change-password",
        element: (
          <ProtectedRout>
            <ChangePassword />
          </ProtectedRout>
        ),
      },

      { path: "help-center", element: <HelpCenter /> },
      { path: "*", element: <Notfound /> },
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