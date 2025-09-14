import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { SIGN_UP_FORM } from './sign-up-form.data';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { auth, registerWithEmailAndPassword } from '~/lib/firebase/firebase';
import { signUpSchema } from '~/utils/validation/zod-auth-tests';
//TODO - instead of strings use i18n when add translate

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const [user, loading, error] = useAuthState(auth);
  const { navigate } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (loading) return;
    if (user && !error) {
      navigate('/welcome');
    }
  }, [user, loading, error, navigate]);

  const onSubmit = (formData: SignUpFormData) => {
    registerWithEmailAndPassword(
      formData.name,
      formData.email,
      formData.password
    );
  };

  return (
    <div className="flex items-center justify-center bg-gray-950 text-gray-100 scale-90">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg min-w-115 max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>

        <div>
          <label className="block text-sm mb-1 text-left">Full Name</label>
          <input
            id="name"
            placeholder="Full Name"
            autoComplete="given-name"
            {...register('name')}
            {...SIGN_UP_FORM.name}
          />
          <div className="h-7">
            {errors.name && touchedFields.name && (
              <p className="text-red-400 text-sm text-left">
                {errors.name?.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-left">Email</label>
          <input
            id="email"
            placeholder="E-mail Address"
            autoComplete="email"
            {...register('email')}
            {...SIGN_UP_FORM.email}
          />
          <div className="h-7">
            {errors.email && touchedFields.email && (
              <p className="text-red-400 text-sm text-left">
                {errors.email?.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-left">Password</label>
          <input
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            {...register('password')}
            {...SIGN_UP_FORM.password}
          />
          <div className="h-7">
            {errors.password && (
              <p className="text-red-400 text-sm text-left">
                {errors.password?.message}
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
