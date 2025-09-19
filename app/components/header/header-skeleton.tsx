import logo from '~/assets/logo.png';
import { Loader } from '~/ui/loader';

export const HeaderSkeleton = () => {
  return (
    <>
      <div className="flex items-center transition-transform hover:scale-105">
        <img src={logo} alt="Logo" className="h-8 mr-3" />
        <span className="text-l font-semibold text-gray-300">MVA Project</span>
      </div>

      <div className="flex items-center gap-4">
        <Loader />
      </div>
    </>
  );
};
