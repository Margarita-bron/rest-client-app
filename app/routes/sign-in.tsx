import { Header } from '~/components/header/header';
import { Footer } from '~/components/footer/footer';
import { SignInForm } from '~/components/sign-in-form/sign-in-form';

const SignIn = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1 container mx-auto flex justify-center items-center text-center">
        <SignInForm />
      </main>
      <Footer />
    </div>
  );
};
export default SignIn;
