import {Link} from "react-router";

export const SingUpButton = () => {
    return (
        <div>
            <Link
                to='/sing-up'
                onClick={() => console.log('Sing Up clicked')}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
                Sing Up
            </Link>
        </div>
    );
};