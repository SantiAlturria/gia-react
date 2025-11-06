import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../data/firebaseConfig";
import "./ProductsList.css";

export default function ProductList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <section className="productos-section">
      <h2 className="productos-titulo">Productos</h2>
      <div className="productos-grid">
        {productos.map((prod) => (
          <div key={prod.id} className="producto-card">
            <img src={prod.imagen} alt={prod.nombre} className="producto-img" />
            <h3 className="producto-nombre">{prod.nombre}</h3>
            <p className="producto-precio">${prod.precio}</p>
            <div className="producto-controles">
              <button className="producto-boton">Agregar al carrito</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
