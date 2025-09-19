import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyAnNGNOjL4Q4F2mFjMYvkI5tjiVklsVTek',
  authDomain: 'mva-project-6c4da.firebaseapp.com',
  projectId: 'mva-project-6c4da',
  storageBucket: 'mva-project-6c4da.firebasestorage.app',
  messagingSenderId: '358314082429',
  appId: '1:358314082429:web:470d592e7fc7243fd5f114',
  measurementId: 'G-CC9RST6B6Y',
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();

export const signInWithEmailPasswordFn = async (
  email: string,
  password: string
) => signInWithEmailAndPassword(auth, email, password);

export const registerWithEmailAndPasswordFn = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user: User = res.user;

  if (user) {
    await updateProfile(user, { displayName: name });
    await user.reload();
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      authProvider: 'local',
    });
  }
};

export const sendPasswordResetFn = (email: string) =>
  sendPasswordResetEmail(auth, email);

export const logoutFn = () => signOut(auth);
