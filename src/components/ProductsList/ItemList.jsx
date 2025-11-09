import React from "react";
import "./ProductsList.css";
import { useCart } from "../../context/CartContext";


export default function ItemList({ productos }) {
  const { addToCart } = useCart();

  return (
    <div className="productos-container">
      {productos.map((prod) => (
        <div key={prod.id} className="producto-card">
          <img src={prod.image} alt={prod.name} className="producto-imagen" />
          <h3>{prod.name}</h3>
          <p>${prod.price}</p>
          <button
            className="producto-boton"
            onClick={() => addToCart(prod)}
          >
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
}
