import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailContainer";
import HeroSection from "./components/HeroSection";

function NotFound() {
  return (
    <main style={{ padding: 20 }}>
      <h2>404 — Página no encontrada</h2>
      <p>Revisá el enlace o volvé al inicio.</p>
    </main>
  );
}

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* 🏠 Home con Hero + catálogo */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <ItemListContainer />
            </>
          }
        />
        {/* 🧩 Categorías */}
        <Route path="/category/:categoryId" element={<ItemListContainer />} />
        {/* 🛍️ Detalle de producto */}
        <Route path="/item/:id" element={<ItemDetailContainer />} />
        {/* 🚫 Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
