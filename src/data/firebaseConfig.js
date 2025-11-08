import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Proyecto //
const firebaseConfig = {
  apiKey: "AIzaSyBCM5oDyqyaeuAtsgCUQiGTNmJC6nCgX3c",
  authDomain: "rosquitas-donas.firebaseapp.com",
  projectId: "rosquitas-donas",
 storageBucket: "rosquitas-donas.appspot.com",
  messagingSenderId: "347235398107", 
  appId: "1:347235398107:web:75e59326fdcb54989cf7fe",
  measurementId: "G-WZVXBR65GK"
};

// Inicialización Firebase //
const app = initializeApp(firebaseConfig);

// Base de datos //
export const db = getFirestore(app);
