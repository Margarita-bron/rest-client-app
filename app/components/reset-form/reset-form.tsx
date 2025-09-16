import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Link, useRouter } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { RESET_FORM_DATA } from '~/components/reset-form/reset-form.data';
import { resetSchema } from '~/utils/validation/zod-auth-tests';
import { resetPasswordUser } from '~/redux/auth/auth-actions';
import { useAuth } from '~/redux/auth/hooks';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/redux/store';

type ResetFormData = z.infer<typeof resetSchema>;

function ResetForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useAuth();
  const { navigate } = useRouter();

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
        <h1 className="text-2xl font-semibold text-center">Reset Password</h1>

        <div>
          <label htmlFor="email" className="block text-sm mb-1 text-left">
            Email
          </label>
          <input
            id="email"
            placeholder="E-mail Address"
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
          Send password reset email
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

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
}

export default ResetForm;
