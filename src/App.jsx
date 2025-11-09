import "./styles/index.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import ItemListContainer from "./pages/ItemListContainer.jsx";
import ItemDetailContainer from "./pages/ItemDetailContainer.jsx";
import HeroSection from "./components/HeroSection/HeroSection.jsx";
import ProductsList from "./components/ProductsList/ProductsList.jsx";
import { useCart } from "./context/CartContext.jsx";

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
              <ItemListContainer addToCart={addToCart} />
              <ProductsList addToCart={addToCart} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
