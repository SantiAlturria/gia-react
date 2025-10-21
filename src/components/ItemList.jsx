import React from "react";
import { Link } from "react-router-dom";

export default function ItemList({ items }) {
  return (
    <section className="item-grid" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
      {items.map(item => (
        <article key={item.id} className="item-card" style={{ border: "1px solid #ddd", padding: 12 }}>
          <h3>{item.title}</h3>
          <p>${item.price}</p>
          <Link to={`/item/${item.id}`}>Ver detalle</Link>
        </article>
      ))}
    </section>
  );
}
