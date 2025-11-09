import React from "react";
import "./CartWidget.css";

export default function CartWidget({ count = 0 }) {
  return (
    <div className="cart-widget" aria-label="Carrito">
      🛒 <span className="cart-count">{count}</span>
    </div>
  );
}
