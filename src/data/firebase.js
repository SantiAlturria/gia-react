import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import { db } from "../data/firebaseConfig";

export async function fetchAllProducts() {
  const ref = collection(db, "productos");
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function fetchProductsByCategory(categoryId) {
  const ref = collection(db, "productos");
  const q = query(ref, where("category", "==", categoryId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function fetchProductById(id) {
  const ref = doc(db, "productos", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("Producto no encontrado");

  return {
    id: snap.id,
    ...snap.data(),
  };
}
 