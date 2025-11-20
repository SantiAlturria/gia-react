// CartSidebar.jsx — Sidebar del carrito — Maneja productos, envío y finalización.
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [countdown, setCountdown] = useState(0);
  const countdownIntervalRef = useRef(null);
  const [waUrl, setWaUrl] = useState(null);

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

  // Costo de envío y total
  const costoEnvio = envioSeleccionado ? shippingConfig.defaultShipping || 0 : 0;
  const total = subTotal + costoEnvio;

  // Handlers variantes
  const handleVariantInc = (itemId, idx) => {
    const item = cartItems.find((c) => c.id === itemId);
    if (!item || !item.selections) return;
    const current = item.selections[idx]?.quantity || 0;
    const max = item.selections[idx]?.stock ?? 9999;
    if (current < max) updateVariantQuantity(itemId, idx, current + 1);
  };

  const handleVariantDec = (itemId, idx) => {
    const item = cartItems.find((c) => c.id === itemId);
    if (!item || !item.selections) return;
    const current = item.selections[idx]?.quantity || 0;
    if (current > 0) updateVariantQuantity(itemId, idx, current - 1);
  };

  // Validaciones y armado del texto para WhatsApp
  const buildWhatsAppText = (code) => {
    const productsText = cartItems
      .map((item) => {
        if (Array.isArray(item.selections)) {
          return item.selections
            .filter((s) => (s.quantity || 0) > 0)
            .map(
              (s) =>
                `• ${item.name}${s.label ? ` - ${s.label}` : ""}\n  Cantidad: ${s.quantity}\n  Precio: $${(
                  s.price || 0
                ).toLocaleString()}`
            )
            .join("\n");
        }
        return `• ${item.name}\n  Cantidad: ${item.quantity || 0}\n  Precio: $${(
          item.price || 0
        ).toLocaleString()}`;
      })
      .join("\n");

    let text = `🛍️ *Nuevo pedido recibido*\nCódigo: *${code}*\n\n📦 *Productos:*\n${productsText}\n\n💰 *Subtotal:* $${subTotal.toLocaleString()}\n🚚 *Envío:* $${costoEnvio.toLocaleString()}\n🧾 *Total:* *$${total.toLocaleString()}*\n`;

    if (envioSeleccionado) {
      text += `\n📍 *Datos de entrega:*\n• Nombre: ${customerName}\n• Teléfono: ${customerPhone}\n• Dirección: ${customerAddress}\n• Descripción: ${customerDescription}\n`;
    } else {
      text += `\n🏪 Retiro en local\n`;
    }

    text += `\n💰 Método de pago: ${paymentMethod}\n\n✔️ *Responder con el código:* ${code}`;
    return text;
  };

  // Inicia el proceso de finalizar: valida y prepara la URL
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
    const text = buildWhatsAppText(code);
    const url = `https://api.whatsapp.com/send?phone=${companyPhone}&text=${encodeURIComponent(
      text
    )}`;

    // Configuramos finalización controlada por efectos
    setWaUrl(url);
    setCountdown(3);
    setIsFinalizing(true);
  };

  // Efecto que maneja el countdown y la acción final cuando llega a 0
  useEffect(() => {
    if (!isFinalizing) {
      // Si no está finalizando, limpiar intervalos si hubieran quedado
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      return;
    }

    // Si ya hay un intervalo en marcha, no crear otro
    if (countdownIntervalRef.current) return;

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [isFinalizing]);

  // Acción que sucede cuando countdown llega a 0
  useEffect(() => {
    if (!isFinalizing) return;
    if (countdown > 0) return;

    // Cleanup del intervalo
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Ejecutar las acciones fuera del render
    if (waUrl) {
      try {
        window.open(waUrl, "_blank");
      } catch (e) {
        console.error("No se pudo abrir WhatsApp:", e);
      }
    }

    // Limpiar carrito y cerrar panel
    clearCart();
    setIsFinalizing(false);
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, isFinalizing, waUrl]); // waUrl incluido para garantizar disponibilidad

  if (!isOpen) return null;

  return (
    <div className="cart-sidebar-overlay" onClick={onClose}>
      <aside className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <header className="cart-header">
          <button className="back-btn" onClick={onClose} aria-label="Cerrar carrito">
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
                    <img src={item.image} alt={item.name} className="cart-item-img" />

                    <div className="cart-item-info">
                      <p>
                        <strong>{item.name}</strong>
                      </p>

                      <div className="variants-list">
                        {item.selections.map((s, idx) => {
                          const variantSubtotal = (s.price || 0) * (s.quantity || 0);

                          return (
                            <div key={`${item.id}-v-${idx}`} className="variant-row">
                              <div className="item-controls-row">
                                <div className="left-controls">
                                  <div className="quantity-controls">
                                    <button
                                      onClick={() => handleVariantDec(item.id, idx)}
                                      aria-label={`Disminuir variante ${idx}`}
                                    >
                                      −
                                    </button>
                                    <span className="count-label">{s.quantity || 0}</span>
                                    <button
                                      onClick={() => handleVariantInc(item.id, idx)}
                                      aria-label={`Aumentar variante ${idx}`}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="right-price">${(s.price || 0).toLocaleString()}</div>
                              </div>

                              <div className="variant-info">
                                <p className="variant-label">
                                  Variante: <strong>{s.label ?? "Sin variante"}</strong>
                                </p>
                                <p className="variant-subtotal">Subtotal: ${variantSubtotal.toLocaleString()}</p>
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
                  <img src={item.image} alt={item.name} className="cart-item-img" />

                  <div className="cart-item-info">
                    <p>
                      <strong>{item.name}</strong>
                    </p>

                    <div className="item-controls-row">
                      <div className="left-controls">
                        <button onClick={() => removeFromCart(item.id)} title="Eliminar producto">
                          🗑
                        </button>

                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, Math.max(0, (item.quantity || 1) - 1))
                            }
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>

                          <span className="count-label">{item.quantity || 0}</span>

                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 0) + 1)}
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="right-price">${price.toLocaleString()}</div>
                    </div>

                    <p className="item-subtotal">
                      Subtotal: ${(price * (item.quantity || 0)).toLocaleString()}
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
          disabled={cartItems.length === 0}
        >
          🗑 Vaciar carrito
        </button>

        <div className="shipping-options">
          <p>Selecciona una opción</p>

          <div className="option-buttons">
            <button className={!envioSeleccionado ? "selected" : ""} onClick={() => setEnvioSeleccionado(false)}>
              Retiro en persona
            </button>

            <button className={envioSeleccionado ? "selected" : ""} onClick={() => setEnvioSeleccionado(true)}>
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

            <button className={paymentMethod === "efectivo" ? "selected" : ""} onClick={() => setPaymentMethod("efectivo")}>
              Efectivo
            </button>
          </div>
        </div>

        {/* ---------- OPCIONES EXTRA ---------- */}
        {cartItems.length > 0 && (
          <>
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

              <button className="checkout-btn" onClick={handleFinalize} disabled={isFinalizing}>
                {isFinalizing ? `Redirigiendo... (${countdown})` : "Finalizar Compra"}
              </button>
            </div>
          </>
        )}

        {isFinalizing && (
          <div className="finalizing">
            <p>Gracias por su compra. Redirigiendo a WhatsApp en {countdown}...</p>
          </div>
        )}
      </aside>
    </div>
  );
}
