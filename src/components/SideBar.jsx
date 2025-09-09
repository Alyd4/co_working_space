import React from 'react';
import { IoMdTime } from 'react-icons/io';
import { FaTableList, FaUserGroup } from 'react-icons/fa6';
import { PiShoppingBagOpenFill } from 'react-icons/pi';
import {
  MdDashboard,
  MdMessage,
  MdDiscount,
  MdStorage,
  MdOutlineReceiptLong,
} from 'react-icons/md';
import adminAvatar from '../assets/logo_sembangin.png'; // Pastikan Anda memiliki gambar profil admin

function Sidebar({ setActiveComponent, activeComponent, navigate }) {
  const handleNavigation = (component, route) => {
    setActiveComponent(component);
    navigate(route);
  };

  const getButtonClass = component => {
    const baseClass =
      'w-full text-left flex items-center px-6 py-3 transition-colors duration-300';
    const activeClass = 'text-blue-600';
    const inactiveClass = 'text-gray-700';

    return `${baseClass} ${
      activeComponent === component ? activeClass : inactiveClass
    }`;
  };
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col fixed left-0 top-0 z-40 shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-blue-600">
          Co-Working Space
        </h1>
      </div>

      {/* Admin Profile */}
      <div className="flex items-center px-6 pb-6">
        <img
          src={adminAvatar}
          alt="Admin Profile"
          className="w-12 h-12 rounded-full object-cover"
          onError={e => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/40?text=Admin';
          }}
        />
        <span className="ml-3 font-bold text-gray-800">Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul>
          <li>
            <button
              onClick={() => handleNavigation('Dashboard', '/aadmin/dashboard')}
              className={getButtonClass('Dashboard')}
            >
              <MdDashboard className="w-5 h-5" />
              <span className="mx-4 font-medium">Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleNavigation('KelolaPelanggan', '/aadmin/pelanggan')
              }
              className={getButtonClass('KelolaPelanggan')}
            >
              <FaUserGroup className="w-5 h-5" />
              <span className="mx-4 font-medium">Kelola Pelanggan</span>
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleNavigation('ProdukLayananList', '/aadmin/item')
              }
              className={getButtonClass('ProdukLayananList')}
            >
              <FaTableList className="w-5 h-5" />
              <span className="mx-4 font-medium">Produk dan Layanan</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('Pesan', '/aadmin/pesan')}
              className={getButtonClass('Pesan')}
            >
              <MdMessage className="w-5 h-5" />
              <span className="mx-4 font-medium">Pesan</span>
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleNavigation('KelolaPromosi', '/aadmin/promosi')
              }
              className={getButtonClass('KelolaPromosi')}
            >
              <MdDiscount className="w-5 h-5" />
              <span className="mx-4 font-medium">Kelola Promosi</span>
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleNavigation('KelolaPesanan', '/aadmin/pesanan')
              }
              className={getButtonClass('KelolaPesanan')}
            >
              <IoMdTime className="w-5 h-5" />
              <span className="mx-4 font-medium">Kelola Pesanan</span>
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleNavigation('Penyimpanan', '/aadmin/penyimpanan')
              }
              className={getButtonClass('Penyimpanan')}
            >
              <MdStorage className="w-5 h-5" />
              <span className="mx-4 font-medium">Penyimpanan</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('Laporan', '/aadmin/laporan')}
              className={getButtonClass('Laporan')}
            >
              <MdOutlineReceiptLong className="w-5 h-5" />
              <span className="mx-4 font-medium">Laporan</span>
            </button>
          </li>{' '}
          {/* Menyimpan fungsi tombol asli dari kode sebelumnya */}
          <li className="hidden">
            <button
              onClick={() => setActiveComponent('Admin')}
              className="w-full text-left flex items-center px-6 py-3 text-gray-700 transition-colors duration-300"
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
