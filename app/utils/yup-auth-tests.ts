import * as yup from 'yup';

const passwordSchema = yup
  .string()
  .required('Password is required')
  .test('has-letter', 'Password must contain at least one letter', (value) =>
    /\p{L}/u.test(value)
  )
  .test('has-number', 'Password must contain at least one number', (value) =>
    /\d/.test(value)
  )
  .test(
    'has-special-char',
    'Password must contain at least one special character',
    (value) => /[^\p{L}\d]/u.test(value)
  )
  .min(8, 'Password must be at least 8 characters long');

export const singInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: passwordSchema,
});

export const singUpSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .matches(
      /^[\p{L} '-]+$/u,
      'Name can only contain letters, spaces, apostrophes, and hyphens'
    )
    .required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: passwordSchema,
});
