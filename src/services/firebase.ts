import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAKNj7aKFT20iXGRkebrvw2i9tzeC1SCeY",
  authDomain: "home-inventory-e8de9.firebaseapp.com",
  projectId: "home-inventory-e8de9",
  storageBucket: "home-inventory-e8de9.firebasestorage.app",
  messagingSenderId: "374992298143",
  appId: "1:374992298143:web:46096a93d9654d837142aa",
  measurementId: "G-49JTHHLVT4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 인증 지속성을 명시적으로 설정
setPersistence(auth, browserLocalPersistence).catch(console.error);
