import { z } from 'zod';
//TODO - instead of strings use i18n when add translate
const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/\p{L}/u, { message: 'Password must contain at least one letter' })
  .regex(/\d/, { message: 'Password must contain at least one number' })
  .regex(/[^\p{L}\d]/u, {
    message: 'Password must contain at least one special character',
  });

export const signInSchema = z.object({
  email: z
    .string()
    .email('Enter a valid email address')
    .nonempty('Email is required'),
  password: passwordSchema,
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .regex(/^[\p{L} '-]+$/u, {
      message:
        'Name can only contain letters, spaces, apostrophes, and hyphens',
    })
    .nonempty('Name is required'),
  email: z
    .string()
    .email('Enter a valid email address')
    .nonempty('Email is required'),
  password: passwordSchema,
});

export const resetSchema = z.object({
  email: z
    .string()
    .email('Enter a valid email address')
    .nonempty('Email is required'),
});
