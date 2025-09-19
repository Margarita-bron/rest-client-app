import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/redux/store';
import { loginUser } from '~/redux/auth/auth-actions';
import { useAuth } from '~/redux/auth/hooks';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { useAuthSchemas } from '~/utils/validation/use-auth-schemas';
import { SIGN_IN_FORM_DATA } from './sign-in-form.data';

export const SignInForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useAuth();
  const { navigate } = useRouter();

  const t = useTr('signInForm');
  const { signInSchema } = useAuthSchemas();

  type SignInFormData = z.infer<typeof signInSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!loading && user && !error) {
      navigate(ROUTES.welcome);
    }
  }, [user, loading, error, navigate]);

  const onSubmit = async (formData: SignInFormData) => {
    try {
      const success = await dispatch(
        loginUser(formData.email, formData.password)
      );
      if (success) {
        navigate(ROUTES.welcome);
      }
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
        <h1 className="text-2xl font-semibold text-center">{t('submit')}</h1>

        <div>
          <label htmlFor="email" className="block text-sm mb-1 text-left">
            {t('submit')}
          </label>
          <input
            id="email"
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            {...register('email')}
            {...SIGN_IN_FORM_DATA.email}
          />
          <div className="h-5">
            {errors.email && touchedFields.email && (
              <p className="text-red-400 text-sm text-left">
                {errors.email?.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm mb-1 text-left">
            {t('submit')}
          </label>
          <input
            id="password"
            placeholder={t('passwordPlaceholder')}
            autoComplete="current-password"
            {...register('password')}
            {...SIGN_IN_FORM_DATA.password}
          />
          <div className="h-5">
            {errors.password && (
              <p className="text-red-400 text-sm text-left">
                {errors.password?.message}
              </p>
            )}
          </div>
        </div>

        <button {...SIGN_IN_FORM_DATA.submit} disabled={loading}>
          {loading ? 'Signing in...' : t('submit')}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div className="text-sm">
          <Link
            to={ROUTES.reset}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <p className="text-sm text-center text-gray-400">
          {t('dontHaveAccount')}{' '}
          <Link
            to={ROUTES.signUp}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {t('signUp')}
          </Link>
        </p>
      </form>
    </div>
  );
};
