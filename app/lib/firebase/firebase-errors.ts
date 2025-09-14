export const FirebaseAuthErrorMessages: Record<
  string,
  { message: string; action: string }
> = {
  'auth/invalid-credential': {
    message: 'Invalid login credentials.',
    action: 'Please check your email and password and try again.',
  },
  'auth/email-already-in-use': {
    message: 'An account with this email already exists.',
    action: 'Try logging in or use a different email.',
  },
  'auth/user-disabled': {
    message: 'The user account has been disabled.',
    action: 'Contact support to reactivate your account.',
  },
  'auth/user-not-found': {
    message: 'No user found with this email.',
    action: 'Please check your email or sign up if you don’t have an account.',
  },
  'auth/wrong-password': {
    message: 'Incorrect password.',
    action: 'Try entering your password again or reset your password.',
  },
  'auth/too-many-requests': {
    message: 'Too many unsuccessful login attempts.',
    action: 'Please wait a few minutes before trying again.',
  },
  'auth/network-request-failed': {
    message: 'Network error occurred.',
    action: 'Check your internet connection and try again.',
  },
  'auth/account-exists-with-different-credential': {
    message:
      'An account already exists with the same email using different sign-in credentials.',
    action: 'Sign in using the original provider or reset your password.',
  },
  'auth/requires-recent-login': {
    message: 'Please re-authenticate to perform this operation.',
    action: 'Log in again to confirm your identity.',
  },

  'auth/expired-action-code': {
    message: 'The password reset link has expired.',
    action: 'Request a new password reset email.',
  },
  'auth/invalid-action-code': {
    message: 'The password reset link is invalid.',
    action: 'Request a new password reset email.',
  },

  'auth/argument-error': {
    message: 'Invalid arguments provided to Firebase Authentication.',
    action: 'Please check your input and try again.',
  },
  'auth/internal-error': {
    message: 'An internal error occurred on Firebase servers.',
    action: 'Please try again later or contact support.',
  },
};
