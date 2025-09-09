import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAnNGNOjL4Q4F2mFjMYvkI5tjiVklsVTek',
  authDomain: 'mva-project-6c4da.firebaseapp.com',
  projectId: 'mva-project-6c4da',
  storageBucket: 'mva-project-6c4da.firebasestorage.app',
  messagingSenderId: '358314082429',
  appId: '1:358314082429:web:470d592e7fc7243fd5f114',
  measurementId: 'G-CC9RST6B6Y',
};

import { getDoc, onSnapshot } from 'firebase/firestore';

// Функция для одноразового получения данных пользователя из Firestore
async function getCustomUserData(userId: string) {
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    console.log('Пользовательские данные из Firestore:', userDocSnap.data());
    return userDocSnap.data();
  } else {
    console.log('Документ пользователя в Firestore не найден.');
    return null;
  }
}

// Функция для получения данных пользователя в реальном времени из Firestore
function subscribeToCustomUserData(
  userId: string,
  callback: (data: any | null) => void
) {
  const userDocRef = doc(db, 'users', userId);
  const unsubscribe = onSnapshot(
    userDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null); // Пользовательский документ не существует
      }
    },
    (error) => {
      console.error('Ошибка при подписке на данные пользователя:', error);
      callback(null);
    }
  );

  return unsubscribe; // Возвращаем функцию для отписки
}

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

    if (user) {
      await updateProfile(user, {
        displayName: name,
      });
    }
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      authProvider: 'local',
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      alert(err.message);
    } else {
      console.error('Unknown error', err);
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
    } else {
      console.error('Unknown error', err);
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
