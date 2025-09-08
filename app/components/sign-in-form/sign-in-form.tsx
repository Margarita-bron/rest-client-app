import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInSchema } from '~/components/sign-in-form/validation';
import { Link } from 'react-router';
import { ROUTES } from '~/routes-path';

//TODO - instead of strings use i18n when add translate

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    console.log('Form submitted:', data);
    // TODO Send actual request
  };

  return (
    <div className="flex items-center justify-center bg-gray-950 text-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg min-w-100 max-w-md space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>

        <div>
          <label className="block text-sm mb-1 text-left">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 rounded-lg mb-1 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="min-h-[20px]">
            {errors.email && (
              <p className="text-red-400 text-sm text-left">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-left">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 rounded-lg mb-1 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="min-h-[20px]">
            {errors.password && (
              <p className="text-red-400 text-sm text-left">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium"
        >
          Sign In
        </button>

        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{' '}
          <Link
            to={ROUTES.signUp}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};
