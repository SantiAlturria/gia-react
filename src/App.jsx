import "./styles/index.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import ProductSection from "./components/Carrusel/Carrusel.jsx";
import ItemListContainer from "./pages/ItemListContainer.jsx";
import ItemDetailContainer from "./pages/ItemDetailContainer.jsx";
import HeroSection from "./components/HeroSection/HeroSection.jsx";
import ProductsList from "./components/ProductsList/ProductsList.jsx";
import { useCart } from "./context/CartContext.jsx";
import Checkout from "./pages/Checkout.jsx";

function NotFound() {
  return (
    <main style={{ padding: 20 }}>
      <h2>404 — Página no encontrada</h2>
      <p>Revisá el enlace o volvé al inicio.</p>
    </main>
  );
}

export default function App() {
  const { addToCart, totalItems } = useCart();

  return (
    <>
      <NavBar cartCount={totalItems} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <ProductSection />
              <ItemListContainer addToCart={addToCart} />
            </>
          }
        />

        <Route
          path="/category/:categoryId"
          element={<ItemListContainer addToCart={addToCart} />}
        />

        <Route
          path="/item/:id"
          element={<ItemDetailContainer addToCart={addToCart} />}
        />

        {/* ESTA ES LA QUE LE FALTABA */}
        <Route path="/checkout" element={<Checkout />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./data/firebaseConfig";

async function testFirestore() {
  try {
    const ref = collection(db, "orders");
    const doc = await addDoc(ref, {
      test: true,
      createdAt: serverTimestamp()
    });
    console.log("Orden creada:", doc.id);
  } catch (err) {
    console.error("Error Firestore:", err);
  }
}

testFirestore();
