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

  // addToCart: agrega producto base. Si tiene variantes crea selections + unassigned (o incrementa unassigned si ya existe)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        const exists = updated[idx];

        // si el producto tiene variantes: aumentamos unassigned
        if (exists.selections) {
          updated[idx] = { ...exists, unassigned: (exists.unassigned || 0) + 1 };
          return updated;
        }

        // producto sin variantes -> aumentar cantidad
        updated[idx] = { ...exists, quantity: (exists.quantity || 0) + 1 };
        return updated;
      }

      // si no existía, lo agregamos
      if (product.variants && product.variants.length > 0) {
        const selections = product.variants.map((v, i) => ({
          index: i,
          label: v.label,
          price: v.price ?? 0,
          stock: v.stock ?? null,
          quantity: 0,
        }));

        const item = {
          id: product.id,
          name: product.name,
          image: product.image,
          variants: product.variants,
          selections,
          unassigned: 1, // al agregar por primera vez, dejamos 1 sin asignar (contador sube)
        };
        return [...prev, item];
      } else {
        // producto sin variantes
        const item = {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price ?? 0,
          stock: product.stock ?? null,
          quantity: product.quantity ?? 1,
        };
        return [...prev, item];
      }
    });
  };

  // updateQuantity: productos sin variantes
  const updateQuantity = (id, newQuantity) => {
    setCartItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: Math.max(0, newQuantity) } : p))
        .filter((p) => {
          if (!p.selections && (p.quantity ?? 0) === 0) return false;
          return true;
        })
    );
  };

  // updateVariantQuantity: cambia qty de una variante (por ejemplo + / - en la fila variante)
  const updateVariantQuantity = (itemId, variantIndex, newQuantity) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== itemId || !item.selections) return item;

          const selections = item.selections.map((s) =>
            s.index === Number(variantIndex) ? { ...s, quantity: Math.max(0, Number(newQuantity)) } : s
          );

          return { ...item, selections };
        })
        // eliminar items vacíos (selections + unassigned === 0)
        .filter((item) => {
          if (!item.selections) return true;
          const totalSel = item.selections.reduce((a, s) => a + (s.quantity || 0), 0);
          const total = totalSel + (item.unassigned || 0) + 0;
          return total > 0;
        })
    );
  };

  // incrementar/decrementar unassigned
  const incrementUnassigned = (itemId, delta = 1) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId || !item.selections) return item;
        return { ...item, unassigned: (item.unassigned || 0) + Number(delta) };
      })
    );
  };

  const decrementUnassigned = (itemId, delta = 1) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== itemId || !item.selections) return item;
          const newUn = Math.max(0, (item.unassigned || 0) - Number(delta));
          return { ...item, unassigned: newUn };
        })
        .filter((item) => {
          if (!item.selections) return true;
          const totalSel = item.selections.reduce((a, s) => a + (s.quantity || 0), 0);
          const total = totalSel + (item.unassigned || 0);
          return total > 0;
        })
    );
  };

  // asigna unidades 'unassigned' a una variante específica
  const assignUnassignedToVariant = (itemId, variantIndex, qty = 1) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== itemId || !item.selections) return item;
          const available = item.unassigned || 0;
          const assignQty = Math.min(Number(qty), available);
          if (assignQty <= 0) return item;

          const selections = item.selections.map((s) =>
            s.index === Number(variantIndex) ? { ...s, quantity: (s.quantity || 0) + assignQty } : s
          );

          return { ...item, selections, unassigned: Math.max(0, available - assignQty) };
        })
        .filter((item) => {
          if (!item.selections) return true;
          const totalSel = item.selections.reduce((a, s) => a + (s.quantity || 0), 0);
          const total = totalSel + (item.unassigned || 0);
          return total > 0;
        })
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCartItems([]);

  // totalItems: cuenta todas las unidades (selections + unassigned + productos sin variantes)
  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (item.selections) {
        const selSum = item.selections.reduce((a, s) => a + (s.quantity || 0), 0);
        return acc + selSum + (item.unassigned || 0);
      }
      return acc + (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  // subTotal: suma solo las cantidades asignadas (no suma unassigned)
  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (item.selections) {
        const sum = item.selections.reduce((a, s) => a + (s.price || 0) * (s.quantity || 0), 0);
        return acc + sum;
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
        incrementUnassigned,
        decrementUnassigned,
        assignUnassignedToVariant,
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
