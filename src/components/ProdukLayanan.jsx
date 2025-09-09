import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiUploadCloud, FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import Header from './Headeradmin';
function ProdukLayanan() {
  // State untuk list produk
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // add, edit, detail

  // State untuk form
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Produk');
  const [catalog, setCatalog] = useState('Satuan');
  const [deskripsi, setDeskripsi] = useState('');
  const [fitur, setFitur] = useState('');
  const [keunggulan, setKeunggulan] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([null, null, null]);
  const [imagePreview, setImagePreview] = useState([null, null, null]);
  const [selectedItem, setSelectedItem] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch data ketika komponen dimuat
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/item/`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    }
  };

  // Handler untuk file gambar
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newImagePreview = [...imagePreview];
      newImagePreview[index] = URL.createObjectURL(file);
      setImagePreview(newImagePreview);
    } else {
      toast.error('Please upload a valid image file.');
    }
  };

  // Handler untuk submit form
  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nama', itemName);
      formData.append('deskripsi', deskripsi);
      formData.append('harga', price);
      formData.append('fitur', fitur);
      formData.append('kategori', category);
      formData.append('katalog', catalog);
      formData.append('keunggulan', keunggulan);
      formData.append('keterangan', description);

      // Tambahkan gambar jika ada (backend hanya menerima 1 gambar dengan nama 'gambar')
      if (images[0]) {
        formData.append('gambar', images[0]);
      }

      if (modalType === 'add') {
        await axios.post(`${apiUrl}/api/item`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Item berhasil ditambahkan!');
      } else if (modalType === 'edit' && selectedItem) {
        await axios.put(`${apiUrl}/api/item/${selectedItem.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Item berhasil diupdate!');
      }

      // Reset form dan tutup modal
      resetForm();
      setIsModalOpen(false);
      fetchItems(); // Refresh data
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error('Error:', error);
    }
  };

  // Helper function to convert JSON array back to comma-separated string
  const convertJsonToString = jsonData => {
    if (!jsonData) return '';

    try {
      // If it's already a string, return as is
      if (typeof jsonData === 'string') {
        // Try to parse it as JSON first
        try {
          const parsed = JSON.parse(jsonData);
          return Array.isArray(parsed) ? parsed.join(', ') : jsonData;
        } catch {
          return jsonData;
        }
      }

      // If it's an array, join with commas
      if (Array.isArray(jsonData)) {
        return jsonData.join(', ');
      }

      return jsonData.toString();
    } catch (error) {
      console.error('Error converting JSON to string:', error);
      return '';
    }
  };

  // Handler untuk edit item
  const handleEdit = item => {
    setModalType('edit');
    setSelectedItem(item);
    setItemName(item.nama);
    setPrice(item.harga);
    setCategory(item.kategori);
    setCatalog(item.katalog || 'Satuan');
    setDeskripsi(item.deskripsi || '');

    // Convert JSON arrays back to comma-separated strings for editing
    setFitur(convertJsonToString(item.fitur));
    setKeunggulan(convertJsonToString(item.keunggulan));
    setDescription(convertJsonToString(item.keterangan));

    // Set image previews if available
    if (item.gambarUrl) {
      setImagePreview([item.gambarUrl, null, null]);
    }

    setIsModalOpen(true);
  };

  // Handler untuk hapus item
  const handleDelete = async id => {
    if (window.confirm('Apakah anda yakin ingin menghapus item ini?')) {
      try {
        await axios.delete(`${apiUrl}/api/item/${id}`);
        toast.success('Item berhasil dihapus!');
        fetchItems(); // Refresh data
      } catch (error) {
        toast.error('Error deleting item');
        console.error('Error:', error);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setItemName('');
    setPrice('');
    setCategory('Produk');
    setCatalog('Satuan');
    setDeskripsi('');
    setFitur('');
    setKeunggulan('');
    setDescription('');
    setImages([null, null, null]);
    setImagePreview([null, null, null]);
    setSelectedItem(null);
  };

  // Handler untuk membuka modal tambah item
  const handleAddModal = () => {
    resetForm();
    setModalType('add');
    setIsModalOpen(true);
  };

  // Format currency IDR
  const formatCurrency = value => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);
  };

  // Pagination handlers
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  // Render the ProdukLayanan component
  const renderComponent = () => {
    return (
      <div className="flex flex-col bg-white">
        <ToastContainer />

        {/* Header dengan Logout */}
        <div className="w-full bg-black mb-6">
          <Header />
        </div>

        <div className="h-screen bg-white w-full">
          {/* Content Header */}
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Data Produk dan Layanan</h1>
            <div className="flex space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari data produk/layanan..."
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
              <button
                onClick={handleAddModal}
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
                      No
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
                <tbody style={{ opacity: '0.8' }}>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 text-center text-gray-500"
                      >
                        Tidak ada data produk/layanan
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 px-4 text-center">{index + 1}</td>
                        <td className="py-3 px-4 text-center">
                          {item.gambarUrl ? (
                            <img
                              src={item.gambarUrl}
                              alt={item.nama}
                              className="w-8 h-8 rounded-full mx-auto object-cover"
                              onError={e => {
                                e.target.src =
                                  'https://via.placeholder.com/32x32?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                              <span className="text-xs text-gray-500">No</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">{item.nama}</td>
                        <td className="py-3 px-4 text-center">
                          {item.katalog || 'Satuan'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.kategori}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex space-x-2 justify-center">
                            <button
                              className="text-green-500 hover:text-green-700"
                              title="Lihat"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              title="Edit"
                              onClick={() => handleEdit(item)}
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              title="Hapus"
                              onClick={() => handleDelete(item.id)}
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
                      backgroundColor: '#F5F5F5',
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
                      backgroundColor: '#F5F5F5',
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
                      backgroundColor: '#F5F5F5',
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
                      backgroundColor: '#F5F5F5',
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
                      backgroundColor: '#F5F5F5',
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

          {/* Modal Tambah/Edit Item */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {modalType === 'add'
                      ? 'Tambah Produk / Layanan'
                      : 'Edit Produk / Layanan'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)}>
                    <IoClose size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Tambah gambar
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[0, 1, 2].map(index => (
                        <div
                          key={index}
                          className="border-2 border-dashed border-blue-300 rounded-lg p-4 h-40 flex flex-col items-center justify-center cursor-pointer"
                        >
                          <input
                            type="file"
                            id={`image-${index}`}
                            className="hidden"
                            accept="image/*"
                            onChange={e => handleFileChange(e, index)}
                          />
                          <label
                            htmlFor={`image-${index}`}
                            className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                          >
                            {imagePreview[index] ? (
                              <img
                                src={imagePreview[index]}
                                alt="Preview"
                                className="max-h-full object-contain"
                              />
                            ) : (
                              <>
                                <FiUploadCloud size={24} />
                                <p className="text-sm text-gray-500 text-center mt-2">
                                  Click to browse or
                                  <br />
                                  drag and drop your files
                                </p>
                              </>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Nama Pesanan
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama Produk / Layanan"
                      value={itemName}
                      onChange={e => setItemName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Harga
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Harga"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Kategori
                      </label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                      >
                        <option value="Produk">Produk</option>
                        <option value="Layanan">Layanan</option>
                        <option value="Paket">Paket</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Katalog
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={catalog}
                      onChange={e => setCatalog(e.target.value)}
                    >
                      <option value="Satuan">Satuan</option>
                      <option value="Paket">Paket</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                      placeholder="Deskripsi singkat produk/layanan"
                      value={deskripsi}
                      onChange={e => setDeskripsi(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Fitur
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: WiFi gratis, AC, Proyektor (pisahkan dengan koma untuk bullet point)"
                        value={fitur}
                        onChange={e => setFitur(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Keunggulan
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: Berkualitas tinggi, Harga terjangkau, Pelayanan cepat (pisahkan dengan koma)"
                        value={keunggulan}
                        onChange={e => setKeunggulan(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Keterangan
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder="Contoh: Mudah digunakan, Support 24/7, Garansi 1 tahun (pisahkan dengan koma untuk bullet point)"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
                  >
                    Tambah
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderComponent();
}

export default ProdukLayanan;
