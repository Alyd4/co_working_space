import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEdit, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

function KelolaPromosi() {
  // State untuk data promosi
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      discount: '20%',
      imageUrl: 'https://via.placeholder.com/150',
      name: 'Aplikasi Database Relawan',
      catalog: 'Produk',
      category: 'Satuan'
    },
    {
      id: 2,
      discount: '50%',
      imageUrl: 'https://via.placeholder.com/150',
      name: 'Aplikasi Absen Staf',
      catalog: 'Layanan',
      category: 'Paket'
    },
    {
      id: 3,
      discount: '10%',
      imageUrl: 'https://via.placeholder.com/150',
      name: 'Aplikasi Pelaporan Bulanan',
      catalog: 'Produk',
      category: 'Satuan'
    }
  ]);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  
  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  
  // State untuk form
  const [formData, setFormData] = useState({
    catalog: 'Produk',
    category: 'Paket',
    productName: '',
    discount: ''
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // State untuk daftar produk
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Aplikasi Database Relawan',
      catalog: 'Produk',
      category: 'Satuan'
    },
    {
      id: 2,
      name: 'Aplikasi Absen Staf',
      catalog: 'Layanan',
      category: 'Paket'
    },
    {
      id: 3,
      name: 'Aplikasi Pelaporan Bulanan',
      catalog: 'Produk',
      category: 'Satuan'
    }
  ]);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch data promosi saat komponen dimuat
  useEffect(() => {
    // fetchPromotions();
  }, []);

  // Function untuk mendapatkan data promosi dari API
  const fetchPromotions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/promotions`);
      setPromotions(response.data);
      // Perhitungan total halaman berdasarkan jumlah data
      setTotalPages(Math.ceil(response.data.length / 10));
    } catch (error) {
      console.error('Error fetching promotion data:', error);
      toast.error('Error fetching promotion data');
    }
  };

  // Handler untuk input file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error('Please upload a valid image file');
      setImage(null);
      setImagePreview(null);
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

  // Handler untuk membuka modal tambah promosi
  const handleAddPromotion = () => {
    setSelectedPromotion(null);
    setFormData({
      catalog: 'Produk',
      category: 'Paket',
      productName: '',
      discount: ''
    });
    setImage(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  // Handler untuk edit promosi
  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      catalog: promotion.catalog,
      category: promotion.category,
      productName: promotion.name,
      discount: promotion.discount.replace('%', '')
    });
    setImagePreview(promotion.imageUrl);
    setIsModalOpen(true);
  };

  // Handler untuk hapus promosi
  const handleDeletePromotion = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus promosi ini?')) {
      try {
        // await axios.delete(`${apiUrl}/api/promotions/${id}`);
        
        // Untuk sementara gunakan filter untuk menghapus dari state
        setPromotions(promotions.filter(promo => promo.id !== id));
        toast.success('Promosi berhasil dihapus');
      } catch (error) {
        console.error('Error deleting promotion:', error);
        toast.error('Error deleting promotion');
      }
    }
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.productName || !formData.discount) {
      toast.error('Semua field harus diisi');
      return;
    }
    
    // Format discount untuk memastikan ada symbol %
    const discount = formData.discount.endsWith('%') ? formData.discount : `${formData.discount}%`;
    
    try {
      const newPromotion = {
        id: selectedPromotion ? selectedPromotion.id : Date.now(),
        discount,
        name: formData.productName,
        catalog: formData.catalog,
        category: formData.category,
        imageUrl: imagePreview || 'https://via.placeholder.com/150'
      };
      
      if (selectedPromotion) {
        // Edit existing promotion
        // await axios.put(`${apiUrl}/api/promotions/${selectedPromotion.id}`, newPromotion);
        
        const updatedPromotions = promotions.map(promo => 
          promo.id === selectedPromotion.id ? newPromotion : promo
        );
        setPromotions(updatedPromotions);
        toast.success('Promosi berhasil diperbarui');
      } else {
        // Add new promotion
        // const response = await axios.post(`${apiUrl}/api/promotions`, newPromotion);
        
        setPromotions([...promotions, newPromotion]);
        toast.success('Promosi berhasil ditambahkan');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error('Error saving promotion');
    }
  };

  // Handler untuk pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-screen bg-gray-50 w-full">
      <ToastContainer />
      
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Data Promosi</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari data produk/layanan..."
              className="px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          <button 
            onClick={handleAddPromotion}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
          >
            <span>Tambah Data</span>
          </button>
        </div>
      </div>
      
      {/* Table */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-left">Potongan Harga</th>
                <th className="py-3 px-4 text-left">Gambar</th>
                <th className="py-3 px-4 text-left">Nama Pesanan</th>
                <th className="py-3 px-4 text-left">Katalog</th>
                <th className="py-3 px-4 text-left">Kategori</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr key={promotion.id} className="border-b">
                  <td className="py-3 px-4">{promotion.discount}</td>
                  <td className="py-3 px-4">
                    <img 
                      src={promotion.imageUrl} 
                      alt={promotion.name} 
                      className="w-12 h-12 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </td>
                  <td className="py-3 px-4">{promotion.name}</td>
                  <td className="py-3 px-4">{promotion.catalog}</td>
                  <td className="py-3 px-4">{promotion.category}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="text-green-500 hover:text-green-700"
                        title="Lihat"
                      >
                        <FiEye size={18} />
                      </button>
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                        onClick={() => handleEditPromotion(promotion)}
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        title="Hapus"
                        onClick={() => handleDeletePromotion(promotion.id)}
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
      
      {/* Modal Tambah/Edit Promosi */}
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
              <h2 className="text-2xl font-bold mb-6">Buat Promosi Produk / Layanan</h2>
              <hr className="mb-6" />
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Tambah gambar</h3>
                  <div className="border-2 border-blue-300 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-64">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer text-center">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-48 mx-auto"
                        />
                      ) : (
                        <>
                          <div className="bg-white rounded-full p-3 shadow-md inline-block mb-3">
                            <FiUploadCloud size={24} className="text-gray-400" />
                          </div>
                          <p className="text-gray-500">
                            Click to browse or<br />
                            drag and drop your files
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-lg font-semibold mb-2">Katalog</label>
                    <div className="relative">
                      <select
                        name="catalog"
                        value={formData.catalog}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none"
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
                
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-2">Nama Produk / Layanan</label>
                  <div className="relative">
                    <select
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none"
                      required
                    >
                      <option value="">Pilih Produk/Layanan</option>
                      {products
                        .filter(product => 
                          product.catalog === formData.catalog && 
                          product.category === formData.category
                        )
                        .map(product => (
                          <option key={product.id} value={product.name}>
                            {product.name}
                          </option>
                        ))
                      }
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-lg font-semibold mb-2">Potongan Harga</label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="25%"
                    className="w-48 border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
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

export default KelolaPromosi;