import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { useAuth, useRegisterUser } from '~/redux/auth/hooks';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { useAuthSchemas } from '~/utils/validation/use-auth-schemas';
import { SIGN_UP_FORM } from './sign-up-form.data';

export const SignUpForm = () => {
  const { user, loading, error } = useAuth();
  const { navigate } = useRouter();
  const { register: registerUser } = useRegisterUser(); // ✅ хук

  const t = useTr('signUpForm');
  const { signUpSchema } = useAuthSchemas();
  type SignUpFormData = z.infer<typeof signUpSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!loading && user && !error) {
      navigate(ROUTES.welcome);
    }
  }, [user, loading, error, navigate]);

  const onSubmit = async (formData: SignUpFormData) => {
    try {
      const success = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
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
          <label className="block text-sm mb-1 text-left">{t('name')}</label>
          <input
            id="name"
            placeholder={t('namePlaceholder')}
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
          <label className="block text-sm mb-1 text-left">{t('email')}</label>
          <input
            id="email"
            placeholder={t('emailPlaceholder')}
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
          <label className="block text-sm mb-1 text-left">
            {t('password')}
          </label>
          <input
            id="password"
            placeholder={t('passwordPlaceholder')}
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

        <button {...SIGN_UP_FORM.submit} disabled={loading}>
          {loading ? 'Signing up...' : t('submit')}
        </button>
        <div className="h-5">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
        <p className="text-sm text-center text-gray-400">
          {t('alreadyHaveAccount')}{' '}
          <Link
            to={ROUTES.signIn}
            className="text-indigo-400 hover:underline font-medium"
          >
            {t('signIn')}
          </Link>
        </p>
      </form>
    </div>
  );
};
