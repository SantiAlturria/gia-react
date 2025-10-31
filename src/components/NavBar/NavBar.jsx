import React from "react";
import { NavLink } from "react-router-dom";
import CartWidget from "../CartWidget";
import logo from "../../assets/logodonas.jpg";


const categories = [
  { id: "all", label: "Todos" },
  { id: "donas", label: "Donas" },
  { id: "rosquitas", label: "Rosquitas" },
  { id: "combo", label: "Combos" },
];

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="brand">
        <NavLink to="/">
          <img src={logo} alt="Rosquitas & Donas" style={{ height: 48 }} />
        </NavLink>
      </div>
      <nav>
        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          {categories.map(cat => (
            <li key={cat.id}>
              {}
              <NavLink to={cat.id === "all" ? "/" : `/category/${cat.id}`}>
                {cat.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <CartWidget />
    </header>
  );
}
