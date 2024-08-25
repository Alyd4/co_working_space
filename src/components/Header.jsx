import { Link, NavLink, useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { CgMenuRightAlt } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import axios from 'axios';

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      if (loggedInUser.isAdmin) {
        handleLogout(); // Automatically log out if user isAdmin
      } else {
        setUser(loggedInUser);
      }
    }
  }, []);

  const toggleMenu = () => setMenuOpened(!menuOpened);
  const toggleDropdown = () => setDropdownOpened(!dropdownOpened);

  const handleLogout = () => {
    // Clear user data and redirect to the login page
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

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

          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-x-2 medium-16"
              >
                {user.isAdmin ? "User" : user.email} <IoIosArrowDown />
              </button>
              {dropdownOpened && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to={'/login'} className="medium-15 border bg-gray-900 px-7 py-3 text-white transition-all hover:bg-blue-600 rounded-full flex items-center gap-x-2 medium-16">
              Login
            </NavLink>
          )}
        </div>

        {/* Navbar Mobile */}
        <div className={`${menuOpened ? "flex" : "hidden"} md:hidden flex-col gap-y-4 fixed top-16 right-4 p-6 bg-white rounded-3xl shadow-md w-64 transition-all duration-300 z-10`}>
          <Navbar containerStyles="flex flex-col gap-y-4 border-none" />
        </div>
      </div>
    </header>
  );
};

export default Header;
