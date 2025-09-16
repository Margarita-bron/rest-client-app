import { SignInButton } from '~/components/header/sign-in-button/sign-in-button';
import { SignUpButton } from '~/components/header/sign-up-button/sign-up-button';

export const Auth = () => {
  return (
    <div className="flex-1 container mx-auto flex justify-center items-center text-center">
      <div className="flex flex-col h-full scale-135">
        <h1 className="text-xl font-bold mb-5">Welcome!</h1>
        <div className="flex items-center gap-3 justify-center">
          <SignInButton />
          <SignUpButton />
        </div>
      </div>
    </div>
  );
};
