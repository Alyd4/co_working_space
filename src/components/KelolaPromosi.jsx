import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEdit, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import Header from './Headeradmin';
import dataPromosi from '../assets/data-promosi.png';

function KelolaPromosi() {
  // State untuk data promosi
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      discount: '20%',
      imageUrl: dataPromosi,
      name: 'Aplikasi Database Relawan',
      catalog: 'Produk',
      category: 'Satuan',
    },
    {
      id: 2,
      discount: '50%',
      imageUrl: dataPromosi,
      name: 'Aplikasi Absen Staf',
      catalog: 'Layanan',
      category: 'Paket',
    },
    {
      id: 3,
      discount: '10%',
      imageUrl: dataPromosi,
      name: 'Aplikasi Pelaporan Bulanan',
      catalog: 'Produk',
      category: 'Satuan',
    },
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
    discount: '',
    selectedProductId: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State untuk daftar produk dari database
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch data promosi dan produk saat komponen dimuat
  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

  // Function untuk mendapatkan data produk dari API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/item`);
      console.log('Products loaded:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    }
  };

  // Function untuk mendapatkan data promosi dari API
  const fetchPromotions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/promotion`);
      console.log('Promotions loaded:', response.data);
      console.log('Sample promotion:', response.data[0]);
      setPromotions(response.data);
      // Perhitungan total halaman berdasarkan jumlah data
      setTotalPages(Math.ceil(response.data.length / 10));
    } catch (error) {
      console.error('Error fetching promotion data:', error);
      toast.error('Error fetching promotion data');
    }
  };

  // Function untuk handle product selection
  const handleProductSelect = productId => {
    const product = products.find(p => p.id.toString() === productId);
    if (product) {
      setSelectedProduct(product);
      setOriginalPrice(parseFloat(product.harga) || 0);
      setFormData(prev => ({
        ...prev,
        selectedProductId: productId,
        productName: product.nama,
        catalog: product.kategori || 'Produk',
        category: product.katalog || 'Satuan',
      }));

      // Recalculate discount if discount value exists
      if (formData.discount) {
        calculateDiscount(
          parseFloat(product.harga) || 0,
          parseFloat(formData.discount),
        );
      }
    }
  };

  // Function untuk calculate discount
  const calculateDiscount = (price, discountPercent) => {
    if (
      price &&
      discountPercent &&
      discountPercent > 0 &&
      discountPercent <= 100
    ) {
      const discountAmount = (price * discountPercent) / 100;
      const finalPrice = price - discountAmount;
      setDiscountedPrice(finalPrice);
    } else {
      setDiscountedPrice(price);
    }
  };

  // Function untuk handle discount input
  const handleDiscountChange = value => {
    const discountValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, discount: value }));

    if (originalPrice > 0) {
      calculateDiscount(originalPrice, discountValue);
    }
  };

  // Handler untuk input file
  const handleFileChange = e => {
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
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler untuk membuka modal tambah promosi
  const handleAddPromotion = () => {
    setSelectedPromotion(null);
    setFormData({
      catalog: 'Produk',
      category: 'Paket',
      productName: '',
      discount: '',
      selectedProductId: '',
    });
    setImage(null);
    setImagePreview(null);
    setSelectedProduct(null);
    setOriginalPrice(0);
    setDiscountedPrice(0);
    setIsModalOpen(true);
  };

  // Handler untuk edit promosi
  const handleEditPromotion = promotion => {
    setSelectedPromotion(promotion);
    setFormData({
      catalog: promotion.catalog,
      category: promotion.category,
      productName: promotion.productName || promotion.name,
      discount: promotion.discount.replace('%', ''),
      selectedProductId: promotion.productId || '',
    });
    setImagePreview(
      promotion.imageUrl ? `${apiUrl}${promotion.imageUrl}` : null,
    );

    // Set selected product data if available
    if (promotion.productId) {
      const product = products.find(
        p => p.id.toString() === promotion.productId.toString(),
      );
      if (product) {
        setSelectedProduct(product);
        setOriginalPrice(
          parseFloat(promotion.originalPrice) || parseFloat(product.harga) || 0,
        );
        setDiscountedPrice(parseFloat(promotion.discountedPrice) || 0);
      }
    }
    setIsModalOpen(true);
  };

  // Handler untuk hapus promosi
  const handleDeletePromotion = async id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus promosi ini?')) {
      try {
        console.log('Deleting promotion with ID:', id);

        // API call untuk hapus promosi dari database
        const response = await axios.delete(`${apiUrl}/api/promotion/${id}`);
        console.log('Promotion deleted:', response.data);

        // Refresh data dari database setelah delete
        fetchPromotions();
        toast.success('Promosi berhasil dihapus');
      } catch (error) {
        console.error('Error deleting promotion:', error);
        toast.error('Error deleting promotion');
      }
    }
  };

  // Handler untuk submit form
  const handleSubmit = async e => {
    e.preventDefault();

    // Validasi form
    if (!formData.selectedProductId || !formData.discount) {
      toast.error('Produk dan potongan harga harus diisi');
      return;
    }

    if (!selectedProduct) {
      toast.error('Silakan pilih produk terlebih dahulu');
      return;
    }

    try {
      // Prepare form data for API
      const promotionData = new FormData();
      promotionData.append('productId', formData.selectedProductId);
      promotionData.append('productName', selectedProduct.nama);
      promotionData.append('catalog', selectedProduct.kategori || 'Produk');
      promotionData.append('category', selectedProduct.katalog || 'Satuan');
      promotionData.append('discount', `${formData.discount}%`);
      promotionData.append('originalPrice', originalPrice.toString());
      promotionData.append('discountedPrice', discountedPrice.toString());

      // Add image if exists
      if (image) {
        promotionData.append('image', image);
      }

      console.log('Submitting promotion data:', {
        productId: formData.selectedProductId,
        productName: selectedProduct.nama,
        catalog: selectedProduct.kategori,
        category: selectedProduct.katalog,
        discount: `${formData.discount}%`,
        originalPrice: originalPrice,
        discountedPrice: discountedPrice,
      });

      if (selectedPromotion) {
        // Edit existing promotion
        const response = await axios.put(
          `${apiUrl}/api/promotion/${selectedPromotion.id}`,
          promotionData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Promotion updated:', response.data);
        toast.success('Promosi berhasil diperbarui');
        fetchPromotions(); // Refresh data
      } else {
        // Add new promotion
        const response = await axios.post(
          `${apiUrl}/api/promotion`,
          promotionData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Promotion created:', response.data);
        toast.success('Promosi berhasil ditambahkan');
        fetchPromotions(); // Refresh data
      }

      setIsModalOpen(false);
      handleAddPromotion(); // Reset form
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error(
        'Error saving promotion: ' +
          (error.response?.data?.error || error.message),
      );
    }
  };

  // Handler untuk pagination
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  // Function untuk handle search
  const handleSearch = query => {
    // Implementasi search untuk filter promosi
    console.log('Search query:', query);
    // Bisa ditambahkan logika untuk filter promotions berdasarkan query
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
          <h1 className="text-2xl font-semibold">Data Promosi</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari data produk/layanan..."
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 placeholder-blue-500"
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
            <button
              onClick={handleAddPromotion}
              className="px-4 py-2 rounded-full flex items-center justify-center border-2 hover:bg-green-50 transition-colors"
              style={{
                borderColor: '#00B69B',
                color: '#00B69B',
                width: '107px',
                height: '28px',
                fontSize: '11px',
              }}
            >
              <span>Tambah Data</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-lg drop-shadow-md border border-gray-100 overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr
                  style={{ backgroundColor: '#0070D8' }}
                  className="text-white"
                >
                  <th
                    className="py-3 px-4 text-center"
                    style={{
                      borderTopLeftRadius: '500px',
                      borderBottomLeftRadius: '500px',
                    }}
                  >
                    Potongan Harga
                  </th>
                  <th className="py-3 px-4 text-center">Gambar</th>
                  <th className="py-3 px-4 text-center">Nama Pesanan</th>
                  <th className="py-3 px-4 text-center">Katalog</th>
                  <th className="py-3 px-4 text-center">Kategori</th>
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
              <tbody style={{ opacity: 0.8 }}>
                {promotions.map(promotion => (
                  <tr key={promotion.id} className="border-b">
                    <td className="py-3 px-4 text-center">
                      {promotion.discount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        <img
                          src={
                            promotion.imageUrl
                              ? `${apiUrl}${promotion.imageUrl}`
                              : 'https://via.placeholder.com/150'
                          }
                          alt={promotion.productName || promotion.name}
                          className="w-12 h-12 object-cover"
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {promotion.productName || promotion.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {promotion.catalog}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {promotion.category}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
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
                <h2 className="text-2xl font-bold mb-6">
                  Buat Promosi Produk / Layanan
                </h2>
                <hr className="mb-6" />

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Tambah gambar
                    </h3>
                    <div className="flex justify-center">
                      <div
                        className="border-2 border-blue-300 border-dashed rounded-lg p-6 flex flex-col items-center justify-center"
                        style={{ width: '420px', height: '227px' }}
                      >
                        <input
                          type="file"
                          id="image-upload"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer text-center"
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-48 mx-auto"
                            />
                          ) : (
                            <>
                              <div className="bg-white rounded-full p-3 shadow-md inline-block mb-3">
                                <FiUploadCloud
                                  size={24}
                                  className="text-gray-400"
                                />
                              </div>
                              <p className="text-gray-500">
                                Click to browse or
                                <br />
                                drag and drop your files
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-lg font-semibold mb-2">
                        Nama Produk / Layanan
                      </label>
                      <div className="relative">
                        <select
                          name="selectedProductId"
                          value={formData.selectedProductId}
                          onChange={e => handleProductSelect(e.target.value)}
                          className="w-full border border-black px-4 py-2 appearance-none"
                          style={{ borderRadius: '17px', height: '38px' }}
                          required
                        >
                          <option value="">Pilih Produk/Layanan</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.nama} - Rp.{' '}
                              {parseFloat(product.harga || 0).toLocaleString(
                                'id-ID',
                              )}
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
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-2">
                        Potongan Harga (%)
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={e => handleDiscountChange(e.target.value)}
                        placeholder="25"
                        min="0"
                        max="100"
                        className="w-full border border-black px-4 py-2"
                        style={{ borderRadius: '17px', height: '38px' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Price Display Section */}
                  {selectedProduct && originalPrice > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3">
                        Preview Harga:
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Harga Asli:</span>
                          <span
                            className={`text-lg ${
                              formData.discount &&
                              parseFloat(formData.discount) > 0
                                ? 'line-through text-gray-500'
                                : 'font-semibold'
                            }`}
                          >
                            Rp. {originalPrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                        {formData.discount &&
                          parseFloat(formData.discount) > 0 && (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Diskon ({formData.discount}%):
                                </span>
                                <span className="text-red-500">
                                  -Rp.{' '}
                                  {(
                                    (originalPrice *
                                      parseFloat(formData.discount)) /
                                    100
                                  ).toLocaleString('id-ID')}
                                </span>
                              </div>
                              <div className="flex justify-between items-center border-t pt-2">
                                <span className="text-gray-800 font-semibold">
                                  Harga Setelah Diskon:
                                </span>
                                <span className="text-green-600 font-bold text-xl">
                                  Rp. {discountedPrice.toLocaleString('id-ID')}
                                </span>
                              </div>
                            </>
                          )}
                      </div>
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Katalog:</strong> {selectedProduct.kategori} |{' '}
                        <strong>Kategori:</strong> {selectedProduct.katalog}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full text-white font-semibold py-3 px-4 hover:opacity-90 transition-opacity"
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

export default KelolaPromosi;
