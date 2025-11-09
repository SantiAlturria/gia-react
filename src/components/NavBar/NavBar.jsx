import React from "react";
import { NavLink } from "react-router-dom";
import CartWidget from "../CartWidget";
import logo from "../../assets/Logo.svg";
import "./NavBar.css";

export default function NavBar({ cartCount = 0 }) {
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        <img src={logo} alt="Rosquitas & Donas" />
      </NavLink>

      <div className="nav-links">
        <a href="#catalogo">Catálogo</a>
        <a href="#nosotros">Sobre Nosotros</a>
        <a href="#contacto">Contacto</a>
      </div>

      <div className="cart-container">
        <CartWidget count={cartCount} />
      </div>
    </nav>
  );
}
