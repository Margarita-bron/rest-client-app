import { Header } from '~/components/header/header';
import { Footer } from '~/components/footer/footer';
import { SignUpForm } from '~/components/sign-up/sign-up';

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1 container mx-auto flex justify-center items-center text-center">
        <SignUpForm />
      </main>
      <Footer />
    </div>
  );
};
export default Welcome;
