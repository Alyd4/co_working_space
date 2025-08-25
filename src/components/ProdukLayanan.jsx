import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiUploadCloud, FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

function ProdukLayanan() {
  const [activeComponent, setActiveComponent] = useState("ProdukLayananList");
  
  // State untuk list produk
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  
  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // add, edit, detail
  
  // State untuk form
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Produk");
  const [catalog, setCatalog] = useState("Satuan");
  const [fitur, setFitur] = useState("");
  const [keunggulan, setKeunggulan] = useState("");
  const [description, setDescription] = useState("");
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
      console.error("Error fetching data:", error);
      toast.error("Error fetching data");
    }
  };

  // Handler untuk file gambar
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newImagePreview = [...imagePreview];
      newImagePreview[index] = URL.createObjectURL(file);
      setImagePreview(newImagePreview);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nama", itemName);
      formData.append("deskripsi", description);
      formData.append("harga", price);
      formData.append("fitur", fitur);
      formData.append("kategori", category);
      formData.append("katalog", catalog);
      formData.append("keunggulan", keunggulan);
      
      // Tambahkan gambar jika ada
      images.forEach((image, index) => {
        if (image) {
          formData.append(`gambar${index + 1}`, image);
        }
      });

      if (modalType === "add") {
        await axios.post(`${apiUrl}/api/item`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success("Item berhasil ditambahkan!");
      } else if (modalType === "edit" && selectedItem) {
        await axios.put(`${apiUrl}/api/item/${selectedItem.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success("Item berhasil diupdate!");
      }

      // Reset form dan tutup modal
      resetForm();
      setIsModalOpen(false);
      fetchItems(); // Refresh data
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error:", error);
    }
  };

  // Handler untuk edit item
  const handleEdit = (item) => {
    setModalType("edit");
    setSelectedItem(item);
    setItemName(item.nama);
    setPrice(item.harga);
    setCategory(item.kategori);
    setCatalog(item.katalog || "Satuan");
    setFitur(item.fitur || "");
    setKeunggulan(item.keunggulan || "");
    setDescription(item.deskripsi);
    
    // Set image previews if available
    if (item.gambarUrl) {
      setImagePreview([item.gambarUrl, null, null]);
    }
    
    setIsModalOpen(true);
  };

  // Handler untuk hapus item
  const handleDelete = async (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus item ini?")) {
      try {
        await axios.delete(`${apiUrl}/api/item/${id}`);
        toast.success("Item berhasil dihapus!");
        fetchItems(); // Refresh data
      } catch (error) {
        toast.error("Error deleting item");
        console.error("Error:", error);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setItemName("");
    setPrice("");
    setCategory("Produk");
    setCatalog("Satuan");
    setFitur("");
    setKeunggulan("");
    setDescription("");
    setImages([null, null, null]);
    setImagePreview([null, null, null]);
    setSelectedItem(null);
  };

  // Handler untuk membuka modal tambah item
  const handleAddModal = () => {
    resetForm();
    setModalType("add");
    setIsModalOpen(true);
  };

  // Format currency IDR
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Render the appropriate component based on activeComponent
  const renderComponent = () => {
    if (activeComponent === "ProdukLayananList") {
      return (
        <div className="h-screen bg-gray-50 w-full">
          <ToastContainer />
          
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Data Produk dan Layanan</h1>
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
                onClick={handleAddModal}
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
                    <th className="py-3 px-4 text-left">No</th>
                    <th className="py-3 px-4 text-left">Gambar</th>
                    <th className="py-3 px-4 text-left">Nama Pesanan</th>
                    <th className="py-3 px-4 text-left">Katalog</th>
                    <th className="py-3 px-4 text-left">Kategori</th>
                    <th className="py-3 px-4 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        {item.gambarUrl ? (
                          <img src={item.gambarUrl} alt={item.nama} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded"></div>
                        )}
                      </td>
                      <td className="py-3 px-4">{item.nama}</td>
                      <td className="py-3 px-4">{item.katalog || "Satuan"}</td>
                      <td className="py-3 px-4">{item.kategori}</td>
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
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i}
                      className={`px-3 py-1 rounded-md mx-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  {totalPages > 5 && <span className="mx-1">...</span>}
                  
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
          
          {/* Modal Tambah/Edit Item */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {modalType === "add" ? "Tambah Produk / Layanan" : "Edit Produk / Layanan"}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)}>
                    <IoClose size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Tambah gambar</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="border-2 border-dashed border-blue-300 rounded-lg p-4 h-40 flex flex-col items-center justify-center cursor-pointer">
                          <input 
                            type="file" 
                            id={`image-${index}`} 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, index)} 
                          />
                          <label htmlFor={`image-${index}`} className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                            {imagePreview[index] ? (
                              <img src={imagePreview[index]} alt="Preview" className="max-h-full object-contain" />
                            ) : (
                              <>
                                <FiUploadCloud size={24} />
                                <p className="text-sm text-gray-500 text-center mt-2">Click to browse or<br />drag and drop your files</p>
                              </>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Nama Pesanan</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama Produk / Layanan"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Harga</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Harga"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Kategori</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="Produk">Produk</option>
                        <option value="Layanan">Layanan</option>
                        <option value="Paket">Paket</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Katalog</label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={catalog}
                      onChange={(e) => setCatalog(e.target.value)}
                    >
                      <option value="Satuan">Satuan</option>
                      <option value="Paket">Paket</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Fitur</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Fitur produk/layanan"
                        value={fitur}
                        onChange={(e) => setFitur(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Keunggulan</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Keunggulan produk/layanan"
                        value={keunggulan}
                        onChange={(e) => setKeunggulan(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Keterangan</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder="Deskripsi"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
      );
    } else {
      // Placeholder for other components
      return <div className="p-4">Component {activeComponent} belum diimplementasikan</div>;
    }
  };

  return (
    <div className="flex">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="flex-1 overflow-auto">
        {renderComponent()}
      </div>
    </div>
  );
}

export default ProdukLayanan;