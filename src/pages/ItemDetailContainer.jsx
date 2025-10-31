import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../data/products";
import ItemDetail from "../components/ItemDetail";

export default function ItemDetailContainer() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProductById(id)
      .then((res) => setProduct(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main style={{ padding: 20 }}>Cargando producto...</main>;
  if (error) return <main style={{ padding: 20 }}><h3>Error:</h3><p>{error}</p></main>;

  return (
    <main style={{ padding: 20 }}>
      <ItemDetail product={product} />
    </main>
  );
}
