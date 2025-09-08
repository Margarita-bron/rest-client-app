import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { ROUTES } from '~/routes-path';
import { SIGN_IN_FORM_DATA } from '~/components/sign-in-form/sign-in-form.data';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithEmailPassword } from '~/utils/firebase/firebase';
import { useEffect } from 'react';
import { signInSchema } from '~/utils/validation/zod-auth-tests';
//TODO - instead of strings use i18n when add translate

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user && !error) {
      navigate('/welcome');
    }
  }, [user, loading, error, navigate]);

  const onSubmit = (formData: SignInFormData) => {
    signInWithEmailPassword(formData.email, formData.password);
  };

  return (
    <div className="flex items-center justify-center bg-gray-950 text-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
        className="bg-gray-900 p-8 rounded-2xl shadow-lg min-w-100 max-w-md space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>

        <div>
          <label htmlFor="email" className="block text-sm mb-1 text-left">
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
          <label htmlFor="password" className="block text-sm mb-1 text-left">
            Password
          </label>
          <div className="text-sm">
            <a
              href="#"
              className="font-semibold text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <Link to="/reset">Forgot password?</Link>
            </a>
          </div>
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

        <button {...SIGN_IN_FORM_DATA.submit}>Sign In</button>

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
