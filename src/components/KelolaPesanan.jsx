import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
} from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import Header from './Headeradmin';

function KelolaPesanan() {
  // State untuk data pesanan - akan diisi dari API
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State untuk filter
  const [statusFilter, setStatusFilter] = useState('Semua');

  // State untuk form
  const [formData, setFormData] = useState({
    customerName: '',
    community: '',
    orderName: '',
    orderDate: '',
    status: '',
    catalog: '',
    category: '',
    description: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch data pesanan saat komponen dimuat
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function untuk mendapatkan data pesanan yang sudah dibayar dari API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching paid orders from API...');

      const response = await axios.get(`${apiUrl}/api/payment/orders/pesanan`);

      if (response.data.success) {
        setOrders(response.data.orders);
        // Perhitungan total halaman berdasarkan jumlah data
        setTotalPages(Math.ceil(response.data.orders.length / 10));
        console.log('✅ Paid orders loaded:', response.data.orders.length);
      } else {
        console.error('Failed to fetch orders:', response.data.message);
        toast.error('Gagal memuat data pesanan');
      }
    } catch (error) {
      console.error('Error fetching paid orders:', error);
      toast.error('Error memuat data pesanan yang sudah dibayar');
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk perubahan input form
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler untuk membuka modal tambah pesanan
  const handleAddOrder = () => {
    setSelectedOrder(null);
    const today = new Date();
    const formattedDate = `${today.getDate()} ${getMonthName(
      today.getMonth(),
    )} ${today.getFullYear()}, ${today.getHours()}:${String(
      today.getMinutes(),
    ).padStart(2, '0')} WIB`;

    setFormData({
      customerName: '',
      community: '',
      orderName: '',
      orderDate: formattedDate,
      status: 'belum diproses',
      catalog: 'Produk',
      category: 'Paket',
      description: '',
    });
    setIsModalOpen(true);
  };

  // Helper function untuk mendapatkan nama bulan
  const getMonthName = monthIndex => {
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    return months[monthIndex];
  };

  // Handler untuk edit status pesanan
  const handleEditOrder = order => {
    setSelectedOrder(order);
    setFormData({
      customerName: order.customerName,
      community: order.community,
      orderName: order.orderName,
      orderDate: formatOrderDate(order.orderDate),
      status: order.status,
      catalog: order.catalog,
      category: order.category,
      description:
        order.description ||
        'Anda sudah menandatangani Surat Perjanjian Kerjasama, admin akan menghubungi anda untuk proses selanjutnya',
    });
    setIsModalOpen(true);
  };

  // Helper function untuk format tanggal
  const formatOrderDate = dateStr => {
    // Format from DD.MM.YYYY to DD Bulan YYYY, HH:MM WIB
    const [day, month, year] = dateStr.split('.');
    return `${day} ${getMonthName(parseInt(month) - 1)} ${year}, 19:05 WIB`;
  };

  // Handler untuk melihat detail pesanan
  const handleViewOrder = order => {
    handleEditOrder(order); // Reuse the edit handler but disable editing
  };

  // Handler untuk navigasi ke halaman pesan
  const handleMessageOrder = order => {
    console.log('Navigating to message page for order:', order);
    console.log('User ID:', order.userId);
    console.log('Customer Name:', order.customerName);
    console.log('Email:', order.email);

    // Check if userId is available
    if (!order.userId) {
      alert(
        'User ID tidak tersedia untuk pesanan ini. Silakan hubungi customer secara manual.',
      );
      return;
    }

    // Validate userId is a valid number
    const userId = parseInt(order.userId);
    if (isNaN(userId) || userId <= 0) {
      alert(
        'User ID tidak valid untuk pesanan ini. Silakan hubungi customer secara manual.',
      );
      return;
    }

    // Navigate to chat page with user data
    window.location.href = `/aadmin/pesan?userId=${userId}&customerName=${encodeURIComponent(
      order.customerName,
    )}&orderId=${order.orderId}&email=${encodeURIComponent(
      order.email || 'customer@example.com',
    )}`;
  };

  // Handler untuk filter status
  const handleStatusFilterChange = e => {
    setStatusFilter(e.target.value);
  };

  // Handler untuk submit form
  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (selectedOrder) {
        // Update admin status for existing order via API
        console.log(
          'Updating admin status for order:',
          selectedOrder.orderId,
          'to:',
          formData.status,
        );

        const response = await axios.put(
          `${apiUrl}/api/payment/orders/${selectedOrder.orderId}/admin-status`,
          { adminStatus: formData.status },
        );

        if (response.data.success) {
          // Update local state to reflect the change
          const updatedOrders = orders.map(order =>
            order.orderId === selectedOrder.orderId
              ? {
                  ...order,
                  status: formData.status,
                  adminStatus: formData.status,
                }
              : order,
          );
          setOrders(updatedOrders);
          toast.success('Status pesanan berhasil diperbarui');
        } else {
          toast.error('Gagal memperbarui status pesanan');
        }
      } else {
        // Adding new order is not allowed for paid orders
        toast.warning(
          'Tidak dapat menambah pesanan baru. Pesanan harus melalui proses pembayaran di aplikasi mobile.',
        );
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error('Error memperbarui status pesanan');
    }
  };

  // Handler untuk pagination
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  // Filter orders based on status
  const filteredOrders =
    statusFilter === 'Semua'
      ? orders
      : orders.filter(order => order.status === statusFilter);

  // Get status badge class
  const getStatusBadgeClass = status => {
    switch (status) {
      case 'selesai':
        return 'text-white';
      case 'sedang diproses':
        return 'text-white';
      case 'belum diproses':
        return 'text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = status => {
    switch (status) {
      case 'selesai':
        return { backgroundColor: '#00B69B', color: '#ffffff' };
      case 'sedang diproses':
        return { backgroundColor: '#0070D8', color: '#ffffff' };
      case 'belum diproses':
        return { backgroundColor: '#FF3E43', color: '#ffffff' };
      default:
        return { backgroundColor: '#6B7280', color: '#ffffff' };
    }
  };

  // Format status display
  const formatStatusDisplay = status => {
    switch (status) {
      case 'selesai':
        return 'Selesai';
      case 'sedang diproses':
        return 'Sedang Diproses';
      case 'belum diproses':
        return 'Belum Diproses';
      default:
        return status;
    }
  };

  // Function untuk handle search
  const handleSearch = query => {
    // Implementasi search untuk filter pesanan
    console.log('Search query:', query);
    // Bisa ditambahkan logika untuk filter orders berdasarkan query
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
          <h1 className="text-2xl font-semibold">Data Pesanan</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari data pesanan..."
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#0070D8',
                  color: '#0070D8',
                  width: '222px',
                  height: '28px',
                  fontSize: '14px',
                }}
              />
              <style jsx>{`
                input::placeholder {
                  color: #0070d8;
                }
              `}</style>
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="px-3 py-1 pr-8 border rounded-full focus:outline-none focus:ring-2 appearance-none flex items-center"
                style={{
                  borderColor: '#00B69B',
                  color: '#00B69B',
                  width: '136px',
                  height: '28px',
                  fontSize: '12px',
                  lineHeight: '1.2',
                }}
              >
                <option value="Semua">Semua</option>
                <option value="selesai">Selesai</option>
                <option value="sedang diproses">Sedang Diproses</option>
                <option value="belum diproses">Belum Diproses</option>
              </select>
              <span className="absolute right-2 top-2 pointer-events-none">
                <svg
                  className="h-4 w-4"
                  style={{ color: '#00B69B' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-lg drop-shadow-md border border-gray-100 overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th
                    className="py-3 px-4 text-center font-bold"
                    style={{
                      borderTopLeftRadius: '500px',
                      borderBottomLeftRadius: '500px',
                      fontSize: '14px',
                    }}
                  >
                    Nama Pelanggan
                  </th>
                  <th
                    className="py-3 px-4 text-center font-bold"
                    style={{ fontSize: '14px' }}
                  >
                    Komunitas
                  </th>
                  <th
                    className="py-3 px-4 text-center font-bold"
                    style={{ fontSize: '14px' }}
                  >
                    Nama Pesanan
                  </th>
                  <th
                    className="py-3 px-4 text-center font-bold"
                    style={{ fontSize: '14px' }}
                  >
                    Katalog
                  </th>
                  <th
                    className="py-3 px-4 text-center font-bold"
                    style={{ fontSize: '14px' }}
                  >
                    Kategori
                  </th>
                  <th
                    className="py-3 px-4 text-center font-bold"
                    style={{ fontSize: '14px' }}
                  >
                    Tanggal Bayar
                  </th>
                  <th
                    className="py-3 px-4 text-center font-bold"
                    style={{ fontSize: '14px' }}
                  >
                    Status
                  </th>
                  <th
                    className="py-3 px-4 text-center font-bold"
                    style={{
                      borderTopRightRadius: '500px',
                      borderBottomRightRadius: '500px',
                      fontSize: '14px',
                    }}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Memuat data pesanan...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      Belum ada pesanan yang sudah dibayar
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="border-b">
                      <td
                        className="py-3 px-4 text-center"
                        style={{ opacity: 0.8 }}
                      >
                        {order.customerName}
                      </td>
                      <td
                        className="py-3 px-4 text-center"
                        style={{ opacity: 0.8 }}
                      >
                        {order.community}
                      </td>
                      <td
                        className="py-3 px-4 text-center"
                        style={{ opacity: 0.8 }}
                      >
                        {order.orderName}
                      </td>
                      <td
                        className="py-3 px-4 text-center"
                        style={{ opacity: 0.8 }}
                      >
                        {order.catalog}
                      </td>
                      <td
                        className="py-3 px-4 text-center"
                        style={{ opacity: 0.8 }}
                      >
                        {order.category}
                      </td>
                      <td
                        className="py-3 px-4 text-center"
                        style={{ opacity: 0.8 }}
                      >
                        {order.orderDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeClass(
                            order.status,
                          )}`}
                          style={{
                            ...getStatusBadgeStyle(order.status),
                            opacity: 1,
                            width: '145px',
                            display: 'inline-block',
                            textAlign: 'center',
                          }}
                        >
                          {formatStatusDisplay(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            title="Kirim Pesan"
                            onClick={() => handleMessageOrder(order)}
                          >
                            <FiMessageSquare size={18} />
                          </button>
                          <button
                            className="text-green-500 hover:text-green-700"
                            title="Edit"
                            onClick={() => handleEditOrder(order)}
                          >
                            <FiEdit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center p-4">
              <nav className="flex items-center">
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #979797',
                    backgroundColor: '#ffffff',
                    color: '#202224',
                  }}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <FiChevronLeft size={16} />
                </button>

                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #979797',
                    backgroundColor: '#ffffff',
                    color: '#202224',
                  }}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>

                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #979797',
                    backgroundColor: '#ffffff',
                    color: '#202224',
                  }}
                  onClick={() => handlePageChange(2)}
                >
                  2
                </button>

                <span className="mx-1">...</span>

                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #979797',
                    backgroundColor: '#ffffff',
                    color: '#202224',
                  }}
                  onClick={() => handlePageChange(5)}
                >
                  5
                </button>

                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #979797',
                    backgroundColor: '#ffffff',
                    color: '#202224',
                  }}
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <FiChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Modal Update Order Status */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <div className="p-6 pt-0">
                <h2 className="text-2xl font-bold mb-6">
                  Buat Informasi Proses Orderan
                </h2>
                <hr className="mb-6" />

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-lg font-semibold mb-2">
                        Nama Pembeli
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                        style={{
                          borderRadius: '17px',
                          color: selectedOrder !== null ? '#979797' : '#000000',
                          backgroundColor:
                            selectedOrder !== null ? '#f5f5f5' : '#ffffff',
                        }}
                        readOnly={selectedOrder !== null}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-2">
                        Komunitas
                      </label>
                      <input
                        type="text"
                        name="community"
                        value={formData.community}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                        style={{
                          borderRadius: '17px',
                          color: selectedOrder !== null ? '#979797' : '#000000',
                          backgroundColor:
                            selectedOrder !== null ? '#f5f5f5' : '#ffffff',
                        }}
                        readOnly={selectedOrder !== null}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-lg font-semibold mb-2">
                        Nama Pesanan
                      </label>
                      <input
                        type="text"
                        name="orderName"
                        value={formData.orderName}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                        style={{
                          borderRadius: '17px',
                          color: selectedOrder !== null ? '#979797' : '#000000',
                          backgroundColor:
                            selectedOrder !== null ? '#f5f5f5' : '#ffffff',
                        }}
                        readOnly={selectedOrder !== null}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-2">
                        Tanggal
                      </label>
                      <input
                        type="text"
                        name="orderDate"
                        value={formData.orderDate}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                        style={{
                          borderRadius: '17px',
                          color: '#000000',
                          backgroundColor: '#ffffff',
                        }}
                        readOnly={false}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-lg font-semibold mb-2">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full border-2 border-gray-300 px-4 py-2 appearance-none focus:outline-none focus:border-black"
                          style={{
                            borderRadius: '17px',
                            color: '#000000',
                            backgroundColor: '#ffffff',
                          }}
                          required
                        >
                          <option value="belum diproses">Belum Diproses</option>
                          <option value="sedang diproses">
                            Sedang Diproses
                          </option>
                          <option value="selesai">Selesai</option>
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
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-2">
                        Katalog
                      </label>
                      <div className="relative">
                        <select
                          name="catalog"
                          value={formData.catalog}
                          onChange={handleInputChange}
                          className="w-full border-2 border-gray-300 px-4 py-2 appearance-none focus:outline-none focus:border-black"
                          style={{
                            borderRadius: '17px',
                            color:
                              selectedOrder !== null ? '#979797' : '#000000',
                            backgroundColor:
                              selectedOrder !== null ? '#f5f5f5' : '#ffffff',
                          }}
                          disabled={selectedOrder !== null}
                          required
                        >
                          <option value="Produk">Produk</option>
                          <option value="Layanan">Layanan</option>
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
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-2">
                        Kategori
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full border-2 border-gray-300 px-4 py-2 appearance-none focus:outline-none focus:border-black"
                          style={{
                            borderRadius: '17px',
                            color:
                              selectedOrder !== null ? '#979797' : '#000000',
                            backgroundColor:
                              selectedOrder !== null ? '#f5f5f5' : '#ffffff',
                          }}
                          disabled={selectedOrder !== null}
                          required
                        >
                          <option value="Paket">Paket</option>
                          <option value="Satuan">Satuan</option>
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
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-lg font-semibold mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 h-32 focus:outline-none focus:border-black"
                      style={{
                        borderRadius: '17px',
                        color: '#000000',
                        backgroundColor: '#ffffff',
                      }}
                      placeholder="Tambahkan informasi tentang proses orderan"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full hover:opacity-90 text-white font-semibold py-3 px-4"
                    style={{
                      backgroundColor: '#0070D8',
                      borderRadius: '17px',
                    }}
                  >
                    Tambah
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KelolaPesanan;
