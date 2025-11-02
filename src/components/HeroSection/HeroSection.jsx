import React from "react";
import "../HeroSection/HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Rosquitas & Donas</h1>
          <p>¡Hecho con amor, hecho todas las mañanas!</p>
          <div className="hero-buttons">
            <button className="btn-primary">Explorar catálogo</button>
            <button className="btn-secondary">Ver productos</button>
          </div>
          <div className="hero-info">
            <span>+ 8 Variedades</span>
            <span>+ 5 Años juntos</span>
            <span>100% Casero</span>
          </div>
        </div>
      </div>
    </section>
  );
}

