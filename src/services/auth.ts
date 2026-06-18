import { auth } from './firebase';
import { 
  GoogleAuthProvider, 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged, 
  getRedirectResult 
} from 'firebase/auth';
import type { User } from 'firebase/auth';

const provider = new GoogleAuthProvider();

// 리디렉션 결과를 처리하는 함수
export const handleRedirect = async () => {
  try {
    await getRedirectResult(auth);
    console.log("Redirect result processed");
  } catch (error) {
    console.error("Auth redirect error:", error);
  }
};

export const signInWithGoogle = () => signInWithRedirect(auth, provider);
export const logout = () => signOut(auth);
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
