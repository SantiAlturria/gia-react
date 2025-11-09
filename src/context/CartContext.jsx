import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + (product.quantity || 1) }
            : p
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const clearCart = () => setCart([]);
  const totalItems = cart.reduce((acc, p) => acc + (p.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

 