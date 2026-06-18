import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
