// CartSidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./CartSidebar.css";

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems = [],
  updateQuantity,
  clearCart,
  shippingConfig = { zones: [], defaultShipping: 0 }, // pasar desde padre o cargar desde Firebase
  companyPhone = "549XXXXXXXXX", // reemplazar por su número
}) {
  const [envioSeleccionado, setEnvioSeleccionado] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // ESC para cerrar
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Totales calculados desde cartItems
  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, it) => {
      const price = it.variant?.price ?? it.price ?? 0;
      return acc + price * (it.quantity || 1);
    }, 0);
  }, [cartItems]);

  // Buscar costo de zona seleccionada
  const selectedZone = useMemo(() => {
    return shippingConfig.zones.find((z) => z.id === selectedZoneId) ?? null;
  }, [shippingConfig.zones, selectedZoneId]);

  const costoEnvio = envioSeleccionado ? (selectedZone ? selectedZone.cost : shippingConfig.defaultShipping || 0) : 0;
  const total = subTotal + costoEnvio;

  // Genera código de pedido
  const generateOrderCode = () => {
    const d = new Date();
    const YY = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const DD = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    return `ORD-${YY}${MM}${DD}-${hh}${mm}${ss}-${rand}`;
  };

  // Armado del mensaje para WhatsApp
  const buildWhatsAppMessage = (orderCode) => {
    let text = `Pedido *${orderCode}*\n\nProductos:\n`;
    cartItems.forEach((it, idx) => {
      const price = it.variant?.price ?? it.price ?? 0;
      const variantLabel = it.variant?.label ? ` (${it.variant.label})` : "";
      text += `${idx + 1}. ${it.name}${variantLabel}\n   Cant: ${it.quantity} x $${price.toLocaleString()} = $${(price * it.quantity).toLocaleString()}\n`;
    });
    text += `\nSubtotal: $${subTotal.toLocaleString()}\n`;
    if (envioSeleccionado) {
      text += `Envío: $${costoEnvio.toLocaleString()} (${selectedZone ? selectedZone.label : "Zona no seleccionada"})\n`;
    } else {
      text += `Retiro en persona: Sí\n`;
    }
    text += `Total: $${total.toLocaleString()}\n\n`;
    if (envioSeleccionado) {
      text += `Ubicación: ${selectedZone ? selectedZone.label : "Sin zona seleccionada"}\n\n`;
    }
    text += `Observaciones: \n`; // espacio para que cliente agregue si luego lo desea
    text += `\nPor favor responder con el código de pedido: ${orderCode}`;
    return encodeURIComponent(text);
  };

  // Finalizar compra: abre whatsapp con el mensaje y limpia carrito (opcional guardar orden en Firestore)
  const handleFinalize = () => {
    // Validaciones mínimas
    if (cartItems.length === 0) return;
    if (envioSeleccionado && !selectedZone) {
      alert("Seleccione la ubicación/zona de envío.");
      return;
    }

    const code = generateOrderCode();
    const waText = buildWhatsAppMessage(code);
    setIsFinalizing(true);
    setCountdown(3);

    // Cuenta regresiva visual
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          // redirige a whatsapp
          const url = `https://api.whatsapp.com/send?phone=${companyPhone}&text=${waText}`;
          window.open(url, "_blank");
          // limpiar carrito
          clearCart();
          setIsFinalizing(false);
          onClose();
        }
        return c - 1;
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-sidebar-overlay" onClick={onClose}>
      <aside className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <header className="cart-header">
          <button className="back-btn" onClick={onClose}>←</button>
          <h2>Mi carrito</h2>
        </header>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío 🛒</p>
          ) : (
            cartItems.map((item) => {
              const price = item.variant?.price ?? item.price ?? 0;
              return (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <p><strong>{item.name}</strong></p>
                    {item.variant && <p className="variant-label">{item.variant.label}</p>}
                    <p>${price.toLocaleString()}</p>
                    <div className="quantity-controls">
                      <button onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => {
                        const max = item.stock ?? 9999;
                        if (item.quantity < max) updateQuantity(item.id, item.quantity + 1);
                      }}>+</button>
                    </div>
                    <p className="item-subtotal">Subtotal: ${ (price * item.quantity).toLocaleString() }</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            <button className="clear-cart" onClick={() => {
              if (confirm("¿Vaciar carrito?")) clearCart();
            }}>🗑 Vaciar carrito</button>

            <div className="shipping-options">
              <p>Selecciona una opción</p>
              <div className="option-buttons">
                <button className={!envioSeleccionado ? "selected" : ""} onClick={() => { setEnvioSeleccionado(false); setSelectedZoneId(null); }}>
                  Retiro en persona
                </button>
                <button className={envioSeleccionado ? "selected" : ""} onClick={() => setEnvioSeleccionado(true)}>
                  Solicito envío
                </button>
              </div>

              {envioSeleccionado && (
                <div style={{ marginTop: 8 }}>
                  <label>Elija su ubicación / zona</label>
                  <select value={selectedZoneId ?? ""} onChange={(e) => setSelectedZoneId(e.target.value)}>
                    <option value="">-- Seleccione zona --</option>
                    {shippingConfig.zones.map((z) => (
                      <option key={z.id} value={z.id}>{z.label} — $ {z.cost.toLocaleString()} — ETA: {z.eta ?? "-"}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="cart-summary">
              <p>Sub Total <span>${subTotal.toLocaleString()}</span></p>
              <p>Envío <span>${costoEnvio.toLocaleString()}</span></p>
              <hr />
              <p className="total">Total <span>${total.toLocaleString()}</span></p>
            </div>

            <button className="checkout-btn" onClick={handleFinalize}>Finalizar Compra</button>
          </>
        )}

        {isFinalizing && (
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <p>Gracias por su compra. Redirigiendo a WhatsApp en {countdown}...</p>
          </div>
        )}
      </aside>
    </div>
  );
}
