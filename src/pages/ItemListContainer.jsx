import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Services
import { fetchAllProducts, fetchProductsByCategory } from "../data/firebase";

// Mensajes
import { useMessage } from "../hooks/useMessage";
import Message from "../components/Message/Message";

import ItemList from "../components/ProductsList/ProductsList";

export default function ItemListContainer() {
  const { categoryId } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { message, showMessage } = useMessage();

  useEffect(() => {
    const obtener = async () => {
      try {
        setLoading(true);

        const data = categoryId
          ? await fetchProductsByCategory(categoryId)
          : await fetchAllProducts();

        setProductos(data);
      } catch (error) {
        showMessage("Error al obtener productos.", "error");
      } finally {
        setLoading(false);
      }
    };

    obtener();
  }, [categoryId]);

  return (
    <>
      {loading && <p className="loading">Cargando productos...</p>}
      {message && <Message type={message.type} text={message.text} />}
      {!loading && <ItemList productos={productos} />}
    </>
  );
}
