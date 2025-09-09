export type UserFirestoreProfile = {
  name: string;
  email: string;
  authProvider: 'local' | 'google' | 'facebook';
};
