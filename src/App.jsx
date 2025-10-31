import "./styles/index.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.css";
import ItemListContainer from "./pages/ItemListContainer";
import ItemDetailContainer from "./pages/ItemDetailContainer";
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
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <ItemListContainer />
            </>
          }
        />
        <Route path="/category/:categoryId" element={<ItemListContainer />} />
        <Route path="/item/:id" element={<ItemDetailContainer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
