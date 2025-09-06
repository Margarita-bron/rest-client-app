import {Header} from "~/components/header/header";
import {Footer} from "~/components/footer/footer";

const Welcome = () => {
    return (
        <div className="min-h-screen flex flex-col ">
            <Header />
            <main className='flex-1 container mx-auto flex justify-center items-center text-center'>
                <div className='flex flex-col  h-full scale-135'>
                    sing up
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default Welcome;