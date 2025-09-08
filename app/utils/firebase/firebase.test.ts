import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firebaseAuth from 'firebase/auth';
import * as firestore from 'firebase/firestore';

import {
  registerWithEmailAndPassword,
  signInWithEmailPassword,
  sendPasswordReset,
  logout,
} from './firebase';

vi.mock('firebase/auth', async () => {
  return {
    getAuth: vi.fn(() => ({})),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    signOut: vi.fn(),
    updateProfile: vi.fn(),
  };
});

vi.mock('firebase/firestore', async () => {
  return {
    getFirestore: vi.fn(() => ({})),
    setDoc: vi.fn(),
    doc: vi.fn(() => ({})),
  };
});

describe('Firebase auth util functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registerWithEmailAndPassword should call createUserWithEmailAndPassword, updateProfile and setDoc', async () => {
    const mockUser = { uid: 'abc123' };
    const mockRes = { user: mockUser };

    (
      firebaseAuth.createUserWithEmailAndPassword as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockRes);
    (firebaseAuth.updateProfile as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined
    );
    (firestore.setDoc as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    await registerWithEmailAndPassword(
      'Test User',
      'test@example.com',
      'password123'
    );

    expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      'test@example.com',
      'password123'
    );
    expect(firebaseAuth.updateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: 'Test User',
    });
    expect(firestore.setDoc).toHaveBeenCalledWith(expect.any(Object), {
      name: 'Test User',
      email: 'test@example.com',
      authProvider: 'local',
    });
  });

  it('signInWithEmailPassword should call signInWithEmailAndPassword', async () => {
    (
      firebaseAuth.signInWithEmailAndPassword as ReturnType<typeof vi.fn>
    ).mockResolvedValue(undefined);

    await signInWithEmailPassword('test@example.com', 'password123');

    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      'test@example.com',
      'password123'
    );
  });

  it('sendPasswordReset should call sendPasswordResetEmail', async () => {
    (
      firebaseAuth.sendPasswordResetEmail as ReturnType<typeof vi.fn>
    ).mockResolvedValue(undefined);

    await sendPasswordReset('test@example.com');

    expect(firebaseAuth.sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.any(Object),
      'test@example.com'
    );
  });

  it('logout should call signOut', () => {
    (firebaseAuth.signOut as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined
    );

    logout();

    expect(firebaseAuth.signOut).toHaveBeenCalled();
  });
});
