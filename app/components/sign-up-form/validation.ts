import { z } from 'zod';
//TODO - instead of strings use i18n when add translate
export const signUpSchema = z.object({
  email: z.email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/\p{L}/u, 'Password must include at least one letter')
    .regex(/\p{N}/u, 'Password must include at least one digit')
    .regex(
      /[^\p{L}\p{N}]/u,
      'Password must include at least one special character'
    ),
});
