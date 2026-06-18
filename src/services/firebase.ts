import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyClps_bFWTVqMTPK8blj0H7vYPZyKln7gw",
  authDomain: "gemini-inventory-e8054.firebaseapp.com",
  projectId: "gemini-inventory-e8054",
  storageBucket: "gemini-inventory-e8054.firebasestorage.app",
  messagingSenderId: "695381476691",
  appId: "1:695381476691:web:11d46166ad2ccc9744cda6",
  measurementId: "G-N9WEG0T44B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});
