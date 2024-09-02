import React from "react";
import { FaTableList } from "react-icons/fa6";
import { PiShoppingBagOpenFill } from "react-icons/pi";

function Sidebar({ setActiveComponent }) {
  return (
    <div className="w-64 h-screen bg-white border-r">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-blue-600">Co-Working Space</h1>
      </div>
      <nav className="mt-10">
        <ul>
          <li>
            <button
              onClick={() => setActiveComponent('Admin')}
              className="w-full text-left flex items-center px-6 py-2 mt-4 text-black hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
            ><PiShoppingBagOpenFill className="w-9 h-9" />
              <span className="mx-4 font-medium">Tambah Produk / Layanan</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent('ProdukLayananList')}
              className="w-full text-left flex items-center px-6 py-2 mt-4 text-black hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
            ><FaTableList className="w-6 h-6" />
              <span className="mx-4 font-medium">Produk / Layanan List</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
