import { auth } from './firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged,
  getRedirectResult 
} from 'firebase/auth';
import type { User } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export { getRedirectResult };

export const signInWithGoogle = async () => {
  try {
    console.log("Attempting sign-in with popup...");
    const result = await signInWithPopup(auth, provider);
    console.log("Popup sign-in successful:", result.user.email);
    return result;
  } catch (popupError: unknown) {
    console.warn("Popup sign-in failed or blocked, falling back to redirect. Error:", popupError);
    try {
      console.log("Attempting sign-in fallback with redirect...");
      await signInWithRedirect(auth, provider);
    } catch (redirectError) {
      console.error("Redirect sign-in fallback also failed:", redirectError);
      throw redirectError;
    }
  }
};

export const logout = () => signOut(auth);
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
