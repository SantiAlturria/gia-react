import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../data/firebaseConfig";
import "./ProductsList.css";
import { useCart } from "../../context/CartContext";

export default function ProductsList({ categoria }) {
  const [productos, setProductos] = useState([]);
  const [addedProducts, setAddedProducts] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));

        const data = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((prod) => prod.category === categoria);

        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchData();
  }, [categoria]);

  const handleAdd = (product, variant) => {
  addToCart({
    id: `${product.id}-${variant.id}`,
    productId: product.id,
    name: product.name,
    variant: variant.name,
    price: variant.price,
    quantity: 1,
  });
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

            {prod.variants?.map((variant) => (
              <button
                key={variant.id}
                className="producto-boton"
                onClick={() => handleAdd(prod, variant)}
              >
                {variant.name} · ${variant.price}
              </button>
            ))}

          </div>
        ))}
      </div>
    </section>
  );
}
