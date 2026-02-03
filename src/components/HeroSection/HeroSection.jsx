import React from "react";
import "../HeroSection/HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <span className="hero-brand">Rosquitas & Donas</span>

          <h1>Hecho con amor, hecho todas las mañanas</h1>

          <button className="btn-primary">Ver productos</button>
        </div>
      </div>
    </section>
  );
}