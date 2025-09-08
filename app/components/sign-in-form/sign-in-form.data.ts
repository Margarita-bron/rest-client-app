export const SIGN_IN_FORM_DATA = {
  email: {
    type: 'email' as const,
    'data-testid': 'sign-in-email',
    className:
      'w-full px-3 py-2 rounded-lg mb-1 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500',
  },
  password: {
    type: 'password' as const,
    'data-testid': 'sign-in-password',
    className:
      'w-full px-3 py-2 rounded-lg mb-1 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500',
  },
  submit: {
    type: 'submit' as const,
    'data-testid': 'sign-in-submit',
    className:
      'w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium',
  },
};
