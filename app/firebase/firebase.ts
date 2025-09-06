import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: 'AIzaSyAnNGNOjL4Q4F2mFjMYvkI5tjiVklsVTek',
  authDomain: 'mva-project-6c4da.firebaseapp.com',
  projectId: 'mva-project-6c4da',
  storageBucket: 'mva-project-6c4da.firebasestorage.app',
  messagingSenderId: '358314082429',
  appId: '1:358314082429:web:470d592e7fc7243fd5f114',
  measurementId: 'G-CC9RST6B6Y',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signInWithEmailPassword = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      alert(err.message);
    } else {
      console.error('Unknown error', err);
      alert('An error occurred');
    }
  }
};

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      alert(err.message);
    } else {
      console.error('Unknown error', err);
      alert('An error occurred');
    }
  }
};

const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset link sent!');
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      alert(err.message);
    } else {
      console.error('Unknown error', err);
      alert('An error occurred');
    }
  }
};

const logout = (): void => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithEmailPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
