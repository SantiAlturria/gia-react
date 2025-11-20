// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../data/orders";

export default function Checkout() {
  const { cartItems, subTotal, clearCart } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [sending, setSending] = useState(false);

  async function handleFinishPurchase() {
    setSending(true);

    // Datos completos de la orden
    const order = {
      items: cartItems,
      total: subTotal,
      buyer: {
        name: "Cliente",
        email: "cliente@example.com"
      }
    };

    try {
      // createOrder agrega serverTimestamp() adentro
      const id = await createOrder(order);
      setOrderId(id);

      clearCart();
    } catch (error) {
      console.error("Error al crear orden:", error);
    } finally {
      setSending(false);
    }
  }

  // Mensaje de éxito
  if (orderId) {
    return (
      <main style={{ padding: 20 }}>
        <h2>Compra realizada correctamente</h2>
        <p>ID de la orden: <strong>{orderId}</strong></p>
      </main>
    );
  }

  // Vista principal
  return (
    <main style={{ padding: 20 }}>
      <h2>Checkout</h2>

      <button onClick={handleFinishPurchase} disabled={sending}>
        {sending ? "Procesando..." : "Finalizar compra"}
      </button>
    </main>
  );
}
