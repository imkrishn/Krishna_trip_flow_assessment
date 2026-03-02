import Image from "next/image";
import logo from "../../public/logo.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none">
      <Image
        src={logo}
        alt="FleetFlow Logo"
        width={32}
        height={32}
        className="h-6 w-6 object-contain"
      />

      <h1 className="text-[16px] font-semibold tracking-tight text-green-500">
        Trip
        <span className="text-blue-400 text-[22px] font-bold">Flow</span>
      </h1>
    </div>
  );
};

export default Logo;
