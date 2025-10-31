import React, { useEffect, useState } from "react"; 
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const productosFirebase = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductos(productosFirebase);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div>
      <h1>Catálogo</h1>
      <div className="catalogo">
        {productos.length === 0 ? (
          <p>Cargando productos...</p>
        ) : (
          productos.map((prod) => (
            <div key={prod.id} className="card">
              <h3>{prod.Nombre}</h3>
              <p>Categoría: {prod.Categoria}</p>
              <p>Precio: ${prod.Precio}</p>
              <p>Stock: {prod.Stock}</p>

              {/*variantes si existen */}
              {prod.variantes && prod.variantes.length > 0 && (
                <select>
                  {prod.variantes.map((v, index) => (
                    <option key={index}>
                      {v.nombre} - ${v.precio}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
