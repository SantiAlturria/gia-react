import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import CartWidget from "../CartWidget";
import CartSidebar from "../CartSidebar/CartSidebar";
import logo from "../../assets/Logo.svg";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function NavBar() {
  const { cartItems, totalItems, updateQuantity, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="logo">
          <img src={logo} alt="Rosquitas & Donas" />
        </NavLink>

        <div className="nav-links">
          <Link to="/catalogo">Catálogo</Link>
          <a href="#nosotros">Sobre Nosotros</a>
          <a href="#contacto">Contacto</a>
          <a href="#comprarahora">Comprar ahora</a>
        </div>

        <div className="cart-container cart" onClick={toggleCart}>
          <CartWidget count={totalItems} />
        </div>
      </nav>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
        shippingConfig={{ zones: [], defaultShipping: 2000 }}
      />
    </>
  );
}
