import { Header } from '~/components/header/header';
import { Footer } from '~/components/footer/footer';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  auth,
  signInWithEmailPassword,
  signInWithGoogle,
} from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import '../firebase/login/login.css';

const Welcome = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate('/welcome');
  }, [user, loading]);

  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1 container mx-auto flex justify-center items-center text-center">
        <div className="flex flex-col  h-full scale-135">
          {' '}
          <div className="login">
            <div className="login__container">
              <input
                type="text"
                className="login__textBox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail Address"
              />
              <input
                type="password"
                className="login__textBox"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button
                className="login__btn"
                onClick={() => signInWithEmailPassword(email, password)}
              >
                Login
              </button>
              <button
                className="login__btn login__google"
                onClick={signInWithGoogle}
              >
                Login with Google
              </button>
              <div>
                <Link to="/reset">Forgot Password</Link>
              </div>
              <div>
                Don't have an account? <Link to="/register">Register</Link> now.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Welcome;
