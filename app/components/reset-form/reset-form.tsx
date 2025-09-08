import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Header } from '~/components/header/header';
import { Footer } from '~/components/footer/footer';
import { useForm } from 'react-hook-form';
import { RESET_FORM_DATA } from '~/components/reset-form/reset-form.data';
import { resetSchema } from '~/utils/validation/zod-auth-tests';
import { auth, sendPasswordReset } from '~/utils/firebase/firebase';

type resetFormData = z.infer<typeof resetSchema>;

function ResetForm() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<resetFormData>({
    resolver: zodResolver(resetSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (loading) return;
    if (user && !error) {
      navigate('/welcome');
    }
  }, [user, loading, error]);

  const onSubmit = (formData: resetFormData) => {
    sendPasswordReset(formData.email);
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1 container mx-auto flex justify-center items-center text-center">
        <div className="flex flex-col  h-full scale-135">
          {' '}
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-h-2">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="mx-auto h-8 w-auto dark:hidden"
              />
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="mx-auto h-8 w-auto not-dark:hidden"
              />
              <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
                Create your account
              </h2>
            </div>

            <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-sm">
              <form
                onSubmit={handleSubmit(onSubmit)}
                method="POST"
                className="space-y-3"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-1 text-left"
                  >
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

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                  >
                    Send password reset email
                  </button>
                </div>
              </form>

              <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <Link to="/sing-up">Register</Link> now.
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default ResetForm;
