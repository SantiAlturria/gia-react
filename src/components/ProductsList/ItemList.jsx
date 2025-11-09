import React from "react";
import "./ProductsList.css";

export default function ItemList({ productos }) {
  return (
    <div className="productos-grid">
      {productos.map((prod) => (
        <div key={prod.id} className="producto-card">
          <img
            src={prod.image}
            alt={prod.name}
            className="producto-img"
          />
          <h3 className="producto-nombre">{prod.name}</h3>
          <p className="producto-categoria">{prod.category}</p>

          {prod.variants && prod.variants.length > 0 && (
            <p className="producto-precio">
              Desde ${prod.variants[0].price} 
            </p>
          )}   

          <div className="producto-controles">
            <button className="producto-boton">Agregar al carrito</button>
          </div>
        </div>
      ))}
    </div>
  );
}
