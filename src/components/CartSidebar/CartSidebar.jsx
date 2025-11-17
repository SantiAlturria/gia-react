// CartSidebar.jsx
// Sidebar del carrito — Maneja productos, envío y finalización.

import React, { useEffect, useMemo, useState } from "react";
import "./CartSidebar.css";
import { useCart } from "../../context/CartContext";

export default function CartSidebar({
  isOpen,
  onClose,
  shippingConfig = { defaultShipping: 0 },
  companyPhone = "5493534187071",
}) {
  const {
    cartItems,
    updateQuantity,
    updateVariantQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subTotal,
  } = useCart();

  const [envioSeleccionado, setEnvioSeleccionado] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Datos del cliente
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerDescription, setCustomerDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transferencia");

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Costo de envío
  const costoEnvio = envioSeleccionado
    ? shippingConfig.defaultShipping || 0
    : 0;
  const total = subTotal + costoEnvio;

  // ------- Variantes -------
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

  const handleFinalize = () => {
    if (totalItems === 0) return alert("No hay unidades en el carrito.");

    if (envioSeleccionado) {
      if (!customerName.trim()) return alert("Ingrese su nombre completo.");
      if (!customerPhone.trim()) return alert("Ingrese su teléfono.");
      if (!customerAddress.trim()) return alert("Ingrese su dirección.");
      if (!customerDescription.trim())
        return alert("Ingrese una descripción para la entrega.");
      if (customerDescription.length > 100)
        return alert("La descripción no puede superar 100 caracteres.");
    }

    const code = `ORD-${Date.now()}`;

    // ---------- MENSAJE BONITO ----------
    let text = `
🛍️ *Nuevo pedido recibido*
Código: *${code}*

📦 *Productos:*
${cartItems
  .map((item) => {
    // 🔹 Productos con variantes
    if (Array.isArray(item.selections)) {
      return item.selections
        .filter((s) => s.quantity > 0)
        .map(
          (s) => `
• ${item.name}${s.label ? ` - ${s.label}` : ""}
  Cantidad: ${s.quantity}
  Precio: $${(s.price || 0).toLocaleString()}
`
        )
        .join("");
    }

    // 🔹 Productos sin variantes
    return `
• ${item.name}
  Cantidad: ${item.quantity}
  Precio: $${(item.price || 0).toLocaleString()}
`;
  })
  .join("")}

💰 *Subtotal:* $${subTotal.toLocaleString()}
🚚 *Envío:* $${costoEnvio.toLocaleString()}
🧾 *Total:* *$${total.toLocaleString()}*
`;

    if (envioSeleccionado) {
      text += `
📍 *Datos de entrega:*
• Nombre: ${customerName}
• Teléfono: ${customerPhone}
• Dirección: ${customerAddress}
• Descripción: ${customerDescription}
`;
    } else {
      text += `\n🏪 Retiro en local\n`;
    }

    // 👉 AHORA SÍ: Método de pago correctamente agregado
    text += `\n💰 Método de pago: ${paymentMethod}`;

    text += `\n✔️ *Responder con el código:* ${code}`;

    const waUrl = `https://api.whatsapp.com/send?phone=${companyPhone}&text=${encodeURIComponent(
      text
    )}`;

    // ---------- Redirección con mini countdown ----------
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
                                <p className="variant-label">
                                  Variante:{" "}
                                  <strong>{s.label ?? "Sin variante"}</strong>
                                </p>
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
              {/* ... campos ... */}
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
                <label>Dirección (calle y número)</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Ej: Av. Siempre Viva 742"
                />
              </div>

              <div className="customer-field">
                <label>Descripción para la entrega (máx 100 caracteres)</label>
                <input
                  type="text"
                  maxLength={100}
                  value={customerDescription}
                  onChange={(e) => setCustomerDescription(e.target.value)}
                  placeholder="Casa blanca portón negro, timbre roto..."
                />
              </div>
            </div>
          )}
        </div>
        <div className="payment-options">
          <p>Método de pago</p>

          <div className="option-buttons">
            <button
              className={paymentMethod === "transferencia" ? "selected" : ""}
              onClick={() => setPaymentMethod("transferencia")}
            >
              Transferencia
            </button>

            <button
              className={paymentMethod === "efectivo" ? "selected" : ""}
              onClick={() => setPaymentMethod("efectivo")}
            >
              Efectivo
            </button>
          </div>
        </div>

        {/* ---------- OPCIONES EXTRA ---------- */}
        {cartItems.length > 0 && (
          <>
            {/* footer sticky que contiene todo lo necesario */}
            <div className="cart-footer">
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
            </div>
          </>
        )}

        {isFinalizing && (
          <div className="finalizing">
            <p>
              Gracias por su compra. Redirigiendo a WhatsApp en {countdown}...
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
