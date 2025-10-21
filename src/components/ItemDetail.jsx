import React, { useState } from "react";
import ItemCount from "./ItemCount";

export default function ItemDetail({ product }) {
  const [qty, setQty] = useState(0);

  function handleAddToCart(units) {
    setQty(units);
    alert(`Agregaste ${units} unidades de "${product.title}" al carrito (simulado).`);
  }

  return (
    <article className="item-detail" style={{ border: "1px solid #ddd", padding: 16, maxWidth: 700 }}>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p><strong>Precio:</strong> ${product.price}</p>
      <ItemCount stock={10} initial={1} onAdd={handleAddToCart} />
      {qty > 0 && <p>Agregaste <strong>{qty}</strong> al carrito.</p>}
    </article>
  );
}
