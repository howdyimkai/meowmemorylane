import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "[YOUR_API_KEY]", // You'll need to replace this with your actual API key
  authDomain: "meowmemorylane.firebaseapp.com",
  projectId: "meowmemorylane",
  storageBucket: "meowmemorylane.firebasestorage.app",
  messagingSenderId: "99821269249",
  appId: "1:99821269249:web:cac0d0a77be88485deab00",
  measurementId: "G-24G3F8NJJD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
