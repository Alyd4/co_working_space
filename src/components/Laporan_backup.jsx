import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiPrinter,
} from "react-icons/fi";
import Header from "./Headeradmin";

function Laporan() {
  // State untuk data laporan
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    productCount: 0,
    serviceCount: 0,
    period: ''
  });

  // State untuk pagination dan filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(""); // Default to all months
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Current year

  const apiUrl = import.meta.env.VITE_API_URL;

  // Array bulan untuk dropdown
  const months = [
    { value: "", label: "Semua Bulan" },
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  // Generate years (current year and 2 years back)
  const years = [];
  for (let i = currentYear; i >= currentYear - 2; i--) {
    years.push(i);
  }

  // Fetch data laporan saat komponen dimuat atau filter berubah
  useEffect(() => {
    fetchReports();
  }, [currentMonth, currentYear]);

  // Function untuk mendapatkan data laporan dari API
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (currentMonth) params.append('month', currentMonth);
      if (currentYear) params.append('year', currentYear);

      console.log('Fetching reports with params:', params.toString());

      const response = await axios.get(`${apiUrl}/api/admin/reports?${params.toString()}`);
      
      if (response.data.success) {
        setReports(response.data.data);
        setSummary(response.data.summary);
        // Calculate pagination
        const itemsPerPage = 10;
        setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
        
        toast.success(`Berhasil memuat ${response.data.data.length} data laporan`);
      } else {
        throw new Error(response.data.message || 'Gagal memuat data laporan');
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError(error.message);
      toast.error(`Error: ${error.message}`);
      // Set empty data on error
      setReports([]);
      setSummary({
        totalRevenue: 0,
        totalTransactions: 0,
        productCount: 0,
        serviceCount: 0,
        period: ''
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk perubahan bulan
  const handleMonthChange = (e) => {
    setCurrentMonth(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  // Handler untuk perubahan tahun
  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handler untuk pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handler untuk cetak laporan
  const handlePrintReport = () => {
    if (reports.length === 0) {
      toast.warning("Tidak ada data untuk dicetak");
      return;
    }

    // Create a new window with only the table content
    const printWindow = window.open("", "_blank");
    const tableContent = document.getElementById("reportTable").innerHTML;

    const monthLabel = currentMonth ? months.find(m => m.value === currentMonth)?.label : "Semua Bulan";
    const reportTitle = `Laporan ${monthLabel} ${currentYear}`;

    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #2563eb; color: white; }
            .summary { margin-bottom: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 8px; }
            .summary h3 { margin-top: 0; }
          </style>
        </head>
        <body>
          <h2>${reportTitle}</h2>
          <div class="summary">
            <h3>Ringkasan Laporan</h3>
            <p><strong>Total Pendapatan:</strong> Rp ${summary.totalRevenue.toLocaleString('id-ID')}</p>
            <p><strong>Total Transaksi:</strong> ${summary.totalTransactions}</p>
            <p><strong>Produk Terjual:</strong> ${summary.productCount}</p>
            <p><strong>Layanan Terjual:</strong> ${summary.serviceCount}</p>
          </div>
          <div>${tableContent}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
    printWindow.close();

    toast.success(`Laporan ${reportTitle} berhasil dicetak`);
  };

  // Handler untuk export laporan
  const handleExportReport = () => {
    if (reports.length === 0) {
      toast.warning("Tidak ada data untuk diexport");
      return;
    }

    const monthLabel = currentMonth ? months.find(m => m.value === currentMonth)?.label : "Semua_Bulan";
    toast.info(`Export laporan ${monthLabel}_${currentYear} akan segera tersedia`);
    // In a real application, this would trigger a download of an Excel file
  };

  // Calculate total revenue from current page
  const calculateTotalRevenue = () => {
    return summary.totalRevenue.toLocaleString("id-ID");
  };

  // Get current page data
  const getCurrentPageData = () => {
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return reports.slice(startIndex, endIndex);
  };

  // Function untuk handle search
  const handleSearch = (query) => {
    // Implementasi search untuk filter laporan
    console.log("Search query:", query);
    // Bisa ditambahkan logika untuk filter reports berdasarkan query
  };

  return (
    <div className="flex flex-col bg-white">
      <ToastContainer />

      {/* Header dengan Search Bar dan Logout */}
      <div className="w-full bg-black mb-6">
        <Header />
      </div>

      <div className="h-screen bg-white w-full">
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Laporan Produk & Layanan</h1>
          <div className="flex space-x-2">
            {/* Dropdown Tahun */}
            <div className="relative">
              <select
                value={currentYear}
                onChange={handleYearChange}
                className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-center"
                style={{
                  borderRadius: "500px",
                  width: "80px",
                  height: "28px",
                  fontSize: "12px",
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Dropdown Bulan */}
            <div className="relative">
              <select
                value={currentMonth}
                onChange={handleMonthChange}
                className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-center"
                style={{
                  borderRadius: "500px",
                  width: "120px",
                  height: "28px",
                  fontSize: "12px",
                }}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <button
              onClick={handlePrintReport}
              className="border-2 hover:bg-blue-50 px-3 py-1 flex items-center justify-center"
              style={{
                borderColor: "#0070D8",
                color: "#0070D8",
                width: "61px",
                height: "28px",
                fontSize: "12px",
                borderRadius: "500px",
              }}
            >
              <span>Cetak</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-blue-800 font-semibold text-sm">Total Pendapatan</h3>
            <p className="text-2xl font-bold text-blue-900">
              Rp {calculateTotalRevenue()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-green-800 font-semibold text-sm">Total Transaksi</h3>
            <p className="text-2xl font-bold text-green-900">{summary.totalTransactions}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-purple-800 font-semibold text-sm">Produk Terjual</h3>
            <p className="text-2xl font-bold text-purple-900">{summary.productCount}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-orange-800 font-semibold text-sm">Layanan Terjual</h3>
            <p className="text-2xl font-bold text-orange-900">{summary.serviceCount}</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Memuat data laporan...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-4 mb-4">
            <p className="text-red-700">
              <strong>Error:</strong> {error}
            </p>
            <button 
              onClick={fetchReports}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Table */}
        <div className="p-4">
          {!loading && !error && (
            <>
              {reports.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-lg">
                  <p className="text-gray-500 text-lg">Tidak ada data untuk periode yang dipilih</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Coba pilih periode lain atau pastikan ada transaksi yang sudah dibayar
                  </p>
                </div>
              ) : (
                <div
                  className="bg-white rounded-lg shadow-lg drop-shadow-md border border-gray-100 overflow-hidden"
                  id="reportTable"
                >
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th
                          className="py-3 px-4 text-center"
                          style={{ borderRadius: "500px 0 0 500px" }}
                        >
                          ID
                        </th>
                        <th className="py-3 px-4 text-center">Nama Pesanan</th>
                        <th className="py-3 px-4 text-center">Katalog</th>
                        <th className="py-3 px-4 text-center">Tanggal</th>
                        <th className="py-3 px-4 text-center">Kategori</th>
                        <th className="py-3 px-4 text-center">Nomor Orderan</th>
                        <th
                          className="py-3 px-4 text-center"
                          style={{ borderRadius: "0 500px 500px 0" }}
                        >
                          Harga
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ opacity: 0.8 }}>
                      {getCurrentPageData().map((report) => (
                        <tr key={report.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-center">{report.id}</td>
                          <td className="py-3 px-4 text-center">{report.name}</td>
                          <td className="py-3 px-4 text-center">{report.catalog}</td>
                          <td className="py-3 px-4 text-center">{report.date}</td>
                          <td className="py-3 px-4 text-center">{report.category}</td>
                          <td className="py-3 px-4 text-center">
                            {report.orderNumber}
                          </td>
                          <td className="py-3 px-4 text-center">{report.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

          {/* Pagination - Separated from table */}
          <div className="flex justify-center p-4" id="pagination">
            <nav className="flex items-center">
              <button
                className="flex items-center justify-center mx-1"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid #979797",
                  backgroundColor: "#ffffff",
                  color: "#202224",
                }}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <FiChevronLeft size={16} />
              </button>

              <button
                className="flex items-center justify-center mx-1"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid #979797",
                  backgroundColor: "#ffffff",
                  color: "#202224",
                }}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>

              <button
                className="flex items-center justify-center mx-1"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid #979797",
                  backgroundColor: "#ffffff",
                  color: "#202224",
                }}
                onClick={() => handlePageChange(2)}
              >
                2
              </button>

              <span className="mx-1">...</span>

              <button
                className="flex items-center justify-center mx-1"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid #979797",
                  backgroundColor: "#ffffff",
                  color: "#202224",
                }}
                onClick={() => handlePageChange(5)}
              >
                5
              </button>

              <button
                className="flex items-center justify-center mx-1"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid #979797",
                  backgroundColor: "#ffffff",
                  color: "#202224",
                }}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <FiChevronRight size={16} />
              </button>
            </nav>
          </div>
        </div>

        {/* Print-only content */}
        <div className="hidden print:block p-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">
              Laporan Bulanan - {currentMonth} 2025
            </h1>
            <p className="text-gray-600">Co-Working Space</p>
            <p className="text-gray-600">
              Tanggal Cetak: {new Date().toLocaleDateString("id-ID")}
            </p>
          </div>

          <div className="mb-4">
            <p>
              <strong>Total Pendapatan:</strong> Rp {calculateTotalRevenue()}
            </p>
            <p>
              <strong>Jumlah Transaksi:</strong> {reports.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Laporan;
