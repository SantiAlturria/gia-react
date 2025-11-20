// src/services/orders.js
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function createOrder(orderData) {
  const ordersRef = collection(db, "orders");
  const response = await addDoc(ordersRef, orderData);
  return response.id;
}
