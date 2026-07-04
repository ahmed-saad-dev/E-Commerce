import React, { useContext, useEffect } from "react";
import styles from "./ManageInventory.module.css";
import { userContext } from '../../context/userContext';
import { FaPen, FaTrash } from "react-icons/fa";
export default function ManageInventory() {
  const products = [
    {
      id: 1,
      name: "ASUS TUF Gaming F15",
      price: 65000,
      image: "https://via.placeholder.com/70",
    },
    {
      id: 2,
      name: "HP laptop",
      price: 55000,
      image: "https://via.placeholder.com/70",
    },
    {
      id: 3,
      name: "XBOX Console",
      price: 30000,
      image: "https://via.placeholder.com/70",
    },
    {
      id: 4,
      name: "Casio Watch",
      price: 2000,
      image: "https://via.placeholder.com/70",
    },
    {
      id: 5,
      name: "Michael Kors Watch",
      price: 7200,
      image: "https://via.placeholder.com/70",
    },
    {
      id: 6,
      name: "Tommy Hilfiger Watch",
      price: 6800,
      image: "https://via.placeholder.com/70",
    },
  ];

useEffect(()=> {
  console.log('seller ID', localStorage.getItem('sellerId'));
}, [])


  const handleEdit = (id) => {
    console.log("Edit:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete:", id);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Inventory</h2>

      {products.map((product) => (
        <div key={product.id} className={styles.card}>
          <div className={styles.productInfo}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.image}
            />

            <div className={styles.details}>
              <h4>{product.name}</h4>
              <p>EGP {product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              onClick={() => handleEdit(product.id)}
            >
              <FaPen />
            </button>

            <button
              className={styles.deleteBtn}
              onClick={() => handleDelete(product.id)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}