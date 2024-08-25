import { Link, NavLink } from 'react-router-dom';
import Navbar from "./Navbar";
import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { CgMenuRightAlt } from "react-icons/cg";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const toggleMenu = () => setMenuOpened(!menuOpened);

  return (
    <header className="w-full fixed top-0 left-0 bg-white shadow-md z-10">
      <div className="px-5 flex justify-between items-center py-3">
        {/* Logo */}
        <div>
          <Link to="/">
            <h1 className='text-blue-600 font-semibold text-xl'>Co-Working Space</h1>
          </Link>
        </div>

        {/* Navbar Desktop */}
        <Navbar containerStyles={"hidden md:flex gap-x-5 xl:gap-x-10"} />

        {/* Login Button and Menu Button */}
        <div className="flex items-center sm:gap-x-6">
          {/* Menu Button */}
          {!menuOpened ? (
            <CgMenuRightAlt
              className="md:hidden cursor-pointer hover:text-blue-600 p-1 h-8 w-8 mr-4"
              onClick={toggleMenu}
            />
          ) : (
            <MdClose
              className="md:hidden cursor-pointer hover:text-blue-600 p-1 ring-1 ring-slate-900/30 h-8 w-8 rounded-full mr-4"
              onClick={toggleMenu}
            />
          )}

          <NavLink to={'/login'} className="medium-15 border bg-gray-900 px-7 py-3 text-white transition-all hover:bg-blue-600 rounded-full flex items-center gap-x-2 medium-16">
            Login
          </NavLink>
        </div>

        {/* Navbar Mobile */}
        <div className={`${menuOpened ? "flex" : "hidden"} md:hidden flex-col gap-y-4 fixed top-16 right-4 p-6 bg-white rounded-3xl shadow-md w-64 transition-all duration-300`}>
          <Navbar containerStyles="flex flex-col gap-y-4 border-none" />
        </div>
      </div>
    </header>
  );
}

export default Header;
