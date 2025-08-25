import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { 
  MdAttachMoney, 
  MdShoppingCart, 
  MdPeople, 
  MdLocalShipping,
  MdKeyboardArrowDown
} from 'react-icons/md';
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';

function Dashboard() {
  // State untuk bulan pada grafik
  const [selectedMonth, setSelectedMonth] = useState('Juni');
  
  // Data untuk statistik
  const stats = [
    { title: 'Total Pendapatan', value: 'Rp 2jt', icon: <MdAttachMoney className="text-blue-600" /> },
    { title: 'Total Order', value: '4', icon: <MdShoppingCart className="text-blue-600" /> },
    { title: 'Total Pembeli', value: '4', icon: <MdPeople className="text-blue-600" /> },
    { title: 'Sedang Diproses', value: '2', icon: <MdLocalShipping className="text-blue-600" /> },
  ];

  // Data untuk top pembelian (carousel)
  const [currentIndex, setCurrentIndex] = useState(0);
  const topProducts = [
    { name: 'Aplikasi Absensi Staf', price: 'Rp 2.000.000', image: '/images/app-mockup.png' },
    { name: 'Website Company Profile', price: 'Rp 1.500.000', image: '/images/website-mockup.png' },
    { name: 'Aplikasi Inventory', price: 'Rp 3.000.000', image: '/images/inventory-app.png' },
  ];

  // Data untuk tabel transaksi
  const transactions = [
    { 
      id: 1, 
      name: 'Ajeng Syahtifri', 
      katalog: 'Produk', 
      kategori: 'Satuan', 
      hp: '082311178820', 
      metode: 'Kredit/Debit', 
      harga: 'Rp 2.000.000', 
      status: 'Selesai' 
    },
    { 
      id: 2, 
      name: 'Maxy Welnes', 
      katalog: 'Layanan', 
      kategori: 'Paket', 
      hp: '081222247878', 
      metode: 'Transfer Bank', 
      harga: 'Rp 400.000', 
      status: 'Sedang Diproses' 
    },
    { 
      id: 3, 
      name: 'Tompi Toppy', 
      katalog: 'Produk', 
      kategori: 'Satuan', 
      hp: '082345768998', 
      metode: 'E-Wallet', 
      harga: 'Rp 2.000.000', 
      status: 'Belum Dibayar' 
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % topProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? topProducts.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Chart */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Top Kategori</h2>
              <div className="relative">
                <button className="flex items-center border rounded-md px-3 py-1">
                  {selectedMonth}
                  <MdKeyboardArrowDown className="ml-1" />
                </button>
                {/* Dropdown for month selection would go here */}
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="h-72 relative">
              {/* This would be replaced by a real chart library like Chart.js or Recharts */}
              <div className="flex items-end justify-around h-full pt-10 pb-5">
                <div className="flex flex-col items-center">
                  <div className="bg-yellow-400 w-12 rounded-t-lg" style={{ height: '120px' }}></div>
                  <p className="text-xs mt-2">Produk Satuan</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-teal-500 w-12 rounded-t-lg" style={{ height: '200px' }}></div>
                  <p className="text-xs mt-2">Produk Paket</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-red-500 w-12 rounded-t-lg" style={{ height: '80px' }}></div>
                  <p className="text-xs mt-2">Layanan Satuan</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-teal-500 w-12 rounded-t-lg" style={{ height: '180px' }}></div>
                  <p className="text-xs mt-2">Layanan Paket</p>
                </div>
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
                <span className="text-xs text-gray-500">100</span>
                <span className="text-xs text-gray-500">80</span>
                <span className="text-xs text-gray-500">60</span>
                <span className="text-xs text-gray-500">40</span>
                <span className="text-xs text-gray-500">20</span>
                <span className="text-xs text-gray-500">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Top Purchases */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-6">Top Pembelian</h2>
            
            {/* Product Carousel */}
            <div className="relative">
              <div className="overflow-hidden h-64">
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <img
                      src="/images/device-mockup.png"
                      alt={topProducts[currentIndex].name}
                      className="h-40 mx-auto object-contain"
                    />
                    <h3 className="text-lg font-medium mt-4">{topProducts[currentIndex].name}</h3>
                    <p className="text-blue-500 font-medium">{topProducts[currentIndex].price}</p>
                  </div>
                </div>
              </div>
              
              {/* Carousel Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Detail Transaksi</h2>
            <div className="relative">
              <button className="flex items-center border rounded-md px-3 py-1">
                Selesai
                <MdKeyboardArrowDown className="ml-1" />
              </button>
              {/* Dropdown for filter would go here */}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Nama Pembeli</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Katalog</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Kategori</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">No HP</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Metode bayar</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Harga</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t">
                    <td className="px-4 py-4">{transaction.name}</td>
                    <td className="px-4 py-4">{transaction.katalog}</td>
                    <td className="px-4 py-4">{transaction.kategori}</td>
                    <td className="px-4 py-4">{transaction.hp}</td>
                    <td className="px-4 py-4">{transaction.metode}</td>
                    <td className="px-4 py-4">{transaction.harga}</td>
                    <td className="px-4 py-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'Selesai' 
                            ? 'bg-green-100 text-green-600' 
                            : transaction.status === 'Sedang Diproses'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center p-4">
            <nav className="flex items-center">
              <button className="w-8 h-8 flex items-center justify-center rounded-md mx-1 bg-gray-100">
                &lt;
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md mx-1 bg-blue-500 text-white">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md mx-1 bg-gray-100">
                2
              </button>
              <span className="mx-1">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-md mx-1 bg-gray-100">
                5
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md mx-1 bg-gray-100">
                &gt;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;