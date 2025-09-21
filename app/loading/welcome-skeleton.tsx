export default function WelcomeSkeleton() {
  return (
    <div className="flex flex-col h-full scale-135 text-center animate-pulse">
      <h1 className="text-xl font-bold mb-5 bg-gray-500 rounded w-48 h-8 mx-auto"></h1>
      <div className="flex items-center gap-3 justify-center">
        <div className="bg-gray-500 rounded-full w-24 h-8"></div>
        <div className="w-px h-4 bg-gray-500" />
        <div className="bg-gray-500 rounded-full w-20 h-8"></div>
        <div className="w-px h-4 bg-gray-500" />
        <div className="bg-gray-500 rounded-full w-24 h-8"></div>
      </div>
    </div>
  );
}
