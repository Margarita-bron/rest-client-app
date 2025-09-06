import {Header} from "~/components/header/header";
import {Footer} from "~/components/footer/footer";
import {Link} from "react-router";

const Welcome = () => {
    return (
        <div className="min-h-screen flex flex-col ">
            <Header />
            <main className='flex-1 container mx-auto flex justify-center items-center text-center'>
                <div className='flex flex-col  h-full scale-135'>
                    <h1 className='text-xl font-bold mb-5'>Welcome Back, [username]!</h1>
                    <div className="flex items-center gap-3">
                        <Link to="/rest-client" className='border border-gray-300 hover:bg-gray-100 rounded-full p-2'>REST Client</Link>
                        <div className="w-px h-4 bg-gray-300"/>
                        <Link to="/history" className='border border-gray-300 hover:bg-gray-100 rounded-full p-2'>History</Link>
                        <div className="w-px h-4 bg-gray-300" />
                        <Link to="/variables" className='border border-gray-300 hover:bg-gray-100 rounded-full p-2'>Variables</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default Welcome;