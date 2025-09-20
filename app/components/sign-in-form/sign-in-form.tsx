import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { useAuth, useLoginUser } from '~/redux/auth/hooks';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { useAuthSchemas } from '~/utils/validation/use-auth-schemas';
import { SIGN_IN_FORM_DATA } from './sign-in-form.data';

export const SignInForm = () => {
  const { user, loading, error } = useAuth();
  const { navigate } = useRouter();
  const { login } = useLoginUser();

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
      const { success } = await login({
        email: formData.email,
        password: formData.password,
      });
      if (success) navigate(ROUTES.welcome);
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
            {t('email')}
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
            {t('password')}
          </label>
          <input
            id="password"
            placeholder={t('passwordPlaceholder')}
            autoComplete="current-password"
            {...register('password')}
            {...SIGN_IN_FORM_DATA.password}
          />
          <div className="h-7">
            {errors.password && (
              <p className="text-red-400 text-sm text-left">
                {errors.password?.message}
              </p>
            )}
          </div>
        </div>

        <button {...SIGN_IN_FORM_DATA.submit} disabled={loading}>
          {loading ? t('submiting') : t('submit')}
        </button>
        <div className="h-5">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>

        <div className="text-sm">
          <Link
            to={ROUTES.reset}
            className="text-indigo-400 hover:underline font-medium"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <p className="text-sm text-center text-gray-400">
          {t('dontHaveAccount')}{' '}
          <Link
            to={ROUTES.signUp}
            className="text-indigo-400 hover:underline font-medium"
          >
            {t('signUp')}
          </Link>
        </p>
      </form>
    </div>
  );
};
