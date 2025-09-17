import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useRouter } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { RESET_FORM_DATA } from '~/components/reset-form/reset-form.data';
import { resetPasswordUser } from '~/redux/auth/auth-actions';
import { useAuth } from '~/redux/auth/hooks';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/redux/store';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { useAuthSchemas } from '~/utils/validation/use-auth-schemas';
import { z } from 'zod';

export const ResetForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useAuth();
  const { navigate } = useRouter();
  const t = useTr('resetForm');
  const { resetSchema } = useAuthSchemas();
  type ResetFormData = z.infer<typeof resetSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!loading && user && !error) {
      navigate(ROUTES.welcome);
    }
  }, [user, loading, error, navigate]);

  const onSubmit = (formData: ResetFormData) => {
    dispatch(resetPasswordUser(formData.email));
  };

  return (
    <div className="flex items-center justify-center bg-gray-950 text-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
        className="bg-gray-900 p-8 rounded-2xl shadow-lg min-w-95 max-w-md space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center">
          {t('resetPassword')}
        </h1>

        <div>
          <label htmlFor="email" className="block text-sm mb-1 text-left">
            {t('email')}
          </label>
          <input
            id="email"
            placeholder={t('emailPlaceHolder')}
            autoComplete="email"
            {...register('email')}
            {...RESET_FORM_DATA.email}
          />
          <div className="h-5">
            {errors.email && touchedFields.email && (
              <p className="text-red-400 text-sm text-left">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {t('resetPassword')}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <p className="text-sm text-center text-gray-400">
          {t('notHaveAccount')}{' '}
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
