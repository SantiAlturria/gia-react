
import React, { useState } from "react";
import "./Products.css";
import product1 from "../../assets/product1.jpg";
import product2 from "../../assets/product2.jpg";
import product3 from "../../assets/product3.jpg";
import product4 from "../../assets/product4.jpg";
import product5 from "../../assets/product5.jpg";
import product6 from "../../assets/product6.jpeg";
import product7 from "../../assets/product7.jpeg";
import product8 from "../../assets/product8.jpeg";

const products = [
  product1,
  product2,
  product3,
  product4,
  product5,
  product6,
  product7,
  product8,
];

export default function ProductSection() {
  const [currentIndex, setCurrentIndex] = useState(2);

  const VISIBLE_SIDES = 2;
  const CARD_WIDTH = 250;
  const OVERLAP = 60;
  const STEP = CARD_WIDTH - OVERLAP;

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % products.length);

  const normalizedOffset = (i, center) => {
    let offset = i - center;
    const half = Math.floor(products.length / 2);
    if (offset > half) offset -= products.length;
    if (offset < -half) offset += products.length;
    return offset;
  };

  return (
    <section className="product-section">
      <p className="mini-description">Mirá esto</p>
      <h2>Estos son los productos que vas a poder encontrar disponibles a la compra!</h2>

      <button className="cta-button">+ Realizá tu pedido</button>

      <div className="carousel-wrapper-products">
        <button
          className="arrow nav-left"
          onClick={prevSlide}
          aria-label="Anterior"
          title="Anterior"
        >
          <svg width="14" height="28" viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2 L2 14 L12 26" stroke="#E879A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        <div className="carousel-viewport-products" role="list">
          {products.map((img, index) => {
            const offset = normalizedOffset(index, currentIndex);
            const absOff = Math.abs(offset);
            const visible = absOff <= VISIBLE_SIDES;
            const translateX = offset * STEP;
            const scale = offset === 0 ? 1.08 : absOff === 1 ? 1.02 : 0.98;
            const translateY = offset === 0 ? -18 : absOff === 1 ? -6 : 6;
            const zIndex = 1000 - absOff;

            const style = {
              transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
              zIndex,
              transition: "transform .5s ease-in-out, box-shadow .25s ease, opacity .25s ease",
              opacity: visible ? 1 : 0,
            };

            return (
              <div
                role="listitem"
                key={index}
                className={`product-card ${visible ? "visible" : "hidden"} ${offset === 0 ? "center" : ""}`}
                style={style}
                onClick={() => setCurrentIndex(index)}
                title={`Producto ${index + 1}`}
                tabIndex={0}
              >
                {/* Inner container kept only for the border-radius / clipping */}
                <div className="product-card-inner">
                  <img src={img} alt={`Producto ${index + 1}`} draggable="false" />
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="arrow nav-right"
          onClick={nextSlide}
          aria-label="Siguiente"
          title="Siguiente"
        >
          <svg width="14" height="28" viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2 L12 14 L2 26" stroke="#E879A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>
    </section>
  );
}
