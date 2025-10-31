import React from "react";
import { NavLink } from "react-router-dom";
import CartWidget from "../CartWidget";
import logo from "../../assets/logodonas.jpg";
import "../NavBar/NavBar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
  <a href="/" className="logo">
    <img src="{logo}" alt="Rosquitas & Donas" />
    Rosquitas & Donas
  </a>
  <div className="nav-links">
    <a href="#catalogo">Catálogo</a>
    <a href="#nosotros">Sobre Nosotros</a>
    <a href="#contacto">Contacto</a>
    <div className="cart">🛒</div>
  </div>
</nav>

  );
}
