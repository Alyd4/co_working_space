import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { CgChevronDown } from "react-icons/cg";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

function Navbar({ containerStyles }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className={`${containerStyles} flex justify-around items-center  p-2 rounded-full border border-black`}>
      <NavLink to={'/'} className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-800 font-normal"}>
        <div className="flex items-center gap-x-1">
          <span>Beranda</span>
        </div>
      </NavLink>

      {/* Dropdown for "Fitur" */}
      <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 bg-white px-3 py-2 text-gray-800 font-normal">
          Fitur
          <CgChevronDown aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-800" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <a
              href="/Product"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Produk
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="/Layanan"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Layanan
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>

      <NavLink to={'/Tentang'} className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-800 font-normal"}>
        <div className="flex items-center gap-x-1">
          <span>Tentang</span>
        </div>
      </NavLink>

      <NavLink to={'/Kontak'} className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-800 font-normal"}>
        <div className="flex items-center gap-x-1">
          <span>Kontak</span>
        </div>
      </NavLink>
    </nav>
  );
}

export default Navbar;
