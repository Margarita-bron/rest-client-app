import { z } from 'zod';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

export const useAuthSchemas = () => {
  const tSignIn = useTr('auth-validation.signIn');
  const tSignUp = useTr('auth-validation.signUp');
  const tReset = useTr('auth-validation.reset');

  const passwordSchema = z
    .string()
    .min(8, { message: tSignUp('passwordMin') })
    .regex(/\p{L}/u, { message: tSignUp('passwordLetter') })
    .regex(/\d/, { message: tSignUp('passwordNumber') })
    .regex(/[^\p{L}\d]/u, { message: tSignUp('passwordSpecial') });

  const signInSchema = z.object({
    email: z.email(tSignIn('emailInvalid')).nonempty(tSignIn('emailRequired')),
    password: passwordSchema,
  });

  const signUpSchema = z.object({
    name: z
      .string()
      .min(2, { message: tSignUp('nameMin') })
      .regex(/^[\p{L} '-]+$/u, { message: tSignUp('nameInvalid') })
      .nonempty(tSignUp('nameRequired')),
    email: z.email(tSignUp('emailInvalid')).nonempty(tSignUp('emailRequired')),
    password: passwordSchema,
  });

  const resetSchema = z.object({
    email: z.email(tReset('emailInvalid')).nonempty(tReset('emailRequired')),
  });

  return {
    signInSchema,
    signUpSchema,
    resetSchema,
  };
};
