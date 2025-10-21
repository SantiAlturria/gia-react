import React from "react";
import "../App.css";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__overlay">
        <div className="hero__content">
          <span className="hero__tag">Horneado fresco cada día</span>
          <h2 className="hero__subtitle">Endulzá tu día con nuestras</h2>
          <h1 className="hero__title">Donas Artesanales</h1>

          <p className="hero__text">
            Descubrí el sabor auténtico de nuestras donas y rosquitas,
            elaboradas con ingredientes premium y mucho amor. Cada bocado es una
            experiencia única.
          </p>

          <div className="hero__buttons">
            <button className="btn btn-primary">Explorar productos</button>
            <button className="btn btn-outline">Ver menú completo</button>
          </div>

          <div className="hero__stats">
            <div className="stat">500+ <span>Clientes felices</span></div>
            <div className="stat">+6 <span>Variedades</span></div>
            <div className="stat">100% <span>Artesanal</span></div>
          </div>

          <div className="hero__price">
            <button className="btn btn-small">Desde $200</button>
          </div>
        </div>
      </div>
    </section>
  );
}
