// CartSidebar.jsx
// Componente del sidebar del carrito — maneja items, variantes, envíos y finalización.

import React, { useEffect, useMemo, useState } from "react";
import "./CartSidebar.css";
import { useCart } from "../../context/CartContext";

export default function CartSidebar({
  isOpen,
  onClose,
  shippingConfig = { defaultShipping: 0 },
  companyPhone = "5493534187071",
}) {
  // Datos y funciones del carrito desde el contexto global
  const {
    cartItems,
    updateQuantity,
    updateVariantQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subTotal,
  } = useCart();

  // Estados locales
  const [envioSeleccionado, setEnvioSeleccionado] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Datos del cliente
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Costo de envío simple (sin zonas)
  const costoEnvio = envioSeleccionado ? shippingConfig.defaultShipping || 0 : 0;

  // Total final
  const total = subTotal + costoEnvio;

  // ----- Variantes -----
  const handleVariantInc = (itemId, idx) => {
    const item = cartItems.find((c) => c.id === itemId);
    if (!item) return;
    const current = item.selections[idx].quantity || 0;
    const max = item.selections[idx].stock ?? 9999;
    if (current < max) updateVariantQuantity(itemId, idx, current + 1);
  };

  const handleVariantDec = (itemId, idx) => {
    const item = cartItems.find((c) => c.id === itemId);
    if (!item) return;
    const current = item.selections[idx].quantity || 0;
    if (current > 0) updateVariantQuantity(itemId, idx, current - 1);
  };

  // ----- FINALIZAR PEDIDO -----
  const handleFinalize = () => {
    if (totalItems === 0) {
      alert("No hay unidades en el carrito.");
      return;
    }

    // Validaciones de cliente si hay envío
    if (envioSeleccionado) {
      if (!customerName.trim()) return alert("Ingrese su nombre completo.");
      if (!customerPhone.trim()) return alert("Ingrese su teléfono.");
      if (!customerLocation.trim())
        return alert("Pegue su ubicación de Google Maps.");
    }

    const code = `ORD-${Date.now()}`;

    // Armar texto para WhatsApp
    let text = `Pedido *${code}*\n\nProductos:\n`;

    cartItems.forEach((it) => {
      if (it.selections) {
        it.selections.forEach((s) => {
          if (s.quantity && s.quantity > 0) {
            text += `- ${it.name} (${s.label}) x ${s.quantity} = $${(
              s.price * s.quantity
            ).toLocaleString()}\n`;
          }
        });
      } else {
        text += `- ${it.name} x ${it.quantity} = $${(
          (it.price || 0) * (it.quantity || 0)
        ).toLocaleString()}\n`;
      }
    });

    text += `\nSubtotal: $${subTotal.toLocaleString()}\n`;

    if (envioSeleccionado) {
      text += `Envío: $${costoEnvio.toLocaleString()}\n`;
      text += `\nDatos para entrega:\n`;
      text += `• Nombre: ${customerName}\n`;
      text += `• Teléfono: ${customerPhone}\n`;
      text += `• Ubicación: ${customerLocation}\n`;
    } else {
      text += `Retiro en persona: Sí\n`;
    }

    text += `\nTotal: $${total.toLocaleString()}\n`;
    text += `\nPor favor responder con el código de pedido: ${code}`;

    const waUrl = `https://api.whatsapp.com/send?phone=${companyPhone}&text=${encodeURIComponent(
      text
    )}`;

    // Countdown
    setIsFinalizing(true);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          window.open(waUrl, "_blank");
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
          <button className="back-btn" onClick={onClose}>
            ←
          </button>
          <h2>Mi carrito ({totalItems})</h2>
        </header>

        {/* ---------- LISTA DE PRODUCTOS ---------- */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío 🛒</p>
          ) : (
            cartItems.map((item) => {
              if (item.selections) {
                return (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} className="cart-item-img" />

                    <div className="cart-item-info">
                      <p>
                        <strong>{item.name}</strong>
                      </p>

                      <div className="variants-list">
                        {item.selections.map((s, idx) => {
                          const variantSubtotal =
                            (s.price || 0) * (s.quantity || 0);

                          return (
                            <div
                              key={`${item.id}-v-${idx}`}
                              className="variant-row"
                            >
                              <div className="item-controls-row">
                                <div className="left-controls">
                                  <div className="quantity-controls">
                                    <button
                                      onClick={() =>
                                        handleVariantDec(item.id, idx)
                                      }
                                    >
                                      −
                                    </button>
                                    <span className="count-label">
                                      {s.quantity || 0}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleVariantInc(item.id, idx)
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="right-price">
                                  ${s.price.toLocaleString()}
                                </div>
                              </div>

                              <div className="variant-info">
                                <p className="variant-label">{s.label}</p>
                                <p className="variant-subtotal">
                                  Subtotal: ${variantSubtotal.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              const price = item.price ?? 0;

              return (
                <div key={item.id} className="cart-item">
                  <img src={item.image} className="cart-item-img" />

                  <div className="cart-item-info">
                    <p>
                      <strong>{item.name}</strong>
                    </p>

                    <div className="item-controls-row">
                      <div className="left-controls">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          title="Eliminar producto"
                        >
                          🗑
                        </button>

                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, (item.quantity || 1) - 1)
                            }
                          >
                            -
                          </button>

                          <span className="count-label">{item.quantity}</span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, (item.quantity || 1) + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="right-price">
                        ${price.toLocaleString()}
                      </div>
                    </div>

                    <p className="item-subtotal">
                      Subtotal: $
                      {(price * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ---------- OPCIONES EXTRA ---------- */}
        {cartItems.length > 0 && (
          <>
            <button
              className="clear-cart"
              onClick={() => confirm("¿Vaciar carrito?") && clearCart()}
            >
              🗑 Vaciar carrito
            </button>

            <div className="shipping-options">
              <p>Selecciona una opción</p>

              <div className="option-buttons">
                <button
                  className={!envioSeleccionado ? "selected" : ""}
                  onClick={() => setEnvioSeleccionado(false)}
                >
                  Retiro en persona
                </button>

                <button
                  className={envioSeleccionado ? "selected" : ""}
                  onClick={() => setEnvioSeleccionado(true)}
                >
                  Solicito envío
                </button>
              </div>

              {envioSeleccionado && (
                <div className="customer-info">
                  <div className="customer-field">
                    <label>Nombre completo</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  <div className="customer-field">
                    <label>Teléfono celular</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ej: 3512345678"
                    />
                  </div>

                  <div className="customer-field">
                    <label>Ubicación (pegar link de Google Maps)</label>
                    <input
                      type="text"
                      value={customerLocation}
                      onChange={(e) => setCustomerLocation(e.target.value)}
                      placeholder="https://maps.app.goo.gl/xxxx"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="cart-summary">
              <p>
                Sub Total <span>${subTotal.toLocaleString()}</span>
              </p>
              <p>
                Envío <span>${costoEnvio.toLocaleString()}</span>
              </p>
              <hr />
              <p className="total">
                Total <span>${total.toLocaleString()}</span>
              </p>
            </div>

            <button className="checkout-btn" onClick={handleFinalize}>
              Finalizar Compra
            </button>
          </>
        )}

        {/* Pantalla de "gracias" */}
        {isFinalizing && (
          <div className="finalizing">
            <p>Gracias por su compra. Redirigiendo a WhatsApp en {countdown}...</p>
          </div>
        )}
      </aside>
    </div>
  );
}
