// src/components/ItemListContainer.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../data/products";
import "../App.css";

export default function ItemListContainer() {
  const { categoryId } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const categoria = categoryId === undefined || categoryId === "all" ? null : categoryId;
    fetchProducts(categoria)
      .then((data) => setProductos(data))
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) {
    return (
      <main style={{ padding: 20, textAlign: "center" }}>
        <p>Cargando productos...</p>
      </main>
    );
  }

  return (
    <section className="catalogo">
      <h2>Bienvenidos a Donas & Rosquitas</h2>
      <p>
        Endulzá tu día con nuestras donas y rosquitas artesanales, hechas con amor cada mañana.
      </p>

      <div className="grid-productos">
        {productos.map((p) => (
          <div key={p.id} className="card-producto">
            <img
              src={
                p.category === "donas"
                  ? "https://i.imgur.com/6V4kGgV.jpg"
                  : p.category === "rosquitas"
                  ? "https://i.imgur.com/UB1Qx9S.jpg"
                  : "https://i.imgur.com/RtxjGzP.jpg"
              }
              alt={p.title}
            />
            <h3>{p.title}</h3>
            <p className="descripcion">{p.description}</p>
            <p className="precio">${p.price}</p>
            <button>Ver más</button>
          </div>
        ))}
      </div>

      {productos.length === 0 && <p>No hay productos en esta categoría.</p>}
    </section> 
  );
}
