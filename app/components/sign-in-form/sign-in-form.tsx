import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { SIGN_IN_FORM_DATA } from '~/components/sign-in-form/sign-in-form.data';
import { useEffect } from 'react';
import { signInSchema } from '~/utils/validation/zod-auth-tests';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/redux/store';
import { loginUser } from '~/redux/auth/auth-actions';
import { useAuth } from '~/redux/auth/hooks';

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useRouter();
  const { loading, error, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const onSubmit = async (formData: SignInFormData) => {
    try {
      await dispatch(loginUser(formData.email, formData.password));
      navigate(ROUTES.welcome);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-950 text-gray-100 scale-90">
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
        className="bg-gray-900 p-8 rounded-2xl shadow-lg min-w-115 max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>

        <div>
          <label htmlFor="email" className="block text-m mb-1 text-left">
            Email
          </label>
          <input
            id="email"
            placeholder="E-mail Address"
            autoComplete="email"
            {...register('email')}
            {...SIGN_IN_FORM_DATA.email}
          />
          <div className="h-5">
            {errors.email && touchedFields.email && (
              <p className="text-red-400 text-sm text-left">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-m mb-1 text-left">
            Password
          </label>
          <input
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register('password')}
            {...SIGN_IN_FORM_DATA.password}
          />
          <div className="h-5">
            {errors.password && (
              <p className="text-red-400 text-sm text-left">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button {...SIGN_IN_FORM_DATA.submit} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div className="text-sm">
          <Link
            to={ROUTES.reset}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Forgot password?
          </Link>
        </div>

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
