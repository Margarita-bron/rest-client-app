import { initializeApp } from 'firebase/app';
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
import {
  showAuthErrorNotification,
  showAuthInfoNotification,
} from '~/errors/auth-error-notification';

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
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Полный объект ошибки, полученный в catch:',
        JSON.stringify(error, null, 2)
      );
      showAuthErrorNotification(error);
      alert(error.message);
    } else {
      showAuthErrorNotification(error);
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
    const user: User = res.user;

    if (user) {
      await updateProfile(user, {
        displayName: name,
      });
    }
    await user.reload();
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      authProvider: 'local',
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Полный объект ошибки, полученный в catch:',
        JSON.stringify(error, null, 2)
      );
      showAuthErrorNotification(error);
      alert(error.message);
    } else {
      showAuthErrorNotification(error);
    }
  }
};

const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    showAuthInfoNotification('Password reset link sent to email!');
  } catch (error) {
    if (error instanceof Error) {
      showAuthErrorNotification(error);
      alert(error.message);
    } else {
      showAuthErrorNotification(error);
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
