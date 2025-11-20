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

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : { name: "Sin Variante", price: product.price }
  );

  const { message, showMessage } = useMessage();

  function handleAddToCart(units) {
    setQty(units);

    addToCart({
      ...product,
      quantity: units,
      variant: selectedVariant.name,
      price: selectedVariant.price
    });

    setAdded(true);
    showMessage("Producto agregado al carrito", "success");
  }

  return (
    <>
      <article className="item-detail" style={{ border: "1px solid #ddd", padding: 16, maxWidth: 700 }}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>

        {/* SELECTOR DE VARIANTES */}
        {product.variants && product.variants.length > 0 ? (
          <div style={{ marginBottom: 12 }}>
            <label><strong>Variante:</strong></label>
            <select
              style={{ marginLeft: 8 }}
              value={selectedVariant.name}
              onChange={(e) => {
                const variant = product.variants.find(v => v.name === e.target.value);
                setSelectedVariant(variant);
              }}
            >
              {product.variants.map((v, i) => (
                <option key={i} value={v.name}>
                  {v.name} (${v.price})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p><strong>Variante:</strong> Sin variante</p>
        )}

        <p><strong>Precio:</strong> ${selectedVariant.price}</p>

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
