import axios from "axios"; 
import React, { useContext, useState, useEffect, useMemo } from "react"; 
import Loader from "../Loader/Loader"; 
import { toast } from "react-hot-toast"; 
import MainSlider from "./../MainSlider/MainSlider"; 
import { useQuery } from "@tanstack/react-query"; 
import { Helmet } from "react-helmet"; 
import Footer from "../Footer/Footer"; 
import { Link } from "react-router-dom"; 
// import { CartContext } from "../../Context/CartContext"; 
import { cartContext } from "../../Context/CartContext";
import CategorySlider from "../CategorySlider/Categoryslider"; 
import Chatbot from "../chatbot/Chat"; 
import { subCategoryMap } from "../../data/subCategoryMap"; 
import "../CategorySlider/CategorySlider.css"; 
 
import { FaRegHeart, FaHeart } from "react-icons/fa"; 
import { useWishlist } from "../../Context/WishlistContext"; 
import Navbar from "../Navbar/Navbar";
 
export default function Products() { 
  const { addToCart } = useContext(cartContext); 
  const { toggleWishlist, isInWishlist, wishlistItems } = useWishlist(); 
 
  const [activeCategory, setActiveCategory] = useState("All"); 
  const [activeSubCategory, setActiveSubCategory] = useState(""); 
  const [categories, setCategories] = useState([]); 
  const [categoriesLoading, setCategoriesLoading] = useState(true); 
 
  // ================= GET CATEGORIES ================= 
  useEffect(() => { 
    const fetchCategories = async () => { 
      try { 
        setCategoriesLoading(true); 
        const token = localStorage.getItem("userToken"); 
 
        const { data } = await axios.get( 
          "https://egzone.runasp.net/api/Categories", 
          { 
            headers: token ? { Authorization: `Bearer ${token}` } : {}, 
          } 
        ); 
 
        let cats = []; 
        if (Array.isArray(data)) cats = data; 
        else if (data?.data) cats = data.data; 
        else if (data?.$values) cats = data.$values; 
 
        setCategories(cats); 
      } catch (err) { 
        console.log("Categories Error", err); 
        toast.error("Failed to load categories"); 
      } finally { 
        setCategoriesLoading(false); 
      } 
    }; 
 
    fetchCategories(); 
  }, []); 
 
  // ================= GET PRODUCTS ================= 
  const getProducts = async () => { 
    try { 
      const token = localStorage.getItem("userToken"); 
 
      const { data } = await axios.get( 
        "https://egzone.runasp.net/api/Products", 
        { 
          headers: token ? { Authorization: `Bearer ${token}` } : {}, 
          params: { pageSize: 100 }, 
        } 
      ); 
 
      let products = []; 
      if (data?.data) products = data.data; 
      else if (Array.isArray(data)) products = data; 
      else if (data?.$values) products = data.$values; 
      else if (data?.items) products = data.items; 
 
      return products; 
    } catch (err) { 
      console.error("Products Error", err); 
      toast.error("Failed to load products"); 
      return []; 
    } 
  }; 
 
  const { data: products = [], isLoading, error } = useQuery({ 
    queryKey: ["products"], 
    queryFn: getProducts, 
    staleTime: 5 * 60 * 1000, 
    retry: 2, 
  }); 
 
  // ================= FILTER LOGIC WITH useMemo ================= 
  const categoriesWithProducts = useMemo(() => { 
    return categories.filter((category) => { 
      const categoryName = category?.name || category?.categoryName || ""; 
      return products.some((product) => { 
        const productCategory = 
          product?.category?.name || 
          product?.category?.categoryName || 
          product?.categoryName || 
          product?.category || 
          ""; 
        return productCategory.toLowerCase() === categoryName.toLowerCase(); 
      }); 
    }); 
  }, [categories, products]); 
 
  const filteredProductsByCategory = useMemo(() => { 
    if (activeCategory === "All") return products; 
     
    return products.filter((product) => { 
      const cat = product?.category?.name || 
                  product?.categoryName || 
                  product?.category || 
                  ""; 
      return cat.toLowerCase() === activeCategory.toLowerCase(); 
    }); 
  }, [products, activeCategory]); 
 
  const finalFilteredProducts = useMemo(() => { 
    if (!activeSubCategory) return filteredProductsByCategory; 
     
    return filteredProductsByCategory.filter((product) => 
      product?.subcategory?.toLowerCase() === activeSubCategory.toLowerCase() 
    ); 
  }, [filteredProductsByCategory, activeSubCategory]); 
 
  // ================= HANDLERS ================= 
  const handleFilter = (categoryName) => { 
    setActiveCategory(categoryName); 
    setActiveSubCategory(""); 
  }; 
 
  const handleSubCategoryClick = (sub) => { 
    setActiveSubCategory(sub); 
  }; 
 
  const handleAddToCart = async (e, productId) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    try { 
      await addToCart(productId); 
      toast.success("Added To Cart"); 
    } catch { 
      toast.error("Failed to add"); 
    } 
  }; 
 
  const handleWishlistToggle = (e, productId) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    toggleWishlist(productId); 
    const isNowInWishlist = !isInWishlist(productId); 
    toast.success(isNowInWishlist ? "Added to Wishlist ❤️" : "Removed from Wishlist"); 
  }; 
 
  const resetToAllProducts = () => { 
    handleFilter("All"); 
  }; 
 
  // ================= LOADING & ERROR STATES ================= 
  if (isLoading || categoriesLoading) return <Loader />; 
   
  if (error) { 
    return ( 
      <div style={{ textAlign: "center", padding: "40px" }}> 
        <p>Error loading products. Please try again later.</p> 
        <button  
          onClick={() => window.location.reload()} 
          style={{ padding: "8px 16px", cursor: "pointer" }} 
        > 
          Retry 
        </button> 
      </div> 
    ); 
  } 
 
  const availableSubs = 
  activeCategory === "All" 
    ? [] 
    : [ 
        ...new Set( 
          products 
            .filter((p) => { 
              const cat = 
                p?.category?.name || 
                p?.categoryName || 
                p?.category || 
                ""; 
 
              return ( 
                cat.toLowerCase() === 
                activeCategory.toLowerCase() 
              ); 
            }) 
            .map( 
              (p) => 
                p?.subcategory || 
                p?.subCategory 
            ) 
            .filter(Boolean) 
        ), 
      ]; 
 
  return ( 
    <> 
      <Helmet> 
        <title>Products - EGZone</title> 
      </Helmet> 
 
      <Navbar/>
    
      <MainSlider /> 
 
      <div className="container my-5"> 
        <CategorySlider 
          categories={categoriesWithProducts} 
          onFilter={handleFilter} 
          activeCategory={activeCategory} 
        /> 
 
        {availableSubs.length > 0 && ( 
          <div className="subCategoriesWrapper"> 
            <div className="subCategoriesTitle"> 
              Browse {activeCategory} 
            </div> 
            <div className="subCategoriesGrid"> 
              {availableSubs.map((sub) => ( 
                <button 
                  key={sub} 
                  className={`subCategoryBtn ${ 
                    activeSubCategory === sub ? "activeSub" : "" 
                  }`} 
                  onClick={() => handleSubCategoryClick(sub)} 
                  aria-pressed={activeSubCategory === sub} 
                > 
                  {sub} 
                </button> 
              ))} 
            </div> 
          </div> 
        )} 
 
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            margin: "24px 0 18px", 
          }} 
        > 
          <h5 style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "12px" }}> 
            {activeCategory === "All" ? "Our Products" : activeCategory} 
            
            {wishlistItems?.length > 0 && (
              <span style={{
                background: "#198754",
                color: "white",
                borderRadius: "50px",
                padding: "2px 10px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                ❤️ {wishlistItems.length}
              </span>
            )}
          </h5> 
 
          <span style={{ fontSize: 13, color: "var(--secondary-text)" }}> 
            {finalFilteredProducts.length} products 
          </span> 
        </div> 
 
        {/* ================= PRODUCTS GRID ================= */} 
        {finalFilteredProducts.length === 0 ? ( 
          <div style={{ textAlign: "center", padding: "60px 40px" }}> 
            <p style={{ fontSize: "18px", marginBottom: "20px" }}> 
              No products found in this category. 
            </p> 
            <button  
              onClick={resetToAllProducts} 
              style={{  
                padding: "10px 20px",  
                cursor: "pointer", 
                background: "var(--primary, #198754)", 
                color: "#fff", 
                border: "none", 
                borderRadius: "8px", 
                fontWeight: "600" 
              }} 
            > 
              View All Products 
            </button> 
          </div> 
        ) : ( 
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
              justifyContent: "center", 
              gap: 16, 
            }} 
          > 
            {finalFilteredProducts.map((product) => ( 
              <div 
                key={product.id} 
                style={{ 
                  background: "var(--card-bg)", 
                  borderRadius: 16, 
                  boxShadow: "0 2px 8px var(--shadow)", 
                  display: "flex", 
                  flexDirection: "column", 
                  transition: "transform 0.2s, box-shadow 0.2s", 
                }} 
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = "translateY(-4px)"; 
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; 
                }} 
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = "translateY(0)"; 
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; 
                }} 
              > 
                {/* ================= LINK ================= */} 
                <Link 
                  to={`/ProductDetails/${product.id}`} 
                  style={{ 
                    textDecoration: "none", 
                    color: "inherit", 
                    flex: 1, 
                  }} 
                > 
                  {/* IMAGE SECTION */} 
                  <div 
                    style={{ 
                      position: "relative", 
                      height: 200, 
                      overflow: "hidden", 
                      borderRadius: "16px 16px 0 0", 
                    }} 
                  > 
                    {/* WISHLIST BUTTON - EMPTY HEART BEFORE, FILLED WHEN FAVORITE */} 
                    <button 
                      onClick={(e) => handleWishlistToggle(e, product.id)} 
                      aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"} 
                      aria-pressed={isInWishlist(product.id)} 
                      style={{ 
                        position: "absolute", 
                        top: 12, 
                        right: 12, 
                        width: 36, 
                        height: 36, 
                        borderRadius: "50%", 
                        border: "none", 
                        background: "rgba(255, 255, 255, 0.95)", 
                        color: isInWishlist(product.id) ? "#dc3545" : "#198754", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        cursor: "pointer", 
                        zIndex: 10, 
                        transition: "all 0.25s ease", 
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)", 
                        backdropFilter: "blur(2px)", 
                      }} 
                      onMouseEnter={(e) => { 
                        e.currentTarget.style.transform = "scale(1.08)"; 
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; 
                      }} 
                      onMouseLeave={(e) => { 
                        e.currentTarget.style.transform = "scale(1)"; 
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)"; 
                      }} 
                    > 
                      {isInWishlist(product.id) ? <FaHeart size={18} /> : <FaRegHeart size={18} />} 
                    </button> 
 
                    <img 
                      src={ 
                        product?.images?.[0]?.url || 
                        product?.imageUrl || 
                        "/default-product.png" 
                      } 
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover", 
                      }} 
                      alt={product.name} 
                      onError={(e) => 
                        (e.target.src = "/default-product.png") 
                      } 
                    /> 
 
                    <span 
                      style={{ 
                        position: "absolute", 
                        top: 10, 
                        left: 10, 
                        background: "var(--card-bg)", 
                        padding: "4px 10px", 
                        borderRadius: 20, 
                        fontSize: 10, 
                        fontWeight: 600, 
                      }} 
                    > 
                      {product?.category?.name || 
                        product?.category || 
                        "Product"} 
                    </span> 
                  </div> 
 
                  {/* PRODUCT INFO */} 
                  <div style={{ padding: 12 }}> 
                    <h6 style={{  
                      fontSize: 14,  
                      margin: "0 0 8px 0", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      whiteSpace: "nowrap" 
                    }}> 
                      {product.name} 
                    </h6> 
 
                    <span 
                      style={{ 
                        color: "#198754", 
                        fontWeight: 700, 
                        fontSize: 16, 
                      }} 
                    > 
                      {product.price} EGP 
                    </span> 
                  </div> 
                </Link> 
 
                {/* CART BUTTON */} 
                <div style={{ padding: "10px 12px 14px" }}> 
                  <button 
                    onClick={(e) => handleAddToCart(e, product.id)} 
                    style={{ 
                      width: "100%", 
                      padding: "10px", 
                      borderRadius: 10, 
                      border: "none", 
                      background: "#198754", 
                      color: "#fff", 
                      fontWeight: 600, 
                      cursor: "pointer", 
                      transition: "background 0.2s", 
                    }} 
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.background = "#157347"; 
                    }} 
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.background = "#198754"; 
                    }} 
                  > 
                    🛒 Add to Cart 
                  </button> 
                </div> 
              </div> 
            ))} 
          </div> 
        )} 
      </div> 
 
      <Footer /> 
      <Chatbot /> 
    </> 
  ); 
}