import React, { useState } from "react";
import ItemCount from "./ItemCount";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

// Mensajes
import { useMessage } from "../hooks/useMessage";
import Message from "../components/Message/Message";

export default function ItemDetail({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(0);
  const [added, setAdded] = useState(false);

  const { message, showMessage } = useMessage();

  // --- Variantes ---
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState(
    hasVariants ? product.variants[0] : null
  );

  function handleAddToCart(units) {
    setQty(units);

    addToCart({
      ...product,
      quantity: units,
      variant: selectedVariant ? selectedVariant.name : null,
      price: selectedVariant ? selectedVariant.price : product.price
    });

    setAdded(true);
    showMessage("Producto agregado al carrito", "success");
  }

  return (
    <>
      <article className="item-detail" style={{ border: "1px solid #ddd", padding: 16, maxWidth: 700 }}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>

        {/* Selector de variantes */}
        {hasVariants && (
          <div style={{ marginBottom: 12 }}>
            <label><strong>Variante:</strong></label>
            <select
              style={{ marginLeft: 10 }}
              value={selectedVariant.name}
              onChange={(e) =>
                setSelectedVariant(
                  product.variants.find(v => v.name === e.target.value)
                )
              }
            >
              {product.variants.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name} - ${v.price}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Precio dinámico */}
        <p>
          <strong>Precio:</strong> $
          {selectedVariant ? selectedVariant.price : product.price}
        </p>

        {!added ? (
          <ItemCount stock={10} initial={1} onAdd={handleAddToCart} />
        ) : (
          <Link to="/cart">
            <button style={{ marginTop: 12 }}>Terminar compra</button>
          </Link>
        )}

        {qty > 0 && (
          <p style={{ marginTop: 10 }}>
            Agregaste <strong>{qty}</strong> al carrito.
          </p>
        )}
      </article>

      {message && <Message type={message.type} text={message.text} />}
    </>
  );
}
 
