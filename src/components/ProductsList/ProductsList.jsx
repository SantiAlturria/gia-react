import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../data/firebaseConfig";
import "./ProductsList.css";
import { useCart } from "../../context/CartContext";

export default function ProductsList({ productos: productosProp }) {
  const [productos, setProductos] = useState(productosProp || []);

  // Estado de feedback por producto
  const [addedProducts, setAddedProducts] = useState({});

  const { addToCart } = useCart();

  useEffect(() => {
    if (!productosProp) {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "productos"));
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProductos(data);
        } catch (error) {
          console.error("Error al cargar productos:", error);
        }
      };

      fetchData();
    }
  }, [productosProp]);

  const handleAdd = (prod) => {
    addToCart(prod);

    // Cambia el estado del botón
    setAddedProducts((prev) => ({ ...prev, [prod.id]: true }));

    // A los 2 segundos vuelve a su estado normal
    setTimeout(() => {
      setAddedProducts((prev) => ({ ...prev, [prod.id]: false }));
    }, 2000);
  };

  return (
    <section className="productos-section">
      <h2 className="productos-titulo">Productos</h2>

      <div className="productos-grid">
        {productos.map((prod) => (
          <div key={prod.id} className="producto-card">
            <img src={prod.image} alt={prod.name} className="producto-img" />

            <h3 className="producto-nombre">{prod.name}</h3>

            <p className="producto-categoria">{prod.category}</p>

            {prod.variants && prod.variants.length > 0 ? (
              <p className="producto-precio">Desde ${prod.variants[0].price}</p>
            ) : (
              <p className="producto-precio">${prod.price}</p>
            )}

            <div className="producto-controles">
              <button
                className={`producto-boton ${
                  addedProducts[prod.id] ? "producto-agregado" : ""
                }`}
                onClick={() => handleAdd(prod)}
                disabled={addedProducts[prod.id]}
              >
                {addedProducts[prod.id]
                  ? "Producto agregado"
                  : "Agregar al carrito"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
