// CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "rosquitas_cart_v1";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // ====================
  // ADD TO CART
  // ====================
  const addToCart = (product) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);

      // Si ya existe
      if (idx >= 0) {
        const updated = [...prev];
        const exists = updated[idx];

        // Si tiene variantes: sumar a la primera variante
        if (exists.selections) {
          const sel = exists.selections.map((s, i) =>
            i === 0 ? { ...s, quantity: s.quantity + 1 } : s
          );
          updated[idx] = { ...exists, selections: sel };
          return updated;
        }

        // Si NO tiene variantes: sumar cantidad
        updated[idx] = {
          ...exists,
          quantity: (exists.quantity || 1) + 1,
        };
        return updated;
      }

      // No existe → crear
      if (product.variants && product.variants.length > 0) {
        const selections = product.variants.map((v) => ({
          label: v.label,
          price: v.price ?? 0,
          stock: v.stock ?? null,
          quantity: 0,
        }));

        // A la primera variante le damos 1 unidad por defecto
        selections[0].quantity = 1;

        const item = {
          id: product.id,
          name: product.name,
          image: product.image,
          selections,
        };

        return [...prev, item];
      }

      // Producto simple
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price ?? 0,
          stock: product.stock ?? null,
          quantity: 1,
        },
      ];
    });
  };

  // ====================
  // UPDATE QUANTITY (simple)
  // ====================
  const updateQuantity = (id, newQty) => {
    setCartItems((prev) =>
      prev
        .map((p) =>
          p.id === id
            ? { ...p, quantity: Math.max(0, newQty) }
            : p
        )
        .filter((p) => (p.selections ? true : (p.quantity ?? 0) > 0))
    );
  };

  // ====================
  // UPDATE VARIANT QUANTITY
  // ====================
  const updateVariantQuantity = (itemId, index, newQty) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== itemId || !item.selections) return item;

          const selections = item.selections.map((s, i) =>
            i === index ? { ...s, quantity: Math.max(0, newQty) } : s
          );

          return { ...item, selections };
        })
        .filter((item) => {
          if (!item.selections) return true;
          const totalQty = item.selections.reduce(
            (acc, s) => acc + (s.quantity || 0),
            0
          );
          return totalQty > 0;
        })
    );
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((p) => p.id !== id));

  const clearCart = () => setCartItems([]);

  // ====================
  // TOTAL ITEMS
  // ====================
  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (item.selections) {
        return (
          acc +
          item.selections.reduce(
            (s, v) => s + (v.quantity || 0),
            0
          )
        );
      }
      return acc + (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  // ====================
  // SUBTOTAL
  // ====================
  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (item.selections) {
        return (
          acc +
          item.selections.reduce(
            (s, v) => s + (v.price || 0) * (v.quantity || 0),
            0
          )
        );
      }
      return acc + (item.price || 0) * (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        updateVariantQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
