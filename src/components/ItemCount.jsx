import React, { useState } from "react";

export default function ItemCount({ stock = 10, initial = 1, onAdd }) {
  const [count, setCount] = useState(initial);

  const inc = () => setCount(c => Math.min(c + 1, stock));
  const dec = () => setCount(c => Math.max(c - 1, 1));
  const add = () => onAdd && onAdd(count);

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={dec}>-</button>
        <span>{count}</span>
        <button onClick={inc}>+</button>
        <button onClick={add} style={{ marginLeft: 12 }} disabled={count <= 0}>Agregar al carrito</button>

      </div>
      <small>Stock disponible: {stock}</small>
    </div>
  );
}
