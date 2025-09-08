import { Footer } from '~/components/footer/footer';
import { SingInButton } from '~/components/sign-in-button/sign-in-button';
import { SingUpButton } from '~/components/sign-up-button/sing-up-button';
import { HeaderAuth } from '~/components/header/header-auth';

export const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <HeaderAuth />
      <main className="flex-1 container mx-auto flex justify-center items-center text-center">
        <div className="flex flex-col  h-full scale-135">
          <h1 className="text-xl font-bold mb-5">Welcome!</h1>
          <div className="flex items-center gap-3">
            <SingInButton />
            <SingUpButton />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
