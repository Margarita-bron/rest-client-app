import { z } from 'zod';
//TODO - instead of strings use i18n when add translate
export const signinSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().nonempty('Password cannot be empty'),
});
