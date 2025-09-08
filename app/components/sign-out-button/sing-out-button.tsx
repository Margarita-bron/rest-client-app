export const SingOutButton = () => {
  return (
    <button
      onClick={() => console.log('Sing out clicked')}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-50 transition-colors"
    >
      Sing out
    </button>
  );
};
