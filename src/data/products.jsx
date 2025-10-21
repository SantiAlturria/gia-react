export const products = [
  { id: "1", title: "Donut Clásica", price: 150, category: "donas", description: "Donut con glaseado clásico." },
  { id: "2", title: "Donut Chocolate", price: 200, category: "donas", description: "Con relleno y cobertura de chocolate." },
  { id: "3", title: "Rosquita Miel", price: 180, category: "rosquitas", description: "Rosquita con toque de miel." },
  { id: "4", title: "Promo Mix", price: 400, category: "combo", description: "Pack variado para compartir." }
];


export function fetchProducts(categoryId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (categoryId) {
        resolve(products.filter((p) => p.category === categoryId));
      } else {
        resolve(products);
      }
    }, 600); 
  });
}

export function fetchProductById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = products.find((p) => p.id === id);
      if (found) resolve(found);
      else reject(new Error("Producto no encontrado"));
    }, 600);
  });
}
