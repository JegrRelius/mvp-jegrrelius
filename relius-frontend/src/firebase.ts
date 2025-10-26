import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Añadimos esto

const firebaseConfig = {
  apiKey: "AIzaSyAfHrf1kHG_sQJrmMXTWYA8iv529Zxj49g",
  authDomain: "jegrrelius.firebaseapp.com",
  projectId: "jegrrelius",
  storageBucket: "jegrrelius.firebasestorage.app",
  messagingSenderId: "93729697907",
  appId: "1:93729697907:web:4658e7f08e53135627fa06"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app); // Añadimos y exportamos esto