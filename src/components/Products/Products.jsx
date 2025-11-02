import React, { useState } from "react";
import "./Products.css"; 
// import product1 from '../../assets/product1.jpg';
// import product2 from '../../assets/product2.jpg';
// import product3 from '../../assets/product3.jpg';
// import product4 from '../../assets/product4.jpg';
// import product5 from '../../assets/product5.jpg';
// import product6 from '../../assets/product6.jpeg';
// import product7 from '../../assets/product7.jpeg';
// import product8 from '../../assets/product8.jpeg';

// const products = [
//   "./assets/product1.jpg",
//   "./assets/product2.jpg",
//   "./assets/product3.jpg",
//   "./assets/product4.jpg",
//   "./assets/product5.jpg",
//   "./assets/product6.jpeg",
//   "./assets/product7.jpeg",
//   "./assets/product8.jpeg",
// ];

export default function ProductSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="product-section">
      <p className="mini-description">Mirá esto</p>
      <h2>Estos son los productos que vas a poder encontrar disponibles a la compra!</h2>
      <button className="cta-button">+ Realizá tu pedido</button>

      <div className="carousel">
        <button className="arrow left" onClick={prevSlide}>&lt;</button>

        <div className="carousel-track">
          {products.map((img, index) => (
            <div
              key={index}
              className={`carousel-item ${index === currentIndex ? "active" : ""}`}
            >
              <img src={img} alt={`Producto ${index + 1}`} />
            </div>
          ))}
        </div>

        <button className="arrow right" onClick={nextSlide}>&gt;</button>
      </div>
    </section>
  );
}
