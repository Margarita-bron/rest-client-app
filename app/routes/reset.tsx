import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { auth, sendPasswordReset } from '../firebase/firebase';
import { Header } from '~/components/header/header';
import { Footer } from '~/components/footer/footer';

function Reset() {
  const [email, setEmail] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate('/dashboard');
  }, [user, loading]);
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
              <form action="#" method="POST" className="space-y-3">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-left text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mail Address"
                      required
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 placeholder:text-sm focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    onClick={() => sendPasswordReset(email)}
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
                  <Link to="/register">Register</Link> now.
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
export default Reset;
