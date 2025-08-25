import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiChevronLeft, FiChevronRight, FiDownload, FiPrinter } from 'react-icons/fi';

function Laporan() {
  // State untuk data laporan
  const [reports, setReports] = useState([
    {
      id: '0001',
      name: 'Aplikasi Database Relawan',
      catalog: 'Produk',
      date: '11.06.2025',
      category: 'Satuan',
      orderNumber: 'PRAPL001',
      price: 'Rp 10.000.000'
    },
    {
      id: '0002',
      name: 'Layanan Domain Microsoft',
      catalog: 'Layanan',
      date: '12.06.2025',
      category: 'Satuan',
      orderNumber: 'LAYDMM002',
      price: 'Rp 12.000.000'
    },
    {
      id: '0003',
      name: 'Aplikasi Laporan Bulanan',
      catalog: 'Produk',
      date: '17.06.2025',
      category: 'Satuan',
      orderNumber: 'PRAPL003',
      price: 'Rp 14.000.000'
    }
  ]);

  // State untuk pagination dan filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [currentMonth, setCurrentMonth] = useState('Juni'); // Default current month
  
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Array bulan untuk dropdown
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Fetch data laporan saat komponen dimuat atau bulan berubah
  useEffect(() => {
    fetchReports(currentMonth);
  }, [currentMonth]);

  // Function untuk mendapatkan data laporan dari API
  const fetchReports = async (month) => {
    try {
      // Uncomment and adjust when API is ready
      // const response = await axios.get(`${apiUrl}/api/reports?month=${month}`);
      // setReports(response.data);
      // setTotalPages(Math.ceil(response.data.length / 10));
      
      // For now, just simulate different data for different months
      if (month !== currentMonth) {
        // Generate dummy data for different months
        const dummyData = generateDummyDataForMonth(month);
        setReports(dummyData);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Error fetching reports');
    }
  };

  // Generate dummy data for different months
  const generateDummyDataForMonth = (month) => {
    // This is just for simulation purposes
    const monthIndex = months.indexOf(month);
    
    return [
      {
        id: `00${monthIndex}1`,
        name: `Aplikasi ${month} - Project 1`,
        catalog: 'Produk',
        date: `${monthIndex + 1}.06.2025`,
        category: 'Satuan',
        orderNumber: `PRAPL${monthIndex}01`,
        price: `Rp ${(8 + monthIndex).toFixed(0)}.000.000`
      },
      {
        id: `00${monthIndex}2`,
        name: `Layanan ${month} - Service 1`,
        catalog: 'Layanan',
        date: `${monthIndex + 5}.06.2025`,
        category: 'Satuan',
        orderNumber: `LAYDM${monthIndex}02`,
        price: `Rp ${(10 + monthIndex).toFixed(0)}.000.000`
      },
      {
        id: `00${monthIndex}3`,
        name: `Aplikasi ${month} - Project 2`,
        catalog: 'Produk',
        date: `${monthIndex + 10}.06.2025`,
        category: 'Satuan',
        orderNumber: `PRAPL${monthIndex}03`,
        price: `Rp ${(12 + monthIndex).toFixed(0)}.000.000`
      }
    ];
  };

  // Handler untuk perubahan bulan
  const handleMonthChange = (e) => {
    setCurrentMonth(e.target.value);
  };

  // Handler untuk pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handler untuk cetak laporan
  const handlePrintReport = () => {
    toast.info(`Mencetak laporan untuk bulan ${currentMonth}`);
    window.print();
  };

  // Handler untuk export laporan
  const handleExportReport = () => {
    toast.info(`Mengexport laporan untuk bulan ${currentMonth} ke Excel`);
    // In a real application, this would trigger a download of an Excel file
  };

  // Calculate total revenue
  const calculateTotalRevenue = () => {
    return reports.reduce((total, report) => {
      const price = parseInt(report.price.replace(/\D/g, ''));
      return total + price;
    }, 0).toLocaleString('id-ID');
  };

  return (
    <div className="h-screen bg-gray-50 w-full">
      <ToastContainer />
      
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Laporan Bulanan</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={currentMonth}
              onChange={handleMonthChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <button 
            onClick={handlePrintReport}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <span>Cetak</span>
          </button>
        </div>
      </div>
      
      {/* Table */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Nama Pesanan</th>
                <th className="py-3 px-4 text-left">Katalog</th>
                <th className="py-3 px-4 text-left">Tanggal</th>
                <th className="py-3 px-4 text-left">Kategori</th>
                <th className="py-3 px-4 text-left">Nomor Orderan</th>
                <th className="py-3 px-4 text-left">Harga</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b">
                  <td className="py-3 px-4">{report.id}</td>
                  <td className="py-3 px-4">{report.name}</td>
                  <td className="py-3 px-4">{report.catalog}</td>
                  <td className="py-3 px-4">{report.date}</td>
                  <td className="py-3 px-4">{report.category}</td>
                  <td className="py-3 px-4">{report.orderNumber}</td>
                  <td className="py-3 px-4">{report.price}</td>
                </tr>
              ))}
              
              {/* Summary Row */}
              <tr className="bg-gray-100">
                <td colSpan={6} className="py-3 px-4 text-right font-bold">
                  Total Pendapatan:
                </td>
                <td className="py-3 px-4 font-bold">
                  Rp {calculateTotalRevenue()}
                </td>
              </tr>
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="flex justify-center p-4">
            <nav className="flex items-center">
              <button 
                className="px-3 py-1 rounded-md mx-1 bg-gray-100"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <FiChevronLeft size={16} />
              </button>
              
              <button 
                className="px-3 py-1 rounded-md mx-1 bg-blue-500 text-white"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              
              <button 
                className="px-3 py-1 rounded-md mx-1 bg-gray-100"
                onClick={() => handlePageChange(2)}
              >
                2
              </button>
              
              <span className="mx-1">...</span>
              
              <button 
                className="px-3 py-1 rounded-md mx-1 bg-gray-100"
                onClick={() => handlePageChange(5)}
              >
                5
              </button>
              
              <button 
                className="px-3 py-1 rounded-md mx-1 bg-gray-100"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <FiChevronRight size={16} />
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Print-only content */}
      <div className="hidden print:block p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Laporan Bulanan - {currentMonth} 2025</h1>
          <p className="text-gray-600">Co-Working Space</p>
          <p className="text-gray-600">Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
        </div>
        
        <div className="mb-4">
          <p><strong>Total Pendapatan:</strong> Rp {calculateTotalRevenue()}</p>
          <p><strong>Jumlah Transaksi:</strong> {reports.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Laporan;