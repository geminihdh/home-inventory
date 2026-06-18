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
let isRedirectProcessed = false;
export const handleRedirect = async () => {
  if (isRedirectProcessed) return;
  try {
    await getRedirectResult(auth);
    isRedirectProcessed = true;
    console.log("Redirect result processed");
  } catch (error) {
    console.error("Auth redirect error:", error);
  }
};

export const signInWithGoogle = () => signInWithRedirect(auth, provider);
export const logout = () => signOut(auth);
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    console.log("onAuthStateChanged triggered. User UID:", user ? user.uid : "null");
    callback(user);
  });
};
