import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import Header from './Headeradmin';
import kelolaPelangganImage from '../assets/kelola-pelanggan.png';

function KelolaPelanggan() {
  // State untuk data pelanggan
  const [customers, setCustomers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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
    confirmPassword: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/admin/customers/list`);
      setCustomers(response.data);
      // Perhitungan total halaman berdasarkan jumlah data
      setTotalPages(Math.ceil(response.data.length / 10));
      console.log('Customers loaded:', response.data.length);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast.error('Error fetching customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddCustomer = () => {
    resetForm();
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleEditCustomer = customer => {
    setSelectedCustomer(customer);
    setFormData({
      username: customer.username,
      email: customer.email,
      komunitas: customer.komunitas,
      password: '',
      confirmPassword: '',
    });
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleViewCustomer = customer => {
    setSelectedCustomer(customer);
    setFormData({
      username: customer.username,
      email: customer.email,
      komunitas: customer.komunitas,
      password: '',
      confirmPassword: '',
    });
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      try {
        // Convert formatted ID (0001) to numeric ID for API
        const numericId = parseInt(id);

        await axios.delete(`${apiUrl}/api/admin/customers/${numericId}`);

        // Remove customer from state
        setCustomers(customers.filter(customer => customer.id !== id));
        toast.success('Pelanggan berhasil dihapus');
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error(error.response?.data?.error || 'Error deleting customer');
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validasi form
    if (modalType === 'add' || modalType === 'edit') {
      if (!formData.username || !formData.email || !formData.komunitas) {
        toast.error('Semua field harus diisi');
        return;
      }

      if (
        modalType === 'add' &&
        formData.password !== formData.confirmPassword
      ) {
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
          komunitas: formData.komunitas,
        };

        setCustomers([...customers, newCustomer]);
        toast.success('Pelanggan berhasil ditambahkan');
      } else if (modalType === 'edit') {
        // Convert formatted ID (0001) to numeric ID for API
        const numericId = parseInt(selectedCustomer.id);

        const updateData = {
          username: formData.username,
          email: formData.email,
          komunitas: formData.komunitas,
        };

        const response = await axios.put(
          `${apiUrl}/api/admin/customers/${numericId}`,
          updateData,
        );

        // Update state with response data
        const updatedCustomers = customers.map(customer => {
          if (customer.id === selectedCustomer.id) {
            return response.data;
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
      confirmPassword: '',
    });
    setSelectedCustomer(null);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    // Uncomment dan sesuaikan ini ketika API paginasi sudah siap
    // fetchCustomers(page);
  };

  // Function untuk handle search
  const handleSearch = query => {
    // Implementasi search untuk filter pelanggan
    console.log('Search query:', query);
    // Bisa ditambahkan logika untuk filter customers berdasarkan query
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
          <h1 className="text-2xl font-semibold">Data Pelanggan</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari data pelanggan..."
                className="px-4 py-2 border rounded-full focus:outline-none placeholder-blue-600"
                style={{
                  borderColor: '#0070D8',
                  color: '#0070D8',
                  width: '222px',
                  height: '28px',
                  fontSize: '14px',
                }}
                onFocus={e =>
                  (e.target.style.boxShadow =
                    '0 0 0 2px rgba(0, 112, 216, 0.5)')
                }
                onBlur={e => (e.target.style.boxShadow = 'none')}
              />
              <style jsx>{`
                input::placeholder {
                  color: #0070d8;
                }
              `}</style>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-4">
          <div
            className="bg-white rounded-lg border border-gray-100 overflow-hidden"
            style={{
              boxShadow: '6px 6px 54px rgba(0, 0, 0, 0.05)',
            }}
          >
            <table className="min-w-full">
              <thead>
                <tr
                  className="text-white"
                  style={{ backgroundColor: '#0070D8' }}
                >
                  <th
                    className="py-3 px-4 text-center"
                    style={{
                      borderTopLeftRadius: '500px',
                      borderBottomLeftRadius: '500px',
                    }}
                  >
                    ID
                  </th>
                  <th className="py-3 px-4 text-center">Username</th>
                  <th className="py-3 px-4 text-center">Email</th>
                  <th className="py-3 px-4 text-center">Gambar</th>
                  <th className="py-3 px-4 text-center">Komunitas</th>
                  <th
                    className="py-3 px-4 text-center"
                    style={{
                      borderTopRightRadius: '500px',
                      borderBottomRightRadius: '500px',
                    }}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody style={{ opacity: '0.8' }}>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2">Loading customers...</span>
                      </div>
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Tidak ada data pelanggan
                    </td>
                  </tr>
                ) : (
                  customers.map(customer => (
                    <tr key={customer.id} className="border-b">
                      <td className="py-3 px-4 text-center">{customer.id}</td>
                      <td className="py-3 px-4 text-center">
                        {customer.username}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {customer.email}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <img
                          src={customer.profilePhoto || kelolaPelangganImage}
                          alt="Profile"
                          className="w-8 h-8 rounded-full mx-auto object-cover"
                          onError={e => {
                            e.target.src = kelolaPelangganImage;
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        {customer.komunitas}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex space-x-2 justify-center">
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
                  &lt;
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
                  {modalType === 'add'
                    ? 'Tambah Pelanggan'
                    : modalType === 'edit'
                    ? 'Edit Pelanggan'
                    : 'Detail Pelanggan'}
                </h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <IoClose size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Username
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Komunitas
                  </label>
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
                      <label className="block text-sm font-medium mb-2">
                        Password
                      </label>
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
                      <label className="block text-sm font-medium mb-2">
                        Konfirmasi Password
                      </label>
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
    </div>
  );
}

export default KelolaPelanggan;
