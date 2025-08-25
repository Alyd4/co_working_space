import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

function KelolaPelanggan() {
  // State untuk data pelanggan
  const [customers, setCustomers] = useState([
    {
      id: '0001',
      username: 'Maxwell',
      email: 'Maxwell@sembangin.com',
      komunitas: 'Komunitas Remaja Sehat'
    },
    {
      id: '0002',
      username: 'Kalonanti',
      email: 'Kalonanti@pkbi.or.id',
      komunitas: 'Komunitas Pemuda Indonesia'
    },
    {
      id: '0003',
      username: 'Ajengayah',
      email: 'Ajeng24@gmail.com',
      komunitas: 'Komunitas PIK Remaja Bandung'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  
  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // add, edit, detail
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    komunitas: '',
    password: '',
    confirmPassword: ''
  });
  
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Uncomment ini ketika API sudah siap
    // fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/customers`);
      setCustomers(response.data);
      // Perhitungan total halaman berdasarkan jumlah data
      setTotalPages(Math.ceil(response.data.length / 10));
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast.error('Error fetching customer data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddCustomer = () => {
    resetForm();
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      username: customer.username,
      email: customer.email,
      komunitas: customer.komunitas,
      password: '',
      confirmPassword: ''
    });
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      username: customer.username,
      email: customer.email,
      komunitas: customer.komunitas,
      password: '',
      confirmPassword: ''
    });
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      try {
        // Uncomment ini ketika API sudah siap
        // await axios.delete(`${apiUrl}/api/customers/${id}`);
        
        // Untuk sementara gunakan filter untuk menghapus dari state
        setCustomers(customers.filter(customer => customer.id !== id));
        toast.success('Pelanggan berhasil dihapus');
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error('Error deleting customer');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (modalType === 'add' || modalType === 'edit') {
      if (!formData.username || !formData.email || !formData.komunitas) {
        toast.error('Semua field harus diisi');
        return;
      }
      
      if (modalType === 'add' && formData.password !== formData.confirmPassword) {
        toast.error('Password tidak cocok');
        return;
      }
    }
    
    try {
      if (modalType === 'add') {
        // Uncomment ini ketika API sudah siap
        // const response = await axios.post(`${apiUrl}/api/customers`, formData);
        
        // Untuk sementara tambahkan ke state
        const newCustomer = {
          id: `000${customers.length + 1}`,
          username: formData.username,
          email: formData.email,
          komunitas: formData.komunitas
        };
        
        setCustomers([...customers, newCustomer]);
        toast.success('Pelanggan berhasil ditambahkan');
      } else if (modalType === 'edit') {
        // Uncomment ini ketika API sudah siap
        // await axios.put(`${apiUrl}/api/customers/${selectedCustomer.id}`, formData);
        
        // Untuk sementara update state
        const updatedCustomers = customers.map(customer => {
          if (customer.id === selectedCustomer.id) {
            return {
              ...customer,
              username: formData.username,
              email: formData.email,
              komunitas: formData.komunitas
            };
          }
          return customer;
        });
        
        setCustomers(updatedCustomers);
        toast.success('Pelanggan berhasil diperbarui');
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error('Error saving customer');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      komunitas: '',
      password: '',
      confirmPassword: ''
    });
    setSelectedCustomer(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Uncomment dan sesuaikan ini ketika API paginasi sudah siap
    // fetchCustomers(page);
  };

  return (
    <div className="h-screen bg-gray-50 w-full">
      <ToastContainer />
      
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Data Pelanggan</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari data pelanggan..."
              className="px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          <button 
            onClick={handleAddCustomer}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
          >
            <span>Cari data pelanggan</span>
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
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Gambar</th>
                <th className="py-3 px-4 text-left">Komunitas</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b">
                  <td className="py-3 px-4">{customer.id}</td>
                  <td className="py-3 px-4">{customer.username}</td>
                  <td className="py-3 px-4">{customer.email}</td>
                  <td className="py-3 px-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </td>
                  <td className="py-3 px-4">{customer.komunitas}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="text-green-500 hover:text-green-700"
                        title="Lihat"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <FiEye size={18} />
                      </button>
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        title="Hapus"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <FiTrash2 size={18} />
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
                &lt;
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
                &gt;
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {modalType === 'add' ? 'Tambah Pelanggan' : 
                 modalType === 'edit' ? 'Edit Pelanggan' : 
                 'Detail Pelanggan'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <IoClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  readOnly={modalType === 'view'}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={modalType === 'view'}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Komunitas</label>
                <input
                  type="text"
                  name="komunitas"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Komunitas"
                  value={formData.komunitas}
                  onChange={handleInputChange}
                  readOnly={modalType === 'view'}
                  required
                />
              </div>
              
              {modalType === 'add' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Konfirmasi Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Konfirmasi Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}
              
              {modalType !== 'view' && (
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
                >
                  {modalType === 'add' ? 'Tambah' : 'Simpan Perubahan'}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KelolaPelanggan;