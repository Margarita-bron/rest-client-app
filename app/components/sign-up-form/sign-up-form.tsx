import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUpSchema } from '~/components/sign-up-form/validation';
import { Link } from 'react-router';
import { ROUTES } from '~/routes-path';
import { SIGN_UP_FORM } from './sign-up-form.data';
//TODO - instead of strings use i18n when add translate

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log('Form submitted:', data);
    // TODO Send actual request
  };

  return (
    <div className="flex items-center justify-center bg-gray-950 text-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg min-w-100 max-w-md space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>

        <div>
          <label className="block text-sm mb-1 text-left">Email</label>
          <input {...register('email')} {...SIGN_UP_FORM.email} />
          <div className="h-5">
            {errors.email && (
              <p className="text-red-400 text-sm text-left">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-left">Password</label>
          <input {...register('password')} {...SIGN_UP_FORM.password} />
          <div className="h-5">
            {errors.password && (
              <p className="text-red-400 text-sm text-left">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button {...SIGN_UP_FORM.submit}>Sign Up</button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link
            to={ROUTES.signIn}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};
