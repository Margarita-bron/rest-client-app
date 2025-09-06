export const SingInButton = () => {
    return (
        <button
            onClick={() => console.log('Sing In clicked')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
            Sing In
        </button>
    );
};