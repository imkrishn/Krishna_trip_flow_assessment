import { Bell, Settings } from "lucide-react";
import Logo from "./Logo";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="w-screen h-14 flex items-center justify-between lg:px-11 px-3  py-4 border-b border-gray-200 shadow-md">
      <Logo />
      <div className="flex items-center gap-3">
        <Bell
          size={17}
          className="text-gray-500 hover:text-gray-800 cursor-pointer transition"
        />
        <Settings
          size={17}
          className="text-gray-500 hover:text-gray-800 cursor-pointer transition"
        />
        <Image
          src="/user.png"
          alt="User"
          className="lg:h-8 h-6 lg:w-8 w-6 object-cover rounded-full hover:bg-gray-100 cursor-pointer transition"
          width={100}
          height={100}
        />
      </div>
    </header>
  );
};

export default Navbar;
