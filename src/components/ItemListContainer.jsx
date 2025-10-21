import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts } from "../data/products";

import ItemList from "./ItemList";

export default function ItemListContainer() {
  const { categoryId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
   
    const cat = categoryId === undefined || categoryId === "all" ? null : categoryId;
    fetchProducts(cat)
      .then((res) => setItems(res))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [categoryId]); 

  if (loading) return <main style={{ padding: 20 }}>Cargando productos...</main>;

  return (
    <main style={{ padding: 20 }}>
      <h2>Catálogo {categoryId ? `- ${categoryId}` : ""}</h2>
      <ItemList items={items} />
      {items.length === 0 && <p>No hay productos en esta categoría.</p>}
      <hr />
      <p>Hacé click en un producto para ver el detalle.</p>
    </main>
  );
}
