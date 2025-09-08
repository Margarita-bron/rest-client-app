import { Header } from '~/components/header/header';
import { Footer } from '~/components/footer/footer';
import ResetForm from '~/components/reset-form/reset-form';

const Reset = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1 container mx-auto flex justify-center items-center text-center">
        <ResetForm />
      </main>
      <Footer />
    </div>
  );
};
export default Reset;
