
// CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "rosquitas_cart_v1";

// ====================
// LOCALSTORAGE SEGURO
// ====================
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("Carrito corrupto en LocalStorage:", e);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCartFromStorage);

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  }, [cartItems]);

  // ====================
  // ADD TO CART (versión avanzada)
  // ====================
  // addToCart (versión final, robusta)
const addToCart = (product) => {
  setCartItems((prev) => {
    const idx = prev.findIndex((p) => p.id === product.id);
    const qtyToAdd = product.quantity || 1;

    // --- Determinar índice de variante si viene nombre en el payload ---
    let computedVariantIndex = null;
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      if (typeof product.selectedVariantIndex === "number") {
        computedVariantIndex = product.selectedVariantIndex;
      } else if (typeof product.variant === "string") {
        const findIdx = product.variants.findIndex(
          (v) => (v.name ?? v.label) === product.variant
        );
        computedVariantIndex = findIdx >= 0 ? findIdx : null;
      } else if (typeof product.variantName === "string") {
        const findIdx = product.variants.findIndex(
          (v) => (v.name ?? v.label) === product.variantName
        );
        computedVariantIndex = findIdx >= 0 ? findIdx : null;
      }
    }

    // Normalizamos campos para evitar undefined
    const normalized = {
      id: product.id,
      name: product.title ?? product.name ?? "Producto",
      image: product.image ?? product.images?.[0] ?? null,
      price: product.price ?? (product.variants?.[0]?.price ?? 0),
      stock: product.stock ?? null,
      selectedVariantIndex: computedVariantIndex,
    };

    // Si ya existe en carrito
    if (idx >= 0) {
      const updated = [...prev];
      const exists = updated[idx];

      // Caso: carrito tiene selections (producto con variantes)
      if (exists.selections) {
        // Priorizar match por nombre en las selections (si se pasó product.variant)
        let selIndex = null;
        if (typeof product.variant === "string") {
          selIndex = exists.selections.findIndex(
            (s) => (s.label ?? s.name) === product.variant
          );
        }
        // Si no encontramos por nombre, usamos el computedVariantIndex (si existe), o fallback 0
        selIndex = selIndex ?? normalized.selectedVariantIndex ?? 0;

        const newSelections = exists.selections.map((s, i) =>
          i === selIndex ? { ...s, quantity: (s.quantity || 0) + qtyToAdd } : s
        );

        updated[idx] = { ...exists, selections: newSelections };
        return updated;
      }

      // Caso: producto simple
      updated[idx] = {
        ...exists,
        quantity: (exists.quantity || 0) + qtyToAdd,
      };

      return updated;
    }

    // Nuevo item con variants -> crear selections (soporta v.name o v.label)
    if (product.variants && product.variants.length > 0) {
      const selections = product.variants.map((v) => ({
        label: v.name ?? v.label ?? "Sin nombre",
        price: v.price ?? 0,
        stock: v.stock ?? null,
        quantity: 0,
      }));

      const indexToSet = normalized.selectedVariantIndex ?? 0;
      if (selections[indexToSet]) selections[indexToSet].quantity = qtyToAdd;

      const item = {
        id: normalized.id,
        name: normalized.name,
        image: normalized.image,
        selections,
      };

      return [...prev, item];
    }

    // Nuevo item simple
    return [
      ...prev,
      {
        id: normalized.id,
        name: normalized.name,
        image: normalized.image,
        price: normalized.price,
        stock: normalized.stock,
        quantity: qtyToAdd,
      },
    ]; 
  });
};

  // ====================
  // UPDATE QUANTITY NORMAL
  // ====================
  const updateQuantity = (id, newQty) => {
    setCartItems((prev) =>
      prev
        .map((p) =>
          p.id === id
            ? { ...p, quantity: Math.max(0, newQty) }
            : p
        )
        .filter((p) =>
          p.selections ? true : (p.quantity ?? 0) > 0
        )
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
        return acc + item.selections.reduce(
          (s, v) => s + (v.quantity || 0),
          0
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
        return acc + item.selections.reduce(
          (s, v) => s + (v.price || 0) * (v.quantity || 0),
          0
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
