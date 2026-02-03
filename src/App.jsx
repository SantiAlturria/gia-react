import "./styles/index.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar.jsx";
import HeroSection from "./components/HeroSection/HeroSection.jsx";
import Carrusel from "./components/Carrusel/Carrusel.jsx";
import SobreNosotros from "./components/SobreNosotros/SobreNosotros.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Catalogo from "./pages/Catalogo";
import ItemListContainer from "./pages/ItemListContainer.jsx";
import ItemDetailContainer from "./pages/ItemDetailContainer.jsx";
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
  return (
    <>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <Carrusel />
              <SobreNosotros />
              <Footer />
            </>
          }
        />

        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/category/:categoryId" element={<ItemListContainer />} />
        <Route path="/item/:id" element={<ItemDetailContainer />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
