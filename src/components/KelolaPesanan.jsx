import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEdit, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

function KelolaPesanan() {
  // State untuk data pesanan
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: 'Maxwell',
      community: 'Komunitas Remaja Sehat',
      orderName: 'Aplikasi Database Relawan',
      catalog: 'Produk',
      category: 'Satuan',
      orderDate: '11.06.2025',
      status: 'Selesai'
    },
    {
      id: 2,
      customerName: 'Kalonanti',
      community: 'Komunitas Pemuda Indonesia',
      orderName: 'Aplikasi Absen Staf',
      catalog: 'Layanan',
      category: 'Paket',
      orderDate: '12.06.2025',
      status: 'Sedang Diproses'
    },
    {
      id: 3,
      customerName: 'Ajengayah',
      community: 'Komunitas PIK Remaja Bandung',
      orderName: 'Aplikasi Pelaporan Bulanan',
      catalog: 'Produk',
      category: 'Satuan',
      orderDate: '17.06.2025',
      status: 'Belum Diproses'
    }
  ]);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  
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
    description: ''
  });
  
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch data pesanan saat komponen dimuat
  useEffect(() => {
    // fetchOrders();
  }, []);

  // Function untuk mendapatkan data pesanan dari API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/orders`);
      setOrders(response.data);
      // Perhitungan total halaman berdasarkan jumlah data
      setTotalPages(Math.ceil(response.data.length / 10));
    } catch (error) {
      console.error('Error fetching order data:', error);
      toast.error('Error fetching order data');
    }
  };

  // Handler untuk perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handler untuk membuka modal tambah pesanan
  const handleAddOrder = () => {
    setSelectedOrder(null);
    const today = new Date();
    const formattedDate = `${today.getDate()} ${getMonthName(today.getMonth())} ${today.getFullYear()}, ${today.getHours()}:${String(today.getMinutes()).padStart(2, '0')} WIB`;
    
    setFormData({
      customerName: '',
      community: '',
      orderName: '',
      orderDate: formattedDate,
      status: 'Belum Diproses',
      catalog: 'Produk',
      category: 'Paket',
      description: ''
    });
    setIsModalOpen(true);
  };

  // Helper function untuk mendapatkan nama bulan
  const getMonthName = (monthIndex) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[monthIndex];
  };

  // Handler untuk edit status pesanan
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setFormData({
      customerName: order.customerName,
      community: order.community,
      orderName: order.orderName,
      orderDate: formatOrderDate(order.orderDate),
      status: order.status,
      catalog: order.catalog,
      category: order.category,
      description: order.description || 'Anda sudah menandatangani Surat Perjanjian Kerjasama, admin akan menghubungi anda untuk proses selanjutnya'
    });
    setIsModalOpen(true);
  };

  // Helper function untuk format tanggal
  const formatOrderDate = (dateStr) => {
    // Format from DD.MM.YYYY to DD Bulan YYYY, HH:MM WIB
    const [day, month, year] = dateStr.split('.');
    return `${day} ${getMonthName(parseInt(month) - 1)} ${year}, 19:05 WIB`;
  };

  // Handler untuk melihat detail pesanan
  const handleViewOrder = (order) => {
    handleEditOrder(order); // Reuse the edit handler but disable editing
  };

  // Handler untuk filter status
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedOrder) {
        // Update existing order
        const updatedOrder = {
          ...selectedOrder,
          status: formData.status,
          description: formData.description
        };
        
        // await axios.put(`${apiUrl}/api/orders/${selectedOrder.id}`, updatedOrder);
        
        const updatedOrders = orders.map(order => 
          order.id === selectedOrder.id ? updatedOrder : order
        );
        setOrders(updatedOrders);
        toast.success('Status pesanan berhasil diperbarui');
      } else {
        // Add new order
        const newOrder = {
          id: Date.now(),
          customerName: formData.customerName,
          community: formData.community,
          orderName: formData.orderName,
          catalog: formData.catalog,
          category: formData.category,
          orderDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).replace(/\//g, '.'),
          status: formData.status,
          description: formData.description
        };
        
        // const response = await axios.post(`${apiUrl}/api/orders`, newOrder);
        
        setOrders([...orders, newOrder]);
        toast.success('Pesanan berhasil ditambahkan');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Error saving order');
    }
  };

  // Handler untuk pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter orders based on status
  const filteredOrders = statusFilter === 'Semua' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-500 text-white';
      case 'Sedang Diproses':
        return 'bg-blue-500 text-white';
      case 'Belum Diproses':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="h-screen bg-gray-50 w-full">
      <ToastContainer />
      
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Data Pesanan</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari data pesanan..."
              className="px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="Semua">Semua</option>
              <option value="Selesai">Selesai</option>
              <option value="Sedang Diproses">Sedang Diproses</option>
              <option value="Belum Diproses">Belum Diproses</option>
            </select>
            <span className="absolute right-3 top-2.5 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
          
          <button 
            onClick={handleAddOrder}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
          >
            <span>Cari data pesanan</span>
          </button>
        </div>
      </div>
      
      {/* Table */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-left">Nama Pelanggan</th>
                <th className="py-3 px-4 text-left">Komunitas</th>
                <th className="py-3 px-4 text-left">Nama Pesanan</th>
                <th className="py-3 px-4 text-left">Katalog</th>
                <th className="py-3 px-4 text-left">Kategori</th>
                <th className="py-3 px-4 text-left">Tanggal Bayar</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">{order.community}</td>
                  <td className="py-3 px-4">{order.orderName}</td>
                  <td className="py-3 px-4">{order.catalog}</td>
                  <td className="py-3 px-4">{order.category}</td>
                  <td className="py-3 px-4">{order.orderDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="text-green-500 hover:text-green-700"
                        title="Lihat"
                        onClick={() => handleViewOrder(order)}
                      >
                        <FiEye size={18} />
                      </button>
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                        onClick={() => handleEditOrder(order)}
                      >
                        <FiEdit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
              <h2 className="text-2xl font-bold mb-6">Buat Informasi Proses Orderan</h2>
              <hr className="mb-6" />
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-lg font-semibold mb-2">Nama Pembeli</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      readOnly={selectedOrder !== null}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-semibold mb-2">Komunitas</label>
                    <input
                      type="text"
                      name="community"
                      value={formData.community}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      readOnly={selectedOrder !== null}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-lg font-semibold mb-2">Nama Pesanan</label>
                    <input
                      type="text"
                      name="orderName"
                      value={formData.orderName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      readOnly={selectedOrder !== null}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-semibold mb-2">Tanggal</label>
                    <input
                      type="text"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      readOnly={true}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-lg font-semibold mb-2">Status</label>
                    <div className="relative">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none"
                        required
                      >
                        <option value="Sedang Diproses">Sedang Diproses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Belum Diproses">Belum Diproses</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-lg font-semibold mb-2">Katalog</label>
                    <div className="relative">
                      <select
                        name="catalog"
                        value={formData.catalog}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none"
                        disabled={selectedOrder !== null}
                        required
                      >
                        <option value="Produk">Produk</option>
                        <option value="Layanan">Layanan</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-lg font-semibold mb-2">Kategori</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none"
                        disabled={selectedOrder !== null}
                        required
                      >
                        <option value="Paket">Paket</option>
                        <option value="Satuan">Satuan</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-lg font-semibold mb-2">Deskripsi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32"
                    placeholder="Tambahkan informasi tentang proses orderan"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg"
                >
                  Tambah
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KelolaPesanan;