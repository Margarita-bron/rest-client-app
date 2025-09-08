import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signupSchema } from '~/components/sign-up/validation';
import { Link } from 'react-router';

//TODO - instead of strings use i18n when add translate

type SignUpFormData = z.infer<typeof signupSchema>;

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log('Form submitted:', data);
    // TODO Send actual request
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};
