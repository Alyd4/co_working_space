import React from "react";
import { IoMdTime } from "react-icons/io";
import { FaTableList, FaUserGroup } from "react-icons/fa6";
import { PiShoppingBagOpenFill } from "react-icons/pi";
import { MdDashboard, MdMessage, MdDiscount, MdStorage, MdOutlineReceiptLong } from "react-icons/md";
import adminAvatar from "../assets/logo_sembangin.png"; // Pastikan Anda memiliki gambar profil admin

function Sidebar({ setActiveComponent }) {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-blue-600">Co-Working Space</h1>
      </div>
      
      {/* Admin Profile */}
      <div className="flex items-center px-6 pb-6">
        <img 
          src={adminAvatar} 
          alt="Admin Profile" 
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/40?text=Admin";
          }}
        />
        <span className="ml-3 font-bold text-gray-800">Admin</span>
      </div>
      
      <nav className="flex-1">
        <ul>
          <li>
            <button
              onClick={() => setActiveComponent('Dashboard')}
              className="w-full text-left flex items-center px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <MdDashboard className="w-5 h-5" />
              <span className="mx-4 font-medium">Dashboard</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setActiveComponent('KelolaPelanggan')}
              className="w-full text-left flex items-center px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <FaUserGroup className="w-5 h-5" />
              <span className="mx-4 font-medium">Kelola Pelanggan</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setActiveComponent('ProdukLayananList')}
              className="w-full text-left flex items-center px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <FaTableList className="w-5 h-5" />
              <span className="mx-4 font-medium">Produk dan Layanan</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setActiveComponent('Pesan')}
              className="w-full text-left flex items-center px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <MdMessage className="w-5 h-5" />
              <span className="mx-4 font-medium">Pesan</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setActiveComponent('KelolaPromosi')}
              className="w-full text-left flex items-center px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <MdDiscount className="w-5 h-5" />
              <span className="mx-4 font-medium">Kelola Promosi</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setActiveComponent('KelolaPesanan')}
              className="w-full text-left flex items-center px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <IoMdTime className="w-5 h-5" />
              <span className="mx-4 font-medium">Kelola Pesanan</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setActiveComponent('Penyimpanan')}
              className="w-full text-left flex items-center px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <MdStorage className="w-5 h-5" />
              <span className="mx-4 font-medium">Penyimpanan</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setActiveComponent('Laporan')}
              className="w-full text-left flex items-center px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <MdOutlineReceiptLong className="w-5 h-5" />
              <span className="mx-4 font-medium">Laporan</span>
            </button>
          </li>
          
          {/* Menyimpan fungsi tombol asli dari kode sebelumnya */}
          <li className="hidden">
            <button
              onClick={() => setActiveComponent('Admin')}
              className="w-full text-left flex items-center px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <PiShoppingBagOpenFill className="w-5 h-5" />
              <span className="mx-4 font-medium">Tambah Produk / Layanan</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;